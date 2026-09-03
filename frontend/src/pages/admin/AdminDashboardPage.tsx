import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAdminStats } from '../../api/admin'
import { getOrders } from '../../api/orders'
import type { AdminStats, Order } from '../../types'
import Spinner from '../../components/common/Spinner'

function statusColor(status: Order['status']): string {
  if (status === 'CONFIRMED') return 'var(--success)'
  if (status === 'CANCELLED') return 'var(--danger)'
  return 'var(--warning)'
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getAdminStats(),
      getOrders(0, 5),
    ])
      .then(([s, orders]) => {
        setStats(s)
        setRecentOrders(orders.content)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner center size="lg" />

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div style={{ padding: '0 1rem 1rem', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Admin Panel
        </div>
        {[
          { to: '/admin', label: '📊 Dashboard' },
          { to: '/admin/books', label: '📚 Books' },
          { to: '/admin/categories', label: '🏷️ Categories' },
          { to: '/admin/brands', label: '🏢 Publishers' },
        ].map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={`admin-sidebar-link${location.pathname === item.to ? ' active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
        <div className="navbar-dropdown-divider" style={{ margin: '0.75rem 0', background: 'var(--border)' }} />
        <Link to="/" className="admin-sidebar-link">← Back to Store</Link>
      </aside>

      <main className="admin-content">
        <div className="page-header">
          <h1 className="page-title">📊 Dashboard</h1>
          <p className="page-subtitle">Welcome to CyberOpus Admin</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="admin-stats-grid">
            {[
              { icon: '📚', label: 'Total Books', value: stats.totalBooks, color: '#dbeafe', iconColor: '#2563eb', link: '/admin/books' },
              { icon: '🏷️', label: 'Categories', value: stats.totalCategories, color: '#ede9fe', iconColor: '#7c3aed', link: '/admin/categories' },
              { icon: '🏢', label: 'Publishers', value: stats.totalBrands, color: '#d1fae5', iconColor: '#10b981', link: '/admin/brands' },
              { icon: '📦', label: 'Total Orders', value: stats.totalOrders, color: '#fef3c7', iconColor: '#f59e0b', link: '#' },
            ].map(s => (
              <Link key={s.label} to={s.link} className="stat-card" style={{ textDecoration: 'none', display: 'block' }}>
                <div className="stat-icon" style={{ background: s.color }}>
                  <span style={{ color: s.iconColor }}>{s.icon}</span>
                </div>
                <div className="stat-value">{(s.value ?? 0).toLocaleString()}</div>
                <div className="stat-label">{s.label}</div>
              </Link>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header"><h2 style={{ fontWeight: 700 }}>⚡ Quick Actions</h2></div>
          <div className="card-body" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/admin/books" className="btn btn-primary">+ Add Book</Link>
            <Link to="/admin/categories" className="btn btn-outline">+ Add Category</Link>
            <Link to="/admin/brands" className="btn btn-outline">+ Add Publisher</Link>
          </div>
        </div>

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h2 style={{ fontWeight: 700 }}>🕐 Recent Orders</h2>
              <Link to="/orders" className="btn btn-ghost btn-sm">View All</Link>
            </div>
            <div className="table-wrapper" style={{ border: 'none', boxShadow: 'none', borderRadius: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td><Link to={`/orders/${order.id}`} style={{ fontWeight: 700 }}>#{order.id}</Link></td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {new Date(order.placedAt).toLocaleDateString()}
                      </td>
                      <td>{order.items.length}</td>
                      <td style={{ fontWeight: 700 }}>${order.total.toFixed(2)}</td>
                      <td>
                        <span className="badge" style={{
                          background: `${statusColor(order.status)}22`,
                          color: statusColor(order.status),
                          border: `1px solid ${statusColor(order.status)}44`,
                        }}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .admin-stats-grid .stat-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); transition: all 0.2s; }
        @media (max-width: 1024px) { .admin-stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .admin-stats-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>
    </div>
  )
}
