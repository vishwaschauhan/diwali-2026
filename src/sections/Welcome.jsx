import { EVENT } from '../config/event'
import { photosFor } from '../lib/photos'
import Reveal from '../components/Reveal'
import Photo from '../components/Photo'
import { Arch, Garland, RangoliDivider } from '../components/Ornaments'
import Diya from '../components/Diya'

export default function Welcome() {
  const first = photosFor(EVENT.firstYear)[0]

  return (
    <section id="welcome" className="relative overflow-clip bg-ivory text-ink" aria-labelledby="welcome-title">
      <Garland className="pointer-events-none absolute inset-x-0 top-0 h-10 w-full sm:h-14" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(210,163,78,.18),transparent_55%)]" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-24 pb-20 sm:px-6 md:grid-cols-[0.9fr_1.1fr] md:gap-16 md:pt-32 md:pb-28">
        <Reveal className="relative mx-auto w-full max-w-sm md:max-w-none">
          <div className="relative aspect-[200/260] w-full">
            <div className="arch-mask absolute inset-0 overflow-hidden">
              {first ? (
                <Photo
                  src={first.src}
                  alt={`A moment from our first Diwali celebration in ${EVENT.firstYear}`}
                  className="h-full w-full"
                  fallback={<ArchFallback />}
                />
              ) : (
                <ArchFallback />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/50 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-0 right-0 text-center font-display text-lg italic text-ivory">Where it began · {EVENT.firstYear}</p>
            </div>
            <Arch className="pointer-events-none absolute inset-0 h-full w-full" stroke="#853a46" />
          </div>
        </Reveal>

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

/** Shown inside the arch if the photo is unavailable: a quiet night scene. */
function ArchFallback() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_70%,#3a2a4a_0%,#11172b_60%)]">
      <div className="absolute inset-x-0 bottom-[22%] flex items-end justify-center gap-3">
        <Diya className="h-14 w-14 opacity-90" glow={0.8} />
        <Diya className="h-24 w-24" glow={1.3} />
        <Diya className="h-14 w-14 opacity-90" glow={0.8} />
      </div>
    </div>
  )
}
