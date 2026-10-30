import React from 'react';
import { EbbinghausScheduler } from '../components/EbbinghausScheduler';
import { AdaptiveSpacedRepetition } from '../components/AdaptiveSpacedRepetition';
import { EbbinghausSimulator } from '../components/EbbinghausSimulator';
import { goToSection } from '../shell/navigation';

export default function StudyView() {
  return (
    <>
      <EbbinghausScheduler />
      <AdaptiveSpacedRepetition
        id="adaptive-scheduler"
        onNavigateToScheduler={() => goToSection('ebbinghaus-scheduler')}
        onNavigateToAdvisor={() => goToSection('study-advisor')}
      />
      <EbbinghausSimulator />
    </>
  );
}
