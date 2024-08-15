import { defineConfig } from "vite";
import { resolve } from 'path';

export default defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        index: resolve(__dirname, "src/pages/index.html"),
      },
    },
  },
  server: {
    open: true
  }
});
