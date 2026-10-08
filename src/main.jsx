import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// 用 HashRouter 而不是 BrowserRouter：
// GitHub Pages 是纯静态托管，无法给 /works 这类深链接做服务端回退到 index.html，
// 用 hash 路由（#/works）刷新和直接访问都不会 404，不需要额外的 404.html hack。
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
