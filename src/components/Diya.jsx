import { useId } from 'react'

/**
 * Hand-drawn brass diya. `lit` toggles the flame + halo; `glow` scales halo.
 * Purely decorative unless wrapped in a control by the caller.
 */
export default function Diya({ lit = true, className = '', glow = 1, animate = true }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false" overflow="visible">
      <defs>
        <radialGradient id={`halo-${id}`} cx="50%" cy="42%" r="50%">
          <stop offset="0%" stopColor="#ffd98a" stopOpacity={0.55 * glow} />
          <stop offset="35%" stopColor="#f2a93b" stopOpacity={0.22 * glow} />
          <stop offset="100%" stopColor="#f2a93b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`brass-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5d58e" />
          <stop offset="40%" stopColor="#d2a34e" />
          <stop offset="100%" stopColor="#7a5520" />
        </linearGradient>
        <linearGradient id={`rim-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8a6126" />
          <stop offset="50%" stopColor="#fbe3a6" />
          <stop offset="100%" stopColor="#8a6126" />
        </linearGradient>
        <radialGradient id={`flame-${id}`} cx="50%" cy="78%" r="70%">
          <stop offset="0%" stopColor="#fffdf2" />
          <stop offset="30%" stopColor="#ffe9a8" />
          <stop offset="65%" stopColor="#f6a53a" />
          <stop offset="100%" stopColor="#d9541e" stopOpacity="0.9" />
        </radialGradient>
        <radialGradient id={`core-${id}`} cx="50%" cy="70%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fff2c4" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle
        cx="100" cy="88" r="92"
        fill={`url(#halo-${id})`}
        style={{ opacity: lit ? 1 : 0, transition: 'opacity 1.2s cubic-bezier(.22,1,.36,1)', transformOrigin: '100px 88px' }}
        className={lit && animate ? 'glow-breathe' : ''}
      />

      {/* flame */}
      <g
        style={{
          opacity: lit ? 1 : 0,
          transform: lit ? 'scale(1)' : 'scale(0.2)',
          transformOrigin: '100px 118px',
          transition: 'opacity .7s ease, transform 1s cubic-bezier(.22,1,.36,1)',
        }}
      >
        <g className={animate ? 'flame' : ''}>
          <path d="M100 58 C 88 80, 84 96, 90 108 C 94 116, 106 116, 110 108 C 116 96, 112 80, 100 58 Z" fill={`url(#flame-${id})`} />
          <path d="M100 82 C 95 94, 94 102, 97 108 C 99 111, 102 111, 104 108 C 106 102, 105 94, 100 82 Z" fill={`url(#core-${id})`} />
        </g>
      </g>

      {/* wick */}
      <path d="M100 112 q -2 6 0 12" stroke="#3a2a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* bowl */}
      <path
        d="M34 122 C 40 150, 70 164, 100 164 C 130 164, 160 150, 170 122 C 150 112, 130 116, 118 120 L 100 124 L 82 120 C 70 116, 50 112, 34 122 Z"
        fill={`url(#brass-${id})`}
      />
      {/* spout */}
      <path d="M150 118 C 162 110, 176 108, 184 112 C 176 120, 166 124, 158 126 Z" fill={`url(#brass-${id})`} />
      {/* rim highlight */}
      <path d="M36 122 C 70 112, 130 112, 168 122" stroke={`url(#rim-${id})`} strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* oil */}
      <ellipse cx="100" cy="122" rx="54" ry="5" fill="#5b3a12" opacity="0.6" />
      {/* engraved band */}
      <path d="M52 140 C 80 150, 120 150, 148 140" stroke="#fbe3a6" strokeOpacity="0.35" strokeWidth="1.2" fill="none" />
      {[64, 82, 100, 118, 136].map((x) => (
        <circle key={x} cx={x} cy={x === 100 ? 147 : x === 82 || x === 118 ? 146 : 143} r="1.6" fill="#fbe3a6" opacity="0.45" />
      ))}
      {/* base */}
      <ellipse cx="100" cy="170" rx="30" ry="5" fill="#6b4818" />
      <path d="M78 164 L 74 170 L 126 170 L 122 164 Z" fill={`url(#brass-${id})`} opacity="0.9" />
    </svg>
  )
}
