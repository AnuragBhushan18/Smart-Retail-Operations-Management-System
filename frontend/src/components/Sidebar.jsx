import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Package, Tag, Truck, Users,
  ShoppingCart, Store, ChevronLeft, ChevronRight,
  BarChart3, LogOut
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/',           label: 'Dashboard',  icon: LayoutDashboard, end: true  },
  { to: '/products',   label: 'Products',   icon: Package          },
  { to: '/categories', label: 'Categories', icon: Tag              },
  { to: '/suppliers',  label: 'Suppliers',  icon: Truck            },
  { to: '/customers',  label: 'Customers',  icon: Users            },
  { to: '/orders',     label: 'Orders',     icon: ShoppingCart     },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
    }
  };

  return (
    <aside
      className={`
        ${collapsed ? 'w-[68px]' : 'w-[230px]'}
        flex-shrink-0 flex flex-col min-h-screen
        bg-brand-light border-r border-blue-100
        transition-all duration-300 ease-in-out
        relative
      `}
    >
      {/* ── Brand ───────────────────────────────────────────────── */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-blue-100 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
          <Store size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-slate-800 font-bold text-sm leading-tight truncate">SmartRetail</p>
            <p className="text-blue-500 text-xs font-medium">Admin Portal</p>
          </div>
        )}
      </div>

      {/* ── Navigation ──────────────────────────────────────────── */}
      <nav className={`flex-1 py-4 ${collapsed ? 'px-2' : 'px-3'} space-y-1`}>
        {!collapsed && (
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2 animate-fade-in">
            Main Menu
          </p>
        )}
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}

        {/* ── Sign Out Button ── */}
        <button
          onClick={handleLogout}
          title={collapsed ? 'Sign Out' : undefined}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold 
            text-slate-500 hover:text-rose-600 hover:bg-rose-50/50 transition-all duration-200
            ${collapsed ? 'justify-center px-0' : ''}
          `}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span className="truncate">Sign Out</span>}
        </button>
      </nav>

      {/* ── Footer ──────────────────────────────────────────────── */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-blue-100">
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-blue-100 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <BarChart3 size={14} className="text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-700 truncate">Smart Retail</p>
              <p className="text-[10px] text-slate-400">v1.0.0 — Active</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Collapse Toggle ─────────────────────────────────────── */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="
          absolute -right-3 top-[72px]
          w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm
          flex items-center justify-center
          text-slate-400 hover:text-slate-700 hover:border-slate-300
          transition-all duration-200 z-10
        "
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
