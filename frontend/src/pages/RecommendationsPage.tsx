import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getRecommendations } from '../api/recommendations'
import { getBooks } from '../api/books'
import type { Book } from '../types'
import BookGrid from '../components/books/BookGrid'
import { useAuth } from '../contexts/AuthContext'

export default function RecommendationsPage() {
  const { isAuthenticated } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [hasHistory, setHasHistory] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      // Fallback to bestsellers
      getBooks({ size: 12, sortBy: 'salesCount', sortDir: 'desc' })
        .then(r => { setBooks(r.content); setHasHistory(false) })
        .catch(() => {})
        .finally(() => setLoading(false))
      return
    }

    getRecommendations()
      .then(r => {
        if (r.length === 0) {
          setHasHistory(false)
          return getBooks({ size: 12, sortBy: 'salesCount', sortDir: 'desc' })
            .then(res => setBooks(res.content))
        }
        setBooks(r)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  return (
    <div className="page fade-in">
      <div className="container">
        <div className="recommendations-header">
          <div className="rec-hero">
            <div className="rec-hero-icon">✨</div>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>
                {hasHistory ? 'Recommended For You' : 'Discover Bestsellers'}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', marginTop: '0.375rem' }}>
                {hasHistory
                  ? 'Personalised picks based on your purchase history'
                  : isAuthenticated
                    ? 'Order some books to get personalised recommendations!'
                    : 'Sign in to get personalised book recommendations'}
              </p>
            </div>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
            <span>💡</span>
            <span>
              <strong>Want personalised recommendations?</strong>{' '}
              <Link to="/register">Create an account</Link> or{' '}
              <Link to="/login">sign in</Link> to get picks tailored to you.
            </span>
          </div>
        )}

        {!hasHistory && isAuthenticated && (
          <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
            <span>📚</span>
            <span>
              <strong>No history yet!</strong> Start shopping and we'll recommend books based on your purchases.
              Showing bestsellers in the meantime.
            </span>
          </div>
        )}

        <BookGrid
          books={books}
          loading={loading}
          skeletonCount={12}
          emptyTitle="No recommendations yet"
          emptyText="Place your first order and we'll start recommending books for you."
          emptyAction={<Link to="/books" className="btn btn-primary">Browse Books</Link>}
        />
      </div>

      <style>{`
        .recommendations-header { margin-bottom: 2rem; }
        .rec-hero {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          border-radius: var(--radius-xl);
          padding: 2rem 2.5rem;
          color: white;
        }
        .rec-hero-icon { font-size: 3.5rem; }
      `}</style>
    </div>
  )
}
