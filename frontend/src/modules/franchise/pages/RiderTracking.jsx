import { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { 
  Users, 
  Search, 
  Calendar, 
  Zap, 
  MoreVertical,
  Navigation,
  MessageSquare,
  ShieldCheck,
  Clock,
  Filter,
  Truck,
  User as UserIcon,
  ChevronRight,
  CreditCard,
  CheckCircle2
} from 'lucide-react';
import { useRiderAssignmentStore } from '../store/riderAssignmentStore';
import { useFleetStore } from '../store/fleetStore';
import GlassTable from '../components/GlassTable';
import StatusBadge from '../components/StatusBadge';

export default function SubscriberConsole() {
  const { subscribers = [] } = useRiderAssignmentStore();
  const { vehicles = [] } = useFleetStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubscribers = useMemo(() => {
    if (!subscribers) return [];
    return subscribers.filter(s => 
      (s.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
      (s.phone || '').includes(searchQuery)
    );
  }, [subscribers, searchQuery]);

  const columns = [
    {
      header: 'Subscriber',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-sm">
              <UserIcon size={20} />
           </div>
           <div className="flex flex-col">
              <span className="text-sm font-bold text-[var(--text-primary)]">{row.name}</span>
              <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">{row.phone}</span>
           </div>
        </div>
      )
    },
    {
      header: 'Assigned EV',
      accessor: 'vehicleId',
      render: (row) => {
        const vehicle = vehicles.find(v => v.id === row.vehicleId);
        return vehicle ? (
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] flex items-center justify-center text-emerald-600">
                <Truck size={16} />
             </div>
             <div className="flex flex-col">
                <span className="text-emerald-600 text-xs font-bold tracking-tight">{vehicle.plate}</span>
                <span className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase">{vehicle.model}</span>
             </div>
          </div>
        ) : (
          <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest italic opacity-50">No EV Assigned</span>
        );
      }
    },
    {
      header: 'Subscription Plan',
      accessor: 'subscriptionPlan',
      render: (row) => (
        <div className="flex flex-col">
           <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-tight">{row.subscriptionPlan}</span>
           <div className="flex items-center gap-1.5 mt-0.5">
              <CreditCard size={10} className="text-emerald-500" />
              <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Active Lease</span>
           </div>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Subscription Period',
      accessor: 'subscriptionStart',
      render: (row) => (
        <div className="flex flex-col">
           <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)]">
              <Clock size={12} className="text-[var(--text-tertiary)]" />
              {row.subscriptionStart ? new Date(row.subscriptionStart).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Not Started'}
           </div>
           {row.subscriptionEnd && (
             <div className="flex items-center gap-1.5 text-[9px] font-bold text-amber-500 uppercase tracking-widest mt-0.5">
               <Calendar size={10} />
               Ends {new Date(row.subscriptionEnd).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
             </div>
           )}
        </div>
      )
    },
    {
      header: '',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
           <button className="p-2 border border-[var(--border-subtle)] rounded-lg hover:bg-emerald-600/10 hover:text-emerald-600 transition-all text-[var(--text-tertiary)] shadow-sm">
              <MessageSquare size={16} />
           </button>
           <button className="p-2 border border-[var(--border-subtle)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-all text-[var(--text-tertiary)] shadow-sm">
              <MoreVertical size={16} />
           </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-blue-500 rounded-full shadow-sm" />
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] uppercase">
              Subscriber <span className="text-blue-500">Console</span>
            </h1>
          </div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest ml-4 text-[var(--text-secondary)] opacity-80">
             Active Subscription Monitoring • EV Fleet Allocation
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:w-72 group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[var(--text-tertiary)] group-focus-within:text-blue-500 transition-colors">
                 <Search size={16} />
              </div>
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subscribers..." 
                className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all font-medium placeholder:text-[var(--text-tertiary)] shadow-sm"
              />
           </div>
           
           <button className="p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] transition-all active:scale-95 shadow-sm">
              <Filter size={18} />
           </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center gap-4 shadow-sm hover:border-emerald-500/20 transition-all"
         >
            <div className="w-11 h-11 rounded-lg bg-emerald-600/10 flex items-center justify-center text-emerald-600 border border-emerald-500/10">
               <Users size={22} />
            </div>
            <div className="space-y-0.5">
               <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Active Subscribers</p>
               <h4 className="text-xl font-bold text-[var(--text-primary)]">{subscribers.filter(s => s.status === 'active').length}</h4>
            </div>
         </motion.div>
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center gap-4 shadow-sm hover:border-blue-500/20 transition-all"
         >
            <div className="w-11 h-11 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-500/10">
               <Zap size={22} />
            </div>
            <div className="space-y-0.5">
               <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Fleet Utilization</p>
               <h4 className="text-xl font-bold text-[var(--text-primary)]">88%</h4>
            </div>
         </motion.div>
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
           className="p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center gap-4 shadow-sm hover:border-amber-500/20 transition-all"
         >
            <div className="w-11 h-11 rounded-lg bg-amber-600/10 flex items-center justify-center text-amber-500 border border-amber-500/10">
               <Calendar size={22} />
            </div>
            <div className="space-y-0.5">
               <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Pending Onboarding</p>
               <h4 className="text-xl font-bold text-[var(--text-primary)]">{subscribers.filter(s => s.status === 'pending').length}</h4>
            </div>
         </motion.div>
      </div>

      {/* Main Table */}
      <GlassTable 
         columns={columns} 
         data={filteredSubscribers} 
         onRowClick={(row) => console.log('Viewing Subscriber:', row)} 
      />

      {/* Subscription Management Console */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="p-8 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm overflow-hidden relative"
      >
         <div className="absolute top-0 right-0 p-12 opacity-[0.02] scale-[2.5] rotate-12 pointer-events-none">
            <CreditCard size={120} className="text-blue-500" />
         </div>
         
         <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600 shadow-sm">
               <CreditCard size={28} />
            </div>
            <div className="space-y-1">
               <h3 className="text-lg font-bold text-[var(--text-primary)] leading-tight uppercase tracking-tight">Subscription Management</h3>
               <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider italic">Manage EV lease plans, renewals and subscriber onboarding</p>
            </div>
         </div>
         
         <button className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95 relative z-10 flex items-center gap-2">
            Add New Subscriber <ChevronRight size={14} strokeWidth={3} />
         </button>
      </motion.div>

    </div>
  );
}
