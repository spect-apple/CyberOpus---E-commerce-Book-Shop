import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getBooks } from '../api/books'
import { getCategories } from '../api/categories'
import { getRecommendations } from '../api/recommendations'
import type { Book, Category } from '../types'
import BookGrid from '../components/books/BookGrid'
import { useAuth } from '../contexts/AuthContext'

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  )
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  )
}

const CAT_ACCENT_COLORS = [
  '#1246d9', '#e8401e', '#2a9d5c', '#9b27af',
  '#e67c00', '#1a7a9e', '#b91c2c', '#5c3d99',
]

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [recommendations, setRecommendations] = useState<Book[]>([])
  const [loadingBooks, setLoadingBooks] = useState(true)
  const [loadingCats, setLoadingCats] = useState(true)

  useEffect(() => {
    getBooks({ size: 8, sortBy: 'salesCount', sortDir: 'desc' })
      .then(r => setFeaturedBooks(r.content))
      .catch(() => {})
      .finally(() => setLoadingBooks(false))

    getCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoadingCats(false))

    if (isAuthenticated) {
      getRecommendations()
        .then(r => setRecommendations(r.slice(0, 4)))
        .catch(() => {})
    }
  }, [isAuthenticated])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="homepage">

      {/* ===================== HERO ===================== */}
      <section className="hp-hero">
        <div className="container hp-hero-inner">
          <div className="hp-hero-text">
            <p className="hp-eyebrow">Premium Bookstore</p>
            <h1 className="hp-headline">
              Read<br />
              <em className="hp-headline-em">Widely.</em>
            </h1>
            <p className="hp-sub">
              Over 10,000 titles curated for the curious mind.
              From literary fiction to cutting-edge science.
            </p>
            <div className="hp-hero-actions">
              <Link to="/books" className="btn btn-primary btn-lg">
                Browse Catalogue
              </Link>
              {!isAuthenticated && (
                <Link to="/register" className="hp-ghost-link">
                  Create Account <ArrowRight />
                </Link>
              )}
            </div>
          </div>

          <div className="hp-hero-right">
            <form className="hp-search-form" onSubmit={handleSearch} role="search">
              <label className="hp-search-label" htmlFor="hp-search">Find a Book</label>
              <div className="hp-search-row">
                <span className="hp-search-icon"><SearchIcon /></span>
                <input
                  id="hp-search"
                  className="hp-search-input"
                  type="text"
                  placeholder="Title, author, ISBN…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  autoComplete="off"
                />
                <button type="submit" className="btn btn-primary hp-search-btn">Search</button>
              </div>
            </form>

            {/* Stats strip */}
            <div className="hp-stats">
              {[
                { num: '10 K+', lbl: 'Titles' },
                { num: 'Free',  lbl: 'Delivery over $25' },
                { num: '10 pt', lbl: 'Per dollar spent' },
                { num: '30 d',  lbl: 'Easy returns' },
              ].map(s => (
                <div key={s.lbl} className="hp-stat">
                  <span className="hp-stat-num">{s.num}</span>
                  <span className="hp-stat-lbl">{s.lbl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CATEGORIES ===================== */}
      <section className="hp-section hp-cats-section">
        <div className="container">
          <div className="hp-section-head">
            <h2 className="hp-section-title">Genres</h2>
            <Link to="/books" className="hp-see-all">All titles <ArrowRight /></Link>
          </div>

          {loadingCats ? (
            <div className="hp-cats-track">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="hp-cat-skeleton skeleton" />
              ))}
            </div>
          ) : (
            <div className="hp-cats-track">
              {categories.map((cat, idx) => (
                <Link
                  key={cat.id}
                  to={`/books?categoryId=${cat.id}`}
                  className="hp-cat"
                  style={{ '--cat-color': CAT_ACCENT_COLORS[idx % CAT_ACCENT_COLORS.length] } as React.CSSProperties}
                >
                  <span className="hp-cat-name">{cat.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===================== BESTSELLERS ===================== */}
      <section className="hp-section hp-section-alt">
        <div className="container">
          <div className="hp-section-head">
            <h2 className="hp-section-title">Bestsellers</h2>
            <Link to="/books?sortBy=salesCount&sortDir=desc" className="hp-see-all">
              View all <ArrowRight />
            </Link>
          </div>
          <BookGrid books={featuredBooks} loading={loadingBooks} skeletonCount={8} />
        </div>
      </section>

      {/* ===================== WHY CYBEROPUS ===================== */}
      <section className="hp-section">
        <div className="container">
          <div className="hp-section-head">
            <h2 className="hp-section-title">Why CyberOpus</h2>
          </div>
          <div className="hp-features">
            {[
              {
                num: '01',
                title: 'Fast Delivery',
                text: 'Free shipping on all orders over $25. Quick dispatch, tracked to your door.',
              },
              {
                num: '02',
                title: 'Reward Points',
                text: 'Earn 10 points per dollar. Redeem 100 points for $1 off your next order.',
              },
              {
                num: '03',
                title: 'Curated Catalogue',
                text: 'Over 10,000 hand-selected titles spanning every genre and interest.',
              },
              {
                num: '04',
                title: 'Smart Picks',
                text: 'Personalised recommendations based on your reading history.',
              },
              {
                num: '05',
                title: 'Secure & Private',
                text: 'Encrypted checkout. Your data is never sold or shared.',
              },
              {
                num: '06',
                title: 'Easy Returns',
                text: '30-day hassle-free returns on any undamaged item. No questions asked.',
              },
            ].map(f => (
              <div key={f.num} className="hp-feature">
                <span className="hp-feature-num">{f.num}</span>
                <div className="hp-feature-divider" />
                <h3 className="hp-feature-title">{f.title}</h3>
                <p className="hp-feature-text">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== PERSONALISED RECS ===================== */}
      {isAuthenticated && recommendations.length > 0 && (
        <section className="hp-section hp-section-alt">
          <div className="container">
            <div className="hp-section-head">
              <h2 className="hp-section-title">For You</h2>
              <Link to="/recommendations" className="hp-see-all">See all <ArrowRight /></Link>
            </div>
            <BookGrid books={recommendations} loading={false} />
          </div>
        </section>
      )}

      {/* ===================== CTA ===================== */}
      {!isAuthenticated && (
        <section className="hp-cta">
          <div className="container hp-cta-inner">
            <div>
              <p className="hp-cta-eyebrow">Join CyberOpus</p>
              <h2 className="hp-cta-title">Start your reading journey.</h2>
            </div>
            <div className="hp-cta-actions">
              <Link to="/register" className="btn btn-accent btn-lg">Create Free Account</Link>
              <Link to="/books" className="hp-ghost-link hp-ghost-light">
                Browse First <ArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      <style>{`
        /* ======== Hero ======== */
        .hp-hero {
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border);
          padding: 5rem 0 4rem;
        }
        .hp-hero-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        .hp-eyebrow {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 1.25rem;
        }
        .hp-headline {
          font-family: var(--font-serif);
          font-size: clamp(3.5rem, 7vw, 6rem);
          font-weight: 900;
          line-height: 0.95;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }
        .hp-headline-em {
          color: var(--primary);
          font-style: italic;
        }
        .hp-sub {
          font-size: 1.05rem;
          color: var(--text-secondary);
          line-height: 1.7;
          max-width: 400px;
          margin-bottom: 2.5rem;
        }
        .hp-hero-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .hp-ghost-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: gap 0.2s;
        }
        .hp-ghost-link:hover { gap: 0.7rem; color: var(--primary); }

        /* Search */
        .hp-search-form {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: 1.75rem;
          margin-bottom: 2rem;
        }
        .hp-search-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 0.875rem;
        }
        .hp-search-row {
          display: flex;
          align-items: center;
          background: var(--bg-secondary);
          border: 1.5px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 0.25rem 0.25rem 0.25rem 1rem;
          gap: 0.5rem;
          transition: border-color 0.2s;
        }
        .hp-search-row:focus-within { border-color: var(--primary); }
        .hp-search-icon { color: var(--text-muted); display: flex; flex-shrink: 0; }
        .hp-search-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 1rem;
          color: var(--text-primary);
          font-family: var(--font-sans);
        }
        .hp-search-input::placeholder { color: var(--text-muted); }
        .hp-search-btn { border-radius: var(--radius-md); }

        /* Stats strip */
        .hp-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .hp-stat {
          padding: 1rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          border-right: 1px solid var(--border);
        }
        .hp-stat:last-child { border-right: none; }
        .hp-stat-num {
          font-size: 1rem;
          font-weight: 800;
          color: var(--text-primary);
          font-family: var(--font-sans);
          white-space: nowrap;
        }
        .hp-stat-lbl {
          font-size: 0.68rem;
          color: var(--text-muted);
          line-height: 1.3;
        }

        /* ======== Sections ======== */
        .hp-section { padding: 4rem 0; }
        .hp-section-alt { background: var(--bg-secondary); }
        .hp-section-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 2.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }
        .hp-section-title {
          font-family: var(--font-serif);
          font-size: 2rem;
          font-weight: 900;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }
        .hp-see-all {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--primary);
          text-decoration: none;
          transition: gap 0.2s;
        }
        .hp-see-all:hover { gap: 0.6rem; }

        /* ======== Categories ======== */
        .hp-cats-section { padding: 3rem 0; }
        .hp-cats-track {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .hp-cat {
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 1.125rem;
          border: 1.5px solid var(--cat-color, var(--border));
          border-radius: 100px;
          color: var(--cat-color, var(--text-primary));
          text-decoration: none;
          transition: background 0.18s, color 0.18s;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.03em;
        }
        .hp-cat:hover {
          background: var(--cat-color, var(--primary));
          color: white;
        }
        .hp-cat-name { pointer-events: none; }
        .hp-cat-skeleton {
          width: 100px;
          height: 38px;
          border-radius: 100px;
          flex-shrink: 0;
        }

        /* ======== Features ======== */
        .hp-features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          overflow: hidden;
        }
        .hp-feature {
          padding: 2rem 1.75rem;
          border-right: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          transition: background 0.2s;
        }
        .hp-feature:hover { background: var(--bg-secondary); }
        .hp-feature:nth-child(3n) { border-right: none; }
        .hp-feature:nth-child(n+4) { border-bottom: none; }
        .hp-feature-num {
          display: block;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          color: var(--accent);
          margin-bottom: 0.875rem;
        }
        .hp-feature-divider {
          width: 28px;
          height: 2px;
          background: var(--border);
          margin-bottom: 0.875rem;
        }
        .hp-feature-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          font-family: var(--font-sans);
        }
        .hp-feature-text {
          font-size: 0.83rem;
          color: var(--text-secondary);
          line-height: 1.65;
        }

        /* ======== CTA ======== */
        .hp-cta {
          background: var(--primary);
          padding: 5rem 0;
        }
        .hp-cta-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 3rem;
          flex-wrap: wrap;
        }
        .hp-cta-eyebrow {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          margin-bottom: 0.75rem;
        }
        .hp-cta-title {
          font-family: var(--font-serif);
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 900;
          color: white;
          letter-spacing: -0.02em;
        }
        .hp-cta-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-shrink: 0;
          flex-wrap: wrap;
        }
        .hp-ghost-light {
          color: rgba(255,255,255,0.85);
        }
        .hp-ghost-light:hover { color: white; }

        /* ======== Responsive ======== */
        @media (max-width: 1024px) {
          .hp-features { grid-template-columns: repeat(2, 1fr); }
          .hp-feature:nth-child(3n) { border-right: 1px solid var(--border); }
          .hp-feature:nth-child(2n) { border-right: none; }
          .hp-feature:nth-child(n+5) { border-bottom: none; }
          .hp-feature:nth-child(-n+4) { border-bottom: 1px solid var(--border); }
        }
        @media (max-width: 768px) {
          .hp-hero { padding: 3.5rem 0 3rem; }
          .hp-hero-inner { grid-template-columns: 1fr; gap: 2.5rem; }
          .hp-headline { font-size: clamp(3rem, 10vw, 4.5rem); }
          .hp-stats { grid-template-columns: repeat(2, 1fr); }
          .hp-stat:nth-child(2) { border-right: none; }
          .hp-stat:nth-child(n+3) { border-top: 1px solid var(--border); }
          .hp-features { grid-template-columns: 1fr; }
          .hp-feature { border-right: none !important; border-bottom: 1px solid var(--border) !important; }
          .hp-feature:last-child { border-bottom: none !important; }
          .hp-cta-inner { flex-direction: column; align-items: flex-start; }
          .hp-cta { padding: 3.5rem 0; }
        }
        @media (max-width: 480px) {
          .hp-hero-actions { flex-direction: column; align-items: flex-start; }
          .hp-stats { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  )
}
