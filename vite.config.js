import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  envPrefix: 'MOONSHOT_',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    port: 3000,
    open: true,
    // Proxy Moonshot API calls through Vite to avoid CORS
    proxy: {
      '/moonshot-api': {
        target: 'https://api.moonshot.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/moonshot-api/, ''),
        secure: true,
      }
    }
  }
})
