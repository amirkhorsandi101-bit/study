import React from 'react';
import { Brain, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 px-6 py-12 text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Brain className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-white text-sm">راهبُرد</span>
          <span className="text-slate-500 text-[11px]">· سامانه جامع ریشه‌یابی و بهینه‌سازی مطالعه</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
          <button onClick={() => onNavigate('problems')} className="hover:text-white transition-colors cursor-pointer">
            ۶ مشکل اساسی
          </button>
          <button onClick={() => onNavigate('simulator')} className="hover:text-white transition-colors cursor-pointer">
            شبیه‌ساز ابینگهاوس
          </button>
          <button onClick={() => onNavigate('ebbinghaus-scheduler')} className="text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer">
            زمان‌بندی مرور ابینگهاوس
          </button>
          <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors cursor-pointer">
            داشبورد آماری
          </button>
          <button onClick={() => onNavigate('habit-tracker')} className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer">
            زنجیره عادات مطالعه
          </button>
          <button onClick={() => onNavigate('badges')} className="text-amber-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer">
            نشان‌های افتخار
          </button>
          <button onClick={() => onNavigate('procrastination-analyzer')} className="hover:text-white transition-colors cursor-pointer">
            تحلیل اهمال‌کاری
          </button>
          <button onClick={() => onNavigate('quiz')} className="hover:text-white transition-colors cursor-pointer">
            تست تشخیصی
          </button>
          <button onClick={() => onNavigate('toolkit')} className="hover:text-white transition-colors cursor-pointer">
            جعبه ابزار
          </button>
          <button onClick={() => onNavigate('coach')} className="hover:text-white transition-colors cursor-pointer">
            مشاوره هوشمند
          </button>
        </div>

        {/* Scientific Attribution */}
        <div className="text-[11px] text-slate-500 text-center md:text-left">
          مبتنی بر تحقیقات دانشگاه‌های هاروارد، استنفورد و آزمایش‌های عصب‌شناختی ابینگهاوس
        </div>
      </div>
    </footer>
  );
};
