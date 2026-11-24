// Default category definitions for TRACE Screenshot Archive
// Centralised list used across the UI, filters, upload flow, and AI categorization.

export const DEFAULT_CATEGORIES: string[] = [
  'Code',
  'Shopping',
  'Places',
  'Food',
  'Documents',
  'Learning',
  'Events',
  'Chats',
  'Finance',
  'Design',
  'Health',
  'Social Media',
  'Entertainment',
  'Ideas',
  'Other',
];

/**
 * Returns a copy of the default categories array.
 */
export function getDefaultCategories(): string[] {
  return [...DEFAULT_CATEGORIES];
}

/**
 * Normalize and validate a category name against the defaults or allow custom capitalized names.
 */
export function resolveCategory(rawCategory?: string): string {
  if (!rawCategory || typeof rawCategory !== 'string') return 'Other';

  const clean = rawCategory.trim();
  const lower = clean.toLowerCase();

  // "Screenshots" should NEVER be a category in a screenshot archive
  if (lower === 'screenshots' || lower === 'screenshot') {
    return 'Other';
  }

  // Exact or case-insensitive match against defaults
  const matched = DEFAULT_CATEGORIES.find((c) => c.toLowerCase() === lower);
  if (matched) return matched;

  // Otherwise return capitalized custom category name
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}
