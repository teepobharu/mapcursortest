import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Allows GitHub Pages to serve under /<repo>/ when set via env in CI
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
})
