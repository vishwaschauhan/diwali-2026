import { EVENT } from '../config/event'
import { useAddress } from '../lib/useAddress'
import { formatDate, startLabel, tzAbbrev } from '../lib/time'
import Reveal from '../components/Reveal'
import { CalendarButtons, ShareButtons } from '../components/SaveTheDate'
import { RangoliDivider } from '../components/Ornaments'

export default function Share() {
  const address = useAddress()
  return (
    <section id="share" className="relative bg-night-deep py-20 sm:py-28" aria-labelledby="share-title">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal className="card-glass p-7 text-center sm:p-12">
          <p className="eyebrow">Save the date</p>
          <h2 id="share-title" className="display mt-3 text-4xl text-ivory sm:text-5xl">Keep the evening <span className="gold-text italic">close</span></h2>
          <p className="mt-3 text-ivory/65">
            {EVENT.date ? `${formatDate(EVENT.date)} · ${startLabel()} ${tzAbbrev()}` : 'The date will be announced soon.'}
          </p>
          {EVENT.date && (
            <p className="mt-1 text-xs text-ivory/40">
              Festival of Diwali: {formatDate(EVENT.festivalDate, { month: 'long', day: 'numeric', year: 'numeric' })}. Our party date is the one above.
            </p>
          )}

          <div className="mt-8 text-left">
            <p className="mb-3 text-center text-xs uppercase tracking-[0.25em] text-gold/80">Add to calendar</p>
            <CalendarButtons address={address} />
          </div>

          <RangoliDivider className="mx-auto my-8 h-5 w-48" />

          <div className="text-left">
            <p className="mb-3 text-center text-xs uppercase tracking-[0.25em] text-gold/80">Pass the invitation along</p>
            <ShareButtons />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
