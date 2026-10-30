import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Calendar,
  Clock,
  Bell,
  BellRing,
  BellOff,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Plus,
  Trash2,
  Download,
  Brain,
  Sparkles,
  Search,
  Filter,
  Check,
  ChevronRight,
  Flame,
  ArrowUpRight,
  BookmarkCheck,
  Volume2,
  VolumeX,
  Play,
  Lightbulb,
  Info,
  CalendarCheck2,
  RefreshCw,
  X,
  BarChart3,
  TrendingUp,
  CheckCheck,
  Undo2,
  Layers,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Swords,
  Compass,
  Cpu
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ComposedChart,
  Line,
  Cell
} from 'recharts';
import { EbbinghausTopicItem } from './DashboardStats';
import { goToSection } from '../shell/navigation';
import { FEATURES } from '../shell/views';

const TOPICS_STORAGE_KEY = 'rahbord_ebbinghaus_topics_queue';
const NOTIF_SETTINGS_KEY = 'rahbord_ebbinghaus_notification_settings';
const WEEKLY_STORAGE_KEY = 'rahbord_weekly_study_data';
const REVIEW_STATS_STORAGE_KEY = 'rahbord_ebbinghaus_review_stats';

// Review vs Forgotten data structure for Ebbinghaus metrics
export interface EbbinghausReviewDataPoint {
  day?: string;
  subject?: string;
  reviewed: number;
  forgotten: number;
  retentionRate: number; // percentage (0-100)
}

export interface EbbinghausReviewStats {
  totalReviewed: number;
  totalForgotten: number;
  weeklyHistory: EbbinghausReviewDataPoint[];
  subjectHistory: EbbinghausReviewDataPoint[];
}

// Initial realistic baseline data for Iranian academic week (شنبه تا جمعه)
export const DEFAULT_REVIEW_STATS: EbbinghausReviewStats = {
  totalReviewed: 52,
  totalForgotten: 13,
  weeklyHistory: [
    { day: 'شنبه', reviewed: 8, forgotten: 2, retentionRate: 80 },
    { day: 'یکشنبه', reviewed: 11, forgotten: 3, retentionRate: 79 },
    { day: 'دوشنبه', reviewed: 7, forgotten: 1, retentionRate: 88 },
    { day: 'سه‌شنبه', reviewed: 10, forgotten: 3, retentionRate: 77 },
    { day: 'چهارشنبه', reviewed: 8, forgotten: 2, retentionRate: 80 },
    { day: 'پنج‌شنبه', reviewed: 5, forgotten: 1, retentionRate: 83 },
    { day: 'جمعه', reviewed: 3, forgotten: 1, retentionRate: 75 }
  ],
  subjectHistory: [
    { subject: 'زیست‌شناسی', reviewed: 16, forgotten: 3, retentionRate: 84 },
    { subject: 'ریاضی و حسابان', reviewed: 12, forgotten: 4, retentionRate: 75 },
    { subject: 'شیمی', reviewed: 10, forgotten: 3, retentionRate: 77 },
    { subject: 'فیزیک', reviewed: 8, forgotten: 2, retentionRate: 80 },
    { subject: 'ادبیات و علوم انسانی', reviewed: 6, forgotten: 1, retentionRate: 86 }
  ]
};

// Helper to determine Persian day of week
export const getPersianDayName = (date: Date = new Date()): string => {
  const dayIndex = date.getDay(); // 0 is Sunday, 6 is Saturday
  const mapping: Record<number, string> = {
    6: 'شنبه',
    0: 'یکشنبه',
    1: 'دوشنبه',
    2: 'سه‌شنبه',
    3: 'چهارشنبه',
    4: 'پنج‌شنبه',
    5: 'جمعه'
  };
  return mapping[dayIndex] || 'شنبه';
};

// Custom Persian Tooltip for Recharts Ebbinghaus Review Chart
const CustomReviewTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0]?.payload as EbbinghausReviewDataPoint;
  if (!data) return null;

  const totalReviews = (data.reviewed || 0) + (data.forgotten || 0);

  return (
    <div className="bg-slate-900/95 border border-slate-700/90 p-3.5 rounded-xl shadow-2xl backdrop-blur-md text-xs space-y-2 text-right min-w-[200px] border-r-4 border-r-amber-400">
      <div className="border-b border-slate-800 pb-1.5 flex items-center justify-between">
        <span className="font-bold text-white text-sm">{label}</span>
        <span className="text-[10px] text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded font-mono">
          پایداری: {data.retentionRate}٪
        </span>
      </div>
      <div className="space-y-1.5 pt-0.5">
        <div className="flex items-center justify-between gap-3 text-emerald-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 shrink-0"></span>
            <span className="font-medium text-slate-200">مرورهای موفق (تثبیت):</span>
          </span>
          <span className="font-bold tabular-nums text-emerald-400">{data.reviewed} نوبت</span>
        </div>
        <div className="flex items-center justify-between gap-3 text-rose-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-400 shrink-0"></span>
            <span className="font-medium text-slate-200">مطالب فراموش‌شده (ریست):</span>
          </span>
          <span className="font-bold tabular-nums text-rose-400">{data.forgotten} نوبت</span>
        </div>
      </div>
      <div className="text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80 flex items-center justify-between">
        <span>مجموع ارزیابی‌های حافظه:</span>
        <span className="text-white font-bold tabular-nums">{totalReviews} مورد</span>
      </div>
    </div>
  );
};

// Standard scientific intervals for Ebbinghaus Spaced Repetition (in days)
// Cycle 1: 1 day (24 hours)
// Cycle 2: 3 days
// Cycle 3: 7 days
// Cycle 4: 15 days
// Cycle 5: 30 days -> Consolidated in long-term memory
export const EBBINGHAUS_INTERVALS = [1, 3, 7, 15, 30];

export const CYCLE_DESCRIPTIONS = [
  { cycle: 1, days: 1, name: 'نوبت ۱ (۲۴ ساعت بعد)', focus: 'تثبیت اولیه و جلوگیری از افت ۸۰٪ حافظه کوتاه مدت' },
  { cycle: 2, days: 3, name: 'نوبت ۲ (۳ روز بعد)', focus: 'تحکیم اتصالات سیناپسی در هیپوکامپ' },
  { cycle: 3, days: 7, name: 'نوبت ۳ (۷ روز بعد)', focus: 'یکپارچه‌سازی شناختی و انتقال به قشر مخ' },
  { cycle: 4, days: 15, name: 'نوبت ۴ (۱۵ روز بعد)', focus: 'تقویت دندریت‌ها و آماده‌سازی برای پایداری بلندمدت' },
  { cycle: 5, days: 30, name: 'نوبت ۵ (۳۰ روز بعد)', focus: 'تثبیت نهایی در نئوکورتکس (تسلط دائمی و بدون فراموشی)' },
];

export const SUBJECT_OPTIONS = [
  'زیست‌شناسی',
  'ریاضی و حسابان',
  'شیمی',
  'فیزیک',
  'ادبیات و علوم انسانی',
  'دین و زندگی',
  'زبان انگلیسی',
  'عربی',
  'زمین‌شناسی',
  'عمومی و مهارتی'
];

export const RETRIEVAL_METHODS = [
  { id: 'blurting', name: 'متد برگه سفید (Blurting)', desc: 'نوشتن تمام فرمول‌ها و نکات کلیدی روی کاغذ سفید از حفظ و مقایسه با کتاب' },
  { id: 'feynman', name: 'تکنیک فاینمن', desc: 'تدریس مفهوم به زبان ساده به یک فرد فرضی یا ضبط صدای خود بدون نگاه به جزوه' },
  { id: 'active_recall_test', name: 'تست پوششی زمان‌دار', desc: 'حل ۳ تا ۵ تست نشان‌دار یا کنکورهای سال‌های گذشته بدون نگاه به پاسخنامه' },
  { id: 'flashcards', name: 'فلش‌کارت لایتنر', desc: 'بازیابی متوالی سوال و جواب مفاهیم فرار' },
  { id: 'mindmap', name: 'رسم نقشه ذهنی ساختاری', desc: 'ترسیم ارتباط بین زیربخش‌های فصل به صورت شاخه‌ای از حافظه' },
];

// Pure Web Audio chime generator
const playAudioFeedback = (type: 'success' | 'alert' | 'reset' = 'success') => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === 'success') {
      // Pleasant rising major triad: C5 (523), E5 (659), G5 (784)
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.09);
        gain.gain.setValueAtTime(0.2, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.35);
      });
    } else if (type === 'alert') {
      // Attention chime (two tone high): A5 (880) then C6 (1046.5)
      [880, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.14);
        gain.gain.setValueAtTime(0.22, now + i * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.14 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.14);
        osc.stop(now + i * 0.14 + 0.4);
      });
    } else {
      // Soft reset tone: E4 (329.63) then C4 (261.63)
      [329.63, 261.63].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        gain.gain.setValueAtTime(0.18, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.3);
      });
    }
  } catch (e) {
    // Audio context may be restricted by browser policy before first interaction
  }
};

interface NotificationSettings {
  enabled: boolean;
  reminderHour: number; // 0 to 23
  reminderMinute?: number; // 0 to 59
  soundEnabled?: boolean;
  lastNotifiedDate?: string;
}

export const EbbinghausScheduler: React.FC = () => {
  // Topics queue from LocalStorage
  const [topics, setTopics] = useState<EbbinghausTopicItem[]>(() => {
    try {
      const saved = localStorage.getItem(TOPICS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading topics from LocalStorage:', e);
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

  // Notification settings from LocalStorage
  const [notifSettings, setNotifSettings] = useState<NotificationSettings>(() => {
    try {
      const saved = localStorage.getItem(NOTIF_SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          enabled: parsed.enabled ?? true,
          reminderHour: parsed.reminderHour ?? 18,
          reminderMinute: parsed.reminderMinute ?? 0,
          soundEnabled: parsed.soundEnabled ?? true,
          lastNotifiedDate: parsed.lastNotifiedDate
        };
      }
    } catch (e) {
      console.error(e);
    }
    return {
      enabled: true,
      reminderHour: 18,
      reminderMinute: 0,
      soundEnabled: true
    };
  });

  // Browser Notification permission state
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  
  // UI Tabs & Filters
  const [activeTab, setActiveTab] = useState<'due_today' | 'upcoming' | 'mastered' | 'all'>('due_today');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals & Panels
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState<boolean>(false);
  const [showExportCSVModal, setShowExportCSVModal] = useState<boolean>(false);
  const [csvExportScope, setCsvExportScope] = useState<'all' | 'due' | 'active' | 'mastered'>('all');
  const [csvReportType, setCsvReportType] = useState<'full' | 'topics' | 'analytics'>('full');
  const [activeToast, setActiveToast] = useState<{ id: string; title: string; message: string; type: 'success' | 'alert' | 'info' } | null>(null);

  // Recharts interactive review analytics state (completed reviews vs forgotten)
  const [reviewStats, setReviewStats] = useState<EbbinghausReviewStats>(() => {
    try {
      const saved = localStorage.getItem(REVIEW_STATS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.totalReviewed === 'number' && Array.isArray(parsed.weeklyHistory)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading review stats:', e);
    }
    return DEFAULT_REVIEW_STATS;
  });

  // Chart configuration: weekly vs subject breakdown, bar vs composed, visibility
  const [chartDimension, setChartDimension] = useState<'weekly' | 'subject'>('weekly');
  const [chartType, setChartType] = useState<'bar' | 'composed'>('bar');
  const [showChartSection, setShowChartSection] = useState<boolean>(true);
  
  // Add Topic Form State
  const [newSubject, setNewSubject] = useState<string>('زیست‌شناسی');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDaysAgo, setNewDaysAgo] = useState<number>(0);
  const [newMethod, setNewMethod] = useState<string>(RETRIEVAL_METHODS[0].name);

  // Time remaining until next daily notification
  const [timeUntilReminder, setTimeUntilReminder] = useState<string>('');

  // Toast helper
  const showToast = (title: string, message: string, type: 'success' | 'alert' | 'info' = 'info') => {
    const id = Date.now().toString();
    setActiveToast({ id, title, message, type });
    if (notifSettings.soundEnabled) {
      playAudioFeedback(type === 'alert' ? 'alert' : 'success');
    }
    setTimeout(() => {
      setActiveToast(prev => (prev?.id === id ? null : prev));
    }, 6000);
  };

  // Check Notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    } else {
      setPermission('unsupported');
    }
  }, []);

  // Listen to cross-component data updates
  useEffect(() => {
    const handleDataUpdated = () => {
      try {
        const savedTopics = localStorage.getItem(TOPICS_STORAGE_KEY);
        if (savedTopics) {
          const parsed = JSON.parse(savedTopics);
          if (Array.isArray(parsed)) setTopics(parsed);
        }
        const savedSettings = localStorage.getItem(NOTIF_SETTINGS_KEY);
        if (savedSettings) {
          setNotifSettings(JSON.parse(savedSettings));
        }
        const savedReviews = localStorage.getItem(REVIEW_STATS_STORAGE_KEY);
        if (savedReviews) {
          const parsedReviews = JSON.parse(savedReviews);
          if (parsedReviews && typeof parsedReviews.totalReviewed === 'number') {
            setReviewStats(parsedReviews);
          }
        }
      } catch (e) {
        console.error('Failed to sync on data update event:', e);
      }
    };

    window.addEventListener('rahbord_data_updated', handleDataUpdated);
    return () => window.removeEventListener('rahbord_data_updated', handleDataUpdated);
  }, []);

  // Persist topics to LocalStorage
  const saveTopics = (newTopics: EbbinghausTopicItem[]) => {
    setTopics(newTopics);
    try {
      localStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(newTopics));
      window.dispatchEvent(new Event('rahbord_data_updated'));
    } catch (e) {
      console.error('Failed to save topics:', e);
    }
  };

  // Persist notification settings to LocalStorage
  const saveNotifSettings = (newSettings: NotificationSettings) => {
    setNotifSettings(newSettings);
    try {
      localStorage.setItem(NOTIF_SETTINGS_KEY, JSON.stringify(newSettings));
      window.dispatchEvent(new Event('rahbord_data_updated'));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  };

  // Persist review stats to LocalStorage
  const saveReviewStats = (newStats: EbbinghausReviewStats) => {
    setReviewStats(newStats);
    try {
      localStorage.setItem(REVIEW_STATS_STORAGE_KEY, JSON.stringify(newStats));
      window.dispatchEvent(new Event('rahbord_data_updated'));
    } catch (e) {
      console.error('Failed to save review stats:', e);
    }
  };

  // Ebbinghaus formula and schedule calculation per topic
  const getTopicScheduleDetails = (topic: EbbinghausTopicItem) => {
    const targetIntervals = [1, 3, 7, 15, 30];
    const targetDays = targetIntervals[Math.min(topic.currentCycle, targetIntervals.length - 1)];
    const daysRemaining = targetDays - topic.lastReviewedDaysAgo;

    // Stability factor S increases with each successful spaced cycle
    // R = e^(-t / S)
    const stability = 1.8 * (1 + topic.currentCycle * 2.3);
    const estimatedRetention = Math.max(
      10,
      Math.min(99, Math.round(100 * Math.exp(-topic.lastReviewedDaysAgo / stability)))
    );

    const isMastered = topic.currentCycle >= 5;
    const isDueToday = !isMastered && daysRemaining <= 0;
    const isDueTomorrow = !isMastered && daysRemaining === 1;

    let statusLabel = '';
    let statusTone: 'urgent' | 'warning' | 'normal' | 'mastered' = 'normal';

    if (isMastered) {
      statusLabel = 'تثبیت دائم در نئوکورتکس (Mastered)';
      statusTone = 'mastered';
    } else if (isDueToday) {
      if (daysRemaining < 0) {
        statusLabel = `عقب افتاده (${Math.abs(daysRemaining)} روز پیش)`;
      } else {
        statusLabel = 'موعد مرور طلایی امروز';
      }
      statusTone = 'urgent';
    } else if (isDueTomorrow) {
      statusLabel = 'موعد فردا';
      statusTone = 'warning';
    } else {
      statusLabel = `${daysRemaining} روز تا مرور بعدی`;
      statusTone = 'normal';
    }

    const currentCycleInfo = CYCLE_DESCRIPTIONS[Math.min(topic.currentCycle, CYCLE_DESCRIPTIONS.length - 1)];

    return {
      targetDays,
      daysRemaining,
      estimatedRetention,
      isMastered,
      isDueToday,
      isDueTomorrow,
      statusLabel,
      statusTone,
      currentCycleInfo
    };
  };

  // Topics with calculations
  const analyzedTopics = useMemo(() => {
    return topics.map(topic => ({
      ...topic,
      schedule: getTopicScheduleDetails(topic)
    }));
  }, [topics]);

  // Statistics
  const stats = useMemo(() => {
    const dueTodayCount = analyzedTopics.filter(t => t.schedule.isDueToday).length;
    const activeCount = analyzedTopics.filter(t => !t.schedule.isMastered).length;
    const masteredCount = analyzedTopics.filter(t => t.schedule.isMastered).length;
    const avgRetention = analyzedTopics.length > 0
      ? Math.round(analyzedTopics.reduce((acc, t) => acc + t.schedule.estimatedRetention, 0) / analyzedTopics.length)
      : 100;

    return {
      dueTodayCount,
      activeCount,
      masteredCount,
      avgRetention
    };
  }, [analyzedTopics]);

  // Filtered list
  const filteredTopics = useMemo(() => {
    return analyzedTopics.filter(item => {
      // Tab filter
      if (activeTab === 'due_today' && !item.schedule.isDueToday) return false;
      if (activeTab === 'upcoming' && (item.schedule.isDueToday || item.schedule.isMastered)) return false;
      if (activeTab === 'mastered' && !item.schedule.isMastered) return false;

      // Subject filter
      if (selectedSubjectFilter !== 'all' && item.subject !== selectedSubjectFilter) return false;

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = item.topicName.toLowerCase().includes(q);
        const matchesSub = item.subject.toLowerCase().includes(q);
        const matchesMethod = item.recommendedMethod.toLowerCase().includes(q);
        if (!matchesName && !matchesSub && !matchesMethod) return false;
      }

      return true;
    });
  }, [analyzedTopics, activeTab, selectedSubjectFilter, searchQuery]);

  // Request browser Notification permission
  const handleRequestPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      showToast('عدم پشتیبانی مرورگر', 'مرورگر شما از Notification API سیستمی پشتیبانی نمی‌کند، اما هشدارهای صوتی و درون‌برنامه‌ای کاملاً فعال هستند.', 'alert');
      return;
    }

    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === 'granted') {
        saveNotifSettings({ ...notifSettings, enabled: true });
        showToast('مجوز نوتیفیکیشن فعال شد!', `اعلان‌های روزانه ابینگهاوس هر روز رأس ساعت ${String(notifSettings.reminderHour).padStart(2, '0')}:${String(notifSettings.reminderMinute || 0).padStart(2, '0')} برای شما ارسال می‌شوند.`, 'success');
        
        // Show test welcome notification
        try {
          new Notification('سامانه زمان‌بندی مرور ابینگهاوس راهبُرد', {
            body: 'سیستم هوشمند اعلان روزانه با موفقیت فعال شد. مباحث موعد مرور به صورت روزانه به شما یادآوری می‌شوند.',
            icon: '/favicon.ico',
            tag: 'ebbinghaus-welcome'
          });
        } catch (e) {
          console.log('Direct notification error:', e);
        }
      } else {
        showToast('دسترسی نوتیفیکیشن رد شد', 'در صورت تمایل، می‌توانید در تنظیمات مرورگر دسترسی به اعلان را فعال نمایید.', 'alert');
      }
    } catch (err) {
      console.error('Error requesting permission:', err);
    }
  };

  // Send an instant test notification
  const handleTriggerTestNotification = () => {
    const dueCount = stats.dueTodayCount;
    const title = '🔔 یادآوری زمان طلایی مرور ابینگهاوس (تست)';
    const body = dueCount > 0
      ? `تعداد ${dueCount} مبحث در لیست امروز شما نیازمند مرور فعال هستند تا از ریزش حافظه جلوگیری شود.`
      : 'هم‌اکنون تمام مباحث شما در وضعیت پایدار هستند! نوبت بعدی فردا بررسی خواهد شد.';

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          tag: 'ebbinghaus-test'
        });
      } catch (e) {
        console.log('Failed to trigger native notification:', e);
      }
    }

    showToast(title, body, dueCount > 0 ? 'alert' : 'success');
  };

  // Background timer to check daily reminder time & countdown calculator
  useEffect(() => {
    const checkReminder = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const todayDateStr = now.toLocaleDateString('fa-IR');

      // Calculate countdown to next reminder
      let reminderDate = new Date();
      reminderDate.setHours(notifSettings.reminderHour, notifSettings.reminderMinute || 0, 0, 0);
      if (reminderDate <= now) {
        reminderDate.setDate(reminderDate.getDate() + 1);
      }
      const diffMs = reminderDate.getTime() - now.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      setTimeUntilReminder(`${diffHrs} ساعت و ${diffMins} دقیقه`);

      // Fire notification if matching time and not notified today
      if (notifSettings.enabled) {
        const targetMin = notifSettings.reminderMinute || 0;
        if (currentHour === notifSettings.reminderHour && Math.abs(currentMinute - targetMin) <= 1) {
          if (notifSettings.lastNotifiedDate !== todayDateStr) {
            const dueTopics = topics.filter(t => getTopicScheduleDetails(t).isDueToday);
            if (dueTopics.length > 0) {
              const summary = dueTopics.map(t => `${t.subject}: ${t.topicName}`).slice(0, 3).join(' | ');
              const notifTitle = `⏰ وقت مرور طلایی ابینگهاوس فرا رسید (${dueTopics.length} مبحث)`;
              const notifBody = `مباحث موعد امروز: ${summary}. با ۱۰ دقیقه مرور فعال، مانع فراموشی شوید.`;

              if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                try {
                  new Notification(notifTitle, {
                    body: notifBody,
                    icon: '/favicon.ico',
                    tag: 'ebbinghaus-daily-reminder'
                  });
                } catch (e) {
                  console.log(e);
                }
              }

              showToast(notifTitle, notifBody, 'alert');
              saveNotifSettings({
                ...notifSettings,
                lastNotifiedDate: todayDateStr
              });
            }
          }
        }
      }
    };

    checkReminder();
    const interval = setInterval(checkReminder, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [notifSettings, topics]);

  // Advance topic to next cycle (Successful recall)
  const handleMarkReviewedSuccess = (topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;

    const nextCycle = topic.currentCycle + 1;
    const isNowMastered = nextCycle >= 5;

    const updated = topics.map(t => {
      if (t.id === topicId) {
        return {
          ...t,
          currentCycle: nextCycle,
          lastReviewedDaysAgo: 0
        };
      }
      return t;
    });

    saveTopics(updated);

    // Also increment weekly reviewed stats in LocalStorage for badges & dashboard
    try {
      const savedWeekly = localStorage.getItem(WEEKLY_STORAGE_KEY);
      if (savedWeekly) {
        const weeklyData = JSON.parse(savedWeekly);
        const todayIndex = (new Date().getDay() + 1) % 7;
        const persianDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
        const todayName = persianDays[todayIndex] || 'شنبه';
        const updatedWeekly = weeklyData.map((w: any) =>
          w.day === todayName
            ? { ...w, reviewedTopics: (w.reviewedTopics || 0) + 1, studyHours: Number(((w.studyHours || 0) + 0.35).toFixed(1)) }
            : w
        );
        localStorage.setItem(WEEKLY_STORAGE_KEY, JSON.stringify(updatedWeekly));
      }
    } catch (e) {
      console.error(e);
    }

    // Update Ebbinghaus review stats for Recharts
    const currentPersianDay = getPersianDayName(new Date());
    setReviewStats(prev => {
      const nextTotalReviewed = prev.totalReviewed + 1;
      const nextWeekly = prev.weeklyHistory.map(item => {
        if (item.day === currentPersianDay) {
          const rev = item.reviewed + 1;
          const forg = item.forgotten;
          return {
            ...item,
            reviewed: rev,
            retentionRate: Math.round((rev / (rev + forg)) * 100)
          };
        }
        return item;
      });

      let foundSub = false;
      const nextSubjects = prev.subjectHistory.map(subItem => {
        if (subItem.subject === topic.subject) {
          foundSub = true;
          const rev = subItem.reviewed + 1;
          const forg = subItem.forgotten;
          return {
            ...subItem,
            reviewed: rev,
            retentionRate: Math.round((rev / (rev + forg)) * 100)
          };
        }
        return subItem;
      });

      if (!foundSub) {
        nextSubjects.push({
          subject: topic.subject,
          reviewed: 1,
          forgotten: 0,
          retentionRate: 100
        });
      }

      const updatedStats: EbbinghausReviewStats = {
        totalReviewed: nextTotalReviewed,
        totalForgotten: prev.totalForgotten,
        weeklyHistory: nextWeekly,
        subjectHistory: nextSubjects
      };

      try {
        localStorage.setItem(REVIEW_STATS_STORAGE_KEY, JSON.stringify(updatedStats));
      } catch (err) {
        console.error(err);
      }

      return updatedStats;
    });

    if (isNowMastered) {
      showToast('🏆 تبریک! تثبیت کامل در حافظه بلندمدت', `مبحث «${topic.topicName}» پس از ۵ نوبت مرور فاصله‌دار، با موفقیت وارد حافظه دائمی نئوکورتکس شد.`, 'success');
    } else {
      const nextDays = EBBINGHAUS_INTERVALS[Math.min(nextCycle, EBBINGHAUS_INTERVALS.length - 1)];
      showToast('✅ مرور فعال با موفقیت ثبت شد', `مبحث «${topic.topicName}» به نوبت ${nextCycle + 1} ارتقا یافت. موعد مرور بعدی: ${nextDays} روز دیگر.`, 'success');
    }
  };

  // Failed recall - Intelligent algorithmic rollback to prevent permanent forgetting
  const handleMarkRecallFailed = (topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;

    // Roll back cycle to 1 (interval 1 day) or reduce by 1
    const newCycle = Math.max(0, topic.currentCycle - 1);
    const updated = topics.map(t => {
      if (t.id === topicId) {
        return {
          ...t,
          currentCycle: newCycle,
          lastReviewedDaysAgo: 0
        };
      }
      return t;
    });

    saveTopics(updated);
    if (notifSettings.soundEnabled) {
      playAudioFeedback('reset');
    }

    // Update Ebbinghaus review stats for Recharts (increment forgotten counter)
    const currentPersianDay = getPersianDayName(new Date());
    setReviewStats(prev => {
      const nextTotalForgotten = prev.totalForgotten + 1;
      const nextWeekly = prev.weeklyHistory.map(item => {
        if (item.day === currentPersianDay) {
          const rev = item.reviewed;
          const forg = item.forgotten + 1;
          return {
            ...item,
            forgotten: forg,
            retentionRate: Math.round((rev / (rev + forg)) * 100)
          };
        }
        return item;
      });

      let foundSub = false;
      const nextSubjects = prev.subjectHistory.map(subItem => {
        if (subItem.subject === topic.subject) {
          foundSub = true;
          const rev = subItem.reviewed;
          const forg = subItem.forgotten + 1;
          return {
            ...subItem,
            forgotten: forg,
            retentionRate: Math.round((rev / (rev + forg)) * 100)
          };
        }
        return subItem;
      });

      if (!foundSub) {
        nextSubjects.push({
          subject: topic.subject,
          reviewed: 0,
          forgotten: 1,
          retentionRate: 0
        });
      }

      const updatedStats: EbbinghausReviewStats = {
        totalReviewed: prev.totalReviewed,
        totalForgotten: nextTotalForgotten,
        weeklyHistory: nextWeekly,
        subjectHistory: nextSubjects
      };

      try {
        localStorage.setItem(REVIEW_STATS_STORAGE_KEY, JSON.stringify(updatedStats));
      } catch (err) {
        console.error(err);
      }

      return updatedStats;
    });

    showToast(
      '🔄 چرخه مرور ریست شد (بازسازی سیناپسی)',
      `مبحث «${topic.topicName}» برای بازیابی مجدد به چرخه نوبت ${newCycle + 1} برگشت داده شد تا از فراموشی دائم جلوگیری شود. فردا در اولین پارت مطالعه آن را مرور کنید.`,
      'info'
    );
  };

  // Quick test / simulation actions for the Recharts interactive card
  const handleSimulateReviewSuccess = () => {
    const currentPersianDay = getPersianDayName(new Date());
    setReviewStats(prev => {
      const nextWeekly = prev.weeklyHistory.map(item => {
        if (item.day === currentPersianDay) {
          const rev = item.reviewed + 1;
          const forg = item.forgotten;
          return { ...item, reviewed: rev, retentionRate: Math.round((rev / (rev + forg)) * 100) };
        }
        return item;
      });

      const nextSubjects = prev.subjectHistory.map((s, idx) => {
        if (idx === 0) {
          const rev = s.reviewed + 1;
          const forg = s.forgotten;
          return { ...s, reviewed: rev, retentionRate: Math.round((rev / (rev + forg)) * 100) };
        }
        return s;
      });

      const updated: EbbinghausReviewStats = {
        totalReviewed: prev.totalReviewed + 1,
        totalForgotten: prev.totalForgotten,
        weeklyHistory: nextWeekly,
        subjectHistory: nextSubjects
      };
      saveReviewStats(updated);
      return updated;
    });
    if (notifSettings.soundEnabled) playAudioFeedback('success');
    showToast('مرور موفق ثبت شد (+۱)', 'یک مرور موفق جدید در آمار نمودار و حافظه محلی ذخیره شد.', 'success');
  };

  const handleSimulateRecallForgotten = () => {
    const currentPersianDay = getPersianDayName(new Date());
    setReviewStats(prev => {
      const nextWeekly = prev.weeklyHistory.map(item => {
        if (item.day === currentPersianDay) {
          const rev = item.reviewed;
          const forg = item.forgotten + 1;
          return { ...item, forgotten: forg, retentionRate: Math.round((rev / (rev + forg)) * 100) };
        }
        return item;
      });

      const nextSubjects = prev.subjectHistory.map((s, idx) => {
        if (idx === 0) {
          const rev = s.reviewed;
          const forg = s.forgotten + 1;
          return { ...s, forgotten: forg, retentionRate: Math.round((rev / (rev + forg)) * 100) };
        }
        return s;
      });

      const updated: EbbinghausReviewStats = {
        totalReviewed: prev.totalReviewed,
        totalForgotten: prev.totalForgotten + 1,
        weeklyHistory: nextWeekly,
        subjectHistory: nextSubjects
      };
      saveReviewStats(updated);
      return updated;
    });
    if (notifSettings.soundEnabled) playAudioFeedback('reset');
    showToast('مطلب فراموش‌شده ثبت شد (+۱)', 'یک مورد فراموشی در آمار نمودار جهت ردیابی الگوریتمی ذخیره شد.', 'alert');
  };

  const handleResetChartStats = () => {
    saveReviewStats(DEFAULT_REVIEW_STATS);
    showToast('بازنشانی آمار نمودار', 'داده‌های نمودار مرورها به مقادیر اولیه بازنشانی شدند.', 'info');
  };

  // Snooze topic by 1 day (give leeway if student is busy today)
  const handleSnoozeTopic = (topicId: string) => {
    const updated = topics.map(t => {
      if (t.id === topicId) {
        return {
          ...t,
          lastReviewedDaysAgo: Math.max(0, t.lastReviewedDaysAgo - 1)
        };
      }
      return t;
    });

    saveTopics(updated);
    showToast('⏰ موعد مرور ۲۴ ساعت به تعویق افتاد', 'مبحث مورد نظر فردا مجدداً در لیست مرورهای روزانه ظاهر خواهد شد.', 'info');
  };

  // Delete topic
  const handleDeleteTopic = (topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    const updated = topics.filter(t => t.id !== topicId);
    saveTopics(updated);
    showToast('حذف شد', `مبحث «${topic?.topicName || ''}» از برنامه مرور حذف شد.`, 'info');
  };

  // Add new topic handler
  const handleAddNewTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('خطا', 'لطفاً عنوان مبحث را وارد کنید.', 'alert');
      return;
    }

    const newItem: EbbinghausTopicItem = {
      id: 'topic_' + Date.now(),
      subject: newSubject,
      topicName: newTitle.trim(),
      lastReviewedDaysAgo: Number(newDaysAgo),
      currentCycle: 0,
      recommendedMethod: newMethod
    };

    saveTopics([newItem, ...topics]);
    setNewTitle('');
    setShowAddModal(false);
    showToast('مبحث جدید اضافه شد', `مبحث «${newItem.topicName}» به جدول زمان‌بندی ابینگهاوس افزوده شد.`, 'success');
  };

  // Generate and download .ICS calendar file for Google Calendar / Apple Calendar
  const handleExportICalendar = () => {
    const now = new Date();
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Rahbord Study System//Ebbinghaus Review Scheduler//FA',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:برنامه مرورهای ابینگهاوس راهبُرد',
      'X-WR-TIMEZONE:Asia/Tehran'
    ];

    topics.forEach((topic) => {
      const sched = getTopicScheduleDetails(topic);
      if (sched.isMastered) return;

      const reviewDate = new Date();
      reviewDate.setDate(reviewDate.getDate() + Math.max(0, sched.daysRemaining));
      reviewDate.setHours(notifSettings.reminderHour, notifSettings.reminderMinute || 0, 0, 0);

      const endDate = new Date(reviewDate.getTime() + 25 * 60 * 1000); // 25 min pomodoro

      const formatDateICS = (d: Date) => {
        return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      const uid = `ebbinghaus-${topic.id}-${Date.now()}@rahbord.app`;
      const summary = `مرور ابینگهاوس: ${topic.subject} (${topic.topicName})`;
      const description = `نوبت مرور: ${sched.currentCycleInfo.name}\\nروش پیشنهادی: ${topic.recommendedMethod}\\nهدف: ${sched.currentCycleInfo.focus}`;

      icsContent.push(
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${formatDateICS(now)}`,
        `DTSTART:${formatDateICS(reviewDate)}`,
        `DTEND:${formatDateICS(endDate)}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        'STATUS:CONFIRMED',
        'BEGIN:VALARM',
        'TRIGGER:-PT15M',
        'ACTION:DISPLAY',
        'DESCRIPTION:یادآوری مرور طلایی ابینگهاوس',
        'END:VALARM',
        'END:VEVENT'
      );
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ebbinghaus-reviews-schedule.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('تقویم با موفقیت صادر شد', 'فایل ebbinghaus-reviews-schedule.ics دانلود شد. می‌توانید آن را در Google Calendar یا تقویم گوشی خود وارد کنید.', 'success');
  };

  // Export Ebbinghaus learning history and review schedule as CSV for offline analysis
  const handleExportCSV = (
    type: 'full' | 'topics' | 'analytics' = 'full',
    scope: 'all' | 'due' | 'active' | 'mastered' = 'all'
  ) => {
    try {
      const now = new Date();
      const persianDate = now.toLocaleDateString('fa-IR');
      const timeStr = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });

      // CSV cell escaping helper: wraps with quotes and doubles internal double quotes
      const escapeCell = (val: any): string => {
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      // Filter topics based on scope
      const targetTopics = analyzedTopics.filter(item => {
        if (scope === 'due') return item.schedule.isDueToday;
        if (scope === 'active') return !item.schedule.isMastered;
        if (scope === 'mastered') return item.schedule.isMastered;
        return true;
      });

      const csvLines: string[] = [];

      // 1. Full or Topics: Add Metadata & Topics Table
      if (type === 'full' || type === 'topics') {
        csvLines.push(escapeCell('سامانه مدیریت یادگیری راهبُرد - گزارش پیشرفت مرورهای فاصله‌دار ابینگهاوس (نسخه آفلاین)'));
        csvLines.push(`${escapeCell('تاریخ صدور گزارش:')},${escapeCell(persianDate)},${escapeCell('ساعت:')},${escapeCell(timeStr)},${escapeCell('تعداد ردیف‌های گزارش:')},${escapeCell(targetTopics.length)}`);
        csvLines.push(`${escapeCell('موعد مرور امروز:')},${escapeCell(stats.dueTodayCount)},${escapeCell('در حال مرور:')},${escapeCell(stats.activeCount)},${escapeCell('تثبیت دائم (Mastered):')},${escapeCell(stats.masteredCount)},${escapeCell('میانگین ماندگاری حافظه:')},${escapeCell(`${stats.avgRetention}%`)}`);
        csvLines.push(''); // Blank line separator

        // Topics Table Header
        const topicHeaders = [
          'ردیف',
          'شناسه مبحث',
          'نام مبحث',
          'درس مربوطه',
          'نوبت چرخه مرور',
          'عنوان مرحله ابینگهاوس',
          'فاصله استاندارد (روز)',
          'روزهای گذشته از آخرین مرور',
          'وضعیت موعد مرور',
          'روزهای باقی‌مانده تا موعد',
          'تاریخ تخمینی موعد بعدی (شمسی)',
          'درصد تخمینی ماندگاری حافظه',
          'وضعیت تثبیت دائم',
          'روش بازیابی فعال پیشنهادی',
          'هدف علمی و روانشناختی مرحله'
        ];
        csvLines.push(topicHeaders.map(escapeCell).join(','));

        // Rows
        targetTopics.forEach((t, idx) => {
          let nextReviewDateFa = 'امروز';
          if (t.schedule.isMastered) {
            nextReviewDateFa = 'تثبیت دائم (اتمام چرخه)';
          } else if (t.schedule.daysRemaining > 0) {
            const target = new Date();
            target.setDate(target.getDate() + t.schedule.daysRemaining);
            nextReviewDateFa = target.toLocaleDateString('fa-IR');
          } else if (t.schedule.daysRemaining < 0) {
            nextReviewDateFa = `گذشته (${Math.abs(t.schedule.daysRemaining)} روز تأخیر)`;
          }

          const row = [
            idx + 1,
            t.id,
            t.topicName,
            t.subject,
            `نوبت ${t.currentCycle + 1} از ۵`,
            t.schedule.currentCycleInfo.name,
            t.schedule.targetDays,
            t.lastReviewedDaysAgo,
            t.schedule.statusLabel,
            t.schedule.daysRemaining <= 0 ? 0 : t.schedule.daysRemaining,
            nextReviewDateFa,
            `${t.schedule.estimatedRetention}%`,
            t.schedule.isMastered ? 'بله (تثبیت دائم)' : 'خیر (در حال تثبیت)',
            t.recommendedMethod,
            t.schedule.currentCycleInfo.focus
          ];
          csvLines.push(row.map(escapeCell).join(','));
        });

        csvLines.push('');
      }

      // 2. Full or Analytics: Add Analytics Tables
      if (type === 'full' || type === 'analytics') {
        if (type === 'full') {
          csvLines.push(escapeCell('=== بخش تحلیلی اثربخشی مرورها و مطالب فراموش‌شده (Recharts Data) ==='));
          csvLines.push(`${escapeCell('مجموع کل مرورهای موفق:')},${escapeCell(reviewStats.totalReviewed)},${escapeCell('مجموع کل مطالب فراموش‌شده:')},${escapeCell(reviewStats.totalForgotten)},${escapeCell('نرخ پایداری کل:')},${escapeCell(`${Math.round((reviewStats.totalReviewed / Math.max(1, reviewStats.totalReviewed + reviewStats.totalForgotten)) * 100)}%`)}`);
          csvLines.push('');
        }

        // Weekly Breakdown Table
        csvLines.push(escapeCell('جدول ۱: روند هفتگی مرورها در برابر فراموشی (شنبه تا جمعه)'));
        const weeklyHeaders = ['روز هفته', 'مرورهای موفق (تثبیت)', 'مطالب فراموش‌شده (ریست)', 'نرخ پایداری حافظه (درصد)'];
        csvLines.push(weeklyHeaders.map(escapeCell).join(','));

        reviewStats.weeklyHistory.forEach(w => {
          csvLines.push([
            w.day,
            w.reviewed,
            w.forgotten,
            `${w.retentionRate}%`
          ].map(escapeCell).join(','));
        });

        csvLines.push('');

        // Subject Breakdown Table
        csvLines.push(escapeCell('جدول ۲: عملکرد تفکیکی و نرخ بقای حافظه بر اساس دروس'));
        const subjectHeaders = ['درس / رشته', 'مرورهای موفق (تثبیت)', 'مطالب فراموش‌شده (ریست)', 'نرخ پایداری حافظه (درصد)'];
        csvLines.push(subjectHeaders.map(escapeCell).join(','));

        reviewStats.subjectHistory.forEach(s => {
          csvLines.push([
            s.subject,
            s.reviewed,
            s.forgotten,
            `${s.retentionRate}%`
          ].map(escapeCell).join(','));
        });
      }

      // Prepend UTF-8 BOM (\uFEFF) so Excel and all spreadsheet tools render Persian properly
      const csvString = '\uFEFF' + csvLines.join('\r\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const dateISO = now.toISOString().split('T')[0];
      const filename = type === 'analytics'
        ? `ebbinghaus_analytics_${dateISO}.csv`
        : type === 'topics'
        ? `ebbinghaus_topics_${dateISO}.csv`
        : `ebbinghaus_review_history_${dateISO}.csv`;

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(
        'فایل CSV با موفقیت استخراج شد',
        `فایل «${filename}» با انکودینگ استاندارد UTF-8 دانلود شد و برای تحلیل آفلاین در اکسل آماده است.`,
        'success'
      );
    } catch (err) {
      console.error('Error exporting CSV:', err);
      showToast('خطا در دانلود CSV', 'متأسفانه ایجاد فایل اکسل/CSV با خطا مواجه شد.', 'alert');
    }
  };

  return (
    <section id="ebbinghaus-scheduler" className="py-20 px-6 max-w-6xl mx-auto border-t border-slate-800/80 scroll-mt-20">
      {/* Toast Notification Container */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className={`p-4 rounded-xl border shadow-2xl backdrop-blur-xl flex items-start gap-3 ${
            activeToast.type === 'success'
              ? 'bg-slate-900/95 border-emerald-500/40 text-emerald-300'
              : activeToast.type === 'alert'
              ? 'bg-slate-900/95 border-amber-500/40 text-amber-300'
              : 'bg-slate-900/95 border-cyan-500/40 text-cyan-300'
          }`}>
            <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
              activeToast.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : activeToast.type === 'alert' ? 'bg-amber-500/10 text-amber-400' : 'bg-cyan-500/10 text-cyan-400'
            }`}>
              {activeToast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : activeToast.type === 'alert' ? <BellRing className="w-5 h-5" /> : <Info className="w-5 h-5" />}
            </div>
            <div className="flex-1 text-right text-xs">
              <h4 className="font-bold text-white text-sm mb-1">{activeToast.title}</h4>
              <p className="text-slate-300 leading-relaxed">{activeToast.message}</p>
            </div>
            <button
              onClick={() => setActiveToast(null)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold tracking-wide">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>الگوریتم هوشمند بازیابی فعال</span>
            <span aria-hidden="true">/</span>
            <span>زمان‌بندی مرورهای طلایی ابینگهاوس</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 border border-slate-700/80 hover:border-amber-400/50 text-slate-200 hover:text-white transition-all cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>تنظیمات اعلان روزانه</span>
              {notifSettings.enabled && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>

            <button
              onClick={handleExportICalendar}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 border border-slate-700/80 hover:border-cyan-400/50 text-slate-200 hover:text-white transition-all cursor-pointer"
              title="خروجی برای گوگل کلندر و تقویم گوشی"
            >
              <CalendarCheck2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>خروجی تقویم (ICS.)</span>
            </button>

            <button
              onClick={() => setShowExportCSVModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 border border-slate-700/80 hover:border-emerald-400/50 text-slate-200 hover:text-white transition-all cursor-pointer group"
              title="دانلود پیشرفت و جدول زمان‌بندی مرورهای ابینگهاوس در قالب فایل اکسل/CSV برای استفاده آفلاین"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>خروجی CSV (آفلاین)</span>
            </button>

            {FEATURES.duels && (

            <button
              onClick={() => {
                goToSection('study-duels');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 transition-all cursor-pointer"
              title="ورود به میدان دوئل‌های مطالعاتی و چالش هم‌کلاسی"
            >
              <Swords className="w-3.5 h-3.5 text-amber-400" />
              <span>دوئل مرور ⚔️</span>
            </button>
              )}

            <button
              onClick={() => {
                goToSection('study-advisor');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 transition-all cursor-pointer"
              title="تحلیل منحنی زوال و چیدمان هوشمند اولویت‌های مرور"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>مشاور اولویت‌ها 🧭</span>
            </button>

            <button
              onClick={() => {
                goToSection('adaptive-scheduler');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 transition-all cursor-pointer"
              title="تنظیم فواصل تطبیقی و توازن بار شناختی برای جلوگیری از خستگی ذهنی"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>تکرار تطبیقی ⚙️</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all shadow-sm shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن مبحث جدید</span>
            </button>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          ابزار زمان‌بندی مرور مطالب با سیستم اعلان روزانه
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
          فرمول فاصله زمانی ابینگهاوس (۲۴ ساعت، ۳ روز، ۷ روز، ۱۵ روز و ۳۰ روز) مانع از ریزش ۸۰ درصدی آموخته‌ها می‌شود. 
          این ابزار زمان دقیق مرور هر مطلب را ردیابی کرده و در ساعت مشخص روزانه به شما هشدار می‌دهد.
        </p>
      </div>

      {/* Daily Notification Control Panel / Drawer */}
      <div className={`mb-8 p-5 rounded-2xl border transition-all duration-300 ${
        showSettingsDrawer
          ? 'bg-slate-900/90 border-amber-500/40 shadow-xl shadow-amber-500/5 block'
          : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                {notifSettings.enabled ? <BellRing className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              </div>
              <h3 className="text-base font-bold text-white">
                سیستم اعلان‌های روزانه یادآوری مرور
              </h3>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                permission === 'granted'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : permission === 'denied'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              }`}>
                {permission === 'granted' ? 'مجوز مرورگر فعال' : permission === 'denied' ? 'مسدود در مرورگر (هشدار صوتی فعال)' : 'نیاز به تایید مجوز مرورگر'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
              هر روز رأس ساعت تنظیمی، مباحث موعد مرور با اعلان سیستمی و زنگ هشدار شناختی یادآوری می‌شوند تا در زمان طلایی قبل از فراموشی بازیابی شوند.
            </p>
          </div>

          {/* Quick Notification Settings */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Daily Enable Toggle */}
            <button
              onClick={() => {
                const nextState = !notifSettings.enabled;
                saveNotifSettings({ ...notifSettings, enabled: nextState });
                showToast(
                  nextState ? 'اعلان روزانه فعال شد' : 'اعلان روزانه متوقف شد',
                  nextState ? `هر روز رأس ساعت ${String(notifSettings.reminderHour).padStart(2, '0')}:${String(notifSettings.reminderMinute || 0).padStart(2, '0')} یادآوری دریافت خواهید کرد.` : 'یادآوری‌های خودکار متوقف شدند.',
                  nextState ? 'success' : 'info'
                );
              }}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                notifSettings.enabled
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {notifSettings.enabled ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <BellOff className="w-4 h-4" />}
              <span>{notifSettings.enabled ? 'یادآوری خودکار: روشن' : 'یادآوری خودکار: خاموش'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                const nextSound = !notifSettings.soundEnabled;
                saveNotifSettings({ ...notifSettings, soundEnabled: nextSound });
                if (nextSound) playAudioFeedback('success');
              }}
              className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                notifSettings.soundEnabled
                  ? 'bg-slate-800 border-slate-700 text-amber-400 hover:border-amber-400/50'
                  : 'bg-slate-800/60 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
              title={notifSettings.soundEnabled ? 'صدای هشدار فعال است' : 'بی‌صدا'}
            >
              {notifSettings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Test Notification Button */}
            <button
              onClick={handleTriggerTestNotification}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-amber-400" />
              <span>تست هشدار هم‌اکنون</span>
            </button>

            {/* Request Browser Permission if not granted */}
            {permission !== 'granted' && permission !== 'unsupported' && (
              <button
                onClick={handleRequestPermission}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/40 text-amber-300 transition-colors cursor-pointer animate-pulse"
              >
                <span>فعال‌سازی نوتیفیکیشن سیستم</span>
              </button>
            )}
          </div>
        </div>

        {/* Extended Setting Options (Hour selection & Presets) */}
        {showSettingsDrawer && (
          <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Time Picker & Presets */}
            <div className="space-y-3">
              <label className="block text-slate-300 font-semibold">
                ساعت یادآوری روزانه (ساعت و دقیقه):
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-700">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <select
                    value={notifSettings.reminderHour}
                    onChange={(e) => {
                      saveNotifSettings({ ...notifSettings, reminderHour: Number(e.target.value) });
                    }}
                    className="bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer"
                  >
                    {Array.from({ length: 24 }).map((_, h) => (
                      <option key={h} value={h} className="bg-slate-900 text-white">
                        ساعت {String(h).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <span className="text-slate-500">:</span>
                  <select
                    value={notifSettings.reminderMinute || 0}
                    onChange={(e) => {
                      saveNotifSettings({ ...notifSettings, reminderMinute: Number(e.target.value) });
                    }}
                    className="bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer"
                  >
                    {[0, 15, 30, 45].map((m) => (
                      <option key={m} value={m} className="bg-slate-900 text-white">
                        {String(m).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>

                {timeUntilReminder && (
                  <span className="text-[11px] text-slate-400">
                    اعلان بعدی در حدود <strong className="text-amber-300 font-bold">{timeUntilReminder}</strong>
                  </span>
                )}
              </div>

              {/* Study Routine Presets */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-slate-400 text-[11px]">ساعت‌های پیشنهادی:</span>
                {[
                  { label: 'صبح زود (۰۸:۰۰)', h: 8, m: 0 },
                  { label: 'پس از مدرسه (۱۵:۳۰)', h: 15, m: 30 },
                  { label: 'عصر طلایی (۱۸:۰۰)', h: 18, m: 0 },
                  { label: 'پارت شب (۲۱:۳۰)', h: 21, m: 30 }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      saveNotifSettings({ ...notifSettings, reminderHour: preset.h, reminderMinute: preset.m });
                      showToast('ساعت یادآوری ذخیره شد', `ساعت اعلان روزانه روی ${preset.label} تنظیم گردید.`, 'success');
                    }}
                    className={`px-2 py-1 rounded-lg text-[11px] border transition-colors cursor-pointer ${
                      notifSettings.reminderHour === preset.h && (notifSettings.reminderMinute || 0) === preset.m
                        ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scientific Explanation */}
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>بهترین زمان برای مرور روزانه چه موقع است؟</span>
              </div>
              <p>
                مرور ابینگهاوس نباید همزمان با مطالعه مباحث جدید باشد. بهترین زمان، در پایان پارت مطالعه عصر یا قبل از استراحت شبانه است تا مغز در فاز خواب REM سیناپس‌های مرتبط را تثبیت و کدگذاری کند.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Metric Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Metric 1: Due Today */}
        <div className={`p-4 rounded-xl border transition-all ${
          stats.dueTodayCount > 0
            ? 'bg-rose-500/5 border-rose-500/30'
            : 'bg-slate-900/40 border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">موعد مرور امروز</span>
            <AlertTriangle className={`w-4 h-4 ${stats.dueTodayCount > 0 ? 'text-rose-400' : 'text-slate-500'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black tabular-nums ${stats.dueTodayCount > 0 ? 'text-rose-400' : 'text-white'}`}>
              {stats.dueTodayCount}
            </span>
            <span className="text-xs text-slate-400">مبحث</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {stats.dueTodayCount > 0 ? 'نیازمند بازیابی فوری قبل از افت حافظه' : 'تمام مرورهای امروز انجام شده‌اند'}
          </p>
        </div>

        {/* Metric 2: Active Repetitions */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">در چرخه فاصله‌دار</span>
            <RefreshCw className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-400 tabular-nums">
              {stats.activeCount}
            </span>
            <span className="text-xs text-slate-400">مبحث فعال</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            در فاز نوبت‌های ۱ تا ۴ الگوریتم
          </p>
        </div>

        {/* Metric 3: Mastered Permanently */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">تثبیت دائم (Mastered)</span>
            <BookmarkCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 tabular-nums">
              {stats.masteredCount}
            </span>
            <span className="text-xs text-slate-400">مبحث</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            پایداری تضمین‌شده در نئوکورتکس
          </p>
        </div>

        {/* Metric 4: Average Retention */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">میانگین ماندگاری کل</span>
            <Brain className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-cyan-400 tabular-nums">
              {stats.avgRetention}٪
            </span>
            <span className="text-xs text-slate-400">شاخص پایداری</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            محاسبه ریاضی منحنی ابینگهاوس
          </p>
        </div>
      </div>

      {/* Interactive Recharts Section: Reviewed vs Forgotten */}
      <div className="mb-10 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm transition-all duration-300">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>نمودار تحلیلی اثربخشی مرورها: دفعات مرور در مقابل مطالب فراموش‌شده</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-normal">
                  تعاملی و متصل به LocalStorage
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              نمایش عینی نبرد بازیابی فعال با منحنی فراموشی ابینگهاوس؛ هر کلیک روی «مرور شد» یا «فراموش شده بود» مستقیماً در این نمودار ثبت می‌گردد.
            </p>
          </div>

          {/* Interactive Controls & View Switches */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Dimension Toggle: Weekly vs Subject */}
            <div className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setChartDimension('weekly')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  chartDimension === 'weekly'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                روند روزهای هفته
              </button>
              <button
                onClick={() => setChartDimension('subject')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  chartDimension === 'subject'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                تفکیک بر اساس دروس
              </button>
            </div>

            {/* Chart Type Toggle: Bar vs Composed */}
            <div className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setChartType('bar')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  chartType === 'bar'
                    ? 'bg-slate-800 text-amber-300 font-bold border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="نمودار ستونی مقایسه‌ای"
              >
                ستون‌های مجزا
              </button>
              <button
                onClick={() => setChartType('composed')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  chartType === 'composed'
                    ? 'bg-slate-800 text-amber-300 font-bold border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="ترکیبی با خط نرخ پایداری حافظه"
              >
                ترکیبی با نرخ بقا
              </button>
            </div>

            {/* CSV Chart Export Button */}
            <button
              onClick={() => handleExportCSV('analytics')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors cursor-pointer"
              title="خروجی آفلاین CSV از داده‌های تحلیلی مرور و فراموشی"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">خروجی CSV نمودار</span>
            </button>

            {/* Collapse / Expand Toggle */}
            <button
              onClick={() => setShowChartSection(!showChartSection)}
              className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={showChartSection ? 'بستن نمودار' : 'نمایش نمودار'}
            >
              {showChartSection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {showChartSection && (
          <div className="mt-5 space-y-6">
            {/* KPI Badges Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-emerald-500/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">مرورهای موفق (تثبیت)</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-emerald-400 tabular-nums">
                      {reviewStats.totalReviewed}
                    </span>
                    <span className="text-[10px] text-slate-500">نوبت</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-rose-500/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">مطالب فراموش‌شده</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-rose-400 tabular-nums">
                      {reviewStats.totalForgotten}
                    </span>
                    <span className="text-[10px] text-slate-500">نیاز به ریست</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-amber-500/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">نرخ کلی بقای حافظه</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-amber-400 tabular-nums">
                      {Math.round((reviewStats.totalReviewed / (reviewStats.totalReviewed + reviewStats.totalForgotten || 1)) * 100)}٪
                    </span>
                    <span className="text-[10px] text-slate-500">موفقیت بازیابی</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-cyan-500/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">نسبت پایداری به فراموشی</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-cyan-400 tabular-nums">
                      {((reviewStats.totalReviewed / (reviewStats.totalForgotten || 1))).toFixed(1)}x
                    </span>
                    <span className="text-[10px] text-slate-500">برابر پیروزی بر افت</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recharts Canvas */}
            <div className="w-full h-72 sm:h-80 bg-slate-950/40 rounded-xl p-2 border border-slate-800/80">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart
                    data={chartDimension === 'weekly' ? reviewStats.weeklyHistory : reviewStats.subjectHistory}
                    margin={{ top: 20, right: 10, left: -15, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                    <XAxis
                      dataKey={chartDimension === 'weekly' ? 'day' : 'subject'}
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      dy={8}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomReviewTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} />
                    <Bar
                      name="مرورهای موفق (تثبیت)"
                      dataKey="reviewed"
                      fill="#10b981"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={40}
                    />
                    <Bar
                      name="مطالب فراموش‌شده (ریست)"
                      dataKey="forgotten"
                      fill="#f43f5e"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                ) : (
                  <ComposedChart
                    data={chartDimension === 'weekly' ? reviewStats.weeklyHistory : reviewStats.subjectHistory}
                    margin={{ top: 20, right: 10, left: -15, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                    <XAxis
                      dataKey={chartDimension === 'weekly' ? 'day' : 'subject'}
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      dy={8}
                    />
                    <YAxis
                      yAxisId="count"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <YAxis
                      yAxisId="rate"
                      orientation="left"
                      stroke="#f59e0b"
                      fontSize={10}
                      domain={[0, 100]}
                      unit="٪"
                    />
                    <Tooltip content={<CustomReviewTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} />
                    <Bar
                      yAxisId="count"
                      name="مرورهای موفق (تثبیت)"
                      dataKey="reviewed"
                      fill="#10b981"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={34}
                    />
                    <Bar
                      yAxisId="count"
                      name="مطالب فراموش‌شده (ریست)"
                      dataKey="forgotten"
                      fill="#f43f5e"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={34}
                    />
                    <Line
                      yAxisId="rate"
                      name="نرخ بقای حافظه (٪)"
                      type="monotone"
                      dataKey="retentionRate"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#f59e0b', strokeWidth: 1 }}
                    />
                  </ComposedChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Custom Legend & Quick Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs border-t border-slate-800/80">
              <div className="flex flex-wrap items-center gap-5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-emerald-500 shrink-0"></span>
                  <span className="text-slate-300 font-medium">مرورهای موفق انجام‌شده (تثبیت در هیپوکامپ)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-rose-500 shrink-0"></span>
                  <span className="text-slate-300 font-medium">مطالب فراموش‌شده (نیازمند بازسازی سیناپسی)</span>
                </div>
                {chartType === 'composed' && (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-0.5 bg-amber-400 shrink-0"></span>
                    <span className="text-amber-300 font-medium">خط نرخ بقای حافظه (٪)</span>
                  </div>
                )}
              </div>

              {/* Interactive Test Action Triggers */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={handleSimulateReviewSuccess}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors cursor-pointer"
                  title="افزودن تست یک مرور موفق به آمار امروز"
                >
                  +۱ مرور موفق
                </button>
                <button
                  onClick={handleSimulateRecallForgotten}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                  title="افزودن تست یک فراموشی به آمار امروز"
                >
                  +۱ فراموشی
                </button>
                <button
                  onClick={handleResetChartStats}
                  className="px-2 py-1 text-[11px] text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  title="بازنشانی آمار به داده‌های پیش‌فرض"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Scientific Retention Insight */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-semibold ml-1">تفسیر روان‌شناسی یادگیری ابینگهاوس:</strong>
                وجود مطالب فراموش‌شده در نمودار نه تنها نشانه ضعف نیست، بلکه شاخص حیاتی فرآیند «یادآوری چالش‌برانگیز (Desirable Difficulty)» است. هر بار که مطلبی فراموش و بلافاصله طبق چرخه ریست می‌شود، مسیرهای عصبی هیپوکامپ مجدداً با پایداری ۳ برابری سیم‌کشی می‌شوند تا در نهایت ستون‌های سبز (مرور موفق) بر ستون‌های قرمز تسلط کامل پیدا کنند.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs & Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-xl overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('due_today')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'due_today'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>امروز نیاز به مرور</span>
            {stats.dueTodayCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'due_today' ? 'bg-slate-950 text-amber-300' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {stats.dueTodayCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'upcoming'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>برنامه روزهای آینده</span>
          </button>

          <button
            onClick={() => setActiveTab('mastered')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'mastered'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>تثبیت‌شده در حافظه دائم</span>
            <span className="text-[10px] text-slate-400">({stats.masteredCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span>تمام مباحث</span>
            <span className="text-[10px] text-slate-400">({topics.length})</span>
          </button>
        </div>

        {/* Search & Subject Filter */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی عنوان یا روش..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Subject Filter */}
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
          >
            <option value="all">همه درس‌ها</option>
            {SUBJECT_OPTIONS.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Topics List Stage */}
      {filteredTopics.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <h4 className="text-base font-bold text-white mb-1">
            {activeTab === 'due_today'
              ? 'هیچ مبحثی برای مرور امروز باقی نمانده است!'
              : 'موردی با این فیلتر یافت نشد.'}
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-5">
            {activeTab === 'due_today'
              ? 'آفرین! تمام برنامه‌های بازیابی امروز را به اتمام رسانده‌اید یا مبحث جدیدی هنوز موعدش نرسیده است.'
              : 'می‌توانید فیلترها را تغییر دهید یا مبحث جدیدی به چرخه اضافه نمایید.'}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors cursor-pointer shadow-sm shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>افزودن مبحث جدید به برنامه ابینگهاوس</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTopics.map(item => {
            const sched = item.schedule;
            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all duration-200 ${
                  sched.isDueToday
                    ? 'bg-rose-950/10 border-rose-500/40 hover:border-rose-500/70 shadow-lg shadow-rose-950/20'
                    : sched.isMastered
                    ? 'bg-emerald-950/10 border-emerald-500/30 hover:border-emerald-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Topic Meta & Information */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs px-2.5 py-0.5 rounded-md font-semibold bg-slate-800 text-amber-300 border border-slate-700/80">
                        {item.subject}
                      </span>

                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                        sched.isDueToday
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                          : sched.isDueTomorrow
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : sched.isMastered
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {sched.isDueToday && <AlertTriangle className="w-3 h-3 text-rose-400" />}
                        {sched.isMastered && <BookmarkCheck className="w-3 h-3 text-emerald-400" />}
                        <span>{sched.statusLabel}</span>
                      </span>

                      <span className="text-[11px] text-slate-400">
                        آخرین مرور: {item.lastReviewedDaysAgo === 0 ? 'امروز' : `${item.lastReviewedDaysAgo} روز پیش`}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">
                      {item.topicName}
                    </h4>

                    {/* Spaced Cycle Stepper (5 Cycles) */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[11px] text-slate-400">چرخه ابینگهاوس:</span>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map(cycleNum => {
                          const isDone = item.currentCycle >= cycleNum;
                          const isCurrent = item.currentCycle === cycleNum - 1;
                          return (
                            <div
                              key={cycleNum}
                              className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                                isDone
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : isCurrent
                                  ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-400/30'
                                  : 'bg-slate-800/60 text-slate-500 border border-slate-800'
                              }`}
                              title={`نوبت ${cycleNum}: ${CYCLE_DESCRIPTIONS[cycleNum - 1]?.name}`}
                            >
                              <span>نوبت {cycleNum}</span>
                              {isDone && <Check className="w-2.5 h-2.5 text-emerald-400" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Recommended Active Recall Method */}
                    <div className="flex items-start gap-2 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 text-xs text-slate-300 mt-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-amber-400 font-bold ml-1">تکنیک بازیابی پیشنهادی:</span>
                        <span className="text-slate-300">{item.recommendedMethod}</span>
                      </div>
                    </div>
                  </div>

                  {/* Retention Gauge & Action Buttons */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-between gap-4 shrink-0 lg:w-72 border-t lg:border-t-0 lg:border-r border-slate-800 pt-4 lg:pt-0 lg:pr-5">
                    {/* Retention Score Indicator */}
                    <div className="w-full text-left">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-400">ماندگاری تخمینی حافظه:</span>
                        <span className={`font-black text-sm tabular-nums ${
                          sched.estimatedRetention >= 80
                            ? 'text-emerald-400'
                            : sched.estimatedRetention >= 50
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}>
                          {sched.estimatedRetention}٪
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            sched.estimatedRetention >= 80
                              ? 'bg-emerald-400'
                              : sched.estimatedRetention >= 50
                              ? 'bg-amber-400'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${sched.estimatedRetention}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 w-full justify-end">
                      {/* Mark Reviewed Button */}
                      {!sched.isMastered && (
                        <button
                          onClick={() => handleMarkReviewedSuccess(item.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-sm shadow-emerald-500/20 active:scale-95 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>مرور شد و یادم بود</span>
                        </button>
                      )}

                      {/* Failed recall / Reset cycle */}
                      {item.currentCycle > 0 && !sched.isMastered && (
                        <button
                          onClick={() => handleMarkRecallFailed(item.id)}
                          className="p-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border border-slate-700 transition-colors cursor-pointer"
                          title="فراموش شده بود (ریست چرخه برای بازسازی سیناپسی)"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Snooze 24h */}
                      {!sched.isMastered && (
                        <button
                          onClick={() => handleSnoozeTopic(item.id)}
                          className="p-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors cursor-pointer"
                          title="به تعویق انداختن ۲۴ ساعته (Snooze)"
                        >
                          <Clock className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteTopic(item.id)}
                        className="p-2 text-xs font-medium rounded-xl bg-slate-800/60 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 transition-colors cursor-pointer"
                        title="حذف مبحث از برنامه"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Topic Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">
                  افزودن مبحث جدید به چرخه مرور ابینگهاوس
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewTopic} className="space-y-4 text-xs">
              {/* Subject */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  درس مربوطه:
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {SUBJECT_OPTIONS.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {/* Topic Name */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  عنوان دقیق مبحث یا فصل:
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: چرخه کربس و زنجیره انتقال الکترون، آرایه‌های ادبی..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              {/* Study Time / Days ago */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  زمان مطالعه اولیه این مبحث:
                </label>
                <select
                  value={newDaysAgo}
                  onChange={(e) => setNewDaysAgo(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value={0}>امروز مطالعه کرده‌ام (نوبت اول فردا: ۲۴ ساعت بعد)</option>
                  <option value={1}>دیروز مطالعه کرده‌ام (موعد نوبت اول: همین امروز!)</option>
                  <option value={3}>۳ روز پیش مطالعه کرده‌ام</option>
                  <option value={7}>یک هفته پیش مطالعه کرده‌ام</option>
                </select>
              </div>

              {/* Recommended Retrieval Method */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  روش بازیابی فعال پیشنهادی برای این مبحث:
                </label>
                <select
                  value={newMethod}
                  onChange={(e) => setNewMethod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {RETRIEVAL_METHODS.map(m => (
                    <option key={m.id} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Scientific Note */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                <span className="text-amber-400 font-bold ml-1">قاعده ابینگهاوس:</span>
                پس از ذخیره، سیستم طبق ۵ نوبت استاندارد (۲۴ ساعت، ۳ روز، ۷ روز، ۱۵ روز و ۳۰ روز) موعدهای مرور را محاسبه کرده و در ساعت مقرر هشدار ارسال می‌کند.
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-sm shadow-amber-500/20"
                >
                  ثبت در جدول زمان‌بندی
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Export Offline Data Modal */}
      {showExportCSVModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/90 rounded-2xl p-6 max-w-xl w-full shadow-2xl relative text-right">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>خروجی اکسل / CSV برای پیگیری آفلاین</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                      UTF-8 BOM
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    دانلود مستقیم تاریخچه یادگیری، وضعیت نوبت‌ها و نرخ پایداری حافظه
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowExportCSVModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Report Format Selection */}
              <div>
                <label className="block text-slate-300 font-semibold mb-2">
                  ۱. نوع گزارش مورد نظر:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCsvReportType('full')}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                      csvReportType === 'full'
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-sm shadow-emerald-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-emerald-300">گزارش جامع کامل</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">پیشنهادی</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      شامل تمام مباحث، زمان‌بندی مرورها و جداول تحلیلی Recharts
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCsvReportType('topics')}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                      csvReportType === 'topics'
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-sm shadow-emerald-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-200 mb-1">فقط جدول مباحث</div>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      لیست دروس، فواصل زمانی، درصد ماندگاری و روش‌های بازیابی
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCsvReportType('analytics')}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                      csvReportType === 'analytics'
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-sm shadow-emerald-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-200 mb-1">فقط آمار نمودارها</div>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      تفکیک هفتگی و درسی مرورهای موفق در مقابل مطالب فراموش‌شده
                    </p>
                  </button>
                </div>
              </div>

              {/* Topics Filter Scope (when applicable) */}
              {csvReportType !== 'analytics' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-2">
                    ۲. فیلتر دامنه مباحث:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'all', label: 'همه مباحث', count: analyzedTopics.length },
                      { id: 'due', label: 'موعد امروز', count: stats.dueTodayCount },
                      { id: 'active', label: 'در چرخه فعال', count: stats.activeCount },
                      { id: 'mastered', label: 'تثبیت دائم', count: stats.masteredCount }
                    ].map(scopeItem => (
                      <button
                        key={scopeItem.id}
                        type="button"
                        onClick={() => setCsvExportScope(scopeItem.id as any)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          csvExportScope === scopeItem.id
                            ? 'bg-slate-800 border-amber-400 text-amber-300 font-bold'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="block text-xs">{scopeItem.label}</span>
                        <span className="text-[10px] text-slate-500 tabular-nums">({scopeItem.count} مبحث)</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Offline & Compatibility Note */}
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-emerald-500/20 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>تضمین سازگاری و امنیت داده‌های آفلاین:</span>
                </div>
                <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside leading-relaxed pr-1">
                  <li>
                    فایل با نشانگر <strong className="text-slate-200">UTF-8 BOM</strong> ذخیره می‌شود تا هنگام باز کردن در <span className="text-emerald-300">Microsoft Excel</span> یا LibreOffice، حروف فارسی کاملاً خوانا و بدون هیچ کاراکتر نامفهوم نمایش یابند.
                  </li>
                  <li>
                    تولید فایل کاملاً درون مرورگر شما انجام می‌شود؛ اطلاعات به هیچ سروری ارسال نمی‌شوند و حتی بدون اینترنت هم می‌توانید آن را استخراج و پرینت بگیرید.
                  </li>
                  <li>
                    شامل درصد ماندگاری محاسباتی منحنی ابینگهاوس بر اساس فرمول <code className="text-amber-300 font-mono text-[10px]">R = e^(-t/S)</code> برای هر مبحث.
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowExportCSVModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  انصراف
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleExportCSV(csvReportType, csvExportScope);
                      setShowExportCSVModal(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>دانلود فایل اکسل / CSV</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
