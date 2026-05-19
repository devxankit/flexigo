import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../../../lib/axios';
import { useWalletStore } from './walletStore';
import { useSubscriptionStore } from './subscriptionStore';
import { useRideStore } from './rideStore';

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

      verifyOTP: async (otp, fcmToken = null) => {
        try {
          const { phone } = get();
          const res = await api.post('/rider/auth/verify-otp', { phone, otp, fcmToken });
          if (res.data.success) {
            set({ 
              isAuthenticated: true, 
              user: res.data.rider, 
              token: res.data.token,
              kycStatus: res.data.rider.kycStatus 
            });
            
            // Sync with other stores
            if (res.data.rider.walletBalance !== undefined) {
              useWalletStore.setState({ balance: res.data.rider.walletBalance });
            }
            if (res.data.rider.subscriptionPlan) {
              useSubscriptionStore.setState({ 
                activePlan: { 
                  ...res.data.rider.subscriptionPlan, 
                  expiresAt: res.data.rider.subscriptionEnd 
                } 
              });
            }
            
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
            
            // Sync only if profile location is fresher than current live GPS state
            if (res.data.rider.lastLocation && res.data.rider.lastLocation.address) {
              useRideStore.getState().syncProfileLocation(res.data.rider.lastLocation);
            }
            
            // Sync with other stores
            if (res.data.rider.walletBalance !== undefined) {
              useWalletStore.setState({ balance: res.data.rider.walletBalance });
            }
            if (res.data.rider.subscriptionPlan) {
              useSubscriptionStore.setState({ 
                activePlan: { 
                  ...res.data.rider.subscriptionPlan, 
                  expiresAt: res.data.rider.subscriptionEnd 
                } 
              });
            }
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
        // Clear all persistent storage keys for the rider module
        localStorage.removeItem('rider-auth');
        localStorage.removeItem('rider-subscription');
        localStorage.removeItem('rider-wallet');
        
        // Use window.location to ensure memory stores (Zustand) are also wiped for the next user
        window.location.href = '/rider/auth/phone';
      },
    }),
    { name: 'rider-auth' }
  )
);
