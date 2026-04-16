import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Warehouse, 
  MapPin, 
  Activity, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Zap,
  Users,
  Box,
  IndianRupee,
  Signal,
  MoreHorizontal,
  Settings,
  AlertTriangle,
  ChevronRight,
  Battery,
  Map as MapIcon,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminDataStore } from '../store/adminDataStore';

export default function HubDetailsPage() {
  const { hubId } = useParams();
  const navigate = useNavigate();
  const { hubs } = useAdminDataStore();
  const [hub, setHub] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    const foundHub = hubs.find(h => (h._id || h.id).toString() === hubId);
    if (foundHub) setHub(foundHub);

    const handleClickOutside = () => setActiveMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [hubId, hubs]);

  if (!hub) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto" />
          <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Locating Hub Node...</p>
        </div>
      </div>
    );
  }

  const sections = [
    { title: "Fleet Management", icon: Box, count: hub.fleet, color: "emerald" },
    { title: "Active Users", icon: Users, count: hub.subs, color: "blue" },
    { title: "Hub Health", icon: Activity, count: hub.health, color: "rose" },
    { title: "Rev. Target", icon: TrendingUp, count: "92%", color: "amber" },
  ];

  const handleAction = (e, vehicleId, action) => {
    e.stopPropagation();
    alert(`${action.toUpperCase()} requested for ${vehicleId}`);
    setActiveMenu(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg hover:border-emerald-500/30 transition-all active:scale-95"
        >
          <ArrowLeft size={14} className="text-emerald-500 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-wider text-[var(--text-primary)]">Back to Registry</span>
        </button>

        <div className="flex items-center gap-2">
          <button className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-tertiary)] hover:text-emerald-500 transition-colors">
            <Settings size={16} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-md shadow-emerald-950/20 active:scale-95">
            Manual Override
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-6"
      >
        <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
          <Warehouse size={120} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/10">
              <Warehouse size={24} />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-[var(--text-primary)] uppercase italic tracking-tighter">
                  {hub.name}
                </h1>
                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                  {hub.status}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
                <span className="flex items-center gap-1"><MapPin size={10} className="text-emerald-500" /> {hub.city}</span>
                <span className="w-1 h-1 bg-[var(--border-subtle)] rounded-full" />
                <span className="text-emerald-500">ID: {hub.id}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="space-y-0.5">
              <p className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Operational Uptime</p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-[var(--text-primary)] italic">99.8%</span>
                <div className="flex gap-0.5">
                    {[1, 2, 3, 4].map(i => <div key={i} className="w-0.5 h-3 bg-emerald-500 rounded-full" />)}
                </div>
              </div>
            </div>
            
            <div className="w-px h-8 bg-[var(--border-subtle)]" />

            <div className="space-y-0.5">
              <p className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">MTD Revenue</p>
              <div className="flex items-center gap-1.5">
                <IndianRupee size={12} className="text-emerald-500" />
                <span className="text-lg font-black text-[var(--text-primary)] italic">{(hub.revenue / 100000).toFixed(2)}L</span>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-center space-y-0.5">
                <p className="text-[7px] font-black text-[var(--text-tertiary)] uppercase tracking-widest leading-none">Latency</p>
                <div className="flex items-center justify-center gap-1 text-emerald-500">
                  <Signal size={12} />
                  <span className="text-sm font-black">98ms</span>
                </div>
              </div>
              <div className="px-4 py-3 bg-emerald-600 text-white rounded-xl text-center space-y-0.5 shadow-md shadow-emerald-950/10">
                <p className="text-[7px] font-black text-emerald-100 uppercase tracking-widest leading-none opacity-80">Sync</p>
                <div className="flex items-center justify-center gap-1">
                  <Zap size={12} fill="white" />
                  <span className="text-sm font-black uppercase">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="group p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl hover:border-emerald-500/30 transition-all relative overflow-hidden"
          >
            <div className="absolute -right-2 -bottom-2 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
              <section.icon size={60} />
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg bg-${section.color}-500/10 border border-${section.color}-500/20 flex items-center justify-center text-${section.color}-500`}>
                <section.icon size={16} />
              </div>
              <div className="space-y-0">
                <p className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest leading-none">{section.title}</p>
                <p className="text-xl font-black text-[var(--text-primary)] italic tracking-tight">{section.count}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Fleet Tracking */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="space-y-0">
              <h2 className="text-base font-black text-[var(--text-primary)] uppercase tracking-tighter italic">Live <span className="text-emerald-500">Fleet Oversight</span></h2>
              <p className="text-[8px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Monitoring {hub.fleet} Connected Vehicles</p>
            </div>
            <div className="flex gap-1.5">
              <button className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)] transition-all">
                <Search size={14} />
              </button>
              <button className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)] transition-all">
                <Filter size={14} />
              </button>
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-tertiary)]/20">
               <div className="flex gap-4">
                  {['ALL', 'MOVING', 'IDLE', 'ERROR'].map((tab, i) => (
                    <button key={tab} className={`text-[8px] font-black uppercase tracking-widest ${i === 0 ? 'text-emerald-500' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'} transition-colors`}>
                      {tab}
                    </button>
                  ))}
               </div>
               <button className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-emerald-500 hover:underline">
                  Matrix <MapIcon size={10} />
               </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">
                    <th className="px-6 py-3">Vehicle ID</th>
                    <th className="px-6 py-3">Rider Entity</th>
                    <th className="px-6 py-3">Battery</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {[1, 2, 3, 4, 5, 6].map((_, idx) => (
                    <tr key={idx} className="group hover:bg-[var(--bg-tertiary)]/30 transition-colors">
                      <td className="px-6 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-[var(--bg-tertiary)] flex items-center justify-center text-emerald-500 font-black text-[9px]">
                            EV
                          </div>
                          <span className="text-[10px] font-black text-[var(--text-primary)]">FLEX-90{idx}A</span>
                        </div>
                      </td>
                      <td className="px-6 py-2.5 text-[10px] font-bold text-[var(--text-tertiary)]">{idx % 2 === 0 ? 'Siddharth M.' : 'Pooja Hegde'}</td>
                      <td className="px-6 py-2.5">
                        <div className="flex items-center gap-2">
                          <Battery size={12} className={idx === 3 ? 'text-rose-500' : 'text-emerald-500'} />
                          <span className={`text-[10px] font-black ${idx === 3 ? 'text-rose-500' : 'text-[var(--text-primary)]'}`}>{90 - (idx * 15)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest border ${idx % 3 === 0 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                          {idx % 3 === 0 ? 'Moving' : 'Idle'}
                        </span>
                      </td>
                      <td className="px-6 py-2.5 relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenu(activeMenu === idx ? null : idx);
                          }}
                          className={`p-1 hover:bg-emerald-600/10 hover:text-emerald-500 rounded transition-all ${activeMenu === idx ? 'text-emerald-500 bg-emerald-600/10' : 'text-[var(--text-tertiary)]'}`}
                        >
                          <MoreHorizontal size={14} />
                        </button>

                        <AnimatePresence>
                          {activeMenu === idx && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute right-12 top-0 z-50 w-36 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl shadow-xl overflow-hidden"
                            >
                              <div className="p-1.5 flex flex-col gap-1">
                                {[
                                  { label: 'Remote Lock', icon: ShieldCheck, color: 'rose' },
                                  { label: 'Ring Alarm', icon: Zap, color: 'amber' },
                                  { label: 'Service Log', icon: Clock, color: 'blue' },
                                  { label: 'Maintenance', icon: Settings, color: 'emerald' }
                                ].map((item) => (
                                  <button 
                                    key={item.label}
                                    onClick={(e) => handleAction(e, `FLEX-90${idx}A`, item.label)}
                                    className="flex items-center gap-2.5 px-3 py-2 text-[8px] font-black uppercase tracking-wider text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors w-full text-left"
                                  >
                                    <item.icon size={12} className={`text-${item.color}-500`} />
                                    {item.label}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t border-[var(--border-subtle)] text-center">
               <button className="text-[8px] font-black uppercase tracking-widest text-[var(--text-tertiary)] hover:text-emerald-500 transition-colors">
                  View Full Registry
               </button>
            </div>
          </div>
        </div>

        {/* Intelligence Sidebars */}
        <div className="space-y-6">
          {/* Security & Alerts */}
          <div className="space-y-3">
             <h2 className="text-base font-black text-[var(--text-primary)] uppercase tracking-tighter italic">Anomaly <span className="text-rose-500">Alerts</span></h2>
             <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-4 space-y-4">
                {[
                  { title: "Geofence Violation", time: "2m", desc: "EV-9012 left zone", color: "rose" },
                  { title: "Thermal Warning", time: "14m", desc: "Station #4 high temp", color: "amber" },
                ].map((alert, i) => (
                  <div key={i} className="flex gap-3 group">
                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-${alert.color}-500 shrink-0`} />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-black text-[var(--text-primary)] uppercase italic leading-none">{alert.title}</p>
                        <span className="text-[7px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">{alert.time}</span>
                      </div>
                      <p className="text-[9px] text-[var(--text-tertiary)] font-medium italic leading-tight">{alert.desc}</p>
                    </div>
                  </div>
                ))}
                <button className="w-full py-2.5 bg-rose-500/5 border border-rose-500/10 rounded-xl text-[8px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-500/10 transition-all">
                  Resolve All
                </button>
             </div>
          </div>

          {/* Infrastructure Health */}
          <div className="space-y-3">
             <h2 className="text-base font-black text-[var(--text-primary)] uppercase tracking-tighter italic">Infra <span className="text-emerald-500">Pulse</span></h2>
             <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Grid Stability</p>
                    <span className="text-[8px] font-black text-emerald-500 uppercase">92%</span>
                  </div>
                  <div className="w-full h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '92%' }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Storage Used</p>
                    <span className="text-[8px] font-black text-amber-500 uppercase">88%</span>
                  </div>
                  <div className="w-full h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: '88%' }} />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[var(--border-subtle)]">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-emerald-500" />
                    <span className="text-[8px] font-black text-[var(--text-primary)] uppercase">Security Protocol</span>
                  </div>
                  <div className="w-8 h-4 bg-emerald-600/20 rounded-full relative p-0.5 cursor-pointer">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full ml-auto shadow-sm" />
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
