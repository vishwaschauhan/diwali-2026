import { useSyncExternalStore } from 'react'
import { EVENT } from '../config/event'
import { decryptAddress, rememberAddress, recallAddress } from './venue'

/** Tiny shared store so the venue card, RSVP and calendar agree on the address. */
let unlocked = null
const listeners = new Set()
const emit = () => listeners.forEach((l) => l())

function current() {
  const v = EVENT.venue
  if (v.addressMode === 'public') return v.address || ''
  if (v.addressMode === 'passcode') {
    if (unlocked === null) unlocked = recallAddress() || ''
    return unlocked
  }
  return ''
}

export async function unlockAddress(passcode) {
  const a = await decryptAddress(passcode)
  unlocked = a
  rememberAddress(a)
  emit()
  return a
}

export function useAddress() {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l) },
    current,
    current,
  )
}
