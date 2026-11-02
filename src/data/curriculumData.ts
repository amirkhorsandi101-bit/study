/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Comprehensive Iranian National High School Curriculum Database (Grades 10, 11, 12)
 * Categorized by Grade, Academic Track (تجربی، ریاضی، انسانی), Textbook, Chapter, and Topic.
 */

export type GradeLevel = 10 | 11 | 12;
export type AcademicTrack = 'experimental' | 'mathematics' | 'humanities';

export interface CurriculumTopic {
  id: string;
  grade: GradeLevel;
  track: AcademicTrack[];
  subject: string;
  bookTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  topicName: string;
  suggestedMethod: string;
  difficulty: 'easy' | 'medium' | 'hard';
  importance: 'medium' | 'high' | 'very_high' | 'critical';
}

export const GRADE_LABELS: Record<GradeLevel, string> = {
  10: 'پایه دهم',
  11: 'پایه یازدهم',
  12: 'پایه دوازدهم'
};

export const TRACK_LABELS: Record<AcademicTrack, { name: string; tag: string }> = {
  experimental: { name: 'علوم تجربی', tag: 'تجربی' },
  mathematics: { name: 'ریاضی و فیزیک', tag: 'ریاضی' },
  humanities: { name: 'ادبیات و علوم انسانی', tag: 'انسانی' }
};

export const OFFICIAL_CURRICULUM: CurriculumTopic[] = [
  // =========================================================================
  // پایه دهم - علوم تجربی
  // =========================================================================
  {
    id: 'bio10_c1_t1',
    grade: 10,
    track: ['experimental'],
    subject: 'زیست‌شناسی',
    bookTitle: 'زیست‌شناسی ۱ دهم',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: زیست‌شناسی، دیروز، امروز و فردا',
    topicName: 'نگرش علمی و کل‌نگری، سطوح ساختاری حیات و زیست‌کره',
    suggestedMethod: 'رسم نقشه مفهومی سطوح حیات از اتم تا بوم‌سازگان',
    difficulty: 'easy',
    importance: 'high'
  },
  {
    id: 'bio10_c2_t1',
    grade: 10,
    track: ['experimental'],
    subject: 'زیست‌شناسی',
    bookTitle: 'زیست‌شناسی ۱ دهم',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: گوارش و جذب مواد',
    topicName: 'ساختار و بافت‌شناسی لوله گوارش، لایه‌های بافتی و حرکات لوله گوارش',
    suggestedMethod: 'تست پوششی همراه با بازخوانی مقاطع میکروسکوپی لایه‌ها',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'bio10_c2_t2',
    grade: 10,
    track: ['experimental'],
    subject: 'زیست‌شناسی',
    bookTitle: 'زیست‌شناسی ۱ دهم',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: گوارش و جذب مواد',
    topicName: 'گوارش در معده، آنزیم‌های پپسینوژن، فاکتور داخلی و جذب در روده باریک',
    suggestedMethod: 'متد بلرتینگ (Blurting): بازنویسی کلیه آنزیم‌ها و نقش هورمون گاسترین و سکرتین',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'bio10_c3_t1',
    grade: 10,
    track: ['experimental'],
    subject: 'زیست‌شناسی',
    bookTitle: 'زیست‌شناسی ۱ دهم',
    chapterNumber: 3,
    chapterTitle: 'فصل ۳: تبادلات گازی',
    topicName: 'دستگاه تنفس انسان، ساختار حبابک‌ها، سازوکار دم و بازدم و حجم‌های تنفسی',
    suggestedMethod: 'حل ۳ مسئله چالشی حجم‌های تنفسی و هوای جاری/باقی‌مانده اسپیروگرام',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'bio10_c4_t1',
    grade: 10,
    track: ['experimental'],
    subject: 'زیست‌شناسی',
    bookTitle: 'زیست‌شناسی ۱ دهم',
    chapterNumber: 4,
    chapterTitle: 'فصل ۴: گردش مواد در بدن',
    topicName: 'آناتومی و فیزیولوژی قلب، دریچه‌ها، دوره قلبی و نمودار الکتروکاردیوگرام (ECG)',
    suggestedMethod: 'تطبیق صدای قلب با نمودار الکتروکاردیوگرام روی کاغذ سفید',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'bio10_c4_t2',
    grade: 10,
    track: ['experimental'],
    subject: 'زیست‌شناسی',
    bookTitle: 'زیست‌شناسی ۱ دهم',
    chapterNumber: 4,
    chapterTitle: 'فصل ۴: گردش مواد در بدن',
    topicName: 'رگ‌های خونی (سرخرگ، سیاهرگ، مویرگ‌ها)، لنف و ترکیبات خون و هموستاز',
    suggestedMethod: 'مقایسه فشار اسمزی و تراوشی مویرگ در ابتدای سرخرگی و انتهای سیاهرگی',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'bio10_c5_t1',
    grade: 10,
    track: ['experimental'],
    subject: 'زیست‌شناسی',
    bookTitle: 'زیست‌شناسی ۱ دهم',
    chapterNumber: 5,
    chapterTitle: 'فصل ۵: تنظیم اسمزی و دفع مواد زائد',
    topicName: 'ساختار کلیه و نفرون، مراحل تشکیل ادرار (تراوش، بازجذب، ترشح)',
    suggestedMethod: 'رسم درختی نفرون و مشخص کردن انتقال فعال و غیرفعال مواد در لوله‌های پیچیده',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'bio10_c6_t1',
    grade: 10,
    track: ['experimental'],
    subject: 'زیست‌شناسی',
    bookTitle: 'زیست‌شناسی ۱ دهم',
    chapterNumber: 6,
    chapterTitle: 'فصل ۶: از یاخته تا گیاه',
    topicName: 'سامانه‌های بافتی گیاهی (پوششی، زمینه‌ای، آوندی)، پارنشیم، کلانشیم و اسکلرانشیم',
    suggestedMethod: 'جدول مقایسه بافت‌های گیاهی از نظر زنده بودن و ضخامت دیواره اولیه و پسین',
    difficulty: 'medium',
    importance: 'high'
  },
  {
    id: 'bio10_c7_t1',
    grade: 10,
    track: ['experimental'],
    subject: 'زیست‌شناسی',
    bookTitle: 'زیست‌شناسی ۱ دهم',
    chapterNumber: 7,
    chapterTitle: 'فصل ۷: جذب و انتقال مواد در گیاهان',
    topicName: 'شیره خام، تعریق و تعرق، نظریه کشش-همبستگی و فشار ریشه‌ای',
    suggestedMethod: 'تست‌های ترکیبی گیاهی کنکور سراسری',
    difficulty: 'hard',
    importance: 'high'
  },

  // شیمی دهم (تجربی و ریاضی)
  {
    id: 'chem10_c1_t1',
    grade: 10,
    track: ['experimental', 'mathematics'],
    subject: 'شیمی',
    bookTitle: 'شیمی ۱ دهم',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: کیهان زادگاه الفبای هستی',
    topicName: 'ایزوتوپ‌ها، جرم اتمی میانگین، مدل بور و آرایش الکترونی و اعداد کوانتومی',
    suggestedMethod: 'نوشتن آرایش الکترونی یون‌های عناصر واسطه دوره ۴',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'chem10_c1_t2',
    grade: 10,
    track: ['experimental', 'mathematics'],
    subject: 'شیمی',
    bookTitle: 'شیمی ۱ دهم',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: کیهان زادگاه الفبای هستی',
    topicName: 'شمارش ذره‌ها، مفهوم مول، جرم مولی و عدد آووگادرو',
    suggestedMethod: 'حل ۵ مسئله پل استوکیومتری بر پایه تبدیل مول به جرم و تعداد ذرات',
    difficulty: 'medium',
    importance: 'critical'
  },
  {
    id: 'chem10_c2_t1',
    grade: 10,
    track: ['experimental', 'mathematics'],
    subject: 'شیمی',
    bookTitle: 'شیمی ۱ دهم',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: ردپای گازها در زندگی',
    topicName: 'قوانین گازها (بویل، شارل، آووگادرو)، شرایط STP و حجم مولی گازها',
    suggestedMethod: 'مسائل ترکیب قانون گازها با استوکیومتری واکنش',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'chem10_c2_t2',
    grade: 10,
    track: ['experimental', 'mathematics'],
    subject: 'شیمی',
    bookTitle: 'شیمی ۱ دهم',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: ردپای گازها در زندگی',
    topicName: 'ساختار لوویس، پیوندهای کووالانسی، جفت الکترون پیوندی و ناپیوندی و رزونانس',
    suggestedMethod: 'رسم ساختار لوویس یون‌های اکسیژندار نیتروژن، کربن و گوگرد بدون پاسخنامه',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'chem10_c3_t1',
    grade: 10,
    track: ['experimental', 'mathematics'],
    subject: 'شیمی',
    bookTitle: 'شیمی ۱ دهم',
    chapterNumber: 3,
    chapterTitle: 'فصل ۳: آب، آهنگ زندگی',
    topicName: 'محلول‌ها، غلظت درصدی جرمی، ppm و غلظت مولی (مولاریته)',
    suggestedMethod: 'حل مسائل مخلوط کردن محلول‌ها و فرمول‌های رقیق‌سازی M1V1 = M2V2',
    difficulty: 'medium',
    importance: 'critical'
  },
  {
    id: 'chem10_c3_t2',
    grade: 10,
    track: ['experimental', 'mathematics'],
    subject: 'شیمی',
    bookTitle: 'شیمی ۱ دهم',
    chapterNumber: 3,
    chapterTitle: 'فصل ۳: آب، آهنگ زندگی',
    topicName: 'نیروهای بین‌مولکولی (واندروالس و پیوند هیدروژنی) و انحلال‌پذیری مواد',
    suggestedMethod: 'مقایسه نقطه جوش ترکیبات هیدروژندار گروه‌های ۱۵، ۱۶ و ۱۷',
    difficulty: 'medium',
    importance: 'very_high'
  },

  // فیزیک دهم (تجربی و ریاضی)
  {
    id: 'phys10_c1_t1',
    grade: 10,
    track: ['experimental', 'mathematics'],
    subject: 'فیزیک',
    bookTitle: 'فیزیک ۱ دهم',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: فیزیک و اندازه‌گیری',
    topicName: 'یکاهای اندازه‌گیری SI، پیشوندها، دقت اندازه‌گیری و چگالی آلیاژها و حفره‌ها',
    suggestedMethod: 'حل مسائل زنجیره‌ای تبدیل یکا و چگالی مواد ترکیبی',
    difficulty: 'easy',
    importance: 'medium'
  },
  {
    id: 'phys10_c2_t1',
    grade: 10,
    track: ['experimental', 'mathematics'],
    subject: 'فیزیک',
    bookTitle: 'فیزیک ۱ دهم',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: ویژگی‌های فیزیکی مواد',
    topicName: 'فشار در شاره‌ها، فشارسنج جیوه‌ای (بارومتر) و لوله‌های U شکل چند مایعی',
    suggestedMethod: 'تست‌های ترکیبی لوله یو شکل و شناوری ارشمیدس',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'phys10_c3_t1',
    grade: 10,
    track: ['experimental', 'mathematics'],
    subject: 'فیزیک',
    bookTitle: 'فیزیک ۱ دهم',
    chapterNumber: 3,
    chapterTitle: 'فصل ۳: کار، انرژی و توان',
    topicName: 'قضیه کار و انرژی جنبشی، انرژی پتانسیل گرانشی و کشسانی، و پایستگی انرژی مکانیکی',
    suggestedMethod: 'حل مسئله سقوط و پرتاب با احتساب نیروی مقاومت هوا و اصطکاک',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'phys10_c4_t1',
    grade: 10,
    track: ['experimental', 'mathematics'],
    subject: 'فیزیک',
    bookTitle: 'فیزیک ۱ دهم',
    chapterNumber: 4,
    chapterTitle: 'فصل ۴: دما و گرما',
    topicName: 'تعادل گرمایی، گرماسنجی، تغییر حالت‌های ماده، گرمای نهان ذوب و تبخیر',
    suggestedMethod: 'محاسبه دمای نهایی تعادل در اختلاط یخ منفی با آب داغ',
    difficulty: 'hard',
    importance: 'very_high'
  },
  {
    id: 'phys10_c5_math_t1',
    grade: 10,
    track: ['mathematics'],
    subject: 'فیزیک',
    bookTitle: 'فیزیک ۱ دهم (ویژه ریاضی)',
    chapterNumber: 5,
    chapterTitle: 'فصل ۵: ترمودینامیک (ویژه ریاضی)',
    topicName: 'قانون اول ترمودینامیک، فرایندهای آرمانی (هم‌حجم، هم‌فشار، هم‌دما، بی‌دررو)',
    suggestedMethod: 'محاسبه کار و گرمای مبادله شده در چرخه و بازده ماشین گرمایی',
    difficulty: 'hard',
    importance: 'critical'
  },

  // ریاضی ۱ دهم (مشترک تجربی و ریاضی)
  {
    id: 'math10_c1_t1',
    grade: 10,
    track: ['experimental', 'mathematics'],
    subject: 'ریاضیات',
    bookTitle: 'ریاضی ۱ دهم',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: مجموعه، الگو و دنباله',
    topicName: 'دنباله‌های حسابی و هندسی، قدرنسبت و جملات عمومی و مجموع جملات',
    suggestedMethod: 'فرمول‌نویسی از حفظ و حل تست‌های الگوی خطی و غیرخطی',
    difficulty: 'medium',
    importance: 'high'
  },
  {
    id: 'math10_c2_t1',
    grade: 10,
    track: ['experimental', 'mathematics'],
    subject: 'ریاضیات',
    bookTitle: 'ریاضی ۱ دهم',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: مثلثات',
    topicName: 'نسبت‌های مثلثاتی، دایره مثلثاتی، شیب خط و تانژانت و اتحادهای پایه مثلثات',
    suggestedMethod: 'رسم دایره مثلثاتی و تعیین علامت نسبت‌ها در ۴ ربع دایره',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'math10_c3_t1',
    grade: 10,
    track: ['experimental', 'mathematics'],
    subject: 'ریاضیات',
    bookTitle: 'ریاضی ۱ دهم',
    chapterNumber: 3,
    chapterTitle: 'فصل ۳: توان‌های گویا و عبارت‌های جبری',
    topicName: 'اتحادهای جبری (مربع دو جمله‌ای، مکعب، چاق و لاغر)، گویا کردن مخرج کسرها',
    suggestedMethod: 'حل سریع عبارات رادیکالی فرجه‌دار بدون ماشین حساب',
    difficulty: 'medium',
    importance: 'high'
  },
  {
    id: 'math10_c4_t1',
    grade: 10,
    track: ['experimental', 'mathematics'],
    subject: 'ریاضیات',
    bookTitle: 'ریاضی ۱ دهم',
    chapterNumber: 4,
    chapterTitle: 'فصل ۴: معادله‌ها و نامعادله‌ها',
    topicName: 'معادله درجه دوم، روش دلتا، روابط بین ریشه‌ها (S و P) و تعیین علامت',
    suggestedMethod: 'تشکیل معادله جدید با ریشه‌های مشخص بر اساس جمع و ضرب ریشه‌ها',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'math10_c5_t1',
    grade: 10,
    track: ['experimental', 'mathematics'],
    subject: 'ریاضیات',
    bookTitle: 'ریاضی ۱ دهم',
    chapterNumber: 5,
    chapterTitle: 'فصل ۵: تابع',
    topicName: 'مفهوم تابع، ضابطه و نمودار، دامنه و برد توابع چندجمله‌ای، خطی و گویا',
    suggestedMethod: 'تست‌های مفهومی زوج مرتب و آزمون خط عمودی',
    difficulty: 'medium',
    importance: 'critical'
  },

  // هندسه ۱ دهم (ویژه ریاضی)
  {
    id: 'geom10_c1_t1',
    grade: 10,
    track: ['mathematics'],
    subject: 'هندسه',
    bookTitle: 'هندسه ۱ دهم',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: ترسیم‌های هندسی و استدلال',
    topicName: 'رسم‌های اساسی (عمودمنصف، نیمساز، خط عمود) و استدلال استنتاجی',
    suggestedMethod: 'رسم دقیق با خط‌کش و پرگار و اثبات هندسی',
    difficulty: 'medium',
    importance: 'medium'
  },
  {
    id: 'geom10_c2_t1',
    grade: 10,
    track: ['mathematics'],
    subject: 'هندسه',
    bookTitle: 'هندسه ۱ دهم',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: قضیه تالس، تشابه و کاربردهای آن',
    topicName: 'قضیه تالس، تعمیم تالس، تشابه مثلث‌ها و نسبت مساحت‌ها',
    suggestedMethod: 'حل تست‌های ترکیبی تالس و روابط طولی در مثلث قائم‌الزاویه',
    difficulty: 'hard',
    importance: 'critical'
  },

  // =========================================================================
  // پایه دهم - ادبیات و علوم انسانی
  // =========================================================================
  {
    id: 'fonun10_c1_t1',
    grade: 10,
    track: ['humanities'],
    subject: 'علوم و فنون ادبی',
    bookTitle: 'علوم و فنون ادبی ۱ دهم',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: کلیات ادبیات و سبک‌شناسی دوره اول',
    topicName: 'تاریخ ادبیات و سبک‌شناسی عصر باستان و سبک خراسانی (ویژگی‌های زبانی و ادبی)',
    suggestedMethod: 'جدول تطبیقی ویژگی‌های سبکی قرون اولیه هجری',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'fonun10_c2_t1',
    grade: 10,
    track: ['humanities'],
    subject: 'علوم و فنون ادبی',
    bookTitle: 'علوم و فنون ادبی ۱ دهم',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: موسیقی شعر و عروض',
    topicName: 'واحدهای هجا (کوتاه، بلند، کشیده)، تقطیع هجایی و پایه‌های آوایی',
    suggestedMethod: 'تقطیع ۵ بیت شعر کهن با روش شنیداری و نوشتن نشانه‌های هجایی',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'fonun10_c3_t1',
    grade: 10,
    track: ['humanities'],
    subject: 'علوم و فنون ادبی',
    bookTitle: 'علوم و فنون ادبی ۱ دهم',
    chapterNumber: 3,
    chapterTitle: 'فصل ۳: زیبایی‌شناسی و بدیع',
    topicName: 'سجع و انواع آن، ترصیع، موازنه و انواع جناس (تام، ناقص اختلافی و حرکتی)',
    suggestedMethod: 'استخراج صنایع لفظی از متون گلستان سعدی و تاریخ بیهقی',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'manteq10_c1_t1',
    grade: 10,
    track: ['humanities'],
    subject: 'منطق',
    bookTitle: 'منطق دهم انسانی',
    chapterNumber: 1,
    chapterTitle: 'درس ۱ تا ۳: منطق ترازوی اندیشه و تعریف',
    topicName: 'تعریف در منطق (حد تام، حد ناقص، رسم تام و رسم ناقص)، شروط تعریف درست',
    suggestedMethod: 'بررسی مصادیق تعاریف دوری، عام‌تر و اخص',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'manteq10_c2_t1',
    grade: 10,
    track: ['humanities'],
    subject: 'منطق',
    bookTitle: 'منطق دهم انسانی',
    chapterNumber: 2,
    chapterTitle: 'درس ۴ تا ۸: احکام قضایا و استدلال مباشر',
    topicName: 'قضایای حملی، سور و محمول، مربع تقابل (تناقض، تضاد، تداخل، تداخل تحت تضاد) و عکس مستوی',
    suggestedMethod: 'رسم مربع تقابل و تعیین ارزش صدق و کذب گزاره‌ها',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'manteq10_c3_t1',
    grade: 10,
    track: ['humanities'],
    subject: 'منطق',
    bookTitle: 'منطق دهم انسانی',
    chapterNumber: 3,
    chapterTitle: 'درس ۹ و ۱۰: قیاس اقترانی و مغالطات',
    topicName: 'اشکال چهارگانه قیاس اقترانی حملی، حد وسط و شرایط انتاج و مغالطات روزمره',
    suggestedMethod: 'حل تمرین تعیین شکل قیاس و بررسی شروط ضرب‌های منتج',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'eq10_c1_t1',
    grade: 10,
    track: ['humanities'],
    subject: 'اقتصاد',
    bookTitle: 'اقتصاد دهم انسانی',
    chapterNumber: 1,
    chapterTitle: 'بخش ۱: اصول و مفاهیم پایه‌ای اقتصاد',
    topicName: 'مسئله انتخاب، هزینه فرصت، عوامل تولید و مرز امکانات تولید (PPF)',
    suggestedMethod: 'محاسبه ریاضی جدول هزینه فرصت و نقاط روی و زیر مرز تولید',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'eq10_c2_t1',
    grade: 10,
    track: ['humanities'],
    subject: 'اقتصاد',
    bookTitle: 'اقتصاد دهم انسانی',
    chapterNumber: 2,
    chapterTitle: 'بخش ۲: بازار، عرضه و تقاضا',
    topicName: 'منحنی‌های عرضه و تقاضا، قیمت و مقدار تعادلی بازار، مازاد و کمبود کالا',
    suggestedMethod: 'حل مسائل قیمت تعادلی با معادلات جبری Qd = Qs',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'soc10_c1_t1',
    grade: 10,
    track: ['humanities'],
    subject: 'جامعه‌شناسی',
    bookTitle: 'جامعه‌شناسی ۱ دهم',
    chapterNumber: 1,
    chapterTitle: 'درس ۱ تا ۵: جهان اجتماعی و خرده‌نظام‌ها',
    topicName: 'کنش اجتماعی، پدیده‌های اجتماعی، هنجارها، ارزش‌ها و کنترل اجتماعی',
    suggestedMethod: 'نمودار درختی ارتباط کنش فردی و ساختارهای نهادی جامعه',
    difficulty: 'easy',
    importance: 'high'
  },

  // =========================================================================
  // پایه یازدهم - علوم تجربی
  // =========================================================================
  {
    id: 'bio11_c1_t1',
    grade: 11,
    track: ['experimental'],
    subject: 'زیست‌شناسی',
    bookTitle: 'زیست‌شناسی ۲ یازدهم',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: تنظیم عصبی',
    topicName: 'پتانسیل آرامش و عمل یاخته‌های عصبی، پمپ سدیم-پتاسیم و کانال‌های دریچه‌دار',
    suggestedMethod: 'تحلیل دقیق میلی‌ولت پتانسیل غشا در هر مرحله صعود و فرود پتانسیل عمل',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'bio11_c1_t2',
    grade: 11,
    track: ['experimental'],
    subject: 'زیست‌شناسی',
    bookTitle: 'زیست‌شناسی ۲ یازدهم',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: تنظیم عصبی',
    topicName: 'ساختار مغز، نخاع، تالاموس، هیپوتالاموس، دستگاه عصبی خودمختار (سمپاتیک و پاراسمپاتیک)',
    suggestedMethod: 'تست‌های ترکیبی مقاطع مغز و اثرات سیستم سمپاتیک بر مردمک و ضربان قلب',
    difficulty: 'medium',
    importance: 'critical'
  },
  {
    id: 'bio11_c2_t1',
    grade: 11,
    track: ['experimental'],
    subject: 'زیست‌شناسی',
    bookTitle: 'زیست‌شناسی ۲ یازدهم',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: حواس',
    topicName: 'ساختار چشم (صلبیه، قرنیه، مشیمیه، عدسی، شبکیه)، گیرنده‌های استوانه‌ای و مخروطی',
    suggestedMethod: 'رسم مسیر پرتوهای نوری و تحلیل عیوب انکساری (نزدیک‌بینی و دوربینی)',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'bio11_c2_t2',
    grade: 11,
    track: ['experimental'],
    subject: 'زیست‌شناسی',
    bookTitle: 'زیست‌شناسی ۲ یازدهم',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: حواس',
    topicName: 'گوش درونی، حلزون گوش، اندام کورتی، گیرنده‌های تعادلی مجاری نیم‌دایره',
    suggestedMethod: 'متد بلرتینگ: توضیح مرحله‌به‌مرحله تبدیل لرزش استخوانچه‌ها به پیام عصبی شنوایی',
    difficulty: 'medium',
    importance: 'high'
  },
  {
    id: 'bio11_c3_t1',
    grade: 11,
    track: ['experimental'],
    subject: 'زیست‌شناسی',
    bookTitle: 'زیست‌شناسی ۲ یازدهم',
    chapterNumber: 3,
    chapterTitle: 'فصل ۳: دستگاه حرکتی',
    topicName: 'ساختار سارکومر، میوزین، اکتین، پل‌های اتصالی و انقباض ماهیچه اسکلتی',
    suggestedMethod: 'تست‌های خط کشی تغییرات طول نوار I، صفحه A و ناحیه H در حین انقباض',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'bio11_c4_t1',
    grade: 11,
    track: ['experimental'],
    subject: 'زیست‌شناسی',
    bookTitle: 'زیست‌شناسی ۲ یازدهم',
    chapterNumber: 4,
    chapterTitle: 'فصل ۴: تنظیم شیمیایی',
    topicName: 'غده هیپوفیز پیشین و پسین، غده تیروئید، پاراتیروئید و غدد فوق کلیه (بخش قشری و مرکزی)',
    suggestedMethod: 'جدول ماتریسی هورمون‌ها، اندام هدف، اثر بر گلوکز خون و کلسیم خون',
    difficulty: 'medium',
    importance: 'critical'
  },
  {
    id: 'bio11_c5_t1',
    grade: 11,
    track: ['experimental'],
    subject: 'زیست‌شناسی',
    bookTitle: 'زیست‌شناسی ۲ یازدهم',
    chapterNumber: 5,
    chapterTitle: 'فصل ۵: ایمنی',
    topicName: 'پاسخ التهابی، پروتئین‌های مکمل، لنفوسیت B و T، پادتن‌ها و یاخته‌های پلاسماوسیت',
    suggestedMethod: 'مقایسه ایمنی فعال و غیرفعال، ساختار آنتی‌بادی و ایمنی هومورال در برابر سلولی',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'bio11_c6_t1',
    grade: 11,
    track: ['experimental'],
    subject: 'زیست‌شناسی',
    bookTitle: 'زیست‌شناسی ۲ یازدهم',
    chapterNumber: 6,
    chapterTitle: 'فصل ۶: تقسیم یاخته',
    topicName: 'چرخه سلولی (اینترفاز و میتوز)، مراحل میتوز و میوز ۱ و ۲ و پدیده تتراد و کراسینگ‌اور',
    suggestedMethod: 'شمارش کروموزوم‌ها و کروماتیدها در هر مرحله انافاز ۱ و ۲ میوز',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'bio11_c7_t1',
    grade: 11,
    track: ['experimental'],
    subject: 'زیست‌شناسی',
    bookTitle: 'زیست‌شناسی ۲ یازدهم',
    chapterNumber: 7,
    chapterTitle: 'فصل ۷: تولید مثل',
    topicName: 'اسپرم‌زایی، تخمک‌زایی، چرخه تخمدان و چرخه رحم (هورمون‌های LH، FSH، استروژن، پروژسترون)',
    suggestedMethod: 'انطباق نمودارهای هورمونی روز ۱۴ قاعدگی با فولیکول و جسم زرد',
    difficulty: 'hard',
    importance: 'critical'
  },

  // شیمی یازدهم
  {
    id: 'chem11_c1_t1',
    grade: 11,
    track: ['experimental', 'mathematics'],
    subject: 'شیمی',
    bookTitle: 'شیمی ۲ یازدهم',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: قدر هدایای زمینی را بدانیم',
    topicName: 'واکنش‌پذیری عناصر، سری الکتروشیمیایی فلزات، استخراج آهن و هیدروکربن‌های سیرشده آلکان',
    suggestedMethod: 'نام‌گذاری آیوپاک آلکان‌ها با شاخه‌های آلکیل مختلف',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'chem11_c1_t2',
    grade: 11,
    track: ['experimental', 'mathematics'],
    subject: 'شیمی',
    bookTitle: 'شیمی ۲ یازدهم',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: قدر هدایای زمینی را بدانیم',
    topicName: 'آلکن‌ها، آلکین‌ها، واکنش‌های افزایشی و هیدروکربن‌های آروماتیک (بنزن)',
    suggestedMethod: 'تست‌های ترکیبی ایزومرهای ساختاری هیدروکربن‌ها',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'chem11_c2_t1',
    grade: 11,
    track: ['experimental', 'mathematics'],
    subject: 'شیمی',
    bookTitle: 'شیمی ۲ یازدهم',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: در پی غذای سالم',
    topicName: 'آنتالپی پیوند، آنتالپی سوختن و قانون هس برای محاسبه گرمای واکنش',
    suggestedMethod: 'حل ۳ مسئله چند مرحله‌ای قانون هس با ترکیب واکنش‌ها',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'chem11_c2_t2',
    grade: 11,
    track: ['experimental', 'mathematics'],
    subject: 'شیمی',
    bookTitle: 'شیمی ۲ یازدهم',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: در پی غذای سالم',
    topicName: 'سینتیک شیمیایی، سرعت واکنش، نمودارهای پیشرفت واکنش و کاتالیزورها',
    suggestedMethod: 'محاسبه سرعت متوسط تولید و مصرف فرآورده و واکنش‌دهنده‌ها با ضرایب استوکیومتری',
    difficulty: 'medium',
    importance: 'critical'
  },
  {
    id: 'chem11_c3_t1',
    grade: 11,
    track: ['experimental', 'mathematics'],
    subject: 'شیمی',
    bookTitle: 'شیمی ۲ یازدهم',
    chapterNumber: 3,
    chapterTitle: 'فصل ۳: پوشاک، نیازی پایان‌ناپذیر',
    topicName: 'الکل‌ها، اسیدهای آلی کربوکسیلیک، تشکیل استرها و پلیمرهای افزایشی و تراکمی',
    suggestedMethod: 'واکنش سنتز پلی‌استر و پلی‌آمید و شناسایی مونومرهای تشکیل‌دهنده',
    difficulty: 'hard',
    importance: 'very_high'
  },

  // فیزیک یازدهم
  {
    id: 'phys11_c1_t1',
    grade: 11,
    track: ['experimental', 'mathematics'],
    subject: 'فیزیک',
    bookTitle: 'فیزیک ۲ یازدهم',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: الکتریسیته ساکن',
    topicName: 'قانون کولن، میدان الکتریکی ذرات باردار، توزیع بار در رسانا و پتانسیل الکتریکی',
    suggestedMethod: 'حل مسئله ترکیب میدان‌های الکتریکی برداری در رأس‌های مربع و مثلث',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'phys11_c1_t2',
    grade: 11,
    track: ['experimental', 'mathematics'],
    subject: 'فیزیک',
    bookTitle: 'فیزیک ۲ یازدهم',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: الکتریسیته ساکن',
    topicName: 'خازن، ظرفیت خازن، دی‌الکتریک و انرژی ذخیره شده در خازن',
    suggestedMethod: 'محاسبه تغییر انرژی خازن هنگام اتصال به باتری در مقایسه با خازن باردار جدا شده',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'phys11_c2_t1',
    grade: 11,
    track: ['experimental', 'mathematics'],
    subject: 'فیزیک',
    bookTitle: 'فیزیک ۲ یازدهم',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: جریان الکتریکی و مدارهای جریان مستقیم',
    topicName: 'قانون اهم، مقاومت ویژه و بستگی مقاومت به دما، به هم بستن مقاومت‌ها (سری و موازی)',
    suggestedMethod: 'محاسبه مقاومت معادل مدارهای پل و مدارهای غیربدیهی',
    difficulty: 'medium',
    importance: 'critical'
  },
  {
    id: 'phys11_c2_t2',
    grade: 11,
    track: ['experimental', 'mathematics'],
    subject: 'فیزیک',
    bookTitle: 'فیزیک ۲ یازدهم',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: جریان الکتریکی و مدارهای جریان مستقیم',
    topicName: 'نیروی محرکه الکتریکی، مقاومت درونی، افت پتانسیل و توان مفید خروجی باتری',
    suggestedMethod: 'تحلیل نمودار ولتاژ دو سر باتری بر حسب جریان و شرط حداکثر توان خروجی',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'phys11_c3_t1',
    grade: 11,
    track: ['experimental', 'mathematics'],
    subject: 'فیزیک',
    bookTitle: 'فیزیک ۲ یازدهم',
    chapterNumber: 3,
    chapterTitle: 'فصل ۳: مغناطیس و القای الکترومغناطیسی',
    topicName: 'نیروی مغناطیسی وارد بر بار متحرک و سیم حامل جریان در میدان، میدان حاصل از سیملوله',
    suggestedMethod: 'قاعده دست راست در تعیین جهت نیروی لورنتس و میدان مغناطیسی سیملوله',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'phys11_c3_t2',
    grade: 11,
    track: ['experimental', 'mathematics'],
    subject: 'فیزیک',
    bookTitle: 'فیزیک ۲ یازدهم',
    chapterNumber: 3,
    chapterTitle: 'فصل ۳: مغناطیس و القای الکترومغناطیسی',
    topicName: 'قانون القای فارادی، قانون لنز، شار مغناطیسی و ضریب خودالقایی',
    suggestedMethod: 'حل مسئله تعیین جهت جریان القایی در حلقه هنگام نزدیک شدن قطب N آهنربا',
    difficulty: 'hard',
    importance: 'critical'
  },

  // ریاضی ۲ یازدهم تجربی
  {
    id: 'math11_exp_c1_t1',
    grade: 11,
    track: ['experimental'],
    subject: 'ریاضیات',
    bookTitle: 'ریاضی ۲ یازدهم تجربی',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: هندسه تحلیلی و جبر',
    topicName: 'معادله خط، فاصله نقطه از خط، فاصله دو نقطه و مختصات نقطه وسط پاره‌خط',
    suggestedMethod: 'حل مسائل هندسه تحلیلی مثلث‌ها و مساحت با مختصات رئوس',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'math11_exp_c2_t1',
    grade: 11,
    track: ['experimental'],
    subject: 'ریاضیات',
    bookTitle: 'ریاضی ۲ یازدهم تجربی',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: هندسه',
    topicName: 'زاویه‌ها در دایره، زاویه مرکزی و محاطی، قضیه خط مماس و روابط دایره',
    suggestedMethod: 'رسم هندسی و حل مسئله زاویه‌های ظلّی و بیرونی دایره',
    difficulty: 'medium',
    importance: 'high'
  },
  {
    id: 'math11_exp_c3_t1',
    grade: 11,
    track: ['experimental'],
    subject: 'ریاضیات',
    bookTitle: 'ریاضی ۲ یازدهم تجربی',
    chapterNumber: 3,
    chapterTitle: 'فصل ۳: تابع',
    topicName: 'توابع گویا، توابع رادیکالی، توابع جزء صحیح [x] و توابع یک‌به‌یک و معکوس‌پذیر',
    suggestedMethod: 'رسم نمودار تابع وارون با تقارن نسبت به خط y = x',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'math11_exp_c4_t1',
    grade: 11,
    track: ['experimental'],
    subject: 'ریاضیات',
    bookTitle: 'ریاضی ۲ یازدهم تجربی',
    chapterNumber: 4,
    chapterTitle: 'فصل ۴: مثلثات',
    topicName: 'واحدهای زاویه (رادیان و درجه)، روابط مثلثاتی زاویه‌های قرینه، مکمل و متمم',
    suggestedMethod: 'تبدیل کمان‌ها به ربع اول دایره مثلثاتی و ساده‌سازی عبارات کسری',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'math11_exp_c5_t1',
    grade: 11,
    track: ['experimental'],
    subject: 'ریاضیات',
    bookTitle: 'ریاضی ۲ یازدهم تجربی',
    chapterNumber: 5,
    chapterTitle: 'فصل ۵: توابع نمایی و لگاریتمی',
    topicName: 'نمودار تابع نمایی، تعریف لگاریتم و قوانین لگاریتم‌ها و حل معادلات لگاریتمی',
    suggestedMethod: 'حل معادلات توانی با پایه نامساوی با اعمال لگاریتم طرفین',
    difficulty: 'medium',
    importance: 'critical'
  },
  {
    id: 'math11_exp_c6_t1',
    grade: 11,
    track: ['experimental'],
    subject: 'ریاضیات',
    bookTitle: 'ریاضی ۲ یازدهم تجربی',
    chapterNumber: 6,
    chapterTitle: 'فصل ۶: حد و پیوستگی',
    topicName: 'مفهوم شهودی حد، حد چپ و راست، رفع ابهام صفر بر صفر و پیوستگی در نقطه و بازه',
    suggestedMethod: 'رفع ابهام کسرهای صفر بر صفر با فاکتورگیری، هورنر و اتحاد مزدوج',
    difficulty: 'hard',
    importance: 'critical'
  },

  // حسابان ۱ یازدهم ریاضی
  {
    id: 'calc11_c1_t1',
    grade: 11,
    track: ['mathematics'],
    subject: 'حسابان',
    bookTitle: 'حسابان ۱ یازدهم ریاضی',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: جبر و معادله',
    topicName: 'مجموع جملات دنباله‌های حسابی و هندسی، معادلات گویا و گنگ و معادلات قدرمطلقی',
    suggestedMethod: 'حل معادلات شامل رادیکال و بررسی ریشه‌های غیرقابل قبول',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'calc11_c2_t1',
    grade: 11,
    track: ['mathematics'],
    subject: 'حسابان',
    bookTitle: 'حسابان ۱ یازدهم ریاضی',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: تابع',
    topicName: 'توابع یک‌به‌یک و وارون، ترکیب توابع f(g(x))، دامنه ترکیب و توابع پله‌ای',
    suggestedMethod: 'تعیین دامنه f o g با فرمول D fog = {x in Dg | g(x) in Df}',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'calc11_c3_t1',
    grade: 11,
    track: ['mathematics'],
    subject: 'حسابان',
    bookTitle: 'حسابان ۱ یازدهم ریاضی',
    chapterNumber: 3,
    chapterTitle: 'فصل ۳: مثلثات',
    topicName: 'کمان‌های مضرب زاویه (سینوس و کسینوس 2a)، فرمول‌های ضرب به جمع و برعکس',
    suggestedMethod: 'اثبات اتحادهای پیشرفته مثلثاتی با متد برگه سفید',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'calc11_c4_t1',
    grade: 11,
    track: ['mathematics'],
    subject: 'حسابان',
    bookTitle: 'حسابان ۱ یازدهم ریاضی',
    chapterNumber: 4,
    chapterTitle: 'فصل ۴: حد و پیوستگی',
    topicName: 'حساب حدود توابع مثلثاتی، حد در بی‌نهایت، حدود بی‌نهایت و قضیه فشردگی (ساندویچ)',
    suggestedMethod: 'حل تست‌های کنکور حد مثلثاتی lim sin(x)/x و پیوستگی توابع تکه‌ای',
    difficulty: 'hard',
    importance: 'critical'
  },

  // آمار و احتمال یازدهم ریاضی
  {
    id: 'stat11_c1_t1',
    grade: 11,
    track: ['mathematics'],
    subject: 'آمار و احتمال',
    bookTitle: 'آمار و احتمال یازدهم ریاضی',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: مبانی ریاضیات و منطق گزاره‌ها',
    topicName: 'گزاره‌ها، ترکیب عطفی و فصلی، شرطی و دو شرطی، سورها و استقراء ریاضی',
    suggestedMethod: 'جدول ارزش درستی سور وجودی و عمومی و استدلال بازگشتی',
    difficulty: 'medium',
    importance: 'high'
  },
  {
    id: 'stat11_c2_t1',
    grade: 11,
    track: ['mathematics'],
    subject: 'آمار و احتمال',
    bookTitle: 'آمار و احتمال یازدهم ریاضی',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: احتمال',
    topicName: 'فضای نمونه‌ای، پیشامدهای مستقل و وابسته، احتمال شرطی و قانون احتمال کل و بیز',
    suggestedMethod: 'حل مسئله با نمودار درختی و فرمول بیز P(A|B)',
    difficulty: 'hard',
    importance: 'critical'
  },

  // =========================================================================
  // پایه یازدهم - ادبیات و علوم انسانی
  // =========================================================================
  {
    id: 'fonun11_c1_t1',
    grade: 11,
    track: ['humanities'],
    subject: 'علوم و فنون ادبی',
    bookTitle: 'علوم و فنون ادبی ۲ یازدهم',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: تاریخ ادبیات و سبک‌شناسی دوره دوم',
    topicName: 'سبک عراقی در قرون هفتم و هشتم هجری (ویژگی‌های فکری، زبانی و ادبی شعر سعدی و حافظ)',
    suggestedMethod: 'مقایسه مؤلفه‌های عرفانی سبک عراقی با لحن حماسی سبک خراسانی',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'fonun11_c2_t1',
    grade: 11,
    track: ['humanities'],
    subject: 'علوم و فنون ادبی',
    bookTitle: 'علوم و فنون ادبی ۲ یازدهم',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: موسیقی شعر (عروض پیشرفته)',
    topicName: 'اوزان همسان دولختی و همسان چهالختی (مفاعیلن، فاعلاتن، مستفعلن، فعولن)',
    suggestedMethod: 'تعیین وزن شعر با ریتم و ضرب‌آهنگ مصراع‌ها و تشخیص اختیارات شاعری',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'fonun11_c3_t1',
    grade: 11,
    track: ['humanities'],
    subject: 'علوم و فنون ادبی',
    bookTitle: 'علوم و فنون ادبی ۲ یازدهم',
    chapterNumber: 3,
    chapterTitle: 'فصل ۳: زیبایی‌شناسی و بدیع معنوی',
    topicName: 'تشبیه و ارکان آن (مشبه، مشبه‌به، ادات، وجه‌شبه)، استعاره مصرحه و استعاره مکنیه (تشخیص)',
    suggestedMethod: 'تبدیل تشبیه به استعاره و تحلیل آرایه‌های ترکیبی در اشعار صائب و بیدل',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'falsafah11_c1_t1',
    grade: 11,
    track: ['humanities'],
    subject: 'فلسفه',
    bookTitle: 'فلسفه ۱ یازدهم انسانی',
    chapterNumber: 1,
    chapterTitle: 'درس ۱ تا ۴: چیستی فلسفه و معرفت‌شناسی',
    topicName: 'ریشه فلسفه، حیرت عقلی، مغالطه سوفسطائیان، روش سقراطی و مسئله شکاکیت',
    suggestedMethod: 'متد بلرتینگ: خلاصه کردن روش مامایی سقراط و رد نسبی‌گرایی پروتاگوراس',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'falsafah11_c2_t1',
    grade: 11,
    track: ['humanities'],
    subject: 'فلسفه',
    bookTitle: 'فلسفه ۱ یازدهم انسانی',
    chapterNumber: 2,
    chapterTitle: 'درس ۵ تا ۸: خاستگاه شناخت و ابزارهای معرفت',
    topicName: 'حس، عقل، قلب و وحی، مناقشه عقل‌گرایی دکارت در برابر تجربه‌گرایی لاک و هیوم',
    suggestedMethod: 'جدول ماتریسی مقایسه مکاتب معرفت‌شناختی تجربی و عقلانی',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'ravan11_c1_t1',
    grade: 11,
    track: ['humanities'],
    subject: 'روان‌شناسی',
    bookTitle: 'روان‌شناسی یازدهم انسانی',
    chapterNumber: 1,
    chapterTitle: 'درس ۱ تا ۳: روان‌شناسی، توجه و احساس',
    topicName: 'روان‌شناسی به عنوان علم تجربی، خطاهای ادراکی، گشتالت و فرآیندهای حسی',
    suggestedMethod: 'تحلیل اصول سازمان‌بندی ادراکی گشتالت (مجاورت، مشابهت، بستار، تداوم)',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'ravan11_c2_t1',
    grade: 11,
    track: ['humanities'],
    subject: 'روان‌شناسی',
    bookTitle: 'روان‌شناسی یازدهم انسانی',
    chapterNumber: 2,
    chapterTitle: 'درس ۴: حافظه و علل فراموشی',
    topicName: 'حافظه حسی، کوتاه‌مدت و بلندمدت، نظریه رمزبازی و بازیابی و منحنی فراموشی ابینگهاوس',
    suggestedMethod: 'بررسی راهبردهای بسط معنایی و تصویرسازی ذهنی برای انتقال به حافظه دائم',
    difficulty: 'medium',
    importance: 'critical'
  },
  {
    id: 'ravan11_c3_t1',
    grade: 11,
    track: ['humanities'],
    subject: 'روان‌شناسی',
    bookTitle: 'روان‌شناسی یازدهم انسانی',
    chapterNumber: 3,
    chapterTitle: 'درس ۵ و ۶: حل مسئله، تفکر و تصمیم‌گیری',
    topicName: 'مراحل حل مسئله، روش‌های اکتشافی (خرد کردن مسئله، تحلیل وسیله-هدف) و خطاهای شناختی',
    suggestedMethod: 'کاربرد تکنیک‌های حل مسئله در مدیریت اهمال‌کاری و مطالعه',
    difficulty: 'medium',
    importance: 'high'
  },

  // =========================================================================
  // پایه دوازدهم - علوم تجربی
  // =========================================================================
  {
    id: 'bio12_c1_t1',
    grade: 12,
    track: ['experimental'],
    subject: 'زیست‌شناسی',
    bookTitle: 'زیست‌شناسی ۳ دوازدهم',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: مولکول‌های اطلاعاتی',
    topicName: 'آزمایش‌های ایوری و گریفیت، ساختار نوکلئوتیدها، دنا (DNA) و رنا (RNA)، همانندسازی دنا',
    suggestedMethod: 'رسم چنگال همانندسازی و مشخص کردن آنزیم‌های هلیکاز، دنابسپاراز و دناپلی‌مراز',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'bio12_c2_t1',
    grade: 12,
    track: ['experimental'],
    subject: 'زیست‌شناسی',
    bookTitle: 'زیست‌شناسی ۳ دوازدهم',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: جریان اطلاعات در یاخته',
    topicName: 'رونویسی، مراحل رونویسی (آغاز، طویل شدن، پایان)، کدون‌ها، ساختار رنای ناقل (tRNA)',
    suggestedMethod: 'ترجمه کدون‌های جدول ژنتیکی و تعیین توالی اسیدهای آمینه پلی‌پپتید',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'bio12_c2_t2',
    grade: 12,
    track: ['experimental'],
    subject: 'زیست‌شناسی',
    bookTitle: 'زیست‌شناسی ۳ دوازدهم',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: جریان اطلاعات در یاخته',
    topicName: 'تنظیم بیان ژن در پروکاریوت‌ها (اپاردهای لک) و یوکاریوت‌ها (عوامل رونویسی و توالی افزاینده)',
    suggestedMethod: 'تست‌های ترکیبی اپران لکتوز در غیاب و حضور گلوکز و آلوالکتوز',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'bio12_c3_t1',
    grade: 12,
    track: ['experimental'],
    subject: 'زیست‌شناسی',
    bookTitle: 'زیست‌شناسی ۳ دوازدهم',
    chapterNumber: 3,
    chapterTitle: 'فصل ۳: انتقال اطلاعات در نسل‌ها',
    topicName: 'ژنتیک مندلی، صفات اتوزومی و وابسته به جنس (مغلوب و غالب)، هم‌توانی و صفات چندجنی',
    suggestedMethod: 'رسم مربع پانت و شجره‌نامه (پدیگری) بیماری‌های ارثی تالاسمی، هموفیلی و کوررنگی',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'bio12_c4_t1',
    grade: 12,
    track: ['experimental'],
    subject: 'زیست‌شناسی',
    bookTitle: 'زیست‌شناسی ۳ دوازدهم',
    chapterNumber: 4,
    chapterTitle: 'فصل ۴: تغییر در اطلاعات وراثتی',
    topicName: 'جهش‌های ژنی (جانشینی، حذفی، اضافه) و تغییر در تعداد و ساختار کروموزوم‌ها (جابه‌جایی، واژگونی)',
    suggestedMethod: 'شناسایی نوع جهش بدمعنی، بی‌معنی و خاموش بر اساس تغییر آمینواسیدها',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'bio12_c5_t1',
    grade: 12,
    track: ['experimental'],
    subject: 'زیست‌شناسی',
    bookTitle: 'زیست‌شناسی ۳ دوازدهم',
    chapterNumber: 5,
    chapterTitle: 'فصل ۵: از ماده به انرژی',
    topicName: 'تنفس یاخته‌ای، گلیکولیز (قندکافت)، تشکیل استیل کوآنزیم A، چرخه کربس و زنجیره انتقال الکترون',
    suggestedMethod: 'متد بلرتینگ: بازنویسی موازنه کامل مولکول‌های ATP، NADH و FADH2 در میتوکندری',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'bio12_c6_t1',
    grade: 12,
    track: ['experimental'],
    subject: 'زیست‌شناسی',
    bookTitle: 'زیست‌شناسی ۳ دوازدهم',
    chapterNumber: 6,
    chapterTitle: 'فصل ۶: از انرژی به ماده',
    topicName: 'فتوسنتز، کلروپلاست، فتوسیستم ۱ و ۲، واکنش‌های نوری و چرخه کالوین (تثبیت کربن)',
    suggestedMethod: 'مقایسه مسیر تثبیت کربن در گیاهان C3، C4 و CAM در شرایط گرم و خشک',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'bio12_c7_t1',
    grade: 12,
    track: ['experimental'],
    subject: 'زیست‌شناسی',
    bookTitle: 'زیست‌شناسی ۳ دوازدهم',
    chapterNumber: 7,
    chapterTitle: 'فصل ۷: فناوری‌های نوین زیستی',
    topicName: 'مهندسی ژنتیک، آنزیم‌های برش‌دهنده و لیگاز، پلازمید، ساخت دنای نوترکیب و کلون کردن',
    suggestedMethod: 'مراحل مرحله‌به‌مرحله تولید انسولین نوترکیب در باکتری اشرشیاکلی',
    difficulty: 'medium',
    importance: 'very_high'
  },

  // شیمی دوازدهم
  {
    id: 'chem12_c1_t1',
    grade: 12,
    track: ['experimental', 'mathematics'],
    subject: 'شیمی',
    bookTitle: 'شیمی ۳ دوازدهم',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: مولکول‌ها در خدمت تندرستی',
    topicName: 'پاک‌کننده‌ها (صابونی و غیرصابونی)، اسیدها و بازها، تعادل یونش آب و فرمول pH',
    suggestedMethod: 'حل مسائل لگاریتمی محاسبه pH اسیدهای ضعیف با ثابت یونش Ka',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'chem12_c2_t1',
    grade: 12,
    track: ['experimental', 'mathematics'],
    subject: 'شیمی',
    bookTitle: 'شیمی ۳ دوازدهم',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: آسایش و رفاه در سایه شیمی',
    topicName: 'الکتروشیمی، سلول‌های گالوانی، پتانسیل استاندارد کاهشی (E0)، سلول سوختی هیدروژن-اکسیژن',
    suggestedMethod: 'محاسبه emf سلول و تعیین آند و کاتد با پتانسیل‌های استاندارد',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'chem12_c2_t2',
    grade: 12,
    track: ['experimental', 'mathematics'],
    subject: 'شیمی',
    bookTitle: 'شیمی ۳ دوازدهم',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: آسایش و رفاه در سایه شیمی',
    topicName: 'خوردگی آهن، حفاظت کاتدی (آند فداکار)، آبکاری فلزات و سلول‌های الکترولیتی',
    suggestedMethod: 'مقایسه سازوکار آهن سفید (گالوانیزه) و حلبی هنگام خراشیده شدن سطح',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'chem12_c3_t1',
    grade: 12,
    track: ['experimental', 'mathematics'],
    subject: 'شیمی',
    bookTitle: 'شیمی ۳ دوازدهم',
    chapterNumber: 3,
    chapterTitle: 'فصل ۳: شیمی جلوه‌ای از هنر و ماندگاری',
    topicName: 'جامدهای بلوری، شبکه بلور یونی، انرژی شبکه، جامدهای کووالانسی (الماس، گرافیت، سیلیس)',
    suggestedMethod: 'مقایسه نقطه ذوب و رسانایی الکتریکی انواع جامدها در حالت مذاب و محلول',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'chem12_c4_t1',
    grade: 12,
    track: ['experimental', 'mathematics'],
    subject: 'شیمی',
    bookTitle: 'شیمی ۳ دوازدهم',
    chapterNumber: 4,
    chapterTitle: 'فصل ۴: شیمی، راهی به سوی آینده روشن‌تر',
    topicName: 'تعادل‌های شیمیایی، ثابت تعادل K، اصل لوشاتلیه (اثر غلظت، فشار و دما) و فرایند هابر',
    suggestedMethod: 'تحلیل جهت جابه‌جایی تعادل با تغییر حجم و افزایش دما در واکنش‌های گرماگیر و گرماده',
    difficulty: 'hard',
    importance: 'critical'
  },

  // فیزیک دوازدهم
  {
    id: 'phys12_c1_t1',
    grade: 12,
    track: ['experimental', 'mathematics'],
    subject: 'فیزیک',
    bookTitle: 'فیزیک ۳ دوازدهم',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: حرکت بر خط راست',
    topicName: 'حرکت با سرعت ثابت، حرکت با شتاب ثابت، نمودارهای مکان-زمان و سرعت-زمان، خط ترمز',
    suggestedMethod: 'استفاده از تقارن نمودار سرعت-زمان و مساحت زیر نمودار در حل تست‌های دو متحرکه',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'phys12_c2_t1',
    grade: 12,
    track: ['experimental', 'mathematics'],
    subject: 'فیزیک',
    bookTitle: 'فیزیک ۳ دوازدهم',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: دینامیک و حرکت دایره‌ای',
    topicName: 'قوانین نیوتون، رسم نیروها، نیروی اصطکاک ایستایی و جنبشی، تکانه و نیروی گرانش',
    suggestedMethod: 'حل مسائل آسانسور، سطح شیب‌دار و قرقره‌های متصل به اجسام متحرک',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'phys12_c3_t1',
    grade: 12,
    track: ['experimental', 'mathematics'],
    subject: 'فیزیک',
    bookTitle: 'فیزیک ۳ دوازدهم',
    chapterNumber: 3,
    chapterTitle: 'فصل ۳: نوسان و موج',
    topicName: 'حرکت هماهنگ ساده (SHM)، سامانه جرم و فنر، آونگ ساده، معادله مکان-زمان و شتاب',
    suggestedMethod: 'محاسبه انرژی پتانسیل کشسانی و انرژی جنبشی نوسانگر در لحظات مختلف تناوب',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'phys12_c4_t1',
    grade: 12,
    track: ['experimental', 'mathematics'],
    subject: 'فیزیک',
    bookTitle: 'فیزیک ۳ دوازدهم',
    chapterNumber: 4,
    chapterTitle: 'فصل ۴: برهم‌کنش‌های موج',
    topicName: 'بازتاب موج، شکست موج و قانون اسنل، تداخل امواج و امواج ایستاده و تندی صوت',
    suggestedMethod: 'محاسبه زاویه حد و بازتاب کلی پرتو نور در مرز دو محیط شفاف',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'phys12_c5_t1',
    grade: 12,
    track: ['experimental', 'mathematics'],
    subject: 'فیزیک',
    bookTitle: 'فیزیک ۳ دوازدهم',
    chapterNumber: 5,
    chapterTitle: 'فصل ۵ و ۶: فیزیک اتمی و هسته‌ای',
    topicName: 'اثر فوتوالکتریک، مدل اتمی بور، خطوط طیف هیدروژن، واپاشی پرتوزا (آلفا، بتا، گاما) و نیمه‌عمر',
    suggestedMethod: 'حل مسائل نیمه‌عمر پرتوزایی با فرمول N = N0 * (1/2)^(t/T)',
    difficulty: 'medium',
    importance: 'critical'
  },

  // ریاضی ۳ دوازدهم تجربی
  {
    id: 'math12_exp_c1_t1',
    grade: 12,
    track: ['experimental'],
    subject: 'ریاضیات',
    bookTitle: 'ریاضی ۳ دوازدهم تجربی',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: تابع',
    topicName: 'توابع چندجمله‌ای، صعودی و نزولی بودن تابع، ترکیب توابع و انتقال نمودارها',
    suggestedMethod: 'حل تست‌های تعیین دامنه و برد توابع مرکب f(g(x))',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'math12_exp_c2_t1',
    grade: 12,
    track: ['experimental'],
    subject: 'ریاضیات',
    bookTitle: 'ریاضی ۳ دوازدهم تجربی',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: مثلثات',
    topicName: 'معادلات مثلثاتی پایه، فرمول‌های سینوس و کسینوس دو برابر کمان و مقادیر متناوب',
    suggestedMethod: 'حل کلی معادلات مثلثاتی sin x = sin a و cos x = cos a در بازه [0, 2pi]',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'math12_exp_c3_t1',
    grade: 12,
    track: ['experimental'],
    subject: 'ریاضیات',
    bookTitle: 'ریاضی ۳ دوازدهم تجربی',
    chapterNumber: 3,
    chapterTitle: 'فصل ۳: حد بی‌نهایت و حد در بی‌نهایت',
    topicName: 'مجانب‌های قائم و مجانب افقی، رفتار مجانبی توابع کسری و هم‌ارزی‌ها',
    suggestedMethod: 'رسم مجانب‌های تابع و بررسی حد در همسایگی چپ و راست ریشه‌های مخرج',
    difficulty: 'medium',
    importance: 'critical'
  },
  {
    id: 'math12_exp_c4_t1',
    grade: 12,
    track: ['experimental'],
    subject: 'ریاضیات',
    bookTitle: 'ریاضی ۳ دوازدهم تجربی',
    chapterNumber: 4,
    chapterTitle: 'فصل ۴: مشتق',
    topicName: 'تعریف مشتق، خط مماس و قائم، قواعد مشتق‌گیری جبری، زنجیره‌ای و مشتق‌پذیری',
    suggestedMethod: 'بررسی نقاط گوشه‌ای، بازگشتی و مماس قائم که مشتق در آن‌ها وجود ندارد',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'math12_exp_c5_t1',
    grade: 12,
    track: ['experimental'],
    subject: 'ریاضیات',
    bookTitle: 'ریاضی ۳ دوازدهم تجربی',
    chapterNumber: 5,
    chapterTitle: 'فصل ۵: کاربرد مشتق',
    topicName: 'نقاط بحرانی، اکسترمم‌های نسبی و مطلق، آزمون مشتق اول و دوم، بهینه‌سازی',
    suggestedMethod: 'حل مسائل بهینه‌سازی (بزرگ‌ترین مساحت، حداقل هزینه و بیشترین حجم)',
    difficulty: 'hard',
    importance: 'critical'
  },

  // حسابان ۲ دوازدهم ریاضی
  {
    id: 'calc12_c1_t1',
    grade: 12,
    track: ['mathematics'],
    subject: 'حسابان',
    bookTitle: 'حسابان ۲ دوازدهم ریاضی',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: تابع',
    topicName: 'توابع صعودی و نزولی اکید، بخش‌پذیری چندجمله‌ای‌ها، قضیه تقسیم و اتحادها',
    suggestedMethod: 'یافتن باقیمانده تقسیم چندجمله‌ای P(x) بر عبارت درجه اول بدون تقسیم طولانی',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'calc12_c2_t1',
    grade: 12,
    track: ['mathematics'],
    subject: 'حسابان',
    bookTitle: 'حسابان ۲ دوازدهم ریاضی',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: مثلثات',
    topicName: 'فرمول‌های مثلثاتی مجموع و تفاضل، تانژانت مجموع، حل معادلات پیشرفته مثلثاتی',
    suggestedMethod: 'حل معادلات تانژانتی و ساده‌سازی عبارات مثلثاتی کنکور سراسری',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'calc12_c3_t1',
    grade: 12,
    track: ['mathematics'],
    subject: 'حسابان',
    bookTitle: 'حسابان ۲ دوازدهم ریاضی',
    chapterNumber: 3,
    chapterTitle: 'فصل ۳: حد و مجانب‌ها',
    topicName: 'حدود در بی‌نهایت، مجانب‌های مایل، مجانب افقی و قائم و رفتار توابع در نزدیکی مجانب',
    suggestedMethod: 'محاسبه ضابطه مجانب مایل y = ax + b با تقسیم صورت بر مخرج کسر',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'calc12_c4_t1',
    grade: 12,
    track: ['mathematics'],
    subject: 'حسابان',
    bookTitle: 'حسابان ۲ دوازدهم ریاضی',
    chapterNumber: 4,
    chapterTitle: 'فصل ۴ و ۵: مشتق و کاربرد مشتق',
    topicName: 'مشتق توابع مثلثاتی، قاعده زنجیره‌ای، نقاط عطف، تقعر نمودار و رسم کامل نمودارها',
    suggestedMethod: 'جدول تغییرات مشتق اول و دوم و تعیین جهت تقعر و مختصات نقطه عطف',
    difficulty: 'hard',
    importance: 'critical'
  },

  // هندسه ۳ دوازدهم ریاضی
  {
    id: 'geom12_c1_t1',
    grade: 12,
    track: ['mathematics'],
    subject: 'هندسه',
    bookTitle: 'هندسه ۳ دوازدهم ریاضی',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: ماتریس و کاربردها',
    topicName: 'عملیات روی ماتریس‌ها، دترمینان، ماتریس وارون و حل دستگاه معادلات خطی به روش کرامر',
    suggestedMethod: 'محاسبه دترمینان با بسط سطر و ستون و خواص دترمینان حاصل‌ضرب ماتریس‌ها',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'geom12_c2_t1',
    grade: 12,
    track: ['mathematics'],
    subject: 'هندسه',
    bookTitle: 'هندسه ۳ دوازدهم ریاضی',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: مقاطع مخروطی',
    topicName: 'دایره (معادله استاندارد و گسترده، وضعیت خط و دایره) و بیضی (کانون‌ها، خروج از مرکز)',
    suggestedMethod: 'تعیین مختصات کانون‌ها و رأس‌های بیضی از روی فرمول استاندارد',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'geom12_c3_t1',
    grade: 12,
    track: ['mathematics'],
    subject: 'هندسه',
    bookTitle: 'هندسه ۳ دوازدهم ریاضی',
    chapterNumber: 3,
    chapterTitle: 'فصل ۳: بردارها در فضای سه‌بعدی',
    topicName: 'مختصات در فضا، ضرب داخلی و ضرب خارجی بردارها، مساحت متوازی‌الاضلاع و حجم متوازی‌السطوح',
    suggestedMethod: 'محاسبه بردار نرمال صفحه با ضرب خارجی دو بردار غیرموازی',
    difficulty: 'medium',
    importance: 'very_high'
  },

  // ریاضیات گسسته دوازدهم ریاضی
  {
    id: 'disc12_c1_t1',
    grade: 12,
    track: ['mathematics'],
    subject: 'ریاضیات گسسته',
    bookTitle: 'ریاضیات گسسته دوازدهم ریاضی',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: آشنایی با نظریه اعداد',
    topicName: 'بخش‌پذیری در اعداد صحیح، ب.م.م و ک.م.م، هم‌نهشتی، معادلات همنهشتی و حل معادله سیاله‌ای',
    suggestedMethod: 'حل معادله سیاله‌ای ax + by = c با الگوریتم تقسیم اقلیدسی و هم‌نهشتی',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'disc12_c2_t1',
    grade: 12,
    track: ['mathematics'],
    subject: 'ریاضیات گسسته',
    bookTitle: 'ریاضیات گسسته دوازدهم ریاضی',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: گراف و مدل‌سازی',
    topicName: 'مفاهیم پایه گراف، درجه رأس‌ها، لم دست‌دادن، ماتریس مجاورت، دور، مسیر و گراف منتظم',
    suggestedMethod: 'اثبات احکام گراف با قضیه فرجه و تعداد یال‌های گراف همبند',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'disc12_c3_t1',
    grade: 12,
    track: ['mathematics'],
    subject: 'ریاضیات گسسته',
    bookTitle: 'ریاضیات گسسته دوازدهم ریاضی',
    chapterNumber: 3,
    chapterTitle: 'فصل ۳: ترکیبیات (شمارش)',
    topicName: 'اصل شمول و عدم شمول، توزیع اشیاء در جعبه‌ها، اصل لانه‌کبوتری و جایگشت‌های با تکرار',
    suggestedMethod: 'حل مسئله‌های توزیع اشیاء همسان و متمایز در ظرف‌ها',
    difficulty: 'hard',
    importance: 'critical'
  },

  // =========================================================================
  // پایه دوازدهم - ادبیات و علوم انسانی
  // =========================================================================
  {
    id: 'fonun12_c1_t1',
    grade: 12,
    track: ['humanities'],
    subject: 'علوم و فنون ادبی',
    bookTitle: 'علوم و فنون ادبی ۳ دوازدهم',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: تاریخ ادبیات و سبک‌شناسی دوره سوم',
    topicName: 'سبک هندی (اصفهانی)، دوره بازگشت ادبی و شعر دوره مشروطه و شعر معاصر (نیما، شاملو)',
    suggestedMethod: 'تحلیل مضمون‌یابی و تمثیل در تک‌بیت‌های صائب تبریزی',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'fonun12_c2_t1',
    grade: 12,
    track: ['humanities'],
    subject: 'علوم و فنون ادبی',
    bookTitle: 'علوم و فنون ادبی ۳ دوازدهم',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: موسیقی شعر (اوزان ناهمسان)',
    topicName: 'اوزان ناهمسان، دایره‌های عروضی، اختیارات زبانی و وزنی (تسکین، قلب، اشباع)',
    suggestedMethod: 'تقطیع اوزان ناهمسان متداول کنکور (مانند مفعولُ فاعلاتُ مفاعیلُ فاعلن)',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'fonun12_c3_t1',
    grade: 12,
    track: ['humanities'],
    subject: 'علوم و فنون ادبی',
    bookTitle: 'علوم و فنون ادبی ۳ دوازدهم',
    chapterNumber: 3,
    chapterTitle: 'فصل ۳: آرایه‌های ادبی (بدیع معنوی و بیان)',
    topicName: 'ایهام، ایهام تناسب، لف و نشر، حس‌آمیزی، متناقض‌نما (پارادوکس) و اسلوب معادله',
    suggestedMethod: 'تست‌های ترکیبی تشخیص تفاوت ایهام و ایهام تناسب در ابیات حافظ',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'falsafah12_c1_t1',
    grade: 12,
    track: ['humanities'],
    subject: 'فلسفه',
    bookTitle: 'فلسفه ۲ دوازدهم انسانی',
    chapterNumber: 1,
    chapterTitle: 'درس ۱ تا ۳: هستی‌شناسی و وجود و ماهیت',
    topicName: 'مفهوم وجود، اشتراک معنوی وجود، اصالت وجود در برابر اصالت ماهیت (ملاصدرا)',
    suggestedMethod: 'متد بلرتینگ: بازنویسی شواهد عقلی ملاصدرا بر اصالت وجود',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'falsafah12_c2_t1',
    grade: 12,
    track: ['humanities'],
    subject: 'فلسفه',
    bookTitle: 'فلسفه ۲ دوازدهم انسانی',
    chapterNumber: 2,
    chapterTitle: 'درس ۴ تا ۶: علیت و ضرورت علّی و معلولی',
    topicName: 'اصل علیت، ضرورت علّی و معلولی، سنخیت علت و معلول و بطلان دور و تسلسل',
    suggestedMethod: 'طراحی نقشه برهان علّی و پاسخ به ایرادهای دیوید هیوم درباره علیت',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'falsafah12_c3_t1',
    grade: 12,
    track: ['humanities'],
    subject: 'فلسفه',
    bookTitle: 'فلسفه ۲ دوازدهم انسانی',
    chapterNumber: 3,
    chapterTitle: 'درس ۷ تا ۱۱: خداشناسی فلسفی و جریان‌های فکری',
    topicName: 'برهان وجوب و امکان ابن‌سینا، برهان صدیقین ملاصدرا، عقل و ایمان در حکمت اسلامی',
    suggestedMethod: 'مقایسه مقدمات برهان امکان و وجوب با برهان صدیقین',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'soc12_c1_t1',
    grade: 12,
    track: ['humanities'],
    subject: 'جامعه‌شناسی',
    bookTitle: 'جامعه‌شناسی ۳ دوازدهم',
    chapterNumber: 1,
    chapterTitle: 'درس ۱ تا ۵: ذخیره دانشی و جهان متجدد',
    topicName: 'کنش عقلانی و غیرعقلانی، عقلانیت مدرن و سکولاریسم، تک‌خطی دیدن تاریخ و استعمار',
    suggestedMethod: 'جدول تحلیلی جریان‌های روشنگری غرب و پیامدهای بحران‌های هویتی و محیط‌زیستی',
    difficulty: 'medium',
    importance: 'very_high'
  },
  {
    id: 'soc12_c2_t1',
    grade: 12,
    track: ['humanities'],
    subject: 'جامعه‌شناسی',
    bookTitle: 'جامعه‌شناسی ۳ دوازدهم',
    chapterNumber: 2,
    chapterTitle: 'درس ۶ تا ۱۰: علوم اجتماعی و افق‌های نو',
    topicName: 'جامعه‌شناسی تبیینی، جامعه‌شناسی تفسیری (وبر) و جامعه‌شناسی انتقادی (مارکس و مکتب فرانکفورت)',
    suggestedMethod: 'مقایسه رویکرد پوزیتیویستی در برابر رویکرد معناگرای تفسیری در علوم اجتماعی',
    difficulty: 'hard',
    importance: 'critical'
  },
  {
    id: 'math12_hum_c1_t1',
    grade: 12,
    track: ['humanities'],
    subject: 'ریاضی و آمار',
    bookTitle: 'ریاضی و آمار ۳ دوازدهم انسانی',
    chapterNumber: 1,
    chapterTitle: 'فصل ۱: آمار و احتمال',
    topicName: 'شمارش و اصل ضرب، جایگشت‌ها، ترکیب، احتمال شرطی و حل مسائل ترکیبیات',
    suggestedMethod: 'حل تست‌های فرمول ترکیب C(n, k) و تفکیک مسئله‌های دارای ترتیب از بدون ترتیب',
    difficulty: 'medium',
    importance: 'critical'
  },
  {
    id: 'math12_hum_c2_t1',
    grade: 12,
    track: ['humanities'],
    subject: 'ریاضی و آمار',
    bookTitle: 'ریاضی و آمار ۳ دوازدهم انسانی',
    chapterNumber: 2,
    chapterTitle: 'فصل ۲: الگوهای خطی و سری‌های زمانی',
    topicName: 'دنباله‌های حسابی، خط فقر، سری‌های زمانی و برون‌یابی و درون‌یابی داده‌های آماری',
    suggestedMethod: 'محاسبه خط رگرسیون و خط فقر در مسائل کاربردی اقتصاد',
    difficulty: 'medium',
    importance: 'very_high'
  }
];

// Helper to filter official topics by Grade and Track
export function filterCurriculum(grade?: GradeLevel, track?: AcademicTrack, subject?: string): CurriculumTopic[] {
  return OFFICIAL_CURRICULUM.filter(item => {
    if (grade && item.grade !== grade) return false;
    if (track && !item.track.includes(track)) return false;
    if (subject && subject !== 'all' && item.subject !== subject) return false;
    return true;
  });
}

// Get unique subjects for a given grade and track
export function getAvailableSubjects(grade?: GradeLevel, track?: AcademicTrack): string[] {
  const filtered = filterCurriculum(grade, track);
  const set = new Set<string>();
  filtered.forEach(item => set.add(item.subject));
  return Array.from(set);
}

// Re-export SubjectLibrary and its interfaces for structured hierarchical access
export {
  SubjectLibrary,
  TRACKS_INFO,
  GRADES_LIST
} from './SubjectLibrary';
export type {
  SubjectBook,
  SubjectChapter,
  SubjectTopic,
  AcademicTrackId,
  AcademicTrackInfo
} from './SubjectLibrary';

