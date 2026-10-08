import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ---------------------------------------------------------------------------
// base 路径（关键配置）
//
// 生产构建：部署在 https://xdl178.github.io/portfolio/ 这样的【子路径】下，
//   必须设 base='/portfolio/'，否则打包后的 JS/CSS 会去站点根目录找，全部 404。
// 本地开发：dev server 用 base='/'，这样 http://localhost:5174/ 直接可用，
//   不必再加 /portfolio/ 前缀（之前两边共用会导致本地打不开）。
//
// 换仓库名 / 绑自定义域名时，构建时覆盖即可：
//   PowerShell:  $env:VITE_BASE='/'; npm run build
// ---------------------------------------------------------------------------
export default defineConfig(({ command }) => {
  const isBuild = command === 'build'
  const base = isBuild ? (process.env.VITE_BASE ?? '/portfolio/') : '/'

  return {
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
  }
})
