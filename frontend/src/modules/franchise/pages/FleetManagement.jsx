import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Plus, 
  Battery, 
  MapPin, 
  History, 
  FileText, 
  Settings, 
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowLeft,
  Navigation,
  X
} from 'lucide-react';
import { useFleetStore } from '../store/fleetStore';
import GlassTable from '../components/GlassTable';
import StatusBadge from '../components/StatusBadge';

export default function FleetManagement() {
  const navigate = useNavigate();
  const { vehicles, filter, setFilter } = useFleetStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchesFilter = filter === 'all' || v.status === filter;
      const matchesSearch = v.plate.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           v.vin.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [vehicles, filter, searchQuery]);

  const columns = [
    { 
      header: 'Vehicle Identifier', 
      accessor: 'plate', 
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-emerald-600 dark:text-emerald-500 text-sm font-black tracking-tight">{row.plate}</span>
          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">{row.model}</span>
        </div>
      )
    },
    { 
      header: 'VIN Number', 
      accessor: 'vin', 
      render: (row) => <span className="text-[10px] font-bold text-[var(--text-secondary)] font-mono tracking-wider uppercase">{row.vin}</span>
    },
    { 
      header: 'Hub Status', 
      accessor: 'status', 
      render: (row) => <StatusBadge status={row.status} /> 
    },
    { 
      header: 'Energy State', 
      accessor: 'battery', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex-1 w-16 h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${row.battery}%` }}
               className={`h-full ${
                 row.battery > 60 ? 'bg-emerald-500' : row.battery > 20 ? 'bg-amber-500' : 'bg-red-500'
               }`} 
             />
          </div>
          <span className="text-[10px] font-bold text-[var(--text-secondary)]">{row.battery}%</span>
        </div>
      )
    },
    { 
      header: 'Compliance Alerts', 
      accessor: 'insuranceExpiry', 
      render: (row) => (
        <div className="flex items-center gap-3">
            <div className={`px-2 py-0.5 rounded border text-[9px] font-bold flex items-center gap-1.5 ${
              new Date(row.pUCExpiry) < new Date() ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-[var(--bg-tertiary)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
            }`}>
             <span className="uppercase tracking-tighter">PUC</span>
             <span>{row.pUCExpiry.split('-')[1]}/{row.pUCExpiry.split('-')[0].slice(2)}</span>
           </div>
            <div className="px-2 py-0.5 rounded bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] text-[9px] font-bold flex items-center gap-1.5">
              <span className="uppercase tracking-tighter">INS</span>
              <span>{row.insuranceExpiry.split('-')[1]}/{row.insuranceExpiry.split('-')[0].slice(2)}</span>
            </div>
        </div>
      )
    },
    { 
      header: '', 
      accessor: 'actions', 
      render: (row) => (
        <button 
          onClick={(e) => { e.stopPropagation(); setSelectedVehicle(row); }}
          className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-all text-[var(--text-tertiary)] hover:text-emerald-500"
        >
          <ChevronRight size={18} />
        </button>
      )
    }
  ];

  const filterTabs = [
    { id: 'all', label: 'Whole Fleet' },
    { id: 'available', label: 'Idle / Available' },
    { id: 'assigned', label: 'Active Leases' },
    { id: 'in-transit', label: 'In-Transit' },
    { id: 'in-service', label: 'Maintenance' },
    { id: 'quarantined', label: 'Quarantined' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-emerald-500 rounded-full" />
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Fleet <span className="text-emerald-500">Inventory</span>
            </h1>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider ml-4 text-[var(--text-tertiary)]">
             Operational Asset Directory • Central Registry
          </p>
        </div>

        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all flex items-center gap-2 active:scale-95 shadow-sm">
           <Plus size={16} strokeWidth={2.5} /> Register Asset
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
         {/* Filter Tabs */}
         <div className="flex bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-1 rounded-lg overflow-x-auto no-scrollbar max-w-full shadow-sm">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 ${
                  filter === tab.id 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
         </div>

         {/* Search Bar - Professional Pill */}
         <div className="relative w-full lg:w-80 group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[var(--text-tertiary)] group-focus-within:text-emerald-500 transition-colors">
               <Search size={16} />
            </div>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Plate or VIN..." 
              className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all font-medium placeholder:text-[var(--text-tertiary)]"
            />
         </div>
      </div>

      {/* Table Section */}
      <GlassTable 
        columns={columns} 
        data={filteredVehicles} 
        onRowClick={setSelectedVehicle}
        emptyMessage={`No ${filter !== 'all' ? filter : ''} assets registered`}
      />

      {/* Vehicle Detail Slide-in Drawer - Professional B2B */}
      <AnimatePresence>
        {selectedVehicle && (
          <>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelectedVehicle(null)}
               className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] z-[60]"
            />
            <motion.div
               initial={{ x: '100%' }}
               animate={{ x: 0 }}
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 30, stiffness: 300 }}
               className="fixed top-0 right-0 h-full w-full max-w-xl bg-[var(--bg-secondary)] border-l border-[var(--border-subtle)] z-[70] shadow-2xl flex flex-col"
            >
               {/* Drawer Header */}
               <div className="flex items-center justify-between px-8 h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/10">
                  <div className="flex items-center gap-4">
                     <button 
                        onClick={() => setSelectedVehicle(null)}
                        className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-all"
                     >
                        <X size={18} />
                     </button>
                     <div className="h-4 w-px bg-[var(--border-subtle)]" />
                     <button 
                        onClick={() => navigate(`/franchise/fleet/${selectedVehicle.id}`)}
                        className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-700 font-sans"
                     >
                        Detailed Profile →
                     </button>
                  </div>
                  <div className="flex items-center gap-3">
                     <StatusBadge status={selectedVehicle.status} />
                     <button className="p-2 text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-all">
                        <MoreVertical size={18} />
                     </button>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto no-scrollbar p-8">
                  {/* Vehicle Identity */}
                  <div className="flex items-start gap-6 mb-10">
                     <div className="w-24 h-24 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-sm">
                        <Zap size={32} />
                     </div>
                     <div className="flex-1 min-w-0 pt-2">
                        <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                           {selectedVehicle.plate}
                        </h2>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded uppercase tracking-wider">
                              {selectedVehicle.model}
                           </span>
                           <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest font-mono">
                              VIN: {selectedVehicle.vin}
                           </span>
                        </div>
                     </div>
                  </div>

                  {/* Operational Summary */}
                  <div className="grid grid-cols-3 gap-4 mb-10">
                     <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]/30 border border-[var(--border-subtle)] space-y-2">
                        <div className="text-emerald-600 flex items-center gap-2">
                           <Battery size={14} />
                           <span className="text-[9px] font-bold uppercase tracking-wider opacity-60 text-[var(--text-primary)]">Efficiency</span>
                        </div>
                        <p className="text-xl font-bold text-[var(--text-primary)]">{selectedVehicle.battery}%</p>
                     </div>
                     <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]/30 border border-[var(--border-subtle)] space-y-2">
                        <div className="text-blue-500 flex items-center gap-2">
                           <Navigation size={14} />
                           <span className="text-[9px] font-bold uppercase tracking-wider opacity-60 text-[var(--text-primary)]">Range</span>
                        </div>
                        <p className="text-xl font-bold text-[var(--text-primary)]">{selectedVehicle.range} <span className="text-[10px] opacity-40">KM</span></p>
                     </div>
                     <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]/30 border border-[var(--border-subtle)] space-y-2">
                        <div className="text-amber-500 flex items-center gap-2">
                           <ShieldCheck size={14} />
                           <span className="text-[9px] font-bold uppercase tracking-wider opacity-60 text-[var(--text-primary)]">Health</span>
                        </div>
                        <p className="text-xl font-bold text-[var(--text-primary)]">Optimum</p>
                     </div>
                  </div>

                  {/* Logs Section */}
                  <div className="space-y-6">
                     <div className="flex items-center gap-6 border-b border-[var(--border-subtle)]">
                        <button className="px-1 py-3 text-[10px] font-bold uppercase tracking-widest text-emerald-600 border-b-2 border-emerald-600">Maintenance Activity</button>
                        <button className="px-1 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">Documentation</button>
                     </div>

                     <div className="space-y-3">
                        {selectedVehicle.maintenanceLogs.length > 0 ? (
                          selectedVehicle.maintenanceLogs.map((log, i) => (
                            <div key={i} className="flex gap-4 p-4 bg-[var(--bg-tertiary)]/20 border border-[var(--border-subtle)] rounded-xl group hover:bg-[var(--bg-tertiary)] transition-all">
                               <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                  <History size={14} className="text-slate-400" />
                               </div>
                               <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                     <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-tight">{log.type}</h4>
                                     <span className="text-[9px] font-medium text-[var(--text-tertiary)]">{log.date}</span>
                                  </div>
                                  <p className="text-[10px] font-medium text-[var(--text-tertiary)]">Certified Hub Technician: {log.staff}</p>
                               </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-12 border-2 border-dashed border-[var(--border-subtle)] rounded-xl flex flex-col items-center justify-center gap-3 text-center">
                             <History size={24} className="text-[var(--text-tertiary)] opacity-30" />
                             <div className="space-y-0.5">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Log Under Review</p>
                                <p className="text-[9px] font-medium text-[var(--text-tertiary)] opacity-60 uppercase">Healthy asset history</p>
                             </div>
                          </div>
                        )}
                     </div>
                  </div>
               </div>

               {/* Drawer Footer */}
               <div className="p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/10 grid grid-cols-2 gap-3">
                  <button className="py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all flex items-center justify-center gap-2">
                     <FileText size={14} /> Compliance Audit
                  </button>
                  <button className="py-2.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-sm">
                     <Settings size={14} /> Service Console
                  </button>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
