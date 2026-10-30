import React from 'react';
import { DiagnosticQuiz } from '../components/DiagnosticQuiz';
import { ProcrastinationAnalyzer } from '../components/ProcrastinationAnalyzer';
import { AICoachPanel } from '../components/AICoachPanel';
import { CognitiveToolkit } from '../components/CognitiveToolkit';
import { goToSection } from '../shell/navigation';

export default function DiagnoseView() {
  return (
    <>
      <DiagnosticQuiz onNavigateToToolkit={() => goToSection('toolkit')} />
      <ProcrastinationAnalyzer onNavigateToToolkit={() => goToSection('toolkit')} />
      <AICoachPanel />
      <CognitiveToolkit />
    </>
  );
}
