import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    react(),
    tailwindcss(),
    !isSsrBuild && VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],
      manifest: {
        name: "Obrolan · Kartu Ngobrol",
        short_name: "Obrolan",
        description: "Kartu pertanyaan deep talk buat pasangan, teman, keluarga, atau diri sendiri.",
        lang: "id",
        start_url: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#5e0d18",
        theme_color: "#5e0d18",
        icons: [
          { src: "/ikon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/ikon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/ikon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // aplikasi + semua kartu ikut tersimpan, jadi tetap bisa main tanpa internet
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}", "data/questions/*.json"],
        globIgnores: ["og.png", "**/*vietnamese*", "**/*latin-ext*"],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: "/index.html",
      },
    }),
  ],
}));
