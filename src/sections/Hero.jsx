import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { EVENT } from '../config/event'
import { formatDate, startLabel, tzAbbrev } from '../lib/time'
import Diya from '../components/Diya'
import Particles from '../components/Particles'
import { Rangoli, Lantern } from '../components/Ornaments'
import { Calendar, Clock, Pin, ArrowDown, Directions } from '../components/Icons'
import { mapsUrl } from '../lib/venue'

const HEADLINE = '10 YEARS OF LIGHT'
const ease = [0.22, 1, 0.36, 1]

export default function Hero() {
  const reduce = useReducedMotion()
  const [lit, setLit] = useState(reduce)

  useEffect(() => {
    if (reduce) { setLit(true); return }
    const t = setTimeout(() => setLit(true), 450)
    return () => clearTimeout(t)
  }, [reduce])

  const fade = (delay, y = 18) =>
    reduce ? {} : { initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay, ease } }

  const dateText = EVENT.date ? formatDate(EVENT.date) : 'Date to be announced'
  const timeText = `${startLabel()}${EVENT.date ? ` ${tzAbbrev()}` : ''}`

  return (
    <section
      id="top"
      className="grain relative isolate flex min-h-[100svh] items-center overflow-hidden bg-night-deep pt-16 pb-10"
      aria-labelledby="hero-title"
    >
      {/* Atmosphere */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_35%,#2a2244_0%,#11172b_45%,#070a14_100%)]" />
        <div className="absolute left-1/2 top-[30%] h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(242,169,59,.22)_0%,rgba(133,58,70,.12)_35%,transparent_65%)]" />
        <div className="absolute -bottom-1/3 left-1/2 h-[70vmax] w-[120vmax] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse,rgba(133,58,70,.35)_0%,transparent_60%)]" />
        <Rangoli className="absolute left-1/2 top-[30%] w-[min(130vw,900px)] -translate-x-1/2 -translate-y-1/2" opacity={0.1} />
        <Particles />
      </div>

      {/* Lanterns (tablet+) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-[5%] top-16 hidden w-10 md:block lg:left-[7%] lg:w-14"
        {...(reduce ? {} : { initial: { y: -80, opacity: 0 }, animate: { y: 0, opacity: 0.9 }, transition: { duration: 1.6, delay: 1.2, ease } })}
      >
        <Lantern />
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-[6%] top-16 hidden w-8 md:block lg:right-[9%] lg:w-11"
        {...(reduce ? {} : { initial: { y: -100, opacity: 0 }, animate: { y: 0, opacity: 0.75 }, transition: { duration: 1.8, delay: 1.4, ease } })}
      >
        <Lantern />
      </motion.div>

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-4 text-center sm:px-6">
        <motion.div {...fade(0.1, 10)} className="relative">
          <Diya lit={lit} className="h-24 w-24 sm:h-36 sm:w-36" glow={1.3} animate={!reduce} />
        </motion.div>

        {/* 10 YEARS OF LIGHT — letter by letter */}
        <p className="mt-2 flex items-center gap-3 sm:mt-3 sm:gap-4" aria-label={HEADLINE}>
          <motion.span aria-hidden="true" className="h-px w-8 bg-gradient-to-r from-transparent to-gold sm:w-16" {...fade(1.2, 0)} />
          <span aria-hidden="true" className="font-sans text-[0.78rem] font-semibold tracking-[0.42em] text-gold sm:text-base">
            {HEADLINE.split('').map((ch, i) => (
              <motion.span
                key={i}
                className="inline-block"
                {...(reduce
                  ? {}
                  : { initial: { opacity: 0, y: 8, filter: 'blur(6px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, transition: { duration: 0.6, delay: 0.7 + i * 0.045, ease } })}
              >
                {ch === ' ' ? ' ' : ch}
              </motion.span>
            ))}
          </span>
          <motion.span aria-hidden="true" className="h-px w-8 bg-gradient-to-l from-transparent to-gold sm:w-16" {...fade(1.2, 0)} />
        </p>

        <motion.h1 id="hero-title" {...fade(1.55, 24)} className="display mt-4 text-[3.6rem] italic text-ivory sm:mt-6 sm:text-8xl lg:text-[8.5rem]">
          You're <span className="gold-text pr-2">Invited</span>
        </motion.h1>

        <motion.p {...fade(1.8)} className="mt-3 font-display text-2xl text-gold-pale sm:mt-4 sm:text-4xl">
          {EVENT.title}
        </motion.p>

        <motion.p {...fade(2)} className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-ivory/75 sm:mt-6 sm:text-lg">
          Ten years of lighting diyas, making memories, and enthusiastically overestimating our dancing abilities.
        </motion.p>

        <motion.ul {...fade(2.2)} className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm sm:mt-8 sm:gap-3" aria-label="Event details">
          <Detail icon={<Calendar className="h-4 w-4" />}>{dateText}</Detail>
          <Detail icon={<Clock className="h-4 w-4" />}>{timeText}</Detail>
          <LocationDetail />
        </motion.ul>

        <motion.div {...fade(2.4)} className="mt-6 flex w-full flex-row items-center justify-center gap-3 sm:mt-10 sm:w-auto sm:gap-4">
          <a href="#rsvp" className="btn-gold flex-1 sm:flex-none sm:!px-9">RSVP Now</a>
          <a href="#welcome" className="btn-ghost flex-1 sm:flex-none sm:!px-8"><span>Explore<span className="hidden sm:inline"> the Celebration</span></span></a>
        </motion.div>
      </div>

      <motion.a
        href="#welcome"
        aria-label="Scroll to the welcome note"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-ivory/45 sm:flex"
        {...(reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 1, y: [0, 6, 0] }, transition: { opacity: { delay: 3 }, y: { duration: 2.4, repeat: Infinity, delay: 3 } } })}
      >
        Scroll <ArrowDown className="h-4 w-4" />
      </motion.a>
    </section>
  )
}

// Public address: the pill opens Google Maps directions. Otherwise it jumps to the venue section.
function LocationDetail() {
  const url = EVENT.venue.addressMode === 'public' ? mapsUrl(EVENT.venue.address) : null
  const label = `${EVENT.venue.city}, Texas`
  return (
    <li>
      <a
        href={url || '#venue'}
        {...(url ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        aria-label={url ? `${label}: get directions in Google Maps` : `${label}: venue details`}
        className="flex items-center gap-2 rounded-full border border-gold/25 bg-white/[0.04] py-1.5 pl-3.5 pr-1.5 text-ivory/90 backdrop-blur-sm transition-colors hover:border-gold/60"
      >
        <span className="text-gold"><Pin className="h-4 w-4" /></span>
        {label}
        <span className="grid h-7 w-7 place-items-center rounded-full bg-gold text-night" aria-hidden="true">
          <Directions className="h-4 w-4" />
        </span>
      </a>
    </li>
  )
}

function Detail({ icon, children }) {
  return (
    <li className="flex items-center gap-2 rounded-full border border-gold/25 bg-white/[0.04] px-3.5 py-2 text-ivory/90 backdrop-blur-sm">
      <span className="text-gold">{icon}</span>
      {children}
    </li>
  )
}
