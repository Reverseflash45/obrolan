import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { muatBanyak } from "../lib/data";
import { LEVEL, TOPIK_PER_ID, type Pertanyaan } from "../lib/jenis";
import { pergi } from "../lib/rute";
import { buatSesi } from "../lib/sesi";
import { namaPemain, useToko } from "../lib/toko";
import { Kartu, MukaBelakang } from "../komponen/Kartu";
import { Ikon } from "../komponen/Ikon";
import { Timer } from "../komponen/Timer";
import { useBagikan } from "../komponen/Bagikan";
import { Kepala, Layar, TombolKedua, TombolUtama } from "../komponen/Tombol";

export default function Main() {
  const { sesi, setSesi, pemain, pengaturan, apakahFavorit, tukarFavorit } = useToko();
  const [peta, setPeta] = useState<Map<string, Pertanyaan> | null>(null);
  const [galat, setGalat] = useState(false);
  const [terbuka, setTerbuka] = useState(false);
  const [arah, setArah] = useState(1);
  const kurangiGerak = useReducedMotion();
  const { bagikan, panggung, pesan } = useBagikan();

  useEffect(() => {
    if (!sesi) pergi("/mode", true);
  }, [sesi]);

  const kunciTopik = sesi?.topik.join(",") ?? "";
  useEffect(() => {
    if (!kunciTopik) return;
    let batal = false;
    setGalat(false);
    muatBanyak(kunciTopik.split(","))
      .then((p) => !batal && setPeta(p))
      .catch(() => !batal && setGalat(true));
    return () => {
      batal = true;
    };
  }, [kunciTopik]);

  const id = sesi && sesi.posisi < sesi.dek.length ? sesi.dek[sesi.posisi] : null;
  const q = id && peta ? peta.get(id) ?? null : null;
  const selesai = !!sesi && sesi.posisi >= sesi.dek.length;
  const nama = useMemo(() => namaPemain(pemain), [pemain]);
  const adaGiliran = sesi?.mode !== "sendiri" && nama.length >= 2;
  const penanya = adaGiliran && sesi ? nama[sesi.giliran % nama.length] : "";
  const penjawab = adaGiliran && sesi ? nama[(sesi.giliran + 1) % nama.length] : "";

  const maju = useCallback(
    (status: "dijawab" | "dilewati") => {
      if (!id) return;
      setArah(status === "dijawab" ? 1 : -1);
      setTerbuka(false);
      setSesi((s) =>
        s
          ? {
              ...s,
              posisi: s.posisi + 1,
              giliran: status === "dijawab" ? s.giliran + 1 : s.giliran,
              riwayat: [...s.riwayat, { id, status }],
            }
          : s,
      );
    },
    [id, setSesi],
  );

  // pintasan papan ketik: spasi/enter buka, panah kanan lanjut, panah kiri lewati
  useEffect(() => {
    function tekan(e: KeyboardEvent) {
      if (!q || (e.target as HTMLElement)?.closest("input,textarea")) return;
      if (e.key === "ArrowRight") terbuka ? maju("dijawab") : setTerbuka(true);
      else if (e.key === "ArrowLeft") maju("dilewati");
    }
    window.addEventListener("keydown", tekan);
    return () => window.removeEventListener("keydown", tekan);
  }, [q, terbuka, maju]);

  function lepasGeser(_: unknown, info: PanInfo) {
    const x = info.offset.x;
    const v = info.velocity.x;
    if (x > 110 || v > 650) maju("dijawab");
    else if (x < -110 || v < -650) maju("dilewati");
  }

  async function kocokUlang() {
    if (!sesi) return;
    setSesi(await buatSesi(sesi.mode, sesi.topik, sesi.level));
  }

  if (!sesi) return null;

  const topik = q ? TOPIK_PER_ID.get(q.topic)! : TOPIK_PER_ID.get(sesi.topik[0])!;
  const sisa = sesi.dek.length - sesi.posisi;
  const kanan = (
    <button type="button" onClick={() => pergi("/riwayat")} className="flex min-h-12 items-center gap-1 rounded-xl px-2 text-lg font-medium text-redup hover:text-tinta">
      <Ikon nama="riwayat" />
      <span>Riwayat</span>
    </button>
  );

  if (selesai) {
    const dijawab = sesi.riwayat.filter((r) => r.status === "dijawab").length;
    return (
      <Layar>
        <Kepala induk="/topik" kanan={kanan} />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <span className="text-6xl" aria-hidden="true">
            🎉
          </span>
          <h1 className="text-3xl font-semibold">Semua kartu sudah keluar</h1>
          <p className="max-w-sm text-lg text-redup">
            Kalian sudah ngobrolin {dijawab} pertanyaan dan melewati {sesi.riwayat.length - dijawab}. Mau main lagi dari awal?
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <TombolUtama ikon="acak" onClick={kocokUlang}>
            Kocok Ulang
          </TombolUtama>
          <TombolKedua onClick={() => pergi("/topik")}>Pilih Topik Lain</TombolKedua>
        </div>
      </Layar>
    );
  }

  const varian = kurangiGerak
    ? { masuk: { opacity: 0 }, tengah: { opacity: 1 }, keluar: { opacity: 0 } }
    : {
        masuk: { opacity: 0, y: 46, scale: 0.92, rotate: -4 },
        tengah: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
        keluar: (a: number) => ({ opacity: 0, x: a > 0 ? 420 : -420, rotate: a > 0 ? 14 : -14, transition: { duration: 0.32 } }),
      };

  const favorit = q ? apakahFavorit(q.id) : false;
  const level = q ? LEVEL.find((l) => l.id === q.level)!.nama : "";

  return (
    <Layar>
      <Kepala induk="/topik" kanan={kanan} />

      <div className="text-center">
        {adaGiliran ? (
          <h1 className="text-2xl font-semibold leading-snug">
            Giliran <span className="text-emas">{penanya}</span> bertanya
            <span className="block text-lg font-normal text-redup">{penjawab} menjawab duluan</span>
          </h1>
        ) : (
          <h1 className="text-2xl font-semibold leading-snug">
            Jawab dengan jujur
            <span className="block text-lg font-normal text-redup">Boleh dalam hati, boleh ditulis</span>
          </h1>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-center py-2">
      <p className="flex items-center justify-between text-base text-redup">
        <span>
          {topik.ikon} {topik.nama}
          {level && ` · ${level}`}
        </span>
        <span className="tabular-nums">
          Kartu {sesi.posisi + 1} dari {sesi.dek.length}
        </span>
      </p>

      <div className="relative mt-3 grid">
        {/* tumpukan kartu tersisa di belakang */}
        {sisa > 1 && (
          <div className="kartu-wadah pointer-events-none [grid-area:1/1]" aria-hidden="true" style={{ transform: "translate(8px, 10px) rotate(2.5deg)" }}>
            <div className="relative aspect-[1.55] w-full opacity-80">
              <MukaBelakang topik={topik} />
            </div>
          </div>
        )}
        {sisa > 2 && (
          <div className="kartu-wadah pointer-events-none [grid-area:1/1]" aria-hidden="true" style={{ transform: "translate(-6px, 5px) rotate(-1.5deg)" }}>
            <div className="relative aspect-[1.55] w-full opacity-90">
              <MukaBelakang topik={topik} />
            </div>
          </div>
        )}
        <AnimatePresence initial={false} custom={arah}>
          {q ? (
            <motion.div
              key={q.id}
              className="relative z-[1] touch-pan-y [grid-area:1/1]"
              custom={arah}
              variants={varian}
              initial="masuk"
              animate="tengah"
              exit="keluar"
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              drag={terbuka ? "x" : false}
              dragSnapToOrigin
              dragElastic={0.6}
              onDragEnd={lepasGeser}
            >
              <Kartu q={q} terbuka={terbuka} onKetuk={() => setTerbuka(true)} />
            </motion.div>
          ) : (
            <div key="memuat" className="kartu-wadah [grid-area:1/1]">
              <div className="grid aspect-[1.55] w-full place-items-center rounded-[6cqw] border-2 border-dashed border-garis text-lg text-redup">
                {galat ? "Kartu gagal dimuat. Periksa internet." : "Mengocok kartu…"}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-4 min-h-7 text-center text-base text-redup" aria-live="polite">
        {pesan || (terbuka ? "Geser kartu ke kanan untuk lanjut, ke kiri untuk lewati" : "Ketuk kartu untuk membukanya")}
      </p>

      {pengaturan.timer > 0 && q && (
        <div className="mt-2">
          <Timer detik={pengaturan.timer} jalan={terbuka} kunci={q.id} />
        </div>
      )}
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-5">
        <div className="grid grid-cols-3 gap-2">
          <TombolKedua ikon="lewati" disabled={!q} onClick={() => maju("dilewati")}>
            Lewati
          </TombolKedua>
          <TombolKedua
            ikon="hati"
            ikonIsi={favorit}
            disabled={!q || !terbuka}
            aria-pressed={favorit}
            onClick={() => q && tukarFavorit(q)}
            className={favorit ? "border-emas text-emas" : ""}
          >
            {favorit ? "Disimpan" : "Simpan"}
          </TombolKedua>
          <TombolKedua ikon="bagikan" disabled={!q || !terbuka} onClick={() => q && bagikan(q)}>
            Bagikan
          </TombolKedua>
        </div>
        {terbuka ? (
          <TombolUtama ikon="lanjut" onClick={() => maju("dijawab")} disabled={!q}>
            Kartu Berikutnya
          </TombolUtama>
        ) : (
          <TombolUtama ikon="kartu" onClick={() => setTerbuka(true)} disabled={!q}>
            Buka Kartu
          </TombolUtama>
        )}
      </div>
      {panggung}
    </Layar>
  );
}
