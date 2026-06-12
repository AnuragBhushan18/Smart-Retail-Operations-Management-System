import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Package, Tag, Truck, Users, ShoppingCart, Menu, X, Store
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/',           label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/products',   label: 'Products',   icon: Package },
  { to: '/categories', label: 'Categories', icon: Tag },
  { to: '/suppliers',  label: 'Suppliers',  icon: Truck },
  { to: '/customers',  label: 'Customers',  icon: Users },
  { to: '/orders',     label: 'Orders',     icon: ShoppingCart },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-60'} flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 min-h-screen`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Store size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-bold text-sm leading-tight">SmartRetail</p>
            <p className="text-indigo-400 text-xs">Admin Dashboard</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-slate-500 hover:text-white transition-colors"
        >
          {collapsed ? <Menu size={16} /> : <X size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-800">
          <p className="text-xs text-slate-600 text-center">Smart Retail v1.0.0</p>
        </div>
      )}
    </aside>
  );
}
