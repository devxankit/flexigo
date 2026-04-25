import React, { useState, useEffect, useCallback } from 'react';
import { 
  Map as MapIcon, 
  Plus, 
  MapPin, 
  Bell, 
  History,
  MoreVertical,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  X,
  Target,
  Shield,
  Layers,
  ArrowRight,
  Activity,
  User,
  Navigation,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleMap, useJsApiLoader, Circle, Marker } from '@react-google-maps/api';
import AdminStatCard from '../components/AdminStatCard';
import OpsFilter from '../components/OpsFilter';
import { useAdminDataStore } from '../store/adminDataStore';
import logo from '../../../assets/logo.png';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 22.7196,
  lng: 75.8577
};

// Custom Map Styles (Dark/Emerald)
const mapStyles = [
  { "elementType": "geometry", "stylers": [{ "color": "#121212" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
  { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#263c3f" }] },
  { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] },
  { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }] },
  { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] },
  { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] },
  { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }] },
  { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] },
  { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }
];

export default function GeoFencingPage() {
  const { 
    geofences, 
    subscribers,
    fetchGeofences, 
    fetchSubscriberData,
    createGeofence, 
    removeGeofence 
  } = useAdminDataStore();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBRHvhhxVDQyYkOryyo2IA19GuDFqsYD30"
  });

  const [activeFilters, setActiveFilters] = React.useState({ range: 'Last 7 Days' });
  const [selectedZone, setSelectedZone] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const [userLocation, setUserLocation] = useState(defaultCenter);

  useEffect(() => {
    fetchGeofences();
    fetchSubscriberData();
    
    // Set map center to user's current location if available
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition((pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          if (!selectedZone && map) map.panTo(loc);
       });
    }

    // Simulate real-time notification
    const interval = setInterval(() => {
       if (geofences.length > 0) {
          const randomBreach = Math.random() > 0.9;
          if (randomBreach) {
             const gf = geofences[Math.floor(Math.random() * geofences.length)];
             const riderName = gf.riderId?.name || 'Rider';
             addNotification(riderName);
          }
       }
    }, 15000);

    return () => clearInterval(interval);
  }, [map]);

  useEffect(() => {
    if (selectedZone && map) {
      // Prioritize: Rider Live Location > Zone Center > User Current City
      const targetLoc = selectedZone.riderId?.lastLocation || selectedZone.center || userLocation;
      
      // If the location is the hardcoded New Delhi one, and we have userLocation, use userLocation instead
      const isNewDelhi = targetLoc.lat === 28.6139 && targetLoc.lng === 77.2090;
      const finalLoc = (isNewDelhi && userLocation) ? userLocation : targetLoc;

      map.panTo(finalLoc);
      map.setZoom(15);
    }
  }, [selectedZone, map, userLocation]);

  const addNotification = (riderName) => {
     const newNotif = {
        id: Date.now(),
        message: `Rider ${riderName} is outside the assigned radius!`,
        time: new Date().toLocaleTimeString(),
        type: 'breach'
     };
     setNotifications(prev => [newNotif, ...prev].slice(0, 5));
     
     if (Notification.permission === "granted") {
        new Notification("Geo-Fencing Alert", {
           body: `${riderName} has breached the zone!`,
           icon: logo
        });
     }
  };

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    console.log('Geo Fencing Sync:', newFilters);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneType, setNewZoneType] = useState('inclusion');
  const [selectedRider, setSelectedRider] = useState('');

  const handleCreateZone = async (e) => {
    e.preventDefault();
    if (!newZoneName || !selectedRider) return;
    
    const payload = {
      name: newZoneName,
      type: newZoneType,
      radius: '1.0km',
      riderId: selectedRider,
      center: userLocation // Use the captured browser location
    };

    await createGeofence(payload);
    setNewZoneName('');
    setSelectedRider('');
    setIsModalOpen(false);
    fetchGeofences();
  };

  const deleteZone = (id) => {
    if (window.confirm('Are you sure you want to delete this zone?')) {
        removeGeofence(id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="space-y-0.5">
            <div className="flex items-center gap-2">
               <div className="w-1 h-5 bg-emerald-600 rounded-full" />
               <h1 className="text-xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Geo <span className="text-emerald-500">Fencing</span>
               </h1>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] ml-3">
               Perimeter Security & Grid Protocols
            </p>
         </div>
         
         <div className="flex items-center gap-2">
            <OpsFilter onFilterChange={handleFilterChange} />
            <button 
               onClick={() => setIsModalOpen(true)}
               className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md active:scale-95"
            >
               <Plus size={12} strokeWidth={3} /> Create Zone
            </button>
         </div>
      </div>

      {/* Real-time Alerts Panel */}
      <AnimatePresence>
         {notifications.length > 0 && (
            <motion.div 
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 space-y-3"
            >
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-500">
                     <Bell size={14} className="animate-bounce" />
                     <span className="text-[10px] font-black uppercase tracking-widest italic">Live Breach Protocol</span>
                  </div>
                  <button onClick={() => setNotifications([])} className="text-[8px] font-black uppercase tracking-widest text-rose-500/50 hover:text-rose-500 transition-all">Clear All</button>
               </div>
               <div className="space-y-2">
                  {notifications.map(n => (
                     <motion.div 
                        key={n.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between bg-[var(--bg-secondary)] border border-rose-500/20 p-3 rounded-xl shadow-sm"
                     >
                        <div className="flex items-center gap-3">
                           <img src={logo} className="w-6 h-6 object-contain grayscale-0" alt="Logo" />
                           <div className="space-y-0.5">
                              <p className="text-[9px] font-black text-rose-500 uppercase italic tracking-tighter">{n.message}</p>
                              <p className="text-[7px] font-bold text-[var(--text-tertiary)] uppercase">{n.time} • Radius Breach</p>
                           </div>
                        </div>
                        <AlertTriangle size={14} className="text-rose-500" />
                     </motion.div>
                  ))}
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <AdminStatCard title="Active Zones" value={geofences.length} icon={MapIcon} color="emerald" subtitle="Monitored Nodes" />
         <AdminStatCard title="Breaches" value={notifications.length > 0 ? `0${notifications.length}` : "00"} icon={AlertTriangle} color="rose" subtitle="Live Alerts" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Geofence Registry */}
         <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-tertiary)]/10">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
                     <Layers size={16} />
                  </div>
                  <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-wider leading-none italic">Zone Protocol Registry</h3>
               </div>
            </div>
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/20">
                        {['Rider Identity', 'Type', 'Radius', 'Status', 'Alerts', 'Actions'].map((header) => (
                           <th key={header} className="py-2.5 px-6 text-[8px] font-black uppercase tracking-widest text-[var(--text-tertiary)] whitespace-nowrap">{header}</th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                     <AnimatePresence mode='popLayout'>
                       {geofences.map((gf) => (
                          <motion.tr 
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            key={gf._id || gf.id} 
                            onClick={() => setSelectedZone(gf)}
                            className={`group/row hover:bg-emerald-500/5 transition-all text-[10px] cursor-pointer ${selectedZone?._id === gf._id ? 'bg-emerald-500/5' : ''}`}
                          >
                             <td className="py-2.5 px-6 whitespace-nowrap">
                                <div className="flex flex-col">
                                   <span className="font-black text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors uppercase tracking-tight italic leading-none">{gf.riderId?.name || gf.name}</span>
                                   <span className="text-[7px] font-bold text-[var(--text-tertiary)] tracking-widest uppercase mt-1 leading-none italic">{gf.riderId?.phone || 'ID: ' + (gf._id || gf.id).slice(-6)}</span>
                                </div>
                             </td>
                             <td className="py-2.5 px-6">
                                <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded border leading-none ${
                                   gf.type === 'exclusion' ? 'bg-rose-500/10 text-rose-500 border-rose-500/10' : 
                                   gf.type === 'inclusion' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' :
                                   'bg-blue-500/10 text-blue-500 border-blue-500/10'
                                }`}>
                                   {gf.type}
                                </span>
                             </td>
                             <td className="py-2.5 px-6 text-[9px] font-black text-[var(--text-primary)] italic leading-none">{gf.radius}</td>
                             <td className="py-2.5 px-6">
                                <div className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest border leading-none ${
                                   gf.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' : 'bg-slate-500/10 text-slate-500 border-slate-500/10'
                                }`}>
                                   <div className={`w-1 h-1 rounded-full ${gf.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                                   {gf.status}
                                </div>
                             </td>
                             <td className="py-2.5 px-6">
                                <span className={`text-[9px] font-black italic leading-none ${gf.alerts > 0 ? 'text-rose-500' : 'text-[var(--text-tertiary)]'}`}>{gf.alerts} FLUX</span>
                             </td>
                             <td className="py-2.5 px-6">
                                <div className="flex items-center gap-2">
                                   <button 
                                      onClick={(e) => { e.stopPropagation(); deleteZone(gf._id || gf.id); }}
                                      className="p-1.5 text-[var(--text-tertiary)] hover:text-rose-500 hover:bg-rose-600/5 rounded-lg transition-all"
                                   >
                                      <X size={14} />
                                   </button>
                                </div>
                             </td>
                          </motion.tr>
                       ))}
                     </AnimatePresence>
                  </tbody>
               </table>
            </div>
         </div>

         {/* Real-time Map Area */}
         <div className="space-y-4">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-4 space-y-4 shadow-sm h-full flex flex-col min-h-[500px]">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <Target size={14} className="text-emerald-500" />
                     <h4 className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest italic">Live Grid Monitor</h4>
                  </div>
                  {selectedZone && (
                     <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">Tracking: {selectedZone.riderId?.name || 'NODE'}</span>
                     </div>
                  )}
               </div>

               {/* Proper Google Map */}
               <div className="flex-1 min-h-[350px] bg-[var(--bg-tertiary)] rounded-xl relative overflow-hidden group shadow-inner border border-[var(--border-subtle)]">
                  {isLoaded ? (
                     <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={selectedZone?.riderId?.lastLocation || selectedZone?.center || userLocation}
                        zoom={selectedZone ? 15 : 12}
                        onLoad={onLoad}
                        onUnmount={onUnmount}
                        options={{
                           styles: mapStyles,
                           disableDefaultUI: true,
                           zoomControl: true,
                           mapTypeControl: false,
                           streetViewControl: false,
                           fullscreenControl: true
                        }}
                     >
                        {selectedZone && (() => {
                           const targetLoc = selectedZone.riderId?.lastLocation || selectedZone.center || userLocation;
                           const isNewDelhi = targetLoc.lat === 28.6139 && targetLoc.lng === 77.2090;
                           const finalLoc = (isNewDelhi && userLocation) ? userLocation : targetLoc;
                           
                           return (
                              <>
                                 <Circle 
                                    center={finalLoc}
                                    radius={1000} // 1km
                                    options={{
                                       strokeColor: selectedZone.type === 'exclusion' ? '#f43f5e' : '#10b981',
                                       strokeOpacity: 0.8,
                                       strokeWeight: 2,
                                       fillColor: selectedZone.type === 'exclusion' ? '#f43f5e' : '#10b981',
                                       fillOpacity: 0.15,
                                    }}
                                 />
                                 <Marker 
                                    position={finalLoc}
                                    label={{
                                       text: selectedZone.riderId?.name || selectedZone.name || 'Rider',
                                       color: 'white',
                                       fontSize: '10px',
                                       fontWeight: '900',
                                       className: 'uppercase tracking-tighter mt-8'
                                    }}
                                 />
                              </>
                           );
                        })()}
                        
                        {/* Show all other riders as small markers if needed */}
                        {!selectedZone && geofences.map(gf => gf.center && (
                           <Marker 
                              key={gf._id}
                              position={gf.center}
                              icon={{
                                 path: window.google?.maps.SymbolPath.CIRCLE,
                                 scale: 4,
                                 fillColor: '#10b981',
                                 fillOpacity: 0.8,
                                 strokeWeight: 1,
                                 strokeColor: 'white',
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

                  {/* UI Overlays */}
                  <div className="absolute top-4 left-4 space-y-2 pointer-events-none">
                     <div className="bg-black/80 backdrop-blur-md p-2 rounded-lg border border-white/10 space-y-1">
                        <div className="flex justify-between items-center gap-8">
                           <span className="text-[7px] font-black text-white/50 uppercase italic">Satellite Sync</span>
                           <span className="text-[7px] font-black text-emerald-500 uppercase">ONLINE</span>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-subtle)]">
                     <p className="text-[7px] font-black text-[var(--text-tertiary)] uppercase tracking-widest mb-1 italic">Last Location</p>
                     <p className="text-[9px] font-black text-[var(--text-primary)]">
                        {selectedZone ? (() => {
                           const loc = selectedZone.riderId?.lastLocation || selectedZone.center || userLocation;
                           const isNewDelhi = loc.lat === 28.6139 && loc.lng === 77.2090;
                           const finalLoc = (isNewDelhi && userLocation) ? userLocation : loc;
                           return `${finalLoc.lat.toFixed(4)}° N, ${finalLoc.lng.toFixed(4)}° E`;
                        })() : 'India Node'}
                     </p>
                  </div>
                  <div className="p-3 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-subtle)]">
                     <p className="text-[7px] font-black text-[var(--text-tertiary)] uppercase tracking-widest mb-1 italic">Current Speed</p>
                     <p className="text-[9px] font-black text-emerald-500">
                        {selectedZone?.riderId?.currentSpeed !== undefined ? `${selectedZone.riderId.currentSpeed} km/h` : (selectedZone ? '24.5 km/h' : '0.0 km/h')}
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Create Zone Modal */}
      <AnimatePresence>
         {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[2rem] p-8 shadow-2xl space-y-6 overflow-hidden relative"
               >
                  <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                     <MapIcon size={100} />
                  </div>

                  <div className="flex items-center justify-between relative z-10 border-b border-[var(--border-subtle)] pb-4">
                     <div className="space-y-0.5">
                        <h2 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tighter italic leading-none">Create <span className="text-emerald-500">Security Zone</span></h2>
                        <p className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest leading-none mt-1">Protocol Generation Module</p>
                     </div>
                     <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-rose-600/10 hover:text-rose-500 transition-all rounded-lg">
                        <X size={18} />
                     </button>
                  </div>

                  <form onSubmit={handleCreateZone} className="space-y-6 relative z-10">
                     <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1 italic leading-none">Zone Identity Name</label>
                           <input 
                              autoFocus
                              value={newZoneName}
                              onChange={(e) => setNewZoneName(e.target.value)}
                              placeholder="e.g. SOUTH CLUSTER RESTRICTED"
                              className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-black tracking-widest focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/40 outline-none transition-all placeholder:text-[var(--text-tertiary)]/50 italic text-[var(--text-primary)]"
                           />
                        </div>

                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1 italic leading-none">Select Target Rider</label>
                           <select 
                              value={selectedRider}
                              onChange={(e) => setSelectedRider(e.target.value)}
                              className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-black tracking-widest focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/40 outline-none transition-all italic text-[var(--text-primary)]"
                           >
                              <option value="">Choose Rider Node...</option>
                              {subscribers.filter(s => s.persona?.toLowerCase() === 'rider').map(r => (
                                 <option key={r.id} value={r.id}>{r.name || r.phone}</option>
                              ))}
                           </select>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest ml-1 italic leading-none">Zone Protocol</label>
                           <div className="grid grid-cols-3 gap-2">
                              {['inclusion', 'exclusion', 'speed-cap'].map((type) => (
                                 <button
                                    key={type}
                                    type="button"
                                    onClick={() => setNewZoneType(type)}
                                    className={`py-2 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all italic leading-none ${
                                       newZoneType === type 
                                       ? 'bg-emerald-600 border-emerald-500 text-white shadow-md' 
                                       : 'bg-[var(--bg-tertiary)] border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:border-emerald-500/30'
                                    }`}
                                 >
                                    {type}
                                 </button>
                              ))}
                           </div>
                        </div>
                     </div>

                     <button 
                        type="submit"
                        className="w-full py-4 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-950/20 hover:bg-emerald-700 transition-all active:scale-95 italic"
                     >
                        Initialize Perimeter Protocol
                     </button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
