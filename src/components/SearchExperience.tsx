'use client';

import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  ChevronRight,
  ExternalLink,
  MapPin,
  Calendar,
} from 'lucide-react';
import { ScreenshotItem } from '@/types/archive';
import { searchArchive } from '@/lib/searchEngine';

interface SearchExperienceProps {
  items: ScreenshotItem[];
  onSelectScreenshot: (item: ScreenshotItem) => void;
  onOpenUpload: () => void;
}

const EXAMPLE_QUERIES = [
  'The shoes I saved under 3000',
  'Restaurant recommendation in chat',
  'Notes related to machine learning',
  'Upcoming event tickets',
  'Mom\'s recipe',
  'Term sheet valuation',
];

export const SearchExperience: React.FC<SearchExperienceProps> = ({
  items,
  onSelectScreenshot,
  onOpenUpload,
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'price' | 'location' | 'date' | 'link'>('all');

  const matches = searchArchive(items, query);

  const filteredMatches = matches.filter((m) => {
    if (activeFilter === 'price') return m.matchedFields.includes('price') || m.item.entities.prices.length > 0;
    if (activeFilter === 'location') return m.matchedFields.includes('location') || m.item.entities.locations.length > 0;
    if (activeFilter === 'date') return m.matchedFields.includes('date') || m.item.entities.dates.length > 0;
    if (activeFilter === 'link') return m.item.entities.links.length > 0;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col p-6 sm:p-10 max-w-4xl mx-auto w-full animate-fade-in">
      {/* Search Header */}
      <div className="flex flex-col gap-4 mb-8 text-center max-w-2xl mx-auto">
        <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          Natural Language Search
        </span>

        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Find what you forgot you saved.
        </h1>

        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Ask using natural terms, prices, OCR text, or context from your messages.
        </p>

        {/* Search Input Bar */}
        <div className="relative w-full mt-2">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-[#17171B] border border-[#E4E4E7] dark:border-[#24242A] focus-within:border-neutral-400 dark:focus-within:border-neutral-500 transition-colors">
            <Search className="w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. 'shoes under 3000' or 'restaurant someone sent me'..."
              className="flex-1 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 bg-transparent focus:outline-none"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="px-2 py-0.5 text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Quiet suggestions */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
          {EXAMPLE_QUERIES.map((ex, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(ex)}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                query === ex
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium'
                  : 'bg-neutral-100 dark:bg-[#1A1A1E] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Results Filter Bar */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E4E4E7] dark:border-[#24242A]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
            {query ? `Results for "${query}"` : 'All Archive Items'}
          </span>
          <span className="text-xs text-neutral-400 dark:text-neutral-500 font-normal">
            ({filteredMatches.length})
          </span>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 text-xs">
          {(['all', 'price', 'location', 'date', 'link'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                activeFilter === f
                  ? 'bg-neutral-200/80 dark:bg-[#1F1F24] text-neutral-900 dark:text-neutral-100 font-medium'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      {filteredMatches.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {filteredMatches.map(({ item, score, explanation, matchedSnippet }) => {
            const primaryPrice = item.entities.prices[0];
            const primaryLocation = item.entities.locations[0];
            const primaryLink = item.entities.links[0];

            return (
              <div
                key={item.id}
                onClick={() => onSelectScreenshot(item)}
                className="group flex items-center gap-4 p-3.5 rounded-xl bg-white dark:bg-[#17171B] border border-[#E4E4E7] dark:border-[#24242A] hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="w-20 h-16 rounded-md overflow-hidden bg-neutral-100 dark:bg-[#121215] flex-shrink-0 border border-neutral-200/80 dark:border-neutral-800">
                  <img
                    src={item.thumbnailUrl || item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 dark:text-neutral-500 mb-0.5">
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">
                      {item.category}
                    </span>
                    <span>·</span>
                    <span>{explanation}</span>
                    <span className="ml-auto text-neutral-400 dark:text-neutral-500 font-mono text-[10px]">
                      {score}%
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
                    {item.title}
                  </h3>

                  {matchedSnippet ? (
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-300 truncate mt-0.5 font-mono">
                      &ldquo;{matchedSnippet}&rdquo;
                    </p>
                  ) : (
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                      {item.aiSummary}
                    </p>
                  )}

                  {/* Inline metadata */}
                  {(primaryPrice || primaryLocation || primaryLink) && (
                    <div className="flex items-center gap-2 text-[11px] text-neutral-400 dark:text-neutral-500 mt-1">
                      {primaryPrice && (
                        <span className="font-medium text-neutral-800 dark:text-neutral-200">
                          {primaryPrice.originalText}
                        </span>
                      )}
                      {primaryLocation && (
                        <span className="truncate max-w-[140px]">
                          {primaryLocation}
                        </span>
                      )}
                      {primaryLink && (
                        <span className="truncate max-w-[120px]">
                          {primaryLink.domain}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors flex-shrink-0" />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-xl bg-neutral-50/50 dark:bg-[#121215] border border-dashed border-[#E4E4E7] dark:border-[#24242A] flex flex-col items-center justify-center gap-2">
          <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
            No matching screenshots found
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm">
            Try searching for broader terms or keywords from inside the image.
          </p>
          <button
            onClick={onOpenUpload}
            className="mt-2 px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            Add screenshot
          </button>
        </div>
      )}
    </div>
  );
};
