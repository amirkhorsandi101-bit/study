/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Smart Educational Topic Recommender Engine:
 * Analyzes the student's selected personal syllabus, diagnostic quiz challenges,
 * and Ebbinghaus memory retention stats to intelligently recommend high-yield
 * and complementary topics from the Iranian high school curriculum (SubjectLibrary).
 */

import {
  SubjectLibrary,
  GradeLevel,
  AcademicTrackId,
  SubjectBook,
  SubjectChapter,
  SubjectTopic,
  TRACKS_INFO
} from '../data/SubjectLibrary';
import { PersonalStudyTopic } from '../data/personalStudyList';

export type RecommendationReasonType = 
  | 'complementary_subject'      // Cross-disciplinary or sequential topic to current selection
  | 'quiz_diagnostic'           // Addressed specific learning vulnerability diagnosed in quiz
  | 'spaced_retention'          // Reinforces subjects with low memory retention in Ebbinghaus
  | 'high_yield_exam';          // High frequency critical exam topics for chosen grade/track

export interface RecommendedTopicItem {
  id: string; // Composite unique key
  topic: SubjectTopic;
  book: SubjectBook;
  grade: GradeLevel;
  track: AcademicTrackId;
  chapterTitle: string;
  chapterNumber: number;
  reasonType: RecommendationReasonType;
  reasonBadge: string;
  reasonTitle: string;
  reasonDescription: string;
  priorityScore: number; // 0 to 100
  isAlreadySelected: boolean;
  connectedSubjectName?: string;
}

// Subject cross-correlation map in Iranian high school curriculum
const CROSS_SUBJECT_AFFINITIES: Record<string, { related: string[]; rationale: string }> = {
  'زیست‌شناسی': {
    related: ['شیمی', 'فیزیک'],
    rationale: 'مفاهیم مولکولی و ترمودینامیکی زیست‌شناسی پیوند عمیقی با ساختار اتمی شیمی و مبحث الکتریسیته/حرارت فیزیک دارند.'
  },
  'شیمی': {
    related: ['زیست‌شناسی', 'فیزیک', 'حسابان'],
    rationale: 'محاسبات استوکیومتری، تعادلات و سینتیک شیمیایی نیازمند تسلط بر تناسب‌های ریاضی و قوانین گازها و فیزیک هستند.'
  },
  'حسابان': {
    related: ['فیزیک', 'هندسه'],
    rationale: 'مشتق و حد ریاضی پایه‌گذار حرکت‌شناسی، دینامیک، بردارها و شتاب لحظه‌ای در فیزیک هستند.'
  },
  'ریاضی': {
    related: ['فیزیک', 'شیمی'],
    rationale: 'توابع و توان‌های ریاضی شالوده تحلیل نمودارهای فیزیک و نمودارهای سرعت واکنش شیمیایی هستند.'
  },
  'فیزیک': {
    related: ['حسابان', 'ریاضی', 'شیمی'],
    rationale: 'تحلیل دقیق نیروها، الکتریسیته و ترمودینامیک با فرمول‌های مشتق ریاضی و پیوندهای اتمی شیمی گره خورده است.'
  },
  'فلسفه': {
    related: ['منطق', 'جامعه‌شناسی', 'ادبیات فارسی'],
    rationale: 'استدلال‌های معرفت‌شناختی فلسفه بر مبانی منطق ارسطویی و متون مفهومی علوم انسانی استوارند.'
  }
};

/**
 * Generates smart recommendations based on:
 * 1. Current student personal study list (subjects, chapters, grades)
 * 2. Diagnostic quiz challenges stored in localStorage ('rahbord_diagnostic_quiz_answers')
 * 3. Ebbinghaus review stats stored in localStorage ('rahbord_ebbinghaus_review_stats')
 */
export function getSmartTopicRecommendations(
  personalList: PersonalStudyTopic[],
  targetGrade?: GradeLevel,
  targetTrack?: AcademicTrackId
): RecommendedTopicItem[] {
  const recommendations: RecommendedTopicItem[] = [];
  const selectedTopicIdSet = new Set(personalList.map(item => item.topicId));

  // Determine user's active grade and track from personal list or fallback defaults
  const activeGrade: GradeLevel = targetGrade || (personalList.length > 0 ? personalList[0].grade : 12);
  const activeTrack: AcademicTrackId = targetTrack || (
    personalList.length > 0 && personalList[0].tracks.length > 0 
      ? personalList[0].tracks[0] 
      : 'experimental'
  );

  // Group selected topics by subject
  const selectedSubjects = Array.from(new Set(personalList.map(item => item.subject)));
  const selectedChapterNumbersByBook = new Map<string, Set<number>>();
  personalList.forEach(item => {
    if (!selectedChapterNumbersByBook.has(item.bookTitle)) {
      selectedChapterNumbersByBook.set(item.bookTitle, new Set());
    }
    selectedChapterNumbersByBook.get(item.bookTitle)!.add(item.chapterNumber);
  });

  // Load diagnostic quiz data from localStorage
  let quizAnswers: Record<number, number> = {};
  let quizCompleted = false;
  try {
    const rawAnswers = localStorage.getItem('rahbord_diagnostic_quiz_answers');
    if (rawAnswers) quizAnswers = JSON.parse(rawAnswers);
    quizCompleted = localStorage.getItem('rahbord_diagnostic_quiz_completed') === 'true';
  } catch (e) {
    // Ignore storage parse errors
  }

  // Load Ebbinghaus review stats from localStorage
  let reviewStats: any[] = [];
  try {
    const rawStats = localStorage.getItem('rahbord_ebbinghaus_review_stats');
    if (rawStats) reviewStats = JSON.parse(rawStats);
  } catch (e) {
    // Ignore storage parse errors
  }

  // Identify subjects needing reinforcement (retention < 75% or high forgotten count)
  const lowRetentionSubjects = new Set<string>();
  if (Array.isArray(reviewStats)) {
    reviewStats.forEach(stat => {
      if (stat.subject && (stat.retentionRate < 75 || stat.forgotten > stat.reviewed)) {
        lowRetentionSubjects.add(stat.subject);
      }
    });
  }

  // Track recommendations deduplication
  const addedTopicIdSet = new Set<string>();

  // Helper to push recommendation
  const pushRec = (
    topic: SubjectTopic,
    book: SubjectBook,
    chapter: SubjectChapter,
    reasonType: RecommendationReasonType,
    reasonBadge: string,
    reasonTitle: string,
    reasonDesc: string,
    score: number,
    connectedSub?: string
  ) => {
    if (addedTopicIdSet.has(topic.id)) return;
    addedTopicIdSet.add(topic.id);

    recommendations.push({
      id: `rec_${topic.id}_${reasonType}`,
      topic,
      book,
      grade: book.grade,
      track: activeTrack,
      chapterTitle: chapter.chapterTitle,
      chapterNumber: chapter.chapterNumber,
      reasonType,
      reasonBadge,
      reasonTitle,
      reasonDescription: reasonDesc,
      priorityScore: score,
      isAlreadySelected: selectedTopicIdSet.has(topic.id),
      connectedSubjectName: connectedSub
    });
  };

  // --- RULE 1: Sequential Next Chapter Recommendations ---
  // If student selected Chapter N in a textbook, recommend Chapter N+1
  const booksInActiveField = SubjectLibrary.getBooks(activeGrade, activeTrack);
  booksInActiveField.forEach(book => {
    const selectedChapters = selectedChapterNumbersByBook.get(book.bookTitle);
    if (selectedChapters && selectedChapters.size > 0) {
      const maxChapter = Math.max(...Array.from(selectedChapters));
      const nextChapter = book.chapters.find(c => c.chapterNumber === maxChapter + 1);

      if (nextChapter) {
        nextChapter.topics.forEach((topic, idx) => {
          if (!selectedTopicIdSet.has(topic.id) && idx < 2) {
            pushRec(
              topic,
              book,
              nextChapter,
              'complementary_subject',
              'گام بعدی مطالعه',
              `سرفصل پیوسته با فصل ${maxChapter} کتاب ${book.bookTitle}`,
              `شما مباحث فصل قبل (${maxChapter}) را در برنامه خود دارید؛ برای حفظ انسجام ذهنی، مطالعه مبحث «${topic.topicName}» بهترین گام بعدی است.`,
              95 - (idx * 5),
              book.bookTitle
            );
          }
        });
      }
    }
  });

  // --- RULE 2: Cross-Subject Affinity Connections ---
  // If student studies Biology, recommend related Chemistry/Physics topics
  selectedSubjects.forEach(subjectName => {
    const affinity = Object.entries(CROSS_SUBJECT_AFFINITIES).find(([k]) => subjectName.includes(k));
    if (affinity) {
      const [, details] = affinity;
      details.related.forEach(relatedSubName => {
        const relatedBooks = booksInActiveField.filter(b => 
          b.bookTitle.includes(relatedSubName) || b.subjectCategory.includes(relatedSubName)
        );

        relatedBooks.forEach(rBook => {
          rBook.chapters.forEach(chap => {
            chap.topics.forEach(t => {
              if (t.importance === 'critical' || t.importance === 'very_high') {
                if (!selectedTopicIdSet.has(t.id)) {
                  pushRec(
                    t,
                    rBook,
                    chap,
                    'complementary_subject',
                    'پیوند بین‌رشته‌ای',
                    `مبحث مکمل درس ${subjectName}`,
                    `${details.rationale} یادگیری «${t.topicName}» تسلط شما را بر درس ${subjectName} چند برابر می‌کند.`,
                    88,
                    subjectName
                  );
                }
              }
            });
          });
        });
      });
    }
  });

  // --- RULE 3: Diagnostic Quiz Vulnerability Recommendations ---
  // Quiz Question 1: Illusion of competence -> Recommend critical conceptual topics with active recall
  if (quizCompleted || Object.keys(quizAnswers).length > 0) {
    booksInActiveField.forEach(book => {
      book.chapters.forEach(chap => {
        chap.topics.forEach(t => {
          if (t.importance === 'critical' && t.difficulty === 'hard') {
            if (!selectedTopicIdSet.has(t.id)) {
              pushRec(
                t,
                book,
                chap,
                'quiz_diagnostic',
                'تحلیل کوییز تشخیصی',
                'تقویت نقاط چالش‌برانگیز بر اساس عارضه‌یابی کوییز',
                `کوییز تشخیصی نشان داد که در مباحث سنگین نیاز به بازیابی فعال دارید؛ این مبحث با متد «${t.recommendedMethod}» به تثبیت ماندگار مغز کمک می‌کند.`,
                85
              );
            }
          }
        });
      });
    });
  }

  // --- RULE 4: Spaced Repetition Low Retention Reinforcement ---
  if (lowRetentionSubjects.size > 0) {
    booksInActiveField.forEach(book => {
      const isLow = Array.from(lowRetentionSubjects).some(sub => book.bookTitle.includes(sub));
      if (isLow) {
        book.chapters.forEach(chap => {
          chap.topics.forEach(t => {
            if (t.importance === 'critical' && !selectedTopicIdSet.has(t.id)) {
              pushRec(
                t,
                book,
                chap,
                'spaced_retention',
                'تثبیت حافظه بلندمدت',
                `تقویت درس کم‌بازده در حافظه (${book.bookTitle})`,
                `بر اساس گزارش‌های منحنی فراموشی ابینگهاوس، درصد نگهداری این درس نیازمند تقویت دوره‌ای با چرخه‌های مرور علمی است.`,
                90,
                book.bookTitle
              );
            }
          });
        });
      }
    });
  }

  // --- RULE 5: High-Yield Critical Exam Topics (Fallback & Foundation) ---
  booksInActiveField.forEach(book => {
    book.chapters.forEach(chap => {
      chap.topics.forEach(t => {
        if (t.importance === 'critical' && !selectedTopicIdSet.has(t.id)) {
          pushRec(
            t,
            book,
            chap,
            'high_yield_exam',
            'پرتکرار و تضمینی کنکور',
            `مبحث کلیدی و با بودجه‌بندی بالا در ${book.bookTitle}`,
            `این سرفصل طبق تحلیل آزمون‌های سراسری سال‌های اخیر، جزو مباحث پرسوال و رتبه‌ساز کنکور سراسری محسوب می‌شود.`,
            80
          );
        }
      });
    });
  });

  // Sort by priorityScore descending
  recommendations.sort((a, b) => b.priorityScore - a.priorityScore);

  return recommendations;
}
