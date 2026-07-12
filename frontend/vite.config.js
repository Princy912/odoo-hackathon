import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),   // Tailwind CSS v4 — no PostCSS config needed
  ],
  server: {
    port: 5173,
    proxy: {
      // Proxy /api calls to the Spring Boot backend during development
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
