/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { STUDY_PROBLEMS, StudyProblem } from '../data/problemsData';
import { 
  AlertCircle, 
  CheckCircle2, 
  Brain, 
  XCircle, 
  Flame, 
  Quote, 
  Compass,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';

// Color themes mapping for the 6 problems to make the UI rich and distinct
const PROBLEM_THEMES: Record<string, {
  accent: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  selectedBg: string;
  selectedBorder: string;
  cardGlow: string;
}> = {
  forgetting: {
    accent: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/15',
    badgeBorder: 'border-cyan-500/30',
    badgeText: 'text-cyan-300',
    selectedBg: 'bg-cyan-500/10',
    selectedBorder: 'border-cyan-500/60',
    cardGlow: 'from-cyan-500/10'
  },
  illusion: {
    accent: 'text-indigo-400',
    badgeBg: 'bg-indigo-500/15',
    badgeBorder: 'border-indigo-500/30',
    badgeText: 'text-indigo-300',
    selectedBg: 'bg-indigo-500/10',
    selectedBorder: 'border-indigo-500/60',
    cardGlow: 'from-indigo-500/10'
  },
  procrastination: {
    accent: 'text-rose-400',
    badgeBg: 'bg-rose-500/15',
    badgeBorder: 'border-rose-500/30',
    badgeText: 'text-rose-300',
    selectedBg: 'bg-rose-500/10',
    selectedBorder: 'border-rose-500/60',
    cardGlow: 'from-rose-500/10'
  },
  planning: {
    accent: 'text-amber-400',
    badgeBg: 'bg-amber-500/15',
    badgeBorder: 'border-amber-500/30',
    badgeText: 'text-amber-300',
    selectedBg: 'bg-amber-500/10',
    selectedBorder: 'border-amber-500/60',
    cardGlow: 'from-amber-500/10'
  },
  perfectionism: {
    accent: 'text-purple-400',
    badgeBg: 'bg-purple-500/15',
    badgeBorder: 'border-purple-500/30',
    badgeText: 'text-purple-300',
    selectedBg: 'bg-purple-500/10',
    selectedBorder: 'border-purple-500/60',
    cardGlow: 'from-purple-500/10'
  },
  burnout: {
    accent: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/15',
    badgeBorder: 'border-emerald-500/30',
    badgeText: 'text-emerald-300',
    selectedBg: 'bg-emerald-500/10',
    selectedBorder: 'border-emerald-500/60',
    cardGlow: 'from-emerald-500/10'
  }
};

export const ProblemsSection: React.FC = () => {
  const [selectedProblemId, setSelectedProblemId] = useState<string>(STUDY_PROBLEMS[0].id);
  const [activeTab, setActiveTab] = useState<'symptoms' | 'neuro' | 'mistakes' | 'solutions'>('solutions');

  const currentProblem = STUDY_PROBLEMS.find(p => p.id === selectedProblemId) || STUDY_PROBLEMS[0];
  const theme = PROBLEM_THEMES[currentProblem.id] || PROBLEM_THEMES.forgetting;

  return (
    <section id="problems" className="py-8 max-w-7xl mx-auto space-y-8" dir="rtl">
      {/* Section Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-indigo-400 font-bold tracking-wide">
          <Brain className="w-4 h-4" />
          <span>کالبدشکافی علمی و ریشه‌یابی چالش‌های تحصیلی</span>
          <span aria-hidden="true">·</span>
          <span className="text-slate-400">تحقیقات علوم اعصاب شناختی</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          ۶ گلوگاه اساسی دانش‌آموزان در مسیر مطالعه و آزمون
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed font-light">
          اکثر دانش‌آموزان سال‌ها خود را بابت نمرات پایین، درصد کم یا فراموشی سرزنش می‌کنند؛ در حالی که ریشه این چالش‌ها در الگوهای ناخودآگاه مغز و متدهای منسوخ یادگیری است. یکی از ۶ گلوگاه زیر را انتخاب کنید تا ریشه و پروتکل درمان آن را بررسی کنید:
        </p>
      </div>

      {/* Grid of 6 problem selector buttons with distinct colors */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {STUDY_PROBLEMS.map((problem) => {
          const isSelected = problem.id === selectedProblemId;
          const pTheme = PROBLEM_THEMES[problem.id] || PROBLEM_THEMES.forgetting;

          return (
            <button
              key={problem.id}
              onClick={() => {
                setSelectedProblemId(problem.id);
                setActiveTab('solutions');
              }}
              className={`p-3.5 rounded-2xl text-right transition-all flex flex-col justify-between h-32 border cursor-pointer relative overflow-hidden ${
                isSelected
                  ? `${pTheme.selectedBg} ${pTheme.selectedBorder} shadow-lg shadow-black/30 ring-1 ring-white/10`
                  : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-xs font-mono tabular-nums font-bold ${isSelected ? pTheme.accent : 'text-slate-500'}`}>
                  {problem.number}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${pTheme.badgeBg} ${pTheme.badgeBorder} border ${pTheme.badgeText}`}>
                  {problem.severity}
                </span>
              </div>
              <span className={`text-xs font-bold leading-snug line-clamp-2 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                {problem.title}
              </span>
              <span className="text-[10px] text-slate-500 truncate font-mono">
                {problem.englishTitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detailed Deep Dive Container with Multi-Color Theme */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
        {/* Card Header with Problem Title */}
        <div className={`p-6 sm:p-8 border-b border-slate-800 bg-gradient-to-l ${theme.cardGlow} via-slate-900 to-slate-950`}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-3">
              <span className={`text-2xl sm:text-3xl font-black font-mono tabular-nums ${theme.accent}`}>
                {currentProblem.number}
              </span>
              <h3 className="text-lg sm:text-2xl font-black text-white">
                {currentProblem.title}
              </h3>
            </div>
            
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>نام بین‌المللی: </span>
              <span className="font-mono text-slate-300 bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
                {currentProblem.englishTitle}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 font-medium italic mt-2">
            «{currentProblem.tagline}»
          </p>
        </div>

        {/* Interactive Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/80 px-4 sm:px-8 overflow-x-auto gap-2 text-xs">
          <button
            onClick={() => setActiveTab('solutions')}
            className={`py-3.5 px-4 font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'solutions'
                ? `border-emerald-400 text-emerald-400 bg-emerald-500/5`
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>پروتکل درمان علمی و گام‌به‌گام</span>
          </button>
          <button
            onClick={() => setActiveTab('neuro')}
            className={`py-3.5 px-4 font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'neuro'
                ? `border-indigo-400 text-indigo-400 bg-indigo-500/5`
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>ریشه‌یابی در مغز (Neuroscience)</span>
          </button>
          <button
            onClick={() => setActiveTab('symptoms')}
            className={`py-3.5 px-4 font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'symptoms'
                ? `border-amber-400 text-amber-400 bg-amber-500/5`
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>نشانه‌های این چالش در شما</span>
          </button>
          <button
            onClick={() => setActiveTab('mistakes')}
            className={`py-3.5 px-4 font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'mistakes'
                ? `border-rose-400 text-rose-400 bg-rose-500/5`
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>اشتباهات مهلک و باورهای غلط</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="p-6 sm:p-8 min-h-[300px]">
          {activeTab === 'solutions' && (
            <div className="space-y-6">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>دستورالعمل‌های آزمایش‌شده علوم شناختی برای رفع قطعی این مانع:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {currentProblem.cognitiveSolutions.map((sol, idx) => (
                  <div key={idx} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Compass className="w-4 h-4" />
                      <h4 className="text-sm font-bold text-white">{sol.title}</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">
                      {sol.description}
                    </p>
                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      {sol.steps.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'neuro' && (
            <div className="space-y-5 max-w-3xl">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
                <Brain className="w-4 h-4" />
                <span>مکانیزم عصبی و زیستی در دستگاه شناختی انسان:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/90 p-5 rounded-2xl border border-slate-800">
                {currentProblem.neuroMechanism}
              </p>
              <div className="text-xs text-slate-400 leading-relaxed p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200">
                نتیجه‌گیری علمی: مغز انسان برای بهینه‌سازی مصرف انرژی، مسیرهای با مقاومت کمتر را ترجیح می‌دهد. مقابله با این موضوع نیازمند تنظیم آگاهانه فرآیندهاست نه فشار عصبی و ملامت بیهوده خویش.
              </div>
            </div>
          )}

          {activeTab === 'symptoms' && (
            <div className="space-y-4 max-w-3xl">
              <div className="text-xs text-slate-400 mb-1">
                اگر حداقل ۲ مورد از موارد زیر برای شما صادق است، این مسئله گلوگاه اصلی افت درصد و ساعت مطالعه شماست:
              </div>
              <div className="space-y-2.5">
                {currentProblem.studentSymptoms.map((symptom, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-200 leading-relaxed">{symptom}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'mistakes' && (
            <div className="space-y-4 max-w-3xl">
              <div className="text-xs text-rose-400 font-semibold mb-1">
                الگوهای فکری و رفتاری مخربی که همین امروز باید متوقف شوند:
              </div>
              <div className="space-y-2.5">
                {currentProblem.deadlyMistakes.map((mistake, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-rose-950/20 border border-rose-900/30 p-4 rounded-xl">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-rose-100 leading-relaxed">{mistake}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Card Footer: Today's Action Challenge & Expert Quote */}
        <div className="p-6 sm:p-8 bg-slate-950/90 border-t border-slate-800 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Quick Action */}
          <div className="flex items-start gap-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-4">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-300">چالش عملیاتی ۱۰ دقیقه‌ای برای امروز:</div>
              <div className="text-xs text-slate-200 mt-1 leading-relaxed font-light">
                {currentProblem.quickActionForToday}
              </div>
            </div>
          </div>

          {/* Expert Quote */}
          <div className="flex items-start gap-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <Quote className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs text-slate-300 italic leading-relaxed">
                «{currentProblem.expertQuote.quote}»
              </p>
              <div className="text-[11px] text-slate-400">
                <span className="font-semibold text-slate-200">{currentProblem.expertQuote.author}</span>
                <span aria-hidden="true"> · </span>
                <span>{currentProblem.expertQuote.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
