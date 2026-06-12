import { useEffect, useState } from 'react';
import { productAPI, categoryAPI, supplierAPI } from '../services/api';
import Modal from '../components/Modal';
import { PageLoader, ErrorAlert, ConfirmDialog, EmptyState } from '../components/ui';
import { Plus, Pencil, Trash2, Package, Search, AlertTriangle, RefreshCw } from 'lucide-react';

const emptyForm = { name:'', description:'', price:'', stockQuantity:'', brand:'', categoryId:'', supplierId:'', status:'ACTIVE' };

function StatusBadge({ status, stock }) {
  if (stock === 0 || status === 'OUT_OF_STOCK') return <span className="badge-danger">Out of Stock</span>;
  if (status === 'DISCONTINUED') return <span className="badge-inactive">Discontinued</span>;
  return <span className="badge-active">Active</span>;
}

export default function Products() {
  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [suppliers,   setSuppliers]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [search,      setSearch]      = useState('');
  const [filterCat,   setFilterCat]   = useState('');
  const [filterStatus,setFilterStatus]= useState('');
  const [modalOpen,   setModalOpen]   = useState(false);
  const [stockModal,  setStockModal]  = useState(null);
  const [editing,     setEditing]     = useState(null);
  const [form,        setForm]        = useState(emptyForm);
  const [saving,      setSaving]      = useState(false);
  const [deleteId,    setDeleteId]    = useState(null);
  const [formError,   setFormError]   = useState('');
  const [stockQty,    setStockQty]    = useState('');
  const [stockReason, setStockReason] = useState('');

  const load = async () => {
    try { setLoading(true); setError(null);
      const [p, c, s] = await Promise.all([productAPI.getAll(), categoryAPI.getAll(), supplierAPI.getAll()]);
      setProducts(p.data); setCategories(c.data); setSuppliers(s.data);
    } catch { setError('Failed to load products.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setFormError(''); setModalOpen(true); };
  const openEdit   = (p) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description||'', price: p.price, stockQuantity: p.stockQuantity,
              brand: p.brand||'', categoryId: p.categoryId||'', supplierId: p.supplierId||'', status: p.status });
    setFormError(''); setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setFormError(''); };

  const handleSave = async () => {
    if (!form.name.trim())   { setFormError('Product name is required.'); return; }
    if (!form.price)         { setFormError('Price is required.'); return; }
    if (!form.categoryId)    { setFormError('Please select a category.'); return; }
    try {
      setSaving(true); setFormError('');
      const payload = { ...form, price: Number(form.price), stockQuantity: Number(form.stockQuantity) };
      if (editing) await productAPI.update(editing.id, payload);
      else         await productAPI.create(payload);
      closeModal(); await load();
    } catch (e) { setFormError(e.response?.data?.message || 'An error occurred.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await productAPI.delete(deleteId); setDeleteId(null); await load(); }
    catch { alert('Failed to delete product.'); }
  };

  const handleStockUpdate = async () => {
    if (stockQty === '') return;
    try {
      await productAPI.updateStock(stockModal.id, { stockQuantity: Number(stockQty), reason: stockReason });
      setStockModal(null); setStockQty(''); setStockReason(''); await load();
    } catch (e) { alert(e.response?.data?.message || 'Failed to update stock.'); }
  };

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase());
    const matchCat    = !filterCat || p.categoryId === filterCat;
    const matchStatus = !filterStatus || p.status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

  if (loading) return <PageLoader />;
  if (error)   return <ErrorAlert message={error} onRetry={load} />;

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">{products.length} products · {products.filter(p=>p.stockQuantity===0).length} out of stock</p>
        </div>
        <button className="btn-primary" onClick={openCreate}><Plus size={16}/> Add Product</button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
          <input className="input pl-9 w-60" placeholder="Search products…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <select className="input w-48" value={filterCat} onChange={e=>setFilterCat(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="input w-48" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {['ACTIVE','OUT_OF_STOCK','DISCONTINUED'].map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <button className="btn-secondary" onClick={load}><RefreshCw size={15}/></button>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6}><EmptyState icon={Package} title="No products found"/></td></tr>
              ) : filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <p className="font-semibold text-white">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.brand || ''}</p>
                  </td>
                  <td className="text-slate-400">{p.categoryName || '—'}</td>
                  <td className="font-medium text-emerald-400">{fmt(p.price)}</td>
                  <td>
                    <span className={`font-bold ${p.stockQuantity === 0 ? 'text-red-400' : p.stockQuantity < 10 ? 'text-amber-400' : 'text-slate-200'}`}>
                      {p.stockQuantity}
                    </span>
                    {p.stockQuantity < 10 && p.stockQuantity > 0 && <AlertTriangle size={12} className="inline ml-1 text-amber-400"/>}
                  </td>
                  <td><StatusBadge status={p.status} stock={p.stockQuantity}/></td>
                  <td>
                    <div className="flex gap-2 flex-wrap">
                      <button className="btn-success" onClick={()=>openEdit(p)}><Pencil size={13}/> Edit</button>
                      <button className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-600/30 font-medium px-3 py-1.5 rounded-lg transition-all text-sm flex items-center gap-1.5"
                        onClick={()=>{setStockModal(p);setStockQty(p.stockQuantity);setStockReason('');}}>
                        <RefreshCw size={13}/> Stock
                      </button>
                      <button className="btn-danger" onClick={()=>setDeleteId(p.id)}><Trash2 size={13}/> Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? 'Edit Product' : 'New Product'}
        footer={<><button className="btn-secondary" onClick={closeModal}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving?'Saving…':editing?'Update':'Create'}</button></>}
      >
        {formError && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{formError}</p>}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="label">Product Name *</label>
            <input className="input" placeholder="e.g. Samsung Galaxy S24" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
          </div>
          <div>
            <label className="label">Price (₹) *</label>
            <input type="number" className="input" placeholder="0.00" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/>
          </div>
          <div>
            <label className="label">Stock Quantity *</label>
            <input type="number" className="input" placeholder="0" value={form.stockQuantity} onChange={e=>setForm({...form,stockQuantity:e.target.value})}/>
          </div>
          <div>
            <label className="label">Brand</label>
            <input className="input" placeholder="e.g. Samsung" value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})}/>
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
              {['ACTIVE','OUT_OF_STOCK','DISCONTINUED'].map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Category *</label>
            <select className="input" value={form.categoryId} onChange={e=>setForm({...form,categoryId:e.target.value})}>
              <option value="">Select Category</option>
              {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Supplier</label>
            <select className="input" value={form.supplierId} onChange={e=>setForm({...form,supplierId:e.target.value})}>
              <option value="">No Supplier</option>
              {suppliers.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="label">Description</label>
            <textarea className="input h-20 resize-none" placeholder="Product description…" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
          </div>
        </div>
      </Modal>

      {/* Stock Update Modal */}
      <Modal isOpen={!!stockModal} onClose={()=>setStockModal(null)} title="Update Stock"
        footer={<><button className="btn-secondary" onClick={()=>setStockModal(null)}>Cancel</button>
          <button className="btn-primary" onClick={handleStockUpdate}>Update Stock</button></>}
      >
        <p className="text-slate-400 text-sm">Updating stock for: <span className="text-white font-medium">{stockModal?.name}</span></p>
        <div>
          <label className="label">New Stock Quantity</label>
          <input type="number" className="input" value={stockQty} onChange={e=>setStockQty(e.target.value)} min="0"/>
        </div>
        <div>
          <label className="label">Reason (optional)</label>
          <input className="input" placeholder="e.g. New shipment received" value={stockReason} onChange={e=>setStockReason(e.target.value)}/>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onCancel={()=>setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Product" message="Are you sure you want to delete this product?"/>
    </div>
  );
}
