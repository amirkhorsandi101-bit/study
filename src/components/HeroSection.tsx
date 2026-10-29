import React from 'react';
import { ArrowLeft, Sparkles, BookOpen, Clock, Activity, Zap } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative pt-12 pb-20 px-6 overflow-hidden border-b border-slate-800/60">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Top editorial kicker - clean unboxed typography, NO PILL */}
        <div className="flex items-center gap-2 text-xs text-amber-400 font-medium tracking-wide mb-4">
          <span>رویکرد علوم اعصاب شناختی و یادگیری مبتنی بر شواهد</span>
          <span aria-hidden="true">·</span>
          <span>راهنمای جامع دانش‌آموزان و داوطلبان کنکور</span>
        </div>

        {/* Hero headline with balanced wrap */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.3] text-balance">
              چرا با وجود ساعت‌ها درس خواندن، نتیجه متناسب با تلاشتان نمی‌گیرید؟
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-light">
              مشکل اساسی اکثر دانش‌آموزان <strong className="text-white font-semibold">کمبود هوش، بی‌استعدادی یا کم‌کاری نیست</strong>؛ 
              بلکه استفاده از روش‌های منسوخی مانند روخوانی مکرر، توهم تسلط، و جنگیدن ناآگاهانه با فیزیولوژی طبیعی مغز است. 
              اینجا یاد می‌گیرید که چگونه با مکانیزم‌های زیستی مغز همسو شوید.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('quiz')}
                className="flex items-center gap-2 px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
              >
                <span>تست عارضه‌یابی مشکل من</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('problems')}
                className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium text-sm rounded-xl transition-colors cursor-pointer"
              >
                <span>بررسی ۶ مشکل ریشه‌ای</span>
              </button>
            </div>
          </div>

          {/* Interactive Visual Canvas / Concept Hero Artwork (Styled SVG Cognitive Engine) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs text-slate-400">
                <span className="font-semibold text-slate-200">مقایسه دو رویکرد مطالعه</span>
                <span>اثربخشی در روز ۳۰ام</span>
              </div>

              <div className="py-6 space-y-5">
                {/* Outdated approach */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-rose-400 font-medium">روش سنتی: روخوانی مکرر + هایلایت</span>
                    <span className="text-rose-400 tabular-nums font-bold">۱۴٪ تثبیت در حافظه</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full w-[14%]" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    ایجاد «توهم تسلط» موقت؛ فراموشی ۸۶٪ مطالب در ماه اول
                  </p>
                </div>

                {/* Modern cognitive approach */}
                <div className="space-y-2 pt-2 border-t border-slate-800/60">
                  <div className="flex justify-between text-xs">
                    <span className="text-emerald-400 font-medium">روش علمی: بازیابی فعال + مرور فاصله‌دار</span>
                    <span className="text-emerald-400 tabular-nums font-bold">۸۹٪ تثبیت دائمی</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[89%]" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    تقویت مسیرهای سیناپسی Long-Term Potentiation (LTP)
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>تفاوت راندمان زمانی:</span>
                </div>
                <span className="text-amber-400 font-bold tabular-nums">۳.۴ برابر بازدهی بالاتر</span>
              </div>
            </div>
          </div>
        </div>

        {/* Claim-to-Proof Quantitative Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-14 pt-10 border-t border-slate-800/80">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-white tabular-nums tracking-tight">۷۲ درصد</div>
              <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                اطلاعات بدون مرور هدفمند ظرف ۴۸ ساعت اول در اثر منحنی ابینگهاوس هرس می‌شوند.
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-white tabular-nums tracking-tight">۲۳ دقیقه</div>
              <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                زمان میانگین مورد نیاز مغز برای بازگشت به فاز تمرکز عمیق پس از هر بار حواس‌پرتی با گوشی.
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-white tabular-nums tracking-tight">قانون ۵ دقیقه</div>
              <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                در ۸۵٪ مواقع، فقط شروع کردن به مدت ۳۰۰ ثانیه، مقاومت آمیگدال در برابر درس را درهم می‌شکند.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
