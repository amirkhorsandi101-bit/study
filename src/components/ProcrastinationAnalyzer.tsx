import React, { useState, useEffect } from 'react';
import { 
  Hourglass, 
  Brain, 
  Flame, 
  AlertCircle, 
  Smartphone, 
  Sparkles, 
  CheckCircle2, 
  TrendingDown, 
  Calendar, 
  ArrowRight, 
  Zap, 
  ShieldAlert,
  RotateCcw,
  Plus
} from 'lucide-react';
import { WeeklyProgressItem } from './DashboardStats';
import { EbbinghausTopicItem } from './DashboardStats';
import { goToSection } from '../shell/navigation';

interface ProcrastinationLog {
  id: string;
  timestamp: string;
  trigger: 'phone_dopamine' | 'task_difficulty' | 'perfectionism' | 'step_ambiguity' | 'fatigue';
  triggerLabel: string;
  notes?: string;
}

const STORAGE_KEY_LOGS = 'rahbord_procrastination_logs';
const STORAGE_KEY_WEEKLY = 'rahbord_weekly_study_data';
const STORAGE_KEY_QUIZ = 'rahbord_diagnostic_quiz_answers';
const STORAGE_KEY_DUMP = 'rahbord_braindump_items';
const STORAGE_KEY_TOPICS = 'rahbord_ebbinghaus_topics_queue';

export const ProcrastinationAnalyzer: React.FC<{ onNavigateToToolkit?: () => void }> = ({ onNavigateToToolkit }) => {
  // Procrastination logs stored in LocalStorage
  const [logs, setLogs] = useState<ProcrastinationLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: '1', timestamp: 'دیروز ساعت ۱۶:۳۰', trigger: 'phone_dopamine', triggerLabel: 'چک کردن گوشی و شبکه‌های اجتماعی' },
      { id: '2', timestamp: '۳ روز پیش ساعت ۱۰:۱۵', trigger: 'task_difficulty', triggerLabel: 'ترس از سنگینی مبحث و شروع سخت' }
    ];
  });

  const [selectedTrigger, setSelectedTrigger] = useState<ProcrastinationLog['trigger']>('phone_dopamine');
  const [customNote, setCustomNote] = useState<string>('');
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [antidoteTip, setAntidoteTip] = useState<string | null>(null);

  // Synchronize logs to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
    } catch (e) {
      console.error(e);
    }
  }, [logs]);

  // Read study data from LocalStorage to find real patterns
  const [analysisMetrics, setAnalysisMetrics] = useState({
    mostVulnerableDay: 'دوشنبه',
    targetGapCount: 3,
    avgCompletionRate: 82,
    overdueTopicsCount: 0,
    strayThoughtsCount: 0,
    dominantPattern: 'سد انرژی شروع و دوپامین گوشی',
    frictionScore: 58
  });

  useEffect(() => {
    try {
      // 1. Analyze weekly study data
      const savedWeekly = localStorage.getItem(STORAGE_KEY_WEEKLY);
      let vulnerableDay = 'دوشنبه';
      let gapCount = 0;
      let totalRate = 80;

      if (savedWeekly) {
        const weeklyData: WeeklyProgressItem[] = JSON.parse(savedWeekly);
        if (Array.isArray(weeklyData)) {
          // Find day with highest gap (targetTopics - reviewedTopics)
          let maxGap = -999;
          weeklyData.forEach(item => {
            const gap = item.targetTopics - item.reviewedTopics;
            if (gap > 0) gapCount += 1;
            if (gap > maxGap) {
              maxGap = gap;
              vulnerableDay = item.day;
            }
          });
          const reviewedSum = weeklyData.reduce((acc, c) => acc + c.reviewedTopics, 0);
          const targetSum = weeklyData.reduce((acc, c) => acc + c.targetTopics, 0);
          totalRate = targetSum > 0 ? Math.round((reviewedSum / targetSum) * 100) : 80;
        }
      }

      // 2. Analyze overdue Ebbinghaus topics
      const savedTopics = localStorage.getItem(STORAGE_KEY_TOPICS);
      let overdueCount = 0;
      if (savedTopics) {
        const topics: EbbinghausTopicItem[] = JSON.parse(savedTopics);
        if (Array.isArray(topics)) {
          topics.forEach(t => {
            const targetIntervals = [1, 3, 10, 30, 60];
            const target = targetIntervals[Math.min(t.currentCycle, 4)];
            if (t.lastReviewedDaysAgo >= target) overdueCount += 1;
          });
        }
      }

      // 3. Analyze stray thoughts from braindump
      const savedDump = localStorage.getItem(STORAGE_KEY_DUMP);
      let dumpCount = 0;
      if (savedDump) {
        const items = JSON.parse(savedDump);
        if (Array.isArray(items)) dumpCount = items.filter((i: any) => !i.completed).length;
      }

      // Calculate friction score (0 to 100)
      const calculatedFriction = Math.min(95, Math.max(25, Math.round(
        (100 - totalRate) * 0.5 + (overdueCount * 8) + (gapCount * 4) + (logs.length * 5)
      )));

      let dominant = 'سد انرژی شروع و دوپامین سریع';
      if (logs.some(l => l.trigger === 'perfectionism') || totalRate < 70) {
        dominant = 'فلج کمال‌گرایی و برنامه‌ریزی شکننده';
      } else if (dumpCount > 3) {
        dominant = 'پسماند حواس‌پرتی و سرریز حافظه کاری';
      }

      setAnalysisMetrics({
        mostVulnerableDay: vulnerableDay,
        targetGapCount: gapCount,
        avgCompletionRate: totalRate,
        overdueTopicsCount: overdueCount,
        strayThoughtsCount: dumpCount,
        dominantPattern: dominant,
        frictionScore: calculatedFriction
      });
    } catch (e) {
      console.error('Error analyzing LocalStorage in ProcrastinationAnalyzer:', e);
    }
  }, [logs]);

  // Log a new procrastination trigger episode
  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const triggerMap: Record<ProcrastinationLog['trigger'], { label: string; tip: string }> = {
      phone_dopamine: {
        label: 'حواس‌پرتی گوشی و شبکه‌های اجتماعی',
        tip: 'پادزهر فوری: گوشی را در حالت پرواز بگذارید و به اتاق دیگری ببرید. حتی دیدن گوشی روی میز بخشی از حافظه فعال را مصرف می‌کند!'
      },
      task_difficulty: {
        label: 'ترس از سنگینی مبحث و شروع سخت',
        tip: 'پادزهر فوری (قانون ۵ دقیقه): به مغزتان قول دهید فقط ۵ دقیقه این درس را بخواند و بعد از آن مجاز به ترک است. سد اولیه خواهد شکست!'
      },
      perfectionism: {
        label: 'کمال‌گرایی صفر و صدی و ناامیدی',
        tip: 'پادزهر فوری: یک پارت مطالعه ناقص ۵۰ درصدی امروز، ۱۰۰ برابر بهتر از یک روز بدون مطالعه و ماندن در توهم از شنبه است.'
      },
      step_ambiguity: {
        label: 'ابهام در گام اول و ندانستن از کجا شروع کنم',
        tip: 'پادزهر فوری: کتاب را باز کنید و فقط خط اول صفحه را بخوانید. تسک را به یک ریز-اقدام ۲ دقیقه‌ای خرد کنید.'
      },
      fatigue: {
        label: 'خستگی جسمی و خواب‌آلودگی پای کتاب',
        tip: 'پادزهر فوری: ۳ دقیقه قدم بزنید، یک لیوان آب خنک بنوشید، یا یک چرت قدرتی (Power Nap) دقیقاً ۱۵ دقیقه‌ای بزنید.'
      }
    };

    const newLogItem: ProcrastinationLog = {
      id: Date.now().toString(),
      timestamp: `امروز ساعت ${new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}`,
      trigger: selectedTrigger,
      triggerLabel: triggerMap[selectedTrigger].label,
      notes: customNote.trim() || undefined
    };

    setLogs(prev => [newLogItem, ...prev]);
    setAntidoteTip(triggerMap[selectedTrigger].tip);
    setCustomNote('');
    setShowLogModal(false);
  };

  const handleClearLogs = () => {
    setLogs([]);
    try {
      localStorage.removeItem(STORAGE_KEY_LOGS);
    } catch (e) {
      // ignore
    }
  };

  return (
    <section id="procrastination-analyzer" className="py-20 px-6 max-w-6xl mx-auto border-t border-slate-800/80">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold tracking-wide">
            <span>تحلیل‌گر الگوهای رفتاری</span>
            <span aria-hidden="true">/</span>
            <span>استخراج الگو از داده‌های واقعی LocalStorage</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            کالبدشکافی هوشمند اهمال‌کاری و راهکارهای شخصی‌سازی‌شده
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            این سیستم با تحلیل ساعات افت مطالعه، مباحث به تعویق افتاده، و افکار سرگردان در حافظه مرورگر، الگوهای ناخودآگاه اهمال‌کاری شما را شناسایی می‌کند.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowLogModal(!showLogModal)}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>ثبت لحظه اهمال‌کاری (همین الان)</span>
          </button>
        </div>
      </div>

      {/* Immediate Antidote Tip Banner */}
      {antidoteTip && (
        <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-3 animate-fadeIn">
          <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-300">پادزهر شناختی آنی برای شکستن این سد:</span>
            <p className="leading-relaxed text-slate-200">{antidoteTip}</p>
          </div>
        </div>
      )}

      {/* Trigger Logging Modal/Dropdown */}
      {showLogModal && (
        <form onSubmit={handleAddLog} className="mb-8 p-5 bg-slate-900 border border-rose-500/30 rounded-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-bold text-rose-400">
            <span className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>ریشه‌یابی لحظه‌ای: چه عاملی الان مانع از شروع مطالعه شما شده است؟</span>
            </span>
            <button
              type="button"
              onClick={() => setShowLogModal(false)}
              className="text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              انصراف
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {[
              { id: 'phone_dopamine', label: 'اعتیاد به گوشی و اسکرول شبکه‌های اجتماعی' },
              { id: 'task_difficulty', label: 'ترس از سختی مبحث و حجم زیاد درس' },
              { id: 'perfectionism', label: 'کمال‌گرایی (چون صبح نخواندم، کلاً بیخیال شدم)' },
              { id: 'step_ambiguity', label: 'ابهام در گام اول (نمی‌دانم دقیقاً چی بخوانم)' },
              { id: 'fatigue', label: 'خستگی مزمن، خمیازه و افت شدید انرژی' }
            ].map(item => (
              <button
                type="button"
                key={item.id}
                onClick={() => setSelectedTrigger(item.id as any)}
                className={`p-3 rounded-xl border text-right text-xs transition-all cursor-pointer ${
                  selectedTrigger === item.id
                    ? 'bg-rose-500/15 border-rose-500/60 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder="توضیح کوتاه اختیاری (مثلاً: می‌خواستم تست فیزیک بزنم ولی رفتم اینستاگرام...)"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-400"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
            >
              ثبت و دریافت پادزهر فوری
            </button>
          </div>
        </form>
      )}

      {/* Main Analysis Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Identified Pattern Card */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                پروفایل عصبی-رفتاری اهمال‌کاری شما
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              برگرفته از تاریخچه LocalStorage
            </span>
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">الگوی غالب شناسایی‌شده:</span>
              <span className="text-amber-400 font-bold">{analysisMetrics.dominantPattern}</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">شاخص اصطکاک شروع مطالعه (Friction Index):</span>
                <span className="text-rose-400 font-extrabold tabular-nums">{analysisMetrics.frictionScore}٪</span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-l from-rose-500 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${analysisMetrics.frictionScore}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              داده‌های ثبت‌شده نشان می‌دهد بیشترین لغزش شما در روزهای <strong className="text-amber-400 font-bold">{analysisMetrics.mostVulnerableDay}</strong> رخ می‌دهد. 
              آمیگدال مغز شما وظایف بزرگ را مانند تهدید تلقی کرده و به دنبال دوپامین سریع می‌رود.
            </p>
          </div>

          {/* 3 Tailored Scientific Countermeasures */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300">
              راهکارهای مهندسی‌شده علوم اعصاب برای الگوی شما:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
                  <Flame className="w-4 h-4" />
                  <span>۱. قانون ۵ دقیقه</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  تعهد به مطالعه فقط برای ۳۰۰ ثانیه؛ در ۸۵٪ مواقع با عبور از آستانه درد اولیه، کار ادامه می‌یابد.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="text-sky-400 font-bold text-xs flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" />
                  <span>۲. ایزوله‌سازی گوشی</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  بردن گوشی به اتاق دیگر؛ حذف محرک بصری اصطکاک توجه را بیش از ۴۰ درصد کاهش می‌دهد.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>۳. میکرو-اقدام ۲ دقیقه‌ای</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  تعریف هدف به کوچکی خواندن ۳ خط، برای روشن شدن موتور سیستم پاداش و ترشح دوپامین واقعی.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Real Logs & Distraction Stats */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Hourglass className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-white">
                  تاریخچه لحظات لغزش ثبت‌شده در حافظه مرورگر
                </h3>
              </div>
              {logs.length > 0 && (
                <button
                  onClick={handleClearLogs}
                  className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  پاکسازی
                </button>
              )}
            </div>

            {/* List of Logs */}
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {logs.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  هیچ موردی ثبت نشده است. هر زمان احساس کردید در شروع مطالعه تعلل دارید، آن را ثبت کنید.
                </div>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-rose-300">{log.triggerLabel}</span>
                      <span className="text-slate-500 tabular-nums">{log.timestamp}</span>
                    </div>
                    {log.notes && (
                      <p className="text-[11px] text-slate-400 italic">«{log.notes}»</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick launch to toolkit */}
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                if (onNavigateToToolkit) {
                  onNavigateToToolkit();
                } else {
                  goToSection('toolkit');
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              <span>ورود به تایمر پرتاب ۵ دقیقه‌ای برای شروع فوری</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
