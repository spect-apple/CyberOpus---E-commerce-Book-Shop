import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { getAddresses, createAddress } from '../api/addresses'
import { getRewards } from '../api/rewards'
import { placeOrder } from '../api/orders'
import type { Address, RewardPoints } from '../types'
import Spinner from '../components/common/Spinner'
import Button from '../components/common/Button'
import Input from '../components/common/Input'

export default function CheckoutPage() {
  const { cart, refreshCart } = useCart()
  const navigate = useNavigate()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [rewards, setRewards] = useState<RewardPoints | null>(null)
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [useRewards, setUseRewards] = useState(false)
  const [rewardPoints, setRewardPoints] = useState(0)
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [processingStep, setProcessingStep] = useState('')
  const [error, setError] = useState('')

  const [showNewAddr, setShowNewAddr] = useState(false)
  const [newAddr, setNewAddr] = useState({
    fullName: '', phoneNumber: '', line1: '', line2: '',
    city: '', state: '', postalCode: '', country: 'United States',
  })

  const [payment, setPayment] = useState({
    cardHolderName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })

  useEffect(() => {
    Promise.all([getAddresses(), getRewards()])
      .then(([addrs, rwds]) => {
        setAddresses(addrs)
        setRewards(rwds)
        const def = addrs.find(a => a.isDefault)
        if (def) setSelectedAddressId(def.id)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const maxRedeemable = rewards ? Math.floor(Math.min(rewards.balance, (cart?.subtotal ?? 0) * 10)) : 0
  const rewardDiscount = useRewards ? (rewardPoints / 100) : 0
  const total = (cart?.subtotal ?? 0) + (cart?.deliveryCharge ?? 0) - rewardDiscount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!selectedAddressId && !showNewAddr) { setError('Please select a delivery address.'); return }
    if (!payment.cardHolderName.trim()) { setError('Card holder name is required.'); return }
    if (!payment.cardNumber.trim()) { setError('Please enter a card number.'); return }

    let addressId = selectedAddressId
    if (showNewAddr) {
      try {
        const addr = await createAddress(newAddr)
        addressId = addr.id
      } catch {
        setError('Failed to save address. Please try again.')
        return
      }
    }

    if (!addressId) { setError('Please select or add a delivery address.'); return }

    const [expMonth, expYear] = payment.expiry.split('/').map(s => s.trim())

    try {
      setPlacing(true)
      setProcessingStep('Connecting securely...')
      await new Promise(r => setTimeout(r, 600))
      setProcessingStep('Verifying payment details...')
      await new Promise(r => setTimeout(r, 800))
      setProcessingStep('Processing payment...')
      await new Promise(r => setTimeout(r, 700))
      setProcessingStep('Confirming your order...')

      const cardDigits = payment.cardNumber.replace(/\s/g, '')
      const rawYear = Number(expYear)
      const fullYear = rawYear > 0 && rawYear < 100 ? 2000 + rawYear : rawYear || new Date().getFullYear() + 2
      const response = await placeOrder({
        addressId,
        rewardPointsToRedeem: useRewards ? rewardPoints : 0,
        cardHolderName: payment.cardHolderName,
        cardNumber: cardDigits.length >= 16 ? cardDigits : cardDigits.padStart(16, '4'),
        expiryMonth: Number(expMonth) || 12,
        expiryYear: fullYear,
      })
      setProcessingStep('Order placed!')
      await new Promise(r => setTimeout(r, 400))
      await refreshCart()
      navigate(`/orders/${response.order.id}`, { state: { justPlaced: true } })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Failed to place order. Please check your details.')
    } finally {
      setPlacing(false)
      setProcessingStep('')
    }
  }

  if (loading || !cart) return <Spinner center size="lg" />

  const setNA = (field: keyof typeof newAddr) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewAddr(prev => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <div className="page fade-in">
      {/* Payment processing overlay */}
      {placing && (
        <div className="payment-processing-overlay">
          <div className="payment-processing-card">
            <div className="payment-spinner" />
            <div className="payment-processing-title">Processing Payment</div>
            <div className="payment-processing-step">{processingStep}</div>
            <div className="payment-dots">
              <span /><span /><span />
            </div>
          </div>
        </div>
      )}

      <div className="container-md">
        <h1 className="page-title" style={{ marginBottom: '2rem' }}>🛒 Checkout</h1>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="checkout-layout">
            <div className="checkout-main">

              {/* ====== STEP 1: ADDRESS ====== */}
              <div className="checkout-section card">
                <div className="checkout-section-header">
                  <div className="step-num">1</div>
                  <h2>Delivery Address</h2>
                </div>
                <div className="card-body">
                  {addresses.length > 0 && (
                    <div className="address-options">
                      {addresses.map(addr => (
                        <label
                          key={addr.id}
                          className={`addr-option${selectedAddressId === addr.id && !showNewAddr ? ' selected' : ''}`}
                        >
                          <input
                            type="radio"
                            name="address"
                            value={addr.id}
                            checked={selectedAddressId === addr.id && !showNewAddr}
                            onChange={() => { setSelectedAddressId(addr.id); setShowNewAddr(false) }}
                          />
                          <div className="addr-option-content">
                            <div style={{ fontWeight: 700 }}>{addr.fullName} {addr.isDefault && <span className="badge badge-primary">Default</span>}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                              {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{addr.phoneNumber}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => { setShowNewAddr(!showNewAddr); setSelectedAddressId(null) }}
                    style={{ marginTop: '0.75rem' }}
                  >
                    {showNewAddr ? '← Use saved address' : '+ Use a new address'}
                  </button>

                  {showNewAddr && (
                    <div style={{ marginTop: '1.25rem', padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                      <div className="form-row">
                        <Input label="Full Name" value={newAddr.fullName} onChange={setNA('fullName')} required placeholder="John Doe" />
                        <Input label="Phone" value={newAddr.phoneNumber} onChange={setNA('phoneNumber')} required placeholder="+1 555 0000" />
                      </div>
                      <Input label="Address Line 1" value={newAddr.line1} onChange={setNA('line1')} required placeholder="123 Main St" />
                      <Input label="Address Line 2 (optional)" value={newAddr.line2} onChange={setNA('line2')} placeholder="Apt, Suite..." />
                      <div className="form-row">
                        <Input label="City" value={newAddr.city} onChange={setNA('city')} required />
                        <Input label="State" value={newAddr.state} onChange={setNA('state')} required />
                      </div>
                      <div className="form-row">
                        <Input label="Postal Code" value={newAddr.postalCode} onChange={setNA('postalCode')} required />
                        <div className="form-group">
                          <label className="form-label">Country</label>
                          <select className="form-input form-select" value={newAddr.country} onChange={setNA('country')}>
                            {['United States','Canada','United Kingdom','Australia','India'].map(c => <option key={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ====== STEP 2: ORDER SUMMARY ====== */}
              <div className="checkout-section card">
                <div className="checkout-section-header">
                  <div className="step-num">2</div>
                  <h2>Order Summary</h2>
                </div>
                <div className="card-body">
                  {cart.items.map(item => (
                    <div key={item.id} className="co-item">
                      <span className="co-item-title">{item.book.title}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>×{item.quantity}</span>
                      <span style={{ fontWeight: 700 }}>₹{(item.currentPrice * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ====== STEP 3: REWARDS ====== */}
              {rewards && rewards.balance > 0 && (
                <div className="checkout-section card">
                  <div className="checkout-section-header">
                    <div className="step-num">3</div>
                    <h2>Reward Points</h2>
                  </div>
                  <div className="card-body">
                    <div className="rewards-info">
                      <div className="rewards-balance">
                        <span className="rewards-pts">{rewards.balance.toLocaleString()}</span>
                        <span className="rewards-pts-label">pts available</span>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        100 points = ₹1.00 off · Max redeemable: {maxRedeemable} pts (₹{(maxRedeemable / 100).toFixed(2)} off)
                      </div>
                    </div>
                    <label className="filter-toggle" style={{ marginTop: '1rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        className="toggle-input"
                        checked={useRewards}
                        onChange={e => {
                          setUseRewards(e.target.checked)
                          if (e.target.checked) setRewardPoints(maxRedeemable)
                          else setRewardPoints(0)
                        }}
                      />
                      <span className="toggle-track"><span className="toggle-thumb" /></span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Use reward points for discount</span>
                    </label>
                    {useRewards && (
                      <div style={{ marginTop: '0.875rem' }}>
                        <label className="form-label">Points to redeem</label>
                        <input
                          type="range"
                          min={0}
                          max={maxRedeemable}
                          step={100}
                          value={rewardPoints}
                          onChange={e => setRewardPoints(Number(e.target.value))}
                          style={{ width: '100%', accentColor: 'var(--primary)' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          <span>{rewardPoints} pts</span>
                          <span>Discount: <strong style={{ color: 'var(--success)' }}>-₹{(rewardPoints / 100).toFixed(2)}</strong></span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ====== STEP 4: PAYMENT ====== */}
              <div className="checkout-section card">
                <div className="checkout-section-header">
                  <div className="step-num">{rewards && rewards.balance > 0 ? '4' : '3'}</div>
                  <h2>Payment</h2>
                  <span className="badge badge-success" style={{ marginLeft: '0.5rem', fontSize: '0.72rem' }}>DEMO MODE</span>
                </div>
                <div className="card-body">
                  {/* Visual demo card */}
                  <div className="demo-card-visual">
                    <div className="demo-card-chip">
                      <svg width="28" height="22" viewBox="0 0 28 22" fill="none" aria-hidden="true">
                        <rect width="28" height="22" rx="3" fill="#d4a72c" opacity="0.85"/>
                        <rect x="3" y="7" width="22" height="8" rx="1" fill="none" stroke="#b8920e" strokeWidth="1"/>
                        <line x1="14" y1="7" x2="14" y2="15" stroke="#b8920e" strokeWidth="1"/>
                        <line x1="3" y1="11" x2="25" y2="11" stroke="#b8920e" strokeWidth="1"/>
                      </svg>
                    </div>
                    <div className="demo-card-number">
                      {payment.cardNumber
                        ? payment.cardNumber.replace(/(\d{4})/g, '$1 ').trim().padEnd(19, ' ').replace(/\d(?=.{4})/g, '•')
                        : '•••• •••• •••• ••••'}
                    </div>
                    <div className="demo-card-bottom">
                      <div>
                        <div className="demo-card-label">CARD HOLDER</div>
                        <div className="demo-card-value">{payment.cardHolderName || 'YOUR NAME'}</div>
                      </div>
                      <div>
                        <div className="demo-card-label">EXPIRES</div>
                        <div className="demo-card-value">{payment.expiry || 'MM/YY'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="demo-fill-btn-row">
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => setPayment({ cardHolderName: 'Demo User', cardNumber: '4111 1111 1111 1111', expiry: '12/28', cvv: '123' })}
                    >
                      Use Demo Card
                    </button>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Any 16-digit number accepted</span>
                  </div>

                  <div style={{ marginTop: '1rem' }}>
                    <Input
                      label="Card Holder Name"
                      value={payment.cardHolderName}
                      onChange={e => setPayment(p => ({ ...p, cardHolderName: e.target.value }))}
                      placeholder="e.g. Demo User"
                      required
                    />
                    <div className="form-group">
                      <label className="form-label required">Card Number</label>
                      <div className="card-number-wrap">
                        <input
                          className="form-input card-number-input"
                          type="text"
                          placeholder="4111 1111 1111 1111"
                          value={payment.cardNumber}
                          onChange={e => {
                            let v = e.target.value.replace(/\D/g, '').slice(0, 16)
                            v = v.replace(/(\d{4})(?=\d)/g, '$1 ')
                            setPayment(p => ({ ...p, cardNumber: v }))
                          }}
                          maxLength={19}
                          required
                        />
                        <div className="card-icons">
                          <svg width="32" height="20" viewBox="0 0 32 20" fill="none" aria-hidden="true">
                            <rect width="32" height="20" rx="3" fill="#1A1F71" opacity="0.15"/>
                            <circle cx="12" cy="10" r="6" fill="#EB001B" opacity="0.8"/>
                            <circle cx="20" cy="10" r="6" fill="#F79E1B" opacity="0.8"/>
                            <path d="M16 5.5a6 6 0 0 1 0 9 6 6 0 0 1 0-9z" fill="#FF5F00" opacity="0.8"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="form-row">
                      <Input
                        label="Expiry (MM/YY)"
                        value={payment.expiry}
                        onChange={e => {
                          let v = e.target.value.replace(/[^\d/]/g, '')
                          if (v.length === 2 && !v.includes('/') && payment.expiry.length === 1) v += '/'
                          setPayment(p => ({ ...p, expiry: v.slice(0, 5) }))
                        }}
                        placeholder="12/28"
                        maxLength={5}
                      />
                      <Input
                        label="CVV"
                        value={payment.cvv}
                        onChange={e => setPayment(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                        placeholder="123"
                        maxLength={4}
                        hint="Any 3 digits"
                        type="password"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="checkout-summary">
              <div className="card" style={{ position: 'sticky', top: 'calc(var(--navbar-height) + 1rem)' }}>
                <div className="card-header">
                  <h3 style={{ fontWeight: 700 }}>Price Breakdown</h3>
                </div>
                <div className="card-body">
                  <div className="order-price-row">
                    <span>Subtotal</span>
                    <span>₹{cart.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="order-price-row">
                    <span>Delivery</span>
                    <span style={{ color: cart.deliveryCharge === 0 ? 'var(--success)' : undefined }}>
                      {cart.deliveryCharge === 0 ? 'FREE' : `₹${cart.deliveryCharge.toFixed(2)}`}
                    </span>
                  </div>
                  {rewardDiscount > 0 && (
                    <div className="order-price-row" style={{ color: 'var(--success)' }}>
                      <span>Reward Discount</span>
                      <span>-₹{rewardDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="order-price-row">
                    <span>Total</span>
                    <span style={{ color: 'var(--primary)', fontSize: '1.3rem' }}>₹{total.toFixed(2)}</span>
                  </div>

                  <Button type="submit" loading={placing} block style={{ marginTop: '1.25rem' }} size="lg">
                    {placing ? processingStep || 'Processing...' : '🔒 Place Order'}
                  </Button>

                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.75rem' }}>
                    By placing your order you agree to our Terms of Service.
                    <br />This is a test environment — no real charges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        .checkout-layout {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 2rem;
          align-items: start;
        }
        .checkout-main { display: flex; flex-direction: column; gap: 1.5rem; }
        .checkout-section {}
        .checkout-section-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.125rem 1.25rem;
          border-bottom: 1px solid var(--border);
          background: var(--bg-secondary);
        }
        .checkout-section-header h2 {
          font-size: 1.05rem;
          font-weight: 700;
          flex: 1;
        }
        .step-num {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          font-weight: 800;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .address-options { display: flex; flex-direction: column; gap: 0.75rem; }
        .addr-option {
          display: flex;
          gap: 0.875rem;
          padding: 0.875rem;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          align-items: flex-start;
        }
        .addr-option.selected {
          border-color: var(--primary);
          background: var(--primary-light);
        }
        .addr-option input[type=radio] { margin-top: 3px; accent-color: var(--primary); flex-shrink: 0; }
        .addr-option-content { flex: 1; }
        .co-item {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 1rem;
          padding: 0.625rem 0;
          border-bottom: 1px solid var(--border-light);
          font-size: 0.875rem;
          align-items: center;
        }
        .co-item:last-child { border-bottom: none; }
        .co-item-title {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: 500;
        }
        .rewards-info {
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          border-radius: var(--radius-md);
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .rewards-balance { display: flex; flex-direction: column; align-items: center; }
        .rewards-pts { font-size: 2rem; font-weight: 900; color: #92400e; }
        .rewards-pts-label { font-size: 0.75rem; color: #92400e; font-weight: 600; }
        .test-payment-banner {
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          border: 2px solid #fbbf24;
          border-radius: var(--radius-md);
          padding: 1rem 1.25rem;
          font-size: 0.875rem;
          color: #92400e;
        }
        .test-payment-title { font-weight: 800; font-size: 1rem; margin-bottom: 0.375rem; }
        .test-payment-banner code {
          background: rgba(0,0,0,0.1);
          padding: 0.1em 0.4em;
          border-radius: 4px;
          font-weight: 800;
          font-family: var(--font-mono);
        }
        /* Demo credit card visual */
        .demo-card-visual {
          background: linear-gradient(135deg, #1a1f71 0%, #0c2461 50%, #1a1f71 100%);
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
          color: white;
          font-family: 'Space Grotesk', sans-serif;
          position: relative;
          overflow: hidden;
          margin-bottom: 0.75rem;
          box-shadow: 0 8px 32px rgba(26, 31, 113, 0.35);
          min-height: 120px;
        }
        .demo-card-visual::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 160px; height: 160px;
          background: rgba(255,255,255,0.05);
          border-radius: 50%;
        }
        .demo-card-visual::after {
          content: 'VISA';
          position: absolute;
          bottom: 1.25rem; right: 1.5rem;
          font-size: 1.25rem;
          font-weight: 900;
          font-style: italic;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.85);
        }
        .demo-card-chip { margin-bottom: 1rem; }
        .demo-card-number {
          font-size: 1.1rem;
          letter-spacing: 0.2em;
          font-weight: 600;
          margin-bottom: 1rem;
          font-variant-numeric: tabular-nums;
        }
        .demo-card-bottom { display: flex; gap: 2rem; }
        .demo-card-label { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.65; margin-bottom: 2px; }
        .demo-card-value { font-size: 0.85rem; font-weight: 600; letter-spacing: 0.05em; }
        .demo-fill-btn-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; flex-wrap: wrap; }
        /* card number wrap */
        .card-number-wrap { position: relative; }
        .card-number-input { padding-right: 3rem; }
        .card-icons { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); }
        .filter-toggle { display: flex; align-items: center; gap: 0.75rem; }
        .toggle-input { display: none; }
        .toggle-track { width: 44px; height: 24px; background: var(--border); border-radius: 12px; position: relative; transition: background 0.2s; flex-shrink: 0; }
        .toggle-input:checked ~ .toggle-track { background: var(--primary); }
        .toggle-thumb { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; background: white; border-radius: 50%; transition: transform 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
        .toggle-input:checked ~ .toggle-track .toggle-thumb { transform: translateX(20px); }
        @media (max-width: 900px) {
          .checkout-layout { grid-template-columns: 1fr; }
          .checkout-summary { order: -1; }
          .checkout-summary > .card { position: static !important; }
        }
        /* Payment processing overlay */
        .payment-processing-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .payment-processing-card {
          background: var(--bg-card);
          border-radius: 20px;
          padding: 2.5rem 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 24px 64px rgba(0,0,0,0.3);
          min-width: 280px;
          text-align: center;
        }
        .payment-spinner {
          width: 56px;
          height: 56px;
          border: 4px solid var(--border);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .payment-processing-title {
          font-size: 1.2rem;
          font-weight: 800;
          font-family: var(--font-heading);
          color: var(--text-primary);
        }
        .payment-processing-step {
          font-size: 0.9rem;
          color: var(--text-secondary);
          min-height: 1.3em;
          transition: opacity 0.3s;
        }
        .payment-dots { display: flex; gap: 6px; margin-top: 0.25rem; }
        .payment-dots span {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--primary);
          animation: dot-bounce 1.2s ease-in-out infinite;
        }
        .payment-dots span:nth-child(2) { animation-delay: 0.2s; }
        .payment-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
