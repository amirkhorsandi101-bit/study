import React, { useState, useEffect } from 'react';
import {
  Clock,
  Compass,
  Timer,
  Brain,
  Sparkles,
  ArrowLeft,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Headphones,
  Swords,
  BarChart3,
  Trophy,
  Layers,
  ChevronLeft,
  Moon,
  Zap,
  ShieldCheck,
  Check,
  Maximize2
} from 'lucide-react';
import { EbbinghausTopicItem } from './DashboardStats';
import { EBBINGHAUS_INTERVALS } from './EbbinghausScheduler';

interface DashboardProps {
  id?: string;
  onNavigate: (sectionId: string) => void;
  activeViewMode?: 'focused' | 'all';
  onToggleViewMode?: (mode: 'focused' | 'all') => void;
  activeToolId?: string;
  onSelectTool?: (toolId: string) => void;
}

const TOPICS_STORAGE_KEY = 'rahbord_ebbinghaus_topics_queue';
const REVIEW_STATS_STORAGE_KEY = 'rahbord_ebbinghaus_review_stats';
const HABIT_STORAGE_KEY = 'rahbord_study_habit_tracker_v1';
const FOCUS_MODE_KEY = 'rahbord_study_focus_mode_active';

export const Dashboard: React.FC<DashboardProps> = ({
  id = 'dashboard-hub',
  onNavigate,
  activeViewMode = 'all',
  onToggleViewMode,
  activeToolId,
  onSelectTool
}) => {
  // Topics queue from LocalStorage
  const [topics, setTopics] = useState<EbbinghausTopicItem[]>(() => {
    try {
      const saved = localStorage.getItem(TOPICS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading topics in Dashboard:', e);
    }
    return [
      {
        id: 't1',
        subject: 'زیست‌شناسی',
        topicName: 'گردش مواد و ساختار قلب انسان',
        lastReviewedDaysAgo: 3,
        currentCycle: 1,
        recommendedMethod: 'تست پوششی نشان‌دار + رسم نمودار درختی از حفظ'
      },
      {
        id: 't2',
        subject: 'ریاضی و حسابان',
        topicName: 'فرمول‌های مشتق و قاعده زنجیره‌ای',
        lastReviewedDaysAgo: 1,
        currentCycle: 0,
        recommendedMethod: 'حل ۳ مسئله چالشی بدون نگاه به پاسخنامه'
      },
      {
        id: 't3',
        subject: 'فیزیک',
        topicName: 'قوانین حرکت نیوتون و دینامیک',
        lastReviewedDaysAgo: 7,
        currentCycle: 2,
        recommendedMethod: 'مرور فرمول‌ها با متد برگه سفید (Blurting)'
      },
      {
        id: 't4',
        subject: 'شیمی',
        topicName: 'ساختار لوویس و پیوندهای کووالانسی',
        lastReviewedDaysAgo: 0,
        currentCycle: 0,
        recommendedMethod: 'حل ۵ تست سریع برای تثبیت اولیه'
      },
      {
        id: 't5',
        subject: 'ادبیات و علوم انسانی',
        topicName: 'آرایه‌های استعاره، مجاز و ایهام',
        lastReviewedDaysAgo: 22,
        currentCycle: 3,
        recommendedMethod: 'تست زمان‌دار ترکیبی کنکور'
      }
    ];
  });

  // Focus mode state
  const [isFocusMode, setIsFocusMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(FOCUS_MODE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Habit streak estimation from LocalStorage
  const [streakDays, setStreakDays] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(HABIT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return Math.max(1, parsed.length);
        }
      }
    } catch {
      // fallback
    }
    return 6;
  });

  // Quick 5-min timer launcher state inside dashboard
  const [quickTimerSeconds, setQuickTimerSeconds] = useState<number>(300);
  const [isQuickTimerRunning, setIsQuickTimerRunning] = useState<boolean>(false);
  const [quickTimerFinished, setQuickTimerFinished] = useState<boolean>(false);

  // Sync topics when local storage changes or window gains focus
  useEffect(() => {
    const reloadData = () => {
      try {
        const saved = localStorage.getItem(TOPICS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setTopics(parsed);
        }
        setIsFocusMode(localStorage.getItem(FOCUS_MODE_KEY) === 'true');
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('focus', reloadData);
    window.addEventListener('rahbord_study_focus_mode_changed', reloadData);
    return () => {
      window.removeEventListener('focus', reloadData);
      window.removeEventListener('rahbord_study_focus_mode_changed', reloadData);
    };
  }, []);

  // Quick 5-minute counter effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isQuickTimerRunning && quickTimerSeconds > 0) {
      interval = setInterval(() => {
        setQuickTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsQuickTimerRunning(false);
            setQuickTimerFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isQuickTimerRunning, quickTimerSeconds]);

  // Toggle study focus mode
  const handleToggleFocusMode = () => {
    const nextVal = !isFocusMode;
    setIsFocusMode(nextVal);
    try {
      localStorage.setItem(FOCUS_MODE_KEY, String(nextVal));
      window.dispatchEvent(new Event('rahbord_study_focus_mode_changed'));
    } catch (e) {
      console.error(e);
    }
  };

  // Ebbinghaus Analysis Metrics
  const dueTopics = topics.filter((t) => {
    const targetInterval = EBBINGHAUS_INTERVALS[Math.min(t.currentCycle, EBBINGHAUS_INTERVALS.length - 1)] || 1;
    return t.lastReviewedDaysAgo >= targetInterval && t.currentCycle < 5;
  });

  const masteredTopics = topics.filter((t) => t.currentCycle >= 5);
  const activeTopicsCount = topics.length;

  // Study Advisor highest urgency topic
  const urgentTopic = [...topics].sort((a, b) => {
    const intervalA = EBBINGHAUS_INTERVALS[Math.min(a.currentCycle, EBBINGHAUS_INTERVALS.length - 1)] || 1;
    const intervalB = EBBINGHAUS_INTERVALS[Math.min(b.currentCycle, EBBINGHAUS_INTERVALS.length - 1)] || 1;
    const diffA = a.lastReviewedDaysAgo - intervalA;
    const diffB = b.lastReviewedDaysAgo - intervalB;
    return diffB - diffA;
  })[0];

  // Persian date label
  const todayPersianStr = new Intl.DateTimeFormat('fa-IR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  const handleLaunchTool = (sectionId: string) => {
    if (onSelectTool) {
      onSelectTool(sectionId);
    }
    onNavigate(sectionId);
  };

  return (
    <section id={id} className="py-12 px-6 max-w-6xl mx-auto border-b border-slate-800/80">
      {/* Editorial Kicker & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold tracking-wide">
          <Brain className="w-4 h-4 text-amber-400" />
          <span>میز کار متمرکز دانش‌آموز</span>
          <span aria-hidden="true">·</span>
          <span>سامانه راهبُرد</span>
        </div>

        {/* View mode toggle: clean uncluttered vs full course view */}
        {onToggleViewMode && (
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => onToggleViewMode('focused')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeViewMode === 'focused'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              نمای خلوت (فقط ابزارها)
            </button>
            <button
              onClick={() => onToggleViewMode('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeViewMode === 'all'
                  ? 'bg-slate-800 text-slate-200 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              نمای کامل آموزشی
            </button>
          </div>
        )}
      </div>

      {/* Main Greeting Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 p-6 sm:p-8 mb-8 shadow-xl">
        <div className="absolute top-0 left-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="text-slate-300 font-medium">{todayPersianStr}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <Flame className="w-3.5 h-3.5" />
                <span>زنجیره مطالعه: {streakDays} روز متوالی</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              داشبورد مرکزی و میز کار آرام
            </h1>

            <p className="text-sm text-slate-300 font-light leading-relaxed">
              برای جلوگیری از سردرگمی و پراکندگی ذهنی، تمام فعالیت‌های روزانه در ۳ ابزار حیاتی زیر سازمان‌دهی شده‌اند. ابزار مورد نظرتان را انتخاب کنید و بلافاصله وارد جریان تمرکز شوید.
            </p>
          </div>

          {/* Quick Focus Mode Pill Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleToggleFocusMode}
              className={`flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border font-semibold text-xs transition-all cursor-pointer shadow-sm active:scale-95 ${
                isFocusMode
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-amber-400/20'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <Headphones className={`w-4 h-4 ${isFocusMode ? 'animate-pulse' : ''}`} />
              <span>{isFocusMode ? 'حالت تمرکز عمیق (فعال)' : 'فعال‌سازی حالت تمرکز عمیق'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Key Tools Hero Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* CARD 1: Ebbinghaus Scheduler */}
        <div className="group relative rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-6 flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-amber-500/5">
          <div className="space-y-4">
            {/* Header / Icon */}
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-semibold text-amber-400/90 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-lg">
                فواصل مرور علمی
              </span>
            </div>

            {/* Title & Desc */}
            <div>
              <h2 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                برنامه‌ریزی مرور ابینگهاوس
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                مدیریت خودکار چرخه‌های بازخوانی ۱، ۳، ۱۰ و ۳۰ روز بر اساس منحنی فراموشی برای انتقال به حافظه بلندمدت.
              </p>
            </div>

            {/* Live Stats Box */}
            <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">موعد مرور امروز:</span>
                <span className={`font-bold font-mono px-2 py-0.5 rounded ${
                  dueTopics.length > 0 ? 'bg-amber-400/20 text-amber-300' : 'bg-emerald-500/10 text-emerald-400'
                }`}>
                  {dueTopics.length} مبحث
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">تثبیت‌شده در حافظه بلندمدت:</span>
                <span className="font-semibold text-slate-300">{masteredTopics.length} از {activeTopicsCount} مبحث</span>
              </div>
            </div>
          </div>

          {/* Card Action Button */}
          <div className="pt-6 mt-4 border-t border-slate-800/60 space-y-2">
            <button
              onClick={() => handleLaunchTool('ebbinghaus-scheduler')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-amber-500/15 cursor-pointer active:scale-95"
            >
              <span>ورود به میز کار ابینگهاوس</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                handleLaunchTool('ebbinghaus-scheduler');
                setTimeout(() => {
                  const btn = document.querySelector('[title="ورود به حالت تمام‌صفحه بدون حواس‌پرتی"]') as HTMLButtonElement;
                  if (btn) btn.click();
                }, 180);
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold text-[11px] rounded-lg transition-colors cursor-pointer border border-amber-500/20"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>ورود در حالت تمام‌صفحه (Zen Mode)</span>
            </button>
          </div>
        </div>

        {/* CARD 2: Anti-Procrastination & Focus Toolkit */}
        <div className="group relative rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-6 flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-emerald-500/5">
          <div className="space-y-4">
            {/* Header / Icon */}
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Timer className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-semibold text-emerald-400/90 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-lg">
                شکستن سد شروع
              </span>
            </div>

            {/* Title & Desc */}
            <div>
              <h2 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                ابزار ضد اهمال‌کاری و تمرکز
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                قانون ۵ دقیقه، تایمر پومودورو با ثبت خودکار عادات، خالی‌کردن ذهن (Brain Dump) و صداهای آرامش‌بخش طبیعت.
              </p>
            </div>

            {/* Live Stats Box & Mini Launcher */}
            <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">پرتابگر سریع ۵ دقیقه‌ای:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {Math.floor(quickTimerSeconds / 60)}:{(quickTimerSeconds % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsQuickTimerRunning(!isQuickTimerRunning)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    isQuickTimerRunning
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  <Play className={`w-3 h-3 ${isQuickTimerRunning ? 'hidden' : 'inline'}`} />
                  <span>{isQuickTimerRunning ? 'توقف موقت' : 'شروع سریع ۵ دقیقه'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsQuickTimerRunning(false);
                    setQuickTimerSeconds(300);
                  }}
                  title="بازنشانی تایمر ۵ دقیقه"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card Action Button */}
          <div className="pt-6 mt-4 border-t border-slate-800/60 space-y-2">
            <button
              onClick={() => handleLaunchTool('toolkit')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/15 cursor-pointer active:scale-95"
            >
              <span>ورود به اتاق تمرکز و ابزارها</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                handleLaunchTool('toolkit');
                setTimeout(() => {
                  const btn = document.querySelector('[title="ورود به حالت تمام‌صفحه بدون حواس‌پرتی"]') as HTMLButtonElement;
                  if (btn) btn.click();
                }, 180);
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold text-[11px] rounded-lg transition-colors cursor-pointer border border-emerald-500/20"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>ورود در حالت تمام‌صفحه (Zen Mode)</span>
            </button>
          </div>
        </div>

        {/* CARD 3: Intelligent Study Advisor */}
        <div className="group relative rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 p-6 flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-cyan-500/5">
          <div className="space-y-4">
            {/* Header / Icon */}
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-semibold text-cyan-400/90 bg-cyan-400/10 border border-cyan-400/20 px-2.5 py-1 rounded-lg">
                هوشمندسازی اولویت‌ها
              </span>
            </div>

            {/* Title & Desc */}
            <div>
              <h2 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                مشاور و توصیه‌گر هوشمند
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                تحلیل پایداری حافظه با هوش مصنوعی و مرتب‌سازی مباحث بر اساس ریسک فراموشی تا هیچ سرفصلی از دست نرود.
              </p>
            </div>

            {/* Live Stats Box */}
            <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">بیشترین اولویت بازخوانی:</span>
                <span className="font-semibold text-cyan-300 truncate max-w-[140px]" title={urgentTopic ? `${urgentTopic.subject} - ${urgentTopic.topicName}` : 'ندارد'}>
                  {urgentTopic ? urgentTopic.subject : 'موردی ثبت نشده'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 leading-snug truncate" title={urgentTopic?.topicName}>
                {urgentTopic ? urgentTopic.topicName : 'همه مباحث در وضعیت ایمن قرار دارند'}
              </div>
            </div>
          </div>

          {/* Card Action Button */}
          <div className="pt-6 mt-4 border-t border-slate-800/60">
            <button
              onClick={() => handleLaunchTool('study-advisor')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-500/15 cursor-pointer active:scale-95"
            >
              <span>مشاهده اولویت‌ها و چیدمان برنامه</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Quick Action Navigation Strip (ابزارهای مکمل بدون ایجاد شلوغی) */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-semibold text-white block">
                دسترسی سریع به بخش‌های مکمل
              </span>
              <span className="text-[11px] text-slate-400">
                هر زمان که به تحلیل‌های عمیق‌تر، دوئل دوستانه یا شبیه‌ساز نیاز داشتید
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleLaunchTool('weekly-insight')}
              className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400/30 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
              <span>بینش هفتگی D3</span>
            </button>
            <button
              onClick={() => handleLaunchTool('study-duels')}
              className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400/30 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Swords className="w-3.5 h-3.5 text-amber-400" />
              <span>دوئل مطالعاتی</span>
            </button>
            <button
              onClick={() => handleLaunchTool('badges')}
              className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400/30 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>نشان‌های افتخار</span>
            </button>
            <button
              onClick={() => handleLaunchTool('simulator')}
              className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400/30 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>شبیه‌ساز ابینگهاوس</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
