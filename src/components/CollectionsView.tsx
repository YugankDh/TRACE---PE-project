'use client';

import React, { useState } from 'react';
import {
  Folder,
  Plus,
  ArrowRight,
  X,
} from 'lucide-react';
import { ScreenshotItem, Category } from '@/types/archive';
import { CATEGORY_ICONS } from './ScreenshotCard';
import { DEFAULT_CATEGORIES } from '@/lib/categories';

interface CollectionsViewProps {
  items: ScreenshotItem[];
  onSelectCollection: (name: string, isCategory?: boolean) => void;
  onSelectScreenshot: (item: ScreenshotItem) => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  items,
  onSelectCollection,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  const categories = React.useMemo(() => {
    const set = new Set([...DEFAULT_CATEGORIES]);
    items.forEach((item) => {
      if (item.category && item.category !== 'Other') {
        set.add(item.category);
      }
    });
    return Array.from(set);
  }, [items]);

  const customCollectionsMap = new Map<string, ScreenshotItem[]>();
  items.forEach((item) => {
    item.collections.forEach((col) => {
      const existing = customCollectionsMap.get(col) || [];
      existing.push(item);
      customCollectionsMap.set(col, existing);
    });
  });

  return (
    <div className="flex-1 flex flex-col p-6 sm:p-10 max-w-5xl mx-auto w-full animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-[#E4E4E7] dark:border-[#24242A]">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Organized Archive
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mt-0.5">
            Collections
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Screenshots are automatically categorized or grouped into custom topic stacks.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New collection</span>
        </button>
      </div>

      {/* Auto-categorized Collections Section */}
      <div className="flex flex-col gap-3 mb-10">
        <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          Smart Categories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat] || Folder;
            const matchingItems = items.filter((i) => i.category === cat);
            const count = matchingItems.length;

            return (
              <div
                key={cat}
                onClick={() => onSelectCollection(cat, true)}
                className="group flex flex-col justify-between p-4 rounded-xl bg-white dark:bg-[#17171B] border border-[#E4E4E7] dark:border-[#24242A] hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-7 h-7 rounded-md bg-neutral-100 dark:bg-[#202024] flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                      {count} {count === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                    {cat}
                  </h3>

                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                    {cat === 'Code' && 'Algorithms, C++, Python, TypeScript, IDE captures, and syntax.'}
                    {cat === 'Shopping' && 'Sneakers, apparel, carts, and verified discount codes.'}
                    {cat === 'Places' && 'Cafes, restaurants, Airbnb cabins, and Google Maps pins.'}
                    {cat === 'Food' && 'Zomato bills, Swiggy orders, dining receipts, and menus.'}
                    {cat === 'Learning' && 'arXiv papers, equations, formulas, and study notes.'}
                    {cat === 'Events' && 'VIP passes, QR tickets, concerts, and tech summits.'}
                    {cat === 'Ideas' && 'Code snippets, architecture notes, and system designs.'}
                    {cat === 'Documents' && 'Term sheets, contracts, invoices, and signed PDFs.'}
                    {cat === 'Design' && 'Typography specimens, Swiss style posters, and palettes.'}
                    {cat === 'Chats' && 'Recommendations, chat advice, and recipes.'}
                    {cat === 'Health' && 'Prescriptions, vitamin schedules, and pharmacy bills.'}
                  </p>
                </div>

                {/* Thumbnail Mosaic Preview */}
                <div className="pt-3 mt-3 border-t border-[#F0F0F2] dark:border-[#202024] flex items-center justify-between">
                  <div className="flex items-center -space-x-1.5">
                    {matchingItems.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="w-6 h-6 rounded-md overflow-hidden border border-white dark:border-[#17171B] bg-neutral-100 dark:bg-neutral-800 flex-shrink-0"
                      >
                        <img
                          src={item.thumbnailUrl || item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    ))}
                    {count === 0 && (
                      <span className="text-[10px] text-neutral-400">Empty</span>
                    )}
                  </div>

                  <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 flex items-center gap-1 transition-colors">
                    <span>View</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Custom Collections Section */}
      {customCollectionsMap.size > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Custom Stacks ({customCollectionsMap.size})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {Array.from(customCollectionsMap.entries()).map(([colName, colItems]) => (
              <div
                key={colName}
                onClick={() => onSelectCollection(colName, false)}
                className="p-3 rounded-lg bg-white dark:bg-[#17171B] border border-[#E4E4E7] dark:border-[#24242A] hover:border-neutral-400 dark:hover:border-neutral-600 cursor-pointer transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Folder className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                  <span className="text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate">
                    {colName}
                  </span>
                </div>
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500 flex-shrink-0">
                  {colItems.length}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm p-5 rounded-xl bg-white dark:bg-[#17171B] border border-[#E4E4E7] dark:border-[#24242A] shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                New collection
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-500">
              Create a custom tag space (e.g. &ldquo;Living Room Furniture&rdquo; or &ldquo;Japan Trip&rdquo;).
            </p>

            <input
              type="text"
              placeholder="Collection name..."
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#24242A] text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-400"
              autoFocus
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newCollectionName.trim()) {
                    onSelectCollection(newCollectionName.trim(), false);
                    setShowCreateModal(false);
                    setNewCollectionName('');
                  }
                }}
                disabled={!newCollectionName.trim()}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-medium disabled:opacity-40 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
