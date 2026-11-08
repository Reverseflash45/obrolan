import { useState, type ReactNode } from "react";
import { TOPIK_PER_ID, type Pertanyaan } from "../lib/jenis";
import { warnaKartu } from "../lib/tema";
import { useToko } from "../lib/toko";
import { KartuDiam } from "./Kartu";
import { Ikon } from "./Ikon";
import { useBagikan } from "./Bagikan";
import { TombolKedua } from "./Tombol";

/** Daftar kartu ringkas; ketuk satu baris untuk melihat kartunya utuh + aksi */
export function DaftarKartu({ isi, label }: { isi: Pertanyaan[]; label?: (q: Pertanyaan) => ReactNode }) {
  const [buka, setBuka] = useState<string | null>(null);
  const { apakahFavorit, tukarFavorit } = useToko();
  const { bagikan, panggung, pesan } = useBagikan();

  return (
    <>
      <p className="min-h-7 text-center text-base text-redup" aria-live="polite">
        {pesan}
      </p>
      <ul className="flex flex-col gap-3">
        {isi.map((q) => {
          const t = TOPIK_PER_ID.get(q.topic)!;
          const terbuka = buka === q.id;
          const fav = apakahFavorit(q.id);
          return (
            <li key={q.id} className="overflow-hidden rounded-2xl bg-permukaan text-ptinta">
              <button
                type="button"
                aria-expanded={terbuka}
                onClick={() => setBuka(terbuka ? null : q.id)}
                className="flex min-h-16 w-full items-stretch gap-3 text-left"
              >
                <span className="w-3 shrink-0" style={{ background: warnaKartu(t) }} aria-hidden="true" />
                <span className="flex-1 py-3 pr-2">
                  <span className="block text-lg leading-snug">{q.text}</span>
                  <span className="mt-1 block text-base text-predup">
                    {t.ikon} {t.nama}
                    {label && <> · {label(q)}</>}
                  </span>
                </span>
                <span className="grid place-items-center pr-3 text-predup">
                  <Ikon nama="lanjut" className={`h-6 w-6 transition ${terbuka ? "rotate-90" : ""}`} />
                </span>
              </button>
              {terbuka && (
                <div className="border-t border-black/10 bg-latar p-4">
                  <KartuDiam q={q} />
                  <div className="mt-4 grid grid-cols-2 gap-2 text-tinta">
                    <TombolKedua ikon="hati" ikonIsi={fav} aria-pressed={fav} onClick={() => tukarFavorit(q)}>
                      {fav ? "Hapus Favorit" : "Simpan"}
                    </TombolKedua>
                    <TombolKedua ikon="bagikan" onClick={() => bagikan(q)}>
                      Bagikan
                    </TombolKedua>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {panggung}
    </>
  );
}
