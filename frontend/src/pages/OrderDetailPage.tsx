import { useState, useEffect } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { getOrder, cancelOrder, buyAgain } from '../api/orders'
import { useCart } from '../contexts/CartContext'
import type { Order } from '../types'
import Spinner from '../components/common/Spinner'
import ErrorState from '../components/common/ErrorState'
import Button from '../components/common/Button'

function statusBadge(status: Order['status']) {
  if (status === 'CONFIRMED') return <span className="badge badge-success" style={{ fontSize: '0.9rem', padding: '0.35rem 0.875rem' }}>✓ Confirmed</span>
  if (status === 'CANCELLED') return <span className="badge badge-danger" style={{ fontSize: '0.9rem', padding: '0.35rem 0.875rem' }}>✕ Cancelled</span>
  return <span className="badge badge-warning" style={{ fontSize: '0.9rem', padding: '0.35rem 0.875rem' }}>⏳ Pending</span>
}

function paymentBadge(status: string) {
  if (status === 'SUCCESS') return <span className="badge badge-success">✓ Paid</span>
  if (status === 'FAILED') return <span className="badge badge-danger">✕ Failed</span>
  if (status === 'REFUNDED') return <span className="badge badge-primary">↩ Refunded</span>
  return <span className="badge badge-warning">⏳ Pending</span>
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const { refreshCart } = useCart()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [buyingAgain, setBuyingAgain] = useState(false)
  const justPlaced = (location.state as { justPlaced?: boolean })?.justPlaced

  useEffect(() => {
    if (!id) return
    getOrder(Number(id))
      .then(setOrder)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  const handleCancel = async () => {
    if (!order) return
    setCancelling(true)
    try {
      const updated = await cancelOrder(order.id)
      setOrder(updated)
    } catch { /* ignore */ }
    finally { setCancelling(false) }
  }

  const handleBuyAgain = async () => {
    if (!order) return
    setBuyingAgain(true)
    try {
      await buyAgain(order.id)
      await refreshCart()
    } catch { /* ignore */ }
    finally { setBuyingAgain(false) }
  }

  if (loading) return <Spinner center size="lg" />
  if (error || !order) return <ErrorState message="Order not found." />

  return (
    <div className="page fade-in">
      <div className="container-md">
        {justPlaced && (
          <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
            🎉 <strong>Your order was placed successfully!</strong> You'll receive confirmation soon.
          </div>
        )}

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <h1 className="page-title">Order #{order.id}</h1>
              {statusBadge(order.status)}
            </div>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Placed on {new Date(order.placedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <Link to="/orders" className="btn btn-outline btn-sm">← Back to Orders</Link>
        </div>

        <div className="order-detail-grid">
          <div className="order-detail-main">
            {/* Items */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-header">
                <h2 style={{ fontWeight: 700 }}>📦 Items</h2>
              </div>
              <div className="table-wrapper" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Book</th>
                      <th>Author</th>
                      <th style={{ textAlign: 'center' }}>Qty</th>
                      <th style={{ textAlign: 'right' }}>Unit Price</th>
                      <th style={{ textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map(item => (
                      <tr key={item.id}>
                        <td>
                          <span style={{ fontWeight: 600, fontFamily: 'var(--font-serif)' }}>
                            {item.bookId ? <Link to={`/books/${item.bookId}`}>{item.bookTitle}</Link> : item.bookTitle}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }}>{item.bookAuthor}</td>
                        <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                        <td style={{ textAlign: 'right' }}>₹{item.unitPrice.toFixed(2)}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{item.totalPrice.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-header"><h2 style={{ fontWeight: 700 }}>📍 Delivery Address</h2></div>
              <div className="card-body">
                <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{order.snapshotFullName}</div>
                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem' }}>
                  <div>{order.snapshotLine1}</div>
                  {order.snapshotLine2 && <div>{order.snapshotLine2}</div>}
                  <div>{order.snapshotCity}, {order.snapshotState} {order.snapshotPostalCode}</div>
                  <div>{order.snapshotCountry}</div>
                  <div style={{ marginTop: '0.375rem' }}>📞 {order.snapshotPhone}</div>
                </div>
              </div>
            </div>

            {/* Payment */}
            {order.payment && (
              <div className="card">
                <div className="card-header">
                  <h2 style={{ fontWeight: 700 }}>💳 Payment</h2>
                  {paymentBadge(order.payment.status)}
                </div>
                <div className="card-body">
                  {order.payment.cardHolderName && (
                    <div className="meta-row">
                      <span className="meta-key">Card Holder</span>
                      <span>{order.payment.cardHolderName}</span>
                    </div>
                  )}
                  {order.payment.maskedCardNumber && (
                    <div className="meta-row">
                      <span className="meta-key">Card</span>
                      <span>{order.payment.maskedCardNumber}</span>
                    </div>
                  )}
                  <div className="meta-row">
                    <span className="meta-key">Amount</span>
                    <span style={{ fontWeight: 700 }}>₹{order.payment.amount.toFixed(2)}</span>
                  </div>
                  {order.payment.processedAt && (
                    <div className="meta-row">
                      <span className="meta-key">Processed</span>
                      <span>{new Date(order.payment.processedAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="order-detail-sidebar">
            <div className="card" style={{ marginBottom: '1rem' }}>
              <div className="card-header"><h3 style={{ fontWeight: 700 }}>Price Breakdown</h3></div>
              <div className="card-body">
                <div className="order-price-row">
                  <span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="order-price-row">
                  <span>Delivery</span>
                  <span style={{ color: order.deliveryCharge === 0 ? 'var(--success)' : undefined }}>
                    {order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge.toFixed(2)}`}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="order-price-row" style={{ color: 'var(--success)' }}>
                    <span>Reward Discount</span><span>-₹{order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="order-price-row">
                  <span>Total</span>
                  <span style={{ color: 'var(--primary)', fontSize: '1.25rem' }}>₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Rewards */}
            {(order.rewardPointsEarned > 0 || order.rewardPointsRedeemed > 0) && (
              <div className="card" style={{ marginBottom: '1rem', background: 'linear-gradient(135deg, #fef3c7, #fde68a)', border: '1px solid #fbbf24' }}>
                <div className="card-body">
                  <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', color: '#92400e' }}>⭐ Rewards</h3>
                  {order.rewardPointsEarned > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#92400e' }}>
                      <span>Points Earned</span>
                      <span style={{ fontWeight: 800 }}>+{order.rewardPointsEarned} pts</span>
                    </div>
                  )}
                  {order.rewardPointsRedeemed > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#92400e', marginTop: '0.375rem' }}>
                      <span>Points Redeemed</span>
                      <span style={{ fontWeight: 800 }}>-{order.rewardPointsRedeemed} pts</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <Button variant="secondary" onClick={handleBuyAgain} loading={buyingAgain} block>
                🔄 Buy Again
              </Button>
              {order.canCancel && order.status === 'PENDING' && (
                <Button variant="danger" onClick={handleCancel} loading={cancelling} block>
                  ✕ Cancel Order
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .order-detail-grid {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 1.5rem;
          align-items: start;
        }
        .meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--border-light);
          font-size: 0.875rem;
        }
        .meta-row:last-child { border-bottom: none; }
        .meta-key { color: var(--text-secondary); font-weight: 600; }
        @media (max-width: 768px) {
          .order-detail-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
