import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Book } from '../../types'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'
import CartAddedToast from '../common/CartAddedToast'

const GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
  'linear-gradient(135deg, #fd7f6f 0%, #b2f7ef 100%)',
  'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
  'linear-gradient(135deg, #cc2b5e 0%, #753a88 100%)',
]

function getGradient(id: number): string {
  return GRADIENTS[id % GRADIENTS.length]
}

function StarRating({ count }: { count: number }) {
  const stars = Math.min(5, Math.max(1, Math.floor(Math.log(count + 1) * 0.9) + 1))
  return (
    <div className="stars" aria-label={`${stars} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < stars ? 'var(--accent)' : '#d1d5db' }}>★</span>
      ))}
    </div>
  )
}

interface BookCardProps {
  book: Book
  onCartChange?: () => void
}

export default function BookCard({ book, onCartChange }: BookCardProps) {
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const { isWishlisted, toggle: toggleWishlist } = useWishlist()
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [togglingWishlist, setTogglingWishlist] = useState(false)
  const wishlisted = isAuthenticated && isWishlisted(book.id)

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated || togglingWishlist) return
    setTogglingWishlist(true)
    try { await toggleWishlist(book.id) } finally { setTogglingWishlist(false) }
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated || !book.inStock) return
    try {
      setAdding(true)
      await addToCart(book.id, 1)
      setAdded(true)
      setShowToast(true)
      setTimeout(() => setAdded(false), 2000)
      onCartChange?.()
    } catch { /* silently fail */ }
    finally { setAdding(false) }
  }

  return (
    <>
      {showToast && (
        <CartAddedToast bookTitle={book.title} onClose={() => setShowToast(false)} />
      )}
      <Link to={`/books/${book.id}`} className="book-card" style={{ textDecoration: 'none' }}>
        {/* Cover */}
        <div className="book-cover">
          {book.imageUrl ? (
            <img
              src={book.imageUrl}
              alt={book.title}
              className="book-cover-img"
              loading="lazy"
            />
          ) : (
            <div className="book-cover-placeholder" style={{ background: getGradient(book.id) }}>
              <span className="book-cover-initial">{book.title.charAt(0)}</span>
            </div>
          )}
          {!book.inStock && <div className="book-out-badge">Out of Stock</div>}
          {book.category && (
            <div className="book-category-badge">{book.category.name}</div>
          )}
          {isAuthenticated && (
            <button
              className={`book-wishlist-btn${wishlisted ? ' wishlisted' : ''}`}
              onClick={handleWishlist}
              disabled={togglingWishlist}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              aria-pressed={wishlisted}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          )}
        </div>

        {/* Info */}
        <div className="book-info">
          <div>
            <h3 className="book-title" title={book.title}>{book.title}</h3>
            <p className="book-author">{book.author}</p>
            {book.brand && <p className="book-brand">{book.brand.name}</p>}
          </div>
          <div className="book-meta">
            <StarRating count={book.salesCount} />
            <div className={`book-stock-dot ${book.inStock ? 'in-stock' : 'out-stock'}`}>
              {book.inStock ? '● In Stock' : '● Out of Stock'}
            </div>
          </div>
          <div className="book-footer">
            <div className="book-price">₹{book.price.toFixed(2)}</div>
            {isAuthenticated ? (
              <button
                className={`btn btn-sm ${added ? 'btn-success' : 'btn-primary'}`}
                onClick={handleAddToCart}
                disabled={!book.inStock || adding}
                style={{ minWidth: '88px' }}
              >
                {adding ? (
                  <span className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }} />
                ) : added ? '✓ Added' : '+ Cart'}
              </button>
            ) : (
              <Link to="/login" className="btn btn-sm btn-outline" onClick={e => e.stopPropagation()}>
                Log In
              </Link>
            )}
          </div>
        </div>

        <style>{`
          .book-card {
            display: flex;
            flex-direction: column;
            background: var(--bg-card);
            border-radius: var(--radius-lg);
            overflow: hidden;
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--border-light);
            transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
            cursor: pointer;
            color: inherit;
          }
          .book-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-lg);
            border-color: var(--border);
          }
          .book-cover {
            position: relative;
            width: 100%;
            padding-top: 133%;
            overflow: hidden;
            flex-shrink: 0;
            background: var(--bg-book-cover, #f0ede6);
            transition: background 0.3s;
          }
          .book-cover-img {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
            padding: 6px;
            transition: transform 0.3s ease;
          }
          .book-card:hover .book-cover-img { transform: scale(1.03); }
          .book-cover-placeholder {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .book-cover-initial {
            font-size: 4rem;
            font-weight: 900;
            color: rgba(255,255,255,0.85);
            font-family: var(--font-serif);
            text-shadow: 0 2px 8px rgba(0,0,0,0.2);
            user-select: none;
          }
          .book-out-badge {
            position: absolute;
            top: 8px;
            left: 8px;
            background: rgba(224,53,53,0.9);
            color: white;
            font-size: 0.68rem;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 100px;
            letter-spacing: 0.04em;
          }
          .book-category-badge {
            position: absolute;
            bottom: 8px;
            right: 8px;
            background: rgba(13,12,10,0.65);
            backdrop-filter: blur(4px);
            color: rgba(255,255,255,0.92);
            font-size: 0.65rem;
            font-weight: 600;
            padding: 3px 8px;
            border-radius: 100px;
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            letter-spacing: 0.06em;
            text-transform: uppercase;
          }
          .book-wishlist-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(255,255,255,0.92);
            backdrop-filter: blur(4px);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #9ca3af;
            transition: all 0.2s;
            opacity: 0;
            transform: scale(0.85);
            flex-shrink: 0;
          }
          .book-card:hover .book-wishlist-btn { opacity: 1; transform: scale(1); }
          .book-wishlist-btn:hover { background: white; color: var(--danger); transform: scale(1.1) !important; }
          .book-wishlist-btn.wishlisted { opacity: 1; transform: scale(1); color: var(--danger); background: white; }
          .book-wishlist-btn:disabled { cursor: default; opacity: 0.6; }
          .book-info {
            padding: 0.875rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            flex: 1;
            justify-content: space-between;
          }
          .book-title {
            font-size: 0.9rem;
            font-weight: 700;
            color: var(--text-primary);
            font-family: var(--font-serif);
            line-height: 1.3;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .book-author {
            font-size: 0.775rem;
            color: var(--text-secondary);
            margin-top: 0.2rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .book-brand {
            font-size: 0.7rem;
            color: var(--text-muted);
            margin-top: 0.1rem;
          }
          .book-meta {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.5rem;
          }
          .book-stock-dot { font-size: 0.68rem; font-weight: 600; white-space: nowrap; }
          .book-stock-dot.in-stock { color: var(--success); }
          .book-stock-dot.out-stock { color: var(--danger); }
          .book-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.5rem;
            margin-top: 0.125rem;
          }
          .book-price {
            font-size: 1.15rem;
            font-weight: 800;
            color: var(--primary);
            font-family: var(--font-sans);
          }
        `}</style>
      </Link>
    </>
  )
}
