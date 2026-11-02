import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  BookmarkPlus,
  BookmarkCheck,
  Search,
  Filter,
  Layers,
  GraduationCap,
  Sparkles,
  Trash2,
  Clock,
  ArrowLeft,
  Flame,
  Check,
  ListPlus,
  Play,
  RotateCcw,
  CheckCheck
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
  StudyStatus,
  getPersonalStudyList,
  toggleTopicInPersonalList,
  removeTopicFromPersonalList,
  updatePersonalTopicStatus,
  syncPersonalTopicsToEbbinghaus,
  PERSONAL_LIST_UPDATED_EVENT
} from '../data/personalStudyList';

interface PersonalStudyListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncSuccess?: (addedCount: number) => void;
  onLaunchFocus?: (topicName: string, method: string) => void;
}

export const PersonalStudyListModal: React.FC<PersonalStudyListModalProps> = ({
  isOpen,
  onClose,
  onSyncSuccess,
  onLaunchFocus
}) => {
  // Navigation / Tabs inside modal
  const [activeTab, setActiveTab] = useState<'library_browse' | 'my_list'>('library_browse');

  // Library browse state
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(12);
  const [selectedTrack, setSelectedTrack] = useState<AcademicTrackId>('experimental');
  const [selectedBookId, setSelectedBookId] = useState<string>('all');
  const [selectedChapterNum, setSelectedChapterNum] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Personal list local state
  const [personalList, setPersonalList] = useState<PersonalStudyTopic[]>(() => getPersonalStudyList());
  const [myListSubjectFilter, setMyListSubjectFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync personal list changes from custom event or storage
  useEffect(() => {
    const handleUpdate = () => {
      setPersonalList(getPersonalStudyList());
    };
    window.addEventListener(PERSONAL_LIST_UPDATED_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(PERSONAL_LIST_UPDATED_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Show temporary toast notification
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Books available for selected grade and track
  const availableBooks = useMemo(() => {
    return SubjectLibrary.getBooks(selectedGrade, selectedTrack);
  }, [selectedGrade, selectedTrack]);

  // Reset book selection if current selection is not available
  useEffect(() => {
    if (selectedBookId !== 'all') {
      const exists = availableBooks.some(b => b.id === selectedBookId);
      if (!exists) {
        setSelectedBookId('all');
        setSelectedChapterNum('all');
      }
    }
  }, [availableBooks, selectedBookId]);

  // Chapters available for selected book
  const availableChapters = useMemo(() => {
    if (selectedBookId === 'all') return [];
    return SubjectLibrary.getChapters(selectedBookId);
  }, [selectedBookId]);

  // Handle grade and track switch
  const handleGradeSelect = (grade: GradeLevel) => {
    setSelectedGrade(grade);
    setSelectedBookId('all');
    setSelectedChapterNum('all');
  };

  const handleTrackSelect = (track: AcademicTrackId) => {
    setSelectedTrack(track);
    setSelectedBookId('all');
    setSelectedChapterNum('all');
  };

  // Filtered topics from SubjectLibrary
  const filteredLibraryTopics = useMemo(() => {
    // If search query is active, use library search across the current grade/track
    if (searchQuery.trim().length >= 2) {
      const searchRes = SubjectLibrary.search(searchQuery.trim(), {
        grade: selectedGrade,
        track: selectedTrack
      });
      if (selectedBookId !== 'all') {
        return searchRes.filter(r => r.book.id === selectedBookId);
      }
      return searchRes;
    }


    const results: { book: SubjectBook; chapter: SubjectChapter; topic: SubjectTopic }[] = [];
    const booksToScan = selectedBookId === 'all'
      ? availableBooks
      : availableBooks.filter(b => b.id === selectedBookId);

    booksToScan.forEach(book => {
      const chaptersToScan = selectedChapterNum === 'all'
        ? book.chapters
        : book.chapters.filter(c => c.chapterNumber === selectedChapterNum);

      chaptersToScan.forEach(chapter => {
        chapter.topics.forEach(topic => {
          results.push({ book, chapter, topic });
        });
      });
    });

    return results;
  }, [selectedGrade, selectedTrack, selectedBookId, selectedChapterNum, searchQuery, availableBooks]);

  // Toggle a topic in personal list
  const handleToggleTopic = (topic: SubjectTopic, book: SubjectBook, chapter: SubjectChapter) => {
    const res = toggleTopicInPersonalList(topic, book, chapter);
    setPersonalList(getPersonalStudyList());
    if (res.isInList) {
      triggerToast(`«${topic.topicName}» به لیست مطالعه شخصی اضافه شد.`);
    } else {
      triggerToast(`«${topic.topicName}» از لیست شخصی حذف شد.`);
    }
  };

  // Bulk add all visible filtered topics to personal list
  const handleAddAllFiltered = () => {
    let addedCount = 0;
    filteredLibraryTopics.forEach(({ topic, book, chapter }) => {
      const isAlready = personalList.some(i => i.topicId === topic.id);
      if (!isAlready) {
        toggleTopicInPersonalList(topic, book, chapter);
        addedCount++;
      }
    });
    setPersonalList(getPersonalStudyList());
    triggerToast(`${addedCount} مبحث جدید به لیست مطالعه شخصی شما افزوده شد.`);
  };

  // Remove topic from personal list
  const handleRemoveFromList = (id: string, name: string) => {
    const updated = removeTopicFromPersonalList(id);
    setPersonalList(updated);
    triggerToast(`«${name}» از لیست مطالعه حذف شد.`);
  };

  // Sync to Ebbinghaus queue
  const handleSyncToEbbinghaus = () => {
    const res = syncPersonalTopicsToEbbinghaus();
    if (res.addedCount > 0) {
      triggerToast(`${res.addedCount} مبحث از لیست شخصی به صف مرور ابینگهاوس منتقل شد.`);
      if (onSyncSuccess) onSyncSuccess(res.addedCount);
    } else {
      triggerToast('تمام مباحث لیست شخصی شما پیش‌تر در صف مرور ثبت شده‌اند.');
    }
    setPersonalList(getPersonalStudyList());
  };

  // Filter items in My List view
  const filteredMyList = useMemo(() => {
    if (myListSubjectFilter === 'all') return personalList;
    return personalList.filter(item => item.subject === myListSubjectFilter);
  }, [personalList, myListSubjectFilter]);

  // Unique subjects in personal list
  const personalSubjects = useMemo(() => {
    const set = new Set<string>();
    personalList.forEach(item => set.add(item.subject));
    return Array.from(set);
  }, [personalList]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
      <div
        className="relative w-full max-w-5xl h-[92vh] max-h-[850px] bg-slate-900 border border-slate-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/95">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                <span>سرفصل‌های رسمی آموزش و پرورش (SubjectLibrary)</span>
                <span aria-hidden="true">·</span>
                <span>مدیریت لیست شخصی</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                انتخاب مباحث درسی و ایجاد لیست مطالعه هدفمند
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="بستن"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 sm:px-6 pt-3 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('library_browse')}
              className={`pb-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
                activeTab === 'library_browse'
                  ? 'border-amber-400 text-amber-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>فهرست کتاب‌ها و مباحث (کتابخانه)</span>
            </button>

            <button
              onClick={() => setActiveTab('my_list')}
              className={`pb-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
                activeTab === 'my_list'
                  ? 'border-amber-400 text-amber-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>لیست مطالعه شخصی من</span>
              <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300">
                {personalList.length}
              </span>
            </button>
          </div>

          {/* Quick Sync Button */}
          {personalList.length > 0 && (
            <button
              onClick={handleSyncToEbbinghaus}
              className="mb-2 hidden sm:flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>انتقال لیست شخصی به صف ابینگهاوس</span>
            </button>
          )}
        </div>

        {/* Modal Main Body */}
        {activeTab === 'library_browse' ? (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Filter Controls Row */}
            <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/60 space-y-3 shrink-0">
              {/* Grade & Track Selectors */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Grade Selectors */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-medium">پایه:</span>
                  <div className="inline-flex rounded-lg bg-slate-950 border border-slate-800 p-0.5">
                    {GRADES_LIST.map(g => (
                      <button
                        key={g.grade}
                        onClick={() => handleGradeSelect(g.grade)}
                        className={`px-3 py-1 rounded-md transition-all cursor-pointer font-medium ${
                          selectedGrade === g.grade
                            ? 'bg-amber-400 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>

                </div>

                {/* Track Selectors */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-medium">رشته:</span>
                  <div className="inline-flex rounded-lg bg-slate-950 border border-slate-800 p-0.5">
                    {(Object.keys(TRACKS_INFO) as AcademicTrackId[]).map(trackKey => (
                      <button
                        key={trackKey}
                        onClick={() => handleTrackSelect(trackKey)}
                        className={`px-3 py-1 rounded-md transition-all cursor-pointer font-medium ${
                          selectedTrack === trackKey
                            ? 'bg-amber-400 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {TRACKS_INFO[trackKey].name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Book, Chapter, and Search Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {/* Book select */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">کتاب درسی:</label>
                  <select
                    value={selectedBookId}
                    onChange={e => {
                      setSelectedBookId(e.target.value);
                      setSelectedChapterNum('all');
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="all">تمام کتاب‌های پایه {selectedGrade} {TRACKS_INFO[selectedTrack].tag}</option>
                    {availableBooks.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.bookTitle}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Chapter select */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">سرفصل کتاب:</label>
                  <select
                    disabled={selectedBookId === 'all'}
                    value={selectedChapterNum}
                    onChange={e => {
                      const val = e.target.value;
                      setSelectedChapterNum(val === 'all' ? 'all' : Number(val));
                    }}
                    className={`w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 ${
                      selectedBookId === 'all' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="all">تمام فصل‌ها</option>
                    {availableChapters.map(c => (
                      <option key={c.chapterNumber} value={c.chapterNumber}>
                        {c.chapterTitle}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search input */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">جستجوی دقیق مبحث:</label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute right-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="مثال: چرخه کربس، مشتق زنجیره‌ای، سبک عراقی..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pr-9 pl-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute left-2.5 top-2 text-slate-500 hover:text-slate-300"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Status bar & Batch action */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <div>
                  <span>تعداد مباحث قابل نمایش: </span>
                  <span className="font-bold text-white font-mono">{filteredLibraryTopics.length}</span>
                  <span className="text-slate-500 mr-2">
                    (مباحث اضافه شده به لیست شخصی شما: {personalList.length})
                  </span>
                </div>

                {filteredLibraryTopics.length > 0 && (
                  <button
                    onClick={handleAddAllFiltered}
                    className="text-amber-400 hover:text-amber-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ListPlus className="w-3.5 h-3.5" />
                    <span>افزودن تمام {filteredLibraryTopics.length} مبحث این نما به لیست شخصی</span>
                  </button>
                )}
              </div>
            </div>

            {/* Topics Scrollable List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {filteredLibraryTopics.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-slate-400 font-medium">
                    هیچ مبحثی مطابق با فیلترها و کلمه جستجو شده پیدا نشد.
                  </p>
                  <p className="text-xs text-slate-500">
                    لطفاً عبارت جستجو را تغییر دهید یا فیلتر کتاب را روی «تمام کتاب‌ها» بگذارید.
                  </p>
                </div>
              ) : (
                filteredLibraryTopics.map(({ topic, book, chapter }) => {
                  const isInList = personalList.some(item => item.topicId === topic.id);

                  return (
                    <div
                      key={`${book.id}_${chapter.chapterNumber}_${topic.id}`}
                      className={`p-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isInList
                          ? 'bg-amber-400/[0.04] border-amber-400/30'
                          : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1.5 flex-1">
                        {/* Unboxed Metadata Header */}
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                          <span className="font-semibold text-amber-300">{book.bookTitle}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-300">{chapter.chapterTitle}</span>
                          <span aria-hidden="true">·</span>
                          <span className={`font-medium ${
                            topic.importance === 'critical' ? 'text-rose-400' :
                            topic.importance === 'very_high' ? 'text-amber-400' :
                            'text-cyan-400'
                          }`}>
                            اهمیت: {
                              topic.importance === 'critical' ? 'حیاتی (تضمین کنکور)' :
                              topic.importance === 'very_high' ? 'بسیار بالا' :
                              topic.importance === 'high' ? 'بالا' : 'متوسط'
                            }
                          </span>
                        </div>

                        {/* Topic Name */}
                        <h4 className="text-sm font-bold text-white leading-snug">
                          {topic.topicName}
                        </h4>

                        {/* Cognitive Method */}
                        <p className="text-xs text-slate-400 font-light flex items-center gap-1.5">
                          <span className="text-amber-400/80 font-medium">روش مطالعه و بازیابی:</span>
                          <span>{topic.recommendedMethod}</span>
                        </p>
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleToggleTopic(topic, book, chapter)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isInList
                              ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/10'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
                          }`}
                        >
                          {isInList ? (
                            <>
                              <BookmarkCheck className="w-4 h-4" />
                              <span>در لیست شخصی شما</span>
                            </>
                          ) : (
                            <>
                              <BookmarkPlus className="w-4 h-4 text-amber-400" />
                              <span>افزودن به لیست شخصی</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          /* Tab 2: My Personal Study List */
          <div className="flex-1 flex flex-col min-h-0">
            {/* My List Header Filter */}
            <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">فیلتر بر اساس درس:</span>
                <select
                  value={myListSubjectFilter}
                  onChange={e => setMyListSubjectFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="all">همه دروس ({personalList.length} مبحث)</option>
                  {personalSubjects.map(sub => (
                    <option key={sub} value={sub}>
                      {sub} ({personalList.filter(i => i.subject === sub).length} مبحث)
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
                  <span>انتقال به صف مرور ابینگهاوس</span>
                </button>
              </div>
            </div>

            {/* My List Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {filteredMyList.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                    <BookmarkPlus className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-slate-400 font-medium">
                    لیست مطالعه شخصی شما در حال حاضر خالی است.
                  </p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    از تب «فهرست کتاب‌ها و مباحث»، مباحثی را که قصد مطالعه و مرور آنها را دارید انتخاب کنید تا در برنامه‌ریزی ابینگهاوس و مشاور هوشمند فیلتر شوند.
                  </p>
                  <button
                    onClick={() => setActiveTab('library_browse')}
                    className="mt-2 px-4 py-2 bg-amber-400 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-300 transition-colors cursor-pointer"
                  >
                    انتخاب مباحث از کتابخانه کتب درسی
                  </button>
                </div>
              ) : (
                filteredMyList.map(item => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1.5 flex-1">
                      {/* Unboxed Metadata */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                        <span className="font-semibold text-amber-300">{item.bookTitle}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-300">{item.chapterTitle}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-400 font-medium">
                          {item.status === 'scheduled_ebbinghaus' ? 'در صف ابینگهاوس' :
                           item.status === 'in_progress' ? 'در حال مطالعه' :
                           item.status === 'mastered' ? 'تثبیت‌شده' : 'برنامه‌ریزی اولیه'}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white leading-snug">
                        {item.topicName}
                      </h4>

                      <p className="text-xs text-slate-400 font-light flex items-center gap-1.5">
                        <span className="text-amber-400/80 font-medium">متد یادگیری:</span>
                        <span>{item.recommendedMethod}</span>
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {onLaunchFocus && (
                        <button
                          onClick={() => {
                            onClose();
                            onLaunchFocus(item.topicName, item.recommendedMethod);
                          }}
                          title="شروع جلسه تمرکز عمیق"
                          className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors cursor-pointer"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handleRemoveFromList(item.id, item.topicName)}
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

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>مباحث انتخاب‌شده به طور خودکار در ابزارهای برنامه‌ریزی ابینگهاوس و مشاور قابل فیلتر شدن هستند.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              بستن پنجره
            </button>
          </div>
        </div>

        {/* Transient Toast Notification */}
        {toastMessage && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-amber-400/50 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
