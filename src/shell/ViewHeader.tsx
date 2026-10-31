import React from 'react';
import { getView, type ViewId } from './views';

/** عنوان هر صفحه + میان‌بر به بخش‌های همان صفحه */
export const ViewHeader: React.FC<{ view: ViewId }> = ({ view }) => {
  const meta = getView(view);
  return (
    <div className="border-b border-slate-800/60 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-7 pb-5">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-balance">{meta.title}</h1>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">{meta.description}</p>
        </div>
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
