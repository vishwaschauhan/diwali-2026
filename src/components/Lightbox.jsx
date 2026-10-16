import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Close, Chevron } from './Icons'
import Diya from './Diya'

/** Full-screen photo viewer: arrows, Esc, swipe, focus return. */
export default function Lightbox({ photos, index, onClose, onIndex, title }) {
  const reduce = useReducedMotion()
  const closeRef = useRef(null)
  const lastFocus = useRef(null)
  const [dir, setDir] = useState(0)
  const [failed, setFailed] = useState({})
  const open = index !== null && index !== undefined

  const go = useCallback((d) => {
    if (!open) return
    setDir(d)
    onIndex((index + d + photos.length) % photos.length)
  }, [open, index, photos.length, onIndex])

  useEffect(() => {
    if (!open) return
    lastFocus.current = document.activeElement
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'Tab') {
        // keep focus inside the dialog
        const nodes = [...document.querySelectorAll('[data-lightbox] button')]
        const i = nodes.indexOf(document.activeElement)
        e.preventDefault()
        nodes[(i + (e.shiftKey ? -1 : 1) + nodes.length) % nodes.length]?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      lastFocus.current?.focus?.()
    }
  }, [open, go, onClose])

  // Preload neighbours for instant navigation
  useEffect(() => {
    if (!open) return
    for (const d of [1, -1]) {
      const p = photos[(index + d + photos.length) % photos.length]
      if (p) { const img = new Image(); img.referrerPolicy = 'no-referrer'; img.src = p.src }
    }
  }, [open, index, photos])

  const variants = {
    enter: (d) => ({ opacity: 0, x: reduce ? 0 : d * 60 }),
    center: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: 0, x: reduce ? 0 : d * -60 }),
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          data-lightbox
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photo ${index + 1} of ${photos.length}`}
          className="fixed inset-0 z-50 flex flex-col bg-night-deep/97 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <p className="font-display text-xl text-gold-pale">
              {title} <span className="ml-2 font-sans text-sm text-ivory/50">{index + 1} / {photos.length}</span>
            </p>
            <button ref={closeRef} type="button" onClick={onClose} aria-label="Close photo viewer"
              className="grid h-11 w-11 place-items-center rounded-full border border-gold/30 text-ivory hover:bg-white/10">
              <Close />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-2 pb-6 sm:px-20">
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.div
                key={index}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                drag={reduce ? false : 'x'}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60 || info.velocity.x < -400) go(1)
                  else if (info.offset.x > 60 || info.velocity.x > 400) go(-1)
                }}
                className="flex h-full w-full touch-pan-y items-center justify-center"
              >
                {failed[index] ? (
                  <div className="flex flex-col items-center gap-3 text-ivory/60">
                    <Diya className="h-20 w-20" />
                    <p>This photo couldn't be loaded.</p>
                  </div>
                ) : (
                  <img
                    src={photos[index].src}
                    alt={`${title}, photo ${index + 1} of ${photos.length}`}
                    referrerPolicy="no-referrer"
                    draggable={false}
                    onError={() => setFailed((f) => ({ ...f, [index]: true }))}
                    className="max-h-full max-w-full select-none rounded-xl object-contain shadow-[0_40px_120px_-40px_rgba(0,0,0,1)]"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {photos.length > 1 && (
              <>
                <button type="button" onClick={() => go(-1)} aria-label="Previous photo"
                  className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-gold/30 bg-night/60 text-ivory hover:bg-night sm:grid sm:left-6">
                  <Chevron dir="left" />
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Next photo"
                  className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-gold/30 bg-night/60 text-ivory hover:bg-night sm:grid sm:right-6">
                  <Chevron />
                </button>
              </>
            )}
          </div>
          <p className="pb-5 text-center text-xs text-ivory/40 sm:hidden">Swipe to browse</p>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
