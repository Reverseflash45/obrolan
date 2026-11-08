import { useState } from "react";
import { TIMER } from "../lib/jenis";
import { TEMA } from "../lib/tema";
import { useToko } from "../lib/toko";
import { Ikon } from "../komponen/Ikon";
import { Kepala, Layar, TombolKedua } from "../komponen/Tombol";

export default function Pengaturan() {
  const { pengaturan, ubahPengaturan } = useToko();
  const [tanya18, setTanya18] = useState(false);

  return (
    <Layar>
      <Kepala induk="/" />
      <h1 className="text-3xl font-semibold">Pengaturan</h1>

      <section className="mt-6" aria-labelledby="judul-tema">
        <h2 id="judul-tema" className="text-xl font-semibold">
          Tema warna
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3" role="radiogroup" aria-labelledby="judul-tema">
          {TEMA.map((t) => {
            const aktif = pengaturan.tema === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={aktif}
                onClick={() => ubahPengaturan({ tema: t.id })}
                className={`flex min-h-24 items-center gap-3 rounded-2xl border-[3px] bg-permukaan p-3 text-left text-ptinta ${aktif ? "border-emas" : "border-transparent"}`}
              >
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl" style={{ background: t.contoh[0] }} aria-hidden="true">
                  <span className="absolute left-2 top-3 h-8 w-11 rounded-md border-[3px] border-white" style={{ background: t.contoh[1], transform: "rotate(-8deg)" }} />
                  <span className="absolute bottom-1.5 right-1.5 h-3 w-3 rounded-full" style={{ background: t.contoh[2] }} />
                </span>
                <span className="min-w-0">
                  <span className="block text-lg font-semibold leading-tight">{t.nama}</span>
                  <span className="block text-sm leading-snug text-predup">{t.ringkas}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-8" aria-labelledby="judul-timer2">
        <h2 id="judul-timer2" className="text-xl font-semibold">
          Waktu menjawab per kartu
        </h2>
        <div className="mt-3 grid grid-cols-4 gap-2" role="radiogroup" aria-labelledby="judul-timer2">
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

      <section className="mt-8" aria-labelledby="judul-18">
        <h2 id="judul-18" className="text-xl font-semibold">
          Topik 18+
        </h2>
        <p className="text-base text-redup">Pertanyaan soal keintiman pasangan dewasa. Tidak vulgar, fokus ke keinginan, kenyamanan, dan batasan. Hanya muncul di mode Berpasangan.</p>
        {pengaturan.dewasa ? (
          <div className="mt-3 flex flex-col gap-2">
            <p className="flex items-center gap-2 text-lg font-medium">
              <Ikon nama="centang" className="h-6 w-6 text-emas" />
              Topik 18+ sedang ditampilkan
            </p>
            <TombolKedua className="w-full" onClick={() => ubahPengaturan({ dewasa: false })}>
              Sembunyikan lagi
            </TombolKedua>
          </div>
        ) : tanya18 ? (
          <div className="mt-3 rounded-2xl border-2 border-emas p-4">
            <p className="text-lg font-medium">Apakah kamu dan pasanganmu sudah berusia 18 tahun ke atas?</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <TombolKedua onClick={() => setTanya18(false)}>Belum</TombolKedua>
              <TombolKedua
                ikon="centang"
                className="border-emas"
                onClick={() => {
                  ubahPengaturan({ dewasa: true });
                  setTanya18(false);
                }}
              >
                Ya, sudah 18+
              </TombolKedua>
            </div>
          </div>
        ) : (
          <TombolKedua className="mt-3 w-full" onClick={() => setTanya18(true)}>
            Tampilkan topik 18+
          </TombolKedua>
        )}
      </section>

      <section className="mt-10 border-t border-garis pt-5 text-base text-redup">
        <p>Semua data (favorit, riwayat, pengaturan) cuma disimpan di HP ini. Tidak ada akun, tidak ada iklan.</p>
        <p className="mt-2">Bisa dipasang ke layar utama HP lewat menu browser → “Tambahkan ke Layar Utama”, lalu bisa dipakai tanpa internet.</p>
      </section>
    </Layar>
  );
}
