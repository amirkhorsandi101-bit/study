/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * StudyPlanner: Comprehensive Academic & Konkur Study Planner
 * Deeply integrated with official Iranian High School Syllabi via StudyPlanData.ts
 * Supports Grade 10, 11, and 12 across Experimental, Mathematics, and Humanities tracks
 * with real-time filtering for Specialized vs. General subjects, AND dedicated
 * Weekly (هفتگی - ۷ روزه) vs. Bi-Weekly (دو هفتگی ویژه آزمون‌های آزمایشی - ۱۴ روزه) planning cycles.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  ListTodo,
  CheckSquare,
  Square,
  Sparkles,
  Plus,
  Trash2,
  Filter,
  Search,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Flame,
  Zap,
  BarChart3,
  Target,
  RotateCcw,
  FileText,
  Layers,
  BookmarkCheck,
  Check,
  X,
  Play,
  Share2,
  Compass,
  CheckCheck,
  Copy,
  ArrowRightLeft,
  CalendarDays,
  TrendingUp,
  Award,
  AlertCircle,
  GripVertical,
  Move,
  FileDown
} from 'lucide-react';
import {
  GradeLevel,
  AcademicTrackId
} from '../data/SubjectLibrary';
import {
  StudyPlanSubject,
  StudyPlanChapter,
  StudyPlanTopic,
  SubjectFilterType,
  ACADEMIC_TRACKS_CONFIG,
  GRADE_LEVELS_CONFIG,
  getStudyPlanHierarchy,
  getStudyPlanSubjects,
  getSpecializedSubjects,
  getGeneralSubjects,
  searchStudyPlanTopics,
  findStudyPlanTopic
} from '../data/StudyPlanData';
import { syncPersonalTopicsToEbbinghaus, addMultipleTopicsToPersonalList } from '../data/personalStudyList';
import { PlannerPdfModal } from './PlannerPdfModal';

// Planning Horizon Cycle Mode
export type PlanCycleMode = 'weekly' | 'biweekly';

// Days of the week in Persian calendar order
export type WeekdayId = 'saturday' | 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export interface WeekdayInfo {
  id: WeekdayId;
  label: string;
  shortLabel: string;
  dayNumberW1: number; // Day 1 to 7
  dayNumberW2: number; // Day 8 to 14
}

export const WEEKDAYS: WeekdayInfo[] = [
  { id: 'saturday', label: 'شنبه', shortLabel: 'ش', dayNumberW1: 1, dayNumberW2: 8 },
  { id: 'sunday', label: 'یک‌شنبه', shortLabel: 'ی', dayNumberW1: 2, dayNumberW2: 9 },
  { id: 'monday', label: 'دوشنبه', shortLabel: 'د', dayNumberW1: 3, dayNumberW2: 10 },
  { id: 'tuesday', label: 'سه‌شنبه', shortLabel: 'س', dayNumberW1: 4, dayNumberW2: 11 },
  { id: 'wednesday', label: 'چهارشنبه', shortLabel: 'چ', dayNumberW1: 5, dayNumberW2: 12 },
  { id: 'thursday', label: 'پنج‌شنبه', shortLabel: 'پ', dayNumberW1: 6, dayNumberW2: 13 },
  { id: 'friday', label: 'جمعه', shortLabel: 'ج', dayNumberW1: 7, dayNumberW2: 14 }
];

export type TimeSlotId = 'morning' | 'afternoon' | 'evening' | 'night';

export interface TimeSlotInfo {
  id: TimeSlotId;
  label: string;
  timeRange: string;
}

export const TIME_SLOTS: TimeSlotInfo[] = [
  { id: 'morning', label: 'باکس صبحگاهی', timeRange: '۰۸:۰۰ - ۱۲:۰۰' },
  { id: 'afternoon', label: 'باکس بعدازظهر', timeRange: '۱۴:۰۰ - ۱۷:۰۰' },
  { id: 'evening', label: 'باکس عصرگاهی', timeRange: '۱۷:۳۰ - ۲۰:۰۰' },
  { id: 'night', label: 'باکس شبانه و جمع‌بندی', timeRange: '۲۰:۳۰ - ۲۳:۰۰' }
];

export type StudyMode = 
  | 'concept_learning'    // مطالعه مفهومی و درسنامه
  | 'practice_tests'      // تست آموزشی و تثبیتی
  | 'timed_test'          // تست زمان‌دار سنجشی
  | 'ebbinghaus_review'   // مرور فواصل ابینگهاوس
  | 'summary_notes'       // خلاصه‌نویسی و رسم درخت دانش
  | 'school_homework';    // تمرین کتاب و تکالیف

export const STUDY_MODES: { id: StudyMode; label: string; color: string }[] = [
  { id: 'concept_learning', label: 'یادگیری مفهومی و درسنامه', color: 'amber' },
  { id: 'practice_tests', label: 'تست‌زنی آموزشی و مهارتی', color: 'cyan' },
  { id: 'timed_test', label: 'تست زمان‌دار و آزمونک', color: 'rose' },
  { id: 'ebbinghaus_review', label: 'مرور فواصل ابینگهاوس', color: 'emerald' },
  { id: 'summary_notes', label: 'خلاصه‌نویسی و فلش‌کارت', color: 'purple' },
  { id: 'school_homework', label: 'حل تمرین تشریحی کتاب', color: 'blue' }
];

export interface ScheduledPlanItem {
  id: string;
  weekNumber?: 1 | 2; // 1 for Week 1 (or weekly mode), 2 for Week 2
  day: WeekdayId;
  slot: TimeSlotId;
  bookId: string;
  bookTitle: string;
  subjectCategory: string;
  chapterTitle: string;
  topicId: string;
  topicName: string;
  isSpecialized: boolean;
  durationMinutes: number;
  targetTestCount: number;
  completedTestCount?: number;
  studyMode: StudyMode;
  status: 'pending' | 'in_progress' | 'completed';
  notes?: string;
  createdAt: number;
}

export interface TopicMasteryState {
  stageReadBook: boolean;       // 1. مطالعه متن کتاب و درسنامه
  stagePracticeTests: boolean;  // 2. حل تست آموزشی اولیه
  stageSpacedReview: boolean;   // 3. مرور در فواصل ابینگهاوس
  stageMastered: boolean;       // 4. تسلط کامل کنکوری و امتحان
  testCount: number;
  lastStudiedDate?: string;
}

const STORAGE_KEY_PLANNER = 'rahbord_study_planner_v1';
const STORAGE_KEY_MASTERY = 'rahbord_topic_mastery_v1';
const STORAGE_KEY_CYCLE_MODE = 'rahbord_planner_cycle_mode';

export const StudyPlanner: React.FC<{ id?: string }> = ({ id = 'study-planner' }) => {
  // Planning Cycle Horizon: Weekly (1 week) vs. Bi-Weekly (2 weeks for test trials like Kanoon/Maze/Gaj)
  const [planCycleMode, setPlanCycleMode] = useState<PlanCycleMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CYCLE_MODE);
      if (saved === 'weekly' || saved === 'biweekly') return saved;
    } catch (e) {}
    return 'biweekly'; // Default to 2-week cycle as it matches standard Iranian test horizons
  });

  // Active Week in Bi-Weekly cycle (1: Week 1, 2: Week 2)
  const [activeWeek, setActiveWeek] = useState<1 | 2>(1);

  // Bi-Weekly View mode: Single week drilldown vs 14-day overview
  const [biweeklyViewMode, setBiweeklyViewMode] = useState<'active_week' | 'overview_14days'>('active_week');

  // Selected Profile state: Grade & Academic Track
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(() => {
    try {
      const saved = localStorage.getItem('rahbord_planner_grade');
      if (saved && (saved === '10' || saved === '11' || saved === '12')) return Number(saved) as GradeLevel;
    } catch (e) {}
    return 12;
  });

  const [selectedTrack, setSelectedTrack] = useState<AcademicTrackId>(() => {
    try {
      const saved = localStorage.getItem('rahbord_planner_track');
      if (saved && (saved === 'experimental' || saved === 'mathematics' || saved === 'humanities')) return saved as AcademicTrackId;
    } catch (e) {}
    return 'experimental';
  });

  // Hierarchical Subject Filter: All vs. Specialized only vs. General only
  const [subjectFilterType, setSubjectFilterType] = useState<SubjectFilterType>('all');

  // Active Main View: Timetable vs Mastery Checklist vs Study Analytics
  const [activeTab, setActiveTab] = useState<'schedule' | 'checklist' | 'analytics'>('schedule');

  // Active day in daily focus view
  const [activeDay, setActiveDay] = useState<WeekdayId>('saturday');

  // Schedule Items
  const [scheduleItems, setScheduleItems] = useState<ScheduledPlanItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PLANNER);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Normalize items to ensure weekNumber is present (defaulting to 1)
          return parsed.map((it: ScheduledPlanItem) => ({
            ...it,
            weekNumber: it.weekNumber === 2 ? 2 : 1
          }));
        }
      }
    } catch (e) {}
    return [];
  });

  // Topic Mastery Matrix: topicId -> TopicMasteryState
  const [masteryMatrix, setMasteryMatrix] = useState<Record<string, TopicMasteryState>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_MASTERY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {}
    return {};
  });

  // Goal settings: Adapt default target based on cycle mode
  const [targetWeeklyHours, setTargetWeeklyHours] = useState<number>(45);
  const [targetWeeklyTests, setTargetWeeklyTests] = useState<number>(500);

  // Modal for adding a new syllabus slot
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedSlotForAdd, setSelectedSlotForAdd] = useState<{ day: WeekdayId; slot: TimeSlotId; week: 1 | 2 }>({
    day: 'saturday',
    slot: 'morning',
    week: 1
  });

  // Add Item Form State
  const [formWeekNumber, setFormWeekNumber] = useState<1 | 2>(1);
  const [formSelectedBookId, setFormSelectedBookId] = useState<string>('');
  const [formSelectedTopicId, setFormSelectedTopicId] = useState<string>('');
  const [formDuration, setFormDuration] = useState<number>(90);
  const [formTestCount, setFormTestCount] = useState<number>(30);
  const [formStudyMode, setFormStudyMode] = useState<StudyMode>('concept_learning');
  const [formNotes, setFormNotes] = useState<string>('');

  // Checklist search & book filter
  const [checklistSearch, setChecklistSearch] = useState<string>('');
  const [checklistBookFilter, setChecklistBookFilter] = useState<string>('all');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Drag and Drop State for moving topics across days and time slots
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverDay, setDragOverDay] = useState<WeekdayId | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<TimeSlotId | null>(null);
  const [dragOverWeek, setDragOverWeek] = useState<1 | 2 | null>(null);

  // PDF Export Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  // Persist Cycle Mode
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CYCLE_MODE, planCycleMode);
    } catch (e) {}
  }, [planCycleMode]);

  // Persist Profile
  useEffect(() => {
    try {
      localStorage.setItem('rahbord_planner_grade', String(selectedGrade));
      localStorage.setItem('rahbord_planner_track', selectedTrack);
    } catch (e) {}
  }, [selectedGrade, selectedTrack]);

  // Persist Schedule Items
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PLANNER, JSON.stringify(scheduleItems));
    } catch (e) {}
  }, [scheduleItems]);

  // Persist Mastery Matrix
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MASTERY, JSON.stringify(masteryMatrix));
    } catch (e) {}
  }, [masteryMatrix]);

  // Query hierarchical curriculum data from StudyPlanData.ts
  const hierarchyData = useMemo(() => {
    return getStudyPlanHierarchy(selectedGrade, selectedTrack, subjectFilterType);
  }, [selectedGrade, selectedTrack, subjectFilterType]);

  // Available subjects matching the current filters
  const availableBooks: StudyPlanSubject[] = hierarchyData.subjects;

  // Set default book in add modal when availableBooks change
  useEffect(() => {
    if (availableBooks.length > 0 && (!formSelectedBookId || !availableBooks.some(b => b.id === formSelectedBookId))) {
      setFormSelectedBookId(availableBooks[0].id);
    }
  }, [availableBooks, formSelectedBookId]);

  // Selected book object for add form
  const selectedFormBook = useMemo(() => {
    return availableBooks.find(b => b.id === formSelectedBookId) || availableBooks[0];
  }, [availableBooks, formSelectedBookId]);

  // Topics of selected form book
  const selectedFormTopics = useMemo(() => {
    if (!selectedFormBook) return [];
    const list: { chapter: StudyPlanChapter; topic: StudyPlanTopic }[] = [];
    selectedFormBook.chapters.forEach(ch => {
      ch.topics.forEach(tp => {
        list.push({ chapter: ch, topic: tp });
      });
    });
    return list;
  }, [selectedFormBook]);

  // Update default selected topic when book changes
  useEffect(() => {
    if (selectedFormTopics.length > 0) {
      setFormSelectedTopicId(selectedFormTopics[0].topic.id);
    }
  }, [selectedFormTopics]);

  // All topics in the current filtered hierarchy
  const allCurriculumTopics = useMemo(() => {
    const list: { book: StudyPlanSubject; chapter: StudyPlanChapter; topic: StudyPlanTopic }[] = [];
    availableBooks.forEach(b => {
      b.chapters.forEach(ch => {
        ch.topics.forEach(tp => {
          list.push({ book: b, chapter: ch, topic: tp });
        });
      });
    });
    return list;
  }, [availableBooks]);

  // Mastery statistics
  const masteryStats = useMemo(() => {
    const total = allCurriculumTopics.length;
    if (total === 0) return { total: 0, read: 0, practice: 0, spaced: 0, mastered: 0, percent: 0 };

    let read = 0;
    let practice = 0;
    let spaced = 0;
    let mastered = 0;

    allCurriculumTopics.forEach(item => {
      const state = masteryMatrix[item.topic.id];
      if (state) {
        if (state.stageReadBook) read++;
        if (state.stagePracticeTests) practice++;
        if (state.stageSpacedReview) spaced++;
        if (state.stageMastered) mastered++;
      }
    });

    const percent = Math.round((mastered / total) * 100);
    return { total, read, practice, spaced, mastered, percent };
  }, [allCurriculumTopics, masteryMatrix]);

  // Filtered items based on cycle mode & active week
  const visibleScheduleItems = useMemo(() => {
    if (planCycleMode === 'weekly') {
      return scheduleItems.filter(i => (i.weekNumber || 1) === 1);
    }
    // biweekly: if looking at active week, filter by activeWeek
    return scheduleItems.filter(i => (i.weekNumber || 1) === activeWeek);
  }, [scheduleItems, planCycleMode, activeWeek]);

  // Comprehensive Analytics for Weekly / Bi-Weekly
  const cycleAnalytics = useMemo(() => {
    const getWeekStats = (wNum: 1 | 2) => {
      const items = scheduleItems.filter(i => (i.weekNumber || 1) === wNum);
      let totalMins = 0;
      let completedMins = 0;
      let targetTests = 0;
      let completedTests = 0;
      let specializedMins = 0;
      let generalMins = 0;
      let conceptMins = 0;
      let testMins = 0;
      let reviewMins = 0;

      items.forEach(it => {
        totalMins += it.durationMinutes;
        targetTests += it.targetTestCount;
        if (it.isSpecialized) specializedMins += it.durationMinutes;
        else generalMins += it.durationMinutes;

        if (it.studyMode === 'concept_learning' || it.studyMode === 'school_homework') conceptMins += it.durationMinutes;
        else if (it.studyMode === 'practice_tests' || it.studyMode === 'timed_test') testMins += it.durationMinutes;
        else reviewMins += it.durationMinutes;

        if (it.status === 'completed') {
          completedMins += it.durationMinutes;
          completedTests += (it.completedTestCount !== undefined ? it.completedTestCount : it.targetTestCount);
        }
      });

      return {
        itemCount: items.length,
        totalHours: (totalMins / 60).toFixed(1),
        completedHours: (completedMins / 60).toFixed(1),
        totalMinutes: totalMins,
        completedMinutes: completedMins,
        targetTests,
        completedTests,
        specializedHours: (specializedMins / 60).toFixed(1),
        generalHours: (generalMins / 60).toFixed(1),
        conceptHours: (conceptMins / 60).toFixed(1),
        testHours: (testMins / 60).toFixed(1),
        reviewHours: (reviewMins / 60).toFixed(1),
        completionRate: totalMins > 0 ? Math.round((completedMins / totalMins) * 100) : 0
      };
    };

    const week1 = getWeekStats(1);
    const week2 = getWeekStats(2);

    // Total cycle stats
    const totalCycleMinutes = planCycleMode === 'weekly' ? week1.totalMinutes : (week1.totalMinutes + week2.totalMinutes);
    const completedCycleMinutes = planCycleMode === 'weekly' ? week1.completedMinutes : (week1.completedMinutes + week2.completedMinutes);
    const targetCycleTests = planCycleMode === 'weekly' ? week1.targetTests : (week1.targetTests + week2.targetTests);
    const completedCycleTests = planCycleMode === 'weekly' ? week1.completedTests : (week1.completedTests + week2.completedTests);
    const totalCycleItems = planCycleMode === 'weekly' ? week1.itemCount : (week1.itemCount + week2.itemCount);

    // Subject breakdown across cycle
    const subjectMinutesMap: Record<string, number> = {};
    const relevantItems = planCycleMode === 'weekly' 
      ? scheduleItems.filter(i => (i.weekNumber || 1) === 1)
      : scheduleItems;

    relevantItems.forEach(i => {
      subjectMinutesMap[i.subjectCategory] = (subjectMinutesMap[i.subjectCategory] || 0) + i.durationMinutes;
    });

    return {
      week1,
      week2,
      totalCycleHours: (totalCycleMinutes / 60).toFixed(1),
      completedCycleHours: (completedCycleMinutes / 60).toFixed(1),
      targetCycleTests,
      completedCycleTests,
      totalCycleItems,
      cycleCompletionRate: totalCycleMinutes > 0 ? Math.round((completedCycleMinutes / totalCycleMinutes) * 100) : 0,
      subjectBreakdown: Object.entries(subjectMinutesMap).map(([sub, mins]) => ({
        subject: sub,
        hours: (mins / 60).toFixed(1),
        percent: totalCycleMinutes > 0 ? Math.round((mins / totalCycleMinutes) * 100) : 0
      }))
    };
  }, [scheduleItems, planCycleMode]);

  // Handle adding a scheduled item
  const handleSaveScheduleItem = () => {
    if (!formSelectedBookId || !formSelectedTopicId) {
      showToast('لطفاً یک کتاب و مبحث درسی انتخاب کنید.');
      return;
    }

    const book = availableBooks.find(b => b.id === formSelectedBookId);
    let foundTopic: StudyPlanTopic | undefined;
    let foundChapter: StudyPlanChapter | undefined;

    if (book) {
      for (const ch of book.chapters) {
        const tp = ch.topics.find(t => t.id === formSelectedTopicId);
        if (tp) {
          foundTopic = tp;
          foundChapter = ch;
          break;
        }
      }
    }

    if (!book || !foundTopic || !foundChapter) {
      showToast('مبحث انتخاب شده در کتابخانه یافت نشد.');
      return;
    }

    const targetWeekNumber = planCycleMode === 'weekly' ? 1 : formWeekNumber;

    const newItem: ScheduledPlanItem = {
      id: `plan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      weekNumber: targetWeekNumber,
      day: selectedSlotForAdd.day,
      slot: selectedSlotForAdd.slot,
      bookId: book.id,
      bookTitle: book.title,
      subjectCategory: book.category,
      chapterTitle: foundChapter.chapterTitle,
      topicId: foundTopic.id,
      topicName: foundTopic.topicName,
      isSpecialized: book.isSpecialized,
      durationMinutes: formDuration,
      targetTestCount: formTestCount,
      studyMode: formStudyMode,
      status: 'pending',
      notes: formNotes,
      createdAt: Date.now()
    };

    setScheduleItems(prev => [...prev, newItem]);
    setIsAddModalOpen(false);
    setFormNotes('');

    const weekText = planCycleMode === 'biweekly' ? `(هفته ${targetWeekNumber === 1 ? 'اول' : 'دوم'}) ` : '';
    showToast(`مبحث «${foundTopic.topicName}» در برنامه ${weekText}${WEEKDAYS.find(w => w.id === selectedSlotForAdd.day)?.label} ثبت شد.`);
  };

  // Toggle item status
  const handleToggleItemStatus = (itemId: string) => {
    setScheduleItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const nextStatus = item.status === 'completed' ? 'pending' : item.status === 'in_progress' ? 'completed' : 'in_progress';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  // Move item between Week 1 and Week 2
  const handleToggleItemWeek = (itemId: string) => {
    setScheduleItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const newWeek: 1 | 2 = (item.weekNumber || 1) === 1 ? 2 : 1;
          showToast(`پارت «${item.topicName}» به هفته ${newWeek === 1 ? 'اول' : 'دوم'} منتقل شد.`);
          return { ...item, weekNumber: newWeek };
        }
        return item;
      })
    );
  };

  // Duplicate item to the opposite week
  const handleDuplicateItemToOtherWeek = (item: ScheduledPlanItem) => {
    const targetWeek: 1 | 2 = (item.weekNumber || 1) === 1 ? 2 : 1;
    const duplicated: ScheduledPlanItem = {
      ...item,
      id: `plan_dup_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      weekNumber: targetWeek,
      studyMode: targetWeek === 2 ? 'timed_test' : 'concept_learning', // When duplicated to week 2, convert to timed test
      status: 'pending',
      createdAt: Date.now()
    };
    setScheduleItems(prev => [...prev, duplicated]);
    showToast(`مبحث «${item.topicName}» به هفته ${targetWeek === 1 ? 'اول' : 'دوم'} رونوشت شد.`);
  };

  // Delete scheduled item
  const handleDeleteScheduleItem = (itemId: string) => {
    setScheduleItems(prev => prev.filter(i => i.id !== itemId));
    showToast('آیتم مطالعاتی از برنامه حذف شد.');
  };

  // Drag and Drop Handlers for Schedule Items
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData('text/plain', itemId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItemId(itemId);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDragOverDay(null);
    setDragOverSlot(null);
    setDragOverWeek(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Drop topic onto a specific day tab or day container (auto-persists to state & localStorage)
  const handleDropOnDay = (e: React.DragEvent, targetDay: WeekdayId, targetWeek?: 1 | 2) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain') || draggedItemId;
    if (!itemId) return;

    const targetItem = scheduleItems.find(i => i.id === itemId);
    if (!targetItem) return;

    const newWeek = targetWeek !== undefined ? targetWeek : (targetItem.weekNumber || 1);
    const dayLabel = WEEKDAYS.find(w => w.id === targetDay)?.label || targetDay;

    setScheduleItems(prev =>
      prev.map(it => {
        if (it.id === itemId) {
          return {
            ...it,
            day: targetDay,
            weekNumber: newWeek
          };
        }
        return it;
      })
    );

    setActiveDay(targetDay);
    if (targetWeek !== undefined) setActiveWeek(targetWeek);
    handleDragEnd();
    showToast(`مبحث «${targetItem.topicName}» با Drag & Drop به ${dayLabel} منتقل و ذخیره شد.`);
  };

  // Drop topic onto a specific time slot within a day (auto-persists to state & localStorage)
  const handleDropOnSlot = (e: React.DragEvent, targetSlot: TimeSlotId, targetDay: WeekdayId, targetWeek?: 1 | 2) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain') || draggedItemId;
    if (!itemId) return;

    const targetItem = scheduleItems.find(i => i.id === itemId);
    if (!targetItem) return;

    const newWeek = targetWeek !== undefined ? targetWeek : (targetItem.weekNumber || 1);
    const slotInfo = TIME_SLOTS.find(s => s.id === targetSlot);
    const dayLabel = WEEKDAYS.find(w => w.id === targetDay)?.label || targetDay;

    setScheduleItems(prev =>
      prev.map(it => {
        if (it.id === itemId) {
          return {
            ...it,
            day: targetDay,
            slot: targetSlot,
            weekNumber: newWeek
          };
        }
        return it;
      })
    );

    handleDragEnd();
    showToast(`مبحث «${targetItem.topicName}» به ${slotInfo?.label || targetSlot} در ${dayLabel} منتقل و ذخیره شد.`);
  };

  // Toggle single mastery stage for a topic
  const handleToggleMasteryStage = (topicId: string, stage: keyof TopicMasteryState) => {
    setMasteryMatrix(prev => {
      const current = prev[topicId] || {
        stageReadBook: false,
        stagePracticeTests: false,
        stageSpacedReview: false,
        stageMastered: false,
        testCount: 0
      };

      const nextVal = !current[stage];
      const updated: TopicMasteryState = {
        ...current,
        [stage]: nextVal,
        lastStudiedDate: new Date().toLocaleDateString('fa-IR')
      };

      // If mastered is ticked, ensure previous stages are marked
      if (stage === 'stageMastered' && nextVal) {
        updated.stageReadBook = true;
        updated.stagePracticeTests = true;
        updated.stageSpacedReview = true;
      }

      return {
        ...prev,
        [topicId]: updated
      };
    });
  };

  // GENERATOR 1: Smart 7-Day Plan (Weekly)
  const handleGenerateSmartWeeklyPlan = () => {
    if (availableBooks.length === 0 || allCurriculumTopics.length === 0) return;

    const pool = [...allCurriculumTopics];
    const newItems: ScheduledPlanItem[] = [];
    const workDays: WeekdayId[] = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday'];
    const slots: TimeSlotId[] = ['morning', 'afternoon', 'evening'];

    let poolIndex = 0;

    workDays.forEach(day => {
      slots.forEach(slot => {
        if (poolIndex < pool.length) {
          const candidate = pool[poolIndex % pool.length];
          const isHard = candidate.topic.difficulty === 'hard';

          newItems.push({
            id: `smart_w1_${Date.now()}_${day}_${slot}_${poolIndex}`,
            weekNumber: 1,
            day,
            slot,
            bookId: candidate.book.id,
            bookTitle: candidate.book.title,
            subjectCategory: candidate.book.category,
            chapterTitle: candidate.chapter.chapterTitle,
            topicId: candidate.topic.id,
            topicName: candidate.topic.topicName,
            isSpecialized: candidate.book.isSpecialized,
            durationMinutes: isHard ? 105 : 75,
            targetTestCount: isHard ? 35 : 25,
            studyMode: slot === 'morning' ? 'concept_learning' : slot === 'afternoon' ? 'practice_tests' : 'ebbinghaus_review',
            status: 'pending',
            notes: `تنظیم هوشمند StudyPlanData: متد پیشنهادی ${candidate.topic.recommendedMethod}`,
            createdAt: Date.now()
          });
          poolIndex++;
        }
      });
    });

    // Friday review & mock test slot
    newItems.push({
      id: `smart_w1_friday_${Date.now()}`,
      weekNumber: 1,
      day: 'friday',
      slot: 'morning',
      bookId: availableBooks[0].id,
      bookTitle: 'آزمون جامع هفتگی',
      subjectCategory: 'شبیه‌ساز کنکور',
      chapterTitle: 'مرور فواصل ابینگهاوس',
      topicId: 'friday_comprehensive_review',
      topicName: 'تحلیل تست‌های نشان‌دار هفته و مرور ایستگاه‌های فراموشی',
      isSpecialized: true,
      durationMinutes: 180,
      targetTestCount: 60,
      studyMode: 'timed_test',
      status: 'pending',
      notes: 'جمعه: شبیه‌سازی شرایط آزمون + رفع اشکال مباحث نشان‌دار',
      createdAt: Date.now()
    });

    setScheduleItems(newItems);
    showToast('برنامه هفتگی متوازن (۷ روزه) با سرفصل‌های رسمی بارگذاری شد!');
  };

  // GENERATOR 2: Smart 14-Day Bi-Weekly Plan (Aligned with Kanoon/Maze 2-week cycle)
  const handleGenerateSmartBiweeklyPlan = () => {
    if (availableBooks.length === 0 || allCurriculumTopics.length === 0) return;

    const pool = [...allCurriculumTopics];
    const newItems: ScheduledPlanItem[] = [];
    const workDays: WeekdayId[] = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday'];
    const slots: TimeSlotId[] = ['morning', 'afternoon', 'evening'];

    // --- WEEK 1: EDUCATION, DEEP LEARNING & INITIAL PRACTICE TESTS ---
    let poolIndex = 0;
    workDays.forEach(day => {
      slots.forEach(slot => {
        if (poolIndex < pool.length) {
          const candidate = pool[poolIndex % pool.length];
          const isHard = candidate.topic.difficulty === 'hard';

          newItems.push({
            id: `smart_bi_w1_${Date.now()}_${day}_${slot}_${poolIndex}`,
            weekNumber: 1,
            day,
            slot,
            bookId: candidate.book.id,
            bookTitle: candidate.book.title,
            subjectCategory: candidate.book.category,
            chapterTitle: candidate.chapter.chapterTitle,
            topicId: candidate.topic.id,
            topicName: candidate.topic.topicName,
            isSpecialized: candidate.book.isSpecialized,
            durationMinutes: isHard ? 105 : 90,
            targetTestCount: isHard ? 30 : 25,
            studyMode: slot === 'morning' ? 'concept_learning' : slot === 'afternoon' ? 'practice_tests' : 'summary_notes',
            status: 'pending',
            notes: 'هفته اول: یادگیری عمیق خط‌به‌خط کتاب، حل تمرین و تست‌های آموزشی زوج/فرد',
            createdAt: Date.now()
          });
          poolIndex++;
        }
      });
    });

    // Week 1 Friday: Mid-term spaced review & quiz
    newItems.push({
      id: `smart_bi_w1_friday_${Date.now()}`,
      weekNumber: 1,
      day: 'friday',
      slot: 'morning',
      bookId: availableBooks[0].id,
      bookTitle: 'سنجش و مرور نیمه‌دوره',
      subjectCategory: 'مرور هفته اول',
      chapterTitle: 'تثبیت سرفصل‌های هفته اول',
      topicId: 'w1_midterm_quiz',
      topicName: 'آزمونک جامع نیمه‌دوره + مرور فلش‌کارت‌ها و خلاصه‌نویسی‌ها',
      isSpecialized: true,
      durationMinutes: 150,
      targetTestCount: 50,
      studyMode: 'timed_test',
      status: 'pending',
      notes: 'جمعه هفته اول: ارزیابی میزان یادگیری سرفصل‌های تدریس‌شده در هفته اول',
      createdAt: Date.now()
    });

    // --- WEEK 2: MASTERY, TIMED TESTS, SPATIAL REVIEWS & MOCK EXAM ---
    // In Week 2, take the same topics learned in Week 1, and advance them into speed testing & reviews!
    let w2Index = 0;
    workDays.slice(0, 4).forEach(day => { // Saturday to Tuesday
      slots.forEach(slot => {
        if (w2Index < pool.length) {
          const candidate = pool[w2Index % pool.length];

          newItems.push({
            id: `smart_bi_w2_${Date.now()}_${day}_${slot}_${w2Index}`,
            weekNumber: 2,
            day,
            slot,
            bookId: candidate.book.id,
            bookTitle: candidate.book.title,
            subjectCategory: candidate.book.category,
            chapterTitle: candidate.chapter.chapterTitle,
            topicId: candidate.topic.id,
            topicName: candidate.topic.topicName,
            isSpecialized: candidate.book.isSpecialized,
            durationMinutes: 90,
            targetTestCount: 45, // Higher test count in Week 2
            studyMode: slot === 'morning' ? 'timed_test' : slot === 'afternoon' ? 'ebbinghaus_review' : 'timed_test',
            status: 'pending',
            notes: 'هفته دوم: تست زمان‌دار سنجشی، تست‌های پوششی کنکور سراسری و ارتقای سرعت',
            createdAt: Date.now()
          });
          w2Index++;
        }
      });
    });

    // Week 2 Wednesday & Thursday: Pre-Exam Leaf-through & Quick Review
    newItems.push({
      id: `smart_bi_w2_wed_${Date.now()}`,
      weekNumber: 2,
      day: 'wednesday',
      slot: 'afternoon',
      bookId: availableBooks[0].id,
      bookTitle: 'جمع‌بندی فرمول‌ها و نکات',
      subjectCategory: 'آمادگی آزمون',
      chapterTitle: 'مرور کلیه مباحث آزمون آزمایشی',
      topicId: 'w2_summary_sheet_review',
      topicName: 'مرور نمودارهای درختی، جعبه ابزار و نکات نشان‌دار آزمون‌های گذشته',
      isSpecialized: true,
      durationMinutes: 120,
      targetTestCount: 40,
      studyMode: 'ebbinghaus_review',
      status: 'pending',
      notes: 'چهارشنبه هفته دوم: جمع‌بندی نهایی سرفصل‌های بودجه‌بندی آزمون',
      createdAt: Date.now()
    });

    newItems.push({
      id: `smart_bi_w2_thu_${Date.now()}`,
      weekNumber: 2,
      day: 'thursday',
      slot: 'morning',
      bookId: availableBooks[0].id,
      bookTitle: 'تورق سریع قبل از آزمون',
      subjectCategory: 'شب آزمون',
      chapterTitle: 'تورق سریع متن کتب درسی',
      topicId: 'w2_quick_leafthrough',
      topicName: 'تورق سریع صفحات کتاب‌های تخصصی و عمومی + حفظیات و فرمول‌ها',
      isSpecialized: true,
      durationMinutes: 180,
      targetTestCount: 30,
      studyMode: 'ebbinghaus_review',
      status: 'pending',
      notes: 'پنج‌شنبه شب آزمون: تورق سریع بدون اتلاف وقت و تثبیت حافظه کوتاه‌مدت',
      createdAt: Date.now()
    });

    // Week 2 Friday: Official Mock Exam & Deep Test Analysis
    newItems.push({
      id: `smart_bi_w2_fri_exam_${Date.now()}`,
      weekNumber: 2,
      day: 'friday',
      slot: 'morning',
      bookId: availableBooks[0].id,
      bookTitle: 'آزمون آزمایشی اصلی',
      subjectCategory: 'شبیه‌ساز رسمی کنکور',
      chapterTitle: 'آزمون قلم‌چی / ماز / گزینه‌دو',
      topicId: 'w2_official_trial_exam',
      topicName: 'شرکت در آزمون آزمایشی رسمی با شرایط کنکور (ساعت ۸:۰۰ الی ۱۲:۳۰)',
      isSpecialized: true,
      durationMinutes: 240,
      targetTestCount: 150,
      studyMode: 'timed_test',
      status: 'pending',
      notes: 'جمعه هفته دوم: شبیه‌سازی دقیق دفترچه اختصاصی و عمومی و تمرین مدیریت زمان',
      createdAt: Date.now()
    });

    newItems.push({
      id: `smart_bi_w2_fri_analysis_${Date.now()}`,
      weekNumber: 2,
      day: 'friday',
      slot: 'afternoon',
      bookId: availableBooks[0].id,
      bookTitle: 'تحلیل جامع کارنامه آزمون',
      subjectCategory: 'تحلیل آزمون',
      chapterTitle: 'دفترچه پاسخ تشریحی',
      topicId: 'w2_exam_thorough_analysis',
      topicName: 'تحلیل تست‌های غلط، نزده و شک‌دار + یادداشت دام‌های تستی در کتاب خودآموز',
      isSpecialized: true,
      durationMinutes: 180,
      targetTestCount: 0,
      studyMode: 'summary_notes',
      status: 'pending',
      notes: 'عصر جمعه: تحلیل آزمون مهم‌تر از خود آزمون است! ریشه‌یابی خطاهای محاسباتی و ادراکی',
      createdAt: Date.now()
    });

    setScheduleItems(newItems);
    showToast('برنامه جامع ۲ هفتگی ویژه دوره‌های آزمون‌های آزمایشی (۱۴ روزه) با موفقیت بارگذاری شد!');
  };

  // ACTION: Copy Week 1 items to Week 2 with conversion to timed testing and review
  const handleCopyWeek1ToWeek2 = () => {
    const week1Items = scheduleItems.filter(i => (i.weekNumber || 1) === 1);
    if (week1Items.length === 0) {
      showToast('هنوز هیچ پارت مطالعاتی در هفته اول تعریف نشده است.');
      return;
    }

    const copiedItems: ScheduledPlanItem[] = week1Items.map((item, idx) => ({
      ...item,
      id: `copied_w2_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
      weekNumber: 2,
      studyMode: item.studyMode === 'concept_learning' ? 'timed_test' : 'ebbinghaus_review',
      targetTestCount: Math.round(item.targetTestCount * 1.3), // 30% more tests in week 2
      status: 'pending',
      notes: `انتقال هوشمند به هفته دوم (مرور و تست سنجشی مبحث ${item.topicName})`,
      createdAt: Date.now()
    }));

    // Remove existing week 2 items or append? Let's keep others or replace
    const otherItems = scheduleItems.filter(i => (i.weekNumber || 1) !== 2);
    setScheduleItems([...otherItems, ...copiedItems]);
    setActiveWeek(2);
    showToast(`${copiedItems.length} پارت از هفته اول کپی شد و با متد تست زمان‌دار در هفته دوم قرار گرفت.`);
  };

  // Sync scheduled topics directly to Ebbinghaus Spaced Repetition queue
  const handleSyncAllToEbbinghaus = () => {
    const relevant = visibleScheduleItems.filter(i => !i.topicId.startsWith('w1_') && !i.topicId.startsWith('w2_') && i.topicId !== 'friday_comprehensive_review');
    const topicIds = Array.from(new Set(relevant.map(i => i.topicId)));

    if (topicIds.length === 0) {
      showToast('هنوز مبحث درسی در جدول برنامه این هفته ثبت نشده است.');
      return;
    }

    const payload = relevant.map(item => {
      const book = availableBooks.find(b => b.id === item.bookId) || availableBooks[0];
      const chapter = book?.chapters.find(c => c.chapterTitle === item.chapterTitle) || book?.chapters[0];
      return {
        topic: {
          id: item.topicId,
          topicName: item.topicName,
          recommendedMethod: 'مرور فعال بر اساس جدول پلنر',
          difficulty: 'medium' as const,
          importance: 'high' as const
        },
        book: {
          id: book.id,
          bookTitle: book.title,
          subjectCategory: book.category,
          grade: book.grade,
          tracks: book.tracks,
          isSpecialized: book.isSpecialized,
          chapters: book.chapters
        },
        chapter: {
          chapterNumber: chapter.chapterNumber,
          chapterTitle: chapter.chapterTitle,
          topics: chapter.topics
        }
      };
    });

    addMultipleTopicsToPersonalList(payload);
    const res = syncPersonalTopicsToEbbinghaus(topicIds);
    showToast(`${res.addedCount} مبحث از پلنر به صف مرور زمان‌بندی‌شده ابینگهاوس منتقل شد.`);
  };

  // Clear plan
  const handleClearPlan = () => {
    const confirmText = planCycleMode === 'biweekly'
      ? 'آیا از پاک‌سازی کل برنامه دوره ۲ هفتگی اطمینان دارید؟'
      : 'آیا از پاک‌سازی برنامه هفتگی اطمینان دارید؟';
    if (window.confirm(confirmText)) {
      setScheduleItems([]);
      showToast('برنامه مطالعاتی بازنشانی و پاک‌سازی شد.');
    }
  };

  const trackInfo = ACADEMIC_TRACKS_CONFIG[selectedTrack];

  return (
    <section id={id} className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-8" dir="rtl">
      {/* --- SECTION HEADER WITH HIERARCHICAL GRADE & TRACK SELECTOR --- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-xs text-amber-400 font-semibold">
              <span className="p-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20">
                <Compass className="w-4 h-4 text-amber-400" />
              </span>
              <span>سلسله‌مراتب داده‌های درسی (StudyPlanData)</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">رشته ← پایه ← درس ← فصل ← مبحث</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex flex-wrap items-center gap-3">
              <span>پلنر تحصیلی و مدیریت زمان سرفصل‌ها</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-normal">
                {planCycleMode === 'biweekly' ? 'چرخه ۲ هفتگی آزمون‌های آزمایشی' : 'برنامه هفتگی ۱ دوره'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              برنامه‌ریزی دقیق با سرفصل‌های رسمی هر ۳ رشته تجربی، ریاضی و انسانی با امکان تنظیم افق زمانی **هفتگی (۷ روزه)** یا **دو هفتگی (۱۴ روزه ویژه آزمون‌های قلم‌چی، ماز و گزینه‌دو)**.
            </p>
          </div>

          {/* Quick Profile Controls: Cycle Mode + Grade & Track Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 shrink-0">
            {/* Cycle Horizon Switcher: Weekly vs. Bi-Weekly */}
            <div className="space-y-1">
              <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5" />
                <span>افق دوره برنامه‌ریزی:</span>
              </span>
              <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800">
                <button
                  onClick={() => setPlanCycleMode('weekly')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    planCycleMode === 'weekly'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="برنامه‌ریزی یک هفته‌ای (۷ روز)"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>هفتگی (۷ روز)</span>
                </button>
                <button
                  onClick={() => setPlanCycleMode('biweekly')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    planCycleMode === 'biweekly'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="برنامه‌ریزی دو هفته‌ای منطبق بر آزمون‌های آزمایشی قلم‌چی، ماز، گاج (۱۴ روز)"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>دو هفتگی (ویژه آزمون)</span>
                </button>
              </div>
            </div>

            {/* Grade Switcher */}
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 font-medium block">پایه تحصیلی:</span>
              <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800">
                {GRADE_LEVELS_CONFIG.map(g => (
                  <button
                    key={g.grade}
                    onClick={() => {
                      setSelectedGrade(g.grade);
                      setChecklistBookFilter('all');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedGrade === g.grade
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Track Switcher */}
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 font-medium block">رشته تحصیلی:</span>
              <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800">
                {(['experimental', 'mathematics', 'humanities'] as AcademicTrackId[]).map(t => {
                  const conf = ACADEMIC_TRACKS_CONFIG[t];
                  const isSelected = selectedTrack === t;
                  return (
                    <button
                      key={t}
                      onClick={() => {
                        setSelectedTrack(t);
                        setChecklistBookFilter('all');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {conf.shortName}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Specialized vs General Subjects Filter Chips Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5 ml-1">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span>فیلتر سرفصل‌های StudyPlanData:</span>
            </span>

            <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
              <button
                onClick={() => setSubjectFilterType('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  subjectFilterType === 'all'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>همه دروس ({hierarchyData.counts.totalSubjects})</span>
              </button>

              <button
                onClick={() => setSubjectFilterType('specialized')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  subjectFilterType === 'specialized'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>صرفاً دروس اختصاصی {trackInfo.shortName} ({hierarchyData.counts.specializedSubjects})</span>
              </button>

              <button
                onClick={() => setSubjectFilterType('general')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  subjectFilterType === 'general'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>دروس عمومی مشترک ({hierarchyData.counts.generalSubjects})</span>
              </button>
            </div>
          </div>

          {/* Active Hierarchy Breadcrumb */}
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="font-semibold text-white">پایه {selectedGrade}</span>
            <span aria-hidden="true">·</span>
            <span className={`font-semibold ${trackInfo.badgeText}`}>{trackInfo.name}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-amber-300 font-bold">{hierarchyData.counts.totalTopics} مبحث رسمی</span>
          </div>
        </div>

        {/* Global Curriculum Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
            <span className="text-slate-400 block text-[11px]">کتب فیلترشده در این بخش:</span>
            <div className="text-base font-bold text-white font-mono mt-0.5">
              {availableBooks.length} <span className="text-xs font-normal text-slate-400">کتاب درسی</span>
            </div>
          </div>

          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
            <span className="text-slate-400 block text-[11px]">تعداد کل سرفصل‌ها و گفتارها:</span>
            <div className="text-base font-bold text-amber-300 font-mono mt-0.5">
              {allCurriculumTopics.length} <span className="text-xs font-normal text-slate-400">مبحث تدوین‌شده</span>
            </div>
          </div>

          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
            <span className="text-slate-400 block text-[11px]">تسلط کامل کنکوری:</span>
            <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
              {masteryStats.mastered} از {masteryStats.total} <span className="text-xs font-normal text-slate-400">({masteryStats.percent}٪)</span>
            </div>
          </div>

          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
            <span className="text-slate-400 block text-[11px]">
              {planCycleMode === 'biweekly' ? 'ساعت مطالعه دوره ۲ هفتگی:' : 'ساعت مطالعه برنامه این هفته:'}
            </span>
            <div className="text-base font-bold text-cyan-400 font-mono mt-0.5">
              {cycleAnalytics.completedCycleHours} از {cycleAnalytics.totalCycleHours} <span className="text-xs font-normal text-slate-400">ساعت</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- TAB SWITCHER & ACTIONS TOOLBAR --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'schedule'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-850 hover:text-white border border-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>
              {planCycleMode === 'biweekly' ? 'جدول زمان‌بندی دو هفتگی (۱۴ روز)' : 'جدول زمان‌بندی هفتگی (۷ روز)'}
            </span>
            {cycleAnalytics.totalCycleItems > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === 'schedule' ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {cycleAnalytics.totalCycleItems} پارت
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'checklist'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-850 hover:text-white border border-slate-800'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>چک‌لیست تسلط ۴ مرحله‌ای سرفصل‌ها</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              activeTab === 'checklist' ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'
            }`}>
              {masteryStats.percent}٪
            </span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-850 hover:text-white border border-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>
              {planCycleMode === 'biweekly' ? 'تحلیل مقایسه‌ای دوره ۲ هفتگی' : 'تحلیل ساعات مطالعه و تست'}
            </span>
          </button>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {planCycleMode === 'biweekly' ? (
            <button
              onClick={handleGenerateSmartBiweeklyPlan}
              className="py-2 px-3.5 bg-gradient-to-l from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-amber-400/15 cursor-pointer active:scale-95"
              title="تولید چرخه کامل ۱۴ روزه آزمون آزمایشی (هفته اول آموزش + هفته دوم تست و جمع‌بندی)"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>تولید برنامه ۲ هفتگی ویژه آزمون</span>
            </button>
          ) : (
            <button
              onClick={handleGenerateSmartWeeklyPlan}
              className="py-2 px-3.5 bg-gradient-to-l from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-amber-400/15 cursor-pointer active:scale-95"
              title="چینش خودکار سرفصل‌های StudyPlanData متناسب با پایه و رشته"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>تولید خودکار برنامه هفتگی هوشمند</span>
            </button>
          )}

          {planCycleMode === 'biweekly' && (
            <button
              onClick={handleCopyWeek1ToWeek2}
              className="py-2 px-3 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              title="کپی کردن سرفصل‌های هفته اول به هفته دوم و تبدیل خودکار به تست زمان‌دار و مرور"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>کپی هفته اول ⟵ هفته دوم</span>
            </button>
          )}

          {/* DEDICATED PDF EXPORT BUTTON FOR WEEKLY / BI-WEEKLY PLAN */}
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="py-2 px-3.5 bg-gradient-to-l from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 cursor-pointer active:scale-95"
            title="دریافت فایل PDF چاپی با کیفیت A4 از برنامه هفتگی یا دو هفتگی"
          >
            <FileDown className="w-4 h-4 text-slate-950" />
            <span>خروجی PDF برنامه ({planCycleMode === 'biweekly' ? 'دوهفتگی' : 'هفتگی'})</span>
          </button>

          {scheduleItems.length > 0 && (
            <>
              <button
                onClick={handleSyncAllToEbbinghaus}
                className="py-2 px-3 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                title="ارسال همه سرفصل‌های پلنر به تقویم مرور ابینگهاوس"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                <span>انتقال به ابینگهاوس</span>
              </button>

              <button
                onClick={handleClearPlan}
                className="py-2 px-2.5 bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 rounded-xl text-xs transition-colors cursor-pointer"
                title="پاک کردن کل جدول برنامه"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* ===================================================================
          TAB 1: TIMETABLE (WEEKLY / BI-WEEKLY)
          =================================================================== */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          {/* BI-WEEKLY CONTROLLER BAR (Visible only in Bi-Weekly Mode) */}
          {planCycleMode === 'biweekly' && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-semibold">انتخاب بازه زمانی ۲ هفتگی:</span>
                
                {/* Week 1 vs Week 2 tabs */}
                <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                  <button
                    onClick={() => {
                      setActiveWeek(1);
                      setBiweeklyViewMode('active_week');
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      biweeklyViewMode === 'active_week' && activeWeek === 1
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>هفته اول: یادگیری و آموزش (روز ۱ تا ۷)</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900/60 text-slate-300">
                      {cycleAnalytics.week1.itemCount}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveWeek(2);
                      setBiweeklyViewMode('active_week');
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      biweeklyViewMode === 'active_week' && activeWeek === 2
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>هفته دوم: تسلط، مرور و آزمون (روز ۸ تا ۱۴)</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900/60 text-slate-300">
                      {cycleAnalytics.week2.itemCount}
                    </span>
                  </button>

                  <button
                    onClick={() => setBiweeklyViewMode('overview_14days')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      biweeklyViewMode === 'overview_14days'
                        ? 'bg-cyan-400 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>نمای کلی ۱۴ روزه</span>
                  </button>
                </div>
              </div>

              {/* Informational badge about current week's purpose */}
              <div className="text-xs text-slate-400 flex items-center gap-2">
                {activeWeek === 1 ? (
                  <span className="text-amber-300/90 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span>ماموریت هفته ۱: آموزش مفهومی، خلاصه نویسی و تست‌های آموزشی اولیه</span>
                  </span>
                ) : (
                  <span className="text-cyan-300/90 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span>ماموریت هفته ۲: تست‌های زمان‌دار، تورق سریع پنج‌شنبه، و آزمون آزمایشی جمعه</span>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* VIEW A: 14-DAY OVERVIEW GRID (When user chooses overview_14days) */}
          {planCycleMode === 'biweekly' && biweeklyViewMode === 'overview_14days' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Column 1: Week 1 */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">هفته اول: آموزش و تثبیت مفاهیم</h3>
                        <p className="text-[11px] text-slate-400">روزهای ۱ تا ۷ چرخه آزمون</p>
                      </div>
                    </div>
                    <div className="text-left text-xs font-mono">
                      <span className="text-amber-400 font-bold">{cycleAnalytics.week1.completedHours}</span>
                      <span className="text-slate-400"> / {cycleAnalytics.week1.totalHours} ساعت</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {WEEKDAYS.map(w => {
                      const dayItems = scheduleItems.filter(i => (i.weekNumber || 1) === 1 && i.day === w.id);
                      const completedCount = dayItems.filter(i => i.status === 'completed').length;
                      const dayMins = dayItems.reduce((acc, i) => acc + i.durationMinutes, 0);

                      const isRowDragOver = dragOverDay === w.id && dragOverWeek === 1;

                      return (
                        <div
                          key={`w1_${w.id}`}
                          onClick={() => {
                            setActiveWeek(1);
                            setActiveDay(w.id);
                            setBiweeklyViewMode('active_week');
                          }}
                          onDragOver={(e) => {
                            handleDragOver(e);
                            setDragOverDay(w.id);
                            setDragOverWeek(1);
                          }}
                          onDragLeave={() => {
                            if (dragOverDay === w.id && dragOverWeek === 1) {
                              setDragOverDay(null);
                              setDragOverWeek(null);
                            }
                          }}
                          onDrop={(e) => handleDropOnDay(e, w.id, 1)}
                          className={`p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer group ${
                            isRowDragOver
                              ? 'bg-amber-400/20 border-amber-400 ring-2 ring-amber-400 scale-[1.02]'
                              : 'bg-slate-950/60 border-slate-800/80 hover:border-amber-400/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center text-xs font-mono font-bold text-slate-300">
                              {w.dayNumberW1}
                            </span>
                            <div>
                              <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                                {w.label}
                              </span>
                              <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                                <span>{dayItems.length} پارت</span>
                                <span>·</span>
                                <span className="font-mono">{(dayMins / 60).toFixed(1)} ساعت</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-emerald-400 font-semibold">
                              {completedCount}/{dayItems.length}
                            </span>
                            <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 group-hover:-translate-x-1 transition-all" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Column 2: Week 2 */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-cyan-400/10 text-cyan-400">
                        <Target className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">هفته دوم: تسلط، مرور و آزمون آزمایشی</h3>
                        <p className="text-[11px] text-slate-400">روزهای ۸ تا ۱۴ چرخه آزمون</p>
                      </div>
                    </div>
                    <div className="text-left text-xs font-mono">
                      <span className="text-cyan-400 font-bold">{cycleAnalytics.week2.completedHours}</span>
                      <span className="text-slate-400"> / {cycleAnalytics.week2.totalHours} ساعت</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {WEEKDAYS.map(w => {
                      const dayItems = scheduleItems.filter(i => (i.weekNumber || 1) === 2 && i.day === w.id);
                      const completedCount = dayItems.filter(i => i.status === 'completed').length;
                      const dayMins = dayItems.reduce((acc, i) => acc + i.durationMinutes, 0);
                      const isRowDragOver = dragOverDay === w.id && dragOverWeek === 2;

                      return (
                        <div
                          key={`w2_${w.id}`}
                          onClick={() => {
                            setActiveWeek(2);
                            setActiveDay(w.id);
                            setBiweeklyViewMode('active_week');
                          }}
                          onDragOver={(e) => {
                            handleDragOver(e);
                            setDragOverDay(w.id);
                            setDragOverWeek(2);
                          }}
                          onDragLeave={() => {
                            if (dragOverDay === w.id && dragOverWeek === 2) {
                              setDragOverDay(null);
                              setDragOverWeek(null);
                            }
                          }}
                          onDrop={(e) => handleDropOnDay(e, w.id, 2)}
                          className={`p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer group ${
                            isRowDragOver
                              ? 'bg-cyan-400/20 border-cyan-400 ring-2 ring-cyan-400 scale-[1.02]'
                              : 'bg-slate-950/60 border-slate-800/80 hover:border-cyan-400/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center text-xs font-mono font-bold text-slate-300">
                              {w.dayNumberW2}
                            </span>
                            <div>
                              <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                                {w.label} {w.id === 'friday' ? '(روز آزمون)' : ''}
                              </span>
                              <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                                <span>{dayItems.length} پارت</span>
                                <span>·</span>
                                <span className="font-mono">{(dayMins / 60).toFixed(1)} ساعت</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-emerald-400 font-semibold">
                              {completedCount}/{dayItems.length}
                            </span>
                            <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:-translate-x-1 transition-all" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* VIEW B: SINGLE WEEK DRILLDOWN (Default in Weekly & Bi-Weekly) */
            <>
              {/* Day selection tabs with Drag-and-Drop Drop Target */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {WEEKDAYS.map(w => {
                  const targetWeekNum = planCycleMode === 'weekly' ? 1 : activeWeek;
                  const dayItems = scheduleItems.filter(i => (i.weekNumber || 1) === targetWeekNum && i.day === w.id);
                  const isSelected = activeDay === w.id;
                  const completedCount = dayItems.filter(i => i.status === 'completed').length;
                  const dayNumber = targetWeekNum === 1 ? w.dayNumberW1 : w.dayNumberW2;
                  const isDayDragOver = dragOverDay === w.id && !dragOverSlot;

                  return (
                    <button
                      key={w.id}
                      onClick={() => setActiveDay(w.id)}
                      onDragOver={(e) => {
                        handleDragOver(e);
                        setDragOverDay(w.id);
                      }}
                      onDragLeave={() => {
                        if (dragOverDay === w.id) setDragOverDay(null);
                      }}
                      onDrop={(e) => handleDropOnDay(e, w.id, targetWeekNum)}
                      className={`flex-1 min-w-[130px] p-3 rounded-2xl border text-right transition-all cursor-pointer relative ${
                        isDayDragOver
                          ? 'bg-amber-400/25 border-amber-400 ring-2 ring-amber-400 scale-105 shadow-xl shadow-amber-400/20'
                          : isSelected
                          ? 'bg-amber-400/10 border-amber-400/40 text-white shadow-lg shadow-black/20'
                          : 'bg-slate-900/80 border-slate-800/80 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                      }`}
                    >
                      {isDayDragOver && (
                        <span className="absolute -top-2.5 right-1/2 translate-x-1/2 text-[9px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full shadow-sm animate-bounce whitespace-nowrap">
                          رها کنید برای انتقال به این روز
                        </span>
                      )}
                      <div className="flex items-center justify-between text-xs font-bold">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-500 font-mono">روز {dayNumber}:</span>
                          <span>{w.label}</span>
                        </div>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                          isSelected ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {dayItems.length} پارت
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                        <span>انجام شده:</span>
                        <span className="font-mono text-emerald-400 font-semibold">{completedCount} از {dayItems.length}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Time Blocks for the Active Day & Active Week with Drop Target */}
              <div className="space-y-4">
                {TIME_SLOTS.map(slot => {
                  const currentWeekNum = planCycleMode === 'weekly' ? 1 : activeWeek;
                  const itemsInSlot = scheduleItems.filter(
                    i => (i.weekNumber || 1) === currentWeekNum && i.day === activeDay && i.slot === slot.id
                  );
                  const isSlotDragOver = dragOverSlot === slot.id && dragOverDay === activeDay;

                  return (
                    <div
                      key={slot.id}
                      onDragOver={(e) => {
                        handleDragOver(e);
                        setDragOverSlot(slot.id);
                        setDragOverDay(activeDay);
                      }}
                      onDragLeave={() => {
                        if (dragOverSlot === slot.id) setDragOverSlot(null);
                      }}
                      onDrop={(e) => handleDropOnSlot(e, slot.id, activeDay, currentWeekNum)}
                      className={`border rounded-2xl p-4 sm:p-5 space-y-3 transition-all ${
                        isSlotDragOver
                          ? 'bg-amber-400/10 border-amber-400 ring-2 ring-amber-400/50 shadow-xl'
                          : 'bg-slate-900/90 border-slate-800/90'
                      }`}
                    >
                      {/* Slot Header */}
                      <div className="flex items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                              <span>{slot.label}</span>
                              <span className="text-xs text-slate-400 font-normal font-mono">({slot.timeRange})</span>
                              {planCycleMode === 'biweekly' && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                                  {activeWeek === 1 ? 'هفته ۱' : 'هفته ۲'}
                                </span>
                              )}
                            </h4>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedSlotForAdd({ day: activeDay, slot: slot.id, week: currentWeekNum });
                            setFormWeekNumber(currentWeekNum);
                            setIsAddModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>افزودن مبحث به این پارت</span>
                        </button>
                      </div>

                      {/* Drop Target Indicator while dragging */}
                      {draggedItemId && (
                        <div className={`p-2.5 rounded-xl border-2 border-dashed transition-all text-center text-xs font-bold flex items-center justify-center gap-2 ${
                          isSlotDragOver
                            ? 'border-amber-400 bg-amber-400/20 text-amber-300 scale-[1.01]'
                            : 'border-slate-700/80 bg-slate-950/40 text-slate-400'
                        }`}>
                          <Move className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                          <span>رها کنید تا مبحث به {slot.label} منتقل شود</span>
                        </div>
                      )}

                      {/* Slot Items Cards */}
                      {itemsInSlot.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
                          <BookOpen className="w-5 h-5 text-slate-600" />
                          <span>هیچ سرفصلی برای این باکس زمانی در {planCycleMode === 'biweekly' ? `هفته ${activeWeek === 1 ? 'اول' : 'دوم'}` : 'این روز'} تعریف نشده است.</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          {itemsInSlot.map(item => {
                            const studyModeInfo = STUDY_MODES.find(m => m.id === item.studyMode) || STUDY_MODES[0];
                            const isCompleted = item.status === 'completed';
                            const isInProgress = item.status === 'in_progress';
                            const isBeingDragged = draggedItemId === item.id;

                            return (
                              <div
                                key={item.id}
                                draggable={true}
                                onDragStart={(e) => handleDragStart(e, item.id)}
                                onDragEnd={handleDragEnd}
                                className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 cursor-grab active:cursor-grabbing select-none ${
                                  isBeingDragged
                                    ? 'opacity-30 scale-95 border-amber-400 ring-2 ring-amber-400 bg-amber-400/10 shadow-2xl'
                                    : isCompleted
                                    ? 'bg-emerald-950/20 border-emerald-500/30'
                                    : isInProgress
                                    ? 'bg-amber-400/5 border-amber-400/40'
                                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:shadow-md'
                                }`}
                              >
                                <div className="space-y-1.5">
                                  {/* Metadata unboxed + Grip Handle */}
                                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                      <span
                                        className="p-1 rounded bg-slate-900 text-slate-500 hover:text-amber-400 cursor-grab active:cursor-grabbing transition-colors"
                                        title="برای جابجایی بین روزها یا پارت‌ها، این کارت را کشیده و رها کنید (Drag & Drop)"
                                      >
                                        <GripVertical className="w-3.5 h-3.5" />
                                      </span>
                                      <span className="font-semibold text-amber-300">{item.bookTitle}</span>
                                      <span aria-hidden="true">·</span>
                                      <span className="text-slate-400">{item.chapterTitle}</span>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                      {item.isSpecialized ? (
                                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/15 border border-amber-400/30 text-amber-300 font-semibold">
                                          اختصاصی
                                        </span>
                                      ) : (
                                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400 font-medium">
                                          عمومی
                                        </span>
                                      )}

                                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-medium">
                                        {studyModeInfo.label}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Topic Name */}
                                  <h5 className={`text-sm font-bold leading-snug ${isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>
                                    {item.topicName}
                                  </h5>

                                  {item.notes && (
                                    <p className="text-[11px] text-slate-400 font-light italic">
                                      {item.notes}
                                    </p>
                                  )}
                                </div>

                                {/* Card Footer: Duration, Test target & Action Buttons */}
                                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-900 text-xs">
                                  <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                                      <span>{item.durationMinutes} دقیقه</span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Target className="w-3.5 h-3.5 text-cyan-400" />
                                      <span>{item.targetTestCount} تست</span>
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    {/* Move / Duplicate between weeks (Bi-Weekly Mode) */}
                                    {planCycleMode === 'biweekly' && (
                                      <button
                                        onClick={() => handleToggleItemWeek(item.id)}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-900 transition-colors cursor-pointer"
                                        title={`انتقال پارت به هفته ${(item.weekNumber || 1) === 1 ? 'دوم' : 'اول'}`}
                                      >
                                        <ArrowRightLeft className="w-3.5 h-3.5" />
                                      </button>
                                    )}

                                    <button
                                      onClick={() => handleToggleItemStatus(item.id)}
                                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                        isCompleted
                                          ? 'bg-emerald-500 text-slate-950'
                                          : isInProgress
                                          ? 'bg-amber-400 text-slate-950'
                                          : 'bg-slate-800 text-slate-300 hover:text-white'
                                      }`}
                                    >
                                      {isCompleted ? (
                                        <>
                                          <Check className="w-3.5 h-3.5" />
                                          <span>انجام شد</span>
                                        </>
                                      ) : isInProgress ? (
                                        <>
                                          <Play className="w-3.5 h-3.5" />
                                          <span>در حال مطالعه</span>
                                        </>
                                      ) : (
                                        <span>علامت انجام</span>
                                      )}
                                    </button>

                                    <button
                                      onClick={() => handleDeleteScheduleItem(item.id)}
                                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors cursor-pointer"
                                      title="حذف از پارت"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
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
            </>
          )}
        </div>
      )}

      {/* ===================================================================
          TAB 2: 4-STAGE MASTERY SYLLABUS CHECKLIST (HIERARCHICAL)
          =================================================================== */}
      {activeTab === 'checklist' && (
        <div className="space-y-5">
          {/* Search & Book Filter Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute right-3.5 top-3 text-slate-500" />
              <input
                type="text"
                value={checklistSearch}
                onChange={e => setChecklistSearch(e.target.value)}
                placeholder="جستجوی سرفصل، گفتار یا فصل در StudyPlanData..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400">فیلتر کتاب:</span>
              <select
                value={checklistBookFilter}
                onChange={e => setChecklistBookFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="all">همه کتب درسی این بخش ({availableBooks.length} کتاب)</option>
                {availableBooks.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.title} {b.isSpecialized ? `(اختصاصی ${trackInfo.shortName})` : '(عمومی)'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4 Stages Legend */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span>مرحله ۱: مطالعه کتاب و درسنامه</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>مرحله ۲: حل تمرین و تست آموزشی</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>مرحله ۳: مرور ابینگهاوس</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>مرحله ۴: تسلط کامل کنکوری</span>
            </div>
          </div>

          {/* Hierarchical Syllabus Tree List */}
          <div className="space-y-6">
            {availableBooks
              .filter(b => checklistBookFilter === 'all' || b.id === checklistBookFilter)
              .map(book => {
                const bookTopics: { chapter: StudyPlanChapter; topic: StudyPlanTopic }[] = [];
                book.chapters.forEach(ch => {
                  ch.topics.forEach(tp => {
                    if (!checklistSearch.trim() || 
                        tp.topicName.toLowerCase().includes(checklistSearch.toLowerCase()) ||
                        ch.chapterTitle.toLowerCase().includes(checklistSearch.toLowerCase()) ||
                        book.title.toLowerCase().includes(checklistSearch.toLowerCase())) {
                      bookTopics.push({ chapter: ch, topic: tp });
                    }
                  });
                });

                if (bookTopics.length === 0) return null;

                const masteredInBook = bookTopics.filter(bt => masteryMatrix[bt.topic.id]?.stageMastered).length;
                const bookPercent = Math.round((masteredInBook / bookTopics.length) * 100);

                return (
                  <div key={book.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    {/* Book Header */}
                    <div className="p-4 sm:p-5 bg-slate-850/80 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${book.isSpecialized ? 'bg-amber-400/10 text-amber-400' : 'bg-slate-800 text-slate-300'}`}>
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-white">{book.title}</h3>
                            {book.isSpecialized ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-bold">
                                درس اختصاصی {trackInfo.shortName}
                              </span>
                            ) : (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                                درس عمومی مشترک
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                            <span>پایه {selectedGrade}</span>
                            <span aria-hidden="true">·</span>
                            <span>{book.chapters.length} فصل تدوین‌شده</span>
                            <span aria-hidden="true">·</span>
                            <span>{bookTopics.length} گفتار و مبحث</span>
                          </div>
                        </div>
                      </div>

                      {/* Book Mastery progress bar */}
                      <div className="w-full sm:w-48 space-y-1">
                        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                          <span>پیشرفت تسلط:</span>
                          <span className="text-emerald-400 font-bold">{bookPercent}٪</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="bg-emerald-400 h-full transition-all duration-300"
                            style={{ width: `${bookPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Book Chapters & Topics */}
                    <div className="divide-y divide-slate-800/60 p-2 sm:p-4">
                      {book.chapters.map(chapter => {
                        const chapterTopics = chapter.topics.filter(tp =>
                          !checklistSearch.trim() ||
                          tp.topicName.toLowerCase().includes(checklistSearch.toLowerCase()) ||
                          chapter.chapterTitle.toLowerCase().includes(checklistSearch.toLowerCase())
                        );

                        if (chapterTopics.length === 0) return null;

                        return (
                          <div key={chapter.chapterNumber} className="py-3 px-2 sm:px-3 space-y-2.5">
                            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                              <span className="w-5 h-5 rounded-md bg-slate-800 text-amber-300 text-[11px] font-mono font-bold flex items-center justify-center">
                                {chapter.chapterNumber}
                              </span>
                              <span>{chapter.chapterTitle}</span>
                              <span className="text-[11px] text-slate-500 font-normal">({chapterTopics.length} گفتار)</span>
                            </h4>

                            <div className="space-y-2 pr-4 sm:pr-7">
                              {chapterTopics.map(topic => {
                                const m = masteryMatrix[topic.id] || {
                                  stageReadBook: false,
                                  stagePracticeTests: false,
                                  stageSpacedReview: false,
                                  stageMastered: false,
                                  testCount: 0
                                };

                                return (
                                  <div
                                    key={topic.id}
                                    className={`p-3 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                                      m.stageMastered
                                        ? 'bg-emerald-950/15 border-emerald-500/30'
                                        : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                                    }`}
                                  >
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <h5 className="text-xs font-bold text-white">
                                          {topic.topicName}
                                        </h5>
                                        {topic.importance === 'critical' && (
                                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold">
                                            پرتکرار کنکور
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-[11px] text-slate-400">
                                        <span className="text-amber-400/80">روش پیشنهادی: </span>
                                        <span>{topic.recommendedMethod}</span>
                                      </p>
                                    </div>

                                    {/* 4 Interactive Checkboxes for Mastery */}
                                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                                      <button
                                        onClick={() => handleToggleMasteryStage(topic.id, 'stageReadBook')}
                                        className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                                          m.stageReadBook
                                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                                        }`}
                                        title="مرحله اول: مطالعه متن کتاب و جزوه"
                                      >
                                        <BookOpen className="w-3 h-3" />
                                        <span>۱. درسنامه</span>
                                      </button>

                                      <button
                                        onClick={() => handleToggleMasteryStage(topic.id, 'stagePracticeTests')}
                                        className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                                          m.stagePracticeTests
                                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                                        }`}
                                        title="مرحله دوم: حل تمرین و تست آموزشی"
                                      >
                                        <Target className="w-3 h-3" />
                                        <span>۲. تست آموزشی</span>
                                      </button>

                                      <button
                                        onClick={() => handleToggleMasteryStage(topic.id, 'stageSpacedReview')}
                                        className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                                          m.stageSpacedReview
                                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                                        }`}
                                        title="مرحله سوم: مرور فواصل ابینگهاوس"
                                      >
                                        <RotateCcw className="w-3 h-3" />
                                        <span>۳. مرور ابینگهاوس</span>
                                      </button>

                                      <button
                                        onClick={() => handleToggleMasteryStage(topic.id, 'stageMastered')}
                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                          m.stageMastered
                                            ? 'bg-emerald-500 text-slate-950 shadow-sm'
                                            : 'bg-slate-900 text-slate-400 hover:text-emerald-400 border border-slate-800'
                                        }`}
                                        title="مرحله چهارم: تسلط کامل کنکوری"
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>۴. تسلط کامل</span>
                                      </button>

                                      {/* Quick add to today schedule */}
                                      <button
                                        onClick={() => {
                                          const targetWeek = planCycleMode === 'weekly' ? 1 : activeWeek;
                                          const newItem: ScheduledPlanItem = {
                                            id: `plan_quick_${Date.now()}`,
                                            weekNumber: targetWeek,
                                            day: activeDay,
                                            slot: 'morning',
                                            bookId: book.id,
                                            bookTitle: book.title,
                                            subjectCategory: book.category,
                                            chapterTitle: chapter.chapterTitle,
                                            topicId: topic.id,
                                            topicName: topic.topicName,
                                            isSpecialized: book.isSpecialized,
                                            durationMinutes: 90,
                                            targetTestCount: 30,
                                            studyMode: 'concept_learning',
                                            status: 'pending',
                                            createdAt: Date.now()
                                          };
                                          setScheduleItems(prev => [...prev, newItem]);
                                          const weekStr = planCycleMode === 'biweekly' ? `(هفته ${targetWeek === 1 ? 'اول' : 'دوم'}) ` : '';
                                          showToast(`«${topic.topicName}» به برنامه امروز ${weekStr}افزوده شد.`);
                                        }}
                                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                                        title="افزودن مستقیم به برنامه امروز"
                                      >
                                        <Plus className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ===================================================================
          TAB 3: STUDY ANALYTICS & GOAL TRACKER (WEEKLY / BI-WEEKLY)
          =================================================================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Bi-Weekly Comparative Cards (Week 1 vs Week 2) */}
          {planCycleMode === 'biweekly' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Week 1 Box */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-white text-sm">هفته ۱: یادگیری، آموزش و تثبیت</span>
                  </div>
                  <span className="text-xs text-amber-300 font-mono font-bold">
                    {cycleAnalytics.week1.completedHours} / {cycleAnalytics.week1.totalHours} ساعت
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-950/60 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">آموزش و درسنامه:</span>
                    <span className="text-amber-400 font-mono font-bold">{cycleAnalytics.week1.conceptHours} ساعت</span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">تست آموزشی:</span>
                    <span className="text-cyan-400 font-mono font-bold">{cycleAnalytics.week1.testHours} ساعت</span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">تعداد تست زده:</span>
                    <span className="text-emerald-400 font-mono font-bold">{cycleAnalytics.week1.completedTests} تست</span>
                  </div>
                </div>
              </div>

              {/* Week 2 Box */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-white text-sm">هفته ۲: تسلط، مرور و آزمون آزمایشی</span>
                  </div>
                  <span className="text-xs text-cyan-300 font-mono font-bold">
                    {cycleAnalytics.week2.completedHours} / {cycleAnalytics.week2.totalHours} ساعت
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-950/60 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">تست‌های زمان‌دار:</span>
                    <span className="text-cyan-400 font-mono font-bold">{cycleAnalytics.week2.testHours} ساعت</span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">مرور و تورق سریع:</span>
                    <span className="text-amber-400 font-mono font-bold">{cycleAnalytics.week2.reviewHours} ساعت</span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">تعداد تست زده:</span>
                    <span className="text-emerald-400 font-mono font-bold">{cycleAnalytics.week2.completedTests} تست</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Standard Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Hours card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>
                    {planCycleMode === 'biweekly' ? 'ساعت مطالعه دوره ۲ هفتگی' : 'هدف ساعت مطالعه هفتگی'}
                  </span>
                </span>
                <span className="font-mono text-amber-400 font-bold">
                  {cycleAnalytics.completedCycleHours} / {planCycleMode === 'biweekly' ? targetWeeklyHours * 2 : targetWeeklyHours} ساعت
                </span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-amber-400 h-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.round((Number(cycleAnalytics.completedCycleHours) / (planCycleMode === 'biweekly' ? targetWeeklyHours * 2 : targetWeeklyHours)) * 100))}%`
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                نرخ تکمیل پارت‌های برنامه‌ریزی‌شده: <span className="font-mono text-emerald-400 font-bold">{cycleAnalytics.cycleCompletionRate}٪</span>
              </p>
            </div>

            {/* Tests card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-cyan-400" />
                  <span>
                    {planCycleMode === 'biweekly' ? 'تست‌زنی کل دوره ۲ هفتگی' : 'هدف تست هفتگی'}
                  </span>
                </span>
                <span className="font-mono text-cyan-400 font-bold">
                  {cycleAnalytics.completedCycleTests} / {planCycleMode === 'biweekly' ? targetWeeklyTests * 2 : targetWeeklyTests} تست
                </span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-cyan-400 h-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.round((cycleAnalytics.completedCycleTests / (planCycleMode === 'biweekly' ? targetWeeklyTests * 2 : targetWeeklyTests)) * 100))}%`
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                هدف‌گذاری کل دوره: {cycleAnalytics.targetCycleTests} تست برنامه‌ریزی شده است.
              </p>
            </div>

            {/* Specialized vs General Hours */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-amber-400" />
                  <span>ساعات دروس تخصصی {trackInfo.shortName}</span>
                </span>
                <span className="font-mono text-amber-300 font-bold">
                  {(Number(cycleAnalytics.week1.specializedHours) + (planCycleMode === 'biweekly' ? Number(cycleAnalytics.week2.specializedHours) : 0)).toFixed(1)} ساعت
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span>ساعات دروس عمومی:</span>
                <span className="font-mono text-slate-300 font-semibold">
                  {(Number(cycleAnalytics.week1.generalHours) + (planCycleMode === 'biweekly' ? Number(cycleAnalytics.week2.generalHours) : 0)).toFixed(1)} ساعت
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                تعادل بهینه کنکوری: حداقل ۷۰٪ زمان مطالعه باید به دروس اختصاصی رشته اختصاص یابد.
              </p>
            </div>

            {/* Mastery rate */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>پوشش سرفصل‌های پایه {selectedGrade}</span>
                </span>
                <span className="font-mono text-emerald-400 font-bold">{masteryStats.percent}٪ تسلط</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${masteryStats.percent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                {masteryStats.mastered} مبحث از {masteryStats.total} مبحث به تسلط کامل رسیده‌اند.
              </p>
            </div>
          </div>

          {/* Subject Breakdown Table */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span>توزیع ساعات مطالعه به تفکیک دروس ({planCycleMode === 'biweekly' ? 'کل دوره ۲ هفتگی' : 'برنامه هفتگی'})</span>
            </h4>

            {cycleAnalytics.subjectBreakdown.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                هنوز مبحثی در جدول برنامه تعریف نشده است.
              </p>
            ) : (
              <div className="space-y-3">
                {cycleAnalytics.subjectBreakdown.map(sub => (
                  <div key={sub.subject} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-300 font-medium">
                      <span>{sub.subject}</span>
                      <span className="font-mono text-amber-300">{sub.hours} ساعت ({sub.percent}٪)</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-amber-400 h-full"
                        style={{ width: `${sub.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: ADD NEW SYLLABUS SLOT TO SCHEDULE (WEEKLY / BI-WEEKLY AWARE)
          =================================================================== */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-5 shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
            dir="rtl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>افزودن سرفصل جدید به {WEEKDAYS.find(w => w.id === selectedSlotForAdd.day)?.label}</span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Bi-Weekly Week Choice (If in bi-weekly mode) */}
              {planCycleMode === 'biweekly' && (
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium block">تخصیص به هفته دوره ۲ هفتگی:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormWeekNumber(1)}
                      className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                        formWeekNumber === 1
                          ? 'bg-amber-400 text-slate-950 border-amber-400'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <span>هفته اول: آموزش و یادگیری</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormWeekNumber(2)}
                      className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                        formWeekNumber === 2
                          ? 'bg-amber-400 text-slate-950 border-amber-400'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <span>هفته دوم: تسلط، مرور و آزمون</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Select Book */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-400 font-medium">انتخاب کتاب درسی:</label>
                  <span className="text-[11px] text-amber-300">
                    پایه {selectedGrade} · {trackInfo.name}
                  </span>
                </div>
                <select
                  value={formSelectedBookId}
                  onChange={e => setFormSelectedBookId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {availableBooks.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.title} ({b.isSpecialized ? `اختصاصی ${trackInfo.shortName}` : 'عمومی'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Topic */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-medium block">انتخاب دقیق سرفصل / گفتار:</label>
                <select
                  value={formSelectedTopicId}
                  onChange={e => setFormSelectedTopicId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {selectedFormTopics.map(({ chapter, topic }) => (
                    <option key={topic.id} value={topic.id}>
                      {chapter.chapterTitle} ⟵ {topic.topicName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Study Mode */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-medium block">متد و نوع پارت مطالعاتی:</label>
                <select
                  value={formStudyMode}
                  onChange={e => setFormStudyMode(e.target.value as StudyMode)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {STUDY_MODES.map(m => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </select>
              </div>

              {/* Duration & Test Target */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium block">مدت زمان (دقیقه):</label>
                  <input
                    type="number"
                    min={15}
                    max={240}
                    step={15}
                    value={formDuration}
                    onChange={e => setFormDuration(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium block">تعداد تست هدف:</label>
                  <input
                    type="number"
                    min={0}
                    max={200}
                    step={5}
                    value={formTestCount}
                    onChange={e => setFormTestCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-medium block">یادداشت و هدف‌گذاری شخصی (اختیاری):</label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="مثال: حل تست‌های زوج کنکور سراسری و خلاصه‌نویسی نکات"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                انصراف
              </button>
              <button
                onClick={handleSaveScheduleItem}
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
              >
                ذخیره در برنامه
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 border border-amber-400/50 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Dedicated PDF Export Modal for Weekly & Bi-Weekly Plans */}
      <PlannerPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        scheduleItems={scheduleItems}
        planCycleMode={planCycleMode}
        selectedGrade={selectedGrade}
        selectedTrack={selectedTrack}
        activeWeek={activeWeek}
      />
    </section>
  );
};
