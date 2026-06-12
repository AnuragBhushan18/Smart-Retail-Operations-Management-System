import { useEffect, useState } from 'react';
import { customerAPI } from '../services/api';
import Modal from '../components/Modal';
import { PageLoader, ErrorAlert, ConfirmDialog, EmptyState } from '../components/ui';
import { Plus, Pencil, Trash2, Users, Search, MapPin, Mail, Phone } from 'lucide-react';

const emptyAddr = { street:'', city:'', state:'', pincode:'', country:'India' };
const emptyForm = { name:'', phone:'', email:'', address: emptyAddr };

export default function Customers() {
  const [customers, setCustomers]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState('');
  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(emptyForm);
  const [saving, setSaving]         = useState(false);
  const [deleteId, setDeleteId]     = useState(null);
  const [formError, setFormError]   = useState('');

  const load = async () => {
    try { setLoading(true); setError(null);
      const res = await customerAPI.getAll();
      setCustomers(res.data);
    } catch { setError('Failed to load customers.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setFormError(''); setModalOpen(true); };
  const openEdit   = (c) => {
    setEditing(c);
    setForm({ name:c.name, phone:c.phone||'', email:c.email||'',
      address: c.address ? { street:c.address.street||'', city:c.address.city||'', state:c.address.state||'', pincode:c.address.pincode||'', country:c.address.country||'India' } : emptyAddr });
    setFormError(''); setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setFormError(''); };

  const setAddr = (key, val) => setForm(f => ({ ...f, address: { ...f.address, [key]: val } }));

  const handleSave = async () => {
    if (!form.name.trim())  { setFormError('Customer name is required.'); return; }
    if (!form.email.trim()) { setFormError('Email is required.'); return; }
    try {
      setSaving(true); setFormError('');
      if (editing) await customerAPI.update(editing.id, form);
      else         await customerAPI.create(form);
      closeModal(); await load();
    } catch (e) { setFormError(e.response?.data?.message || 'An error occurred.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await customerAPI.delete(deleteId); setDeleteId(null); await load(); }
    catch { alert('Failed to delete customer.'); }
  };

  const filtered = search
    ? customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()))
    : customers;

  if (loading) return <PageLoader />;
  if (error)   return <ErrorAlert message={error} onRetry={load} />;

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="page-subtitle">{customers.length} customers registered</p>
        </div>
        <button className="btn-primary" onClick={openCreate}><Plus size={16}/> Add Customer</button>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
        <input className="input pl-9 max-w-xs" placeholder="Search customers…"
          value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>#</th><th>Name</th><th>Contact</th><th>Address</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6}><EmptyState icon={Users} title="No customers found"/></td></tr>
              ) : filtered.map((c, i) => (
                <tr key={c.id}>
                  <td className="text-slate-500 w-10">{i+1}</td>
                  <td className="font-semibold text-white">{c.name}</td>
                  <td>
                    <div className="space-y-0.5">
                      {c.email && <p className="flex items-center gap-1 text-indigo-400 text-xs"><Mail size={11}/>{c.email}</p>}
                      {c.phone && <p className="flex items-center gap-1 text-slate-400 text-xs"><Phone size={11}/>{c.phone}</p>}
                    </div>
                  </td>
                  <td className="text-slate-400 text-xs">
                    {c.address
                      ? <span className="flex items-center gap-1"><MapPin size={11}/>{c.address.city}, {c.address.state}</span>
                      : '—'}
                  </td>
                  <td className="text-slate-500 text-xs">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-success" onClick={()=>openEdit(c)}><Pencil size={13}/> Edit</button>
                      <button className="btn-danger"  onClick={()=>setDeleteId(c.id)}><Trash2 size={13}/> Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? 'Edit Customer' : 'New Customer'}
        footer={<><button className="btn-secondary" onClick={closeModal}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving?'Saving…':editing?'Update':'Create'}</button></>}
      >
        {formError && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{formError}</p>}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="label">Full Name *</label>
            <input className="input" placeholder="e.g. Arjun Mehta" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
          </div>
          <div>
            <label className="label">Email *</label>
            <input className="input" type="email" placeholder="user@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" placeholder="9876543210" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
          </div>
        </div>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-2">Address</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="label">Street</label>
            <input className="input" placeholder="House No., Street" value={form.address.street} onChange={e=>setAddr('street',e.target.value)}/>
          </div>
          <div>
            <label className="label">City</label>
            <input className="input" placeholder="City" value={form.address.city} onChange={e=>setAddr('city',e.target.value)}/>
          </div>
          <div>
            <label className="label">State</label>
            <input className="input" placeholder="State" value={form.address.state} onChange={e=>setAddr('state',e.target.value)}/>
          </div>
          <div>
            <label className="label">Pincode</label>
            <input className="input" placeholder="400001" value={form.address.pincode} onChange={e=>setAddr('pincode',e.target.value)}/>
          </div>
          <div>
            <label className="label">Country</label>
            <input className="input" placeholder="India" value={form.address.country} onChange={e=>setAddr('country',e.target.value)}/>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onCancel={()=>setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Customer" message="Are you sure you want to remove this customer?"/>
    </div>
  );
}
