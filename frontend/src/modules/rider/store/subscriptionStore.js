import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSubscriptionStore = create(
  persist(
    (set) => ({
      activePlan: null,
      selectedPlan: null,
      plans: [
        {
          id: 'daily',
          label: 'Daily',
          price: 299,
          duration: '1 Day',
          perks: ['Unlimited rides', 'Free battery swap (2x)', '24/7 support'],
          color: '#00D4FF',
          popular: false,
        },
        {
          id: 'weekly',
          label: 'Weekly',
          price: 1499,
          duration: '7 Days',
          perks: ['Unlimited rides', 'Free battery swap (15x)', 'Priority support', 'Ride insurance'],
          color: '#39FF14',
          popular: true,
        },
        {
          id: 'monthly',
          label: 'Monthly',
          price: 4999,
          duration: '30 Days',
          perks: ['Unlimited rides', 'Unlimited battery swaps', 'Dedicated support', 'Ride insurance', 'Hub priority access'],
          color: '#BF5AF2',
          popular: false,
        },
      ],

      selectPlan: (plan) => set({ selectedPlan: plan }),
      activatePlan: (plan) => set({ activePlan: { ...plan, activatedAt: Date.now(), expiresAt: Date.now() + plan.durationMs } }),
    }),
    { name: 'rider-subscription' }
  )
);
