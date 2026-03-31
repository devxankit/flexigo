import { create } from 'zustand';

const initialNotifications = [
  { id: 'N-1', title: 'Low Battery Alert', message: 'Vehicle KA-05-EV-9012 battery below 15% SOC. Requires immediate charging.', severity: 'danger', time: '10:45 AM', read: false },
  { id: 'N-2', title: 'New Subscriber Assigned', message: 'Subscriber Ankita Singh assigned to Hub Koramangala — subscription active.', severity: 'info', time: '11:30 AM', read: false },
  { id: 'N-3', title: 'Subscription Renewed', message: 'Naveen Kumar renewed Weekly Pro plan — payment confirmed via app.', severity: 'success', time: '12:00 PM', read: true },
  { id: 'N-4', title: 'Vehicle Damage Alert', message: 'Subscriber Sandeep reported a minor scratch on V-005. Inspection pending.', severity: 'warning', time: '01:15 PM', read: false },
  { id: 'N-5', title: 'Payout Processed', message: 'Hub payout of ₹3,500 dispatched to registered bank account.', severity: 'success', time: '02:30 PM', read: true },
];

export const useFranchiseNotificationStore = create((set, get) => ({
  notifications: initialNotifications,

  get unreadCount() {
    return get().notifications.filter(n => !n.read).length;
  },

  readNotification: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),

  markAllRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),

  addNotification: (notification) => set((state) => ({
    notifications: [{ id: `N-${state.notifications.length + 1}`, read: false, ...notification }, ...state.notifications]
  }))
}));
