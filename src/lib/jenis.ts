import dataTopik from "../data/topik.json";
import jumlahJson from "../data/jumlah.json";

export type Mode = "pasangan" | "teman" | "keluarga" | "sendiri";
export type Level = "santai" | "sedang" | "dalam";
export type GrupId = "pasangan" | "intim" | "seru" | "teman" | "keluarga" | "diri";

export interface Pertanyaan {
  id: string;
  topic: string;
  mode: Mode[];
  level: Level;
  adult: boolean;
  text: string;
}

export interface Topik {
  id: string;
  nama: string;
  grup: GrupId;
  ikon: string;
  mode: Mode[];
  adult: boolean;
}

export interface Grup {
  id: GrupId;
  nama: string;
  ringkas: string;
}

export const GRUP = dataTopik.grup as Grup[];
export const TOPIK = dataTopik.topik as Topik[];
export const TOPIK_PER_ID = new Map(TOPIK.map((t) => [t.id, t]));
export const JUMLAH = jumlahJson as Record<string, { total: number; santai: number; sedang: number; dalam: number }>;

export const MODE: { id: Mode; nama: string; ikon: string; ringkas: string }[] = [
  { id: "pasangan", nama: "Berpasangan", ikon: "💑", ringkas: "Kamu dan pacar, tunangan, atau suami istri" },
  { id: "teman", nama: "Teman", ikon: "🧑‍🤝‍🧑", ringkas: "Main rame-rame bareng sahabat" },
  { id: "keluarga", nama: "Keluarga", ikon: "👨‍👩‍👧", ringkas: "Orang tua, anak, kakak, adik" },
  { id: "sendiri", nama: "Sendiri", ikon: "🪞", ringkas: "Refleksi diri, cocok buat jurnal" },
];

export const LEVEL: { id: Level; nama: string; ringkas: string }[] = [
  { id: "santai", nama: "Santai", ringkas: "Ringan, buat pemanasan" },
  { id: "sedang", nama: "Sedang", ringkas: "Mulai cerita" },
  { id: "dalam", nama: "Dalam", ringkas: "Jujur dari hati" },
];

export const TIMER: { detik: number; nama: string }[] = [
  { detik: 0, nama: "Tanpa" },
  { detik: 30, nama: "30 detik" },
  { detik: 60, nama: "1 menit" },
  { detik: 120, nama: "2 menit" },
];

export function grupDari(id: GrupId) {
  return GRUP.find((g) => g.id === id)!;
}

/** Nomor kartu di dalam topiknya, dari id: "masa-lalu-0042" → 42 */
export function nomorKartu(id: string) {
  return Number(id.slice(-4));
}

export function topikDariId(idPertanyaan: string) {
  return idPertanyaan.slice(0, -5);
}
