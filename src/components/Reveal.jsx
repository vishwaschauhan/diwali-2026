import { motion, useReducedMotion } from 'framer-motion'

/** Fades + lifts children into view once. Static when reduced motion is on. */
export default function Reveal({ children, delay = 0, y = 24, as = 'div', className = '', ...rest }) {
  const reduce = useReducedMotion()
  const M = motion[as]
  if (reduce) {
    const Tag = as
    return <Tag className={className} {...rest}>{children}</Tag>
  }
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </M>
  )
}

export function SectionHeading({ eyebrow, title, intro, light = false, className = '' }) {
  return (
    <div className={`mx-auto max-w-2xl text-center ${className}`}>
      {eyebrow && <Reveal as="p" className={`eyebrow ${light ? '!text-ruby' : ''}`}>{eyebrow}</Reveal>}
      <Reveal as="h2" delay={0.05} className={`display mt-4 text-balance text-[2.6rem] sm:text-6xl ${light ? 'text-night' : 'gold-text'}`}>
        {title}
      </Reveal>
      {intro && (
        <Reveal as="p" delay={0.12} className={`mx-auto mt-5 max-w-xl text-base leading-relaxed sm:text-lg ${light ? 'text-ink/75' : 'text-ivory/75'}`}>
          {intro}
        </Reveal>
      )}
    </div>
  )
}
