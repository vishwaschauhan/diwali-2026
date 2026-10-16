import { useState } from 'react'
import Diya from './Diya'

/**
 * Lazy image with a warm shimmer while loading and a graceful fallback if the
 * file is missing (e.g. an expired legacy link). Never shows a broken icon.
 */
export default function Photo({ src, alt, className = '', imgClassName = '', eager = false, onFail, fallback }) {
  const [state, setState] = useState('loading')
  return (
    <div className={`relative overflow-hidden bg-night-soft ${className}`}>
      {state !== 'loaded' && (
        <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(110deg,#1a2240_30%,#26304f_50%,#1a2240_70%)] bg-[length:200%_100%] motion-safe:animate-[shimmer_1.8s_linear_infinite]">
          {state === 'error' && fallback}
          {state === 'error' && !fallback && (
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              <Diya lit className="h-12 w-12 opacity-80" animate={false} />
              <span className="text-[0.7rem] uppercase tracking-[0.2em] text-ivory/45">Photo coming soon</span>
            </div>
          )}
        </div>
      )}
      {state !== 'error' && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setState('loaded')}
          onError={() => { setState('error'); onFail?.() }}
          className={`h-full w-full object-cover transition-[opacity,transform] duration-700 ${state === 'loaded' ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        />
      )}
    </div>
  )
}
