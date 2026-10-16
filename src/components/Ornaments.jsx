/** Decorative SVG ornaments. All aria-hidden. */

export function RangoliDivider({ className = '', tone = 'gold' }) {
  const c = tone === 'gold' ? '#d2a34e' : tone === 'ruby' ? '#853a46' : 'currentColor'
  return (
    <svg viewBox="0 0 320 32" className={className} aria-hidden="true" focusable="false">
      <g fill="none" stroke={c} strokeWidth="1">
        <path d="M0 16 H118" strokeOpacity=".5" />
        <path d="M202 16 H320" strokeOpacity=".5" />
        <path d="M160 2 L174 16 L160 30 L146 16 Z" />
        <path d="M160 8 L168 16 L160 24 L152 16 Z" fill={c} fillOpacity=".25" />
        <circle cx="132" cy="16" r="3" />
        <circle cx="188" cy="16" r="3" />
        <circle cx="122" cy="16" r="1.5" fill={c} />
        <circle cx="198" cy="16" r="1.5" fill={c} />
      </g>
    </svg>
  )
}

/** Rangoli medallion — restrained, geometric, 8-fold. */
export function Rangoli({ className = '', opacity = 0.18 }) {
  const petals = Array.from({ length: 16 })
  return (
    <svg viewBox="-100 -100 200 200" className={className} aria-hidden="true" focusable="false" style={{ opacity }}>
      <g fill="none" stroke="#d2a34e" strokeWidth=".6">
        <circle r="96" />
        <circle r="88" strokeDasharray="1 4" />
        <circle r="62" />
        <circle r="30" />
        <circle r="10" fill="#d2a34e" fillOpacity=".3" />
        {petals.map((_, i) => (
          <g key={i} transform={`rotate(${(i * 360) / 16})`}>
            <path d="M0 -30 C 10 -45, 10 -55, 0 -62 C -10 -55, -10 -45, 0 -30 Z" />
            <path d="M0 -62 C 6 -72, 6 -80, 0 -88 C -6 -80, -6 -72, 0 -62 Z" strokeOpacity=".7" />
            <circle cy="-94" r="1.4" fill="#d2a34e" />
          </g>
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={i} transform={`rotate(${i * 45 + 22.5})`} d="M0 -10 L 6 -20 L 0 -30 L -6 -20 Z" fill="#d2a34e" fillOpacity=".15" />
        ))}
      </g>
    </svg>
  )
}

/** Marigold garland swag across the top of a section. */
export function Garland({ className = '' }) {
  const n = 23
  const pts = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1)
    return { x: 10 + t * 380, y: 8 + Math.sin(t * Math.PI) * 26 }
  })
  return (
    <svg viewBox="0 0 400 60" className={className} aria-hidden="true" focusable="false" preserveAspectRatio="none">
      <path d="M10 8 Q 200 60 390 8" stroke="#6b4818" strokeWidth="1" fill="none" opacity=".6" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="6.2" fill={i % 3 === 1 ? '#e8892c' : '#f2a93b'} />
          <circle cx={p.x - 1.5} cy={p.y - 1.5} r="2.6" fill="#ffd27a" opacity=".7" />
        </g>
      ))}
      {[0.18, 0.5, 0.82].map((t) => {
        const x = 10 + t * 380, y = 8 + Math.sin(t * Math.PI) * 26
        return (
          <g key={t}>
            <path d={`M${x} ${y + 6} v 12`} stroke="#6b4818" strokeWidth=".8" />
            <circle cx={x} cy={y + 21} r="4.5" fill="#e8892c" />
            <path d={`M${x - 4} ${y + 27} q 4 8 8 0`} fill="#4f7a3a" />
          </g>
        )
      })}
    </svg>
  )
}

/** Ornate (mughal) arch outline used to frame imagery. */
export function Arch({ className = '', stroke = '#d2a34e' }) {
  return (
    <svg viewBox="0 0 200 260" className={className} aria-hidden="true" focusable="false" preserveAspectRatio="none">
      <path
        d="M10 258 V 110 C 10 70, 40 52, 64 40 C 82 31, 92 20, 100 4 C 108 20, 118 31, 136 40 C 160 52, 190 70, 190 110 V 258"
        fill="none" stroke={stroke} strokeWidth="1.2" vectorEffect="non-scaling-stroke"
      />
      <path
        d="M20 258 V 114 C 20 80, 46 64, 68 52 C 84 43, 94 33, 100 20 C 106 33, 116 43, 132 52 C 154 64, 180 80, 180 114 V 258"
        fill="none" stroke={stroke} strokeOpacity=".4" strokeWidth="1" vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/** Hanging lantern (kandil). */
export function Lantern({ className = '' }) {
  return (
    <svg viewBox="0 0 60 140" className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="lantern-glow" cx="50%" cy="60%" r="60%">
          <stop offset="0%" stopColor="#ffe3a0" stopOpacity=".95" />
          <stop offset="100%" stopColor="#e8892c" stopOpacity=".2" />
        </radialGradient>
      </defs>
      <line x1="30" y1="0" x2="30" y2="40" stroke="#d2a34e" strokeOpacity=".6" />
      <path d="M22 40 h16 l4 8 h-24 z" fill="#b8862f" />
      <path d="M18 48 h24 c 8 14 8 40 0 54 h-24 c -8 -14 -8 -40 0 -54 z" fill="url(#lantern-glow)" stroke="#d2a34e" strokeWidth="1" />
      <path d="M30 48 v54 M22 50 c -4 16 -4 34 0 50 M38 50 c 4 16 4 34 0 50" stroke="#853a46" strokeOpacity=".5" fill="none" />
      <path d="M18 102 h24 l-4 8 h-16 z" fill="#b8862f" />
      <path d="M30 110 v14" stroke="#d2a34e" />
      <circle cx="30" cy="128" r="3" fill="#d2a34e" />
    </svg>
  )
}
