import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import { CartProvider, useCart } from '../contexts/CartContext'
import { mockCart, mockUser, mockAuthResponse } from './mocks/handlers'

vi.mock('../api/auth', () => ({
  login: vi.fn(),
  register: vi.fn(),
}))

vi.mock('../api/cart', () => ({
  getCart: vi.fn(),
  addItem: vi.fn(),
  removeItem: vi.fn(),
  updateItem: vi.fn(),
  clearCart: vi.fn(),
}))

import * as authApi from '../api/auth'
import * as cartApi from '../api/cart'

function TestComponent() {
  const { cart, itemCount, addToCart, removeFromCart } = useCart()
  return (
    <div>
      <div data-testid="item-count">{itemCount}</div>
      <div data-testid="total">{cart?.total ?? 0}</div>
      <button onClick={() => addToCart(1, 1)}>Add</button>
      <button onClick={() => removeFromCart(1)}>Remove</button>
    </div>
  )
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('item count is 0 when unauthenticated', () => {
    vi.mocked(cartApi.getCart).mockResolvedValue(mockCart)
    render(<TestComponent />, { wrapper: Wrapper })
    expect(screen.getByTestId('item-count')).toHaveTextContent('0')
  })

  it('loads cart when authenticated', async () => {
    localStorage.setItem('token', 'token')
    localStorage.setItem('user', JSON.stringify(mockUser))
    vi.mocked(authApi.login).mockResolvedValue(mockAuthResponse)
    vi.mocked(cartApi.getCart).mockResolvedValue(mockCart)

    render(<TestComponent />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByTestId('item-count')).toHaveTextContent('2')
    })
  })

  it('addToCart updates item count', async () => {
    localStorage.setItem('token', 'token')
    localStorage.setItem('user', JSON.stringify(mockUser))
    vi.mocked(cartApi.getCart).mockResolvedValue({ ...mockCart, items: [], itemCount: 0 })
    vi.mocked(cartApi.addItem).mockResolvedValue(mockCart)

    const user = userEvent.setup()
    render(<TestComponent />, { wrapper: Wrapper })

    await waitFor(() => expect(screen.getByTestId('item-count')).toHaveTextContent('0'))

    await user.click(screen.getByText('Add'))

    await waitFor(() => {
      expect(screen.getByTestId('item-count')).toHaveTextContent('2')
    })
    expect(cartApi.addItem).toHaveBeenCalledWith(1, 1)
  })

  it('removeFromCart clears items', async () => {
    localStorage.setItem('token', 'token')
    localStorage.setItem('user', JSON.stringify(mockUser))
    vi.mocked(cartApi.getCart).mockResolvedValue(mockCart)
    vi.mocked(cartApi.removeItem).mockResolvedValue({ ...mockCart, items: [], itemCount: 0, total: 0 })

    const user = userEvent.setup()
    render(<TestComponent />, { wrapper: Wrapper })

    await waitFor(() => expect(screen.getByTestId('item-count')).toHaveTextContent('2'))

    await user.click(screen.getByText('Remove'))

    await waitFor(() => {
      expect(screen.getByTestId('item-count')).toHaveTextContent('0')
    })
  })
})
