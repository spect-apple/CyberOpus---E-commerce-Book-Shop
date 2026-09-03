interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
  className?: string;
}

const sizes = {
  sm: { icon: 28, fontSize: '1rem',    gap: '0.4rem'  },
  md: { icon: 36, fontSize: '1.25rem', gap: '0.5rem'  },
  lg: { icon: 48, fontSize: '1.75rem', gap: '0.625rem'},
}

export default function Logo({ size = 'md', variant = 'full', className = '' }: LogoProps) {
  const { icon, fontSize, gap } = sizes[size]

  return (
    <div
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', gap, textDecoration: 'none' }}
      aria-label="CyberOpus"
    >
      {/* Book Icon Mark */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="co-left" x1="4" y1="8" x2="22" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4338CA" />
            <stop offset="100%" stopColor="#312E81" />
          </linearGradient>
          <linearGradient id="co-right" x1="22" y1="8" x2="40" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="co-bg" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E1B4B" />
            <stop offset="100%" stopColor="#0F0D2B" />
          </linearGradient>
          <filter id="co-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#312E81" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Rounded background */}
        <rect width="44" height="44" rx="10" fill="url(#co-bg)" />

        {/* Book base / cover bottom edge */}
        <rect x="7" y="32" width="30" height="3" rx="1" fill="#0F0D2B" opacity="0.6" />

        {/* Left book page */}
        <path
          d="M8 10 L22 8 L22 33 L8 31 Z"
          fill="url(#co-left)"
          filter="url(#co-shadow)"
        />
        {/* Right book page */}
        <path
          d="M22 8 L36 10 L36 31 L22 33 Z"
          fill="url(#co-right)"
        />

        {/* Spine */}
        <rect x="20.5" y="8" width="3" height="25" rx="1" fill="#0F0D2B" opacity="0.7" />

        {/* Text lines — left page */}
        <line x1="11" y1="14.5" x2="19.5" y2="13.5" stroke="rgba(255,255,255,0.50)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="11" y1="18"   x2="19.5" y2="17"   stroke="rgba(255,255,255,0.40)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="11" y1="21.5" x2="19.5" y2="20.5" stroke="rgba(255,255,255,0.40)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="11" y1="25"   x2="19.5" y2="24"   stroke="rgba(255,255,255,0.30)" strokeWidth="1.5" strokeLinecap="round" />

        {/* Text lines — right page */}
        <line x1="24.5" y1="13.5" x2="33" y2="14.5" stroke="rgba(255,255,255,0.50)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="24.5" y1="17"   x2="33" y2="18"   stroke="rgba(255,255,255,0.40)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="24.5" y1="20.5" x2="33" y2="21.5" stroke="rgba(255,255,255,0.40)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="24.5" y1="24"   x2="33" y2="25"   stroke="rgba(255,255,255,0.30)" strokeWidth="1.5" strokeLinecap="round" />

        {/* Sparkle on top-right corner (digital/cyber accent) */}
        <g transform="translate(31, 5.5)">
          <circle cx="0" cy="0" r="1.2" fill="#FBBF24" />
          <line x1="-2.5" y1="0" x2="2.5" y2="0" stroke="#FBBF24" strokeWidth="0.9" strokeLinecap="round" />
          <line x1="0" y1="-2.5" x2="0" y2="2.5" stroke="#FBBF24" strokeWidth="0.9" strokeLinecap="round" />
          <line x1="-1.8" y1="-1.8" x2="1.8" y2="1.8" stroke="#FBBF24" strokeWidth="0.7" strokeLinecap="round" opacity="0.7" />
          <line x1="1.8" y1="-1.8" x2="-1.8" y2="1.8" stroke="#FBBF24" strokeWidth="0.7" strokeLinecap="round" opacity="0.7" />
        </g>
      </svg>

      {/* Wordmark */}
      {variant === 'full' && (
        <span
          style={{
            fontSize,
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            color: 'var(--text-primary)',
            userSelect: 'none',
          }}
        >
          <span style={{ color: '#4338CA' }}>Cyber</span>
          <span style={{ color: 'var(--text-primary)' }}>Opus</span>
        </span>
      )}
    </div>
  )
}
