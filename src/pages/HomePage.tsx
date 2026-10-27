import Hero from '../components/Hero'
import SelectedWorks from '../components/SelectedWorks'
import HomeAbout from '../components/HomeAbout'
import Practice from '../components/Practice'
import Explorations from '../components/Explorations'
import './HomePage.css'

type Props = { heroActive: boolean; heroBg: string | null }

export default function HomePage({ heroActive, heroBg }: Props) {
  return (
    <>
      <Hero active={heroActive} bgSrc={heroBg} />
      <HomeAbout />
      <SelectedWorks />
      <Practice />
      <Explorations />
    </>
  )
}
