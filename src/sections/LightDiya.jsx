import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EVENT } from '../config/event'
import Diya from '../components/Diya'

const years = Array.from({ length: EVENT.edition }, (_, i) => EVENT.firstYear + i)

const MESSAGES = {
  first: "Here's to another year of light, laughter, and togetherness.",
  some: 'Every flame here is an evening we shared. Keep going.',
  all: 'A decade, fully lit. Thank you for being part of every chapter.',
}

export default function LightDiya() {
  const reduce = useReducedMotion()
  const [lit, setLit] = useState(() => new Set())
  const count = lit.size
  const all = count === years.length

  const toggle = (y) => setLit((s) => { const n = new Set(s); n.has(y) ? n.delete(y) : n.add(y); return n })
  const lightAll = () => setLit(new Set(years))

  const msg = all ? MESSAGES.all : count >= 3 ? MESSAGES.some : count ? MESSAGES.first : null

  return (
    <section id="light" className="relative overflow-clip bg-night-deep py-24 sm:py-32" aria-labelledby="light-title">
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[80vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(242,169,59,.35),rgba(133,58,70,.15)_40%,transparent_70%)]"
        animate={{ opacity: 0.1 + (count / years.length) * 0.9 }}
        transition={{ duration: reduce ? 0 : 1.2 }}
      />
      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
        <p className="eyebrow">A small ritual</p>
        <h2 id="light-title" className="display mt-4 text-[2.6rem] text-ivory sm:text-6xl">
          Light a diya <span className="gold-text italic">for every year</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-ivory/65">Tap a diya to light it. One for each celebration since {EVENT.firstYear}.</p>

        <ul className="mx-auto mt-12 grid max-w-3xl grid-cols-5 gap-x-2 gap-y-6 sm:mt-16 sm:grid-cols-10 sm:gap-x-1">
          {years.map((y, i) => {
            const on = lit.has(y)
            return (
              <li key={y} className={`flex justify-center ${!reduce ? (i % 2 ? 'sm:translate-y-3' : '') : ''}`}>
                <button
                  type="button"
                  aria-pressed={on}
                  aria-label={`${on ? 'Diya lit' : 'Light the diya'} for ${y}`}
                  onClick={() => toggle(y)}
                  className="group flex min-h-[44px] w-full flex-col items-center rounded-2xl pb-1 pt-0 transition-transform active:scale-95"
                >
                  <Diya lit={on} className={`h-16 w-16 transition-[transform,opacity,filter] duration-700 group-hover:-translate-y-0.5 sm:h-[4.5rem] sm:w-[4.5rem] ${on ? '' : 'opacity-55 saturate-[.6] group-hover:opacity-90'}`} glow={y === EVENT.year ? 1.5 : 1} animate={!reduce} />
                  <span className={`mt-1 text-xs tabular-nums transition-colors ${on ? 'text-gold-light' : 'text-ivory/40'}`}>{y}</span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="mt-10 min-h-[5.5rem]" aria-live="polite">
          <AnimatePresence mode="wait">
            {msg && (
              <motion.p
                key={msg}
                initial={reduce ? false : { opacity: 0, y: 8, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.6 }}
                className="mx-auto max-w-xl font-display text-2xl italic leading-snug text-gold-pale sm:text-3xl"
              >
                {msg}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-2 flex items-center justify-center gap-4 text-sm">
          <span className="text-ivory/45">{count} of {years.length} lit</span>
          {!all && (
            <button type="button" onClick={lightAll} className="min-h-11 rounded-full px-3 text-gold underline decoration-gold/40 underline-offset-4 hover:text-gold-light">
              Light them all
            </button>
          )}
          {count > 0 && (
            <button type="button" onClick={() => setLit(new Set())} className="min-h-11 rounded-full px-3 text-ivory/50 hover:text-ivory">
              Reset
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
