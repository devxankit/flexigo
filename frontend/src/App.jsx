import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WebHome from './modules/website/web-pages/WebHome';
import RiderRoutes from './modules/rider/routes/RiderRoutes';
import FranchiseRoutes from './modules/franchise/routes/FranchiseRoutes';
import AdminRoutes from './modules/admin/routes/AdminRoutes';

// Scroll To Top Utility
import ScrollToTop from './modules/website/web-components/ScrollToTop';

// New Web Pages
import AboutUsPage from './modules/website/web-pages/AboutUsPage';
import CareersPage from './modules/website/web-pages/CareersPage';
import PressMediaPage from './modules/website/web-pages/PressMediaPage';
import SustainabilityPage from './modules/website/web-pages/SustainabilityPage';
import ContactPage from './modules/website/web-pages/ContactPage';
import VehicleCatalogPage from './modules/website/web-pages/VehicleCatalogPage';
import PricingPlansPage from './modules/website/web-pages/PricingPlansPage';
import PrivacyPolicyPage from './modules/website/web-pages/PrivacyPolicyPage';
import TermsOfServicePage from './modules/website/web-pages/TermsOfServicePage';
import RiderAppPage from './modules/website/web-pages/RiderAppPage';
import FranchisePanelPage from './modules/website/web-pages/FranchisePanelPage';
import AdminDashboardPage from './modules/website/web-pages/AdminDashboardPage';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<WebHome />} />
        
        {/* Info Pages */}
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/press" element={<PressMediaPage />} />
        <Route path="/sustainability" element={<SustainabilityPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/vehicle-catalog" element={<VehicleCatalogPage />} />
        <Route path="/pricing-plans" element={<PricingPlansPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        
        {/* Informational Portals */}
        <Route path="/rider-app" element={<RiderAppPage />} />
        <Route path="/franchise-panel" element={<FranchisePanelPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboardPage />} />

        {/* Dashboards & Panels */}
        <Route path="/rider/*" element={<RiderRoutes />} />
        <Route path="/franchise/*" element={<FranchiseRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
