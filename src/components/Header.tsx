'use client';

import React from 'react';
import {
  Search,
  LayoutGrid,
  Rows,
  ArrowUpDown,
  Trash2,
  X,
} from 'lucide-react';
import { Category, SortOption, ViewMode } from '@/types/archive';
import { DEFAULT_CATEGORIES } from '@/lib/categories';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCommandPalette: () => void;
  selectedCategory: Category | 'All';
  onSelectCategory: (cat: Category | 'All') => void;
  sortOption: SortOption;
  onSelectSort: (sort: SortOption) => void;
  viewMode: ViewMode;
  onSelectViewMode: (vm: ViewMode) => void;
  selectedCount: number;
  onBatchDelete?: () => void;
  onClearSelection?: () => void;
  totalFilteredCount: number;
  activeCategories?: string[];
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const HEADER_CATEGORIES: (Category | 'All')[] = [
  'All',
  ...DEFAULT_CATEGORIES,
];

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenCommandPalette,
  selectedCategory,
  onSelectCategory,
  sortOption,
  onSelectSort,
  viewMode,
  onSelectViewMode,
  selectedCount,
  onBatchDelete,
  onClearSelection,
  totalFilteredCount,
  activeCategories = [],
}) => {
  const displayCategories = React.useMemo(() => {
    const list = [...HEADER_CATEGORIES];
    activeCategories.forEach((cat) => {
      if (cat && !list.includes(cat)) {
        list.push(cat);
      }
    });
    return list;
  }, [activeCategories]);

  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-[#FAFAF9]/85 dark:bg-[#0C0C0E]/85 border-b border-[#E4E4E7] dark:border-[#24242A] px-6 py-2.5 transition-colors duration-150">
      <div className="flex flex-col gap-2.5">
        {/* Top row: Search input + View switcher + Sort */}
        <div className="flex items-center justify-between gap-3">
          {/* Integrated Search Bar */}
          <div
            onClick={onOpenCommandPalette}
            className="flex-1 max-w-lg flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-neutral-100/80 dark:bg-[#17171B] border border-[#E4E4E7] dark:border-[#24242A] hover:border-neutral-300 dark:hover:border-neutral-700 focus-within:border-neutral-400 dark:focus-within:border-neutral-600 cursor-pointer transition-colors group"
          >
            <Search className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors" />
            <input
              type="text"
              placeholder="Search archive... (e.g. 'shoes under 3000', 'wifi password')"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-transparent text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSearchChange('');
                }}
                className="p-0.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-white dark:bg-[#202024] text-neutral-400 dark:text-neutral-500 border border-neutral-200 dark:border-neutral-700">
              ⌘K
            </kbd>
          </div>

          {/* Right controls: Batch Actions, Sort, View Modes */}
          <div className="flex items-center gap-2">
            {/* Batch delete bar if active */}
            {selectedCount > 0 && (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-neutral-200/80 dark:bg-[#1E1E24] border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 font-medium">
                <span>{selectedCount} selected</span>
                {onBatchDelete && (
                  <button
                    onClick={onBatchDelete}
                    className="p-1 text-neutral-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    title="Delete selected"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
                {onClearSelection && (
                  <button
                    onClick={onClearSelection}
                    className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-neutral-100/80 dark:bg-[#17171B] border border-[#E4E4E7] dark:border-[#24242A] rounded-lg px-2.5 py-1 text-xs">
              <ArrowUpDown className="w-3 h-3 text-neutral-400" />
              <select
                value={sortOption}
                onChange={(e) => onSelectSort(e.target.value as SortOption)}
                className="bg-transparent text-xs text-neutral-600 dark:text-neutral-300 focus:outline-none cursor-pointer py-0.5 pr-1 font-normal"
              >
                <option value="newest" className="bg-white dark:bg-[#17171B]">Recent</option>
                <option value="oldest" className="bg-white dark:bg-[#17171B]">Oldest</option>
                <option value="confidence" className="bg-white dark:bg-[#17171B]">Confidence</option>
                <option value="title" className="bg-white dark:bg-[#17171B]">Alphabetical</option>
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-neutral-100/80 dark:bg-[#17171B] border border-[#E4E4E7] dark:border-[#24242A] rounded-lg p-0.5">
              <button
                onClick={() => onSelectViewMode('grid')}
                className={`p-1 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-[#24242A] text-neutral-900 dark:text-neutral-100 shadow-2xs'
                    : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                }`}
                title="Grid layout"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onSelectViewMode('list')}
                className={`p-1 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-[#24242A] text-neutral-900 dark:text-neutral-100 shadow-2xs'
                    : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                }`}
                title="List layout"
              >
                <Rows className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row: Restrained, clean category filters */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {displayCategories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`text-xs px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-neutral-200/80 dark:bg-[#1F1F24] text-neutral-900 dark:text-neutral-100 font-medium'
                      : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100/80 dark:hover:bg-[#17171B]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <span className="text-[11px] text-neutral-400 dark:text-neutral-500 whitespace-nowrap hidden lg:inline-block font-normal">
            {totalFilteredCount} {totalFilteredCount === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>
    </header>
  );
};
