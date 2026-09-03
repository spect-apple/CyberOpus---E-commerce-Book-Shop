import api from './axios'
import type { AdminStats, PageResponse, Order, User } from '../types'

export const getAdminStats = async (): Promise<AdminStats> => {
  const res = await api.get<AdminStats>('/admin/stats')
  return res.data
}

export const getAdminOrders = async (page = 0, size = 20): Promise<PageResponse<Order>> => {
  const res = await api.get<PageResponse<Order>>(`/admin/orders?page=${page}&size=${size}`)
  return res.data
}

export const getAdminUsers = async (page = 0, size = 20): Promise<PageResponse<User>> => {
  const res = await api.get<PageResponse<User>>(`/admin/users?page=${page}&size=${size}`)
  return res.data
}
