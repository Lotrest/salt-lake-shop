import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets', // Папка для ассетов
    manifest: true, // генерирует manifest.json для отслеживания хэшей
    rollupOptions: {
      input: './index.html',
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: ({ name }) => {
          // Добавляем хэши для всех статических файлов
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(name ?? '')) {
            return 'assets/images/[name].[hash].[ext]'
          }
          if (/\.(css)$/.test(name ?? '')) {
            return 'assets/css/[name].[hash].[ext]'
          }
          return 'assets/[name].[hash].[ext]'
        },
      },
    },
  },
  preview: {
    historyApiFallback: true
  }
})
