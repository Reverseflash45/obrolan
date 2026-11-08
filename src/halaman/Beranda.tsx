import { TOPIK, JUMLAH } from "../lib/jenis";
import { pergi } from "../lib/rute";
import { useToko } from "../lib/toko";
import { MukaBelakang } from "../komponen/Muka";
import { Ikon, type NamaIkon } from "../komponen/Ikon";
import { Layar, TombolUtama } from "../komponen/Tombol";

const total = Object.values(JUMLAH).reduce((a, b) => a + b.total, 0);
const angka = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

function Tautan({ ikon, children, ke, isi }: { ikon: NamaIkon; children: string; ke: () => void; isi?: boolean }) {
  return (
    <button type="button" onClick={ke} className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-base font-medium text-redup hover:text-tinta">
      <Ikon nama={ikon} isi={isi} className="h-7 w-7" />
      <span>{children}</span>
    </button>
  );
}

export default function Beranda() {
  const { sesi, favorit } = useToko();
  const sisa = sesi ? sesi.dek.length - sesi.posisi : 0;
  // tiga punggung kartu bertumpuk sebagai sampul, seperti kotak kartu yang baru dibuka
  const tumpukan = [TOPIK.find((t) => t.id === "kenalan-lebih-dalam")!, TOPIK.find((t) => t.id === "superpower")!, TOPIK.find((t) => t.id === "masa-lalu")!];

  return (
    <Layar className="justify-between pt-6">
      <div className="flex flex-col items-center text-center">
        <h1 className="judul-logo text-6xl uppercase leading-none">Obrolan</h1>
        <p className="mt-3 max-w-xs text-lg text-redup">Kartu pertanyaan buat ngobrol lebih dalam, bareng pasangan, teman, keluarga, atau diri sendiri.</p>
      </div>

      <div className="relative mx-auto my-8 h-56 w-full max-w-sm" aria-hidden="true">
        {tumpukan.map((t, i) => (
          <div
            key={t.id}
            className="kartu-wadah absolute left-1/2 top-1/2 w-[78%]"
            style={{ transform: `translate(-50%, -50%) translate(${(i - 1) * 14}px, ${(1 - i) * 6}px) rotate(${(i - 1) * 7}deg)` }}
          >
            <div className="relative aspect-[1.55] w-full">
              <MukaBelakang topik={t} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {sesi && sisa > 0 ? (
          <>
            <TombolUtama ikon="putar" ikonIsi onClick={() => pergi("/main")}>
              Lanjutkan Main
            </TombolUtama>
            <button type="button" onClick={() => pergi("/mode")} className="min-h-12 text-lg font-medium text-redup underline underline-offset-4 hover:text-tinta">
              Mulai permainan baru
            </button>
          </>
        ) : (
          <TombolUtama ikon="putar" ikonIsi onClick={() => pergi("/mode")}>
            Mulai Main
          </TombolUtama>
        )}
        <p className="text-center text-base text-redup">
          {angka(total)} pertanyaan · {TOPIK.filter((t) => !t.adult).length} topik
        </p>
        <nav className="mt-2 grid grid-cols-3 gap-1 border-t border-garis pt-3" aria-label="Menu lain">
          <Tautan ikon="kalender" ke={() => pergi("/hari-ini")}>
            Kartu Hari Ini
          </Tautan>
          <Tautan ikon="hati" ke={() => pergi("/favorit")} isi={favorit.length > 0}>
            {favorit.length ? `Favorit (${favorit.length})` : "Favorit"}
          </Tautan>
          <Tautan ikon="atur" ke={() => pergi("/pengaturan")}>
            Pengaturan
          </Tautan>
        </nav>
      </div>
    </Layar>
  );
}
