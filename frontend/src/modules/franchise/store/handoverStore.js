import { create } from 'zustand';

export const useHandoverStore = create((set) => ({
  activeStep: 0,
  mode: 'intake', // intake | dispatch
  handoverData: {
    riderId: null,
    vehicleId: null,
    photos: { front: null, back: null, left: null, right: null },
    inspection: { body: false, tires: false, mirrors: false, lights: false, batteryCable: false },
    batteryLevel: 80,
    returnDate: null,
    dues: 0,
    finalStatus: 'available', // available | quarantined | in-service
  },

  setStep: (step) => set({ activeStep: step }),
  setMode: (mode) => set({ mode, activeStep: 0 }),
  
  updateHandoverData: (data) => set((state) => ({
    handoverData: { ...state.handoverData, ...data }
  })),

  resetHandover: () => set((state) => ({
    activeStep: 0,
    handoverData: {
      riderId: null,
      vehicleId: null,
      photos: { front: null, back: null, left: null, right: null },
      inspection: { body: false, tires: false, mirrors: false, lights: false, batteryCable: false },
      batteryLevel: 80,
      returnDate: null,
      dues: 0,
      finalStatus: 'available',
    }
  }))
}));
