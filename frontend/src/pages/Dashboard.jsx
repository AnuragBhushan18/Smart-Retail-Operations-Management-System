import { useEffect, useState } from 'react';
import { dashboardAPI } from '../services/api';
import { PageLoader, ErrorAlert } from '../components/ui';
import {
  Package, Tag, Truck, Users, ShoppingCart,
  TrendingUp, AlertTriangle, DollarSign, CheckCircle,
  Clock, Send, XCircle, RefreshCw
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${bg}`}>
        <Icon size={22} className={color} />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value ?? '—'}</p>
        <p className="text-sm text-slate-400">{label}</p>
      </div>
    </div>
  );
}

function OrderStatusCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div className="card p-4 flex items-center justify-between">
      <div>
        <p className="text-slate-400 text-sm">{label}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
        <Icon size={18} className={color} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const load = async () => {
    try {
      setLoading(true); setError(null);
      const res = await dashboardAPI.getStats();
      setStats(res.data);
    } catch {
      setError('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <PageLoader />;
  if (error)   return <ErrorAlert message={error} onRetry={load} />;

  const fmt = (n) => n?.toLocaleString('en-IN') ?? 0;
  const currency = (n) => '₹' + (n ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back — here's what's happening today</p>
        </div>
        <button onClick={load} className="btn-secondary">
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard icon={Package}      label="Total Products"   value={fmt(stats.totalProducts)}   color="text-indigo-400"  bg="bg-indigo-500/10" />
        <StatCard icon={Tag}          label="Categories"        value={fmt(stats.totalCategories)} color="text-purple-400"  bg="bg-purple-500/10" />
        <StatCard icon={Truck}        label="Suppliers"          value={fmt(stats.totalSuppliers)}  color="text-cyan-400"    bg="bg-cyan-500/10"   />
        <StatCard icon={Users}        label="Customers"          value={fmt(stats.totalCustomers)}  color="text-emerald-400" bg="bg-emerald-500/10"/>
        <StatCard icon={ShoppingCart} label="Total Orders"       value={fmt(stats.totalOrders)}     color="text-amber-400"   bg="bg-amber-500/10"  />
      </div>

      {/* Inventory Value + Low Stock Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5 flex items-center gap-4">
          <div className="stat-icon bg-emerald-500/10">
            <DollarSign size={22} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Total Inventory Value</p>
            <p className="text-3xl font-bold text-white mt-0.5">{currency(stats.totalInventoryValue)}</p>
          </div>
        </div>
        <div className={`card p-5 flex items-center gap-4 ${stats.lowStockCount > 0 ? 'border-amber-500/30' : ''}`}>
          <div className={`stat-icon ${stats.lowStockCount > 0 ? 'bg-amber-500/10' : 'bg-slate-800'}`}>
            <AlertTriangle size={22} className={stats.lowStockCount > 0 ? 'text-amber-400' : 'text-slate-500'} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Low Stock Alerts</p>
            <p className={`text-3xl font-bold mt-0.5 ${stats.lowStockCount > 0 ? 'text-amber-400' : 'text-white'}`}>
              {stats.lowStockCount} product{stats.lowStockCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div>
        <h2 className="text-base font-semibold text-slate-300 mb-3">Order Status Breakdown</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <OrderStatusCard label="Pending"   value={stats.pendingOrders}   icon={Clock}        color="text-amber-400"   bg="bg-amber-500/10"  />
          <OrderStatusCard label="Confirmed" value={stats.confirmedOrders} icon={TrendingUp}   color="text-blue-400"    bg="bg-blue-500/10"   />
          <OrderStatusCard label="Shipped"   value={stats.shippedOrders}   icon={Send}         color="text-purple-400"  bg="bg-purple-500/10" />
          <OrderStatusCard label="Delivered" value={stats.deliveredOrders} icon={CheckCircle}  color="text-emerald-400" bg="bg-emerald-500/10"/>
        </div>
      </div>

      {/* Low Stock Products Table */}
      {stats.lowStockProducts?.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-800">
            <AlertTriangle size={16} className="text-amber-400" />
            <h2 className="text-base font-semibold text-white">Low Stock Products</h2>
            <span className="badge-warning ml-auto">{stats.lowStockProducts.length} items</span>
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th><th>Brand</th><th>Category</th><th>Stock</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.lowStockProducts.map(p => (
                  <tr key={p.id}>
                    <td className="font-medium text-white">{p.name}</td>
                    <td>{p.brand || '—'}</td>
                    <td>{p.categoryName || '—'}</td>
                    <td>
                      <span className={`font-bold ${p.stockQuantity === 0 ? 'text-red-400' : 'text-amber-400'}`}>
                        {p.stockQuantity}
                      </span>
                    </td>
                    <td>
                      <span className={p.stockQuantity === 0 ? 'badge-danger' : 'badge-warning'}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
