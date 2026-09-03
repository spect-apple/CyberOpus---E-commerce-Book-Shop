import api from './axios'
import type { AuthResponse, RegisterData, User } from '../types'

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/auth/login', { email, password })
  return res.data
}

export const register = async (data: RegisterData): Promise<{ message: string }> => {
  const res = await api.post<{ message: string }>('/auth/register', data)
  return res.data
}

export const getMe = async (): Promise<User> => {
  const res = await api.get<User>('/auth/me')
  return res.data
}
