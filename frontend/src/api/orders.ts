import api from './axios'
import type { Order, PageResponse, CheckoutRequest } from '../types'

export const getOrders = async (page = 0, size = 10): Promise<PageResponse<Order>> => {
  const res = await api.get<PageResponse<Order>>(`/orders?page=${page}&size=${size}`)
  return res.data
}

export const getOrder = async (id: number): Promise<Order> => {
  const res = await api.get<Order>(`/orders/${id}`)
  return res.data
}

export const placeOrder = async (data: CheckoutRequest): Promise<Order> => {
  const res = await api.post<Order>('/orders', data)
  return res.data
}

export const cancelOrder = async (id: number): Promise<Order> => {
  const res = await api.post<Order>(`/orders/${id}/cancel`)
  return res.data
}

export const buyAgain = async (id: number): Promise<{ message: string }> => {
  const res = await api.post<{ message: string }>(`/orders/${id}/buy-again`)
  return res.data
}
