import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface CartAddedToastProps {
  bookTitle: string
  onClose: () => void
}

export default function CartAddedToast({ bookTitle, onClose }: CartAddedToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t1)
  }, [])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <div className={`cart-toast ${visible ? 'cart-toast-show' : ''}`} role="status" aria-live="polite">
      <div className="cart-toast-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <div className="cart-toast-body">
        <p className="cart-toast-title">Added to cart</p>
        <p className="cart-toast-sub" title={bookTitle}>{bookTitle.length > 32 ? bookTitle.slice(0, 32) + '…' : bookTitle}</p>
      </div>
      <Link to="/cart" className="cart-toast-action" onClick={handleClose}>
        View Cart
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </Link>
      <button className="cart-toast-close" onClick={handleClose} aria-label="Dismiss">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>

      <style>{`
        .cart-toast {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          padding: 0.875rem 1rem;
          min-width: 300px;
          max-width: 360px;
          transform: translateY(110%);
          opacity: 0;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
        }
        .cart-toast-show {
          transform: translateY(0);
          opacity: 1;
        }
        .cart-toast-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--success-light);
          color: var(--success);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .cart-toast-body { flex: 1; min-width: 0; }
        .cart-toast-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.1rem;
        }
        .cart-toast-sub {
          font-size: 0.75rem;
          color: var(--text-secondary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .cart-toast-action {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary);
          white-space: nowrap;
          padding: 0.35rem 0.625rem;
          border-radius: var(--radius-sm);
          border: 1.5px solid var(--primary);
          transition: background 0.15s;
          text-decoration: none;
          flex-shrink: 0;
        }
        .cart-toast-action:hover { background: var(--primary-light); }
        .cart-toast-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          color: var(--text-muted);
          background: none;
          border: none;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.15s;
        }
        .cart-toast-close:hover { background: var(--bg-subtle); color: var(--text-primary); }
        @media (max-width: 480px) {
          .cart-toast { bottom: 1rem; right: 1rem; left: 1rem; min-width: unset; max-width: unset; }
        }
      `}</style>
    </div>
  )
}
