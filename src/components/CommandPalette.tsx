'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Layers,
  Sparkles,
  FolderKanban,
  Upload,
  Moon,
  Sun,
  Settings as SettingsIcon,
  X,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { ScreenshotItem } from '@/types/archive';
import { NavTab } from './Navigation';
import { searchArchive } from '@/lib/searchEngine';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: ScreenshotItem[];
  onSelectTab: (tab: NavTab) => void;
  onSelectScreenshot: (item: ScreenshotItem) => void;
  onOpenUpload: () => void;
  onOpenSettings: () => void;
  onToggleDarkMode: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  items,
  onSelectTab,
  onSelectScreenshot,
  onOpenUpload,
  onOpenSettings,
  onToggleDarkMode,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const searchResults = query.trim() ? searchArchive(items, query).slice(0, 5) : [];

  const quickActions = [
    {
      id: 'archive',
      label: 'Go to Archive',
      icon: Layers,
      action: () => {
        onSelectTab('archive');
        onClose();
      },
    },
    {
      id: 'search',
      label: 'Open AI Search Screen',
      icon: Search,
      action: () => {
        onSelectTab('search');
        onClose();
      },
    },
    {
      id: 'assistant',
      label: 'Talk with TRACE Assistant',
      icon: Sparkles,
      action: () => {
        onSelectTab('assistant');
        onClose();
      },
    },
    {
      id: 'collections',
      label: 'Browse Collections',
      icon: FolderKanban,
      action: () => {
        onSelectTab('collections');
        onClose();
      },
    },
    {
      id: 'upload',
      label: 'Upload New Screenshot',
      icon: Upload,
      action: () => {
        onOpenUpload();
        onClose();
      },
    },
    {
      id: 'theme',
      label: 'Toggle Dark / Light Mode',
      icon: Moon,
      action: () => {
        onToggleDarkMode();
        onClose();
      },
    },
    {
      id: 'settings',
      label: 'Configure API Keys & Storage',
      icon: SettingsIcon,
      action: () => {
        onOpenSettings();
        onClose();
      },
    },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-md animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white dark:bg-[#151421] rounded-3xl border border-[#E6E3F2] dark:border-[#262438] shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#F0EDF7] dark:border-[#222033]">
          <Search className="w-5 h-5 text-purple-600 dark:text-purple-400 ml-1" />
          <input
            type="text"
            placeholder="Search commands or memories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none"
            autoFocus
          />
          <kbd className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-lg bg-neutral-100 dark:bg-[#201F31] text-neutral-500">
            ESC
          </kbd>
        </div>

        {/* Search Results if typing */}
        {query.trim() && (
          <div className="p-2 border-b border-[#F0EDF7] dark:border-[#222033] max-h-60 overflow-y-auto">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-3 py-1 block">
              Archive Matches
            </span>
            {searchResults.length > 0 ? (
              searchResults.map(({ item, explanation }) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectScreenshot(item);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-950/40 cursor-pointer transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-700 flex-shrink-0">
                    <img
                      src={item.thumbnailUrl || item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                      {explanation}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-500" />
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-400 px-3 py-2">
                No matching screenshots found for &quot;{query}&quot;
              </p>
            )}
          </div>
        )}

        {/* Quick Actions List */}
        <div className="p-2 max-h-72 overflow-y-auto">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-3 py-1 block">
            Navigation &amp; Actions
          </span>
          {quickActions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={act.action}
                className="w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-neutral-400 group-hover:text-purple-600" />
                  <span>{act.label}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
