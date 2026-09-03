import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getBook, getRelatedBooks } from '../api/books'
import type { Book } from '../types'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import Spinner from '../components/common/Spinner'
import ErrorState from '../components/common/ErrorState'
import BookGrid from '../components/books/BookGrid'

const GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
]

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const [book, setBook] = useState<Book | null>(null)
  const [related, setRelated] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [qty, setQty] = useState(1)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(false)
    getBook(Number(id))
      .then(b => {
        setBook(b)
        getRelatedBooks(b.id).then(r => setRelated(r.slice(0, 4))).catch(() => {})
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    if (!book) return
    if (!isAuthenticated) { navigate('/login'); return }
    try {
      setAdding(true)
      await addToCart(book.id, qty)
      setAdded(true)
      setTimeout(() => setAdded(false), 2500)
    } catch {
      // ignore
    } finally {
      setAdding(false)
    }
  }

  if (loading) return <Spinner center size="lg" />
  if (error || !book) return <ErrorState message="Book not found." />

  const gradient = GRADIENTS[book.id % GRADIENTS.length]
  const stars = Math.min(5, Math.max(1, Math.floor(Math.log(book.salesCount + 1) * 0.9) + 1))

  return (
    <div className="page fade-in">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-item">Home</Link>
          <span className="breadcrumb-separator">›</span>
          <Link to="/books" className="breadcrumb-item">Books</Link>
          {book.category && (
            <>
              <span className="breadcrumb-separator">›</span>
              <Link to={`/books?categoryId=${book.category.id}`} className="breadcrumb-item">
                {book.category.name}
              </Link>
            </>
          )}
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-item active">{book.title}</span>
        </nav>

        {/* Main Detail */}
        <div className="detail-layout">
          {/* Cover */}
          <div className="detail-cover-wrap">
            <div className="detail-cover" style={{ background: book.imageUrl ? '#f3f4f6' : gradient }}>
              {book.imageUrl ? (
                <img src={book.imageUrl} alt={book.title} className="detail-cover-img" />
              ) : (
                <span className="detail-cover-initial">{book.title.charAt(0)}</span>
              )}
            </div>
            {book.deliveryDate && (
              <div className="delivery-box">
                <div className="delivery-label">🚚 Estimated Delivery</div>
                <div className="delivery-date">{new Date(book.deliveryDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="detail-info">
            {book.category && (
              <span className="badge badge-primary" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>
                {book.category.name}
              </span>
            )}
            <h1 className="detail-title">{book.title}</h1>
            <p className="detail-author">by <strong>{book.author}</strong></p>
            {book.brand && <p className="detail-brand">Published by {book.brand.name}</p>}

            {/* Stars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
              <div className="stars" style={{ fontSize: '1.1rem' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} style={{ color: i < stars ? 'var(--accent)' : '#d1d5db' }}>★</span>
                ))}
              </div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                {book.salesCount} sold
              </span>
            </div>

            {/* Price & Stock */}
            <div className="detail-price-row">
              <span className="price price-large">₹{book.price.toFixed(2)}</span>
              {book.inStock ? (
                <span className="badge badge-success">● In Stock ({book.stockQuantity})</span>
              ) : (
                <span className="badge badge-danger">● Out of Stock</span>
              )}
            </div>

            {/* Description */}
            {book.description && (
              <div className="detail-description">
                <h3 style={{ marginBottom: '0.5rem', fontSize: '0.95rem', fontWeight: 700 }}>About this book</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                  {book.description}
                </p>
              </div>
            )}

            {/* Metadata */}
            <div className="detail-meta">
              {book.isbn && (
                <div className="meta-item">
                  <span className="meta-label">ISBN</span>
                  <span className="meta-value">{book.isbn}</span>
                </div>
              )}
              {book.publicationYear && (
                <div className="meta-item">
                  <span className="meta-label">Year</span>
                  <span className="meta-value">{book.publicationYear}</span>
                </div>
              )}
              {book.category && (
                <div className="meta-item">
                  <span className="meta-label">Genre</span>
                  <Link to={`/books?categoryId=${book.category.id}`} className="meta-value" style={{ color: 'var(--primary)' }}>
                    {book.category.name}
                  </Link>
                </div>
              )}
            </div>

            {/* Add to Cart */}
            {book.inStock && (
              <div className="detail-cart-row">
                <div className="qty-selector">
                  <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}>−</button>
                  <span className="qty-value">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty(q => Math.min(book.stockQuantity, q + 1))} disabled={qty >= book.stockQuantity}>+</button>
                </div>
                <button
                  className={`btn btn-lg ${added ? 'btn-success' : 'btn-primary'}`}
                  onClick={handleAddToCart}
                  disabled={adding}
                  style={{ flex: 1 }}
                >
                  {adding ? (
                    <><span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> Adding...</>
                  ) : added ? (
                    '✓ Added to Cart'
                  ) : (
                    '🛒 Add to Cart'
                  )}
                </button>
              </div>
            )}

            {!book.inStock && (
              <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
                ⚠️ This item is currently out of stock. Check back soon!
              </div>
            )}

            {added && (
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem' }}>
                <Link to="/cart" className="btn btn-outline btn-sm">View Cart</Link>
                <Link to="/checkout" className="btn btn-accent btn-sm">Checkout Now</Link>
              </div>
            )}
          </div>
        </div>

        {/* Related Books */}
        {related.length > 0 && (
          <section style={{ marginTop: '4rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              📚 Related Books
            </h2>
            <BookGrid books={related} />
          </section>
        )}
      </div>

      <style>{`
        .detail-layout {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 3rem;
          align-items: start;
        }
        .detail-cover-wrap {}
        .detail-cover {
          width: 100%;
          aspect-ratio: 2/3;
          border-radius: var(--radius-xl);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: var(--shadow-xl);
        }
        .detail-cover-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .detail-cover-initial {
          font-size: 8rem;
          font-weight: 900;
          color: rgba(255,255,255,0.85);
          font-family: var(--font-serif);
          text-shadow: 0 4px 16px rgba(0,0,0,0.2);
          user-select: none;
        }
        .delivery-box {
          margin-top: 1rem;
          background: var(--success-light);
          border-radius: var(--radius-md);
          padding: 0.875rem 1rem;
          border: 1px solid #a7f3d0;
        }
        .delivery-label { font-size: 0.8rem; color: var(--success); font-weight: 600; }
        .delivery-date { font-weight: 700; color: #065f46; margin-top: 0.25rem; }
        .detail-title {
          font-size: 2rem;
          font-weight: 900;
          font-family: var(--font-serif);
          line-height: 1.2;
          margin-bottom: 0.5rem;
        }
        .detail-author { font-size: 1rem; color: var(--text-secondary); margin-bottom: 0.25rem; }
        .detail-brand { font-size: 0.875rem; color: var(--text-muted); }
        .detail-price-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.25rem 0;
          flex-wrap: wrap;
        }
        .detail-description { margin: 1.25rem 0; }
        .detail-meta {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin: 1.25rem 0;
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          padding: 1rem;
        }
        .meta-item { text-align: center; }
        .meta-label { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); font-weight: 700; }
        .meta-value { font-weight: 700; font-size: 0.9rem; color: var(--text-primary); margin-top: 0.25rem; display: block; }
        .detail-cart-row {
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-top: 1.5rem;
        }
        @media (max-width: 900px) {
          .detail-layout { grid-template-columns: 1fr; }
          .detail-cover { max-width: 320px; margin: 0 auto; }
          .detail-title { font-size: 1.5rem; }
        }
        @media (max-width: 480px) {
          .detail-meta { grid-template-columns: 1fr 1fr; }
          .detail-cart-row { flex-direction: column; }
          .detail-cart-row .btn { width: 100%; }
        }
      `}</style>
    </div>
  )
}
