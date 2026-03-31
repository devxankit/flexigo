import { create } from 'zustand';

const initialVehicles = [
  { id: 'V-001', vin: 'FXG782910382', model: 'Flexigo S1 Pro', plate: 'KA-05-EV-1234', status: 'available', battery: 88, range: 95, pUCExpiry: '2026-05-20', insuranceExpiry: '2026-12-15', maintenanceLogs: [] },
  { id: 'V-002', vin: 'FXG782910383', model: 'Flexigo S1 Pro', plate: 'KA-05-EV-5678', status: 'assigned', battery: 42, range: 45, pUCExpiry: '2026-04-10', insuranceExpiry: '2026-11-10', maintenanceLogs: [] },
  { id: 'V-003', vin: 'FXG782910384', model: 'Flexigo S1 Pro', plate: 'KA-05-EV-9012', status: 'in-service', battery: 12, range: 10, pUCExpiry: '2026-03-31', insuranceExpiry: '2026-10-05', maintenanceLogs: [{ date: '2026-03-30', type: 'Motor Check', staff: 'Rahul Attendant' }] },
  { id: 'V-004', vin: 'FXG782910385', model: 'Flexigo S1 Plus', plate: 'KA-01-EV-3344', status: 'quarantined', battery: 5, range: 2, pUCExpiry: '2026-06-15', insuranceExpiry: '2027-01-20', maintenanceLogs: [{ date: '2026-03-31', type: 'Critical: Battery Fault', staff: 'Mehul Manager' }] },
  { id: 'V-005', vin: 'FXG782910386', model: 'Flexigo S1 Pro', plate: 'KA-03-EV-7788', status: 'in-transit', battery: 65, range: 70, pUCExpiry: '2026-08-22', insuranceExpiry: '2026-09-12', maintenanceLogs: [] },
];

export const useFleetStore = create((set) => ({
  vehicles: initialVehicles,
  filter: 'all', // all | available | assigned | in-transit | in-service | quarantined

  setFilter: (filter) => set({ filter }),
  
  updateVehicleStatus: (id, newStatus) => set((state) => ({
    vehicles: state.vehicles.map(v => v.id === id ? { ...v, status: newStatus } : v)
  })),

  addMaintenanceLog: (vehicleId, log) => set((state) => ({
    vehicles: state.vehicles.map(v => v.id === vehicleId ? { ...v, maintenanceLogs: [log, ...v.maintenanceLogs] } : v)
  })),
  
  addVehicle: (newVehicle) => set((state) => ({
    vehicles: [...state.vehicles, { ...newVehicle, id: `V-00${state.vehicles.length + 1}` }]
  }))
}));
