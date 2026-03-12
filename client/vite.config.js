import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/auth": "http://localhost:8080",
      "/users": "http://localhost:8080",
      "/books": "http://localhost:8080",
      "/cart": "http://localhost:8080",
      "/orders": "http://localhost:8080",
    },
  },
})
