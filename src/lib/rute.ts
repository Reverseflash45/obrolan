import { useSyncExternalStore } from "react";

// Rute sederhana berbasis hash (#/main, #/topik, …): tombol kembali HP tetap jalan,
// dan tidak butuh konfigurasi server untuk rute.
export type Rute = "/" | "/mode" | "/topik" | "/main" | "/favorit" | "/riwayat" | "/hari-ini" | "/pengaturan";

function bacaRute(): Rute {
  const h = location.hash.replace(/^#/, "") || "/";
  return h as Rute;
}

function langganan(cb: () => void) {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
}

export function useRute() {
  return useSyncExternalStore(langganan, bacaRute, () => "/" as Rute);
}

export function pergi(rute: Rute, ganti = false) {
  const url = "#" + rute;
  if (ganti) {
    history.replaceState(null, "", url);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  } else {
    location.hash = rute;
  }
}
