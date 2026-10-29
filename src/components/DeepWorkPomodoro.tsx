import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Flame,
  Brain,
  Headphones,
  Sparkles,
  Volume2,
  VolumeX,
  Plus,
  ArrowRight,
  Clock,
  Target,
  Layers,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Zap,
  Coffee,
  Check,
  History,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { StudyDayRecord } from './DailyStudyHabitTracker';

export const HABIT_STORAGE_KEY = 'rahbord_study_habit_tracker_v1';
export const DEEP_WORK_SESSIONS_KEY = 'rahbord_deep_work_sessions_log';
export const FOCUS_MODE_STORAGE_KEY = 'rahbord_focus_mode_active';

export interface DeepWorkSessionLog {
  id: string;
  timestamp: string;
  protocolName: string;
  durationMinutes: number;
  subject: string;
  focusRating: 1 | 2 | 3 | 4 | 5;
  ebbinghausReviewed: boolean;
  goalNote?: string;
  distractionsCount: number;
}

export type FocusProtocolId = 'pomodoro_25' | 'deep_sprint_50' | 'ultradian_90' | 'custom';

interface FocusProtocol {
  id: FocusProtocolId;
  name: string;
  subtitle: string;
  focusMinutes: number;
  recallMinutes: number;
  breakMinutes: number;
  scientificInsight: string;
}

const PROTOCOLS: Record<FocusProtocolId, FocusProtocol> = {
  pomodoro_25: {
    id: 'pomodoro_25',
    name: 'پومودوروی کلاسیک و بازیابی',
    subtitle: '۲۵ دقیقه مطالعه + ۲ دقیقه بازیابی فعال + ۵ دقیقه استراحت',
    focusMinutes: 25,
    recallMinutes: 2,
    breakMinutes: 5,
    scientificInsight: 'بهینه‌ترین زمان برای حفظ توجه متمرکز بدون خستگی قشر پیش‌پیشانی مغز.'
  },
  deep_sprint_50: {
    id: 'deep_sprint_50',
    name: 'اسپرینت کار عمیق (Cal Newport)',
    subtitle: '۵۰ دقیقه غوطه‌وری کامل + ۱۰ دقیقه استراحت مغزی',
    focusMinutes: 50,
    recallMinutes: 3,
    breakMinutes: 10,
    scientificInsight: 'ایده‌آل برای حل مسائل پیچیده فیزیک، ریاضی و ژنتیک که نیاز به ورود به حالت Flow دارند.'
  },
  ultradian_90: {
    id: 'ultradian_90',
    name: 'چرخه اولترادین تسلط (Ultradian Rhythm)',
    subtitle: '۹۰ دقیقه قله توجه سیناپسی + ۲۰ دقیقه استراحت و ریکاوری کامل',
    focusMinutes: 90,
    recallMinutes: 5,
    breakMinutes: 20,
    scientificInsight: 'مطابق ریتم بیولوژیکی مغز انسان، ۹۰ دقیقه سقف طبیعی بهره‌وری شناختی در شبانه‌روز است.'
  },
  custom: {
    id: 'custom',
    name: 'تنظیم سفارشی پارت مطالعه',
    subtitle: 'مدت زمان دلخواه متناسب با برنامه درسی شخصی',
    focusMinutes: 40,
    recallMinutes: 2,
    breakMinutes: 8,
    scientificInsight: 'تنظیم انعطاف‌پذیر برای آزمون‌های آزمایشی و حل تست‌های جامع زمان‌دار.'
  }
};

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

function formatDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

interface DeepWorkPomodoroProps {
  onNavigateToHabitTracker?: () => void;
  onOpenFocusAudio?: () => void;
}

export const DeepWorkPomodoro: React.FC<DeepWorkPomodoroProps> = ({
  onNavigateToHabitTracker,
  onOpenFocusAudio
}) => {
  // Protocol & Phase States
  const [selectedProtocolId, setSelectedProtocolId] = useState<FocusProtocolId>('pomodoro_25');
  const [customFocusMin, setCustomFocusMin] = useState<number>(40);
  const [phase, setPhase] = useState<'focus' | 'recall' | 'break'>('focus');
  const [secondsLeft, setSecondsLeft] = useState<number>(PROTOCOLS.pomodoro_25.focusMinutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Focus Session Config
  const [selectedSubject, setSelectedSubject] = useState<string>('زیست‌شناسی');
  const [goalNote, setGoalNote] = useState<string>('');
  const [focusRating, setFocusRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [isEbbinghausReviewed, setIsEbbinghausReviewed] = useState<boolean>(true);
  const [enableActiveRecallPhase, setEnableActiveRecallPhase] = useState<boolean>(true);

  // Active session tracking & distraction tally (Urge Surfing)
  const [distractionsCount, setDistractionsCount] = useState<number>(0);
  const [activeSessionElapsedSeconds, setActiveSessionElapsedSeconds] = useState<number>(0);
  const [sessionCompletedToast, setSessionCompletedToast] = useState<{
    show: boolean;
    hoursAdded: number;
    subject: string;
    message: string;
  } | null>(null);

  // Sessions log for today
  const [todaySessions, setTodaySessions] = useState<DeepWorkSessionLog[]>(() => {
    try {
      const saved = localStorage.getItem(DEEP_WORK_SESSIONS_KEY);
      if (saved) {
        const parsed: DeepWorkSessionLog[] = JSON.parse(saved);
        const todayStr = formatDateKey(new Date());
        return parsed.filter(s => s.timestamp.startsWith(todayStr));
      }
    } catch {
      // fallback
    }
    return [];
  });

  // Focus Mode state (Binaural Beats)
  const [isFocusModeActive, setIsFocusModeActive] = useState<boolean>(() => {
    try {
      return localStorage.getItem(FOCUS_MODE_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const activeProtocol = useMemo(() => {
    const p = PROTOCOLS[selectedProtocolId];
    if (selectedProtocolId === 'custom') {
      return {
        ...p,
        focusMinutes: customFocusMin,
        breakMinutes: Math.max(3, Math.round(customFocusMin * 0.2))
      };
    }
    return p;
  }, [selectedProtocolId, customFocusMin]);

  // Audio synthesis helper
  const playChime = (type: 'complete' | 'recall' | 'break' = 'complete') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      if (type === 'complete') {
        // Triumphant ascending triad: C5 (523), E5 (659), G5 (784), C6 (1046)
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.2, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.4);
        });
      } else if (type === 'recall') {
        // Two soft notes: A4 (440) -> D5 (587)
        [440, 587.33].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          gain.gain.setValueAtTime(0.18, now + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.35);
        });
      } else {
        // Break note: G4 (392)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(392, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch {
      // Audio fallback
    }
  };

  // Sync Focus Mode audio with Pomodoro state
  const handleToggleFocusMode = () => {
    const nextVal = !isFocusModeActive;
    setIsFocusModeActive(nextVal);
    try {
      localStorage.setItem(FOCUS_MODE_STORAGE_KEY, String(nextVal));
    } catch {}
  };

  // Switch protocol handler
  const handleSelectProtocol = (id: FocusProtocolId) => {
    setSelectedProtocolId(id);
    setIsRunning(false);
    setPhase('focus');
    const p = PROTOCOLS[id];
    const mins = id === 'custom' ? customFocusMin : p.focusMinutes;
    setSecondsLeft(mins * 60);
    setActiveSessionElapsedSeconds(0);
  };

  // Main Timer Loop
  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
        if (phase === 'focus') {
          setActiveSessionElapsedSeconds(prev => prev + 1);
        }
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      handlePhaseTransition();
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, phase]);

  // Phase transition handler
  const handlePhaseTransition = () => {
    if (phase === 'focus') {
      // Focus session ended! Automatically log into Habit Tracker!
      const totalMinutesDone = Math.max(1, Math.round(activeProtocol.focusMinutes));
      logSessionToHabitTracker(totalMinutesDone);
      playChime('complete');

      if (enableActiveRecallPhase && activeProtocol.recallMinutes > 0) {
        setPhase('recall');
        setSecondsLeft(activeProtocol.recallMinutes * 60);
      } else {
        setPhase('break');
        setSecondsLeft(activeProtocol.breakMinutes * 60);
      }
    } else if (phase === 'recall') {
      // Recall phase ended -> move to Break
      playChime('break');
      setPhase('break');
      setSecondsLeft(activeProtocol.breakMinutes * 60);
    } else {
      // Break phase ended -> reset to Focus
      playChime('complete');
      setPhase('focus');
      setSecondsLeft(activeProtocol.focusMinutes * 60);
      setIsRunning(false);
      setActiveSessionElapsedSeconds(0);
      setDistractionsCount(0);
    }
  };

  // Reset timer
  const handleReset = () => {
    setIsRunning(false);
    setPhase('focus');
    setSecondsLeft(activeProtocol.focusMinutes * 60);
    setActiveSessionElapsedSeconds(0);
    setDistractionsCount(0);
  };

  // Manual completion / Log Session directly
  const handleManualCompleteSession = () => {
    const elapsedMinutes = Math.max(5, Math.round(activeSessionElapsedSeconds / 60));
    logSessionToHabitTracker(elapsedMinutes > 0 ? elapsedMinutes : activeProtocol.focusMinutes);
    handleReset();
  };

  // Log to DailyStudyHabitTracker in LocalStorage and dispatch event
  const logSessionToHabitTracker = (minutes: number) => {
    const hoursEarned = Number((minutes / 60).toFixed(1));
    const todayKey = formatDateKey(new Date());

    try {
      // 1. Read existing records
      const rawRecords = localStorage.getItem(HABIT_STORAGE_KEY);
      let records: Record<string, StudyDayRecord> = {};
      if (rawRecords) {
        records = JSON.parse(rawRecords);
      }

      const existingRecord = records[todayKey];
      const newTotalHours = existingRecord
        ? Number((existingRecord.hours + hoursEarned).toFixed(1))
        : hoursEarned;

      // Merge subjects
      const updatedSubjects = existingRecord?.subjects ? [...existingRecord.subjects] : [];
      if (!updatedSubjects.includes(selectedSubject)) {
        updatedSubjects.push(selectedSubject);
      }

      // Merge notes
      const sessionNote = goalNote.trim() ? `پومودورو: ${goalNote.trim()}` : `کار عمیق ${selectedSubject}`;
      const updatedNotes = existingRecord?.notes
        ? `${existingRecord.notes} | ${sessionNote}`
        : sessionNote;

      const updatedRecord: StudyDayRecord = {
        date: todayKey,
        hours: newTotalHours,
        subjects: updatedSubjects,
        focusRating: focusRating,
        ebbinghausReviewed: isEbbinghausReviewed || (existingRecord?.ebbinghausReviewed ?? true),
        notes: updatedNotes
      };

      records[todayKey] = updatedRecord;
      localStorage.setItem(HABIT_STORAGE_KEY, JSON.stringify(records));

      // 2. Log into Deep Work Sessions History
      const newSessionLog: DeepWorkSessionLog = {
        id: 'session_' + Date.now(),
        timestamp: new Date().toISOString(),
        protocolName: activeProtocol.name,
        durationMinutes: minutes,
        subject: selectedSubject,
        focusRating,
        ebbinghausReviewed: isEbbinghausReviewed,
        goalNote: goalNote.trim() || undefined,
        distractionsCount
      };

      const existingSessionsRaw = localStorage.getItem(DEEP_WORK_SESSIONS_KEY);
      const allSessions: DeepWorkSessionLog[] = existingSessionsRaw ? JSON.parse(existingSessionsRaw) : [];
      const updatedSessions = [newSessionLog, ...allSessions].slice(0, 50);
      localStorage.setItem(DEEP_WORK_SESSIONS_KEY, JSON.stringify(updatedSessions));

      setTodaySessions(prev => [newSessionLog, ...prev]);

      // 3. Dispatch events to notify DailyStudyHabitTracker in real-time
      window.dispatchEvent(new CustomEvent('rahbord_habit_updated', {
        detail: { date: todayKey, hoursAdded: hoursEarned, subject: selectedSubject }
      }));
      window.dispatchEvent(new Event('storage'));

      // 4. Show success banner
      setSessionCompletedToast({
        show: true,
        hoursAdded: hoursEarned,
        subject: selectedSubject,
        message: `جلسه کار عمیق (${minutes} دقیقه) با موفقیت در زنجیره عادات روزانه ذخیره شد! مجموع ساعات امروز: ${newTotalHours} ساعت.`
      });

      setTimeout(() => {
        setSessionCompletedToast(null);
      }, 5000);
    } catch (err) {
      console.warn('Error saving to habit tracker:', err);
    }
  };

  // Record a distraction urge (Cognitive Urge Surfing)
  const handleRegisterDistraction = () => {
    setDistractionsCount(prev => prev + 1);
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Calculate circular progress
  const totalPhaseSeconds = useMemo(() => {
    if (phase === 'focus') return activeProtocol.focusMinutes * 60;
    if (phase === 'recall') return activeProtocol.recallMinutes * 60;
    return activeProtocol.breakMinutes * 60;
  }, [phase, activeProtocol]);

  const progressPercent = useMemo(() => {
    if (totalPhaseSeconds <= 0) return 100;
    return ((totalPhaseSeconds - secondsLeft) / totalPhaseSeconds) * 100;
  }, [totalPhaseSeconds, secondsLeft]);

  // Total deep work minutes logged today
  const todayTotalDeepWorkMinutes = useMemo(() => {
    return todaySessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  }, [todaySessions]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Success Notification Banner */}
      {sessionCompletedToast && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/60 border border-emerald-500/40 shadow-xl flex items-start justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">همگام‌سازی خودکار با زنجیره عادات!</h4>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                  +{sessionCompletedToast.hoursAdded} ساعت ثبت شد
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {sessionCompletedToast.message}
              </p>
            </div>
          </div>

          {onNavigateToHabitTracker && (
            <button
              onClick={onNavigateToHabitTracker}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
            >
              <span>مشاهده هیت‌مپ</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>پروتکل کار عمیق با همگام‌سازی خودکار عادات</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>تایمر کار عمیق (Deep Work Pomodoro)</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
            جلسات تمرکز عمیق را اجرا کنید؛ تمام پارت‌های مطالعه با اتمام تایمر به صورت خودکار در «زنجیره عادات روزانه» و هیت‌مپ ثبت می‌شوند.
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl px-4 py-2.5 text-left flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400">کار عمیق امروز:</div>
              <div className="text-sm font-black text-white tabular-nums">
                {todayTotalDeepWorkMinutes} دقیقه <span className="text-[10px] text-amber-400">({(todayTotalDeepWorkMinutes / 60).toFixed(1)} ساعت)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Selection Cards */}
      <div className="space-y-3">
        <label className="text-xs text-slate-300 font-bold flex items-center gap-2">
          <Brain className="w-4 h-4 text-amber-400" />
          <span>انتخاب الگوی شناختی تمرکز (Deep Work Protocols):</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(Object.keys(PROTOCOLS) as FocusProtocolId[]).map(key => {
            const proto = PROTOCOLS[key];
            const isSelected = selectedProtocolId === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectProtocol(key)}
                className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer relative group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-400/60 shadow-lg shadow-amber-500/5 ring-1 ring-amber-400/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2.5 left-2.5 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}

                <div className="space-y-1">
                  <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                    {proto.name}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                    {proto.subtitle}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-amber-400/90 font-mono">
                  {key === 'custom' ? `${customFocusMin} د تمرکز` : `${proto.focusMinutes} دقیقه تمرکز`}
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom duration slider if custom is selected */}
        {selectedProtocolId === 'custom' && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
            <span className="text-xs text-slate-300 font-medium shrink-0">مدت زمان تمرکز:</span>
            <input
              type="range"
              min="10"
              max="120"
              step="5"
              value={customFocusMin}
              onChange={e => {
                const val = Number(e.target.value);
                setCustomFocusMin(val);
                if (!isRunning && phase === 'focus') {
                  setSecondsLeft(val * 60);
                }
              }}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <span className="text-sm font-bold text-amber-400 font-mono shrink-0">{customFocusMin} دقیقه</span>
          </div>
        )}
      </div>

      {/* Main Interactive Timer Display & Phase HUD */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center relative shadow-inner">
        {/* Phase Pill Badge */}
        <div className="mb-6">
          <div className={`px-5 py-2 rounded-full text-xs font-bold border transition-all flex items-center gap-2 ${
            phase === 'focus'
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-sm shadow-amber-500/10'
              : phase === 'recall'
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 animate-pulse shadow-sm shadow-emerald-500/10'
              : 'bg-sky-500/10 border-sky-500/40 text-sky-300'
          }`}>
            {phase === 'focus' && <Flame className="w-4 h-4 text-amber-400 animate-bounce" />}
            {phase === 'recall' && <Brain className="w-4 h-4 text-emerald-400" />}
            {phase === 'break' && <Coffee className="w-4 h-4 text-sky-400" />}

            <span>
              {phase === 'focus'
                ? `فاز ۱: غوطه‌وری کامل در مطالعه (${selectedSubject})`
                : phase === 'recall'
                ? 'فاز ۲: کتاب را ببندید! بازیابی ذهنی فعال (Blurting / Active Recall)'
                : 'فاز ۳: استراحت مغزی واقعی و ریکاوری دوپامین (بدون گوشی)'}
            </span>
          </div>
        </div>

        {/* Circular Radial Timer Indicator */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full flex flex-col items-center justify-center">
          {/* Outer Track Ring */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className="text-slate-800"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 125}
              strokeDashoffset={2 * Math.PI * 125 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              className={`transition-all duration-1000 ${
                phase === 'focus'
                  ? 'text-amber-400'
                  : phase === 'recall'
                  ? 'text-emerald-400'
                  : 'text-sky-400'
              }`}
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          {/* Center Digital Digits */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-5xl sm:text-6xl font-black text-white tabular-nums tracking-tight font-mono">
              {formatTime(secondsLeft)}
            </span>
            <span className="text-xs text-slate-400 mt-2 font-medium">
              {isRunning
                ? phase === 'focus'
                  ? 'در حال ثبت در عادات...'
                  : 'در حال استراحت...'
                : 'آماده شروع جلسه'}
            </span>

            {/* Quick distraction counter badge */}
            {distractionsCount > 0 && (
              <span className="mt-2 text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full font-mono">
                {distractionsCount} وسوسه مهارشده 🔥
              </span>
            )}
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2.5 transition-all shadow-xl active:scale-95 cursor-pointer ${
              isRunning
                ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/20'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>توقف موقت</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-slate-950" />
                <span>شروع کار عمیق</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="بازنشانی پومودورو"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Urge Surfing Button */}
          <button
            onClick={handleRegisterDistraction}
            className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            title="ثبت وسوسه ذهنی یا گوشی بدون متوقف کردن مطالعه (تکنیک مهار وسوسه Urge Surfing)"
          >
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            <span>مهار پرش ذهن ({distractionsCount})</span>
          </button>

          {/* Quick Manual Log if stopped */}
          {activeSessionElapsedSeconds >= 60 && !isRunning && (
            <button
              onClick={handleManualCompleteSession}
              className="px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>ثبت زمان گذشته ({(activeSessionElapsedSeconds / 60).toFixed(1)} د) در عادات</span>
            </button>
          )}
        </div>
      </div>

      {/* Session Metadata & Habit Sync Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/60 border border-slate-800/80 rounded-3xl p-6">
        {/* Column 1: Subject & Goal */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-400" />
            <span>مشخصات پارت مطالعه (جهت ثبت دقیق در زنجیره):</span>
          </h4>

          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400">موضوع / درس هدف:</label>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              {SUBJECT_OPTIONS.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400">یادداشت هدف این پارت (اختیاری):</label>
            <input
              type="text"
              value={goalNote}
              onChange={e => setGoalNote(e.target.value)}
              placeholder="مثال: حل ۳۰ تست سینتیک شیمی یا رسم نمودار درختی قلب"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Column 2: Focus Quality & Spaced Repetition */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>کیفیت تمرکز و تنظیمات نوروفیزیولوژیک:</span>
          </h4>

          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400">تخمین سطح عمق تمرکز (۱ تا ۵):</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFocusRating(star as 1 | 2 | 3 | 4 | 5)}
                  className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    focusRating >= star
                      ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  ★ {star}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={isEbbinghausReviewed}
                onChange={e => setIsEbbinghausReviewed(e.target.checked)}
                className="w-4 h-4 rounded text-amber-400 bg-slate-900 border-slate-700 focus:ring-0"
              />
              <span>این جلسه شامل مرور فاصله‌دار طبق منحنی ابینگهاوس بود</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={enableActiveRecallPhase}
                onChange={e => setEnableActiveRecallPhase(e.target.checked)}
                className="w-4 h-4 rounded text-amber-400 bg-slate-900 border-slate-700 focus:ring-0"
              />
              <span>اجرای فاز بازیابی ذهنی (Active Recall) قبل از شروع استراحت</span>
            </label>
          </div>
        </div>
      </div>

      {/* Focus Audio & Habit Tracker Fast Shortcuts */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-950 to-slate-950 border border-amber-500/20 text-xs">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isFocusModeActive ? 'bg-amber-400 text-slate-950 animate-pulse' : 'bg-slate-800 text-slate-400'
          }`}>
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white block">همگام‌سازی با امواج بینورال و لوفای:</span>
            <span className="text-slate-400 text-[11px]">
              {isFocusModeActive ? 'صوت تمرکز همزمان با تایمر فعال است.' : 'امواج تقویت تمرکز خاموش هستند.'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleToggleFocusMode}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              isFocusModeActive
                ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isFocusModeActive ? 'خاموش کردن لوفای' : 'روشن کردن امواج تمرکز'}
          </button>

          {onNavigateToHabitTracker && (
            <button
              onClick={onNavigateToHabitTracker}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>مشاهده زنجیره عادات</span>
            </button>
          )}
        </div>
      </div>

      {/* Today's Completed Deep Work Sessions Timeline */}
      {todaySessions.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold flex items-center gap-1.5">
              <History className="w-4 h-4 text-amber-400" />
              <span>جلسات کار عمیق ثبت‌شده امروز ({todaySessions.length} پارت):</span>
            </span>
            <span className="text-slate-400 font-mono">
              مجموع: {(todayTotalDeepWorkMinutes / 60).toFixed(1)} ساعت
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {todaySessions.slice(0, 6).map(sess => (
              <div
                key={sess.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>{sess.subject}</span>
                    <span className="text-[10px] text-amber-400 font-mono">({sess.durationMinutes} د)</span>
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">
                    {sess.goalNote || sess.protocolName}
                  </div>
                </div>

                <div className="text-left shrink-0">
                  <div className="text-[11px] text-emerald-400 font-mono font-bold">
                    +{(sess.durationMinutes / 60).toFixed(1)}h
                  </div>
                  <div className="text-[9px] text-slate-500">
                    {new Date(sess.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
