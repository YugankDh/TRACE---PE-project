import { ScreenshotItem, SearchMatch } from '@/types/archive';

export interface ParsedQuery {
  raw: string;
  maxPrice?: number;
  minPrice?: number;
  currency?: string;
  categoryFilter?: string;
  temporalFilter?: 'next_month' | 'last_week' | 'recent' | 'this_year';
  keywords: string[];
}

export function parseNaturalLanguageQuery(query: string): ParsedQuery {
  const lower = query.toLowerCase().trim();
  const result: ParsedQuery = {
    raw: query,
    keywords: [],
  };

  // Price extraction patterns:
  // "under 3000", "below 3000", "less than 3000", "cheaper than 3000", "< 3000"
  // "over 1000", "above 1000", "> 1000"
  const underPriceMatch = lower.match(/(?:under|below|less than|cheaper than|within|sub|<)\s*(?:[₹$€£]\s*)?([0-9,]+)/i);
  if (underPriceMatch) {
    const num = parseFloat(underPriceMatch[1].replace(/,/g, ''));
    if (!isNaN(num)) {
      result.maxPrice = num;
    }
  }

  const overPriceMatch = lower.match(/(?:over|above|more than|exceeding|>)\s*(?:[₹$€£]\s*)?([0-9,]+)/i);
  if (overPriceMatch) {
    const num = parseFloat(overPriceMatch[1].replace(/,/g, ''));
    if (!isNaN(num)) {
      result.minPrice = num;
    }
  }

  // Temporal detection
  if (lower.includes('next month') || lower.includes('upcoming') || lower.includes('december')) {
    result.temporalFilter = 'next_month';
  } else if (lower.includes('last week') || lower.includes('past week')) {
    result.temporalFilter = 'last_week';
  } else if (lower.includes('recent') || lower.includes('lately') || lower.includes('yesterday')) {
    result.temporalFilter = 'recent';
  }

  // Category heuristics
  if (lower.includes('zomato') || lower.includes('swiggy') || lower.includes('food') || lower.includes('biryani') || lower.includes('pizza') || lower.includes('burger') || lower.includes('delivery') || lower.includes('dining')) {
    result.categoryFilter = 'Food';
  } else if (lower.includes('shoe') || lower.includes('sneaker') || lower.includes('buy') || lower.includes('shopping') || lower.includes('clothes') || lower.includes('order')) {
    result.categoryFilter = 'Shopping';
  } else if (lower.includes('restaurant') || lower.includes('cafe') || lower.includes('coffee') || lower.includes('place') || lower.includes('hotel') || lower.includes('cabin') || lower.includes('trip')) {
    result.categoryFilter = 'Places';
  } else if (lower.includes('machine learning') || lower.includes('ai') || lower.includes('paper') || lower.includes('learning') || lower.includes('study') || lower.includes('transformer')) {
    result.categoryFilter = 'Learning';
  } else if (lower.includes('event') || lower.includes('conference') || lower.includes('summit') || lower.includes('ticket') || lower.includes('pass')) {
    result.categoryFilter = 'Events';
  } else if (lower.includes('bill') || lower.includes('receipt') || lower.includes('term sheet') || lower.includes('contract') || lower.includes('finance') || lower.includes('document')) {
    result.categoryFilter = 'Documents';
  } else if (lower.includes('code') || lower.includes('github') || lower.includes('typescript') || lower.includes('architecture')) {
    result.categoryFilter = 'Ideas';
  } else if (lower.includes('recipe') || lower.includes('chat') || lower.includes('message') || lower.includes('whatsapp')) {
    result.categoryFilter = 'Chats';
  } else if (lower.includes('prescription') || lower.includes('medicine') || lower.includes('doctor') || lower.includes('vitamin')) {
    result.categoryFilter = 'Health';
  }

  // Tokenize keywords, ignoring stopwords
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'that', 'this', 'i', 'me', 'my', 'someone', 'sent', 'saved',
    'related', 'to', 'for', 'in', 'on', 'at', 'with', 'under', 'below', 'above', 'than',
    'what', 'where', 'when', 'which', 'who', 'is', 'are', 'was', 'were', 'have', 'had',
    'show', 'find', 'get', 'list', 'all', 'any'
  ]);

  const rawTokens = lower.split(/[^a-z0-9_-]+/).filter(t => t.length > 1);
  result.keywords = rawTokens.filter(t => !stopWords.has(t));

  return result;
}

export function searchArchive(items: ScreenshotItem[], query: string): SearchMatch[] {
  if (!query || !query.trim()) {
    return items.map(item => ({
      item,
      score: 1.0,
      explanation: 'Showing all saved archive items.',
      matchedFields: ['text'],
    }));
  }

  const parsed = parseNaturalLanguageQuery(query);
  const lowerQuery = query.toLowerCase().trim();
  const results: SearchMatch[] = [];

  for (const item of items) {
    let score = 0;
    const reasons: string[] = [];
    const matchedFields: SearchMatch['matchedFields'] = [];
    let matchedSnippet: string | undefined;

    const lowerTitle = item.title.toLowerCase();
    const lowerSummary = item.aiSummary.toLowerCase();
    const lowerOcr = item.extractedText.toLowerCase();
    const lowerTags = item.tags.map(t => t.toLowerCase());
    const lowerApp = (item.entities.sourceApp || '').toLowerCase();
    const lowerLocations = item.entities.locations.map(l => l.toLowerCase()).join(' ');
    const lowerPeople = item.entities.people.map(p => p.toLowerCase()).join(' ');

    // 1. Direct Substring Match
    if (lowerTitle.includes(lowerQuery)) {
      score += 45;
      reasons.push(`Title matches "${query}"`);
      matchedFields.push('text');
    }
    if (lowerSummary.includes(lowerQuery)) {
      score += 35;
      reasons.push(`Summary contains "${query}"`);
      matchedFields.push('text');
    }
    if (lowerOcr.includes(lowerQuery)) {
      score += 30;
      reasons.push(`Extracted text contains "${query}"`);
      matchedFields.push('text');
      const idx = lowerOcr.indexOf(lowerQuery);
      const start = Math.max(0, idx - 40);
      const end = Math.min(item.extractedText.length, idx + query.length + 50);
      matchedSnippet = '…' + item.extractedText.substring(start, end).trim() + '…';
    }

    // 2. Keyword Matching
    let keywordHits = 0;
    for (const kw of parsed.keywords) {
      let hit = false;
      if (lowerTitle.includes(kw)) {
        score += 15;
        hit = true;
      }
      if (lowerTags.includes(kw) || lowerTags.some(t => t.includes(kw))) {
        score += 18;
        matchedFields.push('tag');
        hit = true;
      }
      if (lowerSummary.includes(kw)) {
        score += 10;
        hit = true;
      }
      if (lowerOcr.includes(kw)) {
        score += 8;
        hit = true;
        if (!matchedSnippet) {
          const idx = lowerOcr.indexOf(kw);
          const start = Math.max(0, idx - 30);
          const end = Math.min(item.extractedText.length, idx + kw.length + 40);
          matchedSnippet = '…' + item.extractedText.substring(start, end).trim() + '…';
        }
      }
      if (lowerLocations.includes(kw)) {
        score += 14;
        matchedFields.push('location');
        hit = true;
      }
      if (lowerPeople.includes(kw)) {
        score += 12;
        hit = true;
      }
      if (hit) keywordHits++;
    }

    if (parsed.keywords.length > 0 && keywordHits === parsed.keywords.length) {
      score += 20; // Full keyword coverage bonus
    }

    // 3. Category Match
    if (parsed.categoryFilter && (item.category === parsed.categoryFilter || (parsed.categoryFilter === 'Places' && item.category === 'Chats' && lowerOcr.includes('coffee')))) {
      score += 25;
      matchedFields.push('category');
      reasons.push(`Category: ${item.category}`);
    }

    // 4. Price Criteria
    if (parsed.maxPrice !== undefined) {
      const itemPrices = item.entities.prices;
      if (itemPrices.length > 0) {
        const matchingPrice = itemPrices.find(p => p.amount <= (parsed.maxPrice!));
        if (matchingPrice) {
          score += 40;
          matchedFields.push('price');
          reasons.push(`Price ${matchingPrice.originalText} is under ${parsed.maxPrice}`);
        } else {
          // If price is exceeded, penalize heavily
          score -= 30;
        }
      }
    }

    if (parsed.minPrice !== undefined) {
      const itemPrices = item.entities.prices;
      if (itemPrices.some(p => p.amount >= parsed.minPrice!)) {
        score += 30;
        matchedFields.push('price');
      }
    }

    // 5. Temporal Criteria
    if (parsed.temporalFilter === 'next_month') {
      const hasNextMonthDate = item.entities.dates.some(d => d.date.includes('2026-12') || (d.context && d.context.toLowerCase().includes('next month')));
      const hasEventText = lowerTitle.includes('summit') || lowerTitle.includes('event') || lowerSummary.includes('december') || lowerOcr.includes('dec');
      if (hasNextMonthDate || hasEventText) {
        score += 45;
        matchedFields.push('date');
        reasons.push('Scheduled for next month (December 2026)');
      }
    }

    // 6. Source app / chat contextual intent ("someone sent me")
    if ((lowerQuery.includes('sent') || lowerQuery.includes('someone') || lowerQuery.includes('chat') || lowerQuery.includes('whatsapp')) && (lowerApp.includes('whatsapp') || item.category === 'Chats' || item.entities.people.length > 0)) {
      score += 28;
      reasons.push(`Received via chat (${item.entities.sourceApp || 'Message'})`);
    }

    // Compose cohesive explanation
    let explanation = '';
    if (reasons.length > 0) {
      explanation = reasons.slice(0, 3).join(' • ');
    } else if (keywordHits > 0) {
      explanation = `Matched ${keywordHits} relevant keywords in archive metadata`;
    }

    if (score > 12) {
      const normalizedScore = Math.min(100, Math.round(score));
      results.push({
        item,
        score: normalizedScore,
        explanation: explanation || 'Relevant archive memory match',
        matchedFields: Array.from(new Set(matchedFields)),
        matchedSnippet,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

export function findRelatedMemories(target: ScreenshotItem, allItems: ScreenshotItem[], limit: number = 4): ScreenshotItem[] {
  const others = allItems.filter(i => i.id !== target.id);
  const scored = others.map(item => {
    let similarity = 0;
    
    // Category match
    if (item.category === target.category) similarity += 35;
    
    // Shared collections
    const sharedCollections = item.collections.filter(c => target.collections.includes(c));
    similarity += sharedCollections.length * 20;

    // Shared tags
    const sharedTags = item.tags.filter(t => target.tags.includes(t));
    similarity += sharedTags.length * 15;

    // Shared locations
    const sharedLocations = item.entities.locations.filter(l => target.entities.locations.includes(l));
    similarity += sharedLocations.length * 25;

    // Source app match
    if (item.entities.sourceApp && target.entities.sourceApp && item.entities.sourceApp === target.entities.sourceApp) {
      similarity += 10;
    }

    return { item, similarity };
  });

  return scored
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map(s => s.item);
}
