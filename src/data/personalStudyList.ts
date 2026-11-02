/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Personal Study List Management:
 * Enables high school students (Grades 10, 11, 12 in Experimental, Math, Humanities)
 * to curate their personal syllabus from SubjectLibrary and sync/filter it across
 * planning tools (Ebbinghaus Scheduler, Study Advisor, Focus Mode).
 */

import {
  SubjectLibrary,
  GradeLevel,
  AcademicTrackId,
  SubjectBook,
  SubjectChapter,
  SubjectTopic
} from './SubjectLibrary';
import { EbbinghausTopicItem } from '../components/DashboardStats';

export const PERSONAL_STUDY_LIST_STORAGE_KEY = 'rahbord_personal_study_list_v1';
export const PERSONAL_LIST_UPDATED_EVENT = 'rahbord_personal_study_list_updated';
const TOPICS_STORAGE_KEY = 'rahbord_ebbinghaus_topics_queue';

export type StudyStatus = 'planned' | 'in_progress' | 'scheduled_ebbinghaus' | 'mastered';

export interface PersonalStudyTopic {
  id: string; // Unique entry ID
  topicId: string; // Reference to SubjectLibrary topic id
  grade: GradeLevel;
  tracks: AcademicTrackId[];
  bookTitle: string;
  subject: string;
  chapterNumber: number;
  chapterTitle: string;
  topicName: string;
  recommendedMethod: string;
  difficulty: 'easy' | 'medium' | 'hard';
  importance: 'medium' | 'high' | 'very_high' | 'critical';
  addedAt: string;
  status: StudyStatus;
  notes?: string;
}

// Initial curated sample if student is opening for the first time
export const DEFAULT_PERSONAL_STUDY_LIST: PersonalStudyTopic[] = [
  {
    id: 'pst_bio12_c1_t1',
    topicId: 'bio12_c1_t1',
    grade: 12,
    tracks: ['experimental'],
    bookTitle: 'زیست‌شناسی ۳ دوازدهم تجربی',
    subject: 'زیست‌شناسی',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: مولکول‌های اطلاعاتی (نوکلئیک‌اسیدها)',
    topicName: 'ساختار DNA و RNA، آزمایش‌های گریفیت و ایوری، همانندسازی نیمه‌حفاظت‌شده',
    recommendedMethod: 'رسم دیاگرام چنگال همانندسازی و نقش آنزیم‌های هلیکاز و DNA پلیمراز',
    difficulty: 'medium',
    importance: 'critical',
    addedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    status: 'scheduled_ebbinghaus'
  },
  {
    id: 'pst_chem12_c1_t1',
    topicId: 'chem12_c1_t1',
    grade: 12,
    tracks: ['experimental', 'mathematics'],
    bookTitle: 'شیمی ۳ دوازدهم',
    subject: 'شیمی',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: مولکول‌ها در خدمت تندرستی',
    topicName: 'پاک‌کننده‌های صابونی و غیرصابونی، صابون مراغه، پاک‌کننده‌های خورنده',
    recommendedMethod: 'جدول مقایسه چربی‌دوست/آب‌دوست و رفتار در آب سخت',
    difficulty: 'easy',
    importance: 'high',
    addedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    status: 'scheduled_ebbinghaus'
  },
  {
    id: 'pst_phy12_c1_t1',
    topicId: 'phy12_c1_t1',
    grade: 12,
    tracks: ['experimental', 'mathematics'],
    bookTitle: 'فیزیک ۳ دوازدهم',
    subject: 'فیزیک',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: حرکت بر خط راست',
    topicName: 'شناخت حرکت، بردار مکان، جابه‌جایی و تندی و سرعت متوسط',
    recommendedMethod: 'تحلیل نمودار مکان-زمان و سطح زیر نمودار سرعت-زمان',
    difficulty: 'medium',
    importance: 'very_high',
    addedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    status: 'in_progress'
  },
  {
    id: 'pst_math12_c1_t1',
    topicId: 'math12_c1_t1',
    grade: 12,
    tracks: ['experimental'],
    bookTitle: 'ریاضی ۳ دوازدهم تجربی',
    subject: 'ریاضیات',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: تابع',
    topicName: 'توابع صعودی و نزولی، اکیداً یکنوا و ترکیب توابع f(g(x))',
    recommendedMethod: 'تعیین دامنه ترکیب توابع با حل نامعادلات جبری',
    difficulty: 'medium',
    importance: 'very_high',
    addedAt: new Date().toISOString(),
    status: 'planned'
  }
];

/**
 * Retrieve personal study list from localStorage
 */
export function getPersonalStudyList(): PersonalStudyTopic[] {
  try {
    const raw = localStorage.getItem(PERSONAL_STUDY_LIST_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error reading personal study list:', e);
  }
  return DEFAULT_PERSONAL_STUDY_LIST;
}

/**
 * Persist personal study list to localStorage and dispatch update event
 */
export function savePersonalStudyList(list: PersonalStudyTopic[]): void {
  try {
    localStorage.setItem(PERSONAL_STUDY_LIST_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(PERSONAL_LIST_UPDATED_EVENT, { detail: list }));
  } catch (e) {
    console.error('Error saving personal study list:', e);
  }
}

/**
 * Check if a specific topic is in the personal list
 */
export function isTopicInPersonalList(topicId: string, list?: PersonalStudyTopic[]): boolean {
  const currentList = list || getPersonalStudyList();
  return currentList.some(item => item.topicId === topicId || item.id === topicId);
}

/**
 * Add or create a PersonalStudyTopic from a SubjectTopic
 */
export function addTopicToPersonalList(
  topic: SubjectTopic,
  book: SubjectBook,
  chapter: SubjectChapter
): { success: boolean; topic: PersonalStudyTopic; alreadyExists: boolean } {
  const currentList = getPersonalStudyList();
  const existing = currentList.find(i => i.topicId === topic.id);
  if (existing) {
    return { success: true, topic: existing, alreadyExists: true };
  }

  const newItem: PersonalStudyTopic = {
    id: `pst_${topic.id}_${Date.now()}`,
    topicId: topic.id,
    grade: book.grade,
    tracks: book.tracks,
    bookTitle: book.bookTitle,
    subject: book.subjectCategory,
    chapterNumber: chapter.chapterNumber,
    chapterTitle: chapter.chapterTitle,
    topicName: topic.topicName,
    recommendedMethod: topic.recommendedMethod,
    difficulty: topic.difficulty,
    importance: topic.importance,
    addedAt: new Date().toISOString(),
    status: 'planned'
  };

  const updated = [newItem, ...currentList];
  savePersonalStudyList(updated);
  return { success: true, topic: newItem, alreadyExists: false };
}

/**
 * Remove a topic from personal study list by topicId or item id
 */
export function removeTopicFromPersonalList(identifier: string): PersonalStudyTopic[] {
  const currentList = getPersonalStudyList();
  const updated = currentList.filter(item => item.id !== identifier && item.topicId !== identifier);
  savePersonalStudyList(updated);
  return updated;
}

/**
 * Toggle topic presence in personal list
 */
export function toggleTopicInPersonalList(
  topic: SubjectTopic,
  book: SubjectBook,
  chapter: SubjectChapter
): { isInList: boolean; count: number } {
  const currentList = getPersonalStudyList();
  const exists = currentList.some(i => i.topicId === topic.id);

  if (exists) {
    const updated = currentList.filter(i => i.topicId !== topic.id);
    savePersonalStudyList(updated);
    return { isInList: false, count: updated.length };
  } else {
    const res = addTopicToPersonalList(topic, book, chapter);
    const updated = getPersonalStudyList();
    return { isInList: true, count: updated.length };
  }
}

/**
 * Add multiple topics to personal study list in a single batch
 */
export function addMultipleTopicsToPersonalList(
  items: { topic: SubjectTopic; book: SubjectBook; chapter: SubjectChapter }[]
): { addedCount: number; totalCount: number } {
  const currentList = getPersonalStudyList();
  const existingTopicIds = new Set(currentList.map(i => i.topicId));
  const newItems: PersonalStudyTopic[] = [];

  items.forEach(({ topic, book, chapter }) => {
    if (!existingTopicIds.has(topic.id)) {
      existingTopicIds.add(topic.id);
      newItems.push({
        id: `pst_${topic.id}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        topicId: topic.id,
        grade: book.grade,
        tracks: book.tracks,
        bookTitle: book.bookTitle,
        subject: book.subjectCategory,
        chapterNumber: chapter.chapterNumber,
        chapterTitle: chapter.chapterTitle,
        topicName: topic.topicName,
        recommendedMethod: topic.recommendedMethod,
        difficulty: topic.difficulty,
        importance: topic.importance,
        addedAt: new Date().toISOString(),
        status: 'planned'
      });
    }
  });

  if (newItems.length > 0) {
    const updated = [...newItems, ...currentList];
    savePersonalStudyList(updated);
    return { addedCount: newItems.length, totalCount: updated.length };
  }

  return { addedCount: 0, totalCount: currentList.length };
}

/**
 * Remove multiple topics from personal study list by topicIds
 */
export function removeMultipleTopicsFromPersonalList(topicIds: string[]): PersonalStudyTopic[] {
  const currentList = getPersonalStudyList();
  const idSet = new Set(topicIds);
  const updated = currentList.filter(item => !idSet.has(item.id) && !idSet.has(item.topicId));
  savePersonalStudyList(updated);
  return updated;
}

/**
 * Update the study status of an item in personal list
 */
export function updatePersonalTopicStatus(

  identifier: string,
  newStatus: StudyStatus
): PersonalStudyTopic[] {
  const currentList = getPersonalStudyList();
  const updated = currentList.map(item => {
    if (item.id === identifier || item.topicId === identifier) {
      return { ...item, status: newStatus };
    }
    return item;
  });
  savePersonalStudyList(updated);
  return updated;
}

/**
 * Sync selected (or all) personal study topics to Ebbinghaus scheduler queue
 */
export function syncPersonalTopicsToEbbinghaus(
  personalTopicIds?: string[],
  initialDaysAgo: number = 0
): { addedCount: number; totalInQueue: number } {
  const personalList = getPersonalStudyList();
  const targetTopics = personalTopicIds
    ? personalList.filter(t => personalTopicIds.includes(t.id) || personalTopicIds.includes(t.topicId))
    : personalList;

  let currentQueue: EbbinghausTopicItem[] = [];
  try {
    const raw = localStorage.getItem(TOPICS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) currentQueue = parsed;
    }
  } catch (e) {
    console.error('Error reading ebbinghaus queue:', e);
  }

  let addedCount = 0;
  const updatedQueue = [...currentQueue];

  targetTopics.forEach(item => {
    // Check if item or similar title already exists in queue
    const exists = currentQueue.some(
      q => q.topicName.includes(item.topicName) || q.id.includes(item.topicId)
    );

    if (!exists) {
      const newQueueItem: EbbinghausTopicItem = {
        id: `eb_${item.topicId}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        subject: item.subject,
        topicName: `${item.bookTitle}: ${item.topicName}`,
        lastReviewedDaysAgo: initialDaysAgo,
        currentCycle: 0,
        recommendedMethod: item.recommendedMethod
      };
      updatedQueue.unshift(newQueueItem);
      addedCount++;
    }
  });

  if (addedCount > 0) {
    try {
      localStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(updatedQueue));
      window.dispatchEvent(new Event('rahbord_data_updated'));

      // Mark status as scheduled_ebbinghaus in personal list
      const updatedPersonalList = personalList.map(item => {
        if (targetTopics.some(t => t.id === item.id || t.topicId === item.topicId)) {
          return { ...item, status: 'scheduled_ebbinghaus' as StudyStatus };
        }
        return item;
      });
      savePersonalStudyList(updatedPersonalList);
    } catch (e) {
      console.error('Failed to sync to ebbinghaus:', e);
    }
  }

  return { addedCount, totalInQueue: updatedQueue.length };
}

/**
 * Filter helper for planning tools to check if an Ebbinghaus topic or advisor topic
 * matches any item in the student's personal study list
 */
export function matchesPersonalStudyList(
  topicOrName: string | { topicName?: string; id?: string },
  personalList?: PersonalStudyTopic[]
): boolean {
  const list = personalList || getPersonalStudyList();
  if (list.length === 0) return false;

  const searchTarget = typeof topicOrName === 'string'
    ? topicOrName.toLowerCase()
    : `${topicOrName.id || ''} ${topicOrName.topicName || ''}`.toLowerCase();

  return list.some(item => {
    // Exact or substring match on topicId or topicName
    if (item.topicId && searchTarget.includes(item.topicId.toLowerCase())) return true;
    if (item.id && searchTarget.includes(item.id.toLowerCase())) return true;
    
    // Substring match on topic name parts
    const cleanTopicName = item.topicName.trim().toLowerCase();
    if (cleanTopicName.length > 5 && searchTarget.includes(cleanTopicName)) return true;
    
    // Reverse check
    if (searchTarget.length > 5 && cleanTopicName.includes(searchTarget)) return true;

    return false;
  });
}
