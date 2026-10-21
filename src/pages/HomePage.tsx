import Hero from '../components/Hero'
import SelectedWorks from '../components/SelectedWorks'
import Explorations from '../components/Explorations'
import Clients from '../components/Clients'

/* ============================================================
   HomePage · 首页漫游
   Hero 巨字取景窗 → 精选作品（跳详情）→ 影像实验室 → 客户墙
   联系与页脚为全局组件（App 层）
   heroActive：由 App 传入（首屏图加载完成 + 加载屏结束），触发入场编排
   heroBg：App 预加载得到的前景图地址（object URL），避免二次请求
   ============================================================ */

type Props = { heroActive: boolean; heroBg: string | null }

export default function HomePage({ heroActive, heroBg }: Props) {
  return (
    <>
      <Hero active={heroActive} bgSrc={heroBg} />
      <SelectedWorks />
      <Explorations />
      <Clients />
    </>
  )
}
