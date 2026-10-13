
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://localhost:7000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: '../CrapCart/wwwroot',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1024,
  },
})

