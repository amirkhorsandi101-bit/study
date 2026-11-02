import React, { useState, useMemo } from 'react';
import {
  X,
  BookOpen,
  GraduationCap,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Plus,
  ArrowLeft,
  Flame,
  Layers,
  ChevronRight,
  BookMarked,
  Timer
} from 'lucide-react';
import {
  CurriculumTopic,
  GradeLevel,
  AcademicTrack,
  GRADE_LABELS,
  TRACK_LABELS,
  OFFICIAL_CURRICULUM,
  filterCurriculum,
  getAvailableSubjects
} from '../data/curriculumData';
import { EbbinghausTopicItem } from './DashboardStats';

interface CurriculumBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTopicToScheduler: (topic: CurriculumTopic, studyDaysAgo: number) => void;
  onLaunchFocusSession?: (topic: CurriculumTopic) => void;
}

export const CurriculumBrowserModal: React.FC<CurriculumBrowserModalProps> = ({
  isOpen,
  onClose,
  onAddTopicToScheduler,
  onLaunchFocusSession
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(12);
  const [selectedTrack, setSelectedTrack] = useState<AcademicTrack>('experimental');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedTopicIds, setAddedTopicIds] = useState<Set<string>>(new Set());
  const [selectedStudyDaysAgo, setSelectedStudyDaysAgo] = useState<number>(0);

  // Available subjects for the current grade & track
  const availableSubjects = useMemo(() => {
    return getAvailableSubjects(selectedGrade, selectedTrack);
  }, [selectedGrade, selectedTrack]);

  // Reset subject filter if it's not present in new selection
  const handleGradeChange = (grade: GradeLevel) => {
    setSelectedGrade(grade);
    setSelectedSubject('all');
  };

  const handleTrackChange = (track: AcademicTrack) => {
    setSelectedTrack(track);
    setSelectedSubject('all');
  };

  // Filter topics
  const displayedTopics = useMemo(() => {
    return OFFICIAL_CURRICULUM.filter(item => {
      // Grade filter
      if (item.grade !== selectedGrade) return false;
      // Track filter
      if (!item.track.includes(selectedTrack)) return false;
      // Subject filter
      if (selectedSubject !== 'all' && item.subject !== selectedSubject) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchTitle = item.topicName.toLowerCase().includes(q);
        const matchChapter = item.chapterTitle.toLowerCase().includes(q);
        const matchBook = item.bookTitle.toLowerCase().includes(q);
        const matchSubject = item.subject.toLowerCase().includes(q);
        return matchTitle || matchChapter || matchBook || matchSubject;
      }
      return true;
    });
  }, [selectedGrade, selectedTrack, selectedSubject, searchQuery]);

  // Group displayed topics by textbook and chapter
  const groupedByChapter = useMemo(() => {
    const map = new Map<string, { bookTitle: string; chapterTitle: string; topics: CurriculumTopic[] }>();
    displayedTopics.forEach(t => {
      const key = `${t.bookTitle}_${t.chapterTitle}`;
      if (!map.has(key)) {
        map.set(key, {
          bookTitle: t.bookTitle,
          chapterTitle: t.chapterTitle,
          topics: []
        });
      }
      map.get(key)!.topics.push(t);
    });
    return Array.from(map.values());
  }, [displayedTopics]);

  const handleAdd = (topic: CurriculumTopic) => {
    onAddTopicToScheduler(topic, selectedStudyDaysAgo);
    setAddedTopicIds(prev => new Set(prev).add(topic.id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-right">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900/95 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  فهرست رسمی سرفصل‌های کتب درسی (دهم، یازدهم و دوازدهم)
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 font-semibold hidden sm:inline">
                  تفکیک رشته و مبحث
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                مبحث مطالعه‌شده را با یک کلیک به جدول زمان‌بندی مرورهای علمی ابینگهاوس اضافه کنید.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="بستن پنجره"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="px-6 py-4 bg-slate-950/70 border-b border-slate-800 space-y-4">
          {/* Top row: Grade and Track selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Grade Selection */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 mb-2 block">
                ۱. انتخاب مقطع تحصیلی:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {([10, 11, 12] as GradeLevel[]).map(grade => (
                  <button
                    key={grade}
                    onClick={() => handleGradeChange(grade)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                      selectedGrade === grade
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {GRADE_LABELS[grade]}
                  </button>
                ))}
              </div>
            </div>

            {/* Track Selection */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 mb-2 block">
                ۲. انتخاب رشته تحصیلی:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['experimental', 'mathematics', 'humanities'] as AcademicTrack[]).map(track => (
                  <button
                    key={track}
                    onClick={() => handleTrackChange(track)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                      selectedTrack === track
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {TRACK_LABELS[track].name}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom row: Subject Filter & In-Modal Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            {/* Subject Chips */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedSubject('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  selectedSubject === 'all'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                همه درس‌ها ({displayedTopics.length})
              </button>

              {availableSubjects.map(sub => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    selectedSubject === sub
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* In-Modal Search input */}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در فصل و مبحث..."
                className="w-full pr-9 pl-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Study Timing selector */}
        <div className="px-6 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>زمان پایان مطالعه مبحث انتخابی برای شروع الگوریتم مرور:</span>
          </div>

          <div className="inline-flex rounded-lg bg-slate-900 p-0.5 border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedStudyDaysAgo(0)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                selectedStudyDaysAgo === 0
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              امروز خواندم (نوبت اول: فردا)
            </button>
            <button
              onClick={() => setSelectedStudyDaysAgo(1)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                selectedStudyDaysAgo === 1
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              دیروز خواندم (موعد نوبت اول: امروز!)
            </button>
            <button
              onClick={() => setSelectedStudyDaysAgo(3)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                selectedStudyDaysAgo === 3
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ۳ روز پیش
            </button>
          </div>
        </div>

        {/* Scrollable Topics List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          {groupedByChapter.length === 0 ? (
            <div className="text-center py-16 px-4 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
              <BookMarked className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <h4 className="text-base font-bold text-white mb-1">
                سرفصلی با این مشخصات یافت نشد
              </h4>
              <p className="text-xs text-slate-400">
                لطفاً عنوان جستجو را تغییر دهید یا فیلتر درس‌ها را روی «همه درس‌ها» بگذارید.
              </p>
            </div>
          ) : (
            groupedByChapter.map((group, groupIdx) => (
              <div
                key={groupIdx}
                className="bg-slate-950/50 rounded-2xl border border-slate-800/80 p-4 sm:p-5 space-y-3"
              >
                {/* Chapter Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <h4 className="text-sm font-bold text-white">
                      {group.chapterTitle}
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-lg">
                    کتاب: {group.bookTitle}
                  </span>
                </div>

                {/* Topics in this chapter */}
                <div className="space-y-2.5 pt-1">
                  {group.topics.map(topic => {
                    const isAdded = addedTopicIds.has(topic.id);
                    return (
                      <div
                        key={topic.id}
                        className={`p-3.5 rounded-xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                          isAdded
                            ? 'bg-emerald-950/20 border-emerald-500/40'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {/* Topic info */}
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded font-semibold bg-slate-800 text-amber-300 border border-slate-700">
                              {topic.subject}
                            </span>
                            <span className="text-sm font-bold text-white">
                              {topic.topicName}
                            </span>

                            {topic.importance === 'critical' && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                                <Flame className="w-3 h-3 text-rose-400" />
                                <span>مهم کنکوری / نهایی</span>
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
                            <span>روش مرور پیشنهادی:</span>
                            <strong className="text-slate-300 font-normal">
                              {topic.suggestedMethod}
                            </strong>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                          {onLaunchFocusSession && (
                            <button
                              onClick={() => {
                                onLaunchFocusSession(topic);
                                onClose();
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                              title="شروع جلسه تمرکز و مطالعه روی این مبحث"
                            >
                              <Timer className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">تمرکز فوری</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleAdd(topic)}
                            disabled={isAdded}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 ${
                              isAdded
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                                : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>در جدول ثبت شد</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>افزودن به ابینگهاوس</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/95 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>تعداد مباحث منطبق:</span>
            <strong className="text-amber-400 font-mono text-sm">{displayedTopics.length}</strong>
            <span>مبحث</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-colors cursor-pointer"
          >
            بستن فهرست
          </button>
        </div>

      </div>
    </div>
  );
};
