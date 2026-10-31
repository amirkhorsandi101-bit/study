import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
}

/**
 * نسخهٔ ساده‌شدهٔ Hero: یک پیام، دو دکمه.
 * کارت مقایسهٔ روش‌ها و نوار آمار حذف شد، چون اعداد آن‌ها منبع نداشتند و صفحه را شلوغ می‌کردند.
 * محتوای قبلی در تاریخچهٔ Git موجود است.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative px-4 sm:px-6 pt-12 pb-10 sm:pt-16 sm:pb-12 overflow-hidden border-b border-slate-800/60">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto space-y-6">
        <p className="text-xs text-amber-400 font-medium tracking-wide">
          برای دانش‌آموزان متوسطهٔ دوم و داوطلبان کنکور
        </p>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.35] text-balance">
          چرا با وجود ساعت‌ها درس خواندن، نتیجه متناسب با تلاشتان نمی‌گیرید؟
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
          مشکل معمولاً کمبود استعداد یا تلاش نیست؛ روش مطالعه است. اینجا روش‌های مبتنی بر مرور فاصله‌دار و
          یادآوری فعال را یاد می‌گیرید و برنامهٔ مرور خودتان را می‌سازید.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={() => onNavigate('quiz')}
            className="flex items-center gap-2 px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
          >
            <span>تست عارضه‌یابی مشکل من</span>
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('ebbinghaus-scheduler')}
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium text-sm rounded-xl transition-colors cursor-pointer"
          >
            ساخت برنامهٔ مرور
          </button>
        </div>
      </div>
    </section>
  );
};
