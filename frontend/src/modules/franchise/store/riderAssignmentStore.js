import { create } from 'zustand';

const initialSubscribers = [
  { id: 'S-1', name: 'Naveen Kumar', phone: '+91 91234 56789', status: 'active', vehicleId: 'V-002', subscriptionPlan: 'Weekly Pro', subscriptionStart: '2026-03-01T10:00:00Z', subscriptionEnd: '2026-04-01T10:00:00Z' },
  { id: 'S-2', name: 'Sandeep R.', phone: '+91 99887 76655', status: 'paused', vehicleId: 'V-005', subscriptionPlan: 'Daily Flex', subscriptionStart: '2026-03-15T08:30:00Z', subscriptionEnd: '2026-04-15T08:30:00Z' },
  { id: 'S-3', name: 'Ankita Singh', phone: '+91 77665 54433', status: 'pending', vehicleId: 'V-001', subscriptionPlan: 'Monthly Enterprise', subscriptionStart: null, subscriptionEnd: null },
];

export const useSubscriberStore = create((set) => ({
  subscribers: initialSubscribers,

  assignVehicle: (subscriberId, vehicleId) => set((state) => ({
    subscribers: state.subscribers.map(s => 
      s.id === subscriberId 
        ? { ...s, vehicleId, status: 'active', subscriptionStart: new Date().toISOString() } 
        : s
    )
  })),

  dispatchVehicle: (subscriberId, vehicleId, returnDate) => set((state) => ({
    subscribers: state.subscribers.map(s => 
      s.id === subscriberId 
        ? { 
            ...s, 
            vehicleId, 
            status: 'active', 
            subscriptionStart: new Date().toISOString(),
            subscriptionEnd: returnDate
          } 
        : s
    )
  })),

  returnVehicle: (subscriberId) => set((state) => ({
    subscribers: state.subscribers.map(s => 
      s.id === subscriberId 
        ? { ...s, vehicleId: null, status: 'completed', subscriptionStart: null } 
        : s
    )
  }))
}));

// Backward compat alias (for pages still using old store name)
export const useRiderAssignmentStore = useSubscriberStore;
