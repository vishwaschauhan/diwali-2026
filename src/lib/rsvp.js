import { EVENT } from '../config/event'

export function rsvpMode() {
  const r = EVENT.rsvp
  if (r.mode === 'google-form' && r.googleForm.formId && r.googleForm.fields.name) return 'google-form'
  if (r.mode === 'link' && r.externalUrl) return 'link'
  return 'demo'
}

/**
 * Posts a response into a Google Form the same way the form's own Submit
 * button does: a regular HTML form POST, aimed at a hidden iframe so the guest
 * stays on the page. This is more reliable than fetch(), which privacy
 * settings and blockers often stop for cross-site requests. Google never lets
 * the page read the reply, so success means "sent"; being offline or a send
 * that never finishes is reported as an error.
 */
export async function submitRsvp(data) {
  const mode = rsvpMode()
  if (mode === 'demo') {
    await new Promise((r) => setTimeout(r, 900))
    return { demo: true }
  }
  if (mode !== 'google-form') throw new Error('RSVP is handled by an external link')
  if (typeof navigator !== 'undefined' && navigator.onLine === false) throw new Error('offline')

  const { formId, fields } = EVENT.rsvp.googleForm
  const values = []
  const put = (key, value) => { if (fields[key]) values.push([fields[key], value ?? '']) }
  put('name', data.name)
  put('attending', data.attending === 'yes' ? 'Yes' : 'No')
  put('adults', String(data.attending === 'yes' ? data.adults : 0))
  put('children', String(data.attending === 'yes' ? data.children : 0))
  if (fields.notes) {
    put('dietary', data.dietary)
    put('notes', data.notes)
  } else {
    // No Notes question mapped: keep the guest's note by adding it to the dietary answer.
    const note = data.notes?.trim()
    put('dietary', [data.dietary, note && `Note: ${note}`].filter(Boolean).join(' · '))
  }
  values.push(['fvv', '1'], ['pageHistory', '0'])

  await postViaHiddenFrame(`https://docs.google.com/forms/d/e/${formId}/formResponse`, values)
  return { demo: false }
}

function postViaHiddenFrame(action, values, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const name = `rsvp-sink-${Date.now()}`
    const iframe = document.createElement('iframe')
    iframe.name = name
    iframe.title = 'RSVP submission'
    iframe.setAttribute('aria-hidden', 'true')
    iframe.tabIndex = -1
    iframe.style.cssText = 'position:absolute;width:1px;height:1px;border:0;left:-9999px;top:0;'

    const form = document.createElement('form')
    form.method = 'POST'
    form.action = action
    form.target = name
    form.acceptCharset = 'UTF-8'
    form.style.display = 'none'
    for (const [k, v] of values) {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = k
      input.value = v
      form.appendChild(input)
    }

    let done = false
    const cleanup = () => setTimeout(() => { iframe.remove(); form.remove() }, 1000)
    const timer = setTimeout(() => { if (!done) { done = true; cleanup(); reject(new Error('timeout')) } }, timeoutMs)
    iframe.addEventListener('load', () => {
      if (done) return
      done = true
      clearTimeout(timer)
      cleanup()
      resolve()
    })

    document.body.appendChild(iframe)
    document.body.appendChild(form)
    form.submit()
  })
}
