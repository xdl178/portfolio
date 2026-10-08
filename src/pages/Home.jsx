import Hero from '../components/sections/Hero.jsx'
import Works from '../components/sections/Works.jsx'
import Services from '../components/sections/Services.jsx'
import About from '../components/sections/About.jsx'
import Contact from '../components/sections/Contact.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <Works limit={4} />
      <Services />
      <About />
      <Contact />
    </>
  )
}
