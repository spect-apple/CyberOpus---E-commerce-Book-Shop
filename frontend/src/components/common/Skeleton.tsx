interface SkeletonProps {
  width?: string
  height?: string
  className?: string
  variant?: 'text' | 'circle' | 'card' | 'default'
  lines?: number
}

export function Skeleton({ width, height, className = '', variant = 'default', lines }: SkeletonProps) {
  if (lines && lines > 1) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`skeleton skeleton-text ${className}`}
            style={{
              width: i === lines - 1 ? '70%' : (width || '100%'),
              height: height || '1em',
            }}
          />
        ))}
      </div>
    )
  }

  const variantClass = variant === 'text' ? 'skeleton-text'
    : variant === 'circle' ? 'skeleton-circle'
    : variant === 'card' ? 'skeleton-card'
    : ''

  return (
    <div
      className={`skeleton ${variantClass} ${className}`}
      style={{ width, height }}
    />
  )
}

export function BookCardSkeleton() {
  return (
    <div className="card" style={{ padding: '1rem' }}>
      <Skeleton height="220px" variant="card" className="book-card-skeleton-top" />
      <Skeleton lines={2} height="1rem" />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', alignItems: 'center' }}>
        <Skeleton width="60px" height="1.5rem" />
        <Skeleton width="80px" height="2rem" variant="card" />
      </div>
    </div>
  )
}

export function BookGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: '1.5rem'
    }}>
      {Array.from({ length: count }).map((_, i) => <BookCardSkeleton key={i} />)}
    </div>
  )
}
