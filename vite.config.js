import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_TMDB_API_KEY': JSON.stringify(process.env.VITE_TMDB_API_KEY),
    'process.env.VITE_TMDB_BASE_URL': JSON.stringify(process.env.VITE_TMDB_BASE_URL),
    'process.env.VITE_TMDB_IMAGE_BASE_URL': JSON.stringify(process.env.VITE_TMDB_IMAGE_BASE_URL),
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
