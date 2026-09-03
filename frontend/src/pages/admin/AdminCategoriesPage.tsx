import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '../../api/categories'
import type { Category, CategoryFormData } from '../../types'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Spinner from '../../components/common/Spinner'

const EMPTY: CategoryFormData = { name: '', description: '', imageUrl: '' }

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState<CategoryFormData>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    getCategories().then(setCats).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModalOpen(true) }
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, description: c.description || '', imageUrl: c.imageUrl || '' }); setModalOpen(true) }
  const setF = (field: keyof CategoryFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [field]: e.target.value }))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editing) await adminUpdateCategory(editing.id, form)
      else await adminCreateCategory(form)
      setModalOpen(false); load()
    } catch { /* ignore */ }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!confirmDelete) return; setDeleting(true)
    try { await adminDeleteCategory(confirmDelete.id); load() }
    catch { /* ignore */ }
    finally { setDeleting(false); setConfirmDelete(null) }
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
            <h1 className="page-title">🏷️ Categories</h1>
            <p className="page-subtitle">{cats.length} categories</p>
          </div>
          <Button onClick={openAdd}>+ Add Category</Button>
        </div>

        {loading ? <Spinner center /> : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cats.map(c => (
                  <tr key={c.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{c.id}</td>
                    <td><span style={{ fontWeight: 700 }}>{c.name}</span></td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '300px' }}>
                      <span style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                        {c.description || '—'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'center' }}>
                        <button className="btn btn-secondary btn-icon btn-sm" onClick={() => openEdit(c)}>✏️</button>
                        <button className="btn btn-danger btn-icon btn-sm" onClick={() => setConfirmDelete(c)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {cats.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No categories yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editing ? 'Edit Category' : 'Add Category'}
          footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={saving} onClick={handleSave}>{editing ? 'Save' : 'Add'}</Button></>}
        >
          <form onSubmit={handleSave}>
            <Input label="Name" value={form.name} onChange={setF('name')} required placeholder="Fiction" />
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input form-textarea" value={form.description} onChange={setF('description')} placeholder="Category description..." style={{ minHeight: '80px' }} />
            </div>
            <Input label="Image URL (optional)" value={form.imageUrl || ''} onChange={setF('imageUrl')} placeholder="https://..." />
          </form>
        </Modal>

        <Modal
          isOpen={!!confirmDelete}
          onClose={() => setConfirmDelete(null)}
          title="Delete Category"
          footer={<><Button variant="secondary" onClick={() => setConfirmDelete(null)}>Cancel</Button><Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button></>}
        >
          <p>Delete category <strong>"{confirmDelete?.name}"</strong>? Books in this category will be unassigned.</p>
        </Modal>
      </main>
    </div>
  )
}
