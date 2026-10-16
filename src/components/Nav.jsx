import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EVENT } from '../config/event'
import { Menu, Close } from './Icons'
import Diya from './Diya'

export const NAV = [
  { id: 'welcome', label: 'Welcome' },
  { id: 'journey', label: 'Memories' },
  { id: 'schedule', label: 'The Evening' },
  { id: 'venue', label: 'Venue' },
  { id: 'rsvp', label: 'RSVP' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,border-color] duration-500 ${
        scrolled ? 'border-b border-gold/15 bg-night/80 backdrop-blur-lg' : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <a href="#top" className="group flex items-center gap-2 rounded-full pr-2" aria-label={`${EVENT.title}, back to top`}>
          <Diya className="h-9 w-9" glow={0.8} />
          <span className="font-display text-lg leading-none text-gold-pale">
            Diwali <span className="text-gold">{EVENT.year}</span>
          </span>
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {NAV.slice(0, -1).map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} className="rounded-full px-4 py-2 text-sm text-ivory/75 transition-colors hover:text-gold-pale">
                {n.label}
              </a>
            </li>
          ))}
          <li className="ml-2">
            <a href="#rsvp" className="btn-gold !min-h-0 !px-5 !py-2.5">RSVP</a>
          </li>
        </ul>
        <button
          type="button"
          className="-mr-2 grid h-11 w-11 place-items-center rounded-full text-gold-pale md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <Close className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-16 bottom-0 z-40 bg-night/97 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 pt-8">
              {NAV.map((n, i) => (
                <motion.li key={n.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                  <a
                    href={`#${n.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between border-b border-gold/10 py-4 font-display text-3xl text-ivory"
                  >
                    {n.label}
                    <span className="font-sans text-xs tracking-[0.3em] text-gold/70">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
