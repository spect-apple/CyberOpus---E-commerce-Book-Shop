import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { adminGetBooks, adminCreateBook, adminUpdateBook, adminDeleteBook } from '../../api/books'
import { getCategories } from '../../api/categories'
import { getBrands } from '../../api/brands'
import type { Book, BookFormData, Category, Brand } from '../../types'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Spinner from '../../components/common/Spinner'

const EMPTY_FORM: BookFormData = {
  title: '', author: '', description: '', price: '',
  stockQuantity: '', isbn: '', imageUrl: '',
  publicationYear: '', categoryId: '', brandId: '', active: true,
}

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [search, setSearch] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [form, setForm] = useState<BookFormData>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const [confirmDelete, setConfirmDelete] = useState<Book | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback((p: number) => {
    setLoading(true)
    adminGetBooks({ page: p, size: 15, search: search || undefined })
      .then(res => { setBooks(res.content); setTotalPages(res.totalPages); setTotalElements(res.totalElements) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search])

  useEffect(() => { load(0); setPage(0) }, [search, load])
  useEffect(() => {
    getCategories().then(setCategories).catch(() => {})
    getBrands().then(setBrands).catch(() => {})
  }, [])

  const openAdd = () => { setEditingBook(null); setForm(EMPTY_FORM); setModalOpen(true) }
  const openEdit = (b: Book) => {
    setEditingBook(b)
    setForm({
      title: b.title, author: b.author, description: b.description || '',
      price: b.price, stockQuantity: b.stockQuantity, isbn: b.isbn || '',
      imageUrl: b.imageUrl || '', publicationYear: b.publicationYear || '',
      categoryId: b.category?.id || '', brandId: b.brand?.id || '', active: b.active,
    })
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingBook) {
        await adminUpdateBook(editingBook.id, form)
      } else {
        await adminCreateBook(form)
      }
      setModalOpen(false)
      load(page)
    } catch { /* ignore */ }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    setDeleting(true)
    try { await adminDeleteBook(confirmDelete.id); load(page) }
    catch { /* ignore */ }
    finally { setDeleting(false); setConfirmDelete(null) }
  }

  const setF = (field: keyof BookFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        {[
          { to: '/admin', label: '📊 Dashboard' },
          { to: '/admin/books', label: '📚 Books' },
          { to: '/admin/categories', label: '🏷️ Categories' },
          { to: '/admin/brands', label: '🏢 Publishers' },
        ].map(item => (
          <Link key={item.to} to={item.to} className={`admin-sidebar-link${location.pathname === item.to ? ' active' : ''}`}>{item.label}</Link>
        ))}
        <div style={{ height: '1px', background: 'var(--border)', margin: '0.75rem 0' }} />
        <Link to="/" className="admin-sidebar-link">← Back to Store</Link>
      </aside>

      <main className="admin-content">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">📚 Manage Books</h1>
            <p className="page-subtitle">{totalElements} books total</p>
          </div>
          <Button onClick={openAdd}>+ Add Book</Button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
          <input
            className="form-input"
            placeholder="Search books..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: '320px' }}
          />
        </div>

        {loading ? <Spinner center /> : (
          <>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th style={{ textAlign: 'right' }}>Price</th>
                    <th style={{ textAlign: 'center' }}>Stock</th>
                    <th style={{ textAlign: 'center' }}>Status</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map(b => (
                    <tr key={b.id}>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{b.id}</td>
                      <td>
                        <div style={{ fontWeight: 600, maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-serif)' }}>
                          {b.title}
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{b.author}</td>
                      <td>{b.category ? <span className="badge badge-primary">{b.category.name}</span> : '—'}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{b.brand?.name || '—'}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>${b.price.toFixed(2)}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${b.stockQuantity > 0 ? 'badge-success' : 'badge-danger'}`}>{b.stockQuantity}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${b.active ? 'badge-success' : 'badge-neutral'}`}>{b.active ? 'Active' : 'Inactive'}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'center' }}>
                          <button className="btn btn-secondary btn-icon btn-sm" onClick={() => openEdit(b)} title="Edit">✏️</button>
                          <button className="btn btn-danger btn-icon btn-sm" onClick={() => setConfirmDelete(b)} title="Delete">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button className="pagination-btn" onClick={() => { setPage(page - 1); load(page - 1) }} disabled={page === 0}>←</button>
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const p = i + Math.max(0, Math.min(totalPages - 5, page - 2))
                  return <button key={p} className={`pagination-btn${p === page ? ' active' : ''}`} onClick={() => { setPage(p); load(p) }}>{p + 1}</button>
                })}
                <button className="pagination-btn" onClick={() => { setPage(page + 1); load(page + 1) }} disabled={page >= totalPages - 1}>→</button>
              </div>
            )}
          </>
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingBook ? `Edit: ${editingBook.title}` : 'Add New Book'}
          maxWidth="640px"
          footer={
            <>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button loading={saving} onClick={handleSave}>{editingBook ? 'Save Changes' : 'Add Book'}</Button>
            </>
          }
        >
          <form onSubmit={handleSave}>
            <div className="form-row">
              <Input label="Title" value={String(form.title)} onChange={setF('title')} required placeholder="Book Title" />
              <Input label="Author" value={String(form.author)} onChange={setF('author')} required placeholder="Author Name" />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input form-textarea" value={String(form.description)} onChange={setF('description')} placeholder="Book description..." />
            </div>
            <div className="form-row">
              <Input label="Price ($)" type="number" step="0.01" min="0" value={String(form.price)} onChange={setF('price')} required placeholder="9.99" />
              <Input label="Stock Quantity" type="number" min="0" value={String(form.stockQuantity)} onChange={setF('stockQuantity')} required placeholder="100" />
            </div>
            <div className="form-row">
              <Input label="ISBN" value={String(form.isbn)} onChange={setF('isbn')} placeholder="978-0-000-00000-0" />
              <Input label="Publication Year" type="number" value={String(form.publicationYear)} onChange={setF('publicationYear')} placeholder="2024" />
            </div>
            <Input label="Image URL" value={String(form.imageUrl)} onChange={setF('imageUrl')} placeholder="https://..." />
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-input form-select" value={String(form.categoryId)} onChange={setF('categoryId')}>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Publisher</label>
                <select className="form-input form-select" value={String(form.brandId)} onChange={setF('brandId')}>
                  <option value="">Select Publisher</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            </div>
            <label className="filter-toggle" style={{ cursor: 'pointer', gap: '0.75rem', display: 'flex', alignItems: 'center' }}>
              <input type="checkbox" className="toggle-input" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} />
              <span className="toggle-track"><span className="toggle-thumb" /></span>
              <span className="form-label" style={{ margin: 0 }}>Active (visible in store)</span>
            </label>
          </form>
        </Modal>

        {/* Delete Confirm */}
        <Modal
          isOpen={!!confirmDelete}
          onClose={() => setConfirmDelete(null)}
          title="Delete Book"
          footer={
            <>
              <Button variant="secondary" onClick={() => setConfirmDelete(null)}>Cancel</Button>
              <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
            </>
          }
        >
          <p>Are you sure you want to delete <strong>"{confirmDelete?.title}"</strong>? This cannot be undone.</p>
        </Modal>

        <style>{`
          .filter-toggle { display: flex; align-items: center; gap: 0.75rem; }
          .toggle-input { display: none; }
          .toggle-track { width: 44px; height: 24px; background: var(--border); border-radius: 12px; position: relative; transition: background 0.2s; flex-shrink: 0; }
          .toggle-input:checked ~ .toggle-track { background: var(--primary); }
          .toggle-thumb { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; background: white; border-radius: 50%; transition: transform 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
          .toggle-input:checked ~ .toggle-track .toggle-thumb { transform: translateX(20px); }
        `}</style>
      </main>
    </div>
  )
}
