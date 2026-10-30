/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { Dashboard } from './components/Dashboard';
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
  const [viewMode, setViewMode] = useState<'focused' | 'all'>('all');
  const [activeTool, setActiveTool] = useState<string>('ebbinghaus-scheduler');

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (sectionId === 'dashboard-hub') {
      const element = document.getElementById('dashboard-hub');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If section belongs to one of the key tools and we are in focused mode:
    if (['ebbinghaus-scheduler', 'toolkit', 'study-advisor'].includes(sectionId)) {
      setActiveTool(sectionId);
    } else if (viewMode === 'focused') {
      // If user clicked another section while in focused mode, switch to full view
      setViewMode('all');
    }

    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-400/20 selection:text-amber-200">
      <Navbar onNavigate={handleNavigate} />
      
      <main className="flex-1">
        <HeroSection onNavigate={handleNavigate} />

        {/* Central Dashboard Hub */}
        <Dashboard
          id="dashboard-hub"
          onNavigate={handleNavigate}
          activeViewMode={viewMode}
          onToggleViewMode={(mode) => setViewMode(mode)}
          activeToolId={activeTool}
          onSelectTool={(toolId) => setActiveTool(toolId)}
        />

        {viewMode === 'focused' ? (
          <div className="border-t border-slate-800/80 bg-slate-950 pb-16">
            {/* Quick switcher between the 3 main tools while staying uncluttered */}
            <div className="max-w-6xl mx-auto px-6 pt-8 pb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">میز کار فعال:</span>
                <div className="inline-flex rounded-xl bg-slate-900 border border-slate-800 p-1">
                  <button
                    onClick={() => setActiveTool('ebbinghaus-scheduler')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTool === 'ebbinghaus-scheduler'
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    زمان‌بندی ابینگهاوس
                  </button>
                  <button
                    onClick={() => setActiveTool('toolkit')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTool === 'toolkit'
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ابزار ضد اهمال‌کاری
                  </button>
                  <button
                    onClick={() => setActiveTool('study-advisor')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTool === 'study-advisor'
                        ? 'bg-cyan-400 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    توصیه‌گر هوشمند
                  </button>
                </div>
              </div>

              <button
                onClick={() => setViewMode('all')}
                className="text-xs text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
              >
                مشاهده تمام بخش‌ها و صفحات آموزشی ←
              </button>
            </div>

            {/* Render the selected tool cleanly */}
            {activeTool === 'ebbinghaus-scheduler' && <EbbinghausScheduler />}
            {activeTool === 'toolkit' && <CognitiveToolkit />}
            {activeTool === 'study-advisor' && (
              <IntelligentStudyAdvisor
                id="study-advisor"
                onNavigateToScheduler={() => setActiveTool('ebbinghaus-scheduler')}
                onNavigateToDuels={() => {
                  setViewMode('all');
                  setTimeout(() => handleNavigate('study-duels'), 50);
                }}
              />
            )}
          </div>
        ) : (
          <>
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
          </>
        )}
      </main>

      <EbbinghausNotificationCenter
        onNavigateToScheduler={() => handleNavigate('ebbinghaus-scheduler')}
        onNavigateToDuels={() => handleNavigate('study-duels')}
      />

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
