import { useEffect, useState } from 'react';
import { orderAPI, customerAPI, productAPI } from '../services/api';
import Modal from '../components/Modal';
import { PageLoader, ErrorAlert, ConfirmDialog, EmptyState, FormError, SearchInput, SectionHeader } from '../components/ui';
import { Plus, Trash2, ShoppingCart, Package, X, Eye, TrendingUp, Clock, Send, CheckCircle, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  PENDING:   { badge: 'badge-warning', icon: Clock,        label: 'Pending'   },
  CONFIRMED: { badge: 'badge-info',    icon: TrendingUp,   label: 'Confirmed' },
  SHIPPED:   { badge: 'badge-purple',  icon: Send,         label: 'Shipped'   },
  DELIVERED: { badge: 'badge-active',  icon: CheckCircle,  label: 'Delivered' },
  CANCELLED: { badge: 'badge-danger',  icon: XCircle,      label: 'Cancelled' },
};

const NEXT_STATUSES = {
  PENDING:   ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPED',   'CANCELLED'],
  SHIPPED:   ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
};

export default function Orders() {
  const [orders,       setOrders]      = useState([]);
  const [customers,    setCustomers]   = useState([]);
  const [products,     setProducts]    = useState([]);
  const [loading,      setLoading]     = useState(true);
  const [error,        setError]       = useState(null);
  const [search,       setSearch]      = useState('');
  const [filterStatus, setFilterStatus]= useState('');
  const [createOpen,   setCreateOpen]  = useState(false);
  const [detailOrder,  setDetailOrder] = useState(null);
  const [deleteId,     setDeleteId]    = useState(null);
  const [saving,       setSaving]      = useState(false);
  const [formError,    setFormError]   = useState('');

  const [customerId,   setCustomerId]  = useState('');
  const [notes,        setNotes]       = useState('');
  const [items,        setItems]       = useState([{ productId: '', quantity: 1 }]);

  const load = async () => {
    try { setLoading(true); setError(null);
      const [o, c, p] = await Promise.all([orderAPI.getAll(), customerAPI.getAll(), productAPI.getAll()]);
      setOrders(o.data); setCustomers(c.data); setProducts(p.data);
    } catch { setError('Failed to load orders.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const addItem    = () => setItems(prev => [...prev, { productId: '', quantity: 1 }]);
  const removeItem = (i) => setItems(prev => prev.filter((_, idx) => idx !== i));
  const updateItem = (i, key, val) => setItems(prev => prev.map((it, idx) => idx === i ? { ...it, [key]: val } : it));

  const openCreate = () => { setCustomerId(''); setNotes(''); setItems([{ productId: '', quantity: 1 }]); setFormError(''); setCreateOpen(true); };

  const handleCreate = async () => {
    if (!customerId)                          { setFormError('Please select a customer.'); return; }
    if (items.some(it => !it.productId))      { setFormError('Please select a product for each item.'); return; }
    if (items.some(it => Number(it.quantity) < 1)) { setFormError('Quantity must be at least 1.'); return; }
    try {
      setSaving(true); setFormError('');
      await orderAPI.create({ customerId, notes, items: items.map(it => ({ productId: it.productId, quantity: Number(it.quantity) })) });
      setCreateOpen(false); await load();
    } catch (e) { setFormError(e.response?.data?.message || 'Failed to create order.'); }
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

  const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  // summary counts
  const pending   = orders.filter(o => o.status === 'PENDING').length;
  const shipped   = orders.filter(o => o.status === 'SHIPPED').length;
  const delivered = orders.filter(o => o.status === 'DELIVERED').length;

  if (loading) return <PageLoader />;
  if (error)   return <ErrorAlert message={error} onRetry={load} />;

  return (
    <div className="space-y-5">

      <SectionHeader
        title="Orders"
        subtitle={`${orders.length} orders · ${pending} pending · ${shipped} shipped · ${delivered} delivered`}
        action={<button className="btn-primary" onClick={openCreate}><Plus size={15}/> New Order</button>}
      />

      {/* ── Toolbar ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by customer or order ID…" className="w-72" />
        <select className="input w-48" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <p className="text-sm text-slate-500 ml-auto">{filtered.length} of {orders.length} shown</p>
      </div>

      {/* ── Table ───────────────────────────────────────────────── */}
      <div className="card">
        <div className="table-wrapper border-0 rounded-none rounded-2xl">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-0 border-0">
                    <EmptyState icon={ShoppingCart} title="No orders found"
                      description="Try adjusting your search or place a new order"
                      action={<button className="btn-primary btn-sm mt-2" onClick={openCreate}><Plus size={13}/>New Order</button>} />
                  </td>
                </tr>
              ) : filtered.map(o => {
                const cfg = STATUS_CONFIG[o.status] || {};
                return (
                  <tr key={o.id}>
                    <td>
                      <code className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        #{o.id?.slice(-8).toUpperCase()}
                      </code>
                    </td>
                    <td>
                      <p className="font-semibold text-slate-800 text-sm">{o.customerName}</p>
                    </td>
                    <td className="text-slate-500 text-sm">
                      {o.items?.length || 0} item{o.items?.length !== 1 ? 's' : ''}
                    </td>
                    <td className="font-semibold text-emerald-600 tabular-nums">{fmt(o.totalAmount)}</td>
                    <td className="text-slate-400 text-xs">
                      {o.orderDate ? new Date(o.orderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td>
                      <span className={cfg.badge || 'badge-inactive'}>{cfg.label || o.status}</span>
                    </td>
                    <td>
                      <div className="flex gap-2 justify-end pr-1 flex-wrap">
                        <button
                          className="btn btn-sm bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                          onClick={() => setDetailOrder(o)}
                        >
                          <Eye size={12}/> View
                        </button>
                        {NEXT_STATUSES[o.status]?.length > 0 && (
                          <select
                            className="text-xs bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-2 py-1.5 cursor-pointer font-medium focus:outline-none"
                            value=""
                            onChange={e => e.target.value && handleStatusChange(o.id, e.target.value)}
                          >
                            <option value="">Advance ▾</option>
                            {NEXT_STATUSES[o.status].map(s => (
                              <option key={s} value={s}>{STATUS_CONFIG[s]?.label || s}</option>
                            ))}
                          </select>
                        )}
                        <button className="btn-danger btn-sm" onClick={() => setDeleteId(o.id)}><Trash2 size={12}/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Create Order Modal ─────────────────────────────────── */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} size="lg"
        title="Create New Order"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setCreateOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleCreate} disabled={saving}>
              {saving ? 'Placing Order…' : 'Place Order'}
            </button>
          </>
        }
      >
        <FormError message={formError} />

        <div className="form-group">
          <label className="label">Customer <span className="text-red-500">*</span></label>
          <select className="input" value={customerId} onChange={e => setCustomerId(e.target.value)}>
            <option value="">— Select Customer —</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label !mb-0">Order Items <span className="text-red-500">*</span></label>
            <button onClick={addItem} className="btn btn-sm bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200">
              <Plus size={12}/> Add Item
            </button>
          </div>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex gap-2 items-center bg-slate-50 rounded-xl p-2 border border-slate-200">
                <select
                  className="input flex-1 bg-white"
                  value={item.productId}
                  onChange={e => updateItem(i, 'productId', e.target.value)}
                >
                  <option value="">— Select Product —</option>
                  {products.filter(p => p.stockQuantity > 0).map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Stock: {p.stockQuantity})</option>
                  ))}
                </select>
                <div className="flex items-center gap-1.5">
                  <label className="text-xs text-slate-500 whitespace-nowrap">Qty:</label>
                  <input
                    type="number" min="1"
                    className="input w-20 text-center bg-white"
                    value={item.quantity}
                    onChange={e => updateItem(i, 'quantity', e.target.value)}
                  />
                </div>
                {items.length > 1 && (
                  <button onClick={() => removeItem(i)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                    <X size={14}/>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="label">Order Notes <span className="text-slate-400 font-normal">(optional)</span></label>
          <input className="input" placeholder="Delivery instructions, special requests…" value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
      </Modal>

      {/* ── Order Detail Modal ─────────────────────────────────── */}
      <Modal isOpen={!!detailOrder} onClose={() => setDetailOrder(null)}
        title="Order Details"
        footer={<button className="btn-secondary" onClick={() => setDetailOrder(null)}>Close</button>}
      >
        {detailOrder && (
          <div className="space-y-4">
            {/* Order meta */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Order ID',   value: <code className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded">#{detailOrder.id?.slice(-8).toUpperCase()}</code> },
                { label: 'Status',     value: <span className={(STATUS_CONFIG[detailOrder.status]?.badge) || 'badge-inactive'}>{STATUS_CONFIG[detailOrder.status]?.label || detailOrder.status}</span> },
                { label: 'Customer',   value: <span className="font-semibold text-slate-800">{detailOrder.customerName}</span> },
                { label: 'Order Date', value: detailOrder.orderDate ? new Date(detailOrder.orderDate).toLocaleString('en-IN') : '—' },
                { label: 'Total',      value: <span className="text-emerald-600 font-bold text-lg">{fmt(detailOrder.totalAmount)}</span> },
                { label: 'Items',      value: `${detailOrder.items?.length || 0} item${detailOrder.items?.length !== 1 ? 's' : ''}` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium mb-1">{label}</p>
                  <div className="text-sm text-slate-700">{value}</div>
                </div>
              ))}
            </div>

            {detailOrder.notes && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                <p className="text-xs text-amber-600 font-medium mb-1">Notes</p>
                <p className="text-sm text-amber-800">{detailOrder.notes}</p>
              </div>
            )}

            {/* Items list */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Order Items</p>
              <div className="space-y-2">
                {detailOrder.items?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Package size={13} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{item.productName}</p>
                        <p className="text-xs text-slate-400">Qty: {item.quantity} × {fmt(item.subtotal / item.quantity)}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-emerald-600 text-sm">{fmt(item.subtotal)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onCancel={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Order" message="This will permanently remove the order. Stock will be restored for non-delivered orders."
        confirmLabel="Delete Order" />
    </div>
  );
}
