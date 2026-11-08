import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Level, Mode, Pertanyaan } from "./jenis";
import type { TemaId } from "./tema";

export interface Pengaturan {
  tema: TemaId;
  timer: number;
  dewasa: boolean;
  level: Level[];
}

export interface CatatanRiwayat {
  id: string;
  status: "dijawab" | "dilewati";
}

export interface Sesi {
  mode: Mode;
  topik: string[];
  level: Level[];
  dek: string[];
  posisi: number;
  riwayat: CatatanRiwayat[];
  giliran: number;
}

const AWAL: Pengaturan = { tema: "merah", timer: 0, dewasa: false, level: ["santai", "sedang", "dalam"] };

function baca<T>(kunci: string, cadangan: T): T {
  try {
    const s = localStorage.getItem("obrolan:" + kunci);
    return s ? (JSON.parse(s) as T) : cadangan;
  } catch {
    return cadangan;
  }
}
function tulis(kunci: string, nilai: unknown) {
  try {
    if (nilai === null) localStorage.removeItem("obrolan:" + kunci);
    else localStorage.setItem("obrolan:" + kunci, JSON.stringify(nilai));
  } catch {
    /* penyimpanan penuh atau diblokir: aplikasi tetap jalan tanpa simpan */
  }
}

function useTersimpan<T>(kunci: string, awal: T) {
  const [nilai, setNilai] = useState<T>(() => baca(kunci, awal));
  useEffect(() => tulis(kunci, nilai), [kunci, nilai]);
  return [nilai, setNilai] as const;
}

interface Toko {
  pengaturan: Pengaturan;
  ubahPengaturan: (p: Partial<Pengaturan>) => void;
  pemain: string[];
  setPemain: (p: string[]) => void;
  mode: Mode | null;
  setMode: (m: Mode) => void;
  favorit: Pertanyaan[];
  apakahFavorit: (id: string) => boolean;
  tukarFavorit: (q: Pertanyaan) => void;
  hapusSemuaFavorit: () => void;
  sesi: Sesi | null;
  setSesi: (s: Sesi | null | ((lama: Sesi | null) => Sesi | null)) => void;
}

const Konteks = createContext<Toko | null>(null);

export function PenyediaToko({ children }: { children: ReactNode }) {
  const [pengaturanMentah, setPengaturan] = useTersimpan<Pengaturan>("pengaturan", AWAL);
  const pengaturan = useMemo(() => ({ ...AWAL, ...pengaturanMentah }), [pengaturanMentah]);
  const [pemain, setPemain] = useTersimpan<string[]>("pemain", ["", ""]);
  const [mode, setMode] = useTersimpan<Mode | null>("mode", null);
  const [favorit, setFavorit] = useTersimpan<Pertanyaan[]>("favorit", []);
  const [sesi, setSesi] = useTersimpan<Sesi | null>("sesi", null);

  const ubahPengaturan = useCallback((p: Partial<Pengaturan>) => setPengaturan((lama) => ({ ...AWAL, ...lama, ...p })), [setPengaturan]);
  const idFavorit = useMemo(() => new Set(favorit.map((f) => f.id)), [favorit]);
  const apakahFavorit = useCallback((id: string) => idFavorit.has(id), [idFavorit]);
  const tukarFavorit = useCallback(
    (q: Pertanyaan) => setFavorit((lama) => (lama.some((f) => f.id === q.id) ? lama.filter((f) => f.id !== q.id) : [q, ...lama])),
    [setFavorit],
  );

  const nilai: Toko = {
    pengaturan,
    ubahPengaturan,
    pemain,
    setPemain,
    mode,
    setMode,
    favorit,
    apakahFavorit,
    tukarFavorit,
    hapusSemuaFavorit: () => setFavorit([]),
    sesi,
    setSesi,
  };
  return <Konteks.Provider value={nilai}>{children}</Konteks.Provider>;
}

export function useToko() {
  const t = useContext(Konteks);
  if (!t) throw new Error("useToko di luar PenyediaToko");
  return t;
}

/** Nama pemain yang diisi; kosong diganti "Pemain 1", "Pemain 2", … */
export function namaPemain(pemain: string[]) {
  return pemain.map((n, i) => n.trim() || `Pemain ${i + 1}`);
}
