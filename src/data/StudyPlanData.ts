/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * StudyPlanData.ts: Hierarchical Academic & Konkur Curriculum Data Provider
 * Supplies structured curriculum data (Tracks -> Grades -> Subjects -> Chapters -> Topics)
 * with granular filtering for specialized vs. general subjects across Grades 10, 11, and 12
 * for Experimental, Mathematics, and Humanities tracks.
 */

import { COMPREHENSIVE_BOOKS } from './ComprehensiveCurriculum';
import { GradeLevel, AcademicTrackId } from './SubjectLibrary';

export type AcademicTrack = AcademicTrackId;

export interface StudyPlanTopic {
  id: string;
  topicName: string;
  recommendedMethod: string;
  difficulty: 'easy' | 'medium' | 'hard';
  importance: 'medium' | 'high' | 'very_high' | 'critical';
  estimatedMinutes?: number;
  keyConcepts?: string[];
}

export interface StudyPlanChapter {
  chapterNumber: number;
  chapterTitle: string;
  topics: StudyPlanTopic[];
}

export interface StudyPlanSubject {
  id: string;
  title: string;
  category: string;
  grade: GradeLevel;
  tracks: AcademicTrack[];
  isSpecialized: boolean; // دروس تخصصی رشته در برابر دروس عمومی مشترک
  chapters: StudyPlanChapter[];
}

export type SubjectFilterType = 'all' | 'specialized' | 'general';

export interface AcademicTrackConfig {
  id: AcademicTrack;
  name: string;
  shortName: string;
  description: string;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

export const ACADEMIC_TRACKS_CONFIG: Record<AcademicTrack, AcademicTrackConfig> = {
  experimental: {
    id: 'experimental',
    name: 'علوم تجربی',
    shortName: 'تجربی',
    description: 'تمرکز بر زیست‌شناسی، شیمی، زمین‌شناسی، فیزیک و ریاضی تجربی',
    accentColor: 'emerald',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/30',
    badgeText: 'text-emerald-400'
  },
  mathematics: {
    id: 'mathematics',
    name: 'ریاضی و فیزیک',
    shortName: 'ریاضی',
    description: 'تمرکز بر حسابان، هندسه تحلیلی، گسسته و آمار، فیزیک و شیمی',
    accentColor: 'cyan',
    badgeBg: 'bg-cyan-500/10',
    badgeBorder: 'border-cyan-500/30',
    badgeText: 'text-cyan-400'
  },
  humanities: {
    id: 'humanities',
    name: 'ادبیات و علوم انسانی',
    shortName: 'انسانی',
    description: 'تمرکز بر علوم و فنون ادبی، فلسفه و منطق، جامعه‌شناسی، روان‌شناسی و اقتصاد',
    accentColor: 'amber',
    badgeBg: 'bg-amber-400/10',
    badgeBorder: 'border-amber-400/30',
    badgeText: 'text-amber-400'
  }
};

export const GRADE_LEVELS_CONFIG: { grade: GradeLevel; label: string; description: string }[] = [
  { grade: 10, label: 'پایه دهم', description: 'متوسطه دوم - سال اول (تثبیت پایه‌های مفهومی)' },
  { grade: 11, label: 'پایه یازدهم', description: 'متوسطه دوم - سال دوم (توسعه و عمق‌بخشی به مباحث)' },
  { grade: 12, label: 'پایه دوازدهم', description: 'متوسطه دوم - سال سوم (جمع‌بندی، نهایی و کنکور)' }
];

/**
 * Normalized internal catalog mapping COMPREHENSIVE_BOOKS to StudyPlanSubject format
 */
const ALL_STUDY_PLAN_SUBJECTS: StudyPlanSubject[] = COMPREHENSIVE_BOOKS.map(book => ({
  id: book.id,
  title: book.bookTitle,
  category: book.subjectCategory,
  grade: book.grade,
  tracks: book.tracks,
  isSpecialized: book.isSpecialized,
  chapters: book.chapters.map(ch => ({
    chapterNumber: ch.chapterNumber,
    chapterTitle: ch.chapterTitle,
    topics: ch.topics.map(tp => ({
      id: tp.id,
      topicName: tp.topicName,
      recommendedMethod: tp.recommendedMethod,
      difficulty: tp.difficulty,
      importance: tp.importance,
      estimatedMinutes: tp.estimatedMinutes || 35,
      keyConcepts: tp.keyConcepts || []
    }))
  }))
}));

/**
 * Get all subjects in the entire curriculum database
 */
export function getAllStudyPlanSubjects(): StudyPlanSubject[] {
  return ALL_STUDY_PLAN_SUBJECTS;
}

/**
 * Get subjects filtered by grade, track, and specialization type (all, specialized only, or general only)
 */
export function getStudyPlanSubjects(
  grade: GradeLevel,
  track: AcademicTrack,
  filterType: SubjectFilterType = 'all'
): StudyPlanSubject[] {
  return ALL_STUDY_PLAN_SUBJECTS.filter(subject => {
    // Check grade
    if (subject.grade !== grade) return false;

    // Check track
    if (!subject.tracks.includes(track)) return false;

    // Check specialization filter
    if (filterType === 'specialized' && !subject.isSpecialized) return false;
    if (filterType === 'general' && subject.isSpecialized) return false;

    return true;
  });
}

/**
 * Get only specialized subjects for a specific track and grade
 */
export function getSpecializedSubjects(grade: GradeLevel, track: AcademicTrack): StudyPlanSubject[] {
  return getStudyPlanSubjects(grade, track, 'specialized');
}

/**
 * Get only general (common) subjects for a specific grade
 */
export function getGeneralSubjects(grade: GradeLevel, track: AcademicTrack): StudyPlanSubject[] {
  return getStudyPlanSubjects(grade, track, 'general');
}

/**
 * Get complete hierarchical structure for a track and grade
 */
export function getStudyPlanHierarchy(
  grade: GradeLevel,
  track: AcademicTrack,
  filterType: SubjectFilterType = 'all'
) {
  const subjects = getStudyPlanSubjects(grade, track, filterType);
  const specializedSubjects = subjects.filter(s => s.isSpecialized);
  const generalSubjects = subjects.filter(s => !s.isSpecialized);

  const totalTopics = subjects.reduce(
    (acc, sub) => acc + sub.chapters.reduce((chAcc, ch) => chAcc + ch.topics.length, 0),
    0
  );

  const specializedTopicsCount = specializedSubjects.reduce(
    (acc, sub) => acc + sub.chapters.reduce((chAcc, ch) => chAcc + ch.topics.length, 0),
    0
  );

  const generalTopicsCount = generalSubjects.reduce(
    (acc, sub) => acc + sub.chapters.reduce((chAcc, ch) => chAcc + ch.topics.length, 0),
    0
  );

  return {
    grade,
    track,
    trackInfo: ACADEMIC_TRACKS_CONFIG[track],
    filterType,
    subjects,
    specializedSubjects,
    generalSubjects,
    counts: {
      totalSubjects: subjects.length,
      specializedSubjects: specializedSubjects.length,
      generalSubjects: generalSubjects.length,
      totalTopics,
      specializedTopicsCount,
      generalTopicsCount
    }
  };
}

/**
 * Find a specific topic across the curriculum by its topic ID
 */
export function findStudyPlanTopic(topicId: string): {
  subject: StudyPlanSubject;
  chapter: StudyPlanChapter;
  topic: StudyPlanTopic;
} | null {
  for (const subject of ALL_STUDY_PLAN_SUBJECTS) {
    for (const chapter of subject.chapters) {
      for (const topic of chapter.topics) {
        if (topic.id === topicId) {
          return { subject, chapter, topic };
        }
      }
    }
  }
  return null;
}

/**
 * Search topics within a track and grade
 */
export function searchStudyPlanTopics(
  query: string,
  grade?: GradeLevel,
  track?: AcademicTrack,
  filterType: SubjectFilterType = 'all'
): {
  subject: StudyPlanSubject;
  chapter: StudyPlanChapter;
  topic: StudyPlanTopic;
}[] {
  const cleanQ = query.trim().toLowerCase();
  if (!cleanQ) return [];

  const results: {
    subject: StudyPlanSubject;
    chapter: StudyPlanChapter;
    topic: StudyPlanTopic;
  }[] = [];

  ALL_STUDY_PLAN_SUBJECTS.forEach(subject => {
    if (grade && subject.grade !== grade) return;
    if (track && !subject.tracks.includes(track)) return;
    if (filterType === 'specialized' && !subject.isSpecialized) return false;
    if (filterType === 'general' && subject.isSpecialized) return false;

    subject.chapters.forEach(chapter => {
      chapter.topics.forEach(topic => {
        const matchName = topic.topicName.toLowerCase().includes(cleanQ);
        const matchChapter = chapter.chapterTitle.toLowerCase().includes(cleanQ);
        const matchSubject = subject.title.toLowerCase().includes(cleanQ);
        const matchCategory = subject.category.toLowerCase().includes(cleanQ);
        const matchMethod = topic.recommendedMethod.toLowerCase().includes(cleanQ);

        if (matchName || matchChapter || matchSubject || matchCategory || matchMethod) {
          results.push({ subject, chapter, topic });
        }
      });
    });
  });

  return results;
}
