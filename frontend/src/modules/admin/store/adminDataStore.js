import { create } from 'zustand';
import api from '../../../lib/axios';

export const useAdminDataStore = create((set, get) => ({
  networkStats: {
    totalHubs: 0,
    activeFleet: 0,
    totalSubscribers: 0,
    grossRevenue: 0,
    maintenanceAlerts: 0,
    hubUtilization: "0%",
    avgUptime: "0%",
    churnRate: "0%",
    growthTier: "0%",
    yieldProjection: "₹0L",
    churnDelta: "0%",
    nodeLoad: "0%",
    riskScoring: "0/100",
    regionalYield: []
  },
  hubs: [],
  revenueData: [
    { name: 'Week 1', value: 0 },
    { name: 'Week 2', value: 0 },
    { name: 'Week 3', value: 0 },
    { name: 'Week 4', value: 0 },
  ],
  fleetDistribution: [],
  vehicles: [],
  plans: [],
  kycRecords: [],
  subscribers: [],
  roles: [],
  campaigns: [],
  isLoading: false,

  fetchDashboardStats: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams();
      if (filters.range) params.append('range', typeof filters.range === 'object' ? JSON.stringify(filters.range) : filters.range);

      const res = await api.get(`/admin/dashboard-stats?${params.toString()}`);
      if (res.data.success) {
        set({
          networkStats: res.data.stats,
          revenueData: res.data.stats.revenueData || get().revenueData
        });
      }
    } catch (err) {
      console.error("Failed to fetch admin stats:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchHubs: async () => {
    try {
      // Get browser geolocation if available, then fetch hubs sorted by proximity
      const getCoords = () =>
        new Promise((resolve) => {
          if (!navigator.geolocation) return resolve(null);
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => resolve(null),
            { timeout: 4000 }
          );
        });

      const coords = await getCoords();
      const params = coords ? `?lat=${coords.lat}&lng=${coords.lng}` : '';
      const res = await api.get(`/admin/hubs${params}`);
      if (res.data.success) {
        set({ hubs: res.data.hubs });
      }
    } catch (err) {
      console.error("Failed to fetch hubs:", err);
    }
  },

  addHub: async (hubData) => {
    try {
      const res = await api.post('/admin/hubs', hubData);
      if (res.data.success) {
        set(state => ({ hubs: [res.data.hub, ...state.hubs] }));
        return res.data;
      }
    } catch (err) {
      console.error("Failed to add hub:", err);
      return { success: false, message: err.message };
    }
  },

  fetchDistribution: async () => {
    try {
      const res = await api.get('/admin/distribution');
      if (res.data.success) {
        set({ fleetDistribution: res.data.distribution });
      }
    } catch (err) {
      console.error("Failed to fetch distribution:", err);
    }
  },

  fetchPlans: async () => {
    try {
      const res = await api.get('/admin/plans');
      if (res.data.success) {
        set({ plans: res.data.plans });
      }
    } catch (err) {
      console.error("Failed to fetch plans:", err);
    }
  },

  kycStats: { markets: 0, gstSync: '0%', integrity: '0%' },
  fetchKycRecords: async () => {
    try {
      const res = await api.get('/admin/kyc');
      if (res.data.success) {
        set({
          kycRecords: res.data.records,
          kycStats: res.data.stats || get().kycStats
        });
      }
    } catch (err) {
      console.error("Failed to fetch KYC records:", err);
    }
  },

  updateKycStatus: async (id, status) => {
    try {
      const res = await api.patch(`/admin/kyc/${id}`, { status });
      if (res.data.success) {
        set(state => ({
          kycRecords: state.kycRecords.map(r => r.id === id ? { ...r, status } : r)
        }));
      }
    } catch (err) {
      console.error("Failed to update KYC status:", err);
    }
  },

  fetchSubscribers: async () => {
    try {
      const res = await api.get('/admin/subscribers');
      if (res.data.success) {
        set({ subscribers: res.data.subscribers });
      }
    } catch (err) {
      console.error("Failed to fetch subscribers:", err);
    }
  },

  fetchAllVehicles: async () => {
    try {
      const res = await api.get('/fleet'); // no franchiseId param = all
      if (res.data.success) {
        set({ vehicles: res.data.vehicles });
      }
    } catch (err) {
      console.error("Failed to fetch all vehicles:", err);
    }
  },

  fetchHubVehicles: async (hubId) => {
    try {
      const res = await api.get(`/fleet?franchiseId=${hubId}`);
      if (res.data.success) {
        return res.data.vehicles;
      }
      return [];
    } catch (err) {
      console.error("Failed to fetch hub vehicles:", err);
      return [];
    }
  },

  addPlan: async (planData) => {
    try {
      const res = await api.post('/admin/plans', planData);
      if (res.data.success) {
        set(state => ({ plans: [res.data.plan, ...state.plans] }));
        return res.data;
      }
    } catch (err) {
      console.error("Failed to add plan:", err);
      return { success: false, message: err.message };
    }
  },

  updatePlan: async (id, planData) => {
    try {
      const res = await api.patch(`/admin/plans/${id}`, planData);
      if (res.data.success) {
        set(state => ({
          plans: state.plans.map(p => p._id === id ? res.data.plan : p)
        }));
        return res.data;
      }
    } catch (err) {
      console.error("Failed to update plan:", err);
      return { success: false, message: err.message };
    }
  },

  deletePlan: async (id) => {
    try {
      const res = await api.delete(`/admin/plans/${id}`);
      if (res.data.success) {
        set(state => ({
          plans: state.plans.filter(p => p._id !== id && p.id !== id)
        }));
        return res.data;
      }
    } catch (err) {
      console.error("Failed to delete plan:", err);
      return { success: false, message: err.message };
    }
  },

  geofences: [],
  fetchGeofences: async () => {
    try {
      const res = await api.get('/admin/geofencing');
      if (res.data.success) {
        set({ geofences: res.data.geofences });
      }
    } catch (err) {
      console.error("Failed to fetch geofences:", err);
    }
  },

  createGeofence: async (data) => {
    try {
      const res = await api.post('/admin/geofencing', data);
      if (res.data.success) {
        set(state => ({ geofences: [res.data.geofence, ...state.geofences] }));
        return res.data;
      }
    } catch (err) {
      console.error("Failed to create geofence:", err);
      return { success: false, message: err.message };
    }
  },

  removeGeofence: async (id) => {
    try {
      const res = await api.delete(`/admin/geofencing/${id}`);
      if (res.data.success) {
        set(state => ({ geofences: state.geofences.filter(g => g._id !== id) }));
      }
    } catch (err) {
      console.error("Failed to delete geofence:", err);
    }
  },

  assignments: [],
  fetchAssignments: async () => {
    try {
      const res = await api.get('/admin/assignments');
      if (res.data.success) {
        set({ assignments: res.data.assignments });
      }
    } catch (err) {
      console.error("Failed to fetch assignments:", err);
    }
  },

  assignVehicle: async (data) => {
    try {
      const res = await api.post('/admin/assignments', data);
      if (res.data.success) {
        set(state => ({ assignments: [res.data.assignment, ...state.assignments] }));
        return res.data;
      }
    } catch (err) {
      console.error("Failed to create assignment:", err);
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },

  financeStats: { settled: '0L', liability: '0L', unitYield: '0k' },
  financeTransactions: [],
  fetchFinanceData: async () => {
    try {
      const res = await api.get('/admin/finance');
      if (res.data.success) {
        set({
          financeTransactions: res.data.transactions,
          financeStats: res.data.stats || get().financeStats
        });
      }
    } catch (err) {
      console.error("Failed to fetch finance data:", err);
    }
  },

  inventory: [],
  billing: [],
  inventoryStats: { totalItems: 0, restockCount: '0', stockValue: '₹0L', unpaidAmount: '₹0L' },
  fetchInventoryData: async () => {
    try {
      const res = await api.get('/admin/inventory');
      if (res.data.success) {
        set({
          inventory: res.data.inventory,
          billing: res.data.billing,
          inventoryStats: res.data.stats || get().inventoryStats
        });
      }
    } catch (err) {
      console.error("Failed to fetch inventory data:", err);
    }
  },

  franchiseOps: [],
  franchiseOpsStats: { totalPartners: 0, activeNodes: 0, grossPayout: '₹0L', growth: '+0%' },
  fetchFranchiseOpsData: async () => {
    try {
      const res = await api.get('/admin/franchise-ops');
      if (res.data.success) {
        set({
          franchiseOps: res.data.franchises,
          franchiseOpsStats: res.data.stats || get().franchiseOpsStats
        });
      }
    } catch (err) {
      console.error("Failed to fetch franchise ops data:", err);
    }
  },

  complianceRecords: [],
  complianceStats: { activeFines: '0', autoSettled: '₹0K', complianceRate: '0%', apiStatus: 'Offline' },
  fetchComplianceData: async () => {
    try {
      const res = await api.get('/admin/compliance');
      if (res.data.success) {
        set({
          complianceRecords: res.data.challans,
          complianceStats: res.data.stats || get().complianceStats
        });
      }
    } catch (err) {
      console.error("Failed to fetch compliance data:", err);
    }
  },

  tickets: [],
  promos: [],
  engagementStats: { openTickets: 0, livePromos: '0', csatScore: '0%', slaReady: '0m' },
  fetchEngagementData: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.range) params.append('range', typeof filters.range === 'object' ? JSON.stringify(filters.range) : filters.range);

      const res = await api.get(`/admin/engagement?${params.toString()}`);
      if (res.data.success) {
        set({
          tickets: res.data.tickets,
          promos: res.data.promos || [],
          engagementStats: res.data.stats || get().engagementStats
        });
      }
    } catch (err) {
      console.error("Failed to fetch engagement data:", err);
    }
  },

  auditLogs: [],
  securityStats: { activeSessions: 0, authFailures: 0, integrity: 'N/A', globalNodes: '0' },
  fetchSecurityData: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.range) params.append('range', typeof filters.range === 'object' ? JSON.stringify(filters.range) : filters.range);

      const res = await api.get(`/admin/security?${params.toString()}`);
      if (res.data.success) {
        set({
          auditLogs: res.data.logs,
          securityStats: res.data.stats || get().securityStats
        });
      }
    } catch (err) {
      console.error("Failed to fetch security data:", err);
    }
  },

  subscribers: [],
  subscriberStats: { totalUsers: '0', dailyRiders: '0', kycVerified: '0%', flagged: '0' },
  fetchSubscriberData: async () => {
    try {
      const res = await api.get('/admin/subscribers');
      if (res.data.success) {
        set({
          subscribers: res.data.subscribers,
          subscriberStats: res.data.stats || get().subscriberStats
        });
      }
    } catch (err) {
      console.error("Failed to fetch subscriber data:", err);
    }
  },

  staff: [],
  staffStats: { totalStaff: 0, onDuty: 0, performance: '0%', leaves: '0' },
  fetchStaff: async () => {
    try {
      const res = await api.get('/admin/staff');
      if (res.data.success) {
        set({
          staff: res.data.staff,
          staffStats: res.data.stats || get().staffStats
        });
      }
    } catch (err) {
      console.error("Failed to fetch staff:", err);
    }
  },

  addStaff: async (data) => {
    try {
      const res = await api.post('/admin/staff', data);
      if (res.data.success) {
        await get().fetchStaff(); // Re-fetch to guarantee sync and sorting
        return res.data;
      }
    } catch (err) {
      console.error("Failed to add staff:", err);
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },

  updateStaff: async (id, data) => {
    try {
      const res = await api.put(`/admin/staff/${id}`, data);
      if (res.data.success) {
        await get().fetchStaff();
        return res.data;
      }
    } catch (err) {
      console.error("Failed to update staff:", err);
      return { success: false, message: err.message };
    }
  },

  removeStaff: async (id) => {
    try {
      const res = await api.delete(`/admin/staff/${id}`);
      if (res.data.success) {
        set(state => ({ staff: state.staff.filter(s => s._id !== id) }));
        return res.data;
      }
    } catch (err) {
      console.error("Failed to delete staff:", err);
      return { success: false, message: err.message };
    }
  },

  vehicleStats: {
    fleetHealth: '0%',
    bmsTags: '0',
    thermals: '00',
    gridEfficiency: '0%',
    perfSeries: [],
    assetRegistry: []
  },
  fetchVehicleStats: async () => {
    try {
      const res = await api.get('/admin/vehicle-stats');
      if (res.data.success) {
        set({ vehicleStats: res.data.stats });
      }
    } catch (err) {
      console.error("Failed to fetch vehicle stats:", err);
    }
  },

  riderBehaviour: {
    activeAlerts: '0',
    lowBalance: '0',
    docExpiry: '0',
    cleanup: '0%',
    behaviourAlerts: []
  },
  fetchRiderBehaviour: async () => {
    try {
      const res = await api.get('/admin/rider-behaviour');
      if (res.data.success) {
        set({ riderBehaviour: res.data.stats });
      }
    } catch (err) {
      console.error("Failed to fetch rider behaviour:", err);
    }
  },

  fetchRoles: async () => {
    try {
      const res = await api.get('/admin/roles');
      if (res.data.success) {
        set({ roles: res.data.roles });
      }
    } catch (err) {
      console.error("Failed to fetch roles:", err);
    }
  },

  addRole: async (roleData) => {
    try {
      const res = await api.post('/admin/roles', roleData);
      if (res.data.success) {
        set(state => ({ roles: [res.data.role, ...state.roles] }));
        return res.data;
      }
    } catch (err) {
      console.error("Failed to add role:", err);
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },

  fetchCampaigns: async () => {
    try {
      const res = await api.get('/admin/campaigns');
      if (res.data.success) {
        set({ campaigns: res.data.campaigns });
      }
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
    }
  },

  addCampaign: async (campaignData) => {
    try {
      const res = await api.post('/admin/campaigns', campaignData);
      if (res.data.success) {
        set(state => ({ campaigns: [res.data.campaign, ...state.campaigns] }));
        return res.data;
      }
    } catch (err) {
      console.error("Failed to add campaign:", err);
      return { success: false, message: err.response?.data?.message || err.message };
    }
  }
}));
