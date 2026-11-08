import { useEffect, useState } from "react";
import { muatBanyak } from "../lib/data";
import type { Pertanyaan } from "../lib/jenis";
import { pergi } from "../lib/rute";
import { useToko } from "../lib/toko";
import { DaftarKartu } from "../komponen/DaftarKartu";
import { Kepala, Layar, TombolUtama } from "../komponen/Tombol";

export default function Riwayat() {
  const { sesi } = useToko();
  const [peta, setPeta] = useState<Map<string, Pertanyaan> | null>(null);

  useEffect(() => {
    if (sesi?.topik.length) muatBanyak(sesi.topik).then(setPeta).catch(() => setPeta(new Map()));
  }, [sesi?.topik]);

  const riwayat = sesi?.riwayat ?? [];
  const status = new Map(riwayat.map((r) => [r.id, r.status]));
  // terbaru di atas
  const isi = peta ? riwayat.map((r) => peta.get(r.id)).filter((q): q is Pertanyaan => !!q).reverse() : [];

  return (
    <Layar>
      <Kepala induk={sesi ? "/main" : "/"} />
      <h1 className="text-3xl font-semibold">Riwayat main</h1>
      <p className="mt-1 text-lg text-redup">
        {riwayat.length ? `${riwayat.length} kartu sudah keluar di permainan ini.` : "Belum ada kartu yang keluar di permainan ini."}
      </p>
      {riwayat.length ? (
        <div className="mt-2">
          <DaftarKartu isi={isi} label={(q) => (status.get(q.id) === "dilewati" ? "dilewati" : "dijawab")} />
        </div>
      ) : (
        <div className="mt-auto pt-10">
          <TombolUtama ikon="kartu" onClick={() => pergi(sesi ? "/main" : "/mode")}>
            {sesi ? "Kembali Main" : "Mulai Main"}
          </TombolUtama>
        </div>
      )}
    </Layar>
  );
}
