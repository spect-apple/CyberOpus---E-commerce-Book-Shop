import api from './axios'
import type { Address, AddressFormData } from '../types'

export const getAddresses = async (): Promise<Address[]> => {
  const res = await api.get<Address[]>('/addresses')
  return res.data
}

export const createAddress = async (data: AddressFormData): Promise<Address> => {
  const res = await api.post<Address>('/addresses', data)
  return res.data
}

export const updateAddress = async (id: number, data: AddressFormData): Promise<Address> => {
  const res = await api.put<Address>(`/addresses/${id}`, data)
  return res.data
}

export const deleteAddress = async (id: number): Promise<void> => {
  await api.delete(`/addresses/${id}`)
}

export const setDefaultAddress = async (id: number): Promise<Address> => {
  const res = await api.post<Address>(`/addresses/${id}/default`)
  return res.data
}
