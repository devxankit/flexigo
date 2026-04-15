import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../../../lib/axios';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      phone: null,
      otpSent: false,
      user: null,
      kycStatus: 'uninitiated', // uninitiated | pending | approved | rejected
      token: null,

      setPhone: (phone) => set({ phone }),
      
      sendOTP: async (phone) => {
        try {
          const res = await api.post('/rider/auth/send-otp', { phone });
          if (res.data.success) {
            set({ phone, otpSent: true });
            return { success: true };
          }
        } catch (error) {
          return { success: false, message: error.response?.data?.message || 'Failed to send OTP' };
        }
      },

      verifyOTP: async (otp) => {
        try {
          const { phone } = get();
          const res = await api.post('/rider/auth/verify-otp', { phone, otp });
          if (res.data.success) {
            set({ 
              isAuthenticated: true, 
              user: res.data.rider, 
              token: res.data.token,
              kycStatus: res.data.rider.kycStatus 
            });
            return { success: true, rider: res.data.rider };
          }
        } catch (error) {
          return { success: false, message: error.response?.data?.message || 'Invalid OTP' };
        }
      },

      updateKYC: async (kycData) => {
        try {
          const { phone } = get();
          const res = await api.post('/rider/kyc/update', { ...kycData, phone });
          if (res.data.success) {
            set({ kycStatus: 'pending', user: res.data.rider });
            return { success: true };
          }
        } catch (error) {
          return { success: false, message: error.response?.data?.message || 'Failed to update KYC' };
        }
      },

      logout: () => {
        set({ 
            isAuthenticated: false, 
            phone: null, 
            user: null, 
            kycStatus: 'uninitiated', 
            token: null, 
            otpSent: false 
        });
        localStorage.removeItem('rider-auth');
      },
    }),
    { name: 'rider-auth' }
  )
);
