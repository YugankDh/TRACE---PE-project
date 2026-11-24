import { ScreenshotItem } from '@/types/archive';
import { INITIAL_ARCHIVE_ITEMS } from './seedData';

const STORAGE_KEY = 'trace_archive_items_v1';
const SETTINGS_KEY = 'trace_settings_v1';

export interface TraceSettings {
  geminiApiKey?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  darkMode?: boolean;
  hasCompletedOnboarding?: boolean;
}

export function getStoredArchive(): ScreenshotItem[] {
  if (typeof window === 'undefined') {
    return INITIAL_ARCHIVE_ITEMS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Initialize with seed items
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ARCHIVE_ITEMS));
      return INITIAL_ARCHIVE_ITEMS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_ARCHIVE_ITEMS;
  } catch (err) {
    console.error('Failed to load archive from localStorage:', err);
    return INITIAL_ARCHIVE_ITEMS;
  }
}

export function saveArchive(items: ScreenshotItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save archive to localStorage:', err);
  }
}

export function getStoredSettings(): TraceSettings {
  if (typeof window === 'undefined') {
    return {};
  }
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveSettings(settings: Partial<TraceSettings>): TraceSettings {
  if (typeof window === 'undefined') return {};
  try {
    const current = getStoredSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return {};
  }
}

export function resetToSeedData(): ScreenshotItem[] {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ARCHIVE_ITEMS));
  }
  return INITIAL_ARCHIVE_ITEMS;
}

export function clearArchiveData(): ScreenshotItem[] {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
  return [];
}
