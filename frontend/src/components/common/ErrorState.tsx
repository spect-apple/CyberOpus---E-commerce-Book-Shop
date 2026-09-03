
import Button from './Button'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export default function ErrorState({ message = 'Something went wrong.', onRetry }: ErrorStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">⚠️</div>
      <h3 className="empty-state-title">Error</h3>
      <p className="empty-state-text">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  )
}
