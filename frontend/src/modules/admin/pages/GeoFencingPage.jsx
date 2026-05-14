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
  Info,
  Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleMap, useJsApiLoader, CircleF, MarkerF } from '@react-google-maps/api';
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
    allRiders,
    subscribers,
    networkStats,
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
    fetchGeofences(newFilters);
    console.log('Geo Fencing Sync:', newFilters);
  };

  const [activeTab, setActiveTab] = useState('registry'); // 'registry' or 'alerts'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [editingGeofenceId, setEditingGeofenceId] = useState(null);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneType, setNewZoneType] = useState('inclusion');
  const [selectedRider, setSelectedRider] = useState('');
  const [draftCenter, setDraftCenter] = useState(null);
  const [draftRadius, setDraftRadius] = useState(1000); // meters

  const handleMapClick = (e) => {
    if (isModalOpen) {
      setDraftCenter({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setNewZoneName('');
    setNewZoneType('inclusion');
    setSelectedRider('');
    setDraftCenter(userLocation);
    setDraftRadius(1000);
    setIsModalOpen(true);
  };

  const openEditModal = (gf) => {
    setModalMode('edit');
    setEditingGeofenceId(gf._id || gf.id);
    setNewZoneName(gf.name);
    setNewZoneType(gf.type);
    setSelectedRider(gf.riderId?._id || gf.riderId?.id || gf.riderId || '');
    setDraftCenter(gf.center);
    
    // Parse radius string "1.5km" -> 1500
    const rMatch = gf.radius?.match(/([\d.]+)/);
    const rVal = rMatch ? parseFloat(rMatch[1]) : 1;
    setDraftRadius(rVal * 1000);
    
    setIsModalOpen(true);
  };

  const handleSaveZone = async (e) => {
    e.preventDefault();
    if (!newZoneName || !selectedRider || !draftCenter) return;
    
    const radiusStr = `${(draftRadius / 1000).toFixed(1)}km`;
    const payload = {
      name: newZoneName,
      type: newZoneType,
      radius: radiusStr,
      riderId: selectedRider,
      center: draftCenter
    };

    if (modalMode === 'create') {
      await createGeofence(payload);
    } else {
      await useAdminDataStore.getState().updateGeofence(editingGeofenceId, payload);
    }

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
            <div className="flex bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-1 rounded-xl">
               {['registry', 'alerts'].map((tab) => (
                  <button
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                        activeTab === tab 
                        ? 'bg-emerald-600 text-white shadow-md' 
                        : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                     }`}
                  >
                     {tab}
                  </button>
               ))}
            </div>
            <OpsFilter onFilterChange={handleFilterChange} />
            <button 
               onClick={openCreateModal}
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
                  <div className="flex items-center gap-3">
                     <button onClick={() => setActiveTab('alerts')} className="text-[8px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-all">View All Logs</button>
                     <button onClick={() => setNotifications([])} className="text-[8px] font-black uppercase tracking-widest text-rose-500/50 hover:text-rose-500 transition-all">Clear All</button>
                  </div>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <AdminStatCard 
            title="Total Fleet" 
            value={networkStats.geofenceStats?.totalRiders || allRiders.length} 
            icon={User} 
            color="blue" 
            subtitle="Active Riders" 
         />
         <AdminStatCard 
            title="Active Zones" 
            value={networkStats.geofenceStats?.activeZones || geofences.filter(gf => gf.riderId).length} 
            icon={MapIcon} 
            color="emerald" 
            subtitle="Monitored Nodes" 
         />
         <AdminStatCard 
            title="Breaches" 
            value={networkStats.geofenceStats?.breaches || (notifications.length > 0 ? `0${notifications.length}` : "00")} 
            icon={AlertTriangle} 
            color="rose" 
            subtitle="Live Alerts" 
         />
      </div>

      <AnimatePresence mode="wait">
         {activeTab === 'registry' ? (
            <motion.div 
               key="registry"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
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
                     <table className="w-full">
                        <thead>
                           <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/5">
                              {['Rider Identity', 'Type', 'Radius', 'Status', 'Alerts', 'Actions'].map((header) => (
                                 <th key={header} className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-secondary)] whitespace-nowrap">{header}</th>
                              ))}
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-subtle)]">
                           <AnimatePresence mode='popLayout'>
                           {allRiders.map((rider) => {
                              const gf = geofences.find(g => (g.riderId?._id || g.riderId) === (rider._id || rider.id));
                              const isSelected = selectedZone?._id === gf?._id && gf !== undefined;
                              
                              return (
                                 <motion.tr 
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    key={rider._id || rider.id} 
                                    onClick={() => {
                                       if (gf) setSelectedZone(gf);
                                       else if (rider.lastLocation) {
                                          map?.panTo(rider.lastLocation);
                                          map?.setZoom(16);
                                       }
                                    }}
                                    className={`group/row hover:bg-emerald-500/5 transition-all cursor-pointer ${isSelected ? 'bg-emerald-500/5' : ''}`}
                                 >
                                    <td className="py-2 px-4 whitespace-nowrap">
                                       <div className="flex flex-col">
                                          <span className="font-medium text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors">{rider.name || 'Unnamed Rider'}</span>
                                          <span className="font-medium text-[var(--text-tertiary)] mt-1">{rider.phone}</span>
                                       </div>
                                    </td>
                                    <td className="py-2 px-4">
                                       <span className={`font-medium px-2 py-0.5 rounded border ${
                                          gf ? (gf.type === 'exclusion' ? 'bg-rose-500/10 text-rose-500 border-rose-500/10' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10') : 'bg-slate-500/10 text-slate-500 border-slate-500/10'
                                       }`}>
                                          {gf ? gf.type : 'No Zone'}
                                       </span>
                                    </td>
                                    <td className="py-2 px-4 font-medium text-[var(--text-primary)]">{gf ? gf.radius : '--'}</td>
                                    <td className="py-2 px-4">
                                       <div className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded font-medium border ${
                                          gf?.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' : 'bg-slate-500/10 text-slate-500 border-slate-500/10'
                                       }`}>
                                          <div className={`w-1 h-1 rounded-full ${gf?.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                                          {gf ? gf.status : 'noactive'}
                                       </div>
                                    </td>
                                    <td className="py-2 px-4">
                                       <span className={`font-medium ${gf?.alerts > 0 ? 'text-rose-500' : 'text-[var(--text-tertiary)]'}`}>{gf ? gf.alerts : 0} FLUX</span>
                                    </td>
                                    <td className="py-2 px-4">
                                       <div className="flex items-center gap-2">
                                          {gf ? (
                                             <>
                                                <button 
                                                   onClick={(e) => { e.stopPropagation(); openEditModal(gf); }}
                                                   className="p-1.5 text-[var(--text-tertiary)] hover:text-emerald-500 hover:bg-emerald-500/5 rounded-lg transition-all"
                                                >
                                                   <Edit size={14} />
                                                </button>
                                                <button 
                                                   onClick={(e) => { e.stopPropagation(); deleteZone(gf._id || gf.id); }}
                                                   className="p-1.5 text-[var(--text-tertiary)] hover:text-rose-500 hover:bg-rose-600/5 rounded-lg transition-all"
                                                >
                                                   <X size={14} />
                                                </button>
                                             </>
                                          ) : (
                                             <button 
                                                onClick={(e) => { e.stopPropagation(); openCreateModal(); setSelectedRider(rider._id || rider.id); }}
                                                className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all"
                                                title="Create Zone"
                                             >
                                                <Plus size={14} strokeWidth={3} />
                                             </button>
                                          )}
                                       </div>
                                    </td>
                                 </motion.tr>
                              );
                           })}
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
                              center={isModalOpen ? draftCenter : (selectedZone?.riderId?.lastLocation || selectedZone?.center || userLocation)}
                              zoom={isModalOpen || selectedZone ? 15 : 12}
                              onLoad={onLoad}
                              onUnmount={onUnmount}
                              onClick={handleMapClick}
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
                              {isModalOpen && draftCenter && (
                                 <>
                                    <CircleF 
                                       center={draftCenter}
                                       radius={draftRadius}
                                       options={{
                                          strokeColor: newZoneType === 'exclusion' ? '#f43f5e' : '#10b981',
                                          strokeOpacity: 0.8,
                                          strokeWeight: 2,
                                          fillColor: newZoneType === 'exclusion' ? '#f43f5e' : '#10b981',
                                          fillOpacity: 0.15,
                                          editable: true,
                                          draggable: true
                                       }}
                                    />
                                    <MarkerF 
                                       position={draftCenter}
                                       label={{
                                          text: "DRAG PIN TO SET CENTER",
                                          color: 'white',
                                          fontSize: '8px',
                                          fontWeight: '900',
                                          className: 'uppercase tracking-tighter mt-12'
                                       }}
                                       draggable={true}
                                       onDragEnd={(e) => setDraftCenter({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
                                    />
                                 </>
                              )}

                              {!isModalOpen && selectedZone && (() => {
                                 const targetLoc = selectedZone.riderId?.lastLocation || selectedZone.center || userLocation;
                                 const isNewDelhi = targetLoc.lat === 28.6139 && targetLoc.lng === 77.2090;
                                 const finalLoc = (isNewDelhi && userLocation) ? userLocation : targetLoc;
                                 
                                 const rMatch = selectedZone.radius?.match(/([\d.]+)/);
                                 const rMeters = rMatch ? parseFloat(rMatch[1]) * 1000 : 1000;

                                 return (
                                    <>
                                       <CircleF 
                                          center={selectedZone.center || finalLoc}
                                          radius={rMeters}
                                          options={{
                                             strokeColor: selectedZone.type === 'exclusion' ? '#f43f5e' : '#10b981',
                                             strokeOpacity: 0.8,
                                             strokeWeight: 2,
                                             fillColor: selectedZone.type === 'exclusion' ? '#f43f5e' : '#10b981',
                                             fillOpacity: 0.15,
                                          }}
                                       />
                                       <MarkerF 
                                          position={finalLoc}
                                          icon={{
                                             url: 'https://maps.google.com/mapfiles/ms/icons/motorcycling.png'
                                          }}
                                          label={{
                                             text: selectedZone.riderId?.name || 'Rider',
                                             color: '#10b981',
                                             fontSize: '10px',
                                             fontWeight: '900',
                                             className: 'uppercase tracking-tighter mt-10'
                                          }}
                                       />
                                    </>
                                 );
                              })()}
                              
                              {/* Render All Zones */}
                              {!isModalOpen && geofences.map(gf => gf.center && (
                                 <CircleF 
                                    key={gf._id}
                                    center={gf.center}
                                    radius={parseFloat(gf.radius) * 1000}
                                    options={{
                                       strokeColor: gf.type === 'exclusion' ? '#f43f5e' : '#10b981',
                                       strokeOpacity: 0.4,
                                       strokeWeight: 1,
                                       fillColor: gf.type === 'exclusion' ? '#f43f5e' : '#10b981',
                                       fillOpacity: 0.05,
                                    }}
                                 />
                              ))}

                              {/* Render All Riders with lastLocation */}
                              {!isModalOpen && allRiders.map(rider => rider.lastLocation && (
                                 <MarkerF 
                                    key={rider._id}
                                    position={rider.lastLocation}
                                    onClick={() => {
                                      const gf = geofences.find(g => (g.riderId?._id || g.riderId) === (rider._id || rider.id));
                                      if (gf) setSelectedZone(gf);
                                      else {
                                        map.panTo(rider.lastLocation);
                                        map.setZoom(16);
                                      }
                                    }}
                                    icon={{
                                       url: 'https://maps.google.com/mapfiles/ms/icons/motorcycling.png',
                                       scaledSize: new window.google.maps.Size(30, 30)
                                    }}
                                    label={{
                                       text: rider.name || 'Rider',
                                       color: '#10b981',
                                       fontSize: '9px',
                                       fontWeight: '900',
                                       className: 'uppercase tracking-tighter mt-10'
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
            </motion.div>
         ) : (
            <motion.div 
               key="alerts"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm min-h-[500px]"
            >
               <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-rose-500/5">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shadow-inner">
                        <Bell size={16} />
                     </div>
                     <div className="space-y-0.5">
                        <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-wider leading-none italic">Anomalous Perimeter Breach Logs</h3>
                        <p className="text-[7px] font-bold text-rose-500/70 uppercase tracking-widest">Real-time Security Telemetry</p>
                     </div>
                  </div>
                  <button 
                     onClick={() => setNotifications([])}
                     className="px-3 py-1.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all"
                  >
                     Purge Logs
                  </button>
               </div>
               
               <div className="p-6">
                  {notifications.length === 0 ? (
                     <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="w-16 h-16 bg-emerald-500/5 rounded-full flex items-center justify-center border border-emerald-500/10">
                           <Shield size={24} className="text-emerald-500/50" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-[var(--text-primary)] uppercase italic tracking-widest">Perimeter Secure</p>
                           <p className="text-[8px] text-[var(--text-tertiary)] font-bold uppercase tracking-wider">No breaches detected in the current session.</p>
                        </div>
                     </div>
                  ) : (
                     <div className="space-y-3">
                        {notifications.map((n, idx) => (
                           <motion.div 
                              key={n.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="flex items-center justify-between bg-[var(--bg-tertiary)]/30 border border-rose-500/10 p-4 rounded-xl hover:border-rose-500/30 transition-all group"
                           >
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                                    <AlertTriangle size={18} />
                                 </div>
                                 <div className="space-y-1">
                                    <p className="text-xs font-black text-[var(--text-primary)] uppercase tracking-tighter italic leading-none group-hover:text-rose-500 transition-colors">
                                       {n.message}
                                    </p>
                                    <div className="flex items-center gap-2">
                                       <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest">{n.type} Detected</span>
                                       <span className="w-1 h-1 bg-[var(--border-subtle)] rounded-full" />
                                       <span className="text-[8px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">{n.time}</span>
                                    </div>
                                 </div>
                              </div>
                              <button 
                                onClick={() => {
                                  const rider = allRiders.find(r => n.message.includes(r.name));
                                  if (rider?.lastLocation) {
                                    setActiveTab('registry');
                                    map.panTo(rider.lastLocation);
                                    map.setZoom(16);
                                  }
                                }}
                                className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-tertiary)] hover:text-emerald-500 transition-all"
                              >
                                 <Navigation size={14} />
                              </button>
                           </motion.div>
                        ))}
                     </div>
                  )}
               </div>
            </motion.div>
         )}
      </AnimatePresence>

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
                        <h2 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tighter italic leading-none">{modalMode === 'create' ? 'Create' : 'Edit'} <span className="text-emerald-500">Security Zone</span></h2>
                        <p className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest leading-none mt-1">{modalMode === 'create' ? 'Protocol Generation Module' : 'Configuration Override Module'}</p>
                     </div>
                     <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-rose-600/10 hover:text-rose-500 transition-all rounded-lg">
                        <X size={18} />
                     </button>
                  </div>

                  <form onSubmit={handleSaveZone} className="space-y-6 relative z-10">
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
                           <div className="flex justify-between items-center ml-1">
                              <label className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest italic leading-none">Perimeter Radius</label>
                              <span className="text-[9px] font-black text-emerald-500 uppercase italic tracking-widest">{(draftRadius / 1000).toFixed(1)}KM</span>
                           </div>
                           <input 
                              type="range"
                              min="100"
                              max="50000"
                              step="100"
                              value={draftRadius}
                              onChange={(e) => setDraftRadius(parseInt(e.target.value))}
                              className="w-full accent-emerald-600 h-1.5 bg-[var(--bg-tertiary)] rounded-full appearance-none cursor-pointer border border-[var(--border-subtle)]"
                           />
                           <div className="flex justify-between text-[6px] font-black text-[var(--text-tertiary)] uppercase tracking-widest opacity-50 px-1">
                              <span>0.1KM</span>
                              <span>50KM</span>
                           </div>
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
                        {modalMode === 'create' ? 'Initialize Perimeter Protocol' : 'Apply Configuration Patch'}
                     </button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
