import { useState, useEffect } from 'react'
import { getRewards } from '../api/rewards'
import type { RewardPoints, RewardTransaction } from '../types'
import Spinner from '../components/common/Spinner'

function txnColor(type: RewardTransaction['type']): string {
  if (type === 'EARNED') return 'var(--success)'
  if (type === 'REDEEMED') return 'var(--danger)'
  if (type === 'REVERSED_EARN') return 'var(--warning)'
  return 'var(--text-secondary)'
}

function txnSign(type: RewardTransaction['type']): string {
  if (type === 'EARNED') return '+'
  if (type === 'REDEEMED') return '-'
  if (type === 'REVERSED_EARN') return '-'
  return '+'
}

function txnLabel(type: RewardTransaction['type']): string {
  if (type === 'EARNED') return '✅ Earned'
  if (type === 'REDEEMED') return '🎁 Redeemed'
  if (type === 'REVERSED_EARN') return '↩ Reversed Earn'
  return '↩ Reversed Redeem'
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState<RewardPoints | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRewards()
      .then(setRewards)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner center size="lg" />
  if (!rewards) return null

  const dollarValue = (rewards.balance / 100).toFixed(2)
  const progress = Math.min(100, (rewards.balance % 100))

  return (
    <div className="page fade-in">
      <div className="container-md">
        <div className="page-header">
          <h1 className="page-title">⭐ My Rewards</h1>
          <p className="page-subtitle">Earn points on every purchase</p>
        </div>

        {/* Balance Card */}
        <div className="rewards-hero">
          <div className="rewards-bg" />
          <div className="rewards-content">
            <div className="rewards-balance-display">
              <div className="rewards-pts-big">{rewards.balance.toLocaleString()}</div>
              <div className="rewards-pts-label">reward points</div>
            </div>
            <div className="rewards-divider" />
            <div className="rewards-value-display">
              <div className="rewards-dollar">₹{dollarValue}</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>current value</div>
            </div>
          </div>

          <div className="rewards-progress-wrap">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.8)' }}>
              <span>{progress} pts to next ₹0.01</span>
              <span>{100 - progress} pts needed</span>
            </div>
            <div className="rewards-progress-track">
              <div className="rewards-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="rewards-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#d1fae5' }}>⬆️</div>
            <div className="stat-value" style={{ color: 'var(--success)' }}>{rewards.totalEarned.toLocaleString()}</div>
            <div className="stat-label">Total Earned</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fee2e2' }}>⬇️</div>
            <div className="stat-value" style={{ color: 'var(--danger)' }}>{rewards.totalRedeemed.toLocaleString()}</div>
            <div className="stat-label">Total Redeemed</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#dbeafe' }}>💰</div>
            <div className="stat-value" style={{ color: 'var(--primary)' }}>₹{(rewards.totalEarned / 100).toFixed(2)}</div>
            <div className="stat-label">Total Value Earned</div>
          </div>
        </div>

        {/* How it works */}
        <div className="how-it-works card">
          <div className="card-header"><h2 style={{ fontWeight: 700 }}>💡 How It Works</h2></div>
          <div className="card-body">
            <div className="how-grid">
              {[
                { icon: '🛒', step: '1', title: 'Shop', desc: 'Place any order on CyberOpus' },
                { icon: '⭐', step: '2', title: 'Earn', desc: '10 points for every ₹1 spent' },
                { icon: '🎁', step: '3', title: 'Redeem', desc: '100 points = ₹1.00 off your order' },
              ].map(item => (
                <div key={item.step} className="how-item">
                  <div className="how-icon">{item.icon}</div>
                  <div className="how-step">Step {item.step}</div>
                  <div className="how-title">{item.title}</div>
                  <div className="how-desc">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div className="card-header">
            <h2 style={{ fontWeight: 700 }}>📋 Transaction History</h2>
          </div>
          {rewards.transactions.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No transactions yet. Start shopping to earn points!
            </div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', boxShadow: 'none', borderRadius: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th style={{ textAlign: 'right' }}>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {rewards.transactions.map(txn => (
                    <tr key={txn.id}>
                      <td style={{ whiteSpace: 'nowrap', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        {new Date(txn.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td>
                        <span className="badge" style={{
                          background: `${txnColor(txn.type)}22`,
                          color: txnColor(txn.type),
                          border: `1px solid ${txnColor(txn.type)}44`
                        }}>
                          {txnLabel(txn.type)}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{txn.description || '—'}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: txnColor(txn.type) }}>
                        {txnSign(txn.type)}{txn.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .rewards-hero {
          position: relative;
          border-radius: var(--radius-xl);
          overflow: hidden;
          padding: 2.5rem;
          margin-bottom: 1.5rem;
          box-shadow: var(--shadow-lg);
        }
        .rewards-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 40%, #92400e 100%);
        }
        .rewards-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }
        .rewards-balance-display { text-align: center; }
        .rewards-pts-big { font-size: 3.5rem; font-weight: 900; color: white; line-height: 1; }
        .rewards-pts-label { color: rgba(255,255,255,0.8); font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }
        .rewards-divider { width: 1px; height: 80px; background: rgba(255,255,255,0.3); }
        .rewards-value-display { text-align: center; }
        .rewards-dollar { font-size: 2rem; font-weight: 900; color: white; }
        .rewards-progress-wrap { position: relative; z-index: 1; }
        .rewards-progress-track { height: 8px; background: rgba(255,255,255,0.25); border-radius: 4px; overflow: hidden; }
        .rewards-progress-fill { height: 100%; background: white; border-radius: 4px; transition: width 0.5s ease; }
        .rewards-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .how-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .how-item { text-align: center; padding: 1rem; }
        .how-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
        .how-step { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); font-weight: 700; margin-bottom: 0.375rem; }
        .how-title { font-weight: 700; font-size: 1.1rem; margin-bottom: 0.375rem; }
        .how-desc { font-size: 0.875rem; color: var(--text-secondary); }
        @media (max-width: 640px) {
          .rewards-stats { grid-template-columns: 1fr 1fr; }
          .how-grid { grid-template-columns: 1fr; }
          .rewards-content { flex-direction: column; gap: 1rem; }
          .rewards-divider { display: none; }
        }
      `}</style>
    </div>
  )
}
