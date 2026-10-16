import { EVENT } from '../config/event'

export function rsvpMode() {
  const r = EVENT.rsvp
  if (r.mode === 'google-form' && r.googleForm.formId && r.googleForm.fields.name) return 'google-form'
  if (r.mode === 'link' && r.externalUrl) return 'link'
  return 'demo'
}

/**
 * Posts a response into a Google Form. Google does not allow cross-origin
 * reads, so the request is sent in `no-cors` mode: a network failure throws
 * (shown as an error), a successful send resolves.
 */
export async function submitRsvp(data) {
  const mode = rsvpMode()
  if (mode === 'demo') {
    await new Promise((r) => setTimeout(r, 900))
    return { demo: true }
  }
  if (mode !== 'google-form') throw new Error('RSVP is handled by an external link')
  const { formId, fields } = EVENT.rsvp.googleForm
  const body = new URLSearchParams()
  const put = (key, value) => { if (fields[key]) body.append(fields[key], value ?? '') }
  put('name', data.name)
  put('attending', data.attending === 'yes' ? 'Yes' : 'No')
  put('adults', String(data.attending === 'yes' ? data.adults : 0))
  put('children', String(data.attending === 'yes' ? data.children : 0))
  put('dietary', data.dietary)
  put('notes', data.notes)
  await fetch(`https://docs.google.com/forms/d/e/${formId}/formResponse`, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  return { demo: false }
}
