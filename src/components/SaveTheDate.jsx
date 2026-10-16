import { useState } from 'react'
import { EVENT } from '../config/event'
import { calendarReady, googleCalendarUrl, outlookCalendarUrl, downloadIcs } from '../lib/calendar'
import { Calendar, Share, Link, Check, Whatsapp } from './Icons'

export function shareUrl() {
  return EVENT.siteUrl || window.location.href.split('#')[0]
}

const shareText = () =>
  `You're invited to our ${EVENT.edition}th annual Diwali celebration: ${EVENT.theme}. ✨🪔`

/** Calendar buttons. `address` is the unlocked full address, if any. */
export function CalendarButtons({ address, tone = 'dark' }) {
  const ready = calendarReady()
  const cls = tone === 'dark'
    ? 'border-gold/30 text-ivory hover:border-gold hover:bg-gold/10'
    : 'border-night/15 text-night hover:border-ruby hover:bg-ruby/5'

  if (!ready) {
    return (
      <p className={`rounded-2xl border border-dashed px-4 py-3 text-sm ${tone === 'dark' ? 'border-gold/25 text-ivory/60' : 'border-night/20 text-ink/60'}`}>
        <Calendar className="mr-2 inline h-4 w-4 align-[-3px]" />
        Calendar invites will appear here as soon as the date is confirmed.
      </p>
    )
  }
  const btn = `flex min-h-12 items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${cls}`
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      <a className={btn} href={googleCalendarUrl(address)} target="_blank" rel="noopener noreferrer">Google Calendar</a>
      <button type="button" className={btn} onClick={() => downloadIcs(address)}>Apple Calendar (.ics)</button>
      <a className={btn} href={outlookCalendarUrl(address)} target="_blank" rel="noopener noreferrer">Outlook</a>
    </div>
  )
}

export function ShareButtons({ tone = 'dark' }) {
  const [copied, setCopied] = useState(false)
  const url = shareUrl()
  const canShare = typeof navigator !== 'undefined' && !!navigator.share
  const cls = tone === 'dark'
    ? 'border-gold/30 text-ivory hover:border-gold hover:bg-gold/10'
    : 'border-night/15 text-night hover:border-ruby hover:bg-ruby/5'
  const btn = `flex min-h-12 items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${cls}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = url; document.body.appendChild(ta); ta.select()
      try { document.execCommand('copy') } catch { /* ignore */ }
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const nativeShare = async () => {
    try { await navigator.share({ title: `${EVENT.title} · ${EVENT.theme}`, text: shareText(), url }) } catch { /* dismissed */ }
  }

  return (
    <div className={`grid gap-2 ${canShare ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
      {canShare && (
        <button type="button" className={btn} onClick={nativeShare}><Share className="h-4 w-4" /> Share invitation</button>
      )}
      <a className={btn} href={`https://wa.me/?text=${encodeURIComponent(`${shareText()}\n${url}`)}`} target="_blank" rel="noopener noreferrer">
        <Whatsapp className="h-4 w-4" /> WhatsApp
      </a>
      <button type="button" className={btn} onClick={copy} aria-live="polite">
        {copied ? <><Check className="h-4 w-4" /> Link copied</> : <><Link className="h-4 w-4" /> Copy invitation link</>}
      </button>
    </div>
  )
}
