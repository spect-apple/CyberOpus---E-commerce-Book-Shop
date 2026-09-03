import api from './axios'
import type { Category, CategoryFormData } from '../types'

export const getCategories = async (): Promise<Category[]> => {
  const res = await api.get<Category[]>('/categories')
  return res.data
}

export const getCategory = async (id: number): Promise<Category> => {
  const res = await api.get<Category>(`/categories/${id}`)
  return res.data
}

export const adminCreateCategory = async (data: CategoryFormData): Promise<Category> => {
  const res = await api.post<Category>('/admin/categories', data)
  return res.data
}

export const adminUpdateCategory = async (id: number, data: CategoryFormData): Promise<Category> => {
  const res = await api.put<Category>(`/admin/categories/${id}`, data)
  return res.data
}

export const adminDeleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/admin/categories/${id}`)
}
