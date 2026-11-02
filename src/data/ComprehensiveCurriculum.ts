/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Official Comprehensive Iranian High School Curriculum Database (سرفصل‌های رسمی آموزش و پرورش)
 * Fully covers Grades 10, 11, and 12 across:
 * - Experimental Sciences (علوم تجربی)
 * - Mathematics and Physics (ریاضی و فیزیک)
 * - Humanities and Literature (ادبیات و علوم انسانی)
 */

import { SubjectBook } from './SubjectLibrary';

export const COMPREHENSIVE_BOOKS: SubjectBook[] = [
  {
    "id": "farsi_10",
    "bookTitle": "فارسی ۱",
    "subjectCategory": "ادبیات فارسی",
    "grade": 10,
    "tracks": [
      "experimental",
      "mathematics",
      "humanities"
    ],
    "isSpecialized": false,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: ادبیات تعلیمی",
        "topics": [
          {
            "id": "farsi10_c1_1",
            "topicName": "درس اول: چشمه",
            "recommendedMethod": "تحلیل آرایه‌های ادبی و واژه‌خوانی",
            "difficulty": "easy",
            "importance": "high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi10_c1_2",
            "topicName": "درس دوم: از آموختن، ننگ مدار",
            "recommendedMethod": "بررسی مفهوم حکایت و قرابت معنایی",
            "difficulty": "easy",
            "importance": "high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: ادبیات سفر و زندگی",
        "topics": [
          {
            "id": "farsi10_c2_1",
            "topicName": "درس سوم: سفر به بصره",
            "recommendedMethod": "تست واژگان سفرنامه ناصرخسرو و درک مطلب",
            "difficulty": "easy",
            "importance": "high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi10_c2_2",
            "topicName": "درس چهارم: مهر و وفا",
            "recommendedMethod": "تست قرابت معنایی و آرایه‌های ایهام و تضاد",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: ادبیات غنایی",
        "topics": [
          {
            "id": "farsi10_c3_1",
            "topicName": "درس پنجم: کلاس نقاشی",
            "recommendedMethod": "تحلیل سبک نثر معاصر سهراب سپهری",
            "difficulty": "easy",
            "importance": "medium",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi10_c3_2",
            "topicName": "درس ششم: بیداد ظالمان",
            "recommendedMethod": "بررسی مفاهیم ظلم‌ستیزی و نمادپردازی حافظ",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          }
        ]
      },
      {
        "chapterNumber": 4,
        "chapterTitle": "فصل چهارم: ادبیات پایداری",
        "topics": [
          {
            "id": "farsi10_c4_1",
            "topicName": "درس هفتم: جمال و کمال",
            "recommendedMethod": "بررسی واژگان عرفانی و تشبیهات تمثیلی",
            "difficulty": "easy",
            "importance": "high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi10_c4_2",
            "topicName": "درس هشتم: درس آزاد",
            "recommendedMethod": "تمرین واژه‌سازی و زبان‌شناسی",
            "difficulty": "easy",
            "importance": "medium",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          }
        ]
      },
      {
        "chapterNumber": 5,
        "chapterTitle": "فصل پنجم: ادبیات انقلاب اسلامی",
        "topics": [
          {
            "id": "farsi10_c5_1",
            "topicName": "درس نهم: دریادلان صف‌شکن",
            "recommendedMethod": "تحلیل متن روایی و تست املا",
            "difficulty": "easy",
            "importance": "medium",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi10_c5_2",
            "topicName": "درس دهم: خاک کاشان",
            "recommendedMethod": "بررسی نثرهای توصیفی و حس‌آمیزی",
            "difficulty": "easy",
            "importance": "medium",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          }
        ]
      },
      {
        "chapterNumber": 6,
        "chapterTitle": "فصل ششم: ادبیات حماسی",
        "topics": [
          {
            "id": "farsi10_c6_1",
            "topicName": "درس یازدهم: رستم و اشکبوس",
            "recommendedMethod": "تقطیع وزنی شاهنامه فردوسی، اغراق و واژگان کهن",
            "difficulty": "hard",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi10_c6_2",
            "topicName": "درس دوازدهم: گردآفرید",
            "recommendedMethod": "تحلیل شخصیت‌پردازی زن حماسه‌ساز در شاهنامه",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          }
        ]
      },
      {
        "chapterNumber": 7,
        "chapterTitle": "فصل هفتم: ادبیات داستانی",
        "topics": [
          {
            "id": "farsi10_c7_1",
            "topicName": "درس سیزدهم: طوطی و بقال",
            "recommendedMethod": "بررسی تمثیل مولانا و قیاس‌های باطل",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi10_c7_2",
            "topicName": "درس چهاردهم: خسرو",
            "recommendedMethod": "تحلیل لحن صمیمانه داستان معاصر محمدعلی اسلامی ندوشن",
            "difficulty": "easy",
            "importance": "high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          }
        ]
      },
      {
        "chapterNumber": 8,
        "chapterTitle": "فصل هشتم: ادبیات جهان",
        "topics": [
          {
            "id": "farsi10_c8_1",
            "topicName": "درس پانزدهم: کبوتر طوق‌دار",
            "recommendedMethod": "بررسی کلیله و دمنه، نثرهای تمثیلی کهن و دام‌گستری",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi10_c8_2",
            "topicName": "درس شانزدهم: پیرمرد و دریا",
            "recommendedMethod": "تحلیل شاهکار همینگوی، نمادهای استقامت و مبارزه",
            "difficulty": "easy",
            "importance": "high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi10_c8_3",
            "topicName": "درس هفدهم: سپیددندان",
            "recommendedMethod": "تحلیل رمان جک لندن و طبیعت‌گرایی",
            "difficulty": "easy",
            "importance": "medium",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi10_c8_4",
            "topicName": "درس هجدهم: دعای مادر",
            "recommendedMethod": "تحلیل قرابت معنایی نیکی به والدین و عواطف خانوادگی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "farsi_11",
    "bookTitle": "فارسی ۲",
    "subjectCategory": "ادبیات فارسی",
    "grade": 11,
    "tracks": [
      "experimental",
      "mathematics",
      "humanities"
    ],
    "isSpecialized": false,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: ادبیات تعلیمی",
        "topics": [
          {
            "id": "farsi11_c1_1",
            "topicName": "درس اول: نیکی",
            "recommendedMethod": "حفظ شعر و تقطیع وزنی مقدماتی",
            "difficulty": "easy",
            "importance": "high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi11_c1_2",
            "topicName": "درس دوم: قاضی بُست",
            "recommendedMethod": "بررسی لغات تاریخی و نثرهای کهن بیهقی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: ادبیات سفر و زندگی",
        "topics": [
          {
            "id": "farsi11_c2_1",
            "topicName": "درس سوم: در امواج سند",
            "recommendedMethod": "بررسی حس حماسی و لغات دشوار تاریخی",
            "difficulty": "easy",
            "importance": "high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi11_c2_2",
            "topicName": "درس چهارم: درس آزاد",
            "recommendedMethod": "مرور نگارش خلاقانه و ساختار واژه",
            "difficulty": "easy",
            "importance": "medium",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: ادبیات غنایی",
        "topics": [
          {
            "id": "farsi11_c3_1",
            "topicName": "درس پنجم: پروردهٔ عشق",
            "recommendedMethod": "بررسی منظومه لیلی و مجنون نظامی و قرابت عاطفی",
            "difficulty": "hard",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi11_c3_2",
            "topicName": "درس ششم: حماسهٔ آفتاب",
            "recommendedMethod": "آشنایی با شعر سپید و استعاره‌های نو",
            "difficulty": "easy",
            "importance": "high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          }
        ]
      },
      {
        "chapterNumber": 4,
        "chapterTitle": "فصل چهارم: ادبیات پایداری",
        "topics": [
          {
            "id": "farsi11_c4_1",
            "topicName": "درس هفتم: درس آزاد",
            "recommendedMethod": "مرور دستور زبان و نقش‌های دستوری",
            "difficulty": "easy",
            "importance": "medium",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi11_c4_2",
            "topicName": "درس هشتم: درازنای همواری",
            "recommendedMethod": "تحلیل نثر کهن تاریخی دکتر کزازی",
            "difficulty": "easy",
            "importance": "high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          }
        ]
      },
      {
        "chapterNumber": 5,
        "chapterTitle": "فصل پنجم: ادبیات انقلاب اسلامی",
        "topics": [
          {
            "id": "farsi11_c5_1",
            "topicName": "درس نهم: ذوق لطیف",
            "recommendedMethod": "بررسی ویژگی‌های نثر شهید مطهری",
            "difficulty": "easy",
            "importance": "medium",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi11_c5_2",
            "topicName": "درس دهم: سینه‌ام دکان آتش‌فشانی است",
            "recommendedMethod": "تحلیل مضامین مقاومت و استعاره",
            "difficulty": "easy",
            "importance": "high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          }
        ]
      },
      {
        "chapterNumber": 6,
        "chapterTitle": "فصل ششم: ادبیات حماسی",
        "topics": [
          {
            "id": "farsi11_c6_1",
            "topicName": "درس یازدهم: کاوهٔ دادخواه",
            "recommendedMethod": "بررسی تقابل ضحاک و کاوه، قرابت ظلم‌ستیزی",
            "difficulty": "hard",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi11_c6_2",
            "topicName": "درس دوازدهم: حملهٔ حیدری",
            "recommendedMethod": "تحلیل حماسه دینی باذل مشهدی",
            "difficulty": "easy",
            "importance": "high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          }
        ]
      },
      {
        "chapterNumber": 7,
        "chapterTitle": "فصل هفتم: ادبیات داستانی",
        "topics": [
          {
            "id": "farsi11_c7_1",
            "topicName": "درس سیزدهم: سووشون",
            "recommendedMethod": "تحلیل نمادهای رمان سیمین دانشور و فضای تاریخی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi11_c7_2",
            "topicName": "درس چهاردهم: کلبهٔ عمو توم",
            "recommendedMethod": "بررسی رمان ضدبرده‌داری و پیام‌های انسانی",
            "difficulty": "easy",
            "importance": "high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          }
        ]
      },
      {
        "chapterNumber": 8,
        "chapterTitle": "فصل هشتم: ادبیات جهان",
        "topics": [
          {
            "id": "farsi11_c8_1",
            "topicName": "درس پانزدهم: خاموشی دریا",
            "recommendedMethod": "بررسی داستان مقاومت فرانسه و لحن آرام اعتراضی",
            "difficulty": "easy",
            "importance": "high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi11_c8_2",
            "topicName": "درس شانزدهم: آناکارنینا",
            "recommendedMethod": "بررسی شاهکار تولستوی و روان‌شناسی شخصیت‌ها",
            "difficulty": "easy",
            "importance": "high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi11_c8_3",
            "topicName": "درس هفدهم: خاموشی دریا (بخش ۲)",
            "recommendedMethod": "تحلیل تکنیک گفت‌وگوی خاموش و زاویه دید",
            "difficulty": "easy",
            "importance": "medium",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi11_c8_4",
            "topicName": "درس هجدهم: مسافر",
            "recommendedMethod": "تحلیل منظومه فکری سهراب سپهری و سیر آفاق و انفس",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "farsi_12",
    "bookTitle": "فارسی ۳",
    "subjectCategory": "ادبیات فارسی",
    "grade": 12,
    "tracks": [
      "experimental",
      "mathematics",
      "humanities"
    ],
    "isSpecialized": false,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: ادبیات تعلیمی",
        "topics": [
          {
            "id": "farsi12_c1_1",
            "topicName": "درس اول: شکر نعمت",
            "recommendedMethod": "استخراج پیام‌های تعلیمی و قرابت معنایی",
            "difficulty": "hard",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi12_c1_2",
            "topicName": "درس دوم: مست و هشیار",
            "recommendedMethod": "تحلیل مناظره پروین اعتصامی و تست نمادها",
            "difficulty": "hard",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: ادبیات سفر و زندگی",
        "topics": [
          {
            "id": "farsi12_c2_1",
            "topicName": "درس سوم: آزادی",
            "recommendedMethod": "تحلیل غزل فرخی یزدی و مفاهیم آزادی‌خواهی",
            "difficulty": "hard",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi12_c2_2",
            "topicName": "درس چهارم: درس آزاد",
            "recommendedMethod": "تحلیل متن پژوهشی و مقاله‌نویسی",
            "difficulty": "easy",
            "importance": "medium",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: ادبیات غنایی",
        "topics": [
          {
            "id": "farsi12_c3_1",
            "topicName": "درس پنجم: دماوندیه",
            "recommendedMethod": "تحلیل قصیده بهار و آرایه‌های تشخیص و استعاره",
            "difficulty": "hard",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi12_c3_2",
            "topicName": "درس ششم: نی‌نامه",
            "recommendedMethod": "بررسی مثنوی معنوی مولانا و مفاهیم سیر و سلوک",
            "difficulty": "hard",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          }
        ]
      },
      {
        "chapterNumber": 4,
        "chapterTitle": "فصل چهارم: ادبیات پایداری",
        "topics": [
          {
            "id": "farsi12_c4_1",
            "topicName": "درس هفتم: درس آزاد",
            "recommendedMethod": "تمرین تست قرابت ترکیبی",
            "difficulty": "easy",
            "importance": "medium",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi12_c4_2",
            "topicName": "درس هشتم: از پاریز تا پاریس",
            "recommendedMethod": "بررسی نثر طنزآمیز و کنایات دکتر باستانی پاریزی",
            "difficulty": "easy",
            "importance": "high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          }
        ]
      },
      {
        "chapterNumber": 5,
        "chapterTitle": "فصل پنجم: ادبیات انقلاب اسلامی",
        "topics": [
          {
            "id": "farsi12_c5_1",
            "topicName": "درس نهم: کویر",
            "recommendedMethod": "تحلیل نثر شاعرانه دکتر شریعتی و تصویرسازی‌ها",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi12_c5_2",
            "topicName": "درس دهم: فصل شکوفایی",
            "recommendedMethod": "تحلیل شعر انقلاب و نمادهای بهار و رهایی",
            "difficulty": "easy",
            "importance": "high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          }
        ]
      },
      {
        "chapterNumber": 6,
        "chapterTitle": "فصل ششم: ادبیات حماسی",
        "topics": [
          {
            "id": "farsi12_c6_1",
            "topicName": "درس یازدهم: خوان هشتم",
            "recommendedMethod": "تحلیل شعر نیمایی اخوان ثالث و زبان کهن نو",
            "difficulty": "hard",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi12_c6_2",
            "topicName": "درس دوازدهم: کباب غاز",
            "recommendedMethod": "تحلیل داستان طنز جمال‌زاده، کنایات عامیانه و املا",
            "difficulty": "hard",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          }
        ]
      },
      {
        "chapterNumber": 7,
        "chapterTitle": "فصل هفتم: ادبیات داستانی",
        "topics": [
          {
            "id": "farsi12_c7_1",
            "topicName": "درس سیزدهم: ملکی مهاجر",
            "recommendedMethod": "بررسی لحن عاطفی و توصیفات نمادین",
            "difficulty": "easy",
            "importance": "high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi12_c7_2",
            "topicName": "درس چهاردهم: طلیعهٔ صبح",
            "recommendedMethod": "تحلیل عناصر داستان کوتاه و ساختار پیرنگ",
            "difficulty": "easy",
            "importance": "high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          }
        ]
      },
      {
        "chapterNumber": 8,
        "chapterTitle": "فصل هشتم: ادبیات جهان",
        "topics": [
          {
            "id": "farsi12_c8_1",
            "topicName": "درس پانزدهم: فرشتهٔ مهر",
            "recommendedMethod": "تحلیل مفاهیم ایثار و عطوفت انسانی",
            "difficulty": "easy",
            "importance": "high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi12_c8_2",
            "topicName": "درس شانزدهم: در غروبی ابدی",
            "recommendedMethod": "تحلیل توصیفات رمانتیک و ادبیات تطبیقی",
            "difficulty": "easy",
            "importance": "high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi12_c8_3",
            "topicName": "درس هفدهم: خنده‌ی تو",
            "recommendedMethod": "تحلیل شعر عاشقانه پابلو نرودا و تصویرسازی‌های حسی",
            "difficulty": "easy",
            "importance": "high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          },
          {
            "id": "farsi12_c8_4",
            "topicName": "درس هجدهم: روان روشن",
            "recommendedMethod": "تحلیل نهایی پیام‌های اخلاقی و قرابت ترکیبی کنکور",
            "difficulty": "hard",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "آرایه‌های ادبی",
              "دستور زبان",
              "قرابت معنایی",
              "املا و لغت"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "dini_10_stem",
    "bookTitle": "دین و زندگی ۱ (ریاضی و تجربی)",
    "subjectCategory": "دین و زندگی",
    "grade": 10,
    "tracks": [
      "experimental",
      "mathematics"
    ],
    "isSpecialized": false,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "مباحث و دروس دین و زندگی",
        "topics": [
          {
            "id": "dini_10_stem_l1",
            "topicName": "درس اول: هدف زندگی",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "easy",
            "importance": "critical",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_10_stem_l2",
            "topicName": "درس دوم: پر پرواز",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "easy",
            "importance": "critical",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_10_stem_l3",
            "topicName": "درس سوم: پنجره‌ای به روشنایی",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "easy",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_10_stem_l4",
            "topicName": "درس چهارم: آینده روشن",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "easy",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_10_stem_l5",
            "topicName": "درس پنجم: منزلگاه بعد",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_10_stem_l6",
            "topicName": "درس ششم: واقعه بزرگ",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_10_stem_l7",
            "topicName": "درس هفتم: فرجام کار",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_10_stem_l8",
            "topicName": "درس هشتم: آهنگ سفر",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_10_stem_l9",
            "topicName": "درس نهم: دوستی با خدا",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_10_stem_l10",
            "topicName": "درس دهم: یاری از نماز و روزه",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_10_stem_l11",
            "topicName": "درس یازدهم: فضیلت آراستگی",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_10_stem_l12",
            "topicName": "درس دوازدهم: زیبایی پوشیدگی",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "dini_10_hum",
    "bookTitle": "دین و زندگی ۱ (انسانی)",
    "subjectCategory": "دین و زندگی",
    "grade": 10,
    "tracks": [
      "humanities"
    ],
    "isSpecialized": false,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "مباحث و دروس دین و زندگی",
        "topics": [
          {
            "id": "dini_10_hum_l1",
            "topicName": "درس اول: هدف زندگی",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "easy",
            "importance": "critical",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_10_hum_l2",
            "topicName": "درس دوم: پر پرواز",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "easy",
            "importance": "critical",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_10_hum_l3",
            "topicName": "درس سوم: خود حقیقی",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "easy",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_10_hum_l4",
            "topicName": "درس چهارم: پنجره‌ای به روشنایی",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "easy",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_10_hum_l5",
            "topicName": "درس پنجم: آینده روشن",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_10_hum_l6",
            "topicName": "درس ششم: منزلگاه بعد",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_10_hum_l7",
            "topicName": "درس هفتم: واقعه بزرگ",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_10_hum_l8",
            "topicName": "درس هشتم: فرجام کار",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_10_hum_l9",
            "topicName": "درس نهم: آهنگ سفر",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_10_hum_l10",
            "topicName": "درس دهم: اعتماد بر او",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_10_hum_l11",
            "topicName": "درس یازدهم: دوستی با خدا",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_10_hum_l12",
            "topicName": "درس دوازدهم: یاری از نماز و روزه",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_10_hum_l13",
            "topicName": "درس سیزدهم: فضیلت آراستگی",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_10_hum_l14",
            "topicName": "درس چهاردهم: زیبایی پوشیدگی",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "dini_11_stem",
    "bookTitle": "دین و زندگی ۲ (ریاضی و تجربی)",
    "subjectCategory": "دین و زندگی",
    "grade": 11,
    "tracks": [
      "experimental",
      "mathematics"
    ],
    "isSpecialized": false,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "مباحث و دروس دین و زندگی",
        "topics": [
          {
            "id": "dini_11_stem_l1",
            "topicName": "درس اول: هدایت الهی",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "easy",
            "importance": "critical",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_11_stem_l2",
            "topicName": "درس دوم: تداوم هدایت",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "easy",
            "importance": "critical",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_11_stem_l3",
            "topicName": "درس سوم: معجزه جاویدان",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "easy",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_11_stem_l4",
            "topicName": "درس چهارم: مسئولیت‌های پیامبر (ص)",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "easy",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_11_stem_l5",
            "topicName": "درس پنجم: امامت، تداوم رسالت",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_11_stem_l6",
            "topicName": "درس ششم: پیشوایان اسوه",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_11_stem_l7",
            "topicName": "درس هفتم: وضعیت فرهنگی، اجتماعی و سیاسی مسلمانان، پس از رحلت رسول خدا (ص)",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_11_stem_l8",
            "topicName": "درس هشتم: احیای ارزش‌های راستین",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_11_stem_l9",
            "topicName": "درس نهم: عصر غیبت",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_11_stem_l10",
            "topicName": "درس دهم: مرجعیت و ولایت فقیه",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_11_stem_l11",
            "topicName": "درس یازدهم: عزت نفس",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_11_stem_l12",
            "topicName": "درس دوازدهم: پیوند مقدس",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "dini_11_hum",
    "bookTitle": "دین و زندگی ۲ (انسانی)",
    "subjectCategory": "دین و زندگی",
    "grade": 11,
    "tracks": [
      "humanities"
    ],
    "isSpecialized": false,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "مباحث و دروس دین و زندگی",
        "topics": [
          {
            "id": "dini_11_hum_l1",
            "topicName": "درس اول: هدایت الهی",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "easy",
            "importance": "critical",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_11_hum_l2",
            "topicName": "درس دوم: تداوم هدایت",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "easy",
            "importance": "critical",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_11_hum_l3",
            "topicName": "درس سوم: آخرین پیامبر",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "easy",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_11_hum_l4",
            "topicName": "درس چهارم: معجزه جاویدان",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "easy",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_11_hum_l5",
            "topicName": "درس پنجم: مسئولیت‌های پیامبر (ص)",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_11_hum_l6",
            "topicName": "درس ششم: پیشوای اسوه",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_11_hum_l7",
            "topicName": "درس هفتم: امامت، تداوم رسالت",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_11_hum_l8",
            "topicName": "درس هشتم: جان و جانشینی پیامبر (ص)",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_11_hum_l9",
            "topicName": "درس نهم: وضعیت فرهنگی، اجتماعی و سیاسی مسلمانان، پس از رحلت رسول خدا (ص)",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_11_hum_l10",
            "topicName": "درس دهم: احیای ارزش‌های راستین",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_11_hum_l11",
            "topicName": "درس یازدهم: عصر غیبت",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_11_hum_l12",
            "topicName": "درس دوازدهم: مرجعیت و ولایت فقیه",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "dini_12_stem",
    "bookTitle": "دین و زندگی ۳ (ریاضی و تجربی)",
    "subjectCategory": "دین و زندگی",
    "grade": 12,
    "tracks": [
      "experimental",
      "mathematics"
    ],
    "isSpecialized": false,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "مباحث و دروس دین و زندگی",
        "topics": [
          {
            "id": "dini_12_stem_l1",
            "topicName": "درس اول: هستی‌بخش",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "easy",
            "importance": "critical",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_12_stem_l2",
            "topicName": "درس دوم: یگانه بی‌همتا",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "easy",
            "importance": "critical",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_12_stem_l3",
            "topicName": "درس سوم: توحید و سبک زندگی",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "easy",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_12_stem_l4",
            "topicName": "درس چهارم: فقط برای او",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "easy",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_12_stem_l5",
            "topicName": "درس پنجم: قدرت پرواز",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_12_stem_l6",
            "topicName": "درس ششم: سنت‌های خداوند در زندگی",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_12_stem_l7",
            "topicName": "درس هفتم: بازگشت",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_12_stem_l8",
            "topicName": "درس هشتم: احکام الهی در زندگی امروز",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_12_stem_l9",
            "topicName": "درس نهم: پایه‌های استوار",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_12_stem_l10",
            "topicName": "درس دهم: تمدن جدید و مسئولیت ما",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "dini_12_hum",
    "bookTitle": "دین و زندگی ۳ (انسانی)",
    "subjectCategory": "دین و زندگی",
    "grade": 12,
    "tracks": [
      "humanities"
    ],
    "isSpecialized": false,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "مباحث و دروس دین و زندگی",
        "topics": [
          {
            "id": "dini_12_hum_l1",
            "topicName": "درس اول: هستی‌بخش",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "easy",
            "importance": "critical",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_12_hum_l2",
            "topicName": "درس دوم: یگانه بی‌همتا",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "easy",
            "importance": "critical",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_12_hum_l3",
            "topicName": "درس سوم: توحید و سبک زندگی",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "easy",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_12_hum_l4",
            "topicName": "درس چهارم: فقط برای او",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "easy",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_12_hum_l5",
            "topicName": "درس پنجم: قدرت پرواز",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_12_hum_l6",
            "topicName": "درس ششم: سنت‌های خداوند در زندگی",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_12_hum_l7",
            "topicName": "درس هفتم: در گرو کار خویش",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_12_hum_l8",
            "topicName": "درس هشتم: بازگشت",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_12_hum_l9",
            "topicName": "درس نهم: احکام الهی در زندگی امروز",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_12_hum_l10",
            "topicName": "درس دهم: پایه‌های استوار",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_12_hum_l11",
            "topicName": "درس یازدهم: عصر شکوفایی",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_12_hum_l12",
            "topicName": "درس دوازدهم: نگاهی به تمدن جدید",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          },
          {
            "id": "dini_12_hum_l13",
            "topicName": "درس سیزدهم: مسئولیت بزرگ ما",
            "recommendedMethod": "ارتباط آیات و روایات با متن درس و استخراج پیام‌های کلیدی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "پیام آیات",
              "احادیث و روایات",
              "توحید و معاد",
              "احکام عملی"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "arabi_10_stem",
    "bookTitle": "عربی، زبان قرآن ۱ (ریاضی و تجربی)",
    "subjectCategory": "عربی، زبان قرآن",
    "grade": 10,
    "tracks": [
      "experimental",
      "mathematics"
    ],
    "isSpecialized": false,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "دروس و متون عربی",
        "topics": [
          {
            "id": "arabi_10_stem_l1",
            "topicName": "درس ۱: قیمةُ العَمل",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_10_stem_l2",
            "topicName": "درس ۲: مَواعِظُ قَیِّمَةٌ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_10_stem_l3",
            "topicName": "درس ۳: مَطَرُ السَّمَکِ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_10_stem_l4",
            "topicName": "درس ۴: التَّعایُشُ السِّلْمیُّ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_10_stem_l5",
            "topicName": "درس ۵: هذا خَلقُ اللهِ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_10_stem_l6",
            "topicName": "درس ۶: ذوالقَرنَینِ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_10_stem_l7",
            "topicName": "درس ۷: یا مَن فی البِحارِ عجائِبُهُ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_10_stem_l8",
            "topicName": "درس ۸: صِناعَةُ التَّلمیعِ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "arabi_11_stem",
    "bookTitle": "عربی، زبان قرآن ۲ (ریاضی و تجربی)",
    "subjectCategory": "عربی، زبان قرآن",
    "grade": 11,
    "tracks": [
      "experimental",
      "mathematics"
    ],
    "isSpecialized": false,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "دروس و متون عربی",
        "topics": [
          {
            "id": "arabi_11_stem_l1",
            "topicName": "درس ۱: مِن آیاتِ الأخلاقِ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_11_stem_l2",
            "topicName": "درس ۲: فی مَحضَرِ المُعَلِّمِ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_11_stem_l3",
            "topicName": "درس ۳: عَجائِبُ الأشجارِ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_11_stem_l4",
            "topicName": "درس ۴: آدابُ الکَلامِ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_11_stem_l5",
            "topicName": "درس ۵: الصِّدقُ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_11_stem_l6",
            "topicName": "درس ۶: التَّجارةُ معَ اللهِ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_11_stem_l7",
            "topicName": "درس ۷: اِعلَموا أنَّ اللهَ یُحیی الأرضَ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "arabi_12_stem",
    "bookTitle": "عربی، زبان قرآن ۳ (ریاضی و تجربی)",
    "subjectCategory": "عربی، زبان قرآن",
    "grade": 12,
    "tracks": [
      "experimental",
      "mathematics"
    ],
    "isSpecialized": false,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "دروس و متون عربی",
        "topics": [
          {
            "id": "arabi_12_stem_l1",
            "topicName": "درس ۱: الدّینُ و النَّظافَةُ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_12_stem_l2",
            "topicName": "درس ۲: مَکَّةُ المُکَرَّمَةُ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_12_stem_l3",
            "topicName": "درس ۳: الشَّرَفُ فی العَمَلِ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_12_stem_l4",
            "topicName": "درس ۴: الفَرَزْدَقُ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "medium",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "arabi_10_hum",
    "bookTitle": "عربی، زبان قرآن ۱ (تخصصی انسانی)",
    "subjectCategory": "عربی، زبان قرآن",
    "grade": 10,
    "tracks": [
      "humanities"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "دروس و متون عربی",
        "topics": [
          {
            "id": "arabi_10_hum_l1",
            "topicName": "درس ۱: ذاکَ هُوَ اللهُ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "hard",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_10_hum_l2",
            "topicName": "درس ۲: إِنَّکُم مَسؤولونَ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "hard",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_10_hum_l3",
            "topicName": "درس ۳: مَطَرُ السَّمَکِ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "hard",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_10_hum_l4",
            "topicName": "درس ۴: اَلتَّعایُشُ السِّلمیُّ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "hard",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_10_hum_l5",
            "topicName": "درس ۵: هذا خَلقُ اللهِ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "hard",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_10_hum_l6",
            "topicName": "درس ۶: اَلمَعالِمُ الخَلّابَةُ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "hard",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_10_hum_l7",
            "topicName": "درس ۷: صِناعَةُ النِّفطِ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "hard",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_10_hum_l8",
            "topicName": "درس ۸: یا مَن فِی البِحارِ عَجائِبُهُ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "hard",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "arabi_11_hum",
    "bookTitle": "عربی، زبان قرآن ۲ (تخصصی انسانی)",
    "subjectCategory": "عربی، زبان قرآن",
    "grade": 11,
    "tracks": [
      "humanities"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "دروس و متون عربی",
        "topics": [
          {
            "id": "arabi_11_hum_l1",
            "topicName": "درس ۱: مَواعِظُ قَیِّمَةٌ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "hard",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_11_hum_l2",
            "topicName": "درس ۲: صِناعَةُ التَّلمیعِ فِی الأَدَبِ الفارِسیِّ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "hard",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_11_hum_l3",
            "topicName": "درس ۳: عَجائِبُ المَخلوقاتِ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "hard",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_11_hum_l4",
            "topicName": "درس ۴: تَأثیرُ اللُّغَةِ الفارِسیَّةِ عَلَی اللُّغَةِ العَرَبیَّةِ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "hard",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_11_hum_l5",
            "topicName": "درس ۵: اَلصِّدْقُ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "hard",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_11_hum_l6",
            "topicName": "درس ۶: اِرْحَموا ثَلاثاً",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "hard",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_11_hum_l7",
            "topicName": "درس ۷: لا تَقْنَطوا",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "hard",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "arabi_12_hum",
    "bookTitle": "عربی، زبان قرآن ۳ (تخصصی انسانی)",
    "subjectCategory": "عربی، زبان قرآن",
    "grade": 12,
    "tracks": [
      "humanities"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "دروس و متون عربی",
        "topics": [
          {
            "id": "arabi_12_hum_l1",
            "topicName": "درس ۱: مِنَ الأَشعارِ المَنسوبَةِ إِلَی الإِمامِ عَلِیٍّ (ع)",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "hard",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_12_hum_l2",
            "topicName": "درس ۲: الوَجهُ النّافِعُ وَ الوَجهُ المُضِرُّ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "hard",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_12_hum_l3",
            "topicName": "درس ۳: ثَلاثُ قِصَصٍ قَصیرَةٍ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "hard",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_12_hum_l4",
            "topicName": "درس ۴: نِظامُ الطَّبیعَةِ",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "hard",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          },
          {
            "id": "arabi_12_hum_l5",
            "topicName": "درس ۵: یا إلهی",
            "recommendedMethod": "ترجمه دقیق متن، قواعد اعراب و تحلیل صرفی و بلاغی",
            "difficulty": "hard",
            "importance": "very_high",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "ترجمه و تعریب",
              "قواعد فعل و اسم",
              "تحلیل صرفی",
              "درک مطلب"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "english_10",
    "bookTitle": "زبان انگلیسی ۱ (Vision 1)",
    "subjectCategory": "زبان انگلیسی",
    "grade": 10,
    "tracks": [
      "experimental",
      "mathematics",
      "humanities"
    ],
    "isSpecialized": false,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "دروس و واژگان انگلیسی",
        "topics": [
          {
            "id": "english_10_l1",
            "topicName": "Lesson 1: Saving Nature",
            "recommendedMethod": "فلش‌کارت لایتنر لغات جدید + حل تست گرامر و کلوز تست",
            "difficulty": "medium",
            "importance": "high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "Vocabulary",
              "Grammar",
              "Reading Comprehension",
              "Cloze Test"
            ]
          },
          {
            "id": "english_10_l2",
            "topicName": "Lesson 2: Wonders of Creation",
            "recommendedMethod": "فلش‌کارت لایتنر لغات جدید + حل تست گرامر و کلوز تست",
            "difficulty": "medium",
            "importance": "high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "Vocabulary",
              "Grammar",
              "Reading Comprehension",
              "Cloze Test"
            ]
          },
          {
            "id": "english_10_l3",
            "topicName": "Lesson 3: The Value of Knowledge",
            "recommendedMethod": "فلش‌کارت لایتنر لغات جدید + حل تست گرامر و کلوز تست",
            "difficulty": "medium",
            "importance": "high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "Vocabulary",
              "Grammar",
              "Reading Comprehension",
              "Cloze Test"
            ]
          },
          {
            "id": "english_10_l4",
            "topicName": "Lesson 4: Traveling the World",
            "recommendedMethod": "فلش‌کارت لایتنر لغات جدید + حل تست گرامر و کلوز تست",
            "difficulty": "medium",
            "importance": "high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "Vocabulary",
              "Grammar",
              "Reading Comprehension",
              "Cloze Test"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "english_11",
    "bookTitle": "زبان انگلیسی ۲ (Vision 2)",
    "subjectCategory": "زبان انگلیسی",
    "grade": 11,
    "tracks": [
      "experimental",
      "mathematics",
      "humanities"
    ],
    "isSpecialized": false,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "دروس و واژگان انگلیسی",
        "topics": [
          {
            "id": "english_11_l1",
            "topicName": "Lesson 1: Understanding People",
            "recommendedMethod": "فلش‌کارت لایتنر لغات جدید + حل تست گرامر و کلوز تست",
            "difficulty": "medium",
            "importance": "high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "Vocabulary",
              "Grammar",
              "Reading Comprehension",
              "Cloze Test"
            ]
          },
          {
            "id": "english_11_l2",
            "topicName": "Lesson 2: A Healthy Lifestyle",
            "recommendedMethod": "فلش‌کارت لایتنر لغات جدید + حل تست گرامر و کلوز تست",
            "difficulty": "medium",
            "importance": "high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "Vocabulary",
              "Grammar",
              "Reading Comprehension",
              "Cloze Test"
            ]
          },
          {
            "id": "english_11_l3",
            "topicName": "Lesson 3: Art and Culture",
            "recommendedMethod": "فلش‌کارت لایتنر لغات جدید + حل تست گرامر و کلوز تست",
            "difficulty": "medium",
            "importance": "high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "Vocabulary",
              "Grammar",
              "Reading Comprehension",
              "Cloze Test"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "english_12",
    "bookTitle": "زبان انگلیسی ۳ (Vision 3)",
    "subjectCategory": "زبان انگلیسی",
    "grade": 12,
    "tracks": [
      "experimental",
      "mathematics",
      "humanities"
    ],
    "isSpecialized": false,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "دروس و واژگان انگلیسی",
        "topics": [
          {
            "id": "english_12_l1",
            "topicName": "Lesson 1: Sense of Appreciation",
            "recommendedMethod": "فلش‌کارت لایتنر لغات جدید + حل تست گرامر و کلوز تست",
            "difficulty": "medium",
            "importance": "high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "Vocabulary",
              "Grammar",
              "Reading Comprehension",
              "Cloze Test"
            ]
          },
          {
            "id": "english_12_l2",
            "topicName": "Lesson 2: Look at the Future",
            "recommendedMethod": "فلش‌کارت لایتنر لغات جدید + حل تست گرامر و کلوز تست",
            "difficulty": "medium",
            "importance": "high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "Vocabulary",
              "Grammar",
              "Reading Comprehension",
              "Cloze Test"
            ]
          },
          {
            "id": "english_12_l3",
            "topicName": "Lesson 3: Renewable Energy",
            "recommendedMethod": "فلش‌کارت لایتنر لغات جدید + حل تست گرامر و کلوز تست",
            "difficulty": "medium",
            "importance": "high",
            "estimatedMinutes": 30,
            "keyConcepts": [
              "Vocabulary",
              "Grammar",
              "Reading Comprehension",
              "Cloze Test"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "health_12",
    "bookTitle": "سلامت و بهداشت",
    "subjectCategory": "سلامت و بهداشت",
    "grade": 12,
    "tracks": [
      "experimental",
      "mathematics",
      "humanities"
    ],
    "isSpecialized": false,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: سلامت",
        "topics": [
          {
            "id": "health12_c1_1",
            "topicName": "درس اول: سلامت چیست؟",
            "recommendedMethod": "مطالعه مفهومی ابعاد سلامت",
            "difficulty": "easy",
            "importance": "medium"
          },
          {
            "id": "health12_c1_2",
            "topicName": "درس دوم: سبک زندگی",
            "recommendedMethod": "تحلیل مؤلفه‌های سبک زندگی سالم",
            "difficulty": "easy",
            "importance": "medium"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: تغذیه سالم و بهداشت مواد غذایی",
        "topics": [
          {
            "id": "health12_c2_1",
            "topicName": "درس سوم: برنامه غذایی سالم",
            "recommendedMethod": "بررسی گروه‌های اصلی غذایی",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "health12_c2_2",
            "topicName": "درس چهارم: کنترل وزن و تناسب اندام",
            "recommendedMethod": "فرمول BMI و تعادل کالری",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "health12_c2_3",
            "topicName": "درس پنجم: بهداشت و ایمنی مواد غذایی",
            "recommendedMethod": "اصول نگهداری و فساد مواد غذایی",
            "difficulty": "easy",
            "importance": "medium"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: پیشگیری از بیماری‌ها",
        "topics": [
          {
            "id": "health12_c3_1",
            "topicName": "درس ششم: بیماری‌های غیرواگیر",
            "recommendedMethod": "تحلیل بیماری‌های قلبی، دیابت و سرطان",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "health12_c3_2",
            "topicName": "درس هفتم: بیماری‌های واگیر",
            "recommendedMethod": "روش‌های انتقال و واکسیناسیون",
            "difficulty": "medium",
            "importance": "high"
          }
        ]
      },
      {
        "chapterNumber": 4,
        "chapterTitle": "فصل چهارم: بهداشت در دوران نوجوانی",
        "topics": [
          {
            "id": "health12_c4_1",
            "topicName": "درس هشتم: بهداشت فردی",
            "recommendedMethod": "مراقبت‌های پوست و مو و بهداشت دهان",
            "difficulty": "easy",
            "importance": "medium"
          },
          {
            "id": "health12_c4_2",
            "topicName": "درس نهم: بهداشت ازدواج و باروری",
            "recommendedMethod": "بررسی ابعاد مشاوره ژنتیک",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "health12_c4_3",
            "topicName": "درس دهم: بهداشت روان",
            "recommendedMethod": "تکنیک‌های مدیریت استرس و تاب‌آوری",
            "difficulty": "medium",
            "importance": "high"
          }
        ]
      },
      {
        "chapterNumber": 5,
        "chapterTitle": "فصل پنجم: پیشگیری از رفتارهای پرخطر",
        "topics": [
          {
            "id": "health12_c5_1",
            "topicName": "درس یازدهم: مصرف دخانیات و الکل",
            "recommendedMethod": "بررسی عوارض فیزیولوژیک و روانی",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "health12_c5_2",
            "topicName": "درس دوازدهم: اعتیاد به مواد مخدر و عوارض آن",
            "recommendedMethod": "مکانیسم اعتیاد و پیشگیری",
            "difficulty": "medium",
            "importance": "high"
          }
        ]
      },
      {
        "chapterNumber": 6,
        "chapterTitle": "فصل ششم: محیط کار و زندگی سالم",
        "topics": [
          {
            "id": "health12_c6_1",
            "topicName": "درس سیزدهم: پیشگیری از اختلالات اسکلتی ـ عضلانی (کمردرد)",
            "recommendedMethod": "ارگونومی و پوسچر صحیح بدن",
            "difficulty": "easy",
            "importance": "medium"
          },
          {
            "id": "health12_c6_2",
            "topicName": "درس چهاردهم: پیشگیری از حوادث خانگی",
            "recommendedMethod": "اقدامات اولیه ایمنی و حوادث",
            "difficulty": "easy",
            "importance": "medium"
          }
        ]
      }
    ]
  },
  {
    "id": "social_identity_12",
    "bookTitle": "هویت اجتماعی",
    "subjectCategory": "علوم اجتماعی",
    "grade": 12,
    "tracks": [
      "experimental",
      "mathematics"
    ],
    "isSpecialized": false,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "دروس هویت اجتماعی",
        "topics": [
          {
            "id": "soc_id12_1",
            "topicName": "درس اول: کنش‌های ما",
            "recommendedMethod": "تحلیل مفهوم کنش ارادی و پیامدها",
            "difficulty": "easy",
            "importance": "medium"
          },
          {
            "id": "soc_id12_2",
            "topicName": "درس دوم: پدیده‌های اجتماعی",
            "recommendedMethod": "شکل‌گیری هنجارها و نهادها",
            "difficulty": "easy",
            "importance": "medium"
          },
          {
            "id": "soc_id12_3",
            "topicName": "درس سوم: جامعه و فرهنگ (جهان اجتماعی)",
            "recommendedMethod": "رابطه متقابل جامعه و فرهنگ",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "soc_id12_4",
            "topicName": "درس چهارم: ارزیابی فرهنگ‌ها",
            "recommendedMethod": "فرهنگ آرمانی در برابر واقعی",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "soc_id12_5",
            "topicName": "درس پنجم: هویت",
            "recommendedMethod": "هویت فردی و اجتماعی",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "soc_id12_6",
            "topicName": "درس ششم: بازتولید هویت اجتماعی",
            "recommendedMethod": "جامعه‌پذیری و کنترل اجتماعی",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "soc_id12_7",
            "topicName": "درس هفتم: تحولات هویتی جامعه",
            "recommendedMethod": "تحولات درونی و بحران هویت",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "soc_id12_8",
            "topicName": "درس هشتم: بعد فرهنگی هویت ایران",
            "recommendedMethod": "پیشینه هویتی و تمدن ایرانی اسلامی",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "soc_id12_9",
            "topicName": "درس نهم: بعد سیاسی هویت ایران",
            "recommendedMethod": "استقلال سیاسی و مقاومت ملی",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "soc_id12_10",
            "topicName": "درس دهم: ابعاد جمعیتی و اقتصادی هویت ایران",
            "recommendedMethod": "تحلیل هرم سنی و ظرفیت اقتصادی",
            "difficulty": "medium",
            "importance": "high"
          }
        ]
      }
    ]
  },
  {
    "id": "bio_10",
    "bookTitle": "زیست‌شناسی ۱",
    "subjectCategory": "زیست‌شناسی",
    "grade": 10,
    "tracks": [
      "experimental"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: دنیای زنده",
        "topics": [
          {
            "id": "bio10_c1_1",
            "topicName": "گفتار اول: زیست‌شناسی چیست؟",
            "recommendedMethod": "نگرش علمی و سطوح ساختاری حیات",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "bio10_c1_2",
            "topicName": "گفتار دوم: گستره حیات",
            "recommendedMethod": "بوم‌سازگان و تنوع زیستی",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "bio10_c1_3",
            "topicName": "گفتار سوم: یاخته و بافت در بدن انسان",
            "recommendedMethod": "انواع بافت‌های اصلی جانوری (پوششی، پیوندی، ماهیچه‌ای، عصبی)",
            "difficulty": "medium",
            "importance": "very_high"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: گوارش و جذب مواد",
        "topics": [
          {
            "id": "bio10_c2_1",
            "topicName": "گفتار اول: ساختار و عملکرد لوله گوارش",
            "recommendedMethod": "بافت‌شناسی لوله گوارش و حرکات دودی و قطعه‌قطعه کننده",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "bio10_c2_2",
            "topicName": "گفتار دوم: جذب مواد و تنظیم فعالیت دستگاه گوارش",
            "recommendedMethod": "مکانیسم‌های ترشح هورمون‌ها (گاسترین، سکرتین) و جذب در روده",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "bio10_c2_3",
            "topicName": "گفتار سوم: تنوع گوارش در جانداران",
            "recommendedMethod": "مقایسه واکوئول گوارشی، کیسه گوارشی و لوله گوارش پرندگان و نشخوارکنندگان",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: تبادلات گازی",
        "topics": [
          {
            "id": "bio10_c3_1",
            "topicName": "گفتار اول: سازوکار دستگاه تنفس در انسان",
            "recommendedMethod": "آناتومی نایژه‌ها و کیسه‌های حبابکی و پرده جنب",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "bio10_c3_2",
            "topicName": "گفتار دوم: تهویه ششی",
            "recommendedMethod": "محاسبه حجم‌ها و ظرفیت‌های تنفسی در اسپیروگرام و انتقال گازها در خون",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "bio10_c3_3",
            "topicName": "گفتار سوم: تنوع تبادلات گازی",
            "recommendedMethod": "مقایسه تنفس پوستی، نایدیسی، آبششی و ششی در جانوران",
            "difficulty": "medium",
            "importance": "high"
          }
        ]
      },
      {
        "chapterNumber": 4,
        "chapterTitle": "فصل چهارم: گردش مواد در بدن",
        "topics": [
          {
            "id": "bio10_c4_1",
            "topicName": "گفتار اول: قلب",
            "recommendedMethod": "آناتومی دریچه‌ها، بافت هادی قلب و دوره انقباض قلبی (الکتروکاردیوگرام)",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "bio10_c4_2",
            "topicName": "گفتار دوم: رگ‌ها",
            "recommendedMethod": "مقایسه سرخرگ‌ها، سیاهرگ‌ها و مویرگ‌ها و فشار تراوش اسمزی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "bio10_c4_3",
            "topicName": "گفتار سوم: خون",
            "recommendedMethod": "گویچه‌های قرمز و سفید، پلاکت‌ها و گروه‌های خونی ABO و Rh",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "bio10_c4_4",
            "topicName": "گفتار چهارم: تنوع گردش مواد در جانداران",
            "recommendedMethod": "سامانه باز و بسته، گردش خون ساده ماهی در برابر مضاعف دوزیستان و پستانداران",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 5,
        "chapterTitle": "فصل پنجم: تنظیم اسمزی و دفع مواد زائد",
        "topics": [
          {
            "id": "bio10_c5_1",
            "topicName": "گفتار اول: هم‌ایستایی و کلیه‌ها",
            "recommendedMethod": "آناتومی کلیه و ساختار گردیزه (نفرون)",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "bio10_c5_2",
            "topicName": "گفتار دوم: تشکیل ادرار و تخلیه آن",
            "recommendedMethod": "تراوش، بازجذب، ترشح و تنظیم اسمزی خون",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "bio10_c5_3",
            "topicName": "گفتار سوم: تنوع دفع و تنظیم اسمزی در جانداران",
            "recommendedMethod": "نفریدی، لوله‌های مالپیگی و مقایسه دفع آمونیاک، اوره و اسیداوریک",
            "difficulty": "medium",
            "importance": "high"
          }
        ]
      },
      {
        "chapterNumber": 6,
        "chapterTitle": "فصل ششم: از یاخته تا گیاه",
        "topics": [
          {
            "id": "bio10_c6_1",
            "topicName": "گفتار اول: ویژگی‌های یاخته گیاهی",
            "recommendedMethod": "دیواره یاخته‌ای، پلاسمودسم، واکوئول و دیسه‌ها (پلاست‌ها)",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "bio10_c6_2",
            "topicName": "گفتار دوم: سامانه بافتی",
            "recommendedMethod": "سامانه بافت پوششی، زمینه‌ای (پارانشیم، کلانشیم، اسکلرانشیم) و آوندی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "bio10_c6_3",
            "topicName": "گفتار سوم: ساختار گیاهان",
            "recommendedMethod": "مریستم‌های پسین و نخستین و رشد طولی و قطری در ریشه و ساقه",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 7,
        "chapterTitle": "فصل هفتم: جذب و انتقال مواد در گیاهان",
        "topics": [
          {
            "id": "bio10_c7_1",
            "topicName": "گفتار اول: تغذیه گیاهی",
            "recommendedMethod": "مواد مغذی مورد نیاز گیاه و خاک‌های اسیدی و بازی",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "bio10_c7_2",
            "topicName": "گفتار دوم: جانداران مؤثر در تغذیه گیاهی",
            "recommendedMethod": "قارچ‌ریشه (میکوریزا)، باکتری‌های تثبیت‌کننده نیتروژن (ریزوبیوم)",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "bio10_c7_3",
            "topicName": "گفتار سوم: انتقال مواد در گیاهان",
            "recommendedMethod": "مسیرهای آپوپلاستی و سیمپلاستی و نظریه کشش تعریق در آوندهای چوبی",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      }
    ]
  },
  {
    "id": "bio_11",
    "bookTitle": "زیست‌شناسی ۲",
    "subjectCategory": "زیست‌شناسی",
    "grade": 11,
    "tracks": [
      "experimental"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: تنظیم عصبی",
        "topics": [
          {
            "id": "bio11_c1_1",
            "topicName": "گفتار اول: یاخته‌های بافت عصبی",
            "recommendedMethod": "پتانسیل آرامش، پتانسیل عمل، انتقال پیام در سیناپس",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "bio11_c1_2",
            "topicName": "گفتار دوم: ساختار دستگاه عصبی",
            "recommendedMethod": "مغز، نخاع، اعصاب پیکری و خودمختار (سمپاتیک و پاراسمپاتیک)",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: حواس",
        "topics": [
          {
            "id": "bio11_c2_1",
            "topicName": "گفتار اول: گیرنده‌های حسی",
            "recommendedMethod": "انواع گیرنده‌ها و انطباق حسی",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "bio11_c2_2",
            "topicName": "گفتار دوم: حواس ویژه",
            "recommendedMethod": "آناتومی چشم (تطابق، عیوب انکساری)، گوش (شنوایی، تعادل) و چشایی و بویایی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "bio11_c2_3",
            "topicName": "گفتار سوم: گیرنده‌های حسی جانوران",
            "recommendedMethod": "خط جانبی ماهی، چشم مرکب حشرات و گیرنده فروسرخ مار زنگی",
            "difficulty": "medium",
            "importance": "high"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: دستگاه حرکتی",
        "topics": [
          {
            "id": "bio11_c3_1",
            "topicName": "گفتار اول: استخوان‌ها و اسکلت",
            "recommendedMethod": "بافت استخوانی متراکم و اسفنجی، مفصل‌ها و رباط‌ها",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "bio11_c3_2",
            "topicName": "گفتار دوم: ماهیچه و حرکت",
            "recommendedMethod": "سارکومر، پل‌های اتصالی اکتین و میوزین و مکانیسم انقباض عضلانی",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 4,
        "chapterTitle": "فصل چهارم: تنظیم شیمیایی",
        "topics": [
          {
            "id": "bio11_c4_1",
            "topicName": "گفتار اول: ارتباط شیمیایی",
            "recommendedMethod": "هورمون‌های موضعی در برابر درون‌ریز و هورمون‌های استروئیدی و پپتیدی",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "bio11_c4_2",
            "topicName": "گفتار دوم: غده‌های درون‌ریز",
            "recommendedMethod": "هیپوتالاموس، هیپوفیز، تیروئید، پاراتیروئید، فوق کلیه و لوزالمعده (انسولین/گلوکاگون)",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 5,
        "chapterTitle": "فصل پنجم: ایمنی",
        "topics": [
          {
            "id": "bio11_c5_1",
            "topicName": "گفتار اول: نخستین خط دفاعی: ورود ممنوع",
            "recommendedMethod": "پوست، ترشحات مخاطی، آنزیم لیزوزیم و اسید معده",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "bio11_c5_2",
            "topicName": "گفتار دوم: دومین خط دفاعی: واکنش‌های عمومی اما سریع",
            "recommendedMethod": "پاسخ التهابی، پروتئین‌های مکمل، اینترفرون و بیگlogخوارها",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "bio11_c5_3",
            "topicName": "گفتار سوم: سومین خط دفاعی: دفاع اختصاصی",
            "recommendedMethod": "لنفوسیت‌های B و T، پادتن‌ها، ایمنی هومورال و سلولی و ایمنی‌زایی واکسن",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 6,
        "chapterTitle": "فصل ششم: تقسیم یاخته",
        "topics": [
          {
            "id": "bio11_c6_1",
            "topicName": "گفتار اول: کروموزوم",
            "recommendedMethod": "ساختار کروماتین، هیستون‌ها، چرخه یاخته‌ای و نقاط وارسی",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "bio11_c6_2",
            "topicName": "گفتار دوم: میتوز",
            "recommendedMethod": "مراحل پروفاز، پرومتافاز، متافاز، آنافاز و تلوفاز و تقسیم سیتوپلاسم",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "bio11_c6_3",
            "topicName": "گفتار سوم: میوز و تولیدمثل جنسی",
            "recommendedMethod": "میوز ۱ و میوز ۲، کراسینگ‌اور و تفکیک کروموزوم‌ها و ناهنجاری‌های کروموزومی",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 7,
        "chapterTitle": "فصل هفتم: تولیدمثل",
        "topics": [
          {
            "id": "bio11_c7_1",
            "topicName": "گفتار اول: دستگاه تولیدمثل در مرد",
            "recommendedMethod": "بیضه‌ها، لوله‌های اسپرم‌ساز و تنظیم هورمونی تستوسترون، LH و FSH",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "bio11_c7_2",
            "topicName": "گفتار دوم: دستگاه تولیدمثل در زن",
            "recommendedMethod": "تخمدان‌ها، چرخه جنسی تخمدانی و رحمی و نوسانات استروژن و پروژسترون",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "bio11_c7_3",
            "topicName": "گفتار سوم: رشد و نمو جنین",
            "recommendedMethod": "لقاح، بلاستوسیست، لانه‌گزینی، جفت و پرده‌های جنینی",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "bio11_c7_4",
            "topicName": "گفتار چهارم: تولیدمثل در جانوران",
            "recommendedMethod": "لقاح داخلی و خارجی، بکرزایی، تخم‌گذاری و زنده‌زایی در جانوران",
            "difficulty": "medium",
            "importance": "high"
          }
        ]
      },
      {
        "chapterNumber": 8,
        "chapterTitle": "فصل هشتم: تولیدمثل نهان‌دانگان",
        "topics": [
          {
            "id": "bio11_c8_1",
            "topicName": "گفتار اول: تولیدمثل غیرجنسی",
            "recommendedMethod": "ساقه‌های تغییر شکل‌یافته (زمین‌ساقه، پیاز، بنه، غده)",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "bio11_c8_2",
            "topicName": "گفتار دوم: تولیدمثل جنسی",
            "recommendedMethod": "ساختار گل، تشکیل دانه گرده، کیسه جنینی و لقاح مضاعف",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "bio11_c8_3",
            "topicName": "گفتار سوم: از یاخته تخم تا گیاه",
            "recommendedMethod": "تشکیل رویان، دانه و رویش دانه‌ها در دولپه‌ای‌ها و تک‌لپه‌ای‌ها",
            "difficulty": "medium",
            "importance": "very_high"
          }
        ]
      },
      {
        "chapterNumber": 9,
        "chapterTitle": "فصل نهم: پاسخ گیاهان به محرک‌ها",
        "topics": [
          {
            "id": "bio11_c9_1",
            "topicName": "گفتار اول: تنظیم‌کننده‌های رشد در گیاهان",
            "recommendedMethod": "اکسین، سیتوکینین، جیبرلین در برابر آبسیزیک اسید و اتیلن",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "bio11_c9_2",
            "topicName": "گفتار دوم: پاسخ به محیط",
            "recommendedMethod": "نورگرایی، زمین‌گرایی، گیاهان روزکوتاه و روزبلند و پاسخ به بویایی گیاهی",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      }
    ]
  },
  {
    "id": "bio_12",
    "bookTitle": "زیست‌شناسی ۳",
    "subjectCategory": "زیست‌شناسی",
    "grade": 12,
    "tracks": [
      "experimental"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: مولکول‌های اطلاعاتی",
        "topics": [
          {
            "id": "bio12_c1_1",
            "topicName": "گفتار اول: نوکلئیک اسیدها",
            "recommendedMethod": "آزمایش‌های ایوری، ساختار نوکلئوتیدها و پیوند فسفودی‌استر",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "bio12_c1_2",
            "topicName": "گفتار دوم: همانندسازی دِنا",
            "recommendedMethod": "دنابسپاراز (DNA Polymerase)، دوراهی همانندسازی و ویرایش",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "bio12_c1_3",
            "topicName": "گفتار سوم: پروتئین‌ها",
            "recommendedMethod": "سطوح ساختاری پروتئین‌ها (اول تا چهارم)، پیوندهای پپتیدی و آنزیم‌ها",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: جریان اطلاعات در یاخته",
        "topics": [
          {
            "id": "bio12_c2_1",
            "topicName": "گفتار اول: رونویسی",
            "recommendedMethod": "مراحل آغاز، طویل‌شدن، پایان رونویسی و پیرایش رنا (RNA Splicing)",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "bio12_c2_2",
            "topicName": "گفتار دوم: به سوی پروتئین",
            "recommendedMethod": "کدون‌ها، رنای ناقل (tRNA)، جایگاه‌های ریبوزوم و مراحل ترجمه",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "bio12_c2_3",
            "topicName": "گفتار سوم: تنظیم بیان ژن",
            "recommendedMethod": "اپران لک در باکتری و تنظیم رونویسی در یوکاریوت‌ها (عوامل رونویسی)",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: انتقال اطلاعات در نسل‌ها",
        "topics": [
          {
            "id": "bio12_c3_1",
            "topicName": "گفتار اول: مفاهیم پایه",
            "recommendedMethod": "ژن، آلل، رخ‌نمود و ژن‌نمود، بارزیت و نهفتگی، حل شجره‌نامه (پدیگری)",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "bio12_c3_2",
            "topicName": "گفتار دوم: انواع صفات",
            "recommendedMethod": "صفات اتوزومی و وابسته به جنس، بارزیت ناقص، هم‌توانی و چندژنی",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 4,
        "chapterTitle": "فصل چهارم: تغییر در اطلاعات وراثتی",
        "topics": [
          {
            "id": "bio12_c4_1",
            "topicName": "گفتار اول: تغییر در ماده وراثتی جانداران",
            "recommendedMethod": "جهش‌های نقطه‌ای (جانشینی، اضافه و حذف) و جهش‌های بزرگ کروموزومی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "bio12_c4_2",
            "topicName": "گفتار دوم: تغییر در جمعیت‌ها",
            "recommendedMethod": "رانش ژن، شارش ژن، انتخاب طبیعی و تعادل هاردی-واینبرگ",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "bio12_c4_3",
            "topicName": "گفتار سوم: تغییر در گونه‌ها",
            "recommendedMethod": "گونه‌زایی هم‌میهن و دگرمیهن و سدهای پیش‌زیگوتی و پس‌زیگوتی",
            "difficulty": "medium",
            "importance": "very_high"
          }
        ]
      },
      {
        "chapterNumber": 5,
        "chapterTitle": "فصل پنجم: از ماده به انرژی",
        "topics": [
          {
            "id": "bio12_c5_1",
            "topicName": "گفتار اول: تأمین انرژی",
            "recommendedMethod": "گلیکولیز (قندکافت)، اکسایش پیرووات و تولید ATP",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "bio12_c5_2",
            "topicName": "گفتار دوم: اکسایش بیشتر",
            "recommendedMethod": "چرخه کربس، زنجیره انتقال الکترون میتوکندری و اسمز شیمیایی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "bio12_c5_3",
            "topicName": "گفتار سوم: زیستن مستقل از اکسیژن",
            "recommendedMethod": "تخمیر الکلی و تخمیر لاکتیکی در عضلات و میکروارگانیسم‌ها",
            "difficulty": "medium",
            "importance": "very_high"
          }
        ]
      },
      {
        "chapterNumber": 6,
        "chapterTitle": "فصل ششم: از انرژی به ماده",
        "topics": [
          {
            "id": "bio12_c6_1",
            "topicName": "گفتار اول: فتوسنتز: تبدیل انرژی نور به انرژی شیمیایی",
            "recommendedMethod": "تیلاکوئید، رنگیزه‌ها، فتوسیستم ۱ و ۲ و تشکیل NADPH و ATP",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "bio12_c6_2",
            "topicName": "گفتار دوم: واکنش‌های فتوسنتزی",
            "recommendedMethod": "چرخه کالوین در استروما و تثبیت دی‌اکسید کربن توسط آنزیم روبیسکو",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "bio12_c6_3",
            "topicName": "گفتار سوم: فتوسنتز در شرایط دشوار",
            "recommendedMethod": "تنفس نوری، مقایسه گیاهان C3، C4 و CAM در اقلیم‌های خشک",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 7,
        "chapterTitle": "فصل هفتم: فناوری‌های نوین زیستی",
        "topics": [
          {
            "id": "bio12_c7_1",
            "topicName": "گفتار اول: زیست‌فناوری و مهندسی ژنتیک",
            "recommendedMethod": "آنزیم‌های برش‌دهنده، لیگاز، پلاسمید و مراحل تولید DNA نوترکیب",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "bio12_c7_2",
            "topicName": "گفتار دوم: فناوری مهندسی پروتئین و بافت",
            "recommendedMethod": "کشت بافت، سلول‌های بنیادی و پروتئین‌های نوترکیب دارویی",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "bio12_c7_3",
            "topicName": "گفتار سوم: کاربردهای زیست‌فناوری",
            "recommendedMethod": "کاربرد در کشاورزی، پزشکی قانونی و الکتروفورز ژل",
            "difficulty": "medium",
            "importance": "high"
          }
        ]
      },
      {
        "chapterNumber": 8,
        "chapterTitle": "فصل هشتم: رفتارهای جانوران",
        "topics": [
          {
            "id": "bio12_c8_1",
            "topicName": "گفتار اول: اساس رفتار",
            "recommendedMethod": "الگوی عمل ثابت، خوگیری، شرطی‌شدن کلاسیک و فعال و حل مسئله",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "bio12_c8_2",
            "topicName": "گفتار دوم: انتخاب طبیعی و رفتار",
            "recommendedMethod": "رفتار غذایابی بهینه، جفت‌یابی و انتخاب جنسی",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "bio12_c8_3",
            "topicName": "گفتار سوم: ارتباط و زندگی گروهی",
            "recommendedMethod": "فرومون‌ها، رقص زنبورهای عسل و رفتارهای دگرخواهی و ایثار",
            "difficulty": "medium",
            "importance": "high"
          }
        ]
      }
    ]
  },
  {
    "id": "math_10_stem",
    "bookTitle": "ریاضی ۱ (مشترک تجربی و ریاضی)",
    "subjectCategory": "ریاضی",
    "grade": 10,
    "tracks": [
      "experimental",
      "mathematics"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: مجموعه، الگو و دنباله",
        "topics": [
          {
            "id": "m10_c1_1",
            "topicName": "درس اول: مجموعه‌های متناهی و نامتناهی",
            "recommendedMethod": "حل مسائل مرزهای بازه و اعداد گنگ و حقیقی",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "m10_c1_2",
            "topicName": "درس دوم: متمم یک مجموعه",
            "recommendedMethod": "جبر مجموعه‌ها، قوانین دمورگان و نمودار ون",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "m10_c1_3",
            "topicName": "درس سوم: الگو و دنباله",
            "recommendedMethod": "فرمول جملات عمومی دنباله‌ها و الگوهای هندسی",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "m10_c1_4",
            "topicName": "درس چهارم: دنباله‌های حسابی و هندسی",
            "recommendedMethod": "حل واسطه‌های حسابی و هندسی و تست‌های ترکیبی",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: مثلثات",
        "topics": [
          {
            "id": "m10_c2_1",
            "topicName": "درس اول: نسبت‌های مثلثاتی",
            "recommendedMethod": "مثلث قائم‌الزاویه و محاسبه سینوس، کسینوس، تانژانت، کتانژانت",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "m10_c2_2",
            "topicName": "درس دوم: دایره مثلثاتی",
            "recommendedMethod": "تعیین علامت در چهار ناحیه و شیب خط و تانژانت",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "m10_c2_3",
            "topicName": "درس سوم: روابط بین نسبت‌های مثلثاتی",
            "recommendedMethod": "اتحادهای پایه‌ای مثلثات و ساده‌سازی عبارات",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: توان‌های گویا و عبارت‌های جبری",
        "topics": [
          {
            "id": "m10_c3_1",
            "topicName": "درس اول: ریشه و توان",
            "recommendedMethod": "قوانین توان‌های صحیح و منفی",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "m10_c3_2",
            "topicName": "درس دوم: ریشه nام",
            "recommendedMethod": "ویژگی‌های رادیکال‌ها با فرجه‌های زوج و فرد",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "m10_c3_3",
            "topicName": "درس سوم: توان‌های گویا",
            "recommendedMethod": "تبدیل رادیکال به توان کسری و برعکس",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "m10_c3_4",
            "topicName": "درس چهارم: عبارت‌های جبری",
            "recommendedMethod": "اتحاد چاق و لاغر، اتحاد مکعب و گویا کردن مخرج کسرها",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 4,
        "chapterTitle": "فصل چهارم: معادله‌ها و نامعادله‌ها",
        "topics": [
          {
            "id": "m10_c4_1",
            "topicName": "درس اول: معادله درجه دوم و روش‌های مختلف حل آن",
            "recommendedMethod": "روش دلتا، فاکتورگیری، مربع کامل و روابط مجموع و ضرب ریشه‌ها",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "m10_c4_2",
            "topicName": "درس دوم: سهمی",
            "recommendedMethod": "رأس سهمی، خط تقارن و رسم نمودار سهمی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "m10_c4_3",
            "topicName": "درس سوم: تعیین علامت",
            "recommendedMethod": "جدول تعیین علامت نامعادلات کسری و قدرمطلقی",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 5,
        "chapterTitle": "فصل پنجم: تابع",
        "topics": [
          {
            "id": "m10_c5_1",
            "topicName": "درس اول: مفهوم تابع و بازنمایی‌های آن",
            "recommendedMethod": "تعریف تابع با زوج مرتب، نمودار پیکانی و خطوط موازی محور y",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "m10_c5_2",
            "topicName": "درس دوم: دامنه و برد توابع",
            "recommendedMethod": "محاسبه دامنه توابع کسری و رادیکالی فرجه زوج",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "m10_c5_3",
            "topicName": "درس سوم: انواع توابع",
            "recommendedMethod": "تابع خطی، تابع ثابت، تابع همانی و چندضابطه‌ای",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 6,
        "chapterTitle": "فصل ششم: شمارش، بدون شمردن",
        "topics": [
          {
            "id": "m10_c6_1",
            "topicName": "درس اول: شمارش",
            "recommendedMethod": "اصل جمع و اصل ضرب",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "m10_c6_2",
            "topicName": "درس دوم: جایگشت",
            "recommendedMethod": "محاسبه جایگشت‌های خطی و اشیای متمایز (فاکتوریل)",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "m10_c6_3",
            "topicName": "درس سوم: ترکیب",
            "recommendedMethod": "فرمول انتخاب r از n و حل مسائل قرعه‌کشی و هندسی",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 7,
        "chapterTitle": "فصل هفتم: آمار و احتمال",
        "topics": [
          {
            "id": "m10_c7_1",
            "topicName": "درس اول: احتمال یا اندازه‌گیری شانس",
            "recommendedMethod": "فضای نمونه، پیشامدها و محاسبه احتمال هم‌شانس",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "m10_c7_2",
            "topicName": "درس دوم: مقدمه‌ای بر علم آمار، جامعه و نمونه",
            "recommendedMethod": "روش‌های نمونه‌گیری تصادفی",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "m10_c7_3",
            "topicName": "درس سوم: متغیر و انواع آن",
            "recommendedMethod": "متغیرهای کیفی (اسمی، ترتیبی) و کمی (پیوسته، گسسته)",
            "difficulty": "easy",
            "importance": "high"
          }
        ]
      }
    ]
  },
  {
    "id": "math_11_exp",
    "bookTitle": "ریاضی ۲ (علوم تجربی)",
    "subjectCategory": "ریاضی",
    "grade": 11,
    "tracks": [
      "experimental"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: هندسه تحلیلی و جبر",
        "topics": [
          {
            "id": "m11_c1_1",
            "topicName": "درس اول: هندسه تحلیلی",
            "recommendedMethod": "فاصله دو نقطه، مختصات وسط پاره‌خط، شیب و فاصله نقطه از خط",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "m11_c1_2",
            "topicName": "درس دوم: معادله درجه دوم و تابع درجه دوم",
            "recommendedMethod": "تشکیل معادله درجه دوم و بررسی شرایط ریشه‌ها",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "m11_c1_3",
            "topicName": "درس سوم: معادلات گویا و معادلات رادیکالی",
            "recommendedMethod": "حل معادلات رادیکالی و بررسی ریشه‌های غیرقابل قبول",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: هندسه",
        "topics": [
          {
            "id": "m11_c2_1",
            "topicName": "درس اول: ترسیم‌های هندسی",
            "recommendedMethod": "رسم عمودمنصف، نیمساز و خط عمود با خط‌کش و پرگار",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "m11_c2_2",
            "topicName": "درس دوم: استدلال و قضیه تالس",
            "recommendedMethod": "قضیه تالس و عکس آن در مثلث‌ها",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "m11_c2_3",
            "topicName": "درس سوم: تشابه مثلث‌ها",
            "recommendedMethod": "حالت‌های تشابه مثلث و نسبت مساحت‌ها و محیط‌ها",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: تابع",
        "topics": [
          {
            "id": "m11_c3_1",
            "topicName": "درس اول: آشنایی با برخی از انواع توابع",
            "recommendedMethod": "توابع گویا، رادیکالی، پله‌ای و جزء صحیح",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "m11_c3_2",
            "topicName": "درس دوم: وارون یک تابع و تابع یک به یک",
            "recommendedMethod": "شرط وارون‌پذیری و رسم نمودار تابع وارون قرینه نسبت به y=x",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "m11_c3_3",
            "topicName": "درس سوم: اعمال جبری روی توابع",
            "recommendedMethod": "جمع، تفریق، ضرب و تقسیم توابع و اشتراک دامنه‌ها",
            "difficulty": "medium",
            "importance": "very_high"
          }
        ]
      },
      {
        "chapterNumber": 4,
        "chapterTitle": "فصل چهارم: مثلثات",
        "topics": [
          {
            "id": "m11_c4_1",
            "topicName": "درس اول: واحدهای اندازه‌گیری زاویه",
            "recommendedMethod": "تبدیل درجه به رادیان و طول کمان دایره",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "m11_c4_2",
            "topicName": "درس دوم: روابط تکمیلی بین نسبت‌های مثلثاتی",
            "recommendedMethod": "روابط زوایای مکمل، متمم و قرینه در دایره مثلثاتی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "m11_c4_3",
            "topicName": "درس سوم: توابع مثلثاتی",
            "recommendedMethod": "نمودار توابع سینوس و کسینوس و دوره تناوب",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 5,
        "chapterTitle": "فصل پنجم: توابع نمایی و لگاریتمی",
        "topics": [
          {
            "id": "m11_c5_1",
            "topicName": "درس اول: تابع نمایی و ویژگی‌های آن",
            "recommendedMethod": "رسم نمودار تابع نمایی، رشد و زوال نمایی",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "m11_c5_2",
            "topicName": "درس دوم: تابع لگاریتمی و ویژگی‌های آن",
            "recommendedMethod": "قوانین و خواص لگاریتم در پایه‌های مختلف",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "m11_c5_3",
            "topicName": "درس سوم: نمودارها و کاربردهای توابع نمایی و لگاریتمی",
            "recommendedMethod": "حل معادلات لگاریتمی و کاربرد در نیمه‌عمر و شدت صوت",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 6,
        "chapterTitle": "فصل ششم: حد و پیوستگی",
        "topics": [
          {
            "id": "m11_c6_1",
            "topicName": "درس اول: فرایندهای حدی",
            "recommendedMethod": "مفهوم شهودی حد و حدهای راست و چپ",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "m11_c6_2",
            "topicName": "درس دوم: محاسبه حد توابع",
            "recommendedMethod": "قضایای حد و رفع ابهام صفر صفرم با فاکتورگیری و گویا کردن",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "m11_c6_3",
            "topicName": "درس سوم: پیوستگی",
            "recommendedMethod": "شرط پیوستگی در یک نقطه و روی یک بازه",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 7,
        "chapterTitle": "فصل هفتم: آمار و احتمال",
        "topics": [
          {
            "id": "m11_c7_1",
            "topicName": "درس اول: احتمال شرطی و پیشامدهای مستقل",
            "recommendedMethod": "فرمول P(A|B) و قانون ضرب احتمال",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "m11_c7_2",
            "topicName": "درس دوم: آمار توصیفی",
            "recommendedMethod": "واریانس، انحراف معیار و ضریب تغییرات داده‌ها",
            "difficulty": "medium",
            "importance": "very_high"
          }
        ]
      }
    ]
  },
  {
    "id": "math_12_exp",
    "bookTitle": "ریاضی ۳ (علوم تجربی)",
    "subjectCategory": "ریاضی",
    "grade": 12,
    "tracks": [
      "experimental"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: تابع",
        "topics": [
          {
            "id": "m12_c1_1",
            "topicName": "درس اول: توابع چندجمله‌ای ـ توابع صعودی و نزولی",
            "recommendedMethod": "تشخیص یکنوایی از روی نمودار و ضابطه",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "m12_c1_2",
            "topicName": "درس دوم: ترکیب توابع",
            "recommendedMethod": "تشکیل fog و gof و محاسبه دامنه توابع ترکیبی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "m12_c1_3",
            "topicName": "درس سوم: تابع وارون",
            "recommendedMethod": "یافتن ضابطه وارون و تقاطع تابع با وارونش",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: مثلثات",
        "topics": [
          {
            "id": "m12_c2_1",
            "topicName": "درس اول: تناوب و تانژانت",
            "recommendedMethod": "محاسبه دوره تناوب توابع مثلثاتی ضریب‌دار و نمودار تانژانت",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "m12_c2_2",
            "topicName": "درس دوم: معادلات مثلثاتی",
            "recommendedMethod": "حل فرم‌های استاندارد sin x = sin a و cos x = cos a در دایره",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: حد بی‌نهایت و حد در بی‌نهایت",
        "topics": [
          {
            "id": "m12_c3_1",
            "topicName": "درس اول: حد بی‌نهایت",
            "recommendedMethod": "مجانب قائم و تعیین علامت حدهای مخرج صفر",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "m12_c3_2",
            "topicName": "درس دوم: حد در بی‌نهایت",
            "recommendedMethod": "قاعده پرتوان برای چندجمله‌ای‌ها و مجانب افقی",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 4,
        "chapterTitle": "فصل چهارم: مشتق",
        "topics": [
          {
            "id": "m12_c4_1",
            "topicName": "درس اول: آشنایی با مفهوم مشتق",
            "recommendedMethod": "تعریف مشتق با حد کسر پیوستگی و شیب خط مماس",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "m12_c4_2",
            "topicName": "درس دوم: مشتق‌پذیری و پیوستگی",
            "recommendedMethod": "نقاط گوشه‌دار، بازگشتی، مماس قائم و ناپیوستگی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "m12_c4_3",
            "topicName": "درس سوم: آهنگ تغییر",
            "recommendedMethod": "مقایسه آهنگ تغییر متوسط و آهنگ لحظه‌ای و مسائل فیزیکی",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 5,
        "chapterTitle": "فصل پنجم: کاربرد مشتق",
        "topics": [
          {
            "id": "m12_c5_1",
            "topicName": "درس اول: اکسترمم‌های تابع",
            "recommendedMethod": "نقاط بحرانی، ماکزیمم و مینیمم مطلق و نسبی با آزمون مشتق اول",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "m12_c5_2",
            "topicName": "درس دوم: بهینه‌سازی",
            "recommendedMethod": "فرمول‌بندی مسائل هندسی و فیزیکی بهینه‌سازی و حل با مشتق",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 6,
        "chapterTitle": "فصل ششم: هندسه",
        "topics": [
          {
            "id": "m12_c6_1",
            "topicName": "درس اول: تفکر تجسمی و آشنایی با مقاطع مخروطی",
            "recommendedMethod": "برش‌های صفحه با مخروط دوگانه (دایره، بیضی، سهمی، هذلولی)",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "m12_c6_2",
            "topicName": "درس دوم: دایره",
            "recommendedMethod": "معادله استاندارد و گسترده دایره و وضعیت خط و دایره",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 7,
        "chapterTitle": "فصل هفتم: احتمال",
        "topics": [
          {
            "id": "m12_c7_1",
            "topicName": "قانون احتمال کل",
            "recommendedMethod": "نمودار درختی و قانون احتمال کل و فرمول بیز",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      }
    ]
  },
  {
    "id": "phys_10_exp",
    "bookTitle": "فیزیک ۱ (علوم تجربی)",
    "subjectCategory": "فیزیک",
    "grade": 10,
    "tracks": [
      "experimental"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: فیزیک و اندازه‌گیری",
        "topics": [
          {
            "id": "p10e_c1_1",
            "topicName": "مدل‌سازی، کمیت‌های فیزیکی و یکاهای SI",
            "recommendedMethod": "تحلیل ابعادی و تبدیل یکاهای زنجیره‌ای",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "p10e_c1_2",
            "topicName": "اندازه‌گیری و دقت وسیله و چگالی",
            "recommendedMethod": "کولیس، ریزسنج و محاسبات ارقام بامعنی و چگالی آلیاژها",
            "difficulty": "medium",
            "importance": "very_high"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: ویژگی‌های فیزیکی مواد",
        "topics": [
          {
            "id": "p10e_c2_1",
            "topicName": "حالت‌های ماده، نیروهای بین مولکولی و مویینگی",
            "recommendedMethod": "کشش سطحی، هم‌چسبی و دگرچسبی",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "p10e_c2_2",
            "topicName": "فشار در شاره‌ها و لوله‌های U شکل",
            "recommendedMethod": "محاسبه فشار هیدرواستاتیک P = P0 + pgh و فشارسنج‌ها",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "p10e_c2_3",
            "topicName": "شناوری، اصل ارشمیدس و اصل برنولی",
            "recommendedMethod": "نیروی شناوری در مایعات و رابطه پیوستگی جریان شاره",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: کار، انرژی و توان",
        "topics": [
          {
            "id": "p10e_c3_1",
            "topicName": "کار نیروی ثابت و قضیه کار و انرژی جنبشی (W_total = delta K)",
            "recommendedMethod": "محاسبه کار نیروهای وزن، اصطکاک و کشش",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "p10e_c3_2",
            "topicName": "انرژی پتانسیل گرانشی و پایستگی انرژی مکانیکی",
            "recommendedMethod": "قانون پایستگی E1 = E2 و تلفات اصطکاک",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "p10e_c3_3",
            "topicName": "توان و بازده مکانیکی",
            "recommendedMethod": "محاسبه توان متوسط و لحظه‌ای (P = F.v) و درصد بازده",
            "difficulty": "medium",
            "importance": "very_high"
          }
        ]
      },
      {
        "chapterNumber": 4,
        "chapterTitle": "فصل چهارم: دما و گرما",
        "topics": [
          {
            "id": "p10e_c4_1",
            "topicName": "دماسنجی، مقیاس‌های دما و انبساط گرمایی",
            "recommendedMethod": "انبساط طولی، سطحی و حجمی و ناهنجاری آب",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "p10e_c4_2",
            "topicName": "ظرفیت گرمایی، گرمای ویژه و دمای تعادل (Q = mc delta T)",
            "recommendedMethod": "مسائل گرماسنجی (کالری‌متر) و تعادل حرارتی آب و یخ",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "p10e_c4_3",
            "topicName": "تغییر حالت‌های ماده، گرمای نهان ذوب و تبخیر و انتقال گرما",
            "recommendedMethod": "رسانش، همرفت، تابش و حل مسائل نمودار دما-زمان",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      }
    ]
  },
  {
    "id": "phys_11_exp",
    "bookTitle": "فیزیک ۲ (علوم تجربی)",
    "subjectCategory": "فیزیک",
    "grade": 11,
    "tracks": [
      "experimental"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: الکتریسیتهٔ ساکن",
        "topics": [
          {
            "id": "p11e_c1_1",
            "topicName": "بار الکتریکی، پایستگی و قانون کولن",
            "recommendedMethod": "برآیند نیروهای الکترواستاتیکی بردارها در صفحه",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "p11e_c1_2",
            "topicName": "میدان الکتریکی، خطوط میدان و اصل برهم‌نهی",
            "recommendedMethod": "میدان بار نقطه‌ای، میدان یکنواخت و ذره باردار معلق",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "p11e_c1_3",
            "topicName": "انرژی پتانسیل الکتریکی و پتانسیل الکتریکی (V = U/q)",
            "recommendedMethod": "محاسبه کار میدان الکتریکی و اختلاف پتانسیل بین دو نقطه",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "p11e_c1_4",
            "topicName": "خازن و ظرفیت خازن و انرژی ذخیره‌شده",
            "recommendedMethod": "فرمول C = k eps0 A / d و دی‌الکتریک و تخلیه بار",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: جریان الکتریکی و مدارهای جریان مستقیم",
        "topics": [
          {
            "id": "p11e_c2_1",
            "topicName": "جریان الکتریکی، مقاومت و قانون اهم",
            "recommendedMethod": "عوامل مؤثر بر مقاومت ویژه (R = rho L / A) و کد رنگی",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "p11e_c2_2",
            "topicName": "نیروی محرکه الکتریکی و مقاومت درونی مولد",
            "recommendedMethod": "نمودار ولتاژ برحسب جریان و اختلاف پتانسیل دو سر باتری",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "p11e_c2_3",
            "topicName": "بهم‌بستن مقاومت‌ها (متوالی، موازی) و توان الکتریکی مدار",
            "recommendedMethod": "محاسبه مقاومت معادل، تقسیم جریان و توان مصرفی P = VI",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: مغناطیس و القای الکترومغناطیسی",
        "topics": [
          {
            "id": "p11e_c3_1",
            "topicName": "میدان مغناطیسی، آهنربا و نیروی مغناطیسی وارد بر بار متحرک و سیم",
            "recommendedMethod": "قاعده دست راست F = qvB sin theta و F = BIL sin theta",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "p11e_c3_2",
            "topicName": "میدان مغناطیسی حاصل از جریان (سیم راست، حلقه و سیملوله)",
            "recommendedMethod": "محاسبه B سیملوله و پیچه مسطح و دست راست",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "p11e_c3_3",
            "topicName": "شار مغناطیسی و قانون القای فارادی و قانون لنز",
            "recommendedMethod": "محاسبه نیروی محرکه القایی متوسط و تعیین جهت جریان القایی با لنز",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      }
    ]
  },
  {
    "id": "phys_12_exp",
    "bookTitle": "فیزیک ۳ (علوم تجربی)",
    "subjectCategory": "فیزیک",
    "grade": 12,
    "tracks": [
      "experimental"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: حرکت بر خط راست",
        "topics": [
          {
            "id": "p12e_c1_1",
            "topicName": "بردار مکان، جابه‌جایی، مسافت و سرعت متوسط و لحظه‌ای",
            "recommendedMethod": "تحلیل نمودار مکان-زمان x-t و شیب خط مماس",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "p12e_c1_2",
            "topicName": "حرکت با سرعت ثابت بر خط راست",
            "recommendedMethod": "معادله حرکت و تحلیل حرکت‌های متحرک‌های هم‌زمان",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "p12e_c1_3",
            "topicName": "حرکت با شتاب ثابت بر خط راست و سقوط آزاد",
            "recommendedMethod": "معادلات ۴ گانه شتاب ثابت، نمودار سرعت-زمان v-t و سطح زیر نمودار",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: دینامیک و حرکت دایره‌ای",
        "topics": [
          {
            "id": "p12e_c2_1",
            "topicName": "قوانین حرکت نیوتون (اول، دوم و سوم)",
            "recommendedMethod": "رسم دیاگرام جسم آزاد (FBD) و تجزیه بردار نیروها",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "p12e_c2_2",
            "topicName": "نیروهای اصطکاک (ایستایی و جنبشی)، کشش طناب و عمودی تکیه‌گاه",
            "recommendedMethod": "محاسبه ضریب اصطکاک و حل مسائل سطح شیب‌دار",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "p12e_c2_3",
            "topicName": "تکانه، قانون دوم نیوتون و حرکت دایره‌ای یکنواخت",
            "recommendedMethod": "نیروی جانب مرکز و شتاب جانب مرکز در پیچ جاده‌ها",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: نوسان و موج‌ها",
        "topics": [
          {
            "id": "p12e_c3_1",
            "topicName": "حرکت هماهنگ ساده (نوسانگر وزنه-فنر و آونگ ساده)",
            "recommendedMethod": "معادلات مکان x(t)، سرعت v(t) و شتاب a(t) و انرژی نوسانگر",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "p12e_c3_2",
            "topicName": "موج مکانیکی، تندی انتشار موج در ریسمان و مشخصه‌های موج",
            "recommendedMethod": "محاسبه طول موج، بسامد و رابطه v = lambda * f",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "p12e_c3_3",
            "topicName": "موج صوتی، تراز شدت صوت (دسی‌بل) و ادراک شنوایی",
            "recommendedMethod": "فرمول بتا = 10 log (I / I0) و تندی صوت در محیط‌های مختلف",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 4,
        "chapterTitle": "فصل چهارم: برهم‌کنش‌های موج و فیزیک اتمی و هسته‌ای",
        "topics": [
          {
            "id": "p12e_c4_1",
            "topicName": "بازتاب موج، شکست موج و قانون اسنل",
            "recommendedMethod": "زاویه تابش، بازتاب، زاویه حد و بازتاب کلی",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "p12e_c4_2",
            "topicName": "اثر فوتوالکتریک و فوتون و طیف گسیلی خطی",
            "recommendedMethod": "معادله فوتوالکتریک اینشتین E = hf و مدل بور",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "p12e_c4_3",
            "topicName": "ساختار هسته، پرتوزایی، نیمه‌عمر و شکافت و همجوشی هسته‌ای",
            "recommendedMethod": "محاسبه واپاشی آلفا، بتا و گاما و قانون نیمه‌عمر",
            "difficulty": "medium",
            "importance": "very_high"
          }
        ]
      }
    ]
  },
  {
    "id": "chem_10",
    "bookTitle": "شیمی ۱",
    "subjectCategory": "شیمی",
    "grade": 10,
    "tracks": [
      "experimental",
      "mathematics"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: کیهان، زادگاه الفبای هستی",
        "topics": [
          {
            "id": "ch10_c1_1",
            "topicName": "منشأ عنصرها، ایزوتوپ‌ها و جرم اتمی میانگین",
            "recommendedMethod": "محاسبه جرم میانگین و تست درصد فراوانی ایزوتوپ‌ها",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "ch10_c1_2",
            "topicName": "جدول دوره‌ای عنصرها و آرایش الکترونی (قاعده آفبا و هوند)",
            "recommendedMethod": "رسم لایه‌های فرعی s, p, d و تعیین دوره و گروه",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "ch10_c1_3",
            "topicName": "استوکیومتری، جرم مولی و مفهوم مول و فرمول‌های شیمیایی",
            "recommendedMethod": "حل زنجیره‌ای استوکیومتری بر مبنای تناسب مول و گرم",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: رد پای گازها در زندگی",
        "topics": [
          {
            "id": "ch10_c2_1",
            "topicName": "هواکره و لایه‌های اتمسفر و اثر گلخانه‌ای",
            "recommendedMethod": "گازهای نجیب، اوزون و شیمی هوای پاک و آلاینده‌ها",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "ch10_c2_2",
            "topicName": "موازنه واکنش‌های شیمیایی و نام‌گذاری ترکیبات مولکولی",
            "recommendedMethod": "تکنیک ضرایب کسری و نام‌گذاری اکسیدها",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "ch10_c2_3",
            "topicName": "قانون گازها و استوکیومتری در شرایط STP",
            "recommendedMethod": "حجم مولی ۲۲.۴ لیتر و رابطه PV = nRT و بازده درصدی",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: آب، آهنگ زندگی",
        "topics": [
          {
            "id": "ch10_c3_1",
            "topicName": "محلول‌ها، حلال و حل‌شونده و غلظت‌ها (درصد جرمی، ppm و غلظت مولار)",
            "recommendedMethod": "فرمول‌های غلظت مولار M = n/V و رقیق‌سازی محلول‌ها",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "ch10_c3_2",
            "topicName": "پیوند هیدروژنی، ویژگی‌های آب و انحلال‌پذیری و نمودارهای انحلال",
            "recommendedMethod": "تحلیل نمودار گرم حل‌شونده در ۱۰۰ گرم آب و دمای رسوب‌گذاری",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "ch10_c3_3",
            "topicName": "ترکیبات یونی و اسمز و تصفیه آب",
            "recommendedMethod": "رسانایی الکتریکی یون‌ها در آب و اسمز معکوس",
            "difficulty": "medium",
            "importance": "very_high"
          }
        ]
      }
    ]
  },
  {
    "id": "chem_11",
    "bookTitle": "شیمی ۲",
    "subjectCategory": "شیمی",
    "grade": 11,
    "tracks": [
      "experimental",
      "mathematics"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: قدر هدایای زمینی را بدانیم",
        "topics": [
          {
            "id": "ch11_c1_1",
            "topicName": "فلزها، نافلزها و شبه‌فلزها و واکنش‌پذیری فلزات",
            "recommendedMethod": "سری الکتروشیمیایی و استخراج آهن در کوره بلند",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "ch11_c1_2",
            "topicName": "شیمی آلی: هیدروکربن‌ها (آلکان‌ها، آلکن‌ها، آلکین‌ها) و نفت خام",
            "recommendedMethod": "نام‌گذاری آیوپاک هیدروکربن‌ها و ایزومری (هم‌پاری)",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "ch11_c1_3",
            "topicName": "هیدروکربن‌های حلقوی، بنزن و فرآورده‌های پتروشیمی",
            "recommendedMethod": "واکنش‌های سوختن و ارزش سوختی ترکیبات هیدروکربنی",
            "difficulty": "medium",
            "importance": "high"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: در پی غذای سالم",
        "topics": [
          {
            "id": "ch11_c2_1",
            "topicName": "دما، گرما، ظرفیت گرمایی و آنتالپی واکنش (delta H)",
            "recommendedMethod": "واکنش‌های گرماگیر و گرماده و نمودار پیشرفت واکنش",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "ch11_c2_2",
            "topicName": "آنتالپی پیوند و قانون هس برای محاسبه آنتالپی واکنش",
            "recommendedMethod": "جمع جبری واکنش‌ها با روش قانون هس در کنکور",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "ch11_c2_3",
            "topicName": "سینتیک شیمیایی: سرعت واکنش و عوامل مؤثر بر آن",
            "recommendedMethod": "محاسبه سرعت مصرف و تولید مواد و نمودار غلظت-زمان",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: پوشاک، نیازی پایان‌ناپذیر",
        "topics": [
          {
            "id": "ch11_c3_1",
            "topicName": "الیاف طبیعی و ساختگی و پلیمرها (بسپارها)",
            "recommendedMethod": "واکنش‌های پلیمریزاسیون افزایشی و ساختار مونومرها",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "ch11_c3_2",
            "topicName": "گروه‌های عاملی اکسیژن‌دار: الکل‌ها، اترها، آلدهیدها و کتون‌ها",
            "recommendedMethod": "شناسایی و فرمول ساختاری گروه‌های عاملی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "ch11_c3_3",
            "topicName": "کربوکسیلیک اسیدها، استرها و پلی‌استرها و پلی‌آمیدها",
            "recommendedMethod": "واکنش استری‌شدن و پلیمریزاسیون تراکمی (پلی‌اتیلن ترفتالات و نایلون)",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      }
    ]
  },
  {
    "id": "chem_12",
    "bookTitle": "شیمی ۳",
    "subjectCategory": "شیمی",
    "grade": 12,
    "tracks": [
      "experimental",
      "mathematics"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: مولکول‌ها در خدمت تندرستی",
        "topics": [
          {
            "id": "ch12_c1_1",
            "topicName": "پاک‌کننده‌ها: صابون‌ها و پاک‌کننده‌های غیرصابونی و کلوئیدها",
            "recommendedMethod": "ساختار آب‌دوست و چربی‌دوست صابون و آب سخت",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "ch12_c1_2",
            "topicName": "اسیدها و بازها: مدل آرنیوس، یون هیدرونیوم و درجه یونش (alpha)",
            "recommendedMethod": "ثابت یونش اسیدی Ka و تعادل اسیدهای ضعیف",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "ch12_c1_3",
            "topicName": "مفهوم pH و حل مسائل محاسباتی pH اسیدها و بازهای قوی و ضعیف",
            "recommendedMethod": "روابط لگاریتمی pH = -log[H+] و تیتراسیون اسید و باز",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: آسایش و رفاه در سایهٔ شیمی",
        "topics": [
          {
            "id": "ch12_c2_1",
            "topicName": "واکنش‌های اکسایش و کاهش و عدد اکسایش",
            "recommendedMethod": "شناسایی اکسنده و کاهنده و موازنه نیم‌واکنش‌ها",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "ch12_c2_2",
            "topicName": "سلول‌های گالوانی، الکترود استاندارد هیدروژن (SHE) و emf سلول",
            "recommendedMethod": "پتانسیل استاندارد کاهشی E0 و پیش‌بینی خودبه‌خودی بودن واکنش",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "ch12_c2_3",
            "topicName": "خوردگی آهن، حفاظت کاتدی و سلول‌های الکترولیتی (برق‌کافت و آبکاری)",
            "recommendedMethod": "برق‌کافت منیزیم کلرید و آبکاری مس و کاتد فداشونده",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: شیمی جلوه‌ای از هنر، زیبایی و ماندگاری",
        "topics": [
          {
            "id": "ch12_c3_1",
            "topicName": "جامدهای بلوری: جامدهای مولکولی، یونی، فلزی و کووالانسی",
            "recommendedMethod": "مقایسه نقطه ذوب، رسانایی و سختی انواع جامدها",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "ch12_c3_2",
            "topicName": "شبکه بلور ترکیبات یونی و انرژی فروپاشی شبکه بلور",
            "recommendedMethod": "عوامل مؤثر بر انرژی شبکه (بار یون‌ها و شعاع یونی)",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "ch12_c3_3",
            "topicName": "جامدهای کووالانسی (الماس، گرافیت، سیلیس) و اکسیدهای فلزی رنگی",
            "recommendedMethod": "تنوع ساختار کربن و پیوندهای چندگانه سیلیسیم و تیتانیم",
            "difficulty": "medium",
            "importance": "high"
          }
        ]
      },
      {
        "chapterNumber": 4,
        "chapterTitle": "فصل چهارم: شیمی، راهی به سوی آینده‌ای روشن‌تر",
        "topics": [
          {
            "id": "ch12_c4_1",
            "topicName": "انرژی فعال‌سازی (Ea) و کاتالیزورها و مبدل کاتالیستی",
            "recommendedMethod": "تحلیل نمودار انرژی-پیشرفت واکنش با و بدون کاتالیزور",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "ch12_c4_2",
            "topicName": "تعادل‌های شیمیایی و ثابت تعادل (K) و اصل لوشاتلیه",
            "recommendedMethod": "تغییر غلظت، فشار و دما بر جهت جابه‌جایی تعادل",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "ch12_c4_3",
            "topicName": "فرآیند هابر برای تولید آمونیاک و بهینه‌سازی صنعتی",
            "recommendedMethod": "شرایط بهینه دما و فشار در واکنش تعادلی تولید آمونیاک",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      }
    ]
  },
  {
    "id": "geology_11",
    "bookTitle": "زمین‌شناسی",
    "subjectCategory": "زمین‌شناسی",
    "grade": 11,
    "tracks": [
      "experimental",
      "mathematics"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: آفرینش کیهان و تکوین زمین",
        "topics": [
          {
            "id": "geo11_c1_1",
            "topicName": "شکل‌گیری کیهان و تشکیل منظومه شمسی",
            "recommendedMethod": "نظریه مه‌بانگ و پیدایش سیارات خاکی",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "geo11_c1_2",
            "topicName": "سن زمین، تکوین زمین و سن نسبی و سن مطلق",
            "recommendedMethod": "اصول چینه‌نگاری، فسیل‌های شاخص و نیمه‌عمر عناصر رادیواکتیو",
            "difficulty": "medium",
            "importance": "very_high"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: منابع معدنی و ذخایر انرژی، زیربنای تمدن و توسعه",
        "topics": [
          {
            "id": "geo11_c2_1",
            "topicName": "منابع معدنی، کانی‌ها و کانسنگ‌ها",
            "recommendedMethod": "طبقه‌بندی کانی‌های سیلیکاتی و اکسیدی و عیار کانسنگ",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "geo11_c2_2",
            "topicName": "اکتشاف و استخراج منابع معدنی، گوهرها و منابع انرژی",
            "recommendedMethod": "مراحل ژئوفیزیکی اکتشاف نفت و گاز و زغال‌سنگ",
            "difficulty": "medium",
            "importance": "high"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: منابع آب و خاک",
        "topics": [
          {
            "id": "geo11_c3_1",
            "topicName": "آب‌های سطحی و زیرزمینی و چرخه آب",
            "recommendedMethod": "سفره‌های آب آزاد و تحت فشار و زهکشی",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "geo11_c3_2",
            "topicName": "خاک و اهمیت آن، فرسایش و آلودگی خاک",
            "recommendedMethod": "افق‌های خاک و سرعت تشکیل خاک در اقلیم‌های مختلف",
            "difficulty": "medium",
            "importance": "high"
          }
        ]
      },
      {
        "chapterNumber": 4,
        "chapterTitle": "فصل چهارم: پویایی زمین",
        "topics": [
          {
            "id": "geo11_c4_1",
            "topicName": "حرکت ورقه‌های سنگ‌کره و زمین‌لرزه",
            "recommendedMethod": "امواج زلزله P و S و مقیاس ریشتر و کانون زلزله",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "geo11_c4_2",
            "topicName": "آتشفشان، چین‌خوردگی و گسل",
            "recommendedMethod": "گسل‌های عادی، معکوس و امتدادلغز و تاقدیس و ناودیس",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 5,
        "chapterTitle": "فصل پنجم: زمین‌شناسی و سلامت",
        "topics": [
          {
            "id": "geo11_c5_1",
            "topicName": "زمین و سلامت انسان و عوامل زمین‌شناختی مؤثر بر سلامت",
            "recommendedMethod": "عناصر ضروری و سمی در خاک و آب (فلوئور، ید، آرسنیک)",
            "difficulty": "easy",
            "importance": "medium"
          },
          {
            "id": "geo11_c5_2",
            "topicName": "منابع طبیعی و سلامت",
            "recommendedMethod": "کانی‌درمانی و بیماری‌های مرتبط با املاح محیطی",
            "difficulty": "easy",
            "importance": "medium"
          }
        ]
      },
      {
        "chapterNumber": 6,
        "chapterTitle": "فصل ششم: زمین‌شناسی و سازه‌های مهندسی",
        "topics": [
          {
            "id": "geo11_c6_1",
            "topicName": "زمین‌شناسی مهندسی و ویژگی‌های زمین در احداث سازه‌ها",
            "recommendedMethod": "مقاومت مکانیکی سنگ‌ها، نفوذپذیری و پایداری شیب",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "geo11_c6_2",
            "topicName": "سدسازی، راه‌سازی و مکان‌یابی سازه‌ها",
            "recommendedMethod": "ملاحظات تکتونیکی در احداث سدهای خاکی و بتنی",
            "difficulty": "medium",
            "importance": "high"
          }
        ]
      },
      {
        "chapterNumber": 7,
        "chapterTitle": "فصل هفتم: زمین‌شناسی ایران",
        "topics": [
          {
            "id": "geo11_c7_1",
            "topicName": "ویژگی‌های زمین‌شناسی ایران و پهنه‌های زمین‌شناسی ایران",
            "recommendedMethod": "پهنه‌های البرز، زاگرس، ایران مرکزی و مکران",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "geo11_c7_2",
            "topicName": "منابع و ذخایر زمین‌شناختی ایران",
            "recommendedMethod": "ذخایر نفت، گاز، مس و سنگ آهن کشور",
            "difficulty": "easy",
            "importance": "high"
          }
        ]
      }
    ]
  },
  {
    "id": "hesaban_11",
    "bookTitle": "حسابان ۱",
    "subjectCategory": "حسابان",
    "grade": 11,
    "tracks": [
      "mathematics"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: جبر و معادله",
        "topics": [
          {
            "id": "hes11_c1_1",
            "topicName": "درس اول: مجموع جملات دنباله‌های حسابی و هندسی",
            "recommendedMethod": "فرمول‌های مجموع Sn و مسائل ترکیبی جملات دنباله",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "hes11_c1_2",
            "topicName": "درس دوم: معادلات درجه دوم",
            "recommendedMethod": "روابط ریشه‌ها S و P و تشکیل معادله درجه دوم",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "hes11_c1_3",
            "topicName": "درس سوم: معادلات گویا و گنگ",
            "recommendedMethod": "تکنیک تغییر متغیر در حل معادلات پیچیده رادیکالی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "hes11_c1_4",
            "topicName": "درس چهارم: قدرمطلق و ویژگی‌های آن",
            "recommendedMethod": "حل نامعادلات قدرمطلقی و رسم نمودار با انتقال",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "hes11_c1_5",
            "topicName": "درس پنجم: آشنایی با هندسه تحلیلی",
            "recommendedMethod": "شیب و معادله خطوط متعامد و موازی و فاصله نقطه از خط",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: تابع",
        "topics": [
          {
            "id": "hes11_c2_1",
            "topicName": "درس اول: آشنایی بیشتر با تابع",
            "recommendedMethod": "توابع چندضابطه‌ای و بررسی دامنه و برد جبری",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "hes11_c2_2",
            "topicName": "درس دوم: انواع تابع",
            "recommendedMethod": "تابع علامت (sgn)، تابع جزء صحیح و ویژگی‌های براکت",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "hes11_c2_3",
            "topicName": "درس سوم: وارون تابع",
            "recommendedMethod": "شرط یک‌به‌یک بودن و وارون‌پذیری و قرینه نموداری",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "hes11_c2_4",
            "topicName": "درس چهارم: اعمال روی توابع",
            "recommendedMethod": "ترکیب توابع fog و gof و حل معادلات تابعی",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: توابع نمایی و لگاریتمی",
        "topics": [
          {
            "id": "hes11_c3_1",
            "topicName": "درس اول: تابع نمایی",
            "recommendedMethod": "رسم توابع نمایی و انتقال پایه‌ها",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "hes11_c3_2",
            "topicName": "درس دوم: تابع لگاریتمی و لگاریتم",
            "recommendedMethod": "تعریف لگاریتم و پایه‌های طبیعی e و اعشاری ۱۰",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "hes11_c3_3",
            "topicName": "درس سوم: ویژگی‌های لگاریتم و حل معادله‌های لگاریتمی",
            "recommendedMethod": "فرمول‌های تغییر پایه و حل معادلات و نامعادلات لگاریتمی",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 4,
        "chapterTitle": "فصل چهارم: مثلثات",
        "topics": [
          {
            "id": "hes11_c4_1",
            "topicName": "درس اول: رادیان",
            "recommendedMethod": "محاسبه مساحت قطاع و طول کمان دایره برحسب رادیان",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "hes11_c4_2",
            "topicName": "درس دوم: نسبت‌های مثلثاتی برخی زوایا",
            "recommendedMethod": "نسبت‌های زاویه‌های ۳۰، ۴۵، ۶۰ درجه و زوایای مرزی",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "hes11_c4_3",
            "topicName": "درس سوم: توابع مثلثاتی",
            "recommendedMethod": "رسم توابع y = sin x و y = cos x و تعیین دامنه و برد",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "hes11_c4_4",
            "topicName": "درس چهارم: روابط مثلثاتی مجموع و تفاضل زوایا",
            "recommendedMethod": "فرمول‌های sin(a+b)، cos(a+b) و کمان‌های دوبرابر زاویه",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 5,
        "chapterTitle": "فصل پنجم: حد و پیوستگی",
        "topics": [
          {
            "id": "hes11_c5_1",
            "topicName": "درس اول: مفهوم حد و فرآیندهای حدی",
            "recommendedMethod": "بررسی همسایگی محذوف و تعریف ریاضی حد",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "hes11_c5_2",
            "topicName": "درس دوم: حدهای یک‌طرفه (حد چپ و حد راست)",
            "recommendedMethod": "بررسی حد چپ و راست در نقاط ناپیوستگی و براکت",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "hes11_c5_3",
            "topicName": "درس سوم: قضایای حد",
            "recommendedMethod": "حد مجموع، حاصل‌ضرب، تقسیم و قضیه فشردگی (ساندویچ)",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "hes11_c5_4",
            "topicName": "درس چهارم: محاسبه حد توابع کسری",
            "recommendedMethod": "رفع ابهام صفر صفرم با اتحاد چاق و لاغر و هم‌ارزی‌ها",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "hes11_c5_5",
            "topicName": "درس پنجم: پیوستگی",
            "recommendedMethod": "پیوستگی چپ و راست و پیوستگی در بازه‌ها",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      }
    ]
  },
  {
    "id": "hesaban_12",
    "bookTitle": "حسابان ۲",
    "subjectCategory": "حسابان",
    "grade": 12,
    "tracks": [
      "mathematics"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: تابع",
        "topics": [
          {
            "id": "hes12_c1_1",
            "topicName": "درس اول: تبدیل نمودار توابع",
            "recommendedMethod": "انبساط و انقباض افقی و عمودی، قرینه‌سازی و قدرمطلق‌گیری از تابع",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "hes12_c1_2",
            "topicName": "درس دوم: تابع درجه سوم، توابع یکنوا و بخش‌پذیری و تقسیم",
            "recommendedMethod": "قضیه هورنر، قضیه باقی‌مانده و بخش‌پذیری بر x - a",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: مثلثات",
        "topics": [
          {
            "id": "hes12_c2_1",
            "topicName": "درس اول: تناوب و تانژانت",
            "recommendedMethod": "نمودار و ویژگی‌های تانژانت و کتانژانت و دوره تناوب توابع مثلثاتی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "hes12_c2_2",
            "topicName": "درس دوم: معادلات مثلثاتی",
            "recommendedMethod": "حل فرم‌های پیشرفته معادلات مثلثاتی در کنکور ریاضی",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: حدهای نامتناهی ـ حد در بی‌نهایت",
        "topics": [
          {
            "id": "hes12_c3_1",
            "topicName": "درس اول: حدهای نامتناهی",
            "recommendedMethod": "بررسی مجانب‌های قائم و رفتار مجانبی در اطراف ریشه‌های مخرج",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "hes12_c3_2",
            "topicName": "درس دوم: حد در بی‌نهایت",
            "recommendedMethod": "مجانب افقی و مایل و رفع ابهام بی‌نهایت منهای بی‌نهایت",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 4,
        "chapterTitle": "فصل چهارم: مشتق",
        "topics": [
          {
            "id": "hes12_c4_1",
            "topicName": "درس اول: آشنایی با مفهوم مشتق",
            "recommendedMethod": "فرمول‌های مشتق توابع مثلثاتی، زنجیره‌ای و ترکیب توابع",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "hes12_c4_2",
            "topicName": "درس دوم: مشتق‌پذیری و پیوستگی",
            "recommendedMethod": "بررسی مشتق راست و چپ و شرایط مشتق‌پذیری نقاط خاص",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "hes12_c4_3",
            "topicName": "درس سوم: آهنگ متوسط تغییر و آهنگ لحظه‌ای تغییر",
            "recommendedMethod": "مسائل تغییرات هم‌زمان در فیزیک و هندسه",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 5,
        "chapterTitle": "فصل پنجم: کاربردهای مشتق",
        "topics": [
          {
            "id": "hes12_c5_1",
            "topicName": "درس اول: اکسترمم‌های یک تابع و توابع صعودی و نزولی",
            "recommendedMethod": "آزمون مشتق اول و جدول تغییرات تابع",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "hes12_c5_2",
            "topicName": "درس دوم: جهت تقعر نمودار یک تابع و نقطه عطف آن",
            "recommendedMethod": "مشتق دوم، نقطه عطف و تقعر رو به بالا و پایین",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "hes12_c5_3",
            "topicName": "درس سوم: رسم نمودار تابع",
            "recommendedMethod": "رسم کامل توابع هموگرافیک و کسری به کمک مجانب‌ها و مشتق",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      }
    ]
  },
  {
    "id": "geometry_10",
    "bookTitle": "هندسه ۱",
    "subjectCategory": "هندسه",
    "grade": 10,
    "tracks": [
      "mathematics"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: ترسیم‌های هندسی و استدلال",
        "topics": [
          {
            "id": "geo10_c1_1",
            "topicName": "درس اول: ترسیم‌های هندسی",
            "recommendedMethod": "رسم دایره‌های محاطی و محیطی مثلث",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "geo10_c1_2",
            "topicName": "درس دوم: استدلال",
            "recommendedMethod": "برهان خلف، مثال نقض و استدلال استنتاجی",
            "difficulty": "medium",
            "importance": "very_high"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: قضیه تالس، تشابه و کاربردهای آن",
        "topics": [
          {
            "id": "geo10_c2_1",
            "topicName": "درس اول: نسبت و تناسب در هندسه",
            "recommendedMethod": "خواص تناسب و ویژگی‌های واسطه هندسی",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "geo10_c2_2",
            "topicName": "درس دوم: قضیه تالس",
            "recommendedMethod": "اثبات و کاربرد قضیه تالس در خطوط موازی",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "geo10_c2_3",
            "topicName": "درس سوم: تشابه مثلث‌ها",
            "recommendedMethod": "اثبات قضایای تشابه و حل مسائل تست هندسه",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "geo10_c2_4",
            "topicName": "درس چهارم: کاربردهایی از قضیه تالس و تشابه مثلث‌ها",
            "recommendedMethod": "ارتفاع، نیمساز و میانه‌ها در مثلث‌های متشابه",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: چندضلعی‌ها",
        "topics": [
          {
            "id": "geo10_c3_1",
            "topicName": "درس اول: چندضلعی‌ها و ویژگی‌هایی از آن‌ها",
            "recommendedMethod": "مجموع زوایای داخلی و خارجی چندضلعی‌های محدب",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "geo10_c3_2",
            "topicName": "درس دوم: مساحت و کاربردهای آن",
            "recommendedMethod": "فرمول هرون و مساحت متوازی‌الاضلاع و ذوزنقه",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 4,
        "chapterTitle": "فصل چهارم: تجسم فضایی",
        "topics": [
          {
            "id": "geo10_c4_1",
            "topicName": "درس اول: خط، نقطه و صفحه",
            "recommendedMethod": "وضعیت‌های نسبی دو خط و خط و صفحه در فضا",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "geo10_c4_2",
            "topicName": "درس دوم: تفکر تجسمی",
            "recommendedMethod": "گستره احجام هندسی (منشور، هرم، مخروط) و دوران اشکال",
            "difficulty": "hard",
            "importance": "very_high"
          }
        ]
      }
    ]
  },
  {
    "id": "geometry_11",
    "bookTitle": "هندسه ۲",
    "subjectCategory": "هندسه",
    "grade": 11,
    "tracks": [
      "mathematics"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: دایره",
        "topics": [
          {
            "id": "geo11_c1_1",
            "topicName": "درس اول: مفاهیم اولیه و زاویه‌ها در دایره",
            "recommendedMethod": "زاویه محاطی، ظلی، مرکزی و وترها",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "geo11_c1_2",
            "topicName": "درس دوم: رابطه‌های طولی در دایره",
            "recommendedMethod": "قاطع متقاطع، مماس و توان نقطه نسبت به دایره",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "geo11_c1_3",
            "topicName": "درس سوم: چندضلعی‌های محاطی و محیطی",
            "recommendedMethod": "چهارضلعی محاطی و محیطی و قضیه بطلمیوس",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: تبدیل‌های هندسی و کاربردها",
        "topics": [
          {
            "id": "geo11_c2_1",
            "topicName": "درس اول: تبدیل‌های هندسی",
            "recommendedMethod": "انتقال، بازتاب، دوران و تجانس (طولپا و ناسازگار)",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "geo11_c2_2",
            "topicName": "درس دوم: کاربرد تبدیل‌ها",
            "recommendedMethod": "حل مسائل کوتاه‌ترین مسیر و رسم هندسی با تجانس",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: روابط طولی در مثلث",
        "topics": [
          {
            "id": "geo11_c3_1",
            "topicName": "درس اول: قضیه سینوس‌ها",
            "recommendedMethod": "قانون سینوس‌ها و شعاع دایره محیطی R",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "geo11_c3_2",
            "topicName": "درس دوم: قضیه کسینوس‌ها",
            "recommendedMethod": "قانون کسینوس‌ها برای محاسبه اضلاع و زوایا",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "geo11_c3_3",
            "topicName": "درس سوم: قضیه نیمسازهای زوایای داخلی و محاسبه طول نیمسازها",
            "recommendedMethod": "قضیه نیمساز و طول پاره‌خط‌های ایجادشده روی ضلع روبرو",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "geo11_c3_4",
            "topicName": "درس چهارم: قضیه هرون (محاسبه ارتفاع‌ها و مساحت مثلث)",
            "recommendedMethod": "فرمول مساحت برحسب اضلاع و شعاع دایره محاطی داخلی",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      }
    ]
  },
  {
    "id": "geometry_12",
    "bookTitle": "هندسه ۳",
    "subjectCategory": "هندسه",
    "grade": 12,
    "tracks": [
      "mathematics"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: ماتریس و کاربردها",
        "topics": [
          {
            "id": "geo12_c1_1",
            "topicName": "درس اول: ماتریس و اعمال روی ماتریس‌ها",
            "recommendedMethod": "ضرب ماتریس‌ها، ترانهاده و ماتریس‌های قطری و اسکالر",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "geo12_c1_2",
            "topicName": "درس دوم: وارون ماتریس و دترمینان",
            "recommendedMethod": "محاسبه دترمینان ساروس، ماتریس الحاقی و حل دستگاه معادلات با کرامر",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: آشنایی با مقاطع مخروطی",
        "topics": [
          {
            "id": "geo12_c2_1",
            "topicName": "درس اول: آشنایی با مقاطع مخروطی و مکان هندسی",
            "recommendedMethod": "تعریف مکان هندسی و برش‌های سطح مخروطی",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "geo12_c2_2",
            "topicName": "درس دوم: دایره",
            "recommendedMethod": "معادله دایره، وضعیت دو دایره و خطوط مماس مشترک",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "geo12_c2_3",
            "topicName": "درس سوم: بیضی و سهمی",
            "recommendedMethod": "معادله بیضی و کانون‌ها، خروج از مرکز و خط هادی سهمی",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: بردارها",
        "topics": [
          {
            "id": "geo12_c3_1",
            "topicName": "درس اول: معرفی فضای سه بعدی (R3)",
            "recommendedMethod": "محورهای مختصات، صفحات مختصات و طول بردار در فضا",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "geo12_c3_2",
            "topicName": "درس دوم: ضرب داخلی و ضرب خارجی بردارها",
            "recommendedMethod": "محاسبه ضرب نقطه‌ای، ضرب صلیبی و مساحت متوازی‌الاضلاع و حجم متوازی‌السطوح",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      }
    ]
  },
  {
    "id": "prob_stats_11",
    "bookTitle": "آمار و احتمال",
    "subjectCategory": "ریاضیات گسسته و آمار",
    "grade": 11,
    "tracks": [
      "mathematics"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: آشنایی با مبانی ریاضیات",
        "topics": [
          {
            "id": "ps11_c1_1",
            "topicName": "درس اول: آشنایی با منطق ریاضی",
            "recommendedMethod": "گزاره‌ها، سور وجودی و عمومی، جدول ارزش‌ها و ترکیب شرطی",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "ps11_c1_2",
            "topicName": "درس دوم: مجموعه – زیرمجموعه",
            "recommendedMethod": "تعریف زیرمجموعه و افراز یک مجموعه",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "ps11_c1_3",
            "topicName": "درس سوم: قوانین و اعمال بین مجموعه‌ها (جبر مجموعه‌ها)",
            "recommendedMethod": "اصل شمول و عدم شمول و جبر بولی مجموعه‌ها",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: احتمال",
        "topics": [
          {
            "id": "ps11_c2_1",
            "topicName": "درس اول: مبانی احتمال",
            "recommendedMethod": "اصول موضوعه احتمال و قوانین احتمال پیشامدها",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "ps11_c2_2",
            "topicName": "درس دوم: احتمال غیر هم‌شانس",
            "recommendedMethod": "فضاهای نمونه ناهم‌شانس و وزن پیشامدها",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "ps11_c2_3",
            "topicName": "درس سوم: احتمال شرطی",
            "recommendedMethod": "قاعده ضرب احتمال و نمودار درختی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "ps11_c2_4",
            "topicName": "درس چهارم: پیشامدهای مستقل و وابسته",
            "recommendedMethod": "شرط استقلال P(A n B) = P(A).P(B)",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: آمار توصیفی",
        "topics": [
          {
            "id": "ps11_c3_1",
            "topicName": "درس اول: توصیف و نمایش داده‌ها",
            "recommendedMethod": "جدول فراوانی و نمودارهای ستونی و دایره‌ای",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "ps11_c3_2",
            "topicName": "درس دوم: معیارهای گرایش به مرکز",
            "recommendedMethod": "میانگین، میانه، مد و خواص میانگین وزنی",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "ps11_c3_3",
            "topicName": "درس سوم: معیارهای پراکندگی",
            "recommendedMethod": "دامنه تغییرات، واریانس، انحراف معیار و ضریب تغییرات (CV)",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 4,
        "chapterTitle": "فصل چهارم: آمار استنباطی",
        "topics": [
          {
            "id": "ps11_c4_1",
            "topicName": "درس اول: گردآوری داده‌ها",
            "recommendedMethod": "خطای نمونه‌گیری و روش‌های نمونه‌گیری تصادفی ساده و طبقه‌ای",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "ps11_c4_2",
            "topicName": "درس دوم: برآورد",
            "recommendedMethod": "برآورد نقطه‌ای میانگین جامعه و فاصله اطمینان ۹۵٪",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      }
    ]
  },
  {
    "id": "discrete_math_12",
    "bookTitle": "ریاضیات گسسته",
    "subjectCategory": "ریاضیات گسسته و آمار",
    "grade": 12,
    "tracks": [
      "mathematics"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: آشنایی با نظریه اعداد",
        "topics": [
          {
            "id": "dm12_c1_1",
            "topicName": "درس اول: استدلال ریاضی",
            "recommendedMethod": "اصل استقرای ریاضی و قضیه تقسیم اعداد صحیح",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "dm12_c1_2",
            "topicName": "درس دوم: بخش‌پذیری در اعداد صحیح",
            "recommendedMethod": "ویژگی‌های ب.م.م، ک.م.م و قضیه بزو (Bezout)",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "dm12_c1_3",
            "topicName": "درس سوم: هم‌نهشتی در اعداد صحیح و کاربردها",
            "recommendedMethod": "معادلات هم‌نهشتی، تقویم و حل معادلات سیال خطی",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: گراف و مدل‌سازی",
        "topics": [
          {
            "id": "dm12_c2_1",
            "topicName": "درس اول: معرفی گراف",
            "recommendedMethod": "رأس، یال، درجه رأس و قضیه مجموع درجات گراف (Handshaking)",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "dm12_c2_2",
            "topicName": "درس دوم: مدل‌سازی با گراف",
            "recommendedMethod": "گراف همبند، درخت، عدد احاطه‌گری (گاما) و رنگ‌آمیزی گراف",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: ترکیبیات (شمارش)",
        "topics": [
          {
            "id": "dm12_c3_1",
            "topicName": "درس اول: مباحثی در ترکیبیات",
            "recommendedMethod": "اصل لانه کبوتر و کاربردهای آن در حل مسائل خلاقانه",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "dm12_c3_2",
            "topicName": "درس دوم: روش‌هایی برای شمارش",
            "recommendedMethod": "توزیع اشیاء یکسان در جعبه‌های متمایز و متمم‌شماری",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      }
    ]
  },
  {
    "id": "math_stats_10_hum",
    "bookTitle": "ریاضی و آمار ۱ (انسانی)",
    "subjectCategory": "ریاضی و آمار انسانی",
    "grade": 10,
    "tracks": [
      "humanities"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: معادله درجه دوم",
        "topics": [
          {
            "id": "msh10_c1_1",
            "topicName": "درس اول: معادله و مسائل توصیفی",
            "recommendedMethod": "مدل‌سازی جبری مسائل کلامی",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "msh10_c1_2",
            "topicName": "درس دوم: حل معادله درجه دوم و کاربردها",
            "recommendedMethod": "روش تجزیه، مربع کامل و فرمول دلتا",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "msh10_c1_3",
            "topicName": "درس سوم: معادله‌های شامل عبارت‌های گویا",
            "recommendedMethod": "حذف مخرج و تعیین دامنه متغیر",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: تابع",
        "topics": [
          {
            "id": "msh10_c2_1",
            "topicName": "درس اول: مفهوم تابع",
            "recommendedMethod": "تعریف تابع با جدول و زوج‌های مرتب",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "msh10_c2_2",
            "topicName": "درس دوم: ضابطه جبری تابع",
            "recommendedMethod": "محاسبه مقدار f(x) به ازای مقادیر ورودی",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "msh10_c2_3",
            "topicName": "درس سوم: نمودار تابع خطی",
            "recommendedMethod": "رسم خط، شیب و عرض از مبدأ",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "msh10_c2_4",
            "topicName": "درس چهارم: نمودار تابع درجه دوم",
            "recommendedMethod": "رسم سهمی و پیدا کردن نقطه رأس",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: کار با داده‌های آماری",
        "topics": [
          {
            "id": "msh10_c3_1",
            "topicName": "درس اول: گردآوری داده‌ها",
            "recommendedMethod": "روش‌های مشاهده، پرسش‌نامه و آزمایش",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "msh10_c3_2",
            "topicName": "درس دوم: معیارهای گرایش به مرکز",
            "recommendedMethod": "میانگین، میانه و نما",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "msh10_c3_3",
            "topicName": "درس سوم: معیارهای پراکندگی",
            "recommendedMethod": "واریانس و انحراف معیار داده‌ها",
            "difficulty": "medium",
            "importance": "very_high"
          }
        ]
      },
      {
        "chapterNumber": 4,
        "chapterTitle": "فصل چهارم: نمایش داده‌ها",
        "topics": [
          {
            "id": "msh10_c4_1",
            "topicName": "درس اول: نمودارهای یک‌متغیره",
            "recommendedMethod": "نمودار ستونی، میله‌ای، هیستوگرام و جعبه‌ای",
            "difficulty": "easy",
            "importance": "high"
          }
        ]
      }
    ]
  },
  {
    "id": "math_stats_11_hum",
    "bookTitle": "ریاضی و آمار ۲ (انسانی)",
    "subjectCategory": "ریاضی و آمار انسانی",
    "grade": 11,
    "tracks": [
      "humanities"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: آشنایی با منطق و استدلال ریاضی",
        "topics": [
          {
            "id": "msh11_c1_1",
            "topicName": "درس اول: گزاره‌ها و ترکیب گزاره‌ها",
            "recommendedMethod": "ترکیب عطفی، فصلی، شرطی و دوطرفه",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "msh11_c1_2",
            "topicName": "درس دوم: استدلال ریاضی",
            "recommendedMethod": "اثبات مستقیم و برهان خلف و مثال نقض",
            "difficulty": "medium",
            "importance": "very_high"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: تابع",
        "topics": [
          {
            "id": "msh11_c2_1",
            "topicName": "درس اول: توابع ثابت، چندضابطه‌ای و همانی",
            "recommendedMethod": "رسم توابع و شناسایی دامنه و برد",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "msh11_c2_2",
            "topicName": "درس دوم: توابع پلکانی و قدر مطلقی",
            "recommendedMethod": "تابع علامت، جزء صحیح و رسم با انتقال",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "msh11_c2_3",
            "topicName": "درس سوم: اعمال روی توابع",
            "recommendedMethod": "چهار عمل اصلی روی توابع جبری",
            "difficulty": "medium",
            "importance": "high"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: آمار",
        "topics": [
          {
            "id": "msh11_c3_1",
            "topicName": "درس اول: شاخص‌های آماری",
            "recommendedMethod": "شاخص خط فقر و شاخص قیمت (تورم)",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "msh11_c3_2",
            "topicName": "درس دوم: سری‌های زمانی",
            "recommendedMethod": "رسم نمودار سری زمانی و خط روند داده‌ها",
            "difficulty": "medium",
            "importance": "very_high"
          }
        ]
      }
    ]
  },
  {
    "id": "math_stats_12_hum",
    "bookTitle": "ریاضی و آمار ۳ (انسانی)",
    "subjectCategory": "ریاضی و آمار انسانی",
    "grade": 12,
    "tracks": [
      "humanities"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: آمار و احتمال",
        "topics": [
          {
            "id": "msh12_c1_1",
            "topicName": "درس اول: شمارش",
            "recommendedMethod": "اصول شمارش و فاکتوریل و ترکیب",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "msh12_c1_2",
            "topicName": "درس دوم: احتمال",
            "recommendedMethod": "محاسبه احتمال پیشامدهای تصادفی و مکمل",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "msh12_c1_3",
            "topicName": "درس سوم: چرخه آمار در حل مسائل",
            "recommendedMethod": "چرخه آمار و تصمیم‌گیری داده‌محور",
            "difficulty": "easy",
            "importance": "high"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: الگوهای خطی",
        "topics": [
          {
            "id": "msh12_c2_1",
            "topicName": "درس اول: مدل‌سازی و دنباله",
            "recommendedMethod": "تشکیل جملات دنباله و کاربرد در امور مالی",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "msh12_c2_2",
            "topicName": "درس دوم: دنباله‌های حسابی",
            "recommendedMethod": "فرمول جمله عمومی و مجموع جملات دنباله حسابی",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: الگوهای غیرخطی",
        "topics": [
          {
            "id": "msh12_c3_1",
            "topicName": "درس اول: دنباله هندسی",
            "recommendedMethod": "فرمول جمله عمومی و مجموع جملات دنباله هندسی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "msh12_c3_2",
            "topicName": "درس دوم: ریشه nام و توان گویا",
            "recommendedMethod": "ساده‌سازی عبارات رادیکالی فرجه‌دار",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "msh12_c3_3",
            "topicName": "درس سوم: تابع نمایی",
            "recommendedMethod": "رسم تابع نمایی و محاسبه رشد سود مرکب",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      }
    ]
  },
  {
    "id": "fonun_10",
    "bookTitle": "علوم و فنون ادبی ۱",
    "subjectCategory": "علوم و فنون ادبی",
    "grade": 10,
    "tracks": [
      "humanities"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول",
        "topics": [
          {
            "id": "fonun10_c1_1",
            "topicName": "درس اول: مبانی تحلیل متن",
            "recommendedMethod": "قلمرو زبانی، فکری و ادبی",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          },
          {
            "id": "fonun10_c1_2",
            "topicName": "درس دوم: سازه‌ها و عوامل تأثیرگذار در شعر فارسی",
            "recommendedMethod": "موسیقی شعر و عناصر خیال",
            "difficulty": "hard",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          },
          {
            "id": "fonun10_c1_3",
            "topicName": "درس سوم: واج‌آرایی، واژه‌آرایی",
            "recommendedMethod": "شناسایی نغمه حروف و تکرار واژه‌ها",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم",
        "topics": [
          {
            "id": "fonun10_c2_1",
            "topicName": "درس چهارم: تاریخ ادبیات پیش از اسلام و قرن‌های اولیه هجری",
            "recommendedMethod": "اوستا، پهلوی و شاعران عصر سامانی",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          },
          {
            "id": "fonun10_c2_2",
            "topicName": "درس پنجم: هماهنگی پاره‌های کلام",
            "recommendedMethod": "توازن کلمات و قرینه‌سازی",
            "difficulty": "hard",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          },
          {
            "id": "fonun10_c2_3",
            "topicName": "درس ششم: سجع و انواع آن",
            "recommendedMethod": "سجع متوازی، مطرف و متوازن در گلستان",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم",
        "topics": [
          {
            "id": "fonun10_c3_1",
            "topicName": "درس هفتم: سبک و سبک‌شناسی (سبک خراسانی)",
            "recommendedMethod": "ویژگی‌های زبانی و فکری سبک ترکستانی",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          },
          {
            "id": "fonun10_c3_2",
            "topicName": "درس هشتم: وزن شعر فارسی",
            "recommendedMethod": "تقطیع هجایی، هجاهای کوتاه، بلند و کشیده",
            "difficulty": "hard",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          },
          {
            "id": "fonun10_c3_3",
            "topicName": "درس نهم: موازنه و ترصیع",
            "recommendedMethod": "بررسی تقابل کلمات هم‌وزن و هم‌قافیه",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          }
        ]
      },
      {
        "chapterNumber": 4,
        "chapterTitle": "فصل چهارم",
        "topics": [
          {
            "id": "fonun10_c4_1",
            "topicName": "درس دهم: زبان و ادبیات فارسی در سده‌های پنجم و ششم و ویژگی‌های سبکی آن",
            "recommendedMethod": "سلجوقیان و غزنویان و بینابین خراسانی و عراقی",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          },
          {
            "id": "fonun10_c4_2",
            "topicName": "درس یازدهم: قافیه",
            "recommendedMethod": "حروف اصلی و الحاقی قافیه و عیوب قافیه",
            "difficulty": "hard",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          },
          {
            "id": "fonun10_c4_3",
            "topicName": "درس دوازدهم: جناس و انواع آن",
            "recommendedMethod": "جناس تام، ناقص اختلافی، حرکتی و افزایشی",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "fonun_11",
    "bookTitle": "علوم و فنون ادبی ۲",
    "subjectCategory": "علوم و فنون ادبی",
    "grade": 11,
    "tracks": [
      "humanities"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول",
        "topics": [
          {
            "id": "fonun11_c1_1",
            "topicName": "درس اول: تاریخ ادبیات فارسی در قرن‌های هفتم، هشتم و نهم",
            "recommendedMethod": "حمله مغول، تیموریان، عطار و مولوی و حافظ",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          },
          {
            "id": "fonun11_c1_2",
            "topicName": "درس دوم: پایه‌های آوایی",
            "recommendedMethod": "افاعیل عروضی و دسته‌بندی وزن‌ها",
            "difficulty": "hard",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          },
          {
            "id": "fonun11_c1_3",
            "topicName": "درس سوم: تشبیه",
            "recommendedMethod": "ارکان چهارگانه تشبیه و تشبیه بلیغ",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم",
        "topics": [
          {
            "id": "fonun11_c2_1",
            "topicName": "درس چهارم: سبک‌شناسی قرن‌های هفتم، هشتم و نهم (سبک عراقی)",
            "recommendedMethod": "ویژگی‌های فکری و عرفانی سبک عراقی",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          },
          {
            "id": "fonun11_c2_2",
            "topicName": "درس پنجم: پایه‌های آوایی همسان (۱)",
            "recommendedMethod": "اوزان متفق‌الارکان مثل فعولن فعولن",
            "difficulty": "hard",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          },
          {
            "id": "fonun11_c2_3",
            "topicName": "درس ششم: مجاز",
            "recommendedMethod": "علاقه‌های مجاز (حالیه، محلیه، جزئیه، کلیه)",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم",
        "topics": [
          {
            "id": "fonun11_c3_1",
            "topicName": "درس هفتم: تاریخ ادبیات فارسی در قرن‌های دهم و یازدهم",
            "recommendedMethod": "عصر صفوی و مهاجرت ادیبان به هند",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          },
          {
            "id": "fonun11_c3_2",
            "topicName": "درس هشتم: پایه‌های آوایی همسان (۲)",
            "recommendedMethod": "اوزان چهار رکنی مستفعلن مستفعلن",
            "difficulty": "hard",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          },
          {
            "id": "fonun11_c3_3",
            "topicName": "درس نهم: استعاره",
            "recommendedMethod": "استعاره مصرحه و مکنیه (تشخیص)",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          }
        ]
      },
      {
        "chapterNumber": 4,
        "chapterTitle": "فصل چهارم",
        "topics": [
          {
            "id": "fonun11_c4_1",
            "topicName": "درس دهم: سبک‌شناسی قرن‌های دهم و یازدهم (سبک هندی)",
            "recommendedMethod": "نازک‌خیالی، تمثیل و واژگان عامیانه سبک اصفهانی",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          },
          {
            "id": "fonun11_c4_2",
            "topicName": "درس یازدهم: پایه‌های آوایی همسان دو لختی",
            "recommendedMethod": "اوزان متناوب مانند مفتعلن فاعلن",
            "difficulty": "hard",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          },
          {
            "id": "fonun11_c4_3",
            "topicName": "درس دوازدهم: کنایه",
            "recommendedMethod": "کنایه با واسطه و بی‌واسطه و دریافت مقصود",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "fonun_12",
    "bookTitle": "علوم و فنون ادبی ۳",
    "subjectCategory": "علوم و فنون ادبی",
    "grade": 12,
    "tracks": [
      "humanities"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول",
        "topics": [
          {
            "id": "fonun12_c1_1",
            "topicName": "درس یکم: تاریخ ادبیات قرن‌های دوازدهم و سیزدهم (دوره بازگشت و بیداری)",
            "recommendedMethod": "نهضت بازگشت ادبی و شعر مشروطه",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          },
          {
            "id": "fonun12_c1_2",
            "topicName": "درس دوم: پایه‌های آوایی ناهمسان",
            "recommendedMethod": "تقطیع اوزان مختلف‌الارکان مانند فاعلاتن مفاعلن",
            "difficulty": "hard",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          },
          {
            "id": "fonun12_c1_3",
            "topicName": "درس سوم: مراعات نظیر، تلمیح و تضمین",
            "recommendedMethod": "شبکه معنایی کلمات و اشارات تاریخی",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم",
        "topics": [
          {
            "id": "fonun12_c2_1",
            "topicName": "درس چهارم: سبک‌شناسی قرن‌های دوازدهم و سیزدهم (دوره بازگشت و بیداری)",
            "recommendedMethod": "ساده‌نویسی روزنامه‌ای و شعر اعتراض",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          },
          {
            "id": "fonun12_c2_2",
            "topicName": "درس پنجم: اختیارات شاعری (۱): زبانی",
            "recommendedMethod": "تغییر کمیت مصوت‌ها، اشباع و صامت میانجی",
            "difficulty": "hard",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          },
          {
            "id": "fonun12_c2_3",
            "topicName": "درس ششم: لف و نشر، تضاد و متناقض‌نما",
            "recommendedMethod": "لف و نشر مرتب و مشوش و پارادوکس",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم",
        "topics": [
          {
            "id": "fonun12_c3_1",
            "topicName": "درس هفتم: تاریخ ادبیات قرن چهاردهم",
            "recommendedMethod": "نیما یوشیج و پیدایش شعر نو و رمان معاصر",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          },
          {
            "id": "fonun12_c3_2",
            "topicName": "درس هشتم: اختیارات شاعری (۲): وزنی",
            "recommendedMethod": "فاعلاتن به جای فعلاتن و ابدال هجایی",
            "difficulty": "hard",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          },
          {
            "id": "fonun12_c3_3",
            "topicName": "درس نهم: اغراق، ایهام و ایهام تناسب",
            "recommendedMethod": "ایهام دو معنایی و ذهن‌آگاهی در غزل حافظ",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          }
        ]
      },
      {
        "chapterNumber": 4,
        "chapterTitle": "فصل چهارم",
        "topics": [
          {
            "id": "fonun12_c4_1",
            "topicName": "درس دهم: سبک‌شناسی دوره معاصر و انقلاب اسلامی",
            "recommendedMethod": "ویژگی‌های زبانی شعر نیمایی و سپید",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          },
          {
            "id": "fonun12_c4_2",
            "topicName": "درس یازدهم: وزن در شعر نیمایی",
            "recommendedMethod": "کوتاه و بلندی سطرها بر اساس پایه‌های وزنی",
            "difficulty": "hard",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          },
          {
            "id": "fonun12_c4_3",
            "topicName": "درس دوازدهم: حسن تعلیل، حس‌آمیزی و اسلوب معادله",
            "recommendedMethod": "علت‌آفرینی شاعرانه و آمیزش حواس",
            "difficulty": "medium",
            "importance": "critical",
            "estimatedMinutes": 35,
            "keyConcepts": [
              "تاریخ ادبیات",
              "عروض و قافیه",
              "آرایه‌های معنوی و لفظی",
              "سبک‌شناسی"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "sociology_10",
    "bookTitle": "جامعه‌شناسی ۱",
    "subjectCategory": "جامعه‌شناسی",
    "grade": 10,
    "tracks": [
      "humanities"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: زندگی اجتماعی",
        "topics": [
          {
            "id": "soc10_c1_1",
            "topicName": "درس اول: کنش‌های ما",
            "recommendedMethod": "کنش ارادی، معنادار و آگاهانه",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "soc10_c1_2",
            "topicName": "درس دوم: پدیده‌های اجتماعی",
            "recommendedMethod": "هنجارها، نقش‌ها و ارزش‌های اجتماعی",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "soc10_c1_3",
            "topicName": "درس سوم: جهان اجتماعی",
            "recommendedMethod": "مرزهای جهان اجتماعی و اعتباریات",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "soc10_c1_4",
            "topicName": "درس چهارم: اجزا و لایه‌های جهان اجتماعی",
            "recommendedMethod": "لایه‌های عمیق و سطحی جهان اجتماعی",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "soc10_c1_5",
            "topicName": "درس پنجم: جهان‌های اجتماعی",
            "recommendedMethod": "تنوع جهان‌های فرهنگی و تمدنی",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "soc10_c1_6",
            "topicName": "درس ششم: پیامدهای جهان اجتماعی",
            "recommendedMethod": "پیامدهای تکوینی و اعتباری",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "soc10_c1_7",
            "topicName": "درس هفتم: ارزیابی جهان‌های اجتماعی",
            "recommendedMethod": "معیارهای داوری عقلانی میان فرهنگ‌ها",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: هویت",
        "topics": [
          {
            "id": "soc10_c2_1",
            "topicName": "درس هشتم: هویت",
            "recommendedMethod": "ویژگی‌های انتسابی و اکتسابی هویت",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "soc10_c2_2",
            "topicName": "درس نهم: بازتولید هویت اجتماعی",
            "recommendedMethod": "سازوکار جامعه‌پذیری و نظارت اجتماعی",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "soc10_c2_3",
            "topicName": "درس دهم: تغییرات هویت اجتماعی",
            "recommendedMethod": "تحرک اجتماعی صعودی، نزولی و افقی",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "soc10_c2_4",
            "topicName": "درس یازدهم: تحولات هویتی جهان اجتماعی (علل درونی)",
            "recommendedMethod": "تضاد فرهنگی، ازخودبیگانگی و بحران هویت",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "soc10_c2_5",
            "topicName": "درس دوازدهم: تحولات هویتی جهان اجتماعی (علل بیرونی)",
            "recommendedMethod": "تهاجم فرهنگی و استعمارزدگی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "soc10_c2_6",
            "topicName": "درس سیزدهم: هویت ایرانی (۱)",
            "recommendedMethod": "پیشینه هویت ایرانی در دوران باستان",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "soc10_c2_7",
            "topicName": "درس چهاردهم: هویت ایرانی (۲)",
            "recommendedMethod": "پیوند تمدن ایرانی با اسلام",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "soc10_c2_8",
            "topicName": "درس پانزدهم: هویت ایرانی (۳)",
            "recommendedMethod": "مواجهه ایران با تمدن مدرن غرب",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "soc10_c2_9",
            "topicName": "درس شانزدهم: هویت ایرانی (۴)",
            "recommendedMethod": "انقلاب اسلامی و احیای هویت تمدنی نوین",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      }
    ]
  },
  {
    "id": "sociology_11",
    "bookTitle": "جامعه‌شناسی ۲",
    "subjectCategory": "جامعه‌شناسی",
    "grade": 11,
    "tracks": [
      "humanities"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: فرهنگ جهانی",
        "topics": [
          {
            "id": "soc11_c1_1",
            "topicName": "درس اول: جهان فرهنگی",
            "recommendedMethod": "مرزهای فرهنگ حق و باطل",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "soc11_c1_2",
            "topicName": "درس دوم: فرهنگ جهانی",
            "recommendedMethod": "ویژگی‌های فرهنگی با قابلیت گسترش جهانی",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "soc11_c1_3",
            "topicName": "درس سوم: نمونه‌های فرهنگ جهانی ۱",
            "recommendedMethod": "تمدن‌های باستانی و امپراتوری‌ها",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "soc11_c1_4",
            "topicName": "درس چهارم: نمونه‌های فرهنگ جهانی ۲",
            "recommendedMethod": "فرهنگ توحیدی اسلام و ابعاد فراگیر آن",
            "difficulty": "medium",
            "importance": "very_high"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: فرهنگ معاصر غرب و نظام نوین جهانی",
        "topics": [
          {
            "id": "soc11_c2_1",
            "topicName": "درس پنجم: باورها و ارزش‌های بنیادین فرهنگ غرب",
            "recommendedMethod": "سکولاریسم، اومانیسم و روشنگری حسی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "soc11_c2_2",
            "topicName": "درس ششم: چگونگی تکوین فرهنگ معاصر غرب",
            "recommendedMethod": "دوران رنسانس، اصلاح مذهبی و انقلاب صنعتی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "soc11_c2_3",
            "topicName": "درس هفتم: جامعه جهانی",
            "recommendedMethod": "شکل‌گیری نظام نوین بین‌الملل و استعمار کهن",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "soc11_c2_4",
            "topicName": "درس هشتم: تحولات نظام جهانی",
            "recommendedMethod": "استعمار نو و فرانو و جهان تک‌قطبی",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: چالش‌های جهانی",
        "topics": [
          {
            "id": "soc11_c3_1",
            "topicName": "درس نهم: جهان دو قطبی",
            "recommendedMethod": "جنگ سرد و تقابل بلوک شرق و غرب",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "soc11_c3_2",
            "topicName": "درس دهم: جنگ‌ها و تقابل‌های جهانی",
            "recommendedMethod": "ژئوپلیتیک تسلیحاتی و رقابت قدرت‌ها",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "soc11_c3_3",
            "topicName": "درس یازدهم: بحران‌های اقتصادی و زیست‌محیطی",
            "recommendedMethod": "کاپیتالیسم، فقر جهانی و تخریب اکوسیستم",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "soc11_c3_4",
            "topicName": "درس دوازدهم: بحران‌های معرفتی و معنوی",
            "recommendedMethod": "نیهیلیسم، بحران معنا و پوچ‌گرایی مدرن",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 4,
        "chapterTitle": "فصل چهارم: بیداری اسلامی و جهان جدید",
        "topics": [
          {
            "id": "soc11_c4_1",
            "topicName": "درس سیزدهم: سرآغاز بیداری اسلامی",
            "recommendedMethod": "سید جمال‌الدین اسدآبادی و جنبش‌های احیاگر",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "soc11_c4_2",
            "topicName": "درس چهاردهم: انقلاب اسلامی ایران، نقطه عطف بیداری اسلامی",
            "recommendedMethod": "الگوی حکمرانی دینی و مقاومت در برابر هژمونی غرب",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "soc11_c4_3",
            "topicName": "درس پانزدهم: افق بیداری اسلامی",
            "recommendedMethod": "تمدن نوین اسلامی و آینده تمدن جهانی",
            "difficulty": "medium",
            "importance": "very_high"
          }
        ]
      }
    ]
  },
  {
    "id": "sociology_12",
    "bookTitle": "جامعه‌شناسی ۳",
    "subjectCategory": "جامعه‌شناسی",
    "grade": 12,
    "tracks": [
      "humanities"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "دروس پیوسته جامعه‌شناسی ۳",
        "topics": [
          {
            "id": "soc12_1",
            "topicName": "درس اول: ذخیره دانشی",
            "recommendedMethod": "دانش عمومی در برابر دانش علمی",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "soc12_2",
            "topicName": "درس دوم: علوم اجتماعی",
            "recommendedMethod": "رویکردهای پوزیتیویستی، تفسیری و انتقادی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "soc12_3",
            "topicName": "درس سوم: نظم اجتماعی",
            "recommendedMethod": "نظم مکانیکی و ارگانیکی در مکاتب جامعه‌شناسی",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "soc12_4",
            "topicName": "درس چهارم: کنش اجتماعی",
            "recommendedMethod": "جامعه‌شناسی تبیینی ماکس وبر و فهم همدلانه",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "soc12_5",
            "topicName": "درس پنجم: معنای زندگی",
            "recommendedMethod": "رویکردهای معناگرایانه و نقد ماتریالیسم",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "soc12_6",
            "topicName": "درس ششم: قدرت اجتماعی",
            "recommendedMethod": "مشروعیت قدرت، حاکمیت و اقتدار",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "soc12_7",
            "topicName": "درس هفتم: نابرابری اجتماعی",
            "recommendedMethod": "طبقات اجتماعی، قشربندی و عدالت توزیعی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "soc12_8",
            "topicName": "درس هشتم: سیاستِ هویت",
            "recommendedMethod": "جنبش‌های هویتی نوین و چندفرهنگ‌گرایی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "soc12_9",
            "topicName": "درس نهم: پیشینه علوم اجتماعی در جهان اسلام",
            "recommendedMethod": "آرای فارابی، ابن خلدون و علامه طباطبایی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "soc12_10",
            "topicName": "درس دهم: افق علوم اجتماعی در جهان اسلام",
            "recommendedMethod": "علم دینی، حکمت عملی و تمدن‌سازی آینده",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      }
    ]
  },
  {
    "id": "manteq_10",
    "bookTitle": "منطق",
    "subjectCategory": "فلسفه و منطق",
    "grade": 10,
    "tracks": [
      "humanities"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "بخش اول: منطق و مباحث آن",
        "topics": [
          {
            "id": "man10_1",
            "topicName": "درس اول: منطق، ترازوی اندیشه",
            "recommendedMethod": "تعریف فکر، مغالطه، تصور و تصدیق",
            "difficulty": "easy",
            "importance": "high"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "بخش دوم: روابط میان ذهن، زبان و خارج",
        "topics": [
          {
            "id": "man10_2",
            "topicName": "درس دوم: لفظ و معنا",
            "recommendedMethod": "دلالت مطابقی، تضمنی، التزامی و مغالطه اشتراک لفظ",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "man10_3",
            "topicName": "درس سوم: مفهوم و مصداق",
            "recommendedMethod": "مفهوم جزئی و کلی، نسبت‌های چهارگانه (تساوی، تباین، عموم و خصوص مطلق و من وجه)",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "بخش سوم: تعریف",
        "topics": [
          {
            "id": "man10_4",
            "topicName": "درس چهارم: اقسام و شرایط تعریف",
            "recommendedMethod": "تعریف به حد تام، حد ناقص، رسم تام و رسم ناقص و شرایط مانع و جامع بودن",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 4,
        "chapterTitle": "بخش چهارم: استدلال استقرایی",
        "topics": [
          {
            "id": "man10_5",
            "topicName": "درس پنجم: اقسام استدلال استقرایی",
            "recommendedMethod": "استدلال تمثیلی، استقرای تعمیمی و استنتاج بهترین تبیین",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 5,
        "chapterTitle": "بخش پنجم: قضیه حملی و قیاس اقترانی",
        "topics": [
          {
            "id": "man10_6",
            "topicName": "درس ششم: قضیه حملی",
            "recommendedMethod": "موضوع، محمول، رابطه، سور قضایا و محصورات چهارگانه",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "man10_7",
            "topicName": "درس هفتم: احکام قضایا",
            "recommendedMethod": "تناقض، تضاد، تداخل و عکس مستوی قضایا",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "man10_8",
            "topicName": "درس هشتم: قیاس اقترانی",
            "recommendedMethod": "حد وسط، اشکال چهارگانه قیاس و شرایط انتاج شکل اول",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 6,
        "chapterTitle": "بخش ششم: قضیه شرطی و قیاس استثنایی",
        "topics": [
          {
            "id": "man10_9",
            "topicName": "درس نهم: قضیه شرطی و قیاس استثنایی",
            "recommendedMethod": "شرطی متصل و منفصل، وضع مقدم و نفی تالی",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 7,
        "chapterTitle": "بخش هفتم: منطق کاربردی",
        "topics": [
          {
            "id": "man10_10",
            "topicName": "درس دهم: سنجشگری در تفکر",
            "recommendedMethod": "شناسایی و تحلیل انواع مغالطات پرکاربرد کنکور",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      }
    ]
  },
  {
    "id": "falsafah_11",
    "bookTitle": "فلسفه ۱",
    "subjectCategory": "فلسفه و منطق",
    "grade": 11,
    "tracks": [
      "humanities"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: فلسفه و ابعاد آن",
        "topics": [
          {
            "id": "fal11_c1_1",
            "topicName": "درس اول: چیستی فلسفه",
            "recommendedMethod": "حیرت، پرسشگری و تفاوت علم و فلسفه",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "fal11_c1_2",
            "topicName": "درس دوم: ریشه و شاخه‌های فلسفه",
            "recommendedMethod": "مابعدالطبیعه، اخلاق، معرفت‌شناسی و فلسفه‌های مضاف",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "fal11_c1_3",
            "topicName": "درس سوم: فلسفه و زندگی",
            "recommendedMethod": "جهان‌بینی و تأثیر اندیشه فلسفی بر زیست انسان",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "fal11_c1_4",
            "topicName": "درس چهارم: آغاز تاریخی فلسفه",
            "recommendedMethod": "فیلسوفان پیشاسقراطی، تالس، هراکلیتوس و پارمنیدس",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "fal11_c1_5",
            "topicName": "درس پنجم: زندگی بر اساس اندیشه",
            "recommendedMethod": "سقراط، روش مامایی و جدل سقراطی",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: معرفت و شناخت",
        "topics": [
          {
            "id": "fal11_c2_1",
            "topicName": "درس ششم: امکان شناخت",
            "recommendedMethod": "سوفسطائیان، شکاکیت و استدلال ارسطو در رد نسبی‌گرایی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "fal11_c2_2",
            "topicName": "درس هفتم: ابزارهای شناخت",
            "recommendedMethod": "حس، عقل، قلب و وحی در مکاتب معرفت‌شناسی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "fal11_c2_3",
            "topicName": "درس هشتم: نگاهی به تاریخچه معرفت",
            "recommendedMethod": "افلاطون و نظریه مثل، ارسطو و تجرید عقلانی",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: انسان",
        "topics": [
          {
            "id": "fal11_c3_1",
            "topicName": "درس نهم: چیستی انسان (۱)",
            "recommendedMethod": "نظریات ماتریالیستی در برابر دیدگاه اصالت روح",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "fal11_c3_2",
            "topicName": "درس دهم: چیستی انسان (۲)",
            "recommendedMethod": "نفس مجرد، تجرد برزخی و تجرد تام عقلانی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "fal11_c3_3",
            "topicName": "درس یازدهم: انسان، موجود اخلاق‌گرا",
            "recommendedMethod": "نظریات اخلاق وظیفه‌گرایی کانت در برابر اخلاق فضیلت ارسطو",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      }
    ]
  },
  {
    "id": "falsafah_12",
    "bookTitle": "فلسفه ۲",
    "subjectCategory": "فلسفه و منطق",
    "grade": 12,
    "tracks": [
      "humanities"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "بخش اول: پیرامون واقعیت و هستی",
        "topics": [
          {
            "id": "fal12_c1_1",
            "topicName": "درس اول: هستی و چیستی",
            "recommendedMethod": "مفهوم وجود و ماهیت و اصالت وجود صدرالمتألهین",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "fal12_c1_2",
            "topicName": "درس دوم: جهان ممکنات",
            "recommendedMethod": "مواد ثلاث: وجوب، امکان و امتناع در فلسفه سینوی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "fal12_c1_3",
            "topicName": "درس سوم: جهان علّی و معلولی",
            "recommendedMethod": "اصل علیت، وجوب علی و معلولی و قاعده سنخیت علت و معلول",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "fal12_c1_4",
            "topicName": "درس چهارم: کدام تصویر از جهان؟",
            "recommendedMethod": "تثلیث عوالم (ماده، مثال، عقل) و نظریه حرکت جوهری ملاصدرا",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "بخش دوم: پیرامون خدا و عقل",
        "topics": [
          {
            "id": "fal12_c2_1",
            "topicName": "درس پنجم: خدا در فلسفه (قسمت اول)",
            "recommendedMethod": "برهان امکان و وجوب ابن سینا برای اثبات مبدأ اول",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "fal12_c2_2",
            "topicName": "درس ششم: خدا در فلسفه (قسمت دوم)",
            "recommendedMethod": "برهان صدیقین ملاصدرا و صفات کمالیه باری‌تعالی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "fal12_c2_3",
            "topicName": "درس هفتم: عقل در فلسفه (قسمت اول)",
            "recommendedMethod": "عقل نظری و عقل عملی و مراتب تجرید عقلانی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "fal12_c2_4",
            "topicName": "درس هشتم: عقل در فلسفه (قسمت دوم)",
            "recommendedMethod": "رویکردهای دکارت، کانت و پوزیتیویسم نسبت به توان عقل",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "بخش سوم: نگاهی اجمالی به سیر فلسفه در جهان اسلام",
        "topics": [
          {
            "id": "fal12_c3_1",
            "topicName": "درس نهم: آغاز فلسفه در جهان اسلام",
            "recommendedMethod": "کندی، فارابی (مؤسس فلسفه اسلامی) و رساله الجمع بین الرأیین",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "fal12_c3_2",
            "topicName": "درس دهم: دوره میانی",
            "recommendedMethod": "ابن سینا (حکمت مشاء)، شیخ اشراق سهروردی (حکمت اشراق)",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "fal12_c3_3",
            "topicName": "درس یازدهم: دوره متأخر",
            "recommendedMethod": "ملاصدرا و حکمت متعالیه و شاهکار اسفار اربعه",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "fal12_c3_4",
            "topicName": "درس دوازدهم: حکمت معاصر",
            "recommendedMethod": "علامه طباطبایی و شهید مطهری در پاسخ به ماتریالیسم فلسفی",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      }
    ]
  },
  {
    "id": "history_10",
    "bookTitle": "تاریخ ۱ (ایران و جهان باستان)",
    "subjectCategory": "تاریخ",
    "grade": 10,
    "tracks": [
      "humanities"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: تاریخ‌شناسی؛ کاوش در گذشته",
        "topics": [
          {
            "id": "his10_c1_1",
            "topicName": "درس اول: تاریخ و تاریخ‌نگاری",
            "recommendedMethod": "بررسی منابع دست اول و دوم",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "his10_c1_2",
            "topicName": "درس دوم: تاریخ، زمان و مکان",
            "recommendedMethod": "گاه‌شماری و جغرافیای تاریخی",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "his10_c1_3",
            "topicName": "درس سوم: باستان‌شناسی؛ در جست‌وجوی میراث فرهنگی",
            "recommendedMethod": "کاوش‌های باستان‌شناختی و موزه",
            "difficulty": "medium",
            "importance": "high"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: جهان در عصر باستان؛ میراث بشری",
        "topics": [
          {
            "id": "his10_c2_1",
            "topicName": "درس چهارم: پیدایش تمدن؛ بین‌النهرین و مصر",
            "recommendedMethod": "سومر، بابل، قانون حمورابی و اهرام مصر",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "his10_c2_2",
            "topicName": "درس پنجم: هند و چین",
            "recommendedMethod": "بودیسم، برهمنیسم و کنفوسیوس",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "his10_c2_3",
            "topicName": "درس ششم: یونان و روم",
            "recommendedMethod": "دولت‌شهرهای آتن و اسپارت و امپراتوری روم",
            "difficulty": "hard",
            "importance": "very_high"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: ایران در عصر باستان؛ سرآغاز هویت ایرانی",
        "topics": [
          {
            "id": "his10_c3_1",
            "topicName": "درس هفتم: مطالعه و کاوش در گذشته‌های دور",
            "recommendedMethod": "ایلام و عصر مفرغ و آهن",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "his10_c3_2",
            "topicName": "درس هشتم: سپیده‌دم تمدن ایرانی",
            "recommendedMethod": "مادها و شکل‌گیری دولت متحد",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "his10_c3_3",
            "topicName": "درس نهم: از ورود آریایی‌ها تا پایان هخامنشیان",
            "recommendedMethod": "کوروش بزرگ، داریوش و منشور حقوق بشر",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "his10_c3_4",
            "topicName": "درس دهم: اشکانیان و ساسانیان",
            "recommendedMethod": "پارتیان و ساسانیان و جنگ‌های ایران و روم",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "his10_c3_5",
            "topicName": "درس یازدهم: آیین کشورداری",
            "recommendedMethod": "سازمان اداری و مالیاتی باستان",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "his10_c3_6",
            "topicName": "درس دوازدهم: جامعه و خانواده",
            "recommendedMethod": "طبقات اجتماعی ساسانی و جایگاه دهقانان",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "his10_c3_7",
            "topicName": "درس سیزدهم: اقتصاد و معیشت",
            "recommendedMethod": "جاده ابریشم و ضرب سکه‌های دریک",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "his10_c3_8",
            "topicName": "درس چهاردهم: دین و اعتقادات",
            "recommendedMethod": "زرتشت، اوستا، مهرپرستی و مانی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "his10_c3_9",
            "topicName": "درس پانزدهم: زبان و آموزش",
            "recommendedMethod": "خط میخی، پهلوی اشکانی و دانشگاه جندی‌شاپور",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "his10_c3_10",
            "topicName": "درس شانزدهم: هنر و معماری",
            "recommendedMethod": "تخت جمشید، پاسارگاد و طاق کسری",
            "difficulty": "medium",
            "importance": "very_high"
          }
        ]
      }
    ]
  },
  {
    "id": "history_11",
    "bookTitle": "تاریخ ۲ (ایران و جهان اسلام)",
    "subjectCategory": "تاریخ",
    "grade": 11,
    "tracks": [
      "humanities"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: تاریخ‌شناسی",
        "topics": [
          {
            "id": "his11_c1_1",
            "topicName": "درس اول: منابع پژوهش در تاریخ اسلام و ایران دوران اسلامی",
            "recommendedMethod": "کتب سیره، مغازی، طبقات و انساب",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "his11_c1_2",
            "topicName": "درس دوم: روش پژوهش در تاریخ؛ بررسی و سنجش اعتبار شواهد و مدارک",
            "recommendedMethod": "نقد بیرونی و درونی منابع تاریخی",
            "difficulty": "medium",
            "importance": "high"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: ظهور اسلام، حرکتی تازه در تاریخ بشر",
        "topics": [
          {
            "id": "his11_c2_1",
            "topicName": "درس سوم: اسلام در مکه",
            "recommendedMethod": "بعثت نبوی و مقاومت مشرکان و هجرت حبشه",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "his11_c2_2",
            "topicName": "درس چهارم: امت و حکومت نبوی در مدینه",
            "recommendedMethod": "میثاق مدینه، غزوات پیامبر و فتح مکه",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "his11_c2_3",
            "topicName": "درس پنجم: تثبیت و گسترش اسلام در دوران خلفای نخستین",
            "recommendedMethod": "سقیفه، فتوحات و حکومت عدالت‌گستر امام علی (ع)",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "his11_c2_4",
            "topicName": "درس ششم: امویان بر مسند قدرت",
            "recommendedMethod": "معاویه، واقعه عاشورا و قیام‌های شیعی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "his11_c2_5",
            "topicName": "درس هفتم: جهان اسلام در عصر خلافت عباسی",
            "recommendedMethod": "نهضت ترجمه، بیت‌الحکمه و زوال عباسیان",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: ایران؛ از ورود اسلام تا پایان صفویه",
        "topics": [
          {
            "id": "his11_c3_1",
            "topicName": "درس هشتم: اسلام در ایران؛ زمینه‌های ظهور تمدن ایرانی ـ اسلامی",
            "recommendedMethod": "استقبال ایرانیان از مکتب اهل بیت",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "his11_c3_2",
            "topicName": "درس نهم: ظهور و گسترش تمدن ایرانی ـ اسلامی",
            "recommendedMethod": "حکومت‌های طاهریان، صفاریان، سامانیان و آل‌بویه",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "his11_c3_3",
            "topicName": "درس دهم: ایران در دوران غزنوی، سلجوقی و خوارزمشاهی",
            "recommendedMethod": "نظام‌الملک، نظامیه‌ها و هجوم خوارزمشاهیان",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "his11_c3_4",
            "topicName": "درس یازدهم: حکومت، جامعه و اقتصاد در عصر مغول ـ تیموری",
            "recommendedMethod": "ایلخانان، خواجه نصیرالدین طوسی و رصدخانه مراغه",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "his11_c3_5",
            "topicName": "درس دوازدهم: فرهنگ و هنر در عصر مغول ـ تیموری",
            "recommendedMethod": "مکتب نگارگری هرات و تبریز و سبک معماری",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "his11_c3_6",
            "topicName": "درس سیزدهم: تحولات سیاسی و اقتصادی ایران در دوره صفوی",
            "recommendedMethod": "شاه اسماعیل، شاه عباس کبیر و تثبیت مذهب تشیع",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "his11_c3_7",
            "topicName": "درس چهاردهم: فرهنگ و تمدن در عصر صفوی",
            "recommendedMethod": "شکوفایی معماری اصفهان و مکتب فلسفی اصفهان",
            "difficulty": "medium",
            "importance": "very_high"
          }
        ]
      },
      {
        "chapterNumber": 4,
        "chapterTitle": "فصل چهارم: اروپا در قرون وسطا و عصر جدید",
        "topics": [
          {
            "id": "his11_c4_1",
            "topicName": "درس پانزدهم: قرون وسطا",
            "recommendedMethod": "فئودالیسم، کلیسای کاتولیک و جنگ‌های صلیبی",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "his11_c4_2",
            "topicName": "درس شانزدهم: رنسانس و عصر جدید",
            "recommendedMethod": "اکتشافات جغرافیایی و پیدایش دولت‌ملت‌های مدرن",
            "difficulty": "hard",
            "importance": "very_high"
          }
        ]
      }
    ]
  },
  {
    "id": "history_12",
    "bookTitle": "تاریخ ۳ (ایران و جهان معاصر)",
    "subjectCategory": "تاریخ",
    "grade": 12,
    "tracks": [
      "humanities"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "دروس تاریخ ۳ معاصر",
        "topics": [
          {
            "id": "his12_1",
            "topicName": "درس اول: تاریخ‌نگاری و گونه‌های منابع دوره معاصر",
            "recommendedMethod": "اسناد محرمانه، مطبوعات و خاطره‌نگاری",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "his12_2",
            "topicName": "درس دوم: ایران و جهان در آستانه دوره معاصر",
            "recommendedMethod": "افشاریه، زندیه و تکوین قاجاریه",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "his12_3",
            "topicName": "درس سوم: سیاست و حکومت در عصر قاجار (آغاز تا پایان ناصرالدین‌شاه)",
            "recommendedMethod": "قراردادهای گلستان و ترکمانچای و اصلاحات امیرکبیر",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "his12_4",
            "topicName": "درس چهارم: اوضاع اجتماعی، اقتصادی و فرهنگی عصر قاجار",
            "recommendedMethod": "تأسیس دارالفنون و امتیازات استعماری توتون و تنباکو",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "his12_5",
            "topicName": "درس پنجم: نهضت مشروطه ایران",
            "recommendedMethod": "علل انقلاب مشروطه، مهاجرت صغری و کبری و به توپ بستن مجلس",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "his12_6",
            "topicName": "درس ششم: جنگ جهانی اول و ایران",
            "recommendedMethod": "نقض بی‌طرفی ایران، قحطی بزرگ و قرارداد ۱۹۱۹",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "his12_7",
            "topicName": "درس هفتم: ایران در دوره حکومت رضاشاه",
            "recommendedMethod": "کودتای ۱۲۹۹، کشف حجاب و انحلال ایلات",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "his12_8",
            "topicName": "درس هشتم: جنگ جهانی دوم و جهان پس از آن",
            "recommendedMethod": "اشغال ایران در شهریور ۱۳۲۰ و تبعید رضاشاه",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "his12_9",
            "topicName": "درس نهم: نهضت ملی شدن صنعت نفت ایران",
            "recommendedMethod": "آیت‌الله کاشانی، مصدق و کودتای ۲۸ مرداد ۱۳۳۲",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "his12_10",
            "topicName": "درس دهم: انقلاب اسلامی",
            "recommendedMethod": "نهضت ۱۵ خرداد ۱۳۴۲، قیام ۱۹ دی و پیروزی انقلاب بهمن ۱۳۵۷",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "his12_11",
            "topicName": "درس یازدهم: استقرار و تثبیت نظام جمهوری اسلامی",
            "recommendedMethod": "همه‌پرسی فروردین ۵۸، قانون اساسی و بحران‌های تجزیه‌طلبی",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "his12_12",
            "topicName": "درس دوازدهم: جنگ تحمیلی و دفاع مقدس",
            "recommendedMethod": "عملیات‌های فتح‌المبین، بیت‌المقدس و قطعنامه ۵۹۸",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      }
    ]
  },
  {
    "id": "geography_10",
    "bookTitle": "جغرافیای ایران",
    "subjectCategory": "جغرافیا",
    "grade": 10,
    "tracks": [
      "humanities"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: جغرافیا چیست؟",
        "topics": [
          {
            "id": "geo10_c1_1",
            "topicName": "درس اول: جغرافیا، علمی برای زندگی بهتر",
            "recommendedMethod": "دید ترکیبی و روابط متقابل انسان و محیط",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "geo10_c1_2",
            "topicName": "درس دوم: روش مطالعه و پژوهش در جغرافیا",
            "recommendedMethod": "نقشه‌ها، سنجش از دور (RS) و سامانه GIS",
            "difficulty": "medium",
            "importance": "very_high"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: جغرافیای طبیعی ایران",
        "topics": [
          {
            "id": "geo10_c2_1",
            "topicName": "درس سوم: موقعیت جغرافیایی ایران",
            "recommendedMethod": "موقعیت ریاضی و نسبی و تنگه هرمز",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "geo10_c2_2",
            "topicName": "درس چهارم: ناهمواری‌های ایران",
            "recommendedMethod": "کوه‌های شمالی، زاگرس، نواحی مرکزی و دشت‌ها",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "geo10_c2_3",
            "topicName": "درس پنجم: آب و هوای ایران",
            "recommendedMethod": "توده‌های هوای سودانی، سیبری و مدیترانه‌ای وارد بر کشور",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "geo10_c2_4",
            "topicName": "درس ششم: منابع آب ایران",
            "recommendedMethod": "رودهای حوضه خزر و خلیج فارس، دریاچه‌ها و قنات",
            "difficulty": "medium",
            "importance": "very_high"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: جغرافیای انسانی ایران",
        "topics": [
          {
            "id": "geo10_c3_1",
            "topicName": "درس هفتم: ویژگی‌های جمعیت ایران",
            "recommendedMethod": "رشد جمعیت، ساخت سنی و جنسی و مهاجرت",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "geo10_c3_2",
            "topicName": "درس هشتم: تقسیمات کشوری ایران",
            "recommendedMethod": "سلسله مراتب روستا، دهستان، بخش، شهرستان، استان",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "geo10_c3_3",
            "topicName": "درس نهم: سکونتگاه‌های ایران",
            "recommendedMethod": "انواع سکونتگاه‌های روستایی، شهری و عشایری",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "geo10_c3_4",
            "topicName": "درس دهم: توان‌های اقتصادی ایران",
            "recommendedMethod": "ظرفیت‌های کشاورزی، معادن، گردشگری و ژئوتوریسم",
            "difficulty": "medium",
            "importance": "high"
          }
        ]
      }
    ]
  },
  {
    "id": "geography_11",
    "bookTitle": "جغرافیای ۲ (جغرافیای ناحیه‌ای)",
    "subjectCategory": "جغرافیا",
    "grade": 11,
    "tracks": [
      "humanities"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: ناحیه چیست؟",
        "topics": [
          {
            "id": "geo11_c1_1",
            "topicName": "درس اول: معنا و مفهوم ناحیه",
            "recommendedMethod": "تعریف ناحیه و معیارهای تحدید حدود",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "geo11_c1_2",
            "topicName": "درس دوم: انسان و ناحیه",
            "recommendedMethod": "انطباق فعالیت‌های انسانی بر بستر طبیعی",
            "difficulty": "medium",
            "importance": "high"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: نواحی طبیعی",
        "topics": [
          {
            "id": "geo11_c2_1",
            "topicName": "درس سوم: نواحی آب‌وهوایی",
            "recommendedMethod": "اقلیم‌های استوایی، معتدل و قطبی در کره زمین",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "geo11_c2_2",
            "topicName": "درس چهارم: ناهمواری‌ها و اشکال زمین",
            "recommendedMethod": "فرسایش بادی، آبی و یخچالی در لندفرم‌ها",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "geo11_c2_3",
            "topicName": "درس پنجم: نواحی زیستی",
            "recommendedMethod": "بیوم‌های جنگل حاره‌ای، ساوان، توندرا و تایگا",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: نواحی انسانی",
        "topics": [
          {
            "id": "geo11_c3_1",
            "topicName": "درس ششم: نواحی فرهنگی",
            "recommendedMethod": "پهنه‌های زبانی و ادیان در جغرافیای جهانی",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "geo11_c3_2",
            "topicName": "درس هفتم: نواحی اقتصادی (کشاورزی و صنعتی)",
            "recommendedMethod": "کشت تجاری، معیشتی و کمربندهای صنعتی جهان",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "geo11_c3_3",
            "topicName": "درس هشتم: نواحی اقتصادی (تجارت و اقتصاد جهانی)",
            "recommendedMethod": "بنادر کانونی و بلوک‌های تجاری بین‌الملل",
            "difficulty": "medium",
            "importance": "very_high"
          }
        ]
      },
      {
        "chapterNumber": 4,
        "chapterTitle": "فصل چهارم: نواحی سیاسی",
        "topics": [
          {
            "id": "geo11_c4_1",
            "topicName": "درس نهم: معنا و مفهوم ناحیه سیاسی",
            "recommendedMethod": "مرزهای سرزمینی و قلمروهای حاکمیت",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "geo11_c4_2",
            "topicName": "درس دهم: کشور، یک ناحیه سیاسی",
            "recommendedMethod": "حکومت، جمعیت، سرزمین و پایتخت‌ها",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "geo11_c4_3",
            "topicName": "درس یازدهم: ژئوپلیتیک",
            "recommendedMethod": "نظریات هارتلند، ریملند و موقعیت راهبردی خاورمیانه",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      }
    ]
  },
  {
    "id": "geography_12",
    "bookTitle": "جغرافیای ۳ (کاربردی)",
    "subjectCategory": "جغرافیا",
    "grade": 12,
    "tracks": [
      "humanities"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: جغرافیای سکونتگاه‌ها",
        "topics": [
          {
            "id": "geo12_c1_1",
            "topicName": "درس اول: شهرها و روستاها",
            "recommendedMethod": "سلسله مراتب شهری، متروپل و الگوهای کالبدی روستا",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "geo12_c1_2",
            "topicName": "درس دوم: مدیریت شهر و روستا",
            "recommendedMethod": "طرح جامع شهری، طرح هادی روستایی و خدمات شهری",
            "difficulty": "medium",
            "importance": "very_high"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: جغرافیای حمل‌ونقل",
        "topics": [
          {
            "id": "geo12_c2_1",
            "topicName": "درس سوم: ویژگی‌ها و انواع شیوه‌های حمل‌ونقل",
            "recommendedMethod": "شبکه‌های جاده‌ای، ریلی، هوایی و خطوط لوله",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "geo12_c2_2",
            "topicName": "درس چهارم: مدیریت حمل‌ونقل",
            "recommendedMethod": "کریدورهای بین‌المللی شمال-جنوب و ترانزیت کالا",
            "difficulty": "medium",
            "importance": "very_high"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: مخاطرات طبیعی",
        "topics": [
          {
            "id": "geo12_c3_1",
            "topicName": "درس پنجم: ویژگی‌ها و انواع مخاطرات طبیعی",
            "recommendedMethod": "سیل، خشکسالی، گردوغبار و زمین‌لغزش",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "geo12_c3_2",
            "topicName": "درس ششم: مدیریت مخاطرات طبیعی",
            "recommendedMethod": "چرخه مدیریت بحران: پیش‌بینی، مقابله و بازسازی",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      }
    ]
  },
  {
    "id": "psychology_11",
    "bookTitle": "روان‌شناسی",
    "subjectCategory": "روان‌شناسی",
    "grade": 11,
    "tracks": [
      "humanities"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "دروس پیوسته روان‌شناسی یازدهم",
        "topics": [
          {
            "id": "psy11_1",
            "topicName": "درس اول: روان‌شناسی (تعریف و روش مورد مطالعه)",
            "recommendedMethod": "تعریف رفتار و شناخت و روش‌های آزمایشی و مشاهده",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "psy11_2",
            "topicName": "درس دوم: روان‌شناسی رشد",
            "recommendedMethod": "عوامل وراثتی و محیطی، رشد شناختی پیاژه و رشد اخلاقی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "psy11_3",
            "topicName": "درس سوم: احساس، توجه، ادراک",
            "recommendedMethod": "آستانه مطلق و اختلافی حسی، توجه انتخابی و گشتالت",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "psy11_4",
            "topicName": "درس چهارم: حافظه و علل فراموشی",
            "recommendedMethod": "حافظه حسی، کوتاه‌مدت، بلندمدت و منحنی فراموشی ابینگهاوس",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "psy11_5",
            "topicName": "درس پنجم: تفکر (۱): حل مسئله",
            "recommendedMethod": "حل مسئله با روش الگوریتمی، اکتشافی و بن‌بست فکری",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "psy11_6",
            "topicName": "درس ششم: تفکر (۲): تصمیم‌گیری",
            "recommendedMethod": "تله‌های تصمیم‌گیری، لنگراندازی و سوگیری شناختی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "psy11_7",
            "topicName": "درس هفتم: انگیزه و نگرش",
            "recommendedMethod": "سلسله مراتب نیازهای مازلو، انگیزه درونی و بیرونی",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "psy11_8",
            "topicName": "درس هشتم: روان‌شناسی سلامت",
            "recommendedMethod": "استرس، مقابله‌های مسأله‌مدار و هیجان‌مدار و سبک زندگی سالم",
            "difficulty": "medium",
            "importance": "high"
          }
        ]
      }
    ]
  },
  {
    "id": "economics_10",
    "bookTitle": "اقتصاد",
    "subjectCategory": "اقتصاد",
    "grade": 10,
    "tracks": [
      "humanities"
    ],
    "isSpecialized": true,
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "فصل اول: اصول انتخاب در کسب‌وکار",
        "topics": [
          {
            "id": "eco10_c1_1",
            "topicName": "درس اول: کسب‌وکار و کارآفرینی",
            "recommendedMethod": "انگیزه کارآفرین، نوآوری و بهره‌وری اقتصادی",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "eco10_c1_2",
            "topicName": "درس دوم: انتخاب نوع کسب‌وکار",
            "recommendedMethod": "شرکت‌های سهامی عام و خاص و تعاونی‌ها",
            "difficulty": "medium",
            "importance": "high"
          },
          {
            "id": "eco10_c1_3",
            "topicName": "درس سوم: اصول انتخاب درست",
            "recommendedMethod": "هزینه فرصت و عقلانیت اقتصادی در انتخاب",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "eco10_c1_4",
            "topicName": "درس چهارم: مرز امکانات تولید",
            "recommendedMethod": "منحنی مرز امکانات تولید (PPF) و نقاط درون و برون مرز",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 2,
        "chapterTitle": "فصل دوم: بازیگران اصلی در میدان اقتصاد",
        "topics": [
          {
            "id": "eco10_c2_1",
            "topicName": "درس پنجم: بازار چیست و چگونه عمل می‌کند؟",
            "recommendedMethod": "نمودار عرضه و تقاضا و نقطه تعادل بازار و مازاد و کمبود",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "eco10_c2_2",
            "topicName": "درس ششم: نقش دولت در اقتصاد چیست؟",
            "recommendedMethod": "کالاهای عمومی، مالیات‌ها و بازتوزیع درآمد",
            "difficulty": "medium",
            "importance": "very_high"
          },
          {
            "id": "eco10_c2_3",
            "topicName": "درس هفتم: تجارت بین‌الملل",
            "recommendedMethod": "مزیت نسبی و مطلق و نرخ ارز و تراز تجاری",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 3,
        "chapterTitle": "فصل سوم: اقتصاد، رشد و پیشرفت",
        "topics": [
          {
            "id": "eco10_c3_1",
            "topicName": "درس هشتم: رکود، بیکاری و فقر",
            "recommendedMethod": "محاسبه نرخ بیکاری و شاخص خط فقر مطلق و نسبی",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "eco10_c3_2",
            "topicName": "درس نهم: تورم و کاهش قدرت خرید",
            "recommendedMethod": "محاسبه تورم با شاخص CPI و نقدینگی در جامعه",
            "difficulty": "hard",
            "importance": "critical"
          },
          {
            "id": "eco10_c3_3",
            "topicName": "درس دهم: مقاوم‌سازی اقتصاد",
            "recommendedMethod": "اقتصاد دانش‌بنیان و کاهش وابستگی به نفت",
            "difficulty": "easy",
            "importance": "high"
          },
          {
            "id": "eco10_c3_4",
            "topicName": "درس یازدهم: رشد و پیشرفت اقتصادی",
            "recommendedMethod": "محاسبه تولید ناخالص ملی (GNP) و تولید ناخالص داخلی (GDP)",
            "difficulty": "hard",
            "importance": "critical"
          }
        ]
      },
      {
        "chapterNumber": 4,
        "chapterTitle": "فصل چهارم: اقتصاد در خانواده",
        "topics": [
          {
            "id": "eco10_c4_1",
            "topicName": "درس دوازدهم: بودجه‌بندی",
            "recommendedMethod": "تنظیم تراز دخل و خرج ماهانه خانواده",
            "difficulty": "easy",
            "importance": "medium"
          },
          {
            "id": "eco10_c4_2",
            "topicName": "درس سیزدهم: تصمیم‌گیری در مخارج",
            "recommendedMethod": "مدیریت هزینه‌های ضروری و غیرضروری",
            "difficulty": "easy",
            "importance": "medium"
          },
          {
            "id": "eco10_c4_3",
            "topicName": "درس چهاردهم: پس‌انداز و سرمایه‌گذاری",
            "recommendedMethod": "بازارهای مالی، سهام، اوراق مشارکت و بیمه",
            "difficulty": "medium",
            "importance": "high"
          }
        ]
      }
    ]
  }
];
