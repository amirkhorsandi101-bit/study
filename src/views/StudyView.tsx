import React from 'react';
import { EbbinghausScheduler } from '../components/EbbinghausScheduler';
import { AdaptiveSpacedRepetition } from '../components/AdaptiveSpacedRepetition';
import { EbbinghausSimulator } from '../components/EbbinghausSimulator';
import { goToSection } from '../shell/navigation';
import { TabPanels } from '../shell/SectionTabs';

export default function StudyView({ section }: { section?: string }) {
  return (
    <TabPanels
      view="study"
      section={section}
      panels={{
        'ebbinghaus-scheduler': <EbbinghausScheduler />,
        'adaptive-scheduler': (
          <AdaptiveSpacedRepetition
            id="adaptive-scheduler"
            onNavigateToScheduler={() => goToSection('ebbinghaus-scheduler')}
            onNavigateToAdvisor={() => goToSection('study-advisor')}
          />
        ),
        simulator: <EbbinghausSimulator />,
      }}
    />
  );
}
