import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 部署在 https://<user>.github.io/<repo>/ 这样的子路径下，
// 因此必须显式设置 base，否则打包后的 JS/CSS 会去根路径找而 404。
//
// 默认按仓库名 portfolio 配置。换仓库名 / 绑自定义域名时：
//   - 自定义域名或部署到根路径 -> 设 VITE_BASE=/ 再构建
//   - PowerShell 里的写法：$env:VITE_BASE='/'; npm run build
const base = process.env.VITE_BASE ?? '/portfolio/'

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5174,
  },
  build: {
    target: 'es2019',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router-dom') || id.includes('react/') || id.includes('react-dom')) {
              return 'react-vendor'
            }
            if (id.includes('framer-motion')) {
              return 'motion-vendor'
            }
          }
        },
      },
    },
  },
})
