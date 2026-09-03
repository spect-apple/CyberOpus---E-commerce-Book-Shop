
import type { Toast, ToastType } from '../../hooks/useToast'

function toastIcon(type: ToastType): string {
  switch (type) {
    case 'success': return '✅'
    case 'error':   return '❌'
    case 'warning': return '⚠️'
    case 'info':    return 'ℹ️'
  }
}

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  return (
    <div className={`toast toast-${toast.type}`} role="alert">
      <span className="toast-icon">{toastIcon(toast.type)}</span>
      <div className="toast-content">
        <div className="toast-title">{toast.title}</div>
        {toast.message && <div className="toast-message">{toast.message}</div>}
      </div>
      <button className="toast-close" onClick={() => onRemove(toast.id)} aria-label="Close">
        ×
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  )
}
