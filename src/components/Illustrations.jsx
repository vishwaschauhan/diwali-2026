/** Line illustrations for "What awaits you". Gold strokes, 64x64. */
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' }
const Svg = ({ children, className = 'h-14 w-14' }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false" {...S}>{children}</svg>
)

export const DiyaLine = (p) => (
  <Svg {...p}>
    <path d="M32 14c-4 6-5 10-3 13 1.5 2 4.5 2 6 0 2-3 1-7-3-13z" fill="#f2a93b" fillOpacity=".35" />
    <path d="M14 36c3 9 11 13 18 13s15-4 18-13c-6-3-12-2-16 0h-4c-4-2-10-3-16 0z" />
    <path d="M48 35c3-2 7-3 9-2-2 3-5 4-8 5" />
    <path d="M26 53h12M32 49v4" />
    <path d="M20 42c8 3 16 3 24 0" strokeOpacity=".5" />
  </Svg>
)
export const Aarti = (p) => (
  <Svg {...p}>
    <ellipse cx="32" cy="42" rx="22" ry="7" />
    <ellipse cx="32" cy="42" rx="16" ry="4.5" strokeOpacity=".5" />
    <path d="M32 26c-2.5 4-3 6.5-1.8 8.4.9 1.3 2.7 1.3 3.6 0 1.2-1.9.7-4.4-1.8-8.4z" fill="#f2a93b" fillOpacity=".35" />
    <path d="M27 38c2 1.5 8 1.5 10 0l-1-3h-8z" />
    {[14, 50].map((x) => <g key={x}><circle cx={x} cy="40" r="2.5" fill="#e8892c" fillOpacity=".4" /><circle cx={x} cy="40" r="1" /></g>)}
    <path d="M22 18c1 2 1 4 0 6M42 18c1 2 1 4 0 6M32 14v3" strokeOpacity=".6" />
  </Svg>
)
export const Thali = (p) => (
  <Svg {...p}>
    <circle cx="32" cy="34" r="22" />
    <circle cx="32" cy="34" r="18" strokeOpacity=".4" />
    <circle cx="24" cy="27" r="5" /><circle cx="38" cy="25" r="4.5" /><circle cx="42" cy="37" r="4.5" />
    <path d="M20 38c3-2 9-2 12 1 2 2 1 6-3 7-5 1-10-2-9-8z" />
    <path d="M24 27h0M38 25h0" strokeWidth="3" stroke="#e8892c" strokeOpacity=".7" />
  </Svg>
)
export const Chai = (p) => (
  <Svg {...p}>
    <path d="M14 26h18l-2 22a3 3 0 0 1-3 2.6h-8A3 3 0 0 1 16 48z" />
    <path d="M15 33h16" strokeOpacity=".5" />
    <path d="M36 30h14l-1.6 18a3 3 0 0 1-3 2.6h-4.8a3 3 0 0 1-3-2.6z" />
    <path d="M37 36h12" strokeOpacity=".5" />
    <path d="M20 20c-1-2 1-3 0-5M26 20c-1-2 1-3 0-5M43 24c-1-2 1-3 0-5" strokeOpacity=".6" />
  </Svg>
)
export const Dholak = (p) => (
  <Svg {...p}>
    <ellipse cx="16" cy="34" rx="5" ry="12" />
    <ellipse cx="48" cy="34" rx="5" ry="12" />
    <path d="M16 22c10-3 22-3 32 0M16 46c10 3 22 3 32 0" />
    <path d="M18 23l8 22M26 22l8 24M34 22l8 24M42 22l4 21" strokeOpacity=".5" />
    <path d="M10 14l5 5M54 14l-5 5" strokeOpacity=".6" />
  </Svg>
)
export const Dance = (p) => (
  <Svg {...p}>
    <path d="M18 52 40 12M24 52 46 12" />
    <path d="M38 14l4-3 3 1M44 14l4-3 3 1" strokeOpacity=".6" />
    {[[20, 46], [23, 41], [26, 35], [29, 30]].map(([x, y], i) => <circle key={i} cx={x + 6} cy={y} r="1.8" fill="#d2a34e" fillOpacity=".5" />)}
    <path d="M10 22c3-2 5-2 8 0M48 44c3-2 5-2 8 0M8 34c2-1 4-1 6 0" strokeOpacity=".5" />
  </Svg>
)
