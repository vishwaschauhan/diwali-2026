#!/usr/bin/env node
/**
 * Downloads the photos from the 2025 Google Site into src/photos/<year>/ so
 * the new site serves them itself (Google Sites image links can expire).
 *
 *   npm run photos:import
 *
 * Re-running is safe: files that already exist are skipped.
 */
import { mkdir, writeFile, access } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import legacy from './legacy-photo-urls.json' with { type: 'json' }

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'photos')
let ok = 0, failed = 0

for (const [year, urls] of Object.entries(legacy)) {
  if (!/^\d{4}$/.test(year)) continue
  await mkdir(join(root, year), { recursive: true })
  for (const [i, url] of urls.entries()) {
    const file = join(root, year, `legacy-${String(i + 1).padStart(2, '0')}.jpg`)
    try { await access(file); ok++; continue } catch { /* not downloaded yet */ }
    try {
      const res = await fetch(url.replace(/=w\d+$/, '=w1600'))
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      await writeFile(file, Buffer.from(await res.arrayBuffer()))
      ok++
      console.log(`✓ ${year} #${i + 1}`)
    } catch (err) {
      failed++
      console.warn(`✗ ${year} #${i + 1}: ${err.message}`)
    }
  }
}
console.log(`\n${ok} photos ready, ${failed} failed.`)
if (failed) console.log('Failed images can be saved manually from the old Gallery page into src/photos/<year>/.')
