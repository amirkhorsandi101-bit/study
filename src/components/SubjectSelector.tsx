import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  BookOpen,
  Check,
  CheckSquare,
  Square,
  MinusSquare,
  Search,
  Layers,
  GraduationCap,
  Sparkles,
  BookmarkCheck,
  BookmarkPlus,
  Trash2,
  Maximize2,
  PanelRightClose,
  ChevronDown,
  ChevronRight,
  Flame,
  CheckCheck,
  ArrowLeft,
  ChevronsUpDown,
  BookMarked,
  FolderTree,
  Lightbulb,
  Zap,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import {
  SubjectLibrary,
  GradeLevel,
  AcademicTrackId,
  SubjectBook,
  SubjectChapter,
  SubjectTopic,
  TRACKS_INFO,
  GRADES_LIST
} from '../data/SubjectLibrary';
import {
  PersonalStudyTopic,
  getPersonalStudyList,
  addMultipleTopicsToPersonalList,
  removeMultipleTopicsFromPersonalList,
  syncPersonalTopicsToEbbinghaus,
  PERSONAL_LIST_UPDATED_EVENT
} from '../data/personalStudyList';
import {
  fuzzyMatchScore,
  highlightFuzzyText,
  normalizePersian
} from '../utils/fuzzySearch';
import {
  getSmartTopicRecommendations,
  RecommendedTopicItem,
  RecommendationReasonType
} from '../utils/topicRecommender';

export interface SubjectSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: 'modal' | 'sidebar';
  defaultGrade?: GradeLevel;
  defaultTrack?: AcademicTrackId;
  onSelectionChange?: (selectedTopicIds: string[]) => void;
  onSyncToScheduler?: (addedCount: number) => void;
}

// Helper to highlight matching text in fuzzy search results
const highlightMatch = (text: string, query: string): React.ReactNode => {
  return highlightFuzzyText(text, query);
};

export const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  isOpen,
  onClose,
  variant: initialVariant = 'modal',
  defaultGrade = 12,
  defaultTrack = 'experimental',
  onSelectionChange,
  onSyncToScheduler
}) => {
  // Layout mode: modal dialog or right-hand slide-over drawer
  const [layoutMode, setLayoutMode] = useState<'modal' | 'sidebar'>(initialVariant);

  // Active view: hierarchical accordion browser vs smart recommendations vs my personal list
  const [activeView, setActiveView] = useState<'browse' | 'recommendations' | 'my_list'>('browse');

  // Search query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Recommendation reason filter
  const [recommendationFilter, setRecommendationFilter] = useState<string>('all');

  // --- ACCORDION STATE HIERARCHY (Grade -> Field -> Subject -> Topics) ---
  // Level 1: Expanded Grades (10, 11, 12)
  const [expandedGrades, setExpandedGrades] = useState<Set<GradeLevel>>(new Set([defaultGrade]));

  // Level 2: Expanded Fields/Tracks (Key: `${grade}_${track}`, e.g. "12_experimental")
  const [expandedFields, setExpandedFields] = useState<Set<string>>(
    new Set([`${defaultGrade}_${defaultTrack}`])
  );

  // Level 3: Expanded Subjects/Books (Key: `${grade}_${track}_${bookId}`)
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());

  // Checkbox Selection Set (Topic IDs checked in this session)
  const [checkedTopicIds, setCheckedTopicIds] = useState<Set<string>>(new Set());

  // Persistent Personal Study List
  const [personalList, setPersonalList] = useState<PersonalStudyTopic[]>(() => getPersonalStudyList());
  const [personalListFilter, setPersonalListFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync persistent personal list on storage / event updates
  useEffect(() => {
    const syncData = () => {
      setPersonalList(getPersonalStudyList());
    };
    window.addEventListener(PERSONAL_LIST_UPDATED_EVENT, syncData);
    window.addEventListener('storage', syncData);
    return () => {
      window.removeEventListener(PERSONAL_LIST_UPDATED_EVENT, syncData);
      window.removeEventListener('storage', syncData);
    };
  }, []);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Update initial active accordion branches on open
  useEffect(() => {
    if (isOpen) {
      if (defaultGrade) {
        setExpandedGrades(prev => new Set([...prev, defaultGrade]));
      }
      if (defaultGrade && defaultTrack) {
        setExpandedFields(prev => new Set([...prev, `${defaultGrade}_${defaultTrack}`]));
      }
    }
  }, [isOpen, defaultGrade, defaultTrack]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  // Set of topic IDs already saved in the student's personal study list
  const savedTopicIdSet = useMemo(() => {
    return new Set(personalList.map(item => item.topicId));
  }, [personalList]);

  // --- SMART RECOMMENDATION ENGINE ---
  // Generate multi-factor complementary recommendations based on student selections, quizzes, and Ebbinghaus memory stats
  const smartRecommendations = useMemo(() => {
    return getSmartTopicRecommendations(personalList, defaultGrade, defaultTrack);
  }, [personalList, defaultGrade, defaultTrack]);

  const filteredRecommendations = useMemo(() => {
    if (recommendationFilter === 'all') return smartRecommendations;
    return smartRecommendations.filter(r => r.reasonType === recommendationFilter);
  }, [smartRecommendations, recommendationFilter]);

  // Handler to add a single recommended topic item directly to personal study list
  const handleAddRecommendedTopic = (item: RecommendedTopicItem) => {
    const chapter = item.book.chapters.find(c => c.chapterNumber === item.chapterNumber) || item.book.chapters[0];
    const res = addMultipleTopicsToPersonalList([
      { topic: item.topic, book: item.book, chapter }
    ]);
    setPersonalList(getPersonalStudyList());
    if (res.addedCount > 0) {
      showToast(`مبحث «${item.topic.topicName}» به لیست مطالعه شخصی اضافه شد.`);
    } else {
      showToast('این مبحث از قبل در لیست مطالعه شما موجود است.');
    }
  };

  // Handler to add all unselected recommendations in the current filtered view
  const handleAddAllFilteredRecommendations = () => {
    const unselected = filteredRecommendations.filter(r => !savedTopicIdSet.has(r.topic.id));
    if (unselected.length === 0) {
      showToast('همه مباحث پیشنهادی این بخش از قبل به لیست مطالعه افزوده شده‌اند.');
      return;
    }

    const payload = unselected.map(item => {
      const chapter = item.book.chapters.find(c => c.chapterNumber === item.chapterNumber) || item.book.chapters[0];
      return { topic: item.topic, book: item.book, chapter };
    });

    const res = addMultipleTopicsToPersonalList(payload);
    setPersonalList(getPersonalStudyList());
    showToast(`${res.addedCount} مبحث پیشنهادی با موفقیت به لیست مطالعه افزوده شدند.`);
  };

  // --- ACCORDION TOGGLE HANDLERS ---
  const toggleGradeAccordion = (grade: GradeLevel) => {
    setExpandedGrades(prev => {
      const next = new Set(prev);
      if (next.has(grade)) next.delete(grade);
      else next.add(grade);
      return next;
    });
  };

  const toggleFieldAccordion = (grade: GradeLevel, track: AcademicTrackId) => {
    const key = `${grade}_${track}`;
    setExpandedFields(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleSubjectAccordion = (grade: GradeLevel, track: AcademicTrackId, bookId: string) => {
    const key = `${grade}_${track}_${bookId}`;
    setExpandedSubjects(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Expand All / Collapse All Accordions
  const handleExpandAll = () => {
    const allGrades = new Set<GradeLevel>([10, 11, 12]);
    const allFields = new Set<string>();
    const allSubjects = new Set<string>();

    [10, 11, 12].forEach(g => {
      (Object.keys(TRACKS_INFO) as AcademicTrackId[]).forEach(t => {
        allFields.add(`${g}_${t}`);
        const books = SubjectLibrary.getBooks(g as GradeLevel, t);
        books.forEach(b => allSubjects.add(`${g}_${t}_${b.id}`));
      });
    });

    setExpandedGrades(allGrades);
    setExpandedFields(allFields);
    setExpandedSubjects(allSubjects);
  };

  const handleCollapseAll = () => {
    setExpandedGrades(new Set());
    setExpandedFields(new Set());
    setExpandedSubjects(new Set());
  };

  // --- REAL-TIME FUZZY SEARCH MATCH STATS ---
  const searchMatchStats = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) {
      return {
        isSearching: false,
        query: '',
        matchedTopicIds: [] as string[],
        matchedTopicIdSet: new Set<string>(),
        topicScoreMap: new Map<string, number>(),
        count: 0
      };
    }

    const matchedIds = new Set<string>();
    const scoreMap = new Map<string, number>();

    [10, 11, 12].forEach(g => {
      (Object.keys(TRACKS_INFO) as AcademicTrackId[]).forEach(t => {
        const books = SubjectLibrary.getBooks(g as GradeLevel, t);
        books.forEach(b => {
          b.chapters.forEach(c => {
            c.topics.forEach(tp => {
              // Match topic name, book title, subject, chapter title, method, importance, and difficulty
              const topicTarget = `${tp.topicName} ${b.bookTitle} ${b.subjectCategory} ${c.chapterTitle} ${tp.recommendedMethod} ${tp.importance} ${tp.difficulty}`;
              const matchResult = fuzzyMatchScore(q, topicTarget, 0.42);

              if (matchResult.isMatch) {
                matchedIds.add(tp.id);
                scoreMap.set(tp.id, matchResult.score);
              }
            });
          });
        });
      });
    });

    const arr = Array.from(matchedIds);
    // Sort matched topic IDs by fuzzy match score descending
    arr.sort((a, b) => (scoreMap.get(b) || 0) - (scoreMap.get(a) || 0));

    return {
      isSearching: true,
      query: q,
      matchedTopicIds: arr,
      matchedTopicIdSet: matchedIds,
      topicScoreMap: scoreMap,
      count: arr.length
    };
  }, [searchQuery]);

  // Auto-expand all matching branches when search query is typed via Fuzzy Search
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length >= 1) {
      const newGrades = new Set<GradeLevel>();
      const newFields = new Set<string>();
      const newSubjects = new Set<string>();

      [10, 11, 12].forEach(g => {
        (Object.keys(TRACKS_INFO) as AcademicTrackId[]).forEach(t => {
          const books = SubjectLibrary.getBooks(g as GradeLevel, t);
          books.forEach(b => {
            const hasMatch = b.chapters.some(c =>
              c.topics.some(tp => {
                const combined = `${tp.topicName} ${b.bookTitle} ${b.subjectCategory} ${c.chapterTitle} ${tp.recommendedMethod}`;
                return fuzzyMatchScore(q, combined, 0.42).isMatch;
              })
            );

            if (hasMatch) {
              newGrades.add(g as GradeLevel);
              newFields.add(`${g}_${t}`);
              newSubjects.add(`${g}_${t}_${b.id}`);
            }
          });
        });
      });

      setExpandedGrades(newGrades);
      setExpandedFields(newFields);
      setExpandedSubjects(newSubjects);
    }
  }, [searchQuery]);

  // --- CHECKBOX SELECTION HELPERS AT MULTIPLE HIERARCHICAL LEVELS ---

  // 1. Single Topic Checkbox Toggle
  const handleToggleTopic = (topicId: string) => {
    setCheckedTopicIds(prev => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId);
      else next.add(topicId);
      if (onSelectionChange) onSelectionChange(Array.from(next));
      return next;
    });
  };

  // 2. Batch toggle a collection of topic IDs (for Subject, Field, or Grade)
  const toggleTopicIdBatch = (topicIds: string[]) => {
    const allChecked = topicIds.length > 0 && topicIds.every(id => checkedTopicIds.has(id));
    setCheckedTopicIds(prev => {
      const next = new Set(prev);
      if (allChecked) {
        topicIds.forEach(id => next.delete(id));
      } else {
        topicIds.forEach(id => next.add(id));
      }
      if (onSelectionChange) onSelectionChange(Array.from(next));
      return next;
    });
  };

  // Helper to collect all topic IDs in a SubjectBook
  const getBookTopicIds = (book: SubjectBook): string[] => {
    const ids: string[] = [];
    book.chapters.forEach(c => c.topics.forEach(t => ids.push(t.id)));
    return ids;
  };

  // Helper to collect all topic IDs in a Field/Track for a grade
  const getFieldTopicIds = (grade: GradeLevel, track: AcademicTrackId): string[] => {
    const books = SubjectLibrary.getBooks(grade, track);
    const ids: string[] = [];
    books.forEach(b => ids.push(...getBookTopicIds(b)));
    return ids;
  };

  // Helper to collect all topic IDs in a Grade
  const getGradeTopicIds = (grade: GradeLevel): string[] => {
    const tracks: AcademicTrackId[] = ['experimental', 'mathematics', 'humanities'];
    const ids = new Set<string>();
    tracks.forEach(t => {
      const fieldIds = getFieldTopicIds(grade, t);
      fieldIds.forEach(id => ids.add(id));
    });
    return Array.from(ids);
  };

  // Helper to get checkbox state: 'all' | 'some' | 'none'
  const getBatchCheckboxState = (topicIds: string[]): 'all' | 'some' | 'none' => {
    if (topicIds.length === 0) return 'none';
    const checkedCount = topicIds.filter(id => checkedTopicIds.has(id)).length;
    if (checkedCount === topicIds.length) return 'all';
    if (checkedCount > 0) return 'some';
    return 'none';
  };

  // --- ACTIONS ---
  // Add checked topics to persistent personal study list
  const handleAddCheckedToPersonalList = () => {
    if (checkedTopicIds.size === 0) {
      showToast('لطفاً ابتدا حداقل یک مبحث را علامت بزنید.');
      return;
    }

    const allBooks = SubjectLibrary.getAllBooks();
    const itemsToAdd: { topic: SubjectTopic; book: SubjectBook; chapter: SubjectChapter }[] = [];

    allBooks.forEach(book => {
      book.chapters.forEach(chapter => {
        chapter.topics.forEach(topic => {
          if (checkedTopicIds.has(topic.id)) {
            itemsToAdd.push({ topic, book, chapter });
          }
        });
      });
    });

    const res = addMultipleTopicsToPersonalList(itemsToAdd);
    setPersonalList(getPersonalStudyList());
    if (res.addedCount > 0) {
      showToast(`${res.addedCount} مبحث به لیست مطالعه شخصی شما افزوده شد.`);
    } else {
      showToast('تمام مباحث تیک‌خورده از قبل در لیست شخصی شما ثبت شده بودند.');
    }
  };

  // Direct sync to Ebbinghaus Spaced Repetition queue
  const handleSyncToEbbinghaus = () => {
    handleAddCheckedToPersonalList();
    const idsToSync = Array.from(checkedTopicIds);
    const res = syncPersonalTopicsToEbbinghaus(idsToSync.length > 0 ? idsToSync : undefined);
    setPersonalList(getPersonalStudyList());

    if (res.addedCount > 0) {
      showToast(`${res.addedCount} مبحث با موفقیت به صف مرور ابینگهاوس منتقل شد.`);
      if (onSyncToScheduler) onSyncToScheduler(res.addedCount);
    } else {
      showToast('مباحث در صف مرور ابینگهاوس موجود هستند.');
    }
  };

  if (!isOpen) return null;

  const isSidebar = layoutMode === 'sidebar';
  const trackKeys: AcademicTrackId[] = ['experimental', 'mathematics', 'humanities'];

  return (
    <div
      className={`fixed inset-0 z-50 flex ${
        isSidebar ? 'justify-end' : 'items-center justify-center p-3 sm:p-6'
      } bg-slate-950/80 backdrop-blur-sm transition-all duration-300`}
      dir="rtl"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="انتخاب‌گر مباحث درسی"
    >
      <div
        onClick={e => e.stopPropagation()}
        className={`relative bg-slate-900 border border-slate-800 flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ${
          isSidebar
            ? 'w-full max-w-2xl h-full border-r border-y-0 border-l-0 rounded-none animate-in slide-in-from-left duration-300'
            : 'w-full max-w-5xl h-[92vh] max-h-[850px] rounded-2xl animate-in zoom-in-95 duration-200'
        }`}
      >
        {/* --- MODAL / SIDEBAR HEADER --- */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/95">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                <span>ساختار درختی سرفصل‌ها (Accordion Hierarchy)</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400">پایه ← رشته ← درس ← مباحث</span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white mt-0.5">
                انتخاب‌گر مباحث درسی (SubjectSelector)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Toggle Modal vs Sidebar mode */}
            <button
              onClick={() => setLayoutMode(isSidebar ? 'modal' : 'sidebar')}
              title={isSidebar ? 'نمایش در قالب پنجره مرکزی (Modal)' : 'نمایش در قالب سایدبار کشویی (Sidebar)'}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer hidden sm:flex items-center justify-center"
            >
              {isSidebar ? <Maximize2 className="w-4 h-4" /> : <PanelRightClose className="w-4 h-4" />}
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="بستن"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* --- VIEW TABS & TOOLBAR --- */}
        <div className="px-4 sm:px-6 pt-2.5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-3 sm:gap-4 text-xs font-semibold overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveView('browse')}
              className={`pb-2.5 border-b-2 flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-colors whitespace-nowrap ${
                activeView === 'browse'
                  ? 'border-amber-400 text-amber-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span>فهرست آکاردئونی کتب</span>
            </button>

            <button
              onClick={() => setActiveView('recommendations')}
              className={`pb-2.5 border-b-2 flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-colors whitespace-nowrap ${
                activeView === 'recommendations'
                  ? 'border-amber-400 text-amber-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
              <span>پیشنهادات هوشمند مکمل</span>
              {smartRecommendations.length > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                  {smartRecommendations.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveView('my_list')}
              className={`pb-2.5 border-b-2 flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-colors whitespace-nowrap ${
                activeView === 'my_list'
                  ? 'border-amber-400 text-amber-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookmarkCheck className="w-4 h-4 shrink-0" />
              <span>لیست مطالعه شخصی شما</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                {personalList.length}
              </span>
            </button>
          </div>

          {/* Quick Accordion Expand/Collapse All Buttons */}
          {activeView === 'browse' && (
            <div className="mb-2 flex items-center gap-2 text-xs">
              <button
                onClick={handleExpandAll}
                className="text-[11px] text-slate-400 hover:text-amber-300 cursor-pointer flex items-center gap-1 transition-colors"
                title="باز کردن تمام پایه‌ها، رشته‌ها و کتب"
              >
                <ChevronsUpDown className="w-3.5 h-3.5" />
                <span>باز کردن همه</span>
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={handleCollapseAll}
                className="text-[11px] text-slate-400 hover:text-amber-300 cursor-pointer transition-colors"
                title="بستن همه شاخه‌ها"
              >
                بستن همه
              </button>
            </div>
          )}
        </div>

        {/* --- VIEW 1: ACCORDION HIERARCHY (Grade -> Field -> Subject -> Topics) --- */}
        {activeView === 'browse' ? (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Search Bar & Checkbox Selection Metrics */}
            <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/60 space-y-3 shrink-0">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search input with icons */}
                <div className="relative flex-1 max-w-lg">
                  <Search className="w-4 h-4 absolute right-3.5 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="جستجوی فازی مباحث، سرفصل‌ها و فصول (تطابق هوشمند با نیم‌فاصله، ک/ی و غلط املایی)..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl pr-10 pl-9 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute left-3 top-2.5 text-slate-500 hover:text-slate-300 p-0.5 cursor-pointer"
                      title="پاک کردن جستجو"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Match Counter & Select All Matches Action */}
                <div className="flex flex-wrap items-center gap-2.5 text-xs">
                  {searchMatchStats.isSearching && (
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-semibold px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 ${
                        searchMatchStats.count > 0
                          ? 'bg-amber-400/10 text-amber-300 border border-amber-400/25'
                          : 'bg-rose-500/10 text-rose-300 border border-rose-500/25'
                      }`}>
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>
                          {searchMatchStats.count > 0
                            ? `${searchMatchStats.count} مبحث منطبق (فازی)`
                            : 'موردی یافت نشد'}
                        </span>
                      </span>

                      {searchMatchStats.count > 0 && (
                        <button
                          onClick={() => {
                            toggleTopicIdBatch(searchMatchStats.matchedTopicIds);
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white rounded-lg text-[11px] font-medium border border-slate-700/80 transition-colors cursor-pointer flex items-center gap-1"
                          title="انتخاب همه مباحث یافت‌شده در این جستجو"
                        >
                          <CheckCheck className="w-3.5 h-3.5 text-amber-400" />
                          <span>انتخاب نتایج ({searchMatchStats.count})</span>
                        </button>
                      )}
                    </div>
                  )}

                  {checkedTopicIds.size > 0 && (
                    <div className="flex items-center gap-2 mr-auto sm:mr-0">
                      <span className="text-amber-400 font-bold font-mono">
                        {checkedTopicIds.size} مبحث تیک‌خورده
                      </span>
                      <button
                        onClick={() => setCheckedTopicIds(new Set())}
                        className="text-[11px] text-slate-400 hover:text-rose-400 cursor-pointer"
                      >
                        (لغو تیک‌ها)
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Search Suggestion Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-400">
                <span className="text-slate-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>برچسب‌های جستجوی فوری:</span>
                </span>
                {[
                  'زیست‌شناسی',
                  'شیمی',
                  'حسابان',
                  'فیزیک',
                  'همانندسازی',
                  'مشتق',
                  'تست پوششی',
                  'فلسفه و منطق'
                ].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className={`px-2 py-0.5 rounded-md text-[11px] transition-colors cursor-pointer ${
                      searchQuery === tag
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Accordion Tree Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {searchMatchStats.isSearching && searchMatchStats.count === 0 ? (
                <div className="py-14 text-center max-w-md mx-auto space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-amber-400">
                    <Search className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    هیچ مبحث یا کتابی مطابق با «{searchQuery}» پیدا نشد!
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    می‌توانید عنوان درس، مبحث، پایه یا متد یادگیری دیگری را جستجو کنید یا از برچسب‌های پیشنهادی بالا استفاده نمایید.
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>پاک کردن عبارت جستجو</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* Quick Smart Recommendation Callout Banner */}
                  {!searchMatchStats.isSearching && smartRecommendations.length > 0 && (
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-l from-amber-500/10 via-slate-900/95 to-slate-900 border border-amber-400/25 space-y-3 shadow-lg shadow-black/30">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="p-2 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-400 shrink-0">
                            <Sparkles className="w-4 h-4" />
                          </span>
                          <div>
                            <div className="flex items-center gap-2 text-xs font-bold text-white">
                              <span>پیشنهادات هوشمند بر اساس سرفصل‌ها و عملکرد شما</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono font-bold">
                                {smartRecommendations.length} پیشنهاد
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              تحلیل پیوندهای بین‌رشته‌ای، تسلسل فصول، کوییز تشخیصی و فواصل فراموشی ابینگهاوس
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setActiveView('recommendations')}
                          className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors self-end sm:self-auto"
                        >
                          <span>مشاهده همه پیشنهادات هوشمند ({smartRecommendations.length})</span>
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* 3 Top Recommendation Micro-Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                        {smartRecommendations.slice(0, 3).map(rec => {
                          const isAdded = savedTopicIdSet.has(rec.topic.id);
                          return (
                            <div
                              key={rec.id}
                              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-amber-400/40 transition-all flex flex-col justify-between gap-2.5"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center justify-between gap-1 text-[10px]">
                                  <span className="text-amber-300 font-semibold truncate">{rec.book.bookTitle}</span>
                                  <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-400/10 px-1.5 py-0.5 rounded shrink-0">
                                    {rec.priorityScore}٪ تطابق
                                  </span>
                                </div>
                                <h5 className="text-xs font-bold text-white line-clamp-1">
                                  {rec.topic.topicName}
                                </h5>
                                <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                                  {rec.reasonDescription}
                                </p>
                              </div>

                              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-900">
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {rec.reasonBadge}
                                </span>
                                <button
                                  onClick={() => handleAddRecommendedTopic(rec)}
                                  disabled={isAdded}
                                  className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1 shrink-0 ${
                                    isAdded
                                      ? 'bg-slate-800/70 text-slate-500 cursor-not-allowed'
                                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold'
                                  }`}
                                >
                                  {isAdded ? (
                                    <>
                                      <Check className="w-3 h-3" />
                                      <span>در لیست</span>
                                    </>
                                  ) : (
                                    <>
                                      <BookmarkPlus className="w-3 h-3" />
                                      <span>+ افزودن</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {GRADES_LIST.map(gradeInfo => {
                  const grade = gradeInfo.grade;
                  const isGradeExpanded = expandedGrades.has(grade);
                  const gradeTopicIds = getGradeTopicIds(grade);
                  const gradeCheckboxState = getBatchCheckboxState(gradeTopicIds);

                  if (searchMatchStats.isSearching) {
                    const hasMatchInGrade = gradeTopicIds.some(id => searchMatchStats.matchedTopicIdSet.has(id));
                    if (!hasMatchInGrade) return null;
                  }

                return (
                  /* ========================================================
                     LEVEL 1: GRADE ACCORDION (پایه تحصیلی: دهم، یازدهم، دوازدهم)
                     ======================================================== */
                  <div
                    key={grade}
                    className="rounded-2xl border border-slate-800 bg-slate-950/40 overflow-hidden transition-all duration-200"
                  >
                    {/* Grade Header */}
                    <div className="p-3.5 sm:p-4 bg-slate-900/90 hover:bg-slate-900 flex items-center justify-between gap-3 transition-colors border-b border-slate-800/60">
                      <div className="flex items-center gap-3 flex-1">
                        {/* Expand/Collapse Chevron Button */}
                        <button
                          onClick={() => toggleGradeAccordion(grade)}
                          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                          title={isGradeExpanded ? 'بستن پایه' : 'باز کردن پایه'}
                        >
                          <ChevronDown
                            className={`w-5 h-5 text-amber-400 transition-transform duration-200 ${
                              isGradeExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {/* Batch Checkbox on Grade */}
                        <button
                          onClick={() => toggleTopicIdBatch(gradeTopicIds)}
                          className="text-slate-400 hover:text-amber-400 cursor-pointer transition-colors"
                          title="انتخاب یا لغو انتخاب تمام مباحث این پایه"
                        >
                          {gradeCheckboxState === 'all' ? (
                            <CheckSquare className="w-5 h-5 text-amber-400" />
                          ) : gradeCheckboxState === 'some' ? (
                            <MinusSquare className="w-5 h-5 text-amber-400/80" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                          )}
                        </button>

                        {/* Grade Title */}
                        <div
                          onClick={() => toggleGradeAccordion(grade)}
                          className="cursor-pointer flex-1"
                        >
                          <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                            <span>{gradeInfo.label}</span>
                            <span className="text-[11px] font-normal text-slate-400 hidden sm:inline">
                              ({gradeInfo.stage})
                            </span>
                          </h3>
                        </div>
                      </div>

                      {/* Grade Metadata */}
                      <div className="text-xs text-slate-400 flex items-center gap-2 shrink-0">
                        <span className="font-mono text-slate-300 font-semibold">{gradeTopicIds.length}</span>
                        <span>مبحث</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-500">۳ رشته</span>
                      </div>
                    </div>

                    {/* Level 1 Content: Fields Accordions */}
                    {isGradeExpanded && (
                      <div className="p-3 sm:p-4 space-y-3 pr-4 sm:pr-6 border-r-2 border-r-amber-400/30">
                        {trackKeys.map(trackKey => {
                          const trackInfo = TRACKS_INFO[trackKey];
                          const fieldKey = `${grade}_${trackKey}`;
                          const isFieldExpanded = expandedFields.has(fieldKey);
                          const fieldBooks = SubjectLibrary.getBooks(grade, trackKey);
                          const fieldTopicIds = getFieldTopicIds(grade, trackKey);
                          const fieldCheckboxState = getBatchCheckboxState(fieldTopicIds);

                          if (fieldBooks.length === 0) return null;
                          if (searchMatchStats.isSearching) {
                            const hasMatchInField = fieldTopicIds.some(id => searchMatchStats.matchedTopicIdSet.has(id));
                            if (!hasMatchInField) return null;
                          }

                          return (
                            /* ========================================================
                               LEVEL 2: FIELD ACCORDION (رشته تحصیلی: تجربی، ریاضی، انسانی)
                               ======================================================== */
                            <div
                              key={fieldKey}
                              className="rounded-xl border border-slate-800/80 bg-slate-900/60 overflow-hidden transition-all duration-200"
                            >
                              {/* Field Header */}
                              <div className="p-3 bg-slate-900/80 hover:bg-slate-900 flex items-center justify-between gap-3 transition-colors border-b border-slate-800/40">
                                <div className="flex items-center gap-2.5 flex-1">
                                  {/* Expand/Collapse Chevron Button */}
                                  <button
                                    onClick={() => toggleFieldAccordion(grade, trackKey)}
                                    className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                                  >
                                    <ChevronDown
                                      className={`w-4 h-4 text-amber-300 transition-transform duration-200 ${
                                        isFieldExpanded ? 'rotate-180' : ''
                                      }`}
                                    />
                                  </button>

                                  {/* Batch Checkbox on Field */}
                                  <button
                                    onClick={() => toggleTopicIdBatch(fieldTopicIds)}
                                    className="text-slate-400 hover:text-amber-400 cursor-pointer transition-colors"
                                    title={`انتخاب همه مباحث رشته ${trackInfo.name}`}
                                  >
                                    {fieldCheckboxState === 'all' ? (
                                      <CheckSquare className="w-4 h-4 text-amber-400" />
                                    ) : fieldCheckboxState === 'some' ? (
                                      <MinusSquare className="w-4 h-4 text-amber-400/80" />
                                    ) : (
                                      <Square className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                                    )}
                                  </button>

                                  {/* Field Title */}
                                  <div
                                    onClick={() => toggleFieldAccordion(grade, trackKey)}
                                    className="cursor-pointer flex items-center gap-2 flex-1"
                                  >
                                    <h4 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5">
                                      <span>رشته {trackInfo.name}</span>
                                      <span className="text-[10px] text-amber-400/90 font-mono">
                                        ({fieldBooks.length} کتاب)
                                      </span>
                                    </h4>
                                  </div>
                                </div>

                                <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                                  <span>{fieldTopicIds.length} مبحث</span>
                                </div>
                              </div>

                              {/* Level 2 Content: Subject Books Accordions */}
                              {isFieldExpanded && (
                                <div className="p-3 space-y-2.5 pr-4 sm:pr-6 border-r-2 border-r-slate-700/60">
                                  {fieldBooks.map(book => {
                                    const subjectKey = `${grade}_${trackKey}_${book.id}`;
                                    const isSubjectExpanded = expandedSubjects.has(subjectKey);
                                    const bookTopicIds = getBookTopicIds(book);
                                    const bookCheckboxState = getBatchCheckboxState(bookTopicIds);

                                    if (searchMatchStats.isSearching) {
                                      const hasMatchInBook = bookTopicIds.some(id => searchMatchStats.matchedTopicIdSet.has(id));
                                      if (!hasMatchInBook) return null;
                                    }

                                    const visibleChapters = searchMatchStats.isSearching
                                      ? book.chapters.filter(c =>
                                          c.topics.some(t => searchMatchStats.matchedTopicIdSet.has(t.id))
                                        )
                                      : book.chapters;

                                    if (searchMatchStats.isSearching && visibleChapters.length === 0) return null;

                                    return (
                                      /* ========================================================
                                         LEVEL 3: SUBJECT ACCORDION (کتاب درسی: زیست، شیمی، ...)
                                         ======================================================== */
                                      <div
                                        key={subjectKey}
                                        className="rounded-xl border border-slate-800/80 bg-slate-950/70 overflow-hidden transition-all duration-200"
                                      >
                                        {/* Subject Header */}
                                        <div className="p-2.5 sm:p-3 bg-slate-900/70 hover:bg-slate-900 flex items-center justify-between gap-3 transition-colors">
                                          <div className="flex items-center gap-2 flex-1">
                                            {/* Expand/Collapse Chevron */}
                                            <button
                                              onClick={() => toggleSubjectAccordion(grade, trackKey, book.id)}
                                              className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                                            >
                                              <ChevronDown
                                                className={`w-3.5 h-3.5 text-slate-300 transition-transform duration-200 ${
                                                  isSubjectExpanded ? 'rotate-180' : ''
                                                }`}
                                              />
                                            </button>

                                            {/* Batch Checkbox on Subject */}
                                            <button
                                              onClick={() => toggleTopicIdBatch(bookTopicIds)}
                                              className="text-slate-400 hover:text-amber-400 cursor-pointer transition-colors"
                                              title={`انتخاب همه مباحث کتاب ${book.bookTitle}`}
                                            >
                                              {bookCheckboxState === 'all' ? (
                                                <CheckSquare className="w-4 h-4 text-amber-400" />
                                              ) : bookCheckboxState === 'some' ? (
                                                <MinusSquare className="w-4 h-4 text-amber-400/80" />
                                              ) : (
                                                <Square className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                                              )}
                                            </button>

                                            {/* Subject Title */}
                                            <div
                                              onClick={() => toggleSubjectAccordion(grade, trackKey, book.id)}
                                              className="cursor-pointer flex items-center gap-2 flex-1"
                                            >
                                              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                                              <span className="text-xs sm:text-sm font-bold text-white">
                                                {highlightMatch(book.bookTitle, searchQuery)}
                                              </span>
                                            </div>
                                          </div>

                                          <div className="text-[10px] text-slate-400 flex items-center gap-2">
                                            <span>{book.chapters.length} فصل</span>
                                            <span aria-hidden="true">·</span>
                                            <span className="font-mono text-slate-300">{bookTopicIds.length} مبحث</span>
                                          </div>
                                        </div>

                                        {/* Level 3 Content: Topics grouped under chapters */}
                                        {isSubjectExpanded && (
                                          <div className="p-3 sm:p-4 space-y-4 bg-slate-950/90 border-t border-slate-800/80">
                                            {visibleChapters.map(chapter => {
                                              const chapterTopicIds = chapter.topics.map(t => t.id);
                                              const chapterCheckboxState = getBatchCheckboxState(chapterTopicIds);

                                              const visibleTopics = searchMatchStats.isSearching
                                                ? chapter.topics.filter(t => searchMatchStats.matchedTopicIdSet.has(t.id))
                                                : chapter.topics;

                                              if (searchMatchStats.isSearching && visibleTopics.length === 0) return null;

                                              return (
                                                /* ========================================================
                                                   LEVEL 4: TOPICS ACCORDION SECTION (مباحث درسی)
                                                   ======================================================== */
                                                <div key={chapter.chapterNumber} className="space-y-2">
                                                  {/* Chapter Subheader with Checkbox */}
                                                  <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-slate-900/60 border border-slate-800/50">
                                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                                                      <button
                                                        onClick={() => toggleTopicIdBatch(chapterTopicIds)}
                                                        className="cursor-pointer text-slate-400 hover:text-amber-400"
                                                        title="انتخاب تمام مباحث این فصل"
                                                      >
                                                        {chapterCheckboxState === 'all' ? (
                                                          <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                                                        ) : chapterCheckboxState === 'some' ? (
                                                          <MinusSquare className="w-3.5 h-3.5 text-amber-400/80" />
                                                        ) : (
                                                          <Square className="w-3.5 h-3.5 text-slate-600" />
                                                        )}
                                                      </button>
                                                      <span>{highlightMatch(chapter.chapterTitle, searchQuery)}</span>
                                                    </div>
                                                    <span className="text-[10px] text-slate-500 font-mono">
                                                      {chapter.topics.length} مبحث
                                                    </span>
                                                  </div>

                                                  {/* Topic Items with Checkboxes */}
                                                  <div className="space-y-1.5 pr-3 sm:pr-5">
                                                    {visibleTopics.map(topic => {
                                                      const isChecked = checkedTopicIds.has(topic.id);
                                                      const isSavedInPersonalList = savedTopicIdSet.has(topic.id);

                                                      return (
                                                        <div
                                                          key={topic.id}
                                                          onClick={() => handleToggleTopic(topic.id)}
                                                          className={`p-2.5 sm:p-3 rounded-xl border transition-all duration-150 flex items-start gap-3 cursor-pointer ${
                                                            isChecked
                                                              ? 'bg-amber-400/[0.06] border-amber-400/40 shadow-sm'
                                                              : 'bg-slate-900/40 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700'
                                                          }`}
                                                        >
                                                          {/* Checkbox Icon */}
                                                          <div className="pt-0.5 shrink-0">
                                                            {isChecked ? (
                                                              <CheckSquare className="w-4 h-4 text-amber-400" />
                                                            ) : (
                                                              <Square className="w-4 h-4 text-slate-500 hover:text-slate-300" />
                                                            )}
                                                          </div>

                                                          {/* Topic Meta & Details */}
                                                          <div className="flex-1 space-y-1">
                                                            <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                                                              {isSavedInPersonalList && (
                                                                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                                                  <Check className="w-3 h-3 text-emerald-400" />
                                                                  <span>در لیست شخصی شما</span>
                                                                  <span aria-hidden="true">·</span>
                                                                </span>
                                                              )}

                                                              <span className={`font-semibold ${
                                                                topic.importance === 'critical' ? 'text-rose-400' :
                                                                topic.importance === 'very_high' ? 'text-amber-400' :
                                                                'text-cyan-400'
                                                              }`}>
                                                                اهمیت: {
                                                                  topic.importance === 'critical' ? 'حیاتی (تضمینی کنکور)' :
                                                                  topic.importance === 'very_high' ? 'بسیار بالا' :
                                                                  topic.importance === 'high' ? 'بالا' : 'متوسط'
                                                                }
                                                              </span>
                                                              <span aria-hidden="true">·</span>
                                                              <span>
                                                                سختی: {topic.difficulty === 'hard' ? 'سخت' : topic.difficulty === 'medium' ? 'متوسط' : 'آسان'}
                                                              </span>
                                                            </div>

                                                            <h5 className="text-xs sm:text-sm font-bold text-white leading-snug">
                                                              {highlightMatch(topic.topicName, searchQuery)}
                                                            </h5>

                                                            <p className="text-[11px] text-slate-400 font-light">
                                                              <span className="text-amber-400/80 font-medium">متد یادگیری: </span>
                                                              <span>{highlightMatch(topic.recommendedMethod, searchQuery)}</span>
                                                            </p>
                                                          </div>
                                                        </div>
                                                      );
                                                    })}
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
            </div>
          </div>
        ) : activeView === 'recommendations' ? (
          /* --- VIEW 2: SMART COMPLEMENTARY RECOMMENDATIONS --- */
          <div className="flex-1 flex flex-col min-h-0">
            {/* Filter Chips & Batch Action Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/60 space-y-3 shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Reason Category Filter Chips */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-slate-400 font-medium ml-1">فیلتر منبع پیشنهاد:</span>
                  {[
                    { id: 'all', label: 'همه پیشنهادات', count: smartRecommendations.length },
                    {
                      id: 'complementary_subject',
                      label: 'پیوند بین‌رشته‌ای و تسلسلی',
                      count: smartRecommendations.filter(r => r.reasonType === 'complementary_subject').length
                    },
                    {
                      id: 'quiz_diagnostic',
                      label: 'تحلیل کوییز تشخیصی',
                      count: smartRecommendations.filter(r => r.reasonType === 'quiz_diagnostic').length
                    },
                    {
                      id: 'spaced_retention',
                      label: 'تثبیت حافظه ابینگهاوس',
                      count: smartRecommendations.filter(r => r.reasonType === 'spaced_retention').length
                    },
                    {
                      id: 'high_yield_exam',
                      label: 'پرتکرار کنکور سراسری',
                      count: smartRecommendations.filter(r => r.reasonType === 'high_yield_exam').length
                    }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setRecommendationFilter(f.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                        recommendationFilter === f.id
                          ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span>{f.label}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        recommendationFilter === f.id
                          ? 'bg-slate-950/20 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {f.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Batch Add All Filtered */}
                {filteredRecommendations.length > 0 && (
                  <button
                    onClick={handleAddAllFilteredRecommendations}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                    title="افزودن تمام مباحث پیشنهادی واجد شرایط این دسته به لیست شخصی"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>افزودن همه پیشنهادات این دسته به لیست شخصی</span>
                  </button>
                )}
              </div>

              {/* Engine Logic Explanation Banner */}
              <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  این پیشنهادات بر اساس همبستگی دروس (مانند ارتباط مشتق با فیزیک)، گام بعدی فصول، خطاهای کوییز تشخیصی و سرفصل‌های مستعد فراموشی تولید شده‌اند.
                </span>
              </div>
            </div>

            {/* Recommendations Scrollable List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
              {filteredRecommendations.length === 0 ? (
                <div className="py-16 text-center max-w-md mx-auto space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-amber-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    در این دسته‌بندی پیشنهادی یافت نشد.
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    با انتخاب مباحث بیشتر در فهرست کتب یا شرکت در آزمون تشخیصی، سیستم سرفصل‌های مکمل جدیدی به شما پیشنهاد خواهد داد.
                  </p>
                  <button
                    onClick={() => setRecommendationFilter('all')}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    نمایش همه پیشنهادات ({smartRecommendations.length})
                  </button>
                </div>
              ) : (
                filteredRecommendations.map(item => {
                  const isSaved = savedTopicIdSet.has(item.topic.id);
                  const isChecked = checkedTopicIds.has(item.topic.id);

                  // Priority Score color
                  const priorityColor =
                    item.priorityScore >= 90
                      ? 'text-amber-400 bg-amber-400/10 border-amber-400/30'
                      : item.priorityScore >= 80
                      ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
                      : 'text-sky-400 bg-sky-400/10 border-sky-400/30';

                  // Reason Icon
                  const ReasonIcon =
                    item.reasonType === 'quiz_diagnostic'
                      ? Zap
                      : item.reasonType === 'spaced_retention'
                      ? RotateCcw
                      : item.reasonType === 'high_yield_exam'
                      ? Flame
                      : Layers;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isSaved
                          ? 'bg-emerald-950/20 border-emerald-500/30'
                          : isChecked
                          ? 'bg-amber-400/5 border-amber-400/40'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Left/Main Column: Metadata & Rationale */}
                      <div className="space-y-2 flex-1">
                        {/* Top Badges & Hierarchy Breadcrumbs */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          {/* Priority Score */}
                          <span className={`px-2 py-0.5 rounded-lg border text-[11px] font-mono font-bold flex items-center gap-1 ${priorityColor}`}>
                            <Sparkles className="w-3 h-3" />
                            <span>{item.priorityScore}٪ تطابق اولویت</span>
                          </span>

                          {/* Reason Type Badge */}
                          <span className="px-2 py-0.5 rounded-lg bg-slate-800/80 text-slate-300 text-[11px] font-medium border border-slate-700/80 flex items-center gap-1">
                            <ReasonIcon className="w-3 h-3 text-amber-400" />
                            <span>{item.reasonBadge}</span>
                          </span>

                          {/* Breadcrumb metadata */}
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mr-1">
                            <span>پایه {item.grade}</span>
                            <span aria-hidden="true">·</span>
                            <span className="text-amber-300 font-semibold">{item.book.bookTitle}</span>
                            <span aria-hidden="true">·</span>
                            <span className="text-slate-300">{item.chapterTitle}</span>
                          </div>
                        </div>

                        {/* Topic Name */}
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleToggleTopic(item.topic.id)}
                            className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer shrink-0"
                            aria-label="علامت زدن چک‌باکس"
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-amber-400" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                            )}
                          </button>

                          <h4 className="text-sm sm:text-base font-bold text-white">
                            {item.topic.topicName}
                          </h4>

                          {item.topic.importance === 'critical' && (
                            <span className="text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.2 rounded font-semibold shrink-0">
                              مبحث کلیدی
                            </span>
                          )}
                        </div>

                        {/* Cognitive Rationale Box */}
                        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                          <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-[11px]">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>{item.reasonTitle}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            {item.reasonDescription}
                          </p>
                        </div>

                        {/* Recommended Method */}
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                          <span className="text-amber-400/90 font-medium">متد فعال یادگیری:</span>
                          <span className="text-slate-300">{item.topic.recommendedMethod}</span>
                        </div>
                      </div>

                      {/* Right Column: Actions */}
                      <div className="flex md:flex-col items-center justify-end md:justify-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                        {isSaved ? (
                          <div className="px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>در لیست شخصی شما</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddRecommendedTopic(item)}
                            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-400/10 cursor-pointer active:scale-95"
                          >
                            <BookmarkPlus className="w-4 h-4" />
                            <span>+ افزودن به لیست مطالعه</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleToggleTopic(item.topic.id)}
                          className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                        >
                          {isChecked ? 'لغو تیک' : 'انتخاب با چک‌باکس'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          /* --- VIEW 3: MY PERSONAL STUDY LIST --- */
          <div className="flex-1 flex flex-col min-h-0">
            {/* My List Filter Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">فیلتر بر اساس درس:</span>
                <select
                  value={personalListFilter}
                  onChange={e => setPersonalListFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="all">تمام دروس ({personalList.length} مبحث)</option>
                  {Array.from(new Set(personalList.map(i => i.subject))).map(sub => (
                    <option key={sub} value={sub}>
                      {sub} ({personalList.filter(i => i.subject === sub).length})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSyncToEbbinghaus}
                  className="py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>انتقال لیست شخصی به صف ابینگهاوس</span>
                </button>
              </div>
            </div>

            {/* My List Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {personalList.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                    <BookmarkPlus className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-slate-400 font-medium">
                    لیست مطالعه شخصی شما در حال حاضر خالی است.
                  </p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    از تب «فهرست آکاردئونی کتب درسی»، مباحث را با چک‌باکس علامت بزنید و دکمه «افزودن به لیست شخصی» را فشار دهید.
                  </p>
                  <button
                    onClick={() => setActiveView('browse')}
                    className="mt-2 px-4 py-2 bg-amber-400 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-300 transition-colors cursor-pointer"
                  >
                    بازگشت به فهرست آکاردئونی کتب
                  </button>
                </div>
              ) : (
                personalList
                  .filter(item => personalListFilter === 'all' || item.subject === personalListFilter)
                  .map(item => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                          <span className="font-semibold text-amber-300">{item.bookTitle}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-300">{item.chapterTitle}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-400">
                            {item.status === 'scheduled_ebbinghaus' ? 'در صف ابینگهاوس' : 'برنامه‌ریزی اولیه'}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                          {item.topicName}
                        </h4>

                        <p className="text-[11px] text-slate-400 font-light">
                          <span className="text-amber-400/80 font-medium">روش بازیابی فعال: </span>
                          <span>{item.recommendedMethod}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            removeMultipleTopicsFromPersonalList([item.id]);
                            setPersonalList(getPersonalStudyList());
                            showToast(`«${item.topicName}» از لیست شخصی حذف شد.`);
                          }}
                          title="حذف از لیست شخصی"
                          className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* --- STICKY FOOTER ACTION BAR --- */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/95 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="font-mono text-amber-400 font-bold">
              {checkedTopicIds.size}
            </span>
            <span>مبحث انتخاب‌شده با چک‌باکس</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500">
              مجموع در لیست شخصی شما: {personalList.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {checkedTopicIds.size > 0 && (
              <>
                <button
                  onClick={handleAddCheckedToPersonalList}
                  className="flex-1 sm:flex-none px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-400/10 cursor-pointer active:scale-95"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  <span>افزودن ({checkedTopicIds.size}) مبحث به لیست شخصی</span>
                </button>

                <button
                  onClick={handleSyncToEbbinghaus}
                  className="flex-1 sm:flex-none px-3.5 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>انتقال مستقیم به ابینگهاوس</span>
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              بستن
            </button>
          </div>
        </div>

        {/* Transient Toast Notification */}
        {toastMessage && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-amber-400/50 text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export { SubjectSelectorModal } from './SubjectSelectorModal';
