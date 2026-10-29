import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Printer,
  Download,
  Share2,
  Check,
  Award,
  Trophy,
  Brain,
  Sparkles,
  ShieldCheck,
  Calendar,
  User,
  Edit3,
  QrCode,
  Maximize2,
  Minimize2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flame,
  FileText
} from 'lucide-react';
import { DEFAULT_REVIEW_STATS, EbbinghausReviewStats } from './EbbinghausScheduler';

export type CertificateTier = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface CertificateTierConfig {
  id: CertificateTier;
  title: string;
  badgeLabel: string;
  minReviews: number;
  subtitle: string;
  honorTitle: string;
  citation: string;
  sealColor: string;
  sealBg: string;
  primaryColor: string;
  accentBg: string;
  borderClass: string;
  gradientBg: string;
  ribbonColor: string;
  stampText: string;
}

export const CERTIFICATE_TIERS: Record<CertificateTier, CertificateTierConfig> = {
  bronze: {
    id: 'bronze',
    title: 'گواهی‌نامه برنز تثبیت سیناپسی',
    badgeLabel: 'سطح برنز 🥉',
    minReviews: 5,
    subtitle: 'آغاز تثبیت مسیرهای یادآوری فعال در حافظه کوتاه‌مدت به میان‌مدت',
    honorTitle: 'دانش‌پژوه شایسته انضباط شناختی و بازیابی فعال',
    citation: 'با تکیه بر انضباط فردی و بهره‌گیری از سامانه فواصل مرور هوشمند ابینگهاوس، موفق به عبور از آستانه ۵ مرور موفق گردیده و مسیرهای اولیه حافظه پایدار (Engram) را در ساختار هیپوکامپ تثبیت نموده است.',
    sealColor: '#b45309',
    sealBg: 'linear-gradient(135deg, #78350f, #d97706, #92400e)',
    primaryColor: '#d97706',
    accentBg: '#fef3c7',
    borderClass: 'border-amber-700/60',
    gradientBg: 'from-amber-950/20 via-slate-900 to-amber-950/30',
    ribbonColor: '#b45309',
    stampText: 'تثبیت برنز · سیناپس فعال'
  },
  silver: {
    id: 'silver',
    title: 'گواهی‌نامه نقره‌ای انضباط و غلبه بر فراموشی',
    badgeLabel: 'سطح نقره 🥈',
    minReviews: 15,
    subtitle: 'پایداری در چرخه فواصل طلایی ۲۴ ساعته و ۳ روزه',
    honorTitle: 'پیشگام بازیابی فعال و تسلط بر شیب منحنی فراموشی',
    citation: 'با پایش مستمر روند یادگیری و ممانعت از سقوط آموخته‌ها به زیر آستانه یادآوری ۵۰٪، با انجام ۱۵ نوبت مرور ساختاریافته، استمرار عصب‌شناختی تحسین‌برانگیزی را به نمایش گذاشته است.',
    sealColor: '#64748b',
    sealBg: 'linear-gradient(135deg, #334155, #94a3b8, #475569)',
    primaryColor: '#94a3b8',
    accentBg: '#f1f5f9',
    borderClass: 'border-slate-400/50',
    gradientBg: 'from-slate-900 via-slate-900 to-slate-800/40',
    ribbonColor: '#64748b',
    stampText: 'تثبیت نقره · پایش پایدار'
  },
  gold: {
    id: 'gold',
    title: 'گواهی‌نامه طلایی تسلط بر حافظه بلندمدت',
    badgeLabel: 'سطح طلا 🥇',
    minReviews: 35,
    subtitle: 'انتقال موفق مفاهیم آموزشی به قشر خاکستری مخ (Neocortex)',
    honorTitle: 'استاد بلامنازع ریتم‌های مرور ابینگهاوس و تثبیت درازمدت',
    citation: 'با دستیابی به بیش از ۳۵ نوبت مرور هدفمند در فواصل ۷، ۱۰ و ۳۰ روزه، موفق به مقاومت قطعی در برابر زوال سیناپسی گردیده و الگوی علمی یادگیری بدون فراموشی را به کمال رسانده است.',
    sealColor: '#d97706',
    sealBg: 'linear-gradient(135deg, #92400e, #fbbf24, #b45309)',
    primaryColor: '#f59e0b',
    accentBg: '#fffbeb',
    borderClass: 'border-amber-400/80',
    gradientBg: 'from-amber-950/30 via-slate-900 to-amber-900/30',
    ribbonColor: '#d97706',
    stampText: 'تثبیت طلا · نئوکورتکس'
  },
  diamond: {
    id: 'diamond',
    title: 'گواهی‌نامه الماس تثبیت نهایی نئوکورتکس رتبه برتر',
    badgeLabel: 'سطح الماس 💎',
    minReviews: 50,
    subtitle: 'بالاترین درجه استادی حافظه دائمی و آمادگی کامل کنکور سراسری',
    honorTitle: 'نخبه عصب‌شناختی یادگیری ژرف و حافظه فناناپذیر',
    citation: 'با فتح قله ۵۰ نوبت مرور و بازیابی موفق بدون انقطاع، به بالاترین استاندارد پایدارسازی دانش در حافظه دائم دست یافته و شایستگی دریافت برترین نشان افتخار علمی راهبُرد را احراز نموده است.',
    sealColor: '#0284c7',
    sealBg: 'linear-gradient(135deg, #0369a1, #38bdf8, #075985)',
    primaryColor: '#38bdf8',
    accentBg: '#f0f9ff',
    borderClass: 'border-sky-400/80',
    gradientBg: 'from-sky-950/30 via-slate-900 to-indigo-950/30',
    ribbonColor: '#0284c7',
    stampText: 'تثبیت الماس · رتبه برتر'
  }
};

const STUDENT_NAME_KEY = 'rahbord_student_name';
const REVIEW_STATS_KEY = 'rahbord_ebbinghaus_review_stats';

interface DigitalCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTier?: CertificateTier;
}

export const DigitalCertificateModal: React.FC<DigitalCertificateModalProps> = ({
  isOpen,
  onClose,
  initialTier
}) => {
  const [studentName, setStudentName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STUDENT_NAME_KEY);
      return saved ? saved.trim() : 'دانش‌پژوه کوشا';
    } catch {
      return 'دانش‌پژوه کوشا';
    }
  });

  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInputValue, setNameInputValue] = useState<string>(studentName);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Review stats
  const [totalReviewed, setTotalReviewed] = useState<number>(DEFAULT_REVIEW_STATS.totalReviewed);
  const [totalForgotten, setTotalForgotten] = useState<number>(DEFAULT_REVIEW_STATS.totalForgotten);
  const [retentionAverage, setRetentionAverage] = useState<number>(82);

  // Load review stats from LocalStorage
  const loadReviewStats = () => {
    try {
      const raw = localStorage.getItem(REVIEW_STATS_KEY);
      if (raw) {
        const parsed: EbbinghausReviewStats = JSON.parse(raw);
        if (typeof parsed.totalReviewed === 'number') {
          setTotalReviewed(parsed.totalReviewed);
          setTotalForgotten(parsed.totalForgotten || 0);
          const total = (parsed.totalReviewed || 0) + (parsed.totalForgotten || 0);
          if (total > 0) {
            setRetentionAverage(Math.round((parsed.totalReviewed / total) * 100));
          }
          return;
        }
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadReviewStats();
    }
  }, [isOpen]);

  // Determine highest earned tier
  const highestEarnedTier: CertificateTier = React.useMemo(() => {
    if (totalReviewed >= CERTIFICATE_TIERS.diamond.minReviews) return 'diamond';
    if (totalReviewed >= CERTIFICATE_TIERS.gold.minReviews) return 'gold';
    if (totalReviewed >= CERTIFICATE_TIERS.silver.minReviews) return 'silver';
    return 'bronze';
  }, [totalReviewed]);

  const [selectedTier, setSelectedTier] = useState<CertificateTier>(initialTier || highestEarnedTier);

  // When highest tier changes or modal opens, sync if appropriate
  useEffect(() => {
    if (initialTier) {
      setSelectedTier(initialTier);
    } else {
      setSelectedTier(highestEarnedTier);
    }
  }, [initialTier, highestEarnedTier]);

  const currentConfig = CERTIFICATE_TIERS[selectedTier];
  const isUnlockedTier = totalReviewed >= currentConfig.minReviews;

  // Save student name
  const handleSaveName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = nameInputValue.trim() || 'دانش‌پژوه کوشا';
    setStudentName(trimmed);
    setIsEditingName(false);
    try {
      localStorage.setItem(STUDENT_NAME_KEY, trimmed);
    } catch {
      // ignore
    }
  };

  // Generate deterministic serial code
  const serialCode = React.useMemo(() => {
    const charSum = (studentName + selectedTier).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const hashPart = Math.abs((charSum * 9973) % 89999 + 10000);
    return `RHB-EBB-2026-${selectedTier.substring(0, 3).toUpperCase()}-${hashPart}`;
  }, [studentName, selectedTier]);

  // Persian date
  const issueDatePersian = React.useMemo(() => {
    try {
      return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date());
    } catch {
      return '۱۴۰۳/۰۸/۰۸';
    }
  }, []);

  // Print Certificate (triggers @media print)
  const handlePrint = () => {
    window.print();
  };

  // Copy share card text
  const handleCopyShare = () => {
    const shareText = `📜 گواهی‌نامه دیجیتال ابینگهاوس من در سامانه راهبُرد:
🎓 دارنده: ${studentName}
🏆 سطح: ${currentConfig.title} (${currentConfig.badgeLabel})
⚡ تعداد مرورهای موفق: ${totalReviewed} نوبت
📊 نرخ پایداری حافظه: ${retentionAverage}٪
🔑 شناسه استعلام سند: ${serialCode}
🏛 صادرکننده: سامانه ملی هدایت تحصیلی و یادگیری پایدار راهبُرد`;
    navigator.clipboard.writeText(shareText);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-5xl bg-slate-900 border border-amber-500/40 rounded-2xl md:rounded-3xl shadow-2xl flex flex-col my-auto relative overflow-hidden transition-all duration-300 ${
          isFullscreen ? 'max-w-none w-[98vw] h-[96vh]' : 'max-h-[95vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>گواهی‌نامه دیجیتال استادی ابینگهاوس</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-medium">
                    سند رسمی یادآوری فعال
                  </span>
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                بر پایه آمار {totalReviewed} نوبت مرور موفق در زمان‌بندی هوشمند EbbinghausScheduler
              </p>
            </div>
          </div>

          {/* Action buttons: Print, Share, Fullscreen, Close */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-500/10 cursor-pointer active:scale-95"
              title="چاپ یا ذخیره گواهی‌نامه به عنوان PDF با کیفیت عالی"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ / ذخیره PDF</span>
            </button>

            <button
              onClick={handleCopyShare}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
              title="کپی متن استعلام و مشخصات گواهی‌نامه"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedShare ? 'کپی شد!' : 'اشتراک‌گذاری'}</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer border border-slate-700"
              title={isFullscreen ? 'خروج از تمام‌صفحه' : 'نمای تمام‌صفحه'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer border border-slate-700"
              title="بستن پنجره"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tier Selector & Student Name Bar */}
        <div className="px-4 sm:px-6 py-3 bg-slate-950/30 border-b border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shrink-0">
          {/* Tiers Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs text-slate-400 ml-1 shrink-0">رتبه گواهی:</span>
            {(['bronze', 'silver', 'gold', 'diamond'] as CertificateTier[]).map((tierKey) => {
              const cfg = CERTIFICATE_TIERS[tierKey];
              const isEligible = totalReviewed >= cfg.minReviews;
              const isSelected = selectedTier === tierKey;

              return (
                <button
                  key={tierKey}
                  onClick={() => setSelectedTier(tierKey)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 border ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-sm'
                      : isEligible
                      ? 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
                      : 'bg-slate-900/40 text-slate-500 border-slate-800 hover:text-slate-400'
                  }`}
                >
                  <span>{cfg.badgeLabel}</span>
                  {isEligible ? (
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-emerald-400'}`} />
                  ) : (
                    <span className="text-[10px] font-mono opacity-80">({cfg.minReviews}+)</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Student Name Personalizer */}
          <div className="flex items-center gap-2 shrink-0">
            {isEditingName ? (
              <form onSubmit={handleSaveName} className="flex items-center gap-2">
                <input
                  type="text"
                  value={nameInputValue}
                  onChange={(e) => setNameInputValue(e.target.value)}
                  placeholder="نام و نام خانوادگی دانش‌آموز"
                  className="px-3 py-1.5 bg-slate-950 border border-amber-400 text-white rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-400 w-44"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  ثبت نام
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNameInputValue(studentName);
                    setIsEditingName(false);
                  }}
                  className="px-2 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  انصراف
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">دارنده مدرک:</span>
                <span className="font-bold text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                  {studentName}
                </span>
                <button
                  onClick={() => {
                    setNameInputValue(studentName);
                    setIsEditingName(true);
                  }}
                  className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="تغییر یا شخصی‌سازی نام درج‌شده در گواهی‌نامه"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Certificate Display Notice if tier is locked */}
        {!isUnlockedTier && (
          <div className="mx-6 mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs text-amber-300">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                پیش‌نمایش سطح {currentConfig.title}: شما هم‌اکنون {totalReviewed} مرور دارید و برای فعال‌سازی کامل این سطح به{' '}
                <strong>{currentConfig.minReviews - totalReviewed} مرور موفق دیگر</strong> نیاز است.
              </span>
            </span>
            <span className="text-[11px] font-mono text-amber-400/90 bg-amber-500/20 px-2 py-0.5 rounded">
              پیش‌نمایش گواهی
            </span>
          </div>
        )}

        {/* Scrollable Certificate Preview Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 flex items-center justify-center bg-slate-950/50">
          {/* THE PRINTABLE CERTIFICATE DOCUMENT (A4 Landscape ratio) */}
          <div
            id="printable-certificate"
            className="w-full max-w-[920px] aspect-[1.414/1] bg-[#fffdfa] text-slate-900 rounded-2xl shadow-2xl relative p-5 sm:p-8 md:p-10 flex flex-col justify-between overflow-hidden border-[10px] border-[#1e293b] select-none transition-all print:m-0 print:border-none print:shadow-none"
            style={{
              fontFamily: 'Vazirmatn, system-ui, sans-serif'
            }}
          >
            {/* Ornate Outer Golden Double Guilloche Border */}
            <div className="absolute inset-2 sm:inset-3 border-2 border-[#b45309]/40 rounded-xl pointer-events-none" />
            <div className="absolute inset-3 sm:inset-4 border border-[#b45309]/20 rounded-lg pointer-events-none" />

            {/* Corner Decorative Arabesque Florets (SVG Ornaments) */}
            <CornerOrnament className="absolute top-4 right-4 text-[#b45309]/70 transform rotate-0" />
            <CornerOrnament className="absolute top-4 left-4 text-[#b45309]/70 transform -scale-x-100" />
            <CornerOrnament className="absolute bottom-4 right-4 text-[#b45309]/70 transform -scale-y-100" />
            <CornerOrnament className="absolute bottom-4 left-4 text-[#b45309]/70 transform -scale-x-100 -scale-y-100" />

            {/* Subtle Watermark in Center */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none">
              <Brain className="w-96 h-96 text-slate-900" />
            </div>

            {/* TOP HEADER: Ministry / System Crest & Titles */}
            <div className="relative z-10 text-center space-y-1 sm:space-y-1.5 pt-1 sm:pt-2">
              <div className="flex items-center justify-center gap-3 mb-1">
                <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-[#b45309] to-transparent" />
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-[#78350f] tracking-wide">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#b45309]" />
                  <span>سامانه ملی هدایت تحصیلی و یادگیری پایدار «راهبُرد»</span>
                </div>
                <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-[#b45309] to-transparent" />
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#1e293b] tracking-tight leading-tight">
                گواهی‌نامه شایستگی یادآوری فعال و تثبیت در حافظه بلندمدت
              </h1>
              
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-[#b45309]">
                <span>«بر پایه نظریه علمی و الگوریتم فواصل بهینه هرمان ابینگهاوس»</span>
              </div>
            </div>

            {/* BODY: Recipient Citation and Honor Announcement */}
            <div className="relative z-10 text-center my-auto py-3 sm:py-5 space-y-3 sm:space-y-4">
              <div className="text-xs sm:text-sm text-slate-600 font-medium">
                بدین‌وسیله با افتخار و کمال شایستگی گواهی می‌شود که:
              </div>

              {/* Student Name */}
              <div className="relative inline-block px-8 py-2">
                <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0f172a] border-b-2 border-[#b45309]/50 pb-1 px-4 inline-block tracking-normal">
                  {studentName}
                </span>
                <div className="text-[11px] sm:text-xs text-[#b45309] font-bold mt-1.5">
                  {currentConfig.honorTitle}
                </div>
              </div>

              {/* Citation Body Text */}
              <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-[13px] text-slate-700 leading-relaxed font-normal px-4 text-justify sm:text-center">
                {currentConfig.citation} این مدرک به عنوان تاییدیه رسمی بر تسلط بر شیب منحنی فراموشی، تکرار موفق بازیابی در چرخه‌های فواصل طلایی و ارتقای پایداری شناختی صادر گردیده است.
              </p>

              {/* Key Quantitative Metrics Pill Bar */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-1">
                <div className="px-3 py-1 bg-amber-50 rounded-lg border border-amber-200/80 text-[11px] sm:text-xs text-amber-900 flex items-center gap-1.5 font-medium shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>تعداد مرورهای موفق:</span>
                  <strong className="font-bold font-mono text-slate-900">{totalReviewed} نوبت</strong>
                </div>

                <div className="px-3 py-1 bg-emerald-50 rounded-lg border border-emerald-200/80 text-[11px] sm:text-xs text-emerald-900 flex items-center gap-1.5 font-medium shadow-sm">
                  <Brain className="w-3.5 h-3.5 text-emerald-700" />
                  <span>نرخ پایداری حافظه:</span>
                  <strong className="font-bold font-mono text-slate-900">{retentionAverage}٪</strong>
                </div>

                <div className="px-3 py-1 bg-sky-50 rounded-lg border border-sky-200/80 text-[11px] sm:text-xs text-sky-900 flex items-center gap-1.5 font-medium shadow-sm">
                  <Trophy className="w-3.5 h-3.5 text-sky-700" />
                  <span>نشان افتخار:</span>
                  <strong className="font-bold text-slate-900">{currentConfig.badgeLabel}</strong>
                </div>
              </div>
            </div>

            {/* BOTTOM SECTION: Seal, Signatures, Verification & Date */}
            <div className="relative z-10 pt-3 sm:pt-4 border-t border-slate-200/80 grid grid-cols-12 items-end gap-2 text-xs">
              {/* Right Signature (Advisor / Ebbinghaus Principle) */}
              <div className="col-span-4 text-center sm:text-right space-y-1">
                <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium">مشاور و ناظر علمی الگو:</div>
                <div className="font-bold text-slate-900 text-xs sm:text-sm">دکتر هرمان ابینگهاوس</div>
                <div className="text-[10px] text-slate-500">پدر علم حافظه و فاصله‌گذاری</div>
                {/* Simulated Signature Line */}
                <div className="pt-1 flex items-center justify-center sm:justify-start">
                  <svg className="w-24 sm:w-28 h-7 text-[#b45309]/80" viewBox="0 0 120 30" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 20 Q 20 5, 40 18 T 75 10 T 110 22" />
                    <path d="M25 22 C 35 12, 45 28, 55 15" strokeWidth="1" />
                  </svg>
                </div>
              </div>

              {/* Center Embossed Medallion / Official Golden Seal with Ribbons */}
              <div className="col-span-4 flex flex-col items-center justify-center">
                <div className="relative flex flex-col items-center">
                  {/* Two Hanging Ribbon Tails */}
                  <div className="absolute -bottom-4 flex gap-1 z-0">
                    <div
                      className="w-3.5 h-7 transform -rotate-12 shadow-sm rounded-b-sm"
                      style={{ backgroundColor: currentConfig.ribbonColor }}
                    />
                    <div
                      className="w-3.5 h-7 transform rotate-12 shadow-sm rounded-b-sm"
                      style={{ backgroundColor: currentConfig.ribbonColor }}
                    />
                  </div>

                  {/* Circular Embossed Medallion */}
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-[#fffdfa] shadow-xl flex flex-col items-center justify-center text-white relative z-10 p-1"
                    style={{ background: currentConfig.sealBg }}
                  >
                    <div className="w-full h-full rounded-full border border-dashed border-amber-200/70 flex flex-col items-center justify-center text-center p-0.5">
                      <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-200 drop-shadow" />
                      <span className="text-[8px] sm:text-[9px] font-bold text-amber-100 uppercase tracking-tighter leading-tight mt-0.5">
                        راهبُرد
                      </span>
                      <span className="text-[7px] text-amber-200/90 leading-none">
                        تاییدیه رسمی
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-[9px] sm:text-[10px] font-bold text-slate-700 mt-5">
                  {currentConfig.stampText}
                </div>
              </div>

              {/* Left Signature & Verification Details */}
              <div className="col-span-4 text-center sm:text-left space-y-1">
                <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium">ریاست شورای یادگیری راهبُرد:</div>
                <div className="font-bold text-slate-900 text-xs sm:text-sm">هیات ارزیابی شناختی</div>
                {/* Official Circular Digital Stamp */}
                <div className="flex items-center justify-center sm:justify-end gap-2 pt-1">
                  <div className="text-right text-[10px] text-slate-600 font-mono space-y-0.5">
                    <div>تاریخ صدور: <strong className="text-slate-800">{issueDatePersian}</strong></div>
                    <div>شماره سند: <strong className="text-slate-800">{serialCode}</strong></div>
                  </div>
                  {/* Digital QR validation icon */}
                  <div className="w-8 h-8 rounded border border-slate-300 bg-white p-0.5 flex items-center justify-center text-slate-700 shadow-sm shrink-0">
                    <QrCode className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Tip Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              نکته چاپ: برای ذخیره به صورت PDF، در پنجره پرینت گزینه <strong>Destination: Save as PDF</strong> و جهت را روی <strong>Landscape (افقی)</strong> تنظیم فرمایید.
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="font-mono text-slate-500 text-[11px]">شناسه سند: {serialCode}</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Subtle Vector Corner Ornament for Persian Certificate Diploma Aesthetics
const CornerOrnament: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 80 80"
    width="50"
    height="50"
    className={className}
    fill="currentColor"
  >
    <path
      d="M10,10 L45,10 C40,20 40,25 35,35 C25,40 20,40 10,45 Z"
      fillOpacity="0.4"
    />
    <path
      d="M12,12 L60,12 C55,25 55,30 45,45 C30,55 25,55 12,60 L12,12 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeOpacity="0.8"
    />
    <circle cx="20" cy="20" r="3" fill="currentColor" fillOpacity="0.7" />
    <circle cx="35" cy="18" r="2" fill="currentColor" fillOpacity="0.6" />
    <circle cx="18" cy="35" r="2" fill="currentColor" fillOpacity="0.6" />
    <path
      d="M25,25 Q 35 25, 40 35 T 50 45"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeDasharray="2,2"
      strokeOpacity="0.6"
    />
  </svg>
);
