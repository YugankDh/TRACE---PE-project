'use client';

import React from 'react';
import { ScreenshotItem, ViewMode } from '@/types/archive';
import { ScreenshotCard } from './ScreenshotCard';
import { Plus, RotateCcw, Folder } from 'lucide-react';

interface ArchiveGridProps {
  items: ScreenshotItem[];
  viewMode: ViewMode;
  onSelectScreenshot: (item: ScreenshotItem) => void;
  onToggleStar: (item: ScreenshotItem) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onOpenUpload: () => void;
  onResetSeedData: () => void;
}

export const ArchiveGrid: React.FC<ArchiveGridProps> = ({
  items,
  viewMode,
  onSelectScreenshot,
  onToggleStar,
  selectedIds,
  onToggleSelect,
  onOpenUpload,
  onResetSeedData,
}) => {
  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto my-auto animate-fade-in">
        <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-[#1A1A1E] border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-400 mb-3">
          <Folder className="w-5 h-5" />
        </div>

        <h2 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-1">
          Archive is empty
        </h2>

        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4">
          Drop screenshots here to build your personal memory bank. Text, numbers, links and dates are indexed automatically.
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add screenshot</span>
          </button>

          <button
            onClick={onResetSeedData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#17171B] text-xs text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Load samples</span>
          </button>
        </div>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-2 p-6 max-w-5xl mx-auto w-full animate-fade-in">
        {items.map((item) => (
          <ScreenshotCard
            key={item.id}
            item={item}
            viewMode="list"
            onClick={() => onSelectScreenshot(item)}
            onToggleStar={(e) => {
              e.stopPropagation();
              onToggleStar(item);
            }}
            isSelected={selectedIds.includes(item.id)}
            onToggleSelect={(e) => {
              e.stopPropagation();
              onToggleSelect(item.id);
            }}
          />
        ))}
      </div>
    );
  }

  // Grid view
  return (
    <div className="p-6 sm:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 animate-fade-in">
        {items.map((item) => (
          <ScreenshotCard
            key={item.id}
            item={item}
            viewMode="grid"
            onClick={() => onSelectScreenshot(item)}
            onToggleStar={(e) => {
              e.stopPropagation();
              onToggleStar(item);
            }}
            isSelected={selectedIds.includes(item.id)}
            onToggleSelect={(e) => {
              e.stopPropagation();
              onToggleSelect(item.id);
            }}
          />
        ))}
      </div>
    </div>
  );
};
