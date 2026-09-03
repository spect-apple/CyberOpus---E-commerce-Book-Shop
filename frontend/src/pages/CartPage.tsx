import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'

const GRADIENTS = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
]

export default function CartPage() {
  const { cart, loading, removeFromCart, updateCartItem, clearCart } = useCart()
  const [removingId, setRemovingId] = React.useState<number | null>(null)
  const [updatingId, setUpdatingId] = React.useState<number | null>(null)

  const handleRemove = async (itemId: number) => {
    setRemovingId(itemId)
    try { await removeFromCart(itemId) }
    catch { /* ignore */ }
    finally { setRemovingId(null) }
  }

  const handleQty = async (itemId: number, qty: number) => {
    if (qty < 1) return
    setUpdatingId(itemId)
    try { await updateCartItem(itemId, qty) }
    catch { /* ignore */ }
    finally { setUpdatingId(null) }
  }

  if (loading) return <Spinner center size="lg" />

  if (!cart || cart.items.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <EmptyState
            icon="🛒"
            title="Your cart is empty"
            text="Looks like you haven't added any books yet."
            action={<Link to="/books" className="btn btn-primary">Browse Books</Link>}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="page fade-in">
      <div className="container">
        <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 className="page-title">🛒 Shopping Cart</h1>
            <p className="page-subtitle">{cart.itemCount} item{cart.itemCount !== 1 ? 's' : ''}</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => clearCart()}>
            Clear all
          </button>
        </div>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {cart.items.map(item => (
              <div key={item.id} className="cart-item card">
                {/* Cover */}
                <div className="cart-item-cover">
                  {item.book.imageUrl ? (
                    <img src={item.book.imageUrl} alt={item.book.title} />
                  ) : (
                    <div style={{ background: GRADIENTS[item.id % GRADIENTS.length], width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'white', fontSize: '1.75rem', fontWeight: 900 }}>{item.book.title.charAt(0)}</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="cart-item-info">
                  <div>
                    <Link to={`/books/${item.book.id}`} className="cart-item-title">{item.book.title}</Link>
                    <p className="cart-item-author">{item.book.author}</p>
                    {item.priceChanged && (
                      <span className="badge badge-warning" style={{ marginTop: '0.375rem' }}>
                        ⚠️ Price changed since adding (was ₹{item.priceAtAdd.toFixed(2)})
                      </span>
                    )}
                  </div>
                  <div className="cart-item-actions">
                    <div className="qty-selector">
                      <button className="qty-btn" onClick={() => handleQty(item.id, item.quantity - 1)} disabled={item.quantity <= 1 || updatingId === item.id}>−</button>
                      <span className="qty-value">
                        {updatingId === item.id ? <span className="spinner spinner-primary" style={{ width: '14px', height: '14px', borderWidth: '2px' }} /> : item.quantity}
                      </span>
                      <button className="qty-btn" onClick={() => handleQty(item.id, item.quantity + 1)} disabled={item.quantity >= item.book.stockQuantity || updatingId === item.id}>+</button>
                    </div>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleRemove(item.id)}
                      disabled={removingId === item.id}
                      style={{ color: 'var(--danger)' }}
                    >
                      {removingId === item.id ? <span className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px', borderColor: 'var(--danger-light)', borderTopColor: 'var(--danger)' }} /> : '🗑️ Remove'}
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="cart-item-price">
                  <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary)' }}>
                    ₹{(item.currentPrice * item.quantity).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    ₹{item.currentPrice.toFixed(2)} each
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary card">
            <div className="card-header">
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Order Summary</h2>
            </div>
            <div className="card-body">
              <div className="order-price-row">
                <span>Subtotal ({cart.itemCount} items)</span>
                <span>₹{cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="order-price-row">
                <span>Delivery</span>
                <span style={{ color: cart.deliveryCharge === 0 ? 'var(--success)' : 'inherit' }}>
                  {cart.deliveryCharge === 0 ? 'FREE' : `₹${cart.deliveryCharge.toFixed(2)}`}
                </span>
              </div>
              {cart.deliveryCharge > 0 && cart.subtotal < 25 && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '0.5rem 0' }}>
                  Add ₹{(25 - cart.subtotal).toFixed(2)} more for free delivery
                </p>
              )}
              <div className="order-price-row" style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '2px solid var(--border)' }}>
                <span>Total</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>₹{cart.total.toFixed(2)}</span>
              </div>

              <Link to="/checkout" className="btn btn-primary btn-lg btn-block" style={{ marginTop: '1.25rem' }}>
                Proceed to Checkout →
              </Link>
              <Link to="/books" className="btn btn-ghost btn-block" style={{ marginTop: '0.5rem' }}>
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 2rem;
          align-items: start;
        }
        .cart-items { display: flex; flex-direction: column; gap: 1rem; }
        .cart-item {
          display: grid;
          grid-template-columns: 80px 1fr auto;
          gap: 1rem;
          padding: 1.125rem;
          align-items: center;
          transition: box-shadow 0.2s;
        }
        .cart-item:hover { box-shadow: var(--shadow-md); }
        .cart-item-cover {
          width: 80px;
          height: 110px;
          border-radius: var(--radius-md);
          overflow: hidden;
          flex-shrink: 0;
        }
        .cart-item-cover {
          background: var(--bg-book-cover, #f0ede6);
        }
        .cart-item-cover img { width: 100%; height: 100%; object-fit: contain; padding: 4px; }
        .cart-item-info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 0.75rem;
          min-width: 0;
        }
        .cart-item-title {
          font-weight: 700;
          font-size: 0.95rem;
          font-family: var(--font-serif);
          color: var(--text-primary);
          text-decoration: none;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .cart-item-title:hover { color: var(--primary); }
        .cart-item-author { font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem; }
        .cart-item-actions { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
        .cart-item-price { text-align: right; flex-shrink: 0; }
        .cart-summary { position: sticky; top: calc(var(--navbar-height) + 1rem); }
        @media (max-width: 768px) {
          .cart-layout { grid-template-columns: 1fr; }
          .cart-summary { position: static; }
          .cart-item { grid-template-columns: 70px 1fr; }
          .cart-item-price { grid-column: 1 / -1; text-align: left; }
        }
        @media (max-width: 480px) {
          .cart-item { grid-template-columns: 60px 1fr; }
          .cart-item-cover { width: 60px; height: 80px; }
        }
      `}</style>
    </div>
  )
}
