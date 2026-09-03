import api from './axios'
import type { WishlistItem } from '../types'

export const getWishlist = (): Promise<WishlistItem[]> =>
  api.get('/wishlist').then(r => r.data)

export const addToWishlist = (bookId: number): Promise<WishlistItem> =>
  api.post('/wishlist', { bookId }).then(r => r.data)

export const removeFromWishlist = (bookId: number): Promise<void> =>
  api.delete(`/wishlist/${bookId}`).then(r => r.data)

export const isInWishlist = (bookId: number): Promise<boolean> =>
  api.get(`/wishlist/check/${bookId}`).then(r => r.data)
