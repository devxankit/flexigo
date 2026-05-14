import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ChevronRight,
  Zap,
  ArrowRight,
  Navigation,
  X,
  Target,
  Activity,
  History,
  FileText,
  Settings,
  Battery,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { GoogleMap, useJsApiLoader, MarkerF, CircleF } from '@react-google-maps/api';
import { useFleetStore } from '../store/fleetStore';
import { useFranchiseAuthStore } from '../store/franchiseAuthStore';
import GlassTable from '../components/GlassTable';
import StatusBadge from '../components/StatusBadge';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 22.7196,
  lng: 75.8577
};

const mapStyles = [
  { "elementType": "geometry", "stylers": [{ "color": "#121212" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] },
  { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] }
];

export default function FleetManagement() {
  const navigate = useNavigate();
  const { vehicles, filter, setFilter, fetchVehicles, isLoading } = useFleetStore();
  const { user } = useFranchiseAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null); // Controls Detail Drawer
  const [focusedVehicle, setFocusedVehicle] = useState(null);   // Controls Map Widget & Focus
  const [map, setMap] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBRHvhhxVDQyYkOryyo2IA19GuDFqsYD30"
  });

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  useEffect(() => {
    const fId = user?.id || user?._id;
    if (fId) {
        fetchVehicles(fId);
        // Live polling every 5 seconds for "Exact Live Location"
        const interval = setInterval(() => fetchVehicles(fId), 5000);
        return () => clearInterval(interval);
    }
  }, [user]);

  // Automatically follow focused vehicle and SYNC state when its location updates (live tracking)
  useEffect(() => {
    if (focusedVehicle) {
      const latest = vehicles.find(v => (v._id || v.id) === (focusedVehicle._id || focusedVehicle.id));
      if (latest) {
        // Sync the focusedVehicle state with the latest data from the store
        // This ensures the "Live Grid Monitor" header and "Last Location" boxes are always up-to-date
        setFocusedVehicle(latest);
        
        if (map) {
          const loc = latest.lastLocation || latest.location;
          if (loc) {
            map.panTo({ lat: Number(loc.lat), lng: Number(loc.lng) });
          }
        }
      }
    }
  }, [vehicles, map]);

  useEffect(() => {
    const loc = focusedVehicle?.lastLocation || focusedVehicle?.location;
    if (loc && map) {
      map.panTo({ lat: Number(loc.lat), lng: Number(loc.lng) });
      map.setZoom(19); // High precision zoom for "Exact Live Location"
    }
  }, [focusedVehicle?._id, focusedVehicle?.id, map]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchesFilter = filter === 'all' || v.status === filter;
      const matchesSearch = v.plate.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           v.vin.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [vehicles, filter, searchQuery]);

  const handleRowClick = (vehicle) => {
    setFocusedVehicle(vehicle);
    setSelectedVehicle(vehicle); 
    
    const loc = vehicle.lastLocation || vehicle.location;
    if (loc && map) {
      map.panTo({ lat: Number(loc.lat), lng: Number(loc.lng) });
      map.setZoom(19); // "Exact Live Location" focus
    }
  };

  const columns = [
    { 
      header: 'Vehicle Identifier', 
      accessor: 'plate', 
      render: (row) => (
        <div className="flex flex-col gap-0">
          <span className="text-emerald-500 text-[9px] font-black italic tracking-[0.2em] uppercase leading-tight">{row.plate}</span>
          <span className="text-[6.5px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.3em] italic opacity-60 leading-none">{row.model}</span>
        </div>
      )
    },
    { 
      header: 'Operator / Rider', 
      accessor: 'rider', 
      render: (row) => (
        <div className="flex flex-col gap-0">
          <span className={`text-[8px] font-black italic tracking-widest uppercase leading-tight ${row.status === 'assigned' ? 'text-emerald-500' : 'text-[var(--text-tertiary)] opacity-40'}`}>
            {row.rider || '—'}
          </span>
          {row.status === 'assigned' && (
            <span className="text-[6px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] italic opacity-40 leading-none">
              ACTIVE_IN_FIELD
            </span>
          )}
        </div>
      )
    },
    { 
      header: 'VIN Number', 
      accessor: 'vin', 
      render: (row) => <span className="text-[7px] font-black text-[var(--text-tertiary)] font-mono tracking-[0.2em] italic uppercase opacity-60">{row.vin}</span>
    },
    { 
      header: 'Hub Status', 
      accessor: 'status', 
      render: (row) => <StatusBadge status={row.status} /> 
    },
    { 
      header: '', 
      accessor: 'actions', 
      render: (row) => (
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            setSelectedVehicle(row);
            setFocusedVehicle(row); // Also focus on map when opening drawer
          }}
          className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-all text-[var(--text-tertiary)] hover:text-emerald-500"
        >
          <ChevronRight size={18} />
        </button>
      )
    }
  ];

  const filterTabs = [
    { id: 'all', label: 'Whole Fleet' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
           <div className="flex items-center gap-2">
             <div className="w-1 h-3 bg-emerald-500 rounded-full" />
             <h1 className="text-lg font-black tracking-tighter text-[var(--text-primary)] uppercase italic leading-none">
               Fleet <span className="text-emerald-500">Inventory</span>
             </h1>
           </div>
           <p className="text-[7px] font-black uppercase tracking-[0.3em] text-[var(--text-tertiary)] ml-3 italic opacity-40 leading-none">
              FLEET_STATUS • DOCUMENT_COMPLIANCE
           </p>
        </div>
      </div>

      {/* Filters & Search Bar Area */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
         <div className="flex bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-1 rounded-xl shadow-inner">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-[7px] font-black uppercase tracking-widest transition-all italic leading-none ${
                  filter === tab.id 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab.id.replace(/-/g, '_')}
              </button>
            ))}
         </div>

         <div className="relative w-full lg:w-80 group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[var(--text-tertiary)] group-focus-within:text-emerald-500 transition-colors">
               <Search size={12} strokeWidth={3} />
            </div>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH_PLATE_OR_VIN..." 
              className="w-full pl-8 pr-4 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-[9px] font-black text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all italic tracking-widest placeholder:text-[var(--text-tertiary)] placeholder:opacity-40 shadow-inner"
            />
         </div>
      </div>

      {/* Main Content: Split Layout (Table & Map) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Table Registry */}
         <div className="lg:col-span-2">
            <GlassTable 
              columns={columns} 
              data={filteredVehicles} 
              onRowClick={handleRowClick}
              selectedId={focusedVehicle?._id || focusedVehicle?.id}
              emptyMessage={`No assets registered`}
            />
         </div>

         {/* Map Visualization */}
         <div className="space-y-4">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-4 space-y-4 shadow-sm h-full flex flex-col min-h-[500px]">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <Target size={14} className="text-emerald-500" />
                     <h4 className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest italic">Live Grid Monitor</h4>
                  </div>
                   {focusedVehicle && (
                      <div className="flex items-center gap-1">
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                         <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">{focusedVehicle.plate}</span>
                      </div>
                   )}
               </div>

               <div className="flex-1 min-h-[350px] bg-[var(--bg-tertiary)] rounded-xl relative overflow-hidden group shadow-inner border border-[var(--border-subtle)]">
                  {isLoaded ? (
                     <GoogleMap
                        mapContainerStyle={containerStyle}
                         center={focusedVehicle?.lastLocation || focusedVehicle?.location || defaultCenter}
                         zoom={focusedVehicle ? 19 : 12}
                        onLoad={onLoad}
                        onUnmount={onUnmount}
                        options={{
                           styles: mapStyles,
                           disableDefaultUI: true,
                           zoomControl: true,
                           mapTypeControl: false,
                           streetViewControl: false,
                           fullscreenControl: true,
                           clickableIcons: false
                        }}
                     >
                        {filteredVehicles.map(v => v.status === 'assigned' && (v.lastLocation || v.location) && (
                           <CircleF 
                              key={`pulse-${v._id || v.id}`}
                              center={{
                                 lat: Number((v.lastLocation || v.location).lat),
                                 lng: Number((v.lastLocation || v.location).lng)
                              }}
                              radius={focusedVehicle?._id === v._id ? 60 : 30}
                              options={{
                                 fillColor: '#10b981',
                                 fillOpacity: focusedVehicle?._id === v._id ? 0.3 : 0.1,
                                 strokeColor: '#10b981',
                                 strokeWeight: 1,
                                 strokeOpacity: 0.4,
                                 clickable: false
                              }}
                           />
                        ))}
                        {filteredVehicles.map(v => (v.lastLocation || v.location) && (
                           <MarkerF 
                              key={`marker-${v._id || v.id}`}
                              position={{
                                 lat: Number((v.lastLocation || v.location).lat),
                                 lng: Number((v.lastLocation || v.location).lng)
                              }}
                              onClick={() => handleRowClick(v)}
                              icon={{
                                 url: v.status === 'assigned' 
                                    ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' // Standard high-visibility green for active riders
                                    : 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
                                 scaledSize: v.status === 'assigned' 
                                    ? new window.google.maps.Size(35, 35) 
                                    : new window.google.maps.Size(30, 30)
                              }}
                              animation={focusedVehicle?._id === v._id || focusedVehicle?.id === v.id ? window.google.maps.Animation.BOUNCE : null}
                              label={{
                                 text: v.rider ? v.rider.toUpperCase() : v.plate,
                                 color: '#10b981', // Emerald Green matching GeoFencing
                                 fontSize: '10px',
                                 fontWeight: '900',
                                 className: 'mt-14 uppercase tracking-[0.15em] italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
                              }}
                           />
                        ))}
                     </GoogleMap>
                  ) : (
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 space-y-4">
                        <Activity size={24} className="text-emerald-500 animate-spin" />
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">Initializing Satellite Sync...</p>
                     </div>
                  )}
               </div>

               <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-subtle)]">
                     <p className="text-[7px] font-black text-[var(--text-tertiary)] uppercase tracking-widest mb-1 italic">Last Location</p>
                     <p className="text-[9px] font-black text-[var(--text-primary)] truncate">
                        {focusedVehicle?.lastLocation || focusedVehicle?.location ? 
                          `${(focusedVehicle.lastLocation || focusedVehicle.location).lat.toFixed(4)}° N, ${(focusedVehicle.lastLocation || focusedVehicle.location).lng.toFixed(4)}° E` 
                          : 'Searching...'}
                     </p>
                  </div>
                  <div className="p-3 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-subtle)]">
                     <p className="text-[7px] font-black text-[var(--text-tertiary)] uppercase tracking-widest mb-1 italic">Energy State</p>
                     <p className="text-[9px] font-black text-emerald-500">
                        {focusedVehicle?.battery !== undefined ? `${focusedVehicle.battery}%` : '--'}
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Details Modal / Drawer (Optional but kept for functionality) */}
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
               <div className="flex items-center justify-between px-6 h-12 border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/10 shadow-inner">
                  <div className="flex items-center gap-3">
                     <button 
                        onClick={() => setSelectedVehicle(null)}
                        className="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] rounded bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-inner transition-all group"
                     >
                        <X size={14} className="group-hover:rotate-90 transition-transform" />
                     </button>
                     <div className="h-4 w-px bg-[var(--border-subtle)]" />
                     <button 
                        onClick={() => navigate(`/franchise/fleet/${selectedVehicle.id || selectedVehicle._id}`)}
                        className="text-[7.5px] font-black uppercase tracking-[0.2em] italic text-emerald-500 hover:text-emerald-400 group flex items-center gap-1"
                     >
                        DETAILED_PROFILE <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                     </button>
                  </div>
                  <div className="flex items-center gap-3 scale-90">
                     <StatusBadge status={selectedVehicle.status} />
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                  {/* Vehicle Identity */}
                  <div className="flex items-start gap-4 mb-8">
                     <div className="w-14 h-14 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-inner flex items-center justify-center text-emerald-500">
                        <Zap size={24} strokeWidth={1.5} />
                     </div>
                     <div className="flex-1 min-w-0 pt-1">
                        <h2 className="text-xl font-black tracking-tighter italic text-[var(--text-primary)] leading-none">
                           {selectedVehicle.plate}
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                           <span className="text-[7.5px] font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase tracking-[0.2em] italic leading-none">
                              {selectedVehicle.model}
                           </span>
                           <span className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] italic leading-none opacity-60">
                              VIN: {selectedVehicle.vin}
                           </span>
                        </div>
                     </div>
                  </div>

                  {/* Operational Summary */}
                  <div className="grid grid-cols-3 gap-3 mb-8">
                     <div className="p-3 rounded-xl bg-black border border-[var(--border-subtle)] space-y-1.5 shadow-inner relative overflow-hidden">
                        <div className="text-emerald-500 flex items-center gap-1.5 mb-2 relative z-10">
                           <Battery size={10} strokeWidth={3} />
                           <span className="text-[6.5px] font-black uppercase tracking-[0.2em] opacity-60 text-emerald-500 italic leading-none">EFFICIENCY</span>
                        </div>
                        <p className="text-lg font-black italic text-white leading-none relative z-10">{selectedVehicle.battery}%</p>
                     </div>
                     <div className="p-3 rounded-xl bg-black border border-[var(--border-subtle)] space-y-1.5 shadow-inner relative overflow-hidden">
                        <div className="text-blue-500 flex items-center gap-1.5 mb-2 relative z-10">
                           <Navigation size={10} strokeWidth={3} />
                           <span className="text-[6.5px] font-black uppercase tracking-[0.2em] opacity-60 text-blue-500 italic leading-none">MAX_RANGE</span>
                        </div>
                        <p className="text-lg font-black italic text-white leading-none relative z-10">{selectedVehicle.range} <span className="text-[8px] opacity-40">KM</span></p>
                     </div>
                     <div className="p-3 rounded-xl bg-black border border-[var(--border-subtle)] space-y-1.5 shadow-inner relative overflow-hidden">
                        <div className="text-amber-500 flex items-center gap-1.5 mb-2 relative z-10">
                           <ShieldCheck size={10} strokeWidth={3} />
                           <span className="text-[6.5px] font-black uppercase tracking-[0.2em] opacity-60 text-amber-500 italic leading-none">SYS_HEALTH</span>
                        </div>
                        <p className="text-lg font-black italic text-white leading-none relative z-10 uppercase tracking-tighter">OPTIMUM</p>
                     </div>
                  </div>

                  {/* History Section */}
                  <div className="space-y-4">
                     <div className="flex items-center gap-6 border-b border-[var(--border-subtle)]">
                        <button className="px-1 py-2 text-[7.5px] font-black uppercase tracking-[0.2em] italic text-emerald-500 border-b-2 border-emerald-500 flex gap-2"><History size={10}/> MAINT_ACTIVITY</button>
                        <button className="px-1 py-2 text-[7.5px] font-black uppercase tracking-[0.2em] italic text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors opacity-60 flex gap-2"><FileText size={10}/> DOCUMENTATION</button>
                     </div>

                     <div className="space-y-2">
                        {selectedVehicle.maintenanceLogs?.length > 0 ? (
                          selectedVehicle.maintenanceLogs.map((log, i) => (
                            <div key={i} className="flex gap-3 p-3 bg-[var(--bg-tertiary)]/10 border border-[var(--border-subtle)] rounded-xl group hover:border-emerald-500/20 transition-all shadow-inner">
                               <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-inner flex items-center justify-center shrink-0">
                                  <History size={12} className="text-emerald-500" />
                               </div>
                               <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                     <h4 className="text-[9px] font-black text-[var(--text-primary)] uppercase tracking-tight italic truncate">{log.type}</h4>
                                     <span className="text-[6.5px] font-black uppercase tracking-widest text-[var(--text-tertiary)] italic leading-none">{log.date}</span>
                                  </div>
                                  <p className="text-[6.5px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] italic opacity-60 truncate">CERT_TECH: {log.staff}</p>
                               </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-8 border border-dashed border-[var(--border-subtle)] rounded-xl flex flex-col items-center justify-center gap-2 text-center bg-[var(--bg-secondary)] shadow-inner">
                             <History size={18} className="text-[var(--text-tertiary)] opacity-30" />
                             <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] italic">LOG_UNDER_REVIEW</p>
                                <p className="text-[6.5px] font-black text-[var(--text-tertiary)] opacity-40 uppercase tracking-[0.3em] italic">HEALTHY_ASSET_HISTORY</p>
                             </div>
                          </div>
                        )}
                     </div>
                  </div>
               </div>

               {/* Drawer Footer */}
               <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] grid grid-cols-2 gap-3 shadow-inner">
                  <button className="py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[7.5px] font-black uppercase tracking-[0.2em] italic text-[var(--text-primary)] hover:border-emerald-500/20 transition-all flex items-center justify-center gap-2 shadow-inner">
                     <FileText size={10} strokeWidth={3} /> COMPLIANCE_AUDIT
                  </button>
                  <button className="py-2.5 rounded-xl bg-emerald-600 text-white text-[7.5px] font-black uppercase tracking-[0.2em] italic hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 active:scale-95">
                     <Settings size={10} strokeWidth={3} /> SERVICE_CONSOLE
                  </button>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
