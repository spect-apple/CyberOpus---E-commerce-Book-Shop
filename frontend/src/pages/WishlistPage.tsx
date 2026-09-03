import { Link } from 'react-router-dom'
import { useWishlist } from '../contexts/WishlistContext'
import { useCart } from '../contexts/CartContext'
import { useState } from 'react'

const GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
]

export default function WishlistPage() {
  const { items, loading, toggle } = useWishlist()
  const { addToCart } = useCart()
  const [addingToCart, setAddingToCart] = useState<number | null>(null)
  const [removingId, setRemovingId] = useState<number | null>(null)

  const handleAddToCart = async (bookId: number) => {
    setAddingToCart(bookId)
    try { await addToCart(bookId, 1) } catch { /* ignore */ } finally { setAddingToCart(null) }
  }

  const handleRemove = async (bookId: number) => {
    setRemovingId(bookId)
    try { await toggle(bookId) } finally { setRemovingId(null) }
  }

  return (
    <div className="wl-page">
      <div className="container">
        {/* Header */}
        <div className="wl-header">
          <div>
            <h1 className="wl-title">My Wishlist</h1>
            <p className="wl-subtitle">
              {items.length === 0 ? 'No books saved yet' : `${items.length} ₹{items.length === 1 ? 'book' : 'books'} saved`}
            </p>
          </div>
          {items.length > 0 && (
            <Link to="/books" className="btn btn-outline btn-sm">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              Discover More Books
            </Link>
          )}
        </div>

        {loading ? (
          <div className="wl-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="wl-card-skeleton skeleton" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="wl-empty">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="wl-empty-icon" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <h2 className="wl-empty-title">Your wishlist is empty</h2>
            <p className="wl-empty-text">Browse our catalogue and tap the heart icon on any book to save it here for later.</p>
            <Link to="/books" className="btn btn-primary btn-lg">Browse Books</Link>
          </div>
        ) : (
          <div className="wl-grid">
            {items.map(({ id, book, addedAt }) => (
              <div key={id} className="wl-card">
                <Link to={`/books/${book.id}`} className="wl-cover-link" tabIndex={-1}>
                  {book.imageUrl ? (
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      className="wl-cover-img"
                      loading="lazy"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  ) : (
                    <div className="wl-cover-placeholder" style={{ background: GRADIENTS[book.id % GRADIENTS.length] }}>
                      <span className="wl-cover-initial">{book.title.charAt(0)}</span>
                    </div>
                  )}
                </Link>

                <div className="wl-info">
                  <div className="wl-info-top">
                    <Link to={`/books/${book.id}`} className="wl-book-title">{book.title}</Link>
                    <p className="wl-book-author">{book.author}</p>
                    {book.category && <span className="badge badge-primary wl-category">{book.category.name}</span>}
                  </div>

                  <div className="wl-info-bottom">
                    <div className="wl-price-row">
                      <span className="wl-price">₹{book.price.toFixed(2)}</span>
                      <span className={`wl-stock ₹{book.inStock ? 'in' : 'out'}`}>
                        {book.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <p className="wl-added-at">Saved {new Date(addedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>

                    <div className="wl-actions">
                      <button
                        className="btn btn-primary btn-sm wl-add-btn"
                        disabled={!book.inStock || addingToCart === book.id}
                        onClick={() => handleAddToCart(book.id)}
                      >
                        {addingToCart === book.id ? (
                          <span className="spinner" style={{ width: '13px', height: '13px', borderWidth: '2px' }} />
                        ) : (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                            Add to Cart
                          </>
                        )}
                      </button>
                      <button
                        className="btn btn-ghost btn-sm wl-remove-btn"
                        disabled={removingId === book.id}
                        onClick={() => handleRemove(book.id)}
                        aria-label={`Remove ${book.title} from wishlist`}
                      >
                        {removingId === book.id ? (
                          <span className="spinner" style={{ width: '13px', height: '13px', borderWidth: '2px' }} />
                        ) : (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .wl-page {
          padding: 2.5rem 0 4rem;
          min-height: 60vh;
        }
        .wl-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .wl-title {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-primary);
          font-family: var(--font-serif);
          margin: 0;
        }
        .wl-subtitle {
          color: var(--text-secondary);
          margin-top: 0.25rem;
          font-size: 0.95rem;
        }
        .wl-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.25rem;
        }
        .wl-card-skeleton {
          height: 160px;
          border-radius: var(--radius-lg);
        }
        .wl-card {
          display: flex;
          gap: 1rem;
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-light);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .wl-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
        .wl-cover-link {
          flex-shrink: 0;
          width: 110px;
          display: block;
          overflow: hidden;
          background: var(--bg-secondary);
        }
        .wl-cover-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .wl-cover-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 150px;
        }
        .wl-cover-initial {
          font-size: 3rem;
          font-weight: 900;
          color: rgba(255,255,255,0.85);
          font-family: var(--font-serif);
          user-select: none;
        }
        .wl-info {
          flex: 1;
          padding: 1rem 1rem 1rem 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-width: 0;
        }
        .wl-info-top { display: flex; flex-direction: column; gap: 0.25rem; }
        .wl-book-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          font-family: var(--font-serif);
          text-decoration: none;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .wl-book-title:hover { color: var(--primary); }
        .wl-book-author { font-size: 0.8rem; color: var(--text-secondary); }
        .wl-category { font-size: 0.68rem; margin-top: 0.25rem; align-self: flex-start; }
        .wl-info-bottom { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.75rem; }
        .wl-price-row { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
        .wl-price { font-size: 1.15rem; font-weight: 800; color: var(--primary); }
        .wl-stock { font-size: 0.75rem; font-weight: 600; }
        .wl-stock.in { color: var(--success); }
        .wl-stock.out { color: var(--danger); }
        .wl-added-at { font-size: 0.72rem; color: var(--text-muted); }
        .wl-actions { display: flex; gap: 0.5rem; align-items: center; }
        .wl-add-btn { flex: 1; gap: 0.375rem; display: flex; align-items: center; justify-content: center; }
        .wl-remove-btn { color: var(--danger); width: 34px; height: 34px; padding: 0; display: flex; align-items: center; justify-content: center; }
        .wl-remove-btn:hover { background: var(--danger-light); }

        /* Empty state */
        .wl-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
          padding: 5rem 1rem;
          text-align: center;
        }
        .wl-empty-icon { color: #d1d5db; }
        .wl-empty-title { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin: 0; }
        .wl-empty-text { color: var(--text-secondary); max-width: 400px; line-height: 1.6; margin: 0; }

        @media (max-width: 600px) {
          .wl-grid { grid-template-columns: 1fr; }
          .wl-cover-link { width: 90px; }
        }
      `}</style>
    </div>
  )
}
