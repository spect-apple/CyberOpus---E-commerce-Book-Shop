import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getOrders } from '../api/orders'
import type { Order } from '../types'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'

function statusBadge(status: Order['status']) {
  if (status === 'CONFIRMED') return <span className="badge badge-success">✓ Confirmed</span>
  if (status === 'CANCELLED') return <span className="badge badge-danger">✕ Cancelled</span>
  return <span className="badge badge-warning">⏳ Pending</span>
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const load = (p: number) => {
    setLoading(true)
    getOrders(p, 10)
      .then(res => { setOrders(res.content); setTotalPages(res.totalPages) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load(0) }, [])

  if (loading) return <Spinner center size="lg" />

  return (
    <div className="page fade-in">
      <div className="container-md">
        <div className="page-header">
          <h1 className="page-title">📦 My Orders</h1>
          <p className="page-subtitle">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <EmptyState
            icon="📦"
            title="No orders yet"
            text="Your order history will appear here once you make your first purchase."
            action={<Link to="/books" className="btn btn-primary">Start Shopping</Link>}
          />
        ) : (
          <>
            <div className="orders-list">
              {orders.map(order => (
                <div key={order.id} className="order-card card">
                  <div className="order-card-top">
                    <div className="order-id">Order #{order.id}</div>
                    <div>{statusBadge(order.status)}</div>
                  </div>
                  <div className="order-card-body">
                    <div className="order-meta">
                      <div className="order-meta-item">
                        <span className="order-meta-label">Date</span>
                        <span>{new Date(order.placedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="order-meta-item">
                        <span className="order-meta-label">Items</span>
                        <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="order-meta-item">
                        <span className="order-meta-label">Total</span>
                        <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>₹{order.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="order-items-preview">
                      {order.items.slice(0, 3).map(item => (
                        <div key={item.id} className="order-item-preview">{item.bookTitle}</div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="order-item-preview muted">+{order.items.length - 3} more</div>
                      )}
                    </div>
                  </div>
                  <div className="order-card-footer">
                    <Link to={`/orders/${order.id}`} className="btn btn-outline btn-sm">
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button className="pagination-btn" onClick={() => { setPage(page - 1); load(page - 1) }} disabled={page === 0}>←</button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button key={i} className={`pagination-btn${i === page ? ' active' : ''}`} onClick={() => { setPage(i); load(i) }}>{i + 1}</button>
                ))}
                <button className="pagination-btn" onClick={() => { setPage(page + 1); load(page + 1) }} disabled={page >= totalPages - 1}>→</button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .orders-list { display: flex; flex-direction: column; gap: 1rem; }
        .order-card { overflow: visible; }
        .order-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-light);
        }
        .order-id { font-weight: 800; font-size: 1rem; }
        .order-card-body { padding: 1.125rem 1.25rem; }
        .order-meta {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .order-meta-item { display: flex; flex-direction: column; gap: 0.2rem; }
        .order-meta-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); font-weight: 700; }
        .order-items-preview {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .order-item-preview {
          font-size: 0.8rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          padding: 0.2rem 0.625rem;
          border-radius: 100px;
          color: var(--text-secondary);
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .order-item-preview.muted { color: var(--text-muted); font-style: italic; }
        .order-card-footer {
          padding: 0.875rem 1.25rem;
          border-top: 1px solid var(--border-light);
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }
        @media (max-width: 480px) {
          .order-meta { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  )
}
