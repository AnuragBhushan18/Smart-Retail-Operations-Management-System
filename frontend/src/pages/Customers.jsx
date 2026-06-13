import { useEffect, useState } from 'react';
import { customerAPI } from '../services/api';
import Modal from '../components/Modal';
import { ErrorAlert, ConfirmDialog, EmptyState, FormError, SearchInput, SectionHeader } from '../components/ui';
import { Plus, Pencil, Trash2, Users, Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import TableSkeleton from '../components/TableSkeleton';

const emptyAddr = { street: '', city: '', state: '', pincode: '', country: 'India' };
const emptyForm = { name: '', phone: '', email: '', address: emptyAddr };

export default function Customers() {
  const [customers,  setCustomers]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [search,     setSearch]     = useState('');
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(emptyForm);
  const [saving,     setSaving]     = useState(false);
  const [deleteId,   setDeleteId]   = useState(null);
  const [formError,  setFormError]  = useState('');
  
  const { addToast } = useToast();

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await customerAPI.getAll();
      setCustomers(res.data);
    } catch {
      setError('Failed to load customers.');
      addToast('Failed to load customers list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setFormError(''); setModalOpen(true); };
  const openEdit   = (c) => {
    setEditing(c);
    setForm({ name: c.name, phone: c.phone || '', email: c.email || '',
      address: c.address
        ? { street: c.address.street || '', city: c.address.city || '', state: c.address.state || '', pincode: c.address.pincode || '', country: c.address.country || 'India' }
        : emptyAddr });
    setFormError(''); setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setFormError(''); };

  const setAddr = (key, val) => setForm(f => ({ ...f, address: { ...f.address, [key]: val } }));

  const handleSave = async () => {
    if (!form.name.trim())  { setFormError('Customer name is required.'); return; }
    if (!form.email.trim()) { setFormError('Email address is required.'); return; }
    try {
      setSaving(true); setFormError('');
      if (editing) {
        await customerAPI.update(editing.id, form);
        addToast(`Customer "${form.name}" updated successfully!`, 'success');
      } else {
        await customerAPI.create(form);
        addToast(`Customer "${form.name}" added successfully!`, 'success');
      }
      closeModal();
      await load();
    } catch (e) {
      setFormError(e.response?.data?.message || 'An error occurred.');
      addToast('Failed to save customer details.', 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await customerAPI.delete(deleteId);
      setDeleteId(null);
      addToast('Customer record deleted successfully!', 'success');
      await load();
    } catch {
      addToast('Failed to delete customer record.', 'error');
    }
  };

  const filtered = search
    ? customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()))
    : customers;

  // Generate avatar color from name
  const getInitials = (name) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const getAvatarColor = (name) => {
    const colors = ['bg-blue-100 text-blue-700', 'bg-emerald-100 text-emerald-700', 'bg-purple-100 text-purple-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700', 'bg-teal-100 text-teal-700'];
    return colors[name.charCodeAt(0) % colors.length];
  };

  if (error) return <ErrorAlert message={error} onRetry={load} />;

  return (
    <div className="space-y-5 animate-fade-in-up">

      <SectionHeader
        title="Customers"
        subtitle={`${customers.length} customers total`}
        action={<button className="btn-primary" onClick={openCreate}><Plus size={15}/> Add Customer</button>}
      />

      <div className="flex items-center justify-between">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name or email…" className="w-72" />
        <p className="text-sm text-slate-500">{filtered.length} of {customers.length} shown</p>
      </div>

      <div className="card">
        <div className="table-wrapper border-0 rounded-none rounded-2xl">
          <table className="table">
            <thead>
              <tr>
                <th className="w-10">#</th>
                <th>Customer</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Member Since</th>
                <th className="text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton cols={6} rows={5} />
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-0 border-0">
                    <EmptyState icon={Users} title="No customers found"
                      description={search ? 'No customers match your search' : 'Add your first customer to get started'}
                      action={!search && <button className="btn-primary btn-sm mt-2" onClick={openCreate}><Plus size={13}/>Add Customer</button>} />
                  </td>
                </tr>
              ) : filtered.map((c, i) => (
                <tr key={c.id}>
                  <td className="text-slate-400 text-xs">{i + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${getAvatarColor(c.name)}`}>
                        {getInitials(c.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{c.name}</p>
                        {c.email && <p className="text-xs text-slate-400 flex items-center gap-1"><Mail size={10}/>{c.email}</p>}
                      </div>
                    </div>
                  </td>
                  <td>
                    {c.phone
                      ? <div className="flex items-center gap-1.5 text-slate-600 text-sm"><Phone size={12} className="text-slate-400"/>{c.phone}</div>
                      : <span className="text-slate-300 text-xs">—</span>}
                  </td>
                  <td>
                    {c.address
                      ? <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                          <MapPin size={12} className="text-slate-400 flex-shrink-0"/>
                          {c.address.city}{c.address.state ? `, ${c.address.state}` : ''}
                        </div>
                      : <span className="text-slate-300 text-xs">—</span>}
                  </td>
                  <td className="text-slate-400 text-xs">
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                      : '—'}
                  </td>
                  <td>
                    <div className="flex gap-2 justify-end pr-1">
                      <button className="btn-success btn-sm" onClick={() => openEdit(c)}><Pencil size={12}/> Edit</button>
                      <button className="btn-danger btn-sm" onClick={() => setDeleteId(c.id)}><Trash2 size={12}/> Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal ───────────────────────────────────────────────── */}
      <Modal isOpen={modalOpen} onClose={closeModal} size="lg"
        title={editing ? `Edit: ${editing.name}` : 'Add New Customer'}
        footer={
          <>
            <button className="btn-secondary" onClick={closeModal}>Cancel</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Update Customer' : 'Add Customer'}
            </button>
          </>
        }
      >
        <FormError message={formError} />

        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          <div className="col-span-2 form-group">
            <label className="label">Full Name <span className="text-red-500">*</span></label>
            <input className="input" placeholder="e.g. Arjun Mehta" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} autoFocus />
          </div>
          <div className="form-group">
            <label className="label">Email Address <span className="text-red-500">*</span></label>
            <input className="input" type="email" placeholder="user@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Phone Number</label>
            <input className="input" type="tel" placeholder="9876543210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
        </div>

        <div className="form-section-title">Delivery Address</div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          <div className="col-span-2 form-group">
            <label className="label">Street Address</label>
            <input className="input" placeholder="House No., Building, Street" value={form.address.street} onChange={e => setAddr('street', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label">City</label>
            <input className="input" placeholder="e.g. Mumbai" value={form.address.city} onChange={e => setAddr('city', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label">State</label>
            <input className="input" placeholder="e.g. Maharashtra" value={form.address.state} onChange={e => setAddr('state', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label">Pincode</label>
            <input className="input" placeholder="400001" value={form.address.pincode} onChange={e => setAddr('pincode', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label">Country</label>
            <input className="input" placeholder="India" value={form.address.country} onChange={e => setAddr('country', e.target.value)} />
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onCancel={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Customer" message="This will permanently remove the customer and all their data. This action cannot be undone."
        confirmLabel="Delete Customer" />
    </div>
  );
}
