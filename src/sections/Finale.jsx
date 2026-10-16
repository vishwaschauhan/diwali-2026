import { EVENT } from '../config/event'
import Reveal from '../components/Reveal'
import Diya from '../components/Diya'
import Particles from '../components/Particles'
import { ContactList } from './Venue'
import { Garland } from '../components/Ornaments'

export default function Finale() {
  return (
    <>
      <section id="finale" className="grain relative isolate overflow-clip bg-night-deep pb-20 pt-28 text-center sm:pb-28 sm:pt-36" aria-labelledby="finale-title">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(242,169,59,.28),rgba(133,58,70,.18)_40%,transparent_75%)]" aria-hidden="true" />
        <Particles density={0.6} />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <Reveal as="p" className="eyebrow">See you under the lights</Reveal>
          <Reveal as="h2" id="finale-title" delay={0.05} className="display mt-6 text-balance text-[2.5rem] text-ivory sm:text-6xl">
            Some traditions are made of rituals.<br />
            <span className="gold-text italic">Ours is made of people.</span>
          </Reveal>
          <Reveal as="p" delay={0.12} className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-ivory/75">
            Ten years of light. Ten years of laughter. And we'd love nothing more than to celebrate the next one with you.
          </Reveal>
          <Reveal delay={0.18} className="mt-10 flex justify-center">
            <a href="#rsvp" className="btn-gold !px-10 !py-4 text-base">RSVP Now</a>
          </Reveal>

          <Reveal delay={0.2} className="mt-16 flex items-end justify-center gap-2" aria-hidden="true">
            {[0.7, 0.85, 1, 1.25, 1, 0.85, 0.7].map((s, i) => (
              <Diya key={i} className="h-14 w-14" glow={s} />
            ))}
          </Reveal>
        </div>
      </section>

      <footer className="relative bg-night-deep pb-28 pt-10 md:pb-12" aria-label="Contact">
        <Garland className="mx-auto h-8 w-full max-w-md opacity-70" />
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-gold/80">Questions? Ask your hosts</p>
          <div className="mt-4"><ContactList /></div>
          <p className="mt-10 font-display text-lg italic text-ivory/50">
            Hosted with love by {EVENT.hosts.names.join(' & ')} and friends · {EVENT.venue.city}, Texas
          </p>
          <p className="mt-2 text-xs text-ivory/35">
            {EVENT.theme} · {EVENT.firstYear}–{EVENT.year} · Shubh Deepavali
          </p>
        </div>
      </footer>
    </>
  )
}
