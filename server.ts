process.env.DISABLE_HMR = 'true';

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API route for AI Study Diagnosis & Personalized Strategy
app.post('/api/diagnose', async (req, res) => {
  try {
    const { grade, subject, mainChallenge, studyHours, description } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return high quality structured cognitive advice fallback if API key is not present
      return res.json({
        analysis: generateLocalDiagnosticAdvice(grade, subject, mainChallenge, studyHours, description),
        source: 'local_expert'
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
شما یک دانشمند علوم اعصاب شناختی و برترین مشاور تحصیلی با رویکرد یادگیری مبتنی بر شواهد علمی (Evidence-Based Learning) هستید.
یک دانش‌آموز ایرانی با مشخصات زیر به دنبال ریشه‌یابی و حل مشکل اساسی خود در درس خواندن است:

- مقطع تحصیلی: ${grade || 'نامشخص'}
- درس یا مبحث مورد چالش: ${subject || 'عمومی'}
- چالش اصلی انتخابی: ${mainChallenge || 'افت تمرکز و عدم بازدهی'}
- میانگین ساعت مطالعه روزانه: ${studyHours || '۳ تا ۵'} ساعت
- شرح دقیق مشکل از زبان دانش‌آموز: "${description || 'توضیحی ثبت نشده'}"

وظیفه شما:
یک تحلیل عمیق، انگیزه‌بخش و کاملاً کاربردی با ساختار زیر به زبان فارسی سلیس و علمی ارائه دهید:
۱. **ریشه‌یابی عصبی-شناختی (چرا این اتفاق می‌افتد؟)**: توضیح دقیق مکانیزم مغز (مثلاً توهم تسلط، آمیگدال و اهمال‌کاری، یا سرریز حافظه کاری).
۲. **۳ خطای رایج که باید فوراً متوقف کند**: رفتارهایی که ناخواسته وقتش را هدر می‌دهد (مثل روخوانی مکرر یا نگاه به گوشی).
۳. **پروتکل نجات ۳ مرحله‌ای برای این هفته**: راهکار گام به گام و اجرایی همراه با زمان‌بندی (مثلاً متد Blurting، تست بدون نگاه به جواب، یا بلوک‌های ۲۵ دقیقه‌ای).
۴. **تکنیک اختصاصی برای درس ${subject || 'مورد نظر'}**: یک روش بازیابی فعال مناسب همین درس.

لطفاً از جملات کلیشه‌ای و مبهم خودداری کنید و راهکارهای ملموس و شگفت‌انگیز بدهید.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    const text = response.text || '';
    return res.json({
      analysis: text,
      source: 'gemini'
    });
  } catch (err: any) {
    console.error('Error in /api/diagnose:', err);
    // Graceful fallback to expert response
    const { grade, subject, mainChallenge, studyHours, description } = req.body || {};
    return res.json({
      analysis: generateLocalDiagnosticAdvice(grade, subject, mainChallenge, studyHours, description),
      source: 'local_expert',
      note: 'پاسخ توسط موتور تحلیل شناختی محلی تولید شد.'
    });
  }
});

// Local cognitive rule-based advice generator for instantaneous, reliable response
function generateLocalDiagnosticAdvice(
  grade: string,
  subject: string,
  mainChallenge: string,
  hours: string,
  desc: string
): string {
  return `### ریشه‌یابی تخصصی و تحلیل شناختی مشکل شما

**مقطع و درس مورد تحلیل:** ${grade || 'دوره متوسطه'} | درس: **${subject || 'مفاهیم تحلیلی'}**  
**چالش ریشه‌ای شناسایی شده:** ${mainChallenge || 'توهم یادگیری و فرار از بازیابی فعال'}

---

#### ۱. مکانیزم عصبی-شناختی پنهان (چرا این اتفاق می‌افتد؟)
مغز انسان برای بقا برنامه‌ریزی شده تا حداقل انرژی گلوکز را مصرف کند. هنگامی که یک مبحث را بارها روخوانی می‌کنید یا زیر خطوط را با هایلایتر رنگی می‌کنید، پدیده‌ای به نام **«توهم تسلط» (Illusion of Fluency)** در لوب گیجگاهی رخ می‌دهد: متن برای چشمان شما «آشنا» به نظر می‌رسد، اما این اطلاعات در سیناپس‌های حافظه بلندمدت رمزگذاری (Encoding) نشده است. 
سر جلسه آزمون که کتاب بسته است و مغز باید داده را از صفر **بازیابی (Retrieval)** کند، اتصال عصبی برقرار نمی‌شود و احساس گیجی می‌کنید.

#### ۲. سه خطای مخرب که باید از همین امروز متوقف شوند:
1. **روخوانی مکرر جزوه و درسنامه بدون پرسش از خود:** روخوانی صرف، کم‌بازده‌ترین شیوه مطالعه در تمام آزمایش‌های عصب‌شناختی است.
2. **نگاه فوری به پاسخنامه تست‌ها:** دیدن راه‌حل قبل از ۱۰ دقیقه تقلا کردن، توهم یادگیری را تشدید می‌کند.
3. **تغییر جهت توجه به موبایل (Switch-Cost Effect):** حتی چک کردن ۲ ثانیه‌ای یک پیام، تمرکز عمیق مغز را تا ۲۰ دقیقه با پسماند شناختی مسموم می‌کند.

#### ۳. پروتکل عملیاتی ۳ مرحله‌ای برای تغییر بازی:
- **گام اول (قانون برگه سفید یا Blurting):** بعد از خواندن هر بخش ۲ صفحه‌ای، کتاب را کاملاً ببندید و روی یک کاغذ سفید خالی، هر آنچه فهمیدید را بدون نگاه به کتاب بنویسید یا نمودار درختی رسم کنید. خطاهای شما بلافاصله آشکار می‌شوند.
- **گام دوم (بلوک‌های تمرکز ۴۵ دقیقه‌ای + ۲ دقیقه بازیابی):** ۴۵ دقیقه با گوشی در حالت پرواز و در اتاق دیگر مطالعه کنید. در پایان پارت، ۲ دقیقه بدون حرکت بنشینید و کلیدواژه‌های اصلی را در ذهن مرور کنید.
- **گام سوم (چرخه طلایی مرور فاصله‌دار):** تست‌های نشان‌دار را در روز سوم و روز دهم بدون مطالعه مجدد درسنامه دوباره حل کنید تا اثر منحنی ابینگهاوس معکوس شود.

#### ۴. فرمول اختصاصی برای پیشرفت در درس ${subject || 'مورد نظر'}:
برای این درس، **نسبت مطالعه به تست باید ۳۰ به ۷۰ باشد**. به جای اینکه ۳ ساعت درسنامه بخوانید و نیم ساعت تست بزنید، ۱ ساعت مرور سریع ساختاری انجام دهید و ۲ ساعت تست آموزشی پوششی (حل کردن و بررسی دقیق تک تک گزینه‌ها) کار کنید. نتیجه این جهش را در اولین آزمون آزمایشی خود خواهید دید!`;
}

// Development or production middleware
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';
  const http = await import('http');
  const httpServer = http.createServer(app);

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
