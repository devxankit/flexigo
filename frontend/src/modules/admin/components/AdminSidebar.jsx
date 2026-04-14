import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Warehouse, 
  Truck, 
  Users, 
  Wallet, 
  Bell, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Navigation,
  Map,
  QrCode,
  UserCheck,
  CreditCard,
  Target,
  BarChart3,
  Lock,
  Boxes,
  ClipboardCheck,
  Ticket,
  Briefcase,
  Layers,
  Settings,
  Zap
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAdminAuthStore as useAuthStore } from '../store/adminAuthStore';
import logo from '../../../assets/logo.png';

const navigationGroups = [
  {
    title: "Insights",
    items: [
      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, path: '/admin/dashboard' },
      { id: 'analysis', label: 'Platform Analytics', icon: BarChart3, path: '/admin/analytics' },
      { id: 'vehicle-analytics', label: 'Vehicle Stats', icon: Settings, path: '/admin/vehicle-analytics' },
      { id: 'rider-behaviour', label: 'Riders', icon: Target, path: '/admin/rider-behaviour' },
    ]
  },
  {
    title: "Operations",
    items: [
      { id: 'hubs', label: 'Hub Management', icon: Warehouse, path: '/admin/hubs' },
      { id: 'fleet', label: 'Fleet Oversight', icon: Truck, path: '/admin/fleet' },
      { id: 'gps-control', label: 'GPS & Control', icon: Navigation, path: '/admin/gps-control' },
      { id: 'geofencing', label: 'Geo Fencing', icon: Map, path: '/admin/geofencing' },
      { id: 'assignment', label: 'Assignment & QR', icon: QrCode, path: '/admin/assignment' },
    ]
  },
  {
    title: "People",
    items: [
      { id: 'subscribers', label: 'Subscribers', icon: Users, path: '/admin/subscribers' },
      { id: 'kyc', label: 'KYC & Onboard', icon: UserCheck, path: '/admin/kyc' },
      { id: 'hr', label: 'HR Management', icon: Briefcase, path: '/admin/hr' },
      { id: 'franchise-kyc', label: 'Franchise Onboard', icon: ShieldCheck, path: '/admin/franchise-kyc' },
    ]
  },
  {
    title: "Finance",
    items: [
      { id: 'financials', label: 'Financial Center', icon: Wallet, path: '/admin/financials' },
      { id: 'payments', label: 'Payment Gateway', icon: CreditCard, path: '/admin/payments' },
      { id: 'inventory', label: 'Inventory & Billing', icon: Boxes, path: '/admin/inventory' },
      { id: 'franchise-ops', label: 'Franchise & 3PL', icon: Layers, path: '/admin/franchise-ops' },
      { id: 'subscription-plans', label: 'Subscription Plans', icon: Zap, path: '/admin/subscription-plans' },
    ]
  },
  {
    title: "Legal & Support",
    items: [
      { id: 'compliance', label: 'Compliance', icon: ClipboardCheck, path: '/admin/compliance' },
      { id: 'engagement', label: 'Engagement & CRM', icon: Ticket, path: '/admin/engagement' },
      { id: 'security', label: 'Security & Audit', icon: Lock, path: '/admin/security' },
      { id: 'notifications', label: 'Notifications', icon: Bell, path: '/admin/notifications' },
    ]
  }
];

export default function AdminSidebar() {
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className="h-full bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] flex flex-col shadow-2xl relative z-50 shrink-0 transition-all duration-300"
      style={{ width: collapsed ? 80 : 280 }}
    >
      <div className="h-16 border-b border-[var(--border-subtle)] flex items-center px-6 shrink-0 overflow-hidden">
        <div className="flex items-center gap-3 min-w-[220px]">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/5 shrink-0 overflow-hidden">
             <img src={logo} alt="Flexigo Admin" className="w-full h-full object-contain scale-[1.7]" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-none">
               <h2 className="text-sm font-bold tracking-tight text-[var(--text-primary)] uppercase">FLEXIGO <span className="text-emerald-500">ROOT</span></h2>
               <p className="text-[8px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Portal Console</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar py-6">
        <nav className="px-4 space-y-7">
          {navigationGroups.map((group) => (
            <div key={group.title} className="space-y-1.5">
              {!collapsed && (
                <div className="flex items-center gap-3 px-4 mb-3">
                   <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-tertiary)] opacity-40">
                      {group.title}
                   </span>
                   <div className="flex-1 h-px bg-[var(--border-subtle)] opacity-50" />
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link key={item.id} to={item.path} className="block relative group">
                      <div className={`flex items-center px-4 py-2 rounded-xl transition-all duration-200 relative h-9 ${
                        isActive ? 'text-white bg-emerald-600 shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]' : 'text-[var(--text-tertiary)] hover:text-emerald-500 hover:bg-emerald-600/5'
                      }`}>
                        <div className="shrink-0 z-10">
                          <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        {!collapsed && (
                          <span className={`text-[10px] font-bold uppercase tracking-wider ml-4 relative z-10 whitespace-nowrap transition-colors ${isActive ? 'text-white' : 'text-[var(--text-tertiary)] group-hover:text-emerald-500'}`}>
                            {item.label}
                          </span>
                        )}
                        {collapsed && isActive && (
                           <div className="absolute left-0 w-1 h-5 bg-white rounded-r-full" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-20 -right-3 w-6 h-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-full flex items-center justify-center text-[var(--text-tertiary)] hover:text-emerald-400 transition-all shadow-xl z-50 transform translate-y-12 active:scale-90"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/10 transition-colors duration-500">
        <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl flex items-center min-h-[60px]">
           <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 shadow-inner">
                 <ShieldCheck size={20} strokeWidth={2.5} />
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                   <p className="text-[11px] font-bold text-[var(--text-primary)] truncate uppercase tracking-tight">{user?.name || 'Administrator'}</p>
                   <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Admin Account</p>
                </div>
              )}
              {!collapsed && (
                <button onClick={logout} className="p-2 text-[var(--text-tertiary)] hover:text-emerald-500 transition-all">
                  <LogOut size={16} />
                </button>
              )}
           </div>
        </div>
      </div>
    </aside>
  );
}
