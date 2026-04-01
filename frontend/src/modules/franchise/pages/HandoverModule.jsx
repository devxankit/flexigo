import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Truck, 
  Battery, 
  CheckCircle2, 
  AlertCircle, 
  History,
  QrCode,
  Smartphone,
  CreditCard,
  Camera,
  ChevronRight,
  ArrowLeftRight,
  ChevronLeft,
  Calendar,
  Zap,
  Check
} from 'lucide-react';
import StepForm from '../components/StepForm';
import UploadCard from '../components/UploadCard';
import StatusBadge from '../components/StatusBadge';
import { useHandoverStore } from '../store/handoverStore';
import { useRiderAssignmentStore } from '../store/riderAssignmentStore';
import { useFleetStore } from '../store/fleetStore';

export default function HandoverModule() {
  const { activeStep, setStep, mode, setMode, handoverData, updateHandoverData, resetHandover } = useHandoverStore();
  const { subscribers, dispatchVehicle } = useRiderAssignmentStore();
  const { vehicles, updateVehicleStatus } = useFleetStore();

  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Derived lists
  const intakeSubscribers = useMemo(() => (subscribers || []).filter(s => s.status === 'active' || s.status === 'paused'), [subscribers]);
  const availableVehicles = useMemo(() => (vehicles || []).filter(v => v.status === 'available'), [vehicles]);
  const unassignedSubscribers = useMemo(() => (subscribers || []).filter(s => s.status === 'pending' || !s.vehicleId), [subscribers]);

  useEffect(() => {
    if (mode === 'intake' && selectedSubscriber) {
      const vehicle = vehicles.find(v => v.id === selectedSubscriber.vehicleId);
      setSelectedVehicle(vehicle);
      updateHandoverData({ subscriberId: selectedSubscriber.id, vehicleId: vehicle?.id });
    }
  }, [selectedSubscriber, vehicles, updateHandoverData, mode]);

  const handleNext = () => {
    const maxSteps = mode === 'dispatch' ? 4 : 3;
    if (activeStep < maxSteps) setStep(activeStep + 1);
    else {
      // Finalize based on mode
      if (mode === 'dispatch') {
        dispatchVehicle(handoverData.subscriberId, handoverData.vehicleId, handoverData.returnDate);
        updateVehicleStatus(handoverData.vehicleId, 'assigned');
      } else {
        // Intake logic: usually returns vehicle to available or quarantined
        updateVehicleStatus(handoverData.vehicleId, handoverData.finalStatus);
        // Add additional return logic if needed in subscriberStore
      }
      
      console.log(`${mode} Completed:`, handoverData);
      setSelectedSubscriber(null);
      setSelectedVehicle(null);
      resetHandover();
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setSelectedSubscriber(null);
    setSelectedVehicle(null);
    resetHandover();
  };

  const dispatchSteps = [
    {
      title: 'Vehicle Selection',
      component: (
        <div className="flex flex-col h-full gap-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto pr-1 no-scrollbar">
              {availableVehicles.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVehicle(v);
                    updateHandoverData({ vehicleId: v.id });
                  }}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                    selectedVehicle?.id === v.id 
                    ? 'bg-emerald-500/10 border-emerald-500/30 ring-1 ring-emerald-500/20' 
                    : 'bg-[var(--bg-tertiary)]/10 border-[var(--border-subtle)] hover:bg-[var(--bg-tertiary)]/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{v.plate}</span>
                    <Battery size={14} className={v.battery < 20 ? 'text-red-500' : 'text-emerald-500'} />
                  </div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">{v.model}</h4>
                  <div className="mt-2 flex items-center justify-between">
                     <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Range: {v.range}km</span>
                     {selectedVehicle?.id === v.id && <CheckCircle2 size={16} className="text-emerald-500" />}
                  </div>
                </button>
              ))}
           </div>
        </div>
      )
    },
    {
      title: 'Rider Selection',
      component: (
        <div className="flex flex-col h-full gap-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto pr-1 no-scrollbar">
              {unassignedSubscribers.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedSubscriber(s);
                    // Auto-fill return date based on plan - dummy logic
                    const days = s.subscriptionPlan.includes('Weekly') ? 7 : s.subscriptionPlan.includes('Monthly') ? 30 : 1;
                    const date = new Date();
                    date.setDate(date.getDate() + days);
                    
                    updateHandoverData({ 
                        subscriberId: s.id,
                        returnDate: date.toISOString().split('T')[0]
                    });
                  }}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                    selectedSubscriber?.id === s.id 
                    ? 'bg-emerald-500/10 border-emerald-500/30 ring-1 ring-emerald-500/20' 
                    : 'bg-[var(--bg-tertiary)]/10 border-[var(--border-subtle)] hover:bg-[var(--bg-tertiary)]/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{s.subscriptionPlan}</span>
                    <User size={14} className="text-emerald-500" />
                  </div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">{s.name}</h4>
                  <div className="mt-2 flex items-center justify-between">
                     <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">{s.phone}</span>
                     {selectedSubscriber?.id === s.id && <CheckCircle2 size={16} className="text-emerald-500" />}
                  </div>
                </button>
              ))}
           </div>
        </div>
      )
    },
    {
      title: 'Asset Documentation',
      component: (
        <div className="grid grid-cols-2 gap-4 h-full">
          <UploadCard label="Front Visual" value={handoverData.photos.front} onUpload={(url) => updateHandoverData({ photos: { ...handoverData.photos, front: url } })} />
          <UploadCard label="Rear Visual" value={handoverData.photos.back} onUpload={(url) => updateHandoverData({ photos: { ...handoverData.photos, back: url } })} />
          <UploadCard label="Port Chassis" value={handoverData.photos.left} onUpload={(url) => updateHandoverData({ photos: { ...handoverData.photos, left: url } })} />
          <UploadCard label="Starboard" value={handoverData.photos.right} onUpload={(url) => updateHandoverData({ photos: { ...handoverData.photos, right: url } })} />
        </div>
      )
    },
    {
      title: 'Dispatch Terms',
      component: (
        <div className="space-y-8">
           <div className="p-6 rounded-xl bg-[var(--bg-tertiary)]/20 border border-[var(--border-subtle)] space-y-6">
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600 ml-1">Expected Return Date</label>
                 <div className="flex items-center gap-4 p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                    <Calendar size={20} className="text-emerald-500" />
                    <input 
                      type="date" 
                      value={handoverData.returnDate || ''}
                      onChange={(e) => updateHandoverData({ returnDate: e.target.value })}
                      className="bg-transparent border-none outline-none text-sm font-bold text-[var(--text-primary)] w-full"
                    />
                 </div>
                 <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mt-2">Suggested based on {selectedSubscriber?.subscriptionPlan} plan</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-lg border border-emerald-500/10 bg-emerald-500/5">
                    <p className="text-[9px] font-bold text-emerald-600 uppercase mb-1">Asset Status</p>
                    <p className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest">In-Progress</p>
                 </div>
                 <div className="p-4 rounded-lg border border-blue-500/10 bg-blue-500/5">
                    <p className="text-[9px] font-bold text-blue-600 uppercase mb-1">Initial Battery</p>
                    <p className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest">{selectedVehicle?.battery}% SOC</p>
                 </div>
              </div>
           </div>
        </div>
      )
    },
    {
      title: 'Handover Summary',
      component: (
        <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
           <div className="w-20 h-20 rounded-full bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
              <Zap size={40} className="animate-pulse" />
           </div>
           
           <div className="space-y-2">
              <h4 className="text-xl font-bold text-[var(--text-primary)]">Ready for Handover</h4>
              <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest max-w-[280px] leading-relaxed">
                 Handing over {selectedVehicle?.plate} to {selectedSubscriber?.name}. Ensure rider documents are verified physicaly.
              </p>
           </div>

           <div className="w-full p-5 rounded-xl bg-[var(--bg-tertiary)]/20 border border-[var(--border-subtle)] text-left">
              <h5 className="text-[9px] font-bold text-emerald-600 uppercase tracking-[0.2em] mb-3">Transmission Details</h5>
              <div className="space-y-2.5">
                 <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-[var(--text-tertiary)]">ASSET ID</span>
                    <span className="text-[var(--text-primary)]">{selectedVehicle?.plate}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-[var(--text-tertiary)]">RIDER</span>
                    <span className="text-[var(--text-primary)]">{selectedSubscriber?.name}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-[var(--text-tertiary)]">DUE RETURN</span>
                    <span className="text-emerald-600">{handoverData.returnDate}</span>
                 </div>
              </div>
           </div>
        </div>
      )
    }
  ];

  const intakeSteps = [
    {
      title: 'Photo Documentation',
      component: (
        <div className="grid grid-cols-2 gap-4 h-full">
          <UploadCard label="Front Cluster" value={handoverData.photos.front} onUpload={(url) => updateHandoverData({ photos: { ...handoverData.photos, front: url } })} />
          <UploadCard label="Rear Profile" value={handoverData.photos.back} onUpload={(url) => updateHandoverData({ photos: { ...handoverData.photos, back: url } })} />
          <UploadCard label="Port Chassis" value={handoverData.photos.left} onUpload={(url) => updateHandoverData({ photos: { ...handoverData.photos, left: url } })} />
          <UploadCard label="Starboard Chassis" value={handoverData.photos.right} onUpload={(url) => updateHandoverData({ photos: { ...handoverData.photos, right: url } })} />
        </div>
      )
    },
    {
      title: 'Technical Inspection',
      component: (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-[var(--bg-tertiary)]/20 border border-[var(--border-subtle)]">
             <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-4 border-b border-[var(--border-subtle)] pb-2">Verification Checklist</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               {Object.keys(handoverData.inspection).map((item) => (
                 <button
                   key={item}
                   onClick={() => updateHandoverData({ inspection: { ...handoverData.inspection, [item]: !handoverData.inspection[item] } })}
                   className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                     handoverData.inspection[item] 
                     ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' 
                     : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                   }`}
                 >
                   <span className="text-[10px] font-bold uppercase tracking-wider">
                     {item.replace(/([A-Z])/g, ' $1').trim()} Integrity
                   </span>
                   <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                     handoverData.inspection[item] ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-[var(--border-subtle)]'
                   }`}>
                     {handoverData.inspection[item] && <CheckCircle2 size={12} strokeWidth={3} />}
                   </div>
                 </button>
               ))}
             </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
             <AlertCircle size={18} className="text-red-500 shrink-0" />
             <p className="text-[9px] font-bold text-red-500/70 uppercase tracking-wider">Flagging defects will trigger maintenance quarantine.</p>
          </div>
        </div>
      )
    },
    {
      title: 'Operational Telemetry',
      component: (
        <div className="space-y-10">
          <div className="space-y-6">
             <div className="flex items-center justify-between font-bold">
                <span className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">Battery Level</span>
                <span className="text-4xl text-emerald-600 tracking-tighter">{handoverData.batteryLevel}%</span>
             </div>
             <div className="relative h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                <motion.div animate={{ width: `${handoverData.batteryLevel}%` }} className="absolute h-full bg-emerald-500" />
                <input type="range" min="0" max="100" value={handoverData.batteryLevel} onChange={(e) => updateHandoverData({ batteryLevel: parseInt(e.target.value) })} className="absolute inset-0 opacity-0 cursor-pointer" />
             </div>
          </div>
          <div className="p-6 rounded-xl bg-[var(--bg-tertiary)]/20 border border-[var(--border-subtle)]">
             <div className="flex items-center justify-between mb-4">
               <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Post-Return Status</span>
                  <div className="flex items-center gap-4 mt-2">
                     {['available', 'quarantined'].map(s => (
                       <button 
                         key={s} 
                         onClick={() => updateHandoverData({ finalStatus: s })}
                         className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                           handoverData.finalStatus === s ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-tertiary)]'
                         }`}
                       >
                         {s}
                       </button>
                     ))}
                  </div>
               </div>
               <div className="w-10 h-10 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-sm"><Check size={20} /></div>
             </div>
          </div>
        </div>
      )
    },
    {
      title: 'Session Closure',
      component: (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
          <div className="relative p-6 bg-white rounded-xl shadow-inner group">
             <QrCode size={120} strokeWidth={1} className="text-slate-900" />
             <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900 rounded-full text-emerald-500 text-[8px] font-bold uppercase tracking-[0.2em] shadow-lg">HUB COLLECT</div>
          </div>
          <div className="space-y-1">
             <h4 className="text-xl font-bold text-[var(--text-primary)]">Confirm Asset Receipt</h4>
             <p className="text-[10px] font-medium text-[var(--text-tertiary)] px-8 uppercase tracking-wider leading-relaxed">
                Confirm vehicle condition matches input and keys are collected.
             </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] gap-6 no-scrollbar overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-emerald-500 rounded-full" />
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Handover <span className="text-emerald-500">Terminal</span>
            </h1>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider ml-4 text-[var(--text-tertiary)]">
             Operational Asset Exchange Terminal • v2.0
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex p-1 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl self-start md:self-center">
            <button
              onClick={() => handleModeChange('dispatch')}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                mode === 'dispatch' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Dispatch Out
            </button>
            <button
              onClick={() => handleModeChange('intake')}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                mode === 'intake' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Intake Return
            </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0">
        <div className="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
           <div className="flex-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-sm flex flex-col overflow-hidden">
              <div className="px-6 py-5 border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/10">
                 <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                   {mode === 'dispatch' ? 'Available Assets' : 'Expected Intake'}
                 </h3>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mt-0.5 leading-none">
                   {mode === 'dispatch' ? 'Ready for Handover' : 'Due for Return Today'}
                 </p>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2">
                 {mode === 'dispatch' ? (
                   availableVehicles.map((v) => (
                      <motion.div
                        key={v.id}
                        onClick={() => {
                          setSelectedVehicle(v);
                          updateHandoverData({ vehicleId: v.id });
                        }}
                        animate={{ 
                          borderColor: selectedVehicle?.id === v.id ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)',
                          backgroundColor: selectedVehicle?.id === v.id ? 'rgba(16, 185, 129, 0.05)' : 'transparent'
                        }}
                        className="p-4 rounded-lg border cursor-pointer hover:bg-[var(--bg-tertiary)] transition-all group shrink-0"
                      >
                         <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${selectedVehicle?.id === v.id ? 'bg-emerald-600/10 border-emerald-500/30 text-emerald-600' : 'bg-[var(--bg-tertiary)] border-[var(--border-subtle)] text-slate-400'}`}>
                               <Truck size={20} />
                            </div>
                            <div className="flex-1">
                               <div className="flex items-center justify-between mb-0.5">
                                  <h4 className="text-xs font-bold text-[var(--text-primary)]">{v.plate}</h4>
                                  <span className="text-[8px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">Ready</span>
                               </div>
                               <p className="text-[10px] font-medium text-[var(--text-tertiary)] uppercase">{v.model}</p>
                            </div>
                         </div>
                      </motion.div>
                   ))
                 ) : (
                   intakeSubscribers.map((s) => (
                     <motion.div
                       key={s.id}
                       onClick={() => {
                         setSelectedSubscriber(s);
                         resetHandover();
                       }}
                       animate={{ 
                         borderColor: selectedSubscriber?.id === s.id ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)',
                         backgroundColor: selectedSubscriber?.id === s.id ? 'rgba(16, 185, 129, 0.05)' : 'transparent'
                       }}
                       className="p-4 rounded-lg border cursor-pointer hover:bg-[var(--bg-tertiary)] transition-all shrink-0"
                     >
                        <div className="flex items-center gap-3">
                           <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${selectedSubscriber?.id === s.id ? 'bg-emerald-600/10 border-emerald-500/30 text-emerald-600' : 'bg-[var(--bg-tertiary)] border-[var(--border-subtle)] text-slate-400'}`}>
                              <User size={20} />
                           </div>
                           <div className="flex-1">
                              <h4 className="text-xs font-bold text-[var(--text-primary)]">{s.name}</h4>
                              <p className="text-[10px] font-medium text-[var(--text-tertiary)] uppercase">{s.plate || 'KA-05-EV-5678'}</p>
                           </div>
                           <StatusBadge status={s.status} className="scale-[0.7] origin-right" />
                        </div>
                     </motion.div>
                   ))
                 )}
              </div>
           </div>

           {(selectedSubscriber || selectedVehicle) && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-xl bg-emerald-600/5 border border-emerald-500/10 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-lg bg-[var(--bg-secondary)] border border-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                    <ArrowLeftRight size={20} />
                 </div>
                 <div className="space-y-0.5">
                    <h4 className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-wider">Authorized {mode}</h4>
                    <p className="text-[9px] font-bold text-emerald-600/80 uppercase tracking-tight">Active Terminal Session</p>
                 </div>
              </motion.div>
           )}
        </div>

        <div className="lg:col-span-3 flex flex-col h-full overflow-hidden">
           <AnimatePresence mode="wait">
             {(mode === 'dispatch' && selectedVehicle) || (mode === 'intake' && selectedSubscriber) ? (
               <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
                 <StepForm 
                   steps={mode === 'dispatch' ? dispatchSteps : intakeSteps} 
                   activeStep={activeStep} 
                   onNext={handleNext}
                   onBack={() => setStep(activeStep - 1)}
                   isFinalStep={activeStep === (mode === 'dispatch' ? 4 : 3)}
                 />
               </motion.div>
             ) : (
               <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full rounded-xl border-2 border-dashed border-[var(--border-subtle)] flex flex-col items-center justify-center text-center gap-4 p-10 bg-[var(--bg-tertiary)]/10">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-slate-400 opacity-50">
                     <Zap size={32} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                     <h3 className="text-xl font-bold text-[var(--text-secondary)] uppercase">Terminal Ready</h3>
                     <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider max-w-[200px] mx-auto opacity-60">
                        Please select {mode === 'dispatch' ? 'a vehicle' : 'a rider'} to start the inspection protocol.
                     </p>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
