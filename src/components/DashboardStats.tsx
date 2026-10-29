import React, { useState, useRef, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  BookmarkCheck, 
  Download, 
  FileText, 
  FileDown,
  Image as ImageIcon, 
  Loader2, 
  Check,
  Plus,
  RotateCcw,
  Save,
  Database,
  Bell,
  BellRing,
  BellOff,
  AlertTriangle,
  Calendar,
  Sparkles,
  Trash2,
  ChevronRight,
  Brain,
  Volume2,
  Trophy,
  Award
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { WeeklyReportPieChart } from './WeeklyReportPieChart';

// Weekly progress data: Topics reviewed per day of the week
export interface WeeklyProgressItem {
  day: string;
  reviewedTopics: number;
  targetTopics: number;
  studyHours: number;
}

const DEFAULT_WEEKLY_DATA: WeeklyProgressItem[] = [
  { day: 'شنبه', reviewedTopics: 5, targetTopics: 6, studyHours: 4.5 },
  { day: 'یکشنبه', reviewedTopics: 7, targetTopics: 6, studyHours: 5.2 },
  { day: 'دوشنبه', reviewedTopics: 4, targetTopics: 5, studyHours: 3.8 },
  { day: 'سه‌شنبه', reviewedTopics: 8, targetTopics: 7, studyHours: 6.0 },
  { day: 'چهارشنبه', reviewedTopics: 6, targetTopics: 6, studyHours: 4.8 },
  { day: 'پنج‌شنبه', reviewedTopics: 9, targetTopics: 8, studyHours: 6.5 },
  { day: 'جمعه', reviewedTopics: 5, targetTopics: 4, studyHours: 3.5 },
];

const LOCAL_STORAGE_KEY = 'rahbord_weekly_study_data';
const TOPICS_STORAGE_KEY = 'rahbord_ebbinghaus_topics_queue';
const NOTIF_SETTINGS_KEY = 'rahbord_ebbinghaus_notification_settings';

// Topic in the Ebbinghaus Review Scheduler
export interface EbbinghausTopicItem {
  id: string;
  subject: string;
  topicName: string;
  lastReviewedDaysAgo: number; // days since last review session
  currentCycle: number; // 0: new, 1: after 24h, 2: after 3d, 3: after 10d, 4: after 30d, 5: mastered
  recommendedMethod: string;
}

const DEFAULT_TOPICS_QUEUE: EbbinghausTopicItem[] = [
  {
    id: 't1',
    subject: 'زیست‌شناسی',
    topicName: 'گردش مواد و ساختار قلب انسان',
    lastReviewedDaysAgo: 3,
    currentCycle: 1, // due for Cycle 2 (3 days) -> Due TODAY
    recommendedMethod: 'تست پوششی نشان‌دار + رسم نمودار درختی از حفظ'
  },
  {
    id: 't2',
    subject: 'ریاضی و حسابان',
    topicName: 'فرمول‌های مشتق و قاعده زنجیره‌ای',
    lastReviewedDaysAgo: 1,
    currentCycle: 0, // due for Cycle 1 (24h) -> Due TODAY
    recommendedMethod: 'حل ۳ مسئله چالشی بدون نگاه به پاسخنامه'
  },
  {
    id: 't3',
    subject: 'فیزیک',
    topicName: 'قوانین حرکت نیوتون و دینامیک',
    lastReviewedDaysAgo: 6,
    currentCycle: 2, // due for Cycle 3 (10 days) -> Due in 4 days
    recommendedMethod: 'مرور فرمول‌ها با متد برگه سفید (Blurting)'
  },
  {
    id: 't4',
    subject: 'شیمی',
    topicName: 'ساختار لوویس و پیوندهای کووالانسی',
    lastReviewedDaysAgo: 0,
    currentCycle: 0, // studied today -> Due tomorrow (Day 1)
    recommendedMethod: 'حل ۵ تست سریع برای تثبیت اولیه'
  },
  {
    id: 't5',
    subject: 'ادبیات و علوم انسانی',
    topicName: 'آرایه‌های استعاره، مجاز و ایهام',
    lastReviewedDaysAgo: 22,
    currentCycle: 3, // due for Cycle 4 (30 days) -> Due in 8 days
    recommendedMethod: 'تست زمان‌دار ترکیبی کنکور'
  }
];

// Ebbinghaus Forgetting Curve reference data
interface EbbinghausDataPoint {
  day: string;
  passiveRetention: number;
  activeSpacedRetention: number;
}

const EBBINGHAUS_DATA: EbbinghausDataPoint[] = [
  { day: 'روز ۰', passiveRetention: 100, activeSpacedRetention: 100 },
  { day: 'روز ۱', passiveRetention: 58, activeSpacedRetention: 95 },
  { day: 'روز ۲', passiveRetention: 42, activeSpacedRetention: 88 },
  { day: 'روز ۳', passiveRetention: 33, activeSpacedRetention: 96 },
  { day: 'روز ۵', passiveRetention: 26, activeSpacedRetention: 91 },
  { day: 'روز ۷', passiveRetention: 22, activeSpacedRetention: 87 },
  { day: 'روز ۱۰', passiveRetention: 18, activeSpacedRetention: 95 },
  { day: 'روز ۱۴', passiveRetention: 15, activeSpacedRetention: 92 },
  { day: 'روز ۲۱', passiveRetention: 13, activeSpacedRetention: 89 },
  { day: 'روز ۳۰', passiveRetention: 11, activeSpacedRetention: 88 },
];

// Custom Tooltip for Recharts with Persian styling
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1 text-right">
        <p className="font-bold text-white mb-1.5">{label}</p>
        <p className="text-amber-400">
          مباحث مرور شده: <span className="tabular-nums font-bold">{payload[0]?.value}</span> مبحث
        </p>
        <p className="text-slate-400">
          هدف‌گذاری: <span className="tabular-nums">{payload[1]?.value}</span> مبحث
        </p>
      </div>
    );
  }
  return null;
};

const CustomLineTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1.5 text-right">
        <p className="font-bold text-white border-b border-slate-800 pb-1">{label}</p>
        <p className="text-emerald-400 font-medium">
          مرور فاصله‌دار فعال: <span className="tabular-nums font-bold">{payload[0]?.value}٪</span>
        </p>
        <p className="text-rose-400 font-medium">
          روخوانی منفعل سنتی: <span className="tabular-nums font-bold">{payload[1]?.value}٪</span>
        </p>
      </div>
    );
  }
  return null;
};

// Web Audio API notification chime generator
const playReminderChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const audioCtx = new AudioContextClass();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
    osc.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.35); // G5
    gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.6);
  } catch (e) {
    // Audio context may require user interaction
  }
};

export const DashboardStats: React.FC<{ onNavigateToBadges?: () => void }> = ({ onNavigateToBadges }) => {
  const [activeTab, setActiveTab] = useState<'both' | 'progress' | 'ebbinghaus' | 'pie_report'>('both');
  const [isExportingImage, setIsExportingImage] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [isExportingProgressPdf, setIsExportingProgressPdf] = useState<boolean>(false);
  const [exportNotification, setExportNotification] = useState<string | null>(null);

  // Initialize weekly study data from LocalStorage
  const [weeklyData, setWeeklyData] = useState<WeeklyProgressItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 7) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load study data from LocalStorage:', e);
    }
    return DEFAULT_WEEKLY_DATA;
  });

  // Initialize Ebbinghaus review topics queue from LocalStorage
  const [topicsQueue, setTopicsQueue] = useState<EbbinghausTopicItem[]>(() => {
    try {
      const saved = localStorage.getItem(TOPICS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load topics queue from LocalStorage:', e);
    }
    return DEFAULT_TOPICS_QUEUE;
  });

  // Notification API states
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [notifSettings, setNotifSettings] = useState<{
    enabled: boolean;
    reminderHour: number; // e.g., 9, 17, 21
    lastNotifiedDate?: string;
  }>(() => {
    try {
      const saved = localStorage.getItem(NOTIF_SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return { enabled: true, reminderHour: 17 }; // Default 17:00 (5 PM)
  });

  const [showNotificationPanel, setShowNotificationPanel] = useState<boolean>(false);
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [showAddTopicForm, setShowAddTopicForm] = useState<boolean>(false);
  const [newTopicSubject, setNewTopicSubject] = useState<string>('زیست‌شناسی');
  const [newTopicTitle, setNewTopicTitle] = useState<string>('');

  const reportContainerRef = useRef<HTMLDivElement>(null);
  const progressChartCardRef = useRef<HTMLDivElement>(null);

  // Check initial browser notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifPermission(Notification.permission);
    } else {
      setNotifPermission('unsupported');
    }
  }, []);

  // Save weeklyData to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(weeklyData));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('rahbord_data_updated'));
      }
    } catch (e) {
      console.error('Failed to save study data to LocalStorage:', e);
    }
  }, [weeklyData]);

  // Save topicsQueue to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(topicsQueue));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('rahbord_data_updated'));
      }
    } catch (e) {
      console.error('Failed to save topics queue to LocalStorage:', e);
    }
  }, [topicsQueue]);

  // Save notifSettings to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(NOTIF_SETTINGS_KEY, JSON.stringify(notifSettings));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('rahbord_data_updated'));
      }
    } catch (e) {
      console.error('Failed to save notification settings to LocalStorage:', e);
    }
  }, [notifSettings]);

  // Calculate Ebbinghaus schedule for a topic
  const calculateTopicSchedule = (topic: EbbinghausTopicItem) => {
    const targetIntervals = [1, 3, 10, 30, 60];
    const targetDays = targetIntervals[Math.min(topic.currentCycle, targetIntervals.length - 1)];
    const daysRemaining = targetDays - topic.lastReviewedDaysAgo;

    const stability = 1.6 * (1 + topic.currentCycle * 2.1);
    const estimatedRetention = Math.max(
      12,
      Math.min(99, Math.round(100 * Math.exp(-topic.lastReviewedDaysAgo / stability)))
    );

    let statusType: 'urgent_today' | 'due_tomorrow' | 'safe_upcoming' | 'mastered' = 'safe_upcoming';
    let statusText = '';
    let suggestedTime = '';

    if (topic.currentCycle >= 4) {
      statusType = 'mastered';
      statusText = '🏆 تثبیت در حافظه بلندمدت (تسلط دائمی)';
      suggestedTime = 'مرور دوره‌ای آزاد (۲ ماه یکبار)';
    } else if (daysRemaining <= 0) {
      statusType = 'urgent_today';
      statusText = '🚨 نیازمند مرور فوری امروز (خطر سقوط ابینگهاوس)';
      suggestedTime = 'امروز قبل از ساعت ۲۱ (پارت ۱۰ دقیقه‌ای)';
    } else if (daysRemaining === 1) {
      statusType = 'due_tomorrow';
      statusText = '⏳ نوبت مرور طلایی: فردا';
      suggestedTime = 'فردا در اولین پارت مطالعه';
    } else {
      statusType = 'safe_upcoming';
      statusText = `✅ در وضعیت امن (${daysRemaining} روز دیگر)`;
      suggestedTime = `${daysRemaining} روز بعد طبق تقویم`;
    }

    const cycleNames = [
      'نوبت ۱ (۲۴ ساعت پس از یادگیری)',
      'نوبت ۲ (۳ روز پس از نوبت اول)',
      'نوبت ۳ (۱۰ روز پس از نوبت دوم)',
      'نوبت ۴ (۳۰ روز پس از نوبت سوم)',
      'تثبیت دائم نئوکورتکس'
    ];

    return {
      targetDays,
      daysRemaining,
      estimatedRetention,
      statusType,
      statusText,
      suggestedTime,
      nextCycleName: cycleNames[Math.min(topic.currentCycle, cycleNames.length - 1)]
    };
  };

  // Urgent topics count
  const urgentCount = topicsQueue.filter(t => {
    const sched = calculateTopicSchedule(t);
    return sched.statusType === 'urgent_today';
  }).length;

  // Trigger Notification helper with audio chime and in-app fallback
  const triggerNotificationAlert = (title: string, body: string) => {
    playReminderChime();

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          tag: 'ebbinghaus-reminder',
        });
      } catch (err) {
        console.log('Browser notification constructor failed, using fallback:', err);
      }
    }

    // In-app visual alert notification
    setExportNotification(`🔔 ${title} — ${body}`);
    setTimeout(() => setExportNotification(null), 7000);
  };

  // Request Notification permission
  const handleRequestPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setExportNotification('مرورگر شما از Notification API پشتیبانی نمی‌کند؛ هشدارهای صوتی و درون‌برنامه‌ای فعال خواهند بود.');
      setTimeout(() => setExportNotification(null), 5000);
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotifPermission(permission);
      if (permission === 'granted') {
        setNotifSettings(prev => ({ ...prev, enabled: true }));
        triggerNotificationAlert(
          'مجوز نوتیفیکیشن با موفقیت فعال شد!',
          `هشدارهای مرور مباحث ابینگهاوس رأس ساعت ${notifSettings.reminderHour}:۰۰ به شما اعلام خواهند شد.`
        );
      } else {
        setExportNotification('دسترسی نوتیفیکیشن رد شد. در صورت تمایل می‌توانید از تنظیمات مرورگر آن را مجاز کنید.');
        setTimeout(() => setExportNotification(null), 5000);
      }
    } catch (err) {
      console.error('Error requesting permission:', err);
    }
  };

  // Test send notification right now
  const handleTestNotification = () => {
    const urgentTopics = topicsQueue.filter(t => calculateTopicSchedule(t).statusType === 'urgent_today');
    const topicSummary = urgentTopics.length > 0 
      ? urgentTopics.map(t => `${t.subject}: ${t.topicName}`).join(' و ')
      : 'گردش مواد زیست‌شناسی و فرمول‌های مشتق حسابان';

    triggerNotificationAlert(
      'نوبت مرور طلایی ابینگهاوس (تست)',
      `یادآوری: هم‌اکنون زمان طلایی بازیابی فعال مباحث «${topicSummary}» است تا از سقوط حافظه جلوگیری شود.`
    );
  };

  // Periodic background check for scheduled reminder hour
  useEffect(() => {
    if (!notifSettings.enabled) return;

    const checkScheduledReminder = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const todayStr = now.toLocaleDateString('fa-IR');

      if (currentHour === notifSettings.reminderHour && notifSettings.lastNotifiedDate !== todayStr) {
        const urgentTopics = topicsQueue.filter(t => calculateTopicSchedule(t).statusType === 'urgent_today');

        if (urgentTopics.length > 0) {
          const topicNames = urgentTopics.map(t => `${t.subject} (${t.topicName})`).join(' · ');
          triggerNotificationAlert(
            `موعد مرور طلایی ساعت ${notifSettings.reminderHour}:۰۰ فرا رسید!`,
            `تعداد ${urgentTopics.length} مبحث امروز نیازمند مرور هستند: ${topicNames}`
          );
          setNotifSettings(prev => ({ ...prev, lastNotifiedDate: todayStr }));
        }
      }
    };

    checkScheduledReminder();
    const timer = setInterval(checkScheduledReminder, 60000); // Check every minute
    return () => clearInterval(timer);
  }, [notifSettings, topicsQueue]);

  // Mark a topic as reviewed today (advances cycle and resets lastReviewed to 0)
  const handleMarkTopicReviewed = (topicId: string) => {
    setTopicsQueue(prev =>
      prev.map(item => {
        if (item.id === topicId) {
          const nextCycle = item.currentCycle + 1;
          return {
            ...item,
            currentCycle: nextCycle,
            lastReviewedDaysAgo: 0
          };
        }
        return item;
      })
    );

    // Also increment today's reviewed topics in weekly data
    const todayIndex = (new Date().getDay() + 1) % 7;
    const persianDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
    const todayName = persianDays[todayIndex] || 'شنبه';

    setWeeklyData(prev =>
      prev.map(w =>
        w.day === todayName
          ? { ...w, reviewedTopics: w.reviewedTopics + 1, studyHours: Number((w.studyHours + 0.3).toFixed(1)) }
          : w
      )
    );

    setExportNotification('مرور این مبحث با موفقیت ثبت شد؛ زمان مرور بعدی محاسبه و ذخیره گردید.');
    setTimeout(() => setExportNotification(null), 4000);
  };

  // Add a new topic to Ebbinghaus review queue
  const handleAddNewTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim()) return;

    const newTopic: EbbinghausTopicItem = {
      id: Date.now().toString(),
      subject: newTopicSubject,
      topicName: newTopicTitle.trim(),
      lastReviewedDaysAgo: 0,
      currentCycle: 0,
      recommendedMethod: 'تست آموزشی پوششی و متد برگه سفید (Blurting)'
    };

    setTopicsQueue(prev => [newTopic, ...prev]);
    setNewTopicTitle('');
    setShowAddTopicForm(false);
    setExportNotification('مبحث جدید با موفقیت به چرخه هوشمند ابینگهاوس اضافه و در LocalStorage ذخیره شد.');
    setTimeout(() => setExportNotification(null), 4000);
  };

  // Delete a topic from queue
  const handleDeleteTopic = (topicId: string) => {
    setTopicsQueue(prev => prev.filter(t => t.id !== topicId));
  };

  // Reset data to defaults
  const handleResetData = () => {
    setWeeklyData(DEFAULT_WEEKLY_DATA);
    setTopicsQueue(DEFAULT_TOPICS_QUEUE);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem(TOPICS_STORAGE_KEY);
      localStorage.removeItem(NOTIF_SETTINGS_KEY);
    } catch (e) {
      // ignore
    }
    setExportNotification('تمامی داده‌های داشبورد و چرخه مرور به مقادیر اولیه بازنشانی شدند.');
    setTimeout(() => setExportNotification(null), 3000);
  };

  const totalReviewed = weeklyData.reduce((acc, curr) => acc + curr.reviewedTopics, 0);
  const totalTarget = weeklyData.reduce((acc, curr) => acc + curr.targetTopics, 0);
  const totalHours = weeklyData.reduce((acc, curr) => acc + curr.studyHours, 0);
  const completionRate = Math.round((totalReviewed / totalTarget) * 100);

  // Dedicated Export for Progress Chart Data as PDF
  const handleExportProgressPdf = async () => {
    if (!progressChartCardRef.current) return;
    setIsExportingProgressPdf(true);
    setExportNotification(null);
    try {
      const canvas = await html2canvas(progressChartCardRef.current, {
        scale: 2,
        backgroundColor: '#0f172a',
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 12;

      const targetWidth = pageWidth - margin * 2;
      const targetHeight = (canvas.height * targetWidth) / canvas.width;

      pdf.addImage(
        imgData,
        'JPEG',
        margin,
        margin,
        targetWidth,
        Math.min(targetHeight, pageHeight - margin * 2)
      );

      const fileName = `نمودار_پیشرفت_مطالعه_${new Date().toLocaleDateString('fa-IR').replace(/\//g, '-')}.pdf`;
      pdf.save(fileName);

      setExportNotification('فایل PDF نمودار پیشرفت با موفقیت تولید و دانلود شد.');
      setTimeout(() => setExportNotification(null), 4000);
    } catch (err) {
      console.error('Error exporting progress PDF:', err);
      setExportNotification('خطایی در ذخیره فایل PDF نمودار پیشرفت رخ داد.');
    } finally {
      setIsExportingProgressPdf(false);
    }
  };

  // Export full dashboard as Image (PNG)
  const handleExportImage = async () => {
    if (!reportContainerRef.current) return;
    setIsExportingImage(true);
    setExportNotification(null);
    try {
      const canvas = await html2canvas(reportContainerRef.current, {
        scale: 2,
        backgroundColor: '#020617',
        useCORS: true,
        logging: false,
      });
      const imageURL = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = imageURL;
      downloadLink.download = `گزارش_پیشرفت_مطالعه_${new Date().toLocaleDateString('fa-IR').replace(/\//g, '-')}.png`;
      downloadLink.click();

      setExportNotification('فایل تصویر (PNG) گزارش با موفقیت دانلود شد.');
      setTimeout(() => setExportNotification(null), 4000);
    } catch (err) {
      console.error('Error exporting image:', err);
      setExportNotification('خطایی در تولید تصویر رخ داد. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsExportingImage(false);
    }
  };

  return (
    <section id="dashboard" className="py-20 px-6 max-w-6xl mx-auto border-t border-slate-800/80">
      {/* Header and Export Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold tracking-wide">
            <span>داشبورد آماری و هوش ابینگهاوس</span>
            <span aria-hidden="true">/</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>پایش بلادرنگ از حافظه LocalStorage</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            داشبورد تحلیل پیشرفت و سیستم یادآوری ابینگهاوس
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            محاسبه خودکار پنجره طلایی مرور مباحث بر اساس فواصل ابینگهاوس همراه با سیستم ارسال نوتیفیکیشن مرورگر در ساعات مشخص.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Notification Settings Toggle Button */}
          <button
            onClick={() => setShowNotificationPanel(!showNotificationPanel)}
            className={`flex items-center gap-2 px-3.5 py-2.5 border text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              notifPermission === 'granted' && notifSettings.enabled
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-amber-400/50'
            }`}
            title="تنظیمات سیستم هشدار و نوتیفیکیشن مرورگر"
          >
            {notifPermission === 'granted' && notifSettings.enabled ? (
              <BellRing className="w-4 h-4 text-emerald-400" />
            ) : (
              <Bell className="w-4 h-4 text-amber-400" />
            )}
            <span>سیستم یادآوری مرورگر ({notifSettings.reminderHour}:۰۰)</span>
          </button>

          <button
            onClick={handleExportProgressPdf}
            disabled={isExportingProgressPdf || isExportingPdf || isExportingImage}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-sm shadow-amber-500/20 active:scale-95"
            title="دانلود اختصاصی فایل PDF نمودار پیشرفت مطالعه"
          >
            {isExportingProgressPdf ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <FileDown className="w-4 h-4 text-slate-950" />
            )}
            <span>دانلود PDF نمودار پیشرفت</span>
          </button>

          <button
            onClick={() => {
              if (onNavigateToBadges) {
                onNavigateToBadges();
              } else {
                const el = document.getElementById('badges');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-gradient-to-r from-amber-500/15 to-orange-500/15 hover:from-amber-500/25 hover:to-orange-500/25 text-amber-300 border border-amber-500/40 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm hover:border-amber-400"
            title="مشاهده تالار افتخارات و مدال‌های کسب‌شده بر اساس داده‌های محلی"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>نشان‌های افتخار</span>
          </button>

          <button
            onClick={() => setShowAddTopicForm(!showAddTopicForm)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>افزودن مبحث به چرخه</span>
          </button>

          <button
            onClick={handleExportImage}
            disabled={isExportingImage || isExportingPdf || isExportingProgressPdf}
            className="flex items-center gap-2 px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition-all disabled:opacity-50 cursor-pointer hover:border-amber-400/50 shadow-sm"
            title="دانلود کل داشبورد به عنوان عکس PNG"
          >
            {isExportingImage ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            ) : (
              <ImageIcon className="w-4 h-4 text-amber-400" />
            )}
            <span>عکس (PNG)</span>
          </button>

          <button
            onClick={handleResetData}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-xl transition-colors cursor-pointer"
            title="بازنشانی داده‌ها به پیش‌فرض"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Browser Notification Configuration Panel (Collapsible) */}
      {showNotificationPanel && (
        <div className="mb-8 p-6 bg-slate-900/95 border border-amber-500/30 rounded-2xl space-y-5 shadow-2xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <BellRing className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  سیستم هشدار Notification API مرورگر
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  ارسال هشدارهای دسکتاپ/موبایل بر اساس فواصل طلایی ابینگهاوس برای جلوگیری از فراموشی
                </p>
              </div>
            </div>

            {/* Permission Badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">وضعیت دسترسی:</span>
              <span className={`text-xs px-2.5 py-1 rounded-md font-bold ${
                notifPermission === 'granted'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : notifPermission === 'denied'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {notifPermission === 'granted' ? 'مجوز مرورگر فعال است' :
                 notifPermission === 'denied' ? 'دسترسی مسدود شده' : 'نیازمند تایید کاربر'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Scheduled Hour Selector */}
            <div className="md:col-span-7 space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>ساعت مشخص‌شده برای ارسال نوتیفیکیشن مرور روزانه:</span>
              </label>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { hour: 9, label: '۰۹:۰۰ (صبح)' },
                  { hour: 13, label: '۱۳:۰۰ (ظهر)' },
                  { hour: 17, label: '۱۷:۰۰ (عصر)' },
                  { hour: 21, label: '۲۱:۰۰ (شب)' },
                ].map((item) => (
                  <button
                    key={item.hour}
                    type="button"
                    onClick={() => setNotifSettings(prev => ({ ...prev, reminderHour: item.hour }))}
                    className={`py-2 px-2.5 text-xs rounded-xl border text-center transition-all cursor-pointer font-medium ${
                      notifSettings.reminderHour === item.hour
                        ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions: Request Permission & Test Alert */}
            <div className="md:col-span-5 flex flex-wrap gap-2.5 justify-start md:justify-end">
              {notifPermission !== 'granted' && (
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  <span>درخواست مجوز نوتیفیکیشن</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleTestNotification}
                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                title="تست صدای زنگ و ارسال فوری یک اعلان نمونه"
              >
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>ارسال آزمایشی نوتیفیکیشن</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 leading-relaxed flex items-center justify-between">
            <span>
              نکته علمی: ساعت ۱۷:۰۰ به دلیل تطابق با ریتم شبانه‌روزی و گذشت چند ساعت از پارت‌های اولیه، بهینه‌ترین زمان بازیابی شناختی است.
            </span>
            <span className="text-emerald-400 font-medium">ذخیره‌شده در LocalStorage</span>
          </div>
        </div>
      )}

      {/* Intelligent Ebbinghaus Alert Banner */}
      <div className={`mb-8 p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        urgentCount > 0
          ? 'bg-rose-950/25 border-rose-900/40 text-rose-200'
          : 'bg-emerald-950/20 border-emerald-900/30 text-emerald-200'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
            urgentCount > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            {urgentCount > 0 ? <AlertTriangle className="w-5 h-5" /> : <Brain className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>تحلیل محاسباتی ابینگهاوس بر اساس حافظه محلی (LocalStorage):</span>
              {urgentCount > 0 && (
                <span className="text-xs bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-bold">
                  {urgentCount} مبحث در وضعیت اضطراری
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {urgentCount > 0
                ? `تعداد ${urgentCount} مبحث به آستانه بحرانی سقوط حافظه (زیر ۵۰٪ نگه‌داری) رسیده‌اند. سیستم نوتیفیکیشن در ساعت ${notifSettings.reminderHour}:۰۰ هشدار مرور را ارسال خواهد کرد.`
                : 'تمام مباحث شما در وضعیت امن منحنی ماندگاری قرار دارند و تثبیت سیناپسی در مسیر بهینه پیش می‌رود.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleTestNotification}
            className="text-xs font-semibold px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 rounded-lg transition-colors cursor-pointer"
          >
            یادآوری فوری
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('ebbinghaus-scheduler');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs font-semibold px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white rounded-lg transition-colors cursor-pointer"
          >
            مشاهده مباحث
          </button>
        </div>
      </div>

      {/* Add New Topic Form (Collapsible) */}
      {showAddTopicForm && (
        <form onSubmit={handleAddNewTopic} className="mb-8 p-5 bg-slate-900/90 border border-amber-500/40 rounded-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400">
            <span className="flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>افزودن مبحث جدید برای محاسبه زمان‌های مرور طلایی (ابینگهاوس):</span>
            </span>
            <button
              type="button"
              onClick={() => setShowAddTopicForm(false)}
              className="text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              بستن فرم
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-300">درس:</label>
              <select
                value={newTopicSubject}
                onChange={(e) => setNewTopicSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="زیست‌شناسی">زیست‌شناسی</option>
                <option value="ریاضی و حسابان">ریاضی و حسابان</option>
                <option value="فیزیک">فیزیک</option>
                <option value="شیمی">شیمی</option>
                <option value="ادبیات و عمومی">ادبیات و عمومی</option>
                <option value="علوم انسانی">علوم انسانی</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs text-slate-300">عنوان مبحث یا سرفصل خوانده‌شده امروز:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="مثلاً: فصل ۲ فیزیک - کار و انرژی و قضیه کار..."
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  ثبت در چرخه مرور
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Export / Storage / Notification Banner */}
      {exportNotification && (
        <div className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 animate-fadeIn">
          <Bell className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{exportNotification}</span>
        </div>
      )}

      {/* View Switcher Tabs */}
      <div className="flex flex-wrap p-1 bg-slate-900 border border-slate-800 rounded-xl mb-6 gap-1 w-fit">
        <button
          onClick={() => setActiveTab('both')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'both'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          نمایش همه‌جانبه نمودارها
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'progress'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          فقط میله‌ای پیشرفت هفتگی
        </button>
        <button
          onClick={() => setActiveTab('ebbinghaus')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'ebbinghaus'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          فقط خطی منحنی ابینگهاوس
        </button>
        <button
          onClick={() => setActiveTab('pie_report')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'pie_report'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          نمودار دایره‌ای عملکرد هفتگی (Pie Chart)
        </button>
      </div>

      {/* Exportable Report Container */}
      <div ref={reportContainerRef} className="p-4 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-8">
        {/* Report Branding header for exported files */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">راهبُرد</span>
            <span>· خلاصه گزارش عملکرد و ثبات یادگیری دانش‌آموز</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-emerald-400/90 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>پایش ابینگهاوس و یادآوری فعال</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              تاریخ: {new Date().toLocaleDateString('fa-IR')}
            </span>
          </div>
        </div>

        {/* KPI Metric Summary Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>مباحث مرور شده هفته</span>
              <BookmarkCheck className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold text-white tabular-nums">
              {totalReviewed} <span className="text-xs text-slate-400 font-normal">مبحث</span>
            </div>
            <div className="text-[11px] text-emerald-400">
              نرخ تحقق برنامه: {completionRate}٪
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>ساعت مطالعه و تمرکز</span>
              <Clock className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-extrabold text-white tabular-nums">
              {totalHours.toFixed(1)} <span className="text-xs text-slate-400 font-normal">ساعت</span>
            </div>
            <div className="text-[11px] text-slate-400">
              میانگین روزانه {(totalHours / 7).toFixed(1)} ساعت
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>ماندگاری در روز ۳۰ام</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 tabular-nums">
              ۸۸٪ <span className="text-xs text-slate-400 font-normal">با مرور فعال</span>
            </div>
            <div className="text-[11px] text-rose-400/90">
              در برابر ۱۱٪ روخوانی سنتی
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>مباحث نیازمند مرور امروز</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className={`text-2xl font-extrabold tabular-nums ${urgentCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {urgentCount} <span className="text-xs text-slate-400 font-normal">مبحث</span>
            </div>
            <div className="text-[11px] text-slate-400">
              ساعت هشدار: {notifSettings.reminderHour}:۰۰
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className={`grid gap-6 ${activeTab === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Chart 1: Bar Chart of Weekly Progress */}
          {(activeTab === 'both' || activeTab === 'progress') && (
            <div 
              ref={progressChartCardRef}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">
                    تعداد مباحث مرور شده در روزهای هفته (Bar Chart)
                  </h3>
                </div>

                <button
                  onClick={handleExportProgressPdf}
                  disabled={isExportingProgressPdf}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 text-amber-300 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                  title="ذخیره اختصاصی نمودار پیشرفت به عنوان فایل PDF"
                >
                  {isExportingProgressPdf ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  ) : (
                    <FileDown className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>ذخیره PDF این نمودار</span>
                </button>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey="day"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Legend
                      wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                      formatter={(val) => (
                        <span className="text-slate-300">
                          {val === 'reviewedTopics' ? 'مباحث مرور شده واقعی' : 'هدف‌گذاری اولیه'}
                        </span>
                      )}
                    />
                    <Bar
                      dataKey="reviewedTopics"
                      name="reviewedTopics"
                      fill="#fbbf24"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="targetTopics"
                      name="targetTopics"
                      fill="#334155"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span>پیشرفت ذخیره‌شده در LocalStorage: {totalReviewed} مبحث</span>
                <span className="text-emerald-400 font-medium">پوشش سرفصل‌ها به صورت پیوسته</span>
              </div>
            </div>
          )}

          {/* Chart 2: Line Chart of Ebbinghaus Forgetting Curve */}
          {(activeTab === 'both' || activeTab === 'ebbinghaus') && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">
                    منحنی فراموشی ابینگهاوس: منفعل در برابر فعال (Line Chart)
                  </h3>
                </div>
                <span className="text-xs text-slate-400">افق ۳۰ روزه</span>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={EBBINGHAUS_DATA}
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey="day"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      domain={[0, 100]}
                      unit="٪"
                    />
                    <Tooltip content={<CustomLineTooltip />} />
                    <Legend
                      wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                      formatter={(val) => (
                        <span className="text-slate-300">
                          {val === 'activeSpacedRetention'
                            ? 'مرور فاصله‌دار با بازیابی فعال (سبز)'
                            : 'روخوانی سنتی بدون مرور (قرمز)'}
                        </span>
                      )}
                    />
                    <Line
                      type="monotone"
                      dataKey="activeSpacedRetention"
                      name="activeSpacedRetention"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: '#10b981', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="passiveRetention"
                      name="passiveRetention"
                      stroke="#f43f5e"
                      strokeWidth={2.5}
                      strokeDasharray="4 4"
                      dot={{ fill: '#f43f5e', r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span>پایداری بعد از ۱ ماه: ۸۸٪ فعال vs ۱۱٪ منفعل</span>
                <span className="text-amber-400 font-medium">کاهش ۷۷ درصدی نرخ فراموشی</span>
              </div>
            </div>
          )}
        </div>

        {/* Section 2.5: Circular Weekly Performance & Retention Report (Pie Chart) */}
        {(activeTab === 'both' || activeTab === 'pie_report') && (
          <div className="pt-2">
            <WeeklyReportPieChart />
          </div>
        )}

        {/* Section 3: Intelligent Ebbinghaus Next Review Calculation Panel */}
        <div id="ebbinghaus-scheduler" className="pt-6 border-t border-slate-800/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                زمان‌بند هوشمند و محاسبه زمان پیشنهادی مرور بعدی (منحنی ابینگهاوس)
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span>یادآوری رأس ساعت {notifSettings.reminderHour}:۰۰</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>فواصل طلایی: ۲۴س · ۳روز · ۱۰روز · ۳۰روز</span>
            </div>
          </div>

          <div className="space-y-3">
            {topicsQueue.map((topic) => {
              const sched = calculateTopicSchedule(topic);
              return (
                <div
                  key={topic.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    sched.statusType === 'urgent_today'
                      ? 'bg-rose-950/20 border-rose-900/40 hover:border-rose-700/60'
                      : sched.statusType === 'due_tomorrow'
                      ? 'bg-amber-950/20 border-amber-900/40 hover:border-amber-700/60'
                      : sched.statusType === 'mastered'
                      ? 'bg-emerald-950/20 border-emerald-900/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-white bg-slate-800 px-2.5 py-0.5 rounded">
                        {topic.subject}
                      </span>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-100">
                        {topic.topicName}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-mono">
                        · {sched.nextCycleName}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>آخرین مرور: {topic.lastReviewedDaysAgo === 0 ? 'امروز' : `${topic.lastReviewedDaysAgo} روز پیش`}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <span className="text-slate-400">ماندگاری تخمینی حافظه:</span>
                        <strong className={`tabular-nums ${
                          sched.estimatedRetention >= 75 ? 'text-emerald-400' :
                          sched.estimatedRetention >= 50 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {sched.estimatedRetention}٪
                        </strong>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[11px] text-slate-400">
                        روش پیشنهادی: <span className="text-amber-200">{topic.recommendedMethod}</span>
                      </span>
                    </div>
                  </div>

                  {/* Calculated Suggestion & Action Button */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <div className="text-left md:text-right">
                      <div className={`text-xs font-bold ${
                        sched.statusType === 'urgent_today' ? 'text-rose-400' :
                        sched.statusType === 'due_tomorrow' ? 'text-amber-400' :
                        sched.statusType === 'mastered' ? 'text-emerald-400' : 'text-sky-400'
                      }`}>
                        {sched.statusText}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        زمان پیشنهادی: <span className="text-slate-200 font-medium">{sched.suggestedTime}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleMarkTopicReviewed(topic.id)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
                      title="ثبت انجام مرور و محاسبه نوبت بعدی"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>مرور شد</span>
                    </button>

                    <button
                      onClick={() => handleDeleteTopic(topic.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="حذف مبحث"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
