import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Award, 
  Trophy, 
  Sparkles, 
  Brain, 
  Target, 
  Flame, 
  ShieldCheck, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Lock, 
  Zap, 
  RefreshCw, 
  Share2, 
  Check, 
  ChevronRight, 
  X,
  Volume2,
  VolumeX,
  Info,
  Calendar,
  Layers,
  ArrowUpRight,
  FileText,
  Printer
} from 'lucide-react';
import { EbbinghausTopicItem, WeeklyProgressItem } from './DashboardStats';
import { DEFAULT_REVIEW_STATS, EbbinghausReviewStats } from './EbbinghausScheduler';
import { DigitalCertificateModal, CertificateTier, CERTIFICATE_TIERS } from './DigitalCertificateModal';

const TOPICS_STORAGE_KEY = 'rahbord_ebbinghaus_topics_queue';
const WEEKLY_STORAGE_KEY = 'rahbord_weekly_study_data';
const NOTIF_SETTINGS_KEY = 'rahbord_ebbinghaus_notification_settings';
const BADGES_STORAGE_KEY = 'rahbord_student_badges_history';
const SOUND_SETTING_KEY = 'rahbord_badge_sound_enabled';
const REVIEW_STATS_STORAGE_KEY = 'rahbord_ebbinghaus_review_stats';

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'diamond';
export type BadgeCategory = 'all' | 'ebbinghaus' | 'stamina' | 'mastery' | 'consistency';

export interface BadgeDefinition {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  scientificInsight: string;
  actionHint: string;
  actionTargetId?: string;
  actionLabel?: string;
  tier: BadgeTier;
  category: 'ebbinghaus' | 'stamina' | 'mastery' | 'consistency';
  icon: 'brain' | 'shield' | 'flame' | 'target' | 'clock' | 'book' | 'zap' | 'award' | 'trophy' | 'check';
  xp: number;
  evaluator: (context: EvaluationContext) => {
    isUnlocked: boolean;
    currentValue: number;
    targetValue: number;
    unit: string;
  };
}

export interface EvaluatedBadge extends BadgeDefinition {
  isUnlocked: boolean;
  currentValue: number;
  targetValue: number;
  unit: string;
  progressPercent: number;
  unlockedDate?: string;
}

interface EvaluationContext {
  topics: EbbinghausTopicItem[];
  weekly: WeeklyProgressItem[];
  notifSettings: { enabled: boolean; reminderHour: number } | null;
  totalStudyHours: number;
  totalReviewedTopics: number;
  urgentTopicsCount: number;
  masteredTopicsCount: number;
  uniqueSubjectsCount: number;
  averageRetention: number;
  fullTargetDaysCount: number;
  activeStudyDaysCount: number;
}

interface SavedBadgeRecord {
  unlockedAt: string;
  seen: boolean;
}

// Calculate retention estimate based on days and current cycle (Ebbinghaus formula)
const estimateTopicRetention = (days: number, cycle: number): number => {
  const stabilityFactors = [1.2, 3.5, 10, 30, 90, 180];
  const stability = stabilityFactors[Math.min(cycle, stabilityFactors.length - 1)];
  const retention = Math.round(100 * Math.exp(-days / stability));
  return Math.min(100, Math.max(10, retention));
};

// Play synthesized fanfare chime when badge is awarded (pure Web Audio API)
const playFanfareSound = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Arpeggio notes: C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.5)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + index * 0.11;
      
      osc.type = index === notes.length - 1 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.2, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + 0.36);
    });
  } catch {
    // Audio context may be restricted by autoplay policy
  }
};

// 10 Comprehensive Cognitive & Ebbinghaus Badges
const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'ebbinghaus_initiate',
    title: 'آغازگر سیناپسی',
    subtitle: 'ورود به مدار حافظه پایدار',
    description: 'حداقل ۱ مبحث درسی را در سامانه مرور ابینگهاوس ثبت کنید تا زمان‌بندی طلایی آغاز شود.',
    scientificInsight: 'آغاز فرایند فاصله‌گذاری، مسیرهای نورونی اولیه (Memory Engram) را در هیپوکامپ کدگذاری می‌کند.',
    actionHint: 'یک درس و مبحث جدید را در بخش داشبورد ثبت کنید.',
    actionTargetId: 'dashboard',
    actionLabel: 'ثبت مبحث جدید',
    tier: 'bronze',
    category: 'ebbinghaus',
    icon: 'brain',
    xp: 100,
    evaluator: (ctx) => ({
      isUnlocked: ctx.topics.length >= 1,
      currentValue: ctx.topics.length,
      targetValue: 1,
      unit: 'مبحث'
    })
  },
  {
    id: 'ebbinghaus_disciplined',
    title: 'نظم پولادین ابینگهاوس',
    subtitle: 'پاسبان آستانه فراموشی',
    description: 'داشتن حداقل ۳ مبحث فعال در چرخه بدون وجود هیچ مبحث منقضی‌شده یا وضعیت اضطراری.',
    scientificInsight: 'انجام مرور دقیقاً قبل از سقوط به زیر ۵۰٪، شیب فراموشی را کاهش داده و تثبیت را تسریع می‌کند.',
    actionHint: 'مباحث منقضی را با زدن دکمه «مرور شد» به‌روزرسانی کنید.',
    actionTargetId: 'dashboard',
    actionLabel: 'بررسی مباحث در انتظار',
    tier: 'gold',
    category: 'ebbinghaus',
    icon: 'shield',
    xp: 400,
    evaluator: (ctx) => {
      const hasEnough = ctx.topics.length >= 3;
      const isZeroUrgent = ctx.urgentTopicsCount === 0;
      return {
        isUnlocked: hasEnough && isZeroUrgent,
        currentValue: isZeroUrgent && hasEnough ? 3 : Math.max(0, 3 - ctx.urgentTopicsCount),
        targetValue: 3,
        unit: 'مبحث امن'
      };
    }
  },
  {
    id: 'neocortex_master',
    title: 'استاد نئوکورتکس',
    subtitle: 'تثبیت قطعی در قشر خاکستری مغز',
    description: 'رساندن حداقل ۳ مبحث به چرخه ۴ یا بیشتر (مرور ۳۰ روزه یا تثبیت دائم نئوکورتکس).',
    scientificInsight: 'اطلاعات از حافظه موقت هیپوکامپ به شبکه‌های قشر مخ (Neocortex) منتقل شده و در برابر فراموشی نفوذناپذیر می‌شوند.',
    actionHint: 'چرخه‌های متوالی مرور مباحث را تکمیل کنید تا به چرخه ۴+ ارتقا یابند.',
    actionTargetId: 'dashboard',
    actionLabel: 'مشاهده چرخه مباحث',
    tier: 'diamond',
    category: 'ebbinghaus',
    icon: 'trophy',
    xp: 600,
    evaluator: (ctx) => ({
      isUnlocked: ctx.masteredTopicsCount >= 3,
      currentValue: ctx.masteredTopicsCount,
      targetValue: 3,
      unit: 'مبحث تثبیت‌شده'
    })
  },
  {
    id: 'study_marathoner',
    title: 'ماراتنر ۲۵ ساعته',
    subtitle: 'استقامت شناختی هفته',
    description: 'ثبت حداقل ۲۵ ساعت مطالعه کل در جدول هفتگی داشبورد.',
    scientificInsight: 'حجم مطالعه ساختاریافته به همراه فواصل استراحت، ظرفیت تمرکز پایدار ذهن (Deep Work) را ارتقا می‌دهد.',
    actionHint: 'ساعات مطالعه روزانه خود را در جدول برنامه هفتگی ثبت و مدیریت کنید.',
    actionTargetId: 'dashboard',
    actionLabel: 'ثبت ساعات در داشبورد',
    tier: 'gold',
    category: 'stamina',
    icon: 'clock',
    xp: 450,
    evaluator: (ctx) => ({
      isUnlocked: ctx.totalStudyHours >= 25,
      currentValue: Math.round(ctx.totalStudyHours * 10) / 10,
      targetValue: 25,
      unit: 'ساعت'
    })
  },
  {
    id: 'target_striker',
    title: 'شکارچی اهداف روزانه',
    subtitle: 'تحقق اهداف مطالعه هفتگی',
    description: 'دستیابی به ۱۰۰٪ یا بیشتر از هدف مباحث روزانه در حداقل ۵ روز از هفته.',
    scientificInsight: 'تحقق ریز‌اهداف با ترشح کنترل‌شده دوپامین، حس خودکارآمدی (Self-Efficacy) و استمرار را تقویت می‌کند.',
    actionHint: 'تعداد مباحث مطالعه‌شده را در روزهای هفته به تارگت مشخص‌شده برسانید.',
    actionTargetId: 'dashboard',
    actionLabel: 'بررسی اهداف روزانه',
    tier: 'silver',
    category: 'consistency',
    icon: 'target',
    xp: 300,
    evaluator: (ctx) => ({
      isUnlocked: ctx.fullTargetDaysCount >= 5,
      currentValue: ctx.fullTargetDaysCount,
      targetValue: 5,
      unit: 'روز کامل'
    })
  },
  {
    id: 'centurion_reviewer',
    title: 'فرمانده مرور هفتگی',
    subtitle: 'تسلط بر اثر آزمون و بازیابی',
    description: 'انجام و ثبت حداقل ۳۰ مرور مبحث در طول هفته.',
    scientificInsight: 'تکرار بازیابی فعال (Active Retrieval Practice) قدرت یادآوری را تا ۴ برابر روش‌های سنتی افزایش می‌دهد.',
    actionHint: 'مرورهای دوره‌ای سریع و تست‌های پوششی بیشتری در طول هفته برنامه‌ریزی کنید.',
    actionTargetId: 'dashboard',
    actionLabel: 'مدیریت مرورها',
    tier: 'gold',
    category: 'stamina',
    icon: 'zap',
    xp: 450,
    evaluator: (ctx) => ({
      isUnlocked: ctx.totalReviewedTopics >= 30,
      currentValue: ctx.totalReviewedTopics,
      targetValue: 30,
      unit: 'مرور'
    })
  },
  {
    id: 'cognitive_diversity',
    title: 'تنوع شناختی جامع',
    subtitle: 'یادگیری موازی و چندوجهی',
    description: 'پوشش حداقل ۳ درس متفاوت (مانند زیست، شیمی، فیزیک، ریاضی یا ادبیات) در صف مرور.',
    scientificInsight: 'درهم‌تنیدگی مباحث مختلف (Interleaving) انعطاف‌پذیری شبکه مغزی و قدرت تمایز مسائل را جهش می‌دهد.',
    actionHint: 'مباحثی از سایر کتاب‌های درسی به سامانه ابینگهاوس بیفزایید.',
    actionTargetId: 'dashboard',
    actionLabel: 'افزودن دروس جدید',
    tier: 'silver',
    category: 'mastery',
    icon: 'book',
    xp: 250,
    evaluator: (ctx) => ({
      isUnlocked: ctx.uniqueSubjectsCount >= 3,
      currentValue: ctx.uniqueSubjectsCount,
      targetValue: 3,
      unit: 'درس مستقل'
    })
  },
  {
    id: 'retention_sage',
    title: 'استاد ماندگاری سیناپسی',
    subtitle: 'تسلط کامل بر منحنی فراموشی',
    description: 'حفظ میانگین نمره ماندگاری حافظه بالای ۸۰٪ برای کل مباحث فعال ابینگهاوس.',
    scientificInsight: 'میانگین پایداری بالای ۸۰٪ نشان‌دهنده تنظیم فوق‌العاده ریتم مرور و بازیابی به‌موقع قبل از تخریب سیناپس است.',
    actionHint: 'از تأخیر در مرور مباحث جلوگیری کنید تا میانگین ماندگاری بالای ۸۰٪ حفظ شود.',
    actionTargetId: 'dashboard',
    actionLabel: 'مشاهده نمودار ماندگاری',
    tier: 'diamond',
    category: 'mastery',
    icon: 'flame',
    xp: 550,
    evaluator: (ctx) => ({
      isUnlocked: ctx.topics.length >= 2 && ctx.averageRetention >= 80,
      currentValue: ctx.topics.length >= 2 ? Math.round(ctx.averageRetention) : 0,
      targetValue: 80,
      unit: 'درصد ماندگاری'
    })
  },
  {
    id: 'golden_streak_hero',
    title: 'پیوستگی پولادین ۷ روزه',
    subtitle: 'بدون وقفه و غیبت در طول هفته',
    description: 'ثبت فعالیت مطالعه موثر (حداقل ۲ ساعت) در تمامی ۷ روز هفته بدون حتی یک روز غیبت.',
    scientificInsight: 'تثبیت عادات با ریتم شبانه‌روزی (Circadian Habit) از خستگی ناشی از شروع مجدد جلوگیری می‌کند.',
    actionHint: 'در تمام روزهای هفته حتی در ایام تعطیل، حداقل ۲ ساعت مطالعه مفید ثبت کنید.',
    actionTargetId: 'dashboard',
    actionLabel: 'بررسی روزهای هفته',
    tier: 'gold',
    category: 'consistency',
    icon: 'check',
    xp: 500,
    evaluator: (ctx) => ({
      isUnlocked: ctx.activeStudyDaysCount >= 7,
      currentValue: ctx.activeStudyDaysCount,
      targetValue: 7,
      unit: 'روز فعال'
    })
  },
  {
    id: 'notification_sentinel',
    title: 'پاسبان ساعات طلایی',
    subtitle: 'سازمان‌دهی زنگ هشیاری ذهن',
    description: 'فعال‌سازی سیستم هشدار نوتیفیکیشن مرور روزانه در داشبورد برای دریافت هشدارهای سر وقت.',
    scientificInsight: 'سیگنال‌های زمانی دقیق، بار شناختی تصمیم‌گیری را حذف کرده و مانع از فراموشی نوبت‌های مرور می‌شوند.',
    actionHint: 'در بخش داشبورد، پنل تنظیمات نوتیفیکیشن را باز کرده و ساعت مرور را تنظیم کنید.',
    actionTargetId: 'dashboard',
    actionLabel: 'تنظیم نوتیفیکیشن مرور',
    tier: 'bronze',
    category: 'ebbinghaus',
    icon: 'award',
    xp: 150,
    evaluator: (ctx) => {
      const isEnabled = Boolean(ctx.notifSettings?.enabled || ctx.notifSettings?.reminderHour);
      return {
        isUnlocked: isEnabled,
        currentValue: isEnabled ? 1 : 0,
        targetValue: 1,
        unit: 'سیستم فعال'
      };
    }
  }
];

// Tier Styling Helper
const getTierBadgeStyle = (tier: BadgeTier) => {
  switch (tier) {
    case 'diamond':
      return {
        label: 'الماس نئوکورتکس 💎',
        border: 'border-sky-500/40 hover:border-sky-400',
        glow: 'shadow-sky-500/10',
        iconBg: 'bg-gradient-to-br from-sky-400/20 to-indigo-500/30 text-sky-300 border-sky-400/40',
        text: 'text-sky-400',
        pill: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
        progressBar: 'bg-gradient-to-l from-sky-400 to-indigo-500'
      };
    case 'gold':
      return {
        label: 'طلایی 🥇',
        border: 'border-amber-500/40 hover:border-amber-400',
        glow: 'shadow-amber-500/10',
        iconBg: 'bg-gradient-to-br from-amber-400/20 to-orange-500/30 text-amber-300 border-amber-400/40',
        text: 'text-amber-400',
        pill: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        progressBar: 'bg-gradient-to-l from-amber-400 to-orange-500'
      };
    case 'silver':
      return {
        label: 'نقره‌ای 🥈',
        border: 'border-slate-400/30 hover:border-slate-300',
        glow: 'shadow-slate-400/10',
        iconBg: 'bg-gradient-to-br from-slate-300/20 to-slate-500/30 text-slate-200 border-slate-300/30',
        text: 'text-slate-300',
        pill: 'bg-slate-500/15 text-slate-300 border-slate-400/30',
        progressBar: 'bg-gradient-to-l from-slate-300 to-slate-400'
      };
    case 'bronze':
    default:
      return {
        label: 'برنزی 🥉',
        border: 'border-amber-700/40 hover:border-amber-600',
        glow: 'shadow-amber-700/10',
        iconBg: 'bg-gradient-to-br from-amber-700/20 to-yellow-800/30 text-amber-400 border-amber-700/40',
        text: 'text-amber-500',
        pill: 'bg-amber-800/20 text-amber-300 border-amber-700/30',
        progressBar: 'bg-gradient-to-l from-amber-600 to-amber-500'
      };
  }
};

// Render Icon helper
const renderBadgeIcon = (icon: BadgeDefinition['icon'], className: string = 'w-6 h-6') => {
  switch (icon) {
    case 'brain': return <Brain className={className} />;
    case 'shield': return <ShieldCheck className={className} />;
    case 'flame': return <Flame className={className} />;
    case 'target': return <Target className={className} />;
    case 'clock': return <Clock className={className} />;
    case 'book': return <BookOpen className={className} />;
    case 'zap': return <Zap className={className} />;
    case 'trophy': return <Trophy className={className} />;
    case 'check': return <CheckCircle2 className={className} />;
    case 'award':
    default: return <Award className={className} />;
  }
};

interface BadgesProps {
  id?: string;
  onNavigate?: (sectionId: string) => void;
}

export const Badges: React.FC<BadgesProps> = ({ id = 'badges', onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<BadgeCategory>('all');
  const [filterUnlockedOnly, setFilterUnlockedOnly] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedBadge, setSelectedBadge] = useState<EvaluatedBadge | null>(null);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SOUND_SETTING_KEY);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // State loaded from LocalStorage
  const [topics, setTopics] = useState<EbbinghausTopicItem[]>([]);
  const [weekly, setWeekly] = useState<WeeklyProgressItem[]>([]);
  const [notifSettings, setNotifSettings] = useState<{ enabled: boolean; reminderHour: number } | null>(null);
  const [savedHistory, setSavedHistory] = useState<Record<string, SavedBadgeRecord>>({});
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<EvaluatedBadge | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>('');

  // Save sound setting
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    try {
      localStorage.setItem(SOUND_SETTING_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  // Digital Certificate States
  const [isCertModalOpen, setIsCertModalOpen] = useState<boolean>(false);
  const [certTierToOpen, setCertTierToOpen] = useState<CertificateTier | undefined>(undefined);
  const [ebbinghausReviewsCount, setEbbinghausReviewsCount] = useState<number>(DEFAULT_REVIEW_STATS.totalReviewed);

  // Load storage data and evaluate badges
  const loadStorageData = useCallback(() => {
    try {
      // Topics Queue
      const rawTopics = localStorage.getItem(TOPICS_STORAGE_KEY);
      const parsedTopics: EbbinghausTopicItem[] = rawTopics ? JSON.parse(rawTopics) : [];
      setTopics(parsedTopics);

      // Weekly Study
      const rawWeekly = localStorage.getItem(WEEKLY_STORAGE_KEY);
      const parsedWeekly: WeeklyProgressItem[] = rawWeekly ? JSON.parse(rawWeekly) : [];
      setWeekly(parsedWeekly);

      // Notification Settings
      const rawNotif = localStorage.getItem(NOTIF_SETTINGS_KEY);
      const parsedNotif = rawNotif ? JSON.parse(rawNotif) : null;
      setNotifSettings(parsedNotif);

      // History of awarded badges
      const rawHistory = localStorage.getItem(BADGES_STORAGE_KEY);
      const parsedHistory: Record<string, SavedBadgeRecord> = rawHistory ? JSON.parse(rawHistory) : {};
      setSavedHistory(parsedHistory);

      // Ebbinghaus review stats from EbbinghausScheduler
      const rawReviewStats = localStorage.getItem(REVIEW_STATS_STORAGE_KEY);
      if (rawReviewStats) {
        const parsedReviewStats: EbbinghausReviewStats = JSON.parse(rawReviewStats);
        if (typeof parsedReviewStats.totalReviewed === 'number') {
          setEbbinghausReviewsCount(parsedReviewStats.totalReviewed);
        }
      } else {
        setEbbinghausReviewsCount(DEFAULT_REVIEW_STATS.totalReviewed);
      }

      setLastRefreshedAt(new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.error('Failed to load LocalStorage in Badges component:', err);
    }
  }, []);

  // Initialize and register event listeners for live updates
  useEffect(() => {
    loadStorageData();

    // Listen for storage events across tabs or local dispatch
    const handleStorageChange = () => {
      loadStorageData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('rahbord_data_updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('rahbord_data_updated', handleStorageChange);
    };
  }, [loadStorageData]);

  // Context computation for badge evaluators
  const evaluationContext = useMemo<EvaluationContext>(() => {
    const totalStudyHours = weekly.reduce((sum, item) => sum + (item.studyHours || 0), 0);
    const totalReviewedTopics = weekly.reduce((sum, item) => sum + (item.reviewedTopics || 0), 0);

    // Urgent topics count (topics with retention < 50% or days >= due)
    let urgentCount = 0;
    let totalRetentionSum = 0;
    let masteredCount = 0;
    const subjects = new Set<string>();

    topics.forEach((t) => {
      const ret = estimateTopicRetention(t.lastReviewedDaysAgo, t.currentCycle);
      totalRetentionSum += ret;
      if (ret < 50 || t.lastReviewedDaysAgo > (t.currentCycle === 0 ? 1 : t.currentCycle === 1 ? 3 : 10)) {
        urgentCount++;
      }
      if (t.currentCycle >= 4) {
        masteredCount++;
      }
      if (t.subject) {
        subjects.add(t.subject.trim());
      }
    });

    const averageRetention = topics.length > 0 ? totalRetentionSum / topics.length : 100;
    const fullTargetDaysCount = weekly.filter((d) => d.targetTopics > 0 && d.reviewedTopics >= d.targetTopics).length;
    const activeStudyDaysCount = weekly.filter((d) => (d.studyHours || 0) >= 2).length;

    return {
      topics,
      weekly,
      notifSettings,
      totalStudyHours,
      totalReviewedTopics,
      urgentTopicsCount: urgentCount,
      masteredTopicsCount: masteredCount,
      uniqueSubjectsCount: subjects.size,
      averageRetention,
      fullTargetDaysCount,
      activeStudyDaysCount,
    };
  }, [topics, weekly, notifSettings]);

  // Evaluate all badges and identify newly unlocked achievements
  const evaluatedBadges = useMemo(() => {
    return BADGE_DEFINITIONS.map((def) => {
      const result = def.evaluator(evaluationContext);
      const isUnlocked = result.isUnlocked;
      const historyRecord = savedHistory[def.id];
      const progressPercent = Math.min(100, Math.round((result.currentValue / result.targetValue) * 100));

      return {
        ...def,
        isUnlocked,
        currentValue: result.currentValue,
        targetValue: result.targetValue,
        unit: result.unit,
        progressPercent,
        unlockedDate: historyRecord?.unlockedAt,
      };
    });
  }, [evaluationContext, savedHistory]);

  // Synchronize unlocked badges to LocalStorage history & trigger celebration fanfare for fresh unlocks
  useEffect(() => {
    let hasNewUnlocks = false;
    const updatedHistory = { ...savedHistory };
    let candidateToAnnounce: EvaluatedBadge | null = null;

    evaluatedBadges.forEach((badge) => {
      if (badge.isUnlocked && !updatedHistory[badge.id]) {
        // Newly unlocked!
        const persianDate = new Date().toLocaleDateString('fa-IR');
        updatedHistory[badge.id] = {
          unlockedAt: persianDate,
          seen: false,
        };
        hasNewUnlocks = true;
        candidateToAnnounce = badge;
      }
    });

    if (hasNewUnlocks) {
      setSavedHistory(updatedHistory);
      try {
        localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify(updatedHistory));
      } catch {
        // ignore
      }

      if (candidateToAnnounce) {
        setNewlyUnlockedBadge(candidateToAnnounce);
        if (soundEnabled) {
          playFanfareSound();
        }
      }
    }
  }, [evaluatedBadges, savedHistory, soundEnabled]);

  // XP, Level & Rank Calculations
  const totalXP = useMemo(() => {
    return evaluatedBadges
      .filter((b) => b.isUnlocked)
      .reduce((sum, b) => sum + b.xp, 0);
  }, [evaluatedBadges]);

  const maxPossibleXP = useMemo(() => {
    return BADGE_DEFINITIONS.reduce((sum, b) => sum + b.xp, 0);
  }, []);

  const unlockedCount = useMemo(() => {
    return evaluatedBadges.filter((b) => b.isUnlocked).length;
  }, [evaluatedBadges]);

  // Student Rank System
  const rankInfo = useMemo(() => {
    if (totalXP >= 2700) {
      return {
        title: 'استاد اعظم نئوکورتکس',
        tierName: 'نخبگی شناختی',
        nextRank: 'بالاترین رتبه ممکن کسب شده است!',
        nextXP: 3750,
        progress: 100,
        color: 'text-sky-400',
        badge: 'الماس'
      };
    }
    if (totalXP >= 1700) {
      return {
        title: 'قهرمان تثبیت ابینگهاوس',
        tierName: 'استادی حافظه پایدار',
        nextRank: 'استاد اعظم نئوکورتکس',
        nextXP: 2700,
        progress: Math.round(((totalXP - 1700) / (2700 - 1700)) * 100),
        color: 'text-amber-400',
        badge: 'طلا'
      };
    }
    if (totalXP >= 900) {
      return {
        title: 'استراتژیست یادگیری ژرف',
        tierName: 'انضباط و تعمیق عادات',
        nextRank: 'قهرمان تثبیت ابینگهاوس',
        nextXP: 1700,
        progress: Math.round(((totalXP - 900) / (1700 - 900)) * 100),
        color: 'text-emerald-400',
        badge: 'نقره'
      };
    }
    if (totalXP >= 350) {
      return {
        title: 'کاوشگر مدار تمرکز',
        tierName: 'پشتکار در حال شکوفایی',
        nextRank: 'استراتژیست یادگیری ژرف',
        nextXP: 900,
        progress: Math.round(((totalXP - 350) / (900 - 350)) * 100),
        color: 'text-indigo-400',
        badge: 'برنز پیشرفته'
      };
    }
    return {
      title: 'دانش‌پژوه آغازگر سیناپس',
      tierName: 'مرحله شکل‌گیری مسیرهای عصبی',
      nextRank: 'کاوشگر مدار تمرکز',
      nextXP: 350,
      progress: Math.round((totalXP / 350) * 100),
      color: 'text-amber-500',
      badge: 'برنز پایه'
    };
  }, [totalXP]);

  // Highest qualified certificate tier based on EbbinghausScheduler reviews count
  const highestCertTier: CertificateTier = useMemo(() => {
    if (ebbinghausReviewsCount >= CERTIFICATE_TIERS.diamond.minReviews) return 'diamond';
    if (ebbinghausReviewsCount >= CERTIFICATE_TIERS.gold.minReviews) return 'gold';
    if (ebbinghausReviewsCount >= CERTIFICATE_TIERS.silver.minReviews) return 'silver';
    return 'bronze';
  }, [ebbinghausReviewsCount]);

  // Filtered badges list
  const filteredBadges = useMemo(() => {
    return evaluatedBadges.filter((b) => {
      // Category filter
      if (activeCategory !== 'all' && b.category !== activeCategory) return false;
      // Status filter
      if (filterUnlockedOnly === 'unlocked' && !b.isUnlocked) return false;
      if (filterUnlockedOnly === 'locked' && b.isUnlocked) return false;
      return true;
    });
  }, [evaluatedBadges, activeCategory, filterUnlockedOnly]);

  // Copy achievement summary to clipboard
  const handleCopyBrag = () => {
    const text = `🏆 کارنامه نشان‌های افتخار من در سامانه راهبُرد:\nرتبه شناختی: ${rankInfo.title}\nتعداد نشان‌های کسب‌شده: ${unlockedCount} از ${BADGE_DEFINITIONS.length}\nامتیاز کل انگیزه (XP): ${totalXP} امتیاز\nتسلط بر منحنی فراموشی ابینگهاوس و یادگیری نئوکورتکس`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 3000);
  };

  // Navigate to target section from modal
  const handleActionClick = (targetId?: string) => {
    setSelectedBadge(null);
    if (targetId && onNavigate) {
      onNavigate(targetId);
    } else if (targetId) {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id={id} className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-900">
      {/* Newly Unlocked Celebration Toast / Modal Banner */}
      {newlyUnlockedBadge && (
        <div className="mb-8 p-5 bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 border border-amber-500/50 rounded-2xl shadow-2xl relative overflow-hidden animate-fadeIn">
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-right">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-300 shrink-0 shadow-lg shadow-amber-500/20 animate-bounce">
                {renderBadgeIcon(newlyUnlockedBadge.icon, 'w-8 h-8')}
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>دستاورد جدید بازگشایی شد! تبریک!</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  مدال افتخار «{newlyUnlockedBadge.title}»
                </h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  {newlyUnlockedBadge.description} (پاداش: +{newlyUnlockedBadge.xp} امتیاز شناختی)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setSelectedBadge(newlyUnlockedBadge)}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
              >
                مشاهده جزئیات علمی
              </button>
              <button
                onClick={() => setNewlyUnlockedBadge(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                title="بستن اعلان"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header & Meta Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              سامانه پاداش و گیمیفیکیشن یادگیری
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">تحلیل بیدرنگ داده‌های LocalStorage</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            تالار نشان‌های افتخار و تثبیت حافظه
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            با هر بار تکمیل جلسات مطالعه و پایبندی به موعد مرورهای هوشمند ابینگهاوس، مدال‌های عصب‌شناختی جدیدی کسب کنید تا انگیزه و پایداری حافظه تقویت شود.
          </p>
        </div>

        {/* Global Controls: Certificate, Sound toggle, Refresh, Share */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setCertTierToOpen(highestCertTier);
              setIsCertModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/50 text-amber-300 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm shadow-amber-500/10 active:scale-95"
            title="مشاهده و صدور گواهی‌نامه دیجیتال ابینگهاوس بر اساس مرورهای موفق"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>گواهی‌نامه دیجیتال (PDF)</span>
          </button>

          <button
            onClick={toggleSound}
            className={`p-2.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              soundEnabled
                ? 'bg-slate-900 border-slate-700 text-amber-400 hover:border-amber-400/40'
                : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={soundEnabled ? 'صدای زنگ دستاورد فعال است' : 'صدای زنگ دستاورد بی‌صداست'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'صدا فعال' : 'بی‌صدا'}</span>
          </button>

          <button
            onClick={loadStorageData}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm"
            title="بررسی و تحلیل مجدد داده‌های محلی"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>به‌روزرسانی نشان‌ها</span>
          </button>

          <button
            onClick={handleCopyBrag}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm shadow-amber-500/10 active:scale-95"
            title="کپی کارت افتخارات برای به اشتراک‌گذاری"
          >
            {copiedShare ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedShare ? 'کپی شد!' : 'اشتراک کارنامه'}</span>
          </button>
        </div>
      </div>

      {/* Gamification Level & Rank Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-10">
        {/* Left Card: Rank & XP Progress */}
        <div className="md:col-span-8 p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <CrownIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">رتبه عصب‌شناختی فعلی شما:</div>
                <div className="text-lg font-black text-white flex items-center gap-2">
                  <span>{rankInfo.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                    {rankInfo.tierName}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <div className="text-xs text-slate-400">مجموع امتیاز انگیزه (Cognitive XP):</div>
              <div className="text-2xl font-black text-amber-400 tabular-nums">
                {totalXP.toLocaleString('fa-IR')} <span className="text-xs font-normal text-slate-400">/ {maxPossibleXP.toLocaleString('fa-IR')} XP</span>
              </div>
            </div>
          </div>

          {/* Progress bar to next rank */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                <span>مسیر تا رتبه بعدی: <strong className="text-slate-200">{rankInfo.nextRank}</strong></span>
              </span>
              <span className="font-mono text-slate-300 tabular-nums font-bold">
                {rankInfo.progress}٪
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className="h-full bg-gradient-to-l from-amber-400 via-amber-300 to-orange-400 rounded-full transition-all duration-700 shadow-sm shadow-amber-500/30"
                style={{ width: `${rankInfo.progress}%` }}
              />
            </div>
          </div>

          {/* Small status chips */}
          <div className="flex flex-wrap items-center gap-4 pt-1 border-t border-slate-800/80 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>نشان‌های کسب‌شده:</span>
              <strong className="text-white font-bold tabular-nums">{unlockedCount} از {BADGE_DEFINITIONS.length}</strong>
            </span>
            <span className="text-slate-700">·</span>
            <span className="flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-sky-400" />
              <span>مباحث در صف ابینگهاوس:</span>
              <strong className="text-white font-bold tabular-nums">{topics.length} مبحث</strong>
            </span>
            <span className="text-slate-700">·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>ساعات مطالعه این هفته:</span>
              <strong className="text-white font-bold tabular-nums">{Math.round(evaluationContext.totalStudyHours * 10) / 10} ساعت</strong>
            </span>
            {lastRefreshedAt && (
              <>
                <span className="text-slate-700">·</span>
                <span className="text-[11px] text-slate-500">آخرین پایش: {lastRefreshedAt}</span>
              </>
            )}
          </div>
        </div>

        {/* Right Card: Motivation & Neocortex Insight */}
        <div className="md:col-span-4 p-6 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>اثر روان‌شناختی گیمیفیکیشن</span>
            </div>
            <h4 className="text-sm font-bold text-white leading-snug">
              تبدیل رنج انضباط به لذت فتح سیناپس‌ها
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              تحقیقات هاروارد نشان می‌دهد دانش‌آموزانی که پیشرفت مطالعه خود را در قالب چرخه‌های پاداش و فواصل ابینگهاوس ثبت می‌کنند، تا ۶۲٪ کمتر دچار فرسودگی تحصیلی می‌شوند.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">وضعیت پایداری فعلی:</span>
            <span className={`font-bold ${
              evaluationContext.averageRetention >= 80 ? 'text-emerald-400' :
              evaluationContext.averageRetention >= 60 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {evaluationContext.topics.length > 0 ? `${Math.round(evaluationContext.averageRetention)}٪ میانگین ماندگاری` : 'در انتظار ثبت داده'}
            </span>
          </div>
        </div>
      </div>

      {/* Official Ebbinghaus Spaced Repetition Certificate Showcase Banner */}
      <div className="mb-10 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/40 shadow-xl relative overflow-hidden group">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30 flex items-center gap-1.5 shadow-sm">
                <FileText className="w-3.5 h-3.5" />
                <span>دانشنامه رسمی و گواهی‌نامه دیجیتال (PDF-Ready)</span>
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <span>تعداد کل مرورهای موفق:</span>
                <strong className="text-amber-400 font-mono font-bold text-sm">{ebbinghausReviewsCount} نوبت</strong>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
              صدور گواهی‌نامه شایستگی یادآوری فعال و تثبیت ابینگهاوس
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              با ثبت مرورهای منظم در بخش <strong className="text-amber-300">EbbinghausScheduler</strong>، گواهی‌نامه رسمی علمی در ۴ رده شایستگی برای شما صادر می‌شود. این مدرک با فرمت استاندارد A4 Landscape، مهر برجسته، هولوگرام دیجیتال و کد رهگیری قابل چاپ یا ذخیره مستقیم به صورت PDF است.
            </p>

            {/* Current qualification badge status */}
            <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400">سطح احراز صلاحیت شما هم‌اکنون:</span>
              <span className="px-3 py-1 bg-amber-400 text-slate-950 font-bold rounded-lg shadow-sm flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>{CERTIFICATE_TIERS[highestCertTier].title} ({CERTIFICATE_TIERS[highestCertTier].badgeLabel})</span>
              </span>
            </div>
          </div>

          {/* Right Action & Tier Quick-Select Box */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
            {/* Primary Open Certificate Button */}
            <button
              onClick={() => {
                setCertTierToOpen(highestCertTier);
                setIsCertModalOpen(true);
              }}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black rounded-2xl shadow-lg shadow-amber-500/20 text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>مشاهده و صدور گواهی‌نامه (PDF)</span>
            </button>

            {/* Quick Tier Preview Chips */}
            <div className="flex items-center justify-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl w-full sm:w-auto">
              {(['bronze', 'silver', 'gold', 'diamond'] as CertificateTier[]).map((tierKey) => {
                const tier = CERTIFICATE_TIERS[tierKey];
                const isEarned = ebbinghausReviewsCount >= tier.minReviews;
                return (
                  <button
                    key={tierKey}
                    onClick={() => {
                      setCertTierToOpen(tierKey);
                      setIsCertModalOpen(true);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                      isEarned
                        ? 'text-amber-300 hover:bg-slate-800'
                        : 'text-slate-500 hover:text-slate-400'
                    }`}
                    title={`${tier.title} (${tier.minReviews}+ مرور)`}
                  >
                    <span>{tier.badgeLabel}</span>
                    {isEarned && <Check className="w-3 h-3 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Tab Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        {/* Category Filters */}
        <div className="flex flex-wrap p-1 bg-slate-900 border border-slate-800 rounded-xl gap-1">
          {[
            { id: 'all', label: 'همه دسته‌ها' },
            { id: 'ebbinghaus', label: 'انضباط ابینگهاوس' },
            { id: 'stamina', label: 'استقامت و حجم' },
            { id: 'consistency', label: 'پیوستگی روزانه' },
            { id: 'mastery', label: 'کیفیت و تنوع' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as BadgeCategory)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeCategory === tab.id
                  ? 'bg-amber-400 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Lock / Unlock State Toggle */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setFilterUnlockedOnly('all')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              filterUnlockedOnly === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            همه ({evaluatedBadges.length})
          </button>
          <button
            onClick={() => setFilterUnlockedOnly('unlocked')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              filterUnlockedOnly === 'unlocked' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>کسب‌شده ({unlockedCount})</span>
          </button>
          <button
            onClick={() => setFilterUnlockedOnly('locked')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              filterUnlockedOnly === 'locked' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3 h-3 text-amber-400" />
            <span>قفل ({evaluatedBadges.length - unlockedCount})</span>
          </button>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBadges.map((badge) => {
          const tierStyle = getTierBadgeStyle(badge.tier);
          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                badge.isUnlocked
                  ? `bg-slate-900/90 ${tierStyle.border} shadow-lg ${tierStyle.glow}`
                  : 'bg-slate-950/60 border-slate-800/80 opacity-75 hover:opacity-100 hover:border-slate-700'
              }`}
            >
              {/* Unlocked top banner or lock badge */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                    badge.isUnlocked ? tierStyle.iconBg : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}>
                    {badge.isUnlocked ? (
                      renderBadgeIcon(badge.icon, 'w-6 h-6')
                    ) : (
                      <Lock className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {badge.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium line-clamp-1">
                      {badge.subtitle}
                    </p>
                  </div>
                </div>

                <div className="text-left shrink-0 space-y-1">
                  <span className={`text-[11px] px-2 py-0.5 rounded font-mono font-bold border ${tierStyle.pill}`}>
                    {tierStyle.label}
                  </span>
                  <div className="text-[11px] font-bold text-amber-400/90 tabular-nums">
                    +{badge.xp} XP
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed mb-4 flex-1">
                {badge.description}
              </p>

              {/* Progress Bar & Status */}
              <div className="space-y-2 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {badge.isUnlocked ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>کسب شده {badge.unlockedDate ? `(${badge.unlockedDate})` : ''}</span>
                      </span>
                    ) : (
                      <span>پیشرفت تا بازگشایی:</span>
                    )}
                  </span>
                  <span className="text-slate-300 font-mono text-[11px] tabular-nums">
                    {badge.currentValue} / {badge.targetValue} {badge.unit}
                  </span>
                </div>

                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/60">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      badge.isUnlocked ? tierStyle.progressBar : 'bg-slate-700'
                    }`}
                    style={{ width: `${badge.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Hover quick tip hint */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-slate-400 transition-colors">
                <span>مشاهده سازوکار شناختی و راهکار</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {filteredBadges.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
          موردی متناسب با فیلترهای انتخابی یافت نشد.
        </div>
      )}

      {/* Detailed Modal for Selected Badge */}
      {selectedBadge && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedBadge(null)}
        >
          <div 
            className="w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-2xl p-6 space-y-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with Icon and Tier */}
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                selectedBadge.isUnlocked 
                  ? getTierBadgeStyle(selectedBadge.tier).iconBg 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {renderBadgeIcon(selectedBadge.icon, 'w-8 h-8')}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] px-2 py-0.5 rounded font-mono font-bold border ${getTierBadgeStyle(selectedBadge.tier).pill}`}>
                    {getTierBadgeStyle(selectedBadge.tier).label}
                  </span>
                  <span className="text-xs text-amber-400 font-bold tabular-nums">
                    +{selectedBadge.xp} امتیاز شناختی (XP)
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  مدال افتخار: {selectedBadge.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedBadge.subtitle}
                </p>
              </div>
            </div>

            {/* Status & Progress Box */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">وضعیت کنونی:</span>
                <span className={`font-bold ${
                  selectedBadge.isUnlocked ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {selectedBadge.isUnlocked 
                    ? `کسب شده ${selectedBadge.unlockedDate ? `در تاریخ ${selectedBadge.unlockedDate}` : ''}` 
                    : 'در حال تکمیل در LocalStorage'}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>میزان پیشرفت ثبت‌شده:</span>
                  <span className="font-mono tabular-nums font-bold">
                    {selectedBadge.currentValue} از {selectedBadge.targetValue} {selectedBadge.unit} ({selectedBadge.progressPercent}٪)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedBadge.isUnlocked 
                        ? getTierBadgeStyle(selectedBadge.tier).progressBar 
                        : 'bg-amber-400'
                    }`}
                    style={{ width: `${selectedBadge.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Cognitive Science Explanation */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Brain className="w-4 h-4" />
                <span>سازوکار عصب‌شناختی و علمی این دستاورد:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                {selectedBadge.scientificInsight}
              </p>
            </div>

            {/* Actionable Hint & Shortcut Button */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>راهکار برای تکمیل یا ارتقای این نشان:</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {selectedBadge.actionHint}
              </p>
            </div>

            {/* Footer Action */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
              <button
                onClick={() => {
                  const targetTier = selectedBadge.tier === 'diamond' ? 'diamond' : selectedBadge.tier === 'gold' ? 'gold' : selectedBadge.tier === 'silver' ? 'silver' : 'bronze';
                  setCertTierToOpen(targetTier);
                  setIsCertModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer border border-amber-500/30"
                title="مشاهده گواهی‌نامه رسمی مرتبط با این سطح"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>گواهی‌نامه دیجیتال (PDF)</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  بستن
                </button>

                {selectedBadge.actionTargetId && (
                  <button
                    onClick={() => handleActionClick(selectedBadge.actionTargetId)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    <span>{selectedBadge.actionLabel || 'رفتن به بخش مربوطه'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Digital Certificate Modal */}
      <DigitalCertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        initialTier={certTierToOpen}
      />
    </section>
  );
};

// Crown Icon
const CrownIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
  </svg>
);
