import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html'
    }
  },
  // Уберите proxy для продакшена
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:8001',
  //       changeOrigin: true,
  //       secure: false
  //     }
  //   }
  // },
  preview: {
    historyApiFallback: true
  }
})