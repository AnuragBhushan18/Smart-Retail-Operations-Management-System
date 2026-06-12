import { useEffect, useState } from 'react';
import { supplierAPI } from '../services/api';
import Modal from '../components/Modal';
import { PageLoader, ErrorAlert, ConfirmDialog, EmptyState } from '../components/ui';
import { Plus, Pencil, Trash2, Truck, Search, Mail, Phone } from 'lucide-react';

const empty = { name: '', contactNumber: '', email: '', address: '' };

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [search, setSearch]       = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(empty);
  const [saving, setSaving]       = useState(false);
  const [deleteId, setDeleteId]   = useState(null);
  const [formError, setFormError] = useState('');

  const load = async () => {
    try { setLoading(true); setError(null);
      const res = await supplierAPI.getAll();
      setSuppliers(res.data);
    } catch { setError('Failed to load suppliers.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setFormError(''); setModalOpen(true); };
  const openEdit   = (s) => { setEditing(s); setForm({ name: s.name, contactNumber: s.contactNumber || '', email: s.email || '', address: s.address || '' }); setFormError(''); setModalOpen(true); };
  const closeModal = ()  => { setModalOpen(false); setFormError(''); };

  const handleSave = async () => {
    if (!form.name.trim()) { setFormError('Supplier name is required.'); return; }
    if (!form.email.trim()) { setFormError('Email is required.'); return; }
    try {
      setSaving(true); setFormError('');
      if (editing) await supplierAPI.update(editing.id, form);
      else         await supplierAPI.create(form);
      closeModal(); await load();
    } catch (e) {
      setFormError(e.response?.data?.message || 'An error occurred.');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await supplierAPI.delete(deleteId); setDeleteId(null); await load(); }
    catch { alert('Failed to delete supplier.'); }
  };

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <PageLoader />;
  if (error)   return <ErrorAlert message={error} onRetry={load} />;

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Suppliers</h1>
          <p className="page-subtitle">{suppliers.length} suppliers registered</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus size={16} /> Add Supplier
        </button>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input className="input pl-9 max-w-xs" placeholder="Search suppliers…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>#</th><th>Name</th><th>Contact</th><th>Email</th><th>Address</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6}><EmptyState icon={Truck} title="No suppliers found" /></td></tr>
              ) : filtered.map((s, i) => (
                <tr key={s.id}>
                  <td className="text-slate-500 w-10">{i + 1}</td>
                  <td className="font-semibold text-white">{s.name}</td>
                  <td>
                    {s.contactNumber
                      ? <span className="flex items-center gap-1 text-slate-300"><Phone size={12}/>{s.contactNumber}</span>
                      : '—'}
                  </td>
                  <td>
                    {s.email
                      ? <span className="flex items-center gap-1 text-indigo-400"><Mail size={12}/>{s.email}</span>
                      : '—'}
                  </td>
                  <td className="text-slate-400 max-w-[200px] truncate">{s.address || '—'}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-success" onClick={() => openEdit(s)}><Pencil size={13}/> Edit</button>
                      <button className="btn-danger"  onClick={() => setDeleteId(s.id)}><Trash2 size={13}/> Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal}
        title={editing ? 'Edit Supplier' : 'New Supplier'}
        footer={
          <>
            <button className="btn-secondary" onClick={closeModal}>Cancel</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : (editing ? 'Update' : 'Create')}
            </button>
          </>
        }
      >
        {formError && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{formError}</p>}
        {[
          { key: 'name',          label: 'Supplier Name *',   placeholder: 'e.g. TechCorp Distributors' },
          { key: 'email',         label: 'Email *',            placeholder: 'contact@supplier.com' },
          { key: 'contactNumber', label: 'Contact Number',     placeholder: '9876543210' },
          { key: 'address',       label: 'Address',            placeholder: 'Street, City, State' },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="label">{label}</label>
            <input className="input" placeholder={placeholder}
              value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})} />
          </div>
        ))}
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onCancel={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Supplier" message="Are you sure you want to remove this supplier?" />
    </div>
  );
}
