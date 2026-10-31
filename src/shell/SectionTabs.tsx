import React, { useEffect, useState } from 'react';
import { activeSectionFor, getView, type ViewId } from './views';
import { hashFor } from './navigation';

/** نوار تب چسبان زیر هدر: فقط یک ابزار در هر لحظه دیده می‌شود. */
export const SectionTabs: React.FC<{ view: ViewId; active?: string }> = ({ view, active }) => {
  const meta = getView(view);
  if (meta.sections.length === 0) return null;

  return (
    <nav
      aria-label={`ابزارهای ${meta.label}`}
      className="sticky top-16 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80"
    >
      <ul className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex gap-2 overflow-x-auto">
        {meta.sections.map((s) => {
          const isActive = s.id === active;
          return (
            <li key={s.id} className="shrink-0">
              <a
                href={hashFor(view, s.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`block whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-300 bg-slate-900 border border-slate-800 hover:border-amber-500/40 hover:text-amber-300'
                }`}
              >
                {s.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

/**
 * فقط تب فعال دیده می‌شود. تبی که یک بار باز شده، پنهان (نه حذف) می‌شود
 * تا تایمر و ورودی‌های نیمه‌کاره‌اش با عوض کردن تب از بین نروند.
 */
export function TabPanels({
  view,
  section,
  panels,
}: {
  view: ViewId;
  section?: string;
  panels: Record<string, React.ReactNode>;
}) {
  const active = activeSectionFor(view, section);
  const [seen, setSeen] = useState<Set<string>>(() => new Set(active ? [active] : []));

  useEffect(() => {
    if (active) setSeen((prev) => (prev.has(active) ? prev : new Set(prev).add(active)));
  }, [active]);

  return (
    <>
      {getView(view).sections.map((s) =>
        s.id === active || seen.has(s.id) ? (
          <div key={s.id} hidden={s.id !== active}>
            {panels[s.id]}
          </div>
        ) : null
      )}
    </>
  );
}
