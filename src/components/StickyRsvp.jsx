import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EVENT } from '../config/event'
import { formatDate } from '../lib/time'

/** Compact bottom bar on phones: appears after the hero, hides at the RSVP form. */
export default function StickyRsvp() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('top')
    const rsvp = document.getElementById('rsvp')
    const finale = document.getElementById('finale')
    if (!hero || !rsvp) return
    const state = { hero: true, rsvp: false, finale: false }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) state[e.target.dataset.sticky] = e.isIntersecting
      setShow(!state.hero && !state.rsvp && !state.finale)
    }, { threshold: 0.05 })
    hero.dataset.sticky = 'hero'; rsvp.dataset.sticky = 'rsvp'
    io.observe(hero); io.observe(rsvp)
    if (finale) { finale.dataset.sticky = 'finale'; io.observe(finale) }
    return () => io.disconnect()
  }, [])

  const when = EVENT.date ? formatDate(EVENT.date, { weekday: 'short', month: 'short', day: 'numeric' }) : 'Date coming soon'

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          className="fixed inset-x-3 z-30 md:hidden"
          style={{ bottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          <div className="flex items-center justify-between gap-3 rounded-full border border-gold/25 bg-night/90 py-2 pl-5 pr-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,.9)] backdrop-blur-lg">
            <div className="min-w-0 leading-tight">
              <p className="truncate font-display text-lg text-gold-pale">You're invited</p>
              <p className="truncate text-xs text-ivory/60">{when} · {EVENT.venue.city}</p>
            </div>
            <a href="#rsvp" className="btn-gold !min-h-[44px] shrink-0 !px-6 !py-2.5">RSVP</a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
