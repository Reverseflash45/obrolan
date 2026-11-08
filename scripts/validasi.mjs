// Validasi semua file public/data/questions/*.json.
// Cek: skema, id unik, satu kalimat, maks 20 kata, diakhiri "?", level valid,
// flag adult cocok dengan topik, duplikat persis (setelah normalisasi),
// duplikat makna (kemiripan kata isi & trigram huruf), jumlah per topik, dan total.
//
//   node scripts/validasi.mjs            ringkasan
//   node scripts/validasi.mjs --rinci    tampilkan juga pasangan "mirip" (peringatan)
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const akar = join(dirname(fileURLToPath(import.meta.url)), "..");
const { topik } = JSON.parse(readFileSync(join(akar, "src/data/topik.json"), "utf8"));
const RINCI = process.argv.includes("--rinci");
const MIN_PER_TOPIK = 250;
const MIN_TOTAL = 10000;
const MAKS_KATA = 20;
const AMBANG_GALAT = 0.8; // kemiripan kata isi ≥ ini = makna hampir sama → galat
const AMBANG_PERINGATAN = 0.67;
const AMBANG_TRIGRAM = 0.9;

const galat = [];
const peringatan = [];
const salah = (pesan) => galat.push(pesan);

// ---------- normalisasi ----------
const SINONIM = {
  gak: "tidak", nggak: "tidak", ga: "tidak", enggak: "tidak", engga: "tidak", ngga: "tidak",
  gue: "aku", gw: "aku", saya: "aku", lo: "kamu", lu: "kamu", elo: "kamu", kau: "kamu",
  udah: "sudah", pengen: "ingin", pengin: "ingin", mau: "ingin", kalo: "kalau", gimana: "bagaimana",
  kayak: "seperti", kaya: "seperti", bikin: "buat", banget: "sangat", aja: "saja", doang: "saja",
};
const STOP = new Set(`apa yang kamu aku kita dan di ke dari itu ini kalau paling pernah ada untuk buat dengan sama atau mana siapa
bagaimana kenapa mengapa kapan berapa akan sudah belum lagi juga jadi bisa ingin seperti saat waktu ketika tidak menurut
hal satu sih dong si pun lebih sangat sekali saja kalian bakal biasanya sering selalu masih harus boleh bareng berdua
the a orang hari sekarang dulu tuh nih kah lah deh yuk coba sebenarnya benar kira kira-kira sebuah suatu`.split(/\s+/));

function normal(teks) {
  return teks
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((k) => SINONIM[k] ?? k)
    .join(" ");
}
function akarKata(k) {
  // pangkas akhiran milik & partikel sederhana: favoritmu → favorit, rumahnya → rumah
  return k.replace(/(nya|mu|ku|lah|kah|pun)$/, "") || k;
}
function kataIsi(teks) {
  return new Set(
    normal(teks)
      .split(" ")
      .map(akarKata)
      .filter((k) => k.length > 2 && !STOP.has(k)),
  );
}
function trigram(teks) {
  const s = ` ${normal(teks)} `;
  const g = new Map();
  for (let i = 0; i < s.length - 2; i++) {
    const t = s.slice(i, i + 3);
    g.set(t, (g.get(t) ?? 0) + 1);
  }
  return g;
}
function dice(a, b) {
  let sama = 0, na = 0, nb = 0;
  for (const v of a.values()) na += v;
  for (const v of b.values()) nb += v;
  for (const [t, v] of a) sama += Math.min(v, b.get(t) ?? 0);
  return (2 * sama) / (na + nb || 1);
}
function jaccard(a, b) {
  let irisan = 0;
  for (const k of a) if (b.has(k)) irisan++;
  return irisan / (a.size + b.size - irisan || 1);
}

// ---------- muat ----------
const semua = [];
const idTerlihat = new Set();
const perTopik = {};
for (const t of topik) {
  const berkas = join(akar, "public/data/questions", `${t.id}.json`);
  if (!existsSync(berkas)) {
    salah(`${t.id}: file data belum ada`);
    perTopik[t.id] = [];
    continue;
  }
  let data;
  try {
    data = JSON.parse(readFileSync(berkas, "utf8"));
  } catch (e) {
    salah(`${t.id}: JSON rusak (${e.message})`);
    continue;
  }
  perTopik[t.id] = data;
  for (const q of data) {
    const tag = q?.id ?? "(tanpa id)";
    if (typeof q !== "object" || !q) { salah(`${t.id}: entri bukan objek`); continue; }
    if (!/^[a-z0-9-]+-\d{4}$/.test(q.id ?? "")) salah(`${tag}: format id salah`);
    if (idTerlihat.has(q.id)) salah(`${tag}: id ganda`);
    idTerlihat.add(q.id);
    if (q.topic !== t.id) salah(`${tag}: topic "${q.topic}" tidak cocok dengan file ${t.id}`);
    if (!Array.isArray(q.mode) || q.mode.length === 0) salah(`${tag}: mode kosong`);
    if (!["santai", "sedang", "dalam"].includes(q.level)) salah(`${tag}: level "${q.level}" tidak dikenal`);
    if (q.adult !== t.adult) salah(`${tag}: flag adult tidak cocok dengan topik`);
    const teks = String(q.text ?? "");
    if (!teks.endsWith("?")) salah(`${tag}: tidak diakhiri tanda tanya → ${teks}`);
    if ((teks.match(/\?/g) ?? []).length > 1) salah(`${tag}: lebih dari satu tanda tanya → ${teks}`);
    if (/[.!;]\s+\S/.test(teks)) salah(`${tag}: lebih dari satu kalimat → ${teks}`);
    const kata = teks.split(/\s+/).filter(Boolean).length;
    if (kata > MAKS_KATA) salah(`${tag}: ${kata} kata (maks ${MAKS_KATA}) → ${teks}`);
    if (kata < 3) salah(`${tag}: terlalu pendek → ${teks}`);
    if (/\s{2,}|^\s|\s$/.test(teks)) salah(`${tag}: spasi berlebih`);
    if (/\s[,?]/.test(teks)) salah(`${tag}: spasi sebelum tanda baca → ${teks}`);
    semua.push({ ...q, _norm: normal(teks), _isi: kataIsi(teks) });
  }
}

// ---------- duplikat persis ----------
const lihat = new Map();
for (const q of semua) {
  if (lihat.has(q._norm)) salah(`duplikat: ${q.id} = ${lihat.get(q._norm)} → ${q.text}`);
  else lihat.set(q._norm, q.id);
}

// ---------- duplikat makna (indeks terbalik kata isi, lintas topik) ----------
const indeks = new Map();
semua.forEach((q, i) => {
  for (const k of q._isi) {
    if (!indeks.has(k)) indeks.set(k, []);
    indeks.get(k).push(i);
  }
});
const sudah = new Set();
semua.forEach((q, i) => {
  if (q._isi.size < 2) return;
  const kandidat = new Map();
  for (const k of q._isi) {
    const daftar = indeks.get(k);
    if (daftar.length > 600) continue; // kata terlalu umum, tidak membedakan
    for (const j of daftar) if (j > i) kandidat.set(j, (kandidat.get(j) ?? 0) + 1);
  }
  for (const [j, n] of kandidat) {
    if (n < 2) continue;
    const r = semua[j];
    const skor = jaccard(q._isi, r._isi);
    const kunci = `${i}:${j}`;
    if (sudah.has(kunci)) continue;
    sudah.add(kunci);
    if (skor >= AMBANG_GALAT && Math.min(q._isi.size, r._isi.size) >= 2) {
      salah(`makna hampir sama (${skor.toFixed(2)}): ${q.id} "${q.text}" ≈ ${r.id} "${r.text}"`);
    } else if (skor >= AMBANG_PERINGATAN) {
      peringatan.push(`mirip (${skor.toFixed(2)}): ${q.id} "${q.text}" ≈ ${r.id} "${r.text}"`);
    }
  }
});

// ---------- kemiripan huruf dalam satu topik ----------
for (const [id, data] of Object.entries(perTopik)) {
  const g = data.map((q) => trigram(q.text));
  for (let i = 0; i < data.length; i++)
    for (let j = i + 1; j < data.length; j++) {
      const skor = dice(g[i], g[j]);
      if (skor >= AMBANG_TRIGRAM) salah(`kalimat nyaris kembar (${skor.toFixed(2)}) di ${id}: "${data[i].text}" ≈ "${data[j].text}"`);
    }
}

// ---------- jumlah ----------
let total = 0;
const baris = [];
for (const t of topik) {
  const data = perTopik[t.id] ?? [];
  total += data.length;
  const lv = { santai: 0, sedang: 0, dalam: 0 };
  for (const q of data) lv[q.level] = (lv[q.level] ?? 0) + 1;
  if (data.length < MIN_PER_TOPIK) salah(`${t.id}: baru ${data.length} pertanyaan (min ${MIN_PER_TOPIK})`);
  for (const [k, v] of Object.entries(lv)) if (data.length && v < 30) salah(`${t.id}: level ${k} cuma ${v} (min 30)`);
  baris.push(`${t.id.padEnd(26)} ${String(data.length).padStart(4)}  santai ${String(lv.santai).padStart(3)}  sedang ${String(lv.sedang).padStart(3)}  dalam ${String(lv.dalam).padStart(3)}`);
}
if (total < MIN_TOTAL) salah(`total baru ${total} (min ${MIN_TOTAL})`);

console.log(baris.join("\n"));
console.log(`\nTOTAL ${total} pertanyaan di ${topik.length} topik`);
console.log(`peringatan (mirip, bukan galat): ${peringatan.length}`);
if (RINCI) for (const p of peringatan) console.log("  ~ " + p);
if (galat.length) {
  console.log(`\n${galat.length} GALAT:`);
  for (const g of galat.slice(0, 200)) console.log("  ✗ " + g);
  if (galat.length > 200) console.log(`  … dan ${galat.length - 200} lagi`);
  process.exit(1);
}
console.log("\nsemua lolos ✓");
