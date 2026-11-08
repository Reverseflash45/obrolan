import { useState } from "react";
import { MODE, type Mode } from "../lib/jenis";
import { pergi } from "../lib/rute";
import { useToko } from "../lib/toko";
import { Ikon } from "../komponen/Ikon";
import { Kepala, Layar, TombolUtama } from "../komponen/Tombol";

const MAKS_PEMAIN = 6;

export default function PilihMode() {
  const { mode: modeTersimpan, setMode, pemain, setPemain } = useToko();
  const [mode, setPilihan] = useState<Mode | null>(modeTersimpan);
  const [nama, setNama] = useState<string[]>(pemain.length >= 2 ? pemain : ["", ""]);

  function pilih(m: Mode) {
    setPilihan(m);
    setMode(m);
    if (m === "sendiri") pergi("/topik");
    else if (m === "pasangan" && nama.length > 2) setNama(nama.slice(0, 2));
  }

  function lanjut() {
    setPemain(nama.map((n) => n.trim()).slice(0, mode === "pasangan" ? 2 : MAKS_PEMAIN));
    pergi("/topik");
  }

  return (
    <Layar>
      <Kepala induk="/" />
      <h1 className="text-3xl font-semibold">Main sama siapa?</h1>
      <p className="mt-1 text-lg text-redup">Pilih salah satu.</p>

      <div className="mt-5 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Mode permainan">
        {MODE.map((m) => {
          const aktif = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={aktif}
              onClick={() => pilih(m.id)}
              className={`relative flex min-h-36 flex-col items-start justify-between rounded-3xl border-[3px] p-4 text-left transition ${
                aktif ? "border-emas bg-permukaan text-ptinta" : "border-transparent bg-permukaan/90 text-ptinta hover:bg-permukaan"
              }`}
            >
              <span className="text-4xl" aria-hidden="true">
                {m.ikon}
              </span>
              <span>
                <span className="block text-xl font-semibold">{m.nama}</span>
                <span className="block text-base leading-snug text-predup">{m.ringkas}</span>
              </span>
              {aktif && (
                <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-emas text-[#2a1a08]">
                  <Ikon nama="centang" className="h-5 w-5" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {mode && mode !== "sendiri" && (
        <section className="mt-7" aria-labelledby="judul-nama">
          <h2 id="judul-nama" className="text-2xl font-semibold">
            Siapa saja yang main?
          </h2>
          <p className="text-base text-redup">Boleh dikosongkan. Nama dipakai buat giliran bertanya.</p>
          <div className="mt-3 flex flex-col gap-3">
            {nama.map((n, i) => (
              <label key={i} className="flex flex-col gap-1">
                <span className="text-base font-medium">Pemain {i + 1}</span>
                <div className="flex gap-2">
                  <input
                    value={n}
                    maxLength={20}
                    autoComplete="off"
                    enterKeyHint="next"
                    placeholder={i === 0 ? "Misal: Rafi" : i === 1 ? "Misal: Nadia" : "Nama"}
                    onChange={(e) => setNama(nama.map((x, j) => (j === i ? e.target.value : x)))}
                    className="min-h-14 w-full rounded-2xl border-2 border-garis bg-permukaan px-4 text-xl text-ptinta placeholder:text-predup/70"
                  />
                  {i >= 2 && (
                    <button
                      type="button"
                      onClick={() => setNama(nama.filter((_, j) => j !== i))}
                      className="flex min-h-14 shrink-0 items-center gap-1 rounded-2xl border-2 border-garis px-3 text-base"
                    >
                      <Ikon nama="silang" className="h-5 w-5" />
                      <span>Hapus</span>
                    </button>
                  )}
                </div>
              </label>
            ))}
          </div>
          {mode !== "pasangan" && nama.length < MAKS_PEMAIN && (
            <button
              type="button"
              onClick={() => setNama([...nama, ""])}
              className="mt-3 flex min-h-12 items-center gap-2 rounded-xl px-1 text-lg font-medium text-redup hover:text-tinta"
            >
              <Ikon nama="tambah" />
              <span>Tambah pemain</span>
            </button>
          )}
          <TombolUtama className="mt-6" ikon="lanjut" onClick={lanjut}>
            Pilih Topik
          </TombolUtama>
        </section>
      )}
    </Layar>
  );
}
