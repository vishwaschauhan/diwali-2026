import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// base: './' keeps every asset path relative, so the build works from any
// folder or sub-path (GitHub Pages, Netlify, a shared preview link, etc.).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
