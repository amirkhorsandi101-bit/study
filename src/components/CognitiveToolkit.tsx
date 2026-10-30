import React, { useState, useEffect, useRef } from 'react';
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Check, 
  Trash2, 
  ArrowLeftRight, 
  Sparkles, 
  BrainCircuit, 
  Plus,
  Headphones,
  Trees,
  CloudRain,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { FocusAudioPlayer } from './FocusAudioPlayer';
import { DeepWorkPomodoro } from './DeepWorkPomodoro';
import { AmbientSoundscape } from './AmbientSoundscape';

export const CognitiveToolkit: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'launcher' | 'pomodoro' | 'switcher' | 'braindump' | 'focus' | 'ambient'>('launcher');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const toolkitContainerRef = useRef<HTMLElement>(null);

  const [isFocusModeActive, setIsFocusModeActive] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rahbord_focus_mode_active');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      try {
        if (toolkitContainerRef.current?.requestFullscreen) {
          await toolkitContainerRef.current.requestFullscreen();
        }
      } catch {}
    } else {
      setIsFullscreen(false);
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        }
      } catch {}
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        try {
          if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen();
          }
        } catch {}
      }
    };
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isFullscreen]);

  useEffect(() => {
    try {
      localStorage.setItem('rahbord_focus_mode_active', String(isFocusModeActive));
    } catch (e) {
      console.error(e);
    }
  }, [isFocusModeActive]);

  // --- Tool 1: 5-Minute Procrastination Launcher ---
  const [launcherSeconds, setLauncherSeconds] = useState<number>(300); // 5 mins
  const [isLauncherRunning, setIsLauncherRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // --- Tool 4: Brain Dump Scratchpad ---
  const [dumpItems, setDumpItems] = useState<{ id: string; text: string; completed: boolean }[]>(() => {
    try {
      const saved = localStorage.getItem('rahbord_braindump_items');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: '1', text: 'نگرانی بابت درصد مبحث مشتق ریاضی', completed: false },
      { id: '2', text: 'تماس با علی برای جزوه زیست', completed: true },
    ];
  });
  const [newDumpInput, setNewDumpInput] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem('rahbord_braindump_items', JSON.stringify(dumpItems));
    } catch (e) {
      console.error(e);
    }
  }, [dumpItems]);

  // Audio Beep using Web Audio API (Zero external assets, guaranteed to work)
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.log('Audio Context error ignored');
    }
  };

  // Timer loop for 5-minute launcher
  useEffect(() => {
    let interval: any = null;
    if (isLauncherRunning && launcherSeconds > 0) {
      interval = setInterval(() => {
        setLauncherSeconds(s => s - 1);
      }, 1000);
    } else if (launcherSeconds === 0 && isLauncherRunning) {
      setIsLauncherRunning(false);
      playChime();
    }
    return () => clearInterval(interval);
  }, [isLauncherRunning, launcherSeconds]);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAddDumpItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDumpInput.trim()) return;
    setDumpItems(prev => [
      ...prev,
      { id: Date.now().toString(), text: newDumpInput.trim(), completed: false }
    ]);
    setNewDumpInput('');
  };

  const toggleDumpItem = (id: string) => {
    setDumpItems(prev =>
      prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
    );
  };

  const deleteDumpItem = (id: string) => {
    setDumpItems(prev => prev.filter(item => item.id !== id));
  };

  const handleNavigateToHabits = () => {
    const el = document.getElementById('habit-tracker');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={toolkitContainerRef}
      id="toolkit" 
      className={isFullscreen
        ? "fixed inset-0 z-50 bg-slate-950 overflow-y-auto p-4 sm:p-8 flex flex-col scrollbar-thin selection:bg-amber-400/20 selection:text-amber-200"
        : "py-20 px-6 max-w-6xl mx-auto border-t border-slate-800/80"
      }
    >
      {/* Zen Fullscreen Top Status Banner */}
      {isFullscreen && (
        <div className="sticky top-0 z-50 -mx-4 sm:-mx-8 -mt-4 sm:-mt-8 px-6 py-3.5 bg-slate-950/95 backdrop-blur-md border-b border-emerald-500/30 flex items-center justify-between mb-8 shadow-2xl">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-300">
                حالت تمام‌صفحه و ضد اهمال‌کاری (Zen Focus Mode)
              </span>
              <span className="text-[11px] text-slate-400 hidden md:inline">
                · سکوت، تمرکز بر روی یک کار و حذف کلیه سر و صداهای مزاحم
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-mono hidden sm:inline">
              کلید Esc برای بازگشت
            </span>
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>خروج از تمام‌صفحه</span>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-10 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold tracking-wide">
            <span>ابزارهای عملیاتی</span>
            <span aria-hidden="true">/</span>
            <span>پروتکل‌های تقویت تمرکز و شروع</span>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer shadow-sm active:scale-95 ${
              isFullscreen
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-emerald-500/20'
                : 'bg-slate-900 border-slate-700/80 hover:border-emerald-400/50 text-emerald-300 hover:text-emerald-200'
            }`}
            title={isFullscreen ? 'خروج از حالت تمام‌صفحه (Esc)' : 'ورود به حالت تمام‌صفحه بدون حواس‌پرتی'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>خروج از تمام‌صفحه</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>تمام‌صفحه ضد اهمال‌کاری (Zen)</span>
              </>
            )}
          </button>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          جعبه ابزار کاربردی برای غلبه بر موانع مطالعه
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
          این ابزارها بر اساس آخرین یافته‌های علوم اعصاب طراحی شده‌اند تا مقاومت ذهنی شروع را به حداقل برسانند و یادگیری را از حالت منفعل به فعال تبدیل کنند.
        </p>
      </div>

      {/* Focus Mode Quick Banner */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 mb-8 ${
        isFocusModeActive 
          ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-500/5' 
          : 'bg-slate-900/60 border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              isFocusModeActive ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30' : 'bg-slate-800 text-slate-400'
            }`}>
              <Headphones className={`w-5 h-5 ${isFocusModeActive ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-white">حالت تمرکز عمیق (Focus Mode)</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                  isFocusModeActive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  {isFocusModeActive ? 'فعال و در حال پخش' : 'خاموش'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                پخش پیوسته امواج بینورال (آلفا، بتا، تتا) و موسیقی لوفای جهت تحریک امواج مغزی مطالعه
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
            <button
              onClick={() => setActiveTab('ambient')}
              className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20"
            >
              <Trees className="w-3.5 h-3.5" />
              <span>اصوات طبیعت (باران، جنگل)</span>
            </button>

            <button
              onClick={() => setActiveTab('focus')}
              className="text-xs text-amber-400 hover:text-amber-300 underline font-semibold transition-colors cursor-pointer"
            >
              امواج بینورال و لوفای ←
            </button>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={() => setIsFocusModeActive(!isFocusModeActive)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                isFocusModeActive ? 'bg-amber-400 shadow-md shadow-amber-400/30' : 'bg-slate-700'
              }`}
              title={isFocusModeActive ? 'خاموش کردن حالت تمرکز' : 'روشن کردن حالت تمرکز'}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-slate-950 transition-transform ${
                  isFocusModeActive ? 'translate-x-1.5' : 'translate-x-7.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Segmented Tool Selector (Functional buttons) */}
      <div className="flex p-1.5 bg-slate-900 border border-slate-800 rounded-xl mb-8 overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('launcher')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'launcher'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ۱. تایمر پرتاب ۵ دقیقه‌ای (ضد اهمال‌کاری)
        </button>
        <button
          onClick={() => setActiveTab('pomodoro')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'pomodoro'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ۲. پومودوروی کار عمیق (Deep Work & Habit Sync)
        </button>
        <button
          onClick={() => setActiveTab('switcher')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'switcher'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ۳. مبدل متد سنتی به علمی
        </button>
        <button
          onClick={() => setActiveTab('braindump')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'braindump'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ۴. تخلیه‌گر افکار مزاحم (Brain Dump)
        </button>
        <button
          onClick={() => setActiveTab('focus')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'focus'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : isFocusModeActive 
                ? 'text-amber-300 bg-amber-500/10 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
          }`}
        >
          <Headphones className={`w-3.5 h-3.5 ${isFocusModeActive ? 'animate-pulse text-amber-400' : ''}`} />
          <span>۵. امواج تمرکز و لوفای (Focus Audio)</span>
          {isFocusModeActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('ambient')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'ambient'
              ? 'bg-emerald-400 text-slate-950 shadow-sm font-bold'
              : 'text-slate-400 hover:text-emerald-300'
          }`}
        >
          <Trees className="w-3.5 h-3.5" />
          <span>۶. چشم‌انداز صوتی طبیعت (Ambient Soundscape)</span>
        </button>
      </div>

      {/* Tool 1: 5-Minute Procrastination Breaker */}
      {activeTab === 'launcher' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold text-amber-400">قانون ۵ دقیقه برای فریب آمیگدال مغز</span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              تنها ۵ دقیقه متعهد شوید؛ سپس مجازید رهایش کنید!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              مغز از «حجم درس» می‌ترسد، نه از «۵ دقیقه خواندن». وقتی این تایمر را روشن می‌کنید، به مغزتان قول می‌دهید فقط ۳۰۰ ثانیه بخواند. در ۸۵٪ موارد اثر زایگارنیک مانع از توقف شما خواهد شد.
            </p>
          </div>

          {/* Big Circular/Digit Display */}
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative w-52 h-52 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center bg-slate-950/60 shadow-inner">
              <div 
                className="absolute inset-0 rounded-full border-4 border-amber-400 transition-all duration-1000"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${
                    (launcherSeconds / 300) > 0.5 ? '100% 0%, 100% 100%, 0% 100%, 0% 0%' : '100% 0%, 100% 100%'
                  }, 50% 50%)`
                }}
              />
              <span className="text-5xl font-extrabold text-white tabular-nums tracking-tight font-mono z-10">
                {formatTime(launcherSeconds)}
              </span>
              <span className="text-[11px] text-slate-400 mt-2 z-10">
                {isLauncherRunning ? 'تمرکز کامل روی کتاب' : launcherSeconds === 0 ? 'تبریک! سد شکست' : 'آماده برای پرتاب'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setIsLauncherRunning(!isLauncherRunning)}
              className="flex items-center gap-2 px-8 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              {isLauncherRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>توقف موقت</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>شروع پرتاب ۵ دقیقه‌ای</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setIsLauncherRunning(false);
                setLauncherSeconds(300);
              }}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors cursor-pointer"
              title="شروع مجدد"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors cursor-pointer"
              title="تنظیم صدا"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          </div>

          {/* Focus Mode hint in launcher */}
          {isFocusModeActive && (
            <div 
              onClick={() => setActiveTab('focus')}
              className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 cursor-pointer hover:bg-amber-500/15 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>حالت تمرکز عمیق فعال است (امواج بینورال همزمان با پرتاب ۵ دقیقه‌ای پخش می‌شوند).</span>
              </div>
              <span className="text-[11px] underline font-semibold">تنظیمات صدا ←</span>
            </div>
          )}
        </div>
      )}

      {/* Tool 2: Deep Work Pomodoro with Habit Tracker Auto-Sync */}
      {activeTab === 'pomodoro' && (
        <DeepWorkPomodoro
          onNavigateToHabitTracker={handleNavigateToHabits}
          onOpenFocusAudio={() => setActiveTab('focus')}
        />
      )}

      {/* Tool 3: Method Switcher (Side by side comparison) */}
      {activeTab === 'switcher' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            برای جهش تحصیلی، متدهای منسوخ را با جایگزین‌های علمی جایگزین کنید:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                oldWay: 'روخوانی مکرر و چندباره متن کتاب',
                newWay: 'تکنیک برگه سفید (Blurting) و بازیابی آزاد',
                why: 'مغز در روخوانی خاموش است، در برگه سفید فعالانه سیناپس می‌سازد.'
              },
              {
                oldWay: 'هایلایت کردن تمام خطوط جزوه با ماژیک زرد',
                newWay: 'طراحی سوال در حاشیه کتاب (روش یادداشت‌برداری کورنل)',
                why: 'تبدیل متن به سوال، مغز را در حالت کاوش و حل مساله قرار می‌دهد.'
              },
              {
                oldWay: 'مطالعه توده‌ای و فشرده شب امتحان (Cramming)',
                newWay: 'چرخه مرور فاصله‌دار در روزهای ۱، ۳، ۱۰ و ۳۰',
                why: 'تثبیت در قشر نئوکورتکس نیازمند خواب شبانه و فواصل زمانی منظم است.'
              },
              {
                oldWay: 'حل تست بلافاصله پس از خواندن درسنامه',
                newWay: 'حل تست با تاخیر ۲۴ ساعته (تست پوششی)',
                why: 'فاصله انداختن بین درس و تست، مقاومت حافظه در برابر فراموشی را بالا می‌برد.'
              },
              {
                oldWay: 'دیدن فوری پاسخنامه تست‌های سخت',
                newWay: 'کلنجار حداقل ۴ دقیقه‌ای با برگه چک‌نویس',
                why: 'تقلا کردن همان نقطه‌ای است که مهارت حل مساله در مغز جوانه می‌زند.'
              },
              {
                oldWay: 'مطالعه با گوشی باز روی میز و پاسخ به پیام‌ها',
                newWay: 'بلوک‌های تمرکز ۴۰ دقیقه‌ای در اتاق ایزوله',
                why: 'حذف پسماند توجه (Attention Residue) راندمان را ۳ برابر می‌کند.'
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/30">
                    <span className="text-[11px] text-rose-400 font-bold block mb-1">روش منسوخ:</span>
                    <span className="text-xs text-rose-200 line-through opacity-80">{item.oldWay}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
                    <span className="text-[11px] text-emerald-400 font-bold block mb-1">جایگزین علمی برتر:</span>
                    <span className="text-xs text-emerald-200 font-semibold">{item.newWay}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 leading-relaxed">
                  {item.why}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tool 4: Brain Dump Scratchpad */}
      {activeTab === 'braindump' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl max-w-3xl mx-auto space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-amber-400">تخلیه حافظه کاری (Working Memory)</span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              پارکینگ افکار مزاحم حین مطالعه
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              هر وقت حین مطالعه فکری به سرتان زد (مثل «یادم باشه فلان کارو بکنم» یا «چرا فلان درس سخته»)، درس را رها نکنید؛ آن را اینجا بنویسید تا مغز بداند ذخیره شده و رهایتان کند.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAddDumpItem} className="flex gap-2">
            <input
              type="text"
              placeholder="فکر مزاحم یا کاری که به ذهنتان آمد را تایپ کنید..."
              value={newDumpInput}
              onChange={(e) => setNewDumpInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>ثبت فکر</span>
            </button>
          </form>

          {/* Items List */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {dumpItems.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                هیچ فکر مزاحمی ثبت نشده است. ذهن شما کاملاً سبک و آماده تمرکز است.
              </div>
            ) : (
              dumpItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    item.completed
                      ? 'bg-slate-950/30 border-slate-900 text-slate-500'
                      : 'bg-slate-950/70 border-slate-800 text-slate-200'
                  }`}
                >
                  <div 
                    onClick={() => toggleDumpItem(item.id)}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      item.completed ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-slate-700'
                    }`}>
                      {item.completed && <Check className="w-3 h-3" />}
                    </div>
                    <span className={`text-xs sm:text-sm ${item.completed ? 'line-through' : ''}`}>
                      {item.text}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteDumpItem(item.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tool 5: Focus Audio Player & Sound Engine */}
      <div className={activeTab === 'focus' ? 'block' : 'hidden'}>
        <FocusAudioPlayer
          isFocusModeActive={isFocusModeActive}
          onToggleFocusMode={setIsFocusModeActive}
          onOpenAmbientSoundscape={() => setActiveTab('ambient')}
        />
      </div>

      {/* Tool 6: Ambient Soundscape Control Panel */}
      <div className={activeTab === 'ambient' ? 'block' : 'hidden'}>
        <AmbientSoundscape
          onOpenFocusAudio={() => setActiveTab('focus')}
        />
      </div>
    </section>
  );
};
