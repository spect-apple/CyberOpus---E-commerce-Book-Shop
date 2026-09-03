import api from './axios'
import type { Book, PageResponse, BookFilters, BookFormData } from '../types'

export const getBooks = async (filters: BookFilters = {}): Promise<PageResponse<Book>> => {
  const params = new URLSearchParams()
  if (filters.page !== undefined) params.append('page', String(filters.page))
  if (filters.size !== undefined) params.append('size', String(filters.size))
  if (filters.search) params.append('search', filters.search)
  if (filters.categoryId) params.append('categoryId', String(filters.categoryId))
  if (filters.brandId) params.append('brandId', String(filters.brandId))
  if (filters.minPrice !== undefined) params.append('minPrice', String(filters.minPrice))
  if (filters.maxPrice !== undefined) params.append('maxPrice', String(filters.maxPrice))
  if (filters.inStock !== undefined) params.append('inStock', String(filters.inStock))
  if (filters.sortBy) params.append('sortBy', filters.sortBy)
  if (filters.sortDir) params.append('sortDir', filters.sortDir)

  const res = await api.get<PageResponse<Book>>(`/books?${params.toString()}`)
  return res.data
}

export const getBook = async (id: number): Promise<Book> => {
  const res = await api.get<Book>(`/books/${id}`)
  return res.data
}

export const searchBooks = async (query: string): Promise<Book[]> => {
  const res = await api.get<Book[]>(`/books/search?q=${encodeURIComponent(query)}`)
  return res.data
}

export const getRelatedBooks = async (id: number): Promise<Book[]> => {
  const res = await api.get<Book[]>(`/books/${id}/related`)
  return res.data
}

export const getFeaturedBooks = async (): Promise<Book[]> => {
  const res = await api.get<Book[]>('/books/featured')
  return res.data
}

// Admin
export const adminCreateBook = async (data: BookFormData): Promise<Book> => {
  const res = await api.post<Book>('/admin/books', data)
  return res.data
}

export const adminUpdateBook = async (id: number, data: BookFormData): Promise<Book> => {
  const res = await api.put<Book>(`/admin/books/${id}`, data)
  return res.data
}

export const adminDeleteBook = async (id: number): Promise<void> => {
  await api.delete(`/admin/books/${id}`)
}

export const adminGetBooks = async (filters: BookFilters = {}): Promise<PageResponse<Book>> => {
  const params = new URLSearchParams()
  if (filters.page !== undefined) params.append('page', String(filters.page))
  if (filters.size !== undefined) params.append('size', String(filters.size))
  if (filters.search) params.append('search', filters.search)
  const res = await api.get<PageResponse<Book>>(`/admin/books?${params.toString()}`)
  return res.data
}
