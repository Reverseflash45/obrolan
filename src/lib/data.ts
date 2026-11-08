import type { Pertanyaan } from "./jenis";

// Data tiap topik dimuat terpisah saat dibutuhkan, lalu disimpan di memori.
const cache = new Map<string, Promise<Pertanyaan[]>>();

export function muatTopik(id: string): Promise<Pertanyaan[]> {
  let p = cache.get(id);
  if (!p) {
    p = fetch(`/data/questions/${id}.json`).then((r) => {
      if (!r.ok) throw new Error(`Gagal memuat topik ${id}`);
      return r.json() as Promise<Pertanyaan[]>;
    });
    p.catch(() => cache.delete(id));
    cache.set(id, p);
  }
  return p;
}

export async function muatBanyak(ids: string[]): Promise<Map<string, Pertanyaan>> {
  const daftar = await Promise.all(ids.map(muatTopik));
  const peta = new Map<string, Pertanyaan>();
  for (const isi of daftar) for (const q of isi) peta.set(q.id, q);
  return peta;
}

/** Fisher–Yates dengan Math.random */
export function kocok<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Hash angka stabil dari teks (FNV-1a), buat "Kartu Hari Ini" */
export function hashTeks(s: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function tanggalHariIni() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
