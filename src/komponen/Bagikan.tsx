import { useCallback, useEffect, useRef, useState } from "react";
import { toBlob } from "html-to-image";
import { TOPIK_PER_ID, type Pertanyaan } from "../lib/jenis";
import { MukaDepan } from "./Kartu";

// Gambar 1080×1920 (ukuran story Instagram) berisi kartu, digambar di luar layar lalu diubah jadi PNG.
function Panggung({ q }: { q: Pertanyaan }) {
  const topik = TOPIK_PER_ID.get(q.topic)!;
  return (
    <div
      style={{ width: 1080, height: 1920, background: "var(--latar-gambar, var(--latar))", backgroundColor: "var(--latar)", color: "var(--tinta)" }}
      className="flex flex-col items-center justify-between px-[70px] py-[150px] font-ui"
    >
      <div className="text-center">
        <div className="judul-logo text-[120px] uppercase leading-none">Obrolan</div>
        <div className="mt-6 text-[40px] opacity-85">
          {topik.ikon} {topik.nama}
        </div>
      </div>
      <div className="kartu-wadah w-[940px]" style={{ transform: "rotate(-2deg)" }}>
        <div className="relative aspect-[1.55] w-full">
          <MukaDepan q={q} topik={topik} />
        </div>
      </div>
      <div className="text-center">
        <div className="text-[52px] font-semibold">Jawab versi kamu 👇</div>
        <div className="mt-5 text-[34px] opacity-80">kartu obrolan · {location.host}</div>
      </div>
    </div>
  );
}

export type StatusBagikan = "" | "membuat" | "dibagikan" | "diunduh" | "gagal";

/** Hook: panggil `bagikan(q)`, lalu render `panggung` di mana saja (posisinya di luar layar). */
export function useBagikan() {
  const [q, setQ] = useState<Pertanyaan | null>(null);
  const [status, setStatus] = useState<StatusBagikan>("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!q || !ref.current) return;
    let batal = false;
    (async () => {
      try {
        await document.fonts.ready;
        const blob = await toBlob(ref.current!, { width: 1080, height: 1920, pixelRatio: 1, cacheBust: false });
        if (!blob || batal) throw new Error("kosong");
        const nama = `obrolan-${q.id}.png`;
        const file = new File([blob], nama, { type: "image/png" });
        if (navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({ files: [file], title: "Kartu Obrolan" });
            setStatus("dibagikan");
          } catch (e) {
            // dibatalkan pengguna: bukan galat
            setStatus((e as Error).name === "AbortError" ? "" : "gagal");
          }
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = nama;
          a.click();
          setTimeout(() => URL.revokeObjectURL(url), 4000);
          setStatus("diunduh");
        }
      } catch {
        if (!batal) setStatus("gagal");
      } finally {
        if (!batal) setQ(null);
      }
    })();
    return () => {
      batal = true;
    };
  }, [q]);

  useEffect(() => {
    if (status === "dibagikan" || status === "diunduh" || status === "gagal") {
      const t = setTimeout(() => setStatus(""), 3500);
      return () => clearTimeout(t);
    }
  }, [status]);

  const bagikan = useCallback((x: Pertanyaan) => {
    setStatus("membuat");
    setQ(x);
  }, []);

  const panggung = q ? (
    <div aria-hidden="true" style={{ position: "fixed", left: -30000, top: 0, pointerEvents: "none" }}>
      <div ref={ref}>
        <Panggung q={q} />
      </div>
    </div>
  ) : null;

  const pesan =
    status === "membuat" ? "Menyiapkan gambar…" : status === "dibagikan" ? "Kartu dibagikan." : status === "diunduh" ? "Gambar kartu tersimpan di unduhan." : status === "gagal" ? "Gambar gagal dibuat. Coba lagi." : "";

  return { bagikan, panggung, status, pesan };
}
