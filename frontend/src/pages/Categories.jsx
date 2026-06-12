import { useEffect, useState } from 'react';
import { categoryAPI } from '../services/api';
import Modal from '../components/Modal';
import { PageLoader, ErrorAlert, ConfirmDialog, EmptyState } from '../components/ui';
import { Plus, Pencil, Trash2, Tag, Search } from 'lucide-react';

const empty = { name: '', description: '' };

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState('');
  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(empty);
  const [saving, setSaving]         = useState(false);
  const [deleteId, setDeleteId]     = useState(null);
  const [formError, setFormError]   = useState('');

  const load = async () => {
    try { setLoading(true); setError(null);
      const res = await categoryAPI.getAll();
      setCategories(res.data);
    } catch { setError('Failed to load categories.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setFormError(''); setModalOpen(true); };
  const openEdit   = (c)  => { setEditing(c); setForm({ name: c.name, description: c.description || '' }); setFormError(''); setModalOpen(true); };
  const closeModal = ()   => { setModalOpen(false); setFormError(''); };

  const handleSave = async () => {
    if (!form.name.trim()) { setFormError('Category name is required.'); return; }
    try {
      setSaving(true); setFormError('');
      if (editing) await categoryAPI.update(editing.id, form);
      else         await categoryAPI.create(form);
      closeModal(); await load();
    } catch (e) {
      setFormError(e.response?.data?.message || 'An error occurred. Please try again.');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await categoryAPI.delete(deleteId); setDeleteId(null); await load(); }
    catch { alert('Failed to delete category.'); }
  };

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <PageLoader />;
  if (error)   return <ErrorAlert message={error} onRetry={load} />;

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">{categories.length} categories total</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input className="input pl-9 max-w-xs" placeholder="Search categories…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>#</th><th>Name</th><th>Description</th><th>Created</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5}>
                  <EmptyState icon={Tag} title="No categories found" />
                </td></tr>
              ) : filtered.map((c, i) => (
                <tr key={c.id}>
                  <td className="text-slate-500 w-10">{i + 1}</td>
                  <td className="font-semibold text-white">{c.name}</td>
                  <td className="text-slate-400 max-w-xs truncate">{c.description || '—'}</td>
                  <td className="text-slate-500 text-xs">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-success" onClick={() => openEdit(c)}>
                        <Pencil size={13} /> Edit
                      </button>
                      <button className="btn-danger" onClick={() => setDeleteId(c.id)}>
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal}
        title={editing ? 'Edit Category' : 'New Category'}
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
        <div>
          <label className="label">Category Name *</label>
          <input className="input" placeholder="e.g. Electronics"
            value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input h-24 resize-none" placeholder="Short description…"
            value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog isOpen={!!deleteId} onCancel={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Category" message="Are you sure? This cannot be undone." />
    </div>
  );
}
