export type Category = string; // Allows dynamic categories beyond predefined set

export interface PriceEntity {
  amount: number;
  currency: string;
  originalText: string;
}

export interface LinkEntity {
  url: string;
  title?: string;
  domain?: string;
}

export interface DateEntity {
  date: string;
  context?: string;
}

export interface DetectedEntities {
  prices: PriceEntity[];
  links: LinkEntity[];
  dates: DateEntity[];
  locations: string[];
  people: string[];
  sourceApp?: string;
  actionableItem?: string;
}

export interface ScreenshotItem {
  id: string;
  title: string;
  imageUrl: string;
  thumbnailUrl?: string;
  aspectRatio?: number;
  createdAt: string; // ISO
  capturedAt?: string; // e.g. "Nov 18, 2026"
  category: Category;
  collections: string[];
  tags: string[];
  aiSummary: string;
  extractedText: string;
  entities: DetectedEntities;
  confidenceScore: number;
  starred?: boolean;
  isDemo?: boolean;
  notes?: string;
}

export interface SearchMatch {
  item: ScreenshotItem;
  score: number;
  explanation: string;
  matchedFields: ('text' | 'price' | 'category' | 'tag' | 'location' | 'date' | 'link')[];
  matchedSnippet?: string;
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citedScreenshotIds?: string[];
  suggestedFollowUps?: string[];
}

export type ViewMode = 'grid' | 'masonry' | 'list';
export type SortOption = 'newest' | 'oldest' | 'confidence' | 'title';
