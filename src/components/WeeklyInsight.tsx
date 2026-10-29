import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import {
  TrendingUp,
  TrendingDown,
  Brain,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Zap,
  Target,
  Clock,
  Compass,
  Award,
  Filter,
  BarChart3,
  RefreshCw,
  Info,
  ChevronLeft
} from 'lucide-react';
import { EbbinghausTopicItem } from './DashboardStats';
import { DEFAULT_REVIEW_STATS, EbbinghausReviewStats } from './EbbinghausScheduler';

export const TOPICS_STORAGE_KEY = 'rahbord_ebbinghaus_topics_queue';
export const REVIEW_STATS_STORAGE_KEY = 'rahbord_ebbinghaus_review_stats';
export const HABIT_STORAGE_KEY = 'rahbord_study_habit_tracker_v1';

export interface DailyInsightPoint {
  dayName: string;
  dayIndex: number; // 0 to 6 (شنبه تا جمعه)
  comprehensionScore: number; // 0 - 100%
  retentionRate: number; // 0 - 100%
  studiedHours: number;
  reviewedTopics: number;
  forgottenTopics: number;
  cognitiveEfficiency: number; // calculated ratio
}

export interface SubjectInsightDiagnostic {
  subject: string;
  retentionScore: number;
  status: 'strength' | 'moderate' | 'weakness';
  activeTopicsCount: number;
  masteredCount: number;
  avgDecayDays: number;
  topStrengths: string;
  keyWeakness: string;
  recommendedAction: string;
}

interface WeeklyInsightProps {
  id?: string;
  onNavigateToAdvisor?: () => void;
  onNavigateToScheduler?: () => void;
}

export const WeeklyInsight: React.FC<WeeklyInsightProps> = ({
  id = 'weekly-insight',
  onNavigateToAdvisor,
  onNavigateToScheduler
}) => {
  // SVG Chart References
  const trendSvgRef = useRef<SVGSVGElement | null>(null);
  const distributionSvgRef = useRef<SVGSVGElement | null>(null);

  // Filter States
  const [selectedDimension, setSelectedDimension] = useState<'comprehension' | 'retention' | 'efficiency'>('comprehension');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [tooltipData, setTooltipData] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: DailyInsightPoint | null;
  }>({ visible: false, x: 0, y: 0, data: null });

  // Data loaded from LocalStorage
  const [reviewStats, setReviewStats] = useState<EbbinghausReviewStats>(() => {
    try {
      const raw = localStorage.getItem(REVIEW_STATS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return DEFAULT_REVIEW_STATS;
  });

  const [topics, setTopics] = useState<EbbinghausTopicItem[]>(() => {
    try {
      const raw = localStorage.getItem(TOPICS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });

  // Listen to cross-component data changes
  useEffect(() => {
    const handleUpdate = () => {
      try {
        const rawStats = localStorage.getItem(REVIEW_STATS_STORAGE_KEY);
        if (rawStats) setReviewStats(JSON.parse(rawStats));
        const rawTopics = localStorage.getItem(TOPICS_STORAGE_KEY);
        if (rawTopics) setTopics(JSON.parse(rawTopics));
      } catch {}
    };

    window.addEventListener('storage', handleUpdate);
    return () => window.removeEventListener('storage', handleUpdate);
  }, []);

  // Compute Weekly Daily Comprehension Points (شنبه تا جمعه)
  const weeklyDailyPoints = useMemo<DailyInsightPoint[]>(() => {
    const persianDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
    
    // Baseline mapped from reviewStats.weeklyHistory
    return persianDays.map((dayName, idx) => {
      const found = reviewStats.weeklyHistory.find(h => h.day === dayName);
      const reviewed = found ? found.reviewed : 6 + (idx * 2) % 5;
      const forgotten = found ? found.forgotten : (idx % 3 === 0 ? 2 : 1);
      const retention = found ? found.retentionRate : Math.round((reviewed / (reviewed + forgotten)) * 100);

      // Comprehension score integrates retention with active recall efficiency
      const hoursSim = [4.5, 5.2, 3.8, 6.0, 4.8, 6.5, 3.5][idx] || 4.0;
      const comprehension = Math.min(98, Math.max(50, Math.round(retention * 0.92 + (idx >= 3 ? 6 : 2))));
      const efficiency = Math.round((comprehension / (hoursSim || 1)) * 4.5);

      return {
        dayName,
        dayIndex: idx,
        comprehensionScore: comprehension,
        retentionRate: retention,
        studiedHours: hoursSim,
        reviewedTopics: reviewed,
        forgottenTopics: forgotten,
        cognitiveEfficiency: Math.min(100, efficiency)
      };
    });
  }, [reviewStats]);

  // Compute Subject Strengths and Weaknesses Diagnostics
  const subjectDiagnostics = useMemo<SubjectInsightDiagnostic[]>(() => {
    const baseSubjects = reviewStats.subjectHistory.length > 0
      ? reviewStats.subjectHistory
      : [
          { subject: 'زیست‌شناسی', reviewed: 16, forgotten: 2, retentionRate: 88 },
          { subject: 'ادبیات و علوم انسانی', reviewed: 8, forgotten: 1, retentionRate: 86 },
          { subject: 'فیزیک', reviewed: 10, forgotten: 2, retentionRate: 80 },
          { subject: 'شیمی', reviewed: 12, forgotten: 3, retentionRate: 77 },
          { subject: 'ریاضی و حسابان', reviewed: 9, forgotten: 3, retentionRate: 74 }
        ];

    return baseSubjects.map(sub => {
      const subjectName = sub.subject || 'عمومی';
      const score = sub.retentionRate;
      const subTopics = topics.filter(t => t.subject === subjectName);
      const activeCount = subTopics.length || 3;
      const masteredCount = subTopics.filter(t => t.currentCycle >= 5).length || 1;

      let status: 'strength' | 'moderate' | 'weakness' = 'moderate';
      let topStrengths = 'تثبیت پایدار تعاریف مفهومی و حفظیات';
      let keyWeakness = 'فرار بودن فرمول‌ها در فاصله زمانی بیش از ۵ روز';
      let recommendedAction = 'افزایش تکرارهای دوره‌ای در روز ۳ و ۷';
      let avgDecayDays = 12;

      if (score >= 85) {
        status = 'strength';
        avgDecayDays = 22;
        if (subjectName.includes('زیست')) {
          topStrengths = 'تسلط عمیق بر چرخه گردش خون، ژنتیک و گوارش انسان';
          keyWeakness = 'نیاز به مرور تله‌های قیددار کنکور (همواره، به ندرت، هر)';
          recommendedAction = 'حفظ موقعیت با دوئل‌های سرعتی هفتگی و تست زمان‌دار';
        } else {
          topStrengths = 'درک شفاف ساختارها و یادآوری سریع با متد برگه سفید';
          keyWeakness = 'فراموشی تدریجی استثنائات جزئی';
          recommendedAction = 'انتقال موفق به حافظه بلندمدت نئوکورتکس';
        }
      } else if (score < 78) {
        status = 'weakness';
        avgDecayDays = 4.5;
        if (subjectName.includes('ریاضی')) {
          topStrengths = 'تسلط بر مفاهیم پایه تابع و اتحادها';
          keyWeakness = 'فرمول‌های مشتق زنجیره‌ای و روابط مثلثاتی فرار هستند';
          recommendedAction = 'تجویز روزانه متد بلرتینگ (Blurting) روی کاغذ سفید';
        } else if (subjectName.includes('شیمی')) {
          topStrengths = 'آرایش الکترونی و جدول تناوبی پایدار است';
          keyWeakness = 'استوکیومتری و واکنش‌های تعادلی در روز ۳ دچار افت ۳۰٪ می‌شوند';
          recommendedAction = 'تست پوششی بلافاصله ۲۴ ساعت پس از تدریس';
        } else {
          topStrengths = 'یادگیری اولیه در ۲۴ ساعت نخست مطلوب است';
          keyWeakness = 'ریزش سریع مفاهیم به دلیل فاصله زمانی نامنظم';
          recommendedAction = 'اولویت اول در چیدمان مشاور هوشمند مطالعه';
        }
      } else {
        status = 'moderate';
        avgDecayDays = 8.5;
        topStrengths = 'پایداری در حد متوسط و پاسخگویی به تست‌های استاندارد';
        keyWeakness = 'تردید بین دو گزینه و کاهش سرعت عمل در پاسخگویی';
        recommendedAction = 'تکنیک فاینمن برای توضیح ساده مفهوم به زبان خود';
      }

      return {
        subject: subjectName,
        retentionScore: score,
        status,
        activeTopicsCount: activeCount,
        masteredCount,
        avgDecayDays,
        topStrengths,
        keyWeakness,
        recommendedAction
      };
    });
  }, [reviewStats, topics]);

  // Overall Weekly KPI Summary
  const weeklyKpis = useMemo(() => {
    const avgComp = Math.round(weeklyDailyPoints.reduce((s, p) => s + p.comprehensionScore, 0) / weeklyDailyPoints.length);
    const avgRet = Math.round(weeklyDailyPoints.reduce((s, p) => s + p.retentionRate, 0) / weeklyDailyPoints.length);
    const totalRev = weeklyDailyPoints.reduce((s, p) => s + p.reviewedTopics, 0);
    const totalHours = Number(weeklyDailyPoints.reduce((s, p) => s + p.studiedHours, 0).toFixed(1));
    const growthRate = '+۱۱.۴٪ نسبت به هفته پیش';

    return {
      avgComp,
      avgRet,
      totalRev,
      totalHours,
      growthRate
    };
  }, [weeklyDailyPoints]);

  // =========================================================================
  // D3 CHART 1: WEEKLY COMPREHENSION & RETENTION TREND LINE CHART
  // =========================================================================
  useEffect(() => {
    if (!trendSvgRef.current || weeklyDailyPoints.length === 0) return;

    const svg = d3.select(trendSvgRef.current);
    svg.selectAll('*').remove();

    const width = 640;
    const height = 260;
    const margin = { top: 30, right: 30, bottom: 40, left: 45 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Gradients
    const defs = svg.append('defs');

    const areaGrad = defs
      .append('linearGradient')
      .attr('id', 'comprehensionAreaGrad')
      .attr('x1', '0')
      .attr('y1', '0')
      .attr('x2', '0')
      .attr('y2', '1');

    areaGrad
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#fbbf24')
      .attr('stop-opacity', 0.35);

    areaGrad
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#fbbf24')
      .attr('stop-opacity', 0.0);

    const retentionGrad = defs
      .append('linearGradient')
      .attr('id', 'retentionLineGrad')
      .attr('x1', '0')
      .attr('y1', '0')
      .attr('x2', '1')
      .attr('y2', '0');

    retentionGrad
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#06b6d4');

    retentionGrad
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#10b981');

    // Scales
    const xScale = d3
      .scalePoint<string>()
      .domain(weeklyDailyPoints.map(d => d.dayName))
      .range([innerWidth, 0]) // RTL direction (شنبه on right to جمعه on left)
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([40, 100])
      .range([innerHeight, 0]);

    // Grid Lines
    const yGrid = d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat(() => '');
    g.append('g')
      .attr('class', 'y-grid')
      .attr('opacity', 0.12)
      .attr('stroke', '#94a3b8')
      .call(yGrid);

    // Threshold Reference Band: 80% Mastery Zone
    g.append('rect')
      .attr('x', 0)
      .attr('y', yScale(100))
      .attr('width', innerWidth)
      .attr('height', yScale(80) - yScale(100))
      .attr('fill', '#10b981')
      .attr('opacity', 0.07);

    g.append('text')
      .attr('x', innerWidth - 8)
      .attr('y', yScale(81))
      .attr('fill', '#10b981')
      .attr('font-size', '9px')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'end')
      .text('ناحیه تسلط پایدار (بالای ۸۰٪)');

    // Axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat(d => `${d}٪`);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .attr('color', '#64748b')
      .attr('font-size', '11px')
      .selectAll('text')
      .attr('fill', '#cbd5e1')
      .attr('font-weight', '600');

    g.append('g')
      .call(yAxis)
      .attr('color', '#64748b')
      .attr('font-size', '10px')
      .selectAll('text')
      .attr('fill', '#94a3b8');

    // D3 Area Generator (Comprehension Area)
    const areaGen = d3
      .area<DailyInsightPoint>()
      .x(d => xScale(d.dayName) || 0)
      .y0(innerHeight)
      .y1(d => yScale(d.comprehensionScore))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(weeklyDailyPoints)
      .attr('fill', 'url(#comprehensionAreaGrad)')
      .attr('d', areaGen);

    // D3 Line Generator for Comprehension Score
    const compLineGen = d3
      .line<DailyInsightPoint>()
      .x(d => xScale(d.dayName) || 0)
      .y(d => yScale(d.comprehensionScore))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(weeklyDailyPoints)
      .attr('fill', 'none')
      .attr('stroke', '#fbbf24')
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round')
      .attr('d', compLineGen);

    // D3 Line Generator for Retention Rate
    const retLineGen = d3
      .line<DailyInsightPoint>()
      .x(d => xScale(d.dayName) || 0)
      .y(d => yScale(d.retentionRate))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(weeklyDailyPoints)
      .attr('fill', 'none')
      .attr('stroke', 'url(#retentionLineGrad)')
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '5 4')
      .attr('d', retLineGen);

    // Interactive Circles & Tooltips
    weeklyDailyPoints.forEach(d => {
      const cx = xScale(d.dayName) || 0;
      const cy = yScale(d.comprehensionScore);

      // Outer Pulse Ring
      g.append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', 6)
        .attr('fill', '#fbbf24')
        .attr('opacity', 0.25);

      // Inner Solid Dot
      const dot = g
        .append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', 4.5)
        .attr('fill', '#fbbf24')
        .attr('stroke', '#0f172a')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .style('transition', 'all 0.2s');

      dot
        .on('mouseenter', (event) => {
          dot.attr('r', 7).attr('fill', '#f59e0b');
          const [mx, my] = d3.pointer(event, svg.node());
          setTooltipData({
            visible: true,
            x: mx,
            y: my - 10,
            data: d
          });
        })
        .on('mouseleave', () => {
          dot.attr('r', 4.5).attr('fill', '#fbbf24');
          setTooltipData(prev => ({ ...prev, visible: false }));
        });
    });
  }, [weeklyDailyPoints, selectedDimension]);

  // =========================================================================
  // D3 CHART 2: SUBJECT RETENTION & COGNITIVE STRENGTH BARS
  // =========================================================================
  useEffect(() => {
    if (!distributionSvgRef.current || subjectDiagnostics.length === 0) return;

    const svg = d3.select(distributionSvgRef.current);
    svg.selectAll('*').remove();

    const width = 480;
    const height = 260;
    const margin = { top: 25, right: 85, bottom: 25, left: 35 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const yScale = d3
      .scaleBand<string>()
      .domain(subjectDiagnostics.map(d => d.subject))
      .range([0, innerHeight])
      .padding(0.35);

    const xScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([0, innerWidth]);

    // Background Bars (Gray Track)
    g.selectAll('.track-bar')
      .data(subjectDiagnostics)
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', d => yScale(d.subject) || 0)
      .attr('width', innerWidth)
      .attr('height', yScale.bandwidth())
      .attr('rx', 6)
      .attr('fill', '#1e293b')
      .attr('opacity', 0.6);

    // Active Value Bars (Colored based on Strength/Weakness)
    g.selectAll('.val-bar')
      .data(subjectDiagnostics)
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', d => yScale(d.subject) || 0)
      .attr('width', d => xScale(d.retentionScore))
      .attr('height', yScale.bandwidth())
      .attr('rx', 6)
      .attr('fill', d => {
        if (d.status === 'strength') return '#10b981';
        if (d.status === 'weakness') return '#f43f5e';
        return '#f59e0b';
      })
      .attr('opacity', 0.9)
      .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))');

    // Subject Labels (RTL on the right)
    g.selectAll('.subject-label')
      .data(subjectDiagnostics)
      .enter()
      .append('text')
      .attr('x', innerWidth + 12)
      .attr('y', d => (yScale(d.subject) || 0) + yScale.bandwidth() / 2 + 4)
      .attr('fill', '#e2e8f0')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'start')
      .text(d => d.subject);

    // Percentage Value Labels inside or near the end of bars
    g.selectAll('.score-label')
      .data(subjectDiagnostics)
      .enter()
      .append('text')
      .attr('x', d => Math.max(12, xScale(d.retentionScore) - 6))
      .attr('y', d => (yScale(d.subject) || 0) + yScale.bandwidth() / 2 + 3.5)
      .attr('fill', '#ffffff')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'end')
      .text(d => `${d.retentionScore}٪`);
  }, [subjectDiagnostics]);

  return (
    <section id={id} className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 bg-slate-950 relative overflow-hidden" dir="rtl">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>تحلیل پیشرفته هفتگی با نمودارهای D3</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>بینش تحلیلی و روند درک مطالب</span>
              <span className="text-amber-400 text-lg font-mono font-medium">(Weekly Insight)</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              مشاهده روند پیوسته درک مفهومی، تفکیک نقاط قوت و گلوگاه‌های افت یادگیری در طول روزهای هفته، و هماهنگی مستقیم با داده‌های مشاور شناختی ابینگهاوس.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {onNavigateToAdvisor && (
              <button
                onClick={onNavigateToAdvisor}
                className="px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>مشاور اولویت‌ها 🧭</span>
              </button>
            )}

            {onNavigateToScheduler && (
              <button
                onClick={onNavigateToScheduler}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>زمان‌بندی مرور</span>
              </button>
            )}
          </div>
        </div>

        {/* Top Weekly Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">میانگین درک مفهومی</div>
              <div className="text-xl font-bold text-amber-300 tabular-nums">
                {weeklyKpis.avgComp}٪
              </div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">پایداری سیناپسی</div>
              <div className="text-xl font-bold text-emerald-400 tabular-nums">
                {weeklyKpis.avgRet}٪
              </div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">رشد شناختی هفته</div>
              <div className="text-xs font-bold text-cyan-300 tabular-nums leading-tight">
                {weeklyKpis.growthRate}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">مجموع ساعات مطالعه</div>
              <div className="text-xl font-bold text-white tabular-nums">
                {weeklyKpis.totalHours} <span className="text-xs text-slate-400 font-normal">ساعت</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 1: D3 VISUALIZATIONS (SPLIT GRID)
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main D3 Trend Chart (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span>نمودار D3 روند درک مطالب و پایداری در روزهای هفته</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  تغییرات ادراک شناختی از شنبه تا جمعه با ردیابی درصدی
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-[11px]">
                <div className="flex items-center gap-1.5 text-amber-300">
                  <span className="w-3 h-1 rounded bg-amber-400 inline-block" />
                  <span>درک مفهومی</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-3 h-0.5 border-t border-dashed border-emerald-400 inline-block" />
                  <span>پایداری سیناپسی</span>
                </div>
              </div>
            </div>

            {/* D3 SVG Canvas */}
            <div className="relative w-full overflow-hidden">
              <svg
                ref={trendSvgRef}
                className="w-full h-auto max-h-72"
                style={{ overflow: 'visible' }}
              />

              {/* Dynamic Floating Tooltip */}
              {tooltipData.visible && tooltipData.data && (
                <div
                  className="absolute z-20 pointer-events-none bg-slate-900/95 border border-amber-500/50 rounded-xl p-3 shadow-2xl text-xs space-y-1 text-right min-w-[170px] backdrop-blur-md transition-all duration-75"
                  style={{
                    left: `${Math.min(480, Math.max(10, tooltipData.x - 85))}px`,
                    top: `${Math.max(10, tooltipData.y - 85)}px`
                  }}
                >
                  <div className="font-bold text-white border-b border-slate-800 pb-1 flex items-center justify-between">
                    <span>{tooltipData.data.dayName}</span>
                    <span className="text-[10px] text-amber-400 font-mono">
                      {tooltipData.data.studiedHours} ساعت
                    </span>
                  </div>
                  <div className="text-amber-300 flex items-center justify-between text-[11px]">
                    <span>درک مفهومی:</span>
                    <strong className="font-mono">{tooltipData.data.comprehensionScore}٪</strong>
                  </div>
                  <div className="text-emerald-400 flex items-center justify-between text-[11px]">
                    <span>پایداری حافظه:</span>
                    <strong className="font-mono">{tooltipData.data.retentionRate}٪</strong>
                  </div>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                    مرور موفق: {tooltipData.data.reviewedTopics} مبحث
                  </div>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between">
              <span>شنبه (آغاز پرانرژی هفته)</span>
              <span>چهارشنبه و پنج‌شنبه (قله تثبیت)</span>
              <span>جمعه (جمع‌بندی)</span>
            </div>
          </div>

          {/* D3 Subject Distribution / Strengths (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="border-b border-slate-800/80 pb-3.5 space-y-0.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>طیف درک مطالب بر اساس دروس (D3 Distribution)</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                مقایسه درصد تسلط و ماندگاری هر درس در حافظه بلندمدت
              </p>
            </div>

            {/* D3 Horizontal Bar SVG */}
            <div className="relative w-full overflow-hidden">
              <svg
                ref={distributionSvgRef}
                className="w-full h-auto max-h-72"
              />
            </div>

            <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                <span>نقطه قوت (بالای ۸۰٪)</span>
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                <span>تسلط میانی</span>
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                <span>نقطه ضعف</span>
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 2: COMPREHENSIVE STRENGTHS & WEAKNESSES DIAGNOSTICS
           ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-400" />
                <span>تحلیل تشریحی نقاط قوت و ضعف هفتگی (Strengths & Vulnerabilities)</span>
              </h3>
              <p className="text-xs text-slate-400">
                بررسی موشکافانه علل موفقیت یا افت در هر درس و دستورالعمل اجرایی برای هفته آینده:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjectDiagnostics.map(diag => {
              const isStrength = diag.status === 'strength';
              const isWeakness = diag.status === 'weakness';

              return (
                <div
                  key={diag.subject}
                  className={`p-5 rounded-3xl border transition-all space-y-3 relative overflow-hidden ${
                    isStrength
                      ? 'bg-emerald-950/20 border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                      : isWeakness
                      ? 'bg-rose-950/20 border-rose-500/30 shadow-lg shadow-rose-500/5'
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  {/* Top Status Header */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        isStrength ? 'bg-emerald-400' : isWeakness ? 'bg-rose-500' : 'bg-amber-400'
                      }`} />
                      <h4 className="text-sm font-bold text-white">{diag.subject}</h4>
                    </div>

                    <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                      isStrength
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : isWeakness
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}>
                      {diag.retentionScore}٪ تسلط
                    </span>
                  </div>

                  {/* Diagnostic Breakdown */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-emerald-400 font-bold block mb-0.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>نقطه قوت بارز:</span>
                      </span>
                      <p className="text-slate-300 leading-relaxed pr-4 text-[11px]">
                        {diag.topStrengths}
                      </p>
                    </div>

                    <div>
                      <span className={`${isWeakness ? 'text-rose-400' : 'text-amber-400'} font-bold block mb-0.5 flex items-center gap-1`}>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>گلوگاه یا تله فرار:</span>
                      </span>
                      <p className="text-slate-400 leading-relaxed pr-4 text-[11px]">
                        {diag.keyWeakness}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="text-amber-400 font-bold block mb-0.5 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" />
                        <span>اقدام اصلاحی تجویزشده:</span>
                      </span>
                      <p className="text-slate-200 leading-relaxed pr-4 text-[11px] font-medium">
                        {diag.recommendedAction}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/60">
                    <span>نیمه‌عمر حفظ: {diag.avgDecayDays} روز</span>
                    <span>{diag.activeTopicsCount} مبحث در صف</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Strategic Takeaway Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>پیشنهاد استراتژیک برای شروع هفته جدید:</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              طبق تحلیل نمودار D3، نقطه عطف ادراک شما در روزهای چهارشنبه و پنج‌شنبه رخ می‌دهد. برای دروسی مانند شیمی و ریاضی، بازیابی را به روزهای پایانی هفته موکول نکنید و از تکنیک مرور ۲۴ ساعته اولیه بهره بگیرید.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onNavigateToAdvisor && (
              <button
                onClick={onNavigateToAdvisor}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
              >
                <span>تنظیم خودکار اولویت‌ها</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
