import { EVENT } from '../config/event'
import Reveal from '../components/Reveal'
import { Garland, RangoliDivider } from '../components/Ornaments'

export default function Welcome() {
  return (
    <section id="welcome" className="relative overflow-clip bg-ivory text-ink" aria-labelledby="welcome-title">
      <Garland className="pointer-events-none absolute inset-x-0 top-0 h-10 w-full sm:h-14" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(210,163,78,.18),transparent_55%)]" aria-hidden="true" />

      <div className="relative mx-auto max-w-3xl px-4 pt-24 pb-20 sm:px-6 md:pt-32 md:pb-28">
        <div className="text-center">
          <Reveal as="p" className="eyebrow !text-ruby">A note from your hosts</Reveal>
          <Reveal as="h2" delay={0.05} id="welcome-title" className="display mt-4 text-balance text-[2.6rem] text-night sm:text-6xl">
            The Council of the <em className="text-ruby">Tenth Flame</em>
          </Reveal>
          <Reveal as="p" delay={0.08} className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-ink/60 sm:text-sm">
            A Fellowship Reunited. A Decade Remembered.
          </Reveal>
          <RangoliDivider className="mx-auto mt-6 h-5 w-48" tone="ruby" />
          <Reveal delay={0.1} className="mt-6 font-display text-2xl italic leading-snug text-ruby sm:text-3xl">
            <p>One flame to bring them together.</p>
            <p>Ten years to keep it burning.</p>
          </Reveal>
          <Reveal delay={0.12} className="mx-auto mt-6 max-w-xl space-y-4 text-[1.05rem] leading-[1.75] text-ink/80 sm:text-lg">
            <p>
              Ten years ago, we lit a few diyas and invited some friends over. Somehow that small gathering became a
              fellowship: wonderful people, unforgettable evenings, and increasingly ambitious dance moves.
            </p>
            <p>Come in your festive best, and leave room for second dinner.</p>
          </Reveal>
          <Reveal delay={0.15} className="mt-8">
            <p className="font-display text-2xl italic text-ruby sm:text-3xl">{EVENT.hosts.signOff.replace(/,$/, '')}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
