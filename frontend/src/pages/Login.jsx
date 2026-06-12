import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Store, User, Lock, Eye, EyeOff, AlertCircle, 
  ShieldCheck, Check, Package, ShoppingCart, Truck, Shield,
  LayoutDashboard, Users, BarChart3, Settings
} from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username/email and password.');
      return;
    }

    setError('');
    setLoading(true);

    const res = await login(username, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC] font-sans text-slate-800 antialiased overflow-x-hidden">
      
      {/* ── LEFT PANEL: Dark Premium Branding & Mock Dashboard Preview (Desktop Only) ── */}
      <div className="hidden lg:flex lg:w-[50%] xl:w-[55%] bg-[#080E1A] p-12 flex-col justify-between relative overflow-hidden select-none border-r border-slate-900">
        
        {/* Background Radial Glow */}
        <div className="absolute top-[-20%] left-[-20%] w-[90%] h-[90%] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none"></div>
        <div className="absolute bottom-[-15%] right-[-10%] w-[80%] h-[80%] rounded-full bg-indigo-600/10 blur-[125px] pointer-events-none"></div>
        
        {/* Dotted Grid Decoration in Top Right */}
        <div className="absolute top-8 right-8 w-24 h-16 grid grid-cols-6 gap-2 opacity-5 pointer-events-none">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-white rounded-full"></div>
          ))}
        </div>
        
        {/* Top Header - Symmetrical Branding */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/15">
            <Store className="text-white" size={18} />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight leading-none block">SmartRetail</span>
            <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mt-0.5 block">Operations Hub</span>
          </div>
        </div>

        {/* Core Split Body: Feature items on the left, tilted tablet dashboard on the right */}
        <div className="flex-1 flex items-center gap-8 z-10 my-8">
          
          {/* Feature Lists Column */}
          <div className="w-[45%] xl:w-[48%] space-y-6">
            <div className="space-y-3">
              <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-[1.15] tracking-tight">
                Smarter <span className="text-blue-400">Retail.</span><br />
                Stronger <span className="text-blue-500">Operations.</span>
              </h2>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                Unify inventory, streamline orders, manage suppliers, and gain operational visibility across all stores.
              </p>
            </div>

            {/* Feature lists */}
            <div className="space-y-4 pt-2">
              
              {/* Feature 1 */}
              <div className="flex gap-3">
                <div className="w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-400">
                  <Package size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Inventory Management</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">Real-time stock tracking and low-stock alerts.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-3">
                <div className="w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-400">
                  <ShoppingCart size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Order Management</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">Complete order lifecycle tracking and fulfillment.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-3">
                <div className="w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-400">
                  <Truck size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Supplier Management</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">Procurement and supplier relationship management.</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex gap-3">
                <div className="w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-400">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Secure & Reliable</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">Enterprise-grade JWT authentication and role-based access control.</p>
                </div>
              </div>

            </div>

            {/* Boxes and Barcode Scanner Mockup */}
            <div className="relative w-48 h-28 mt-4 select-none opacity-90 scale-100 origin-bottom-left">
              {/* Base shadow */}
              <div className="absolute bottom-1 left-4 w-40 h-4 bg-black/40 blur-md rounded-full"></div>
              
              {/* Large bottom cardboard box */}
              <div className="absolute bottom-2 left-4 w-24 h-16 bg-[#9A7456] rounded shadow-lg border border-[#856145] overflow-hidden flex flex-col justify-between p-2">
                {/* Horizontal tape */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-4 bg-[#B8987E]/40 border-y border-[#856145]/20"></div>
                {/* Shipping Label */}
                <div className="relative z-10 w-6 h-8 bg-white/90 rounded-sm p-0.5 flex flex-col justify-between shadow-sm">
                  <div className="w-full h-0.5 bg-slate-800/80"></div>
                  <div className="w-3 h-0.5 bg-slate-800/60"></div>
                  <div className="w-full h-1.5 bg-[repeating-linear-gradient(90deg,transparent,transparent_1px,#333_1px,#333_2px)]"></div>
                </div>
                <div className="relative z-10 text-[6px] text-[#5C3F2B] font-mono tracking-widest text-right">
                  FRAGILE
                </div>
              </div>
              
              {/* Small top cardboard box */}
              <div className="absolute bottom-12 left-8 w-18 h-12 bg-[#B58D6E] rounded shadow-md border border-[#9A7456] transform rotate-[-4deg] overflow-hidden flex flex-col justify-between p-1.5">
                {/* Tape */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-3.5 bg-[#CBB099]/40 border-x border-[#9A7456]/20"></div>
                {/* Shipping Label */}
                <div className="relative z-10 w-5 h-5 bg-white/80 rounded-sm p-0.5 flex flex-col justify-between shadow-xs">
                  <div className="w-full h-0.5 bg-slate-800/80"></div>
                  <div className="w-full h-0.8 bg-[repeating-linear-gradient(90deg,transparent,transparent_1px,#333_1px,#333_2px)]"></div>
                </div>
                <div className="relative z-10 text-[5px] text-[#5C3F2B] font-mono tracking-widest text-right">
                  SMARTRETAIL
                </div>
              </div>
              
              {/* Barcode scanner outline in front */}
              <div className="absolute bottom-1 left-20 w-14 h-10 bg-[#1E293B] border border-slate-700 rounded-lg shadow-xl transform rotate-[25deg] flex items-center justify-between px-1.5 py-1 relative overflow-hidden">
                {/* Grip pattern */}
                <div className="absolute inset-y-0 right-0 w-3 bg-[#0F172A] border-l border-slate-800"></div>
                {/* Yellow/Amber trigger */}
                <div className="w-1 h-2 bg-[#EAB308] rounded-sm mr-1"></div>
                {/* Scanner nozzle head */}
                <div className="flex-1 flex flex-col justify-between h-full py-0.5">
                  <div className="w-full h-2.5 bg-slate-900 rounded border border-slate-700/50 flex items-center justify-center">
                    {/* Laser lens */}
                    <div className="w-3 h-0.5 bg-rose-500 animate-pulse"></div>
                  </div>
                  <div className="w-1.5 h-1 bg-blue-500 rounded-full self-end mr-0.5"></div>
                </div>
                {/* Laser glow effect */}
                <div className="absolute -left-10 top-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-red-500/20 pointer-events-none transform -skew-x-12"></div>
              </div>
            </div>

          </div>

          {/* Tilted 3D Tablet Dashboard Mockup */}
          <div className="w-[55%] xl:w-[52%] flex items-center justify-center">
            <div 
              className="bg-[#0A101D] border border-white/10 rounded-2xl shadow-2xl flex text-white relative overflow-hidden"
              style={{
                width: '410px',
                height: '470px',
                transform: 'perspective(1000px) rotateY(-16deg) rotateX(6deg)',
                boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8)'
              }}
            >
              {/* Sidebar (left column) */}
              <div className="w-[28%] bg-[#070C16] border-r border-white/5 p-2.5 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Small Brand logo block inside mockup */}
                  <div className="flex items-center gap-1.5 px-1 py-1">
                    <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                      <Store className="text-white" size={8} />
                    </div>
                    <span className="text-[8px] font-bold text-slate-300">SmartConsole</span>
                  </div>
                  
                  {/* Navigation List */}
                  <div className="space-y-1">
                    {/* Dashboard (Active) */}
                    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-blue-600/15 text-blue-400">
                      <LayoutDashboard size={10} className="flex-shrink-0" />
                      <span className="text-[9px] font-semibold">Dashboard</span>
                    </div>
                    {/* Inventory */}
                    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition-colors">
                      <Package size={10} className="flex-shrink-0" />
                      <span className="text-[9px] font-semibold">Inventory</span>
                    </div>
                    {/* Orders */}
                    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition-colors">
                      <ShoppingCart size={10} className="flex-shrink-0" />
                      <span className="text-[9px] font-semibold">Orders</span>
                    </div>
                    {/* Suppliers */}
                    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition-colors">
                      <Truck size={10} className="flex-shrink-0" />
                      <span className="text-[9px] font-semibold">Suppliers</span>
                    </div>
                    {/* Customers */}
                    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition-colors">
                      <Users size={10} className="flex-shrink-0" />
                      <span className="text-[9px] font-semibold">Customers</span>
                    </div>
                    {/* Reports */}
                    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition-colors">
                      <BarChart3 size={10} className="flex-shrink-0" />
                      <span className="text-[9px] font-semibold">Reports</span>
                    </div>
                    {/* Settings */}
                    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition-colors">
                      <Settings size={10} className="flex-shrink-0" />
                      <span className="text-[9px] font-semibold">Settings</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Content area (right column) */}
              <div className="w-[72%] p-3.5 flex flex-col justify-between space-y-3 overflow-y-auto">
                
                {/* Header inside mockup */}
                <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Overview</span>
                  <span className="text-[8px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-semibold">Dashboard</span>
                </div>

                {/* Stat cards grid inside mockup */}
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="bg-white/[0.03] border border-white/5 rounded-lg p-1.5">
                    <p className="text-[7px] text-slate-500 font-bold uppercase tracking-wider">Total Sales</p>
                    <p className="text-[10px] font-extrabold text-white mt-0.5 tabular-nums">₹ 24.58L</p>
                    <p className="text-[6.5px] text-emerald-400 mt-0.5">▲ 12.5%</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 rounded-lg p-1.5">
                    <p className="text-[7px] text-slate-500 font-bold uppercase tracking-wider">Total Orders</p>
                    <p className="text-[10px] font-extrabold text-white mt-0.5 tabular-nums">1,248</p>
                    <p className="text-[6.5px] text-emerald-400 mt-0.5">▲ 8.3%</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 rounded-lg p-1.5">
                    <p className="text-[7px] text-slate-500 font-bold uppercase tracking-wider">Products</p>
                    <p className="text-[10px] font-extrabold text-white mt-0.5 tabular-nums">2,340</p>
                    <p className="text-[6.5px] text-emerald-400 mt-0.5">▲ 5.7%</p>
                  </div>
                </div>

                {/* Low stock alert bar */}
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2 flex items-center justify-between text-[8px] text-slate-400">
                  <span className="font-medium">Low Stock Items</span>
                  <div className="flex items-center gap-1">
                    <span className="bg-[#EF4444] text-white text-[7.5px] font-bold px-1 py-0.2 rounded">23</span>
                    <span className="text-[#EF4444] font-semibold text-[7.5px]">Needs attention</span>
                  </div>
                </div>

                {/* Line chart mockup inside mockup */}
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5">
                  <div className="flex justify-between items-center text-[7px] text-slate-400 uppercase font-bold tracking-wider mb-1.5">
                    <span>Sales Overview</span>
                    <div className="flex items-center gap-0.5 text-slate-500 font-normal normal-case text-[7px]">
                      <span>This Month</span>
                      <span>▼</span>
                    </div>
                  </div>
                  <div className="relative h-12">
                    <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d="M0 25 Q 15 15, 30 22 T 60 10 T 80 18 T 100 8 L 100 30 L 0 30 Z" fill="url(#glow)" />
                      <path d="M0 25 Q 15 15, 30 22 T 60 10 T 80 18 T 100 8" fill="none" stroke="#3B82F6" strokeWidth="1" />
                    </svg>
                  </div>
                </div>

                {/* Category Donut chart mockup inside mockup */}
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5 flex flex-col justify-between">
                  <p className="text-[7.5px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Top Categories</p>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 w-[55%]">
                      <div className="flex items-center justify-between text-[7px] text-slate-300">
                        <div className="flex items-center gap-1">
                          <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                          <span>Electronics</span>
                        </div>
                        <span className="font-bold text-white">40%</span>
                      </div>
                      <div className="flex items-center justify-between text-[7px] text-slate-300">
                        <div className="flex items-center gap-1">
                          <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                          <span>Groceries</span>
                        </div>
                        <span className="font-bold text-white">30%</span>
                      </div>
                      <div className="flex items-center justify-between text-[7px] text-slate-300">
                        <div className="flex items-center gap-1">
                          <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                          <span>Clothing</span>
                        </div>
                        <span className="font-bold text-white">20%</span>
                      </div>
                      <div className="flex items-center justify-between text-[7px] text-slate-300">
                        <div className="flex items-center gap-1">
                          <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                          <span>Home & Kitchen</span>
                        </div>
                        <span className="font-bold text-white">10%</span>
                      </div>
                    </div>
                    
                    <div className="relative flex items-center justify-center w-[35%]">
                      <svg width="36" height="36" viewBox="0 0 36 36" className="transform -rotate-90">
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4.5" />
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3B82F6" strokeWidth="4.5" strokeDasharray="40 60" strokeDashoffset="0" />
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10B981" strokeWidth="4.5" strokeDasharray="30 70" strokeDashoffset="-40" />
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#8B5CF6" strokeWidth="4.5" strokeDasharray="20 80" strokeDashoffset="-70" />
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F59E0B" strokeWidth="4.5" strokeDasharray="10 90" strokeDashoffset="-90" />
                      </svg>
                      <span className="absolute text-[8px] font-bold text-slate-300">12</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center border-t border-white/5 pt-1.5 mt-1.5 text-[7px] text-slate-500">
                    <span>Total Categories</span>
                    <span className="text-white font-bold">12</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Bottom Footer - Enterprise Trust */}
        <div className="flex items-center gap-2 text-slate-500 text-xs mt-auto relative z-10 select-none">
          <ShieldCheck size={14} className="text-blue-500" />
          <span>Built with Spring Boot & secured with JWT</span>
        </div>
      </div>
      
      {/* ── RIGHT PANEL: Refined SaaS Login Panel (Centered Card on light gray) ── */}
      <div className="w-full lg:w-[50%] xl:w-[45%] flex items-center justify-center p-6 sm:p-12 md:p-16 bg-[#FAFAFA]">
        
        {/* Symmetrical elevated card wrapper matching Zoho/Shopify */}
        <div className="w-full max-w-[440px] bg-white border border-slate-200/60 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-10">
          
          {/* Brand header on mobile/tablet */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <Store className="text-white" size={16} />
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight leading-none">SmartRetail</span>
          </div>

          {/* Symmetrical Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-950 tracking-tight">Welcome Back</h1>
            <p className="text-xs text-slate-400 mt-1.5">
              Sign in to access your SmartRetail console
            </p>
          </div>

          {/* Form Error Banner */}
          {error && (
            <div className="mb-6 flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs animate-fade-in">
              <AlertCircle size={15} className="flex-shrink-0 text-rose-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Input - Username */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Username or Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <User size={16} className="text-slate-400/80" />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username or email"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-800 text-sm placeholder:text-slate-400/70 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all duration-150 shadow-sm"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Input - Password */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock size={16} className="text-slate-400/80" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-slate-800 text-sm placeholder:text-slate-400/70 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all duration-150 shadow-sm"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot password row */}
            <div className="flex items-center justify-between text-xs pt-1 select-none">
              <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-200 rounded focus:ring-blue-500/20 cursor-pointer"
                />
                <span className="text-slate-600 font-medium">Remember me</span>
              </label>
              <a href="#forgot" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg active:scale-[0.99] transition-all duration-150 flex items-center justify-center text-sm gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <User size={15} />
                  <span>Sign In to Dashboard</span>
                  <span className="text-white/75 font-normal ml-0.5">→</span>
                </>
              )}
            </button>
          </form>

          {/* Security reassurance banner */}
          <div className="mt-6 flex items-start gap-3 p-4 bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl">
            <ShieldCheck size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold text-[#1E3A8A] tracking-wide leading-none">Secure. Reliable. Enterprise Ready.</p>
              <p className="text-[10px] text-slate-500 mt-1.5 leading-normal">Your data is protected with enterprise-grade security and role-based access.</p>
            </div>
          </div>

          {/* Symmetrical Minimalist Footer info */}
          <p className="text-[10px] text-slate-400 text-center mt-10 select-none">
            © 2025 SmartRetail Management System. All rights reserved.
          </p>

        </div>
      </div>
      
    </div>
  );

}
