// Menyusun file sumber data/sumber/{topik}.txt menjadi public/data/questions/{topik}.json.
//
// Format sumber: satu pertanyaan per baris, diawali kode level lalu "|":
//   s|Apa jajanan masa kecil yang paling kamu kangenin?     (s = santai)
//   m|Kebiasaan apa dari orang tuamu yang kebawa sampai sekarang?   (m = sedang)
//   d|Luka lama apa yang masih kamu bawa sampai hari ini?   (d = dalam)
// Baris kosong dan baris yang diawali "#" diabaikan.
//
//   node scripts/susun.mjs
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const akar = join(dirname(fileURLToPath(import.meta.url)), "..");
const { topik } = JSON.parse(readFileSync(join(akar, "src/data/topik.json"), "utf8"));
const LEVEL = { s: "santai", m: "sedang", d: "dalam" };
const keluar = join(akar, "public/data/questions");
mkdirSync(keluar, { recursive: true });

const jumlah = {};
let total = 0;
const belumAda = [];
for (const t of topik) {
  const sumber = join(akar, "data/sumber", `${t.id}.txt`);
  if (!existsSync(sumber)) {
    belumAda.push(t.id);
    jumlah[t.id] = { total: 0, santai: 0, sedang: 0, dalam: 0 };
    continue;
  }
  const baris = readFileSync(sumber, "utf8").split(/\r?\n/);
  const isi = [];
  baris.forEach((b, i) => {
    const s = b.trim();
    if (!s || s.startsWith("#")) return;
    const m = s.match(/^([smd])\|(.+)$/);
    if (!m) throw new Error(`${t.id}.txt baris ${i + 1}: format salah → ${s}`);
    isi.push({
      id: `${t.id}-${String(isi.length + 1).padStart(4, "0")}`,
      topic: t.id,
      mode: t.mode,
      level: LEVEL[m[1]],
      adult: t.adult,
      text: m[2].trim().replace(/\s+/g, " "),
    });
  });
  // satu objek per baris: tetap kecil tapi enak dibaca di git diff
  writeFileSync(join(keluar, `${t.id}.json`), "[\n" + isi.map((q) => JSON.stringify(q)).join(",\n") + "\n]\n");
  const hit = { total: isi.length, santai: 0, sedang: 0, dalam: 0 };
  for (const q of isi) hit[q.level]++;
  jumlah[t.id] = hit;
  total += isi.length;
}
writeFileSync(join(akar, "src/data/jumlah.json"), JSON.stringify(jumlah, null, 1) + "\n");
if (belumAda.length) console.warn(`belum ada sumber: ${belumAda.join(", ")}`);
console.log(`selesai: ${topik.length} topik, ${total} pertanyaan`);
