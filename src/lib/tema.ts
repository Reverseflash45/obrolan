import type { GrupId, Topik } from "./jenis";
import { TOPIK } from "./jenis";

export type TemaId = "merah" | "pastel" | "malam" | "senja" | "hutan" | "retro";

export interface Tema {
  id: TemaId;
  nama: string;
  ringkas: string;
  /** warna status bar HP */
  warnaBar: string;
  /** pratinjau di pengaturan: latar, kartu, aksen */
  contoh: [string, string, string];
}

export const TEMA: Tema[] = [
  { id: "merah", nama: "Merah Klasik", ringkas: "Kayak kartu aslinya", warnaBar: "#5e0d18", contoh: ["#5e0d18", "#a3172b", "#d9b25f"] },
  { id: "pastel", nama: "Pastel Lembut", ringkas: "Pink, lilac, krem", warnaBar: "#fbf0ec", contoh: ["#fbf0ec", "#f2c9d9", "#7b4fae"] },
  { id: "malam", nama: "Malam", ringkas: "Gelap, enak di mata", warnaBar: "#0c1430", contoh: ["#0c1430", "#23346e", "#e2bd5b"] },
  { id: "senja", nama: "Senja", ringkas: "Oranye ke ungu", warnaBar: "#a4380f", contoh: ["#a4380f", "#5a2380", "#ffcf7a"] },
  { id: "hutan", nama: "Hutan", ringkas: "Hijau tua, krem", warnaBar: "#1d3528", contoh: ["#1d3528", "#3f6b4a", "#efe5c8"] },
  { id: "retro", nama: "Retro", ringkas: "Mustard, cokelat, jadul", warnaBar: "#e0a12c", contoh: ["#e0a12c", "#8a3b12", "#3b2213"] },
];

// Rona dasar (derajat OKLCH) tiap grup topik. Kecerahan & kepekatan kartu diatur tema lewat CSS
// (--kartu-l, --kartu-c, --kartu-geser), jadi topik tetap bisa dibedakan di tema mana pun.
const RONA_GRUP: Record<GrupId, number> = {
  pasangan: 30,
  intim: 352,
  seru: 258,
  teman: 192,
  keluarga: 138,
  diri: 300,
};

// Topik dalam satu grup tetap satu keluarga warna, tapi beda sedikit rona & terang supaya bisa dibedakan.
// hanya ke arah lebih gelap di tema gelap (kontras teks putih tetap ≥ 4,5:1); tema pastel membaliknya lewat --kartu-arah
const TERANG = [0, -0.05, -0.025, -0.04, -0.01, -0.055, -0.03];
const ronaTopik = new Map<string, { h: number; l: number }>();
for (const g of Object.keys(RONA_GRUP) as GrupId[]) {
  const isi = TOPIK.filter((t) => t.grup === g);
  const langkah = isi.length > 8 ? 2.2 : 5;
  isi.forEach((t, i) => ronaTopik.set(t.id, { h: RONA_GRUP[g] + (i - (isi.length - 1) / 2) * langkah, l: TERANG[i % TERANG.length] }));
}

/** Warna kartu satu topik, mengikuti tema aktif lewat variabel CSS */
export function warnaKartu(topik: Pick<Topik, "id">) {
  const { h, l } = ronaTopik.get(topik.id) ?? { h: 30, l: 0 };
  // tema terang (pastel) memakai --kartu-arah -1 supaya variasi tetap di rentang yang terbaca
  return `oklch(calc(var(--kartu-l) + ${l} * var(--kartu-arah, 1)) var(--kartu-c) calc(${h.toFixed(1)}deg + var(--kartu-geser)))`;
}

export function terapkanTema(id: TemaId) {
  document.documentElement.dataset.tema = id;
  const t = TEMA.find((x) => x.id === id);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", t?.warnaBar ?? "#5e0d18");
}
