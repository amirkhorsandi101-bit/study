/**
 * navigation.ts — مسیریابی ساده با hash.
 *   #/                      خانه
 *   #/study                 صفحهٔ مطالعه
 *   #/study/simulator       صفحهٔ مطالعه و اسکرول به بخش شبیه‌ساز
 *   #ebbinghaus-scheduler   فرمت قدیمی (اعلان‌های مرورگر)؛ همچنان کار می‌کند
 */
import { SECTION_VIEW, isViewId, type ViewId } from './views';

export interface Route {
  view: ViewId;
  section?: string;
}

export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#\/?/, '').trim();
  if (!raw) return { view: 'home' };

  const [first, second] = raw.split('/');

  if (isViewId(first)) {
    const section = second && SECTION_VIEW[second] === first ? second : undefined;
    return { view: first, section };
  }

  // آدرس قدیمی بدون نام صفحه
  if (first === 'hero') return { view: 'home' };
  const legacyView = SECTION_VIEW[first];
  if (legacyView) return { view: legacyView, section: first };

  return { view: 'home' };
}

export function hashFor(view: ViewId, section?: string): string {
  if (view === 'home' && !section) return '#/';
  return section ? `#/${view}/${section}` : `#/${view}`;
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
}

function scrollToElement(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  return true;
}

/**
 * اسکرول به بخش؛ اگر صفحهٔ بخش هنوز بارگذاری نشده (lazy)، تا چند ثانیه منتظر می‌ماند.
 */
export function scrollWhenReady(id: string): void {
  let frames = 0;
  const tick = () => {
    if (scrollToElement(id)) return;
    if (frames++ < 180) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/**
 * رفتن به یک بخش در هر صفحه‌ای.
 * اگر بخش در صفحهٔ دیگری باشد، hash عوض می‌شود و App صفحه را باز می‌کند.
 */
export function goToSection(sectionId: string): void {
  if (sectionId === 'hero') {
    if (parseHash(window.location.hash).view === 'home') {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    } else {
      window.location.hash = hashFor('home');
    }
    return;
  }

  const targetView = SECTION_VIEW[sectionId];
  if (!targetView) return; // بخش غیرفعال (مثلاً دوئل)

  const target = hashFor(targetView, sectionId);
  if (window.location.hash !== target) {
    // hash عوض می‌شود؛ App صفحه و تب را باز می‌کند و به بخش اسکرول می‌کند
    window.location.hash = target;
    return;
  }
  scrollWhenReady(sectionId);
}
