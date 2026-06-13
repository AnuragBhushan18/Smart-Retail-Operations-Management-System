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
        bg-[#EAF2F4] border-r border-[#D2E2E6]
        transition-all duration-300 ease-in-out
        relative z-20
      `}
    >
      {/* ── Brand ───────────────────────────────────────────────── */}
      <div className={`flex items-center gap-4 px-6 py-6 border-b border-[#D2E2E6] ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 bg-gradient-to-tr from-[#1E5361] to-[#2A6F82] rounded-[14px] flex items-center justify-center flex-shrink-0 shadow-md shadow-[#2A6F82]/20 border border-[#235C6C]/20">
          <Store size={19} className="text-white animate-pulse" />
        </div>
        {!collapsed && (
          <div className="min-w-0 animate-fade-in">
            <p className="text-[#0F2E35] font-black text-[16px] leading-none tracking-tight">SmartRetail</p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <p className="text-[#2A6F82] text-[9.5px] font-extrabold uppercase tracking-[0.1em] leading-none">
                Admin Portal
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Navigation ──────────────────────────────────────────── */}
      <nav className={`flex-1 py-6 ${collapsed ? 'px-2' : 'px-3'} space-y-2`}>
        {!collapsed && (
          <p className="text-[11.5px] font-extrabold text-[#4A6D76] uppercase tracking-[0.18em] px-3 mb-4 animate-fade-in">
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
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 active:scale-[0.98] relative ${
                isActive 
                  ? 'text-white bg-gradient-to-tr from-[#1E5361] to-[#2A6F82] border border-[#235C6C]/45 shadow-lg shadow-[#2A6F82]/20' 
                  : 'text-[#5B7B83] hover:text-[#1C3A42] hover:bg-[#DCEAEF]/60'
              } ${collapsed ? 'justify-center px-0' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                {/* Smooth vertical active bar - positioned relative to px-3 padding */}
                {isActive && !collapsed && (
                  <span className="absolute left-1.5 top-3.5 bottom-3.5 w-1 bg-white rounded-full animate-fade-in"></span>
                )}
                <Icon size={18} className="flex-shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
              </>
            )}
          </NavLink>
        ))}

        {/* ── Sign Out Button ── */}
        <button
          onClick={handleLogout}
          title={collapsed ? 'Sign Out' : undefined}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold 
            text-[#5B7B83] hover:text-rose-600 hover:bg-rose-50/50 transition-all duration-300 active:scale-[0.98]
            ${collapsed ? 'justify-center px-0' : ''}
          `}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span className="truncate">Sign Out</span>}
        </button>
      </nav>

      {/* ── Footer ──────────────────────────────────────────────── */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-[#D2E2E6] animate-fade-in">
          <div className="flex items-center gap-3 p-3 bg-[#DCEAEF]/40 rounded-xl border border-[#D2E2E6]/60 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-[#C8DBE0] flex items-center justify-center flex-shrink-0">
              <BarChart3 size={14} className="text-[#1C3A42]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#1C3A42] truncate">Smart Retail</p>
              <p className="text-[10px] text-[#5B7B83]">v1.0.0 — Active</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Collapse Toggle ─────────────────────────────────────── */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="
          absolute -right-3 top-[72px]
          w-6 h-6 rounded-full bg-[#EAF2F4] border border-[#D2E2E6] shadow-sm
          flex items-center justify-center
          text-[#5B7B83] hover:text-[#1C3A42] hover:border-[#2A6F82]
          transition-all duration-300 z-10 active:scale-95
        "
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
