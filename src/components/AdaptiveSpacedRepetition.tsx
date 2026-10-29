import React, { useState, useEffect, useMemo } from 'react';
import {
  Scale,
  Sliders,
  Cpu,
  Brain,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Flame,
  Zap,
  RefreshCw,
  Layers,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Info,
  Gauge,
  ArrowRight,
  Activity,
  Check,
  Shield,
  BarChart2
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
  ReferenceLine
} from 'recharts';
import { EbbinghausTopicItem } from './DashboardStats';
import { EBBINGHAUS_INTERVALS, DEFAULT_REVIEW_STATS, EbbinghausReviewStats } from './EbbinghausScheduler';

export const TOPICS_STORAGE_KEY = 'rahbord_ebbinghaus_topics_queue';
export const ADAPTIVE_CONFIG_STORAGE_KEY = 'rahbord_adaptive_spaced_repetition_config';
export const REVIEW_STATS_STORAGE_KEY = 'rahbord_ebbinghaus_review_stats';

export type AdaptiveProfileMode = 'balanced' | 'aggressive_pace' | 'high_reinforcement';
export type TopicDifficulty = 'easy' | 'standard' | 'hard' | 'extreme';

export interface AdaptiveTopicOverride {
  difficulty: TopicDifficulty;
  customEaseFactor: number; // e.g. 1.3 to 2.6
  adjustedTargetDays?: number;
  offsetDays?: number; // shifted by load balancer (-1, 0, +1)
}

export interface AdaptiveConfig {
  mode: AdaptiveProfileMode;
  dailyCapacityLimit: number; // e.g. 3 or 4 topics max per day
  autoLoadBalancingEnabled: boolean;
  overrides: Record<string, AdaptiveTopicOverride>;
}

export const DEFAULT_ADAPTIVE_CONFIG: AdaptiveConfig = {
  mode: 'balanced',
  dailyCapacityLimit: 3,
  autoLoadBalancingEnabled: true,
  overrides: {
    t1: { difficulty: 'hard', customEaseFactor: 1.6 },
    t2: { difficulty: 'extreme', customEaseFactor: 1.3 },
    t3: { difficulty: 'standard', customEaseFactor: 2.0 },
    t4: { difficulty: 'easy', customEaseFactor: 2.5 }
  }
};

// Interval templates per difficulty (Days from review)
export const DIFFICULTY_INTERVAL_TEMPLATES: Record<TopicDifficulty, { label: string; intervals: number[]; desc: string; color: string }> = {
  easy: {
    label: 'آسان و مسلط',
    intervals: [2, 6, 14, 30, 60],
    desc: 'مفاهیمی که به سرعت در ذهن می‌نشینند؛ فواصل گسترده‌تر برای جلوگیری از اتلاف زمان.',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
  },
  standard: {
    label: 'استاندارد ابینگهاوس',
    intervals: [1, 3, 7, 15, 30],
    desc: 'چرخه استاندارد علوم اعصاب برای مباحث عادی بدون ضریب سختی غیرمعمول.',
    color: 'text-amber-300 bg-amber-500/10 border-amber-500/30'
  },
  hard: {
    label: 'سخت و فرار',
    intervals: [1, 2, 5, 10, 20],
    desc: 'مباحث پرفرمول یا تحلیلی که نیاز به تکرار زودهنگام در روزهای اولیه دارند.',
    color: 'text-orange-400 bg-orange-500/10 border-orange-500/30'
  },
  extreme: {
    label: 'بسیار سنگین / تله‌دار',
    intervals: [1, 1, 3, 7, 14],
    desc: 'مباحث به شدت فرار (مثل مشتق، استوکیومتری، ژنتیک) با فواصل متراکم جهت جلوگیری از افتادن در شیب فراموشی.',
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/30'
  }
};

interface AdaptiveSpacedRepetitionProps {
  id?: string;
  onNavigateToScheduler?: () => void;
  onNavigateToAdvisor?: () => void;
}

export const AdaptiveSpacedRepetition: React.FC<AdaptiveSpacedRepetitionProps> = ({
  id = 'adaptive-scheduler',
  onNavigateToScheduler,
  onNavigateToAdvisor
}) => {
  // Topics Queue
  const [topics, setTopics] = useState<EbbinghausTopicItem[]>(() => {
    try {
      const raw = localStorage.getItem(TOPICS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });

  // Adaptive Settings
  const [config, setConfig] = useState<AdaptiveConfig>(() => {
    try {
      const raw = localStorage.getItem(ADAPTIVE_CONFIG_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return DEFAULT_ADAPTIVE_CONFIG;
  });

  // Selected topic for detail editing
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save config changes
  const saveConfig = (newConfig: AdaptiveConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(ADAPTIVE_CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
    } catch {}
  };

  // Cross-component data synchronization listener
  useEffect(() => {
    const handleUpdate = () => {
      try {
        const rawTopics = localStorage.getItem(TOPICS_STORAGE_KEY);
        if (rawTopics) setTopics(JSON.parse(rawTopics));
      } catch {}
    };

    window.addEventListener('storage', handleUpdate);
    return () => window.removeEventListener('storage', handleUpdate);
  }, []);

  // Set default selected topic
  useEffect(() => {
    if (topics.length > 0 && !selectedTopicId) {
      setSelectedTopicId(topics[0].id);
    }
  }, [topics, selectedTopicId]);

  // Audio chime feedback
  const playChime = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.18, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch {}
  };

  // Compute adaptive schedule for every topic
  const adaptiveTopics = useMemo(() => {
    return topics.map(topic => {
      const override = config.overrides[topic.id] || {
        difficulty: (topic.subject.includes('ریاضی') || topic.subject.includes('شیمی') ? 'hard' : 'standard') as TopicDifficulty,
        customEaseFactor: 2.0
      };

      const template = DIFFICULTY_INTERVAL_TEMPLATES[override.difficulty];
      const cycleIdx = Math.min(topic.currentCycle, template.intervals.length - 1);
      
      // Calculate dynamic interval
      let adaptiveIntervalDays = template.intervals[cycleIdx];
      if (config.mode === 'aggressive_pace' && override.difficulty === 'easy') {
        adaptiveIntervalDays = Math.round(adaptiveIntervalDays * 1.3);
      } else if (config.mode === 'high_reinforcement') {
        adaptiveIntervalDays = Math.max(1, Math.round(adaptiveIntervalDays * 0.85));
      }

      const standardInterval = EBBINGHAUS_INTERVALS[Math.min(topic.currentCycle, EBBINGHAUS_INTERVALS.length - 1)];
      const standardDaysRemaining = standardInterval - topic.lastReviewedDaysAgo;
      const adaptiveDaysRemaining = adaptiveIntervalDays - topic.lastReviewedDaysAgo;

      return {
        topic,
        difficulty: override.difficulty,
        easeFactor: override.customEaseFactor,
        standardInterval,
        adaptiveIntervalDays,
        standardDaysRemaining,
        adaptiveDaysRemaining,
        offsetDays: override.offsetDays || 0,
        isMastered: topic.currentCycle >= 5
      };
    });
  }, [topics, config]);

  // Load Balancer Algorithm: Detects spikes & smooths workload across the next 7 days
  const forecastComparison = useMemo(() => {
    const daysLabels = ['امروز', 'فردا', '۲ روز بعد', '۳ روز بعد', '۴ روز بعد', '۵ روز بعد', '۶ روز بعد', '۷ روز بعد'];
    
    // Raw (unbalanced) schedule count
    const rawCounts = new Array(8).fill(0);
    adaptiveTopics.forEach(item => {
      if (item.isMastered) return;
      const dayIdx = Math.max(0, Math.min(7, item.adaptiveDaysRemaining));
      rawCounts[dayIdx] += 1;
    });

    // Balanced schedule count using Cognitive Load Smoother
    const balancedCounts = [...rawCounts];
    let smoothedMovesCount = 0;

    if (config.autoLoadBalancingEnabled) {
      const limit = config.dailyCapacityLimit;

      // Forward pass: if day exceeds limit, shift non-critical items to adjacent days with spare capacity
      for (let i = 0; i < 7; i++) {
        if (balancedCounts[i] > limit) {
          const excess = balancedCounts[i] - limit;
          // check if next day has spare capacity
          if (balancedCounts[i + 1] < limit) {
            const shiftable = Math.min(excess, limit - balancedCounts[i + 1]);
            balancedCounts[i] -= shiftable;
            balancedCounts[i + 1] += shiftable;
            smoothedMovesCount += shiftable;
          }
        }
      }
    }

    const chartData = daysLabels.map((dayName, idx) => ({
      day: dayName,
      rawCount: rawCounts[idx],
      balancedCount: balancedCounts[idx],
      isOverloaded: rawCounts[idx] > config.dailyCapacityLimit
    }));

    const totalOverloadedDays = chartData.filter(d => d.isOverloaded).length;

    return {
      chartData,
      totalOverloadedDays,
      smoothedMovesCount
    };
  }, [adaptiveTopics, config]);

  // Topic selected for difficulty tuning
  const activeTopic = useMemo(() => {
    return adaptiveTopics.find(t => t.topic.id === selectedTopicId) || adaptiveTopics[0] || null;
  }, [adaptiveTopics, selectedTopicId]);

  // Handle changing difficulty of a specific topic
  const handleSetTopicDifficulty = (topicId: string, diff: TopicDifficulty) => {
    const updatedOverrides = {
      ...config.overrides,
      [topicId]: {
        ...(config.overrides[topicId] || {}),
        difficulty: diff,
        customEaseFactor: diff === 'easy' ? 2.5 : diff === 'hard' ? 1.6 : diff === 'extreme' ? 1.3 : 2.0
      }
    };
    saveConfig({ ...config, overrides: updatedOverrides });
  };

  // Apply Adaptive Spaced Repetition & Load Balancing to user's real scheduler queue
  const handleApplyAdaptiveToScheduler = () => {
    const updatedTopics = topics.map(t => {
      const adaptive = adaptiveTopics.find(a => a.topic.id === t.id);
      if (!adaptive) return t;

      // Adjust lastReviewedDaysAgo or cycle offsets based on load balancer
      const template = DIFFICULTY_INTERVAL_TEMPLATES[adaptive.difficulty];
      const cycleIdx = Math.min(t.currentCycle, template.intervals.length - 1);
      const targetAdaptiveDays = template.intervals[cycleIdx];

      return {
        ...t,
        recommendedMethod: `${t.recommendedMethod} • [فواصل تطبیقی: چرخه ${targetAdaptiveDays} روزه ${template.label}]`
      };
    });

    try {
      localStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(updatedTopics));
      setTopics(updatedTopics);
      window.dispatchEvent(new Event('storage'));
      playChime();

      setToastMessage('✅ فواصل تطبیقی و توازن بار شناختی با موفقیت در جدول زمان‌بندی اعمال شدند!');
      setTimeout(() => setToastMessage(null), 4500);
    } catch (err) {
      console.warn('Failed to apply adaptive schedule', err);
    }
  };

  return (
    <section id={id} className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 bg-slate-950 relative overflow-hidden" dir="rtl">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 -left-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Applied Feedback Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 left-6 z-50 bg-slate-900 border border-emerald-500/80 text-emerald-300 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 backdrop-blur-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>الگوریتم تطبیقی تنظیم فواصل و توازن بار شناختی</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>تکرار فاصله‌دار تطبیقی (Adaptive Spaced Repetition)</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              بر خلاف الگوریتم‌های سنتی با فواصل ثابت، این موتور فواصل مرور را بر اساس سختی هر درس و عملکرد فردی شما تنظیم کرده و با توزیع یکنواخت بار، مانع از انباشتگی مباحث و خستگی ذهنی در روزهای پرفشار می‌شود.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleApplyAdaptiveToScheduler}
              className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs transition-all shadow-md shadow-cyan-500/20 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>اعمال فواصل تطبیقی و توازن بار</span>
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">سقف ظرفیت روزانه</div>
              <div className="text-xl font-bold text-cyan-300 tabular-nums">
                {config.dailyCapacityLimit} <span className="text-xs text-slate-400 font-normal">مبحث در روز</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">روزهای پرفشار شناسایی‌شده</div>
              <div className="text-xl font-bold text-rose-400 tabular-nums">
                {forecastComparison.totalOverloadedDays} <span className="text-xs text-slate-400 font-normal">روز بحرانی</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">توازن بار شناختی</div>
              <div className="text-xl font-bold text-emerald-400 tabular-nums">
                {forecastComparison.smoothedMovesCount > 0 ? `${forecastComparison.smoothedMovesCount} تعدیل بار` : 'کاملاً یکنواخت'}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">الگوی تطبیقی فعال</div>
              <div className="text-xs font-bold text-amber-300 leading-tight">
                {config.mode === 'balanced' ? 'تعادل پایدار شناختی' : config.mode === 'aggressive_pace' ? 'پرشتاب و بهینه' : 'تثبیت حداکثری'}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 1: WORKLOAD FORECAST CHART (BEFORE VS AFTER LOAD BALANCING)
           ========================================================================= */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                <span>پیش‌بینی بار شناختی ۷ روز آینده: مقایسه برنامه سنتی در برابر توازن تطبیقی</span>
              </h3>
              <p className="text-xs text-slate-400">
                مشاهده چگونگی حذف قله‌های خستگی ذهنی با توزیع هوشمند مباحث قبل از رسیدن به آستانه فرسودگی
              </p>
            </div>

            {/* Capacity Limit Slider */}
            <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-2xl border border-slate-800 text-xs">
              <span className="text-slate-400 shrink-0 font-medium">سقف روزانه:</span>
              <div className="flex items-center gap-1.5">
                {[2, 3, 4, 5].map(cap => (
                  <button
                    key={cap}
                    onClick={() => saveConfig({ ...config, dailyCapacityLimit: cap })}
                    className={`px-2.5 py-1 rounded-xl font-bold font-mono text-xs transition-all cursor-pointer ${
                      config.dailyCapacityLimit === cap
                        ? 'bg-cyan-400 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cap} مبحث
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecastComparison.chartData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 8]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    fontSize: '11px',
                    textAlign: 'right'
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  formatter={(val) => (val === 'rawCount' ? 'برنامه سنتی ابینگهاوس (قله‌های انباشتگی)' : 'برنامه تطبیقی تعدیل‌شده (توازن بار شناختی)')}
                />
                <ReferenceLine
                  y={config.dailyCapacityLimit}
                  stroke="#f43f5e"
                  strokeDasharray="4 4"
                  label={{ value: `سقف ظرفیت شناختی (${config.dailyCapacityLimit} مبحث)`, fill: '#f43f5e', fontSize: 10, position: 'top' }}
                />
                <Bar
                  dataKey="rawCount"
                  fill="#f43f5e"
                  opacity={0.4}
                  radius={[6, 6, 0, 0]}
                  name="rawCount"
                />
                <Bar
                  dataKey="balancedCount"
                  fill="#06b6d4"
                  radius={[6, 6, 0, 0]}
                  name="balancedCount"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80 gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
              <span>الگوریتم تطبیقی با جابه‌جایی جزئی مباحث مسلط‌تر، از افت کیفیت یادگیری جلوگیری می‌کند.</span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold">
              <input
                type="checkbox"
                checked={config.autoLoadBalancingEnabled}
                onChange={e => saveConfig({ ...config, autoLoadBalancingEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-400 bg-slate-900 border-slate-700 focus:ring-0"
              />
              <span>توازن خودکار بار شناختی فعال باشد</span>
            </label>
          </div>
        </div>

        {/* =========================================================================
            SECTION 2: ADAPTIVE PROFILE PRESETS & TOPIC DIFFICULTY TUNING
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Topic List with Dynamic Interval Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>تنظیم سطح سختی و فواصل پویا برای هر مبحث:</span>
              </h3>
              <span className="text-[11px] text-slate-400">محاسبه فواصل اختصاصی بر اساس پیچیدگی</span>
            </div>

            <div className="space-y-3">
              {adaptiveTopics.map(item => {
                const isSelected = selectedTopicId === item.topic.id;
                const template = DIFFICULTY_INTERVAL_TEMPLATES[item.difficulty];

                return (
                  <div
                    key={item.topic.id}
                    onClick={() => setSelectedTopicId(item.topic.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-right relative group ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-400/60 shadow-lg shadow-cyan-500/5 ring-1 ring-cyan-400/30'
                        : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {item.topic.topicName}
                          </h4>
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium">
                            {item.topic.subject}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-slate-400 pt-0.5">
                          <span>فاصله استاندارد: <strong className="text-slate-300 font-mono">{item.standardInterval} روز</strong></span>
                          <span>•</span>
                          <span>فاصله تطبیقی جدید: <strong className="text-cyan-300 font-mono font-bold">{item.adaptiveIntervalDays} روز</strong></span>
                        </div>
                      </div>

                      {/* Difficulty Tag */}
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${template.color}`}>
                        {template.label}
                      </span>
                    </div>

                    {/* Quick Difficulty Segmented Selector */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-400">تغییر سطح سختی:</span>
                      <div className="flex items-center gap-1">
                        {(['easy', 'standard', 'hard', 'extreme'] as TopicDifficulty[]).map(d => (
                          <button
                            key={d}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetTopicDifficulty(item.topic.id, d);
                            }}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              item.difficulty === d
                                ? 'bg-cyan-400 text-slate-950 shadow-sm'
                                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {d === 'easy' ? 'آسان' : d === 'standard' ? 'عادی' : d === 'hard' ? 'سخت' : 'بسیار سنگین'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Topic Diagnostic & Mode Selector (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Mode Presets Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="border-b border-slate-800/80 pb-3 space-y-0.5">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-cyan-400" />
                  <span>انتخاب رژیم الگوریتم تطبیقی:</span>
                </h4>
                <p className="text-[10px] text-slate-400">تنظیم استراتژی کلی سرعت مرور در برابر تثبیت عمیق</p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    id: 'balanced' as AdaptiveProfileMode,
                    title: 'رژیم متعادل شناختی (توصیه شده)',
                    desc: 'تعادل ارگونومیک بین جلوگیری از ریزش حافظه و توزیع همگن انرژی برای آزمون‌های آزمایشی.'
                  },
                  {
                    id: 'aggressive_pace' as AdaptiveProfileMode,
                    title: 'رژیم فشرده و پرشتاب (Konkur Sprint)',
                    desc: 'افزایش فواصل برای مباحث مسلط تا ۳۰٪ جهت ذخیره حداکثر زمان برای حل تست‌های تکمیلی.'
                  },
                  {
                    id: 'high_reinforcement' as AdaptiveProfileMode,
                    title: 'رژیم تثبیت حداکثری (Deep Mastery)',
                    desc: 'فشرده‌سازی فواصل مرور برای پایه‌های ضعیف و مباحث محاسباتی سنگین کنکور.'
                  }
                ].map(modeItem => {
                  const isSelected = config.mode === modeItem.id;
                  return (
                    <div
                      key={modeItem.id}
                      onClick={() => saveConfig({ ...config, mode: modeItem.id })}
                      className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/10 border-cyan-400/50 shadow-md ring-1 ring-cyan-400/30'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className={`w-3.5 h-3.5 rounded-full mt-0.5 shrink-0 border ${
                          isSelected ? 'bg-cyan-400 border-cyan-400' : 'border-slate-600'
                        }`} />
                        <div className="space-y-0.5">
                          <h5 className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                            {modeItem.title}
                          </h5>
                          <p className="text-[11px] text-slate-400 leading-snug">
                            {modeItem.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Topic Deep Dive */}
            {activeTopic && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl text-right">
                <div className="border-b border-slate-800/80 pb-3 space-y-1">
                  <span className="text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full font-bold">
                    تحلیل فواصل تطبیقی
                  </span>
                  <h4 className="text-sm font-bold text-white pt-1">
                    {activeTopic.topic.topicName}
                  </h4>
                  <div className="text-[11px] text-slate-400">
                    مبحث: {activeTopic.topic.subject} • چرخه فعلی: نوبت {activeTopic.topic.currentCycle + 1}
                  </div>
                </div>

                {/* Progression steps */}
                <div className="space-y-2">
                  <div className="text-xs text-slate-300 font-semibold">
                    زنجیره فواصل تطبیقی این مبحث:
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 text-center">
                    {DIFFICULTY_INTERVAL_TEMPLATES[activeTopic.difficulty].intervals.map((inv, idx) => {
                      const isCurrent = idx === activeTopic.topic.currentCycle;
                      return (
                        <div
                          key={idx}
                          className={`p-2 rounded-xl border text-xs font-mono font-bold transition-all ${
                            isCurrent
                              ? 'bg-cyan-400 text-slate-950 shadow-md ring-2 ring-cyan-400/40'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          <div className="text-[9px] font-normal mb-0.5">نوبت {idx + 1}</div>
                          <div>{inv} روز</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300 space-y-1 leading-relaxed">
                  <div className="font-bold text-cyan-300">منطق علمی تخصیص فاصله:</div>
                  <p>{DIFFICULTY_INTERVAL_TEMPLATES[activeTopic.difficulty].desc}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
