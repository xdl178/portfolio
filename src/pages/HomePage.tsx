import Hero from '../components/Hero'
import SelectedWorks from '../components/SelectedWorks'
import Explorations from '../components/Explorations'
import Clients from '../components/Clients'

/* ============================================================
   HomePage · 首页漫游
   Hero 巨字取景窗 → 精选作品（跳详情）→ 影像实验室 → 客户墙
   联系与页脚为全局组件（App 层）
   heroActive：由 App 传入（加载屏结束），触发首屏入场编排
   ============================================================ */

type Props = { heroActive: boolean }

export default function HomePage({ heroActive }: Props) {
  return (
    <>
      <Hero active={heroActive} />
      <SelectedWorks />
      <Explorations />
      <Clients />
    </>
  )
}
