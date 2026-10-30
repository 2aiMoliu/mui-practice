import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Builds src/unipa-userscript.tsx as one IIFE file for scripts/make-userscript.mjs
// to wrap with the userscript header. No new dependencies needed.
export default defineConfig({
  plugins: [react()],
  // rolldown does not define process.env.NODE_ENV in lib builds; react-dom
  // needs it or the bundle crashes on load outside Vite's own runtime.
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
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
