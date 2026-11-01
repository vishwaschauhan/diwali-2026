import { useId, useState } from 'react'
import { EVENT } from '../config/event'
import { formatClock, formatDate, rsvpClosed, tzAbbrev } from '../lib/time'
import { rsvpMode, submitRsvp } from '../lib/rsvp'
import { mapsUrl, appleMapsUrl } from '../lib/venue'
import { useAddress } from '../lib/useAddress'
import { CalendarButtons } from '../components/SaveTheDate'
import Diya from '../components/Diya'

/**
 * Minimalist, personal version of the invitation: one quiet card from the two
 * hosts. Same date, schedule, venue and Google Form as the main site.
 */
const P = EVENT.personalInvite
const HOSTS = EVENT.hosts.names.join(' & ')
const PAGE_URL = EVENT.siteUrl ? `${EVENT.siteUrl}${P.path}` : ''
const CAL_COPY = {
  summary: `Diwali at ${HOSTS}'`,
  intro: `Diwali celebration at ${HOSTS}' home.`,
  url: PAGE_URL,
}

export default function PersonalInvite() {
  const address = useAddress()
  const date = formatDate(EVENT.date)
  const time = formatClock(EVENT.startTime)

  return (
    <main className="mx-auto max-w-xl px-4 pb-20 pt-14 text-ink sm:px-6 sm:pt-24">
      {/* Invitation */}
      <header className="text-center">
        <Diya className="mx-auto h-20 w-20" glow={0.8} />
        <p className="mt-6 font-display text-4xl text-night sm:text-5xl">{HOSTS}</p>
        <h1 className="mt-2 font-display text-2xl italic text-ruby sm:text-3xl">{P.headline}</h1>

        <div className="mx-auto mt-10 max-w-sm space-y-1 text-lg text-night">
          <p>{date}</p>
          <p>{time}{!EVENT.startTimeConfirmed && <span className="text-ink/50"> (tentative)</span>}</p>
          <p>At our home in {EVENT.venue.city}, Texas</p>
        </div>

        <div className="mx-auto mt-10 max-w-md space-y-3 leading-relaxed text-ink/75">
          {P.note.map((line) => <p key={line}>{line}</p>)}
        </div>

        <a href="#rsvp" className="btn-ruby mt-10 !px-10">RSVP</a>
      </header>

      <Rule />

      {/* Schedule */}
      <section aria-labelledby="evening">
        <Heading id="evening">The evening</Heading>
        <ol className="mt-8 space-y-6">
          {EVENT.schedule.map((item, i) => (
            <li key={item.title} className="grid grid-cols-[5.5rem_1fr] gap-4">
              <time className="pt-0.5 text-right font-display text-xl tabular-nums text-ruby">
                {formatClock(EVENT.startTime, item.offset)}
              </time>
              <div>
                <p className="font-semibold text-night">
                  {item.title}{i === EVENT.schedule.length - 1 && <span className="font-normal text-ink/50"> · onwards</span>}
                </p>
                <p className="mt-0.5 text-ink/65">{item.note}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-center text-ink/75"><span className="font-semibold text-night">Dress code:</span> {EVENT.dressCode}</p>
        <p className="mt-2 text-center text-sm text-ink/50">
          All times {EVENT.timezoneLabel} ({tzAbbrev()}).{!EVENT.startTimeConfirmed && ' Timings are tentative.'}
        </p>
      </section>

      <Rule />

      {/* Venue */}
      <section aria-labelledby="where" className="text-center">
        <Heading id="where">Where</Heading>
        <p className="mt-6 font-display text-2xl text-night">{EVENT.venue.title}</p>
        {address ? (
          <>
            <address className="mt-1 not-italic text-ink/75">{address}</address>
            <div className="mt-5 flex justify-center gap-6 text-sm font-semibold">
              <a className="text-ruby underline underline-offset-4 hover:text-ruby-deep" href={mapsUrl(address)} target="_blank" rel="noopener noreferrer">Google Maps</a>
              <a className="text-ruby underline underline-offset-4 hover:text-ruby-deep" href={appleMapsUrl(address)} target="_blank" rel="noopener noreferrer">Apple Maps</a>
            </div>
          </>
        ) : (
          <p className="mt-1 text-ink/75">{EVENT.venue.city}, Texas. We'll send the address with your RSVP confirmation.</p>
        )}
        <ul className="mx-auto mt-6 max-w-md space-y-1 text-sm text-ink/60">
          {EVENT.venue.parkingNotes.map((n) => <li key={n}>{n}</li>)}
        </ul>
      </section>

      <Rule />

      {/* RSVP */}
      <section id="rsvp" aria-labelledby="rsvp-title" className="scroll-mt-8">
        <Heading id="rsvp-title">Kindly reply</Heading>
        <p className="mt-3 text-center text-ink/65">
          {EVENT.rsvp.deadline && !rsvpClosed()
            ? `Please let us know by ${formatDate(EVENT.rsvp.deadline, { weekday: 'long', month: 'long', day: 'numeric' })}.`
            : 'Let us know if you can make it, so we can plan (and cook) accordingly.'}
        </p>
        <div className="mt-10">
          {rsvpClosed() ? (
            <p className="text-center text-ink/70">RSVPs have closed. If you still need to reach us, just message us directly.</p>
          ) : rsvpMode() === 'link' ? (
            <div className="text-center"><a href={EVENT.rsvp.externalUrl} target="_blank" rel="noopener noreferrer" className="btn-ruby !px-10">Open the RSVP form</a></div>
          ) : (
            <RsvpForm address={address} demo={rsvpMode() === 'demo'} />
          )}
        </div>
      </section>

      <footer className="mt-20 text-center">
        <p className="text-ink/60">{P.signOff}</p>
        <p className="mt-1 font-display text-3xl text-night">{HOSTS}</p>
      </footer>
    </main>
  )
}

function Heading({ id, children }) {
  return <h2 id={id} className="text-center font-sans text-xs font-semibold uppercase tracking-[0.3em] text-ruby">{children}</h2>
}

function Rule() {
  return (
    <div className="my-16 flex items-center justify-center gap-3 sm:my-20" aria-hidden="true">
      <span className="h-px w-16 bg-gold/50" />
      <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
      <span className="h-px w-16 bg-gold/50" />
    </div>
  )
}

const DIETARY = ['Vegetarian', 'Vegan', 'Jain', 'Eggless', 'Gluten-free', 'Nut allergy']
const EMPTY = { name: '', attending: '', adults: 2, children: 0, dietary: [], notes: '' }

function RsvpForm({ address, demo }) {
  const uid = useId()
  const [data, setData] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [sent, setSent] = useState(null)

  const set = (k, v) => { setData((d) => ({ ...d, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })) }
  const yes = data.attending === 'yes'

  const onSubmit = async (ev) => {
    ev.preventDefault()
    const e = {}
    if (!data.name.trim()) e.name = 'Please tell us your name.'
    if (!data.attending) e.attending = 'Please choose one.'
    if (yes && data.adults + data.children < 1) e.adults = 'At least one guest, please.'
    setErrors(e)
    if (Object.keys(e).length) { document.getElementById(`${uid}-${Object.keys(e)[0]}`)?.focus(); return }
    setStatus('sending')
    try {
      const r = await submitRsvp({ ...data, dietary: data.dietary.join(', ') })
      setSent({ ...data, demo: r.demo })
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done' && sent) {
    const first = sent.name.trim().split(/\s+/)[0]
    return (
      <div className="text-center" role="status">
        {sent.demo && <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-saffron">Preview only · nothing was sent</p>}
        <p className="font-display text-3xl text-night">
          {sent.attending === 'yes' ? `Thank you, ${first}. We can't wait to see you.` : `Thank you, ${first}. We'll miss you.`}
        </p>
        {sent.attending === 'yes' && (
          <div className="mx-auto mt-8 max-w-lg">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-ink/50">Add it to your calendar</p>
            <CalendarButtons address={address} tone="light" copy={CAL_COPY} />
          </div>
        )}
        <button type="button" className="mt-8 min-h-11 text-sm text-ink/50 underline underline-offset-4 hover:text-ink" onClick={() => { setData(EMPTY); setSent(null); setStatus('idle') }}>
          Submit another response
        </button>
      </div>
    )
  }

  const choice = (on) => `min-h-12 flex-1 rounded-full border px-5 text-sm font-semibold transition-colors ${on ? 'border-ruby bg-ruby text-ivory' : 'border-ink/20 text-night hover:border-ink/40'}`

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      {demo && <p className="text-center text-sm text-saffron">Preview: RSVPs aren't open yet, so nothing you enter is sent.</p>}

      <div>
        <label htmlFor={`${uid}-name`} className="block text-sm font-semibold text-night">Your name</label>
        <input id={`${uid}-name`} className="paper-field" value={data.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" aria-invalid={!!errors.name} />
        <Err msg={errors.name} />
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-night">Will you join us?</legend>
        <div className="mt-3 flex gap-3">
          <button type="button" id={`${uid}-attending`} aria-pressed={yes} className={choice(yes)} onClick={() => set('attending', 'yes')}>Yes, we'll be there</button>
          <button type="button" aria-pressed={data.attending === 'no'} className={choice(data.attending === 'no')} onClick={() => set('attending', 'no')}>Sorry, can't make it</button>
        </div>
        <Err msg={errors.attending} />
      </fieldset>

      {yes && (
        <>
          <div className="grid grid-cols-2 gap-6">
            <Count id={`${uid}-adults`} label="Adults" value={data.adults} onChange={(v) => set('adults', v)} />
            <Count id={`${uid}-children`} label="Children (under 12)" value={data.children} onChange={(v) => set('children', v)} />
          </div>
          <Err msg={errors.adults} />
          <fieldset>
            <legend className="text-sm font-semibold text-night">Dietary preferences <span className="font-normal text-ink/50">(optional)</span></legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {DIETARY.map((d) => {
                const on = data.dietary.includes(d)
                return (
                  <button type="button" key={d} aria-pressed={on}
                    onClick={() => set('dietary', on ? data.dietary.filter((x) => x !== d) : [...data.dietary, d])}
                    className={`min-h-10 rounded-full border px-4 text-sm transition-colors ${on ? 'border-ruby bg-ruby/10 text-ruby' : 'border-ink/15 text-ink/70 hover:border-ink/35'}`}>
                    {d}
                  </button>
                )
              })}
            </div>
          </fieldset>
        </>
      )}

      <div>
        <label htmlFor={`${uid}-notes`} className="block text-sm font-semibold text-night">A note for us <span className="font-normal text-ink/50">(optional)</span></label>
        <textarea id={`${uid}-notes`} rows={2} className="paper-field resize-y" value={data.notes} onChange={(e) => set('notes', e.target.value)} />
      </div>

      {status === 'error' && (
        <p role="alert" className="text-center text-sm text-ruby">That didn't go through. Please check your connection and try again, or just message us.</p>
      )}

      <button type="submit" className="btn-ruby w-full" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send RSVP'}
      </button>
    </form>
  )
}

function Count({ id, label, value, onChange }) {
  const btn = 'grid h-10 w-10 place-items-center rounded-full border border-ink/20 text-lg text-night hover:border-ruby disabled:opacity-30'
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-night">{label}</label>
      <div className="mt-2 flex items-center gap-3">
        <button type="button" className={btn} onClick={() => onChange(Math.max(0, value - 1))} disabled={value <= 0} aria-label={`Fewer ${label}`}>−</button>
        <input id={id} type="number" inputMode="numeric" min={0} max={20} value={value}
          onChange={(e) => onChange(Math.min(20, Math.max(0, Number(e.target.value) || 0)))}
          className="w-10 bg-transparent text-center font-display text-2xl text-night [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none" />
        <button type="button" className={btn} onClick={() => onChange(Math.min(20, value + 1))} disabled={value >= 20} aria-label={`More ${label}`}>+</button>
      </div>
    </div>
  )
}

function Err({ msg }) {
  return msg ? <p className="mt-2 text-sm text-ruby" role="alert">{msg}</p> : null
}
