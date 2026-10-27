import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return <section className="flex min-h-[80dvh] flex-col items-center justify-center px-5 text-center"><h1 className="text-[clamp(6rem,20vw,16rem)] font-semibold leading-none tracking-[-0.1em] text-accent">404</h1><p className="mt-5 text-2xl font-semibold text-text-primary">这里还没有被设计。</p><p className="mt-4 text-muted">页面不存在，回到作品集继续探索。</p><Link to="/" className="btn btn-outline mt-10">返回首页 ↗</Link></section>
}
