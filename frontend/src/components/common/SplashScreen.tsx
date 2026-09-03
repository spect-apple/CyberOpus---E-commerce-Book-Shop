import { useEffect, useState } from 'react'

interface SplashScreenProps {
  onDone: () => void
}

export default function SplashScreen({ onDone }: SplashScreenProps) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter')
  // Read theme at splash time so logo colors match current mode
  const isLight = document.documentElement.getAttribute('data-theme') === 'light'
  const opusColor = isLight ? '#1a56db' : '#f5df3a'

  useEffect(() => {
    // enter → hold after 300ms; hold → exit after 2700ms; call onDone at 3000ms
    const t1 = setTimeout(() => setPhase('hold'), 300)
    const t2 = setTimeout(() => setPhase('exit'), 2700)
    const t3 = setTimeout(() => onDone(), 3000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  return (
    <div className={`splash-root splash-${phase}`} aria-hidden="true">
      <div className="splash-content">
        <div className="splash-icon">
          <svg width="88" height="88" viewBox="0 0 64 64" fill="none">
            <rect x="4" y="12" width="26" height="40" rx="3" fill="#f0ede5" opacity="0.1"/>
            <rect x="34" y="12" width="26" height="40" rx="3" fill="#f0ede5" opacity="0.1"/>
            <rect x="4" y="12" width="26" height="40" rx="3" stroke="#f0ede5" strokeWidth="1.5"/>
            <rect x="34" y="12" width="26" height="40" rx="3" stroke="#f0ede5" strokeWidth="1.5"/>
            <line x1="9"  y1="22" x2="25" y2="22" stroke="#f0ede5" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
            <line x1="9"  y1="28" x2="25" y2="28" stroke="#f0ede5" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
            <line x1="9"  y1="34" x2="20" y2="34" stroke="#f0ede5" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
            <line x1="39" y1="22" x2="55" y2="22" stroke="#f0ede5" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
            <line x1="39" y1="28" x2="55" y2="28" stroke="#f0ede5" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
            <line x1="39" y1="34" x2="50" y2="34" stroke="#f0ede5" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
            <line x1="32" y1="14" x2="32" y2="50" stroke="#f0ede5" strokeWidth="1" opacity="0.4"/>
          </svg>
        </div>

        <div className="splash-wordmark">
          <span className="splash-cyber">CYBER</span><span className="splash-opus">OPUS</span>
        </div>

        <p className="splash-tagline">Your premium bookstore</p>
      </div>

      <style>{`
        .splash-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #0d0c0a;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .splash-enter { opacity: 0; }
        .splash-hold  { opacity: 1; }
        .splash-exit  { opacity: 0; }

        .splash-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease;
        }
        .splash-enter .splash-content { transform: scale(0.78); opacity: 0; }
        .splash-hold  .splash-content { transform: scale(1);    opacity: 1; }
        .splash-exit  .splash-content { transform: scale(1.08); opacity: 0; }

        .splash-icon {
          animation: splash-float 1.4s ease-in-out infinite alternate;
          filter: drop-shadow(0 0 32px rgba(245,223,58,0.25));
        }
        @keyframes splash-float {
          from { transform: translateY(0); }
          to   { transform: translateY(-10px); }
        }

        .splash-wordmark {
          display: flex;
          align-items: baseline;
          gap: 0;
          line-height: 1;
        }
        .splash-cyber {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.8rem, 8vw, 4.5rem);
          font-weight: 700;
          letter-spacing: 0.16em;
          color: #f0ede5;
        }
        .splash-opus {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.8rem, 8vw, 4.5rem);
          font-weight: 900;
          letter-spacing: 0.08em;
          color: ${opusColor};
        }
        .splash-tagline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: rgba(240,237,229,0.35);
        }
      `}</style>
    </div>
  )
}
