import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard  from './pages/Dashboard';
import Products   from './pages/Products';
import Categories from './pages/Categories';
import Suppliers  from './pages/Suppliers';
import Customers  from './pages/Customers';
import Orders     from './pages/Orders';
import { Bell, Settings } from 'lucide-react';

const PAGE_TITLES = {
  '/':           { title: 'Dashboard',  subtitle: 'Business overview at a glance' },
  '/products':   { title: 'Products',   subtitle: 'Manage your product inventory' },
  '/categories': { title: 'Categories', subtitle: 'Organise products into categories' },
  '/suppliers':  { title: 'Suppliers',  subtitle: 'Manage your supply chain partners' },
  '/customers':  { title: 'Customers',  subtitle: 'Track your customer base' },
  '/orders':     { title: 'Orders',     subtitle: 'Process and track orders' },
};

function TopBar() {
  const location = useLocation();
  const info = PAGE_TITLES[location.pathname] || {};
  const now  = new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <header className="flex-shrink-0 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      {/* Left - breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-400">SmartRetail</span>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-semibold">{info.title}</span>
      </div>

      {/* Right - actions */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 mr-2 hidden md:block">{now}</span>
        <button className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" title="Notifications">
          <Bell size={17} />
        </button>
        <button className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" title="Settings">
          <Settings size={17} />
        </button>
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white text-xs font-bold ml-1">
          AD
        </div>
      </div>
    </header>
  );
}

function Layout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/"           element={<Dashboard />} />
            <Route path="/products"   element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/suppliers"  element={<Suppliers />} />
            <Route path="/customers"  element={<Customers />} />
            <Route path="/orders"     element={<Orders />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
