import React from 'react'
import type { Book } from '../../types'
import BookCard from './BookCard'
import { BookGridSkeleton } from '../common/Skeleton'
import EmptyState from '../common/EmptyState'

interface BookGridProps {
  books: Book[]
  loading?: boolean
  skeletonCount?: number
  emptyTitle?: string
  emptyText?: string
  emptyAction?: React.ReactNode
}

export default function BookGrid({
  books,
  loading = false,
  skeletonCount = 8,
  emptyTitle = 'No books found',
  emptyText = 'Try adjusting your search or filters.',
  emptyAction,
}: BookGridProps) {
  if (loading) return <BookGridSkeleton count={skeletonCount} />

  if (books.length === 0) {
    return (
      <EmptyState
        icon="📚"
        title={emptyTitle}
        text={emptyText}
        action={emptyAction}
      />
    )
  }

  return (
    <div className="book-grid fade-in">
      {books.map(book => (
        <BookCard key={book.id} book={book} />
      ))}
      <style>{`
        .book-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 1rem;
        }
        @media (max-width: 480px) {
          .book-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 0.75rem; }
        }
      `}</style>
    </div>
  )
}
