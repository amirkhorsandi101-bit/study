import React from 'react';
import { DiagnosticQuiz } from '../components/DiagnosticQuiz';
import { ProblemsSection } from '../components/ProblemsSection';
import { ProcrastinationAnalyzer } from '../components/ProcrastinationAnalyzer';
import { AICoachPanel } from '../components/AICoachPanel';
import { CognitiveToolkit } from '../components/CognitiveToolkit';
import { goToSection } from '../shell/navigation';
import { TabPanels } from '../shell/SectionTabs';

export default function DiagnoseView({ section }: { section?: string }) {
  return (
    <TabPanels
      view="diagnose"
      section={section}
      panels={{
        quiz: <DiagnosticQuiz onNavigateToToolkit={() => goToSection('toolkit')} />,
        problems: <ProblemsSection />,
        'procrastination-analyzer': <ProcrastinationAnalyzer onNavigateToToolkit={() => goToSection('toolkit')} />,
        coach: <AICoachPanel />,
        toolkit: <CognitiveToolkit />,
      }}
    />
  );
}
