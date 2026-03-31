import { create } from 'zustand';

export const useHandoverStore = create((set) => ({
  activeStep: 0,
  handoverData: {
    riderId: null,
    vehicleId: null,
    photos: { front: null, back: null, left: null, right: null },
    inspection: { body: false, tires: false, mirrors: false, lights: false, batteryCable: false },
    batteryLevel: 80,
    dues: 0,
    finalStatus: 'available', // available | quarantined | in-service
  },

  setStep: (step) => set({ activeStep: step }),
  
  updateHandoverData: (data) => set((state) => ({
    handoverData: { ...state.handoverData, ...data }
  })),

  resetHandover: () => set({
    activeStep: 0,
    handoverData: {
      riderId: null,
      vehicleId: null,
      photos: { front: null, back: null, left: null, right: null },
      inspection: { body: false, tires: false, mirrors: false, lights: false, batteryCable: false },
      batteryLevel: 80,
      dues: 0,
      finalStatus: 'available',
    }
  })
}));
