import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ---------------------------------------------------------------------------
// base 用相对路径 './'，打包产物可直接丢到任意静态托管或本地打开
// ---------------------------------------------------------------------------
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5180,
  },
  build: {
    target: 'es2019',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('gsap')) return 'gsap-vendor'
            if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils'))
              return 'motion-vendor'
            if (id.includes('react-router')) return 'router-vendor'
            if (id.includes('react')) return 'react-vendor'
          }
        },
      },
    },
  },
})
