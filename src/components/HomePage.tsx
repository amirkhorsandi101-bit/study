/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * HomePage.tsx: Comprehensive Overview & Scientific Foundation
 * Presents the holistic philosophy of Rahbord, 4-step cognitive learning roadmap,
 * scientific root-cause dissection of the 6 fundamental study struggles,
 * and intuitive visual hub cards to jump into each dedicated specialized tab.
 */

import React from 'react';
import {
  Brain,
  Sparkles,
  ArrowLeft,
  Calendar,
  Clock,
  Target,
  Zap,
  BookOpen,
  Compass,
  CheckCircle2,
  TrendingUp,
  Flame,
  Swords,
  Layers,
  HelpCircle,
  Lightbulb,
  Award,
  ShieldCheck,
  RotateCcw,
  BarChart3,
  ChevronLeft
} from 'lucide-react';
import { ProblemsSection } from './ProblemsSection';
import { Dashboard } from './Dashboard';
import { WeeklyStudyTimeWidget } from './WeeklyStudyTimeWidget';

export type MainAppTab = 'home' | 'planner' | 'ebbinghaus' | 'procrastination' | 'toolkit' | 'advisor' | 'gamification';

interface HomePageProps {
  onNavigateTab: (tab: MainAppTab) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateTab }) => {
  return (
    <div className="space-y-16 pb-20" dir="rtl">
      {/* ===================================================================
          1. HERO SECTION: RICH MULTI-COLOR GRADIENT, SCIENTIFIC HOOK
          =================================================================== */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
        {/* Multi-color ambient glow meshes */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 shadow-sm">
                <Brain className="w-3.5 h-3.5 text-indigo-400" />
                <span>علوم اعصاب شناختی و یادگیری پایدار</span>
              </span>
              <span className="text-slate-500" aria-hidden="true">·</span>
              <span className="text-slate-400">راهنمای علمی کنکور و امتحانات نهایی</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.3]">
              چرا با وجود ساعت‌ها درس خواندن، <br />
              <span className="bg-gradient-to-l from-amber-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                نتیجه متناسب با تلاشتان نمی‌گیرید؟
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light max-w-2xl">
              مسئله اساسی اکثر دانش‌آموزان <strong className="text-white font-medium">کمبود هوش، استعداد یا تلاش نیست</strong>؛ بلکه استفاده از روش‌های منسوخی مثل روخوانی منفعلانه، جنگیدن بی‌ثمر با منحنی فراموشی، و گرفتار شدن در تله اهمال‌کاری است. 
              سامانه <strong className="text-amber-300 font-semibold">«راهبُرد»</strong> مهندسی مطالعه شما را از سطح آزمون و خطا به یک ساختار علمی، منظم و داده‌محور ارتقا می‌دهد.
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigateTab('planner')}
                className="px-5 py-3 rounded-xl bg-gradient-to-l from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-slate-950" />
                <span>ورود به پلنر سرفصل‌ها (هفتگی / دو هفتگی)</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateTab('procrastination')}
                className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-850 text-slate-200 border border-slate-700/80 font-bold text-xs sm:text-sm flex items-center gap-2 hover:border-rose-400/50 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 text-rose-400" />
                <span>تست تشخیصی عارضه‌یابی من</span>
              </button>
            </div>

            {/* Quick Live Stats Pills */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 text-xs">
              <div className="space-y-0.5">
                <span className="text-[11px] text-slate-400 block">پوشش سرفصل‌ها:</span>
                <span className="font-mono text-white font-bold text-sm">۳ پایه · ۳ رشته</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] text-slate-400 block">الگوریتم بازداری:</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">منحنی ابینگهاوس</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] text-slate-400 block">افق برنامه‌ریزی:</span>
                <span className="font-mono text-cyan-400 font-bold text-sm">۷ و ۱۴ روزه آزمون</span>
              </div>
            </div>
          </div>

          {/* Interactive Visual Concept Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-slate-950 border border-slate-800/90 p-6 shadow-2xl space-y-5 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 text-xs">
                <span className="font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>مقایسه بازدهی یادگیری در ۳۰ روز</span>
                </span>
                <span className="text-slate-400 font-mono text-[11px]">Neuroscience</span>
              </div>

              {/* Progress 1: Passive reading without spaced reviews */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-rose-300 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>مطالعه سنتی (روخوانی مکرر بدون فواصل مرور)</span>
                  </span>
                  <span className="font-mono text-rose-400 font-bold">۱۰٪ ماندگاری</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-rose-500 h-full w-[10%]" />
                </div>
                <p className="text-[10px] text-slate-500">
                  پس از گذشت ۳۰ روز، ۹۰ درصد مطالب خوانده شده به طور کامل فراموش می‌شود.
                </p>
              </div>

              {/* Progress 2: Spaced Repetition + Active Recall */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-300 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>متد مهندسی راهبُرد (فواصل ابینگهاوس + تست بازیابی)</span>
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">۹۲٪ ماندگاری</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-l from-emerald-400 to-teal-400 h-full w-[92%]" />
                </div>
                <p className="text-[10px] text-slate-400">
                  با ۴ ایستگاه مرور کوتاه (روز ۱، ۳، ۱۰، ۳۰)، مطالب مستقیماً در حافظه بلندمدت تثبیت می‌شوند.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]">
                  <strong>قانون طلایی رتبه‌های برتر:</strong> «مرور فعال ۵ دقیقه‌ای در زمان درست، باارزش‌تر از ۵ ساعت بازخوانی مجدد کتاب در شب امتحان است.»
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          2. THE 4-STEP COGNITIVE ROADMAP: HOW TO USE RAHBORD
          =================================================================== */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-cyan-400 flex items-center justify-center gap-1.5">
            <Compass className="w-4 h-4" />
            <span>نقشه راه جامع ۴ مرحله‌ای</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            چگونه با سامانه راهبُرد به اوج بازدهی برسیم؟
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            برای تبدیل زمان مطالعه به تراز و درصد درخشان، این ۴ گام به‌هم‌پیوسته را دنبال کنید:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div 
            onClick={() => onNavigateTab('procrastination')}
            className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-rose-500/40 transition-all cursor-pointer group space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center font-mono font-bold text-xs border border-rose-500/30">
                ۰۱
              </span>
              <span className="text-[10px] text-slate-500 group-hover:text-rose-400 transition-colors flex items-center gap-1">
                <span>ورود به تب</span>
                <ChevronLeft className="w-3 h-3" />
              </span>
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
              ۱. عارضه‌یابی و ریشه‌یابی چالش‌ها
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              آزمون تشخیصی را بدهید تا مشخص شود گلوگاه اصلی شما فراموشی، کمال‌گرایی منفی، وسواس یا توهم یادگیری است.
            </p>
          </div>

          {/* Step 2 */}
          <div 
            onClick={() => onNavigateTab('planner')}
            className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-mono font-bold text-xs border border-amber-500/30">
                ۰۲
              </span>
              <span className="text-[10px] text-slate-500 group-hover:text-amber-400 transition-colors flex items-center gap-1">
                <span>ورود به تب</span>
                <ChevronLeft className="w-3 h-3" />
              </span>
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
              ۲. برنامه‌ریزی سرفصل‌های رسمی
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              پایه و رشته خود را انتخاب کرده و در افق هفتگی یا دو هفتگی آزمون‌های آزمایشی، سرفصل‌ها را در پارت‌ها بچینید.
            </p>
          </div>

          {/* Step 3 */}
          <div 
            onClick={() => onNavigateTab('ebbinghaus')}
            className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs border border-emerald-500/30">
                ۰۳
              </span>
              <span className="text-[10px] text-slate-500 group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                <span>ورود به تب</span>
                <ChevronLeft className="w-3 h-3" />
              </span>
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
              ۳. انتقال به تقویم مرور ابینگهاوس
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              مباحث مطالعه‌شده را با یک کلیک به صف مرور ابینگهاوس بفرستید تا زمان دقیق مرورهای طلایی را به شما یادآوری کند.
            </p>
          </div>

          {/* Step 4 */}
          <div 
            onClick={() => onNavigateTab('gamification')}
            className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-purple-500/40 transition-all cursor-pointer group space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-mono font-bold text-xs border border-purple-500/30">
                ۰۴
              </span>
              <span className="text-[10px] text-slate-500 group-hover:text-purple-400 transition-colors flex items-center gap-1">
                <span>ورود به تب</span>
                <ChevronLeft className="w-3 h-3" />
              </span>
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
              ۴. تثبیت عادت، دوئل و ارزیابی
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              زنجیره عادت مطالعه روزانه را نشکنید، در دوئل‌های رقابتی با سایر دانش‌آموزان بسنجید و نشان‌های افتخار کسب کنید.
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================================
          WEEKLY STUDY TIME PERFORMANCE WIDGET (نمودار میله‌ای ساعات مطالعه هفتگی با Recharts)
          =================================================================== */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto">
        <WeeklyStudyTimeWidget onNavigateTab={onNavigateTab} />
      </section>

      {/* ===================================================================
          CENTRAL DASHBOARD & SELECTED TOPICS WIDGET (داشبورد مرکزی و مباحث منتخب)
          =================================================================== */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto">
        <Dashboard
          id="dashboard-hub"
          onNavigate={(sectionId) => {
            if (sectionId === 'study-planner') onNavigateTab('planner');
            else if (sectionId === 'quiz' || sectionId === 'procrastination-analyzer') onNavigateTab('procrastination');
            else if (sectionId === 'simulator' || sectionId === 'ebbinghaus-scheduler' || sectionId === 'adaptive-scheduler') onNavigateTab('ebbinghaus');
            else if (sectionId === 'toolkit') onNavigateTab('toolkit');
            else if (sectionId === 'study-advisor' || sectionId === 'weekly-insight' || sectionId === 'dashboard') onNavigateTab('advisor');
            else if (sectionId === 'habit-tracker' || sectionId === 'study-duels' || sectionId === 'badges') onNavigateTab('gamification');
            else onNavigateTab('home');
          }}
          onSelectTool={(toolId) => {
            if (toolId === 'study-planner') onNavigateTab('planner');
            else if (toolId === 'ebbinghaus-scheduler') onNavigateTab('ebbinghaus');
            else if (toolId === 'toolkit') onNavigateTab('toolkit');
            else if (toolId === 'study-advisor') onNavigateTab('advisor');
          }}
        />
      </section>

      {/* ===================================================================
          3. EXPLORE SPECIALIZED TABS (FEATURE CARDS)
          =================================================================== */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-400">میز کارهای تخصصی سیستم</span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              بخش‌های مختلف سامانه راهبُرد
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            برای ورود، روی هر بخش کلیک کنید یا از تب‌های بالای صفحه استفاده نمایید.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Planner */}
          <div 
            onClick={() => onNavigateTab('planner')}
            className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer group space-y-4 shadow-lg hover:shadow-amber-500/10"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-amber-400/20 text-amber-400">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
                هفتگی و دو هفتگی
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                پلنر تحصیلی و سرفصل‌های رسمی
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                سرفصل‌های رسمی پایه‌های دهم، یازدهم و دوازدهم هر ۳ رشته تجربی، ریاضی و انسانی، با تفکیک دروس اختصاصی و عمومی و چک‌لیست ۴ مرحله‌ای تسلط.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-400">
              <span>ورود به پلنر سرفصل‌ها</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 2: Ebbinghaus */}
          <div 
            onClick={() => onNavigateTab('ebbinghaus')}
            className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-950 border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer group space-y-4 shadow-lg hover:shadow-emerald-500/10"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-emerald-400/20 text-emerald-400">
                <Clock className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-400/15 text-emerald-300 border border-emerald-400/30">
                فواصل طلایی مرور
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                شبیه‌ساز و تقویم ابینگهاوس
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                شبیه‌سازی افت نمایی حافظه، مدیریت فواصل مرور (روز ۱، ۳، ۱۰، ۳۰)، تکرار فاصله‌دار تطبیقی و جلوگیری هوشمند از فراموشی سرفصل‌ها.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>ورود به سیستم ابینگهاوس</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 3: Procrastination & Diagnostics */}
          <div 
            onClick={() => onNavigateTab('procrastination')}
            className="p-6 rounded-2xl bg-gradient-to-br from-rose-500/10 via-slate-900 to-slate-950 border border-rose-500/30 hover:border-rose-400 transition-all cursor-pointer group space-y-4 shadow-lg hover:shadow-rose-500/10"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-rose-400/20 text-rose-400">
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                عارضه‌یابی شناختی
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">
                آزمون و درمان اهمال‌کاری
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                تست تشخیصی موانع درس خواندن، تحلیل ریشه‌ای اهمال‌کاری و وسواس کمال‌گرایی، و پروتکل‌های عصب‌شناختی برای شروع فوری مطالعه.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-rose-400">
              <span>ورود به بخش عارضه‌یابی</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 4: Toolkit */}
          <div 
            onClick={() => onNavigateTab('toolkit')}
            className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-950 border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer group space-y-4 shadow-lg hover:shadow-cyan-500/10"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-cyan-400/20 text-cyan-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-400/15 text-cyan-300 border border-cyan-400/30">
                یادگیری فعال
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                جعبه‌ابزار تمرکز عمیق و فاینمن
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                تایمر پیشرفته پومودورو با موزیک آلفا، متد تدریس به دیگران (فاینمن)، رسم درخت دانش، و ابزارهای روان‌شناختی شکستن انسداد ذهنی.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-cyan-400">
              <span>ورود به جعبه‌ابزار تمرکز</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 5: Advisor & Analytics */}
          <div 
            onClick={() => onNavigateTab('advisor')}
            className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-slate-900 to-slate-950 border border-indigo-500/30 hover:border-indigo-400 transition-all cursor-pointer group space-y-4 shadow-lg hover:shadow-indigo-500/10"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-indigo-400/20 text-indigo-400">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                داده‌محور
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                مشاور هوشمند و نمودارهای هفتگی
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                اولویت‌بندی مباحث بر اساس ضریب و سختی، نمودارهای تحلیلی روند مطالعه D3، و سنجه‌های آمادگی جهت آزمون‌های آزمایشی.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-400">
              <span>ورود به مشاور و آمار</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 6: Gamification, Habits & Duels */}
          <div 
            onClick={() => onNavigateTab('gamification')}
            className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 via-slate-900 to-slate-950 border border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer group space-y-4 shadow-lg hover:shadow-purple-500/10"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-purple-400/20 text-purple-400">
                <Flame className="w-6 h-6 text-purple-400 animate-pulse" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                انگیزش و رقابت
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                زنجیره عادات، دوئل و نشان‌ها
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                ردیاب عادات روزانه مطالعه (Habit Streak)، اتاق‌های رقابت و دوئل مطالعاتی با دوستان، و کسب مدال‌ها و نشان‌های افتخار تحصیلی.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-purple-400">
              <span>ورود به عادات و رقابت</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          4. SCIENTIFIC DISCUSSIONS & ROOT-CAUSE ANALYSIS OF 6 STUDY PROBLEMS
          =================================================================== */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
        <ProblemsSection />
      </section>
    </div>
  );
};
