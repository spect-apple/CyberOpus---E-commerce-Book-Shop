import api from './axios'
import type { RewardPoints } from '../types'

export const getRewards = async (): Promise<RewardPoints> => {
  const res = await api.get<RewardPoints>('/rewards')
  return res.data
}
