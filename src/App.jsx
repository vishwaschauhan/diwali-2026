import { MotionConfig } from 'framer-motion'
import Nav from './components/Nav'
import StickyRsvp from './components/StickyRsvp'
import Hero from './sections/Hero'
import Welcome from './sections/Welcome'
import Journey from './sections/Journey'
import Schedule from './sections/Schedule'
import LightDiya from './sections/LightDiya'
import Rsvp from './sections/Rsvp'
import Venue from './sections/Venue'
import Share from './sections/Share'
import Finale from './sections/Finale'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a href="#rsvp" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-night">
        Skip to content
      </a>
      <Nav />
      <main>
        {/* Practical details first, the memories and rituals after. */}
        <Hero />
        <Rsvp />
        <Schedule />
        <Venue />
        <Welcome />
        <Journey />
        <LightDiya />
        <Share />
        <Finale />
      </main>
      <StickyRsvp />
    </MotionConfig>
  )
}
