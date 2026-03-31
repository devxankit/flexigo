import { create } from 'zustand';

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
  activeRide: null,
  rideHistory: [],

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

  endRide: () => {
    const state = get();
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
  },

  resetRide: () => set({ rideStatus: 'idle', activeRide: null }),

  setUnlocking: () => set({ rideStatus: 'unlocking' }),
  isDiagnosticsOpen: false,
  setDiagnosticsOpen: (isOpen) => set({ isDiagnosticsOpen: isOpen }),
}));
