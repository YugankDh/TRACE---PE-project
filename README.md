# TRACE — An AI-Powered Personal Screenshot Archive

> *"Find what you forgot you saved."*

TRACE is an intelligent, editorial visual archive that transforms personal screenshot chaos into a structured, searchable, and conversational personal knowledge base.

---

## ✦ Design Philosophy

TRACE intentionally diverges from generic AI SaaS dashboards, saturated purple gradients, and generic cards. It features an original, premium editorial visual identity:

- **Palette**: Tactile warm paper (`#FBFBFA` / `#F5F4EE`) in light mode, deep carbon obsidian (`#0D0D0C` / `#161615`) in dark mode, and restrained electric lime (`#D4F63D`) used sparingly for critical highlights, badges, and prices.
- **Typography**: High-craft editorial serif (`Newsreader` / `Instrument Serif`) paired with crisp modern sans-serif (`Plus Jakarta Sans`) and tabular monospace (`JetBrains Mono`).
- **Tactile Details**: Fine subtle paper grain overlay, razor-thin borders, asymmetric hierarchy, and micro-animations.
- **Realistic Seed Archive**: Pre-loaded with 10 authentic visual captures (Nike x Jacquemus drop, Bandra West coffee recommendation, arXiv Transformer paper excerpt, Moscone Center VIP event pass, Series Seed term sheet, Swiss poster typography analysis, and mom's cardamom chai recipe).

---

## ✦ Core Features

### 1. The Archive (`/`)
- **Multi-Layout Canvas**: Switch effortlessly between responsive **Grid**, **Masonry**, and **List** views.
- **Dynamic Filtering**: Filter across 10 distinct categories (*Shopping, Places, Learning, Events, Ideas, Documents, Design, Chats, Health, Other*).
- **Flexible Sorting**: Sort by *Recent First*, *Oldest*, *AI Confidence Score*, or *Alphabetical*.
- **Batch Actions**: Multi-select screenshots for batch deletion or tagging.
- **Favorite Starring**: One-click star/pin memories to top.

### 2. Smart Upload (`⌘U`)
- **Drag-and-Drop Multi-Upload**: Drop PNG, JPG, or WEBP screenshots directly.
- **Visual Analysis Pipeline**: Real-time progress indicators (*Scanning visual elements → Extracting verbatim OCR → Identifying prices, dates & links → Categorizing into collections*).
- **Dual Engine Architecture**: Directly calls Google Gemini 1.5 Flash when `GEMINI_API_KEY` is provided; seamlessly falls back to an intelligent local heuristic extractor for zero-config offline usage.

### 3. AI Natural Language Search (`⌘K`)
- **Intuitive Semantic Retrieval**: Handles complex natural language queries:
  - *"The shoes I saved under 3000"* → Extracts price threshold `<= ₹3,000`, finds Jacquemus × Nike Air Humara (`₹2,499`), and explains the match.
  - *"That restaurant someone sent me"* → Detects chat context, sender (*Aarav Mehta*), and location (*Subko Coffee, Bandra West*).
  - *"Notes related to machine learning"* → Finds *Attention Is All You Need* paper and formula notes.
  - *"Events happening next month"* → Temporal filter detects *Global AI Summit 2026* pass on Dec 18, 2026.
- **Match Explanations**: Every result card explicitly details *why* it matched (OCR text, entity type, price condition, or category).
- **Entity Filter Tabs**: Filter results by *Prices, Locations, Dates, or Links*.

### 4. TRACE Assistant (Grounded AI Chat)
- **Archive-Grounded Companion**: Answers queries strictly citing verified data from your saved screenshots.
- **Interactive Citation Cards**: Assistant responses render direct citation cards with thumbnails; clicking opens the deep-inspection modal.
- **Follow-Up Suggestions**: Dynamic prompts guiding user exploration.
- **Zero-Hallucination Safe Fallback**: Transparently reports when queries have no matches in the archive.

### 5. Smart Collections
- **Core Curated Spaces**: Automatic sorting into Shopping, Places, Learning, Events, Ideas, Documents, Design, Chats, and Health.
- **Custom Topic Stacks**: Create and assign custom tags and collections (e.g. *Tech Stack*, *Wishlist*, *City Guide*).

### 6. Screenshot Detail & Memory Inspector
- **Full Zoom & Inspect**: Inspect high-resolution screenshots with 100% zoom toggle.
- **Verbatim OCR Extraction**: View full extracted text with one-click clipboard copy.
- **Detected Entity Chips**:
  - **Prices & Currency**: Highlighted in electric lime with original markdown context.
  - **Clickable Links**: Direct URLs with domain favicons and external navigation.
  - **Dates & Context**: Extracted deadlines, drop dates, and trip schedules.
  - **Locations**: Specific street addresses, venues, and map links.
  - **Actionable Item Banner**: Highlights urgent to-dos (*"Use promo code SNEAKERDROP26 at checkout"*).
- **Editable Metadata**: Edit titles, tags, and personal memory notes.
- **Related Memories Engine**: Graph-based recommendations suggesting connected screenshots by topic, entity, and category.

### 7. Settings & Integrations
- **Gemini API Configuration**: Paste your Google AI Studio key; persists in local storage and executes live Gemini 1.5 Flash JSON requests.
- **Supabase Cloud Ready**: Includes copyable PostgreSQL schema with GIN full-text index and `uuid-ossp` extensions.
- **Data Mobility**: Export complete archive as JSON or reset to curated sample archive with one click.

---

## ✦ Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm or pnpm

### Quick Start
```bash
# Clone the repository
git clone <repo-url>
cd "TRACE - PE project"

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables (Optional)
Create a `.env.local` file:
```env
# Google Gemini API Key (optional - works in demo mode if omitted)
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Credentials (optional - for cloud database & storage)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## ✦ Keyboard Shortcuts
| Shortcut | Action |
| :--- | :--- |
| `⌘K` / `Ctrl+K` | Open Command Palette & Quick Search |
| `⌘U` / `Ctrl+U` | Open Smart Upload Modal |
| `1` | Switch to Archive View |
| `2` | Switch to AI Search |
| `3` | Switch to TRACE Assistant |
| `4` | Switch to Collections |
| `Esc` | Close any open modal |

---

## ✦ Tech Stack
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions, Route Handlers)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom paper/ink palette
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Vision & LLM**: Google Gemini 1.5 Flash (`@google/generative-ai`)
- **Storage**: Browser LocalStorage / IndexedDB with optional [Supabase](https://supabase.com/) PostgreSQL adapter
