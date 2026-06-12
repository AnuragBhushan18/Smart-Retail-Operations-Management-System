import { useEffect, useState } from 'react';
import { categoryAPI } from '../services/api';
import Modal from '../components/Modal';
import { PageLoader, ErrorAlert, ConfirmDialog, EmptyState, FormError, SearchInput, SectionHeader } from '../components/ui';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';

const empty = { name: '', description: '' };

export default function Categories() {
  const [categories, setCategories] = useState([]);
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
      const res = await categoryAPI.getAll();
      setCategories(res.data);
    } catch { setError('Failed to load categories.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setFormError(''); setModalOpen(true); };
  const openEdit   = (c) => { setEditing(c); setForm({ name: c.name, description: c.description || '' }); setFormError(''); setModalOpen(true); };
  const closeModal = ()  => { setModalOpen(false); setFormError(''); };

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

      <SectionHeader
        title="Categories"
        subtitle={`${categories.length} categories total`}
        action={
          <button className="btn-primary" onClick={openCreate}>
            <Plus size={15} /> New Category
          </button>
        }
      />

      {/* ── Toolbar ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search categories…"
          className="w-64"
        />
        <p className="text-sm text-slate-500">
          {filtered.length} of {categories.length} shown
        </p>
      </div>

      {/* ── Table ─────────────────────────────────────────────── */}
      <div className="card">
        <div className="table-wrapper border-0 rounded-none rounded-2xl">
          <table className="table">
            <thead>
              <tr>
                <th className="w-10">#</th>
                <th>Category Name</th>
                <th>Description</th>
                <th>Created</th>
                <th className="text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-0 border-0">
                    <EmptyState
                      icon={Tag}
                      title="No categories found"
                      description={search ? 'Try a different search term' : 'Create your first category to get started'}
                      action={!search && <button className="btn-primary btn-sm mt-2" onClick={openCreate}><Plus size={13}/>Add Category</button>}
                    />
                  </td>
                </tr>
              ) : filtered.map((c, i) => (
                <tr key={c.id}>
                  <td className="text-slate-400 text-xs font-medium w-10">{i + 1}</td>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                        <Tag size={13} className="text-purple-500" />
                      </div>
                      <span className="font-semibold text-slate-800">{c.name}</span>
                    </div>
                  </td>
                  <td className="text-slate-500 max-w-xs">
                    <p className="truncate">{c.description || <span className="text-slate-300">—</span>}</p>
                  </td>
                  <td className="text-slate-400 text-xs">
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—'}
                  </td>
                  <td>
                    <div className="flex gap-2 justify-end pr-1">
                      <button className="btn-success btn-sm" onClick={() => openEdit(c)}>
                        <Pencil size={12} /> Edit
                      </button>
                      <button className="btn-danger btn-sm" onClick={() => setDeleteId(c.id)}>
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Create/Edit Modal ──────────────────────────────────── */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editing ? 'Edit Category' : 'New Category'}
        footer={
          <>
            <button className="btn-secondary" onClick={closeModal}>Cancel</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>{editing ? 'Updating…' : 'Creating…'}</> : (editing ? 'Update Category' : 'Create Category')}
            </button>
          </>
        }
      >
        <FormError message={formError} />
        <div className="form-group">
          <label className="label">Category Name <span className="text-red-500">*</span></label>
          <input
            className="input"
            placeholder="e.g. Electronics, Groceries…"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            autoFocus
          />
        </div>
        <div className="form-group">
          <label className="label">Description <span className="text-slate-400 font-normal">(optional)</span></label>
          <textarea
            className="input h-24 resize-none"
            placeholder="Brief description of what this category contains…"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </div>
      </Modal>

      {/* ── Delete Confirm ─────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmLabel="Delete Category"
      />
    </div>
  );
}
