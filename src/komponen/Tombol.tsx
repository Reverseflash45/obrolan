import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Ikon, type NamaIkon } from "./Ikon";
import { pergi, type Rute } from "../lib/rute";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { ikon?: NamaIkon; ikonIsi?: boolean; children: ReactNode };

/** Satu aksi utama per layar: tombol besar berwarna aksen */
export function TombolUtama({ ikon, ikonIsi, children, className = "", ...p }: Props) {
  return (
    <button
      type="button"
      {...p}
      className={`flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-utama px-6 text-xl font-semibold text-utinta shadow-[0_5px_0_rgb(0_0_0/0.28)] transition active:translate-y-[3px] active:shadow-[0_2px_0_rgb(0_0_0/0.28)] disabled:opacity-45 disabled:shadow-none ${className}`}
    >
      {ikon && <Ikon nama={ikon} isi={ikonIsi} className="h-7 w-7" />}
      <span>{children}</span>
    </button>
  );
}

/** Aksi pendamping: garis tepi, tidak bersaing dengan tombol utama */
export function TombolKedua({ ikon, ikonIsi, children, className = "", ...p }: Props) {
  return (
    <button
      type="button"
      {...p}
      className={`flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-garis px-4 text-lg font-medium text-tinta transition hover:bg-white/5 active:scale-[0.98] disabled:opacity-45 ${className}`}
    >
      {ikon && <Ikon nama={ikon} isi={ikonIsi} />}
      <span>{children}</span>
    </button>
  );
}

/** Kepala layar: tombol Kembali (ke layar induk) + judul */
export function Kepala({ induk, kanan }: { induk: Rute; kanan?: ReactNode }) {
  return (
    <header className="flex items-center gap-2 pb-4 pt-3">
      <button
        type="button"
        onClick={() => pergi(induk)}
        className="-ml-2 flex min-h-12 items-center gap-1 rounded-xl px-2 text-lg font-medium text-redup hover:text-tinta"
      >
        <Ikon nama="kembali" />
        <span>Kembali</span>
      </button>
      <div className="ml-auto">{kanan}</div>
    </header>
  );
}

export function Layar({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <main className={`mx-auto flex min-h-dvh w-full max-w-xl flex-col px-4 pb-8 ${className}`}>{children}</main>;
}
