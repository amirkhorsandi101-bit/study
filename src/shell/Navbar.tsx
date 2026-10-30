import React from 'react';
import { Brain, Sparkles, Clock, Compass, BarChart3, ArrowLeft } from 'lucide-react';
import { VIEWS, SITE_NAME, type ViewId } from './views';
import { hashFor } from './navigation';

const ICONS: Record<ViewId, React.ComponentType<{ className?: string }>> = {
  home: Sparkles,
  study: Clock,
  diagnose: Compass,
  progress: BarChart3,
};

interface NavbarProps {
  current: ViewId;
}

/** هدر بالا (دسکتاپ و موبایل) */
export const Navbar: React.FC<NavbarProps> = ({ current }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 h-16">
        <a href={hashFor('home')} className="flex items-center gap-2 group shrink-0" aria-label={`${SITE_NAME}، صفحهٔ اصلی`}>
          <span className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:border-amber-400 transition-colors">
            <Brain className="w-5 h-5" />
          </span>
          <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap">{SITE_NAME}</span>
        </a>

        {/* دسکتاپ */}
        <nav aria-label="ناوبری اصلی" className="hidden lg:flex items-center gap-1">
          {VIEWS.map((v) => {
            const Icon = ICONS[v.id];
            const active = v.id === current;
            return (
              <a
                key={v.id}
                href={hashFor(v.id)}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-amber-400/10 text-amber-300'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{v.label}</span>
              </a>
            );
          })}
        </nav>

        <a
          href={hashFor('diagnose', 'quiz')}
          className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-xl transition-all whitespace-nowrap shrink-0 shadow-sm shadow-amber-500/20"
        >
          <span>شروع عارضه‌یابی</span>
          <ArrowLeft className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
};

/** نوار پایین موبایل و تبلت */
export const BottomNav: React.FC<NavbarProps> = ({ current }) => {
  return (
    <nav
      aria-label="ناوبری موبایل"
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-slate-800"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <ul className="grid grid-cols-4 max-w-xl mx-auto">
        {VIEWS.map((v) => {
          const Icon = ICONS[v.id];
          const active = v.id === current;
          return (
            <li key={v.id}>
              <a
                href={hashFor(v.id)}
                aria-current={active ? 'page' : undefined}
                className={`relative flex flex-col items-center justify-center gap-1 min-h-16 text-[11px] font-semibold transition-colors ${
                  active ? 'text-amber-300' : 'text-slate-400 active:text-white'
                }`}
              >
                {active && <span className="absolute top-0 inset-x-6 h-0.5 rounded-full bg-amber-400" aria-hidden="true" />}
                <Icon className="w-5 h-5" />
                <span>{v.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
