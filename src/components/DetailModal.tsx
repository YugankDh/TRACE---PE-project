'use client';

import React, { useState } from 'react';
import { ScreenshotItem } from '@/types/archive';
import {
  X,
  ExternalLink,
  Copy,
  Check,
  MapPin,
  Calendar,
  Star,
  Trash2,
  ZoomIn,
  ZoomOut,
  FolderPlus,
  Sparkles,
  Edit2,
  Save,
  Clock,
} from 'lucide-react';
import { DEFAULT_CATEGORIES, resolveCategory } from '@/lib/categories';
import { findRelatedMemories } from '@/lib/searchEngine';

interface DetailModalProps {
  item: ScreenshotItem | null;
  allItems: ScreenshotItem[];
  onClose: () => void;
  onUpdateItem: (updated: ScreenshotItem) => void;
  onDeleteItem: (id: string) => void;
  onSelectRelated: (item: ScreenshotItem) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  item,
  allItems,
  onClose,
  onUpdateItem,
  onDeleteItem,
  onSelectRelated,
}) => {
  if (!item) return null;

  const [copiedOcr, setCopiedOcr] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState(item.notes || '');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(item.title);
  const [newTagInput, setNewTagInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const related = findRelatedMemories(item, allItems, 3);

  const handleCopyOcr = async () => {
    try {
      await navigator.clipboard.writeText(item.extractedText);
      setCopiedOcr(true);
      setTimeout(() => setCopiedOcr(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleSaveNotes = () => {
    onUpdateItem({ ...item, notes: notesDraft });
    setIsEditingNotes(false);
  };

  const handleSaveTitle = () => {
    if (titleDraft.trim()) {
      onUpdateItem({ ...item, title: titleDraft.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      const tagClean = newTagInput.trim().toLowerCase().replace(/^#/, '');
      if (!item.tags.includes(tagClean)) {
        onUpdateItem({ ...item, tags: [...item.tags, tagClean] });
      }
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateItem({ ...item, tags: item.tags.filter((t) => t !== tagToRemove) });
  };

  const handleToggleStar = () => {
    onUpdateItem({ ...item, starred: !item.starred });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col lg:flex-row bg-white dark:bg-[#151518] rounded-xl border border-[#E4E4E7] dark:border-[#24242A] shadow-2xl overflow-hidden">
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 p-1.5 rounded-md bg-white/80 dark:bg-[#1E1E22]/80 hover:bg-neutral-100 dark:hover:bg-[#28282D] border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Column: Image Viewer */}
        <div className="lg:w-1/2 flex flex-col bg-[#F7F7F8] dark:bg-[#0C0C0E] border-b lg:border-b-0 lg:border-r border-[#E4E4E7] dark:border-[#24242A] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-[#E4E4E7] dark:border-[#24242A] flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-500">
            <span className="text-[11px] flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {item.capturedAt || new Date(item.createdAt).toLocaleString()}
            </span>

            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-white dark:bg-[#1A1A1E] border border-neutral-200 dark:border-neutral-700 text-[11px] text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              {isZoomed ? <ZoomOut className="w-3 h-3" /> : <ZoomIn className="w-3 h-3" />}
              <span>{isZoomed ? 'Fit' : '100%'}</span>
            </button>
          </div>

          <div
            className={`flex-1 p-6 flex items-center justify-center overflow-auto ${
              isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <div
              className={`relative transition-all duration-200 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 ${
                isZoomed ? 'max-w-none scale-125 my-8' : 'max-h-[65vh] max-w-full'
              }`}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-auto object-contain select-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Inspector & Metadata */}
        <div className="lg:w-1/2 flex flex-col max-h-[90vh] overflow-y-auto p-6 bg-white dark:bg-[#151518]">
          {/* Header row: Category & actions */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={DEFAULT_CATEGORIES.includes(item.category) ? item.category : '__CUSTOM__'}
                  onChange={(e) => {
                    const newCat = resolveCategory(e.target.value);
                    onUpdateItem({
                      ...item,
                      category: newCat,
                      collections: Array.from(new Set([newCat, ...item.collections])),
                    });
                  }}
                  className="text-xs font-medium px-2 py-0.5 rounded bg-neutral-100 dark:bg-[#202024] text-neutral-700 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-700 cursor-pointer focus:outline-none"
                  title="Change category"
                >
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-white dark:bg-[#17171B]">
                      {cat}
                    </option>
                  ))}
                  {!DEFAULT_CATEGORIES.includes(item.category) && (
                    <option value="__CUSTOM__" className="bg-white dark:bg-[#17171B]">
                      {item.category} (Custom)
                    </option>
                  )}
                </select>
              </div>

              {item.entities.sourceApp && (
                <span className="text-xs text-neutral-400 dark:text-neutral-500">
                  via {item.entities.sourceApp}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleToggleStar}
                className={`p-1.5 rounded-md border transition-colors ${
                  item.starred
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-500'
                    : 'bg-white dark:bg-[#1A1A1E] border-neutral-200 dark:border-neutral-700 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                }`}
                title="Star screenshot"
              >
                <Star className={`w-3.5 h-3.5 ${item.starred ? 'fill-amber-400 text-amber-500' : ''}`} />
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 rounded-md bg-white dark:bg-[#1A1A1E] border border-neutral-200 dark:border-neutral-700 text-neutral-400 hover:text-red-500 transition-colors"
                title="Delete screenshot"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Title (Editable) */}
          <div className="mb-3">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  className="flex-1 text-base font-semibold bg-neutral-50 dark:bg-[#1A1A1E] px-2.5 py-1 rounded-md border border-neutral-400 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleSaveTitle}
                  className="p-1.5 rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-start justify-between group">
                <h1 className="text-base sm:text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 leading-snug">
                  {item.title}
                </h1>
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-opacity ml-2"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="p-3 rounded-lg bg-neutral-50 dark:bg-[#1A1A1E] border border-[#E4E4E7] dark:border-[#24242A] mb-4">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3 h-3 text-neutral-400" />
              <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Summary
              </span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
              {item.aiSummary}
            </p>
          </div>

          {/* Next Action if detected */}
          {item.entities.actionableItem && (
            <div className="p-2.5 rounded-lg bg-neutral-100 dark:bg-[#1C1C20] border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-300 mb-4">
              <span className="font-medium mr-1">Action:</span>
              <span>{item.entities.actionableItem}</span>
            </div>
          )}

          {/* Detected Entities Section */}
          <div className="flex flex-col gap-2 mb-4">
            <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Details
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* Prices */}
              {item.entities.prices.length > 0 && (
                <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-[#1A1A1E] border border-[#E4E4E7] dark:border-[#24242A]">
                  <span className="text-[10px] text-neutral-400 block mb-1">Price</span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.entities.prices.map((p, idx) => (
                      <span
                        key={idx}
                        className="font-medium text-neutral-900 dark:text-neutral-100 text-xs"
                      >
                        {p.originalText}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dates */}
              {item.entities.dates.length > 0 && (
                <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-[#1A1A1E] border border-[#E4E4E7] dark:border-[#24242A]">
                  <span className="text-[10px] text-neutral-400 block mb-1">Date</span>
                  <div className="flex flex-col gap-0.5">
                    {item.entities.dates.map((d, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-neutral-800 dark:text-neutral-200">
                        <Calendar className="w-3 h-3 text-neutral-400" />
                        <span>{d.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Locations */}
              {item.entities.locations.length > 0 && (
                <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-[#1A1A1E] border border-[#E4E4E7] dark:border-[#24242A]">
                  <span className="text-[10px] text-neutral-400 block mb-1">Location</span>
                  <div className="flex flex-col gap-0.5">
                    {item.entities.locations.map((loc, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-neutral-800 dark:text-neutral-200">
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        <span className="truncate">{loc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {item.entities.links.length > 0 && (
                <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-[#1A1A1E] border border-[#E4E4E7] dark:border-[#24242A]">
                  <span className="text-[10px] text-neutral-400 block mb-1">Link</span>
                  <div className="flex flex-col gap-0.5">
                    {item.entities.links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between text-xs text-neutral-700 dark:text-neutral-300 hover:underline gap-1"
                      >
                        <span className="truncate">{link.title || link.domain || link.url}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0 text-neutral-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Extracted OCR Text */}
          <div className="flex flex-col gap-1.5 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Extracted Text
              </span>
              <button
                onClick={handleCopyOcr}
                className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                {copiedOcr ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy text</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-[#1A1A1E] border border-[#E4E4E7] dark:border-[#24242A] font-mono text-[11px] text-neutral-700 dark:text-neutral-300 leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap select-text">
              {item.extractedText}
            </div>
          </div>

          {/* Tags & Collections */}
          <div className="flex flex-col gap-1.5 mb-4">
            <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Tags & Collections
            </span>

            <div className="flex flex-wrap items-center gap-1.5">
              {item.collections.map((col) => (
                <span
                  key={col}
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                >
                  <FolderPlus className="w-3 h-3" />
                  {col}
                </span>
              ))}

              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-[#202024] text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 group"
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}

              <input
                type="text"
                placeholder="+ tag..."
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="text-[11px] px-2 py-0.5 rounded bg-transparent border border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-500 w-20"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Notes
              </span>
              {!isEditingNotes && (
                <button
                  onClick={() => setIsEditingNotes(true)}
                  className="text-[11px] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditingNotes ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Add notes..."
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-lg bg-neutral-50 dark:bg-[#1A1A1E] border border-neutral-400 text-neutral-800 dark:text-neutral-200 focus:outline-none"
                />
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => setIsEditingNotes(false)}
                    className="px-2.5 py-1 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="px-3 py-1 text-xs rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setIsEditingNotes(true)}
                className="p-2.5 rounded-lg bg-neutral-50 dark:bg-[#1A1A1E] border border-[#E4E4E7] dark:border-[#24242A] text-xs text-neutral-500 dark:text-neutral-400 cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
              >
                {item.notes || 'Add notes...'}
              </div>
            )}
          </div>

          {/* Related Memories */}
          {related.length > 0 && (
            <div className="flex flex-col gap-2 pt-3 border-t border-[#E4E4E7] dark:border-[#24242A]">
              <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Related
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {related.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelated(rel)}
                    className="group flex flex-col p-2 rounded-lg bg-neutral-50 dark:bg-[#1A1A1E] border border-[#E4E4E7] dark:border-[#24242A] hover:border-neutral-400 dark:hover:border-neutral-600 cursor-pointer transition-colors"
                  >
                    <div className="aspect-[4/3] rounded overflow-hidden bg-neutral-200 dark:bg-neutral-800 mb-1.5">
                      <img
                        src={rel.thumbnailUrl || rel.imageUrl}
                        alt={rel.title}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <span className="text-[11px] font-medium text-neutral-900 dark:text-neutral-100 truncate">
                      {rel.title}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {rel.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xs p-5 rounded-xl bg-white dark:bg-[#17171B] border border-[#E4E4E7] dark:border-[#24242A] shadow-xl flex flex-col gap-3">
            <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              Delete Screenshot?
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Remove &ldquo;{item.title}&rdquo; from your archive?
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteItem(item.id);
                  setShowDeleteConfirm(false);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
