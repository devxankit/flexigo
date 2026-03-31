import { create } from 'zustand';

const initialTransactions = [
  { id: 'T-001', date: '2026-03-31T10:00:00', type: 'Subscription', amount: 450, subscriber: 'Naveen Kumar', status: 'completed' },
  { id: 'T-002', date: '2026-03-31T11:00:00', type: 'Payout', amount: -2000, subscriber: null, status: 'completed' },
  { id: 'T-003', date: '2026-03-31T12:00:00', type: 'Subscription', amount: 320, subscriber: 'Sandeep R.', status: 'completed' },
  { id: 'T-004', date: '2026-03-31T13:00:00', type: 'Subscription', amount: 900, subscriber: 'Ankita Singh', status: 'pending' },
];

export const useFranchiseWalletStore = create((set) => ({
  balance: 12500,
  pendingPayout: 3500,
  ledger: initialTransactions,

  addSubscriptionPayment: (amount, subscriber) => set((state) => ({
    balance: state.balance + amount,
    ledger: [
      { 
        id: `T-${state.ledger.length + 1}`, 
        date: new Date().toISOString(), 
        type: 'Subscription', 
        amount, 
        subscriber,
        status: 'completed' 
      }, 
      ...state.ledger
    ]
  })),

  requestPayout: (amount) => set((state) => ({
    balance: state.balance - amount,
    pendingPayout: state.pendingPayout + amount,
    ledger: [
      { 
        id: `T-${state.ledger.length + 1}`, 
        date: new Date().toISOString(), 
        type: 'Payout', 
        amount: -amount,
        subscriber: null,
        status: 'pending' 
      }, 
      ...state.ledger
    ]
  }))
}));
