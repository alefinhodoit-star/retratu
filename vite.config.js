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
});
