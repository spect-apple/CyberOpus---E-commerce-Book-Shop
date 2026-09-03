import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import { CartProvider } from '../contexts/CartContext'
import CheckoutPage from '../pages/CheckoutPage'
import { mockUser, mockCart } from './mocks/handlers'

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

vi.mock('../api/addresses', () => ({
  getAddresses: vi.fn().mockResolvedValue([
    {
      id: 1,
      fullName: 'John Doe',
      phoneNumber: '555-0000',
      line1: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      postalCode: '90210',
      country: 'United States',
      isDefault: true,
    },
  ]),
  createAddress: vi.fn(),
}))

vi.mock('../api/rewards', () => ({
  getRewards: vi.fn().mockResolvedValue({
    balance: 500,
    totalEarned: 1000,
    totalRedeemed: 500,
    transactions: [],
  }),
}))

vi.mock('../api/orders', () => ({
  placeOrder: vi.fn(),
  getOrders: vi.fn(),
}))

function Wrapper({ children }: { children: React.ReactNode }) {
  localStorage.setItem('token', 'test-token')
  localStorage.setItem('user', JSON.stringify(mockUser))
  return (
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </MemoryRouter>
  )
}

// Override cart in CartProvider with mock data
vi.mock('../contexts/CartContext', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../contexts/CartContext')>()
  return {
    ...mod,
    useCart: () => ({
      cart: mockCart,
      itemCount: 2,
      refreshCart: vi.fn(),
      addToCart: vi.fn(),
      removeFromCart: vi.fn(),
      updateCartItem: vi.fn(),
      clearCart: vi.fn(),
      loading: false,
    }),
  }
})

describe('CheckoutPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders checkout form with all sections', async () => {
    render(<CheckoutPage />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText(/checkout/i)).toBeInTheDocument()
    })

    // Should show address section
    expect(screen.getByText(/delivery address/i)).toBeInTheDocument()

    // Should show order summary
    expect(screen.getByText(/order summary/i)).toBeInTheDocument()
  })

  it('shows TEST PAYMENT banner prominently', async () => {
    render(<CheckoutPage />, { wrapper: Wrapper })

    await waitFor(() => {
      const testPaymentBanners = screen.getAllByText(/test payment/i)
      expect(testPaymentBanners.length).toBeGreaterThan(0)
    })
  })

  it('shows FAIL_TEST hint in payment section', async () => {
    render(<CheckoutPage />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText(/FAIL_TEST/)).toBeInTheDocument()
    })
  })

  it('shows saved address in address selection', async () => {
    render(<CheckoutPage />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  it('shows place order button', async () => {
    render(<CheckoutPage />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText(/place order/i)).toBeInTheDocument()
    })
  })

  it('shows reward points section when balance > 0', async () => {
    render(<CheckoutPage />, { wrapper: Wrapper })

    await waitFor(() => {
      const elements = screen.getAllByText(/reward points/i)
      expect(elements.length).toBeGreaterThan(0)
    })
  })
})
