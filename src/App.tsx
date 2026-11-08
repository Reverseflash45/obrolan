import { useEffect, type ReactElement } from "react";
import { MotionConfig } from "framer-motion";
import { useRute, type Rute } from "./lib/rute";
import { terapkanTema } from "./lib/tema";
import { PenyediaToko, useToko } from "./lib/toko";
import Beranda from "./halaman/Beranda";
import PilihMode from "./halaman/PilihMode";
import PilihTopik from "./halaman/PilihTopik";
import Main from "./halaman/Main";
import Favorit from "./halaman/Favorit";
import Riwayat from "./halaman/Riwayat";
import HariIni from "./halaman/HariIni";
import Pengaturan from "./halaman/Pengaturan";

const HALAMAN: Record<Rute, () => ReactElement | null> = {
  "/": Beranda,
  "/mode": PilihMode,
  "/topik": PilihTopik,
  "/main": Main,
  "/favorit": Favorit,
  "/riwayat": Riwayat,
  "/hari-ini": HariIni,
  "/pengaturan": Pengaturan,
};

const JUDUL: Record<Rute, string> = {
  "/": "Obrolan · Kartu ngobrol buat pasangan & teman",
  "/mode": "Pilih mode · Obrolan",
  "/topik": "Pilih topik · Obrolan",
  "/main": "Main · Obrolan",
  "/favorit": "Favorit · Obrolan",
  "/riwayat": "Riwayat · Obrolan",
  "/hari-ini": "Kartu hari ini · Obrolan",
  "/pengaturan": "Pengaturan · Obrolan",
};

function Isi() {
  const rute = useRute();
  const { pengaturan } = useToko();
  const Halaman = HALAMAN[rute] ?? Beranda;

  useEffect(() => terapkanTema(pengaturan.tema), [pengaturan.tema]);
  useEffect(() => {
    document.title = JUDUL[rute] ?? JUDUL["/"];
    window.scrollTo(0, 0);
  }, [rute]);

  return <Halaman key={rute} />;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <PenyediaToko>
        <Isi />
      </PenyediaToko>
    </MotionConfig>
  );
}
