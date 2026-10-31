/**
 * views.ts — نقشهٔ صفحه‌ها و بخش‌های پوسته.
 * برای افزودن بخش یا صفحهٔ جدید فقط همین فایل و فایل view مربوطه را ویرایش کنید.
 */

export type ViewId = 'home' | 'study' | 'diagnose' | 'progress';

export interface SectionMeta {
  id: string;
  label: string;
}

export interface ViewMeta {
  id: ViewId;
  /** برچسب کوتاه در منو */
  label: string;
  /** عنوان صفحه */
  title: string;
  description: string;
  sections: SectionMeta[];
}

export const SITE_NAME = 'راهبُرد';
export const SITE_TITLE = 'راهبرد | ریشه‌یابی و حل مشکلات اساسی درس خواندن';

/**
 * کلیدهای فعال‌سازی قابلیت‌ها.
 * duels: دوئل مطالعه فعلاً با رقیب‌های شبیه‌سازی‌شده کار می‌کند و چندنفرهٔ واقعی نیست،
 * پس تا ساخته شدن حساب کاربری و سرور خاموش است.
 */
export const FEATURES: { duels: boolean } = {
  duels: false,
};

export const VIEWS: ViewMeta[] = [
  {
    id: 'home',
    label: 'خانه',
    title: SITE_NAME,
    description: 'شروع از اینجا',
    sections: [],
  },
  {
    id: 'study',
    label: 'مطالعه',
    title: 'برنامهٔ مطالعه و مرور',
    description: 'مباحث را ثبت کن تا بر اساس منحنی فراموشی ابینگهاوس زمان مرور بعدی را بگیری.',
    sections: [
      { id: 'ebbinghaus-scheduler', label: 'زمان‌بندی مرور' },
      { id: 'adaptive-scheduler', label: 'تکرار تطبیقی' },
      { id: 'simulator', label: 'شبیه‌ساز فراموشی' },
    ],
  },
  {
    id: 'diagnose',
    label: 'تشخیص',
    title: 'تشخیص مشکل و راهکار',
    description: 'مشکل اصلی مطالعه‌ات را پیدا کن و راهکار عملی بگیر.',
    sections: [
      { id: 'quiz', label: 'تست عارضه‌یابی' },
      { id: 'problems', label: 'مشکل‌های رایج' },
      { id: 'procrastination-analyzer', label: 'تحلیل اهمال‌کاری' },
      { id: 'coach', label: 'مشاور هوشمند' },
      { id: 'toolkit', label: 'جعبه ابزار' },
    ],
  },
  {
    id: 'progress',
    label: 'پیشرفت',
    title: 'پیشرفت و عادت‌ها',
    description: 'آمار مطالعه، زنجیرهٔ عادت و نشان‌هایت در یک جا.',
    sections: [
      { id: 'dashboard', label: 'داشبورد' },
      { id: 'habit-tracker', label: 'زنجیرهٔ عادت' },
      { id: 'study-advisor', label: 'مشاور اولویت‌ها' },
      { id: 'weekly-insight', label: 'بینش هفتگی' },
      { id: 'badges', label: 'نشان‌ها' },
      ...(FEATURES.duels ? [{ id: 'study-duels', label: 'دوئل مطالعه' }] : []),
    ],
  },
];

/** هر بخش (id در DOM) به کدام صفحه تعلق دارد. */
export const SECTION_VIEW: Record<string, ViewId> = {
  hero: 'home',
  'dashboard-hub': 'home',
  problems: 'diagnose',
  'ebbinghaus-scheduler': 'study',
  'adaptive-scheduler': 'study',
  simulator: 'study',
  quiz: 'diagnose',
  'procrastination-analyzer': 'diagnose',
  coach: 'diagnose',
  toolkit: 'diagnose',
  dashboard: 'progress',
  'habit-tracker': 'progress',
  'study-advisor': 'progress',
  'weekly-insight': 'progress',
  badges: 'progress',
  ...(FEATURES.duels ? { 'study-duels': 'progress' as ViewId } : {}),
};

/** تبِ فعال یک صفحه؛ اگر بخش معتبر نباشد، اولین تب. */
export function activeSectionFor(view: ViewId, section?: string): string | undefined {
  const sections = getView(view).sections;
  if (sections.length === 0) return undefined;
  return sections.some((x) => x.id === section) ? section : sections[0].id;
}

export function getView(id: ViewId): ViewMeta {
  return VIEWS.find((v) => v.id === id) ?? VIEWS[0];
}

export function isViewId(value: string): value is ViewId {
  return VIEWS.some((v) => v.id === value);
}
