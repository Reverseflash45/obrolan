import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import { grupDari, nomorKartu, TOPIK_PER_ID, type Pertanyaan, type Topik } from "../lib/jenis";
import { warnaKartu } from "../lib/tema";

// Pola gelombang halus di atas warna solid, seperti cetakan kartu fisik.
function Gelombang({ idUnik }: { idUnik: string }) {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 155 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <radialGradient id={`kilau-${idUnik}`} cx="18%" cy="8%" r="75%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`bayang-${idUnik}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.16" />
        </linearGradient>
      </defs>
      <rect width="155" height="100" fill={`url(#kilau-${idUnik})`} />
      <path d="M0 28 C 30 14, 55 40, 85 26 S 135 10, 155 22 L155 0 L0 0Z" fill="#fff" opacity="0.07" />
      <path d="M0 64 C 28 52, 58 78, 92 64 S 138 50, 155 60 L155 100 L0 100Z" fill={`url(#bayang-${idUnik})`} />
      <path d="M0 78 C 34 68, 62 92, 98 80 S 140 70, 155 76 L155 100 L0 100Z" fill="#000" opacity="0.06" />
      <path d="M0 46 C 40 36, 70 58, 110 46 S 150 38, 155 42" fill="none" stroke="#fff" strokeOpacity="0.09" strokeWidth="0.6" />
    </svg>
  );
}

function Bingkai({ topik, children, gaya }: { topik: Topik; children: React.ReactNode; gaya?: CSSProperties }) {
  return (
    <div className="absolute inset-0 rounded-[6cqw] bg-bingkai p-[2.4cqw] shadow-[0_18px_40px_-14px_rgb(0_0_0/0.55),0_2px_0_rgb(0_0_0/0.12)]" style={gaya}>
      <div className="relative h-full w-full overflow-hidden rounded-[4cqw]" style={{ background: warnaKartu(topik) }}>
        <Gelombang idUnik={topik.id} />
        {children}
      </div>
    </div>
  );
}

function ukuranTeks(teks: string) {
  // makin panjang makin kecil, tapi tidak pernah di bawah 24px
  const n = teks.length;
  const cqw = n <= 45 ? 8.4 : n <= 70 ? 7.4 : n <= 95 ? 6.6 : 6;
  return `clamp(24px, ${cqw}cqw, 46px)`;
}

export function MukaDepan({ q, topik, gaya }: { q: Pertanyaan; topik: Topik; gaya?: CSSProperties }) {
  const grup = grupDari(topik.grup);
  return (
    <Bingkai topik={topik} gaya={gaya}>
      <div className="relative flex h-full flex-col px-[6cqw] pb-[3.6cqw] pt-[4cqw] text-ktinta">
        <span className="kartu-teks self-end text-[max(16px,3.8cqw)] opacity-90">No. {nomorKartu(q.id)}</span>
        <p className="kartu-teks flex flex-1 items-center justify-center text-center" style={{ fontSize: ukuranTeks(q.text) }}>
          {q.text}
        </p>
        <div className="h-px w-full bg-emas opacity-90" />
        <div className="kartu-teks mt-[1.8cqw] flex justify-between gap-2 text-[max(14px,3.2cqw)] tracking-wide opacity-90">
          <span>~ Obrolan ~</span>
          <span className="truncate">~ {grup.nama} ~</span>
        </div>
      </div>
    </Bingkai>
  );
}

export function MukaBelakang({ topik, gaya }: { topik: Topik; gaya?: CSSProperties }) {
  return (
    <Bingkai topik={topik} gaya={gaya}>
      <div className="absolute inset-[3.2cqw] rounded-[3cqw] border-[0.5cqw] border-dashed border-emas/80" />
      <div className="relative flex h-full flex-col items-center justify-center gap-[1.5cqw] text-ktinta">
        <span className="text-[9cqw] leading-none" aria-hidden="true">
          {topik.ikon}
        </span>
        <span className="judul-logo text-[11cqw] uppercase leading-none">Obrolan</span>
        <span className="kartu-teks text-[max(14px,3.8cqw)] opacity-90">~ {topik.nama} ~</span>
      </div>
    </Bingkai>
  );
}

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

/** Kartu terbuka tanpa animasi, untuk daftar favorit/riwayat & kartu hari ini */
export function KartuDiam({ q }: { q: Pertanyaan }) {
  const topik = TOPIK_PER_ID.get(q.topic)!;
  return (
    <div className="kartu-wadah w-full">
      <div className="relative aspect-[1.55] w-full" role="group" aria-label={`Kartu topik ${topik.nama}: ${q.text}`}>
        <MukaDepan q={q} topik={topik} />
      </div>
    </div>
  );
}
