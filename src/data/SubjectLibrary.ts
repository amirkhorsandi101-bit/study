/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SubjectLibrary: Comprehensive hierarchical educational database for Iranian High School
 * Curriculum (Grades 10, 11, and 12) across Experimental, Mathematics, and Humanities tracks.
 * Provides structured access to Textbooks, Chapters, and granular Topics for study planning.
 */

export type GradeLevel = 10 | 11 | 12;
export type AcademicTrackId = 'experimental' | 'mathematics' | 'humanities';

export interface SubjectTopic {
  id: string;
  topicName: string;
  recommendedMethod: string;
  difficulty: 'easy' | 'medium' | 'hard';
  importance: 'medium' | 'high' | 'very_high' | 'critical';
  estimatedMinutes?: number;
  keyConcepts?: string[];
}

export interface SubjectChapter {
  chapterNumber: number;
  chapterTitle: string;
  topics: SubjectTopic[];
}

export interface SubjectBook {
  id: string;
  bookTitle: string;
  subjectCategory: string;
  grade: GradeLevel;
  tracks: AcademicTrackId[];
  isSpecialized: boolean; // دروس تخصصی در برابر عمومی
  chapters: SubjectChapter[];
}

export interface AcademicTrackInfo {
  id: AcademicTrackId;
  name: string;
  tag: string;
  description: string;
  color: string;
}

export const TRACKS_INFO: Record<AcademicTrackId, AcademicTrackInfo> = {
  experimental: {
    id: 'experimental',
    name: 'علوم تجربی',
    tag: 'تجربی',
    description: 'تمرکز بر زیست‌شناسی، شیمی، زمین‌شناسی، فیزیک و ریاضیات تجربی',
    color: 'emerald'
  },
  mathematics: {
    id: 'mathematics',
    name: 'ریاضی و فیزیک',
    tag: 'ریاضی',
    description: 'تمرکز بر حسابان، هندسه تحلیلی، گسسته، فیزیک تخصصی و شیمی',
    color: 'cyan'
  },
  humanities: {
    id: 'humanities',
    name: 'ادبیات و علوم انسانی',
    tag: 'انسانی',
    description: 'تمرکز بر علوم و فنون ادبی، فلسفه و منطق، جامعه‌شناسی، روان‌شناسی و اقتصاد',
    color: 'amber'
  }
};

export const GRADES_LIST: { grade: GradeLevel; label: string; stage: string }[] = [
  { grade: 10, label: 'پایه دهم', stage: 'متوسطه دوم - سال اول' },
  { grade: 11, label: 'پایه یازدهم', stage: 'متوسطه دوم - سال دوم' },
  { grade: 12, label: 'پایه دوازدهم', stage: 'متوسطه دوم - کنکور و امتحانات نهایی' }
];

// =========================================================================
// TEXTBOOK DEFINITIONS AND GRANULAR SYLLABUS DATA
// =========================================================================

import { COMPREHENSIVE_BOOKS } from './ComprehensiveCurriculum';

const ALL_BOOKS: SubjectBook[] = COMPREHENSIVE_BOOKS;


// =========================================================================
// SUBJECT LIBRARY MASTER OBJECT & QUERY API
// =========================================================================

export const SubjectLibrary = {
  /**
   * Returns all available academic tracks with metadata
   */
  getTracks(): AcademicTrackInfo[] {
    return Object.values(TRACKS_INFO);
  },

  /**
   * Returns all available high school grades
   */
  getGrades(): { grade: GradeLevel; label: string; stage: string }[] {
    return GRADES_LIST;
  },

  /**
   * Returns all textbooks in the library
   */
  getAllBooks(): SubjectBook[] {
    return ALL_BOOKS;
  },

  /**
   * Returns filtered textbooks based on grade and academic track
   */
  getBooks(grade?: GradeLevel, track?: AcademicTrackId): SubjectBook[] {
    return ALL_BOOKS.filter(book => {
      if (grade && book.grade !== grade) return false;
      if (track && !book.tracks.includes(track)) return false;
      return true;
    });
  },

  /**
   * Get specific book by its unique ID
   */
  getBookById(bookId: string): SubjectBook | undefined {
    return ALL_BOOKS.find(b => b.id === bookId);
  },

  /**
   * Returns all chapters of a book
   */
  getChapters(bookId: string): SubjectChapter[] {
    const book = this.getBookById(bookId);
    return book ? book.chapters : [];
  },

  /**
   * Returns all topics of a specific chapter
   */
  getTopics(bookId: string, chapterNumber: number): SubjectTopic[] {
    const book = this.getBookById(bookId);
    if (!book) return [];
    const chapter = book.chapters.find(c => c.chapterNumber === chapterNumber);
    return chapter ? chapter.topics : [];
  },

  /**
   * Deep search across all textbooks, chapters, and topics
   */
  search(query: string, options?: { grade?: GradeLevel; track?: AcademicTrackId }): {
    book: SubjectBook;
    chapter: SubjectChapter;
    topic: SubjectTopic;
  }[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: { book: SubjectBook; chapter: SubjectChapter; topic: SubjectTopic }[] = [];

    ALL_BOOKS.forEach(book => {
      if (options?.grade && book.grade !== options.grade) return;
      if (options?.track && !book.tracks.includes(options.track)) return;

      book.chapters.forEach(chapter => {
        chapter.topics.forEach(topic => {
          const matchTopic = topic.topicName.toLowerCase().includes(q);
          const matchChapter = chapter.chapterTitle.toLowerCase().includes(q);
          const matchBook = book.bookTitle.toLowerCase().includes(q);
          const matchSubject = book.subjectCategory.toLowerCase().includes(q);
          const matchKeyConcepts = topic.keyConcepts?.some(k => k.toLowerCase().includes(q));

          if (matchTopic || matchChapter || matchBook || matchSubject || matchKeyConcepts) {
            results.push({ book, chapter, topic });
          }
        });
      });
    });

    return results;
  },

  /**
   * Find topic with its complete hierarchical breadcrumb
   */
  findTopicById(topicId: string): {
    book: SubjectBook;
    chapter: SubjectChapter;
    topic: SubjectTopic;
  } | null {
    for (const book of ALL_BOOKS) {
      for (const chapter of book.chapters) {
        for (const topic of chapter.topics) {
          if (topic.id === topicId) {
            return { book, chapter, topic };
          }
        }
      }
    }
    return null;
  },

  /**
   * Flat array of all topics formatted for immediate Ebbinghaus study planning
   */
  toSchedulerFormat(grade?: GradeLevel, track?: AcademicTrackId): {
    id: string;
    subject: string;
    topicName: string;
    bookTitle: string;
    chapterTitle: string;
    recommendedMethod: string;
    grade: GradeLevel;
    tracks: AcademicTrackId[];
    importance: string;
  }[] {
    const list: any[] = [];
    ALL_BOOKS.forEach(book => {
      if (grade && book.grade !== grade) return;
      if (track && !book.tracks.includes(track)) return;

      book.chapters.forEach(chapter => {
        chapter.topics.forEach(topic => {
          list.push({
            id: topic.id,
            subject: book.subjectCategory,
            topicName: `${book.bookTitle}: ${topic.topicName}`,
            bookTitle: book.bookTitle,
            chapterTitle: chapter.chapterTitle,
            recommendedMethod: topic.recommendedMethod,
            grade: book.grade,
            tracks: book.tracks,
            importance: topic.importance
          });
        });
      });
    });
    return list;
  }
};
