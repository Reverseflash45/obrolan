import { useEffect, useState } from "react";
import { Ikon } from "./Ikon";

/** Hitung mundur per kartu. Berjalan setelah kartu dibuka; `kunci` baru = mulai ulang. */
export function Timer({ detik, jalan, kunci }: { detik: number; jalan: boolean; kunci: string }) {
  const [sisa, setSisa] = useState(detik);
  const [jeda, setJeda] = useState(false);

  useEffect(() => {
    setSisa(detik);
    setJeda(false);
  }, [kunci, detik]);

  useEffect(() => {
    if (!jalan || jeda || sisa <= 0) return;
    const t = setTimeout(() => setSisa((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [jalan, jeda, sisa]);

  useEffect(() => {
    if (sisa === 0 && jalan) navigator.vibrate?.([160, 80, 160]);
  }, [sisa, jalan]);

  const habis = sisa <= 0;
  const teks = `${Math.floor(Math.max(sisa, 0) / 60)}:${String(Math.max(sisa, 0) % 60).padStart(2, "0")}`;

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-garis" aria-hidden="true">
        <div className="absolute inset-y-0 left-0 rounded-full bg-emas transition-[width] duration-1000 ease-linear" style={{ width: `${(Math.max(sisa, 0) / detik) * 100}%` }} />
      </div>
      <span className="min-w-[7.5rem] text-right text-lg font-semibold tabular-nums" role="timer" aria-live={habis ? "polite" : "off"}>
        {habis ? "Waktu habis" : jalan ? teks : `${teks} siap`}
      </span>
      {jalan && !habis ? (
        <button type="button" onClick={() => setJeda(!jeda)} className="flex min-h-12 items-center gap-1 rounded-xl border-2 border-garis px-3 text-base font-medium">
          <Ikon nama={jeda ? "putar" : "jeda"} isi={jeda} className="h-5 w-5" />
          <span>{jeda ? "Lanjut" : "Jeda"}</span>
        </button>
      ) : habis ? (
        <button type="button" onClick={() => setSisa(detik)} className="flex min-h-12 items-center gap-1 rounded-xl border-2 border-garis px-3 text-base font-medium">
          <Ikon nama="ulang" className="h-5 w-5" />
          <span>Ulang</span>
        </button>
      ) : null}
    </div>
  );
}
