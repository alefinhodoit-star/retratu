import { fileURLToPath, URL } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // O plugin do Base44 fornecia este alias; agora é declarado aqui.
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // Em desenvolvimento a API corre no processo do servidor (porta 3001).
      '/api': {
        target: process.env.API_URL || 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
