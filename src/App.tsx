import { lazy, Suspense, useEffect, type ComponentType } from "react";
import { useRute, type Rute } from "./lib/rute";
import { terapkanTema } from "./lib/tema";
import { PenyediaToko, useToko } from "./lib/toko";
import Beranda from "./halaman/Beranda";

// Beranda ikut bundel awal (dan di-prerender). Layar lain, termasuk animasi kartu (Framer Motion),
// baru diunduh saat dibuka, lalu diambil dari cache service worker.
const HALAMAN: Record<Rute, ComponentType> = {
  "/": Beranda,
  "/mode": lazy(() => import("./halaman/PilihMode")),
  "/topik": lazy(() => import("./halaman/PilihTopik")),
  "/main": lazy(() => import("./halaman/Main")),
  "/favorit": lazy(() => import("./halaman/Favorit")),
  "/riwayat": lazy(() => import("./halaman/Riwayat")),
  "/hari-ini": lazy(() => import("./halaman/HariIni")),
  "/pengaturan": lazy(() => import("./halaman/Pengaturan")),
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

  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <Halaman key={rute} />
    </Suspense>
  );
}

export default function App() {
  return (
    <PenyediaToko>
      <Isi />
    </PenyediaToko>
  );
}
