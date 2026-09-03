import { Link } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'

export default function FloatingCartBar() {
  const { isAuthenticated } = useAuth()
  const { cart } = useCart()

  if (!isAuthenticated || !cart || cart.itemCount === 0) return null

  return (
    <div className="fcb" role="complementary" aria-label="Cart summary">
      <div className="fcb-left">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <span className="fcb-count">{cart.itemCount} item{cart.itemCount !== 1 ? 's' : ''}</span>
        <span className="fcb-divider">·</span>
        <span className="fcb-total">₹{cart.total.toFixed(2)}</span>
      </div>
      <div className="fcb-right">
        <Link to="/cart" className="fcb-cart-link">View Cart</Link>
        <Link to="/checkout" className="fcb-checkout-btn">
          Checkout
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>

      <style>{`
        .fcb {
          position: fixed;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 500;
          background: var(--primary);
          color: white;
          border-radius: 100px;
          padding: 0.625rem 0.75rem 0.625rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.15);
          animation: fcb-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          white-space: nowrap;
          min-width: 280px;
          justify-content: space-between;
        }
        @keyframes fcb-in {
          from { transform: translateX(-50%) translateY(120%); opacity: 0; }
          to   { transform: translateX(-50%) translateY(0);   opacity: 1; }
        }
        .fcb-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }
        .fcb-count { font-weight: 700; }
        .fcb-divider { opacity: 0.5; }
        .fcb-total { font-weight: 800; }
        .fcb-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .fcb-cart-link {
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255,255,255,0.75);
          text-decoration: none;
          padding: 0.3rem 0.6rem;
          border-radius: 100px;
          transition: color 0.15s;
        }
        .fcb-cart-link:hover { color: white; }
        .fcb-checkout-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: white;
          color: var(--primary);
          font-size: 0.875rem;
          font-weight: 800;
          padding: 0.45rem 1rem;
          border-radius: 100px;
          text-decoration: none;
          transition: all 0.2s;
          letter-spacing: 0.02em;
        }
        .fcb-checkout-btn:hover {
          background: #f5df3a;
          color: #0d0c0a;
          transform: scale(1.03);
        }
        @media (max-width: 600px) {
          .fcb { bottom: 1rem; left: 1rem; right: 1rem; transform: none; min-width: unset; border-radius: var(--radius-xl); }
          @keyframes fcb-in {
            from { transform: translateY(120%); opacity: 0; }
            to   { transform: translateY(0);   opacity: 1; }
          }
        }
      `}</style>
    </div>
  )
}
