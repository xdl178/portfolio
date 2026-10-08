import { Link } from 'react-router-dom'
import FlowingMenu from '../ui/FlowingMenu.jsx'
import { profile, navLinks } from '../../data/content.js'

/* 在模块作用域取年份：组件里调用 new Date() 属于渲染期副作用，会破坏 React 的纯度约束 */
const YEAR = new Date().getFullYear()

/* 页脚大菜单：悬停时整行展开并带流动色带 */
const FOOTER_MENU = [
  { link: '#/', text: '首页', subtitle: 'Home', tags: ['Hero', '精选作品'], accent: '#4D6BFE' },
  { link: '#/works', text: '作品', subtitle: 'Works', tags: ['项目', '案例'], accent: '#00C2FF' },
  { link: '#/about', text: '关于', subtitle: 'About', tags: ['经历', '技能'], accent: '#7C4DFF' },
  { link: '#/#contact', text: '联系', subtitle: 'Contact', tags: ['合作', '邀约'], accent: '#3A55E8' },
]

export default function Footer() {
  const go = (link) => {
    if (link.type === 'route') return link.to
    return `/${link.to.split('#')[1] ? `#${link.to.split('#')[1]}` : ''}`
  }

  return (
    <footer className="border-t border-line bg-wash">
      {/* 大菜单：鼠标悬停整行展开，带流动色带 */}
      <div className="border-b border-line">
        <FlowingMenu
          items={FOOTER_MENU}
          bgColor="#F6F8FC"
          borderColor="#E2E8F0"
          textColor="#0B1220"
          speed={16}
        />
      </div>

      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* 品牌 */}
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient font-mono text-meta font-bold text-white">
                {profile.logoText}
              </span>
              <span className="font-display text-body font-semibold text-ink">{profile.name}</span>
            </div>
            <p className="mt-5 max-w-[36ch] text-body-sm text-slate-soft">
              占位：一句话站点简介，例如「个人作品集与技术笔记，长期更新」。
            </p>
          </div>

          {/* 导航 */}
          <nav aria-label="页脚导航">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-faint">导航</h3>
            <ul className="mt-4 space-y-2">
              {navLinks.map((link) =>
                link.type === 'route' ? (
                  <li key={link.label}>
                    <Link to={link.to} className="link-underline text-body-sm">
                      {link.label}
                    </Link>
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link to={go(link)} className="link-underline text-body-sm">
                      {link.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          {/* 联系 */}
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-faint">联系</h3>
            <ul className="mt-4 space-y-2 text-body-sm">
              {profile.contact.email && (
                <li>
                  <a href={`mailto:${profile.contact.email}`} className="link-underline">
                    {profile.contact.email}
                  </a>
                </li>
              )}
              {profile.contact.github && (
                <li>
                  <a href={profile.contact.github} target="_blank" rel="noreferrer" className="link-underline">
                    GitHub
                  </a>
                </li>
              )}
              <li className="text-slate-faint">{profile.location}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <p className="font-mono text-meta text-slate-faint">
            © {YEAR} {profile.name}. All rights reserved.
          </p>
          <p className="font-mono text-meta text-slate-faint">
            使用 Vite · React · Tailwind 构建
          </p>
        </div>
      </div>
    </footer>
  )
}
