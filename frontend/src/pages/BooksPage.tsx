import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getBooks } from '../api/books'
import { getCategories } from '../api/categories'
import { getBrands } from '../api/brands'
import type { Book, Category, Brand, BookFilters } from '../types'
import BookGrid from '../components/books/BookGrid'
import { useDebounce } from '../hooks/useDebounce'

const SORT_OPTIONS = [
  { value: 'salesCount-desc', label: '🔥 Best Sellers' },
  { value: 'price-asc', label: '💲 Price: Low to High' },
  { value: 'price-desc', label: '💲 Price: High to Low' },
  { value: 'title-asc', label: '🔤 Title: A–Z' },
  { value: 'title-desc', label: '🔤 Title: Z–A' },
  { value: 'publicationYear-desc', label: '🆕 Newest First' },
]

export default function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [categoryId, setCategoryId] = useState<number | ''>(
    searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : ''
  )
  const [brandId, setBrandId] = useState<number | ''>('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [inStock, setInStock] = useState(searchParams.get('inStock') === 'true')
  const [sort, setSort] = useState(searchParams.get('sortBy') ? `${searchParams.get('sortBy')}-${searchParams.get('sortDir') || 'desc'}` : 'salesCount-desc')

  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {})
    getBrands().then(setBrands).catch(() => {})
  }, [])

  const fetchBooks = useCallback(async (p: number) => {
    setLoading(true)
    try {
      const [sortBy, sortDir] = sort.split('-') as [string, 'asc' | 'desc']
      const filters: BookFilters = {
        page: p,
        size: 12,
        search: debouncedSearch || undefined,
        categoryId: categoryId !== '' ? categoryId : undefined,
        brandId: brandId !== '' ? brandId : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        inStock: inStock || undefined,
        sortBy,
        sortDir,
      }
      const res = await getBooks(filters)
      setBooks(res.content)
      setTotalElements(res.totalElements)
      setTotalPages(res.totalPages)
    } catch {
      setBooks([])
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, categoryId, brandId, minPrice, maxPrice, inStock, sort])

  useEffect(() => {
    setPage(0)
    fetchBooks(0)
  }, [debouncedSearch, categoryId, brandId, minPrice, maxPrice, inStock, sort, fetchBooks])

  const handlePageChange = (p: number) => {
    setPage(p)
    fetchBooks(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => {
    setSearch('')
    setCategoryId('')
    setBrandId('')
    setMinPrice('')
    setMaxPrice('')
    setInStock(false)
    setSort('salesCount-desc')
    setSearchParams({})
  }

  const hasFilters = search || categoryId || brandId || minPrice || maxPrice || inStock

  return (
    <div className="page fade-in">
      <div className="container">
        <div className="books-layout">
          {/* ---- Sidebar Filters ---- */}
          <aside className="filter-sidebar">
            <div className="filter-header">
              <h2 className="filter-title">Filters</h2>
              {hasFilters && (
                <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                  Clear all
                </button>
              )}
            </div>

            {/* Search */}
            <div className="filter-section">
              <label className="filter-label">Search</label>
              <div className="search-input-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-input-icon">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Title, author..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ paddingLeft: '2.25rem' }}
                />
              </div>
            </div>

            {/* Category */}
            <div className="filter-section">
              <label className="filter-label">Category</label>
              <select
                className="form-input form-select"
                value={categoryId}
                onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : '')}
              >
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div className="filter-section">
              <label className="filter-label">Publisher / Brand</label>
              <select
                className="form-input form-select"
                value={brandId}
                onChange={e => setBrandId(e.target.value ? Number(e.target.value) : '')}
              >
                <option value="">All Publishers</option>
                {brands.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="filter-section">
              <label className="filter-label">Price Range</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  className="form-input"
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  min="0"
                  style={{ flex: 1 }}
                />
                <span style={{ color: 'var(--text-muted)' }}>–</span>
                <input
                  className="form-input"
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  min="0"
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            {/* In Stock */}
            <div className="filter-section">
              <label className="filter-toggle">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={e => setInStock(e.target.checked)}
                  className="toggle-input"
                />
                <span className="toggle-track">
                  <span className="toggle-thumb" />
                </span>
                <span className="filter-label" style={{ margin: 0 }}>In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* ---- Main Content ---- */}
          <main className="books-main">
            {/* Toolbar */}
            <div className="books-toolbar">
              <div className="books-count">
                {loading ? (
                  <span className="skeleton skeleton-text" style={{ width: '120px', height: '1rem' }} />
                ) : (
                  <span>
                    <strong>{totalElements.toLocaleString()}</strong> book{totalElements !== 1 ? 's' : ''} found
                  </span>
                )}
              </div>
              <select
                className="form-input form-select"
                value={sort}
                onChange={e => setSort(e.target.value)}
                style={{ width: 'auto', minWidth: '180px' }}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Grid */}
            <BookGrid books={books} loading={loading} skeletonCount={12} />

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                >
                  ←
                </button>
                {Array.from({ length: Math.min(7, totalPages) }).map((_, i) => {
                  const p = totalPages <= 7 ? i : Math.max(0, Math.min(totalPages - 7, page - 3)) + i
                  return (
                    <button
                      key={p}
                      className={`pagination-btn${p === page ? ' active' : ''}`}
                      onClick={() => handlePageChange(p)}
                    >
                      {p + 1}
                    </button>
                  )
                })}
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages - 1}
                >
                  →
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        .books-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 2rem;
          padding: 2rem 0;
          align-items: start;
        }
        .filter-sidebar {
          background: var(--bg-primary);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-light);
          box-shadow: var(--shadow-sm);
          padding: 1.25rem;
          position: sticky;
          top: calc(var(--navbar-height) + 1rem);
        }
        .filter-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }
        .filter-title {
          font-size: 1rem;
          font-weight: 700;
        }
        .filter-section { margin-bottom: 1.25rem; }
        .filter-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }
        .search-input-wrap { position: relative; }
        .search-input-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }
        .filter-toggle {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }
        .toggle-input { display: none; }
        .toggle-track {
          width: 44px;
          height: 24px;
          background: var(--border);
          border-radius: 12px;
          position: relative;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .toggle-input:checked ~ .toggle-track { background: var(--primary); }
        .toggle-thumb {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 18px;
          height: 18px;
          background: white;
          border-radius: 50%;
          transition: transform 0.2s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
        .toggle-input:checked ~ .toggle-track .toggle-thumb { transform: translateX(20px); }
        .books-main {}
        .books-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .books-count { color: var(--text-secondary); font-size: 0.9rem; }
        .books-count strong { color: var(--text-primary); }

        @media (max-width: 900px) {
          .books-layout { grid-template-columns: 1fr; }
          .filter-sidebar { position: static; }
        }
      `}</style>
    </div>
  )
}
