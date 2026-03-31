import { Routes, Route, Navigate } from 'react-router-dom';
import { useFranchiseAuthStore } from '../store/franchiseAuthStore';
import FranchiseLayout from '../components/FranchiseLayout';
import FranchiseLogin from '../pages/FranchiseLogin';
import HubDashboard from '../pages/HubDashboard';
import FleetManagement from '../pages/FleetManagement';
import HandoverModule from '../pages/HandoverModule';
import RiderTracking from '../pages/RiderTracking';
import WalletFinancials from '../pages/WalletFinancials';
import StaffManagement from '../pages/StaffManagement';
import NotificationsPage from '../pages/NotificationsPage';
import VehicleDetail from '../pages/VehicleDetail';

export default function FranchiseRoutes() {
  const { isAuthenticated } = useFranchiseAuthStore();

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/franchise/dashboard" replace /> : <FranchiseLogin />} />
      
      {/* Protected Layout Routes */}
      <Route element={isAuthenticated ? <FranchiseLayout /> : <Navigate to="/franchise" replace />}>
        <Route path="/dashboard" element={<HubDashboard />} />
        <Route path="/fleet" element={<FleetManagement />} />
        <Route path="/fleet/:vehicleId" element={<VehicleDetail />} />
        <Route path="/handover" element={<HandoverModule />} />
        <Route path="/tracking" element={<RiderTracking />} />
        <Route path="/wallet" element={<WalletFinancials />} />
        <Route path="/staff" element={<StaffManagement />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>
    </Routes>
  );
}
