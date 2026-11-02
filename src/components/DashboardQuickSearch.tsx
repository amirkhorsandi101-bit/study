import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  BookmarkCheck,
  ArrowLeft,
  Flame,
  Timer,
  Compass,
  Sparkles,
  Filter,
  Layers,
  ChevronDown,
  BookOpen,
  GraduationCap,
  Plus
} from 'lucide-react';
import { EbbinghausTopicItem } from './DashboardStats';
import { EBBINGHAUS_INTERVALS } from './EbbinghausScheduler';
import {
  OFFICIAL_CURRICULUM,
  CurriculumTopic,
  GradeLevel,
  AcademicTrack,
  GRADE_LABELS,
  TRACK_LABELS
} from '../data/curriculumData';
import { CurriculumBrowserModal } from './CurriculumBrowserModal';

interface DashboardQuickSearchProps {
  topics: EbbinghausTopicItem[];
  onNavigate: (sectionId: string) => void;
  onSelectTopic?: (topic: EbbinghausTopicItem, action: 'review' | 'focus' | 'advisor') => void;
  onAddCurriculumTopic?: (topic: CurriculumTopic, studyDaysAgo: number) => void;
}

export const DashboardQuickSearch: React.FC<DashboardQuickSearchProps> = ({
  topics,
  onNavigate,
  onSelectTopic,
  onAddCurriculumTopic
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'due' | 'active' | 'mastered'>('all');
  const [selectedGrade, setSelectedGrade] = useState<'all' | GradeLevel>('all');
  const [selectedTrack, setSelectedTrack] = useState<'all' | AcademicTrack>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [showCurriculumModal, setShowCurriculumModal] = useState<boolean>(false);
  const [addedCurriculumIds, setAddedCurriculumIds] = useState<Set<string>>(new Set());

  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut listener: Ctrl+K or "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === '/' && !isInput) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape' && isFocused) {
        setSearchQuery('');
        inputRef.current?.blur();
        setIsFocused(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused]);

  // Extract unique subjects from topics and curriculum
  const subjectsList = useMemo(() => {
    const set = new Set<string>();
    topics.forEach(t => {
      if (t.subject) set.add(t.subject);
    });
    OFFICIAL_CURRICULUM.forEach(c => {
      if (selectedGrade !== 'all' && c.grade !== selectedGrade) return;
      if (selectedTrack !== 'all' && !c.track.includes(selectedTrack)) return;
      set.add(c.subject);
    });
    return Array.from(set);
  }, [topics, selectedGrade, selectedTrack]);

  // Compute status details for each existing topic in student's schedule
  const enrichedTopics = useMemo(() => {
    return topics.map(topic => {
      const targetInterval = EBBINGHAUS_INTERVALS[Math.min(topic.currentCycle, EBBINGHAUS_INTERVALS.length - 1)] || 1;
      const daysRemaining = targetInterval - topic.lastReviewedDaysAgo;
      const isMastered = topic.currentCycle >= 5;
      const isDueToday = !isMastered && daysRemaining <= 0;
      const isDueTomorrow = !isMastered && daysRemaining === 1;

      // Retention formula R = e^(-t / S)
      const stability = 1.8 * (1 + topic.currentCycle * 2.3);
      const estimatedRetention = Math.max(
        10,
        Math.min(99, Math.round(100 * Math.exp(-topic.lastReviewedDaysAgo / stability)))
      );

      return {
        ...topic,
        targetInterval,
        daysRemaining,
        isMastered,
        isDueToday,
        isDueTomorrow,
        estimatedRetention
      };
    });
  }, [topics]);

  // Filter student's existing scheduled topics
  const filteredTopics = useMemo(() => {
    return enrichedTopics.filter(item => {
      // Subject filter
      if (selectedSubject !== 'all' && item.subject !== selectedSubject) {
        return false;
      }

      // Status chip filter
      if (selectedFilter === 'due' && !item.isDueToday) {
        return false;
      }
      if (selectedFilter === 'active' && (item.isMastered || item.isDueToday)) {
        return false;
      }
      if (selectedFilter === 'mastered' && !item.isMastered) {
        return false;
      }

      // Search query filter (matches title, subject, or method)
      if (!searchQuery.trim()) return true;

      const q = searchQuery.trim().toLowerCase();
      const matchTitle = item.topicName.toLowerCase().includes(q);
      const matchSubject = item.subject.toLowerCase().includes(q);
      const matchMethod = item.recommendedMethod.toLowerCase().includes(q);

      return matchTitle || matchSubject || matchMethod;
    });
  }, [enrichedTopics, searchQuery, selectedFilter, selectedSubject]);

  // Match official curriculum topics when searching or filtering
  const matchingCurriculumTopics = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const q = searchQuery.trim().toLowerCase();
    return OFFICIAL_CURRICULUM.filter(item => {
      if (selectedGrade !== 'all' && item.grade !== selectedGrade) return false;
      if (selectedTrack !== 'all' && !item.track.includes(selectedTrack)) return false;
      if (selectedSubject !== 'all' && item.subject !== selectedSubject) return false;

      const matchTitle = item.topicName.toLowerCase().includes(q);
      const matchChapter = item.chapterTitle.toLowerCase().includes(q);
      const matchBook = item.bookTitle.toLowerCase().includes(q);
      const matchSubject = item.subject.toLowerCase().includes(q);

      return matchTitle || matchChapter || matchBook || matchSubject;
    }).slice(0, 8); // limit top 8 curriculum suggestions
  }, [searchQuery, selectedGrade, selectedTrack, selectedSubject]);

  // Navigation handlers
  const handleJumpToTopic = (item: EbbinghausTopicItem, action: 'review' | 'focus' | 'advisor') => {
    if (onSelectTopic) {
      onSelectTopic(item, action);
    }

    if (action === 'review') {
      onNavigate('ebbinghaus-scheduler');
      setTimeout(() => {
        const el = document.getElementById(`ebbinghaus-topic-${item.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-2', 'ring-amber-400', 'ring-offset-2', 'ring-offset-slate-950');
          setTimeout(() => {
            el.classList.remove('ring-2', 'ring-amber-400', 'ring-offset-2', 'ring-offset-slate-950');
          }, 2500);
        }
      }, 200);
    } else if (action === 'focus') {
      onNavigate('toolkit');
    } else if (action === 'advisor') {
      onNavigate('study-advisor');
    }
  };

  const handleAddCurriculumItem = (cTopic: CurriculumTopic) => {
    if (onAddCurriculumTopic) {
      onAddCurriculumTopic(cTopic, 0);
    } else {
      // LocalStorage fallback
      try {
        const saved = localStorage.getItem('rahbord_ebbinghaus_topics_queue');
        const list = saved ? JSON.parse(saved) : [];
        const newItem: EbbinghausTopicItem = {
          id: 'curriculum_' + cTopic.id + '_' + Date.now(),
          subject: cTopic.subject,
          topicName: `${cTopic.bookTitle}: ${cTopic.topicName}`,
          lastReviewedDaysAgo: 0,
          currentCycle: 0,
          recommendedMethod: cTopic.suggestedMethod
        };
        list.unshift(newItem);
        localStorage.setItem('rahbord_ebbinghaus_topics_queue', JSON.stringify(list));
        window.dispatchEvent(new Event('rahbord_data_updated'));
      } catch (e) {
        console.error(e);
      }
    }
    setAddedCurriculumIds(prev => new Set(prev).add(cTopic.id));
  };

  const isSearching = searchQuery.trim().length > 0;
  const showResultsDropdown = isSearching || isFocused;

  return (
    <div ref={searchContainerRef} className="relative w-full mb-8 z-30">
      
      {/* Top Banner: Quick Access to Official National Curriculum Browser */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2.5 px-1 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-white">سامانه جستجوی سرفصل‌های رسمی کتب درسی:</span>
          <span className="text-slate-400 hidden md:inline">پایه‌های دهم، یازدهم و دوازدهم</span>
        </div>

        <button
          onClick={() => setShowCurriculumModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <GraduationCap className="w-4 h-4 text-amber-400" />
          <span>مرور فهرست کامل کتب (تجربی، ریاضی، انسانی)</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grade & Academic Track Filter Strip */}
      <div className="mb-3 p-3 bg-slate-900/70 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Grade Chips */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px] ml-1">مقطع:</span>
          <button
            onClick={() => setSelectedGrade('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedGrade === 'all'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-800/80'
            }`}
          >
            همه پایه‌ها
          </button>
          {([10, 11, 12] as GradeLevel[]).map(grade => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedGrade === grade
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-800/80'
              }`}
            >
              {GRADE_LABELS[grade]}
            </button>
          ))}
        </div>

        {/* Track Chips */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px] ml-1">رشته:</span>
          <button
            onClick={() => setSelectedTrack('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedTrack === 'all'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-800/80'
            }`}
          >
            همه رشته‌ها
          </button>
          {(['experimental', 'mathematics', 'humanities'] as AcademicTrack[]).map(track => (
            <button
              key={track}
              onClick={() => setSelectedTrack(track)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedTrack === track
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-800/80'
              }`}
            >
              {TRACK_LABELS[track].tag}
            </button>
          ))}
        </div>
      </div>

      {/* Main Search Input Box */}
      <div className={`relative flex items-center bg-slate-900/90 border rounded-2xl transition-all duration-300 shadow-lg ${
        isFocused
          ? 'border-amber-400/80 shadow-amber-500/10 ring-2 ring-amber-400/20 bg-slate-900'
          : 'border-slate-800 hover:border-slate-700/80'
      }`}>
        <div className="pr-4 pl-2 text-slate-400 flex items-center pointer-events-none">
          <Search className={`w-4 h-4 transition-colors ${isFocused ? 'text-amber-400' : 'text-slate-400'}`} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={
            selectedTrack === 'experimental'
              ? 'جستجوی مبحث تجربی (مثلاً: قلب، گوارش، لوویس، استوکیومتری، تکانه)...'
              : selectedTrack === 'mathematics'
              ? 'جستجوی مبحث ریاضی (مثلاً: حسابان، مشتق، هندسه، گسسته، هم‌نهشتی)...'
              : selectedTrack === 'humanities'
              ? 'جستجوی مبحث انسانی (مثلاً: عروض، فنون ادبی، منطق، فلسفه، اقتصاد)...'
              : 'جستجوی سریع موضوع، سرفصل یا وظیفه مرور (مثلاً: قلب، مشتق، ساختار لوویس، عروض)...'
          }
          className="w-full py-3.5 pr-2 pl-4 bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
        />

        <div className="flex items-center gap-2 pl-3">
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="پاک کردن جستجو"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Shortcut indicator */}
          <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400 bg-slate-800/80 border border-slate-700/80 px-2 py-0.5 rounded-md font-mono select-none">
            <span>Ctrl</span>
            <span>+</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Filter Chips Bar (Quick Filters & Subject Dropdown) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 px-1">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 ml-1 text-[11px] hidden sm:inline">وضعیت مرور:</span>
          
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            همه مباحث من ({topics.length})
          </button>

          <button
            onClick={() => setSelectedFilter('due')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              selectedFilter === 'due'
                ? 'bg-rose-500 text-white font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-300'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            <span>موعد امروز ({enrichedTopics.filter(t => t.isDueToday).length})</span>
          </button>

          <button
            onClick={() => setSelectedFilter('active')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              selectedFilter === 'active'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300'
            }`}
          >
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>در چرخه مرور ({enrichedTopics.filter(t => !t.isMastered && !t.isDueToday).length})</span>
          </button>

          <button
            onClick={() => setSelectedFilter('mastered')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              selectedFilter === 'mastered'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-300'
            }`}
          >
            <BookmarkCheck className="w-3 h-3 text-emerald-400" />
            <span>تثبیت دائم ({enrichedTopics.filter(t => t.isMastered).length})</span>
          </button>
        </div>

        {/* Subject Filter Select */}
        <div className="flex items-center gap-2">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="all">همه درس‌ها</option>
            {subjectsList.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Dropdown Panel (Shown when typing or focused with query) */}
      {showResultsDropdown && (
        <div className="mt-2 w-full bg-slate-900/98 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200 max-h-[500px] overflow-y-auto scrollbar-thin space-y-4">
          
          {/* Section 1: Matches in Student's Scheduled Topics */}
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 px-1 text-xs text-slate-400">
              <span className="font-semibold text-slate-200">
                {isSearching ? `مباحث ثبت‌شده شما منطبق با «${searchQuery}»:` : 'جدول مرورهای من:'}
              </span>
              <span className="font-mono text-amber-400 font-semibold">
                {filteredTopics.length} مورد
              </span>
            </div>

            {filteredTopics.length === 0 ? (
              <p className="py-3 text-center text-xs text-slate-500">
                در جدول مرورهای جاری شما موردی با این نام ثبت نشده است.
              </p>
            ) : (
              <div className="space-y-2">
                {filteredTopics.map(item => (
                  <div
                    key={item.id}
                    className="group p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                          {item.subject}
                        </span>

                        <h4 className="text-sm font-bold text-white truncate max-w-[280px] sm:max-w-md">
                          {item.topicName}
                        </h4>

                        {item.isDueToday ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-rose-400" />
                            <span>موعد امروز</span>
                          </span>
                        ) : item.isMastered ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                            <BookmarkCheck className="w-3 h-3 text-emerald-400" />
                            <span>تثبیت دائم</span>
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                            چرخه {item.currentCycle + 1} ({item.daysRemaining > 0 ? `${item.daysRemaining} روز مانده` : 'در نوبت'})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="truncate max-w-sm">
                          روش: <strong className="text-slate-300 font-normal">{item.recommendedMethod}</strong>
                        </span>
                        <span>·</span>
                        <span className="text-slate-400">
                          پایداری: <strong className="text-amber-300 font-mono">{item.estimatedRetention}٪</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleJumpToTopic(item, 'review')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        <Clock className="w-3 h-3" />
                        <span>مرور در ابینگهاوس</span>
                        <ArrowLeft className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => handleJumpToTopic(item, 'focus')}
                        className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 transition-colors cursor-pointer"
                        title="شروع جلسه تمرکز ۵ دقیقه‌ای"
                      >
                        <Timer className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleJumpToTopic(item, 'advisor')}
                        className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 transition-colors cursor-pointer"
                        title="بررسی در مشاور هوشمند"
                      >
                        <Compass className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Matches in Official Curriculum Database (دهم، یازدهم، دوازدهم) */}
          {matchingCurriculumTopics.length > 0 && (
            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between pb-2 mb-2 px-1 text-xs">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>سرفصل‌های رسمی منطبق در کتب درسی (آماده افزودن):</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {matchingCurriculumTopics.length} سرفصل کتاب
                </span>
              </div>

              <div className="space-y-2">
                {matchingCurriculumTopics.map(cTopic => {
                  const isAdded = addedCurriculumIds.has(cTopic.id);
                  return (
                    <div
                      key={cTopic.id}
                      className="p-3 rounded-xl bg-amber-950/15 border border-amber-500/20 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-400 text-slate-950">
                            {GRADE_LABELS[cTopic.grade]}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-slate-800 text-slate-200">
                            {cTopic.bookTitle}
                          </span>
                          <span className="text-xs font-bold text-white">
                            {cTopic.topicName}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {cTopic.chapterTitle} · متد پیشنهادی: {cTopic.suggestedMethod}
                        </p>
                      </div>

                      <button
                        onClick={() => handleAddCurriculumItem(cTopic)}
                        disabled={isAdded}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 self-end sm:self-center cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                            : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm shadow-amber-400/20 active:scale-95'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>ثبت شد</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>افزودن به ابینگهاوس</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer of dropdown */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 px-1">
            <button
              onClick={() => setShowCurriculumModal(true)}
              className="text-amber-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>مشاهده و انتخاب از کل سرفصل‌های دهم، یازدهم و دوازدهم ←</span>
            </button>
            <button
              onClick={() => {
                setIsFocused(false);
                setSearchQuery('');
              }}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              بستن نتایج
            </button>
          </div>
        </div>
      )}

      {/* Curriculum Browser Modal */}
      <CurriculumBrowserModal
        isOpen={showCurriculumModal}
        onClose={() => setShowCurriculumModal(false)}
        onAddTopicToScheduler={(cTopic, daysAgo) => {
          handleAddCurriculumItem(cTopic);
        }}
        onLaunchFocusSession={(cTopic) => {
          onNavigate('toolkit');
        }}
      />
    </div>
  );
};
