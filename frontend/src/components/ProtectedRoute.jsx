import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Store } from 'lucide-react';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] animate-fade-in">
        {/* Ambient background glow */}
        <div className="absolute w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none"></div>

        <div className="flex flex-col items-center gap-5 relative z-10 animate-fade-in-up">
          {/* Logo + outer spinner container */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Outer smooth spinner */}
            <div className="absolute inset-0 border-[3px] border-blue-500/10 border-t-blue-600 rounded-full animate-spin"></div>
            {/* Inner brand box */}
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/10 border border-blue-400/20">
              <Store size={18} className="text-white" />
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-slate-800 font-bold text-base tracking-tight">SmartRetail</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1.5 animate-pulse">
              Verifying Session
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
