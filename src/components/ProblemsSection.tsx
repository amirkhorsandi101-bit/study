import React, { useState } from 'react';
import { STUDY_PROBLEMS, StudyProblem } from '../data/problemsData';
import { 
  AlertCircle, 
  CheckCircle2, 
  Brain, 
  XCircle, 
  Flame, 
  ChevronDown, 
  ChevronUp, 
  Quote, 
  Compass,
  ArrowRight
} from 'lucide-react';

export const ProblemsSection: React.FC = () => {
  const [selectedProblemId, setSelectedProblemId] = useState<string>(STUDY_PROBLEMS[0].id);
  const [activeTab, setActiveTab] = useState<'symptoms' | 'neuro' | 'mistakes' | 'solutions'>('solutions');

  const currentProblem = STUDY_PROBLEMS.find(p => p.id === selectedProblemId) || STUDY_PROBLEMS[0];

  return (
    <section id="problems" className="py-20 px-6 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="mb-12 space-y-3">
        <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold tracking-wide">
          <span>کالبدشکافی علمی</span>
          <span aria-hidden="true">/</span>
          <span>چرا درس خواندن سخت می‌شود؟</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          ۶ مشکل اساسی دانش‌آموزان در مسیر یادگیری و درس خواندن
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
          اکثر دانش‌آموزان سال‌ها خود را بابت نمرات پایین یا فراموشی سرزنش می‌کنند، در حالی که ریشه این مشکلات در ساختار ناخودآگاه مغز و متدهای مطالعاتی است. یکی از ۶ گلوگاه زیر را انتخاب کنید تا ریشه و پروتکل درمان آن را ببینید:
        </p>
      </div>

      {/* Grid of 6 problem selector buttons (Segmented controls) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-10">
        {STUDY_PROBLEMS.map((problem) => {
          const isSelected = problem.id === selectedProblemId;
          return (
            <button
              key={problem.id}
              onClick={() => {
                setSelectedProblemId(problem.id);
                setActiveTab('solutions');
              }}
              className={`p-3 rounded-xl text-right transition-all flex flex-col justify-between h-28 border cursor-pointer ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500/60 shadow-sm shadow-amber-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-xs font-mono tabular-nums ${isSelected ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
                  {problem.number}
                </span>
                <span className={`text-[10px] ${
                  problem.severity === 'بحرانی' ? 'text-rose-400' :
                  problem.severity === 'شایع' ? 'text-amber-400' : 'text-sky-400'
                }`}>
                  {problem.severity}
                </span>
              </div>
              <span className={`text-xs font-semibold leading-snug line-clamp-2 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                {problem.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detailed Deep Dive Container */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Card Header with Problem Title */}
        <div className="p-6 sm:p-8 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
                {currentProblem.number}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {currentProblem.title}
              </h3>
            </div>
            
            <div className="text-xs text-slate-400">
              <span>نام بین‌المللی: </span>
              <span className="font-mono text-slate-300">{currentProblem.englishTitle}</span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-amber-200/90 font-medium">
            «{currentProblem.tagline}»
          </p>
        </div>

        {/* Interactive Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 sm:px-8 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('solutions')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'solutions'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            پروتکل درمان علمی و گام‌به‌گام
          </button>
          <button
            onClick={() => setActiveTab('neuro')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'neuro'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ریشه‌یابی در مغز (Neuroscience)
          </button>
          <button
            onClick={() => setActiveTab('symptoms')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'symptoms'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            نشانه‌های این مشکل در شما
          </button>
          <button
            onClick={() => setActiveTab('mistakes')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'mistakes'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            اشتباهات مهلک و باورهای غلط
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="p-6 sm:p-8 min-h-[320px]">
          {activeTab === 'solutions' && (
            <div className="space-y-6">
              <div className="text-xs text-slate-400 mb-2">
                دستورالعمل‌های آزمایش‌شده علوم شناختی برای رفع این مانع:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentProblem.cognitiveSolutions.map((sol, idx) => (
                  <div key={idx} className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-amber-400">
                      <Compass className="w-4 h-4" />
                      <h4 className="text-sm font-bold text-white">{sol.title}</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
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
              <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold">
                <Brain className="w-4 h-4" />
                <span>مکانیزم عصبی و زیستی در دستگاه شناختی انسان:</span>
              </div>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed bg-slate-950/80 p-6 rounded-xl border border-slate-800">
                {currentProblem.neuroMechanism}
              </p>
              <div className="text-xs text-slate-400 leading-relaxed">
                نتیجه‌گیری علمی: مغز انسان برای بهینه‌سازی مصرف انرژی، مسیرهای با مقاومت کمتر را ترجیح می‌دهد. مقابله با این موضوع نیازمند تنظیم آگاهانه فرآیندهاست نه فشار عصبی و ملامت بیهوده خویش.
              </div>
            </div>
          )}

          {activeTab === 'symptoms' && (
            <div className="space-y-4 max-w-3xl">
              <div className="text-xs text-slate-400 mb-1">
                اگر حداقل ۲ مورد از موارد زیر برای شما صادق است، این مشکل گلوگاه اصلی مطالعاتی شماست:
              </div>
              <div className="space-y-2.5">
                {currentProblem.studentSymptoms.map((symptom, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl">
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
                  <div key={idx} className="flex items-start gap-3 bg-rose-950/15 border border-rose-900/30 p-4 rounded-xl">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-rose-100 leading-relaxed">{mistake}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Card Footer: Today's Action Challenge & Expert Quote */}
        <div className="p-6 sm:p-8 bg-slate-950/80 border-t border-slate-800 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Quick Action */}
          <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-300">چالش عملیاتی ۱۰ دقیقه‌ای برای امروز:</div>
              <div className="text-xs text-slate-200 mt-1 leading-relaxed">
                {currentProblem.quickActionForToday}
              </div>
            </div>
          </div>

          {/* Expert Quote */}
          <div className="flex items-start gap-3 bg-slate-900/50 border border-slate-800 rounded-xl p-4">
            <Quote className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
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
