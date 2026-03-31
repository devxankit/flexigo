import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import SplashScreen from '../pages/SplashScreen';
import AuthPhone from '../pages/AuthPhone';
import AuthOTP from '../pages/AuthOTP';
import OnboardingKYC from '../pages/OnboardingKYC';
import HomeDashboard from '../pages/HomeDashboard';
import LiveGarage from '../pages/LiveGarage';
import SubscriptionPlans from '../pages/SubscriptionPlans';
import RideFlow from '../pages/RideFlow';
import ProfileScreen from '../pages/ProfileScreen';
import SupportScreen from '../pages/SupportScreen';
import HubDetails from '../pages/HubDetails';
import { RiderLayout } from '../components/RiderLayout';
import { useAuthStore } from '../store/authStore';

export default function RiderRoutes() {
  const { isAuthenticated, phone } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Basic route protection
  useEffect(() => {
    if (!isAuthenticated && pathname.includes('/rider') && !pathname.includes('/rider/auth') && pathname !== '/rider' && pathname !== '/rider/') {
      navigate('/rider/auth/phone');
    }
  }, [isAuthenticated, pathname, navigate]);

  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/auth/phone" element={<AuthPhone />} />
      <Route path="/auth/otp" element={<AuthOTP />} />
      
      {/* Protected Layout Routes */}
      <Route element={<RiderLayout />}>
        <Route path="/onboarding" element={<OnboardingKYC />} />
        <Route path="/home" element={<HomeDashboard />} />
        <Route path="/garage" element={<LiveGarage />} />
        <Route path="/plans" element={<SubscriptionPlans />} />
        <Route path="/subscription" element={<SubscriptionPlans />} />
        <Route path="/hub/:id" element={<HubDetails />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/support" element={<SupportScreen />} />
      </Route>
    </Routes>
  );
}
