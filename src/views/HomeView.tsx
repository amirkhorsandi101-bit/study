import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { Dashboard } from '../components/Dashboard';
import { ProblemsSection } from '../components/ProblemsSection';
import { goToSection } from '../shell/navigation';

export default function HomeView() {
  return (
    <>
      <HeroSection onNavigate={goToSection} />
      {/* داشبورد مرکزی: بدون onToggleViewMode، سوئیچ نمای خلوت/کامل نمایش داده نمی‌شود */}
      <Dashboard id="dashboard-hub" onNavigate={goToSection} />
      <ProblemsSection />
    </>
  );
}
