const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }
const I = ({ children, className = 'h-5 w-5', ...p }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false" {...base} {...p}>{children}</svg>
)
export const Calendar = (p) => <I {...p}><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></I>
export const Clock = (p) => <I {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></I>
export const Pin = (p) => <I {...p}><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.4" /></I>
export const Directions = (p) => <I {...p}><path d="M12 2.8 21.2 12 12 21.2 2.8 12z" /><path d="M9 14.5V12a1.5 1.5 0 0 1 1.5-1.5H15M13 8.5l2 2-2 2" /></I>
export const Arrow = (p) => <I {...p}><path d="M5 12h14M13 6l6 6-6 6" /></I>
export const ArrowDown = (p) => <I {...p}><path d="M12 5v14M6 13l6 6 6-6" /></I>
export const Close = (p) => <I {...p}><path d="M6 6l12 12M18 6L6 18" /></I>
export const Menu = (p) => <I {...p}><path d="M4 8h16M4 16h16" /></I>
export const Chevron = ({ dir = 'right', ...p }) => (
  <I {...p}><path d={dir === 'right' ? 'M9 5l7 7-7 7' : 'M15 5l-7 7 7 7'} /></I>
)
export const Share = (p) => <I {...p}><path d="M12 15V3M7.5 7.5 12 3l4.5 4.5" /><path d="M5 12v6.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V12" /></I>
export const Link = (p) => <I {...p}><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1" /><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" /></I>
export const Check = (p) => <I {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></I>
export const Phone = (p) => <I {...p}><path d="M5 4h3.5l1.7 4.3-2.2 1.4a11 11 0 0 0 6.3 6.3l1.4-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z" /></I>
export const Lock = (p) => <I {...p}><rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></I>
export const Car = (p) => <I {...p}><path d="M4 16.5V12l2-5h12l2 5v4.5" /><path d="M4 12h16" /><circle cx="7.5" cy="16.5" r="1.8" /><circle cx="16.5" cy="16.5" r="1.8" /></I>
export const Sparkle = (p) => <I {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></I>
export const Whatsapp = (p) => (
  <svg viewBox="0 0 24 24" className={p.className || 'h-5 w-5'} aria-hidden="true" fill="currentColor">
    <path d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.7l5-1.3A9.7 9.7 0 1 0 12 2.2zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.9 2c0 1.2.9 2.4 1 2.6.1.2 1.7 2.6 4.2 3.7 1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.6-.3z" />
  </svg>
)
