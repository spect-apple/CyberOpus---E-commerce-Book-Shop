

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  center?: boolean
}

export default function Spinner({ size = 'md', className = '', center = false }: SpinnerProps) {
  const sizeClass = size === 'sm' ? '' : size === 'lg' ? 'spinner-lg' : ''

  if (center) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <span className={`spinner spinner-primary ${sizeClass} ${className}`} aria-label="Loading" />
      </div>
    )
  }

  return <span className={`spinner spinner-primary ${sizeClass} ${className}`} aria-label="Loading" />
}
