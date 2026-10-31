import { Brain, ArrowDownLeft, Trophy, Clock, Flame, Swords, Compass, BarChart3, Cpu } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single text element) */}
        <div 
          onClick={() => onNavigate('hero')}
          className="flex items-center gap-2 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:border-amber-400 transition-colors">
            <Brain className="w-4 h-4" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap">
            راهبُرد
          </span>
        </div>

        {/* Zone 2: concise single-line nav links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm text-slate-300 font-medium">
          <button 
            onClick={() => onNavigate('dashboard-hub')} 
            className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer font-bold"
          >
            <Brain className="w-3.5 h-3.5 text-amber-400" />
            <span>داشبورد مرکزی</span>
          </button>
          <button 
            onClick={() => onNavigate('problems')} 
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            ۶ مشکل اساسی
          </button>
          <button 
            onClick={() => onNavigate('simulator')} 
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            شبیه‌ساز ابینگهاوس
          </button>
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            داشبورد آماری
          </button>
          <button 
            onClick={() => onNavigate('study-advisor')} 
            className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer font-semibold"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>مشاور اولویت‌بندی</span>
          </button>
          <button 
            onClick={() => onNavigate('weekly-insight')} 
            className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer font-semibold"
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            <span>بینش هفتگی D3</span>
          </button>
          <button 
            onClick={() => onNavigate('adaptive-scheduler')} 
            className="flex items-center gap-1.5 text-cyan-300 hover:text-cyan-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer font-semibold"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>تکرار تطبیقی</span>
          </button>
          <button 
            onClick={() => onNavigate('habit-tracker')} 
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer font-semibold"
          >
            <Flame className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>زنجیره عادات</span>
          </button>
          <button 
            onClick={() => onNavigate('study-duels')} 
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer font-bold"
          >
            <Swords className="w-3.5 h-3.5 text-amber-400" />
            <span>دوئل‌های مطالعاتی</span>
          </button>
          <button 
            onClick={() => onNavigate('ebbinghaus-scheduler')} 
            className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer font-medium"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>زمان‌بندی مرور</span>
          </button>
          <button 
            onClick={() => onNavigate('badges')} 
            className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer font-semibold"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>نشان‌های افتخار</span>
          </button>
          <button 
            onClick={() => onNavigate('procrastination-analyzer')} 
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            تحلیل اهمال‌کاری
          </button>
          <button 
            onClick={() => onNavigate('quiz')} 
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            تست عارضه‌یابی
          </button>
          <button 
            onClick={() => onNavigate('toolkit')} 
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            جعبه ابزار
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('quiz')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-sm shadow-amber-500/20"
          >
            <span>شروع عارضه‌یابی</span>
            <ArrowDownLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
