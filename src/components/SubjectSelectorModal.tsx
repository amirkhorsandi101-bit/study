/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SubjectSelectorModal.tsx: Modern 4-Level Hierarchical Subject Selector Modal
 * Offers a fluid, interactive modal interface for exploring, selecting, and managing
 * syllabus topics across Grades (10, 11, 12), Academic Tracks (Experimental, Math, Humanities),
 * Textbooks, Chapters, and granular Topics with dedicated selection management controls.
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  X,
  BookOpen,
  Check,
  CheckSquare,
  Square,
  Search,
  Layers,
  GraduationCap,
  Sparkles,
  BookmarkCheck,
  Trash2,
  ChevronDown,
  Flame,
  Copy,
  RotateCcw,
  CheckCircle2,
  FolderTree,
  FolderOpen
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
  highlightFuzzyText
} from '../utils/fuzzySearch';

export interface SubjectSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultGrade?: GradeLevel;
  defaultTrack?: AcademicTrackId;
  onSyncToScheduler?: (addedCount: number) => void;
  onSelectionChange?: (selectedTopicIds: string[]) => void;
}

type QuickFilterType = 'all' | 'selected_only' | 'critical_only' | 'specialized_only';

export const SubjectSelectorModal: React.FC<SubjectSelectorModalProps> = ({
  isOpen,
  onClose,
  defaultGrade = 12,
  defaultTrack = 'experimental',
  onSyncToScheduler
}) => {
  // Level 1: Grade State (10, 11, 12)
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(defaultGrade);

  // Level 2: Track State (experimental, mathematics, humanities)
  const [selectedTrack, setSelectedTrack] = useState<AcademicTrackId>(defaultTrack);

  // Level 3: Active Book / Subject ID
  const [activeBookId, setActiveBookId] = useState<string>('');

  // Level 4: Expanded Chapters Set (defaults to all chapters open for convenient browsing)
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set([1, 2, 3, 4, 5, 6, 7, 8]));

  // Search Query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Quick Filter State
  const [quickFilter, setQuickFilter] = useState<QuickFilterType>('all');

  // Persistent Personal List
  const [personalList, setPersonalList] = useState<PersonalStudyTopic[]>(() => getPersonalStudyList());

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Tab inside modal: 'hierarchy_browser' vs 'my_selection_summary'
  const [activeTab, setActiveTab] = useState<'browse' | 'summary'>('browse');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync personal study list on global events
  useEffect(() => {
    const handleSync = () => {
      setPersonalList(getPersonalStudyList());
    };
    window.addEventListener(PERSONAL_LIST_UPDATED_EVENT, handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener(PERSONAL_LIST_UPDATED_EVENT, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Sync initial grade and track when modal opens
  useEffect(() => {
    if (isOpen) {
      if (defaultGrade) setSelectedGrade(defaultGrade);
      if (defaultTrack) setSelectedTrack(defaultTrack);
    }
  }, [isOpen, defaultGrade, defaultTrack]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Set of selected topic IDs in student's personal list
  const selectedTopicIdSet = useMemo(() => {
    return new Set(personalList.map(item => item.topicId));
  }, [personalList]);

  // Books available for the selected Grade and Track
  const availableBooks: SubjectBook[] = useMemo(() => {
    return SubjectLibrary.getBooks(selectedGrade, selectedTrack);
  }, [selectedGrade, selectedTrack]);

  // Set default active book when available books change
  useEffect(() => {
    if (availableBooks.length > 0) {
      if (!activeBookId || !availableBooks.some((b: SubjectBook) => b.id === activeBookId)) {
        setActiveBookId(availableBooks[0].id);
      }
    }
  }, [availableBooks, activeBookId]);

  // Currently active book object
  const activeBook: SubjectBook | undefined = useMemo(() => {
    return availableBooks.find((b: SubjectBook) => b.id === activeBookId) || availableBooks[0];
  }, [availableBooks, activeBookId]);

  // Flat list of all topics in active book
  const activeBookTopics = useMemo(() => {
    if (!activeBook) return [];
    const list: { chapter: SubjectChapter; topic: SubjectTopic }[] = [];
    activeBook.chapters.forEach((ch: SubjectChapter) => {
      ch.topics.forEach((tp: SubjectTopic) => {
        list.push({ chapter: ch, topic: tp });
      });
    });
    return list;
  }, [activeBook]);

  // Count selected in active book
  const activeBookSelectedCount = useMemo(() => {
    return activeBookTopics.filter(item => selectedTopicIdSet.has(item.topic.id)).length;
  }, [activeBookTopics, selectedTopicIdSet]);

  // Total topics across all books in the selected Grade & Track
  const allCurrentTrackTopics = useMemo(() => {
    const list: { book: SubjectBook; chapter: SubjectChapter; topic: SubjectTopic }[] = [];
    availableBooks.forEach((b: SubjectBook) => {
      b.chapters.forEach((ch: SubjectChapter) => {
        ch.topics.forEach((tp: SubjectTopic) => {
          list.push({ book: b, chapter: ch, topic: tp });
        });
      });
    });
    return list;
  }, [availableBooks]);

  // Count selected in entire Grade & Track
  const currentTrackSelectedCount = useMemo(() => {
    return allCurrentTrackTopics.filter(item => selectedTopicIdSet.has(item.topic.id)).length;
  }, [allCurrentTrackTopics, selectedTopicIdSet]);

  // Global search matching topics across all books
  const searchResults = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) return null;

    const matched: {
      book: SubjectBook;
      chapter: SubjectChapter;
      topic: SubjectTopic;
      score: number;
    }[] = [];

    // Search across all books in current Grade & Track
    allCurrentTrackTopics.forEach(({ book, chapter, topic }) => {
      const topicResult = fuzzyMatchScore(query, topic.topicName);
      const chResult = fuzzyMatchScore(query, chapter.chapterTitle);
      const bookResult = fuzzyMatchScore(query, book.bookTitle);
      const methodResult = fuzzyMatchScore(query, topic.recommendedMethod);

      const maxScore = Math.max(
        topicResult.score,
        chResult.score * 0.8,
        bookResult.score * 0.7,
        methodResult.score * 0.6
      );
      if (maxScore > 0.4) {
        matched.push({ book, chapter, topic, score: maxScore });
      }
    });

    matched.sort((a, b) => b.score - a.score);
    return matched;
  }, [searchQuery, allCurrentTrackTopics]);

  // Toggle chapter collapse/expand
  const toggleChapter = (chapterNum: number) => {
    setExpandedChapters(prev => {
      const next = new Set(prev);
      if (next.has(chapterNum)) next.delete(chapterNum);
      else next.add(chapterNum);
      return next;
    });
  };

  // Toggle single topic selection
  const handleToggleTopic = useCallback((topic: SubjectTopic, book: SubjectBook, chapter: SubjectChapter) => {
    const isSelected = selectedTopicIdSet.has(topic.id);
    if (isSelected) {
      removeMultipleTopicsFromPersonalList([topic.id]);
      setPersonalList(getPersonalStudyList());
      showToast(`مبحث «${topic.topicName}» از لیست خارج شد.`);
    } else {
      addMultipleTopicsToPersonalList([{ topic, book, chapter }]);
      setPersonalList(getPersonalStudyList());
      showToast(`مبحث «${topic.topicName}» به سرفصل‌های انتخابی اضافه شد.`);
    }
  }, [selectedTopicIdSet]);

  // =========================================================================
  // CONTROL BUTTON ACTIONS
  // =========================================================================

  // 1. Select All in Current Book
  const handleSelectAllInActiveBook = () => {
    if (!activeBook) return;
    const itemsToAdd = activeBookTopics
      .filter(({ topic }) => !selectedTopicIdSet.has(topic.id))
      .map(({ chapter, topic }) => ({ topic, book: activeBook, chapter }));

    if (itemsToAdd.length === 0) {
      showToast('تمام مباحث این درس از قبل انتخاب شده‌اند.');
      return;
    }

    const res = addMultipleTopicsToPersonalList(itemsToAdd);
    setPersonalList(getPersonalStudyList());
    showToast(`${res.addedCount} مبحث از درس «${activeBook.bookTitle}» انتخاب شد.`);
  };

  // 2. Deselect All in Current Book
  const handleDeselectAllInActiveBook = () => {
    if (!activeBook) return;
    const idsToRemove = activeBookTopics
      .filter(({ topic }) => selectedTopicIdSet.has(topic.id))
      .map(({ topic }) => topic.id);

    if (idsToRemove.length === 0) {
      showToast('هیچ مبحثی در این درس انتخاب نشده است.');
      return;
    }

    removeMultipleTopicsFromPersonalList(idsToRemove);
    setPersonalList(getPersonalStudyList());
    showToast(`${idsToRemove.length} مبحث از این درس لغو انتخاب شد.`);
  };

  // 3. Select Only Critical / High-Yield Topics in Active Book
  const handleSelectCriticalOnlyInBook = () => {
    if (!activeBook) return;
    const criticalItems = activeBookTopics.filter(
      ({ topic }) => topic.importance === 'critical' || topic.importance === 'very_high'
    );

    const itemsToAdd = criticalItems
      .filter(({ topic }) => !selectedTopicIdSet.has(topic.id))
      .map(({ chapter, topic }) => ({ topic, book: activeBook, chapter }));

    if (itemsToAdd.length === 0) {
      showToast('تمام مباحث حیاتی و پرریسک این درس از قبل انتخاب شده‌اند.');
      return;
    }

    const res = addMultipleTopicsToPersonalList(itemsToAdd);
    setPersonalList(getPersonalStudyList());
    showToast(`${res.addedCount} مبحث حیاتی و پرتکرار کنکور انتخاب شد.`);
  };

  // 4. Invert Selection in Active Book
  const handleInvertSelectionInActiveBook = () => {
    if (!activeBook) return;
    const toRemove = activeBookTopics
      .filter(({ topic }) => selectedTopicIdSet.has(topic.id))
      .map(({ topic }) => topic.id);

    const toAdd = activeBookTopics
      .filter(({ topic }) => !selectedTopicIdSet.has(topic.id))
      .map(({ chapter, topic }) => ({ topic, book: activeBook, chapter }));

    if (toRemove.length > 0) {
      removeMultipleTopicsFromPersonalList(toRemove);
    }
    if (toAdd.length > 0) {
      addMultipleTopicsToPersonalList(toAdd);
    }

    setPersonalList(getPersonalStudyList());
    showToast('وضعیت انتخاب مباحث این درس معکوس شد.');
  };

  // 5. Select All Topics in Entire Grade & Track
  const handleSelectAllInTrack = () => {
    const itemsToAdd = allCurrentTrackTopics
      .filter(({ topic }) => !selectedTopicIdSet.has(topic.id))
      .map(({ book, chapter, topic }) => ({ topic, book, chapter }));

    if (itemsToAdd.length === 0) {
      showToast('تمام مباحث این پایه و رشته از قبل انتخاب شده‌اند.');
      return;
    }

    const res = addMultipleTopicsToPersonalList(itemsToAdd);
    setPersonalList(getPersonalStudyList());
    showToast(`${res.addedCount} مبحث از کل دروس این پایه و رشته انتخاب شد.`);
  };

  // 6. Clear All Selected Topics
  const handleClearAllSelections = () => {
    if (personalList.length === 0) {
      showToast('لیست انتخاب‌ها خالی است.');
      return;
    }
    const allIds = personalList.map(item => item.topicId);
    removeMultipleTopicsFromPersonalList(allIds);
    setPersonalList(getPersonalStudyList());
    showToast('تمام انتخاب‌ها با موفقیت پاک شدند.');
  };

  // 7. Sync Selected to Ebbinghaus Scheduler
  const handleSyncToEbbinghaus = () => {
    const res = syncPersonalTopicsToEbbinghaus();
    if (res.addedCount > 0) {
      showToast(`${res.addedCount} مبحث به صف فواصل مرور طلایی ابینگهاوس منتقل شد.`);
      if (onSyncToScheduler) onSyncToScheduler(res.addedCount);
    } else {
      showToast('همه مباحث انتخابی شما در صف ابینگهاوس ثبت شده‌اند.');
    }
  };

  // 8. Copy Selected Topic List to Clipboard
  const handleCopyListToClipboard = () => {
    if (personalList.length === 0) {
      showToast('مبحثی برای کپی وجود ندارد.');
      return;
    }

    const lines = personalList.map(
      (item, idx) => `${idx + 1}. [${item.subject}] ${item.topicName} (${item.bookTitle})`
    );
    const text = `فهرست مباحث مطالعاتی منتخب راهبُرد (${personalList.length} مبحث):\n` + lines.join('\n');

    navigator.clipboard.writeText(text).then(() => {
      showToast('فهرست مباحث منتخب در کلیپ‌بورد کپی شد.');
    }).catch(() => {
      showToast('کپی در کلیپ‌بورد با خطا مواجه شد.');
    });
  };

  // Filtered topics in active book based on quickFilter
  const filteredActiveBookChapters = useMemo(() => {
    if (!activeBook) return [];

    return activeBook.chapters.map((ch: SubjectChapter) => {
      const filteredTopics = ch.topics.filter((tp: SubjectTopic) => {
        const isSelected = selectedTopicIdSet.has(tp.id);

        if (quickFilter === 'selected_only' && !isSelected) return false;
        if (quickFilter === 'critical_only' && tp.importance !== 'critical' && tp.importance !== 'very_high') return false;
        if (quickFilter === 'specialized_only' && !activeBook.isSpecialized) return false;

        return true;
      });

      return {
        ...ch,
        topics: filteredTopics
      };
    }).filter((ch: SubjectChapter) => ch.topics.length > 0);
  }, [activeBook, quickFilter, selectedTopicIdSet]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-950/85 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      dir="rtl"
      role="dialog"
      aria-modal="true"
    >
      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-6xl h-[90vh] max-h-[850px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden transform transition-all duration-300 ease-out animate-in zoom-in-95">
        
        {/* ===================================================================
            1. MODAL HEADER WITH BREADCRUMB, SEARCH & CLOSE
            =================================================================== */}
        <div className="shrink-0 px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
              <FolderTree className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                <span>انتخاب‌گر سلسله‌مراتبی سرفصل‌ها</span>
                <span className="text-slate-500" aria-hidden="true">·</span>
                <span className="text-slate-400">SubjectSelector Modal</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
                <span>مدیریت مباحث و سرفصل‌های درسی</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-mono font-bold">
                  {personalList.length} منتخب
                </span>
              </h2>
            </div>
          </div>

          {/* Search Field & Modal Controls */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی سریع مبحث یا درس..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pr-9 pl-8 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-300 text-slate-300 border border-slate-700 hover:border-rose-500/30 flex items-center justify-center transition-colors cursor-pointer"
              title="بستن پنجره (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ===================================================================
            2. HIERARCHY SELECTORS STRIP (LEVEL 1: GRADE & LEVEL 2: TRACK)
            =================================================================== */}
        <div className="shrink-0 px-6 py-3 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          
          {/* Level 1: Grade Level Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>پایه تحصیلی:</span>
            </span>
            <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800">
              {GRADES_LIST.map(({ grade, label }) => (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    selectedGrade === grade
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Level 2: Academic Track Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>رشته تحصیلی:</span>
            </span>
            <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800">
              {(Object.keys(TRACKS_INFO) as AcademicTrackId[]).map((trackId) => {
                const info = TRACKS_INFO[trackId];
                const isActive = selectedTrack === trackId;
                return (
                  <button
                    key={trackId}
                    onClick={() => setSelectedTrack(trackId)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{info.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Switcher: Browse vs Summary */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-3 py-1.5 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'browse'
                  ? 'bg-slate-800 border-amber-400/40 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              مرور سلسله‌مراتب ({allCurrentTrackTopics.length} مبحث)
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3 py-1.5 rounded-xl border font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'summary'
                  ? 'bg-slate-800 border-amber-400/40 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>مباحث انتخاب‌شده</span>
              <span className="font-mono bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded text-[10px]">
                {personalList.length}
              </span>
            </button>
          </div>
        </div>

        {/* ===================================================================
            3. MAIN BODY CONTAINER: 2-COLUMN LAYOUT (LEVEL 3 BOOKS + LEVEL 4 TOPICS)
            =================================================================== */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
          
          {/* ---------------------------------------------------------------
              LEFT COLUMN (LEVEL 3: SUBJECT / BOOK SELECTOR)
              --------------------------------------------------------------- */}
          <div className="w-full md:w-72 lg:w-80 shrink-0 bg-slate-950/70 border-b md:border-b-0 md:border-l border-slate-800 flex flex-col overflow-hidden">
            {/* Column Header & Track Stats */}
            <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>کتاب‌ها و دروس ({availableBooks.length})</span>
              </span>
              <span className="font-mono text-[11px] text-cyan-300">
                {currentTrackSelectedCount} از {allCurrentTrackTopics.length} انتخابی
              </span>
            </div>

            {/* Quick Actions for Entire Track */}
            <div className="p-2.5 border-b border-slate-800/80 bg-slate-900/50 flex items-center gap-1.5">
              <button
                onClick={handleSelectAllInTrack}
                className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-[11px] font-semibold rounded-lg border border-slate-700/80 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                title="انتخاب تمام سرفصل‌های این پایه و رشته"
              >
                <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>انتخاب کل رشته</span>
              </button>
              <button
                onClick={handleClearAllSelections}
                className="py-1.5 px-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[11px] font-semibold rounded-lg border border-rose-500/30 transition-colors flex items-center gap-1 cursor-pointer"
                title="لغو تمام انتخاب‌ها"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>پاکسازی</span>
              </button>
            </div>

            {/* Books List (Level 3 Scrollable) */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
              {availableBooks.map((book: SubjectBook) => {
                const isActive = book.id === activeBookId;
                const bookTopics = book.chapters.flatMap((ch: SubjectChapter) => ch.topics);
                const bookSelectedCount = bookTopics.filter((tp: SubjectTopic) => selectedTopicIdSet.has(tp.id)).length;
                const isFullySelected = bookTopics.length > 0 && bookSelectedCount === bookTopics.length;

                return (
                  <div
                    key={book.id}
                    onClick={() => {
                      setActiveBookId(book.id);
                      if (activeTab !== 'browse') setActiveTab('browse');
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer group flex flex-col gap-2 ${
                      isActive
                        ? 'bg-amber-400/10 border-amber-400/40 shadow-sm'
                        : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 truncate">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          isFullySelected
                            ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                            : bookSelectedCount > 0
                            ? 'bg-amber-400'
                            : 'bg-slate-700'
                        }`} />
                        <h4 className={`text-xs font-bold truncate ${
                          isActive ? 'text-amber-300' : 'text-slate-200 group-hover:text-white'
                        }`}>
                          {book.bookTitle}
                        </h4>
                      </div>

                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                        bookSelectedCount > 0
                          ? 'bg-amber-400/20 text-amber-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {bookSelectedCount} / {bookTopics.length}
                      </span>
                    </div>

                    {/* Unboxed Metadata: Category & Specialized Tag */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{book.subjectCategory}</span>
                      <span className={book.isSpecialized ? 'text-cyan-400' : 'text-slate-500'}>
                        {book.isSpecialized ? 'تخصصی کنکور' : 'عمومی نهایی'}
                      </span>
                    </div>

                    {/* Mini Progress Bar for this book */}
                    <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden border border-slate-800/80">
                      <div
                        className="bg-amber-400 h-full transition-all duration-300"
                        style={{ width: `${bookTopics.length > 0 ? (bookSelectedCount / bookTopics.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ---------------------------------------------------------------
              RIGHT COLUMN (LEVEL 4: CHAPTERS & TOPICS ACCORDION + CONTROLS)
              --------------------------------------------------------------- */}
          <div className="flex-1 flex flex-col bg-slate-900/40 overflow-hidden">
            
            {/* If user is searching, show search results view */}
            {searchResults ? (
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Search className="w-4 h-4 text-amber-400" />
                    <span>نتایج جستجو برای: «{searchQuery}»</span>
                  </span>
                  <span className="font-mono text-amber-400 font-bold">
                    {searchResults.length} مبحث منطبق
                  </span>
                </div>

                {searchResults.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 text-xs">
                    مبحثی با این عبارت یافت نشد. لطفاً عبارت دیگری را امتحان کنید.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {searchResults.map(({ book, chapter, topic }) => {
                      const isSelected = selectedTopicIdSet.has(topic.id);
                      return (
                        <div
                          key={topic.id}
                          onClick={() => handleToggleTopic(topic, book, chapter)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-amber-400/10 border-amber-400/40 text-white'
                              : 'bg-slate-950/80 hover:bg-slate-900 border-slate-800 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3 truncate">
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                              isSelected ? 'bg-amber-400 text-slate-950' : 'border border-slate-700 bg-slate-900'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <div className="truncate space-y-0.5">
                              <span className="text-[10px] text-slate-400 block truncate">
                                {book.bookTitle} · {chapter.chapterTitle}
                              </span>
                              <h5 className="font-bold text-xs truncate">
                                {highlightFuzzyText(topic.topicName, searchQuery)}
                              </h5>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 text-[10px]">
                            {topic.importance === 'critical' && (
                              <span className="text-amber-400 font-bold">⭐ حیاتی کنکور</span>
                            )}
                            <span className="text-slate-400 hidden sm:inline">
                              {topic.recommendedMethod}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : activeTab === 'summary' ? (
              /* =============================================================
                 MY SELECTION SUMMARY TAB
                 ============================================================= */
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 text-xs">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <BookmarkCheck className="w-5 h-5 text-amber-400" />
                      <span>فهرست کامل مباحث منتخب شما</span>
                    </h3>
                    <p className="text-slate-400 text-xs mt-0.5">
                      مجموعاً {personalList.length} مبحث در لیست شخصی شما ذخیره شده است.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyListToClipboard}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-amber-400" />
                      <span>کپی لیست</span>
                    </button>
                    <button
                      onClick={handleSyncToEbbinghaus}
                      className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>انتقال به صف ابینگهاوس</span>
                    </button>
                  </div>
                </div>

                {personalList.length === 0 ? (
                  <div className="py-20 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-amber-400">
                      <FolderOpen className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-white">هنوز مبحثی انتخاب نشده است</p>
                    <p className="text-xs text-slate-400">
                      از ستون سمت راست درس مورد نظرتان را انتخاب کرده و مباحث را تیک بزنید.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {personalList.map(item => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex items-start justify-between gap-3 hover:border-slate-700 transition-colors"
                      >
                        <div className="space-y-1 truncate">
                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <span className="text-amber-400 font-semibold">{item.subject}</span>
                            <span aria-hidden="true">·</span>
                            <span className="truncate">{item.bookTitle}</span>
                          </div>
                          <h5 className="font-bold text-xs text-slate-200 truncate">
                            {item.topicName}
                          </h5>
                          <p className="text-[10px] text-slate-400 truncate">
                            {item.recommendedMethod}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            removeMultipleTopicsFromPersonalList([item.topicId]);
                            setPersonalList(getPersonalStudyList());
                            showToast(`مبحث «${item.topicName}» حذف شد.`);
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
                          title="حذف از لیست شخصی"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* =============================================================
                 STANDARD HIERARCHY TOPICS BROWSER (LEVEL 4)
                 ============================================================= */
              <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* -----------------------------------------------------------
                    BOOK HEADER & CONTROL BUTTONS TOOLBAR
                    ----------------------------------------------------------- */}
                <div className="shrink-0 p-4 bg-slate-950/80 border-b border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-amber-400 font-semibold">
                        <span>{activeBook?.bookTitle}</span>
                        <span className="text-slate-500" aria-hidden="true">·</span>
                        <span className="text-slate-400">
                          {activeBookSelectedCount} از {activeBookTopics.length} مبحث انتخاب شده
                        </span>
                      </div>
                      <h3 className="text-base font-black text-white mt-0.5">
                        سرفصل‌ها و فصول آموزشی این کتاب
                      </h3>
                    </div>

                    {/* Quick Filter Buttons */}
                    <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800 text-[11px]">
                      <button
                        onClick={() => setQuickFilter('all')}
                        className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                          quickFilter === 'all'
                            ? 'bg-amber-400 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        همه فصول
                      </button>
                      <button
                        onClick={() => setQuickFilter('selected_only')}
                        className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                          quickFilter === 'selected_only'
                            ? 'bg-amber-400 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        فقط انتخابی‌ها
                      </button>
                      <button
                        onClick={() => setQuickFilter('critical_only')}
                        className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                          quickFilter === 'critical_only'
                            ? 'bg-amber-400 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        ⭐ حیاتی کنکور
                      </button>
                    </div>
                  </div>

                  {/* ---------------------------------------------------------
                      DEDICATED CONTROL BUTTONS FOR MANAGING TOPIC SELECTION
                      --------------------------------------------------------- */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
                    {/* Control 1: Select All in this Book */}
                    <button
                      onClick={handleSelectAllInActiveBook}
                      className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>انتخاب همه در این درس</span>
                    </button>

                    {/* Control 2: Deselect All in this Book */}
                    <button
                      onClick={handleDeselectAllInActiveBook}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Square className="w-3.5 h-3.5" />
                      <span>لغو انتخاب‌های این درس</span>
                    </button>

                    {/* Control 3: Select Critical Only */}
                    <button
                      onClick={handleSelectCriticalOnlyInBook}
                      className="px-3 py-1.5 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="انتخاب فقط مباحث با درجه اهمیت حیاتی و پرتکرار کنکور"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>فقط مباحث حیاتی کنکور ⭐</span>
                    </button>

                    {/* Control 4: Invert Selection */}
                    <button
                      onClick={handleInvertSelectionInActiveBook}
                      className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white font-medium text-xs rounded-xl border border-slate-700/80 transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="معکوس کردن مباحث انتخاب شده و انتخاب نشده"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>معکوس‌سازی</span>
                    </button>
                  </div>
                </div>

                {/* -----------------------------------------------------------
                    CHAPTERS & TOPICS SCROLLABLE ACCORDION (LEVEL 4)
                    ----------------------------------------------------------- */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                  {filteredActiveBookChapters.map((chapter: SubjectChapter) => {
                    const isExpanded = expandedChapters.has(chapter.chapterNumber);
                    const chapterSelectedCount = chapter.topics.filter((tp: SubjectTopic) => selectedTopicIdSet.has(tp.id)).length;

                    return (
                      <div
                        key={chapter.chapterNumber}
                        className="rounded-2xl bg-slate-950/70 border border-slate-800 overflow-hidden transition-all duration-200"
                      >
                        {/* Chapter Accordion Header */}
                        <div
                          onClick={() => toggleChapter(chapter.chapterNumber)}
                          className="px-4 py-3 bg-slate-900/80 hover:bg-slate-900 border-b border-slate-800/80 flex items-center justify-between gap-3 cursor-pointer select-none transition-colors"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180' : ''
                            }`} />
                            <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                              {chapter.chapterTitle}
                            </h4>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 text-xs">
                            <span className={`font-mono text-[11px] px-2 py-0.5 rounded-md font-semibold ${
                              chapterSelectedCount > 0
                                ? 'bg-amber-400/20 text-amber-300'
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              {chapterSelectedCount} از {chapter.topics.length} مبحث
                            </span>
                          </div>
                        </div>

                        {/* Chapter Topics Body */}
                        {isExpanded && (
                          <div className="p-3 divide-y divide-slate-800/60 space-y-1">
                            {chapter.topics.map((topic: SubjectTopic) => {
                              const isSelected = selectedTopicIdSet.has(topic.id);
                              return (
                                <div
                                  key={topic.id}
                                  onClick={() => handleToggleTopic(topic, activeBook!, chapter)}
                                  className={`p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                                    isSelected
                                      ? 'bg-amber-400/10 text-white'
                                      : 'hover:bg-slate-900/60 text-slate-300'
                                  }`}
                                >
                                  {/* Checkbox & Topic Title */}
                                  <div className="flex items-center gap-3 truncate">
                                    <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all ${
                                      isSelected
                                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                                        : 'border border-slate-700 bg-slate-900 group-hover:border-slate-500'
                                    }`}>
                                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                    </div>

                                    <div className="truncate space-y-0.5">
                                      <h5 className={`font-bold text-xs truncate ${
                                        isSelected ? 'text-amber-200' : 'text-slate-200'
                                      }`}>
                                        {topic.topicName}
                                      </h5>
                                      <p className="text-[10px] text-slate-400 truncate">
                                        روش پیشنهادی: {topic.recommendedMethod}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Badges / Importance */}
                                  <div className="flex items-center gap-2.5 shrink-0 text-[11px]">
                                    {topic.importance === 'critical' ? (
                                      <span className="text-amber-400 font-bold flex items-center gap-1">
                                        <Flame className="w-3.5 h-3.5" />
                                        <span>حیاتی کنکور</span>
                                      </span>
                                    ) : topic.importance === 'very_high' ? (
                                      <span className="text-cyan-400 font-medium">پرتکرار</span>
                                    ) : (
                                      <span className="text-slate-500">استاندارد</span>
                                    )}

                                    {topic.estimatedMinutes && (
                                      <span className="text-slate-500 font-mono text-[10px]">
                                        {topic.estimatedMinutes} دقیقه
                                      </span>
                                    )}
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
              </div>
            )}
          </div>
        </div>

        {/* ===================================================================
            4. MODAL FOOTER WITH BULK SYNC & SUMMARY ACTIONS
            =================================================================== */}
        <div className="shrink-0 px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="text-slate-400 block text-[11px]">وضعیت کلی سرفصل‌ها:</span>
              <div className="font-bold text-white flex items-center gap-2">
                <span>{personalList.length} مبحث در لیست شخصی شما</span>
                <span className="text-slate-500" aria-hidden="true">·</span>
                <span className="text-amber-400 font-mono">
                  {Math.round((personalList.length / (allCurrentTrackTopics.length || 1)) * 100)}٪ پوشش آزمون
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleSyncToEbbinghaus}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>انتقال به فواصل مرور ابینگهاوس</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-amber-400/20 transition-all cursor-pointer active:scale-95"
            >
              ذخیره و بستن پنجره
            </button>
          </div>
        </div>

      </div>

      {/* Floating Animated Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 border border-amber-400/60 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
