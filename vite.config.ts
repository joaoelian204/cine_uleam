import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  base: "/", // Asegurar que la base sea correcta para producción
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    cors: true,
    proxy: {
      "/api": {
        target: "https://kdkblwmwlnpibaysggib.supabase.co",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    sourcemap: false,
    // Optimizaciones para Netlify
    target: "esnext",
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          "vue-vendor": ["vue", "vue-router"],
          "supabase-vendor": ["@supabase/supabase-js"],
          "image-vendor": ["dom-to-image-more", "qrcode", "html2canvas"],
          "ui-vendor": ["@heroicons/vue", "marked"],
          "chart-vendor": ["chart.js", "vue-chartjs"],
        },
        // Optimizar nombres de archivos para caché
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return "assets/[name]-[hash][extname]";

          const fileName = assetInfo.name;

          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(fileName)) {
            return "assets/images/[name]-[hash][extname]";
          } else if (/\.(woff2?|eot|ttf|otf)$/.test(fileName)) {
            return "assets/fonts/[name]-[hash][extname]";
          } else if (/\.(css)$/.test(fileName)) {
            return "assets/css/[name]-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
    // Aumentar límite de advertencia para chunks
    chunkSizeWarningLimit: 1000,
  },
});
