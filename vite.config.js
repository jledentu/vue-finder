/// <reference types="vitest" />
const path = require("path");
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve("src"),
    },
  },
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name: "Finder",
      formats: ["es", "cjs", "umd"],
      fileName: (format) => `vue-finder.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name == "style.css") {
            return "vue-finder.css";
          }
          return assetInfo.name;
        },
      },
    },
  },
  test: {
    clearMocks: true,
    environment: "happy-dom",
    setupFiles: ["./vitest.setup.js"],
  },
});
