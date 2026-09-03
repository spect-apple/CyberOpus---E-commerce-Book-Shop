import api from './axios'
import type { Brand, BrandFormData } from '../types'

export const getBrands = async (): Promise<Brand[]> => {
  const res = await api.get<Brand[]>('/brands')
  return res.data
}

export const getBrand = async (id: number): Promise<Brand> => {
  const res = await api.get<Brand>(`/brands/${id}`)
  return res.data
}

export const adminCreateBrand = async (data: BrandFormData): Promise<Brand> => {
  const res = await api.post<Brand>('/admin/brands', data)
  return res.data
}

export const adminUpdateBrand = async (id: number, data: BrandFormData): Promise<Brand> => {
  const res = await api.put<Brand>(`/admin/brands/${id}`, data)
  return res.data
}

export const adminDeleteBrand = async (id: number): Promise<void> => {
  await api.delete(`/admin/brands/${id}`)
}
