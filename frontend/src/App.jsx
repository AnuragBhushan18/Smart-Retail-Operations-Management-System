import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard  from './pages/Dashboard';
import Products   from './pages/Products';
import Categories from './pages/Categories';
import Suppliers  from './pages/Suppliers';
import Customers  from './pages/Customers';
import Orders     from './pages/Orders';
import Login      from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import { 
  Bell, Settings, Calendar, LogOut, User, Mail, 
  Shield, Check, AlertCircle, RefreshCw, HardDrive 
} from 'lucide-react';


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
  const { user, logout } = useAuth();
  const info = PAGE_TITLES[location.pathname] || { title: 'Dashboard' };
  const now  = new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });

  // Dropdown States
  const [activeDropdown, setActiveDropdown] = useState(null); // 'notifications' | 'settings' | 'profile' | null

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', text: 'Low stock warning: Organic Apples', time: '5 mins ago', read: false },
    { id: 2, type: 'success', text: 'Supplier "Farms Direct" approved', time: '1 hour ago', read: false },
    { id: 3, type: 'info', text: 'Daily database backup successful', time: '3 hours ago', read: true },
  ]);

  const hasUnread = notifications.some(n => !n.read);

  const toggleDropdown = (type) => {
    setActiveDropdown(activeDropdown === type ? null : type);
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  const handleLogout = () => {
    closeDropdown();
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  // Compute initials dynamically based on logged in user's name
  const getInitials = () => {
    if (!user || !user.name) return 'AD';
    const parts = user.name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="flex-shrink-0 h-14 bg-[#FAF8F5]/75 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
      {/* Left - breadcrumb */}
      <div className="flex items-center gap-2 text-sm select-none">
        <span className="text-slate-400">SmartRetail</span>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-semibold">{info.title}</span>
      </div>

      {/* Right - actions */}
      <div className="flex items-center gap-3 relative">
        {/* Styled Date Capsule */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 bg-white/60 border border-slate-200/50 rounded-xl text-xs font-semibold text-slate-600 shadow-sm select-none transition-all duration-200 hover:bg-white">
          <Calendar size={14} className="text-blue-500" />
          <span>{now}</span>
        </div>

        {/* Global Click-Outside Overlay */}
        {activeDropdown && (
          <div 
            className="fixed inset-0 z-40 bg-transparent cursor-default" 
            onClick={closeDropdown}
          />
        )}
        
        {/* Notifications Icon Button */}
        <div className="relative">
          <button 
            onClick={() => toggleDropdown('notifications')}
            className={`relative p-2 rounded-xl border transition-all duration-200 active:scale-95 z-50 ${
              activeDropdown === 'notifications' 
                ? 'bg-blue-50/80 border-blue-200 text-[#2A6F82] shadow-sm' 
                : 'bg-white/60 border-slate-200/50 text-slate-500 hover:text-slate-800 hover:bg-white hover:shadow-sm'
            }`}
            title="Notifications"
          >
            <Bell size={17} />
            {/* Active notification indicator */}
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D4704E] rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {activeDropdown === 'notifications' && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200/60 shadow-dropdown z-50 p-4 transform origin-top-right transition-all duration-200 animate-scale-up">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notifications</span>
                {hasUnread && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-[10px] font-bold text-blue-500 hover:text-blue-600 transition-colors uppercase tracking-wider"
                  >
                    Mark read
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    No new notifications
                  </div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`flex items-start gap-2.5 p-2 rounded-xl transition-all border ${
                        n.read 
                          ? 'bg-slate-50/50 border-transparent text-slate-550' 
                          : 'bg-blue-50/30 border-blue-100/30 text-slate-700 font-medium'
                      }`}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {n.type === 'warning' && <AlertCircle size={14} className="text-[#D4704E]" />}
                        {n.type === 'success' && <Check size={14} className="text-emerald-550" />}
                        {n.type === 'info' && <HardDrive size={14} className="text-blue-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs leading-normal break-words text-left">{n.text}</p>
                        <span className="text-[9px] text-slate-400 block mt-1 text-left">{n.time}</span>
                      </div>
                      <button 
                        onClick={() => clearNotification(n.id)}
                        className="text-slate-300 hover:text-slate-500 text-[10px] p-0.5 transition-colors self-start"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings Icon Button */}
        <div className="relative">
          <button 
            onClick={() => toggleDropdown('settings')}
            className={`p-2 rounded-xl border transition-all duration-200 active:scale-95 z-50 group ${
              activeDropdown === 'settings' 
                ? 'bg-blue-50/80 border-blue-200 text-[#2A6F82] shadow-sm' 
                : 'bg-white/60 border-slate-200/50 text-slate-500 hover:text-slate-800 hover:bg-white hover:shadow-sm'
            }`}
            title="System Settings"
          >
            <Settings size={17} className="group-hover:rotate-45 transition-transform duration-300" />
          </button>

          {/* Settings Dropdown Panel */}
          {activeDropdown === 'settings' && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200/60 shadow-dropdown z-50 p-4 transform origin-top-right transition-all duration-200 animate-scale-up">
              <div className="pb-3 border-b border-slate-100 mb-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">System Settings</span>
              </div>
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold">API Server</span>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[11px] font-bold text-slate-700">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold">Database Status</span>
                  <span className="text-[11px] font-bold text-slate-700">Ready</span>
                </div>
                <div className="border-t border-slate-100 pt-2.5">
                  <button 
                    onClick={() => {
                      alert('System configuration audit initiated. All connections active.');
                      closeDropdown();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-700 transition-all active:scale-[0.98]"
                  >
                    <RefreshCw size={12} className="text-slate-500" />
                    <span>Run Health Check</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Trigger Button */}
        <div className="relative">
          <button 
            onClick={() => toggleDropdown('profile')}
            className={`w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1E5361] to-[#2A6F82] flex items-center justify-center text-white text-[12px] font-black tracking-wider shadow-md shadow-[#2A6F82]/10 border border-[#235C6C]/20 transition-all active:scale-95 z-50 ${
              activeDropdown === 'profile' ? 'ring-2 ring-[#2A6F82]/40 ring-offset-2' : ''
            }`}
            title={`${user?.name || 'Admin'} Profile`}
          >
            {getInitials()}
          </button>

          {/* Profile Dropdown Panel */}
          {activeDropdown === 'profile' && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200/60 shadow-dropdown z-50 transform origin-top-right transition-all duration-200 animate-scale-up overflow-hidden">
              {/* Dropdown Header with Profile Summary */}
              <div className="p-4 bg-gradient-to-tr from-[#1E5361]/5 to-[#2A6F82]/5 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1E5361] to-[#2A6F82] flex items-center justify-center text-white text-[13px] font-black shadow-sm">
                  {getInitials()}
                </div>
                <div className="min-w-0 text-left">
                  <h4 className="text-xs font-black text-slate-800 truncate leading-tight">
                    {user?.name || 'Administrator'}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Shield size={10} className="text-[#2A6F82]" />
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#2A6F82] bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-md leading-none">
                      {user?.role || 'ADMIN'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu Options */}
              <div className="p-1.5 space-y-0.5">
                <div className="px-3 py-1.5 text-[9px] font-extrabold text-slate-400 uppercase tracking-wider text-left">
                  Account
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-650 hover:text-slate-850 hover:bg-slate-50 transition-colors select-none text-left">
                  <Mail size={13} className="text-slate-400" />
                  <span className="truncate">{user?.email || 'admin@smartretail.com'}</span>
                </div>
                <button 
                  onClick={() => {
                    alert('Profile details edit functionality is simulated in this mockup.');
                    closeDropdown();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-850 hover:bg-slate-50 transition-colors text-left"
                >
                  <User size={13} className="text-slate-400" />
                  <span>My Profile Details</span>
                </button>
                <div className="border-t border-slate-100 my-1.5"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50/50 transition-colors text-left"
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
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
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public login page */}
            <Route path="/login" element={<Login />} />
            
            {/* All other pages protected */}
            <Route element={<ProtectedRoute />}>
              <Route path="/*" element={<Layout />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
