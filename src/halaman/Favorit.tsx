import { useState } from "react";
import { pergi } from "../lib/rute";
import { useToko } from "../lib/toko";
import { DaftarKartu } from "../komponen/DaftarKartu";
import { Kepala, Layar, TombolKedua, TombolUtama } from "../komponen/Tombol";

export default function Favorit() {
  const { favorit, hapusSemuaFavorit } = useToko();
  const [yakin, setYakin] = useState(false);

  return (
    <Layar>
      <Kepala induk="/" />
      <h1 className="text-3xl font-semibold">Kartu favorit</h1>
      <p className="mt-1 text-lg text-redup">
        {favorit.length ? `${favorit.length} kartu yang kamu simpan. Ketuk untuk melihat kartunya.` : "Belum ada kartu yang disimpan."}
      </p>

      {favorit.length ? (
        <>
          <div className="mt-2">
            <DaftarKartu isi={favorit} />
          </div>
          <div className="mt-8 border-t border-garis pt-5">
            {yakin ? (
              <div className="flex flex-col gap-2">
                <p className="text-lg">Hapus semua {favorit.length} kartu favorit? Ini tidak bisa dibatalkan.</p>
                <div className="grid grid-cols-2 gap-2">
                  <TombolKedua onClick={() => setYakin(false)}>Batal</TombolKedua>
                  <TombolKedua
                    ikon="sampah"
                    onClick={() => {
                      hapusSemuaFavorit();
                      setYakin(false);
                    }}
                  >
                    Ya, hapus
                  </TombolKedua>
                </div>
              </div>
            ) : (
              <TombolKedua ikon="sampah" className="w-full" onClick={() => setYakin(true)}>
                Hapus semua favorit
              </TombolKedua>
            )}
          </div>
        </>
      ) : (
        <div className="mt-auto flex flex-col gap-3 pt-10">
          <p className="text-center text-lg text-redup">Saat main, tekan tombol ♥ Simpan di kartu yang kamu suka.</p>
          <TombolUtama ikon="putar" ikonIsi onClick={() => pergi("/mode")}>
            Mulai Main
          </TombolUtama>
        </div>
      )}
    </Layar>
  );
}
