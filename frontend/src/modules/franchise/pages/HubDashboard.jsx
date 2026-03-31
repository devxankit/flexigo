import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  Truck, 
  Users, 
  Zap, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Calendar,
  ZapOff,
  Navigation,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import DataCard from '../components/DataCard';
import ActivityFeed from '../components/ActivityFeed';
import { useFleetStore } from '../store/fleetStore';
import { useRiderAssignmentStore } from '../store/riderAssignmentStore'; // provides subscribers
import { useFranchiseWalletStore } from '../store/walletStore';

export default function HubDashboard() {
  const { vehicles } = useFleetStore();
  const { subscribers } = useRiderAssignmentStore();
  const { balance } = useFranchiseWalletStore();
  const dashboardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gsap-card', {
        y: 30,
        opacity: 0,
        stagger: 0.05,
        duration: 0.6,
        ease: 'power2.out'
      });
    }, dashboardRef);
    return () => ctx.revert();
  }, []);

  const totalVehicles = vehicles.length;
  const activeSubscribers = (subscribers || []).filter(s => s.status === 'active').length;
  const availableVehicles = vehicles.filter(v => v.status === 'available').length;
  const issuesVehicles = vehicles.filter(v => v.status === 'in-service' || v.status === 'quarantined').length;

  return (
    <div ref={dashboardRef} className="space-y-6 pb-10">
      {/* Page Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 gsap-card">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-emerald-500 rounded-full" />
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Hub <span className="text-emerald-500">Overview</span>
            </h1>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider ml-4 text-[var(--text-tertiary)]">
             Operational Real-time Metrics • Koramangala Hub
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-sm active:scale-95">
             + New Vehicle
          </button>
          <button className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] text-xs font-bold uppercase tracking-wider hover:bg-[var(--bg-tertiary)] transition-all shadow-sm active:scale-95 flex items-center gap-2">
             Ops Handover <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 gsap-card">
        <DataCard 
          title="Fleet Size" 
          value={totalVehicles} 
          unit="units" 
          icon={Truck} 
          color="#10b981" 
          trend="up" 
          trendValue={5} 
        />
        <DataCard 
          title="Active Subscribers" 
          value={activeSubscribers} 
          unit="subscribers" 
          icon={Users} 
          color="#3b82f6" 
          trend="up" 
          trendValue={12} 
        />
        <DataCard 
          title="Available Inventory" 
          value={availableVehicles} 
          unit="EVs" 
          icon={Zap} 
          color="#f59e0b" 
          trend="down" 
          trendValue={2} 
        />
        <DataCard 
          title="Maintenance Alert" 
          value={issuesVehicles} 
          unit="critical" 
          icon={AlertTriangle} 
          color="#ef4444" 
          trend="up" 
          trendValue={1} 
        />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Financials & Map */}
        <div className="lg:col-span-2 space-y-6 gsap-card">
          
          {/* Revenue Analysis Card */}
          <div className="relative group p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-sm flex flex-col justify-between min-h-[280px]">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] scale-[2] pointer-events-none rotate-12">
               <TrendingUp size={120} className="text-emerald-500" />
            </div>
            
            <div className="flex items-center justify-between mb-6">
               <div className="space-y-0.5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">Operational Revenue</h3>
                  <p className="text-[10px] font-medium text-[var(--text-tertiary)] uppercase leading-none">Gross commission across network</p>
               </div>
               <div className="flex bg-[var(--bg-tertiary)]/50 p-1 rounded-lg border border-[var(--border-subtle)]">
                  <button className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-sm">Daily</button>
                  <button className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">Weekly</button>
               </div>
            </div>

            <div className="flex items-baseline gap-3 mb-2">
               <span className="text-[var(--text-tertiary)] text-xl font-bold opacity-50">₹</span>
               <h2 className="text-5xl font-bold tracking-tight text-[var(--text-primary)]">
                  {balance.toLocaleString('en-IN')}
               </h2>
               <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
                  <TrendingUp size={12} />
                  +18.5%
               </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-[var(--border-subtle)]">
                 <div className="space-y-1">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Active Plans</p>
                    <p className="text-xl font-bold text-[var(--text-primary)]">{activeSubscribers}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Fleet Utilization</p>
                    <p className="text-xl font-bold text-blue-500">94.2%</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Avg. Plan Value</p>
                    <p className="text-xl font-bold text-emerald-600">₹850</p>
                 </div>
             </div>
          </div>

          {/* Asset Tracking Mock */}
          <div className="relative group h-80 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-hidden shadow-sm">
             <div className="absolute inset-0 bg-slate-900/50 pointer-events-none">
                <svg className="w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <pattern id="grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-emerald-500"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                </svg>
                
                {/* Status Nodes */}
                <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-emerald-500 rounded-full blur-[4px] opacity-40 animate-pulse" />
                <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-blue-500 rounded-full" />
                <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-emerald-500 rounded-full" />
                <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-red-500 rounded-full blur-[2px] opacity-30" />
             </div>

             <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-transparent to-transparent opacity-90" />

             <div className="absolute top-5 left-5 flex items-center gap-3">
                <div className="px-3 py-1.5 bg-[var(--bg-secondary)]/90 border border-[var(--border-subtle)] rounded-lg flex items-center gap-2 shadow-sm">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Fleet Tracking Live</span>
                </div>
                <div className="px-3 py-1.5 bg-[var(--bg-secondary)]/90 border border-[var(--border-subtle)] rounded-lg flex items-center gap-2 shadow-sm">
                   <Navigation size={12} className="text-blue-500" />
                   <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Hub Perimeter</span>
                </div>
             </div>

             <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <div className="space-y-0.5">
                   <h3 className="text-lg font-bold text-[var(--text-primary)]">Node Coverage</h3>
                   <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">8 assets triangulated within 5.2km</p>
                </div>
                <button className="p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all active:scale-95 shadow-lg">
                   <ArrowRight size={18} />
                </button>
             </div>
          </div>
        </div>

        {/* Right Column: Activity & Peak Forecast */}
        <div className="space-y-6 flex flex-col h-full gsap-card">
           <div className="flex flex-col h-full rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-hidden p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                 <div className="space-y-0.5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">Node Activity</h3>
                    <p className="text-[10px] font-medium text-[var(--text-tertiary)] uppercase">Operational event log</p>
                 </div>
                 <div className="p-2 text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer">
                    <Clock size={16} />
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar pr-1">
                 <ActivityFeed />
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
                 <button className="w-full py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">
                    Full Operations Log
                 </button>
              </div>
           </div>

           {/* Peak Forecast Card */}
           <div className="p-6 rounded-xl bg-emerald-600/5 border border-emerald-500/10 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] border border-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-sm">
                    <Calendar size={20} />
                 </div>
                 <div className="space-y-0.5">
                    <h4 className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider">Demand Forecast</h4>
                    <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Efficiency: High</p>
                 </div>
              </div>
              <p className="text-[var(--text-secondary)] text-[11px] font-medium leading-relaxed mb-5">
                 Peak demand window detected: <span className="text-[var(--text-primary)] font-bold">11 AM - 3 PM</span>. 
                 Optimize hub inventory for high-throughput handovers.
              </p>
              <div className="w-full h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-emerald-500" 
                 />
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
