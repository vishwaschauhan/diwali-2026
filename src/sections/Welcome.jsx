import { EVENT } from '../config/event'
import Reveal from '../components/Reveal'
import { Garland, RangoliDivider } from '../components/Ornaments'

export default function Welcome() {
  return (
    <section id="welcome" className="relative overflow-clip bg-ivory text-ink" aria-labelledby="welcome-title">
      <Garland className="pointer-events-none absolute inset-x-0 top-0 h-10 w-full sm:h-14" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(210,163,78,.18),transparent_55%)]" aria-hidden="true" />

      <div className="relative mx-auto max-w-3xl px-4 pt-24 pb-20 sm:px-6 md:pt-32 md:pb-28">
        <div>
          <Reveal as="p" className="eyebrow !text-ruby">A note from your hosts</Reveal>
          <Reveal as="h2" delay={0.05} id="welcome-title" className="display mt-4 text-[2.7rem] text-night sm:text-6xl">
            Ten years ago, we lit <em className="text-ruby">a few diyas</em>.
          </Reveal>
          <RangoliDivider className="mt-6 h-5 w-48" tone="ruby" />
          <Reveal delay={0.1} className="mt-6 space-y-5 text-[1.05rem] leading-[1.8] text-ink/80 sm:text-lg">
            <p>
              <span className="float-left mr-3 mt-1 font-display text-6xl leading-[0.8] text-ruby">T</span>
              en years ago, we lit a few diyas and invited some friends over. Somehow, that turned into a tradition filled
              with wonderful people, unforgettable evenings, endless laughter, and increasingly ambitious dance moves.
            </p>
            <p>This year, we're celebrating a decade of it all.</p>
            <p>
              Come dressed in your festive best, bring your brightest smiles, and leave some room for dessert.
              We're making another memory together.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="mt-8">
            <p className="font-display text-2xl italic text-ruby sm:text-3xl">{EVENT.hosts.signOff.replace(/,$/, '')}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
