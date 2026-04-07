export const adminDataStore = {
  // Global Network Stats
  networkStats: {
    totalHubs: 12,
    activeFleet: "1,240",
    totalSubscribers: "14,802",
    grossRevenue: 4280000,
    maintenanceAlerts: 4,
    hubUtilization: "94%",
    avgUptime: "99.8%"
  },

  // Hub Registry
  hubs: [
    { id: "NODE-BLR-01", name: "Indiranagar Hub", city: "Bangalore", fleet: 342, subs: 2100, revenue: 1240000, status: "active", health: "98%" },
    { id: "NODE-BLR-02", name: "Koramangala Hub", city: "Bangalore", fleet: 184, subs: 1400, revenue: 840000, status: "active", health: "94%" },
    { id: "NODE-BLR-03", name: "HSR Layout Hub", city: "Bangalore", fleet: 212, subs: 1800, revenue: 920000, status: "active", health: "82%" },
    { id: "NODE-MAH-01", name: "Andheri West Hub", city: "Mumbai", fleet: 420, subs: 3200, revenue: 1850000, status: "active", health: "97%" },
    { id: "NODE-PUN-01", name: "Hinjewadi Hub", city: "Pune", fleet: 156, subs: 950, revenue: 420000, status: "active", health: "91%" },
  ],

  // Revenue Series (MTD)
  revenueData: [
    { name: 'Week 1', value: 8.4 },
    { name: 'Week 2', value: 12.2 },
    { name: 'Week 3', value: 14.8 },
    { name: 'Week 4', value: 7.4 },
  ],

  // Fleet Distribution
  fleetDistribution: [
    { name: 'In-Transit', value: 842 },
    { name: 'At-Hub', value: 312 },
    { name: 'Maintenance', value: 54 },
    { name: 'Offline', value: 32 },
  ],

  // Module Specific Entities
  vehicles: [
    { id: 'EV-9021', rider: 'Rahul Sharma', location: 'Koramangala, BLR', battery: 84, status: 'moving', lastPing: '2s ago', soh: 98, temp: '32°C' },
    { id: 'EV-4412', rider: 'Anita Desai', location: 'Indiranagar, BLR', battery: 32, status: 'idle', lastPing: '1m ago', soh: 84, temp: '41°C' },
    { id: 'EV-7721', rider: 'Vikram Singh', location: 'Whitefield, BLR', battery: 91, status: 'moving', lastPing: 'Just now', soh: 99, temp: '29°C' },
    { id: 'EV-1029', rider: 'Priya Mani', location: 'HSR Layout, BLR', battery: 12, status: 'low-battery', lastPing: '5s ago', soh: 72, temp: '48°C' },
  ],

  geofences: [
    { id: 'GF-101', name: 'Koramangala Restricted', radius: '1.2km', status: 'active', alerts: 14, type: 'exclusion' },
    { id: 'GF-102', name: 'HSR Delivery Zone', radius: '2.5km', status: 'active', alerts: 0, type: 'inclusion' },
    { id: 'GF-103', name: 'Indiranagar Hub Outer', radius: '0.8km', status: 'inactive', alerts: 2, type: 'exclusion' },
  ],

  kycRecords: [
    { id: 'KYC-001', name: 'Arjun Kapur', role: 'Driver', status: 'pending', date: '2h ago' },
    { id: 'KYC-002', name: 'Zeba Khan', role: 'Consumer', status: 'approved', date: '5h ago' },
    { id: 'KYC-003', name: 'Suresh Raina', role: 'Franchise', status: 'rejected', date: '1d ago' },
  ],

  employees: [
    { id: 'EMP-001', name: 'Kabir Vats', role: 'Fleet Lead', dept: 'Operations', status: 'active', shift: 'Morning' },
    { id: 'EMP-002', name: 'Sara Qureshi', role: 'Compliance Officer', dept: 'Legal', status: 'active', shift: 'Regular' },
    { id: 'EMP-003', name: 'Nikhil Verma', role: 'BMS Engineer', dept: 'Engineering', status: 'on-leave', shift: 'Night' },
  ],
};

// Export hook-like wrapper for convenience if needed, though usually used via context
export const useAdminDataStore = () => adminDataStore;

