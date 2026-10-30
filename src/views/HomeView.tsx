import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { ProblemsSection } from '../components/ProblemsSection';
import { HomeQuickStart } from '../shell/HomeQuickStart';
import { goToSection } from '../shell/navigation';

export default function HomeView() {
  return (
    <>
      <HeroSection onNavigate={goToSection} />
      <HomeQuickStart />
      <ProblemsSection />
    </>
  );
}
