import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Swords,
  Trophy,
  Zap,
  Flame,
  Timer,
  CheckCircle2,
  XCircle,
  Users,
  User,
  Share2,
  Copy,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Brain,
  Shield,
  ArrowRight,
  ArrowLeft,
  Award,
  Clock,
  Target,
  Play,
  Check,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Info,
  Layers,
  History,
  TrendingUp,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { EbbinghausTopicItem } from './DashboardStats';
import { DEFAULT_REVIEW_STATS, EbbinghausReviewStats, getPersianDayName } from './EbbinghausScheduler';

// Local storage keys
const TOPICS_STORAGE_KEY = 'rahbord_ebbinghaus_topics_queue';
const WEEKLY_STORAGE_KEY = 'rahbord_weekly_study_data';
const REVIEW_STATS_STORAGE_KEY = 'rahbord_ebbinghaus_review_stats';
const DUELS_HISTORY_STORAGE_KEY = 'rahbord_study_duels_history';
const DUEL_SOUND_STORAGE_KEY = 'rahbord_duel_sound_enabled';

export type DuelMode = 'speed_blitz' | 'iron_precision' | 'ebbinghaus_marathon';

export interface DuelQuestion {
  id: string;
  subject: string;
  topic: string;
  cycleNumber: number; // 1 to 5 (Ebbinghaus cycle)
  cycleLabel: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  cognitiveInsight: string;
}

export interface PeerRival {
  id: string;
  name: string;
  title: string;
  avatar: string;
  avatarBg: string;
  rank: string;
  accuracyRate: number; // e.g. 0.88
  averageSpeedSec: number; // e.g. 4.2
  style: string;
  description: string;
}

export interface DuelRecord {
  id: string;
  timestamp: string;
  rivalName: string;
  rivalTitle: string;
  mode: DuelMode;
  subject: string;
  playerScore: number;
  rivalScore: number;
  playerAccuracy: number;
  rivalAccuracy: number;
  playerAvgSpeed: number;
  result: 'win' | 'loss' | 'tie';
  xpEarned: number;
}

// Preset Rivals representing realistic Konkur and Olympiad study peers
export const PEER_RIVALS: PeerRival[] = [
  {
    id: 'sara_rezaei',
    name: 'سارا رضایی',
    title: 'رتبه ۷۴ تجربی - تراز ۷۳۵۰',
    avatar: '👩‍🔬',
    avatarBg: 'from-pink-500/20 to-rose-500/20 border-rose-500/40 text-rose-300',
    rank: 'قهرمان زیست و شیمی',
    accuracyRate: 0.92,
    averageSpeedSec: 3.8,
    style: 'دقت وسواس‌گونه و درصد خطای بسیار پایین',
    description: 'تسلط بی‌نظیر روی جزئیات کتاب‌های درسی و تست‌های ترکیبی کنکور.'
  },
  {
    id: 'kian_pirouz',
    name: 'کیان پیروز',
    title: 'رتبه ۲۹ ریاضی - المپیاد فیزیک',
    avatar: '⚡',
    avatarBg: 'from-amber-500/20 to-yellow-500/20 border-amber-500/40 text-amber-300',
    rank: 'استاد محاسبات سریع',
    accuracyRate: 0.84,
    averageSpeedSec: 2.5,
    style: 'سرعت واکنش برق‌آسا و حل ذهنی فرمول‌ها',
    description: 'عاشق بازیابی سریع با متد بلرتینگ؛ در سوالات زمان‌دار رقیبی سرسخت است.'
  },
  {
    id: 'negar_ahmadi',
    name: 'نگار احمدی',
    title: 'رتبه ۱۱۲ انسانی - تراز ۶۹۰۰',
    avatar: '📚',
    avatarBg: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-300',
    rank: 'استراتژیست حافظه پایدار',
    accuracyRate: 0.95,
    averageSpeedSec: 4.8,
    style: 'آرام، سنجیده، و بدون کوچکترین نمره منفی',
    description: 'هرگز تسلیم تله‌های تستی نمی‌شود و سوالات را با تمرکز کامل پاسخ می‌دهد.'
  },
  {
    id: 'arash_khalili',
    name: 'آرش خلیلی',
    title: 'داوطلب سخت‌کوش - تراز ۶۸۰۰',
    avatar: '🔥',
    avatarBg: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300',
    rank: 'مبارز پیشرفت مستمر',
    accuracyRate: 0.78,
    averageSpeedSec: 3.4,
    style: 'ریسک‌پذیر، مبارز و در حال ارتقای مداوم تراز',
    description: 'انرژی و انگیزه فوق‌العاده برای دوئل‌های روزانه و یادگیری از اشتباهات.'
  }
];

// Rich High-Yield Active Recall Question Decks for Konkur & Academic Subjects
export const QUESTION_DECKS: Record<string, DuelQuestion[]> = {
  biology: [
    {
      id: 'bio_1',
      subject: 'زیست‌شناسی',
      topic: 'گردش مواد و ساختار قلب انسان',
      cycleNumber: 1,
      cycleLabel: 'چرخه ۱: مرور ۲۴ ساعت',
      question: 'در پایان سیستول بطنی و هم‌زمان با بسته شدن دریچه‌های سینی، کدام رویداد قلبی رخ می‌دهد؟',
      options: [
        'شنیده شدن صدای اول قلب و باز شدن دریچه‌های دهلیزی-بطنی',
        'شنیده شدن صدای دوم قلب و کاهش فشار بطن‌ها به زیر فشار سرخرگ‌ها',
        'پر شدن بطن‌ها با بیش از ۷۰ درصد خون ورودی به دهلیزها',
        'انقباض هم‌زمان دهلیزها و ثبت موج P در نوار قلب'
      ],
      correctIndex: 1,
      explanation: 'صدای دوم قلب ناشی از بسته شدن ناگهانی دریچه‌های سینی (آئورت و ششی) در ابتدای دیاستول است، زمانی که فشار بطن‌ها کمتر از فشار سرخرگ‌ها می‌شود.',
      cognitiveInsight: 'بازیابی فعال تفاوت صدای اول (بسته شدن دهلیزی-بطنی) و صدای دوم (بسته شدن سینی) از افت حافظه کوتاه‌مدت جلوگیری می‌کند.'
    },
    {
      id: 'bio_2',
      subject: 'زیست‌شناسی',
      topic: 'ژنتیک و پروتئین‌سازی',
      cycleNumber: 2,
      cycleLabel: 'چرخه ۲: مرور ۳ روز بعد',
      question: 'کدام گزینه درباره توالی راه‌انداز در فرآیند رونویسی در پیش‌هسته‌ای‌ها و هو‌هسته‌ای‌ها صحیح است؟',
      options: [
        'راه‌انداز رونویسی نمی‌شود و تنها محل اتصال رنابسپاراز است',
        'راه‌انداز بخشی از مولکول mRNA بالغ بوده و کدون آغاز در آن است',
        'راه‌انداز حاوی کدون‌های اختصاصی برای مهارکننده‌هاست',
        'راه‌انداز پس از ترجمه توسط آنزیم‌های پیرایش حذف می‌شود'
      ],
      correctIndex: 0,
      explanation: 'راه‌انداز توالی ویژه‌ای از دنا است که آنزیم رنابسپاراز به آن متصل می‌شود و جهت و نقطه شروع را تعیین می‌کند، اما خودش رونویسی نمی‌شود.',
      cognitiveInsight: 'تله رایج کنکور: خلط میان «توالی راه‌انداز روی DNA» و «کدون آغاز روی mRNA» با مرور فاصله‌دار تثبیت می‌شود.'
    },
    {
      id: 'bio_3',
      subject: 'زیست‌شناسی',
      topic: 'گوارش و جذب مواد مغذی',
      cycleNumber: 3,
      cycleLabel: 'چرخه ۳: مرور ۷ روز بعد',
      question: 'جذب کدام ماده غذایی به مویرگ لنفی پرزهای روده باریک منتقل می‌شود و مستقیماً وارد سیاهرگ باب کبد نمی‌شود؟',
      options: [
        'گلوکز و اسیدهای آمینه محلول در آب',
        'ویتامین‌های گروه B و ویتامین C',
        'اسیدهای چرب بلندزنجیر در قالب کیلومیکرون‌ها',
        'یون‌های سدیم و پتاسیم و آب'
      ],
      correctIndex: 2,
      explanation: 'مولکول‌های چربی و ویتامین‌های محلول در چربی وارد مجرای لنفی پرزها شده و از طریق لنف نهایتاً به سیاهرگ زیرترقوه‌ای چپ می‌ریزند نه سیاهرگ باب کبد.',
      cognitiveInsight: 'مسیر گردش لنف در برابر گردش سیاهرگ باب در روز ۷ نیاز به یادآوری نقشه مفهومی دارد.'
    },
    {
      id: 'bio_4',
      subject: 'زیست‌شناسی',
      topic: 'تنفس و انتقال گازها',
      cycleNumber: 4,
      cycleLabel: 'چرخه ۴: مرور ۱۵ روز بعد',
      question: 'بیشترین درصد انتقال دی‌اکسید کربن در خون سیاهرگی انسان به کدام صورت انجام می‌گیرد؟',
      options: [
        'ترکیب با هموگلوبین به صورت کربامینوهموگلوبین',
        'حل شده مستقیم در بخش آبکی پلاسما',
        'به صورت یون بی‌کربنات محلول در پلاسما',
        'متصل به پروتئین‌های ناقل غشای گلبول قرمز'
      ],
      correctIndex: 2,
      explanation: 'حدود ۷۰ درصد CO2 به شکل یون بی‌کربنات (HCO3-)، ۲۳ درصد متصل به هموگلوبین و ۷ درصد به شکل حل‌شده منتقل می‌شود.',
      cognitiveInsight: 'اعداد طلایی فیزیولوژی در چرخه ۴ تثبیت دائمی می‌شوند.'
    },
    {
      id: 'bio_5',
      subject: 'زیست‌شناسی',
      topic: 'دستگاه ایمنی و لنفوسیت‌ها',
      cycleNumber: 5,
      cycleLabel: 'چرخه ۵: مرور ۳۰ روز بعد',
      question: 'در پاسخ ایمنی هومورال ثانویه در مقایسه با پاسخ اولیه، کدام ویژگی بارز است؟',
      options: [
        'زمان تاخیر کمتر، ترشح پادتن بیشتر و با میل اتصالی بالاتر',
        'ترشح پرفورین و آنزیم مرگ سلولی توسط پلاسموسیت‌ها',
        'فعال شدن مستقیم هیستامین به عنوان نخستین خط دفاع اختصاصی',
        'کاهش تعداد لنفوسیت‌های خاطره و افزایش ترشح اینترفرون'
      ],
      correctIndex: 0,
      explanation: 'به دلیل حضور لنفوسیت‌های خاطره، پاسخ ایمنی ثانویه بلافاصله با غلظت بسیار بالاتر و با پادتن‌های باکیفیت‌تر بروز می‌کند.',
      cognitiveInsight: 'تسلط بر مفهوم سلول‌های خاطره خود بازتابی از مکانیزم تحکیم حافظه پایدار ابینگهاوس است!'
    }
  ],
  chemistry: [
    {
      id: 'chem_1',
      subject: 'شیمی',
      topic: 'تعادل شیمیایی و اصل لوشاتلیه',
      cycleNumber: 1,
      cycleLabel: 'چرخه ۱: مرور ۲۴ ساعت',
      question: 'در یک واکنش گرماگیر گازی در حال تعادل، با کاهش حجم ظرف در دمای ثابت، تعادل به چه سمتی جابه‌جا شده و مقدار ثابت تعادل (K) چه تغییری می‌کند؟',
      options: [
        'به سمت مول‌های گازی کمتر - ثابت تعادل K بدون تغییر می‌ماند',
        'به سمت واکنش‌دهنده‌ها - ثابت تعادل K افزایش می‌یابد',
        'به سمت فرآورده‌ها - ثابت تعادل K کاهش می‌یابد',
        'به سمت مول‌های گازی بیشتر - ثابت تعادل K دو برابر می‌شود'
      ],
      correctIndex: 0,
      explanation: 'کاهش حجم فشار را افزایش می‌دهد، بنابراین تعادل طبق اصل لوشاتلیه به سمت تعداد مول گازی کمتر جابه‌جا می‌شود. دقت کنید تنها عامل تغییر ثابت تعادل (K) دماست!',
      cognitiveInsight: 'نکته طلایی: ثابت تعادل فقط با دما تغییر می‌کند؛ این نکته شایع‌ترین تله در ۲۴ ساعت اولیه مطالعه است.'
    },
    {
      id: 'chem_2',
      subject: 'شیمی',
      topic: 'اسیدها، بازها و بافرها',
      cycleNumber: 2,
      cycleLabel: 'چرخه ۲: مرور ۳ روز بعد',
      question: 'اگر pH یک محلول اسید قوی هیدروکلریک اسید با آب مقطر از ۲ به ۴ برسد، غلظت یون هیدرونیوم چند برابر شده است؟',
      options: [
        '۲ برابر شده است',
        '۱۰۰ برابر کاهش یافته است (۰.۰۱ برابر)',
        '۱۰ برابر کاهش یافته است',
        '۲۰۰ برابر افزایش یافته است'
      ],
      correctIndex: 1,
      explanation: 'در pH=2 غلظت هیدرونیوم 10^-2 و در pH=4 غلظت 10^-4 است؛ پس غلظت ۱۰۰ برابر کاهش یافته است.',
      cognitiveInsight: 'مقیاس لگاریتمی pH: هر یک واحد تغییر pH معادل ۱۰ برابر تغییر در غلظت یون هیدرونیوم است.'
    },
    {
      id: 'chem_3',
      subject: 'شیمی',
      topic: 'آرایش الکترونی و جدول تناوبی',
      cycleNumber: 3,
      cycleLabel: 'چرخه ۳: مرور ۷ روز بعد',
      question: 'آرایش الکترونی لایه ظرفیت اتم عنصر کروم (با عدد اتمی ۲۴) در حالت پایه به کدام صورت است؟',
      options: [
        '4s2 3d4',
        '4s1 3d5',
        '4s2 3d5',
        '4s0 3d6'
      ],
      correctIndex: 1,
      explanation: 'به علت پایداری بیشتر زیرلایه نیمه‌پر d5، یک الکترون از زیرلایه 4s به 3d منتقل شده و آرایش به صورت [Ar] 4s1 3d5 درمی‌آید.',
      cognitiveInsight: 'استثنائات پایدار کروم (Cr) و مس (Cu) نیازمند فراخوانی از حافظه صریح در چرخه ۷ روزه هستند.'
    },
    {
      id: 'chem_4',
      subject: 'شیمی',
      topic: 'الکتروشیمی و سلول‌های گالوانی',
      cycleNumber: 4,
      cycleLabel: 'چرخه ۴: مرور ۱۵ روز بعد',
      question: 'در یک سلول گالوانی، جهت حرکت کاتیون‌ها در پل نمکی و الکترون‌ها در مدار بیرونی به چه سمتی است؟',
      options: [
        'کاتیون‌ها به سمت کاتد / الکترون‌ها از آند به کاتد',
        'کاتیون‌ها به سمت آند / الکترون‌ها از کاتد به آند',
        'کاتیون‌ها به سمت کاتد / الکترون‌ها از کاتد به آند',
        'کاتیون‌ها بدون جهت مشخص / الکترون‌ها در پل نمکی حرکت می‌کنند'
      ],
      correctIndex: 0,
      explanation: 'الکترون‌ها از محل اکسایش (آند) به سمت محل کاهش (کاتد) در سیم حرکت می‌کنند؛ برای برقراری خنثایی الکتریکی، کاتیون‌ها از پل نمکی به سمت ظرف کاتد روانه می‌شوند.',
      cognitiveInsight: 'رمز طلایی: «کاتیون به سمت کاتد، آنیون به سمت آند»'
    },
    {
      id: 'chem_5',
      subject: 'شیمی',
      topic: 'شیمی آلی و گروه‌های عاملی',
      cycleNumber: 5,
      cycleLabel: 'چرخه ۵: مرور ۳۰ روز بعد',
      question: 'کدام جفت از ترکیبات زیر ایزومر (هم‌پار) ساختاری یکدیگر هستند؟',
      options: [
        'اتانول و دی‌متیل اتر',
        'استیک اسید و استون',
        'پروپان و پروپین',
        'بنزن و سیکلوهگزان'
      ],
      correctIndex: 0,
      explanation: 'اتانول (C2H5OH) و دی‌متیل اتر (CH3-O-CH3) هر دو دارای فرمول مولکولی C2H6O هستند ولی فرمول ساختاری و خواص فیزیکی و شیمیایی متفاوتی دارند.',
      cognitiveInsight: 'تثبیت الگوهای ایزومری الکل-اتر و آلدهید-کتون پس از ۳۰ روز تضمین‌کننده درصد بالا در شیمی کنکور است.'
    }
  ],
  physics: [
    {
      id: 'phys_1',
      subject: 'فیزیک',
      topic: 'دینامیک نیوتون و اصطکاک',
      cycleNumber: 1,
      cycleLabel: 'چرخه ۱: مرور ۲۴ ساعت',
      question: 'جسمی با شتاب ثابت روی سطح افقی زبر با نیروی افقی F حرکت می‌کند. اگر جرم جسم را بدون تغییر سایر عوامل نصف کنیم، شتاب حرکت آن چه تغییری می‌کند؟',
      options: [
        'بیش از دو برابر می‌شود',
        'دقیقاً دو برابر می‌شود',
        'بدون تغییر می‌ماند',
        'کمتر از دو برابر می‌شود'
      ],
      correctIndex: 0,
      explanation: 'شتاب عبارت است از a = (F - μmg)/m = F/m - μg. با نصف شدن m، جمله F/m دو برابر می‌شود در حالی که جمله منفی μg ثابت است، بنابراین حاصل بیش از دو برابر خواهد شد.',
      cognitiveInsight: 'تحلیل جبری اصطکاک در شتاب مانع از خطای شتاب‌زده‌ی «صرفاً دو برابر شدن» می‌شود.'
    },
    {
      id: 'phys_2',
      subject: 'فیزیک',
      topic: 'حرکت نوسانی و آونگ ساده',
      cycleNumber: 2,
      cycleLabel: 'چرخه ۲: مرور ۳ روز بعد',
      question: 'اگر بسامد زاویه‌ای (امگا) یک نوسانگر هماهنگ ساده ۲ برابر شود، بیشینه انرژی جنبشی و بیشینه شتاب نوسانگر به ترتیب چند برابر می‌شوند؟ (دامنه ثابت است)',
      options: [
        '۴ برابر - ۴ برابر',
        '۲ برابر - ۴ برابر',
        '۴ برابر - ۲ برابر',
        '۲ برابر - ۲ برابر'
      ],
      correctIndex: 0,
      explanation: 'انرژی بیشینه متناسب با مربع بسامد زاویه‌ای (K_max = 1/2 m A^2 ω^2) و بیشینه شتاب نیز a_max = A ω^2 است؛ لذا هر دو ۴ برابر می‌شوند.',
      cognitiveInsight: 'روابط تناسبی نوسانگرها در روز ۳ نیاز به بازنویسی فرمولی ذهنی دارند.'
    },
    {
      id: 'phys_3',
      subject: 'فیزیک',
      topic: 'جریان الکتریکی و مدارها',
      cycleNumber: 3,
      cycleLabel: 'چرخه ۳: مرور ۷ روز بعد',
      question: 'اگر طول یک سیم استوانه‌ای همگن را با کشیدن ۳ برابر کنیم به گونه‌ای که چگالی و حجم آن تغییر نکند، مقاومت الکتریکی آن چند برابر می‌شود؟',
      options: [
        '۹ برابر',
        '۳ برابر',
        '۶ برابر',
        'یک‌سوم برابر'
      ],
      correctIndex: 0,
      explanation: 'چون حجم ثابت است، با ۳ برابر شدن طول سیم، سطح مقطع آن یک‌سوم می‌شود. طبق رابطه R = ρ L / A، مقاومت ۳ تقسیم بر ۱/۳ یعنی ۹ برابر می‌شود.',
      cognitiveInsight: 'نکته تستی کشیدن سیم: مقاومت متناسب با مربع تغییر طول است (L^2).'
    },
    {
      id: 'phys_4',
      subject: 'فیزیک',
      topic: 'موج و صوت',
      cycleNumber: 4,
      cycleLabel: 'چرخه ۴: مرور ۱۵ روز بعد',
      question: 'با گذر موج مکانیکی از یک طناب سبک به یک طناب سنگین و ضخیم، کدام مشخصه موج تغییر نمی‌کند؟',
      options: [
        'بسامد (فرکانس) موج',
        'تندی انتشار موج',
        'طول موج',
        'دامنه موج بازتابی'
      ],
      correctIndex: 0,
      explanation: 'بسامد تنها به چشمه موج وابسته است و با تغییر محیط انتشار هرگز تغییر نمی‌کند. سرعت کاهش یافته و به دنبال آن طول موج نیز کم می‌شود.',
      cognitiveInsight: 'قاعده بنیادین فیزیک امواج: فرکانس هویت چشمه است و با تغییر محیط تغییر نمی‌کند.'
    },
    {
      id: 'phys_5',
      subject: 'فیزیک',
      topic: 'فیزیک اتمی و اثر فوتوالکتریک',
      cycleNumber: 5,
      cycleLabel: 'چرخه ۵: مرور ۳۰ روز بعد',
      question: 'در پدیده فوتوالکتریک، افزایش شدت نور فرودی با بسامد بالاتر از بسامد آستانه منجر به افزایش کدام کمیت می‌شود؟',
      options: [
        'تعداد فوتوالکترون‌های گسیل شده در ثانیه (جریان نوری)',
        'بیشینه انرژی جنبشی فوتوالکترون‌ها',
        'پتانسیل توقف الکترون‌ها',
        'تابع کار فلز'
      ],
      correctIndex: 0,
      explanation: 'شدت نور بیانگر تعداد فوتون‌ها در واحد زمان است؛ بنابراین تعداد الکترون‌های خارج‌شده افزایش می‌یابد. انرژی جنبشی و ولتاژ توقف تنها به بسامد نور وابسته‌اند.',
      cognitiveInsight: 'تمایز ظریف «شدت نور (تعداد فوتون)» و «فرکانس نور (انرژی هر فوتون)» را در حافظه بلندمدت حک کنید.'
    }
  ],
  math: [
    {
      id: 'math_1',
      subject: 'ریاضی و حسابان',
      topic: 'فرمول‌های مشتق و قاعده زنجیره‌ای',
      cycleNumber: 1,
      cycleLabel: 'چرخه ۱: مرور ۲۴ ساعت',
      question: 'مشتق تابع y = sin^3(2x) در نقطه x = π/6 کدام است؟',
      options: [
        '۹/۴',
        '۹/۸',
        '۳√۳ / ۲',
        '۳/۴'
      ],
      correctIndex: 0,
      explanation: 'y\' = 3 * sin^2(2x) * cos(2x) * 2 = 6 sin^2(2x) cos(2x). در x = π/6، زاویه 2x = π/3 است: sin(π/3)=√3/2 و cos(π/3)=1/2. پس: y\' = 6 * (3/4) * (1/2) = 18/8 = 9/4.',
      cognitiveInsight: 'تمرین زنجیره‌ای مشتقات مثلثاتی در ۲۴ ساعت نخست دقت در ضرب ضریب زاویه (u\') را نهادینه می‌کند.'
    },
    {
      id: 'math_2',
      subject: 'ریاضی و حسابان',
      topic: 'حد و پیوستگی توابع',
      cycleNumber: 2,
      cycleLabel: 'چرخه ۲: مرور ۳ روز بعد',
      question: 'حاصل حد lim (x -> 0) [ (1 - cos(4x)) / (3x * sin(2x)) ] برابر با کدام مقدار است؟',
      options: [
        '۴/۳',
        '۲/۳',
        '۸/۳',
        '۱/۳'
      ],
      correctIndex: 0,
      explanation: 'با استفاده از هم‌ارزی‌های مثلثاتی در نزدیکی صفر: 1 - cos(4x) ~ 1/2 * (4x)^2 = 8x^2. مخرج عبارت است از 3x * 2x = 6x^2. حاصل کسر: 8x^2 / 6x^2 = 8/6 = 4/3.',
      cognitiveInsight: 'هم‌ارزی 1-cos(u) ~ 1/2 u^2 برای بازیابی سریع در کنکور ضروری است.'
    },
    {
      id: 'math_3',
      subject: 'ریاضی و حسابان',
      topic: 'کاربرد مشتق و نقاط اکسترمم',
      cycleNumber: 3,
      cycleLabel: 'چرخه ۳: مرور ۷ روز بعد',
      question: 'طول نقطه عطف تابع درجه سوم y = 2x^3 - 6x^2 + 5x - 1 کدام است؟',
      options: [
        'x = 1',
        'x = 2',
        'x = 0',
        'x = 1/2'
      ],
      correctIndex: 0,
      explanation: 'در چندجمله‌ای درجه سوم نقطه عطف ریشه مشتق دوم است: y\' = 6x^2 - 12x + 5 و y\'\' = 12x - 12 = 0 که نتیجه می‌دهد x = 1. (یا فرمول x = -b / (3a) = 6 / 6 = 1).',
      cognitiveInsight: 'فرمول طلایی نقطه عطف x = -b/(3a) باعث صرفه‌جویی ۶۰ ثانیه‌ای در جلسه کنکور می‌شود.'
    },
    {
      id: 'math_4',
      subject: 'ریاضی و حسابان',
      topic: 'مثلثات و معادلات مثلثاتی',
      cycleNumber: 4,
      cycleLabel: 'چرخه ۴: مرور ۱۵ روز بعد',
      question: 'جواب‌های کلی معادله sin(x) + cos(x) = 1 در بازه [0, 2π] دارای چند جواب متمایز است؟',
      options: [
        '۲ جواب (x = 0 و x = π/2)',
        '۳ جواب',
        '۴ جواب',
        '۱ جواب'
      ],
      correctIndex: 0,
      explanation: 'با تبدیل به √2 sin(x + π/4) = 1، sin(x + π/4) = √2/2 می‌شود. زاویه‌ها π/4 و 3π/4 هستند که نتیجه می‌دهد x = 0 و x = π/2.',
      cognitiveInsight: 'دایره مثلثاتی را همیشه به صورت هندسی در ذهن تجسم کنید.'
    },
    {
      id: 'math_5',
      subject: 'ریاضی و حسابان',
      topic: 'هندسه تحلیلی و مقاطع مخروطی',
      cycleNumber: 5,
      cycleLabel: 'چرخه ۵: مرور ۳۰ روز بعد',
      question: 'فاصله کانون‌های بیضی به معادله x^2/25 + y^2/9 = 1 برابر با چه عددی است؟',
      options: [
        '۸',
        '۴',
        '۱۰',
        '۶'
      ],
      correctIndex: 0,
      explanation: 'در بیضی a^2 = 25 و b^2 = 9. فاصله کانونی c برابر است با c = √(25 - 9) = √16 = 4. بنابراین فاصله بین دو کانون برابر 2c = 8 است.',
      cognitiveInsight: 'تمایز c (فاصله مرکز تا کانون) و 2c (فاصله کانون‌ها) تله تستی پرتکرار است.'
    }
  ]
};

// Pure Web Audio sound effect synthesizer
class DuelAudioEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor(enabled: boolean = true) {
    this.soundEnabled = enabled;
  }

  public setEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public playCorrect() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Vibrant rising major triad with shimmering harmonics
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.18, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.28);
      });
    } catch {
      // Audio fallback silent
    }
  }

  public playWrong() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Low dual buzzer
      [220, 207.65].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.12, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.22);
      });
    } catch {
      // Audio fallback silent
    }
  }

  public playCombo() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [880, 1174.66, 1318.51].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.2, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.35);
      });
    } catch {
      // Audio fallback silent
    }
  }

  public playVictory() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.22, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.6);
      });
    } catch {
      // Audio fallback silent
    }
  }

  public playTick() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Audio fallback silent
    }
  }
}

interface StudyDuelsProps {
  id?: string;
  onNavigateToScheduler?: () => void;
}

export const StudyDuels: React.FC<StudyDuelsProps> = ({
  id = 'study-duels',
  onNavigateToScheduler
}) => {
  // Screen views: 'lobby' | 'arena' | 'results' | 'history'
  const [currentScreen, setCurrentScreen] = useState<'lobby' | 'arena' | 'results' | 'history'>('lobby');

  // Match configurations
  const [selectedSubject, setSelectedSubject] = useState<string>('biology');
  const [selectedMode, setSelectedMode] = useState<DuelMode>('speed_blitz');
  const [selectedRival, setSelectedRival] = useState<PeerRival>(PEER_RIVALS[0]);
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Custom Peer Challenge Room
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [customRoomCode, setCustomRoomCode] = useState<string>('DUEL-7429');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isPeerSearching, setIsPeerSearching] = useState<boolean>(false);

  // Audio Engine instance
  const audioRef = useRef<DuelAudioEngine | null>(null);

  // Arena Live State
  const [activeQuestions, setActiveQuestions] = useState<DuelQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isQuestionAnswered, setIsQuestionAnswered] = useState<boolean>(false);

  // Live Scores & Metrics
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [rivalScore, setRivalScore] = useState<number>(0);
  const [playerStreak, setPlayerStreak] = useState<number>(0);
  const [maxPlayerStreak, setMaxPlayerStreak] = useState<number>(0);
  const [playerCorrectAnswers, setPlayerCorrectAnswers] = useState<number>(0);
  const [rivalCorrectAnswers, setRivalCorrectAnswers] = useState<number>(0);

  // Timing per question
  const maxQuestionTime = useMemo(() => {
    if (selectedMode === 'iron_precision') return 22;
    if (selectedMode === 'ebbinghaus_marathon') return 18;
    return 14; // speed blitz
  }, [selectedMode]);

  const [timeLeft, setTimeLeft] = useState<number>(maxQuestionTime);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [playerResponseTimes, setPlayerResponseTimes] = useState<number[]>([]);

  // Simulated Rival Live State
  const [rivalStatus, setRivalStatus] = useState<string>('در حال تحلیل سوال...');
  const [rivalAnsweredThisQuestion, setRivalAnsweredThisQuestion] = useState<boolean>(false);
  const [rivalIsCorrect, setRivalIsCorrect] = useState<boolean | null>(null);

  // History & Statistics state from localStorage
  const [duelsHistory, setDuelsHistory] = useState<DuelRecord[]>([]);

  // Sound preference initialization
  useEffect(() => {
    const savedSound = localStorage.getItem(DUEL_SOUND_STORAGE_KEY);
    const isEnabled = savedSound !== null ? savedSound === 'true' : true;
    setSoundEnabled(isEnabled);
    audioRef.current = new DuelAudioEngine(isEnabled);

    // Load duels history
    try {
      const storedHistory = localStorage.getItem(DUELS_HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setDuelsHistory(JSON.parse(storedHistory));
      }
    } catch {
      // storage read error fallback
    }
  }, []);

  // Update audio engine when sound toggled
  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    localStorage.setItem(DUEL_SOUND_STORAGE_KEY, String(nextVal));
    if (audioRef.current) {
      audioRef.current.setEnabled(nextVal);
    }
  };

  // Generate Room Code for peer invitation
  const generateNewRoomCode = () => {
    const code = 'DUEL-' + Math.floor(1000 + Math.random() * 9000);
    setCustomRoomCode(code);
  };

  const handleCopyInviteLink = () => {
    const link = `${window.location.origin}#${customRoomCode}`;
    navigator.clipboard?.writeText(link).catch(() => {});
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Check if user has custom topics from Ebbinghaus Scheduler queue
  const userQueueTopics = useMemo<EbbinghausTopicItem[]>(() => {
    try {
      const raw = localStorage.getItem(TOPICS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // fallback
    }
    return [];
  }, []);

  // Overall player stats across all duels
  const statsOverview = useMemo(() => {
    const total = duelsHistory.length;
    const wins = duelsHistory.filter(d => d.result === 'win').length;
    const totalXP = duelsHistory.reduce((acc, curr) => acc + curr.xpEarned, 0);
    const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
    const bestStreak = duelsHistory.reduce((max, d) => Math.max(max, d.playerScore), 0);
    return { total, wins, winRate, totalXP, bestStreak };
  }, [duelsHistory]);

  // Start Duel Arena
  const handleStartDuel = (customRival?: PeerRival) => {
    const rival = customRival || selectedRival;
    setSelectedRival(rival);

    // Pick questions from selected subject deck
    const deck = QUESTION_DECKS[selectedSubject] || QUESTION_DECKS.biology;
    // Shuffle and slice
    const shuffled = [...deck].sort(() => 0.5 - Math.random()).slice(0, questionCount);
    setActiveQuestions(shuffled);

    // Reset arena state
    setQuestionIndex(0);
    setSelectedOption(null);
    setIsQuestionAnswered(false);
    setPlayerScore(0);
    setRivalScore(0);
    setPlayerStreak(0);
    setMaxPlayerStreak(0);
    setPlayerCorrectAnswers(0);
    setRivalCorrectAnswers(0);
    setPlayerResponseTimes([]);
    setTimeLeft(maxQuestionTime);
    setQuestionStartTime(Date.now());
    setRivalStatus(`${rival.name} در حال تمرکز...`);
    setRivalAnsweredThisQuestion(false);
    setRivalIsCorrect(null);

    setCurrentScreen('arena');
  };

  // Timer Countdown in Arena
  useEffect(() => {
    if (currentScreen !== 'arena' || isQuestionAnswered) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeExpired();
          return 0;
        }
        if (prev <= 4 && audioRef.current) {
          audioRef.current.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentScreen, isQuestionAnswered, questionIndex]);

  // Simulated Asynchronous Rival AI behavior
  useEffect(() => {
    if (currentScreen !== 'arena' || isQuestionAnswered) return;

    // Determine how many seconds rival will take based on rival averageSpeedSec
    const randomVariance = (Math.random() * 2 - 1); // -1s to +1s
    const targetLatencySec = Math.max(2, Math.min(maxQuestionTime - 1, selectedRival.averageSpeedSec + randomVariance));
    const delayMs = targetLatencySec * 1000;

    const timeout = setTimeout(() => {
      // Rival answers
      const isCorrect = Math.random() <= selectedRival.accuracyRate;
      setRivalAnsweredThisQuestion(true);
      setRivalIsCorrect(isCorrect);

      if (isCorrect) {
        const speedBonus = Math.max(1, Math.round((maxQuestionTime - targetLatencySec) * 7));
        const pts = 100 + speedBonus;
        setRivalScore(s => s + pts);
        setRivalCorrectAnswers(c => c + 1);
        setRivalStatus(`${selectedRival.name} پاسخ صحیح داد! (+${pts})`);
      } else {
        setRivalStatus(`${selectedRival.name} دچار خطای بازیابی شد!`);
      }
    }, delayMs);

    return () => clearTimeout(timeout);
  }, [currentScreen, questionIndex, isQuestionAnswered, selectedRival, maxQuestionTime]);

  // Handle Player Answer Selection
  const handleSelectOption = (optionIndex: number) => {
    if (isQuestionAnswered) return;

    const currentQ = activeQuestions[questionIndex];
    if (!currentQ) return;

    setIsQuestionAnswered(true);
    setSelectedOption(optionIndex);

    const elapsedSeconds = Math.max(0.5, (Date.now() - questionStartTime) / 1000);
    setPlayerResponseTimes(prev => [...prev, elapsedSeconds]);

    const isCorrect = optionIndex === currentQ.correctIndex;

    if (isCorrect) {
      const nextStreak = playerStreak + 1;
      setPlayerStreak(nextStreak);
      setMaxPlayerStreak(prev => Math.max(prev, nextStreak));
      setPlayerCorrectAnswers(prev => prev + 1);

      // Speed multiplier
      const timeRemainingPercent = Math.max(0, (timeLeft / maxQuestionTime));
      const speedPoints = Math.round(timeRemainingPercent * 80);
      const streakMultiplier = nextStreak > 2 ? 1.5 : 1.0;
      const pointsWon = Math.round((100 + speedPoints) * streakMultiplier);

      setPlayerScore(prev => prev + pointsWon);

      if (nextStreak >= 3 && audioRef.current) {
        audioRef.current.playCombo();
      } else if (audioRef.current) {
        audioRef.current.playCorrect();
      }
    } else {
      setPlayerStreak(0);
      if (audioRef.current) {
        audioRef.current.playWrong();
      }
    }
  };

  // Handle Time Expired without answer
  const handleTimeExpired = () => {
    if (isQuestionAnswered) return;
    setIsQuestionAnswered(true);
    setSelectedOption(-1); // No option selected
    setPlayerStreak(0);
    setPlayerResponseTimes(prev => [...prev, maxQuestionTime]);
    if (audioRef.current) {
      audioRef.current.playWrong();
    }
  };

  // Advance to Next Question or Finalize
  const handleNextQuestion = () => {
    if (questionIndex + 1 < activeQuestions.length) {
      setQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsQuestionAnswered(false);
      setTimeLeft(maxQuestionTime);
      setQuestionStartTime(Date.now());
      setRivalAnsweredThisQuestion(false);
      setRivalIsCorrect(null);
      setRivalStatus(`${selectedRival.name} در حال تمرکز...`);
    } else {
      // Finish Duel
      finalizeDuel();
    }
  };

  // Finalize Match and Update Ebbinghaus LocalStorage Stats
  const finalizeDuel = () => {
    const totalQ = activeQuestions.length;
    const playerAcc = Math.round((playerCorrectAnswers / totalQ) * 100);
    const rivalAcc = Math.round((rivalCorrectAnswers / totalQ) * 100);

    const avgSpeed = playerResponseTimes.length > 0
      ? Number((playerResponseTimes.reduce((a, b) => a + b, 0) / playerResponseTimes.length).toFixed(1))
      : 5.0;

    let result: 'win' | 'loss' | 'tie' = 'loss';
    if (playerScore > rivalScore) {
      result = 'win';
      if (audioRef.current) audioRef.current.playVictory();
    } else if (playerScore === rivalScore) {
      result = 'tie';
    }

    const xpEarned = Math.round(playerScore * 0.4 + (result === 'win' ? 120 : 40));

    const newRecord: DuelRecord = {
      id: 'duel_' + Date.now(),
      timestamp: new Date().toISOString(),
      rivalName: selectedRival.name,
      rivalTitle: selectedRival.title,
      mode: selectedMode,
      subject: selectedSubject,
      playerScore,
      rivalScore,
      playerAccuracy: playerAcc,
      rivalAccuracy: rivalAcc,
      playerAvgSpeed: avgSpeed,
      result,
      xpEarned
    };

    const updatedHistory = [newRecord, ...duelsHistory].slice(0, 30);
    setDuelsHistory(updatedHistory);
    try {
      localStorage.setItem(DUELS_HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));

      // Also integrate with Ebbinghaus Review Stats
      const existingReviewStatsRaw = localStorage.getItem(REVIEW_STATS_STORAGE_KEY);
      const reviewStats: EbbinghausReviewStats = existingReviewStatsRaw
        ? JSON.parse(existingReviewStatsRaw)
        : DEFAULT_REVIEW_STATS;

      const currentDay = getPersianDayName();
      const updatedReviewed = reviewStats.totalReviewed + playerCorrectAnswers;
      const updatedForgotten = reviewStats.totalForgotten + (totalQ - playerCorrectAnswers);

      const updatedWeeklyHistory = reviewStats.weeklyHistory.map(item => {
        if (item.day === currentDay) {
          const newReviewed = item.reviewed + playerCorrectAnswers;
          const newForgotten = item.forgotten + (totalQ - playerCorrectAnswers);
          const totalRev = newReviewed + newForgotten;
          const retentionRate = totalRev > 0 ? Math.round((newReviewed / totalRev) * 100) : item.retentionRate;
          return {
            ...item,
            reviewed: newReviewed,
            forgotten: newForgotten,
            retentionRate
          };
        }
        return item;
      });

      const updatedReviewStats: EbbinghausReviewStats = {
        ...reviewStats,
        totalReviewed: updatedReviewed,
        totalForgotten: updatedForgotten,
        weeklyHistory: updatedWeeklyHistory
      };

      localStorage.setItem(REVIEW_STATS_STORAGE_KEY, JSON.stringify(updatedReviewStats));
    } catch {
      // storage error fallback
    }

    setCurrentScreen('results');
  };

  const subjectNames: Record<string, string> = {
    biology: 'زیست‌شناسی جامع',
    chemistry: 'شیمی تحلیلی و کنکور',
    physics: 'فیزیک مفهومی و دینامیک',
    math: 'ریاضیات و حسابان'
  };

  const modeDescriptions: Record<DuelMode, { title: string; subtitle: string; icon: any }> = {
    speed_blitz: {
      title: 'سرعت و دقت (Speed Blitz)',
      subtitle: '۱۴ ثانیه برای هر سوال؛ پاسخ سریع‌تر ضریب امتیاز زنجیره‌ای (Streak) می‌دهد.',
      icon: Zap
    },
    iron_precision: {
      title: 'دقت مطلق و تسلط (Iron Precision)',
      subtitle: '۲۲ ثانیه زمان؛ تمرکز ۱۰۰٪ روی بازیابی بدون خطا با تله‌های مفهومی.',
      icon: Target
    },
    ebbinghaus_marathon: {
      title: 'ماراتن ۵ چرخه ابینگهاوس',
      subtitle: '۵ سوال متوالی از چرخه‌های ۱ تا ۵ (۲۴ ساعت تا ۳۰ روز تثبیت دندریتی).',
      icon: Brain
    }
  };

  return (
    <section id={id} className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 bg-slate-950 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Swords className="w-3.5 h-3.5" />
              <span>میدان چالش و یادگیری مشارکتی</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>دوئل‌های مطالعاتی هم‌کلاسی</span>
              <span className="text-amber-400 text-lg font-mono font-medium">(Study Duels)</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              با هم‌کلاسی‌ها و رقبای کنکوری در بازیابی فعال مباحث ابینگهاوس مسابقه دهید؛ سرعت بازیابی سیناپسی و دقت علمی خود را محک بزنید و امتیاز XP کسب کنید.
            </p>
          </div>

          {/* Quick HUD Navigation & Sound Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleToggleSound}
              title={soundEnabled ? 'صدا فعال است' : 'صدا قطع است'}
              className={`p-2.5 rounded-xl border transition-all text-xs flex items-center gap-1.5 cursor-pointer ${
                soundEnabled
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {currentScreen !== 'lobby' && (
              <button
                onClick={() => setCurrentScreen('lobby')}
                className="px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>لابی دوئل</span>
              </button>
            )}

            <button
              onClick={() => setCurrentScreen(currentScreen === 'history' ? 'lobby' : 'history')}
              className={`px-3.5 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                currentScreen === 'history'
                  ? 'bg-amber-400 text-slate-950 font-bold border-amber-400 shadow-sm shadow-amber-500/20'
                  : 'bg-slate-900/90 border-slate-800 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>کارنامه دوئل‌ها ({statsOverview.total})</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            SCREEN 1: LOBBY (SETUP, RIVAL SELECT, TOPIC SELECT)
           ========================================================================= */}
        {currentScreen === 'lobby' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Stats Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">پیروزی‌های شما</div>
                  <div className="text-xl font-bold text-white tabular-nums">
                    {statsOverview.wins} <span className="text-xs text-slate-400 font-normal">از {statsOverview.total}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">نرخ برد (Win Rate)</div>
                  <div className="text-xl font-bold text-emerald-400 tabular-nums">
                    {statsOverview.winRate}٪
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">بیشترین امتیاز</div>
                  <div className="text-xl font-bold text-white tabular-nums">
                    {statsOverview.bestStreak > 0 ? statsOverview.bestStreak : '---'}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">مجموع XP دوئل</div>
                  <div className="text-xl font-bold text-cyan-300 tabular-nums">
                    {statsOverview.totalXP} XP
                  </div>
                </div>
              </div>
            </div>

            {/* Selection Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Rivals Selection */}
              <div className="lg:col-span-2 space-y-6">
                {/* Step 1: Rival Selection */}
                <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-bold text-base">
                      <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black">۱</span>
                      <span>انتخاب حریف مطالعاتی (Peer Rival)</span>
                    </div>

                    <button
                      onClick={() => {
                        generateNewRoomCode();
                        setShowInviteModal(true);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>دعوت دوست واقعی با کد اتاق</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {PEER_RIVALS.map(rival => {
                      const isSelected = selectedRival.id === rival.id;
                      return (
                        <div
                          key={rival.id}
                          onClick={() => setSelectedRival(rival)}
                          className={`relative p-4 rounded-2xl border transition-all cursor-pointer group text-right ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/30'
                              : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-3 left-3 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}

                          <div className="flex items-start gap-3">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${rival.avatarBg} border flex items-center justify-center text-2xl shrink-0`}>
                              {rival.avatar}
                            </div>
                            <div className="space-y-1 pr-1 flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="text-white font-bold text-sm">{rival.name}</h4>
                                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                                  {rival.rank}
                                </span>
                              </div>
                              <p className="text-[11px] text-amber-400/90 font-medium">{rival.title}</p>
                              <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 pt-0.5">{rival.description}</p>
                            </div>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                            <span>میانگین سرعت: <strong className="text-slate-200">{rival.averageSpeedSec}s</strong></span>
                            <span>دقت بازیابی: <strong className="text-emerald-400">{Math.round(rival.accuracyRate * 100)}٪</strong></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Subject & Deck Selection */}
                <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-bold text-base">
                      <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black">۲</span>
                      <span>مبحث و منبع سوالات دوئل</span>
                    </div>

                    {userQueueTopics.length > 0 && (
                      <span className="text-xs text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        همگام با {userQueueTopics.length} مبحث زمان‌بندی شما
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.entries(subjectNames).map(([key, name]) => {
                      const isSelected = selectedSubject === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setSelectedSubject(key)}
                          className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-400/10 border-amber-400/60 text-amber-300 ring-1 ring-amber-400/30'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <div className="text-xs font-bold">{name}</div>
                          <div className="text-[10px] text-slate-400 mt-1">۵ چرخه ابینگهاوس</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Mode, Settings & Launch Button */}
              <div className="space-y-6">
                {/* Step 3: Game Mode */}
                <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center gap-2 text-white font-bold text-base">
                    <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black">۳</span>
                    <span>قالب و قوانین دوئل</span>
                  </div>

                  <div className="space-y-3">
                    {(Object.keys(modeDescriptions) as DuelMode[]).map(modeKey => {
                      const modeInfo = modeDescriptions[modeKey];
                      const IconComponent = modeInfo.icon;
                      const isSelected = selectedMode === modeKey;
                      return (
                        <div
                          key={modeKey}
                          onClick={() => setSelectedMode(modeKey)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                            }`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                              <h5 className={`text-xs font-bold ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                                {modeInfo.title}
                              </h5>
                              <p className="text-[11px] text-slate-400 leading-snug">
                                {modeInfo.subtitle}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Question Count selector */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <label className="text-xs text-slate-400 block mb-2 font-medium">تعداد تست‌های دوئل:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[5, 8, 10].map(cnt => (
                        <button
                          key={cnt}
                          onClick={() => setQuestionCount(cnt)}
                          className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            questionCount === cnt
                              ? 'bg-amber-400 text-slate-950 shadow-sm'
                              : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {cnt} سوال
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Big Launch Action Card */}
                <div className="bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 text-center space-y-4 shadow-xl">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 text-2xl shadow-inner">
                    <Swords className="w-7 h-7" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">آماده برای ورود به میدان؟</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      شما در برابر <strong>{selectedRival.name}</strong> در مبحث <strong>{subjectNames[selectedSubject]}</strong>.
                    </p>
                  </div>

                  <button
                    onClick={() => handleStartDuel()}
                    className="w-full py-3.5 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 group"
                  >
                    <span>آغاز دوئل بازیابی فعال</span>
                    <Play className="w-4 h-4 fill-slate-950 group-hover:translate-x-[-2px] transition-transform" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>تأثیر مستقیم بر پایداری حافظه در ابینگهاوس</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 2: ARENA (LIVE ACTIVE RECALL BATTLE HUD)
           ========================================================================= */}
        {currentScreen === 'arena' && activeQuestions.length > 0 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Split HUD: Player vs Rival */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* User HUD (Right in RTL) */}
                <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg shrink-0">
                    شما
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">دانش‌آموز (شما)</span>
                      {playerStreak >= 2 && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full animate-pulse">
                          <Flame className="w-3 h-3 text-amber-400" />
                          <span>ضریب {playerStreak}x</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline justify-between">
                      <div className="text-xl font-black text-amber-400 tabular-nums">
                        {playerScore} <span className="text-[10px] text-slate-400 font-normal">XP</span>
                      </div>
                      <div className="text-xs text-emerald-400 font-semibold tabular-nums">
                        {playerCorrectAnswers} درست
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Match Stats & VS Badge */}
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono">
                    <span>سوال {questionIndex + 1} از {activeQuestions.length}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-amber-400">{activeQuestions[questionIndex]?.cycleLabel}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center text-xs font-black shadow-inner">
                      VS
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    مبحث: <span className="text-white font-medium">{activeQuestions[questionIndex]?.topic}</span>
                  </div>
                </div>

                {/* Rival HUD (Left in RTL) */}
                <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${selectedRival.avatarBg} border flex items-center justify-center text-2xl shrink-0`}>
                    {selectedRival.avatar}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{selectedRival.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{selectedRival.rank}</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <div className="text-xl font-black text-cyan-300 tabular-nums">
                        {rivalScore} <span className="text-[10px] text-slate-400 font-normal">XP</span>
                      </div>
                      <div className="text-xs text-cyan-400 font-semibold tabular-nums">
                        {rivalCorrectAnswers} درست
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Rival Live Status Bar */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 px-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                  <span>وضعیت زنده حریف: <strong className="text-slate-200">{rivalStatus}</strong></span>
                </div>

                {rivalAnsweredThisQuestion && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    rivalIsCorrect ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {rivalIsCorrect ? 'پاسخ حریف صحیح بود' : 'پاسخ حریف نادرست بود'}
                  </span>
                )}
              </div>
            </div>

            {/* Timer Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Timer className="w-3.5 h-3.5 text-amber-400" />
                  <span>زمان باقی‌مانده بازیابی سیناپسی:</span>
                </span>
                <span className={`font-bold tabular-nums text-sm ${
                  timeLeft <= 4 ? 'text-rose-400 animate-pulse' : timeLeft <= 8 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {timeLeft} ثانیه
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                    timeLeft <= 4
                      ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                      : timeLeft <= 8
                      ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                      : 'bg-emerald-400'
                  }`}
                  style={{ width: `${(timeLeft / maxQuestionTime) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            {activeQuestions[questionIndex] && (
              <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
                {/* Question Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-xl">
                      {activeQuestions[questionIndex].subject}
                    </span>
                    <span className="text-xs text-slate-300 bg-slate-800 px-3 py-1 rounded-xl font-medium">
                      {activeQuestions[questionIndex].topic}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Brain className="w-3.5 h-3.5 text-amber-400" />
                    <span>تست استاندارد ابینگهاوس</span>
                  </div>
                </div>

                {/* Question Prompt */}
                <div className="space-y-3">
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed select-none">
                    {activeQuestions[questionIndex].question}
                  </h3>
                </div>

                {/* 4 Interactive Option Choices */}
                <div className="grid grid-cols-1 gap-3.5 pt-2">
                  {activeQuestions[questionIndex].options.map((opt, oIdx) => {
                    const isCorrect = oIdx === activeQuestions[questionIndex].correctIndex;
                    const isSelected = selectedOption === oIdx;

                    let btnStyle = 'bg-slate-950/70 border-slate-800 text-slate-200 hover:border-amber-400/50 hover:bg-slate-900/80';
                    if (isQuestionAnswered) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200 ring-2 ring-rose-500/30';
                      } else {
                        btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={isQuestionAnswered}
                        onClick={() => handleSelectOption(oIdx)}
                        className={`p-4 rounded-2xl border text-right transition-all flex items-center justify-between gap-4 cursor-pointer select-none group ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                            isQuestionAnswered && isCorrect
                              ? 'bg-emerald-500 text-slate-950'
                              : isQuestionAnswered && isSelected && !isCorrect
                              ? 'bg-rose-500 text-white'
                              : 'bg-slate-800 text-slate-300 group-hover:bg-amber-400 group-hover:text-slate-950'
                          }`}>
                            {oIdx + 1}
                          </span>
                          <span className="text-sm font-medium leading-relaxed">{opt}</span>
                        </div>

                        {isQuestionAnswered && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        )}
                        {isQuestionAnswered && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Card after answer */}
                {isQuestionAnswered && (
                  <div className="mt-6 pt-6 border-t border-slate-800 space-y-4 animate-fadeIn">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                        <Info className="w-4 h-4" />
                        <span>تحلیل تشریحی و نکته کلیدی کنکور:</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {activeQuestions[questionIndex].explanation}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300/90 flex items-start gap-2.5">
                      <Brain className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>توصیه شناختی ابینگهاوس: </strong>
                        <span>{activeQuestions[questionIndex].cognitiveInsight}</span>
                      </div>
                    </div>

                    {/* Next Action Button */}
                    <div className="flex items-center justify-end pt-2">
                      <button
                        onClick={handleNextQuestion}
                        className="py-3 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                      >
                        <span>{questionIndex + 1 < activeQuestions.length ? 'سوال بعدی دوئل' : 'مشاهده نتایج نهایی و کارنامه'}</span>
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            SCREEN 3: RESULTS (HEAD-TO-HEAD COMPARISON & SCOREBOARD)
           ========================================================================= */}
        {currentScreen === 'results' && (
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            {/* Outcome Banner */}
            <div className={`p-8 rounded-3xl border text-center space-y-4 shadow-2xl relative overflow-hidden ${
              playerScore > rivalScore
                ? 'bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-900 border-amber-500/40'
                : playerScore === rivalScore
                ? 'bg-gradient-to-b from-cyan-500/20 via-slate-900 to-slate-900 border-cyan-500/40'
                : 'bg-gradient-to-b from-rose-500/20 via-slate-900 to-slate-900 border-rose-500/40'
            }`}>
              <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-950/80 border border-slate-700 flex items-center justify-center text-4xl shadow-xl">
                {playerScore > rivalScore ? '🏆' : playerScore === rivalScore ? '🤝' : '🎖️'}
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 uppercase tracking-wider">
                  نتیجه نهایی دوئل ابینگهاوس
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {playerScore > rivalScore
                    ? 'پیروزی درخشان شما! حافظه پایدار تثبیت شد'
                    : playerScore === rivalScore
                    ? 'تساوی نفس‌گیر در سرعت و دقت!'
                    : `پیروزی ${selectedRival.name} - فرصت عالی برای بازتنظیم چرخه مرور`}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
                  {playerScore > rivalScore
                    ? 'با بازیابی برق‌آسا و بدون خطا، سیناپس‌های حافظه شما در این مبحث با موفقیت به چرخه بعدی ارتقا یافتند.'
                    : 'مطالعه و بازیابی در شرایط رقابتی، هیپوکامپ را برای مواجهه با استرس جلسه کنکور سراسری آبدیده می‌کند.'}
                </p>
              </div>

              {/* Head-to-Head Comparison Card */}
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-4">
                <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-4 text-center space-y-1">
                  <div className="text-[11px] text-amber-400 font-bold">امتیاز شما</div>
                  <div className="text-3xl font-black text-white tabular-nums">{playerScore}</div>
                  <div className="text-[10px] text-emerald-400 font-medium">
                    {Math.round((playerCorrectAnswers / activeQuestions.length) * 100)}٪ دقت علمی
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
                  <div className="text-[11px] text-slate-400 font-bold">امتیاز {selectedRival.name}</div>
                  <div className="text-3xl font-black text-white tabular-nums">{rivalScore}</div>
                  <div className="text-[10px] text-cyan-400 font-medium">
                    {Math.round((rivalCorrectAnswers / activeQuestions.length) * 100)}٪ دقت علمی
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Head-to-Head Stats Breakdown */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChartIcon />
                <span>مقایسه فنی عملکرد در دوئل</span>
              </h4>

              <div className="space-y-3">
                {/* Accuracy */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>دقت در پاسخگویی:</span>
                    <span className="font-mono text-white font-bold">
                      شما {Math.round((playerCorrectAnswers / activeQuestions.length) * 100)}٪ vs {selectedRival.name} {Math.round((rivalCorrectAnswers / activeQuestions.length) * 100)}٪
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden flex">
                    <div
                      className="bg-amber-400 h-full"
                      style={{ width: `${(playerCorrectAnswers / activeQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Best Streak */}
                <div className="flex items-center justify-between text-xs py-2 border-t border-slate-800/80">
                  <span className="text-slate-400">بیشترین زنجیره بدون خطا (Max Streak):</span>
                  <span className="text-white font-bold font-mono">{maxPlayerStreak} سوال پیاپی</span>
                </div>

                {/* Spaced repetition memory impact */}
                <div className="flex items-center justify-between text-xs py-2 border-t border-slate-800/80">
                  <span className="text-slate-400">ثبت در داشبورد و نمودار ابینگهاوس:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{playerCorrectAnswers} مرور موفق + {activeQuestions.length - playerCorrectAnswers} نیاز به تکرار</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => handleStartDuel(selectedRival)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <RotateCcw className="w-4 h-4" />
                <span>دوئل مجدد با {selectedRival.name}</span>
              </button>

              <button
                onClick={() => setCurrentScreen('lobby')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>تغییر حریف یا مبحث در لابی</span>
              </button>

              {onNavigateToScheduler && (
                <button
                  onClick={onNavigateToScheduler}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-amber-300 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Clock className="w-4 h-4" />
                  <span>مشاهده جدول زمان‌بندی ابینگهاوس</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 4: DUELS HISTORY & HALL OF FAME
           ========================================================================= */}
        {currentScreen === 'history' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-amber-400" />
                  <span>کارنامه و تاریخچه دوئل‌های مطالعاتی</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  تمام مسابقات ثبت‌شده در حافظه مرورگر برای سنجش رشد سرعت و دقت شما.
                </p>
              </div>

              <button
                onClick={() => setCurrentScreen('lobby')}
                className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors cursor-pointer"
              >
                دوئل جدید ⚔️
              </button>
            </div>

            {duelsHistory.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
                <Swords className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-300">هنوز در هیچ دوئلی شرکت نکرده‌اید!</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  با آغاز نخستین دوئل، سرعت و دقت شما در برابر رقبای برتر سنجیده شده و کارنامه شما اینجا ثبت خواهد شد.
                </p>
                <button
                  onClick={() => setCurrentScreen('lobby')}
                  className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 transition-all cursor-pointer"
                >
                  شروع اولین دوئل
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {duelsHistory.map(record => (
                  <div
                    key={record.id}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        record.result === 'win'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : record.result === 'tie'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}>
                        {record.result === 'win' ? 'برد' : record.result === 'tie' ? 'تساوی' : 'باخت'}
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>در برابر {record.rivalName}</span>
                          <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                            {subjectNames[record.subject] || record.subject}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          امتیاز: <strong className="text-amber-400">{record.playerScore}</strong> در مقابل {record.rivalScore} • دقت: <strong className="text-emerald-400">{record.playerAccuracy}٪</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 text-slate-400 text-[11px] border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                      <span>+{record.xpEarned} XP</span>
                      <span className="text-slate-500">{new Date(record.timestamp).toLocaleDateString('fa-IR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            PEER INVITE MODAL (INVITE A REAL FRIEND WITH ROOM CODE)
           ========================================================================= */}
        {showInviteModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">دعوت مستقیم هم‌کلاسی به دوئل</h3>
                </div>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  کد اختصاصی اتاق را برای دوست یا هم‌کلاسی خود بفرستید تا بتواند سوالات یکسان ابینگهاوس را با شما تجربه کند:
                </p>

                {/* Room Code Display */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500">کد اتاق دوئل:</span>
                    <div className="text-2xl font-black text-amber-400 font-mono tracking-widest">
                      {customRoomCode}
                    </div>
                  </div>
                  <button
                    onClick={handleCopyInviteLink}
                    className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'کپی شد!' : 'کپی لینک'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="font-semibold text-slate-300">نحوه اجرای چالش دونفره:</div>
                  <div>• هر دو دانش‌آموز سوالات همسان با زمان‌سنج دقیق دریافت می‌کنند.</div>
                  <div>• پاسخ سریع‌تر امتیاز ترکیبی (Streak Multiplier) به همراه دارد.</div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setShowInviteModal(false);
                      // Start instant match with custom guest peer rival
                      const guestRival: PeerRival = {
                        id: 'guest_peer',
                        name: 'هم‌کلاسی مهمان (اتاق ' + customRoomCode + ')',
                        title: 'رقیب مستقیم چالشی',
                        avatar: '🤝',
                        avatarBg: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300',
                        rank: 'نبرد هم‌زمان',
                        accuracyRate: 0.85,
                        averageSpeedSec: 3.6,
                        style: 'پاسخگویی هم‌گام با سوالات اختصاصی اتاق',
                        description: 'حریف متصل شده از طریق لینک دعوت اتاق دوئل.'
                      };
                      handleStartDuel(guestRival);
                    }}
                    className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    <span>شروع دوئل در این اتاق</span>
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// Mini internal helper icon
function BarChartIcon() {
  return (
    <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}
