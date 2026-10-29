import { EbbinghausTopicItem } from '../components/DashboardStats';
import { EBBINGHAUS_INTERVALS } from '../components/EbbinghausScheduler';

export const TOPICS_STORAGE_KEY = 'rahbord_ebbinghaus_topics_queue';
export const NOTIF_SETTINGS_KEY = 'rahbord_ebbinghaus_notification_settings';

export interface GlobalNotificationSettings {
  enabled: boolean;
  browserPushEnabled: boolean;
  inAppToastEnabled: boolean;
  soundEnabled: boolean;
  backgroundRemindersEnabled: boolean;
  reminderHour: number;
  reminderMinute: number;
  quietHoursStart?: number;
  quietHoursEnd?: number;
  lastNotifiedDate?: string;
  lastNotifiedTopicId?: string;
}

export const DEFAULT_GLOBAL_NOTIF_SETTINGS: GlobalNotificationSettings = {
  enabled: true,
  browserPushEnabled: true,
  inAppToastEnabled: true,
  soundEnabled: true,
  backgroundRemindersEnabled: true,
  reminderHour: 18,
  reminderMinute: 30,
  quietHoursStart: 23,
  quietHoursEnd: 7
};

export interface EbbinghausScheduleCalculation {
  topic: EbbinghausTopicItem;
  cycleNumber: number;
  cycleIntervalDays: number;
  daysRemaining: number;
  isOverdue: boolean;
  isDueToday: boolean;
  isDueSoon: boolean; // due within 24h
  exactTargetDate: Date;
  recommendedMethod: string;
}

let serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

/**
 * Register service worker for robust background notifications
 */
export async function registerNotificationServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    serviceWorkerRegistration = reg;
    return reg;
  } catch (error) {
    console.warn('Service worker registration failed:', error);
    return null;
  }
}

/**
 * Get current browser notification permission
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

/**
 * Request notification permission from browser
 */
export async function requestBrowserNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.warn('Notification permission request error:', error);
    return false;
  }
}

/**
 * Send a background-safe browser notification using Service Worker or fallback
 */
export async function sendBrowserPushNotification(
  title: string,
  options: {
    body: string;
    tag?: string;
    data?: any;
    icon?: string;
    requireInteraction?: boolean;
    silent?: boolean;
  }
): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  const notificationOptions = {
    body: options.body,
    icon: options.icon || '/favicon.ico',
    badge: '/favicon.ico',
    tag: options.tag || 'ebbinghaus-reminder',
    vibrate: [200, 100, 200],
    requireInteraction: options.requireInteraction ?? true,
    data: options.data || { url: '/#ebbinghaus-scheduler' }
  };

  // 1. Try via Service Worker (Works even when browser is minimized or tab in background)
  try {
    if ('serviceWorker' in navigator) {
      const reg = serviceWorkerRegistration || (await navigator.serviceWorker.ready);
      if (reg && reg.showNotification) {
        await reg.showNotification(title, notificationOptions);
        return true;
      }
    }
  } catch (e) {
    console.log('Service worker showNotification fallback to new Notification()');
  }

  // 2. Direct Window Notification fallback
  try {
    const notif = new Notification(title, notificationOptions);
    notif.onclick = () => {
      window.focus();
      const el = document.getElementById('ebbinghaus-scheduler');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };
    return true;
  } catch (e) {
    console.warn('Direct notification error:', e);
    return false;
  }
}

/**
 * Play a soothing, non-intrusive notification chime using Web Audio API
 */
export function playGentleReminderChime(type: 'gentle' | 'due' | 'success' = 'gentle'): void {
  if (typeof window === 'undefined') return;

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === 'due') {
      // Warm, focused two-tone reminder: F4 (349Hz) then C5 (523Hz)
      [349.23, 523.25].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.16);
        gain.gain.setValueAtTime(0.2, now + idx * 0.16);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.16 + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.16);
        osc.stop(now + idx * 0.16 + 0.45);
      });
    } else if (type === 'success') {
      // Pleasant rising triad: E5 -> G#5 -> B5
      [659.25, 830.61, 987.77].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.18, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } else {
      // Gentle marimba pulse: A4 (440Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  } catch (err) {
    // Ignore audio failures
  }
}

/**
 * Calculate scheduled intervals for all user topics based on Ebbinghaus algorithm
 */
export function calculateAllTopicSchedules(topics: EbbinghausTopicItem[]): EbbinghausScheduleCalculation[] {
  const intervals = EBBINGHAUS_INTERVALS; // [1, 3, 7, 15, 30]

  return topics.map(topic => {
    const cycle = Math.min(topic.currentCycle, 4);
    const intervalDays = intervals[cycle] || 1;
    const daysSince = topic.lastReviewedDaysAgo;
    const daysRemaining = intervalDays - daysSince;

    const isOverdue = daysRemaining < 0;
    const isDueToday = daysRemaining === 0;
    const isDueSoon = daysRemaining > 0 && daysRemaining <= 1;

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysRemaining);

    return {
      topic,
      cycleNumber: cycle + 1,
      cycleIntervalDays: intervalDays,
      daysRemaining,
      isOverdue,
      isDueToday,
      isDueSoon,
      exactTargetDate: targetDate,
      recommendedMethod: topic.recommendedMethod || 'بازیابی فعال با متد برگه سفید'
    };
  });
}
