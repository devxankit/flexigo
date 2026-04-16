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
  CreditCard,
  CheckCircle2
} from 'lucide-react';
import { useRiderAssignmentStore } from '../store/riderAssignmentStore';
import { useFleetStore } from '../store/fleetStore';
import GlassTable from '../components/GlassTable';
import StatusBadge from '../components/StatusBadge';
import OpsFilter from '../components/OpsFilter';

export default function SubscriberConsole() {
  const { subscribers = [], fetchSubscribers } = useRiderAssignmentStore();
  const { vehicles = [], fetchVehicles } = useFleetStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    range: 'Last 7 Days',
    metrics: {}
  });

  useEffect(() => {
    fetchSubscribers();
    fetchVehicles();
  }, [fetchSubscribers, fetchVehicles]);

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    console.log('Subscriber Filter Sync:', newFilters);
  };

  const filteredSubscribers = useMemo(() => {
    if (!subscribers) return [];
    return subscribers.filter(s => {
      const q = searchQuery.toLowerCase();
      return (
        (s.name?.toLowerCase() || '').includes(q) || 
        (s.phone || '').includes(q) ||
        (s._id?.toLowerCase() || s.id?.toLowerCase() || '').includes(q) ||
        (s.licenseNo?.toLowerCase() || '').includes(q) ||
        (s.vehicleId?.toLowerCase() || '').includes(q)
      );
    });
  }, [subscribers, searchQuery]);

  const utilization = vehicles.length > 0 ? ((subscribers.filter(s => s.status === 'active').length / vehicles.length) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-3 pb-8">
      {/* Page Header omitted for brevity */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3 bg-blue-500 rounded-full" />
            <h1 className="text-lg font-black tracking-tighter text-[var(--text-primary)] uppercase italic leading-none">
              PERSONNEL <span className="text-blue-500">REGISTRY</span>
            </h1>
          </div>
          <p className="text-[7.5px] font-black uppercase tracking-[0.3em] text-[var(--text-tertiary)] ml-3 italic opacity-60 leading-none mt-1">
             NETWORK_ALLOCATION • SUBSCRIBER_PERSISTENCE
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
           <div className="relative flex-1 md:w-48 group">
              <Search size={10} className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-600 group-focus-within:text-blue-500 transition-colors" />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH_PERSONNEL..." 
                className="w-full pl-8 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-[7.5px] font-black uppercase tracking-widest text-[var(--text-primary)] focus:outline-none focus:border-blue-500/30 transition-all placeholder:text-slate-600 italic shadow-inner leading-none"
              />
           </div>
           
           <OpsFilter 
             onFilterChange={handleFilterChange}
             filters={[
               { id: 'status', label: 'PERSONNEL_STATUS', options: ['Active', 'Pending', 'Suspended'] },
               { id: 'plan', label: 'SUB_TIER', options: ['Standard', 'Premium', 'Enterprise'] }
             ]}
           />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
         {[
           { label: 'ACTIVE_PERSONNEL', val: subscribers.filter(s => s.status === 'active').length.toString().padStart(2, '0'), icon: Users, color: 'emerald' },
           { label: 'NETWORK_UTILIZATION', val: `${utilization}%`, icon: Zap, color: 'blue' },
           { label: 'REGISTRY_QUEUE', val: subscribers.filter(s => s.status === 'pending').length.toString().padStart(2, '0'), icon: Calendar, color: 'amber' }
         ].map((m, i) => (

           <motion.div 
             key={m.label}
             initial={{ opacity: 0, y: 5 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.05 }}
             className="px-5 py-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center gap-4 shadow-inner hover:border-[var(--border-subtle)] transition-all group overflow-hidden relative"
           >
              <div className="absolute top-0 right-0 p-3 opacity-[0.03] scale-125 rotate-12 transition-transform group-hover:rotate-45">
                 <m.icon size={60} />
              </div>
              <div className={`w-10 h-10 rounded-xl bg-${m.color}-500/10 flex items-center justify-center text-${m.color}-500 shadow-inner`}>
                 <m.icon size={20} strokeWidth={2.5} />
              </div>
              <div className="space-y-1 relative z-10">
                 <p className="text-[7.5px] font-black uppercase tracking-[0.3em] text-[var(--text-tertiary)] italic leading-none opacity-80">{m.label}</p>
                 <h4 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter italic leading-none mt-1">{m.val}</h4>
              </div>
           </motion.div>
         ))}
      </div>

      {/* Main Table */}
      <GlassTable 
         columns={[
           {
             header: 'PERSONNEL_PROFILE',
             accessor: 'name',
             render: (row) => (
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-inner">
                     <UserIcon size={14} strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[9.5px] font-black text-[var(--text-primary)] uppercase italic leading-none tracking-tighter">{row.name}</span>
                     <span className="text-[6.5px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] mt-1.5 italic leading-none opacity-80">{row.phone}</span>
                  </div>
               </div>
             )
           },
           {
             header: 'NODE_ALLOCATION',
             accessor: 'vehicleId',
             render: (row) => {
               const vehicle = vehicles.find(v => (v._id || v.id) === row.vehicleId);
               return vehicle ? (
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-emerald-500 shadow-inner">
                       <Truck size={14} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-emerald-500 text-[9.5px] font-black tracking-tighter italic leading-none">{vehicle.plate || vehicle.licensePlate}</span>
                       <span className="text-[6.5px] font-black text-[var(--text-tertiary)] uppercase italic tracking-[0.2em] mt-1.5 leading-none opacity-80">{vehicle.model}</span>
                    </div>
                 </div>
               ) : (
                 <span className="text-[7px] font-black text-slate-600 uppercase tracking-[0.3em] italic opacity-60">NULL_ALLOCATION</span>
               );
             }
           },
           {
             header: 'SUBSCRIPTION_TIER',
             accessor: 'subscriptionPlan',
             render: (row) => (
               <div className="flex flex-col">
                  <span className="text-[8.5px] font-black text-[var(--text-primary)] uppercase italic tracking-[0.2em] leading-none">{row.subscriptionPlan?.toUpperCase()}</span>
                  <div className="flex items-center gap-1.5 mt-1.5 opacity-80">
                     <CreditCard size={10} className="text-blue-500" />
                     <span className="text-[6.5px] font-black text-blue-500 uppercase tracking-[0.2em] italic leading-none">NODE_LEASE</span>
                  </div>
               </div>
             )
           },
           {
             header: 'PROTOCOL_STATUS',
             accessor: 'status',
             render: (row) => <StatusBadge status={row.status} />
           },
           {
             header: 'HANDSHAKE_TX',
             accessor: 'subscriptionStart',
             render: (row) => (
               <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 text-[8.5px] font-black text-[var(--text-primary)] italic leading-none">
                     <Clock size={10} strokeWidth={2.5} className="text-slate-600" />
                     {row.subscriptionStart ? new Date(row.subscriptionStart).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }).toUpperCase() : 'N/A'}
                  </div>
                  {row.subscriptionEnd && (
                    <div className="flex items-center gap-1.5 text-[6.5px] font-black text-amber-500 uppercase tracking-[0.3em] mt-2 italic opacity-80 leading-none">
                      <Calendar size={10} strokeWidth={2.5} />
                      EXPIRE {new Date(row.subscriptionEnd).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }).toUpperCase()}
                    </div>
                  )}
               </div>
             )
           },
           {
             header: '',
             accessor: 'actions',
             render: (row) => (
               <div className="flex items-center gap-1.5">
                  <button className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl hover:bg-blue-600/10 hover:border-blue-500/20 hover:text-blue-500 transition-all text-slate-600 shadow-inner">
                     <MessageSquare size={12} strokeWidth={2.5} />
                  </button>
                  <button className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl hover:bg-white/5 hover:border-[var(--border-subtle)] hover:text-white transition-all text-slate-600 shadow-inner">
                     <MoreVertical size={12} strokeWidth={2.5} />
                  </button>
               </div>
            )
           }
         ]} 
         data={filteredSubscribers} 
         onRowClick={(row) => console.log('Viewing Personnel:', row)} 
      />
    </div>
  );
}
