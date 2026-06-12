export function Spinner({ size = 'md' }) {
  const s = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-10 h-10' : 'w-6 h-6';
  return (
    <div className={`${s} border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin`} />
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>
  );
}

export function ErrorAlert({ message, onRetry }) {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center justify-between">
      <p className="text-red-400 text-sm">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-red-400 hover:text-red-300 text-sm underline ml-4">
          Retry
        </button>
      )}
    </div>
  );
}

export function ConfirmDialog({ isOpen, onConfirm, onCancel, title, message }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-box max-w-sm">
        <div className="modal-header">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
        <div className="modal-body">
          <p className="text-slate-400 text-sm">{message}</p>
        </div>
        <div className="modal-footer">
          <button onClick={onCancel} className="btn-secondary">Cancel</button>
          <button onClick={onConfirm} className="bg-red-600 hover:bg-red-500 text-white font-medium px-4 py-2 rounded-xl transition-all duration-200 text-sm">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="empty-state">
      {Icon && <Icon size={48} className="mb-4 opacity-30" />}
      <p className="text-lg font-medium text-slate-400">{title}</p>
      {description && <p className="text-sm mt-1 text-slate-600">{description}</p>}
    </div>
  );
}
