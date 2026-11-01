import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// base: './' keeps every asset path relative, so the build works from any
// folder or sub-path (GitHub Pages, Netlify, a shared preview link, etc.).
// Two pages: the main invitation (index.html) and the minimalist personal
// invite (personal/index.html, served at <site>/personal/).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        personal: fileURLToPath(new URL('./personal/index.html', import.meta.url)),
      },
    },
  },
})
