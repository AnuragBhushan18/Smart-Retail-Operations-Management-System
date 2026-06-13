import { useEffect, useState } from 'react';
import { productAPI, categoryAPI, supplierAPI } from '../services/api';
import Modal from '../components/Modal';
import { ErrorAlert, ConfirmDialog, EmptyState, FormError, SearchInput, SectionHeader } from '../components/ui';
import { Plus, Pencil, Trash2, Package, AlertTriangle, RefreshCw } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import TableSkeleton from '../components/TableSkeleton';

const emptyForm = { name:'', description:'', price:'', stockQuantity:'', brand:'', categoryId:'', supplierId:'', status:'ACTIVE' };

function StatusBadge({ status, stock }) {
  if (stock === 0 || status === 'OUT_OF_STOCK') return <span className="badge-danger">Out of Stock</span>;
  if (status === 'DISCONTINUED') return <span className="badge-inactive">Discontinued</span>;
  return <span className="badge-active">Active</span>;
}

export default function Products() {
  const [products,     setProducts]     = useState([]);
  const [categories,   setCategories]   = useState([]);
  const [suppliers,    setSuppliers]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [search,       setSearch]       = useState('');
  const [filterCat,    setFilterCat]    = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modalOpen,    setModalOpen]    = useState(false);
  const [stockModal,   setStockModal]   = useState(null);
  const [editing,      setEditing]      = useState(null);
  const [form,         setForm]         = useState(emptyForm);
  const [saving,       setSaving]       = useState(false);
  const [deleteId,     setDeleteId]     = useState(null);
  const [formError,    setFormError]    = useState('');
  const [stockQty,     setStockQty]     = useState('');
  const [stockReason,  setStockReason]  = useState('');
  
  const { addToast } = useToast();

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const [p, c, s] = await Promise.all([productAPI.getAll(), categoryAPI.getAll(), supplierAPI.getAll()]);
      setProducts(p.data);
      setCategories(c.data);
      setSuppliers(s.data);
    } catch {
      setError('Failed to load products.');
      addToast('Failed to load products list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setFormError(''); setModalOpen(true); };
  const openEdit   = (p) => {
    setEditing(p);
    setForm({ name:p.name, description:p.description||'', price:p.price, stockQuantity:p.stockQuantity,
              brand:p.brand||'', categoryId:p.categoryId||'', supplierId:p.supplierId||'', status:p.status });
    setFormError(''); setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setFormError(''); };

  const handleSave = async () => {
    if (!form.name.trim())  { setFormError('Product name is required.'); return; }
    if (!form.price)        { setFormError('Price is required.'); return; }
    if (!form.categoryId)   { setFormError('Please select a category.'); return; }
    try {
      setSaving(true); setFormError('');
      const payload = { ...form, price: Number(form.price), stockQuantity: Number(form.stockQuantity) };
      if (editing) {
        await productAPI.update(editing.id, payload);
        addToast(`Product "${form.name}" updated successfully!`, 'success');
      } else {
        await productAPI.create(payload);
        addToast(`Product "${form.name}" added successfully!`, 'success');
      }
      closeModal();
      await load();
    } catch (e) {
      setFormError(e.response?.data?.message || 'An error occurred.');
      addToast('Failed to save product.', 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await productAPI.delete(deleteId);
      setDeleteId(null);
      addToast('Product deleted successfully!', 'success');
      await load();
    } catch {
      addToast('Failed to delete product.', 'error');
    }
  };

  const handleStockUpdate = async () => {
    if (stockQty === '') return;
    try {
      await productAPI.updateStock(stockModal.id, { stockQuantity: Number(stockQty), reason: stockReason });
      addToast(`Stock for "${stockModal.name}" updated to ${stockQty} units!`, 'success');
      setStockModal(null);
      setStockQty('');
      setStockReason('');
      await load();
    } catch (e) {
      addToast(e.response?.data?.message || 'Failed to update stock.', 'error');
    }
  };

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase());
    const matchCat    = !filterCat    || p.categoryId === filterCat;
    const matchStatus = !filterStatus || p.status     === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

  const outOfStock  = products.filter(p => p.stockQuantity === 0).length;
  const lowStock    = products.filter(p => p.stockQuantity > 0 && p.stockQuantity < 10).length;

  if (error) return <ErrorAlert message={error} onRetry={load} />;

  return (
    <div className="space-y-5 animate-fade-in-up">

      <SectionHeader
        title="Products"
        subtitle={`${products.length} products · ${outOfStock} out of stock · ${lowStock} low stock`}
        action={<button className="btn-primary" onClick={openCreate}><Plus size={15}/> Add Product</button>}
      />

      {/* ── Toolbar ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name or brand…" className="w-64" />
        <select className="input w-48" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="input w-44" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
          <option value="DISCONTINUED">Discontinued</option>
        </select>
        <button className="btn-secondary btn-sm" onClick={load}><RefreshCw size={13}/> Refresh</button>
        <p className="text-sm text-slate-500 ml-auto">{filtered.length} of {products.length} shown</p>
      </div>

      {/* ── Table ───────────────────────────────────────────────── */}
      <div className="card">
        <div className="table-wrapper border-0 rounded-none rounded-2xl">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th className="text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton cols={6} rows={6} />
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-0 border-0">
                    <EmptyState icon={Package} title="No products found"
                      description="Try adjusting your search or filter criteria"
                      action={<button className="btn-primary btn-sm mt-2" onClick={openCreate}><Plus size={13}/>Add Product</button>} />
                  </td>
                </tr>
              ) : filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Package size={15} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{p.name}</p>
                        {p.brand && <p className="text-xs text-slate-400">{p.brand}</p>}
                      </div>
                    </div>
                  </td>
                  <td>
                    {p.categoryName
                      ? <span className="badge-info">{p.categoryName}</span>
                      : <span className="text-slate-300 text-xs">—</span>}
                  </td>
                  <td className="font-semibold text-emerald-600 tabular-nums">{fmt(p.price)}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <span className={`font-bold text-sm tabular-nums ${p.stockQuantity === 0 ? 'text-red-600' : p.stockQuantity < 10 ? 'text-amber-600' : 'text-slate-700'}`}>
                        {p.stockQuantity}
                      </span>
                      {p.stockQuantity > 0 && p.stockQuantity < 10 &&
                        <AlertTriangle size={12} className="text-amber-500" title="Low stock" />}
                    </div>
                  </td>
                  <td><StatusBadge status={p.status} stock={p.stockQuantity} /></td>
                  <td>
                    <div className="flex gap-2 justify-end pr-1 flex-wrap">
                      <button className="btn-success btn-sm" onClick={() => openEdit(p)}><Pencil size={12}/> Edit</button>
                      <button
                        onClick={() => { setStockModal(p); setStockQty(p.stockQuantity); setStockReason(''); }}
                        className="btn btn-sm bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                      >
                        <RefreshCw size={12}/> Stock
                      </button>
                      <button className="btn-danger btn-sm" onClick={() => setDeleteId(p.id)}><Trash2 size={12}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Create/Edit Modal ──────────────────────────────────── */}
      <Modal isOpen={modalOpen} onClose={closeModal} size="lg"
        title={editing ? `Edit: ${editing.name}` : 'Add New Product'}
        footer={
          <>
            <button className="btn-secondary" onClick={closeModal}>Cancel</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Update Product' : 'Add Product'}
            </button>
          </>
        }
      >
        <FormError message={formError} />
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          <div className="col-span-2 form-group">
            <label className="label">Product Name <span className="text-red-500">*</span></label>
            <input className="input" placeholder="e.g. Samsung Galaxy S24 Ultra" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} autoFocus />
          </div>
          <div className="form-group">
            <label className="label">Selling Price (₹) <span className="text-red-500">*</span></label>
            <input type="number" className="input" placeholder="0.00" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Stock Quantity <span className="text-red-500">*</span></label>
            <input type="number" className="input" placeholder="0" min="0" value={form.stockQuantity} onChange={e => setForm({ ...form, stockQuantity: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Brand</label>
            <input className="input" placeholder="e.g. Samsung, Apple, Nike" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="ACTIVE">Active</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
              <option value="DISCONTINUED">Discontinued</option>
            </select>
          </div>
          <div className="form-group">
            <label className="label">Category <span className="text-red-500">*</span></label>
            <select className="input" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">— Select Category —</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Supplier <span className="text-slate-400 font-normal">(optional)</span></label>
            <select className="input" value={form.supplierId} onChange={e => setForm({ ...form, supplierId: e.target.value })}>
              <option value="">— No Supplier —</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="col-span-2 form-group">
            <label className="label">Description <span className="text-slate-400 font-normal">(optional)</span></label>
            <textarea className="input h-20 resize-none" placeholder="Product features, specifications…" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
        </div>
      </Modal>

      {/* ── Stock Update Modal ─────────────────────────────────── */}
      <Modal isOpen={!!stockModal} onClose={() => setStockModal(null)}
        title="Update Stock Quantity"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setStockModal(null)}>Cancel</button>
            <button className="btn-primary" onClick={handleStockUpdate}>Update Stock</button>
          </>
        }
      >
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-2">
          <p className="text-sm text-blue-700">
            Updating stock for: <span className="font-semibold">{stockModal?.name}</span>
          </p>
          <p className="text-xs text-blue-500 mt-0.5">Current stock: <strong>{stockModal?.stockQuantity}</strong> units</p>
        </div>
        <div className="form-group">
          <label className="label">New Stock Quantity</label>
          <input type="number" className="input" value={stockQty} onChange={e => setStockQty(e.target.value)} min="0" placeholder="Enter new quantity" autoFocus />
        </div>
        <div className="form-group">
          <label className="label">Reason <span className="text-slate-400 font-normal">(optional)</span></label>
          <input className="input" placeholder="e.g. New shipment received from supplier" value={stockReason} onChange={e => setStockReason(e.target.value)} />
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onCancel={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Product" message="This will permanently remove the product from inventory. This action cannot be undone."
        confirmLabel="Delete Product" />
    </div>
  );
}
