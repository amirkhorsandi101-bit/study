/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProblemsSection } from './components/ProblemsSection';
import { EbbinghausSimulator } from './components/EbbinghausSimulator';
import { EbbinghausScheduler } from './components/EbbinghausScheduler';
import { AdaptiveSpacedRepetition } from './components/AdaptiveSpacedRepetition';
import { IntelligentStudyAdvisor } from './components/IntelligentStudyAdvisor';
import { WeeklyInsight } from './components/WeeklyInsight';
import { DashboardStats } from './components/DashboardStats';
import { ProcrastinationAnalyzer } from './components/ProcrastinationAnalyzer';
import { DiagnosticQuiz } from './components/DiagnosticQuiz';
import { CognitiveToolkit } from './components/CognitiveToolkit';
import { AICoachPanel } from './components/AICoachPanel';
import { Badges } from './components/Badges';
import { DailyStudyHabitTracker } from './components/DailyStudyHabitTracker';
import { StudyDuels } from './components/StudyDuels';
import { EbbinghausNotificationCenter } from './components/EbbinghausNotificationCenter';
import { Footer } from './components/Footer';

export default function App() {
  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-400/20 selection:text-amber-200">
      <Navbar onNavigate={handleNavigate} />
      
      <main className="flex-1">
        <HeroSection onNavigate={handleNavigate} />
        <ProblemsSection />
        <EbbinghausSimulator />
        <EbbinghausScheduler />
        <AdaptiveSpacedRepetition
          id="adaptive-scheduler"
          onNavigateToScheduler={() => handleNavigate('ebbinghaus-scheduler')}
          onNavigateToAdvisor={() => handleNavigate('study-advisor')}
        />
        <IntelligentStudyAdvisor
          id="study-advisor"
          onNavigateToScheduler={() => handleNavigate('ebbinghaus-scheduler')}
          onNavigateToDuels={() => handleNavigate('study-duels')}
        />
        <WeeklyInsight
          id="weekly-insight"
          onNavigateToAdvisor={() => handleNavigate('study-advisor')}
          onNavigateToScheduler={() => handleNavigate('ebbinghaus-scheduler')}
        />
        <DashboardStats onNavigateToBadges={() => handleNavigate('badges')} />
        <DailyStudyHabitTracker />
        <StudyDuels id="study-duels" onNavigateToScheduler={() => handleNavigate('ebbinghaus-scheduler')} />
        <Badges id="badges" onNavigate={handleNavigate} />
        <ProcrastinationAnalyzer onNavigateToToolkit={() => handleNavigate('toolkit')} />
        <DiagnosticQuiz onNavigateToToolkit={() => handleNavigate('toolkit')} />
        <CognitiveToolkit />
        <AICoachPanel />
      </main>

      <EbbinghausNotificationCenter
        onNavigateToScheduler={() => handleNavigate('ebbinghaus-scheduler')}
        onNavigateToDuels={() => handleNavigate('study-duels')}
      />

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
