import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Bell,
  BellRing,
  BellOff,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Brain,
  Volume2,
  VolumeX,
  X,
  Settings,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Layers,
  Send,
  Timer,
  Shield,
  RotateCcw,
  Check
} from 'lucide-react';
import { EbbinghausTopicItem } from './DashboardStats';
import {
  GlobalNotificationSettings,
  DEFAULT_GLOBAL_NOTIF_SETTINGS,
  NOTIF_SETTINGS_KEY,
  TOPICS_STORAGE_KEY,
  registerNotificationServiceWorker,
  getNotificationPermission,
  requestBrowserNotificationPermission,
  sendBrowserPushNotification,
  playGentleReminderChime,
  calculateAllTopicSchedules,
  EbbinghausScheduleCalculation
} from '../utils/ebbinghausNotifications';

interface ToastAlert {
  id: string;
  title: string;
  message: string;
  topicName?: string;
  subject?: string;
  cycleName?: string;
  recommendedMethod?: string;
  type: 'urgent' | 'due' | 'info' | 'success';
}

interface EbbinghausNotificationCenterProps {
  onNavigateToScheduler?: () => void;
  onNavigateToDuels?: () => void;
}

export const EbbinghausNotificationCenter: React.FC<EbbinghausNotificationCenterProps> = ({
  onNavigateToScheduler,
  onNavigateToDuels
}) => {
  // Settings State
  const [settings, setSettings] = useState<GlobalNotificationSettings>(() => {
    try {
      const saved = localStorage.getItem(NOTIF_SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_GLOBAL_NOTIF_SETTINGS;
  });

  // Browser Permission
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');

  // UI Modal and Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [activeToast, setActiveToast] = useState<ToastAlert | null>(null);

  // Background Test Timer State
  const [testCountdown, setTestCountdown] = useState<number | null>(null);

  // Topics Queue
  const [topics, setTopics] = useState<EbbinghausTopicItem[]>(() => {
    try {
      const raw = localStorage.getItem(TOPICS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });

  // Save settings
  const updateSettings = (partial: Partial<GlobalNotificationSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    try {
      localStorage.setItem(NOTIF_SETTINGS_KEY, JSON.stringify(updated));
    } catch {}
  };

  // Register Service Worker and check permissions on mount
  useEffect(() => {
    registerNotificationServiceWorker();
    setPermission(getNotificationPermission());

    // Listen for storage changes in case topics are updated in other components
    const handleStorageChange = () => {
      try {
        const raw = localStorage.getItem(TOPICS_STORAGE_KEY);
        if (raw) setTopics(JSON.parse(raw));
      } catch {}
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Calculate schedules
  const schedules = useMemo(() => {
    return calculateAllTopicSchedules(topics);
  }, [topics]);

  const dueItems = useMemo(() => {
    return schedules.filter(s => s.isOverdue || s.isDueToday);
  }, [schedules]);

  const nextUpcomingItem = useMemo(() => {
    const sorted = [...schedules].sort((a, b) => a.daysRemaining - b.daysRemaining);
    return sorted[0] || null;
  }, [schedules]);

  // Study Focus Mode Mute State (suppresses notifications when user is in deep review session)
  const [isStudyFocusModeMuted, setIsStudyFocusModeMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('rahbord_study_focus_mode_active') === 'true';
    } catch {
      return false;
    }
  });

  // Request browser permission
  const handleRequestPermission = async () => {
    const granted = await requestBrowserNotificationPermission();
    setPermission(granted ? 'granted' : 'denied');
    if (granted) {
      updateSettings({ browserPushEnabled: true, enabled: true });
      playGentleReminderChime('success');
      showInAppToast({
        id: 'perm_success',
        title: 'اعلان‌های مرورگر فعال شدند',
        message: 'اکنون یادآوری‌های طلایی ابینگهاوس حتی در صورت بسته بودن تب ارسال خواهند شد.',
        type: 'success'
      });
    }
  };

  // Listen for Study Focus Mode changes from EbbinghausScheduler
  useEffect(() => {
    const handleFocusModeChange = () => {
      try {
        const active = localStorage.getItem('rahbord_study_focus_mode_active') === 'true';
        setIsStudyFocusModeMuted(active);
        if (active) {
          setActiveToast(null); // dismiss any lingering toast when entering focus mode
        }
      } catch {}
    };

    window.addEventListener('rahbord_study_focus_mode_changed', handleFocusModeChange);
    window.addEventListener('storage', handleFocusModeChange);
    return () => {
      window.removeEventListener('rahbord_study_focus_mode_changed', handleFocusModeChange);
      window.removeEventListener('storage', handleFocusModeChange);
    };
  }, []);

  // Show gentle in-app toast (suppressed during Study Focus Mode)
  const showInAppToast = (toast: ToastAlert) => {
    const isMuted = isStudyFocusModeMuted || localStorage.getItem('rahbord_study_focus_mode_active') === 'true';
    if (isMuted) return; // Muted by Study Focus Mode
    if (!settings.inAppToastEnabled) return;
    setActiveToast(toast);
    if (settings.soundEnabled) {
      playGentleReminderChime(toast.type === 'urgent' ? 'due' : 'gentle');
    }
  };

  // Auto-dismiss toast after 8 seconds
  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      setActiveToast(null);
    }, 8500);
    return () => clearTimeout(timer);
  }, [activeToast]);

  // Trigger test background notification with countdown
  const handleStartBackgroundTest = () => {
    setTestCountdown(5);
  };

  useEffect(() => {
    if (testCountdown === null) return;

    if (testCountdown > 0) {
      const t = setTimeout(() => {
        setTestCountdown(c => (c !== null ? c - 1 : null));
      }, 1000);
      return () => clearTimeout(t);
    } else if (testCountdown === 0) {
      setTestCountdown(null);

      // Trigger the real notification
      const dueCount = dueItems.length > 0 ? dueItems.length : 2;
      const sampleTopic = dueItems[0]?.topic.topicName || 'گردش مواد و ساختار قلب انسان';

      const title = '⏰ یادآوری زمان طلایی مرور ابینگهاوس (پس‌زمینه)';
      const body = `وقت بازیابی فعال مبحث «${sampleTopic}» فرا رسید. مانع از ریزش ۸۰٪ حافظه شوید!`;

      // 1. Send Browser Push Notification (works in background)
      sendBrowserPushNotification(title, {
        body,
        tag: 'ebbinghaus-bg-test',
        requireInteraction: true
      });

      // 2. Also prepare in-app toast for when user switches back
      showInAppToast({
        id: 'bg_test_' + Date.now(),
        title,
        message: body,
        topicName: sampleTopic,
        subject: dueItems[0]?.topic.subject || 'زیست‌شناسی',
        cycleName: 'چرخه ۱ (۲۴ ساعت بعد)',
        recommendedMethod: 'حل ۳ تست نشان‌دار بدون نگاه به پاسخنامه',
        type: 'urgent'
      });
    }
  }, [testCountdown, dueItems]);

  // Main Periodic Background and Reminder Checker
  useEffect(() => {
    const checkScheduledReminders = () => {
      if (!settings.enabled) return;
      if (isStudyFocusModeMuted || localStorage.getItem('rahbord_study_focus_mode_active') === 'true') {
        // Study Focus Mode is active: All notifications are muted
        return;
      }

      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const todayDateStr = now.toLocaleDateString('fa-IR');

      // Check quiet hours
      if (settings.quietHoursStart && settings.quietHoursEnd) {
        if (currentHour >= settings.quietHoursStart || currentHour < settings.quietHoursEnd) {
          return; // Within quiet hours, respect student rest
        }
      }

      // Check daily reminder time
      const isDailyTime =
        currentHour === settings.reminderHour &&
        Math.abs(currentMinute - settings.reminderMinute) <= 1;

      if (isDailyTime && settings.lastNotifiedDate !== todayDateStr) {
        // Daily time matched!
        if (dueItems.length > 0) {
          const firstDue = dueItems[0];
          const notifTitle = `⏰ زمان مرور طلایی ابینگهاوس (${dueItems.length} مبحث آماده تثبیت)`;
          const notifBody = `مبحث «${firstDue.topic.topicName}» در موعد چرخه ${firstDue.cycleNumber} قرار دارد. با ۵ دقیقه بازیابی، پایداری آن را دائمی کنید.`;

          // Send push notification
          if (settings.browserPushEnabled) {
            sendBrowserPushNotification(notifTitle, {
              body: notifBody,
              tag: 'ebbinghaus-daily-reminder'
            });
          }

          // Show in-app toast
          showInAppToast({
            id: 'daily_' + Date.now(),
            title: notifTitle,
            message: notifBody,
            topicName: firstDue.topic.topicName,
            subject: firstDue.topic.subject,
            cycleName: `چرخه ${firstDue.cycleNumber}: ${firstDue.cycleIntervalDays} روز بعد`,
            recommendedMethod: firstDue.recommendedMethod,
            type: 'urgent'
          });

          updateSettings({
            lastNotifiedDate: todayDateStr,
            lastNotifiedTopicId: firstDue.topic.id
          });
        }
      }
    };

    checkScheduledReminders();
    const interval = setInterval(checkScheduledReminders, 45000); // Check every 45s

    // Also trigger check when tab becomes visible again after being hidden
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkScheduledReminders();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [settings, dueItems]);

  // Navigate to review handler
  const handleGoToReview = () => {
    setActiveToast(null);
    if (onNavigateToScheduler) {
      onNavigateToScheduler();
    } else {
      const el = document.getElementById('ebbinghaus-scheduler');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSnoozeToast = () => {
    setActiveToast(null);
    // Snooze toast for 15 minutes
    setTimeout(() => {
      if (dueItems.length > 0) {
        showInAppToast({
          id: 'snooze_' + Date.now(),
          title: '⏰ پایان زمان تعویق (Snooze)',
          message: `مرور مبحث «${dueItems[0].topic.topicName}» همچنان در انتظار شماست.`,
          type: 'urgent'
        });
      }
    }, 15 * 60 * 1000);
  };

  return (
    <>
      {/* =========================================================================
          1. GENTLE IN-APP TOAST ALERT (SLIDES IN WITH SOUND & ACTION)
         ========================================================================= */}
      {activeToast && (
        <aside
          role="region"
          aria-label="اعلان مرور ابینگهاوس"
          className="fixed top-20 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-top-6 duration-300 pointer-events-auto"
        >
          <div className="bg-slate-900/95 border border-amber-500/40 rounded-3xl p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden ring-1 ring-amber-500/20">
            {/* Ambient top glow */}
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-400" />

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <BellRing className="w-5 h-5 animate-bounce" />
                </div>

                <div className="space-y-1 flex-1 text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white">{activeToast.title}</span>
                  </div>

                  {activeToast.subject && (
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-medium">
                      <span className="bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg">
                        {activeToast.subject}
                      </span>
                      {activeToast.cycleName && (
                        <span className="text-slate-400">({activeToast.cycleName})</span>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {activeToast.message}
                  </p>

                  {activeToast.recommendedMethod && (
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 mt-2 space-y-0.5">
                      <strong className="text-amber-400 block font-semibold">متد بازیابی پیشنهادی:</strong>
                      <span className="text-slate-400">{activeToast.recommendedMethod}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setActiveToast(null)}
                className="text-slate-500 hover:text-white p-1 rounded-lg transition-colors cursor-pointer shrink-0"
                title="بستن اعلان"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2 text-xs">
              <button
                onClick={handleSnoozeToast}
                className="px-3 py-1.5 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                تعویق ۱۵ دقیقه
              </button>

              <button
                onClick={handleGoToReview}
                className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/20 active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span>شروع مرور طلایی</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* =========================================================================
          2. FLOATING STATUS PILL / NOTIFICATION BADGE
         ========================================================================= */}
      <div className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className="group relative p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/50 shadow-2xl backdrop-blur-md flex items-center gap-3 transition-all cursor-pointer hover:shadow-amber-500/10 text-right"
          title="تنظیمات سیستم اعلان و هشدارهای ابینگهاوس"
        >
          {/* Badge counter */}
          {dueItems.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white font-mono font-bold text-[11px] flex items-center justify-center shadow-lg border-2 border-slate-950 animate-pulse">
              {dueItems.length}
            </span>
          )}

          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
            {isStudyFocusModeMuted ? (
              <BellOff className="w-4 h-4 text-rose-400 animate-pulse" />
            ) : settings.enabled ? (
              <Bell className="w-4 h-4" />
            ) : (
              <BellOff className="w-4 h-4 text-slate-500" />
            )}
          </div>

          <div className="hidden sm:block text-xs pr-0.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>سیستم هشدار مرور</span>
              {isStudyFocusModeMuted ? (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  سایلنت فوکوس
                </span>
              ) : permission === 'granted' ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" title="اعلان مرورگر فعال است" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" title="نیاز به تایید مرورگر" />
              )}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {isStudyFocusModeMuted
                ? '🔇 سایلنت مطالعه فعال است'
                : dueItems.length > 0
                ? `${dueItems.length} مبحث موعد مرور امروز`
                : nextUpcomingItem
                ? `مرور بعدی: ${nextUpcomingItem.topic.topicName.slice(0, 16)}...`
                : 'تمام مباحث پایدار هستند'}
            </div>
          </div>
        </button>
      </div>

      {/* =========================================================================
          3. NOTIFICATION CONTROL & DIAGNOSTIC MODAL DRAWER
         ========================================================================= */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-right">
            {/* Study Focus Mode DND Notice Banner */}
            {isStudyFocusModeMuted && (
              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-center gap-3 text-xs text-rose-200">
                <BellOff className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <strong className="block text-white mb-0.5">حالت تمرکز عمیق مطالعه فعال است:</strong>
                  <span>کلیه اعلان‌های سیستم و صداهای هشدار بی‌صدا (DND) شده‌اند تا اختلالی در مرور مباحث با اولویت بالا ایجاد نشود.</span>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">سامانه هوشمند هشدار مرور ابینگهاوس</h3>
                  <p className="text-[11px] text-slate-400">ارسال اعلان در پس‌زمینه و هشدارهای ملایم شناختی</p>
                </div>
              </div>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Browser Push Permission Banner */}
            {permission !== 'granted' && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-amber-300">مجوز اعلان مرورگر هنوز فعال نشده است</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      برای اینکه یادآوری مرورها هنگام مینیمایز بودن برنامه یا بسته بودن تب برای شما ارسال شود، لازم است دسترسی اعلان را تایید کنید.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleRequestPermission}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <Bell className="w-4 h-4" />
                  <span>تایید و فعال‌سازی اعلان‌های پس‌زمینه</span>
                </button>
              </div>
            )}

            {/* Notification Toggles */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-200">تنظیمات کانال‌های دریافت هشدار:</h4>

              {/* Master Toggle */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">فعالیت کلی سیستم یادآوری روزانه</div>
                  <div className="text-[10px] text-slate-400">محاسبه الگوریتم ابینگهاوس و زمان‌بندی مرورها</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={e => updateSettings({ enabled: e.target.checked })}
                  className="w-5 h-5 rounded text-amber-400 bg-slate-900 border-slate-700 cursor-pointer"
                />
              </div>

              {/* Browser Push */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">اعلان‌های مرورگر (Browser Push Notifications)</div>
                  <div className="text-[10px] text-slate-400">ارسال هشدار به سیستم‌عامل حتی در صورت باز نبودن مستقیم صفحه</div>
                </div>
                <input
                  type="checkbox"
                  disabled={permission !== 'granted'}
                  checked={settings.browserPushEnabled && permission === 'granted'}
                  onChange={e => updateSettings({ browserPushEnabled: e.target.checked })}
                  className="w-5 h-5 rounded text-amber-400 bg-slate-900 border-slate-700 cursor-pointer disabled:opacity-40"
                />
              </div>

              {/* In-app Toast */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">کارت‌های هشدار درون‌برنامه‌ای (In-App Toasts)</div>
                  <div className="text-[10px] text-slate-400">نمایش کارت ملایم همراه با جزئیات مبحث و متد پیشنهادی</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.inAppToastEnabled}
                  onChange={e => updateSettings({ inAppToastEnabled: e.target.checked })}
                  className="w-5 h-5 rounded text-amber-400 bg-slate-900 border-slate-700 cursor-pointer"
                />
              </div>

              {/* Sound */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">صدای چایم آرام‌بخش (Web Audio Chime)</div>
                  <div className="text-[10px] text-slate-400">پخش آکورد فرکانسی سینوسی ملایم هنگام رسیدن موعد مرور</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={e => updateSettings({ soundEnabled: e.target.checked })}
                  className="w-5 h-5 rounded text-amber-400 bg-slate-900 border-slate-700 cursor-pointer"
                />
              </div>
            </div>

            {/* Reminder Time Picker */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>ساعت هشدار روزانه مرور:</span>
                </span>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  {String(settings.reminderHour).padStart(2, '0')}:{String(settings.reminderMinute).padStart(2, '0')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">ساعت (۰ تا ۲۳):</label>
                  <select
                    value={settings.reminderHour}
                    onChange={e => updateSettings({ reminderHour: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {Array.from({ length: 24 }).map((_, h) => (
                      <option key={h} value={h}>ساعت {h}:۰۰</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">دقیقه:</label>
                  <select
                    value={settings.reminderMinute}
                    onChange={e => updateSettings({ reminderMinute: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {[0, 15, 30, 45].map(m => (
                      <option key={m} value={m}>{m} دقیقه</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Background Notification Test Tool */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-950 to-slate-950 border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>آزمایش اعلان پس‌زمینه (Background Test)</span>
                  </span>
                  <p className="text-[10px] text-slate-400">
                    با زدن دکمه زیر، ۵ ثانیه فرصت دارید صفحه را کوچک (Minimize) کنید تا ارسال اعلان در خارج از برنامه را ببینید.
                  </p>
                </div>
              </div>

              {testCountdown !== null ? (
                <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-center space-y-1">
                  <div className="text-xl font-black text-amber-300 font-mono animate-ping">
                    {testCountdown}
                  </div>
                  <div className="text-[11px] text-slate-200 font-medium">
                    سریعاً به تب دیگری بروید یا مرورگر را کوچک کنید...
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleStartBackgroundTest}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>تست ارسال اعلان پس‌زمینه (۵ ثانیه)</span>
                </button>
              )}
            </div>

            {/* Quick Links */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  handleGoToReview();
                }}
                className="text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
              >
                مشاهده جدول زمان‌بندی مرورها ←
              </button>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
