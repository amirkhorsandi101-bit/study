import React, { useState, useEffect, useMemo } from 'react';
import {
  Flame,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Zap,
  Filter,
  Download,
  Plus,
  Edit3,
  X,
  BookOpen,
  Star,
  RotateCcw,
  Check,
  Brain,
  Layers,
  Timer
} from 'lucide-react';

export interface StudyDayRecord {
  date: string; // YYYY-MM-DD
  hours: number;
  subjects: string[];
  focusRating: 1 | 2 | 3 | 4 | 5;
  ebbinghausReviewed: boolean;
  notes?: string;
}

const STORAGE_KEY = 'rahbord_study_habit_tracker_v1';

const SUBJECT_OPTIONS = [
  'زیست‌شناسی',
  'شیمی',
  'فیزیک',
  'ریاضیات',
  'هندسه و گسسته',
  'ادبیات فارسی',
  'زبان انگلیسی',
  'عربی',
  'دین و زندگی',
  'فلسفه و منطق',
  'روان‌شناسی و اقتصاد'
];

// Helper to format date to YYYY-MM-DD
function formatDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Persian formatted date helper
function getPersianDateLabel(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  try {
    const d = new Date(dateStr + 'T12:00:00');
    return new Intl.DateTimeFormat('fa-IR', options || {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(d);
  } catch {
    return dateStr;
  }
}

function getPersianShortDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + 'T12:00:00');
    return new Intl.DateTimeFormat('fa-IR', {
      month: 'short',
      day: 'numeric'
    }).format(d);
  } catch {
    return dateStr;
  }
}

// Generate realistic default historical seed data (covering last 140 days)
function generateSeedData(): Record<string, StudyDayRecord> {
  const records: Record<string, StudyDayRecord> = {};
  const today = new Date();
  
  // Create last 140 days
  for (let i = 139; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateKey = formatDateKey(d);
    
    // Simulate realistic study pattern:
    // Today and last 14 days have a solid continuous streak!
    const isRecent14Days = i <= 14;
    const isStudyDay = isRecent14Days || (i % 7 !== 5 && (i * 17) % 5 !== 0);
    
    if (isStudyDay) {
      // Hours between 2.0 and 8.0
      const hourVariants = [2.5, 3.5, 4.0, 5.0, 5.5, 6.5, 7.0, 8.0, 4.5, 6.0];
      const hours = hourVariants[(i * 3 + 2) % hourVariants.length];
      
      const subIndex1 = (i * 2) % SUBJECT_OPTIONS.length;
      const subIndex2 = (i * 3 + 1) % SUBJECT_OPTIONS.length;
      const subIndex3 = (i + 4) % SUBJECT_OPTIONS.length;
      const subjects = [SUBJECT_OPTIONS[subIndex1], SUBJECT_OPTIONS[subIndex2]];
      if (hours >= 5.5 && subIndex3 !== subIndex1 && subIndex3 !== subIndex2) {
        subjects.push(SUBJECT_OPTIONS[subIndex3]);
      }
      
      const focusRating = ((((i * 7) % 3) + 3) as 1 | 2 | 3 | 4 | 5);
      const ebbinghausReviewed = (i % 2 === 0);
      
      records[dateKey] = {
        date: dateKey,
        hours,
        subjects,
        focusRating,
        ebbinghausReviewed,
        notes: i % 10 === 0 ? 'مرور مفهومی تست‌های نشان‌دار با تمرکز بالا' : undefined
      };
    }
  }
  
  return records;
}

export const DailyStudyHabitTracker: React.FC = () => {
  const [records, setRecords] = useState<Record<string, StudyDayRecord>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read study habits from localStorage', e);
    }
    return generateSeedData();
  });

  // Save to local storage on record change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.warn('Could not save study habits to localStorage', e);
    }
  }, [records]);

  // Real-time synchronization when Deep Work Pomodoro or other components log sessions
  useEffect(() => {
    const handleHabitUpdate = (e?: Event) => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setRecords(JSON.parse(stored));
        }
        // If event provided detail, show a brief toast
        const customEvent = e as CustomEvent;
        if (customEvent && customEvent.detail && customEvent.detail.hoursAdded) {
          setToastMessage(`🔥 جلسه کار عمیق ثبت شد (+${customEvent.detail.hoursAdded} ساعت به زنجیره امروز افزوده شد)`);
        }
      } catch (err) {
        console.warn('Could not refresh study habits from event', err);
      }
    };

    window.addEventListener('rahbord_habit_updated', handleHabitUpdate);
    window.addEventListener('storage', handleHabitUpdate);
    return () => {
      window.removeEventListener('rahbord_habit_updated', handleHabitUpdate);
      window.removeEventListener('storage', handleHabitUpdate);
    };
  }, []);

  // Selected cell for detail view or modal
  const [selectedDate, setSelectedDate] = useState<string>(() => formatDateKey(new Date()));
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalDate, setModalDate] = useState<string>(() => formatDateKey(new Date()));

  // Form states for log modal
  const [formHours, setFormHours] = useState<number>(4.0);
  const [formSubjects, setFormSubjects] = useState<string[]>(['زیست‌شناسی', 'شیمی']);
  const [customSubjectInput, setCustomSubjectInput] = useState<string>('');
  const [formFocus, setFormFocus] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [formEbbinghaus, setFormEbbinghaus] = useState<boolean>(true);
  const [formNotes, setFormNotes] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters & views
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [viewWeeks, setViewWeeks] = useState<number>(20); // 12, 20, 28

  // Clear toast after 3 seconds
  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  const todayKey = useMemo(() => formatDateKey(new Date()), []);
  const todayRecord = records[todayKey];

  // Helper to open modal for a specific date
  const handleOpenLogModal = (dateKey: string) => {
    setModalDate(dateKey);
    const existing = records[dateKey];
    if (existing) {
      setFormHours(existing.hours);
      setFormSubjects(existing.subjects && existing.subjects.length > 0 ? [...existing.subjects] : ['زیست‌شناسی']);
      setFormFocus(existing.focusRating || 4);
      setFormEbbinghaus(existing.ebbinghausReviewed ?? true);
      setFormNotes(existing.notes || '');
    } else {
      setFormHours(4.0);
      setFormSubjects(['زیست‌شناسی', 'شیمی']);
      setFormFocus(4);
      setFormEbbinghaus(true);
      setFormNotes('');
    }
    setIsModalOpen(true);
  };

  // Quick log for today
  const handleQuickLogToday = (hoursToAdd = 2.0) => {
    const existing = records[todayKey];
    const newHours = existing ? Math.min(16, existing.hours + hoursToAdd) : hoursToAdd;
    const updated: StudyDayRecord = {
      date: todayKey,
      hours: newHours,
      subjects: existing?.subjects || ['زیست‌شناسی', 'ریاضیات'],
      focusRating: existing?.focusRating || 4,
      ebbinghausReviewed: true,
      notes: existing?.notes || 'ثبت سریع مطالعه امروز'
    };

    setRecords(prev => ({
      ...prev,
      [todayKey]: updated
    }));

    setSelectedDate(todayKey);
    setToastMessage(`🔥 مطالعه امروز ثبت شد! (${newHours} ساعت) زنجیره شما حفظ شد.`);
  };

  // Save modal submission
  const handleSaveModal = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (formHours <= 0) {
      // Remove or set to 0
      setRecords(prev => {
        const copy = { ...prev };
        delete copy[modalDate];
        return copy;
      });
      setToastMessage(`اطلاعات روز ${getPersianShortDate(modalDate)} بازنشانی شد.`);
    } else {
      const updated: StudyDayRecord = {
        date: modalDate,
        hours: Number(formHours.toFixed(1)),
        subjects: formSubjects.length > 0 ? formSubjects : ['مطالعه عمومی'],
        focusRating: formFocus,
        ebbinghausReviewed: formEbbinghaus,
        notes: formNotes.trim() || undefined
      };

      setRecords(prev => ({
        ...prev,
        [modalDate]: updated
      }));
      setToastMessage(`✅ اطلاعات مطالعه روز ${getPersianShortDate(modalDate)} با موفقیت ذخیره شد.`);
    }

    setIsModalOpen(false);
    setSelectedDate(modalDate);
  };

  // Toggle subject selection in modal
  const toggleSubject = (sub: string) => {
    setFormSubjects(prev => 
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    );
  };

  const handleAddCustomSubject = () => {
    const trimmed = customSubjectInput.trim();
    if (trimmed && !formSubjects.includes(trimmed)) {
      setFormSubjects(prev => [...prev, trimmed]);
      setCustomSubjectInput('');
    }
  };

  // Calculate Streak & Metrics
  const metrics = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Current Streak calculation:
    let currentStreak = 0;
    const checkDate = new Date(today);
    const todayRecorded = (records[formatDateKey(today)]?.hours || 0) > 0;
    
    if (!todayRecorded) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const key = formatDateKey(checkDate);
      const rec = records[key];
      if (rec && rec.hours > 0) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // 2. Longest Streak calculation:
    const allDates = Object.keys(records)
      .filter(k => (records[k]?.hours || 0) > 0)
      .sort();

    let longestStreak = 0;
    let tempStreak = 0;
    let prevD: Date | null = null;

    for (const dStr of allDates) {
      const curD = new Date(dStr + 'T12:00:00');
      if (!prevD) {
        tempStreak = 1;
      } else {
        const diffDays = Math.round((curD.getTime() - prevD.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      }
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
      prevD = curD;
    }

    // 3. Total active days & Total hours
    let totalActiveDays = 0;
    let totalHours = 0;
    let totalEbbinghausDays = 0;

    Object.values(records).forEach(rec => {
      if (rec.hours > 0) {
        totalActiveDays++;
        totalHours += rec.hours;
        if (rec.ebbinghausReviewed) {
          totalEbbinghausDays++;
        }
      }
    });

    // 4. Past 30 days consistency rate
    let past30Active = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const k = formatDateKey(d);
      if ((records[k]?.hours || 0) > 0) {
        past30Active++;
      }
    }
    const consistencyRate = Math.round((past30Active / 30) * 100);

    return {
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
      totalActiveDays,
      totalHours: Number(totalHours.toFixed(1)),
      totalEbbinghausDays,
      consistencyRate,
      averageHoursPerActiveDay: totalActiveDays > 0 ? (totalHours / totalActiveDays).toFixed(1) : '0'
    };
  }, [records]);

  // Align weeks by Saturday (index 0) to Friday (index 6) in Persian calendar.
  const getPersianDayOfWeekIndex = (d: Date): number => {
    const jsDay = d.getDay();
    return (jsDay + 1) % 7;
  };

  const PERSIAN_WEEKDAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];

  // Build grid data for viewWeeks (e.g. 20 weeks)
  const heatmapGrid = useMemo(() => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    const todayDayOfWeek = getPersianDayOfWeekIndex(today);
    const endFriday = new Date(today);
    endFriday.setDate(today.getDate() + (6 - todayDayOfWeek));

    const totalDays = viewWeeks * 7;
    const startDate = new Date(endFriday);
    startDate.setDate(endFriday.getDate() - totalDays + 1);

    const weeks: Array<{
      weekIndex: number;
      monthLabel?: string;
      days: Array<{
        dateKey: string;
        date: Date;
        dayIndex: number;
        record?: StudyDayRecord;
        isToday: boolean;
        isFuture: boolean;
        level: 0 | 1 | 2 | 3 | 4;
        matchesFilter: boolean;
      }>;
    }> = [];

    let currentCursor = new Date(startDate);
    let lastMonthSeen = -1;

    for (let w = 0; w < viewWeeks; w++) {
      const daysInWeek = [];
      let weekMonthLabel: string | undefined = undefined;

      for (let d = 0; d < 7; d++) {
        const curDate = new Date(currentCursor);
        const dateKey = formatDateKey(curDate);
        const isToday = dateKey === todayKey;
        const isFuture = curDate.getTime() > today.getTime() + 1000 * 60 * 60 * 12;

        const rec = records[dateKey];
        const hours = (!isFuture && rec) ? rec.hours : 0;

        const matchesFilter = subjectFilter === 'all' 
          ? true 
          : (rec?.subjects?.includes(subjectFilter) || false);

        let level: 0 | 1 | 2 | 3 | 4 = 0;
        if (!isFuture && hours > 0 && matchesFilter) {
          if (hours < 2.5) level = 1;
          else if (hours < 5.0) level = 2;
          else if (hours < 7.5) level = 3;
          else level = 4;
        }

        try {
          const pMonth = new Intl.DateTimeFormat('fa-IR', { month: 'numeric' }).format(curDate);
          const pMonthNum = parseInt(pMonth, 10);
          if (pMonthNum !== lastMonthSeen && d === 0) {
            lastMonthSeen = pMonthNum;
            weekMonthLabel = new Intl.DateTimeFormat('fa-IR', { month: 'short' }).format(curDate);
          }
        } catch {
          // fallback
        }

        daysInWeek.push({
          dateKey,
          date: curDate,
          dayIndex: d,
          record: rec,
          isToday,
          isFuture,
          level,
          matchesFilter
        });

        currentCursor.setDate(currentCursor.getDate() + 1);
      }

      weeks.push({
        weekIndex: w,
        monthLabel: weekMonthLabel,
        days: daysInWeek
      });
    }

    return weeks;
  }, [viewWeeks, records, todayKey, subjectFilter]);

  // Heatmap intensity cell background classes
  const getCellClasses = (level: 0 | 1 | 2 | 3 | 4, isToday: boolean, isSelected: boolean, isFuture: boolean) => {
    if (isFuture) {
      return 'bg-slate-900/40 border border-slate-900/60 cursor-not-allowed opacity-40';
    }

    let bg = 'bg-slate-900 border border-slate-800/80 hover:border-slate-600 hover:scale-110';
    if (level === 1) {
      bg = 'bg-emerald-950/70 border border-emerald-800/60 hover:border-emerald-500 hover:scale-110';
    } else if (level === 2) {
      bg = 'bg-emerald-800/85 border border-emerald-600/70 hover:border-emerald-400 hover:scale-110';
    } else if (level === 3) {
      bg = 'bg-emerald-600 border border-emerald-400/80 hover:border-emerald-300 hover:scale-110 shadow-xs shadow-emerald-500/20';
    } else if (level === 4) {
      bg = 'bg-emerald-400 border border-emerald-300 hover:bg-emerald-300 hover:scale-110 shadow-xs shadow-emerald-400/40';
    }

    if (isSelected) {
      return `${bg} ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-950 z-10`;
    }

    if (isToday) {
      return `${bg} ring-1 ring-amber-400/80`;
    }

    return bg;
  };

  // Milestone Progress definitions
  const STREAK_MILESTONES = [
    { target: 3, label: 'جوانه استمرار', desc: 'شکستن مقاومت اولیه مغز' },
    { target: 7, label: 'هفته طلایی', desc: 'تکمیل اولین چرخه ۷ روزه' },
    { target: 14, label: 'تثبیت دوپامینی', desc: 'تنظیم ریتم شبانه‌روزی مطالعه' },
    { target: 21, label: 'آستانه عادت مالتز', desc: 'کاهش نیاز به اراده آگاهانه' },
    { target: 45, label: 'مداربندی عصبی', desc: 'انعطاف‌پذیری پایدار مغزی' },
    { target: 66, label: 'خودکارسازی UCL', desc: 'شکل‌گیری کامل عادت ناخودآگاه' },
    { target: 90, label: 'استادی سبک زندگی', desc: 'تضمین تسلط و استمرار رتبه برتری' }
  ];

  const currentMilestone = useMemo(() => {
    const next = STREAK_MILESTONES.find(m => m.target > metrics.currentStreak);
    const prev = [...STREAK_MILESTONES].reverse().find(m => m.target <= metrics.currentStreak);
    return {
      current: prev || { target: 0, label: 'آغاز مسیر', desc: 'گام‌های اولیه شکل‌گیری عادت' },
      next: next || STREAK_MILESTONES[STREAK_MILESTONES.length - 1],
      isMax: !next
    };
  }, [metrics.currentStreak]);

  // Export CSV
  const handleExportCSV = () => {
    try {
      const sortedDates = Object.keys(records).sort();
      let csvContent = '\uFEFF'; // UTF-8 BOM
      csvContent += 'تاریخ میلادی,تاریخ شمسی,ساعت مطالعه,دروس مطالعه شده,کیفیت تمرکز (از ۵),مرور ابینگهاوس,یادداشت\n';

      sortedDates.forEach(dateKey => {
        const item = records[dateKey];
        if (item && item.hours > 0) {
          const jalaliDate = getPersianDateLabel(dateKey, { year: 'numeric', month: 'numeric', day: 'numeric' });
          const subs = item.subjects.join(' | ');
          const ebbinghaus = item.ebbinghausReviewed ? 'بله' : 'خیر';
          const notes = (item.notes || '').replace(/"/g, '""');
          csvContent += `"${dateKey}","${jalaliDate}",${item.hours},"${subs}",${item.focusRating},"${ebbinghaus}","${notes}"\n`;
        }
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `rahbord_habit_streaks_${todayKey}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setToastMessage('خروجی گزارش استمرار با موفقیت دانلود شد.');
    } catch (err) {
      console.error('Error generating CSV', err);
      setToastMessage('خطا در صدور فایل گزارش.');
    }
  };

  // Reset demo data
  const handleResetData = () => {
    if (window.confirm('آیا مایل به بازنشانی داده‌های استمرار به حالت پیش‌فرض هوشمند هستید؟')) {
      const initial = generateSeedData();
      setRecords(initial);
      setSelectedDate(todayKey);
      setToastMessage('داده‌های نمونه استمرار بازنشانی شدند.');
    }
  };

  const activeDayRecord = records[selectedDate];

  return (
    <section id="habit-tracker" className="py-16 px-4 md:px-8 max-w-7xl mx-auto text-right" dir="rtl">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 border border-emerald-500/60 text-emerald-200 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in backdrop-blur-md">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 animate-pulse" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Container */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <Flame className="w-3.5 h-3.5 animate-bounce" />
            <span>مدل عصبی خودکارسازی رفتار (UCL & Atomic Habits)</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>ردیاب روزانه عادات مطالعه و نقشه حرارتی</span>
            <span className="text-xs px-2.5 py-1 rounded-md bg-amber-400/10 border border-amber-400/30 text-amber-300 font-normal">
              زنجیره {metrics.currentStreak} روزه 🔥
            </span>
          </h2>
          <p className="mt-2 text-sm text-slate-400 max-w-2xl leading-relaxed">
            استمرار مداوم حتی با ۳۰ دقیقه در روز، سیناپس‌های قشر پیش‌پیشانی مغز را تثبیت می‌کند. با ثبت روزانه، اجازه ندهید زنجیره پاره شود؛ «قانون هرگز ۲ روز متوالی را از دست نده».
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleOpenLogModal(todayKey)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-95 rounded-xl transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>ثبت مطالعه امروز</span>
          </button>

          <button
            onClick={() => handleQuickLogToday(2.0)}
            className="flex items-center gap-2 px-3.5 py-2.5 text-xs md:text-sm font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 hover:text-white border border-slate-800 rounded-xl transition-all cursor-pointer"
            title="ثبت سریع ۲ ساعت مطالعه برای حفظ فوری زنجیره"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>ثبت سریع ۲ ساعت</span>
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('toolkit');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 px-3.5 py-2.5 text-xs md:text-sm font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-all cursor-pointer"
            title="شروع تایمر کار عمیق و ثبت خودکار در زنجیره"
          >
            <Timer className="w-4 h-4 text-amber-400" />
            <span>تایمر کار عمیق ⏱️</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2.5 text-xs md:text-sm font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 hover:text-white border border-slate-800 rounded-xl transition-all cursor-pointer"
            title="خروجی فایل اکسل / CSV"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>اکسل CSV</span>
          </button>
        </div>
      </div>

      {/* Today's Status Banner */}
      <div className={`mb-8 p-4 md:p-5 rounded-2xl border transition-all ${
        todayRecord && todayRecord.hours > 0
          ? 'bg-emerald-950/20 border-emerald-500/40'
          : 'bg-amber-950/20 border-amber-500/40'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              todayRecord && todayRecord.hours > 0
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
            }`}>
              {todayRecord && todayRecord.hours > 0 ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : (
                <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm md:text-base">
                  {todayRecord && todayRecord.hours > 0
                    ? `آفرین! امروز ${todayRecord.hours} ساعت مطالعه ثبت شده است`
                    : 'امروز هنوز مطالعه‌ای ثبت نشده است!'}
                </span>
                <span className="text-xs text-slate-400">
                  ({getPersianDateLabel(todayKey, { weekday: 'long', day: 'numeric', month: 'long' })})
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {todayRecord && todayRecord.hours > 0
                  ? `دروس: ${todayRecord.subjects.join('، ')} • زنجیره ${metrics.currentStreak} روزه شما فعال است.`
                  : 'برای زنده نگه داشتن زنجیره، حداقل ۳۰ دقیقه مطالعه در برنامه ثبت کنید.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {todayRecord && todayRecord.hours > 0 ? (
              <button
                onClick={() => handleOpenLogModal(todayKey)}
                className="px-3.5 py-2 text-xs font-semibold text-emerald-300 hover:text-emerald-200 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>ویرایش مطالعه امروز</span>
              </button>
            ) : (
              <button
                onClick={() => handleOpenLogModal(todayKey)}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-lg transition-all shadow-sm shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>ثبت با جزئیات کامل</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Metric 1: Current Streak */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>زنجیره فعال کنونی</span>
            <Flame className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {metrics.currentStreak}
            </span>
            <span className="text-xs text-amber-400 font-medium">روز پیاپی</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>{metrics.currentStreak > 0 ? 'زنجیره فعال و برقرار است' : 'امروز آغاز کنید'}</span>
          </div>
        </div>

        {/* Metric 2: Longest Streak */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>بهترین رکورد تاریخی</span>
            <Award className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {metrics.longestStreak}
            </span>
            <span className="text-xs text-slate-400 font-medium">روز</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            <span>فاصله تا رکورد جدید: {Math.max(0, metrics.longestStreak - metrics.currentStreak + 1)} روز</span>
          </div>
        </div>

        {/* Metric 3: Total Active Days */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>تعداد کل روزهای مطالعه</span>
            <Calendar className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {metrics.totalActiveDays}
            </span>
            <span className="text-xs text-sky-400 font-medium">روز</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            <span>نرخ ثبات ۳۰ روز گذشته: {metrics.consistencyRate}٪</span>
          </div>
        </div>

        {/* Metric 4: Total Study Hours */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>مجموع ساعات ثبت‌شده</span>
            <Clock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {metrics.totalHours}
            </span>
            <span className="text-xs text-amber-400 font-medium">ساعت</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            <span>میانگین {metrics.averageHoursPerActiveDay} ساعت به ازای هر روز فعال</span>
          </div>
        </div>
      </div>

      {/* Habit Neuroplasticity Milestone Progression */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-amber-400" />
              <span>مراحل تثبیت عصب‌شناختی عادت (مدل دانشگاه لندن - Phillippa Lally)</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              مرحله فعلی شما: <strong className="text-amber-300">{currentMilestone.current.label}</strong> • هدف بعدی: <strong className="text-emerald-300">{currentMilestone.next.label}</strong> ({currentMilestone.next.target} روز)
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 self-start sm:self-auto">
            {metrics.currentStreak} از {currentMilestone.next.target} روز ({Math.min(100, Math.round((metrics.currentStreak / currentMilestone.next.target) * 100))}٪)
          </div>
        </div>

        {/* Milestone Steps Bar */}
        <div className="space-y-3">
          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-300 h-2.5 rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(100, Math.max(5, (metrics.currentStreak / currentMilestone.next.target) * 100))}%`
              }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2">
            {STREAK_MILESTONES.map((milestone) => {
              const isReached = metrics.currentStreak >= milestone.target;
              const isCurrentTarget = currentMilestone.next.target === milestone.target;

              return (
                <div
                  key={milestone.target}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isReached
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : isCurrentTarget
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 ring-1 ring-amber-500/30'
                      : 'bg-slate-950/40 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 text-[11px] font-bold">
                    {isReached ? <Check className="w-3 h-3 text-emerald-400" /> : <Clock className="w-3 h-3 opacity-60" />}
                    <span>{milestone.target} روز</span>
                  </div>
                  <div className="text-[11px] font-semibold truncate mt-0.5">{milestone.label}</div>
                  <div className="text-[9px] text-slate-400 truncate mt-0.5">{milestone.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Heatmap Container */}
      <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-5 md:p-6 mb-8 shadow-xl">
        {/* Controls: Filter & Weeks View */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 ml-2">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span>فیلتر مبحث:</span>
            </span>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="bg-slate-950 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="all">همه مباحث و دروس</option>
              {SUBJECT_OPTIONS.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>

            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-4 ml-2">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>بازه زمانی:</span>
            </span>
            <div className="inline-flex rounded-lg bg-slate-950 p-0.5 border border-slate-800 text-xs">
              <button
                onClick={() => setViewWeeks(12)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  viewWeeks === 12 ? 'bg-slate-800 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                ۱۲ هفته (۳ ماه)
              </button>
              <button
                onClick={() => setViewWeeks(20)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  viewWeeks === 20 ? 'bg-slate-800 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                ۲۰ هفته (۵ ماه)
              </button>
              <button
                onClick={() => setViewWeeks(28)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  viewWeeks === 28 ? 'bg-slate-800 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                ۲۸ هفته (۷ ماه)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetData}
              className="text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-slate-800/80 transition-colors flex items-center gap-1 cursor-pointer"
              title="بازنشانی اطلاعات نمونه"
            >
              <RotateCcw className="w-3 h-3" />
              <span>بازنشانی داده نمونه</span>
            </button>
          </div>
        </div>

        {/* Heatmap Grid Visual */}
        <div className="overflow-x-auto pb-4 pt-1">
          <div className="inline-block min-w-full">
            {/* Months Header Row */}
            <div className="flex items-center mb-2 pr-12 text-xs font-medium text-slate-400 select-none">
              {heatmapGrid.map((week, idx) => (
                <div key={idx} className="w-3.5 md:w-4.5 mx-0.5 text-center shrink-0">
                  {week.monthLabel ? (
                    <span className="text-[11px] text-amber-300/90 font-bold block whitespace-nowrap -rotate-12 translate-y-[-2px]">
                      {week.monthLabel}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>

            {/* Grid with Weekday Labels on Right */}
            <div className="flex items-start">
              {/* Persian Weekday Names Column */}
              <div className="flex flex-col gap-1.5 pl-3 select-none text-[10px] text-slate-400 font-medium shrink-0 pt-0.5">
                {PERSIAN_WEEKDAYS.map((dayName, idx) => (
                  <div key={idx} className="h-3.5 md:h-4.5 flex items-center justify-end leading-none">
                    {idx % 2 === 0 ? dayName : ''}
                  </div>
                ))}
              </div>

              {/* Columns of Weeks */}
              <div className="flex gap-1 md:gap-1.5">
                {heatmapGrid.map((week) => (
                  <div key={week.weekIndex} className="flex flex-col gap-1 md:gap-1.5 shrink-0">
                    {week.days.map((day) => {
                      const isSelected = selectedDate === day.dateKey;
                      const hasStudy = day.record && day.record.hours > 0;

                      return (
                        <div
                          key={day.dateKey}
                          onClick={() => {
                            if (!day.isFuture) {
                              setSelectedDate(day.dateKey);
                            }
                          }}
                          onDoubleClick={() => {
                            if (!day.isFuture) {
                              handleOpenLogModal(day.dateKey);
                            }
                          }}
                          className={`w-3.5 h-3.5 md:w-4.5 md:h-4.5 rounded-sm md:rounded transition-all cursor-pointer ${getCellClasses(
                            day.level,
                            day.isToday,
                            isSelected,
                            day.isFuture
                          )}`}
                          title={`${getPersianDateLabel(day.dateKey, { month: 'short', day: 'numeric' })}: ${
                            day.isFuture ? 'آینده' : hasStudy ? `${day.record?.hours} ساعت مطالعه` : 'بدون مطالعه'
                          }`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend & Instructions Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-400">شدت مطالعه روزانه:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px]">۰ ساعت</span>
              <span className="w-3.5 h-3.5 rounded-sm bg-slate-900 border border-slate-800" title="بدون مطالعه (۰h)" />
              <span className="w-3.5 h-3.5 rounded-sm bg-emerald-950/70 border border-emerald-800/60" title="سبک: تا ۲.۵ ساعت" />
              <span className="w-3.5 h-3.5 rounded-sm bg-emerald-800/85 border border-emerald-600/70" title="متوسط: ۲.۵ تا ۵ ساعت" />
              <span className="w-3.5 h-3.5 rounded-sm bg-emerald-600 border border-emerald-400/80" title="عمیق: ۵ تا ۷.۵ ساعت" />
              <span className="w-3.5 h-3.5 rounded-sm bg-emerald-400 border border-emerald-300" title="تسلط بالا: ۷.۵+ ساعت" />
              <span className="text-[10px]">+۸ ساعت</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>💡 برای مشاهده جزئیات کلیک کنید • برای ویرایش دوبار کلیک کنید</span>
          </div>
        </div>
      </div>

      {/* Selected Day Detail Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>جزئیات روز انتخاب‌شده در نقشه حرارتی:</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <span>{getPersianDateLabel(selectedDate)}</span>
              {selectedDate === todayKey && (
                <span className="text-xs px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  امروز
                </span>
              )}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenLogModal(selectedDate)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all cursor-pointer shadow-sm shadow-amber-500/20"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{activeDayRecord ? 'ویرایش اطلاعات این روز' : 'ثبت مطالعه برای این روز'}</span>
            </button>
          </div>
        </div>

        {activeDayRecord && activeDayRecord.hours > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            {/* Duration */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>مدت مطالعه</span>
              </div>
              <div className="text-2xl font-bold text-white flex items-baseline gap-1">
                <span>{activeDayRecord.hours}</span>
                <span className="text-xs text-slate-400 font-normal">ساعت</span>
              </div>
            </div>

            {/* Focus Rating */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span>کیفیت تمرکز و غوطه‌وری</span>
              </div>
              <div className="flex items-center gap-1 text-amber-400 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= activeDayRecord.focusRating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-700'
                    }`}
                  />
                ))}
                <span className="text-xs text-slate-300 mr-2">
                  ({activeDayRecord.focusRating} از ۵)
                </span>
              </div>
            </div>

            {/* Ebbinghaus Review */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-emerald-400" />
                <span>مرور طبق ابینگهاوس</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                {activeDayRecord.ebbinghausReviewed ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/60">
                    <Check className="w-3 h-3" />
                    انجام شد
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                    مرور جداگانه ثبت نشد
                  </span>
                )}
              </div>
            </div>

            {/* Subjects */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 sm:col-span-2 lg:col-span-1">
              <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                <span>دروس و مباحث</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {activeDayRecord.subjects.map((sub, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* Notes if present */}
            {activeDayRecord.notes && (
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 sm:col-span-2 lg:col-span-4 text-xs text-slate-300 leading-relaxed">
                <span className="text-amber-400 font-semibold block mb-1">یادداشت دانش‌آموز:</span>
                {activeDayRecord.notes}
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Clock className="w-10 h-10 text-slate-700 mx-auto mb-2" />
            <p className="text-sm text-slate-400">
              برای تاریخ {getPersianDateLabel(selectedDate, { month: 'long', day: 'numeric' })} هنوز مطالعه‌ای ثبت نشده است.
            </p>
            <button
              onClick={() => handleOpenLogModal(selectedDate)}
              className="mt-3 px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all cursor-pointer"
            >
              ثبت مطالعه برای این روز
            </button>
          </div>
        )}
      </div>

      {/* Habit Science Insights Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
            <Flame className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-white mb-1.5">قانون طلایی «هرگز ۲ بار پیاپی متوقف نشو»</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            از دست دادن یک روز به دلیل خستگی طبیعی است؛ اما از دست دادن ۲ روز متوالی، آغاز شکل‌گیری یک عادت جدید منفی است. حتی ۵ دقیقه بازخوانی خلاصه، پیوستگی عصبی را حفظ می‌کند.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
            <Brain className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-white mb-1.5">قانون هب: شلیک همزمان سیناپس‌ها</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            نورون‌هایی که با هم شلیک می‌شوند، به هم متصل می‌گردند. زنجیره‌های مداوم بالاتر از ۱۴ روز، مقاومت اولیه سیستم لیمبیک برای نشستن پشت میز مطالعه را به حداقل می‌رسانند.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-3">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-white mb-1.5">اثر مشاهده نقشه حرارتی (Self-Monitoring)</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            پژوهش‌های رفتاری نشان می‌دهد بازخورد دیداری نقشه حرارتی، به عنوان یک محرک برون‌زا ترشح دوپامین را تحریک کرده و انگیزه درونی برای پُر کردن مربع‌های سبز رنگ را تقویت می‌کند.
          </p>
        </div>
      </div>

      {/* Log / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-right" dir="rtl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 left-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-white">ثبت و به‌روزرسانی مطالعه روزانه</h3>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              تاریخ: <strong className="text-amber-300">{getPersianDateLabel(modalDate)}</strong>
            </p>

            <form onSubmit={handleSaveModal} className="space-y-5">
              {/* Hours input with quick presets */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  ساعت مطالعه: <span className="text-emerald-400 text-sm font-bold">{formHours} ساعت</span>
                </label>
                <div className="flex items-center gap-3 mb-2.5">
                  <input
                    type="range"
                    min="0"
                    max="14"
                    step="0.5"
                    value={formHours}
                    onChange={(e) => setFormHours(parseFloat(e.target.value))}
                    className="w-full accent-emerald-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="16"
                    step="0.5"
                    value={formHours}
                    onChange={(e) => setFormHours(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-16 px-2 py-1.5 text-center text-xs font-bold text-white bg-slate-950 border border-slate-800 rounded-lg"
                  />
                </div>
                {/* Presets */}
                <div className="flex items-center gap-1.5">
                  {[1.5, 3.0, 4.5, 6.0, 8.0].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setFormHours(preset)}
                      className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors ${
                        formHours === preset
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {preset}h
                    </button>
                  ))}
                </div>
              </div>

              {/* Subjects Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  دروس مطالعه شده (انتخاب چندتایی):
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2.5 max-h-32 overflow-y-auto p-1 bg-slate-950/40 rounded-xl border border-slate-800/80">
                  {SUBJECT_OPTIONS.map((sub) => {
                    const isSelected = formSubjects.includes(sub);
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => toggleSubject(sub)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {sub}
                      </button>
                    );
                  })}
                </div>
                {/* Add Custom Subject */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="افزودن مبحث یا درس اختصاصی..."
                    value={customSubjectInput}
                    onChange={(e) => setCustomSubjectInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomSubject();
                      }
                    }}
                    className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSubject}
                    className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    افزودن
                  </button>
                </div>
              </div>

              {/* Focus Quality */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  کیفیت تمرکز و عمق توجه (Deep Work):
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { rating: 1, label: 'پراکنده' },
                    { rating: 2, label: 'کم' },
                    { rating: 3, label: 'متوسط' },
                    { rating: 4, label: 'عمیق' },
                    { rating: 5, label: 'غوطه‌وری کامل' }
                  ].map((item) => (
                    <button
                      key={item.rating}
                      type="button"
                      onClick={() => setFormFocus(item.rating as 1 | 2 | 3 | 4 | 5)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        formFocus === item.rating
                          ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-center mb-0.5">
                        <Star className={`w-3.5 h-3.5 ${formFocus === item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                      </div>
                      <div className="text-[10px]">{item.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ebbinghaus Review Checkbox */}
              <div className="flex items-center gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  id="ebbinghaus-check"
                  checked={formEbbinghaus}
                  onChange={(e) => setFormEbbinghaus(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
                <label htmlFor="ebbinghaus-check" className="text-xs text-slate-300 cursor-pointer select-none">
                  بخشی از مطالعه امروز صرف <strong>مرور منظم ابینگهاوس</strong> شد (+ امتیاز تثبیت حافظه)
                </label>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  یادداشت و نکات کلیدی امروز (اختیاری):
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="مثال: تست‌های نشان‌دار ژنتیک را کار کردم، روی سرعت تست‌زنی ریاضی بیشتر کار شود..."
                  rows={2}
                  className="w-full text-xs p-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
                {records[modalDate] ? (
                  <button
                    type="button"
                    onClick={() => {
                      setFormHours(0);
                      setTimeout(() => handleSaveModal(), 50);
                    }}
                    className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    حذف مطالعه این روز
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    ذخیره و ثبت در زنجیره
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
