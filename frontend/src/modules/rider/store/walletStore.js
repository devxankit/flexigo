import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWalletStore = create(
  persist(
    (set, get) => ({
      balance: 2450,
      transactions: [
        { id: 1, type: 'credit', label: 'Added to wallet', amount: 500, date: '30 Mar 2026', time: '10:22 AM' },
        { id: 2, type: 'debit', label: 'Weekly Plan - Renewal', amount: 1499, date: '28 Mar 2026', time: '09:00 AM' },
        { id: 3, type: 'debit', label: 'Ride - Koramangala to HSR', amount: 0, date: '27 Mar 2026', time: '06:45 PM' },
        { id: 4, type: 'credit', label: 'Added to wallet', amount: 2000, date: '25 Mar 2026', time: '11:10 AM' },
        { id: 5, type: 'debit', label: 'Battery Swap Fee', amount: 50, date: '24 Mar 2026', time: '03:30 PM' },
      ],

      addMoney: (amount) =>
        set((state) => ({
          balance: state.balance + amount,
          transactions: [
            {
              id: Date.now(),
              type: 'credit',
              label: 'Added to wallet',
              amount,
              date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
              time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            },
            ...state.transactions,
          ],
        })),

      deductMoney: (amount, label) =>
        set((state) => ({
          balance: Math.max(0, state.balance - amount),
          transactions: [
            {
              id: Date.now(),
              type: 'debit',
              label,
              amount,
              date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
              time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            },
            ...state.transactions,
          ],
        })),
    }),
    { name: 'rider-wallet' }
  )
);
