// Ikon garis sederhana; selalu dipakai bersama teks label, jadi disembunyikan dari pembaca layar.
const JALUR = {
  kembali: "M15 5l-7 7 7 7",
  lanjut: "M9 5l7 7-7 7",
  hati: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z",
  lewati: "M5 6l7 6-7 6V6zm8 0l7 6-7 6V6z",
  bagikan: "M12 3v12M7 8l5-5 5 5M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5",
  acak: "M4 7h3c4 0 6 10 10 10h3M4 17h3c1.6 0 2.8-1.6 4-3.6M13 9.6C14.2 8 15.4 7 17 7h3M18 4l3 3-3 3M18 14l3 3-3 3",
  jam: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  atur: "M4 7h10M18 7h2M4 17h4M12 17h8M14 4v6M8 14v6",
  riwayat: "M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 8v4l3 2",
  kalender: "M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM4 10h16M8 3v4M16 3v4",
  centang: "M5 12.5l4.5 4.5L19 7.5",
  silang: "M6 6l12 12M18 6L6 18",
  rumah: "M4 11l8-7 8 7M6 9.5V20h12V9.5",
  jeda: "M9 6v12M15 6v12",
  putar: "M8 5.5v13l10-6.5-10-6.5z",
  ulang: "M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5",
  tambah: "M12 5v14M5 12h14",
  kartu: "M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM8 10h8M8 14h5",
  sampah: "M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13",
} as const;

export type NamaIkon = keyof typeof JALUR;

export function Ikon({ nama, isi = false, className = "h-6 w-6" }: { nama: NamaIkon; isi?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 ${className}`}
      fill={isi ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={JALUR[nama]} />
    </svg>
  );
}
