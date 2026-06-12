import { useEffect, useState } from 'react';
import { orderAPI, customerAPI, productAPI } from '../services/api';
import Modal from '../components/Modal';
import { PageLoader, ErrorAlert, ConfirmDialog, EmptyState } from '../components/ui';
import { Plus, Trash2, ShoppingCart, Search, ChevronDown, Package, X } from 'lucide-react';

const STATUS_COLORS = {
  PENDING:   'badge-warning',
  CONFIRMED: 'badge-info',
  SHIPPED:   'badge-purple',
  DELIVERED: 'badge-active',
  CANCELLED: 'badge-danger',
};

const NEXT_STATUSES = {
  PENDING:   ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPED',   'CANCELLED'],
  SHIPPED:   ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
};

export default function Orders() {
  const [orders,    setOrders]    = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [search,    setSearch]    = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [createOpen,setCreateOpen]= useState(false);
  const [detailOrder,setDetailOrder] = useState(null);
  const [deleteId,  setDeleteId]  = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState('');

  // Create order form state
  const [customerId, setCustomerId] = useState('');
  const [notes,      setNotes]      = useState('');
  const [items,      setItems]      = useState([{ productId:'', quantity:1 }]);

  const load = async () => {
    try { setLoading(true); setError(null);
      const [o, c, p] = await Promise.all([orderAPI.getAll(), customerAPI.getAll(), productAPI.getAll()]);
      setOrders(o.data); setCustomers(c.data); setProducts(p.data);
    } catch { setError('Failed to load orders.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const addItem    = () => setItems([...items, { productId:'', quantity:1 }]);
  const removeItem = (i) => setItems(items.filter((_,idx)=>idx!==i));
  const updateItem = (i, key, val) => setItems(items.map((it,idx)=>idx===i?{...it,[key]:val}:it));

  const handleCreate = async () => {
    if (!customerId)                          { setFormError('Please select a customer.'); return; }
    if (items.some(it=>!it.productId))        { setFormError('Please select a product for each item.'); return; }
    if (items.some(it=>Number(it.quantity)<1)){ setFormError('Quantity must be at least 1.'); return; }
    try {
      setSaving(true); setFormError('');
      await orderAPI.create({ customerId, notes, items: items.map(it=>({ productId:it.productId, quantity:Number(it.quantity) })) });
      setCreateOpen(false); setCustomerId(''); setNotes(''); setItems([{productId:'',quantity:1}]);
      await load();
    } catch (e) { setFormError(e.response?.data?.message || 'An error occurred.'); }
    finally { setSaving(false); }
  };

  const handleStatusChange = async (orderId, status) => {
    try { await orderAPI.updateStatus(orderId, status); await load(); }
    catch (e) { alert(e.response?.data?.message || 'Failed to update status.'); }
  };

  const handleDelete = async () => {
    try { await orderAPI.delete(deleteId); setDeleteId(null); await load(); }
    catch { alert('Failed to delete order.'); }
  };

  const filtered = orders.filter(o => {
    const matchSearch = !search || o.customerName?.toLowerCase().includes(search.toLowerCase()) || o.id?.includes(search);
    const matchStatus = !filterStatus || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const fmt = (n) => '₹' + Number(n||0).toLocaleString('en-IN', {maximumFractionDigits:0});

  if (loading) return <PageLoader />;
  if (error)   return <ErrorAlert message={error} onRetry={load} />;

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="page-subtitle">{orders.length} total orders</p>
        </div>
        <button className="btn-primary" onClick={()=>{setCreateOpen(true);setFormError('');}}><Plus size={16}/> New Order</button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
          <input className="input pl-9 w-60" placeholder="Search by customer…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <select className="input w-48" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {['PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED'].map(s=><option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7}><EmptyState icon={ShoppingCart} title="No orders found"/></td></tr>
              ) : filtered.map(o => (
                <tr key={o.id}>
                  <td className="font-mono text-xs text-slate-500 max-w-[100px] truncate">{o.id}</td>
                  <td className="font-semibold text-white">{o.customerName}</td>
                  <td className="text-slate-400">{o.items?.length || 0} item{o.items?.length !== 1 ? 's' : ''}</td>
                  <td className="font-medium text-emerald-400">{fmt(o.totalAmount)}</td>
                  <td className="text-slate-500 text-xs">{o.orderDate ? new Date(o.orderDate).toLocaleDateString() : '—'}</td>
                  <td><span className={STATUS_COLORS[o.status] || 'badge-inactive'}>{o.status}</span></td>
                  <td>
                    <div className="flex gap-2 flex-wrap">
                      <button className="btn-secondary text-xs px-2 py-1" onClick={()=>setDetailOrder(o)}>
                        View
                      </button>
                      {NEXT_STATUSES[o.status]?.length > 0 && (
                        <select className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1 cursor-pointer"
                          value="" onChange={e=>e.target.value && handleStatusChange(o.id, e.target.value)}>
                          <option value="">Update ▾</option>
                          {NEXT_STATUSES[o.status].map(s=><option key={s} value={s}>{s}</option>)}
                        </select>
                      )}
                      <button className="btn-danger text-xs px-2 py-1" onClick={()=>setDeleteId(o.id)}><Trash2 size={12}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      <Modal isOpen={createOpen} onClose={()=>setCreateOpen(false)} title="Create New Order"
        footer={<><button className="btn-secondary" onClick={()=>setCreateOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={handleCreate} disabled={saving}>{saving?'Placing…':'Place Order'}</button></>}
      >
        {formError && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{formError}</p>}
        <div>
          <label className="label">Customer *</label>
          <select className="input" value={customerId} onChange={e=>setCustomerId(e.target.value)}>
            <option value="">Select Customer</option>
            {customers.map(c=><option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label !mb-0">Order Items *</label>
            <button onClick={addItem} className="text-indigo-400 hover:text-indigo-300 text-xs flex items-center gap-1">
              <Plus size={12}/> Add Item
            </button>
          </div>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex gap-2 items-center">
                <select className="input flex-1" value={item.productId} onChange={e=>updateItem(i,'productId',e.target.value)}>
                  <option value="">Select Product</option>
                  {products.filter(p=>p.stockQuantity>0).map(p=>(
                    <option key={p.id} value={p.id}>{p.name} (Stock: {p.stockQuantity})</option>
                  ))}
                </select>
                <input type="number" className="input w-20" min="1" value={item.quantity}
                  onChange={e=>updateItem(i,'quantity',e.target.value)}/>
                {items.length > 1 && (
                  <button onClick={()=>removeItem(i)} className="text-slate-500 hover:text-red-400 transition-colors">
                    <X size={16}/>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Notes (optional)</label>
          <input className="input" placeholder="Delivery instructions, gift message…" value={notes} onChange={e=>setNotes(e.target.value)}/>
        </div>
      </Modal>

      {/* Order Detail Modal */}
      <Modal isOpen={!!detailOrder} onClose={()=>setDetailOrder(null)} title="Order Details"
        footer={<button className="btn-secondary" onClick={()=>setDetailOrder(null)}>Close</button>}
      >
        {detailOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-slate-500">Customer</p><p className="text-white font-medium">{detailOrder.customerName}</p></div>
              <div><p className="text-slate-500">Status</p><span className={STATUS_COLORS[detailOrder.status]}>{detailOrder.status}</span></div>
              <div><p className="text-slate-500">Order Date</p><p className="text-white">{detailOrder.orderDate ? new Date(detailOrder.orderDate).toLocaleString() : '—'}</p></div>
              <div><p className="text-slate-500">Total</p><p className="text-emerald-400 font-bold text-lg">{fmt(detailOrder.totalAmount)}</p></div>
              {detailOrder.notes && <div className="col-span-2"><p className="text-slate-500">Notes</p><p className="text-slate-300">{detailOrder.notes}</p></div>}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 mb-2">Items</p>
              <div className="space-y-2">
                {detailOrder.items?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-800 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Package size={14} className="text-slate-500"/>
                      <span className="text-white text-sm">{item.productName}</span>
                      <span className="text-slate-500 text-xs">×{item.quantity}</span>
                    </div>
                    <span className="text-emerald-400 text-sm font-medium">{fmt(item.subtotal)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onCancel={()=>setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Order" message="Delete this order? Stock will be restored for non-delivered orders."/>
    </div>
  );
}
