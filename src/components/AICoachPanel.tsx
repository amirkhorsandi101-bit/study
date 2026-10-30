import React, { useState } from 'react';
import { Send, Bot, Sparkles, Loader2, CheckCircle2, HelpCircle } from 'lucide-react';
import { SimpleMarkdown } from './SimpleMarkdown';

export const AICoachPanel: React.FC = () => {
  const [grade, setGrade] = useState<string>('دوره دوم متوسطه / کنکور');
  const [subject, setSubject] = useState<string>('ریاضی و فیزیک');
  const [mainChallenge, setMainChallenge] = useState<string>('توهم یادگیری و افت درصد در آزمون');
  const [studyHours, setStudyHours] = useState<string>('۵ الی ۷ ساعت');
  const [description, setDescription] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick preset struggles
  const presets = [
    'ساعت‌ها درسنامه رو می‌خونم ولی سر حل تست دست و پام می‌لرزه و هیچی یادم نمیاد.',
    'روزی ۷ ساعت مطالعه دارم اما درصدهام زیر ۳۰٪ است و خیلی سریع مطالب رو فراموش می‌کنم.',
    'تا می‌شینم پای درس، ذهنم میره سمت گوشی و آینده و عذاب وجدان شدید می‌گیرم.',
    'برنامه ریزی می‌کنم ولی با اولین عقب‌افتادگی کل روز رو تعطیل می‌کنم و کلافه میشم.'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          grade,
          subject,
          mainChallenge,
          studyHours,
          description: description.trim() || 'دروس را می‌خوانم اما سر آزمون احساس سردرگمی دارم.'
        })
      });

      if (res.status === 429) {
        setErrorMessage('درخواست‌ها زیاد بود. یک دقیقه صبر کن و دوباره امتحان کن.');
        return;
      }
      if (!res.ok) {
        throw new Error('خطا در برقراری ارتباط با سامانه تحلیل.');
      }

      const data = await res.json();
      setAnalysisResult(data.analysis);
    } catch (err: any) {
      console.error(err);
      setErrorMessage('ارتباط با سرور برقرار نشد. اینترنت را بررسی کن و دوباره امتحان کن.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="coach" className="py-20 px-6 max-w-4xl mx-auto border-t border-slate-800/80">
      {/* Header */}
      <div className="mb-10 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs text-amber-400 font-semibold tracking-wide">
          <span>مشاوره و عارضه‌یابی هوشمند</span>
          <span aria-hidden="true">/</span>
          <span>پروتکل اختصاصی برای شرایط شما</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          تحلیل پرونده تحصیلی با هوش مصنوعی و علوم اعصاب
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          مشخصات و درد اصلی مطالعه خود را شرح دهید تا یک برنامه مداخله شناختی ویژه برای درس و وضعیت شما تدوین شود.
        </p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Grade */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">مقطع تحصیلی:</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="دوره اول متوسطه (هفتم تا نهم)">دوره اول متوسطه (هفتم تا نهم)</option>
                <option value="دوره دوم متوسطه / کنکور">دوره دوم متوسطه / کنکور سراسری</option>
                <option value="تیزهوشان و المپیاد علمی">تیزهوشان و المپیاد علمی</option>
                <option value="دانشجویی / آزمون‌های تخصصی">دانشجویی / آزمون‌های تخصصی</option>
              </select>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">درس چالش‌برانگیز اصلی:</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="ریاضی و هندسه و حسابان">ریاضی، هندسه و حسابان</option>
                <option value="فیزیک مفهومی و حل مسئله">فیزیک مفهومی و حل مسئله</option>
                <option value="زیست‌شناسی و حفظیات مفهومی">زیست‌شناسی و ترکیبی</option>
                <option value="شیمی (مسائل و مفاهیم)">شیمی (مسائل و مفاهیم)</option>
                <option value="ادبیات، عربی و زبان انگلیسی">ادبیات، عربی و زبان انگلیسی</option>
                <option value="علوم انسانی و فلسفه و منطق">علوم انسانی، فلسفه و منطق</option>
              </select>
            </div>

            {/* Main Challenge */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">چالش و مشکل اساسی:</label>
              <select
                value={mainChallenge}
                onChange={(e) => setMainChallenge(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="توهم یادگیری و افت درصد در آزمون">توهم یادگیری و افت درصد در آزمون</option>
                <option value="اهمال‌کاری، فرار از شروع و اعتیاد به گوشی">اهمال‌کاری، فرار از شروع و اعتیاد به گوشی</option>
                <option value="فراموشی سریع مطالب بعد از یک هفته">فراموشی سریع مطالب بعد از یک هفته</option>
                <option value="کمال‌گرایی و بهم ریختن سریع برنامه‌ریزی">کمال‌گرایی و بهم ریختن سریع برنامه‌ریزی</option>
                <option value="خستگی مزمن، خمیازه و خواب‌آلودگی پای کتاب">خستگی مزمن، خمیازه و خواب‌آلودگی پای کتاب</option>
              </select>
            </div>

            {/* Study Hours */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">میانگین ساعت مطالعه روزانه فعلی:</label>
              <select
                value={studyHours}
                onChange={(e) => setStudyHours(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="کمتر از ۳ ساعت">کمتر از ۳ ساعت در روز</option>
                <option value="۳ تا ۵ ساعت">۳ تا ۵ ساعت در روز</option>
                <option value="۶ تا ۸ ساعت">۶ تا ۸ ساعت در روز</option>
                <option value="بیش از ۸ ساعت">بیش از ۸ ساعت در روز</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-300">شرح احساس و مشکل از زبان خودتان:</label>
              <span className="text-slate-500">یا یکی از نمونه‌های زیر را انتخاب کنید</span>
            </div>
            <textarea
              rows={3}
              placeholder="مثلاً: هر وقت فیزیک می‌خونم حس می‌کنم کاملاً بلدم ولی وقتی تست زمان‌دار می‌زنم درصد منفی میارم..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 leading-relaxed resize-none"
            />

            {/* Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setDescription(preset)}
                  className="text-[11px] text-slate-400 hover:text-amber-300 bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-right"
                >
                  {preset.slice(0, 48)}...
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>در حال تحلیل شناختی پرونده تحصیلی شما...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>دریافت تحلیل عصب‌شناختی و برنامه نجات</span>
              </>
            )}
          </button>
        </form>

        {errorMessage && (
          <div role="alert" className="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {errorMessage}
          </div>
        )}

        {/* Output Presentation */}
        {analysisResult && (
          <div className="mt-8 pt-6 border-t border-slate-800 space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
              <Bot className="w-4 h-4" />
              <span>پاسخ مشاور شناختی و برنامه اقدام اختصاصی:</span>
            </div>

            <div className="bg-slate-950 rounded-xl p-6 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
              <SimpleMarkdown text={analysisResult} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
