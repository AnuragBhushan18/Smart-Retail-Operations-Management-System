import { useEffect, useState } from 'react';
import { dashboardAPI, productAPI, categoryAPI } from '../services/api';
import { PageLoader, ErrorAlert, StatCard } from '../components/ui';
import {
  Package, Tag, Truck, Users, ShoppingCart,
  AlertTriangle, DollarSign, CheckCircle,
  Clock, Send, TrendingUp, RefreshCw, Activity,
  Briefcase, Percent
} from 'lucide-react';

function OrderStatusCard({ label, value, icon: Icon, bg, color, border, percent }) {
  return (
    <div className={`card p-4 border-l-4 ${border} hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">{label}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-bold text-slate-800 tabular-nums">{value}</p>
            {percent !== undefined && (
              <span className="text-[10px] font-semibold text-slate-400">({percent}%)</span>
            )}
          </div>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
          <Icon size={18} className={color} />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats,      setStats]      = useState(null);
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const [sRes, pRes, cRes] = await Promise.all([
        dashboardAPI.getStats(),
        productAPI.getAll(),
        categoryAPI.getAll()
      ]);
      setStats(sRes.data);
      setProducts(pRes.data);
      setCategories(cRes.data);
    } catch {
      setError('Failed to load dashboard statistics. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <PageLoader />;
  if (error) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your retail operations</p>
        </div>
        <ErrorAlert message={error} onRetry={load} />
      </div>
    );
  }

  const fmt      = (n) => (n ?? 0).toLocaleString('en-IN');
  const currency = (n) => '₹' + (n ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });
  const now      = new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  // ─── CALCULATE REPORT METRICS ──────────────────────────────────────────────

  // 1. Calculate Inventory Valuation by Category
  const categoryValuations = categories.map(cat => {
    const catProducts = products.filter(p => p.categoryId === cat.id);
    const value = catProducts.reduce((sum, p) => sum + (p.price * (p.stockQuantity || 0)), 0);
    return { id: cat.id, name: cat.name, value, count: catProducts.length };
  }).sort((a, b) => b.value - a.value);

  const maxCatValuation = Math.max(...categoryValuations.map(c => c.value), 1);

  // 2. Calculate Top Brands by Valuation
  const brandValuations = {};
  products.forEach(p => {
    const brandName = p.brand?.trim() || 'Generic/Unbranded';
    const value = p.price * (p.stockQuantity || 0);
    brandValuations[brandName] = (brandValuations[brandName] || 0) + value;
  });

  const topBrands = Object.entries(brandValuations)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const maxBrandValuation = Math.max(...topBrands.map(b => b.value), 1);

  // 3. Percentages of Order Statuses
  const totalOrd = stats.totalOrders || 1;
  const getPct = (val) => Math.round((val / totalOrd) * 100);

  // ─── CIRCULAR SVG PROGRESS RENDERING ───────────────────────────────────────
  const renderProgressRing = (value, colorClass) => {
    const radius = 24;
    const stroke = 4;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (Math.min(value, 100) / 100) * circumference;

    return (
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          stroke="#F1F5F9"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className={colorClass}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
    );
  };

  return (
    <div className="space-y-6 pb-8 animate-fade-in-up">

      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">{now}</p>
        </div>
        <button onClick={load} className="btn-secondary btn-sm flex items-center gap-1.5">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* ── KPI Stats Row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard icon={Package}      label="Total Products"   value={fmt(stats.totalProducts)}   iconBg="bg-blue-50"    iconColor="text-blue-500" to="/products" />
        <StatCard icon={Tag}          label="Categories"        value={fmt(stats.totalCategories)} iconBg="bg-purple-50"  iconColor="text-purple-500" to="/categories" />
        <StatCard icon={Truck}        label="Suppliers"          value={fmt(stats.totalSuppliers)}  iconBg="bg-teal-50"    iconColor="text-teal-500" to="/suppliers" />
        <StatCard icon={Users}        label="Customers"          value={fmt(stats.totalCustomers)}  iconBg="bg-emerald-50" iconColor="text-emerald-500" to="/customers" />
        <StatCard icon={ShoppingCart} label="Total Orders"       value={fmt(stats.totalOrders)}     iconBg="bg-amber-50"   iconColor="text-amber-500" to="/orders" />
      </div>

      {/* ── Inventory Value + Low Stock ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Inventory Value */}
        <div className="card p-5">
          <div className="flex items-center gap-4">
            <div className="stat-icon bg-emerald-50">
              <DollarSign size={22} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Inventory Value</p>
              <p className="text-3xl font-bold text-slate-800 mt-0.5 tabular-nums">
                {currency(stats.totalInventoryValue)}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
            <Activity size={13} className="text-emerald-500" />
            <span className="text-xs text-slate-500">{fmt(stats.totalProducts)} products tracked across {fmt(stats.totalCategories)} categories</span>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className={`card p-5 ${stats.lowStockCount > 0 ? 'border-amber-200 bg-amber-50/30' : ''}`}>
          <div className="flex items-center gap-4">
            <div className={`stat-icon ${stats.lowStockCount > 0 ? 'bg-amber-100' : 'bg-slate-100'}`}>
              <AlertTriangle size={22} className={stats.lowStockCount > 0 ? 'text-amber-600' : 'text-slate-400'} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Low Stock Alerts</p>
              <p className={`text-3xl font-bold mt-0.5 tabular-nums ${stats.lowStockCount > 0 ? 'text-amber-600' : 'text-slate-800'}`}>
                {stats.lowStockCount}
                <span className="text-base font-normal text-slate-500 ml-1">
                  product{stats.lowStockCount !== 1 ? 's' : ''}
                </span>
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
            <AlertTriangle size={13} className={stats.lowStockCount > 0 ? 'text-amber-500' : 'text-slate-400'} />
            <span className="text-xs text-slate-500">
              {stats.lowStockCount > 0 ? `${stats.lowStockCount} items need restocking` : 'All products are sufficiently stocked'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Order Status Breakdown ────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-base font-semibold text-slate-700">Order Status Overview</h2>
          <span className="badge-info">{fmt(stats.totalOrders)} total</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <OrderStatusCard label="Pending"   value={stats.pendingOrders}   icon={Clock}       bg="bg-amber-50"   color="text-amber-600"   border="border-amber-400"   percent={getPct(stats.pendingOrders)} />
          <OrderStatusCard label="Confirmed" value={stats.confirmedOrders} icon={TrendingUp}  bg="bg-blue-50"    color="text-blue-600"    border="border-blue-400"    percent={getPct(stats.confirmedOrders)} />
          <OrderStatusCard label="Shipped"   value={stats.shippedOrders}   icon={Send}        bg="bg-purple-50"  color="text-purple-600"  border="border-purple-400"  percent={getPct(stats.shippedOrders)} />
          <OrderStatusCard label="Delivered" value={stats.deliveredOrders} icon={CheckCircle} bg="bg-emerald-50" color="text-emerald-600" border="border-emerald-400" percent={getPct(stats.deliveredOrders)} />
        </div>
      </div>

      {/* ─── CHARTS SECTION (PHASE 8 REPORTS & ANALYTICS) ──────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Category Inventory Valuation Chart */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Inventory Value by Category</h3>
              <p className="text-xs text-slate-400 mt-0.5">Valuation breakdown of categories in stock</p>
            </div>
            <Tag size={18} className="text-slate-400" />
          </div>

          <div className="space-y-4">
            {categoryValuations.map(cat => {
              const pct = (cat.value / maxCatValuation) * 100;
              return (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">{cat.name} <span className="text-[10px] text-slate-400 font-normal">({cat.count} items)</span></span>
                    <span className="font-bold text-slate-800 tabular-nums">{currency(cat.value)}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-lg overflow-hidden relative">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-lg transition-all duration-1000 ease-out"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Sourced Brands & Order share ring indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 md:gap-4 xl:gap-0 xl:space-y-6">
          
          {/* Top Brands Valuation */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-5 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Top 5 Brands by Sourced Value</h3>
                <p className="text-xs text-slate-400 mt-0.5">Asset values grouped by manufacturer</p>
              </div>
              <Briefcase size={18} className="text-slate-400" />
            </div>

            <div className="space-y-3.5">
              {topBrands.map((b, idx) => {
                const pct = (b.value / maxBrandValuation) * 100;
                return (
                  <div key={b.name} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                      {idx + 1}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>{b.name}</span>
                        <span className="font-bold text-slate-800 tabular-nums">{currency(b.value)}</span>
                      </div>
                      <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Status Distribution Progress Rings */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-5 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Order Status Share</h3>
                <p className="text-xs text-slate-400 mt-0.5">Visual allocation of orders relative to total</p>
              </div>
              <Percent size={18} className="text-slate-400" />
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: 'Pending',   count: stats.pendingOrders,   color: 'stroke-amber-500' },
                { label: 'Confirm',   count: stats.confirmedOrders, color: 'stroke-blue-500' },
                { label: 'Shipped',   count: stats.shippedOrders,   color: 'stroke-purple-500' },
                { label: 'Deliver',   count: stats.deliveredOrders, color: 'stroke-emerald-500' },
              ].map(item => {
                const pct = getPct(item.count);
                return (
                  <div key={item.label} className="flex flex-col items-center">
                    <div className="relative flex items-center justify-center">
                      {renderProgressRing(pct, item.color)}
                      <span className="absolute text-[10px] font-bold text-slate-700 tabular-nums">{pct}%</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-2">{item.label}</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 tabular-nums">{item.count}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* ── Low Stock Products Table ──────────────────────────────────── */}
      {stats.lowStockProducts?.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-500" />
              <h2 className="text-sm font-semibold text-slate-800">Products Needing Restock</h2>
            </div>
            <span className="badge-warning">{stats.lowStockProducts.length} items</span>
          </div>
          <div className="table-wrapper border-0 rounded-none">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Stock Qty</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.lowStockProducts.map(p => (
                  <tr key={p.id}>
                    <td className="font-medium text-slate-800">{p.name}</td>
                    <td className="text-slate-500">{p.brand || '—'}</td>
                    <td>
                      <span className="badge-info">{p.categoryName || '—'}</span>
                    </td>
                    <td>
                      <span className={`font-bold text-base tabular-nums ${p.stockQuantity === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                        {p.stockQuantity}
                      </span>
                    </td>
                    <td>
                      <span className={p.stockQuantity === 0 ? 'badge-danger' : 'badge-warning'}>
                        {p.stockQuantity === 0 ? 'Out of Stock' : 'Low Stock'}
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
