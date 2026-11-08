import { kocok, muatBanyak } from "./data";
import { TOPIK, type Level, type Mode, type Topik } from "./jenis";
import type { Sesi } from "./toko";

/** Topik yang tampil untuk satu mode; topik 18+ hanya kalau diizinkan */
export function topikUntuk(mode: Mode, dewasa: boolean): Topik[] {
  return TOPIK.filter((t) => t.mode.includes(mode) && (!t.adult || dewasa));
}

/** Muat data topik terpilih, saring level & mode, lalu kocok jadi satu dek tanpa pengulangan */
export async function buatSesi(mode: Mode, topik: string[], level: Level[]): Promise<Sesi> {
  const peta = await muatBanyak(topik);
  const ids = [...peta.values()].filter((q) => level.includes(q.level) && q.mode.includes(mode)).map((q) => q.id);
  return { mode, topik, level, dek: kocok(ids), posisi: 0, riwayat: [], giliran: 0 };
}
