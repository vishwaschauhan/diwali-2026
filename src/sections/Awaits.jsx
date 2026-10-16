import { motion, useReducedMotion } from 'framer-motion'
import { SectionHeading } from '../components/Reveal'
import { DiyaLine, Aarti, Thali, Chai, Dholak, Dance } from '../components/Illustrations'
import { EVENT } from '../config/event'

const ITEMS = [
  { Icon: DiyaLine, title: 'Lighting of the Diyas', text: 'Ten years in, and we still argue over who gets the matchbox. Bring a wish; we will supply the flame.' },
  { Icon: Aarti, title: 'Aarti', text: 'A few quiet minutes of gratitude together, followed by a group photo where everyone insists they were not ready.' },
  { Icon: Thali, title: 'Dinner', text: 'Homemade and plentiful. Come hungry. Leaving hungry is not an option.' },
  { Icon: Chai, title: 'Drinks', text: 'Something warm, something cold, something festive. Stay hydrated; the dance floor is watching.' },
  { Icon: Dholak, title: 'Music & Performances', text: 'Songs, rhythm and cultural performances. Applause is generous; encores are negotiable.' },
  { Icon: Dance, title: 'Dance Floor', text: 'Talent optional. Enthusiasm mandatory.' },
]

export default function Awaits() {
  const reduce = useReducedMotion()
  return (
    <section id="awaits" className="relative overflow-clip bg-ivory py-24 text-ink sm:py-32" aria-labelledby="awaits-title">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(133,58,70,.12),transparent_55%)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          light
          eyebrow="What awaits you"
          title={<span id="awaits-title">An evening of light, <em className="text-ruby">food</em> &amp; rhythm</span>}
          intro="Everything we love about Diwali, gathered under one roof for one very full evening."
        />

        <ul className="mt-14 grid gap-4 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {ITEMS.map(({ Icon, title, text }, i) => (
            <motion.li
              key={title}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -8% 0px' }}
              transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-[1.75rem] border border-ruby/10 bg-ivory-soft p-7 shadow-[0_20px_50px_-30px_rgba(94,36,48,.35)] transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(94,36,48,.5)] max-sm:flex max-sm:gap-5 max-sm:p-6 sm:p-8"
            >
              <span className="absolute right-6 top-5 hidden font-display text-5xl text-ruby/10 sm:block" aria-hidden="true">0{i + 1}</span>
              <div className="grid h-14 w-14 shrink-0 place-items-center sm:h-16 sm:w-16 rounded-2xl bg-night text-gold shadow-[inset_0_0_0_1px_rgba(210,163,78,.3)] transition-transform duration-500 group-hover:scale-105">
                <Icon className="h-10 w-10 sm:h-11 sm:w-11" />
              </div>
              <div>
                <h3 className="font-display text-[1.7rem] leading-tight text-night sm:mt-6 sm:text-3xl">{title}</h3>
                <p className="mt-1.5 leading-relaxed text-ink/70 sm:mt-2">{text}</p>
              </div>
            </motion.li>
          ))}
        </ul>

        <p className="mx-auto mt-12 max-w-xl text-center text-sm text-ink/60">
          <span className="font-semibold text-ruby">Dress code:</span> {EVENT.dressCode}
        </p>
      </div>
    </section>
  )
}
