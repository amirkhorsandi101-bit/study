import React, { useState, useEffect } from 'react';
import { DIAGNOSTIC_QUESTIONS } from '../data/problemsData';
import { 
  CheckCircle2, 
  RotateCcw, 
  AlertTriangle, 
  Zap, 
  Brain, 
  Compass, 
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface DiagnosticQuizProps {
  onNavigateToToolkit: () => void;
}

export const DiagnosticQuiz: React.FC<DiagnosticQuizProps> = ({ onNavigateToToolkit }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem('rahbord_diagnostic_quiz_answers');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  const [isCompleted, setIsCompleted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('rahbord_diagnostic_quiz_completed') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [currentStep, setCurrentStep] = useState<number>(() => {
    try {
      const savedStep = localStorage.getItem('rahbord_diagnostic_quiz_step');
      if (savedStep) return Number(savedStep) || 0;
    } catch (e) {
      // ignore
    }
    return 0;
  });

  useEffect(() => {
    try {
      localStorage.setItem('rahbord_diagnostic_quiz_answers', JSON.stringify(selectedAnswers));
      localStorage.setItem('rahbord_diagnostic_quiz_completed', String(isCompleted));
      localStorage.setItem('rahbord_diagnostic_quiz_step', String(currentStep));
    } catch (e) {
      console.error(e);
    }
  }, [selectedAnswers, isCompleted, currentStep]);

  const totalQuestions = DIAGNOSTIC_QUESTIONS.length;
  const currentQ = DIAGNOSTIC_QUESTIONS[currentStep];

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
    try {
      localStorage.removeItem('rahbord_diagnostic_quiz_answers');
      localStorage.removeItem('rahbord_diagnostic_quiz_completed');
      localStorage.removeItem('rahbord_diagnostic_quiz_step');
    } catch (e) {
      // ignore
    }
  };

  // Compute category scores
  const calculateResults = () => {
    const scores = {
      retrieval: { total: 0, max: 0, label: 'بازیابی فعال و عمق فهم' },
      execution: { total: 0, max: 0, label: 'قدرت شروع و مهار حواس‌پرتی' },
      spaced: { total: 0, max: 0, label: 'پایداری حافظه و مرور فاصله‌دار' },
      resilience: { total: 0, max: 0, label: 'انعطاف ذهنی و انرژی بیولوژیک' }
    };

    DIAGNOSTIC_QUESTIONS.forEach(q => {
      const selectedOptIdx = selectedAnswers[q.id];
      const opt = typeof selectedOptIdx === 'number' ? q.options[selectedOptIdx] : null;
      scores[q.category].max += 3;
      if (opt) {
        scores[q.category].total += opt.score;
      }
    });

    const categoryPercentages = {
      retrieval: Math.round((scores.retrieval.total / scores.retrieval.max) * 100),
      execution: Math.round((scores.execution.total / scores.execution.max) * 100),
      spaced: Math.round((scores.spaced.total / scores.spaced.max) * 100),
      resilience: Math.round((scores.resilience.total / scores.resilience.max) * 100)
    };

    // Find the weakest dimension (primary bottleneck)
    const sortedCategories = Object.entries(categoryPercentages).sort((a, b) => a[1] - b[1]);
    const weakestCategory = sortedCategories[0][0] as keyof typeof scores;
    const weakestScore = sortedCategories[0][1];

    let bottleneckTitle = '';
    let bottleneckWhy = '';
    let prescription: string[] = [];

    if (weakestCategory === 'retrieval') {
      bottleneckTitle = 'توهم تسلط و اتکای بیش از حد به روخوانی منفعل';
      bottleneckWhy = 'شما زمان زیادی را صرف خواندن و دیدن می‌کنید اما مغزتان به ندرت مجبور به بیرون کشیدن داده‌ها از حافظه بدون کمک کتاب می‌شود.';
      prescription = [
        'از فردا به ازای هر ۳۰ دقیقه خواندن، حداقل ۱۰ دقیقه تکنیک برگه سفید (Blurting) اجرا کنید.',
        'هنگام حل تست، قبل از نگاه کردن به پاسخنامه، حداقل ۴ دقیقه برای یافتن سرنخ تقلا کنید.',
        'مفاهیم پیچیده را به زبان خیلی ساده برای یک دوست یا به صورت صوتی برای خودتان توضیح دهید.'
      ];
    } else if (weakestCategory === 'execution') {
      bottleneckTitle = 'سد انرژی شروع (اهمال‌کاری) و پسماند حواس‌پرتی گوشی';
      bottleneckWhy = 'شروع مطالعه برای مغز شما هزینه روانی بالایی دارد و همزمان دسترسی آسان به موبایل، تمرکز عمیق را به تکه‌های کوچک ۲۳ دقیقه‌ای خرد می‌کند.';
      prescription = [
        'قانون ۵ دقیقه را به کار ببندید: فقط برای ۳۰۰ ثانیه مطالعه تعهد بدهید تا مقاومت ذهنی شکسته شود.',
        'گوشی را حین پارت مطالعه در حالت پرواز قرار داده و به اتاق دیگری منتقل کنید.',
        'یک کاغذ «تخلیه افکار» کنار دست بگذارید و هر فکر ناگهانی را بدون وقفه در مطالعه یادداشت کنید.'
      ];
    } else if (weakestCategory === 'spaced') {
      bottleneckTitle = 'فراموشی تصاعدی در اثر نبود تقویم مرور فاصله‌دار';
      bottleneckWhy = 'مطالبی که می‌خوانید عالی یاد گرفته می‌شوند، اما به دلیل عدم یادآوری در روزهای ۱، ۳ و ۱۰، منحنی ابینگهاوس آن‌ها را سریعاً پاک می‌کند.';
      prescription = [
        'دروسی که امروز می‌خوانید را با یک یادداشت کوچک برای روز ۳ و ۱۰ آینده در تقویم نشانه بگذارید.',
        'سیستم تست‌های نشان‌دار را پیاده کنید؛ در دورهای مرور فقط تست‌های اشتباه و شک‌دار قبلی را حل کنید.',
        'مرور را روخوانی نکنید؛ بلکه با حل تست زمان‌دار یا بازیابی ذهنی مرور کنید.'
      ];
    } else {
      bottleneckTitle = 'کمال‌گرایی شکننده و افت انرژی و خواب بیولوژیک';
      bottleneckWhy = 'تفکر همه یا هیچ و کمبود خواب عمیق باعث می‌شود با کوچک‌ترین ناهماهنگی در برنامه، روحیه خود را ببازید و دچار خستگی مزمن شوید.';
      prescription = [
        'در طول هفته یک بلوک شناور ۲ ساعته خالی بگذارید تا عقب‌ماندگی‌ها بدون استرس جبران شوند.',
        'خواب شبانه را به حداقل ۷.۵ ساعت برسانید و نور آبی موبایل را نیم ساعت قبل از خواب خاموش کنید.',
        'به جای «برنامه کامل و بی‌نقص»، روی «استمرار در روزهای ناکامل» تمرکز کنید.'
      ];
    }

    return {
      scores,
      categoryPercentages,
      weakestCategory,
      weakestScore,
      bottleneckTitle,
      bottleneckWhy,
      prescription
    };
  };

  const results = isCompleted ? calculateResults() : null;

  return (
    <section id="quiz" className="py-20 px-6 max-w-4xl mx-auto border-t border-slate-800/80">
      {/* Section Header */}
      <div className="mb-10 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs text-amber-400 font-semibold tracking-wide">
          <span>ارزیابی چندبعدی شناختی</span>
          <span aria-hidden="true">/</span>
          <span>شناسایی گلوگاه اصلی شما</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          تست تشخیصی: بزرگ‌ترین مانع مطالعه شما در کجاست؟
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          به ۸ سناریوی واقعی زیر با صداقت کامل پاسخ دهید تا سیستم هوشمند، ریشه پنهان افت بازدهی شما را تحلیل کند.
        </p>
      </div>

      {!isCompleted ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          {/* Progress bar and counter */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>پرسش {currentStep + 1} از {totalQuestions}</span>
              <span className="tabular-nums font-mono text-amber-400">
                {Math.round(((currentStep + 1) / totalQuestions) * 100)}٪ تکمیل شده
              </span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-amber-400 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Question Title */}
          <div className="pt-2">
            <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = selectedAnswers[currentQ.id] === optIdx;
              return (
                <div key={optIdx} className="space-y-2">
                  <button
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-4 rounded-xl text-right transition-all flex items-start gap-3 border cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/70 text-white shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950 text-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-700'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                    </div>
                    <span className="text-xs sm:text-sm leading-relaxed">{option.text}</span>
                  </button>

                  {/* Immediate micro-insight when selected */}
                  {isSelected && (
                    <div className="pr-8 text-xs text-amber-300/90 flex items-center gap-1.5 animate-fadeIn">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{option.insight}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom navigation buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              سوال قبلی
            </button>

            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentQ.id] === undefined}
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              <span>{currentStep === totalQuestions - 1 ? 'مشاهده نتیجه تحلیل' : 'سوال بعدی'}</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : results ? (
        /* Results View */
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-8 animate-fadeIn">
          {/* Top Banner of the Result */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-950 border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>نتیجه تحلیل عارضه‌یابی اختصاصی</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              گلوگاه بحرانی شما: {results.bottleneckTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {results.bottleneckWhy}
            </p>
          </div>

          {/* 4 Dimension Breakdown Bars */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-200">
              تفکیک امتیازات شما در ۴ بعد شناختی:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(results.categoryPercentages).map(([key, percentage]) => {
                const isWeakest = key === results.weakestCategory;
                const label = results.scores[key as keyof typeof results.scores].label;
                return (
                  <div key={key} className={`p-4 rounded-xl border ${
                    isWeakest ? 'bg-rose-950/20 border-rose-900/40' : 'bg-slate-950/50 border-slate-800'
                  }`}>
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className={`font-semibold ${isWeakest ? 'text-rose-400' : 'text-slate-300'}`}>
                        {label}
                      </span>
                      <span className="tabular-nums font-bold text-white">{percentage}٪</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          percentage >= 70 ? 'bg-emerald-400' :
                          percentage >= 45 ? 'bg-amber-400' : 'bg-rose-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tailored 3-Step Action Prescription */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Compass className="w-4 h-4" />
              <span>نسخه عملیاتی ۳ مرحله‌ای برای تغییر وضعیت شما:</span>
            </div>
            <div className="space-y-3">
              {results.prescription.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                    {idx + 1}
                  </div>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>انجام دوباره تست</span>
            </button>

            <button
              onClick={onNavigateToToolkit}
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <span>ورود به جعبه ابزار عملیاتی برای حل مشکل</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
};
