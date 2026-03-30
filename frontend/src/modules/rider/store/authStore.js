import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      phone: null,
      otpSent: false,
      user: null,
      kycStatus: 'pending', // pending | submitted | verified

      setPhone: (phone) => set({ phone }),
      setOtpSent: (val) => set({ otpSent: val }),
      setAuthenticated: (user) => set({ isAuthenticated: true, user }),
      setKycStatus: (status) => set({ kycStatus: status }),
      logout: () => set({ isAuthenticated: false, phone: null, user: null, kycStatus: 'pending' }),
    }),
    { name: 'rider-auth' }
  )
);
