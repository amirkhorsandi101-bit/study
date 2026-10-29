import React, { useState } from 'react';
import { Play, RotateCcw, Sparkles, TrendingUp, HelpCircle, Layers, Calendar } from 'lucide-react';

export const EbbinghausSimulator: React.FC = () => {
  const [activeTechnique, setActiveTechnique] = useState<'passive' | 'spaced'>('spaced');
  const [currentDay, setCurrentDay] = useState<number>(14);
  const [revisionsCount, setRevisionsCount] = useState<number>(3); // 1, 2, 3, 4
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Compute retention percentage at a given day
  const getRetentionRate = (day: number, technique: 'passive' | 'spaced', revs: number): number => {
    if (day <= 0) return 100;

    if (technique === 'passive') {
      // Exponential decay R = e^(-t / S) where S is small (~1.5)
      // Day 1: ~33%, Day 3: ~20%, Day 7: ~16%, Day 14: ~13%, Day 30: ~10%
      const decay = 100 * Math.exp(-day / 3.2);
      return Math.max(10, Math.round(decay));
    } else {
      // Spaced repetition model: each revision resets decay and increases stability S
      // Revision points: Day 1, Day 3, Day 10, Day 30
      if (day <= 1) {
        return Math.round(100 * Math.exp(-day / 3.2));
      } else if (day <= 3) {
        if (revs < 1) return Math.max(10, Math.round(100 * Math.exp(-day / 3.2)));
        // Reset at Day 1, S becomes ~8
        return Math.round(100 * Math.exp(-(day - 1) / 7.5));
      } else if (day <= 10) {
        if (revs < 2) return Math.max(15, Math.round(100 * Math.exp(-(day - 1) / 7.5)));
        // Reset at Day 3, S becomes ~22
        return Math.round(100 * Math.exp(-(day - 3) / 22));
      } else {
        if (revs < 3) return Math.max(25, Math.round(100 * Math.exp(-(day - 3) / 22)));
        // Reset at Day 10, S becomes ~75
        const res = Math.round(100 * Math.exp(-(day - 10) / 70));
        return Math.max(65, Math.min(96, res));
      }
    }
  };

  const currentRetention = getRetentionRate(currentDay, activeTechnique, revisionsCount);
  const passiveRetentionAtDay = getRetentionRate(currentDay, 'passive', 0);
  const gainOverPassive = Math.max(0, currentRetention - passiveRetentionAtDay);

  // SVG dimensions
  const svgWidth = 600;
  const svgHeight = 260;
  const paddingX = 40;
  const paddingY = 30;
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  // Generate SVG path points for 30 days
  const generatePathData = (technique: 'passive' | 'spaced', revs: number) => {
    const points: string[] = [];
    for (let d = 0; d <= 30; d += 0.5) {
      const rate = getRetentionRate(d, technique, revs);
      const x = paddingX + (d / 30) * chartWidth;
      const y = paddingY + chartHeight - (rate / 100) * chartHeight;
      points.push(`${d === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return points.join(' ');
  };

  // Run animated demonstration
  const runLiveSimulation = () => {
    setIsSimulating(true);
    setCurrentDay(0);
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step <= 30) {
        setCurrentDay(step);
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 80);
  };

  return (
    <section id="simulator" className="py-20 px-6 max-w-6xl mx-auto border-t border-slate-800/80">
      {/* Section Header */}
      <div className="mb-10 space-y-3">
        <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold tracking-wide">
          <span>شبیه‌ساز تعاملی نوروفیزیولوژی</span>
          <span aria-hidden="true">/</span>
          <span>منحنی فراموشی هرمان ابینگهاوس</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          شبیه‌ساز زنده اثر مرور فاصله‌دار در برابر روخوانی سنتی
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
          فرمول ریاضی ابینگهاوس نشان می‌دهد چرا مطالعه شب امتحانی یا روخوانی بدون مرور، بیش از ۸۰٪ وقت شما را هدر می‌دهد. 
          با تغییر تعداد مرورها و جابجایی روزها، ببینید اطلاعات در مغز چگونه پایدار می‌شوند.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Top: Interactive Visualization Stage */}
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          {/* Top Controls / Technique Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">روش مطالعه:</span>
              <div className="flex p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveTechnique('spaced')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                    activeTechnique === 'spaced'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  مرور فاصله‌دار + بازیابی فعال
                </button>
                <button
                  onClick={() => setActiveTechnique('passive')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                    activeTechnique === 'passive'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  روخوانی سنتی (بدون مرور فعال)
                </button>
              </div>
            </div>

            {/* Run Animation button */}
            <button
              onClick={runLiveSimulation}
              disabled={isSimulating}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg border border-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-amber-400" />
              <span>پخش گذر ۳۰ روز</span>
            </button>
          </div>

          {/* Dynamic SVG Canvas */}
          <div className="relative bg-slate-950 rounded-xl p-4 border border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
              <span>درصد پایداری در حافظه (محور عمودی)</span>
              <span>زمان سپری‌شده از روز یادگیری (محور افقی)</span>
            </div>

            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
              {/* Horizontal Grid lines */}
              {[100, 75, 50, 25, 0].map((val) => {
                const y = paddingY + chartHeight - (val / 100) * chartHeight;
                return (
                  <g key={val}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="#1e293b"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={paddingX - 10}
                      y={y + 4}
                      fill="#64748b"
                      fontSize="10"
                      textAnchor="end"
                      className="tabular-nums"
                    >
                      {val}٪
                    </text>
                  </g>
                );
              })}

              {/* Day vertical ticks */}
              {[0, 1, 3, 7, 10, 14, 21, 30].map((d) => {
                const x = paddingX + (d / 30) * chartWidth;
                return (
                  <g key={d}>
                    <line
                      x1={x}
                      y1={paddingY}
                      x2={x}
                      y2={paddingY + chartHeight}
                      stroke="#1e293b"
                      strokeWidth="1"
                    />
                    <text
                      x={x}
                      y={paddingY + chartHeight + 16}
                      fill="#94a3b8"
                      fontSize="10"
                      textAnchor="middle"
                      className="tabular-nums font-mono"
                    >
                      روز {d}
                    </text>
                  </g>
                );
              })}

              {/* Passive Decay Reference Ghost Line */}
              {activeTechnique === 'spaced' && (
                <path
                  d={generatePathData('passive', 0)}
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity="0.4"
                />
              )}

              {/* Active Chosen Technique Line */}
              <path
                d={generatePathData(activeTechnique, revisionsCount)}
                fill="none"
                stroke={activeTechnique === 'spaced' ? '#fbbf24' : '#f43f5e'}
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Revision Spike Markers */}
              {activeTechnique === 'spaced' && revisionsCount >= 1 && (
                <circle cx={paddingX + (1 / 30) * chartWidth} cy={paddingY} r="4.5" fill="#10b981" />
              )}
              {activeTechnique === 'spaced' && revisionsCount >= 2 && (
                <circle cx={paddingX + (3 / 30) * chartWidth} cy={paddingY} r="4.5" fill="#10b981" />
              )}
              {activeTechnique === 'spaced' && revisionsCount >= 3 && (
                <circle cx={paddingX + (10 / 30) * chartWidth} cy={paddingY} r="4.5" fill="#10b981" />
              )}

              {/* Current Day Cursor Line */}
              {(() => {
                const curX = paddingX + (currentDay / 30) * chartWidth;
                const curY = paddingY + chartHeight - (currentRetention / 100) * chartHeight;
                return (
                  <g>
                    <line
                      x1={curX}
                      y1={paddingY}
                      x2={curX}
                      y2={paddingY + chartHeight}
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                    />
                    <circle cx={curX} cy={curY} r="6" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
                  </g>
                );
              })()}
            </svg>

            {/* Interactive Timeline Scrubber Slider */}
            <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">بررسی وضعیت حافظه در روز انتخابی:</span>
                <span className="text-sky-400 font-bold tabular-nums">روز {currentDay} پس از یادگیری</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={currentDay}
                onChange={(e) => setCurrentDay(Number(e.target.value))}
                className="w-full accent-amber-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Quick preset days shortcuts */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs text-slate-400">
            <span>روزهای کلیدی مرور:</span>
            {[1, 3, 7, 10, 14, 30].map((day) => (
              <button
                key={day}
                onClick={() => setCurrentDay(day)}
                className={`px-2.5 py-1 rounded border transition-colors cursor-pointer tabular-nums ${
                  currentDay === day
                    ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                روز {day}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Live Metrics & Neurobiology Explanatory Deck */}
        <div className="lg:col-span-4 space-y-4">
          {/* Real-time Metric Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">وضعیت در روز {currentDay}ام</span>
              <span className={`text-xs font-bold ${
                currentRetention >= 70 ? 'text-emerald-400' :
                currentRetention >= 40 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {currentRetention >= 70 ? 'تسلط پایدار' : currentRetention >= 40 ? 'در آستانه هرس' : 'فراموشی بحرانی'}
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-4xl font-extrabold text-white tabular-nums tracking-tight">
                {currentRetention}٪
              </div>
              <p className="text-xs text-slate-400">
                میزان اطلاعات باقی‌مانده در حافظه بلندمدت
              </p>
            </div>

            {/* Active gain vs Passive */}
            {activeTechnique === 'spaced' && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{gainOverPassive}٪ اطلاعات نجات‌یافته</span>
                </div>
                <div className="text-slate-300 leading-relaxed text-[11px]">
                  اگر این فصل را فقط روخوانی می‌کردید، امروز تنها {passiveRetentionAtDay}٪ آن در یادتان مانده بود.
                </div>
              </div>
            )}

            {/* Revisions Count Controls (Only for Spaced) */}
            {activeTechnique === 'spaced' && (
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">تعداد نوبت‌های مرور فاصله‌دار:</span>
                  <span className="text-amber-400 font-bold tabular-nums">{revisionsCount} نوبت</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => setRevisionsCount(num)}
                      className={`py-1.5 text-xs rounded-lg font-medium border transition-colors cursor-pointer ${
                        revisionsCount === num
                          ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {num} بار
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Neurobiology note */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 text-xs space-y-2.5">
            <div className="flex items-center gap-2 text-sky-400 font-bold">
              <Layers className="w-4 h-4" />
              <span>پدیده تقویتی سیناپسی (LTP)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              هنگامی که بعد از چند روز مغز را وادار به تقلا برای به یاد آوردن مطلبی می‌کنید، غشای نورونی ضخیم‌تر شده و پروتئین‌های ساختاری حافظه (CREB) ترشح می‌شوند. 
              این همان دلیلی است که مرور سخت‌تر، به خاطر سپاری را دائمی می‌کند!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
