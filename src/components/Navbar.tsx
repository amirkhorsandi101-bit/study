/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Navbar.tsx: Main Top Navigation with Clean Tabbed Architecture
 * Provides distinct, beautifully styled tabs with semantic colors for each section,
 * responsive horizontal scrolling, and quick diagnostic action.
 */

import React from 'react';
import {
  Brain,
  Calendar,
  Clock,
  Zap,
  BookOpen,
  Compass,
  Flame,
  ArrowDownLeft,
  Sparkles
} from 'lucide-react';
import { MainAppTab } from './HomePage';

interface NavbarProps {
  activeTab: MainAppTab;
  onSelectTab: (tab: MainAppTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab }) => {
  const tabs: {
    id: MainAppTab;
    label: string;
    shortLabel: string;
    icon: React.ElementType;
    activeClass: string;
    badgeText?: string;
  }[] = [
    {
      id: 'home',
      label: 'صفحه اصلی و راهنما',
      shortLabel: 'خانه',
      icon: Brain,
      activeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-indigo-500/10'
    },
    {
      id: 'planner',
      label: 'پلنر درسی (سرفصل‌ها)',
      shortLabel: 'پلنر',
      icon: Calendar,
      activeClass: 'bg-amber-400 text-slate-950 border-amber-400 shadow-amber-400/20 font-black',
      badgeText: 'هفتگی / ۲ هفتگی'
    },
    {
      id: 'ebbinghaus',
      label: 'سیستم مرور ابینگهاوس',
      shortLabel: 'ابینگهاوس',
      icon: Clock,
      activeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-emerald-500/10'
    },
    {
      id: 'procrastination',
      label: 'تست و درمان اهمال‌کاری',
      shortLabel: 'اهمال‌کاری',
      icon: Zap,
      activeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-rose-500/10'
    },
    {
      id: 'toolkit',
      label: 'جعبه‌ابزار تمرکز و فاینمن',
      shortLabel: 'جعبه ابزار',
      icon: BookOpen,
      activeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-cyan-500/10'
    },
    {
      id: 'advisor',
      label: 'مشاور هوشمند و نمودارها',
      shortLabel: 'مشاور و آمار',
      icon: Compass,
      activeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/50 shadow-blue-500/10'
    },
    {
      id: 'gamification',
      label: 'عادات روزانه و دوئل',
      shortLabel: 'عادات و مسابقه',
      icon: Flame,
      activeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-purple-500/10'
    }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Wordmark */}
        <div className="flex items-center justify-between gap-4">
          <div 
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-500 to-cyan-400 p-[1.5px] shadow-md shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-300 group-hover:text-white transition-colors">
                <Brain className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                <span>راهبُرد</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-400/15 text-amber-300 font-normal border border-amber-400/30">
                  شناختی
                </span>
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-light">
                نظام جامع عارضه‌یابی و مهندسی مطالعه
              </span>
            </div>
          </div>

          {/* Quick CTA on Mobile */}
          <button
            onClick={() => onSelectTab('planner')}
            className="md:hidden px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>پلنر</span>
          </button>
        </div>

        {/* Tab Strip: Clean, Horizontally Scrollable, Elevated */}
        <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer border shrink-0 ${
                  isActive
                    ? `${tab.activeClass} shadow-md`
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border-slate-800/80 hover:bg-slate-850'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? '' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badgeText && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.badgeText}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
