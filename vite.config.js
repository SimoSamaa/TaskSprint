import { defineConfig } from "vite";
import { resolve } from 'path';

export default defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
    assetsInclude: ['**/*.css'],
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        index: resolve(__dirname, "src/pages/index.html"),
        login: resolve(__dirname, "src/pages/login.html"),
        dashboard: resolve(__dirname, "src/pages/dashboard.html"),
      },
    },
  },
  server: {
    open: true
  }
});
