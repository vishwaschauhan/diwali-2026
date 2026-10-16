import { EVENT } from '../config/event'

export const publicLocation = () => `${EVENT.venue.city}, ${EVENT.venue.state}`

export function mapsUrl(address) {
  if (EVENT.venue.mapsUrl) return EVENT.venue.mapsUrl
  if (!address) return null
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
}

export function appleMapsUrl(address) {
  if (!address) return null
  return `https://maps.apple.com/?daddr=${encodeURIComponent(address)}`
}

/* ---------------------------------------------------------------------------
 * Passcode-protected address
 * AES-GCM with a PBKDF2-derived key. The blob is produced by
 * scripts/encrypt-address.mjs and has the shape { salt, iv, data } (base64).
 * ------------------------------------------------------------------------- */
const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0))

export async function decryptAddress(passcode, blob = EVENT.venue.encryptedAddress) {
  if (!blob || !passcode) throw new Error('missing')
  const enc = new TextEncoder()
  const base = await crypto.subtle.importKey('raw', enc.encode(passcode.trim().toLowerCase()), 'PBKDF2', false, ['deriveKey'])
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: b64(blob.salt), iterations: 150000, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  )
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(blob.iv) }, key, b64(blob.data))
  return new TextDecoder().decode(plain)
}

const STORE = 'diwali-address-unlocked'
export const rememberAddress = (a) => { try { sessionStorage.setItem(STORE, a) } catch { /* private mode */ } }
export const recallAddress = () => { try { return sessionStorage.getItem(STORE) } catch { return null } }
