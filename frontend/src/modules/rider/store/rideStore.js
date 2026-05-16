import { create } from 'zustand';
import api from '../../../lib/axios';

export const useRideStore = create((set, get) => ({
  rideStatus: 'idle', // idle | unlocking | active | ending | completed
  vehicle: {
    id: 'FLX-2024-001',
    model: 'Flexigo S1 Pro',
    battery: 87,
    range: 94,
    location: 'Hub A - Koramangala',
    plateNumber: 'KA 05 EV 1234',
  },
  currentAddress: 'Detecting Location...',
  activeRide: null,
  rideHistory: [],
  hubs: [],
  hubLoading: true,

  setCurrentAddress: (address) => set({ currentAddress: address }),

  startRide: () => {
    const startTime = Date.now();
    set({
      rideStatus: 'active',
      activeRide: {
        startTime,
        distance: 0,
        startBattery: get().vehicle.battery,
      },
    });
  },

  updateRideStats: (distance, battery) =>
    set((state) => ({
      vehicle: { ...state.vehicle, battery, range: Math.round(battery * 1.08) },
      activeRide: state.activeRide ? { ...state.activeRide, distance } : null,
    })),

  endRide: async () => {
    const state = get();
    try {
      // 1. Notify Backend / Admin about handover intent
      await get().requestHandover();

      // 2. Update local state
      const completedRide = {
        ...state.activeRide,
        endTime: Date.now(),
        finalBattery: state.vehicle.battery,
        cost: Math.round(state.activeRide?.distance * 1.5) || 0,
      };
      set({
        rideStatus: 'completed',
        activeRide: completedRide,
        rideHistory: [completedRide, ...state.rideHistory],
      });
    } catch (err) {
      console.error("End ride notification failed:", err);
    }
  },

  resetRide: () => set({ rideStatus: 'idle', activeRide: null }),

  setUnlocking: () => set({ rideStatus: 'unlocking' }),
  isDiagnosticsOpen: false,
  setDiagnosticsOpen: (isOpen) => set({ isDiagnosticsOpen: isOpen }),
  
  fetchHubs: async (lat, lng) => {
    try {
      set({ hubLoading: true });
      const url = lat && lng ? `/rider/hubs?lat=${lat}&lng=${lng}` : '/rider/hubs';
      const res = await api.get(url);
      if (res.data.success) {
        set({ hubs: res.data.hubs, hubLoading: false });
      }
    } catch (err) {
      console.error("Failed to fetch hubs:", err);
      set({ hubLoading: false });
    }
  },

  fetchMyVehicle: async (phone) => {
    try {
      const res = await api.get(`/rider/my-vehicle/${phone}`);
      if (res.data.success) {
        set({ vehicle: res.data.vehicle });
      }
    } catch (err) {
      console.error("Failed to fetch vehicle:", err);
    }
  },
  
  requestHandover: async () => {
    try {
      const res = await api.post('/rider/handover/request');
      return res.data;
    } catch (err) {
      console.error("Handover request failed:", err);
      return { success: false, message: err.response?.data?.message || 'Handover request failed' };
    }
  }
}));
