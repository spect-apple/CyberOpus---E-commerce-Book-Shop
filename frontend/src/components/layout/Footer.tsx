
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="7" fill="#2563eb"/>
                <path d="M7 8h9a4 4 0 0 1 0 8H7V8z" fill="white" opacity="0.9"/>
                <path d="M7 16h10a4 4 0 0 1 0 8H7v-8z" fill="white" opacity="0.7"/>
              </svg>
              <span>CyberOpus</span>
            </div>
            <p className="footer-tagline">
              Your premier destination for books. Discover, read, and explore thousands of titles.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Twitter" className="social-link">𝕏</a>
              <a href="#" aria-label="Facebook" className="social-link">f</a>
              <a href="#" aria-label="Instagram" className="social-link">📷</a>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Shop</h4>
            <ul className="footer-links">
              <li><Link to="/books">Browse Books</Link></li>
              <li><Link to="/recommendations">Recommendations</Link></li>
              <li><Link to="/books?inStock=true">In Stock</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Account</h4>
            <ul className="footer-links">
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/register">Create Account</Link></li>
              <li><Link to="/orders">My Orders</Link></li>
              <li><Link to="/rewards">Rewards</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Info</h4>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} CyberOpus. All rights reserved.</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            🔒 Secure payments · 📦 Fast delivery · ⭐ Reward points
          </p>
        </div>
      </div>

      <style>{`
        .footer {
          background: #111827;
          color: #d1d5db;
          padding: 3.5rem 0 1.5rem;
          margin-top: auto;
        }
        [data-theme="dark"] .footer {
          background: #1e2533;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 3rem;
          margin-bottom: 2.5rem;
        }
        .footer-brand {}
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          margin-bottom: 0.875rem;
          color: white;
          font-size: 1.2rem;
          font-weight: 800;
        }
        .footer-tagline {
          font-size: 0.875rem;
          line-height: 1.7;
          color: #9ca3af;
          margin-bottom: 1.25rem;
          max-width: 280px;
        }
        .footer-social {
          display: flex;
          gap: 0.625rem;
        }
        .social-link {
          width: 36px;
          height: 36px;
          background: rgba(255,255,255,0.08);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          color: #d1d5db;
          font-size: 0.875rem;
          font-weight: 700;
          transition: background 0.2s;
        }
        .social-link:hover {
          background: var(--primary);
          color: white;
        }
        .footer-col {}
        .footer-heading {
          color: white;
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .footer-links li a {
          color: #9ca3af;
          font-size: 0.875rem;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-links li a:hover {
          color: white;
        }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
          color: #6b7280;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
          .footer-brand {
            grid-column: 1 / -1;
          }
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  )
}
