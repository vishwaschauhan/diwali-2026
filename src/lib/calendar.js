import { EVENT } from '../config/event'
import { eventStart, eventEnd } from './time'
import { publicLocation } from './venue'

const pad = (n) => String(n).padStart(2, '0')
/** 20261108T003000Z */
const utcStamp = (d) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`

/**
 * Wording for calendar entries. Pages with their own voice (e.g. the personal
 * invite) pass `copy` = { summary, intro, url } to override the defaults.
 */
const DEFAULT_COPY = {
  summary: `${EVENT.title} · ${EVENT.theme}`,
  intro: `${EVENT.theme}: our ${EVENT.edition}th annual Diwali celebration.`,
  url: EVENT.siteUrl,
}
const withDefaults = (copy) => ({ ...DEFAULT_COPY, ...copy })

function details(copy) {
  const c = withDefaults(copy)
  const lines = [c.intro, EVENT.dressCode]
  if (c.url) lines.push(`Invitation & RSVP: ${c.url}`)
  return lines.join('\n')
}

const summary = (copy) => withDefaults(copy).summary

/** Location text safe for calendars: full address only when it is public. */
const location = (address) => address || publicLocation()

export function calendarReady() {
  return Boolean(eventStart())
}

export function googleCalendarUrl(address, copy) {
  const s = eventStart(), e = eventEnd()
  if (!s) return null
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: summary(copy),
    dates: `${utcStamp(s)}/${utcStamp(e)}`,
    details: details(copy),
    location: location(address),
    ctz: EVENT.timezone,
  })
  return `https://calendar.google.com/calendar/render?${p}`
}

export function outlookCalendarUrl(address, copy) {
  const s = eventStart(), e = eventEnd()
  if (!s) return null
  const p = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: summary(copy),
    startdt: s.toISOString(),
    enddt: e.toISOString(),
    body: details(copy),
    location: location(address),
  })
  return `https://outlook.live.com/calendar/0/deeplink/compose?${p}`
}

const icsEscape = (s) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1')

/** RFC 5545 lines must be folded at 75 octets. */
const fold = (line) => {
  const out = []
  let rest = line
  while (rest.length > 74) {
    out.push(rest.slice(0, 74))
    rest = ' ' + rest.slice(74)
  }
  out.push(rest)
  return out.join('\r\n')
}

export function buildIcs(address, copy) {
  const s = eventStart(), e = eventEnd()
  if (!s) return null
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Diwali Celebration//A Decade of Lights//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:diwali-${EVENT.year}-${EVENT.date}@decade-of-lights`,
    `DTSTAMP:${utcStamp(new Date())}`,
    `DTSTART:${utcStamp(s)}`,
    `DTEND:${utcStamp(e)}`,
    `SUMMARY:${icsEscape(summary(copy))}`,
    `DESCRIPTION:${icsEscape(details(copy))}`,
    `LOCATION:${icsEscape(location(address))}`,
    ...(withDefaults(copy).url ? [`URL:${withDefaults(copy).url}`] : []),
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Diwali celebration tomorrow!',
    'TRIGGER:-P1D',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.map(fold).join('\r\n') + '\r\n'
}

export function downloadIcs(address, copy) {
  const ics = buildIcs(address, copy)
  if (!ics) return
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `diwali-${EVENT.year}.ics`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
