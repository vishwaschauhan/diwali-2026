import { useEffect, useState } from 'react'
import { MotionConfig, motion, useReducedMotion } from 'framer-motion'
import { EVENT } from '../config/event'
import { formatDate, startLabel } from '../lib/time'
import { mapsUrl } from '../lib/venue'
import Diya from '../components/Diya'
import Particles from '../components/Particles'
import Reveal from '../components/Reveal'
import StickyRsvp from '../components/StickyRsvp'
import { Rangoli, Lantern, Garland } from '../components/Ornaments'
import { Calendar, Clock, Pin, ArrowDown, Directions } from '../components/Icons'
import Rsvp from '../sections/Rsvp'
import Schedule from '../sections/Schedule'
import Venue from '../sections/Venue'

/**
 * Personal invitation for friends outside the yearly tradition. Same look,
 * date, schedule, venue and Google Form as the main site, but just the two
 * hosts inviting you: no decade / fellowship / tradition framing.
 */
const P = EVENT.personalInvite
const HOSTS = EVENT.hosts.names.join(' & ')
const CAL_COPY = {
  summary: `Diwali at ${HOSTS}'`,
  intro: `Diwali celebration at ${HOSTS}' home.`,
  url: EVENT.siteUrl ? `${EVENT.siteUrl}${P.path}` : '',
}
const ease = [0.22, 1, 0.36, 1]

export default function PersonalInvite() {
  return (
    <MotionConfig reducedMotion="user">
      <main>
        <Hero />
        <Rsvp calendarCopy={CAL_COPY} />
        <Schedule personal />
        <Venue personal />
        <Closing />
      </main>
      <StickyRsvp />
    </MotionConfig>
  )
}

function Hero() {
  const reduce = useReducedMotion()
  const [lit, setLit] = useState(reduce)
  useEffect(() => {
    const t = setTimeout(() => setLit(true), reduce ? 0 : 450)
    return () => clearTimeout(t)
  }, [reduce])

  const fade = (delay, y = 18) =>
    reduce ? {} : { initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay, ease } }
  const eyebrow = P.eyebrow.toUpperCase()
  const words = P.title.split(' ')
  const last = words.pop()

  return (
    <section id="top" className="grain relative isolate flex min-h-[100svh] items-center overflow-hidden bg-night-deep pb-10 pt-16" aria-labelledby="hero-title">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_35%,#2a2244_0%,#11172b_45%,#070a14_100%)]" />
        <div className="absolute left-1/2 top-[30%] h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(242,169,59,.22)_0%,rgba(133,58,70,.12)_35%,transparent_65%)]" />
        <div className="absolute -bottom-1/3 left-1/2 h-[70vmax] w-[120vmax] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse,rgba(133,58,70,.35)_0%,transparent_60%)]" />
        <Rangoli className="absolute left-1/2 top-[30%] w-[min(130vw,900px)] -translate-x-1/2 -translate-y-1/2" opacity={0.1} />
        <Particles />
      </div>

      <motion.div aria-hidden="true" className="pointer-events-none absolute left-[5%] top-16 hidden w-10 md:block lg:left-[7%] lg:w-14"
        {...(reduce ? {} : { initial: { y: -80, opacity: 0 }, animate: { y: 0, opacity: 0.9 }, transition: { duration: 1.6, delay: 1.2, ease } })}>
        <Lantern />
      </motion.div>
      <motion.div aria-hidden="true" className="pointer-events-none absolute right-[6%] top-16 hidden w-8 md:block lg:right-[9%] lg:w-11"
        {...(reduce ? {} : { initial: { y: -100, opacity: 0 }, animate: { y: 0, opacity: 0.75 }, transition: { duration: 1.8, delay: 1.4, ease } })}>
        <Lantern />
      </motion.div>

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-4 text-center sm:px-6">
        <motion.div {...fade(0.1, 10)}>
          <Diya lit={lit} className="h-24 w-24 sm:h-36 sm:w-36" glow={1.3} animate={!reduce} />
        </motion.div>

        <p className="mt-2 flex items-center gap-3 sm:mt-3 sm:gap-4" aria-label={P.eyebrow}>
          <motion.span aria-hidden="true" className="h-px w-8 bg-gradient-to-r from-transparent to-gold sm:w-16" {...fade(1.2, 0)} />
          <span aria-hidden="true" className="font-sans text-[0.78rem] font-semibold tracking-[0.42em] text-gold sm:text-base">
            {eyebrow.split('').map((ch, i) => (
              <motion.span key={i} className="inline-block"
                {...(reduce ? {} : { initial: { opacity: 0, y: 8, filter: 'blur(6px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, transition: { duration: 0.6, delay: 0.7 + i * 0.045, ease } })}>
                {ch === ' ' ? ' ' : ch}
              </motion.span>
            ))}
          </span>
          <motion.span aria-hidden="true" className="h-px w-8 bg-gradient-to-l from-transparent to-gold sm:w-16" {...fade(1.2, 0)} />
        </p>

        <motion.h1 id="hero-title" {...fade(1.55, 24)} className="display mt-4 text-[3.6rem] italic text-ivory sm:mt-6 sm:text-8xl lg:text-[8.5rem]">
          {words.join(' ')} <span className="gold-text pr-2">{last}</span>
        </motion.h1>

        <motion.p {...fade(1.8)} className="mt-3 max-w-2xl text-balance font-display text-2xl text-gold-pale sm:mt-4 sm:text-4xl">
          {P.headline}
        </motion.p>

        <motion.ul {...fade(2.2)} className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm sm:mt-8 sm:gap-3" aria-label="Event details">
          <Detail icon={<Calendar className="h-4 w-4" />}>{formatDate(EVENT.date)}</Detail>
          <Detail icon={<Clock className="h-4 w-4" />}>{startLabel()}</Detail>
          <LocationDetail />
        </motion.ul>

        <motion.div {...fade(2.4)} className="mt-6 flex w-full flex-row items-center justify-center gap-3 sm:mt-10 sm:w-auto sm:gap-4">
          <a href="#rsvp" className="btn-gold flex-1 sm:flex-none sm:!px-9">RSVP Now</a>
          <a href="#schedule" className="btn-ghost flex-1 sm:flex-none sm:!px-8"><span>See the<span className="hidden sm:inline"> evening's</span> plan</span></a>
        </motion.div>
      </div>

      <motion.a href="#rsvp" aria-label="Scroll to RSVP"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-ivory/45 sm:flex"
        {...(reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 1, y: [0, 6, 0] }, transition: { opacity: { delay: 3 }, y: { duration: 2.4, repeat: Infinity, delay: 3 } } })}>
        Scroll <ArrowDown className="h-4 w-4" />
      </motion.a>
    </section>
  )
}

function LocationDetail() {
  const url = EVENT.venue.addressMode === 'public' ? mapsUrl(EVENT.venue.address) : null
  const label = `${EVENT.venue.city}, Texas`
  return (
    <li>
      <a href={url || '#venue'} {...(url ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        aria-label={url ? `${label}: get directions in Google Maps` : `${label}: venue details`}
        className="flex items-center gap-2 rounded-full border border-gold/25 bg-white/[0.04] py-1.5 pl-3.5 pr-1.5 text-ivory/90 backdrop-blur-sm transition-colors hover:border-gold/60">
        <span className="text-gold"><Pin className="h-4 w-4" /></span>
        {label}
        <span className="grid h-7 w-7 place-items-center rounded-full bg-gold text-night" aria-hidden="true"><Directions className="h-4 w-4" /></span>
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

function Closing() {
  return (
    <section id="finale" className="grain relative isolate overflow-clip bg-night-deep pb-28 pt-28 text-center sm:pb-24 sm:pt-36" aria-labelledby="finale-title">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(242,169,59,.28),rgba(133,58,70,.18)_40%,transparent_75%)]" aria-hidden="true" />
      <Particles density={0.6} />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal as="p" className="eyebrow">See you under the lights</Reveal>
        <Reveal as="h2" id="finale-title" delay={0.05} className="display mt-6 text-balance text-[2.5rem] text-ivory sm:text-6xl">
          {P.signOff}<br />
          <span className="gold-text italic">{HOSTS}</span>
        </Reveal>
        <Reveal delay={0.12} className="mt-10 flex justify-center">
          <a href="#rsvp" className="btn-gold !px-10 !py-4 text-base">RSVP Now</a>
        </Reveal>
        <Reveal delay={0.2} className="mt-16 flex items-end justify-center gap-2" aria-hidden="true">
          {[0.7, 0.85, 1, 1.25, 1, 0.85, 0.7].map((s, i) => <Diya key={i} className="h-14 w-14" glow={s} />)}
        </Reveal>
        <Garland className="mx-auto mt-12 h-8 w-full max-w-md opacity-70" />
        <p className="mt-6 text-xs text-ivory/35">{EVENT.venue.city}, Texas · Shubh Deepavali</p>
      </div>
    </section>
  )
}
