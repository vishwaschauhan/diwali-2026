import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EVENT } from '../config/event'
import { chapters } from '../lib/photos'
import { SectionHeading } from '../components/Reveal'
import Reveal from '../components/Reveal'
import Photo from '../components/Photo'
import Lightbox from '../components/Lightbox'
import Diya from '../components/Diya'
import { Chevron, Arrow } from '../components/Icons'

const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}
const PREVIEW = 7

export default function Journey() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(null)
  const tabRefs = useRef([])
  const railRef = useRef(null)
  const chapter = chapters[active]
  const isTenth = chapter.year === EVENT.year

  // Keep the selected year visible in the scrollable rail on phones.
  useEffect(() => {
    const el = tabRefs.current[active]
    const rail = railRef.current
    if (!el || !rail) return
    const left = el.offsetLeft - rail.clientWidth / 2 + el.clientWidth / 2
    rail.scrollTo({ left, behavior: reduce ? 'auto' : 'smooth' })
  }, [active, reduce])

  const select = (i, focus = false) => {
    const n = (i + chapters.length) % chapters.length
    setActive(n)
    if (focus) tabRefs.current[n]?.focus()
  }

  const onKeyDown = (e) => {
    const map = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }
    if (e.key in map) { e.preventDefault(); select(active + map[e.key], true) }
    if (e.key === 'Home') { e.preventDefault(); select(0, true) }
    if (e.key === 'End') { e.preventDefault(); select(chapters.length - 1, true) }
  }

  return (
    <section id="journey" className="grain relative overflow-clip bg-night py-24 sm:py-32" aria-labelledby="journey-title">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(133,58,70,.25),transparent_70%)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={`${EVENT.firstYear} — ${EVENT.year}`}
          title={<span id="journey-title">The Fellowship of the Diyas</span>}
          intro="Ten years, one fellowship. Pick a year and journey back."
        />

        {/* ---------------------------------------------------- Year rail */}
        <Reveal delay={0.1} className="relative mt-14 sm:mt-20">
          <div className="pointer-events-none absolute left-0 right-0 top-[27px] h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" aria-hidden="true" />
          <div
            ref={railRef}
            role="tablist"
            aria-label="Choose a year"
            onKeyDown={onKeyDown}
            className="no-scrollbar relative -mx-4 flex snap-x snap-mandatory gap-1 overflow-x-auto px-[calc(50vw-40px)] pb-2 sm:mx-0 sm:justify-between sm:overflow-visible sm:px-0"
          >
            {chapters.map((c, i) => {
              const selected = i === active
              const tenth = c.year === EVENT.year
              const lit = i <= active
              return (
                <button
                  key={c.year}
                  ref={(el) => (tabRefs.current[i] = el)}
                  role="tab"
                  id={`tab-${c.year}`}
                  aria-selected={selected}
                  aria-controls={`panel-${c.year}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  className="group relative flex w-20 shrink-0 snap-center flex-col items-center gap-2 rounded-2xl pt-0 pb-2 sm:w-auto sm:flex-1"
                >
                  <span className="relative grid h-14 w-14 place-items-center">
                    <span
                      className={`absolute inset-0 rounded-full transition-all duration-700 ${
                        selected ? 'scale-100 bg-[radial-gradient(circle,rgba(242,169,59,.45),transparent_70%)]' : 'scale-50 opacity-0'
                      }`}
                      aria-hidden="true"
                    />
                    <Diya lit={lit} className={`relative transition-all duration-500 ${selected ? 'h-12 w-12' : 'h-9 w-9 opacity-80 group-hover:opacity-100'}`} glow={selected ? 1.2 : 0.5} animate={selected && !reduce} />
                  </span>
                  <span className={`font-display text-xl tabular-nums transition-colors sm:text-2xl ${selected ? 'text-gold-pale' : 'text-ivory/50 group-hover:text-ivory/80'}`}>
                    {c.year}
                  </span>
                  {tenth && (
                    <span className="absolute -top-3 rounded-full bg-ruby px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-ivory shadow-[0_0_20px_rgba(133,58,70,.8)]">
                      10th
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* ---------------------------------------------------- Panel */}
        <div className="relative mt-10 sm:mt-14">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={chapter.year}
              id={`panel-${chapter.year}`}
              role="tabpanel"
              aria-labelledby={`tab-${chapter.year}`}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,2fr)] lg:gap-12"
            >
              <ChapterIntro chapter={chapter} index={active} />
              {isTenth ? (
                <TenthChapter />
              ) : chapter.photos.length ? (
                <Gallery chapter={chapter} onOpen={setLightbox} />
              ) : (
                <EmptyChapter chapter={chapter} />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-between gap-4 border-t border-gold/15 pt-6">
            <button type="button" onClick={() => select(active - 1)} disabled={active === 0}
              className="flex min-h-11 items-center gap-2 rounded-full px-2 text-sm text-ivory/70 transition-colors hover:text-gold-pale disabled:opacity-30">
              <Chevron dir="left" className="h-4 w-4" />
              {active > 0 ? chapters[active - 1].year : 'Start'}
            </button>
            <p className="text-xs uppercase tracking-[0.3em] text-ivory/40">Chapter {active + 1} of {chapters.length}</p>
            <button type="button" onClick={() => select(active + 1)} disabled={active === chapters.length - 1}
              className="flex min-h-11 items-center gap-2 rounded-full px-2 text-sm text-ivory/70 transition-colors hover:text-gold-pale disabled:opacity-30">
              {active < chapters.length - 1 ? chapters[active + 1].year : 'End'}
              <Chevron className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <Lightbox
        photos={chapter.photos}
        index={lightbox}
        onIndex={setLightbox}
        onClose={() => setLightbox(null)}
        title={`Diwali ${chapter.year}`}
      />
    </section>
  )
}

function ChapterIntro({ chapter, index }) {
  const n = index + 1
  const tenth = chapter.year === EVENT.year
  return (
    <div className="relative">
      <p className="eyebrow">{chapter.label}</p>
      <h3 className="display mt-3 text-7xl text-transparent sm:text-8xl lg:text-[7.5rem]" style={{ WebkitTextStroke: '1px rgba(236,201,127,.75)' }}>
        {chapter.year}
      </h3>
      <p className="mt-4 font-display text-2xl italic text-gold-pale">
        {tenth ? 'A decade, illuminated.' : `The ${ordinal(n)} time we lit the diyas together.`}
      </p>
      {chapter.note && <p className="mt-3 max-w-sm leading-relaxed text-ivory/70">{chapter.note}</p>}
      {!tenth && chapter.photos.length > 0 && (
        <p className="mt-6 text-sm text-ivory/45">{chapter.photos.length} {chapter.photos.length === 1 ? 'photo' : 'photos'}</p>
      )}
    </div>
  )
}

function Gallery({ chapter, onOpen }) {
  const photos = chapter.photos
  const shown = photos.slice(0, PREVIEW)
  const extra = photos.length - shown.length
  // Editorial mosaic: first tile is a feature tile on larger screens
  return (
    <ul className="grid auto-rows-[9.5rem] grid-cols-2 gap-2.5 sm:auto-rows-[11rem] sm:grid-cols-4 sm:gap-3">
      {shown.map((p, i) => {
        const feature = i === 0 && photos.length > 2
        const isLast = i === shown.length - 1 && extra > 0
        return (
          <li key={p.src} className={feature ? 'col-span-2 row-span-2' : ''}>
            <button
              type="button"
              onClick={() => onOpen(i)}
              className="group relative block h-full w-full overflow-hidden rounded-2xl ring-1 ring-gold/10 transition-shadow hover:ring-gold/40"
              aria-label={isLast ? `View all ${photos.length} photos from ${chapter.year}` : `Open photo ${i + 1} from ${chapter.year}`}
            >
              <Photo src={p.src} alt="" className="h-full w-full" imgClassName="group-hover:scale-[1.04]" eager={i < 3} />
              {isLast && (
                <span className="absolute inset-0 grid place-items-center bg-night/70 font-display text-2xl text-gold-pale backdrop-blur-[2px]">
                  +{extra + 1} more
                </span>
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function EmptyChapter({ chapter }) {
  return (
    <div className="grid min-h-[18rem] place-items-center rounded-3xl border border-dashed border-gold/25 bg-white/[0.02] p-8 text-center">
      <div>
        <Diya className="mx-auto h-16 w-16" />
        <p className="mt-4 font-display text-2xl text-gold-pale">The {chapter.year} album is on its way.</p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ivory/60">
          We're still choosing the photos where everyone's eyes are open. Check back soon.
        </p>
      </div>
    </div>
  )
}

function TenthChapter() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-[radial-gradient(ellipse_at_center,#2a2244_0%,#11172b_70%)] p-8 text-center sm:p-14">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(242,169,59,.25),transparent_55%)]" aria-hidden="true" />
      <div className="relative">
        <div className="mx-auto flex w-fit items-end justify-center gap-1" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, i) => (
            <Diya key={i} lit className={i === 9 ? 'h-14 w-14' : 'h-8 w-8 opacity-90'} glow={i === 9 ? 1.4 : 0.6} animate={false} />
          ))}
        </div>
        <p className="mt-8 font-display text-3xl leading-tight text-ivory sm:text-5xl">
          Nine chapters behind us.<br />
          <span className="gold-text italic">The tenth starts with you.</span>
        </p>
        <a href="#rsvp" className="btn-gold mt-8">Save your place <Arrow className="h-4 w-4" /></a>
      </div>
    </div>
  )
}
