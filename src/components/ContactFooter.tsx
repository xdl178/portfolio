import { Link, useLocation } from 'react-router-dom'

export default function ContactFooter() {
  const { pathname } = useLocation()
  const backTop = () => {
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
    }
  }

  return (
    <footer className="border-t border-paper/10 bg-bg">
      <div className="mx-auto flex max-w-[1380px] flex-col gap-6 px-5 py-8 text-xs text-muted md:flex-row md:items-center md:justify-between md:px-10 lg:px-16">
        <p>© {new Date().getFullYear()} DESIGN PORTFOLIO</p>
        <nav aria-label="页脚导航" className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link to="/" onClick={backTop} className="hover:text-text-primary">首页</Link>
          <Link to="/works" className="hover:text-text-primary">精选作品</Link>
          <Link to="/about" className="hover:text-text-primary">关于我</Link>
          <a href="mailto:3112516515@qq.com" className="hover:text-text-primary">联系我</a>
        </nav>
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })} className="self-start text-text-primary hover:text-accent">回到顶部 ↑</button>
      </div>
    </footer>
  )
}
