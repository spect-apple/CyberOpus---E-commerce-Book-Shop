import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { Cart } from '../types'
import * as cartApi from '../api/cart'
import { useAuth } from './AuthContext'

interface CartContextType {
  cart: Cart | null
  itemCount: number
  refreshCart: () => Promise<void>
  addToCart: (bookId: number, quantity: number) => Promise<void>
  removeFromCart: (itemId: number) => Promise<void>
  updateCartItem: (itemId: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  loading: boolean
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null)
      return
    }
    try {
      setLoading(true)
      const data = await cartApi.getCart()
      setCart(data)
    } catch {
      setCart(null)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart()
    } else {
      setCart(null)
    }
  }, [isAuthenticated, refreshCart])

  const addToCart = useCallback(async (bookId: number, quantity: number) => {
    const data = await cartApi.addItem(bookId, quantity)
    setCart(data)
  }, [])

  const removeFromCart = useCallback(async (itemId: number) => {
    const data = await cartApi.removeItem(itemId)
    setCart(data)
  }, [])

  const updateCartItem = useCallback(async (itemId: number, quantity: number) => {
    const data = await cartApi.updateItem(itemId, quantity)
    setCart(data)
  }, [])

  const clearCartFn = useCallback(async () => {
    await cartApi.clearCart()
    setCart(null)
  }, [])

  const itemCount = cart?.itemCount ?? 0

  return (
    <CartContext.Provider value={{
      cart,
      itemCount,
      refreshCart,
      addToCart,
      removeFromCart,
      updateCartItem,
      clearCart: clearCartFn,
      loading,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
