import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { EVENT } from '../config/event'
import { formatClock, tzAbbrev, formatDate } from '../lib/time'
import { SectionHeading } from '../components/Reveal'
import Reveal from '../components/Reveal'
import { Rangoli } from '../components/Ornaments'

export default function Schedule() {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const tz = EVENT.date ? tzAbbrev() : ''

  return (
    <section id="schedule" className="grain relative overflow-clip bg-night py-24 sm:py-32" aria-labelledby="schedule-title">
      <Rangoli className="pointer-events-none absolute -right-40 top-10 w-[520px]" opacity={0.08} />
      <Rangoli className="pointer-events-none absolute -left-52 bottom-0 w-[460px]" opacity={0.06} />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="The plan, loosely"
          title={<span id="schedule-title">An Evening to Remember</span>}
          intro={EVENT.date ? formatDate(EVENT.date) : 'Date to be announced'}
        />

        <ol ref={ref} className="relative mt-14 sm:mt-20">
          {/* track */}
          <div className="absolute bottom-6 left-[6.25rem] top-6 w-px bg-gold/15 sm:left-1/2" aria-hidden="true" />
          <motion.div
            className="absolute bottom-6 left-[6.25rem] top-6 w-px origin-top bg-gradient-to-b from-gold-light via-marigold to-ruby sm:left-1/2"
            style={{ scaleY: reduce ? 1 : fill }}
            aria-hidden="true"
          />
          {EVENT.schedule.map((item, i) => {
            const last = i === EVENT.schedule.length - 1
            const right = i % 2 === 1
            return (
              <Reveal as="li" key={item.title} delay={0.05 * i} className="relative grid grid-cols-[5rem_1.5rem_1fr] items-start gap-x-2 py-6 sm:grid-cols-[1fr_3rem_1fr] sm:gap-x-6">
                <time className={`pt-1 text-right font-display text-xl text-gold-pale tabular-nums sm:text-3xl ${right ? 'sm:order-3 sm:text-left' : ''}`}>
                  {formatClock(EVENT.startTime, item.offset)}
                  {last && <span className="block font-sans text-[0.65rem] uppercase tracking-[0.2em] text-ivory/45 sm:text-xs">onwards</span>}
                </time>
                <span className="relative z-10 mt-2 grid place-items-center sm:order-2" aria-hidden="true">
                  <span className="h-4 w-4 rotate-45 border border-gold bg-night shadow-[0_0_18px_rgba(242,169,59,.6)]" />
                  <span className="absolute h-1.5 w-1.5 rotate-45 bg-gold-light" />
                </span>
                <div className={`${right ? 'sm:order-1 sm:text-right' : 'sm:order-3'}`}>
                  <h3 className="font-display text-2xl text-ivory sm:text-3xl">{item.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-ivory/65">{item.note}</p>
                </div>
              </Reveal>
            )
          })}
        </ol>

        <p className="mt-10 text-center text-sm text-ivory/50">
          All times are {EVENT.timezoneLabel}{tz ? ` (${tz})` : ''}, {EVENT.venue.city}, Texas.
          {!EVENT.startTimeConfirmed && ' Timings are tentative and will be confirmed with the date.'}
        </p>
      </div>
    </section>
  )
}
