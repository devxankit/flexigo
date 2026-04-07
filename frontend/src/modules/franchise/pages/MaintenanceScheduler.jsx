import React, { useState } from 'react';
import { 
  Wrench, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  History, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  MoreVertical,
  ChevronRight,
  Plus,
  ArrowRight,
  ShieldCheck,
  X,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFleetStore } from '../store/fleetStore';
import { useNavigate } from 'react-router-dom';

export default function MaintenanceScheduler() {
  const navigate = useNavigate();
  const { vehicles, addMaintenanceLog, updateVehicleStatus } = useFleetStore();
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const maintenanceHistory = vehicles.flatMap(v => 
    v.maintenanceLogs.map(log => ({ ...log, vehicleId: v.id, plate: v.plate }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  const [formData, setFormData] = useState({
    type: 'Regular Inspection',
    staff: '',
    notes: '',
    priority: 'Standard'
  });

  const handleBookService = (e) => {
    e.preventDefault();
    const v = vehicles.find(veh => veh.id === selectedVehicleId);
    if (!v) return;

    const newLog = {
      date: new Date().toISOString().split('T')[0],
      type: formData.type,
      staff: formData.staff,
      notes: formData.notes
    };

    addMaintenanceLog(selectedVehicleId, newLog);
    updateVehicleStatus(selectedVehicleId, 'in-service');
    setIsModalOpen(false);
    setFormData({ type: 'Regular Inspection', staff: '', notes: '', priority: 'Standard' });
    setSelectedVehicleId('');
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
               <h1 className="text-2xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Maintenance <span className="text-emerald-500">Scheduler</span>
               </h1>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-tertiary)] ml-4">
               Vehicle Health Registry • Fleet Persistence Hub
            </p>
         </div>
         
         <button 
           onClick={() => setIsModalOpen(true)}
           className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-950/20 active:scale-95"
         >
            <Plus size={16} strokeWidth={3} /> Book Service Node
         </button>
      </div>

      {/* Health Overview Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
         <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2rem] flex flex-col justify-between shadow-sm border-l-4 border-l-emerald-500">
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">System Online</span>
            <div>
               <h3 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter italic">98.2%</h3>
               <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase mt-1">Fleet Operational</p>
            </div>
         </div>
         <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2rem] flex flex-col justify-between shadow-sm border-l-4 border-l-amber-500">
            <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Requires Check</span>
            <div>
               <h3 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter italic">04</h3>
               <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase mt-1">Maintenance Alerts</p>
            </div>
         </div>
         <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2rem] flex flex-col justify-between shadow-sm border-l-4 border-l-rose-500">
            <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Ground Status</span>
            <div>
               <h3 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter italic">02</h3>
               <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase mt-1">Asset Quarantined</p>
            </div>
         </div>
         <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2rem] flex flex-col justify-between shadow-sm border-l-4 border-l-blue-500">
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Avg. Repair</span>
            <div>
               <h3 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter italic">3.4h</h3>
               <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase mt-1">Turnaround Time</p>
            </div>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Active/Upcoming Maintenance */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex border-b border-[var(--border-subtle)] gap-10">
               {['upcoming', 'in-service', 'critical'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 px-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${
                      activeTab === tab ? 'text-emerald-500' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                     {tab}
                     {activeTab === tab && (
                        <motion.div layoutId="maint-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                     )}
                  </button>
               ))}
            </div>

            <div className="space-y-4">
               {vehicles.filter(v => 
                  activeTab === 'in-service' ? v.status === 'in-service' :
                  activeTab === 'critical' ? v.status === 'quarantined' :
                  v.status === 'available' || v.status === 'assigned'
               ).map((vehicle) => (
                  <motion.div 
                    layout
                    key={vehicle.id}
                    className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2.5rem] flex items-center justify-between hover:border-emerald-500/30 transition-all group cursor-pointer shadow-sm"
                    onClick={() => navigate(`/franchise/fleet/${vehicle.id}`)}
                  >
                     <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${
                           vehicle.status === 'quarantined' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                           vehicle.status === 'in-service' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                           'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                        }`}>
                           <Wrench size={24} />
                        </div>
                        <div className="space-y-1">
                           <h4 className="text-base font-black text-[var(--text-primary)] uppercase tracking-tight italic leading-none">{vehicle.plate}</h4>
                           <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">{vehicle.model} • VIN: {vehicle.vin.slice(-4)}</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-8">
                        <div className="text-right hidden md:block">
                           <p className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest mb-1">Energy Index</p>
                           <p className={`text-[12px] font-black ${vehicle.battery < 20 ? 'text-rose-500' : 'text-emerald-500'}`}>{vehicle.battery}%</p>
                        </div>
                        <div className="h-8 w-px bg-[var(--border-subtle)] hidden md:block" />
                        <button className="p-3 bg-[var(--bg-tertiary)] hover:bg-emerald-600/10 rounded-2xl text-[var(--text-tertiary)] hover:text-emerald-500 transition-all group/btn">
                           <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>

         {/* Log Sidestrip */}
         <div className="space-y-6">
            <div className="p-8 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2.5rem] shadow-sm flex flex-col h-full max-h-[700px]">
               <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-3">
                     <History size={18} className="text-emerald-500" />
                     <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest italic leading-none">Node History</h3>
                  </div>
                  <div className="p-1 px-3 bg-emerald-500/10 rounded-full text-[8px] font-black text-emerald-500 uppercase tracking-widest border border-emerald-500/20">Archive Active</div>
               </div>

               <div className="space-y-5 flex-1 overflow-y-auto no-scrollbar pr-2">
                  {maintenanceHistory.map((log, i) => (
                     <div key={i} className="flex gap-4 p-4 bg-[var(--bg-tertiary)]/40 border border-[var(--border-subtle)] rounded-2xl group hover:border-emerald-500/20 transition-all">
                        <div className="space-y-2 flex-1">
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter italic">{log.plate}</span>
                              <span className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase">{log.date}</span>
                           </div>
                           <h4 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-tight">{log.type}</h4>
                           <div className="flex items-center gap-2 text-[9px] font-bold text-[var(--text-tertiary)] uppercase italic">
                              <User size={10} className="text-emerald-500" /> {log.staff}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>

               <button className="w-full mt-8 py-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-primary)] hover:text-emerald-500 hover:bg-emerald-600/5 transition-all">
                  Export PDF Logs
               </button>
            </div>
         </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
         {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[3rem] p-12 shadow-2xl space-y-10"
               >
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter italic">
                           Book <span className="text-emerald-500">Service Node</span>
                        </h2>
                        <p className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.4em]">Protocol: MAINT_SYNC_8.0</p>
                     </div>
                     <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-rose-600/10 hover:text-rose-500 transition-all rounded-2xl border border-transparent hover:border-rose-500/20">
                        <X size={24} />
                     </button>
                  </div>

                  <form onSubmit={handleBookService} className="space-y-8">
                     <div className="space-y-6">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] ml-2">Target Asset</label>
                           <select 
                             required
                             value={selectedVehicleId}
                             onChange={(e) => setSelectedVehicleId(e.target.value)}
                             className="w-full px-8 py-5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-3xl text-sm font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all appearance-none cursor-pointer italic"
                           >
                              <option value="">Select Vehicle...</option>
                              {vehicles.filter(v => v.status !== 'in-service').map(v => (
                                 <option key={v.id} value={v.id}>{v.plate} ({v.model})</option>
                              ))}
                           </select>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] ml-2">Service Type</label>
                              <select 
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                className="w-full px-8 py-5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-3xl text-[11px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer"
                              >
                                 <option>Regular Inspection</option>
                                 <option>BMS Recalibration</option>
                                 <option>Motor Optimization</option>
                                 <option>Tire/Brake Node</option>
                              </select>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] ml-2">Lead Technician</label>
                              <input 
                                required
                                value={formData.staff}
                                onChange={(e) => setFormData({...formData, staff: e.target.value})}
                                placeholder="Enter Name..."
                                className="w-full px-8 py-5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-3xl text-sm font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none italic transition-all placeholder:text-[var(--text-tertiary)]/50"
                              />
                           </div>
                        </div>

                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] ml-2">Observation Payload (Notes)</label>
                           <textarea 
                             rows={3}
                             value={formData.notes}
                             onChange={(e) => setFormData({...formData, notes: e.target.value})}
                             placeholder="Describe maintenance requirement..."
                             className="w-full px-8 py-5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-3xl text-[11px] font-bold uppercase tracking-widest outline-none no-scrollbar placeholder:text-[var(--text-tertiary)]/50"
                           />
                        </div>
                     </div>

                     <button 
                        type="submit"
                        className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[.4em] shadow-2xl shadow-emerald-950/40 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-4 group"
                     >
                        <Zap size={20} fill="white" className="group-hover:animate-bounce" /> Authorize Service Sync
                     </button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
