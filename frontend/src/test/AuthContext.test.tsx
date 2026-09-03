import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { mockAuthResponse, mockUser } from './mocks/handlers'

// Mock the API modules
vi.mock('../api/auth', () => ({
  login: vi.fn(),
  register: vi.fn(),
  getMe: vi.fn(),
}))

import * as authApi from '../api/auth'

function TestComponent() {
  const { user, isAuthenticated, isAdmin, login, logout, register } = useAuth()
  return (
    <div>
      <div data-testid="authenticated">{String(isAuthenticated)}</div>
      <div data-testid="admin">{String(isAdmin)}</div>
      <div data-testid="user-email">{user?.email || 'none'}</div>
      <div data-testid="user-role">{user?.role || 'none'}</div>
      <button onClick={() => login('test@test.com', 'password')}>Login</button>
      <button onClick={logout}>Logout</button>
      <button onClick={() => register({ firstName: 'A', lastName: 'B', email: 'a@b.com', password: 'pass123' })}>Register</button>
    </div>
  )
}

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter><AuthProvider>{ui}</AuthProvider></BrowserRouter>)
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('starts unauthenticated', async () => {
    renderWithRouter(<TestComponent />)
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false')
    })
  })

  it('login sets user and token', async () => {
    vi.mocked(authApi.login).mockResolvedValue(mockAuthResponse)
    const user = userEvent.setup()
    renderWithRouter(<TestComponent />)

    await user.click(screen.getByText('Login'))

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
      expect(screen.getByTestId('user-email')).toHaveTextContent(mockUser.email)
    })
    expect(localStorage.getItem('token')).toBe(mockAuthResponse.token)
  })

  it('logout clears state and localStorage', async () => {
    vi.mocked(authApi.login).mockResolvedValue(mockAuthResponse)
    const user = userEvent.setup()
    renderWithRouter(<TestComponent />)

    await user.click(screen.getByText('Login'))
    await waitFor(() => expect(screen.getByTestId('authenticated')).toHaveTextContent('true'))

    await user.click(screen.getByText('Logout'))
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false')
      expect(screen.getByTestId('user-email')).toHaveTextContent('none')
    })
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('register calls API', async () => {
    vi.mocked(authApi.register).mockResolvedValue({ message: 'ok' })
    const user = userEvent.setup()
    renderWithRouter(<TestComponent />)
    await user.click(screen.getByText('Register'))
    expect(authApi.register).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'a@b.com' })
    )
  })

  it('loads user from localStorage on init', async () => {
    localStorage.setItem('token', 'stored-token')
    localStorage.setItem('user', JSON.stringify(mockUser))
    renderWithRouter(<TestComponent />)
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
      expect(screen.getByTestId('user-email')).toHaveTextContent(mockUser.email)
    })
  })

  it('isAdmin is false for CUSTOMER', async () => {
    vi.mocked(authApi.login).mockResolvedValue(mockAuthResponse)
    const user = userEvent.setup()
    renderWithRouter(<TestComponent />)
    await user.click(screen.getByText('Login'))
    await waitFor(() => {
      expect(screen.getByTestId('admin')).toHaveTextContent('false')
    })
  })

  it('isAdmin is true for ADMIN role', async () => {
    const adminResponse = { token: 'admin-token', user: { ...mockUser, role: 'ADMIN' as const } }
    vi.mocked(authApi.login).mockResolvedValue(adminResponse)
    const user = userEvent.setup()
    renderWithRouter(<TestComponent />)
    await user.click(screen.getByText('Login'))
    await waitFor(() => {
      expect(screen.getByTestId('admin')).toHaveTextContent('true')
    })
  })
})
