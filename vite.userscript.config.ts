import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Builds src/unipa-userscript.tsx as one IIFE file for scripts/make-userscript.mjs
// to wrap with the userscript header. No new dependencies needed.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-userscript',
    emptyOutDir: true,
    lib: {
      entry: 'src/unipa-userscript.tsx',
      formats: ['iife'],
      name: 'MuiPracticeOverlay',
      fileName: () => 'overlay.js',
    },
  },
})
