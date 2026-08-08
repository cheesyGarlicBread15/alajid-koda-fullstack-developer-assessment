import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    // Proxy API calls to the Laravel backend to avoid CORS in development.
    proxy: {
      '/api': 'http://127.0.0.1:8000',
    },
  },
})
