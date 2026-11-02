/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * App.tsx: Clean Tab-Based Architecture for Rahbord
 * Every feature lives in its own dedicated, beautifully styled tab:
 * 1. Home (خانه و راهنما)
 * 2. Study Planner (پلنر سرفصل‌ها)
 * 3. Ebbinghaus (سیستم مرور ابینگهاوس)
 * 4. Procrastination & Diagnostics (تست و درمان اهمال‌کاری)
 * 5. Toolkit & Deep Focus (جعبه ابزار تمرکز)
 * 6. Advisor & Analytics (مشاور هوشمند و آمار)
 * 7. Gamification & Habits (عادات و مسابقه)
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage, MainAppTab } from './components/HomePage';
import { StudyPlanner } from './components/StudyPlanner';
import { EbbinghausSimulator } from './components/EbbinghausSimulator';
import { EbbinghausScheduler } from './components/EbbinghausScheduler';
import { AdaptiveSpacedRepetition } from './components/AdaptiveSpacedRepetition';
import { DiagnosticQuiz } from './components/DiagnosticQuiz';
import { ProcrastinationAnalyzer } from './components/ProcrastinationAnalyzer';
import { CognitiveToolkit } from './components/CognitiveToolkit';
import { AICoachPanel } from './components/AICoachPanel';
import { IntelligentStudyAdvisor } from './components/IntelligentStudyAdvisor';
import { PerformancePredictor } from './components/PerformancePredictor';
import { WeeklyInsight } from './components/WeeklyInsight';
import { DashboardStats } from './components/DashboardStats';
import { DailyStudyHabitTracker } from './components/DailyStudyHabitTracker';
import { StudyDuels } from './components/StudyDuels';
import { Badges } from './components/Badges';
import { EbbinghausNotificationCenter } from './components/EbbinghausNotificationCenter';
import { Footer } from './components/Footer';
import {
  Clock,
  Layers,
  Cpu,
  Zap,
  HelpCircle,
  BookOpen,
  Bot,
  Compass,
  BarChart3,
  Award,
  Flame,
  Swords,
  Trophy,
  Calendar,
  TrendingUp
} from 'lucide-react';

const STORAGE_KEY_ACTIVE_TAB = 'rahbord_main_active_tab';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainAppTab>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_TAB);
      if (saved && ['home', 'planner', 'ebbinghaus', 'procrastination', 'toolkit', 'advisor', 'gamification'].includes(saved)) {
        return saved as MainAppTab;
      }
    } catch (e) {}
    return 'home';
  });

  // Sub-tabs for tabs that have multiple complementary tools
  const [ebbinghausSubTab, setEbbinghausSubTab] = useState<'scheduler' | 'simulator' | 'adaptive'>('scheduler');
  const [procrastinationSubTab, setProcrastinationSubTab] = useState<'quiz' | 'analyzer'>('quiz');
  const [toolkitSubTab, setToolkitSubTab] = useState<'tools' | 'aicoach'>('tools');
  const [advisorSubTab, setAdvisorSubTab] = useState<'advisor' | 'insights' | 'stats' | 'predictor'>('advisor');
  const [gamificationSubTab, setGamificationSubTab] = useState<'habits' | 'duels' | 'badges'>('habits');

  // Persist active tab and scroll to top on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_TAB, activeTab);
    } catch (e) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-400/20 selection:text-amber-200">
      {/* Universal Tabbed Header */}
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Tab View Container */}
      <main className="flex-1">
        {/* ===================================================================
            TAB 1: HOME & OVERVIEW (خانه و راهنما)
            =================================================================== */}
        {activeTab === 'home' && (
          <HomePage onNavigateTab={setActiveTab} />
        )}

        {/* ===================================================================
            TAB 2: STUDY PLANNER (پلنر سرفصل‌ها - هفتگی و دو هفتگی)
            =================================================================== */}
        {activeTab === 'planner' && (
          <div className="animate-in fade-in duration-200">
            <StudyPlanner id="study-planner" />
          </div>
        )}

        {/* ===================================================================
            TAB 3: EBBINGHAUS SPACING (سیستم مرور و شبیه‌ساز ابینگهاوس)
            =================================================================== */}
        {activeTab === 'ebbinghaus' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200" dir="rtl">
            {/* Tab Header Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Clock className="w-4 h-4" />
                  <span>سیستم علمی تکرار فاصله‌دار (Spaced Repetition)</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  مهار منحنی فراموشی با فواصل طلایی ابینگهاوس
                </h2>
                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  برنامه‌ریزی مرور در ایستگاه‌های روز اول، روز سوم، روز دهم و روز سی‌ام جهت انتقال قطعی سرفصل‌ها از حافظه فعال به حافظه بلندمدت.
                </p>
              </div>

              {/* Sub-tab pills */}
              <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs shrink-0">
                <button
                  onClick={() => setEbbinghausSubTab('scheduler')}
                  className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    ebbinghausSubTab === 'scheduler'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>زمان‌بندی و صف مرور</span>
                </button>

                <button
                  onClick={() => setEbbinghausSubTab('simulator')}
                  className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    ebbinghausSubTab === 'simulator'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>شبیه‌ساز منحنی فراموشی</span>
                </button>

                <button
                  onClick={() => setEbbinghausSubTab('adaptive')}
                  className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    ebbinghausSubTab === 'adaptive'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>تکرار تطبیقی</span>
                </button>
              </div>
            </div>

            {/* Sub-tab view render */}
            {ebbinghausSubTab === 'scheduler' && <EbbinghausScheduler />}
            {ebbinghausSubTab === 'simulator' && <EbbinghausSimulator />}
            {ebbinghausSubTab === 'adaptive' && (
              <AdaptiveSpacedRepetition
                id="adaptive-scheduler"
                onNavigateToScheduler={() => setEbbinghausSubTab('scheduler')}
                onNavigateToAdvisor={() => setActiveTab('advisor')}
              />
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 4: PROCRASTINATION & DIAGNOSTICS (تست و درمان اهمال‌کاری)
            =================================================================== */}
        {activeTab === 'procrastination' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200" dir="rtl">
            {/* Tab Header Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-950 border border-rose-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                  <Zap className="w-4 h-4" />
                  <span>کالبدشکافی عصب‌شناختی موانع مطالعه</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  تست عارضه‌یابی و ریشه‌یابی اهمال‌کاری
                </h2>
                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  اهمال‌کاری تنبلی نیست؛ پاسخ محافظتی آمیگدال مغز در برابر ترس از شکست و کمال‌گرایی است. گلوگاه‌های خود را شناسایی و پروتکل مهار آن را دریافت کنید.
                </p>
              </div>

              {/* Sub-tab pills */}
              <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs shrink-0">
                <button
                  onClick={() => setProcrastinationSubTab('quiz')}
                  className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    procrastinationSubTab === 'quiz'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>آزمون تشخیصی ۶ چالش</span>
                </button>

                <button
                  onClick={() => setProcrastinationSubTab('analyzer')}
                  className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    procrastinationSubTab === 'analyzer'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>تحلیل‌گر الگوهای اهمال‌کاری</span>
                </button>
              </div>
            </div>

            {/* Sub-tab view render */}
            {procrastinationSubTab === 'quiz' && (
              <DiagnosticQuiz onNavigateToToolkit={() => setActiveTab('toolkit')} />
            )}
            {procrastinationSubTab === 'analyzer' && (
              <ProcrastinationAnalyzer onNavigateToToolkit={() => setActiveTab('toolkit')} />
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 5: TOOLKIT & ACTIVE RECALL (جعبه‌ابزار تمرکز عمیق)
            =================================================================== */}
        {activeTab === 'toolkit' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200" dir="rtl">
            {/* Tab Header Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                  <BookOpen className="w-4 h-4" />
                  <span>یادگیری فعال و پروتکل‌های تمرکز عمیق (Deep Work)</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  جعبه‌ابزار شناختی: پومودورو، فاینمن و کوچینگ هوشمند
                </h2>
                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  تایمرهای هوشمند پومودورو با موزیک تمرکز، متد فاینمن (آموزش به دیگران)، و مشاور هوش مصنوعی جهت حل اصطکاک‌های حین مطالعه.
                </p>
              </div>

              {/* Sub-tab pills */}
              <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs shrink-0">
                <button
                  onClick={() => setToolkitSubTab('tools')}
                  className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    toolkitSubTab === 'tools'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>تکنیک‌های تمرکز و پومودورو</span>
                </button>

                <button
                  onClick={() => setToolkitSubTab('aicoach')}
                  className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    toolkitSubTab === 'aicoach'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>مربی شناختی هوش مصنوعی</span>
                </button>
              </div>
            </div>

            {/* Sub-tab view render */}
            {toolkitSubTab === 'tools' && <CognitiveToolkit />}
            {toolkitSubTab === 'aicoach' && <AICoachPanel />}
          </div>
        )}

        {/* ===================================================================
            TAB 6: ADVISOR & ANALYTICS (مشاور هوشمند و تحلیل داده)
            =================================================================== */}
        {activeTab === 'advisor' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200" dir="rtl">
            {/* Tab Header Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                  <Compass className="w-4 h-4" />
                  <span>بینش داده‌محور و اولویت‌بندی هوشمند</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  مشاور هدایت تحصیلی و داشبورد تحلیل نموداری
                </h2>
                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  اولویت‌بندی علمی سرفصل‌ها بر اساس ضرایب و درجه سختی، نمودارهای تحلیلی روند D3، و شاخص‌های آمادگی برای کنکور و امتحانات نهایی.
                </p>
              </div>

              {/* Sub-tab pills */}
              <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs shrink-0">
                <button
                  onClick={() => setAdvisorSubTab('advisor')}
                  className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    advisorSubTab === 'advisor'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>توصیه‌گر هوشمند مباحث</span>
                </button>

                <button
                  onClick={() => setAdvisorSubTab('predictor')}
                  className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    advisorSubTab === 'predictor'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>پیش‌بینی‌گر عملکرد (رگرسیون)</span>
                </button>

                <button
                  onClick={() => setAdvisorSubTab('insights')}
                  className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    advisorSubTab === 'insights'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>بینش نموداری هفتگی D3</span>
                </button>

                <button
                  onClick={() => setAdvisorSubTab('stats')}
                  className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    advisorSubTab === 'stats'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>داشبورد آماری آزمون</span>
                </button>
              </div>
            </div>

            {/* Sub-tab view render */}
            {advisorSubTab === 'advisor' && (
              <IntelligentStudyAdvisor
                id="study-advisor"
                onNavigateToScheduler={() => {
                  setActiveTab('ebbinghaus');
                  setEbbinghausSubTab('scheduler');
                }}
                onNavigateToDuels={() => {
                  setActiveTab('gamification');
                  setGamificationSubTab('duels');
                }}
              />
            )}
            {advisorSubTab === 'predictor' && (
              <PerformancePredictor onNavigateTab={setActiveTab} />
            )}
            {advisorSubTab === 'insights' && (
              <WeeklyInsight
                id="weekly-insight"
                onNavigateToAdvisor={() => setAdvisorSubTab('advisor')}
                onNavigateToScheduler={() => {
                  setActiveTab('ebbinghaus');
                  setEbbinghausSubTab('scheduler');
                }}
              />
            )}
            {advisorSubTab === 'stats' && (
              <DashboardStats
                onNavigateToBadges={() => {
                  setActiveTab('gamification');
                  setGamificationSubTab('badges');
                }}
              />
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 7: GAMIFICATION & HABITS (عادات، مسابقه و افتخارات)
            =================================================================== */}
        {activeTab === 'gamification' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200" dir="rtl">
            {/* Tab Header Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                  <Flame className="w-4 h-4 text-purple-400 animate-pulse" />
                  <span>انگیزش مستمر، ثبات عادت و رقابت سالم</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  زنجیره عادات روزانه، دوئل‌های مطالعاتی و مدال‌های افتخار
                </h2>
                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  موفقیت در کنکور نتیجه کارهای بزرگ تصادفی نیست؛ ثمره تکرار روزانه عادت‌های کوچک است. ردیابی زنجیره مطالعه، رقابت با دوستان و کسب نشان‌های افتخار.
                </p>
              </div>

              {/* Sub-tab pills */}
              <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs shrink-0">
                <button
                  onClick={() => setGamificationSubTab('habits')}
                  className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    gamificationSubTab === 'habits'
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>ردیاب زنجیره عادات</span>
                </button>

                <button
                  onClick={() => setGamificationSubTab('duels')}
                  className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    gamificationSubTab === 'duels'
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>اتاق دوئل و رقابت</span>
                </button>

                <button
                  onClick={() => setGamificationSubTab('badges')}
                  className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    gamificationSubTab === 'badges'
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>نشان‌ها و دستاوردها</span>
                </button>
              </div>
            </div>

            {/* Sub-tab view render */}
            {gamificationSubTab === 'habits' && <DailyStudyHabitTracker />}
            {gamificationSubTab === 'duels' && (
              <div role="note" className="max-w-6xl mx-auto px-4 sm:px-6 pt-2">
                <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-200 leading-relaxed">
                  نمایشی: رقیب‌های این بخش شبیه‌سازی شده‌اند و دانش‌آموز واقعی نیستند. دوئل چندنفرهٔ واقعی بعد از ساخت حساب کاربری اضافه می‌شود.
                </p>
              </div>
            )}
            {gamificationSubTab === 'duels' && (
              <StudyDuels
                id="study-duels"
                onNavigateToScheduler={() => {
                  setActiveTab('ebbinghaus');
                  setEbbinghausSubTab('scheduler');
                }}
              />
            )}
            {gamificationSubTab === 'badges' && (
              <Badges
                id="badges"
                onNavigate={(sectionId) => {
                  if (sectionId === 'quiz') setActiveTab('procrastination');
                  else if (sectionId === 'study-duels') setGamificationSubTab('duels');
                  else if (sectionId === 'ebbinghaus-scheduler') {
                    setActiveTab('ebbinghaus');
                    setEbbinghausSubTab('scheduler');
                  }
                }}
              />
            )}
          </div>
        )}
      </main>

      {/* Floating Ebbinghaus Notification Center for Spaced Reviews */}
      <EbbinghausNotificationCenter
        onNavigateToScheduler={() => {
          setActiveTab('ebbinghaus');
          setEbbinghausSubTab('scheduler');
        }}
        onNavigateToDuels={() => {
          setActiveTab('gamification');
          setGamificationSubTab('duels');
        }}
      />

      {/* Footer */}
      <Footer
        onNavigate={(sectionId) => {
          if (sectionId === 'hero') setActiveTab('home');
          else if (sectionId === 'study-planner') setActiveTab('planner');
          else if (sectionId === 'problems') setActiveTab('home');
          else if (sectionId === 'simulator' || sectionId === 'ebbinghaus-scheduler') setActiveTab('ebbinghaus');
          else if (sectionId === 'quiz' || sectionId === 'procrastination-analyzer') setActiveTab('procrastination');
          else if (sectionId === 'toolkit') setActiveTab('toolkit');
          else if (sectionId === 'study-advisor' || sectionId === 'weekly-insight' || sectionId === 'dashboard') setActiveTab('advisor');
          else if (sectionId === 'habit-tracker' || sectionId === 'study-duels' || sectionId === 'badges') setActiveTab('gamification');
          else setActiveTab('home');
        }}
      />
    </div>
  );
}
