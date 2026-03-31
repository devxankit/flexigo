import React from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';

// Import all sections
import Navbar from '../web-components/Navbar';
import HeroSection from '../web-components/HeroSection';
import StatsSection from '../web-components/StatsSection';
import HowItWorksSection from '../web-components/HowItWorksSection';
import FeaturesSection from '../web-components/FeaturesSection';
import SavingsCalculatorSection from '../web-components/SavingsCalculatorSection';
import PlatformEcosystemSection from '../web-components/PlatformEcosystemSection';
import VehicleShowcaseSection from '../web-components/VehicleShowcaseSection';
import PricingSection from '../web-components/PricingSection';
import MapSection from '../web-components/MapSection';
import TestimonialsSection from '../web-components/TestimonialsSection';
import CtaSection from '../web-components/CtaSection';
import FooterSection from '../web-components/FooterSection';

const WebHome = () => {
  return (
    <div className="bg-white min-h-screen font-body text-slate-800 antialiased selection:bg-flexigo-teal selection:text-white overflow-x-hidden">
      <Navbar />
      
      <main>
        <HeroSection />
        <StatsSection />
        <HowItWorksSection />
        <FeaturesSection />
        <SavingsCalculatorSection />
        <PlatformEcosystemSection />
        <VehicleShowcaseSection />
        <PricingSection />
        <MapSection />
        <TestimonialsSection />
        <CtaSection />
      </main>

      <FooterSection />
    </div>
  );
};

export default WebHome;
