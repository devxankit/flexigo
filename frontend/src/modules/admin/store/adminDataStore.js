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
    growthTier: "0%"
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
  isLoading: false,

  fetchDashboardStats: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/admin/dashboard-stats');
      if (res.data.success) {
        set({ networkStats: res.data.stats });
      }
    } catch (err) {
      console.error("Failed to fetch admin stats:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchHubs: async () => {
    try {
      const res = await api.get('/admin/hubs');
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

  fetchKycRecords: async () => {
    try {
      const res = await api.get('/admin/kyc');
      if (res.data.success) {
        set({ kycRecords: res.data.records });
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
        set(state => ({ plans: state.plans.filter(p => p._id !== id) }));
        return res.data;
      }
    } catch (err) {
      console.error("Failed to delete plan:", err);
      return { success: false, message: err.message };
    }
  }
}));
