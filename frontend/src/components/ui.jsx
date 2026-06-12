import { AlertTriangle, PackageOpen, RefreshCw, CheckCircle, Info } from 'lucide-react';

/* ── Spinner ──────────────────────────────────────────────────────────────── */
export function Spinner({ size = 'md', color = 'blue' }) {
  const s = { sm: 'w-4 h-4 border-2', md: 'w-6 h-6 border-2', lg: 'w-10 h-10 border-[3px]' }[size];
  const c = { blue: 'border-blue-200 border-t-blue-500', white: 'border-white/30 border-t-white' }[color];
  return <div className={`${s} ${c} rounded-full animate-spin`} />;
}

/* ── Page Loader (skeleton-style) ────────────────────────────────────────── */
export function PageLoader() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="skeleton h-7 w-40 mb-2" />
          <div className="skeleton h-4 w-24" />
        </div>
        <div className="skeleton h-10 w-32 rounded-xl" />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card p-5 flex items-center gap-4">
            <div className="skeleton w-12 h-12 rounded-2xl" />
            <div className="flex-1">
              <div className="skeleton h-6 w-16 mb-1.5" />
              <div className="skeleton h-3 w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 p-4">
          <div className="skeleton h-4 w-32" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-b border-slate-50 last:border-0">
            <div className="skeleton h-4 w-8" />
            <div className="skeleton h-4 flex-1" />
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-6 w-16 rounded-full" />
            <div className="skeleton h-8 w-20 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Error Alert ─────────────────────────────────────────────────────────── */
export function ErrorAlert({ message, onRetry }) {
  return (
    <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3">
      <div className="flex items-center gap-3">
        <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
        <p className="text-red-700 text-sm font-medium">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 text-red-600 hover:text-red-700 text-sm font-medium ml-4 flex-shrink-0"
        >
          <RefreshCw size={13} /> Retry
        </button>
      )}
    </div>
  );
}

/* ── Success Toast (inline) ──────────────────────────────────────────────── */
export function SuccessAlert({ message }) {
  return (
    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
      <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
      <p className="text-emerald-700 text-sm font-medium">{message}</p>
    </div>
  );
}

/* ── Info Alert ──────────────────────────────────────────────────────────── */
export function InfoAlert({ message }) {
  return (
    <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
      <Info size={16} className="text-blue-500 flex-shrink-0" />
      <p className="text-blue-700 text-sm font-medium">{message}</p>
    </div>
  );
}

/* ── Confirm Dialog ─────────────────────────────────────────────────────── */
export function ConfirmDialog({ isOpen, onConfirm, onCancel, title, message, confirmLabel = 'Delete', confirmClass = 'bg-red-600 hover:bg-red-700 text-white' }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-box max-w-sm">
        <div className="modal-header">
          <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        </div>
        <div className="modal-body">
          <p className="text-slate-600 text-sm leading-relaxed">{message}</p>
        </div>
        <div className="modal-footer">
          <button onClick={onCancel} className="btn-secondary">Cancel</button>
          <button
            onClick={onConfirm}
            className={`btn ${confirmClass} shadow-sm`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Empty State ─────────────────────────────────────────────────────────── */
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="empty-state">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <Icon size={28} className="text-slate-400" />
        </div>
      )}
      <p className="text-base font-semibold text-slate-600 mb-1">{title}</p>
      {description && <p className="text-sm text-slate-400 mb-4 text-center max-w-xs">{description}</p>}
      {action && action}
    </div>
  );
}

/* ── Form Error ──────────────────────────────────────────────────────────── */
export function FormError({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-3 py-2.5 text-sm">
      <AlertTriangle size={14} className="flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}

/* ── Section Header ─────────────────────────────────────────────────────── */
export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

/* ── Stat Card ───────────────────────────────────────────────────────────── */
export function StatCard({ icon: Icon, label, value, iconBg, iconColor, trend, suffix = '' }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${iconBg}`}>
        <Icon size={22} className={iconColor} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-slate-800 tabular-nums">{value ?? '—'}{suffix}</p>
        <p className="text-sm text-slate-500 truncate">{label}</p>
      </div>
    </div>
  );
}

/* ── Table Toolbar ───────────────────────────────────────────────────────── */
export function TableToolbar({ children }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      {children}
    </div>
  );
}

/* ── Search Input ────────────────────────────────────────────────────────── */
export function SearchInput({ value, onChange, placeholder = 'Search…', className = '' }) {
  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        className={`input pl-9 ${className}`}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
