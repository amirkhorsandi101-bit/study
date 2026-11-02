/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PlannerPdfModal.tsx: Professional A4 PDF Generator for Weekly & Bi-Weekly Study Plans
 * Produces high-resolution, print-ready PDF schedules formatted for Iranian high school curricula
 * with customizable scopes (Weekly 7-day vs. Bi-Weekly 14-day), print themes (Ink-friendly White vs. Dark Modern),
 * comprehensive timetables, KPI summaries, and advisor notes.
 */

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
  X,
  FileDown,
  Printer,
  Calendar,
  Clock,
  Sparkles,
  BookOpen,
  Target,
  CheckCircle2,
  AlertCircle,
  Loader2,
  GraduationCap,
  Layers,
  Award,
  Flame,
  Check,
  Zap
} from 'lucide-react';
import {
  ScheduledPlanItem,
  PlanCycleMode,
  WeekdayId,
  TimeSlotId,
  WEEKDAYS,
  TIME_SLOTS,
  STUDY_MODES
} from './StudyPlanner';
import { GradeLevel, AcademicTrackId, TRACKS_INFO, GRADES_LIST } from '../data/SubjectLibrary';
import { ACADEMIC_TRACKS_CONFIG, GRADE_LEVELS_CONFIG } from '../data/StudyPlanData';

export interface PlannerPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleItems: ScheduledPlanItem[];
  planCycleMode: PlanCycleMode;
  selectedGrade: GradeLevel;
  selectedTrack: AcademicTrackId;
  activeWeek?: 1 | 2;
}

export const PlannerPdfModal: React.FC<PlannerPdfModalProps> = ({
  isOpen,
  onClose,
  scheduleItems,
  planCycleMode,
  selectedGrade,
  selectedTrack,
  activeWeek = 1
}) => {
  // Scope selection: 'biweekly_full' | 'week1_only' | 'week2_only' | 'weekly_full'
  const [exportScope, setExportScope] = useState<'biweekly_full' | 'week1_only' | 'week2_only' | 'weekly_full'>(
    planCycleMode === 'biweekly' ? 'biweekly_full' : 'weekly_full'
  );

  // Print Theme: 'clean_print' (White background, ink-saver for A4 paper) vs 'dark_modern'
  const [printTheme, setPrintTheme] = useState<'clean_print' | 'dark_modern'>('clean_print');

  // Include advisor notes & motivational footer in PDF
  const [includeAdvisorNotes, setIncludeAdvisorNotes] = useState<boolean>(true);

  // Loading state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const printContainerRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  const trackInfo = ACADEMIC_TRACKS_CONFIG[selectedTrack] || {
    id: selectedTrack,
    name: selectedTrack === 'experimental' ? 'علوم تجربی' : selectedTrack === 'mathematics' ? 'ریاضی و فیزیک' : 'علوم انسانی',
    shortName: selectedTrack === 'experimental' ? 'تجربی' : selectedTrack === 'mathematics' ? 'ریاضی' : 'انسانی'
  };

  const gradeInfo = GRADE_LEVELS_CONFIG.find(g => g.grade === selectedGrade) || {
    grade: selectedGrade,
    label: `پایه ${selectedGrade}`
  };

  const todayPersian = new Date().toLocaleDateString('fa-IR');

  // Filter items based on selected scope
  const targetWeek1Items = (exportScope === 'biweekly_full' || exportScope === 'week1_only' || exportScope === 'weekly_full')
    ? scheduleItems.filter(i => (i.weekNumber || 1) === 1)
    : [];

  const targetWeek2Items = (exportScope === 'biweekly_full' || exportScope === 'week2_only')
    ? scheduleItems.filter(i => (i.weekNumber || 1) === 2)
    : [];

  const allExportItems = [...targetWeek1Items, ...targetWeek2Items];

  // Aggregate stats for the exported plan
  const totalMinutes = allExportItems.reduce((acc, i) => acc + i.durationMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const totalTargetTests = allExportItems.reduce((acc, i) => acc + i.targetTestCount, 0);
  const specializedMins = allExportItems.filter(i => i.isSpecialized).reduce((acc, i) => acc + i.durationMinutes, 0);
  const specializedPercent = totalMinutes > 0 ? Math.round((specializedMins / totalMinutes) * 100) : 0;

  // Handle PDF Generation using html2canvas & jsPDF
  const handleDownloadPdf = async () => {
    if (!printContainerRef.current) return;
    setIsGenerating(true);
    setStatusMessage('در حال آماده‌سازی و پردازش جداول برنامه...');

    try {
      // Ensure element styles and fonts are applied
      await new Promise(resolve => setTimeout(resolve, 300));

      const element = printContainerRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: printTheme === 'clean_print' ? '#ffffff' : '#020617'
      });

      setStatusMessage('در حال ساخت فایل PDF با کیفیت A4...');

      const imgData = canvas.toDataURL('image/jpeg', 0.96);

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 6;
      const targetWidth = pageWidth - margin * 2;
      const targetHeight = (canvas.height * targetWidth) / canvas.width;

      if (targetHeight <= pageHeight - margin * 2) {
        pdf.addImage(imgData, 'JPEG', margin, margin, targetWidth, targetHeight);
      } else {
        // Multi-page slicing for large 14-day tables
        let heightLeft = targetHeight;
        let position = margin;
        let page = 1;

        while (heightLeft > 0) {
          if (page > 1) {
            pdf.addPage('a4', 'landscape');
          }
          pdf.addImage(imgData, 'JPEG', margin, position, targetWidth, targetHeight);
          heightLeft -= (pageHeight - margin * 2);
          position -= (pageHeight - margin * 2);
          page++;
        }
      }

      const cycleLabel = exportScope === 'biweekly_full' ? '۱۴روزه_دوهفتگی' : 'هفتگی';
      const cleanDate = todayPersian.replace(/\//g, '-');
      const filename = `برنامه_مطالعاتی_راهبرد_${cycleLabel}_${trackInfo.shortName}_${gradeInfo.label.replace(/\s+/g, '_')}_${cleanDate}.pdf`;

      pdf.save(filename);
      setStatusMessage('فایل PDF با موفقیت ذخیره شد!');
      setTimeout(() => {
        setIsGenerating(false);
        setStatusMessage(null);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      setStatusMessage('خطایی در تولید فایل رخ داد. لطفاً مجدداً تلاش فرمایید.');
      setIsGenerating(false);
    }
  };

  // Direct Browser Print using the existing print optimization styles in index.css
  const handleBrowserPrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in"
      dir="rtl"
      role="dialog"
      aria-modal="true"
    >
      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold">
                <span>خروجی استاندارد چاپی A4</span>
                <span className="text-slate-500" aria-hidden="true">·</span>
                <span className="text-slate-400">PDF Study Schedule</span>
              </div>
              <h3 className="text-base font-black text-white mt-0.5">
                دریافت فایل PDF برنامه درسی
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isGenerating}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body & Controls */}
        <div className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          
          {/* Option 1: Scope of Export */}
          <div className="space-y-2">
            <label className="text-slate-300 font-bold flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>محدوده برنامه مورد نظر برای خروجی PDF:</span>
            </label>

            {planCycleMode === 'biweekly' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setExportScope('biweekly_full')}
                  className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                    exportScope === 'biweekly_full'
                      ? 'bg-amber-400/15 border-amber-400 text-amber-300 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="font-bold block text-xs">کل دوره ۲ هفتگی (۱۴ روز)</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">هفته اول + هفته دوم کامل</span>
                </button>

                <button
                  type="button"
                  onClick={() => setExportScope('week1_only')}
                  className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                    exportScope === 'week1_only'
                      ? 'bg-amber-400/15 border-amber-400 text-amber-300 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="font-bold block text-xs">فقط هفته اول (روز ۱ تا ۷)</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">آموزش، یادگیری و درسنامه</span>
                </button>

                <button
                  type="button"
                  onClick={() => setExportScope('week2_only')}
                  className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                    exportScope === 'week2_only'
                      ? 'bg-amber-400/15 border-amber-400 text-amber-300 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="font-bold block text-xs">فقط هفته دوم (روز ۸ تا ۱۴)</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">تست زمان‌دار و جمع‌بندی</span>
                </button>
              </div>
            ) : (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <span className="font-bold text-white">برنامه هفتگی کامل (۷ روز هفته)</span>
                <span className="text-amber-400 font-mono font-bold">{targetWeek1Items.length} پارت مطالعاتی</span>
              </div>
            )}
          </div>

          {/* Option 2: Print Theme Choice */}
          <div className="space-y-2">
            <label className="text-slate-300 font-bold flex items-center gap-1.5">
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>قالب گرافیکی خروجی PDF:</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPrintTheme('clean_print')}
                className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer flex items-start gap-3 ${
                  printTheme === 'clean_print'
                    ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-5 h-5 rounded-md bg-white border border-slate-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-xs">تم سفید مخصوص پرینت (پیشنهادی)</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    کنتراست بالا، زمینه سفید و حداقل مصرف جوهر پرینتر برای کاغذ A4
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPrintTheme('dark_modern')}
                className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer flex items-start gap-3 ${
                  printTheme === 'dark_modern'
                    ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-5 h-5 rounded-md bg-slate-900 border border-slate-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-xs">تم تیره مدرن راهبُرد</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    ظاهر شیک دیجیتال با گرادیانت‌های کهربایی و بنفش، مناسب تبلت و ارسال فایل
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Option 3: Advisor notes toggle */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <span className="text-slate-300">درج توصیه‌های طلایی مشاور و جدول مرور ابینگهاوس در انتهای برگه:</span>
            <input
              type="checkbox"
              checked={includeAdvisorNotes}
              onChange={(e) => setIncludeAdvisorNotes(e.target.checked)}
              className="accent-amber-400 w-4 h-4 cursor-pointer"
            />
          </div>

          {/* Quick Stats Card in Modal */}
          <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span>خلاصه برنامه انتخابی:</span>
              <span className="text-amber-400 font-bold">{allExportItems.length} پارت درسی</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px]">
              <div>
                <span className="text-slate-500 block">پایه و رشته:</span>
                <span className="font-bold text-white">{gradeInfo.label} · {trackInfo.shortName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">مجموع ساعات:</span>
                <span className="font-bold text-cyan-300 font-mono">{totalHours} ساعت</span>
              </div>
              <div>
                <span className="text-slate-500 block">تعداد تست هدف:</span>
                <span className="font-bold text-emerald-300 font-mono">{totalTargetTests} تست</span>
              </div>
            </div>
          </div>

          {statusMessage && (
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center gap-2 text-xs">
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>بهینه‌سازی شده با استایل‌های اختصاصی چاپ A4 (@media print)</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              انصراف
            </button>

            {/* Direct Browser Print / Save as PDF using existing print optimization styles */}
            <button
              type="button"
              onClick={handleBrowserPrint}
              disabled={isGenerating || allExportItems.length === 0}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-amber-400/50 font-bold text-xs flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 transition-all shadow-sm"
              title="چاپ یا ذخیره PDF با استایل بهینه‌شده چاپ مرورگر (@media print)"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>چاپ مستقیم / Save as PDF</span>
            </button>

            {/* Direct Download PDF via html2canvas & jsPDF */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGenerating || allExportItems.length === 0}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-l from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              title="دانلود مستقیم فایل PDF"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>در حال ساخت PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4 text-slate-950" />
                  <span>دانلود فایل PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          PRINTABLE CONTAINER USING EXISTING PRINT OPTIMIZATION STYLES (@media print)
          ===================================================================== */}
      <div
        id="printable-study-planner"
        ref={printContainerRef}
        style={{
          width: '1240px',
          minHeight: '850px'
        }}
        className={printTheme === 'clean_print' ? 'bg-white text-slate-900 p-8' : 'bg-slate-950 text-slate-100 p-8'}
        dir="rtl"
      >
        {/* Printable Header */}
        <div className={`pb-4 border-b-2 mb-6 flex items-center justify-between ${
          printTheme === 'clean_print' ? 'border-slate-800' : 'border-slate-700'
        }`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600">
              <span>سامانه هوشمند برنامه‌ریزی تحصیلی «راهبُرد»</span>
              <span aria-hidden="true">·</span>
              <span>Neuroscience Study Scheduling</span>
            </div>
            <h1 className="text-2xl font-black">
              برنامه مطالعاتی {exportScope === 'biweekly_full' ? 'جامع دو هفتگی ویژه آزمون‌های آزمایشی (۱۴ روز)' : exportScope === 'week2_only' ? 'هفته دوم آزمون (تست و جمع‌بندی)' : 'هفتگی (۷ روز)'}
            </h1>
            <p className="text-xs text-slate-500">
              پایه: {gradeInfo.label} · رشته: {trackInfo.name} · دوره آزمون‌های آزمایشی (قلم‌چی / ماز / سنجش)
            </p>
          </div>

          <div className="text-left space-y-1 text-xs">
            <div className="font-bold">
              تاریخ صدور: <span className="font-mono">{todayPersian}</span>
            </div>
            <div className="text-slate-500">
              کد داوطلب / شناسه برنامه: <span className="font-mono">RB-{selectedGrade}-{selectedTrack.slice(0, 3).toUpperCase()}-{Math.floor(1000 + Math.random() * 9000)}</span>
            </div>
          </div>
        </div>

        {/* KPI Strip */}
        <div className={`grid grid-cols-4 gap-3 mb-6 p-4 rounded-xl border text-xs ${
          printTheme === 'clean_print'
            ? 'bg-slate-50 border-slate-300'
            : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div>
            <span className="text-slate-500 block text-[11px]">مجموع ساعت مطالعه:</span>
            <span className="text-lg font-black font-mono text-cyan-600">{totalHours} ساعت</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">تعداد کل تست‌های هدف:</span>
            <span className="text-lg font-black font-mono text-emerald-600">{totalTargetTests} تست</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">تعداد کل پارت‌های درسی:</span>
            <span className="text-lg font-black font-mono text-amber-600">{allExportItems.length} پارت</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">سهم دروس اختصاصی:</span>
            <span className="text-lg font-black font-mono text-purple-600">{specializedPercent}٪ تخصصی</span>
          </div>
        </div>

        {/* -------------------------------------------------------------------
            TABLE 1: WEEK 1 TIMETABLE
            ------------------------------------------------------------------- */}
        {(exportScope === 'biweekly_full' || exportScope === 'week1_only' || exportScope === 'weekly_full') && (
          <div className="mb-8 space-y-2">
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-sm font-black flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>جدول زمان‌بندی {exportScope === 'biweekly_full' ? 'هفته اول (آموزش مفهومی و تست اولیه)' : 'هفتگی'}</span>
              </h2>
              <span className="text-xs text-slate-500">روزهای شنبه تا جمعه</span>
            </div>

            <table className={`w-full border-collapse text-[11px] border ${
              printTheme === 'clean_print' ? 'border-slate-300' : 'border-slate-800'
            }`}>
              <thead>
                <tr className={printTheme === 'clean_print' ? 'bg-slate-100 text-slate-800' : 'bg-slate-900 text-slate-200'}>
                  <th className="p-2 border border-slate-300 text-right w-24">روز</th>
                  {TIME_SLOTS.map(slot => (
                    <th key={slot.id} className="p-2 border border-slate-300 text-center">
                      <div>{slot.label}</div>
                      <div className="text-[10px] text-slate-500 font-normal font-mono">{slot.timeRange}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WEEKDAYS.map(w => {
                  const dayItems = targetWeek1Items.filter(i => i.day === w.id);

                  return (
                    <tr key={`print_w1_${w.id}`} className={printTheme === 'clean_print' ? 'hover:bg-slate-50' : 'hover:bg-slate-900/50'}>
                      <td className="p-2 border border-slate-300 font-bold bg-slate-50/50">
                        <div>{w.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal">روز {w.dayNumberW1}</div>
                      </td>

                      {TIME_SLOTS.map(slot => {
                        const itemsInSlot = dayItems.filter(i => i.slot === slot.id);

                        return (
                          <td key={slot.id} className="p-2 border border-slate-300 align-top min-h-[60px]">
                            {itemsInSlot.length === 0 ? (
                              <span className="text-slate-400 text-[10px] italic">استراحت / مرور آزاد</span>
                            ) : (
                              <div className="space-y-1.5">
                                {itemsInSlot.map(item => (
                                  <div
                                    key={item.id}
                                    className={`p-1.5 rounded border text-[10px] ${
                                      printTheme === 'clean_print'
                                        ? 'bg-amber-50/70 border-amber-200 text-slate-900'
                                        : 'bg-slate-900 border-slate-700 text-slate-200'
                                    }`}
                                  >
                                    <div className="font-bold flex items-center justify-between">
                                      <span className="truncate">{item.bookTitle}</span>
                                      <span className="font-mono text-[9px] text-slate-500">{item.durationMinutes}د</span>
                                    </div>
                                    <div className="text-[10px] truncate text-slate-700 dark:text-slate-300 font-medium">
                                      {item.topicName}
                                    </div>
                                    <div className="flex items-center justify-between text-[9px] text-slate-500 pt-0.5 border-t border-slate-200 dark:border-slate-800">
                                      <span>{item.targetTestCount > 0 ? `${item.targetTestCount} تست` : 'مطالعه تشریحی'}</span>
                                      <span>{item.studyMode === 'concept_learning' ? 'مفهومی' : item.studyMode === 'timed_test' ? 'زمان‌دار' : 'مرور'}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* -------------------------------------------------------------------
            TABLE 2: WEEK 2 TIMETABLE (BI-WEEKLY HORIZON)
            ------------------------------------------------------------------- */}
        {(exportScope === 'biweekly_full' || exportScope === 'week2_only') && (
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-sm font-black flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <span>جدول زمان‌بندی هفته دوم (تسلط، مرور، تست زمان‌دار و آزمون آزمایشی جمعه)</span>
              </h2>
              <span className="text-xs text-slate-500">روزهای ۸ تا ۱۴ چرخه آزمون</span>
            </div>

            <table className={`w-full border-collapse text-[11px] border ${
              printTheme === 'clean_print' ? 'border-slate-300' : 'border-slate-800'
            }`}>
              <thead>
                <tr className={printTheme === 'clean_print' ? 'bg-slate-100 text-slate-800' : 'bg-slate-900 text-slate-200'}>
                  <th className="p-2 border border-slate-300 text-right w-24">روز</th>
                  {TIME_SLOTS.map(slot => (
                    <th key={slot.id} className="p-2 border border-slate-300 text-center">
                      <div>{slot.label}</div>
                      <div className="text-[10px] text-slate-500 font-normal font-mono">{slot.timeRange}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WEEKDAYS.map(w => {
                  const dayItems = targetWeek2Items.filter(i => i.day === w.id);

                  return (
                    <tr key={`print_w2_${w.id}`} className={printTheme === 'clean_print' ? 'hover:bg-slate-50' : 'hover:bg-slate-900/50'}>
                      <td className="p-2 border border-slate-300 font-bold bg-slate-50/50">
                        <div>{w.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal">روز {w.dayNumberW2}</div>
                      </td>

                      {TIME_SLOTS.map(slot => {
                        const itemsInSlot = dayItems.filter(i => i.slot === slot.id);

                        return (
                          <td key={slot.id} className="p-2 border border-slate-300 align-top min-h-[60px]">
                            {itemsInSlot.length === 0 ? (
                              <span className="text-slate-400 text-[10px] italic">استراحت / مرور آزاد</span>
                            ) : (
                              <div className="space-y-1.5">
                                {itemsInSlot.map(item => (
                                  <div
                                    key={item.id}
                                    className={`p-1.5 rounded border text-[10px] ${
                                      printTheme === 'clean_print'
                                        ? 'bg-cyan-50/70 border-cyan-200 text-slate-900'
                                        : 'bg-slate-900 border-slate-700 text-slate-200'
                                    }`}
                                  >
                                    <div className="font-bold flex items-center justify-between">
                                      <span className="truncate">{item.bookTitle}</span>
                                      <span className="font-mono text-[9px] text-slate-500">{item.durationMinutes}د</span>
                                    </div>
                                    <div className="text-[10px] truncate text-slate-700 dark:text-slate-300 font-medium">
                                      {item.topicName}
                                    </div>
                                    <div className="flex items-center justify-between text-[9px] text-slate-500 pt-0.5 border-t border-slate-200 dark:border-slate-800">
                                      <span>{item.targetTestCount > 0 ? `${item.targetTestCount} تست` : 'تحلیل / مرور'}</span>
                                      <span>{item.studyMode === 'timed_test' ? 'تست زمان‌دار' : item.studyMode === 'ebbinghaus_review' ? 'مرور ابینگهاوس' : 'جمع‌بندی'}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Printable Footer & Advisor Guidelines */}
        {includeAdvisorNotes && (
          <div className={`p-4 rounded-xl border text-[10px] space-y-1.5 mt-4 ${
            printTheme === 'clean_print' ? 'bg-slate-50 border-slate-300 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <div className="font-bold text-xs text-amber-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>اصول علمی و توصیه‌های مشاوره‌ای راهبُرد برای اجرای این برنامه:</span>
            </div>
            <p className="leading-relaxed">
              ۱. <strong>قانون ایستگاه‌های مرور ابینگهاوس:</strong> در پایان هر پارت، ۵ دقیقه به یادآوری فعال (Active Recall) مباحث خوانده‌شده بدون نگاه به کتاب بپردازید.
              ۲. <strong>تست زمان‌دار در هفته دوم:</strong> در هفته منتهی به آزمون، حتماً تست‌ها را با در نظر گرفتن زمان استاندارد دفترچه کنکور سراسری پاسخ دهید.
              ۳. <strong>تحلیل کارنامه جمعه:</strong> عصر روز آزمون حتماً تمام خطاهای محاسباتی و ادراکی را در کتاب خودآموز مستندسازی کنید.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500">
              <span>تاییدیه مشاور تحصیلی: ........................................</span>
              <span>امضای دانش‌آموز: ........................................</span>
              <span>سامانه راهبُرد — Rahbord Academic Platform</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
