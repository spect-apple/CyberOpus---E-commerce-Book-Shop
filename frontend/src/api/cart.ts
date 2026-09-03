import api from './axios'
import type { Cart } from '../types'

export const getCart = async (): Promise<Cart> => {
  const res = await api.get<Cart>('/cart')
  return res.data
}

export const addItem = async (bookId: number, quantity: number): Promise<Cart> => {
  const res = await api.post<Cart>('/cart/items', { bookId, quantity })
  return res.data
}

export const updateItem = async (itemId: number, quantity: number): Promise<Cart> => {
  const res = await api.put<Cart>(`/cart/items/${itemId}`, { quantity })
  return res.data
}

export const removeItem = async (itemId: number): Promise<Cart> => {
  const res = await api.delete<Cart>(`/cart/items/${itemId}`)
  return res.data
}

export const clearCart = async (): Promise<void> => {
  await api.delete('/cart')
}
