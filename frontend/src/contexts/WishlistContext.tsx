import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getWishlist, addToWishlist, removeFromWishlist } from '../api/wishlist'
import type { WishlistItem } from '../types'
import { useAuth } from './AuthContext'

interface WishlistContextType {
  items: WishlistItem[];
  itemCount: number;
  isWishlisted: (bookId: number) => boolean;
  toggle: (bookId: number) => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  items: [],
  itemCount: 0,
  isWishlisted: () => false,
  toggle: async () => {},
  loading: false,
})

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(false)

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) { setItems([]); return }
    try {
      setLoading(true)
      const data = await getWishlist()
      setItems(data)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => { fetchWishlist() }, [fetchWishlist])

  const isWishlisted = useCallback(
    (bookId: number) => items.some(i => i.book.id === bookId),
    [items]
  )

  const toggle = useCallback(async (bookId: number) => {
    if (!isAuthenticated) return
    if (isWishlisted(bookId)) {
      setItems(prev => prev.filter(i => i.book.id !== bookId))
      try { await removeFromWishlist(bookId) } catch { fetchWishlist() }
    } else {
      try {
        const item = await addToWishlist(bookId)
        setItems(prev => [item, ...prev])
      } catch { /* ignore */ }
    }
  }, [isAuthenticated, isWishlisted, fetchWishlist])

  return (
    <WishlistContext.Provider value={{ items, itemCount: items.length, isWishlisted, toggle, loading }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
