'use client';

import React from 'react';
import { ScreenshotItem } from '@/types/archive';
import {
  ExternalLink,
  MapPin,
  Calendar,
  Star,
  ShoppingBag,
  Compass,
  UtensilsCrossed,
  GraduationCap,
  CalendarDays,
  Lightbulb,
  FileText,
  Palette,
  MessageSquare,
  HeartPulse,
  Folder,
  Coins,
  Gamepad2,
  Share2,
  Dumbbell,
  Music as MusicIcon,
  Camera,
  Quote as QuoteIcon,
  Newspaper,
  Film,
  Smile,
  ArrowUpRight,
  Code2,
} from 'lucide-react';

interface ScreenshotCardProps {
  item: ScreenshotItem;
  viewMode: 'grid' | 'masonry' | 'list';
  onClick: () => void;
  onToggleStar?: (e: React.MouseEvent) => void;
  isSelected?: boolean;
  onToggleSelect?: (e: React.MouseEvent) => void;
}

export const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Code: Code2,
  Shopping: ShoppingBag,
  Places: Compass,
  Food: UtensilsCrossed,
  Learning: GraduationCap,
  Events: CalendarDays,
  Ideas: Lightbulb,
  Documents: FileText,
  Design: Palette,
  Chats: MessageSquare,
  Health: HeartPulse,
  Finance: Coins,
  'Social Media': Share2,
  Gaming: Gamepad2,
  Fitness: Dumbbell,
  Music: MusicIcon,
  Photography: Camera,
  Quotes: QuoteIcon,
  News: Newspaper,
  Entertainment: Film,
  Memes: Smile,
  Other: Folder,
};

// Restrained, subdued monochromatic palette
export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Code: { bg: 'bg-neutral-100 dark:bg-neutral-800/80', text: 'text-neutral-700 dark:text-neutral-300', border: 'border-neutral-200 dark:border-neutral-700' },
  Shopping: { bg: 'bg-neutral-100 dark:bg-neutral-800/80', text: 'text-neutral-700 dark:text-neutral-300', border: 'border-neutral-200 dark:border-neutral-700' },
  Places: { bg: 'bg-neutral-100 dark:bg-neutral-800/80', text: 'text-neutral-700 dark:text-neutral-300', border: 'border-neutral-200 dark:border-neutral-700' },
  Food: { bg: 'bg-neutral-100 dark:bg-neutral-800/80', text: 'text-neutral-700 dark:text-neutral-300', border: 'border-neutral-200 dark:border-neutral-700' },
  Learning: { bg: 'bg-neutral-100 dark:bg-neutral-800/80', text: 'text-neutral-700 dark:text-neutral-300', border: 'border-neutral-200 dark:border-neutral-700' },
  Events: { bg: 'bg-neutral-100 dark:bg-neutral-800/80', text: 'text-neutral-700 dark:text-neutral-300', border: 'border-neutral-200 dark:border-neutral-700' },
  Ideas: { bg: 'bg-neutral-100 dark:bg-neutral-800/80', text: 'text-neutral-700 dark:text-neutral-300', border: 'border-neutral-200 dark:border-neutral-700' },
  Documents: { bg: 'bg-neutral-100 dark:bg-neutral-800/80', text: 'text-neutral-700 dark:text-neutral-300', border: 'border-neutral-200 dark:border-neutral-700' },
  Design: { bg: 'bg-neutral-100 dark:bg-neutral-800/80', text: 'text-neutral-700 dark:text-neutral-300', border: 'border-neutral-200 dark:border-neutral-700' },
  Chats: { bg: 'bg-neutral-100 dark:bg-neutral-800/80', text: 'text-neutral-700 dark:text-neutral-300', border: 'border-neutral-200 dark:border-neutral-700' },
  Health: { bg: 'bg-neutral-100 dark:bg-neutral-800/80', text: 'text-neutral-700 dark:text-neutral-300', border: 'border-neutral-200 dark:border-neutral-700' },
  Finance: { bg: 'bg-neutral-100 dark:bg-neutral-800/80', text: 'text-neutral-700 dark:text-neutral-300', border: 'border-neutral-200 dark:border-neutral-700' },
  'Social Media': { bg: 'bg-neutral-100 dark:bg-neutral-800/80', text: 'text-neutral-700 dark:text-neutral-300', border: 'border-neutral-200 dark:border-neutral-700' },
  Gaming: { bg: 'bg-neutral-100 dark:bg-neutral-800/80', text: 'text-neutral-700 dark:text-neutral-300', border: 'border-neutral-200 dark:border-neutral-700' },
  Fitness: { bg: 'bg-neutral-100 dark:bg-neutral-800/80', text: 'text-neutral-700 dark:text-neutral-300', border: 'border-neutral-200 dark:border-neutral-700' },
  Music: { bg: 'bg-neutral-100 dark:bg-neutral-800/80', text: 'text-neutral-700 dark:text-neutral-300', border: 'border-neutral-200 dark:border-neutral-700' },
  Photography: { bg: 'bg-neutral-100 dark:bg-neutral-800/80', text: 'text-neutral-700 dark:text-neutral-300', border: 'border-neutral-200 dark:border-neutral-700' },
  Quotes: { bg: 'bg-neutral-100 dark:bg-neutral-800/80', text: 'text-neutral-700 dark:text-neutral-300', border: 'border-neutral-200 dark:border-neutral-700' },
  News: { bg: 'bg-neutral-100 dark:bg-neutral-800/80', text: 'text-neutral-700 dark:text-neutral-300', border: 'border-neutral-200 dark:border-neutral-700' },
  Entertainment: { bg: 'bg-neutral-100 dark:bg-neutral-800/80', text: 'text-neutral-700 dark:text-neutral-300', border: 'border-neutral-200 dark:border-neutral-700' },
  Memes: { bg: 'bg-neutral-100 dark:bg-neutral-800/80', text: 'text-neutral-700 dark:text-neutral-300', border: 'border-neutral-200 dark:border-neutral-700' },
  Other: { bg: 'bg-neutral-100 dark:bg-neutral-800/80', text: 'text-neutral-700 dark:text-neutral-300', border: 'border-neutral-200 dark:border-neutral-700' },
};

export const ScreenshotCard: React.FC<ScreenshotCardProps> = ({
  item,
  viewMode,
  onClick,
  onToggleStar,
  isSelected,
  onToggleSelect,
}) => {
  const primaryPrice = item.entities.prices[0];
  const primaryLink = item.entities.links[0];
  const primaryLocation = item.entities.locations[0];

  // List View
  if (viewMode === 'list') {
    return (
      <div
        onClick={onClick}
        className={`group relative flex items-center gap-4 p-3 rounded-xl border transition-all duration-200 cursor-pointer futuristic-card ${
          isSelected
            ? 'bg-neutral-100 dark:bg-[#1C1C20] border-[#FF5500]/60 ring-1 ring-[#FF5500]/50 shadow-[0_0_15px_rgba(255,85,0,0.15)]'
            : 'bg-white dark:bg-[#121215] border-[#E4E4E7] dark:border-[#222228] hover:border-[#FF5500]/40'
        }`}
      >
        {/* Selection checkbox */}
        {onToggleSelect && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect(e);
            }}
            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
              isSelected
                ? 'bg-neutral-900 dark:bg-neutral-100 border-neutral-900 dark:border-neutral-100 text-white dark:text-neutral-900'
                : 'border-neutral-300 dark:border-neutral-600 group-hover:border-neutral-400'
            }`}
          >
            {isSelected && <span className="text-[10px] font-bold">✓</span>}
          </div>
        )}

        {/* Thumbnail */}
        <div className="relative w-16 h-12 rounded-md overflow-hidden flex-shrink-0 bg-neutral-100 dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800">
          <img
            src={item.thumbnailUrl || item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[11px] text-neutral-400 dark:text-neutral-500 mb-0.5">
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              {item.category}
            </span>
            <span>·</span>
            <span>{item.capturedAt || new Date(item.createdAt).toLocaleDateString()}</span>
            {item.entities.sourceApp && (
              <>
                <span>·</span>
                <span>via {item.entities.sourceApp}</span>
              </>
            )}
            {primaryPrice && (
              <>
                <span>·</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {primaryPrice.originalText}
                </span>
              </>
            )}
          </div>

          <h3 className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
            {item.title}
          </h3>

          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
            {item.aiSummary}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {onToggleStar && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(e);
              }}
              className="p-1.5 rounded-md text-neutral-400 hover:text-amber-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <Star className={`w-3.5 h-3.5 ${item.starred ? 'fill-amber-400 text-amber-500' : ''}`} />
            </button>
          )}
          <div className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    );
  }

  // Grid / Masonry View
  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden futuristic-card ${
        isSelected
          ? 'bg-neutral-50 dark:bg-[#1A1A1E] border-[#FF5500]/70 ring-1 ring-[#FF5500]/60 shadow-[0_0_20px_rgba(255,85,0,0.18)]'
          : 'bg-white dark:bg-[#121215] border-[#E4E4E7] dark:border-[#222228] hover:border-[#FF5500]/40'
      }`}
    >
      {/* Screenshot Frame (Primary Visual Hero) */}
      <div className="relative w-full aspect-[16/10] bg-neutral-100 dark:bg-[#121215] overflow-hidden border-b border-[#E4E4E7] dark:border-[#24242A]">
        <img
          src={item.thumbnailUrl || item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover object-top transition-transform duration-200 group-hover:scale-[1.01]"
          loading="lazy"
        />

        {/* Quiet Hover Controls */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
          {onToggleSelect && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect(e);
              }}
              className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-neutral-900 dark:bg-neutral-100 border-neutral-900 dark:border-neutral-100 text-white dark:text-neutral-900 opacity-100'
                  : 'bg-white/80 dark:bg-black/60 border-neutral-300 dark:border-neutral-600 opacity-0 group-hover:opacity-100'
              }`}
            >
              {isSelected && <span className="text-[10px] font-bold">✓</span>}
            </div>
          )}
        </div>

        <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
          {item.starred && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar?.(e);
              }}
              className="p-1 rounded bg-black/60 text-amber-400 backdrop-blur-xs"
            >
              <Star className="w-3 h-3 fill-amber-400" />
            </button>
          )}
          {!item.starred && onToggleStar && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(e);
              }}
              className="p-1 rounded bg-black/50 text-white/80 hover:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs"
            >
              <Star className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Card Info Section with Clear Restrained Hierarchy */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2 bg-white dark:bg-[#17171B]">
        <div className="flex flex-col gap-1">
          {/* Metadata line: Category · Date · Price */}
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 dark:text-neutral-500">
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              {item.category}
            </span>
            <span>·</span>
            <span>{item.capturedAt || new Date(item.createdAt).toLocaleDateString()}</span>
            {primaryPrice && (
              <>
                <span>·</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {primaryPrice.originalText}
                </span>
              </>
            )}
          </div>

          {/* Clean Readable Title */}
          <h3 className="text-xs sm:text-[13px] font-medium leading-snug text-neutral-900 dark:text-neutral-100 line-clamp-1 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
            {item.title}
          </h3>

          {/* Concise 2-line preview summary */}
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
            {item.aiSummary}
          </p>
        </div>

        {/* Secondary context (location or domain), quietly displayed without colored boxes */}
        {(primaryLocation || primaryLink) && (
          <div className="pt-2 border-t border-[#F0F0F2] dark:border-[#202024] flex items-center gap-2 text-[11px] text-neutral-400 dark:text-neutral-500">
            {primaryLocation && (
              <span className="flex items-center gap-1 truncate max-w-[140px]">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{primaryLocation}</span>
              </span>
            )}
            {primaryLocation && primaryLink && <span>·</span>}
            {primaryLink && (
              <span className="flex items-center gap-1 truncate max-w-[120px]">
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{primaryLink.domain || 'link'}</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
