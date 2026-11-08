import { useEffect, useState } from "react";
import { hashTeks, muatTopik, tanggalHariIni } from "../lib/data";
import { JUMLAH, TOPIK, type Pertanyaan } from "../lib/jenis";
import { useToko } from "../lib/toko";
import { Kartu } from "../komponen/Kartu";
import { useBagikan } from "../komponen/Bagikan";
import { Kepala, Layar, TombolKedua, TombolUtama } from "../komponen/Tombol";

// Satu kartu yang sama untuk semua orang di hari yang sama: dipilih dari tanggal.
// Hanya topik umum (bukan 18+, bukan khusus gaya bahasa tongkrongan).
const KANDIDAT = TOPIK.filter((t) => !t.adult && t.grup !== "teman" && (JUMLAH[t.id]?.total ?? 0) > 0);

function hariIni() {
  return new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());
}

export default function HariIni() {
  const { apakahFavorit, tukarFavorit } = useToko();
  const [q, setQ] = useState<Pertanyaan | null>(null);
  const [galat, setGalat] = useState(false);
  const [terbuka, setTerbuka] = useState(false);
  const { bagikan, panggung, pesan } = useBagikan();

  useEffect(() => {
    const h = hashTeks("obrolan:" + tanggalHariIni());
    const topik = KANDIDAT[h % KANDIDAT.length];
    muatTopik(topik.id)
      .then((isi) => setQ(isi[Math.floor(h / KANDIDAT.length) % isi.length]))
      .catch(() => setGalat(true));
  }, []);

  const fav = q ? apakahFavorit(q.id) : false;

  return (
    <Layar>
      <Kepala induk="/" />
      <h1 className="text-3xl font-semibold">Kartu hari ini</h1>
      <p className="mt-1 text-lg text-redup">{hariIni()}. Besok ganti kartu baru.</p>

      <div className="mt-8">
        {q ? (
          <Kartu q={q} terbuka={terbuka} onKetuk={() => setTerbuka(true)} />
        ) : (
          <div className="kartu-wadah">
            <div className="grid aspect-[1.55] place-items-center rounded-[6cqw] border-2 border-dashed border-garis text-lg text-redup">
              {galat ? "Kartu gagal dimuat. Periksa internet." : "Menyiapkan kartu…"}
            </div>
          </div>
        )}
      </div>
      <p className="mt-4 min-h-7 text-center text-base text-redup" aria-live="polite">
        {pesan || (!terbuka && q ? "Ketuk kartu untuk membukanya" : "")}
      </p>

      <div className="mt-auto flex flex-col gap-3 pt-6">
        {terbuka && q ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              <TombolKedua ikon="hati" ikonIsi={fav} aria-pressed={fav} onClick={() => tukarFavorit(q)} className={fav ? "border-emas text-emas" : ""}>
                {fav ? "Disimpan" : "Simpan"}
              </TombolKedua>
              <TombolKedua ikon="bagikan" onClick={() => bagikan(q)}>
                Bagikan
              </TombolKedua>
            </div>
          </>
        ) : (
          <TombolUtama ikon="kartu" disabled={!q} onClick={() => setTerbuka(true)}>
            Buka Kartu
          </TombolUtama>
        )}
      </div>
      {panggung}
    </Layar>
  );
}
