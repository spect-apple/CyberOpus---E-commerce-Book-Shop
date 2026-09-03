import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import { CartProvider } from '../contexts/CartContext'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import { mockUser } from './mocks/handlers'

vi.mock('../api/auth', () => ({
  login: vi.fn(),
  register: vi.fn(),
}))

vi.mock('../api/cart', () => ({
  getCart: vi.fn().mockResolvedValue(null),
  addItem: vi.fn(),
  removeItem: vi.fn(),
  updateItem: vi.fn(),
  clearCart: vi.fn(),
}))

function ProtectedContent() {
  return <div data-testid="protected">Protected Content</div>
}

function LoginPage() {
  return <div data-testid="login-page">Login Page</div>
}

function renderWithAuth(authenticated: boolean) {
  if (authenticated) {
    localStorage.setItem('token', 'test-token')
    localStorage.setItem('user', JSON.stringify(mockUser))
  } else {
    localStorage.clear()
  }

  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/protected" element={<ProtectedContent />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('redirects unauthenticated user to /login', async () => {
    renderWithAuth(false)
    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument()
    })
    expect(screen.queryByTestId('protected')).not.toBeInTheDocument()
  })

  it('renders children for authenticated user', async () => {
    renderWithAuth(true)
    await waitFor(() => {
      expect(screen.getByTestId('protected')).toBeInTheDocument()
    })
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument()
  })
})
