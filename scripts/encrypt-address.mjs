#!/usr/bin/env node
/**
 * Encrypts the venue address so it can live in the public site but only be
 * read by guests who know the passcode.
 *
 *   npm run encrypt-address -- "123 Example Ln, Pearland, TX 77584" "sparkle"
 *
 * Paste the printed object into EVENT.venue.encryptedAddress and set
 * EVENT.venue.addressMode = 'passcode'. Leave EVENT.venue.address blank.
 * Passcodes are case-insensitive. Share the passcode in your WhatsApp invite.
 */
import { webcrypto as crypto } from 'node:crypto'

const [address, passcode] = process.argv.slice(2)
if (!address || !passcode) {
  console.error('Usage: npm run encrypt-address -- "<full address>" "<passcode>"')
  process.exit(1)
}
const enc = new TextEncoder()
const salt = crypto.getRandomValues(new Uint8Array(16))
const iv = crypto.getRandomValues(new Uint8Array(12))
const base = await crypto.subtle.importKey('raw', enc.encode(passcode.trim().toLowerCase()), 'PBKDF2', false, ['deriveKey'])
const key = await crypto.subtle.deriveKey(
  { name: 'PBKDF2', salt, iterations: 150000, hash: 'SHA-256' },
  base, { name: 'AES-GCM', length: 256 }, false, ['encrypt'],
)
const data = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(address)))
const b64 = (u) => Buffer.from(u).toString('base64')
console.log('\nencryptedAddress: ' + JSON.stringify({ salt: b64(salt), iv: b64(iv), data: b64(data) }, null, 2) + ',\n')
