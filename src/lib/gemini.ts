import { GoogleGenerativeAI } from '@google/generative-ai';
import { ScreenshotItem, Category, DetectedEntities, PriceEntity, DateEntity, LinkEntity } from '@/types/archive';
import { resolveCategory } from './categories';
import Tesseract, { createWorker } from 'tesseract.js';

export interface AnalysisResult {
  title: string;
  category: Category;
  aiSummary: string;
  extractedText: string;
  tags: string[];
  entities: DetectedEntities;
  confidenceScore: number;
}

export function getGeminiClient(customApiKey?: string): GoogleGenerativeAI | null {
  const key = customApiKey || process.env.GEMINI_API_KEY;
  if (!key || key.trim() === '') {
    return null;
  }
  return new GoogleGenerativeAI(key.trim());
}

export async function analyzeScreenshotWithGemini(
  imageBase64: string,
  mimeType: string = 'image/jpeg',
  apiKey?: string
): Promise<AnalysisResult> {
  const client = getGeminiClient(apiKey);
  if (!client) {
    throw new Error('GEMINI_API_KEY_NOT_CONFIGURED');
  }

  const prompt = `You are the OCR and visual intelligence engine for TRACE, an elite personal screenshot archive.
Analyze this screenshot thoroughly. Extract all visible text, identify entities, summarize its utility, and categorize it accurately.

CRITICAL CATEGORY RULES:
1. CODE & DEVELOPER: If the screenshot shows programming code (C++, Python, Java, JavaScript, TypeScript, C, C#, Go, Rust, HTML/CSS, SQL, terminal, GitHub, IDE, code editors like VS Code or Sublime Text, functions, algorithms, data structures), it MUST be categorized as 'Code'.
2. FOOD & DINING: Food delivery apps (Zomato, Swiggy, Uber Eats, DoorDash, Blinkit, Instamart, Zepto), food bills, restaurant receipts, orders, or menus -> 'Food'.
3. SHOPPING & PRODUCTS: E-commerce purchases, carts, product pages, shoes, clothing, electronics -> 'Shopping'.
4. DOCUMENTS: Official receipts, tax invoices, bills, contracts, term sheets, legal documents -> 'Documents'.
5. PLACES: Locations, Google Maps, hotels, Airbnb, travel stays, addresses -> 'Places'.
6. LEARNING: Research papers, formulas, educational slides, study notes, academic papers -> 'Learning'.
7. EVENTS: Conference passes, concert tickets, QR codes, flight boarding passes -> 'Events'.
8. CHATS: WhatsApp, Telegram, iMessage, Twitter DMs, chat conversations -> 'Chats'.
9. FINANCE: Banking apps, UPI transfers, Google Pay, PhonePe, Paytm, statements, crypto, investments -> 'Finance'.
10. HEALTH: Prescriptions, medical receipts, pharmacy bills, doctor advice, fitness tracking -> 'Health'.
11. DESIGN: Graphic design, typography specimens, UI wireframes, color palettes, Figma -> 'Design'.
12. SOCIAL MEDIA: Instagram, Twitter/X, Reddit, TikTok, LinkedIn posts, memes -> 'Social Media'.
13. ENTERTAINMENT: Movies, music streaming, YouTube, gaming clips, streaming -> 'Entertainment'.
14. IDEAS: High-level notes, quotes, brainstorms, concepts -> 'Ideas'.

PREDEFINED CATEGORIES:
['Code', 'Shopping', 'Places', 'Food', 'Documents', 'Learning', 'Events', 'Chats', 'Finance', 'Design', 'Health', 'Social Media', 'Entertainment', 'Ideas', 'Other']

DO NOT EVER USE 'Screenshots' AS A CATEGORY. TRACE is a screenshot archive, so naming a category 'Screenshots' is redundant and prohibited.
Do NOT use 'Other' unless the image is completely unrecognizable noise.

Return a valid JSON object matching this schema:
{
  "title": "A characterful, concise editorial title (max 8 words, specific to the content, not generic)",
  "category": "One of the predefined categories (e.g. 'Code', 'Food', 'Shopping', etc.)",
  "aiSummary": "A 1-2 sentence precise, factual summary of what was saved, why it matters, and any key numbers/names/instructions.",
  "extractedText": "Complete, verbatim OCR of all readable text in reading order",
  "tags": ["5 to 8 lowercase specific tags e.g. brand, product type, place, concept, topic"],
  "entities": {
    "prices": [
      { "amount": 2499, "currency": "INR or USD etc", "originalText": "₹2,499" }
    ],
    "links": [
      { "url": "https://...", "title": "detected link title", "domain": "domain.com" }
    ],
    "dates": [
      { "date": "YYYY-MM-DD or readable string", "context": "what this date is for e.g. event date, discount deadline" }
    ],
    "locations": ["Specific addresses, cities, venue names"],
    "people": ["Names of authors, senders, creators, doctors"],
    "sourceApp": "Name of app if visible e.g. VS Code, Sublime Text, Zomato, Swiggy, Instagram, WhatsApp, X, Safari, Amazon, Nike, Notes",
    "actionableItem": "Clear next action if any e.g. 'Use promo code TRACE20 before Sunday' or null"
  },
  "confidenceScore": 0.96
}
Ensure all JSON fields are populated accurately according to the image contents.`;

  const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9\+\-\.]+;base64,/, '');

  // Models to try in order
  const candidateModels = [
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash',
    'gemini-2.0-flash',
    'gemini-2.0-flash-exp',
    'gemini-1.5-pro-latest',
    'gemini-1.5-pro',
    'gemini-pro',
  ];

  let lastError: any = null;

  for (const modelName of candidateModels) {
    try {
      const model = client.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: cleanBase64,
            mimeType: mimeType || 'image/jpeg',
          },
        },
      ]);

      const text = result.response.text();
      const parsed = JSON.parse(text) as AnalysisResult;

      // Sanitize category using resolveCategory
      parsed.category = resolveCategory(parsed.category);

      return parsed;
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || '';
      if (errMsg.includes('404') || errMsg.includes('not found') || errMsg.includes('supported')) {
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('ALL_GEMINI_MODELS_FAILED');
}

/**
 * Intelligent classifier that takes OCR text (from Tesseract, SVG, or local extractor)
 * and assigns precise categories, entities, and summaries.
 */
export function classifyExtractedOcr(extractedText: string, fileName: string = ''): AnalysisResult {
  const textLower = extractedText.toLowerCase();
  const fileLower = fileName.toLowerCase();
  const combined = (extractedText + ' ' + fileName).toLowerCase();

  // Price entity extraction
  const prices: PriceEntity[] = [];
  const priceMatches = Array.from(extractedText.matchAll(/(?:₹|rs\.?|inr|\$|€|£)\s*([0-9,]+(?:\.[0-9]{2})?)/gi));
  for (const m of priceMatches) {
    const num = parseFloat(m[1].replace(/,/g, ''));
    if (!isNaN(num) && num > 0) {
      const curr = m[0].includes('$') ? 'USD' : (m[0].includes('€') ? 'EUR' : (m[0].includes('£') ? 'GBP' : 'INR'));
      prices.push({
        amount: num,
        currency: curr,
        originalText: m[0].trim(),
      });
    }
  }

  if (prices.length === 0) {
    const totalMatch = extractedText.match(/(?:total|amount paid|grand total|item total|subtotal)\s*[:\-]?\s*([0-9,]+(?:\.[0-9]{2})?)/i);
    if (totalMatch) {
      const num = parseFloat(totalMatch[1].replace(/,/g, ''));
      if (!isNaN(num) && num > 0) {
        prices.push({
          amount: num,
          currency: 'INR',
          originalText: `₹${num}`,
        });
      }
    }
  }

  // Link entity extraction
  const links: LinkEntity[] = [];
  const urlMatches = Array.from(extractedText.matchAll(/https?:\/\/[^\s]+/gi));
  for (const u of urlMatches) {
    try {
      const domain = new URL(u[0]).hostname;
      links.push({ url: u[0], domain, title: domain });
    } catch {
      links.push({ url: u[0], title: u[0] });
    }
  }

  // Date entity extraction
  const dates: DateEntity[] = [];
  const dateMatch = extractedText.match(/(?:\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})|(?:\d{4}[-/.]\d{1,2}[-/.]\d{1,2})|(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4})/i);
  if (dateMatch) {
    dates.push({ date: dateMatch[0], context: 'Detected in screenshot' });
  }

  // Location entity extraction
  const locations: string[] = [];
  const locationMatches = [
    'Greater Noida', 'Noida', 'Delhi', 'New Delhi', 'Mumbai', 'Bandra', 'Bangalore', 'Bengaluru',
    'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Gurgaon', 'Gurugram', 'San Francisco', 'New York'
  ];
  for (const loc of locationMatches) {
    if (combined.toLowerCase().includes(loc.toLowerCase())) {
      locations.push(loc);
    }
  }
  const streetMatch = extractedText.match(/(?:Sector\s*\d+|[A-Za-z0-9\s,-]+(?:Road|Street|Marg|Lane|Mart|Valley|Plaza|Mall))/i);
  if (streetMatch && !locations.some((l) => streetMatch[0].includes(l))) {
    const cleanStreet = streetMatch[0].trim().replace(/^[,-\s]+|[,-\s]+$/g, '');
    if (cleanStreet.length > 5 && cleanStreet.length < 50) {
      locations.push(cleanStreet);
    }
  }

  // Initialize result fields
  let category: Category = 'Other';
  let title = 'Archived Visual Capture';
  let aiSummary = 'Archived screenshot indexed into TRACE.';
  let sourceApp: string | undefined = undefined;
  const tags: string[] = [];
  let actionableItem: string | undefined = undefined;

  // =========================================================================
  // 1. FIRST & FOREMOST: CODE & SOFTWARE ENGINEERING (Category: 'Code')
  // Check code syntax first so code referencing food/products/messages is never misclassified!
  // =========================================================================
  const codeIndicators = [
    '#include', '<iostream>', '<vector>', '<string>', '<algorithm>', 'std::',
    'cout', 'cin', 'endl', 'printf', 'scanf', 'int main', 'return 0', 'return;',
    'while', 'for(', 'while(', 'if(', 'switch(', 'case ', 'break;',
    'def ', 'function', 'class ', 'interface ', 'struct ', 'enum ', 'namespace ',
    'import ', 'export ', 'const ', 'let ', 'var ', 'async ', 'await ',
    'console.log', 'print(', 'println', 'require(', 'nullptr', 'null',
    'sublime text', 'sublime', 'vscode', 'visual studio', 'pycharm', 'intellij',
    'eclipse', 'terminal', 'powershell', 'bash', 'zsh', 'github.com', 'gitlab.com',
    'armstrong', 'fibonacci', 'hashing', 'recursion', 'algorithm',
    'public static void', 'public class', 'void ', 'int ', 'char ', 'bool ',
    'double ', 'float ', 'long ', 'size_t', 'sizeof', '=>', '===', '!==',
    'SELECT ', 'FROM ', 'WHERE ', 'GROUP BY', 'ORDER BY',
    '<div>', '</span>', 'className=', '<script', '<!doctype',
    'git commit', 'git checkout', 'npm run', 'npm install', 'pip install', 'cargo run',
  ];

  const codeExtensionMatches = [
    '.cpp', '.c', '.h', '.hpp', '.py', '.java', '.ts', '.tsx', '.js', '.jsx',
    '.rs', '.go', '.rb', '.php', '.cs', '.html', '.css', '.json', '.sql', '.sh',
    '.kt', '.swift'
  ];

  const hasCodeExtension = codeExtensionMatches.some((ext) => combined.includes(ext));
  const hasCodeKeywords = codeIndicators.some((ind) => combined.includes(ind.toLowerCase()));
  const hasCodePatterns =
    /\b(cout|cin)\s*(<<|>>)/i.test(extractedText) ||
    /\b(while|for|if)\s*\([^)]*\)\s*\{/i.test(extractedText) ||
    /\b(return\s+\d+|return\s+[a-zA-Z_]+|return;)/i.test(extractedText) ||
    /#include\s*<[a-zA-Z_]+>/i.test(extractedText) ||
    /\b(last_digit|armstrong|original|hashing)\b/i.test(combined) ||
    /\b(sublime text|vs code|visual studio code)\b/i.test(combined) ||
    /\b(int|void|char|double|float|bool)\s+[a-zA-Z_0-9]+\s*(=|\()/i.test(extractedText);

  if (hasCodeExtension || hasCodeKeywords || hasCodePatterns) {
    category = 'Code';
    if (combined.includes('sublime')) {
      sourceApp = 'Sublime Text';
    } else if (combined.includes('vscode') || combined.includes('visual studio')) {
      sourceApp = 'VS Code';
    } else if (combined.includes('github')) {
      sourceApp = 'GitHub';
    } else {
      sourceApp = 'Code Editor / IDE';
    }

    if (combined.includes('armstrong')) {
      title = 'C++ Algorithm — Armstrong Number Verification';
      aiSummary = 'C++ implementation logic checking whether a given number equals the sum of its cubed digits (Armstrong number algorithm).';
      tags.push('c++', 'algorithm', 'armstrong', 'math', 'dsa', 'code');
    } else if (combined.includes('hashing')) {
      title = 'C++ Code Implementation — Hashing Logic';
      aiSummary = 'C++ source code demonstrating hash map and integer hashing data structure implementation.';
      tags.push('c++', 'dsa', 'hashing', 'data structures', 'code');
    } else if (combined.includes('recursion')) {
      title = 'Algorithm Implementation — Recursion Snippet';
      aiSummary = 'Programming snippet illustrating recursive function calls and base condition handling.';
      tags.push('recursion', 'algorithm', 'dsa', 'code');
    } else {
      const cleanName = fileName ? fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : '';
      title = cleanName && !cleanName.toLowerCase().includes('screenshot')
        ? `${cleanName} — Code Snippet`
        : 'Code Snippet & Architecture Implementation';
      aiSummary = 'Software development capture with programming logic, functions, and source code syntax.';
      tags.push('code', 'programming', 'developer', 'software', 'source code');
    }
    actionableItem = 'Review code structure, edge cases, and algorithmic complexity.';
  }

  // =========================================================================
  // 2. CHATS & MESSAGES (Category: 'Chats')
  // =========================================================================
  else if (
    combined.includes('whatsapp') ||
    combined.includes('telegram') ||
    combined.includes('imessage') ||
    combined.includes('typing...') ||
    combined.includes('voice message') ||
    combined.includes('read receipt') ||
    combined.includes('yesterday at') ||
    combined.includes('sent a photo')
  ) {
    category = 'Chats';
    sourceApp = combined.includes('whatsapp') ? 'WhatsApp' : (combined.includes('telegram') ? 'Telegram' : 'Messaging');
    title = `${sourceApp} Conversation Memo`;
    aiSummary = 'Personal conversation excerpt capturing shared recommendation, advice, or note.';
    tags.push('chats', 'messaging', sourceApp.toLowerCase(), 'social', 'notes');
  }

  // =========================================================================
  // 3. HEALTH & MEDICAL (Category: 'Health')
  // =========================================================================
  else if (
    combined.includes('prescription') ||
    combined.includes('pharmacy') ||
    combined.includes('dosage') ||
    combined.includes('tablets') ||
    combined.includes('capsules') ||
    combined.includes('dr.') ||
    combined.includes('rx') ||
    combined.includes('apollo pharmacy') ||
    combined.includes('mg tablet')
  ) {
    category = 'Health';
    sourceApp = 'Medical / Pharmacy';
    title = 'Medical Prescription & Pharmacy Record';
    aiSummary = 'Healthcare prescription outlining dosage instructions, medications, and pharmacy billing.';
    tags.push('health', 'prescription', 'pharmacy', 'medicine', 'doctor');
  }

  // =========================================================================
  // 4. EVENTS & TICKETS (Category: 'Events')
  // =========================================================================
  else if (
    combined.includes('admit one') ||
    combined.includes('boarding pass') ||
    combined.includes('ticket id') ||
    combined.includes('vip pass') ||
    combined.includes('conference pass') ||
    combined.includes('summit 20') ||
    combined.includes('concert ticket') ||
    (combined.includes('ticket') && (combined.includes('seat') || combined.includes('row') || combined.includes('gate')))
  ) {
    category = 'Events';
    sourceApp = 'Ticket / Event';
    title = 'Admission Ticket & Event Access Pass';
    aiSummary = 'Official event access pass or travel boarding credential with venue and seating designation.';
    tags.push('events', 'ticket', 'pass', 'admission', 'venue');
    actionableItem = 'Save ticket or QR code for easy access at the venue.';
  }

  // =========================================================================
  // 5. FOOD & DINING (Category: 'Food')
  // =========================================================================
  else if (
    combined.includes('domino') ||
    combined.includes('pizza') ||
    combined.includes('zomato') ||
    combined.includes('swiggy') ||
    combined.includes('blinkit') ||
    combined.includes('zepto') ||
    combined.includes('ubereats') ||
    combined.includes('uber eats') ||
    combined.includes('doordash') ||
    combined.includes('instamart') ||
    combined.includes('mcdonald') ||
    combined.includes('kfc') ||
    combined.includes('subway') ||
    combined.includes('burger king') ||
    combined.includes('starbucks') ||
    combined.includes('haldiram') ||
    combined.includes('biryani') ||
    combined.includes('burger') ||
    combined.includes('croissant') ||
    combined.includes('bakery') ||
    combined.includes('choco lava') ||
    combined.includes('lava cake') ||
    combined.includes('cake') ||
    combined.includes('dessert') ||
    combined.includes('food') ||
    combined.includes('order summary') ||
    combined.includes('your order') ||
    combined.includes('order is on the way') ||
    combined.includes('restaurant charges') ||
    combined.includes('item total') ||
    combined.includes('order delivered') ||
    combined.includes('packaging charges') ||
    combined.includes('delivery tip') ||
    combined.includes('dining bill') ||
    (combined.includes('restaurant') && (combined.includes('menu') || combined.includes('bill') || combined.includes('order'))) ||
    (combined.includes('cafe') && (combined.includes('coffee') || combined.includes('menu') || combined.includes('roasters')))
  ) {
    category = 'Food';
    if (combined.includes('domino')) sourceApp = "Domino's Pizza";
    else if (combined.includes('pizza hut')) sourceApp = 'Pizza Hut';
    else if (combined.includes('zomato')) sourceApp = 'Zomato';
    else if (combined.includes('swiggy')) sourceApp = 'Swiggy';
    else if (combined.includes('mcdonald')) sourceApp = "McDonald's";
    else if (combined.includes('kfc')) sourceApp = 'KFC';
    else if (combined.includes('subway')) sourceApp = 'Subway';
    else if (combined.includes('burger king')) sourceApp = 'Burger King';
    else if (combined.includes('starbucks')) sourceApp = 'Starbucks';
    else if (combined.includes('blinkit')) sourceApp = 'Blinkit';
    else if (combined.includes('instamart')) sourceApp = 'Instamart';
    else if (combined.includes('zepto')) sourceApp = 'Zepto';
    else sourceApp = 'Food & Dining';

    // Item detection
    let detectedItem = '';
    if (combined.includes('choco lava')) detectedItem = 'Choco Lava Cake';
    else if (combined.includes('pizza')) detectedItem = 'Pizza';
    else if (combined.includes('biryani')) detectedItem = 'Biryani';
    else if (combined.includes('burger')) detectedItem = 'Burger';

    const priceText = prices[0]?.originalText ? ` — ${prices[0].originalText}` : '';
    title = detectedItem
      ? `${sourceApp}: ${detectedItem}${priceText}`
      : `${sourceApp} Order Summary${priceText}`;
    aiSummary = `${sourceApp} order receipt showing itemized charges, delivery destination${locations[0] ? ` (${locations[0]})` : ''}, and payment confirmation.`;
    tags.push('food', sourceApp.toLowerCase().replace(/['\s]+/g, ''), 'order', 'receipt', 'bill', 'dining');
    if (detectedItem) tags.push(detectedItem.toLowerCase());
    actionableItem = 'Verify delivery arrival and save invoice for monthly expense tracking.';
  }

  // =========================================================================
  // 6. DOCUMENTS & FORMAL INVOICES (Category: 'Documents')
  // =========================================================================
  else if (
    combined.includes('tax invoice') ||
    combined.includes('gstin') ||
    combined.includes('term sheet') ||
    combined.includes('confidential agreement') ||
    combined.includes('contract') ||
    combined.includes('valuation') ||
    combined.includes('bill of exchange') ||
    (combined.includes('invoice') && !combined.includes('cart'))
  ) {
    category = 'Documents';
    sourceApp = 'Document / Invoice';
    title = 'Official Document & Invoice Summary';
    aiSummary = 'Formal legal or tax document outlining financial obligations and terms.';
    tags.push('documents', 'finance', 'invoice', 'legal', 'tax');
  }

  // =========================================================================
  // 7. SHOPPING & PRODUCTS (Category: 'Shopping')
  // =========================================================================
  else if (
    combined.includes('add to bag') ||
    combined.includes('add to cart') ||
    combined.includes('checkout') ||
    combined.includes('nike') ||
    combined.includes('amazon') ||
    combined.includes('flipkart') ||
    combined.includes('myntra') ||
    combined.includes('zara') ||
    combined.includes('sneaker') ||
    combined.includes('promo code') ||
    combined.includes('discount code') ||
    combined.includes('retail price') ||
    combined.includes('mrp')
  ) {
    category = 'Shopping';
    if (combined.includes('nike')) sourceApp = 'Nike';
    else if (combined.includes('amazon')) sourceApp = 'Amazon';
    else if (combined.includes('flipkart')) sourceApp = 'Flipkart';
    else if (combined.includes('myntra')) sourceApp = 'Myntra';
    else sourceApp = 'E-Commerce';

    const priceText = prices[0]?.originalText ? ` (${prices[0].originalText})` : '';
    title = `Saved Product Checkout & Pricing${priceText}`;
    aiSummary = 'Storefront product capture showing pricing, item details, and checkout promotion.';
    tags.push('shopping', 'cart', 'retail', 'products', 'wishlist');
    actionableItem = 'Review cart discounts and size availability before purchasing.';
  }

  // =========================================================================
  // 8. PLACES & TRAVEL (Category: 'Places')
  // =========================================================================
  else if (
    combined.includes('google maps') ||
    combined.includes('maps.google') ||
    combined.includes('airbnb') ||
    combined.includes('superhost') ||
    combined.includes('check-in') ||
    combined.includes('hotel reservation') ||
    combined.includes('flight booking') ||
    combined.includes('resort')
  ) {
    category = 'Places';
    sourceApp = combined.includes('airbnb') ? 'Airbnb' : (combined.includes('maps') ? 'Google Maps' : 'Travel');
    title = 'Saved Location & Travel Memo';
    aiSummary = 'Saved destination or accommodation with location, host details, and visiting instructions.';
    tags.push('places', 'travel', 'location', 'destination', 'stay');
  }

  // =========================================================================
  // 9. LEARNING & ACADEMIC (Category: 'Learning')
  // =========================================================================
  else if (
    combined.includes('arxiv') ||
    combined.includes('abstract:') ||
    combined.includes('theorem') ||
    combined.includes('formula') ||
    combined.includes('machine learning') ||
    combined.includes('neural network') ||
    combined.includes('transformer') ||
    combined.includes('deep learning')
  ) {
    category = 'Learning';
    sourceApp = 'Research / PDF';
    title = 'Academic Research Note & Formulas';
    aiSummary = 'Educational reference capture with mathematical equations, abstract summary, and paper citations.';
    tags.push('learning', 'research', 'paper', 'notes', 'study');
  }

  // =========================================================================
  // 10. DESIGN & TYPOGRAPHY (Category: 'Design')
  // =========================================================================
  else if (
    combined.includes('figma') ||
    combined.includes('typography') ||
    combined.includes('grid system') ||
    combined.includes('color palette') ||
    combined.includes('wireframe') ||
    combined.includes('font specimen')
  ) {
    category = 'Design';
    sourceApp = 'Design Tool';
    title = 'Design System & Typography Specimen';
    aiSummary = 'Creative inspiration capturing layout grid, typographic hierarchy, and visual direction.';
    tags.push('design', 'typography', 'inspiration', 'poster', 'layout');
  }

  // =========================================================================
  // 11. FINANCE & PAYMENTS (Category: 'Finance')
  // =========================================================================
  else if (
    combined.includes('upi') ||
    combined.includes('gpay') ||
    combined.includes('phonepe') ||
    combined.includes('paytm') ||
    combined.includes('debited') ||
    combined.includes('credited') ||
    combined.includes('bank statement') ||
    combined.includes('account balance')
  ) {
    category = 'Finance';
    sourceApp = 'Banking / UPI';
    title = 'Financial Transaction & Payment Record';
    aiSummary = 'Digital payment confirmation or bank transaction record.';
    tags.push('finance', 'banking', 'payment', 'upi', 'transaction');
  }

  // =========================================================================
  // 12. SOCIAL MEDIA (Category: 'Social Media')
  // =========================================================================
  else if (
    combined.includes('instagram') ||
    combined.includes('twitter') ||
    combined.includes('x.com') ||
    combined.includes('tiktok') ||
    combined.includes('reddit') ||
    combined.includes('linkedin') ||
    combined.includes('retweet') ||
    combined.includes('upvote') ||
    combined.includes('reels')
  ) {
    category = 'Social Media';
    sourceApp = 'Social Media';
    title = 'Social Media Post Capture';
    aiSummary = 'Social media post excerpt with creator commentary and community engagement.';
    tags.push('social media', 'post', 'engagement', 'content');
  }

  // =========================================================================
  // 13. ENTERTAINMENT & GAMING (Category: 'Entertainment')
  // =========================================================================
  else if (
    combined.includes('steam') ||
    combined.includes('playstation') ||
    combined.includes('xbox') ||
    combined.includes('gameplay') ||
    combined.includes('spotify') ||
    combined.includes('netflix') ||
    combined.includes('youtube') ||
    combined.includes('movie') ||
    combined.includes('soundtrack')
  ) {
    category = 'Entertainment';
    title = 'Media & Entertainment Capture';
    aiSummary = 'Entertainment bookmark capturing streaming, audio, or gameplay highlights.';
    tags.push('entertainment', 'media', 'streaming');
  }

  // =========================================================================
  // 14. INFERRED SPECIFIC CATEGORY OR FALLBACK TO 'Other'
  // NOTE: 'Screenshots' is NEVER used as a category!
  // =========================================================================
  if (category === 'Other') {
    const cleanFileName = fileName
      ? fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').replace(/\d{8,}/g, '').trim()
      : '';

    const fn = cleanFileName.toLowerCase();
    if (fn.includes('music') || fn.includes('song')) {
      category = 'Entertainment';
      tags.push('music', 'audio');
    } else if (fn.includes('recipe')) {
      category = 'Food';
      tags.push('recipe', 'cooking');
    } else if (fn.includes('quote')) {
      category = 'Ideas';
      tags.push('quote', 'wisdom');
    } else if (fn.includes('code') || fn.includes('dev') || fn.includes('cpp') || fn.includes('dsa')) {
      category = 'Code';
      tags.push('code', 'developer');
    } else if (cleanFileName.length > 2 && cleanFileName.length < 24 && !cleanFileName.toLowerCase().includes('screenshot')) {
      // Use clean capitalized name as custom category
      category = cleanFileName.charAt(0).toUpperCase() + cleanFileName.slice(1);
      tags.push(cleanFileName.toLowerCase());
    } else {
      // Clean fallback is always 'Other' — NEVER 'Screenshots'!
      category = 'Other';
      tags.push('archived', 'capture');
    }

    const readableName = cleanFileName && !cleanFileName.toLowerCase().includes('screenshot')
      ? cleanFileName
      : (category !== 'Other' ? `${category} Capture` : 'Archived Visual Capture');

    title = readableName.length > 0
      ? `Saved: ${readableName.substring(0, 40)}`
      : 'Archived Visual Capture';
    aiSummary = `Visual capture saved on ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}. Indexed into TRACE personal archive.`;
  }

  // Final resolution through category normalizer
  category = resolveCategory(category);

  return {
    title,
    category,
    aiSummary,
    extractedText: extractedText || `Screenshot capture from device (${fileName || 'visual file'}).`,
    tags,
    entities: {
      prices,
      links,
      dates,
      locations,
      people: [],
      sourceApp,
      actionableItem,
    },
    confidenceScore: category !== 'Other' ? 0.95 : 0.82,
  };
}

let cachedOcrWorker: any = null;

async function getOcrWorker() {
  if (!cachedOcrWorker) {
    cachedOcrWorker = await createWorker('eng');
  }
  return cachedOcrWorker;
}

/**
 * Local analysis engine: extracts text from SVG/data payloads OR runs local
 * Tesseract OCR on PNG/JPEG images, then classifies with deep heuristic rules.
 */
export async function analyzeScreenshotLocally(
  imageBase64: string,
  fileName: string = ''
): Promise<AnalysisResult> {
  let ocrText = '';

  // 1. If SVG representation, decode the actual embedded text tags!
  if (imageBase64.includes('data:image/svg+xml')) {
    try {
      const decoded = decodeURIComponent(imageBase64.replace(/^data:image\/svg\+xml(?:;charset=[^,]*)?,/, ''));
      const textMatches = Array.from(decoded.matchAll(/<text[^>]*>([^<]+)<\/text>/gi)).map((m) => m[1]);
      if (textMatches.length > 0) {
        ocrText = textMatches.join(' ');
      }
    } catch {}
  }
  // 2. If real image (PNG, JPEG, WEBP), run Tesseract local OCR!
  else if (imageBase64.startsWith('data:image/')) {
    try {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9\+\-\.]+;base64,/, '');
      const buffer = Buffer.from(cleanBase64, 'base64');
      if (buffer.length > 0) {
        try {
          const worker = await getOcrWorker();
          const { data } = await worker.recognize(buffer);
          if (data && data.text) {
            ocrText = data.text.trim();
          }
        } catch (workerErr) {
          console.warn('Worker OCR attempt notice, trying direct recognize:', workerErr);
          const { data } = await Tesseract.recognize(buffer, 'eng');
          if (data && data.text) {
            ocrText = data.text.trim();
          }
        }
      }
    } catch (ocrErr: any) {
      console.warn('Local OCR execution notice:', ocrErr?.message || ocrErr);
    }
  }

  return classifyExtractedOcr(ocrText, fileName);
}
