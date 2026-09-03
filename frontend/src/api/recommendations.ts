import api from './axios'
import type { Book } from '../types'

export const getRecommendations = async (): Promise<Book[]> => {
  const res = await api.get<Book[]>('/recommendations')
  return res.data
}
