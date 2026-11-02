import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  Brain,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  Check,
  RotateCcw,
  Sliders,
  Shield,
  Zap,
  Flame,
  BookOpen,
  Layers,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Activity,
  Award,
  Filter,
  BarChart2,
  Moon,
  BellOff,
  BookmarkCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Area,
  AreaChart
} from 'recharts';
import { EbbinghausTopicItem } from './DashboardStats';
import {
  DEFAULT_REVIEW_STATS,
  EbbinghausReviewStats,
  EBBINGHAUS_INTERVALS
} from './EbbinghausScheduler';
import {
  PersonalStudyTopic,
  getPersonalStudyList,
  matchesPersonalStudyList,
  PERSONAL_LIST_UPDATED_EVENT
} from '../data/personalStudyList';

export const TOPICS_STORAGE_KEY = 'rahbord_ebbinghaus_topics_queue';
export const REVIEW_STATS_STORAGE_KEY = 'rahbord_ebbinghaus_review_stats';


export interface TopicAdvisorAnalysis {
  topic: EbbinghausTopicItem;
  currentRetrievability: number; // percentage 0-100
  stabilityDays: number;
  daysSinceLastReview: number;
  daysUntilTargetReview: number;
  urgencyScore: number; // 0 - 150 (higher = review first)
  riskLevel: 'critical' | 'high' | 'moderate' | 'secure';
  subjectRetentionBaseline: number;
  suggestedDurationMinutes: number;
  prescribedMethod: {
    name: string;
    description: string;
    cognitiveRationale: string;
  };
}

interface IntelligentStudyAdvisorProps {
  id?: string;
  onNavigateToScheduler?: () => void;
  onNavigateToDuels?: () => void;
}

export const IntelligentStudyAdvisor: React.FC<IntelligentStudyAdvisorProps> = ({
  id = 'study-advisor',
  onNavigateToScheduler,
  onNavigateToDuels
}) => {
  // Topics Queue & Review Stats
  const [topics, setTopics] = useState<EbbinghausTopicItem[]>(() => {
    try {
      const raw = localStorage.getItem(TOPICS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });

  const [reviewStats, setReviewStats] = useState<EbbinghausReviewStats>(() => {
    try {
      const raw = localStorage.getItem(REVIEW_STATS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return DEFAULT_REVIEW_STATS;
  });

  // Selected topic for deep forgetting curve analysis
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  // Time Budget for Today (in minutes: 15, 30, 45, 60, 90)
  const [timeBudgetMinutes, setTimeBudgetMinutes] = useState<number>(30);

  // Hypothetical Delay Simulator (days: 0, 1, 2, 3, 5, 7)
  const [simulatedDelayDays, setSimulatedDelayDays] = useState<number>(0);

  // Action status / toast
  const [appliedToast, setAppliedToast] = useState<string | null>(null);

  // Personal study list filtering
  const [onlyPersonalList, setOnlyPersonalList] = useState<boolean>(false);
  const [personalList, setPersonalList] = useState<PersonalStudyTopic[]>(() => getPersonalStudyList());

  // Listen to cross-component data changes
  useEffect(() => {
    const handleUpdate = () => {
      try {
        const raw = localStorage.getItem(TOPICS_STORAGE_KEY);
        if (raw) setTopics(JSON.parse(raw));
        const rawStats = localStorage.getItem(REVIEW_STATS_STORAGE_KEY);
        if (rawStats) setReviewStats(JSON.parse(rawStats));
        setPersonalList(getPersonalStudyList());
      } catch {}
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('rahbord_data_updated', handleUpdate);
    window.addEventListener(PERSONAL_LIST_UPDATED_EVENT, handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('rahbord_data_updated', handleUpdate);
      window.removeEventListener(PERSONAL_LIST_UPDATED_EVENT, handleUpdate);
    };
  }, []);


  // Scientific Retrievability & Decay Calculation Engine (Ebbinghaus Formula R = e^(-t/S))
  const analyzedTopics = useMemo<TopicAdvisorAnalysis[]>(() => {
    // Subject baselines from historical review stats
    const subjectRates: Record<string, number> = {};
    reviewStats.subjectHistory.forEach(s => {
      if (s.subject) subjectRates[s.subject] = s.retentionRate || 80;
    });

    // Base stability days by Ebbinghaus cycle
    const cycleStabilities = [1.2, 3.5, 8.0, 18.0, 38.0, 90.0];

    return topics.map(topic => {
      const cycleIdx = Math.min(Math.max(0, topic.currentCycle), cycleStabilities.length - 1);
      const baseStability = cycleStabilities[cycleIdx];

      // Subject difficulty modifier: lower retention in that subject = faster forgetting
      const subjRetention = subjectRates[topic.subject] || 80;
      const difficultyMultiplier = subjRetention / 80; // e.g. 75/80 = 0.9375 (decays faster)
      const adjustedStability = Math.max(0.8, Number((baseStability * difficultyMultiplier).toFixed(1)));

      const t = topic.lastReviewedDaysAgo;
      // Exponential decay formula: R = e^(-t / S) * 100
      const retrievabilityRaw = Math.exp(-t / adjustedStability) * 100;
      const currentRetrievability = Math.max(5, Math.min(100, Math.round(retrievabilityRaw)));

      // Target interval
      const targetInterval = EBBINGHAUS_INTERVALS[Math.min(topic.currentCycle, EBBINGHAUS_INTERVALS.length - 1)] || 1;
      const daysUntilTargetReview = targetInterval - t;

      // Urgency Score: combination of memory decay, overdue penalty, and subject vulnerability
      let urgencyScore = (100 - currentRetrievability) * 1.1;
      if (daysUntilTargetReview <= 0) {
        urgencyScore += 35 + Math.abs(daysUntilTargetReview) * 5; // overdue bonus priority
      }
      if (subjRetention < 80) {
        urgencyScore += (80 - subjRetention) * 0.8;
      }
      urgencyScore = Math.round(urgencyScore);

      // Risk Categorization
      let riskLevel: 'critical' | 'high' | 'moderate' | 'secure' = 'moderate';
      if (currentRetrievability < 45 || daysUntilTargetReview < -1) {
        riskLevel = 'critical';
      } else if (currentRetrievability < 68 || daysUntilTargetReview <= 0) {
        riskLevel = 'high';
      } else if (currentRetrievability < 84) {
        riskLevel = 'moderate';
      } else {
        riskLevel = 'secure';
      }

      // Prescribe Active Recall Method based on decay depth
      let prescribedMethod = {
        name: 'مرور پوششی و حل تست‌های نشان‌دار',
        description: 'حل ۳ تا ۵ تست چالشی با پاسخنامه بسته',
        cognitiveRationale: 'یادآوری ملایم برای تثبیت اتصالات سیناپسی جدید.'
      };

      let suggestedDurationMinutes = 10;

      if (riskLevel === 'critical') {
        prescribedMethod = {
          name: 'متد برگه سفید (Blurting) + ترسیم نقشه مفهومی',
          description: 'نوشتن فرمول‌ها و نکات از حفظ روی کاغذ خام و مقایسه با کتاب',
          cognitiveRationale: 'چون ردپای حافظه به زیر ۵۰٪ سقوط کرده، خواندن چشمی بی‌فایده است و تنها بازیابی عضلانی-ذهنی مانع ریست سیناپس می‌شود.'
        };
        suggestedDurationMinutes = 15;
      } else if (riskLevel === 'high') {
        prescribedMethod = {
          name: 'تکنیک فاینمن + تست زمان‌دار بدون جزوه',
          description: 'توضیح دادن مبحث به زبان ساده به یک فرد فرضی یا حل تست بدون نگاه به پاسخ',
          cognitiveRationale: 'پایداری بین ۵۰٪ تا ۷۰٪ در آستانه سقوط آزاد است؛ توضیح شفاهی مسیرهای عصبی هیپوکامپ را تحکیم می‌کند.'
        };
        suggestedDurationMinutes = 12;
      } else if (riskLevel === 'moderate') {
        prescribedMethod = {
          name: 'فلش‌کارت لایتنر و تست‌های سرعتی',
          description: 'پاسخگویی سریع به سوالات فرار و نشان‌دار',
          cognitiveRationale: 'حافظه در پنجره بهینه تثبیت قرار دارد و نیازمند یک تکانه کوچک برای انتقال به قشر مخ است.'
        };
        suggestedDurationMinutes = 8;
      } else {
        prescribedMethod = {
          name: 'دوئل سرعتی با هم‌کلاسی یا تست تسلط',
          description: 'مسابقه در بخش دوئل‌های مطالعاتی برای سنجش زمان پاسخگویی',
          cognitiveRationale: 'حافظه پایدار است؛ چالش تحت فشار زمان باعث تقویت خودکارسازی پاسخ می‌شود.'
        };
        suggestedDurationMinutes = 5;
      }

      return {
        topic,
        currentRetrievability,
        stabilityDays: adjustedStability,
        daysSinceLastReview: t,
        daysUntilTargetReview,
        urgencyScore,
        riskLevel,
        subjectRetentionBaseline: subjRetention,
        suggestedDurationMinutes,
        prescribedMethod
      };
    });
  }, [topics, reviewStats]);

  // Sort topics by urgency score descending (Advisor's Optimized Order)
  const sortedByPriority = useMemo(() => {
    let list = [...analyzedTopics];
    if (onlyPersonalList) {
      list = list.filter(item => matchesPersonalStudyList(item.topic, personalList));
    }
    return list.sort((a, b) => b.urgencyScore - a.urgencyScore);
  }, [analyzedTopics, onlyPersonalList, personalList]);


  // Default selected topic for curve
  useEffect(() => {
    if (sortedByPriority.length > 0 && !selectedTopicId) {
      setSelectedTopicId(sortedByPriority[0].topic.id);
    }
  }, [sortedByPriority, selectedTopicId]);

  const activeAnalyzedTopic = useMemo(() => {
    return sortedByPriority.find(t => t.topic.id === selectedTopicId) || sortedByPriority[0] || null;
  }, [sortedByPriority, selectedTopicId]);

  // Time Budget Fitting: Fit highest urgency topics into student's time budget
  const budgetAllocation = useMemo(() => {
    let accumulatedMinutes = 0;
    const included: TopicAdvisorAnalysis[] = [];
    const excluded: TopicAdvisorAnalysis[] = [];

    sortedByPriority.forEach(item => {
      if (accumulatedMinutes + item.suggestedDurationMinutes <= timeBudgetMinutes + 4) {
        accumulatedMinutes += item.suggestedDurationMinutes;
        included.push(item);
      } else {
        excluded.push(item);
      }
    });

    return {
      included,
      excluded,
      totalMinutes: accumulatedMinutes
    };
  }, [sortedByPriority, timeBudgetMinutes]);

  // Generate Forgetting Curve Data Points for Active Topic (Day 0 to Day 30)
  const curveData = useMemo(() => {
    if (!activeAnalyzedTopic) return [];

    const S = activeAnalyzedTopic.stabilityDays;
    const currentDay = activeAnalyzedTopic.daysSinceLastReview + simulatedDelayDays;
    const data = [];

    for (let day = 0; day <= 28; day += 2) {
      // Natural decay without review: R = e^(-t / S)
      const noReviewRetention = Math.round(Math.exp(-day / S) * 100);

      // Boosted curve: what happens if student reviews today?
      let boostedRetention = noReviewRetention;
      if (day >= currentDay) {
        // Review resets retention to 100% and increases stability by 2.5x!
        const boostedS = S * 2.5;
        const daysSinceBoost = day - currentDay;
        boostedRetention = Math.round(Math.exp(-daysSinceBoost / boostedS) * 100);
      }

      data.push({
        day: `روز ${day}`,
        dayNum: day,
        decayCurve: noReviewRetention,
        boostedCurve: boostedRetention,
        isCurrent: day === currentDay
      });
    }

    return data;
  }, [activeAnalyzedTopic, simulatedDelayDays]);

  // 1-Click: Apply Optimized Priority Order to LocalStorage
  const handleApplyOptimizedOrder = () => {
    const reorderedTopics = sortedByPriority.map(item => item.topic);
    try {
      localStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(reorderedTopics));
      setTopics(reorderedTopics);
      window.dispatchEvent(new Event('storage'));

      setAppliedToast('✅ چیدمان اولویت‌بندی هوشمند با موفقیت در جدول زمان‌بندی مرور اعمال شد!');
      setTimeout(() => setAppliedToast(null), 4500);
    } catch (err) {
      console.warn('Failed to save reordered topics', err);
    }
  };

  // Diagnostic breakdown by risk
  const statsOverview = useMemo(() => {
    const critical = analyzedTopics.filter(t => t.riskLevel === 'critical').length;
    const high = analyzedTopics.filter(t => t.riskLevel === 'high').length;
    const moderate = analyzedTopics.filter(t => t.riskLevel === 'moderate').length;
    const secure = analyzedTopics.filter(t => t.riskLevel === 'secure').length;

    const avgRetrievability = analyzedTopics.length > 0
      ? Math.round(analyzedTopics.reduce((acc, t) => acc + t.currentRetrievability, 0) / analyzedTopics.length)
      : 100;

    return { critical, high, moderate, secure, avgRetrievability };
  }, [analyzedTopics]);

  return (
    <section id={id} className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 bg-slate-950 relative overflow-hidden" dir="rtl">
      {/* Background ambient glow */}
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Applied Feedback Toast */}
        {appliedToast && (
          <div className="fixed bottom-6 left-6 z-50 bg-slate-900 border border-emerald-500/80 text-emerald-300 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 backdrop-blur-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold">{appliedToast}</span>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Compass className="w-3.5 h-3.5" />
              <span>سیستم هوشمند تحلیل و چیدمان اولویت‌های مطالعه</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>مشاور شناختی اولویت‌بندی مرور</span>
              <span className="text-amber-400 text-lg font-mono font-medium">(Intelligent Study Advisor)</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              این مشاور با تحلیل عملکرد گذشته شما، پایداری اتصالات سیناپسی را مدل‌سازی کرده و بر اساس «منحنی پیش‌بینی زوال حافظه»، مباحث با بالاترین ریسک فراموشی را در صدر برنامه روزانه قرار می‌دهد.
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                const el = document.getElementById('weekly-insight');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-amber-300 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <BarChart2 className="w-4 h-4 text-amber-400" />
              <span>بینش هفتگی D3</span>
            </button>

            <button
              onClick={handleApplyOptimizedOrder}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>اعمال اولویت‌ها در جدول زمان‌بندی</span>
            </button>
          </div>
        </div>

        {/* Top Diagnostic Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">ریسک بحرانی زوال</div>
              <div className="text-xl font-bold text-rose-400 tabular-nums">
                {statsOverview.critical} <span className="text-xs text-slate-400 font-normal">مبحث</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">پنجره طلایی مرور</div>
              <div className="text-xl font-bold text-amber-300 tabular-nums">
                {statsOverview.high} <span className="text-xs text-slate-400 font-normal">مبحث</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">میانگین پایداری حافظه</div>
              <div className="text-xl font-bold text-cyan-300 tabular-nums">
                {statsOverview.avgRetrievability}٪
              </div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">حافظه پایدار (نئوکورتکس)</div>
              <div className="text-xl font-bold text-emerald-400 tabular-nums">
                {statsOverview.secure} <span className="text-xs text-slate-400 font-normal">مبحث</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 1: DAILY TIME BUDGET AUTO-BALANCER
           ========================================================================= */}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>تخصیص هوشمند زمان مطالعه امروز (Time Budget Auto-Balancer)</span>
              </h3>
              <p className="text-xs text-slate-400">
                مشخص کنید امروز چند دقیقه برای مرور فرصت دارید؛ مشاور بر اساس فوریت، دقیقاً تعیین می‌کند کدام مباحث را در اولویت قرار دهید.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setOnlyPersonalList(!onlyPersonalList)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                  onlyPersonalList
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
                title="محدود کردن تحلیل مشاور به مباحث انتخابی شما در لیست شخصی"
              >
                <BookmarkCheck className={`w-3.5 h-3.5 ${onlyPersonalList ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>فقط مباحث لیست شخصی</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  onlyPersonalList ? 'bg-slate-950/20 text-slate-950' : 'bg-amber-400/10 text-amber-300'
                }`}>
                  {personalList.length}
                </span>
              </button>

              <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

              {[20, 30, 45, 60, 90].map(mins => (
                <button
                  key={mins}
                  onClick={() => setTimeBudgetMinutes(mins)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    timeBudgetMinutes === mins
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  {mins} دقیقه
                </button>
              ))}
            </div>

          </div>

          {/* Allocation Outcome Summary */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-white font-bold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>بسته مطالعاتی بهینه‌شده برای {timeBudgetMinutes} دقیقه:</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                شامل <strong>{budgetAllocation.included.length} مبحث با بیشترین ریسک فراموشی</strong> (مجموع زمان محاسبه‌شده: {budgetAllocation.totalMinutes} دقیقه).
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onNavigateToScheduler && (
                <button
                  onClick={onNavigateToScheduler}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-850 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>جدول زمان‌بندی مرور</span>
                </button>
              )}

              {onNavigateToDuels && (
                <button
                  onClick={onNavigateToDuels}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>دوئل بازیابی ⚔️</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 2: EXECUTIVE PRIORITY MATRIX & TOPICS RANKING
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Ranked Priority Queue (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>رتبه‌بندی مباحث بر اساس فوریت و پایداری سیناپسی:</span>
              </h3>
              <span className="text-[11px] text-slate-400">مرتب‌شده از بیشترین به کمترین ریسک</span>
            </div>

            <div className="space-y-3">
              {sortedByPriority.map((item, index) => {
                const isSelected = selectedTopicId === item.topic.id;
                const isIncludedInBudget = budgetAllocation.included.some(b => b.topic.id === item.topic.id);

                return (
                  <div
                    key={item.topic.id}
                    onClick={() => setSelectedTopicId(item.topic.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-right relative group ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/60 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/30'
                        : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        {/* Rank Badge */}
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                          index === 0
                            ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                            : index === 1
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {index + 1}
                        </div>

                        <div className="space-y-1 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                              {item.topic.topicName}
                            </span>
                            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium">
                              {item.topic.subject}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-slate-400">
                            <span>آخرین مرور: <strong className="text-slate-200">{item.daysSinceLastReview} روز قبل</strong></span>
                            <span>•</span>
                            <span>پایداری پیش‌بینی‌شده: <strong className={item.currentRetrievability < 50 ? 'text-rose-400' : 'text-amber-400'}>{item.currentRetrievability}٪</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Risk Badge */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          item.riskLevel === 'critical'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : item.riskLevel === 'high'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : item.riskLevel === 'moderate'
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {item.riskLevel === 'critical' ? 'ریسک بحرانی' : item.riskLevel === 'high' ? 'پنجره طلایی' : item.riskLevel === 'moderate' ? 'پایداری متوسط' : 'ایمن'}
                        </span>

                        {isIncludedInBudget && (
                          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>در بودجه امروز ({item.suggestedDurationMinutes} د)</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Prescribed action preview */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="text-slate-300 truncate max-w-sm">
                        توصیه: <strong>{item.prescribedMethod.name}</strong>
                      </span>
                      <span className="text-amber-400 text-[10px] font-semibold shrink-0">
                        مشاهده منحنی زوال ←
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Deep Forgetting Curve & Prescription for Selected Topic (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {activeAnalyzedTopic && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl relative">
                {/* Header of selected topic */}
                <div className="space-y-1.5 border-b border-slate-800/80 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">
                      تحلیل تخصصی منحنی ابینگهاوس
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      ضریب فوریت: {activeAnalyzedTopic.urgencyScore}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">
                    {activeAnalyzedTopic.topic.topicName}
                  </h4>
                  <div className="text-xs text-slate-400">
                    درس: <strong className="text-slate-200">{activeAnalyzedTopic.topic.subject}</strong> (نرخ تسلط تاریخی شما در این درس: {activeAnalyzedTopic.subjectRetentionBaseline}٪)
                  </div>
                </div>

                {/* Forgetting Curve Chart */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">مسیر پیش‌بینی زوال حافظه (۳۰ روز):</span>
                    <span className="text-[10px] text-slate-500">منحنی R = e^(-t/S)</span>
                  </div>

                  <div className="h-52 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={curveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="decayGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="boostGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                        <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0f172a',
                            border: '1px solid #334155',
                            borderRadius: '12px',
                            fontSize: '11px',
                            textAlign: 'right'
                          }}
                        />
                        <ReferenceLine y={50} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: 'مرز فراموشی (۵۰٪)', fill: '#f43f5e', fontSize: 9 }} />
                        <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'پنجره طلایی (۸۰٪)', fill: '#f59e0b', fontSize: 9 }} />
                        <Area
                          type="monotone"
                          dataKey="decayCurve"
                          stroke="#f43f5e"
                          strokeWidth={2}
                          fill="url(#decayGrad)"
                          name="بدون مرور مجدد"
                        />
                        <Area
                          type="monotone"
                          dataKey="boostedCurve"
                          stroke="#10b981"
                          strokeWidth={2}
                          fill="url(#boostGrad)"
                          name="با مرور پیشنهادی مشاور"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                      <span>مسیر زوال طبیعی بدون مرور</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                      <span>مسیر بازتنظیم و تحکیم بعد از مرور</span>
                    </span>
                  </div>
                </div>

                {/* Hypothetical Delay Simulation Slider */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                      <span>شبیه‌ساز پیامد تعویق:</span>
                    </span>
                    <span className="text-amber-400 font-bold font-mono">
                      {simulatedDelayDays === 0 ? 'بدون تاخیر (امروز)' : `+${simulatedDelayDays} روز تاخیر`}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="7"
                    step="1"
                    value={simulatedDelayDays}
                    onChange={e => setSimulatedDelayDays(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />

                  <div className="text-[11px] text-slate-400 leading-snug">
                    {simulatedDelayDays === 0 ? (
                      <span>پایداری کنونی: <strong className="text-amber-400">{activeAnalyzedTopic.currentRetrievability}٪</strong>. مرور در موعد مقرر، پایداری را به ۱۰۰٪ می‌رساند.</span>
                    ) : (
                      <span className="text-rose-300">
                        ⚠️ با {simulatedDelayDays} روز تاخیر، پایداری حافظه به <strong>{Math.max(5, Math.round(activeAnalyzedTopic.currentRetrievability * Math.exp(-simulatedDelayDays / activeAnalyzedTopic.stabilityDays)))}٪</strong> سقوط کرده و برای بازیابی نیاز به ۳ برابر زمان خواهید داشت!
                      </span>
                    )}
                  </div>
                </div>

                {/* Prescribed Cognitive Method Box */}
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <Brain className="w-4 h-4" />
                    <span>تجویز استراتژی شناختی برای این مبحث:</span>
                  </div>
                  <h5 className="font-bold text-white text-sm">
                    {activeAnalyzedTopic.prescribedMethod.name}
                  </h5>
                  <p className="text-slate-300 leading-relaxed">
                    {activeAnalyzedTopic.prescribedMethod.description}
                  </p>
                  <p className="text-[11px] text-amber-300/80 italic pt-1 border-t border-amber-500/10">
                    «{activeAnalyzedTopic.prescribedMethod.cognitiveRationale}»
                  </p>
                </div>

                {/* Launch High-Priority Review in Study Focus Mode */}
                <button
                  onClick={() => {
                    try {
                      localStorage.setItem('rahbord_launch_focus_topic_id', activeAnalyzedTopic.topic.id);
                      localStorage.setItem('rahbord_study_focus_mode_active', 'true');
                      window.dispatchEvent(new CustomEvent('rahbord_launch_focus_session', { detail: { topicId: activeAnalyzedTopic.topic.id } }));
                      window.dispatchEvent(new Event('rahbord_study_focus_mode_changed'));
                    } catch (e) {
                      console.error(e);
                    }
                    if (onNavigateToScheduler) {
                      onNavigateToScheduler();
                    } else {
                      const el = document.getElementById('ebbinghaus-scheduler');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-rose-500 to-amber-400 hover:opacity-95 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Moon className="w-4 h-4 text-slate-950" />
                  <span>شروع مرور در حالت تمرکز عمیق (Study Focus Mode) 🚀</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
