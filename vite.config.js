import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Aula Zona Gemelos VIP · sólo el front. Sin servidor ni base de datos: los datos viven en src/data/mock.js
// y lo que el usuario toca se guarda en localStorage. Mismo stack que Aula Core: Vite + React 19 + Tailwind v4.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5610, strictPort: false },
  build: { rollupOptions: { output: { manualChunks: (id) => (/node_modules\/(react|react-dom|react-router|scheduler)\//.test(id) ? 'react' : /node_modules\/lucide-react\//.test(id) ? 'iconos' : undefined) } } },
})
