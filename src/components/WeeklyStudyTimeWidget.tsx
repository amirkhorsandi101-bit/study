/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * WeeklyStudyTimeWidget.tsx: Recharts Bar Chart Widget for Logged Study Hours
 * Visualizes the student's logged study time across the days of the week (شنبه تا جمعه)
 * with daily target comparisons, concept vs. test breakdown, key performance metrics,
 * and quick in-place logging directly from the Home tab.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Cell
} from 'recharts';
import {
  Clock,
  TrendingUp,
  Target,
  Flame,
  Award,
  Sparkles,
  Calendar,
  BookOpen,
  Plus,
  CheckCircle2,
  ChevronLeft,
  ArrowLeft,
  RotateCcw,
  Zap,
  BarChart3,
  Sliders,
  Check
} from 'lucide-react';
import { MainAppTab } from './HomePage';

export interface DailyStudyBarData {
  dayId: string;
  dayName: string;
  shortDay: string;
  dateKey: string;
  actualHours: number;
  targetHours: number;
  conceptHours: number;
  testHours: number;
  testCount: number;
  subjects: string[];
  focusRating: 1 | 2 | 3 | 4 | 5;
  isToday: boolean;
  completionRate: number;
}

interface WeeklyStudyTimeWidgetProps {
  onNavigateTab?: (tab: MainAppTab) => void;
  id?: string;
}

const STORAGE_KEY_HABIT = 'rahbord_study_habit_tracker_v1';
const STORAGE_KEY_PLANNER = 'rahbord_study_planner_v1';
const STORAGE_KEY_WEEKLY_TARGET = 'rahbord_weekly_target_hours';

// Weekdays in Iranian study order: Saturday to Friday
const PERSIAN_WEEKDAYS = [
  { id: 'saturday', name: 'شنبه', short: 'ش' },
  { id: 'sunday', name: 'یکشنبه', short: 'ی' },
  { id: 'monday', name: 'دوشنبه', short: 'د' },
  { id: 'tuesday', name: 'سه‌شنبه', short: 'س' },
  { id: 'wednesday', name: 'چهارشنبه', short: 'چ' },
  { id: 'thursday', name: 'پنج‌شنبه', short: 'پ' },
  { id: 'friday', name: 'جمعه', short: 'ج' },
];

function formatDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get the Saturday of the current week (or most recent Saturday)
function getStartOfCurrentPersianWeek(referenceDate: Date = new Date()): Date {
  const d = new Date(referenceDate);
  const dayOfWeek = d.getDay(); // 0 is Sunday, 6 is Saturday
  // In JS: Sat=6, Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5
  // Days since last Saturday:
  const daysSinceSaturday = (dayOfWeek + 1) % 7;
  d.setDate(d.getDate() - daysSinceSaturday);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Custom Tooltip for Recharts Bar Chart
const CustomStudyBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data: DailyStudyBarData = payload[0].payload;
    const diff = data.actualHours - data.targetHours;
    const diffText = diff >= 0
      ? `+${diff.toFixed(1)} ساعت فراتر از هدف`
      : `${Math.abs(diff).toFixed(1)} ساعت تا هدف`;

    return (
      <div className="bg-slate-900/95 border border-slate-700/90 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-right max-w-xs space-y-2.5 text-xs">
        {/* Tooltip Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="font-bold text-white text-sm">{data.dayName}</span>
            {data.isToday && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
                امروز
              </span>
            )}
          </div>
          <span className="font-mono text-slate-400 text-[11px]">{data.dateKey}</span>
        </div>

        {/* Study Hours Metrics */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">ساعت مطالعه ثبت‌شده:</span>
            <span className="font-mono text-white font-bold text-sm">
              {data.actualHours} <span className="text-xs font-normal text-slate-400">ساعت</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">هدف‌گذاری روزانه:</span>
            <span className="font-mono text-slate-300">{data.targetHours} ساعت</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">وضعیت در برابر هدف:</span>
            <span className={`font-medium ${diff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {diffText}
            </span>
          </div>
        </div>

        {/* Breakdown: Concept & Test */}
        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">یادگیری مفهومی:</span>
            <span className="font-mono text-amber-300 font-bold">{data.conceptHours} ساعت</span>
          </div>
          <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">تست‌زنی ({data.testCount} تست):</span>
            <span className="font-mono text-cyan-300 font-bold">{data.testHours} ساعت</span>
          </div>
        </div>

        {/* Subjects Tag List */}
        {data.subjects && data.subjects.length > 0 && (
          <div className="pt-1.5 border-t border-slate-800/80">
            <span className="text-slate-400 text-[10px] block mb-1">دروس مطالعه‌شده:</span>
            <div className="flex flex-wrap gap-1 text-[10px] text-slate-300">
              {data.subjects.map((sub, i) => (
                <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                  {sub}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Focus Stars */}
        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
          <span>ضریب تمرکز ذهنی:</span>
          <span className="text-amber-400 font-mono">
            {'★'.repeat(data.focusRating)}{'☆'.repeat(5 - data.focusRating)}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export const WeeklyStudyTimeWidget: React.FC<WeeklyStudyTimeWidgetProps> = ({
  onNavigateTab,
  id = 'weekly-study-time-widget'
}) => {
  // Chart View Mode
  const [viewMode, setViewMode] = useState<'comparison' | 'breakdown' | 'actual_only'>('comparison');

  // Weekly Target Hours (Default 42h = 6h per day)
  const [weeklyTargetHours, setWeeklyTargetHours] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WEEKLY_TARGET);
      if (saved) return Number(saved);
    } catch (e) {}
    return 42;
  });

  // Quick Log Modal / Drawer state for logging today's hours
  const [isQuickLogOpen, setIsQuickLogOpen] = useState<boolean>(false);
  const [quickLogHours, setQuickLogHours] = useState<number>(5.5);
  const [quickLogTests, setQuickLogTests] = useState<number>(60);
  const [quickLogRating, setQuickLogRating] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [quickLogSelectedDay, setQuickLogSelectedDay] = useState<string>('saturday');
  const [quickLogSubject, setQuickLogSubject] = useState<string>('زیست‌شناسی');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger re-read on custom events
  const [updateTrigger, setUpdateTrigger] = useState<number>(0);

  useEffect(() => {
    const handleStorageUpdate = () => {
      setUpdateTrigger(prev => prev + 1);
    };
    window.addEventListener('rahbord_data_updated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('rahbord_study_habit_updated', handleStorageUpdate);
    return () => {
      window.removeEventListener('rahbord_data_updated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('rahbord_study_habit_updated', handleStorageUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Build the 7-day data for the current Persian week
  const weeklyData: DailyStudyBarData[] = useMemo(() => {
    // 1. Read Habit Records
    let habitRecords: Record<string, any> = {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY_HABIT);
      if (raw) habitRecords = JSON.parse(raw);
    } catch (e) {}

    // 2. Read Planner Items for fallback/enrichment
    let plannerItems: any[] = [];
    try {
      const rawPlanner = localStorage.getItem(STORAGE_KEY_PLANNER);
      if (rawPlanner) plannerItems = JSON.parse(rawPlanner);
    } catch (e) {}

    const today = new Date();
    const todayKey = formatDateKey(today);
    const startOfWeek = getStartOfCurrentPersianWeek(today);

    const dailyTarget = Number((weeklyTargetHours / 7).toFixed(1));

    // Default realistic sample pattern if habit tracker is completely empty
    const defaultHoursPattern = [5.5, 6.2, 4.8, 7.0, 5.0, 6.5, 3.5];
    const defaultTestsPattern = [65, 80, 50, 95, 60, 85, 40];
    const defaultSubjectsPattern = [
      ['زیست‌شناسی', 'شیمی'],
      ['ریاضیات', 'فیزیک'],
      ['ادبیات فارسی', 'زیست‌شناسی'],
      ['شیمی', 'هندسه و گسسته'],
      ['فیزیک', 'عربی'],
      ['زیست‌شناسی', 'شیمی', 'ریاضیات'],
      ['مرور جامع', 'آزمون شبیه‌ساز']
    ];

    return PERSIAN_WEEKDAYS.map((wd, index) => {
      const curDate = new Date(startOfWeek);
      curDate.setDate(startOfWeek.getDate() + index);
      const dateKey = formatDateKey(curDate);
      const isToday = dateKey === todayKey;

      const record = habitRecords[dateKey];

      // Sum any planner items for this day
      const dayPlannerItems = Array.isArray(plannerItems)
        ? plannerItems.filter(it => it.day === wd.id && it.status === 'completed')
        : [];
      const plannerMinutes = dayPlannerItems.reduce((acc, it) => acc + (it.durationMinutes || 0), 0);
      const plannerHours = plannerMinutes > 0 ? Number((plannerMinutes / 60).toFixed(1)) : 0;

      let actualHours = 0;
      let subjects: string[] = [];
      let focusRating: 1 | 2 | 3 | 4 | 5 = 4;
      let testCount = 0;

      if (record) {
        actualHours = record.hours || 0;
        subjects = record.subjects || [];
        focusRating = record.focusRating || 4;
        testCount = record.testCount || Math.round(actualHours * 12);
      } else if (plannerHours > 0) {
        actualHours = plannerHours;
        subjects = dayPlannerItems.map(it => it.subjectCategory || it.bookTitle).filter(Boolean);
        focusRating = 4;
        testCount = dayPlannerItems.reduce((acc, it) => acc + (it.completedTestCount || it.targetTestCount || 0), 0);
      } else {
        // Use realistic seeded baseline for current week
        actualHours = defaultHoursPattern[index];
        subjects = defaultSubjectsPattern[index];
        focusRating = (index === 3 || index === 5 ? 5 : 4) as 1 | 2 | 3 | 4 | 5;
        testCount = defaultTestsPattern[index];
      }

      // Concept vs. test breakdown (typically ~55% concept, ~45% test in typical high school prep)
      const conceptHours = Number((actualHours * 0.55).toFixed(1));
      const testHours = Number((actualHours - conceptHours).toFixed(1));
      const completionRate = dailyTarget > 0 ? Math.round((actualHours / dailyTarget) * 100) : 0;

      return {
        dayId: wd.id,
        dayName: wd.name,
        shortDay: wd.short,
        dateKey,
        actualHours,
        targetHours: dailyTarget,
        conceptHours,
        testHours,
        testCount,
        subjects,
        focusRating,
        isToday,
        completionRate
      };
    });
  }, [weeklyTargetHours, updateTrigger]);

  // Aggregate Weekly KPIs
  const weeklyKpis = useMemo(() => {
    const totalActualHours = weeklyData.reduce((acc, d) => acc + d.actualHours, 0);
    const totalTests = weeklyData.reduce((acc, d) => acc + d.testCount, 0);
    const avgDailyHours = Number((totalActualHours / 7).toFixed(1));
    const completionPercent = weeklyTargetHours > 0
      ? Math.round((totalActualHours / weeklyTargetHours) * 100)
      : 0;

    // Find best day
    let bestDay = weeklyData[0];
    weeklyData.forEach(d => {
      if (d.actualHours > bestDay.actualHours) bestDay = d;
    });

    const highFocusDaysCount = weeklyData.filter(d => d.focusRating >= 4).length;

    return {
      totalActualHours: Number(totalActualHours.toFixed(1)),
      avgDailyHours,
      completionPercent,
      bestDay,
      totalTests,
      highFocusDaysCount
    };
  }, [weeklyData, weeklyTargetHours]);

  // Save quick logged study record
  const handleSaveQuickLog = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const raw = localStorage.getItem(STORAGE_KEY_HABIT);
      const habits = raw ? JSON.parse(raw) : {};

      const targetDayObj = weeklyData.find(d => d.dayId === quickLogSelectedDay) || weeklyData[0];
      const targetDateKey = targetDayObj.dateKey;

      habits[targetDateKey] = {
        date: targetDateKey,
        hours: quickLogHours,
        subjects: [quickLogSubject],
        focusRating: quickLogRating,
        testCount: quickLogTests,
        ebbinghausReviewed: true,
        notes: 'ثبت سریع از ویجت عملکرد خانه'
      };

      localStorage.setItem(STORAGE_KEY_HABIT, JSON.stringify(habits));
      window.dispatchEvent(new Event('rahbord_data_updated'));
      window.dispatchEvent(new Event('rahbord_study_habit_updated'));

      setIsQuickLogOpen(false);
      showToast(`ساعت مطالعه روز ${targetDayObj.dayName} (${quickLogHours} ساعت) با موفقیت ذخیره شد.`);
    } catch (err) {
      console.error(err);
      showToast('خطایی در ذخیره ساعت رخ داد.');
    }
  };

  // Adjust Weekly Target
  const handleUpdateWeeklyTarget = (newTarget: number) => {
    setWeeklyTargetHours(newTarget);
    try {
      localStorage.setItem(STORAGE_KEY_WEEKLY_TARGET, String(newTarget));
    } catch (e) {}
    showToast(`هدف هفتگی روی ${newTarget} ساعت تنظیم شد.`);
  };

  return (
    <div id={id} className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden space-y-6" dir="rtl">
      {/* Ambient background meshes */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Widget Header Strip */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <span>پایش و ارزیابی عملکرد هفتگی</span>
              <span className="text-slate-500" aria-hidden="true">·</span>
              <span className="text-slate-400">نمودار تعاملی Recharts</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
              ساعات مطالعه ثبت‌شده در طول هفته
            </h2>
          </div>
        </div>

        {/* View Mode Controls & Quick Log Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Segmented Filter for Chart Mode */}
          <div className="flex items-center p-1 bg-slate-950/80 border border-slate-800 rounded-xl text-xs">
            <button
              onClick={() => setViewMode('comparison')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                viewMode === 'comparison'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              مقایسه با هدف
            </button>
            <button
              onClick={() => setViewMode('breakdown')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                viewMode === 'breakdown'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              تفکیک مفهوم و تست
            </button>
            <button
              onClick={() => setViewMode('actual_only')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                viewMode === 'actual_only'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              تک‌ستونی
            </button>
          </div>

          {/* Quick Log Button */}
          <button
            onClick={() => setIsQuickLogOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-l from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-400/20 active:scale-95 transition-all cursor-pointer"
            title="ثبت یا ویرایش ساعت مطالعه روزانه"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>ثبت ساعت مطالعه</span>
          </button>

          {/* Jump to Daily Tracker */}
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('gamification')}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <span>رهگیر عادات</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="relative z-10 grid grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
        {/* KPI 1 */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>مجموع ساعات هفته:</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono text-xl sm:text-2xl font-black text-white">
            {weeklyKpis.totalActualHours} <span className="text-xs font-normal text-slate-400">ساعت</span>
          </div>
          <div className="text-[11px] text-slate-400">
            از هدف {weeklyTargetHours} ساعته
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>میانگین مطالعه روزانه:</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-mono text-xl sm:text-2xl font-black text-cyan-300">
            {weeklyKpis.avgDailyHours} <span className="text-xs font-normal text-slate-400">ساعت / روز</span>
          </div>
          <div className="text-[11px] text-slate-400">
            هدف روزانه: {(weeklyTargetHours / 7).toFixed(1)} ساعت
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>درصد تحقق هدف:</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className={`font-mono text-xl sm:text-2xl font-black ${
            weeklyKpis.completionPercent >= 100 ? 'text-emerald-400' : 'text-amber-300'
          }`}>
            {weeklyKpis.completionPercent}٪
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-l from-emerald-400 to-amber-400 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, weeklyKpis.completionPercent)}%` }}
            />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>پربازده‌ترین روز:</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="font-bold text-white text-base truncate">
            {weeklyKpis.bestDay.dayName}
          </div>
          <div className="text-[11px] text-rose-300 font-mono">
            {weeklyKpis.bestDay.actualHours} ساعت مطالعه مؤثر
          </div>
        </div>

        {/* KPI 5 */}
        <div className="col-span-2 lg:col-span-1 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>تست‌های حل‌شده:</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="font-mono text-xl sm:text-2xl font-black text-purple-300">
            {weeklyKpis.totalTests} <span className="text-xs font-normal text-slate-400">تست</span>
          </div>
          <div className="text-[11px] text-slate-400">
            میانگین {Math.round(weeklyKpis.totalTests / 7)} تست در روز
          </div>
        </div>
      </div>

      {/* Main Recharts Bar Chart Container */}
      <div className="relative z-10 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-inner space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>توزیع ساعات در ایام هفته (شنبه تا جمعه)</span>
            </span>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <span className="text-slate-400">
              خط چین افقی = خط هدف روزانه ({(weeklyTargetHours / 7).toFixed(1)} ساعت)
            </span>
          </div>

          {/* Quick Target Selector Pills */}
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>هدف هفتگی:</span>
            {[35, 42, 49, 56].map(target => (
              <button
                key={target}
                onClick={() => handleUpdateWeeklyTarget(target)}
                className={`px-2 py-0.5 rounded-md font-mono transition-colors cursor-pointer ${
                  weeklyTargetHours === target
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {target}س
              </button>
            ))}
          </div>
        </div>

        {/* Recharts BarChart Render */}
        <div className="h-72 sm:h-80 w-full pt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyData}
              margin={{ top: 15, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              
              <XAxis
                dataKey="dayName"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                allowDecimals={true}
                unit="h"
              />

              <Tooltip
                content={<CustomStudyBarTooltip />}
                cursor={{ fill: 'rgba(245, 158, 11, 0.05)' }}
              />

              {/* Reference Target Line */}
              <ReferenceLine
                y={Number((weeklyTargetHours / 7).toFixed(1))}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `هدف (${(weeklyTargetHours / 7).toFixed(1)}h)`,
                  fill: '#f59e0b',
                  fontSize: 10,
                  position: 'top'
                }}
              />

              {/* VIEW 1: Comparison with Target (Dual Bars) */}
              {viewMode === 'comparison' && (
                <>
                  <Bar
                    dataKey="actualHours"
                    name="ساعت مطالعه ثبت‌شده"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={40}
                  >
                    {weeklyData.map((entry, index) => {
                      const meetsTarget = entry.actualHours >= entry.targetHours;
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.isToday
                              ? '#f59e0b'
                              : meetsTarget
                              ? '#10b981'
                              : '#6366f1'
                          }
                        />
                      );
                    })}
                  </Bar>
                  <Bar
                    dataKey="targetHours"
                    name="هدف‌گذاری"
                    fill="#334155"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={40}
                  />
                </>
              )}

              {/* VIEW 2: Concept vs. Test Stacked Breakdown */}
              {viewMode === 'breakdown' && (
                <>
                  <Bar
                    dataKey="conceptHours"
                    name="مطالعه مفهومی"
                    stackId="a"
                    fill="#f59e0b"
                    radius={[0, 0, 0, 0]}
                    maxBarSize={44}
                  />
                  <Bar
                    dataKey="testHours"
                    name="تست و آزمون"
                    stackId="a"
                    fill="#06b6d4"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={44}
                  />
                </>
              )}

              {/* VIEW 3: Actual Study Only with Vibrant Theme */}
              {viewMode === 'actual_only' && (
                <Bar
                  dataKey="actualHours"
                  name="ساعت مطالعه"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={46}
                >
                  {weeklyData.map((entry, index) => (
                    <Cell
                      key={`single-cell-${index}`}
                      fill={
                        entry.isToday
                          ? '#f59e0b'
                          : entry.actualHours >= entry.targetHours
                          ? '#10b981'
                          : '#0ea5e9'
                      }
                    />
                  ))}
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend & Day Highlights */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-500" />
              <span>موفق (بیشتر یا مساوی هدف)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-indigo-500" />
              <span>در حال پیشرفت (کمتر از هدف)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-amber-400" />
              <span>روز جاری (امروز)</span>
            </span>
            {viewMode === 'breakdown' && (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-cyan-400" />
                <span>زمان تست‌زنی</span>
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>نکته: با کلیک روی هر ستون یا ثبت ساعت جدید، آمار همگام‌سازی می‌شود.</span>
          </div>
        </div>
      </div>

      {/* Quick Study Log Modal */}
      {isQuickLogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-amber-500/30 p-6 shadow-2xl space-y-5 text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">ثبت سریع ساعت مطالعه</h3>
              </div>
              <button
                onClick={() => setIsQuickLogOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-xs cursor-pointer"
              >
                انصراف
              </button>
            </div>

            <form onSubmit={handleSaveQuickLog} className="space-y-4 text-xs">
              {/* Day Selector */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium block">روز مورد نظر برای ثبت:</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {PERSIAN_WEEKDAYS.map(wd => (
                    <button
                      key={wd.id}
                      type="button"
                      onClick={() => setQuickLogSelectedDay(wd.id)}
                      className={`py-2 px-2 rounded-xl text-center font-medium transition-colors cursor-pointer ${
                        quickLogSelectedDay === wd.id
                          ? 'bg-amber-400 text-slate-950 font-bold shadow'
                          : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {wd.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hours Slider & Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-medium">ساعت مطالعه روز:</label>
                  <span className="font-mono text-amber-400 font-bold text-sm">
                    {quickLogHours} ساعت
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="14"
                  step="0.5"
                  value={quickLogHours}
                  onChange={(e) => setQuickLogHours(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 bg-slate-950 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Test Count */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-medium">تعداد تست‌های حل‌شده:</label>
                  <span className="font-mono text-cyan-400 font-bold text-sm">
                    {quickLogTests} تست
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="250"
                  step="5"
                  value={quickLogTests}
                  onChange={(e) => setQuickLogTests(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400 bg-slate-950 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Main Subject */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium block">درس اصلی مطالعه‌شده:</label>
                <select
                  value={quickLogSubject}
                  onChange={(e) => setQuickLogSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="زیست‌شناسی">زیست‌شناسی</option>
                  <option value="ریاضیات و حسابان">ریاضیات و حسابان</option>
                  <option value="فیزیک">فیزیک</option>
                  <option value="شیمی">شیمی</option>
                  <option value="ادبیات فارسی">ادبیات فارسی</option>
                  <option value="زبان انگلیسی">زبان انگلیسی</option>
                  <option value="عربی">عربی</option>
                  <option value="دین و زندگی">دین و زندگی</option>
                  <option value="فلسفه و منطق">فلسفه و منطق</option>
                  <option value="روان‌شناسی و اقتصاد">روان‌شناسی و اقتصاد</option>
                </select>
              </div>

              {/* Focus Rating (Stars) */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium block">کیفیت و تمرکز ذهنی:</label>
                <div className="flex items-center gap-2">
                  {([1, 2, 3, 4, 5] as const).map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setQuickLogRating(star)}
                      className={`text-lg transition-transform active:scale-125 cursor-pointer ${
                        star <= quickLogRating ? 'text-amber-400' : 'text-slate-700'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-xs text-slate-400 mr-2">
                    {quickLogRating === 5 ? 'عالی و بدون حواس‌پرتی' : quickLogRating >= 3 ? 'متوسط و مطلوب' : 'نیازمند استراحت'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsQuickLogOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md shadow-amber-400/20 cursor-pointer active:scale-95"
                >
                  ذخیره و ثبت عملکرد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 border border-amber-400/50 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
