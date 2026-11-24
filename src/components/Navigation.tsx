'use client';

import React from 'react';
import {
  Layers,
  Search,
  Sparkles,
  FolderKanban,
  Plus,
  Settings as SettingsIcon,
  Sun,
  Moon,
} from 'lucide-react';

export type NavTab = 'archive' | 'search' | 'assistant' | 'collections';

interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  archiveCount: number;
  collectionCount: number;
  onOpenUpload: () => void;
  onOpenSettings: () => void;
  onOpenLanding?: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  hasCustomApiKey: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  archiveCount,
  collectionCount,
  onOpenUpload,
  onOpenSettings,
  onOpenLanding,
  isDarkMode,
  onToggleDarkMode,
  hasCustomApiKey,
}) => {
  const navItems = [
    {
      id: 'archive' as NavTab,
      label: 'Archive',
      icon: Layers,
      count: archiveCount,
    },
    {
      id: 'search' as NavTab,
      label: 'Search',
      icon: Search,
    },
    {
      id: 'assistant' as NavTab,
      label: 'Assistant',
      icon: Sparkles,
    },
    {
      id: 'collections' as NavTab,
      label: 'Collections',
      icon: FolderKanban,
      count: collectionCount,
    },
  ];

  return (
        <aside className="w-56 flex-shrink-0 flex flex-col justify-between h-screen sticky top-0 bg-[#FAFAF9] dark:bg-[#0C0C0E] border-r border-[#E4E4E7] dark:border-[#24242A] p-4 select-none transition-colors duration-150 hidden md:flex">
        {/* Top Branding & Nav */}
        <div className="flex flex-col gap-5">
          {/* Brand Logo & Wordmark (Clickable to Landing Page) */}
          <div
            onClick={onOpenLanding}
            className="flex items-center justify-between px-2 pt-1 cursor-pointer group"
            title="Go to Landing Page"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-[#FF5500] text-black flex items-center justify-center font-bold text-xs tracking-tight group-hover:rotate-45 transition-transform duration-300">
                ✤
              </div>
              <span className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-syne">
                TRACE
              </span>
            </div>
            <span className="text-[10px] text-neutral-400 group-hover:text-[#FF5500] font-medium px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 transition-colors">
              portal ↗
            </span>
          </div>


        {/* Primary Action Button */}
        <button
          onClick={onOpenUpload}
          className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 font-medium text-xs transition-colors active:scale-[0.99] shadow-sm hover:shadow-[0_0_15px_rgba(255,85,0,0.25)]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add screenshot</span>
        </button>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-0.5">
          <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-2 py-1 mb-0.5">
            Library
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  isActive
                    ? 'bg-neutral-200/70 dark:bg-[#1C1C20] text-neutral-900 dark:text-neutral-100 font-medium'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-[#17171B]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? 'text-neutral-900 dark:text-neutral-100'
                        : 'text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.count !== undefined && (
                  <span className="text-[11px] font-normal text-neutral-400 dark:text-neutral-500">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col gap-1 pt-3 border-t border-[#E4E4E7] dark:border-[#24242A]">
        {/* Theme Toggle Button */}
        <button
          onClick={onToggleDarkMode}
          className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-[#17171B] transition-colors"
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <div className="flex items-center gap-2.5">
            {isDarkMode ? (
              <Sun className="w-3.5 h-3.5 text-neutral-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-neutral-500" />
            )}
            <span>Theme</span>
          </div>
          <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
            {isDarkMode ? 'Dark' : 'Light'}
          </span>
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-[#17171B] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <SettingsIcon className="w-3.5 h-3.5 text-neutral-400" />
            <span>Settings</span>
          </div>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              hasCustomApiKey ? 'bg-emerald-500/80' : 'bg-neutral-400/60 dark:bg-neutral-600'
            }`}
            title={hasCustomApiKey ? 'Gemini API active' : 'Default mode'}
          />
        </button>
      </div>
    </aside>
  );
};
