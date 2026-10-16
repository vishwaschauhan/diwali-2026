import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Lightweight canvas of drifting golden embers. ~60 particles, pauses when
 * off-screen or when the tab is hidden; renders a still frame when the user
 * prefers reduced motion.
 */
export default function Particles({ density = 1, className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = 0, h = 0, raf = 0, running = true, visible = true
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let parts = []

    const spawn = (initial) => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + 10,
      r: 0.6 + Math.random() * 1.8,
      vy: 0.15 + Math.random() * 0.45,
      vx: (Math.random() - 0.5) * 0.15,
      a: 0.25 + Math.random() * 0.6,
      p: Math.random() * Math.PI * 2,
    })

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width; h = rect.height
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(70, (w * h) / 16000) * density)
      parts = Array.from({ length: count }, () => spawn(true))
    }

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        const tw = 0.6 + 0.4 * Math.sin(t / 900 + p.p)
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4)
        g.addColorStop(0, `rgba(255, 220, 150, ${p.a * tw})`)
        g.addColorStop(1, 'rgba(242, 169, 59, 0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const tick = (t) => {
      if (!running) return
      if (visible) {
        for (const p of parts) {
          p.y -= p.vy
          p.x += p.vx + Math.sin(t / 2000 + p.p) * 0.08
          if (p.y < -10) Object.assign(p, spawn(false))
        }
        draw(t)
      }
      raf = requestAnimationFrame(tick)
    }

    resize()
    if (reduce) {
      draw(0)
    } else {
      raf = requestAnimationFrame(tick)
    }

    const ro = new ResizeObserver(() => { resize(); if (reduce) draw(0) })
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(canvas)
    const onVis = () => { visible = !document.hidden }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect(); io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [reduce, density])

  return <canvas ref={ref} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden="true" />
}
