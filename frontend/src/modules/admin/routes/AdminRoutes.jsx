import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';

// Intelligence Group
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const DeepAnalyticsPage = lazy(() => import('../pages/DeepAnalyticsPage'));
const RiderBehaviourPage = lazy(() => import('../pages/RiderBehaviourPage'));

// Operations Group
const HubManagementPage = lazy(() => import('../pages/HubManagementPage'));
const HubDetailsPage = lazy(() => import('../pages/HubDetailsPage'));
const FleetOversightPage = lazy(() => import('../pages/FleetOversightPage'));

const GeoFencingPage = lazy(() => import('../pages/GeoFencingPage'));
const AddVehiclePage = lazy(() => import('../pages/AddVehiclePage'));

// People Group
const SubscriberRegistryPage = lazy(() => import('../pages/SubscriberRegistryPage'));
const RiderReportPage = lazy(() => import('../pages/RiderReportPage'));
const KycOnboardingPage = lazy(() => import('../pages/KycOnboardingPage'));
const HrManagementPage = lazy(() => import('../pages/HrManagementPage'));
const FranchiseKycQueue = lazy(() => import('../pages/FranchiseKycQueue'));

// Finance Group
const FinancialCenterPage = lazy(() => import('../pages/FinancialCenterPage'));
const PaymentGatewayPage = lazy(() => import('../pages/PaymentGatewayPage'));
const InventoryBillingPage = lazy(() => import('../pages/InventoryBillingPage'));
const FranchiseOpsPage = lazy(() => import('../pages/FranchiseOpsPage'));
const SubscriptionPlansPage = lazy(() => import('../pages/SubscriptionPlansPage'));

// Legal & Support Group
const CompliancePage = lazy(() => import('../pages/CompliancePage'));
const CustomerEngagementPage = lazy(() => import('../pages/CustomerEngagementPage'));
const SecurityAuditsPage = lazy(() => import('../pages/SecurityAuditsPage'));
const AlertCenterPage = lazy(() => import('../pages/AlertCenterPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));

const AdminLogin = lazy(() => import('../pages/AdminLogin'));

export default function AdminRoutes() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-[var(--bg-primary)]">
         <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.5em] animate-pulse">Initializing Root</span>
         </div>
      </div>
    }>
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          
          {/* Operations Group */}
          <Route path="hubs" element={<HubManagementPage />} />
          <Route path="hubs/:hubId" element={<HubDetailsPage />} />
          <Route path="fleet" element={<FleetOversightPage />} />
          <Route path="fleet/add" element={<AddVehiclePage />} />

          <Route path="geofencing" element={<GeoFencingPage />} />
          
          {/* People Group */}
          <Route path="subscribers" element={<SubscriberRegistryPage />} />
          <Route path="rider-reports" element={<RiderReportPage />} />
          <Route path="kyc" element={<KycOnboardingPage />} />
          <Route path="hr" element={<HrManagementPage />} />
          <Route path="franchise-kyc" element={<FranchiseKycQueue />} />
          
          {/* Finance Group */}
          <Route path="financials" element={<FinancialCenterPage />} />
          <Route path="payments" element={<PaymentGatewayPage />} />
          <Route path="inventory" element={<InventoryBillingPage />} />
          <Route path="franchise-ops" element={<FranchiseOpsPage />} />
          <Route path="subscription-plans" element={<SubscriptionPlansPage />} />
          
          {/* Intelligence Group */}
          <Route path="analytics" element={<DeepAnalyticsPage />} />
          <Route path="rider-behaviour" element={<RiderBehaviourPage />} />
          
          {/* Legal & Support Group */}
          <Route path="compliance" element={<CompliancePage />} />
          <Route path="engagement" element={<CustomerEngagementPage />} />
          <Route path="security" element={<SecurityAuditsPage />} />
          <Route path="notifications" element={<AlertCenterPage />} />
          <Route path="settings" element={<SettingsPage />} />
          
          <Route path="" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
