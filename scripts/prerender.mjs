// Sisipkan HTML beranda hasil render ke dist/index.html (dijalankan setelah build SSR).
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const akar = join(dirname(fileURLToPath(import.meta.url)), "..");
const { render } = await import(pathToFileURL(join(akar, "dist-ssr/prerender.js")).href);
const html = render();
const berkas = join(akar, "dist/index.html");
const isi = readFileSync(berkas, "utf8");
if (!isi.includes('<div id="root"></div>')) throw new Error("penanda #root tidak ditemukan");
writeFileSync(berkas, isi.replace('<div id="root"></div>', `<div id="root"><div data-pra>${html}</div></div>`));
rmSync(join(akar, "dist-ssr"), { recursive: true, force: true });
console.log(`prerender: beranda ${(html.length / 1024).toFixed(1)} KB disisipkan`);
