import { vi } from 'vitest'
import type { User, AuthResponse, Book, Cart, PageResponse } from '../../types'

export const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'CUSTOMER',
}

export const mockAdminUser: User = {
  id: 2,
  email: 'admin@example.com',
  firstName: 'Admin',
  lastName: 'User',
  role: 'ADMIN',
}

export const mockAuthResponse: AuthResponse = {
  token: 'mock-jwt-token',
  user: mockUser,
}

export const mockBook: Book = {
  id: 1,
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald',
  description: 'A story of the fabulously wealthy Jay Gatsby.',
  price: 12.99,
  stockQuantity: 50,
  isbn: '978-0-7432-7356-5',
  imageUrl: '',
  publicationYear: 1925,
  active: true,
  category: { id: 1, name: 'Fiction' },
  brand: { id: 1, name: 'Scribner' },
  salesCount: 1000,
  inStock: true,
}

export const mockBook2: Book = {
  id: 2,
  title: '1984',
  author: 'George Orwell',
  price: 9.99,
  stockQuantity: 0,
  active: true,
  salesCount: 2000,
  inStock: false,
}

export const mockCart: Cart = {
  items: [
    {
      id: 1,
      book: mockBook,
      quantity: 2,
      priceAtAdd: 12.99,
      currentPrice: 12.99,
      priceChanged: false,
    },
  ],
  subtotal: 25.98,
  deliveryCharge: 0,
  total: 25.98,
  itemCount: 2,
}

export const mockPageResponse: PageResponse<Book> = {
  content: [mockBook, mockBook2],
  page: 0,
  size: 12,
  totalPages: 1,
  totalElements: 2,
}

// API mock factories
export const createMockApi = () => ({
  login: vi.fn().mockResolvedValue(mockAuthResponse),
  register: vi.fn().mockResolvedValue({ message: 'Registered successfully' }),
  getMe: vi.fn().mockResolvedValue(mockUser),
  getBooks: vi.fn().mockResolvedValue(mockPageResponse),
  getBook: vi.fn().mockResolvedValue(mockBook),
  getCart: vi.fn().mockResolvedValue(mockCart),
  addItem: vi.fn().mockResolvedValue(mockCart),
  removeItem: vi.fn().mockResolvedValue({ ...mockCart, items: [], itemCount: 0 }),
  updateItem: vi.fn().mockResolvedValue(mockCart),
})
