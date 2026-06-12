import { useEffect, useState } from 'react';
import { supplierAPI } from '../services/api';
import Modal from '../components/Modal';
import { PageLoader, ErrorAlert, ConfirmDialog, EmptyState, FormError, SearchInput, SectionHeader } from '../components/ui';
import { Plus, Pencil, Trash2, Truck, Mail, Phone, MapPin } from 'lucide-react';

const empty = { name: '', contactNumber: '', email: '', address: '' };

export default function Suppliers() {
  const [suppliers,  setSuppliers]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [search,     setSearch]     = useState('');
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(empty);
  const [saving,     setSaving]     = useState(false);
  const [deleteId,   setDeleteId]   = useState(null);
  const [formError,  setFormError]  = useState('');

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
    if (!form.name.trim())  { setFormError('Supplier name is required.'); return; }
    if (!form.email.trim()) { setFormError('Email address is required.'); return; }
    try {
      setSaving(true); setFormError('');
      if (editing) await supplierAPI.update(editing.id, form);
      else         await supplierAPI.create(form);
      closeModal(); await load();
    } catch (e) {
      setFormError(e.response?.data?.message || 'An error occurred. Please try again.');
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

  // Generate avatar initials color
  const getAvatarColor = (name) => {
    const colors = ['bg-blue-100 text-blue-700', 'bg-teal-100 text-teal-700', 'bg-purple-100 text-purple-700', 'bg-orange-100 text-orange-700', 'bg-emerald-100 text-emerald-700'];
    return colors[name.charCodeAt(0) % colors.length];
  };

  if (loading) return <PageLoader />;
  if (error)   return <ErrorAlert message={error} onRetry={load} />;

  return (
    <div className="space-y-5">

      <SectionHeader
        title="Suppliers"
        subtitle={`${suppliers.length} suppliers registered`}
        action={
          <button className="btn-primary" onClick={openCreate}>
            <Plus size={15} /> Add Supplier
          </button>
        }
      />

      <div className="flex items-center justify-between">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name or email…" className="w-72" />
        <p className="text-sm text-slate-500">{filtered.length} of {suppliers.length} shown</p>
      </div>

      <div className="card">
        <div className="table-wrapper border-0 rounded-none rounded-2xl">
          <table className="table">
            <thead>
              <tr>
                <th className="w-10">#</th>
                <th>Supplier</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Address</th>
                <th className="text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-0 border-0">
                    <EmptyState icon={Truck} title="No suppliers found"
                      description={search ? 'Try a different search term' : 'Add your first supplier to get started'}
                      action={!search && <button className="btn-primary btn-sm mt-2" onClick={openCreate}><Plus size={13}/>Add Supplier</button>} />
                  </td>
                </tr>
              ) : filtered.map((s, i) => (
                <tr key={s.id}>
                  <td className="text-slate-400 text-xs font-medium">{i + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${getAvatarColor(s.name)}`}>
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-800">{s.name}</span>
                    </div>
                  </td>
                  <td>
                    {s.contactNumber
                      ? <div className="flex items-center gap-1.5 text-slate-600 text-sm"><Phone size={12} className="text-slate-400"/>{s.contactNumber}</div>
                      : <span className="text-slate-300">—</span>}
                  </td>
                  <td>
                    {s.email
                      ? <div className="flex items-center gap-1.5 text-blue-600 text-sm"><Mail size={12}/>{s.email}</div>
                      : <span className="text-slate-300">—</span>}
                  </td>
                  <td>
                    {s.address
                      ? <div className="flex items-center gap-1.5 text-slate-500 text-sm max-w-[200px]"><MapPin size={11} className="text-slate-400 flex-shrink-0"/><span className="truncate">{s.address}</span></div>
                      : <span className="text-slate-300">—</span>}
                  </td>
                  <td>
                    <div className="flex gap-2 justify-end pr-1">
                      <button className="btn-success btn-sm" onClick={() => openEdit(s)}><Pencil size={12}/> Edit</button>
                      <button className="btn-danger btn-sm" onClick={() => setDeleteId(s.id)}><Trash2 size={12}/> Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal}
        title={editing ? 'Edit Supplier' : 'New Supplier'}
        footer={
          <>
            <button className="btn-secondary" onClick={closeModal}>Cancel</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Update Supplier' : 'Add Supplier'}
            </button>
          </>
        }
      >
        <FormError message={formError} />
        {[
          { key: 'name',          label: 'Supplier Name',  req: true,  placeholder: 'e.g. TechCorp Distributors', type: 'text' },
          { key: 'email',         label: 'Email Address',  req: true,  placeholder: 'contact@supplier.com', type: 'email' },
          { key: 'contactNumber', label: 'Phone Number',   req: false, placeholder: '9876543210', type: 'tel' },
          { key: 'address',       label: 'Address',        req: false, placeholder: 'Street, City, State, Pincode', type: 'text' },
        ].map(({ key, label, req, placeholder, type }) => (
          <div key={key} className="form-group">
            <label className="label">
              {label} {req && <span className="text-red-500">*</span>}
            </label>
            <input type={type} className="input" placeholder={placeholder}
              value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
          </div>
        ))}
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onCancel={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Remove Supplier" message="Are you sure you want to remove this supplier? This action cannot be undone."
        confirmLabel="Remove Supplier" />
    </div>
  );
}
