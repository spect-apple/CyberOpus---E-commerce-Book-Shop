import React, { useState, useEffect } from 'react'
import { getAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } from '../api/addresses'
import type { Address, AddressFormData } from '../types'
import Modal from '../components/common/Modal'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'

const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Australia', 'India', 'Germany', 'France']

const EMPTY_FORM: AddressFormData = {
  fullName: '', phoneNumber: '', line1: '', line2: '',
  city: '', state: '', postalCode: '', country: 'United States',
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<AddressFormData>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    getAddresses().then(setAddresses).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (addr: Address) => {
    setEditingId(addr.id)
    setForm({
      fullName: addr.fullName,
      phoneNumber: addr.phoneNumber,
      line1: addr.line1,
      line2: addr.line2 || '',
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
    })
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        await updateAddress(editingId, form)
      } else {
        await createAddress(form)
      }
      setModalOpen(false)
      load()
    } catch { /* ignore */ }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try { await deleteAddress(id); load() }
    catch { /* ignore */ }
    finally { setDeletingId(null); setConfirmDelete(null) }
  }

  const handleSetDefault = async (id: number) => {
    await setDefaultAddress(id)
    load()
  }

  const setF = (field: keyof AddressFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  if (loading) return <Spinner center size="lg" />

  return (
    <div className="page fade-in">
      <div className="container-md">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">📍 My Addresses</h1>
            <p className="page-subtitle">Manage your delivery addresses</p>
          </div>
          <Button onClick={openAdd}>+ Add Address</Button>
        </div>

        {addresses.length === 0 ? (
          <EmptyState
            icon="📍"
            title="No addresses yet"
            text="Add a delivery address to get started."
            action={<Button onClick={openAdd}>Add Your First Address</Button>}
          />
        ) : (
          <div className="addresses-grid">
            {addresses.map(addr => (
              <div key={addr.id} className={`address-card card${addr.isDefault ? ' default' : ''}`}>
                {addr.isDefault && (
                  <div className="default-badge">
                    <span className="badge badge-primary">⭐ Default</span>
                  </div>
                )}
                <div className="address-name">{addr.fullName}</div>
                <div className="address-line">{addr.line1}</div>
                {addr.line2 && <div className="address-line">{addr.line2}</div>}
                <div className="address-line">{addr.city}, {addr.state} {addr.postalCode}</div>
                <div className="address-line">{addr.country}</div>
                <div className="address-phone">📞 {addr.phoneNumber}</div>
                <div className="address-actions">
                  {!addr.isDefault && (
                    <button className="btn btn-outline btn-sm" onClick={() => handleSetDefault(addr.id)}>
                      Set Default
                    </button>
                  )}
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(addr)}>
                    ✏️ Edit
                  </button>
                  {!addr.isDefault && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setConfirmDelete(addr.id)}
                      disabled={deletingId === addr.id}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingId ? 'Edit Address' : 'Add New Address'}
          footer={
            <>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button loading={saving} onClick={handleSave}>
                {editingId ? 'Save Changes' : 'Add Address'}
              </Button>
            </>
          }
        >
          <form onSubmit={handleSave}>
            <div className="form-row">
              <Input label="Full Name" value={form.fullName} onChange={setF('fullName')} required placeholder="John Doe" />
              <Input label="Phone Number" value={form.phoneNumber} onChange={setF('phoneNumber')} required placeholder="+1 555 000 0000" />
            </div>
            <Input label="Address Line 1" value={form.line1} onChange={setF('line1')} required placeholder="123 Main St" />
            <Input label="Address Line 2" value={form.line2} onChange={setF('line2')} placeholder="Apt, Suite, etc. (optional)" />
            <div className="form-row">
              <Input label="City" value={form.city} onChange={setF('city')} required placeholder="New York" />
              <Input label="State / Province" value={form.state} onChange={setF('state')} required placeholder="NY" />
            </div>
            <div className="form-row">
              <Input label="Postal Code" value={form.postalCode} onChange={setF('postalCode')} required placeholder="10001" />
              <div className="form-group">
                <label className="form-label required">Country</label>
                <select className="form-input form-select" value={form.country} onChange={setF('country')}>
                  {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </form>
        </Modal>

        {/* Confirm Delete Modal */}
        <Modal
          isOpen={confirmDelete !== null}
          onClose={() => setConfirmDelete(null)}
          title="Delete Address"
          footer={
            <>
              <Button variant="secondary" onClick={() => setConfirmDelete(null)}>Cancel</Button>
              <Button variant="danger" loading={deletingId !== null} onClick={() => confirmDelete !== null && handleDelete(confirmDelete)}>
                Delete
              </Button>
            </>
          }
        >
          <p>Are you sure you want to delete this address? This action cannot be undone.</p>
        </Modal>
      </div>

      <style>{`
        .addresses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.25rem;
        }
        .address-card {
          padding: 1.25rem;
          position: relative;
          transition: box-shadow 0.2s;
        }
        .address-card.default {
          border: 2px solid var(--primary);
        }
        .default-badge { margin-bottom: 0.75rem; }
        .address-name { font-weight: 700; font-size: 1rem; margin-bottom: 0.5rem; }
        .address-line { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6; }
        .address-phone { font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.5rem; }
        .address-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  )
}
