import { Routes, Route, Link } from 'react-router-dom'

function Home() {
  return (
    <>
      <p className="font-mono text-expo-eyebrow uppercase text-blood">Portfolio / 2026</p>
      <h1 className="mt-6 font-display text-brut-headline text-paper">
        你好，我是 xdl178
      </h1>
      <p className="mt-6 max-w-content text-peach-lead text-bone">
        这是我的个人主页骨架。技术栈已经装好并与参考站保持一致：
        Vite + React 19 + Tailwind + framer-motion + GSAP + Lenis + JSX 路由。
        接下来在这里写你自己的页面。
      </p>
      <nav className="mt-10 flex flex-wrap gap-4">
        <Link
          to="/works"
          className="border-2 border-paper px-6 py-3 font-mono text-body-sm uppercase tracking-expo-track text-paper shadow-brut-press transition hover:bg-paper hover:text-ink"
        >
          查看 Works
        </Link>
        <a
          href="https://vite.dev/guide/"
          target="_blank"
          rel="noreferrer"
          className="border-2 border-concrete px-6 py-3 font-mono text-body-sm uppercase tracking-expo-track text-bone transition hover:border-paper hover:text-paper"
        >
          Vite 文档
        </a>
      </nav>
    </>
  )
}

function Works() {
  return (
    <>
      <p className="font-mono text-expo-eyebrow uppercase text-blood">Selected Works</p>
      <h1 className="mt-6 font-display text-brut-headline text-paper">作品列表</h1>
      <p className="mt-6 max-w-content text-peach-lead text-bone">
        这里是 <code className="font-mono text-ochre">/works</code> 路由，用来看
        HashRouter 是否工作：刷新页面、直接访问链接都不应该 404。
      </p>
      <Link
        to="/"
        className="mt-10 inline-block border-2 border-paper px-6 py-3 font-mono text-body-sm uppercase tracking-expo-track text-paper shadow-brut-press transition hover:bg-paper hover:text-ink"
      >
        返回首页
      </Link>
    </>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-ink bg-grain px-6 py-24">
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/works" element={<Works />} />
          <Route
            path="*"
            element={
              <div>
                <h1 className="font-display text-brut-headline text-paper">404</h1>
                <Link to="/" className="mt-6 inline-block text-bone underline">
                  返回首页
                </Link>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  )
}
