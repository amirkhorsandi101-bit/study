import React from 'react';
import { getView, type ViewId } from './views';
import { hashFor } from './navigation';

/** عنوان هر صفحه + میان‌بر به بخش‌های همان صفحه */
export const ViewHeader: React.FC<{ view: ViewId }> = ({ view }) => {
  const meta = getView(view);
  return (
    <div className="border-b border-slate-800/60 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-5 space-y-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-balance">{meta.title}</h1>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">{meta.description}</p>
        </div>
        {meta.sections.length > 0 && (
          <nav aria-label={`بخش‌های ${meta.label}`} className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
            <ul className="flex gap-2 w-max sm:w-auto sm:flex-wrap pb-1">
              {meta.sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={hashFor(view, s.id)}
                    className="block whitespace-nowrap px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-amber-500/40 hover:text-amber-300 transition-colors"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

/** نمایش در حین بارگذاری تنبل هر صفحه */
export const ViewLoading: React.FC = () => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 space-y-4" role="status" aria-live="polite">
    <div className="h-6 w-48 rounded-lg bg-slate-900 animate-pulse" />
    <div className="h-40 rounded-2xl bg-slate-900/70 animate-pulse" />
    <div className="h-40 rounded-2xl bg-slate-900/70 animate-pulse" />
    <span className="sr-only">در حال بارگذاری…</span>
  </div>
);
