import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getBrands, adminCreateBrand, adminUpdateBrand, adminDeleteBrand } from '../../api/brands'
import type { Brand, BrandFormData } from '../../types'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Spinner from '../../components/common/Spinner'

const EMPTY: BrandFormData = { name: '', description: '', logoUrl: '' }

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Brand | null>(null)
  const [form, setForm] = useState<BrandFormData>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<Brand | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    getBrands().then(setBrands).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModalOpen(true) }
  const openEdit = (b: Brand) => { setEditing(b); setForm({ name: b.name, description: b.description || '', logoUrl: b.logoUrl || '' }); setModalOpen(true) }
  const setF = (field: keyof BrandFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [field]: e.target.value }))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editing) await adminUpdateBrand(editing.id, form)
      else await adminCreateBrand(form)
      setModalOpen(false); load()
    } catch { /* ignore */ }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!confirmDelete) return; setDeleting(true)
    try { await adminDeleteBrand(confirmDelete.id); load() }
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
            <h1 className="page-title">🏢 Publishers / Brands</h1>
            <p className="page-subtitle">{brands.length} publishers</p>
          </div>
          <Button onClick={openAdd}>+ Add Publisher</Button>
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
                {brands.map(b => (
                  <tr key={b.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{b.id}</td>
                    <td><span style={{ fontWeight: 700 }}>{b.name}</span></td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{b.description || '—'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'center' }}>
                        <button className="btn btn-secondary btn-icon btn-sm" onClick={() => openEdit(b)}>✏️</button>
                        <button className="btn btn-danger btn-icon btn-sm" onClick={() => setConfirmDelete(b)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {brands.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No publishers yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editing ? 'Edit Publisher' : 'Add Publisher'}
          footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={saving} onClick={handleSave}>{editing ? 'Save' : 'Add'}</Button></>}
        >
          <form onSubmit={handleSave}>
            <Input label="Publisher Name" value={form.name} onChange={setF('name')} required placeholder="Penguin Books" />
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input form-textarea" value={form.description} onChange={setF('description')} placeholder="Publisher description..." style={{ minHeight: '80px' }} />
            </div>
            <Input label="Logo URL (optional)" value={form.logoUrl || ''} onChange={setF('logoUrl')} placeholder="https://..." />
          </form>
        </Modal>

        <Modal
          isOpen={!!confirmDelete}
          onClose={() => setConfirmDelete(null)}
          title="Delete Publisher"
          footer={<><Button variant="secondary" onClick={() => setConfirmDelete(null)}>Cancel</Button><Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button></>}
        >
          <p>Delete publisher <strong>"{confirmDelete?.name}"</strong>? Books by this publisher will be unassigned.</p>
        </Modal>
      </main>
    </div>
  )
}
