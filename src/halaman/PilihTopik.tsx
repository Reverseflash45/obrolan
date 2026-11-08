import { useMemo, useState } from "react";
import { GRUP, JUMLAH, LEVEL, MODE, TIMER, type Level } from "../lib/jenis";
import { pergi } from "../lib/rute";
import { buatSesi, topikUntuk } from "../lib/sesi";
import { warnaKartu } from "../lib/tema";
import { useToko } from "../lib/toko";
import { Ikon } from "../komponen/Ikon";
import { Kepala, Layar, TombolKedua, TombolUtama } from "../komponen/Tombol";

export default function PilihTopik() {
  const { mode, pengaturan, ubahPengaturan, setSesi, sesi } = useToko();
  const m = mode ?? "pasangan";
  const tersedia = useMemo(() => topikUntuk(m, pengaturan.dewasa), [m, pengaturan.dewasa]);
  const [pilihan, setPilihan] = useState<string[]>(() =>
    sesi && sesi.mode === m ? sesi.topik.filter((id) => tersedia.some((t) => t.id === id)) : [],
  );
  const [memuat, setMemuat] = useState(false);
  const [galat, setGalat] = useState("");
  const level = pengaturan.level;

  const jumlahKartu = useMemo(
    () => pilihan.reduce((a, id) => a + level.reduce((b, l) => b + (JUMLAH[id]?.[l] ?? 0), 0), 0),
    [pilihan, level],
  );

  function tukar(id: string) {
    setPilihan((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }
  function tukarLevel(l: Level) {
    const baru = level.includes(l) ? level.filter((x) => x !== l) : [...level, l];
    if (baru.length) ubahPengaturan({ level: LEVEL.map((x) => x.id).filter((x) => baru.includes(x)) });
  }

  async function mulai(ids: string[]) {
    setMemuat(true);
    setGalat("");
    try {
      const s = await buatSesi(m, ids, level);
      if (!s.dek.length) {
        setGalat("Belum ada kartu untuk pilihan ini. Coba tambah level atau topik.");
        return;
      }
      setSesi(s);
      pergi("/main");
    } catch {
      setGalat("Kartu gagal dimuat. Periksa internet, lalu coba lagi.");
    } finally {
      setMemuat(false);
    }
  }

  const namaMode = MODE.find((x) => x.id === m)!;
  const tersembunyi18 = m === "pasangan" && !pengaturan.dewasa;

  return (
    <Layar className="pb-40">
      <Kepala induk="/mode" kanan={<span className="text-base text-redup">{namaMode.ikon} {namaMode.nama}</span>} />
      <h1 className="text-3xl font-semibold">Mau ngobrolin apa?</h1>
      <p className="mt-1 text-lg text-redup">Pilih satu atau beberapa topik.</p>

      <TombolKedua ikon="acak" className="mt-4 w-full" disabled={memuat} onClick={() => mulai(tersedia.map((t) => t.id))}>
        Acak Semua Topik
      </TombolKedua>

      {GRUP.map((g) => {
        const isi = tersedia.filter((t) => t.grup === g.id);
        if (!isi.length) return null;
        return (
          <section key={g.id} className="mt-7" aria-labelledby={`grup-${g.id}`}>
            <h2 id={`grup-${g.id}`} className="text-xl font-semibold">
              {g.nama}
            </h2>
            <p className="text-base text-redup">{g.ringkas}</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {isi.map((t) => {
                const aktif = pilihan.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={aktif}
                    onClick={() => tukar(t.id)}
                    className={`relative flex min-h-32 flex-col justify-between rounded-[22px] border-[5px] p-3 text-left text-ktinta transition active:scale-[0.98] ${
                      aktif ? "border-emas" : "border-bingkai"
                    }`}
                    style={{ background: warnaKartu(t) }}
                  >
                    <span className="text-4xl" aria-hidden="true">
                      {t.ikon}
                    </span>
                    <span>
                      <span className="block text-lg font-semibold leading-tight">{t.nama}</span>
                      <span className="block text-base opacity-90">{JUMLAH[t.id]?.total ?? 0} kartu</span>
                    </span>
                    <span
                      className={`absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full border-2 ${
                        aktif ? "border-emas bg-emas text-[#2a1a08]" : "border-current/50"
                      }`}
                      aria-hidden="true"
                    >
                      {aktif && <Ikon nama="centang" className="h-5 w-5" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      {tersembunyi18 && (
        <p className="mt-6 rounded-2xl border-2 border-dashed border-garis p-4 text-base text-redup">
          Topik 18+ disembunyikan. Kalau kalian berdua sudah dewasa, aktifkan di{" "}
          <button type="button" className="font-semibold text-tinta underline underline-offset-4" onClick={() => pergi("/pengaturan")}>
            Pengaturan
          </button>
          .
        </p>
      )}

      <section className="mt-8" aria-labelledby="judul-level">
        <h2 id="judul-level" className="text-xl font-semibold">
          Seberapa dalam?
        </h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {LEVEL.map((l) => {
            const aktif = level.includes(l.id);
            return (
              <button
                key={l.id}
                type="button"
                aria-pressed={aktif}
                onClick={() => tukarLevel(l.id)}
                className={`flex min-h-16 flex-col items-center justify-center rounded-2xl border-2 px-1 text-center transition ${
                  aktif ? "border-emas bg-permukaan text-ptinta" : "border-garis text-redup"
                }`}
              >
                <span className="flex items-center gap-1 text-lg font-semibold">
                  {aktif && <Ikon nama="centang" className="h-5 w-5" />}
                  {l.nama}
                </span>
                <span className="text-sm leading-tight">{l.ringkas}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-7" aria-labelledby="judul-timer">
        <h2 id="judul-timer" className="text-xl font-semibold">
          Waktu menjawab
        </h2>
        <div className="mt-3 grid grid-cols-4 gap-2" role="radiogroup" aria-labelledby="judul-timer">
          {TIMER.map((t) => {
            const aktif = pengaturan.timer === t.detik;
            return (
              <button
                key={t.detik}
                type="button"
                role="radio"
                aria-checked={aktif}
                onClick={() => ubahPengaturan({ timer: t.detik })}
                className={`min-h-14 rounded-2xl border-2 px-1 text-base font-semibold ${aktif ? "border-emas bg-permukaan text-ptinta" : "border-garis text-redup"}`}
              >
                {t.nama}
              </button>
            );
          })}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-garis bg-latar/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
        <div className="mx-auto max-w-xl">
          {galat && (
            <p role="alert" className="mb-2 text-center text-base font-medium">
              {galat}
            </p>
          )}
          <TombolUtama ikon="kartu" disabled={!pilihan.length || memuat} onClick={() => mulai(pilihan)}>
            {memuat ? "Mengocok kartu…" : pilihan.length ? `Tarik Kartu (${jumlahKartu})` : "Pilih topik dulu"}
          </TombolUtama>
        </div>
      </div>
    </Layar>
  );
}
