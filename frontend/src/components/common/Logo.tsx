import { Link } from 'react-router-dom'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'full' | 'icon'
  className?: string
  linkTo?: string
}

const sizes = {
  sm: { icon: 22, fs: '1.1rem'  },
  md: { icon: 28, fs: '1.35rem' },
  lg: { icon: 38, fs: '1.8rem'  },
  xl: { icon: 52, fs: '2.3rem'  },
}

export function CyberOpusIcon({ size = 28, color = '#f0ede5' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="2" y="5" width="13" height="22" rx="2" stroke={color} strokeWidth="1.5" opacity="0.9"/>
      <rect x="17" y="5" width="13" height="22" rx="2" stroke={color} strokeWidth="1.5" opacity="0.9"/>
      <line x1="16" y1="6" x2="16" y2="26" stroke={color} strokeWidth="1" opacity="0.5"/>
      <line x1="5"  y1="12" x2="12" y2="12" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
      <line x1="5"  y1="16" x2="12" y2="16" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
      <line x1="5"  y1="20" x2="10" y2="20" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
      <line x1="20" y1="12" x2="27" y2="12" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
      <line x1="20" y1="16" x2="27" y2="16" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
      <line x1="20" y1="20" x2="25" y2="20" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
    </svg>
  )
}

export default function Logo({ size = 'md', variant = 'full', className = '', linkTo = '/' }: LogoProps) {
  const { icon, fs } = sizes[size]

  const content = (
    <span
      className={`co-logo ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', textDecoration: 'none' }}
    >
      <CyberOpusIcon size={icon} color="var(--navbar-logo-icon, #f0ede5)" />
      {variant === 'full' && (
        <span style={{ display: 'flex', alignItems: 'baseline', gap: 0, lineHeight: 1 }}>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: fs,
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: 'var(--navbar-logo-primary, #f0ede5)',
            textTransform: 'uppercase',
          }}>
            Cyber
          </span>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: fs,
            fontWeight: 900,
            letterSpacing: '0.05em',
            color: 'var(--navbar-logo-accent, #f5df3a)',
            textTransform: 'uppercase',
          }}>
            Opus
          </span>
        </span>
      )}
    </span>
  )

  return linkTo ? <Link to={linkTo} style={{ textDecoration: 'none' }}>{content}</Link> : content
}
