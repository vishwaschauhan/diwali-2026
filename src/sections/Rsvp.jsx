import { useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EVENT } from '../config/event'
import { formatDate, rsvpClosed } from '../lib/time'
import { rsvpMode, submitRsvp } from '../lib/rsvp'
import { useAddress } from '../lib/useAddress'
import { SectionHeading } from '../components/Reveal'
import Reveal from '../components/Reveal'
import Diya from '../components/Diya'
import { CalendarButtons } from '../components/SaveTheDate'
import { ContactList } from './Venue'
import { Arrow, Check } from '../components/Icons'

const DIETARY = ['Vegetarian', 'Vegan', 'Jain', 'Eggless', 'Gluten-free', 'Nut allergy']
const EMPTY = { name: '', attending: '', adults: 2, children: 0, dietary: [], notes: '' }

export default function Rsvp() {
  const mode = rsvpMode()
  const closed = rsvpClosed()
  const deadline = EVENT.rsvp.deadline ? formatDate(EVENT.rsvp.deadline, { weekday: 'long', month: 'long', day: 'numeric' }) : null

  return (
    <section id="rsvp" className="relative overflow-clip bg-ivory py-24 text-ink sm:py-32" aria-labelledby="rsvp-title">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(210,163,78,.25),transparent_60%)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading
          light
          eyebrow="Kindly respond"
          title={<span id="rsvp-title">Will you join us <em className="text-ruby">under the lights?</em></span>}
          intro={deadline && !closed ? `Please let us know by ${deadline}, so we can cook accordingly (generously, as always).` : 'Let us know if you can make it, so we can cook accordingly (generously, as always).'}
        />

        <Reveal delay={0.1} className="mt-12 sm:mt-16">
          {closed ? <Closed /> : mode === 'link' ? <ExternalRsvp /> : <RsvpForm demo={mode === 'demo'} />}
        </Reveal>
      </div>
    </section>
  )
}

function Card({ children }) {
  return (
    <div className="relative rounded-[2rem] border border-ruby/10 bg-ivory-soft p-6 shadow-[0_40px_90px_-50px_rgba(94,36,48,.55)] sm:p-10">
      {children}
    </div>
  )
}

function Closed() {
  return (
    <Card>
      <div className="text-center">
        <Diya className="mx-auto h-16 w-16" />
        <h3 className="mt-4 font-display text-3xl text-night">RSVPs have closed</h3>
        <p className="mx-auto mt-2 max-w-md text-ink/70">We're finalising numbers, but if you still need to reach us, one of us will be happy to help.</p>
        <div className="mt-6"><ContactList tone="light" /></div>
      </div>
    </Card>
  )
}

function ExternalRsvp() {
  return (
    <Card>
      <div className="text-center">
        <p className="text-ink/70">RSVPs are being collected on a separate page.</p>
        <a href={EVENT.rsvp.externalUrl} target="_blank" rel="noopener noreferrer" className="btn-ruby mt-6 !px-10">
          Open the RSVP form <Arrow className="h-4 w-4" />
        </a>
      </div>
    </Card>
  )
}

function RsvpForm({ demo }) {
  const reduce = useReducedMotion()
  const address = useAddress()
  const uid = useId()
  const [data, setData] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [result, setResult] = useState(null)

  const set = (k, v) => { setData((d) => ({ ...d, [k]: v })); if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined })) }
  const toggleDiet = (d) => set('dietary', data.dietary.includes(d) ? data.dietary.filter((x) => x !== d) : [...data.dietary, d])

  const validate = () => {
    const e = {}
    if (!data.name.trim()) e.name = 'Please tell us who you are.'
    if (!data.attending) e.attending = 'Please choose one.'
    if (data.attending === 'yes' && data.adults + data.children < 1) e.adults = 'At least one guest, please.'
    setErrors(e)
    if (Object.keys(e).length) {
      const first = document.getElementById(`${uid}-${Object.keys(e)[0]}`)
      first?.focus()
      return false
    }
    return true
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setStatus('sending')
    try {
      const r = await submitRsvp({ ...data, dietary: data.dietary.join(', ') })
      setResult({ ...data, demo: r.demo })
      setStatus('done')
      requestAnimationFrame(() => document.getElementById('rsvp')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }))
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done' && result) {
    return <Confirmation result={result} address={address} onReset={() => { setData(EMPTY); setStatus('idle'); setResult(null) }} />
  }

  const yes = data.attending === 'yes'

  return (
    <Card>
      {demo && (
        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-saffron/40 bg-saffron/10 p-4 text-sm text-ink/80" role="note">
          <span className="mt-0.5 rounded-full bg-saffron px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-white">Preview</span>
          <p>RSVPs aren't open yet. You can try the form, but nothing you enter is sent or saved anywhere.</p>
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="space-y-8">
        {/* Name */}
        <div>
          <label htmlFor={`${uid}-name`} className="block text-sm font-semibold text-night">Your name <span className="text-ruby">*</span></label>
          <p className="mt-0.5 text-xs text-ink/55">Family name works too, e.g. "The Sharmas"</p>
          <input
            id={`${uid}-name`}
            value={data.name}
            onChange={(e) => set('name', e.target.value)}
            autoComplete="name"
            className="field mt-2"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${uid}-name-err` : undefined}
          />
          <FieldError id={`${uid}-name-err`} msg={errors.name} />
        </div>

        {/* Attending */}
        <fieldset>
          <legend className="text-sm font-semibold text-night">Will you be there? <span className="text-ruby">*</span></legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2" role="radiogroup">
            {[
              { v: 'yes', t: 'Joyfully accept', s: "Count us in. We're bringing our dancing shoes." },
              { v: 'no', t: 'Regretfully decline', s: "We'll be there in spirit (and we expect photos)." },
            ].map((o, i) => {
              const on = data.attending === o.v
              return (
                <label
                  key={o.v}
                  className={`relative flex cursor-pointer gap-3 rounded-2xl border p-4 transition-all ${
                    on ? 'border-ruby bg-ruby/[0.06] shadow-[0_0_0_1px_var(--color-ruby)]' : 'border-ink/15 bg-white/60 hover:border-ink/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="attending"
                    value={o.v}
                    id={i === 0 ? `${uid}-attending` : undefined}
                    checked={on}
                    onChange={() => set('attending', o.v)}
                    className="peer sr-only"
                  />
                  <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-gold ${on ? 'border-ruby bg-ruby' : 'border-ink/30'}`} aria-hidden="true">
                    {on && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                  </span>
                  <span>
                    <span className="block font-semibold text-night">{o.t}</span>
                    <span className="mt-0.5 block text-sm text-ink/60">{o.s}</span>
                  </span>
                </label>
              )
            })}
          </div>
          <FieldError msg={errors.attending} />
        </fieldset>

        {/* Guests + dietary (only when attending) */}
        <AnimatePresence initial={false}>
          {yes && (
            <motion.div
              key="guests"
              initial={reduce ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={reduce ? undefined : { opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-8 pt-1">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Stepper id={`${uid}-adults`} label="Adults" value={data.adults} min={0} max={20} onChange={(v) => set('adults', v)} />
                  <Stepper id={`${uid}-children`} label="Children" hint="Under 12" value={data.children} min={0} max={20} onChange={(v) => set('children', v)} />
                </div>
                <FieldError msg={errors.adults} />

                <fieldset>
                  <legend className="text-sm font-semibold text-night">Dietary preferences <span className="font-normal text-ink/50">(optional)</span></legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {DIETARY.map((d) => {
                      const on = data.dietary.includes(d)
                      return (
                        <button
                          type="button"
                          key={d}
                          aria-pressed={on}
                          onClick={() => toggleDiet(d)}
                          className={`min-h-11 rounded-full border px-4 text-sm transition-colors ${on ? 'border-ruby bg-ruby text-ivory' : 'border-ink/15 bg-white/60 text-ink/75 hover:border-ink/35'}`}
                        >
                          {d}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notes */}
        <div>
          <label htmlFor={`${uid}-notes`} className="block text-sm font-semibold text-night">
            Anything else? <span className="font-normal text-ink/50">(optional)</span>
          </label>
          <textarea
            id={`${uid}-notes`}
            rows={3}
            value={data.notes}
            onChange={(e) => set('notes', e.target.value)}
            placeholder={yes ? 'Allergies, song requests, or a heads-up that you will be fashionably late…' : 'Leave us a note…'}
            className="field mt-2 resize-y"
          />
        </div>

        {status === 'error' && (
          <div role="alert" className="rounded-2xl border border-ruby/30 bg-ruby/5 p-4 text-sm text-ruby-deep">
            Hmm, that didn't go through. Please check your connection and try again, or message one of us directly.
          </div>
        )}

        <button type="submit" className="btn-ruby w-full !py-4 text-base" disabled={status === 'sending'}>
          {status === 'sending' ? (
            <><span className="h-4 w-4 animate-spin rounded-full border-2 border-ivory/40 border-t-ivory" aria-hidden="true" /> Sending…</>
          ) : demo ? 'Send RSVP (preview)' : 'Send RSVP'}
        </button>
      </form>
    </Card>
  )
}

function FieldError({ msg, id }) {
  return msg ? <p id={id} className="mt-2 text-sm font-medium text-ruby" role="alert">{msg}</p> : null
}

function Stepper({ id, label, hint, value, min, max, onChange }) {
  const btn = 'grid h-12 w-12 place-items-center rounded-full border border-ink/15 bg-white text-xl text-night transition-colors hover:border-ruby disabled:opacity-30'
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-night">
        {label} {hint && <span className="font-normal text-ink/50">· {hint}</span>}
      </label>
      <div className="mt-2 flex items-center justify-between rounded-2xl border border-ink/15 bg-white/60 p-1.5">
        <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Fewer ${label.toLowerCase()}`}>−</button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || 0)))}
          className="w-16 bg-transparent text-center font-display text-3xl text-night [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`More ${label.toLowerCase()}`}>+</button>
      </div>
    </div>
  )
}

function Confirmation({ result, address, onReset }) {
  const reduce = useReducedMotion()
  const yes = result.attending === 'yes'
  const first = result.name.trim().split(/\s+/)[0]
  const total = result.adults + result.children
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      role="status"
    >
      <div className="relative overflow-hidden rounded-[2rem] bg-night p-8 text-center text-ivory shadow-[0_40px_90px_-40px_rgba(17,23,43,.9)] sm:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(242,169,59,.35),transparent_60%)]" aria-hidden="true" />
        <div className="relative">
          {result.demo && (
            <p className="mx-auto mb-6 w-fit rounded-full bg-saffron/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-marigold">
              Preview only · nothing was sent
            </p>
          )}
          <Diya className="mx-auto h-24 w-24" glow={1.4} animate={!reduce} />
          <h3 className="mt-4 font-display text-4xl sm:text-5xl">
            {yes ? <>See you under the lights, <span className="gold-text italic">{first}</span>!</> : <>We'll miss you, <span className="gold-text italic">{first}</span>.</>}
          </h3>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-ivory/70">
            {yes
              ? `We've saved ${total === 1 ? 'a spot' : `${total} spots`} for you${result.children ? ' (and the little ones)' : ''}. Start stretching; the dance floor remembers.`
              : "Thank you for letting us know. We'll light a diya in your honour and save you some dessert in spirit."}
          </p>
          {yes && (
            <div className="mx-auto mt-8 max-w-lg text-left">
              <p className="mb-3 text-center text-xs uppercase tracking-[0.25em] text-gold">Add it to your calendar</p>
              <CalendarButtons address={address} />
            </div>
          )}
          <button type="button" onClick={onReset} className="mt-8 min-h-11 text-sm text-ivory/55 underline underline-offset-4 hover:text-ivory">
            {result.demo ? 'Try the form again' : 'Submit another response'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
