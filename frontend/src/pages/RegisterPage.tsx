import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/common/Button'
import Input from '../components/common/Input'

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const validate = (): boolean => {
    const errs: FormErrors = {}
    if (!form.firstName.trim()) errs.firstName = 'First name is required'
    if (!form.lastName.trim()) errs.lastName = 'Last name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password'
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return

    try {
      setLoading(true)
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      })
      navigate('/login', { state: { registered: true } })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setServerError(msg || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div className="auth-logo">
          <svg width="44" height="44" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="7" fill="#2563eb"/>
            <path d="M7 8h9a4 4 0 0 1 0 8H7V8z" fill="white" opacity="0.9"/>
            <path d="M7 16h10a4 4 0 0 1 0 8H7v-8z" fill="white" opacity="0.7"/>
          </svg>
          <span>CyberOpus</span>
        </div>

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Join thousands of readers today</p>

        {serverError && (
          <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
            <span>⚠️</span> {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <Input
              label="First Name"
              value={form.firstName}
              onChange={set('firstName')}
              placeholder="John"
              error={errors.firstName}
              required
            />
            <Input
              label="Last Name"
              value={form.lastName}
              onChange={set('lastName')}
              placeholder="Doe"
              error={errors.lastName}
              required
            />
          </div>
          <Input
            label="Email address"
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="you@example.com"
            error={errors.email}
            required
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={set('password')}
            placeholder="At least 6 characters"
            error={errors.password}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={set('confirmPassword')}
            placeholder="Repeat your password"
            error={errors.confirmPassword}
            required
          />

          <Button type="submit" loading={loading} block style={{ marginTop: '0.5rem' }}>
            Create Account
          </Button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 700 }}>Sign in</Link>
          </p>
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
          max-width: 460px;
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
          font-size: 1.5rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 0.375rem;
        }
        .auth-sub {
          text-align: center;
          color: var(--text-secondary);
          margin-bottom: 1.75rem;
        }
      `}</style>
    </div>
  )
}
