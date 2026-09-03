import { useState, useCallback } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((options: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    const duration = options.duration ?? 4000
    setToasts(prev => [...prev, { ...options, id }])
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration)
    }
    return id
  }, [dismiss])

  const success = useCallback((title: string, message?: string) =>
    toast({ type: 'success', title, message }), [toast])

  const error = useCallback((title: string, message?: string) =>
    toast({ type: 'error', title, message, duration: 6000 }), [toast])

  const warning = useCallback((title: string, message?: string) =>
    toast({ type: 'warning', title, message }), [toast])

  const info = useCallback((title: string, message?: string) =>
    toast({ type: 'info', title, message }), [toast])

  return { toasts, toast, dismiss, success, error, warning, info }
}
