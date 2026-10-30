import React, { Suspense, lazy } from 'react';
import { DashboardStats } from '../components/DashboardStats';
import { DailyStudyHabitTracker } from '../components/DailyStudyHabitTracker';
import { IntelligentStudyAdvisor } from '../components/IntelligentStudyAdvisor';
import { WeeklyInsight } from '../components/WeeklyInsight';
import { Badges } from '../components/Badges';
import { goToSection } from '../shell/navigation';
import { FEATURES } from '../shell/views';

// دوئل مطالعه فقط وقتی کلید FEATURES.duels روشن باشد بارگذاری می‌شود
const StudyDuels = lazy(() => import('../components/StudyDuels').then((m) => ({ default: m.StudyDuels })));

export default function ProgressView() {
  return (
    <>
      <DashboardStats onNavigateToBadges={() => goToSection('badges')} />
      <DailyStudyHabitTracker />
      <IntelligentStudyAdvisor
        id="study-advisor"
        onNavigateToScheduler={() => goToSection('ebbinghaus-scheduler')}
        onNavigateToDuels={FEATURES.duels ? () => goToSection('study-duels') : undefined}
      />
      <WeeklyInsight
        id="weekly-insight"
        onNavigateToAdvisor={() => goToSection('study-advisor')}
        onNavigateToScheduler={() => goToSection('ebbinghaus-scheduler')}
      />
      {FEATURES.duels && (
        <Suspense fallback={null}>
          <StudyDuels id="study-duels" onNavigateToScheduler={() => goToSection('ebbinghaus-scheduler')} />
        </Suspense>
      )}
      <Badges id="badges" onNavigate={goToSection} />
    </>
  );
}
