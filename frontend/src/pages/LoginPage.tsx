import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/common/Button'
import Input from '../components/common/Input'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDemo, setShowDemo] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }

    try {
      setLoading(true)
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      setEmail('admin@cyberopus.com')
      setPassword('Admin123!')
    } else {
      setEmail('alice@demo.com')
      setPassword('Password123!')
    }
    setShowDemo(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        {/* Logo */}
        <div className="auth-logo">
          <svg width="44" height="44" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="7" fill="#2563eb"/>
            <path d="M7 8h9a4 4 0 0 1 0 8H7V8z" fill="white" opacity="0.9"/>
            <path d="M7 16h10a4 4 0 0 1 0 8H7v-8z" fill="white" opacity="0.7"/>
          </svg>
          <span>CyberOpus</span>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to your account</p>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
            required
          />

          <Button type="submit" loading={loading} block style={{ marginTop: '0.5rem' }}>
            Sign In
          </Button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ fontWeight: 700 }}>Create one free</Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="demo-box">
          <button
            className="demo-toggle"
            onClick={() => setShowDemo(!showDemo)}
            type="button"
          >
            <span>🔑</span>
            Demo Credentials
            <span style={{ marginLeft: 'auto' }}>{showDemo ? '▲' : '▼'}</span>
          </button>
          {showDemo && (
            <div className="demo-creds">
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Click to auto-fill credentials for testing:
              </p>
              <div style={{ display: 'flex', gap: '0.625rem' }}>
                <button className="demo-cred-btn" onClick={() => fillDemo('customer')}>
                  <span>👤</span>
                  <div>
                    <div style={{ fontWeight: 700 }}>Customer</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>alice@demo.com</div>
                  </div>
                </button>
                <button className="demo-cred-btn" onClick={() => fillDemo('admin')}>
                  <span>⚙️</span>
                  <div>
                    <div style={{ fontWeight: 700 }}>Admin</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>admin@cyberopus.com</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: calc(100vh - var(--navbar-height));
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 50%, #f5f3ff 100%);
          padding: 2rem 1rem;
        }
        .auth-card {
          background: white;
          border-radius: var(--radius-xl);
          padding: 2.5rem;
          width: 100%;
          max-width: 420px;
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--border-light);
        }
        .auth-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.75rem;
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-primary);
          justify-content: center;
        }
        .auth-title {
          font-size: 1.6rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 0.375rem;
        }
        .auth-sub {
          text-align: center;
          color: var(--text-secondary);
          margin-bottom: 1.75rem;
        }
        .demo-box {
          margin-top: 1.5rem;
          border: 1.5px dashed var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .demo-toggle {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: var(--bg-secondary);
          cursor: pointer;
          border: none;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
          font-family: inherit;
          transition: background 0.2s;
        }
        .demo-toggle:hover { background: var(--primary-light); color: var(--primary); }
        .demo-creds {
          padding: 1rem;
          background: white;
        }
        .demo-cred-btn {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.75rem;
          background: var(--primary-light);
          border: 2px solid transparent;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-size: 0.875rem;
          color: var(--primary);
          font-family: inherit;
          transition: all 0.2s;
          text-align: left;
        }
        .demo-cred-btn:hover { border-color: var(--primary); background: var(--primary); color: white; }
        .demo-cred-btn > span { font-size: 1.25rem; }
      `}</style>
    </div>
  )
}
