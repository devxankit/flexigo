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

      generateAadhaarOTP: async (aadhaarNumber) => {
        try {
          const res = await api.post('/rider/kyc/aadhaar/generate-otp', { aadhaarNumber });
          return res.data;
        } catch (error) {
          return { success: false, message: error.response?.data?.message || 'Failed to send Aadhaar OTP' };
        }
      },

      verifyAadhaarOTP: async (clientId, otp) => {
        try {
          const { phone } = get();
          const res = await api.post('/rider/kyc/aadhaar/verify-otp', { client_id: clientId, otp, phone });
          if (res.data.success) {
             // Profile will be auto-updated by fetchProfile later or we can set it here if we want
             return { success: true, data: res.data.data };
          }
        } catch (error) {
          return { success: false, message: error.response?.data?.message || 'Verification failed' };
        }
      },

      fetchProfile: async () => {
        try {
          const { user } = get();
          if (!user) return;
          const res = await api.get(`/rider/profile/${user.phone}`);
          if (res.data.success) {
            set({ user: res.data.rider, kycStatus: res.data.rider.kycStatus });
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
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
