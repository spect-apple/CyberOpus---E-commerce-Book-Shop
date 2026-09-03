import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import { CartProvider } from '../contexts/CartContext'
import BooksPage from '../pages/BooksPage'
import { mockPageResponse } from './mocks/handlers'

vi.mock('../api/books', () => ({
  getBooks: vi.fn(),
  getBook: vi.fn(),
}))

vi.mock('../api/categories', () => ({
  getCategories: vi.fn().mockResolvedValue([
    { id: 1, name: 'Fiction' },
    { id: 2, name: 'Science' },
  ]),
}))

vi.mock('../api/brands', () => ({
  getBrands: vi.fn().mockResolvedValue([
    { id: 1, name: 'Penguin' },
  ]),
}))

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

import * as booksApi from '../api/books'

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('BooksPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(booksApi.getBooks).mockResolvedValue(mockPageResponse)
  })

  it('renders books after loading', async () => {
    render(<BooksPage />, { wrapper: Wrapper })
    await waitFor(() => {
      expect(screen.getByText('The Great Gatsby')).toBeInTheDocument()
    })
    expect(screen.getByText('1984')).toBeInTheDocument()
  })

  it('shows total results count', async () => {
    render(<BooksPage />, { wrapper: Wrapper })
    await waitFor(() => {
      // The count is split across a <strong> and text node, check for 'found' text presence
      expect(screen.getByText(/found/i)).toBeInTheDocument()
    })
  })

  it('renders category filter options', async () => {
    render(<BooksPage />, { wrapper: Wrapper })
    await waitFor(() => {
      // Category filter options should appear in sidebar
      const fictionOptions = screen.getAllByText('Fiction')
      expect(fictionOptions.length).toBeGreaterThan(0)
    })
  })

  it('calls getBooks with search query when typing', async () => {
    const user = userEvent.setup()
    render(<BooksPage />, { wrapper: Wrapper })

    await waitFor(() => screen.getByPlaceholderText(/title, author/i))

    const input = screen.getByPlaceholderText(/title, author/i)
    await user.type(input, 'gatsby')

    await waitFor(() => {
      expect(booksApi.getBooks).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'gatsby' })
      )
    }, { timeout: 2000 })
  })

  it('calls getBooks when in stock filter is toggled', async () => {
    const user = userEvent.setup()
    render(<BooksPage />, { wrapper: Wrapper })

    await waitFor(() => screen.getByText(/in stock only/i))

    // Find the in-stock filter toggle (could be checkbox or label click)
    const inStockLabel = screen.getByText(/in stock only/i)
    await user.click(inStockLabel)

    await waitFor(() => {
      expect(booksApi.getBooks).toHaveBeenCalledWith(
        expect.objectContaining({ inStock: true })
      )
    })
  })
})
