import { motion, useReducedMotion } from "framer-motion";
import { nomorKartu, TOPIK_PER_ID, type Pertanyaan } from "../lib/jenis";
import { MukaBelakang, MukaDepan } from "./Muka";

/**
 * Kartu besar yang bisa dibalik. `terbuka=false` menampilkan punggung kartu.
 * Saat "reduce motion" aktif, kartu langsung berganti tanpa animasi putar.
 */
export function Kartu({ q, terbuka, onKetuk }: { q: Pertanyaan; terbuka: boolean; onKetuk?: () => void }) {
  const kurangiGerak = useReducedMotion();
  const topik = TOPIK_PER_ID.get(q.topic)!;
  const label = terbuka ? `Kartu nomor ${nomorKartu(q.id)}, topik ${topik.nama}: ${q.text}` : `Kartu tertutup, topik ${topik.nama}. Ketuk untuk membuka`;

  const isi = kurangiGerak ? (
    <div className="relative aspect-[1.55] w-full">{terbuka ? <MukaDepan q={q} topik={topik} /> : <MukaBelakang topik={topik} />}</div>
  ) : (
    <motion.div
      className="relative aspect-[1.55] w-full"
      style={{ transformStyle: "preserve-3d" }}
      initial={false}
      animate={{ rotateY: terbuka ? 0 : 180 }}
      transition={{ type: "spring", stiffness: 140, damping: 18 }}
    >
      <div className="sisi-belakang-tersembunyi absolute inset-0">
        <MukaDepan q={q} topik={topik} />
      </div>
      <div className="sisi-belakang-tersembunyi absolute inset-0" style={{ transform: "rotateY(180deg)" }}>
        <MukaBelakang topik={topik} />
      </div>
    </motion.div>
  );

  return (
    <div className="kartu-wadah w-full" style={{ perspective: 1400 }}>
      {onKetuk && !terbuka ? (
        <button type="button" onClick={onKetuk} className="block w-full rounded-[6cqw] text-left" aria-label={label}>
          {isi}
        </button>
      ) : (
        <div role="group" aria-label={label}>
          {isi}
        </div>
      )}
    </div>
  );
}
