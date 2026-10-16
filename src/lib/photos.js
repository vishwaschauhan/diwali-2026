import { EVENT } from '../config/event'
import legacy from '../../scripts/legacy-photo-urls.json'

/**
 * Every image file inside src/photos/<year>/ is picked up automatically and
 * optimised by Vite at build time. Files are sorted by name, so prefix them
 * (01-…, 02-…) to control order.
 */
const local = import.meta.glob('../photos/*/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const byYear = {}
for (const [path, url] of Object.entries(local).sort(([a], [b]) => a.localeCompare(b))) {
  const year = Number(path.split('/').at(-2))
  ;(byYear[year] ||= []).push({ src: url, origin: 'local' })
}

/** Photos for a year: local files first, otherwise the legacy Google Sites list. */
export function photosFor(year) {
  if (byYear[year]?.length) return byYear[year]
  const urls = legacy[String(year)] || []
  return urls.map((src) => ({ src, origin: 'legacy' }))
}

export const chapters = EVENT.chapters.map((c) => ({ ...c, photos: photosFor(c.year) }))
