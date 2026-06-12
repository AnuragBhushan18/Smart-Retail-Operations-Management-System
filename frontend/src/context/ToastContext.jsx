import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* ── Toast Container overlay ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {toasts.map(({ id, message, type }) => (
          <div
            key={id}
            className={`
              pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border 
              transform transition-all duration-300 translate-y-0 opacity-100 scale-100
              animate-fade-in
              ${type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-200 shadow-emerald-100/30' : ''}
              ${type === 'error' ? 'bg-rose-50 text-rose-900 border-rose-200 shadow-rose-100/30' : ''}
              ${type === 'info' ? 'bg-blue-50 text-blue-900 border-blue-200 shadow-blue-100/30' : ''}
            `}
          >
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {type === 'success' && <CheckCircle2 className="text-emerald-500" size={18} />}
              {type === 'error' && <AlertCircle className="text-rose-500" size={18} />}
              {type === 'info' && <Info className="text-blue-500" size={18} />}
            </div>

            {/* Message */}
            <div className="flex-1 text-xs font-semibold leading-relaxed">
              {message}
            </div>

            {/* Close button */}
            <button
              onClick={() => removeToast(id)}
              className={`
                flex-shrink-0 -mt-1 -mr-1 p-1 rounded-lg hover:bg-black/5 transition-colors
                ${type === 'success' ? 'text-emerald-500 hover:text-emerald-700' : ''}
                ${type === 'error' ? 'text-rose-500 hover:text-rose-700' : ''}
                ${type === 'info' ? 'text-blue-500 hover:text-blue-700' : ''}
              `}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
