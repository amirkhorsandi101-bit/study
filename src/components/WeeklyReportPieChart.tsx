import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { 
  PieChart as PieIcon, 
  Brain, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Calendar,
  BookOpen, 
  Database,
  RefreshCw,
  Zap
} from 'lucide-react';
import { EbbinghausTopicItem, WeeklyProgressItem } from './DashboardStats';

const TOPICS_STORAGE_KEY = 'rahbord_ebbinghaus_topics_queue';
const WEEKLY_STORAGE_KEY = 'rahbord_weekly_study_data';

// Custom Tooltip for Persian Pie Chart
const CustomPieTooltip = ({ active, payload, unit = 'مبحث' }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const displayUnit = data.payload?.customUnit || unit;
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1 text-right">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: data.payload.color }} />
          <span className="font-bold text-white">{data.name}</span>
        </div>
        <p className="text-slate-300">
          مقدار: <span className="tabular-nums font-bold text-white">{data.value}</span> {displayUnit}
        </p>
        <p className="text-amber-400 font-medium">
          سهم از کل: <span className="tabular-nums font-bold">{data.payload.percentage}٪</span>
        </p>
      </div>
    );
  }
  return null;
};

export const WeeklyReportPieChart: React.FC = () => {
  const [viewMode, setViewMode] = useState<'retention_status' | 'subject_share' | 'study_hours'>('retention_status');
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  // Read data from LocalStorage
  const [topics, setTopics] = useState<EbbinghausTopicItem[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgressItem[]>([]);

  const loadData = () => {
    try {
      const savedTopics = localStorage.getItem(TOPICS_STORAGE_KEY);
      if (savedTopics) {
        setTopics(JSON.parse(savedTopics));
      }

      const savedWeekly = localStorage.getItem(WEEKLY_STORAGE_KEY);
      if (savedWeekly) {
        setWeeklyProgress(JSON.parse(savedWeekly));
      }
      setLastRefreshed(new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }));
    } catch (e) {
      console.error('Error loading data for WeeklyReportPieChart:', e);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  // Mode 1: Breakdown by retention stability & Ebbinghaus status
  const calculateRetentionData = () => {
    if (!topics || topics.length === 0) return [];

    let mastered = 0; // Cycle >= 4
    let safe = 0;     // Cycle 1-3 and on schedule
    let urgent = 0;   // Overdue (target interval exceeded)
    let fresh = 0;    // Cycle 0 (first 24h)

    topics.forEach(t => {
      const targetIntervals = [1, 3, 10, 30, 60];
      const targetDays = targetIntervals[Math.min(t.currentCycle, 4)];
      const daysRemaining = targetDays - t.lastReviewedDaysAgo;

      if (t.currentCycle >= 4) {
        mastered += 1;
      } else if (daysRemaining <= 0) {
        urgent += 1;
      } else if (t.currentCycle === 0) {
        fresh += 1;
      } else {
        safe += 1;
      }
    });

    const total = topics.length || 1;

    return [
      {
        name: 'تثبیت دائم نئوکورتکس (پایدار)',
        value: mastered,
        percentage: Math.round((mastered / total) * 100),
        color: '#10b981', // Emerald
        customUnit: 'مبحث'
      },
      {
        name: 'در چرخه مرور فعال و امن',
        value: safe,
        percentage: Math.round((safe / total) * 100),
        color: '#0ea5e9', // Sky
        customUnit: 'مبحث'
      },
      {
        name: 'مباحث تازه آموخته‌شده',
        value: fresh,
        percentage: Math.round((fresh / total) * 100),
        color: '#fbbf24', // Amber
        customUnit: 'مبحث'
      },
      {
        name: 'نیازمند مرور فوری (خطر سقوط)',
        value: urgent,
        percentage: Math.round((urgent / total) * 100),
        color: '#f43f5e', // Rose
        customUnit: 'مبحث'
      }
    ].filter(item => item.value > 0);
  };

  // Mode 2: Breakdown by Subject Share from topics
  const calculateSubjectData = () => {
    if (!topics || topics.length === 0) return [];

    const subjectCounts: Record<string, number> = {};
    topics.forEach(t => {
      subjectCounts[t.subject] = (subjectCounts[t.subject] || 0) + 1;
    });

    const total = topics.length || 1;
    const colors = ['#fbbf24', '#38bdf8', '#34d399', '#a78bfa', '#f472b6', '#fb923c', '#94a3b8'];

    return Object.entries(subjectCounts).map(([subject, count], idx) => ({
      name: subject,
      value: count,
      percentage: Math.round((count / total) * 100),
      color: colors[idx % colors.length],
      customUnit: 'مبحث'
    }));
  };

  // Mode 3: Breakdown by Daily Study Hours share across the week
  const calculateStudyHoursData = () => {
    if (!weeklyProgress || weeklyProgress.length === 0) return [];
    const totalHours = weeklyProgress.reduce((acc, curr) => acc + (curr.studyHours || 0), 0) || 1;
    const dayColors = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

    return weeklyProgress.map((item, idx) => ({
      name: item.day,
      value: Number((item.studyHours || 0).toFixed(1)),
      percentage: Math.round(((item.studyHours || 0) / totalHours) * 100),
      color: dayColors[idx % dayColors.length],
      customUnit: 'ساعت'
    }));
  };

  const getChartData = () => {
    if (viewMode === 'retention_status') return calculateRetentionData();
    if (viewMode === 'subject_share') return calculateSubjectData();
    return calculateStudyHoursData();
  };

  const chartData = getChartData();
  const totalTopics = topics.length;
  const totalWeeklyHours = weeklyProgress.reduce((acc, curr) => acc + (curr.studyHours || 0), 0);
  const totalReviewedInWeek = weeklyProgress.reduce((acc, curr) => acc + (curr.reviewedTopics || 0), 0);

  // Calculate master percentage
  const masteredCount = topics.filter(t => t.currentCycle >= 4).length;
  const masterPercentage = totalTopics > 0 ? Math.round((masteredCount / totalTopics) * 100) : 0;
  const urgentCount = topics.filter(t => {
    const targetIntervals = [1, 3, 10, 30, 60];
    const targetDays = targetIntervals[Math.min(t.currentCycle, 4)];
    return (targetDays - t.lastReviewedDaysAgo) <= 0;
  }).length;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <PieIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>گزارش‌گیر دایره‌ای عملکرد هفتگی و پایش حافظه (Pie Chart)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              ترسیم تحلیلی وضعیت تثبیت یادگیری و سهم ساعات مطالعه بر اساس دیتابیس محلی (LocalStorage)
            </p>
          </div>
        </div>

        {/* Refresh and Timestamp */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {lastRefreshed && (
            <span className="text-[11px] text-slate-500 tabular-nums">
              همگام‌سازی: {lastRefreshed}
            </span>
          )}
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            title="به‌روزرسانی داده‌ها از حافظه"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>بروزرسانی</span>
          </button>
        </div>
      </div>

      {/* Quick LocalStorage Aggregation KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/90 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>ساعات مطالعه هفته</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white tabular-nums">
            {totalWeeklyHours.toFixed(1)} <span className="text-xs text-slate-400 font-normal">ساعت</span>
          </div>
          <div className="text-[10px] text-slate-500">
            میانگین {(totalWeeklyHours / 7).toFixed(1)} ساعت روزانه
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/90 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>مباحث تثبیت دائم</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 tabular-nums">
            {masterPercentage}٪ <span className="text-xs text-slate-400 font-normal">({masteredCount} مبحث)</span>
          </div>
          <div className="text-[10px] text-emerald-500/80">
            ذخیره‌شده در نئوکورتکس
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/90 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>مباحث مرور شده هفته</span>
            <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-xl font-bold text-sky-400 tabular-nums">
            {totalReviewedInWeek} <span className="text-xs text-slate-400 font-normal">مبحث</span>
          </div>
          <div className="text-[10px] text-slate-500">
            ثبت‌شده در گزارش هفتگی
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/90 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>نیازمند مرور اضطراری</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className={`text-xl font-bold tabular-nums ${urgentCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {urgentCount} <span className="text-xs text-slate-400 font-normal">مبحث</span>
          </div>
          <div className="text-[10px] text-slate-500">
            فاصله بحرانی فراموشی
          </div>
        </div>
      </div>

      {/* Mode Switcher Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 w-fit text-xs">
        <button
          onClick={() => setViewMode('retention_status')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
            viewMode === 'retention_status'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ۱. توزیع پایداری حافظه (ابینگهاوس)
        </button>
        <button
          onClick={() => setViewMode('subject_share')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
            viewMode === 'subject_share'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ۲. سهم موضوعی دروس
        </button>
        <button
          onClick={() => setViewMode('study_hours')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
            viewMode === 'study_hours'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ۳. سهم روزها از ساعات مطالعه
        </button>
      </div>

      {/* Chart and Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Pie Chart Canvas */}
        <div className="lg:col-span-7 h-80 w-full relative flex items-center justify-center">
          {chartData.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-500">
              داده‌ای برای ترسیم نمودار یافت نشد. مباحث یا ساعات جدیدی در داشبورد ثبت کنید.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={105}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="#020617"
                  strokeWidth={2.5}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
                  formatter={(val, entry: any) => (
                    <span className="text-slate-300 text-xs">
                      {val} ({entry.payload?.percentage}٪)
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}

          {/* Center Donut Hole Text */}
          {chartData.length > 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-6">
              {viewMode === 'study_hours' ? (
                <>
                  <span className="text-2xl font-extrabold text-amber-400 tabular-nums">
                    {totalWeeklyHours.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-slate-400">مجموع ساعت</span>
                </>
              ) : (
                <>
                  <span className="text-2xl font-extrabold text-white tabular-nums">
                    {totalTopics}
                  </span>
                  <span className="text-[10px] text-slate-400">کل مباحث</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Analytical Legend & Detailed Breakdown */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 pb-1 border-b border-slate-800">
            <Brain className="w-3.5 h-3.5 text-amber-400" />
            <span>جزئیات آماری بخش‌های نمودار دایره‌ای:</span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {chartData.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-200 font-medium truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-bold text-white tabular-nums">
                    {item.value} {item.customUnit || 'مبحث'}
                  </span>
                  <span className="text-amber-400 font-bold text-[11px] tabular-nums">
                    {item.percentage}٪
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Scientific Insight Card */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/95 leading-relaxed">
            {viewMode === 'retention_status' && (
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>اصل سیناپسی ابینگهاوس:</strong> هدف شناختی این است که سهم رنگ سبز (تثبیت نئوکورتکس) به بالای ۵۰٪ برسد تا مطالب بدون استرس و فراموشی در امتحانات بازیابی شوند.
                </span>
              </div>
            )}
            {viewMode === 'subject_share' && (
              <div className="flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  <strong>توازن میان‌رشته‌ای:</strong> انحراف بیش از ۴۰ درصدی به سمت یک درس منفرد، بازدهی شناختی را کاهش می‌دهد؛ تنوع درسی باعث تحریک دوپامین و جلوگیری از اشباع ذهنی می‌شود.
                </span>
              </div>
            )}
            {viewMode === 'study_hours' && (
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>توزیع یکنواخت هفتگی:</strong> نوسانات شدید بین روزهای پرفشار و روزهای خالی منجر به فرسودگی شناختی می‌شود؛ حفظ میانگین روزانه با نوسان کمتر از ۳۰٪ بهینه‌ترین الگوست.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
