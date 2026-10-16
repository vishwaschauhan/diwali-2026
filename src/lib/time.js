import { EVENT } from '../config/event'

/** Offset (ms) of `timeZone` from UTC at the given instant. */
function tzOffset(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(date)
  const v = Object.fromEntries(parts.map((p) => [p.type, p.value]))
  const asUtc = Date.UTC(+v.year, +v.month - 1, +v.day, +v.hour, +v.minute, +v.second)
  return asUtc - date.getTime()
}

/** Convert a wall-clock time in `timeZone` to a real instant (Date). */
export function zonedToDate(ymd, hm, timeZone) {
  const [y, m, d] = ymd.split('-').map(Number)
  const [hh, mm] = hm.split(':').map(Number)
  const guess = Date.UTC(y, m - 1, d, hh, mm)
  // Two passes settle correctly across DST boundaries.
  let t = guess - tzOffset(new Date(guess), timeZone)
  t = guess - tzOffset(new Date(t), timeZone)
  return new Date(t)
}

/** "6:30 PM" from "18:30" plus optional minute offset — pure wall-clock math. */
export function formatClock(hm, offset = 0) {
  const [h, m] = hm.split(':').map(Number)
  const total = (h * 60 + m + offset + 1440) % 1440
  const hh = Math.floor(total / 60)
  const mm = total % 60
  const suffix = hh >= 12 ? 'PM' : 'AM'
  const h12 = hh % 12 === 0 ? 12 : hh % 12
  return `${h12}:${String(mm).padStart(2, '0')} ${suffix}`
}

/** "Saturday, November 7, 2026" for a 'YYYY-MM-DD' string (no TZ drift). */
export function formatDate(ymd, opts = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) {
  if (!ymd) return null
  const [y, m, d] = ymd.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', { ...opts, timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, d, 12)))
}

/** Short TZ abbreviation for the party date, e.g. "CST" / "CDT". */
export function tzAbbrev(ymd = EVENT.date, hm = EVENT.startTime, timeZone = EVENT.timezone) {
  const when = ymd ? zonedToDate(ymd, hm, timeZone) : new Date()
  const part = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' })
    .formatToParts(when)
    .find((p) => p.type === 'timeZoneName')
  return part ? part.value : ''
}

export function eventStart() {
  return EVENT.date ? zonedToDate(EVENT.date, EVENT.startTime, EVENT.timezone) : null
}

export function eventEnd() {
  const s = eventStart()
  return s ? new Date(s.getTime() + EVENT.durationMinutes * 60000) : null
}

/** True once the RSVP deadline (end of that day, local to the party) has passed. */
export function rsvpClosed(now = new Date()) {
  const dl = EVENT.rsvp.deadline
  if (!dl) return false
  return now > zonedToDate(dl, '23:59', EVENT.timezone)
}

export const startLabel = () =>
  `${formatClock(EVENT.startTime)}${EVENT.startTimeConfirmed ? '' : ' (tentative)'}`
