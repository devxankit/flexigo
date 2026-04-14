import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAdminAuthStore } from '../store/adminAuthStore';
import { useAdminThemeStore } from '../store/themeStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Settings, Command, Sun, Moon } from 'lucide-react';

export default function AdminLayout() {
  const { isAuthenticated, user } = useAdminAuthStore();
  const { theme, toggleTheme } = useAdminThemeStore();
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.style.backgroundColor = theme === 'dark' ? '#020617' : '#F8FAFC';
  }, [theme]);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden font-sans selection:bg-emerald-500/30 transition-colors duration-300">
      
      {/* Sidebar Command Center */}
      <AdminSidebar />

      {/* Main Orchestrator */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Global Control Header */}
        <header className="h-16 border-b border-[var(--border-subtle)] flex items-center justify-between px-8 bg-[var(--bg-secondary)]/80 backdrop-blur-md z-40 transition-colors duration-300">
           <div className="flex items-center gap-6 flex-1">
              {/* Tactical Search */}
              <div className="relative group max-w-md w-full">
                 <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[var(--text-tertiary)] group-focus-within:text-emerald-500 transition-colors">
                    <Search size={14} />
                 </div>
                 <input 
                   placeholder="Search Hubs, Vehicles, or Staff... [⌘K]" 
                   className="w-full bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition-all placeholder:text-[var(--text-tertiary)]/50"
                 />
                 <div className="absolute right-3 inset-y-0 flex items-center pointer-events-none">
                    <span className="px-1.5 py-0.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[8px] font-black text-[var(--text-tertiary)] uppercase opacity-40">⌘K</span>
                 </div>
              </div>
           </div>

           <div className="flex items-center gap-4">
              {/* Network Status Active Badge */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
                 <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                 <span className="text-[9px] font-black uppercase text-emerald-500 tracking-widest">Status: Active</span>
              </div>
              
              <div className="flex items-center gap-1">
                <button 
                  onClick={(e) => {
                    if (!document.startViewTransition) {
                      toggleTheme();
                      return;
                    }

                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
                    const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
                    
                    const endRadius = Math.hypot(
                      Math.max(x, 100 - x),
                      Math.max(y, 100 - y)
                    );

                    const transition = document.startViewTransition(() => {
                      toggleTheme();
                    });

                    transition.ready.then(() => {
                      document.documentElement.animate(
                        {
                          clipPath: [
                            `circle(0 at ${x}% ${y}%)`,
                            `circle(${endRadius * 1.5}% at ${x}% ${y}%)`,
                          ],
                        },
                        {
                          duration: 600,
                          easing: "ease-in-out",
                          pseudoElement: "::view-transition-new(root)",
                        }
                      );
                    });
                  }}
                  className="p-2 text-[var(--text-tertiary)] hover:text-emerald-500 rounded-lg transition-all relative group"
                >
                   {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button className="p-2 text-[var(--text-tertiary)] hover:text-emerald-500 rounded-lg transition-all relative group">
                   <Bell size={18} />
                   <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full border-2 border-[var(--bg-secondary)]" />
                </button>
                <button className="p-2 text-[var(--text-tertiary)] hover:text-emerald-500 rounded-lg transition-all">
                   <Settings size={18} />
                </button>
              </div>

              <div className="h-4 w-px bg-[var(--border-subtle)] mx-2" />

              <div className="flex items-center gap-3 pl-2">
                 <div className="flex flex-col text-right hidden lg:flex">
                    <span className="text-xs font-black text-[var(--text-primary)] hover:text-emerald-500 cursor-pointer transition-colors leading-none">{user?.name || 'Admin Console'}</span>
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none mt-1">Administrator</span>
                 </div>
                 <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 border border-white/10 flex items-center justify-center shadow-lg shadow-emerald-950/20 cursor-help group relative">
                    <span className="font-black text-xs text-white">RA</span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                 </div>
              </div>
           </div>
        </header>

        {/* Dynamic Viewport */}
        <main className="flex-1 overflow-y-auto overscroll-y-none no-scrollbar pt-8 px-10 pb-20 relative bg-[var(--bg-primary)] transition-colors duration-300">
           {/* Discrete Grid Pattern Backdrop */}
           <div className="absolute inset-0 bg-[radial-gradient(#10b981_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />
           
           <AnimatePresence mode="wait">
             <motion.div
               key={window.location.pathname}
               initial={{ opacity: 0, scale: 0.99, y: 5 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.99, y: -5 }}
               transition={{ duration: 0.25, ease: "easeOut" }}
               className="relative z-10"
             >
                <Outlet />
             </motion.div>
           </AnimatePresence>
           
           {/* Tactical Footer Glow */}
           <div className="fixed bottom-0 right-0 w-1/4 h-1/4 bg-emerald-600/5 blur-[100px] pointer-events-none -z-10" />
        </main>
      </div>
    </div>
  );
}
