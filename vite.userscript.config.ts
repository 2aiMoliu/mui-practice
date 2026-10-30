import { defineConfig } from 'vite'

// Builds src/unipa-userscript.ts (CSS skin injector — no React here) as one
// IIFE file for scripts/make-userscript.mjs to wrap with the userscript header.
export default defineConfig({
  build: {
    outDir: 'dist-userscript',
    emptyOutDir: true,
    lib: {
      entry: 'src/unipa-userscript.ts',
      formats: ['iife'],
      name: 'MuiPracticeSkin',
      fileName: () => 'overlay.js',
    },
  },
})
