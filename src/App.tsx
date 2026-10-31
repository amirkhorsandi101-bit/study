/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Navbar, BottomNav } from './shell/Navbar';
import { Footer } from './shell/Footer';
import { ViewHeader, ViewLoading } from './shell/ViewHeader';
import { SectionTabs } from './shell/SectionTabs';
import { SITE_TITLE, SITE_NAME, getView, activeSectionFor } from './shell/views';
import { parseHash, scrollWhenReady, goToSection, type Route } from './shell/navigation';
import { EbbinghausNotificationCenter } from './components/EbbinghausNotificationCenter';
import HomeView from './views/HomeView';

// هر صفحه جدا بارگذاری می‌شود تا باز شدن اول سایت سریع‌تر باشد (نمودارها و ابزارها فقط در صفحهٔ خودشان لازم‌اند)
const StudyView = lazy(() => import('./views/StudyView'));
const DiagnoseView = lazy(() => import('./views/DiagnoseView'));
const ProgressView = lazy(() => import('./views/ProgressView'));

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  const mainRef = useRef<HTMLElement>(null);
  const lastView = useRef(route.view);

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const meta = getView(route.view);
    document.title = route.view === 'home' ? SITE_TITLE : `${meta.title} | ${SITE_NAME}`;

    if (route.section) {
      scrollWhenReady(route.section);
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
      if (lastView.current !== route.view) mainRef.current?.focus({ preventScroll: true });
    }
    lastView.current = route.view;
  }, [route]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-400/20 selection:text-amber-200">
      <button
        type="button"
        onClick={() => mainRef.current?.focus()}
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:right-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-amber-400 focus:text-slate-950 focus:font-bold"
      >
        پرش به محتوای اصلی
      </button>

      <Navbar current={route.view} />

      <main id="main" ref={mainRef} tabIndex={-1} className="flex-1 outline-none">
        {route.view !== 'home' && <ViewHeader view={route.view} />}
        <SectionTabs view={route.view} active={activeSectionFor(route.view, route.section)} />
        <Suspense fallback={<ViewLoading />}>
          {route.view === 'home' && <HomeView />}
          {route.view === 'study' && <StudyView section={route.section} />}
          {route.view === 'diagnose' && <DiagnoseView section={route.section} />}
          {route.view === 'progress' && <ProgressView section={route.section} />}
        </Suspense>
      </main>

      <EbbinghausNotificationCenter onNavigateToScheduler={() => goToSection('ebbinghaus-scheduler')} />

      <Footer />
      <BottomNav current={route.view} />
    </div>
  );
}
