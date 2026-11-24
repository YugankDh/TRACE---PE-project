'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ScreenshotItem, Category, SortOption, ViewMode } from '@/types/archive';
import {
  getStoredArchive,
  saveArchive,
  getStoredSettings,
  saveSettings,
  resetToSeedData,
  clearArchiveData,
} from '@/lib/storage';
import { Navigation, NavTab } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { ArchiveGrid } from '@/components/ArchiveGrid';
import { DetailModal } from '@/components/DetailModal';
import { SmartUploadModal } from '@/components/SmartUploadModal';
import { SearchExperience } from '@/components/SearchExperience';
import { TraceAssistant } from '@/components/TraceAssistant';
import { CollectionsView } from '@/components/CollectionsView';
import { CommandPalette } from '@/components/CommandPalette';
import { SettingsModal } from '@/components/SettingsModal';
import { LandingPage } from '@/components/LandingPage';
import { searchArchive } from '@/lib/searchEngine';
import { Filter, Layers, Sparkles, X } from 'lucide-react';

export default function HomePage() {
  const [items, setItems] = useState<ScreenshotItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTab, setCurrentTab] = useState<NavTab>('archive');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedCustomCollection, setSelectedCustomCollection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [appView, setAppView] = useState<'landing' | 'dashboard'>('landing');

  // Modals state
  const [selectedScreenshot, setSelectedScreenshot] = useState<ScreenshotItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Batch selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Theme & Settings
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [geminiApiKey, setGeminiApiKey] = useState('');

  // Initial load
  useEffect(() => {
    const loadedItems = getStoredArchive();
    setItems(loadedItems);

    const settings = getStoredSettings();
    if (settings.darkMode !== undefined) {
      setIsDarkMode(settings.darkMode);
    }
    if (settings.geminiApiKey) {
      setGeminiApiKey(settings.geminiApiKey);
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'dashboard') {
        setAppView('dashboard');
      }
    }
    setIsLoaded(true);
  }, []);

  // Sync theme with HTML class
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    saveSettings({ darkMode: isDarkMode });
  }, [isDarkMode]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K => Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      // Cmd/Ctrl + U => Upload
      else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        setIsUploadOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update item in state & storage
  const handleUpdateItem = (updated: ScreenshotItem) => {
    const next = items.map((i) => (i.id === updated.id ? updated : i));
    setItems(next);
    saveArchive(next);
    if (selectedScreenshot && selectedScreenshot.id === updated.id) {
      setSelectedScreenshot(updated);
    }
  };

  // Delete item
  const handleDeleteItem = (id: string) => {
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    saveArchive(next);
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  // Toggle star
  const handleToggleStar = (item: ScreenshotItem) => {
    handleUpdateItem({ ...item, starred: !item.starred });
  };

  // Batch delete
  const handleBatchDelete = () => {
    if (confirm(`Delete ${selectedIds.length} screenshots?`)) {
      const next = items.filter((i) => !selectedIds.includes(i.id));
      setItems(next);
      saveArchive(next);
      setSelectedIds([]);
    }
  };

  // Add new items from Smart Upload
  const handleSaveUploadedItems = (newItems: ScreenshotItem[]) => {
    const next = [...newItems, ...items];
    setItems(next);
    saveArchive(next);
  };

  // Reset to seed data
  const handleResetSeedData = () => {
    const seed = resetToSeedData();
    setItems(seed);
    setSelectedIds([]);
  };

  // Clear archive
  const handleClearArchive = () => {
    const cleared = clearArchiveData();
    setItems(cleared);
    setSelectedIds([]);
  };

  // Save Gemini Key
  const handleSaveGeminiKey = (key: string) => {
    setGeminiApiKey(key);
    saveSettings({ geminiApiKey: key });
  };

  // Toggle single selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Filter & Sort Pipeline
  const filteredAndSortedItems = useMemo(() => {
    let result = items;

    // Search query filter
    if (searchQuery.trim()) {
      const matches = searchArchive(result, searchQuery);
      result = matches.map((m) => m.item);
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((i) => i.category === selectedCategory);
    }

    // Custom collection filter
    if (selectedCustomCollection) {
      result = result.filter(
        (i) =>
          i.collections.includes(selectedCustomCollection) ||
          i.category === selectedCustomCollection
      );
    }

    // Sorting
    return [...result].sort((a, b) => {
      if (sortOption === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortOption === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortOption === 'confidence') {
        return (b.confidenceScore || 0) - (a.confidenceScore || 0);
      }
      if (sortOption === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [items, searchQuery, selectedCategory, selectedCustomCollection, sortOption]);

  // Distinct collections count
  const collectionCount = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => i.collections.forEach((c) => set.add(c)));
    return set.size;
  }, [items]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#070709] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FF5500] text-black flex items-center justify-center font-bold text-2xl shadow-lg shadow-[#FF5500]/30 animate-pulse">
            ✤
          </div>
          <span className="font-tech text-xs tracking-widest uppercase text-neutral-400 font-semibold">
            Synthesizing Visual Vault...
          </span>
        </div>
      </div>
    );
  }

  // If user is on the Futuristic Landing Page
  if (appView === 'landing') {
    return <LandingPage onEnterDashboard={() => setAppView('dashboard')} />;
  }

  return (
    <div className="flex min-h-screen bg-[#FAFAF9] dark:bg-[#09090C] text-neutral-900 dark:text-neutral-100 transition-colors duration-200 selection:bg-[#FF5500]/25 selection:text-white">
      {/* Sidebar Navigation */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'archive') {
            setSelectedCustomCollection(null);
          }
        }}
        archiveCount={items.length}
        collectionCount={collectionCount}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLanding={() => setAppView('landing')}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        hasCustomApiKey={!!geminiApiKey}
      />

      {/* Main Work Area */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (q && currentTab !== 'archive') {
              setCurrentTab('archive');
            }
          }}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setSelectedCustomCollection(null);
            if (currentTab !== 'archive') setCurrentTab('archive');
          }}
          sortOption={sortOption}
          onSelectSort={setSortOption}
          viewMode={viewMode}
          onSelectViewMode={setViewMode}
          selectedCount={selectedIds.length}
          onBatchDelete={handleBatchDelete}
          onClearSelection={() => setSelectedIds([])}
          totalFilteredCount={filteredAndSortedItems.length}
          activeCategories={Array.from(new Set(items.map((i) => i.category).filter(Boolean)))}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        />

        {/* Custom Collection Filter banner if active */}
        {selectedCustomCollection && (
          <div className="flex items-center justify-between px-8 py-2.5 bg-purple-100 dark:bg-purple-950/40 border-b border-purple-200 dark:border-purple-800 text-xs animate-fade-in">
            <span className="font-medium text-purple-900 dark:text-purple-200">
              Viewing collection: <span className="font-bold underline">{selectedCustomCollection}</span> ({filteredAndSortedItems.length} items)
            </span>
            <button
              onClick={() => setSelectedCustomCollection(null)}
              className="flex items-center gap-1 font-medium text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filter</span>
            </button>
          </div>
        )}

        {/* Tab Viewport */}
        <div className="flex-1 flex flex-col p-6 sm:p-8">
          {currentTab === 'archive' && (
            <ArchiveGrid
              items={filteredAndSortedItems}
              viewMode={viewMode}
              onSelectScreenshot={setSelectedScreenshot}
              onToggleStar={handleToggleStar}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onOpenUpload={() => setIsUploadOpen(true)}
              onResetSeedData={handleResetSeedData}
            />
          )}

          {currentTab === 'search' && (
            <SearchExperience
              items={items}
              onSelectScreenshot={setSelectedScreenshot}
              onOpenUpload={() => setIsUploadOpen(true)}
            />
          )}

          {currentTab === 'assistant' && (
            <TraceAssistant
              items={items}
              onSelectScreenshot={setSelectedScreenshot}
              userApiKey={geminiApiKey}
            />
          )}

          {currentTab === 'collections' && (
            <CollectionsView
              items={items}
              onSelectCollection={(name, isCategory) => {
                if (isCategory) {
                  setSelectedCategory(name as Category);
                  setSelectedCustomCollection(null);
                } else {
                  setSelectedCustomCollection(name);
                  setSelectedCategory('All');
                }
                setCurrentTab('archive');
              }}
              onSelectScreenshot={setSelectedScreenshot}
            />
          )}
        </div>
      </main>

      {/* Screenshot Detail Modal */}
      {selectedScreenshot && (
        <DetailModal
          item={selectedScreenshot}
          allItems={items}
          onClose={() => setSelectedScreenshot(null)}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
          onSelectRelated={setSelectedScreenshot}
        />
      )}

      {/* Smart Upload Modal */}
      <SmartUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSaveItems={handleSaveUploadedItems}
        userApiKey={geminiApiKey}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        geminiApiKey={geminiApiKey}
        onSaveGeminiApiKey={handleSaveGeminiKey}
        onResetSeedData={handleResetSeedData}
        onClearArchive={handleClearArchive}
        items={items}
      />

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        items={items}
        onSelectTab={setCurrentTab}
        onSelectScreenshot={setSelectedScreenshot}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />
    </div>
  );
}
