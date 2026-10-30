import React from 'react';
import { Brain } from 'lucide-react';
import { VIEWS, SITE_NAME } from './views';
import { hashFor } from './navigation';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 px-4 sm:px-6 pt-10 pb-28 lg:pb-10 text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-[1.4fr_1fr_1.4fr] items-start">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Brain className="w-4 h-4" />
            </span>
            <span className="font-bold text-white text-base">{SITE_NAME}</span>
          </div>
          <p className="leading-relaxed text-slate-400 max-w-xs">
            ابزار مطالعهٔ علمی برای دانش‌آموزان متوسطهٔ دوم و داوطلبان کنکور.
          </p>
        </div>

        <nav aria-label="پیوندهای پایین صفحه">
          <ul className="grid gap-2">
            {VIEWS.map((v) => (
              <li key={v.id}>
                <a href={hashFor(v.id)} className="hover:text-white transition-colors">
                  {v.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="leading-relaxed text-slate-500">
          این نسخه حساب کاربری ندارد. مباحث، آمار و تنظیمات فقط روی همین مرورگر ذخیره می‌شوند و با پاک کردن اطلاعات
          مرورگر از بین می‌روند. بخش مشاور هوشمند راهنمایی عمومی می‌دهد و جای مشاور یا معلم را نمی‌گیرد.
        </p>
      </div>
    </footer>
  );
};
