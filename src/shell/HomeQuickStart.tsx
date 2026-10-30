import React from 'react';
import { Compass, Clock, Bot, BarChart3, ArrowLeft } from 'lucide-react';
import { hashFor } from './navigation';

const ITEMS = [
  {
    title: 'تست عارضه‌یابی',
    text: 'با چند سؤال کوتاه بفهم مشکل اصلی مطالعه‌ات چیست.',
    href: hashFor('diagnose', 'quiz'),
    Icon: Compass,
    tone: 'text-amber-400 bg-amber-500/10',
  },
  {
    title: 'برنامهٔ مرور',
    text: 'مباحث را ثبت کن و زمان مرور بعدی هر کدام را بگیر.',
    href: hashFor('study', 'ebbinghaus-scheduler'),
    Icon: Clock,
    tone: 'text-sky-400 bg-sky-500/10',
  },
  {
    title: 'مشاور هوشمند',
    text: 'مشکلت را بنویس و یک برنامهٔ عملی برای همین هفته بگیر.',
    href: hashFor('diagnose', 'coach'),
    Icon: Bot,
    tone: 'text-emerald-400 bg-emerald-500/10',
  },
  {
    title: 'پیشرفت من',
    text: 'ساعت مطالعه، زنجیرهٔ عادت و نشان‌هایت را ببین.',
    href: hashFor('progress'),
    Icon: BarChart3,
    tone: 'text-violet-300 bg-violet-500/10',
  },
];

export const HomeQuickStart: React.FC = () => (
  <section aria-labelledby="quick-start-title" className="px-4 sm:px-6 py-14 border-b border-slate-800/60">
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="space-y-1.5">
        <h2 id="quick-start-title" className="text-xl sm:text-2xl font-bold text-white">از کجا شروع کنم؟</h2>
        <p className="text-sm text-slate-400">یکی از این چهار مسیر را انتخاب کن. بقیه را بعداً می‌توانی ببینی.</p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ title, text, href, Icon, tone }) => (
          <li key={title}>
            <a
              href={href}
              className="group h-full flex flex-col gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900 transition-colors"
            >
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${tone}`}>
                <Icon className="w-5 h-5" />
              </span>
              <span className="space-y-1">
                <span className="block text-base font-bold text-white">{title}</span>
                <span className="block text-sm text-slate-400 leading-relaxed">{text}</span>
              </span>
              <span className="mt-auto flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                <span>شروع</span>
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
