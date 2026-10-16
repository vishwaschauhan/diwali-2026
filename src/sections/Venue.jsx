import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { EVENT } from '../config/event'
import { mapsUrl, appleMapsUrl } from '../lib/venue'
import { useAddress, unlockAddress } from '../lib/useAddress'
import { SectionHeading } from '../components/Reveal'
import Reveal from '../components/Reveal'
import { Pin, Car, Lock, Arrow, Phone } from '../components/Icons'
import { Arch } from '../components/Ornaments'
import Diya from '../components/Diya'

export default function Venue() {
  const address = useAddress()
  const v = EVENT.venue

  return (
    <section id="venue" className="grain relative overflow-clip bg-night py-24 sm:py-32" aria-labelledby="venue-title">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_20%,rgba(133,58,70,.3),transparent_70%)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Venue & directions"
          title={<span id="venue-title">Find Your Way to the Lights</span>}
        />

        <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Address card */}
          <Reveal className="card-glass relative overflow-clip p-7 sm:p-10">
            <Arch className="pointer-events-none absolute -right-10 -top-6 h-[120%] w-64 opacity-[0.12]" />
            <div className="relative">
              <p className="eyebrow">The venue</p>
              <h3 className="mt-3 font-display text-4xl text-ivory sm:text-5xl">{v.title}</h3>
              <p className="mt-2 flex items-center gap-2 text-ivory/70"><Pin className="h-4 w-4 text-gold" /> {v.city}, Texas</p>

              <div className="mt-8">
                {address ? <AddressBlock address={address} /> : <AddressPending />}
              </div>
            </div>
          </Reveal>

          {/* Parking & logistics */}
          <Reveal delay={0.1} className="rounded-3xl border border-gold/15 bg-white/[0.03] p-7 sm:p-10">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-gold/10 text-gold"><Car /></span>
              <h3 className="font-display text-3xl text-ivory">Parking & arrival</h3>
            </div>
            <ul className="mt-6 space-y-4">
              {v.parkingNotes.map((n) => (
                <li key={n} className="flex gap-3 leading-relaxed text-ivory/75">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" aria-hidden="true" />
                  {n}
                </li>
              ))}
            </ul>
            <p className="mt-8 border-t border-gold/15 pt-6 font-display text-xl italic text-gold-pale">{v.lostLine}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function AddressBlock({ address }) {
  const g = mapsUrl(address)
  const a = appleMapsUrl(address)
  return (
    <div>
      <p className="text-sm uppercase tracking-[0.2em] text-ivory/50">Address</p>
      <address className="mt-2 text-xl not-italic leading-relaxed text-ivory sm:text-2xl">{address}</address>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {g && <a href={g} target="_blank" rel="noopener noreferrer" className="btn-gold">Get directions <Arrow className="h-4 w-4" /></a>}
        {a && <a href={a} target="_blank" rel="noopener noreferrer" className="btn-ghost">Open in Apple Maps</a>}
      </div>
    </div>
  )
}

function AddressPending() {
  const v = EVENT.venue
  if (v.addressMode === 'passcode' && v.encryptedAddress) return <Unlock />
  const message =
    v.addressMode === 'private'
      ? "Because this is our home, we share the full address personally with confirmed guests. RSVP and it'll come your way."
      : 'The full address and directions will be shared here once the venue is confirmed.'
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-dashed border-gold/25 p-5">
      <Diya className="h-12 w-12 shrink-0" />
      <div>
        <p className="leading-relaxed text-ivory/75">{message}</p>
        <a href="#rsvp" className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gold hover:text-gold-light">RSVP now <Arrow className="h-4 w-4" /></a>
      </div>
    </div>
  )
}

function Unlock() {
  const reduce = useReducedMotion()
  const [code, setCode] = useState('')
  const [state, setState] = useState('idle')

  const submit = async (e) => {
    e.preventDefault()
    if (!code.trim()) return
    setState('loading')
    try { await unlockAddress(code); setState('idle') } catch { setState('error') }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-gold/20 bg-night/40 p-5" noValidate>
      <p className="flex items-center gap-2 text-sm font-semibold text-gold"><Lock className="h-4 w-4" /> For invited guests</p>
      <p className="mt-2 text-sm leading-relaxed text-ivory/70">
        Our home address is shared with invited guests only. Enter the passcode from your invitation message to reveal it.
      </p>
      <label htmlFor="passcode" className="sr-only">Invitation passcode</label>
      <motion.div
        className="mt-4 flex gap-2"
        animate={state === 'error' && !reduce ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
        transition={{ duration: 0.45 }}
      >
        <input
          id="passcode"
          value={code}
          onChange={(e) => { setCode(e.target.value); if (state === 'error') setState('idle') }}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck="false"
          placeholder="Passcode"
          aria-invalid={state === 'error'}
          aria-describedby="passcode-msg"
          className="min-h-12 min-w-0 flex-1 rounded-full border border-gold/30 bg-white/5 px-5 text-ivory placeholder:text-ivory/35 focus:border-gold focus:outline-none"
        />
        <button type="submit" className="btn-gold shrink-0 !px-5" disabled={state === 'loading'}>
          {state === 'loading' ? 'Checking…' : 'Reveal'}
        </button>
      </motion.div>
      <p id="passcode-msg" className="mt-2 min-h-5 text-sm text-marigold" aria-live="polite">
        {state === 'error' && "That passcode didn't match. Check your invitation, or ask one of us."}
      </p>
    </form>
  )
}

export function ContactList({ tone = 'dark' }) {
  const people = EVENT.contacts
  return (
    <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3">
      {people.map((p) => (
        <li key={p.name} className={`flex items-center gap-2 ${tone === 'dark' ? 'text-ivory/80' : 'text-ink/80'}`}>
          <span className="font-display text-xl">{p.name}</span>
          {p.phone && (
            <a href={`tel:${p.phone.replace(/[^\d+]/g, '')}`} className="inline-flex min-h-11 items-center gap-1 text-sm text-gold hover:text-gold-light" aria-label={`Call ${p.name}`}>
              <Phone className="h-4 w-4" /> {p.phone}
            </a>
          )}
          {p.whatsapp && (
            <a href={`https://wa.me/${p.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm text-gold hover:text-gold-light" aria-label={`WhatsApp ${p.name}`}>
              WhatsApp
            </a>
          )}
        </li>
      ))}
    </ul>
  )
}
