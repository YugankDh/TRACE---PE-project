/**
 * Generates beautiful, authentic-looking SVG mock screenshot Data URLs.
 * These represent real app interfaces (iOS SNKRS app, WhatsApp chat, arXiv paper, Ticketmaster event pass, Stripe, etc.)
 * so the archive looks visually exceptional immediately without depending on external image hosts.
 */

function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_SCREENSHOTS = {
  // 1. Nike x Jacquemus Sneaker drop (iOS App screenshot)
  sneaker: svgToDataUrl(`
<svg width="400" height="700" viewBox="0 0 400 700" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#141414"/>
      <stop offset="100%" stop-color="#080808"/>
    </linearGradient>
    <linearGradient id="shoeG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8B5CF6"/>
      <stop offset="50%" stop-color="#A5C91E"/>
      <stop offset="100%" stop-color="#3D4512"/>
    </linearGradient>
  </defs>
  <!-- Screen background -->
  <rect width="400" height="700" fill="url(#bg1)"/>
  
  <!-- iOS Status Bar -->
  <text x="28" y="32" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-weight="600" font-size="13">9:41</text>
  <circle cx="360" cy="28" r="4" fill="#FFFFFF"/>
  <rect x="342" y="24" width="10" height="8" rx="1" fill="#FFFFFF"/>
  <rect x="325" y="26" width="12" height="6" rx="1" fill="#FFFFFF"/>
  
  <!-- App Header -->
  <text x="24" y="75" fill="#888888" font-family="-apple-system, sans-serif" font-size="11" letter-spacing="2">SNKRS SPECIAL RELEASE</text>
  <text x="24" y="105" fill="#FFFFFF" font-family="Georgia, serif" font-weight="bold" font-size="24">Jacquemus × Nike</text>
  <text x="24" y="128" fill="#A78BFA" font-family="-apple-system, sans-serif" font-weight="600" font-size="14">Air Humara LX 'Ale Brown'</text>
  
  <!-- Product Image Container -->
  <rect x="24" y="145" width="352" height="280" rx="16" fill="#1C1C1E" stroke="#2C2C2E" stroke-width="1"/>
  
  <!-- Stylized Sneaker Silhouette -->
  <path d="M 60 310 C 90 280, 140 250, 180 260 C 220 270, 260 250, 310 270 C 335 280, 345 320, 310 335 C 270 350, 220 345, 170 345 C 120 345, 75 340, 60 310 Z" fill="url(#shoeG)"/>
  <path d="M 120 265 L 160 295 M 150 260 L 190 290 M 180 255 L 220 285" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
  <circle cx="280" cy="305" r="8" fill="#FFFFFF" opacity="0.9"/>
  <text x="200" y="405" text-anchor="middle" fill="#777777" font-family="-apple-system, sans-serif" font-size="11">Limited Allocation • In Stock</text>
  
  <!-- Details & Price -->
  <rect x="24" y="445" width="352" height="150" rx="12" fill="#18181A" stroke="#252528"/>
  <text x="44" y="480" fill="#999999" font-family="-apple-system, sans-serif" font-size="12">Retail Price</text>
  <text x="44" y="515" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-weight="bold" font-size="28">₹2,499</text>
  <text x="145" y="512" fill="#777777" font-family="-apple-system, sans-serif" font-size="13" text-decoration="line-through">₹3,499</text>
  <rect x="250" y="492" width="105" height="26" rx="6" fill="#8B5CF6" fill-opacity="0.15"/>
  <text x="302" y="509" text-anchor="middle" fill="#A78BFA" font-family="-apple-system, sans-serif" font-weight="bold" font-size="11">SAVE 28%</text>
  
  <text x="44" y="555" fill="#BBBBBB" font-family="-apple-system, sans-serif" font-size="12">Store: Nike Flagship Store &amp; SNKRS App</text>
  <text x="44" y="575" fill="#777777" font-family="-apple-system, sans-serif" font-size="11">Code: SNEAKERDROP26 • Verified on Cart</text>

  <!-- CTA Button -->
  <rect x="24" y="620" width="352" height="50" rx="12" fill="#8B5CF6"/>
  <text x="200" y="652" text-anchor="middle" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-weight="bold" font-size="15">NOTIFY ME &amp; BUY</text>
</svg>`),

  // 2. WhatsApp chat with Mumbai restaurant recommendation
  restaurant: svgToDataUrl(`
<svg width="400" height="700" viewBox="0 0 400 700" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="waHeader" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#128C7E"/>
      <stop offset="100%" stop-color="#075E54"/>
    </linearGradient>
  </defs>
  <rect width="400" height="700" fill="#EFEAE2"/>
  
  <!-- WhatsApp Header -->
  <rect width="400" height="85" fill="url(#waHeader)"/>
  <circle cx="45" cy="48" r="18" fill="#25D366"/>
  <text x="45" y="54" text-anchor="middle" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-weight="bold" font-size="14">A</text>
  <text x="75" y="44" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-weight="bold" font-size="16">Aarav Mehta</text>
  <text x="75" y="62" fill="#C8E6C9" font-family="-apple-system, sans-serif" font-size="12">online</text>
  
  <!-- Incoming Chat Bubble 1 -->
  <rect x="18" y="115" width="310" height="75" rx="10" fill="#FFFFFF"/>
  <text x="32" y="142" fill="#111111" font-family="-apple-system, sans-serif" font-size="13.5">Bro you HAVE to check out Subko Coffee</text>
  <text x="32" y="162" fill="#111111" font-family="-apple-system, sans-serif" font-size="13.5">in Bandra West! Best sourdough croissant.</text>
  <text x="290" y="180" text-anchor="end" fill="#888888" font-family="-apple-system, sans-serif" font-size="10">14:21</text>
  
  <!-- Incoming Chat Bubble 2 with Location Card -->
  <rect x="18" y="205" width="320" height="230" rx="10" fill="#FFFFFF"/>
  <rect x="30" y="218" width="296" height="110" rx="8" fill="#E3F2FD"/>
  <text x="45" y="250" fill="#1565C0" font-family="-apple-system, sans-serif" font-weight="bold" font-size="14">📍 Subko Coffee Roasters</text>
  <text x="45" y="272" fill="#455A64" font-family="-apple-system, sans-serif" font-size="12">Mary Lodge, Ranwar Village, Bandra West</text>
  <text x="45" y="292" fill="#455A64" font-family="-apple-system, sans-serif" font-size="12">Mumbai, Maharashtra 400050</text>
  <text x="45" y="314" fill="#1976D2" font-family="-apple-system, sans-serif" font-size="11">Open daily: 7:30 AM – 10:00 PM</text>
  
  <text x="30" y="355" fill="#222222" font-family="-apple-system, sans-serif" font-size="13">Wifi: SubkoGuest • Pass: roastcoffee2026</text>
  <text x="30" y="380" fill="#2E7D32" font-family="-apple-system, sans-serif" font-weight="600" font-size="12.5">Must try: Podi Toast &amp; Lavender Cold Brew</text>
  <text x="30" y="415" fill="#1976D2" font-family="-apple-system, sans-serif" font-size="12">maps.google.com/?q=Subko+Coffee+Bandra</text>
  <text x="305" y="425" text-anchor="end" fill="#888888" font-family="-apple-system, sans-serif" font-size="10">14:22</text>
  
  <!-- My reply -->
  <rect x="130" y="455" width="250" height="55" rx="10" fill="#DCF8C6"/>
  <text x="145" y="480" fill="#111111" font-family="-apple-system, sans-serif" font-size="13.5">Saved! Adding to my weekend list.</text>
  <text x="145" y="500" fill="#111111" font-family="-apple-system, sans-serif" font-size="13.5">Thanks man 🙌</text>
  <text x="360" y="502" text-anchor="end" fill="#555555" font-family="-apple-system, sans-serif" font-size="10">14:24 ✓✓</text>
</svg>`),

  // 3. Machine Learning Research Paper excerpt (arXiv)
  machineLearning: svgToDataUrl(`
<svg width="400" height="700" viewBox="0 0 400 700" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="700" fill="#FAFAFA"/>
  <rect x="0" y="0" width="400" height="40" fill="#B31B1B"/>
  <text x="20" y="26" fill="#FFFFFF" font-family="Georgia, serif" font-weight="bold" font-size="16">arXiv:1706.03762v7 [cs.CL]</text>
  
  <!-- Paper Header -->
  <text x="24" y="80" fill="#111111" font-family="Georgia, serif" font-weight="bold" font-size="20">Attention Is All You Need</text>
  <text x="24" y="105" fill="#555555" font-family="Helvetica, sans-serif" font-size="11">Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit...</text>
  <text x="24" y="122" fill="#0066CC" font-family="monospace" font-size="10">Google Brain • Google Research • Univ of Toronto</text>
  
  <!-- Abstract Box -->
  <rect x="20" y="145" width="360" height="185" rx="6" fill="#F0F4F8" stroke="#D0DCE5"/>
  <text x="35" y="172" fill="#222222" font-family="Helvetica, sans-serif" font-weight="bold" font-size="12">Abstract</text>
  <text x="35" y="196" fill="#333333" font-family="Georgia, serif" font-size="11.5">The dominant sequence transduction models are based on</text>
  <text x="35" y="214" fill="#333333" font-family="Georgia, serif" font-size="11.5">complex recurrent or convolutional neural networks. We propose</text>
  <text x="35" y="232" fill="#333333" font-family="Georgia, serif" font-size="11.5">the Transformer, a model architecture eschewing recurrence</text>
  <text x="35" y="250" fill="#333333" font-family="Georgia, serif" font-size="11.5">and relying entirely on an attention mechanism to draw</text>
  <text x="35" y="268" fill="#333333" font-family="Georgia, serif" font-size="11.5">global dependencies between input and output.</text>
  <text x="35" y="305" fill="#B31B1B" font-family="monospace" font-size="11">Key metric: 28.4 BLEU on WMT 2014 Eng-to-German</text>
  
  <!-- Formula Diagram -->
  <rect x="20" y="345" width="360" height="150" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <text x="35" y="375" fill="#000000" font-family="Georgia, serif" font-style="italic" font-size="14">Scaled Dot-Product Attention Equation:</text>
  <rect x="35" y="395" width="330" height="45" rx="4" fill="#F8FAFC"/>
  <text x="200" y="425" text-anchor="middle" fill="#0F172A" font-family="monospace" font-weight="bold" font-size="14">Attention(Q, K, V) = softmax(Q·Kᵀ / √dₖ) V</text>
  <text x="35" y="470" fill="#64748B" font-family="Helvetica, sans-serif" font-size="11">dₖ = dimension of query and key vectors (typically 64)</text>

  <!-- Handwritten annotations / Highlighter effect -->
  <rect x="20" y="515" width="360" height="90" rx="6" fill="#FEF9C3" stroke="#FDE047"/>
  <text x="35" y="542" fill="#854D0E" font-family="-apple-system, sans-serif" font-weight="bold" font-size="12">📝 My Personal Notes (Exam Review):</text>
  <text x="35" y="565" fill="#713F12" font-family="-apple-system, sans-serif" font-size="11.5">• Multi-head attention allows model to jointly attend to info</text>
  <text x="35" y="585" fill="#713F12" font-family="-apple-system, sans-serif" font-size="11.5">• Self-attention layers compute in O(1) sequential operations!</text>
</svg>`),

  // 4. Ticketmaster Event Ticket (Global AI Summit - Next Month)
  event: svgToDataUrl(`
<svg width="400" height="700" viewBox="0 0 400 700" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ticketG" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#020024"/>
      <stop offset="60%" stop-color="#090979"/>
      <stop offset="100%" stop-color="#00d4ff"/>
    </linearGradient>
  </defs>
  <rect width="400" height="700" fill="#0D0D11"/>
  
  <!-- Ticket Body -->
  <rect x="24" y="35" width="352" height="630" rx="20" fill="#181822" stroke="#2B2B3D"/>
  
  <!-- Event Top Banner -->
  <rect x="24" y="35" width="352" height="150" rx="20" fill="url(#ticketG)"/>
  <text x="44" y="70" fill="#00D4FF" font-family="-apple-system, sans-serif" font-weight="600" font-size="12" letter-spacing="2">OFFICIAL VIP ADMISSION PASS</text>
  <text x="44" y="105" fill="#FFFFFF" font-family="Georgia, serif" font-weight="bold" font-size="22">Global AI Summit 2026</text>
  <text x="44" y="130" fill="#E0F7FA" font-family="-apple-system, sans-serif" font-size="13">The Next Horizon of Autonomous Agents</text>
  <text x="44" y="155" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-weight="bold" font-size="14">📅 DEC 18, 2026 • 09:30 AM PST</text>
  
  <!-- Divider punch hole -->
  <line x1="24" y1="210" x2="376" y2="210" stroke="#2B2B3D" stroke-width="2" stroke-dasharray="8 8"/>
  <circle cx="24" cy="210" r="14" fill="#0D0D11"/>
  <circle cx="376" cy="210" r="14" fill="#0D0D11"/>
  
  <!-- Event Details -->
  <text x="44" y="250" fill="#8888A0" font-family="-apple-system, sans-serif" font-size="11">VENUE &amp; STAGE</text>
  <text x="44" y="275" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-weight="bold" font-size="16">Moscone Center West, Main Hall A</text>
  <text x="44" y="295" fill="#AAAAAA" font-family="-apple-system, sans-serif" font-size="12">747 Howard St, San Francisco, CA 94103</text>
  
  <text x="44" y="340" fill="#8888A0" font-family="-apple-system, sans-serif" font-size="11">ATTENDEE / TICKET ID</text>
  <text x="44" y="365" fill="#FFFFFF" font-family="monospace" font-weight="bold" font-size="15">GAIS-2026-9941-VIP</text>
  <text x="44" y="385" fill="#A78BFA" font-family="-apple-system, sans-serif" font-weight="600" font-size="12">Seat: Row C • Seat 14 • All Access Track</text>

  <!-- Mock QR Code -->
  <rect x="110" y="420" width="180" height="180" rx="10" fill="#FFFFFF"/>
  <!-- QR pattern details -->
  <rect x="125" y="435" width="40" height="40" fill="#000000"/>
  <rect x="133" y="443" width="24" height="24" fill="#FFFFFF"/>
  <rect x="139" y="449" width="12" height="12" fill="#000000"/>
  <rect x="235" y="435" width="40" height="40" fill="#000000"/>
  <rect x="243" y="443" width="24" height="24" fill="#FFFFFF"/>
  <rect x="249" y="449" width="12" height="12" fill="#000000"/>
  <rect x="125" y="545" width="40" height="40" fill="#000000"/>
  <rect x="133" y="553" width="24" height="24" fill="#FFFFFF"/>
  <rect x="139" y="559" width="12" height="12" fill="#000000"/>
  <!-- Random QR dots -->
  <rect x="180" y="440" width="12" height="12" fill="#000000"/>
  <rect x="200" y="460" width="16" height="8" fill="#000000"/>
  <rect x="180" y="480" width="25" height="15" fill="#000000"/>
  <rect x="220" y="500" width="12" height="30" fill="#000000"/>
  <rect x="180" y="530" width="30" height="15" fill="#000000"/>
  <rect x="230" y="555" width="25" height="15" fill="#000000"/>
  
  <text x="200" y="630" text-anchor="middle" fill="#777788" font-family="-apple-system, sans-serif" font-size="11">Add to Apple Wallet • https://tickets.summit2026.ai/pass</text>
</svg>`),

  // 5. Code & Architecture Idea note (Dark theme IDE screenshot)
  code: svgToDataUrl(`
<svg width="400" height="700" viewBox="0 0 400 700" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="700" fill="#0F141C"/>
  
  <!-- Window titlebar -->
  <rect width="400" height="45" fill="#0B0E14"/>
  <circle cx="20" cy="22" r="6" fill="#ED6A5E"/>
  <circle cx="38" cy="22" r="6" fill="#F4BF4F"/>
  <circle cx="56" cy="22" r="6" fill="#61C554"/>
  <text x="200" y="27" text-anchor="middle" fill="#8892B0" font-family="monospace" font-size="12">vectorSearch.ts — TRACE Core</text>
  
  <!-- Code lines -->
  <g font-family="monospace" font-size="12" xml:space="preserve">
    <text x="15" y="75" fill="#4B5263">01</text>
    <text x="45" y="75" fill="#C678DD">import</text>
    <text x="95" y="75" fill="#E5C07B">{ createClient }</text>
    <text x="205" y="75" fill="#C678DD">from</text>
    <text x="245" y="75" fill="#98C379">'@supabase/supabase-js'</text>

    <text x="15" y="105" fill="#4B5263">02</text>
    <text x="45" y="105" fill="#5C6370">// Hybrid Lexical + Vector Semantic Match</text>

    <text x="15" y="135" fill="#4B5263">03</text>
    <text x="45" y="135" fill="#C678DD">export async function</text>
    <text x="200" y="135" fill="#61AFEF">hybridSearch</text>
    <text x="290" y="135" fill="#ABB2BF">(</text>

    <text x="15" y="165" fill="#4B5263">04</text>
    <text x="65" y="165" fill="#E06C75">query</text>
    <text x="105" y="165" fill="#ABB2BF">: string,</text>
    <text x="175" y="165" fill="#E06C75">priceLimit</text>
    <text x="260" y="165" fill="#ABB2BF">?: number</text>

    <text x="15" y="195" fill="#4B5263">05</text>
    <text x="45" y="195" fill="#ABB2BF">) {</text>

    <text x="15" y="225" fill="#4B5263">06</text>
    <text x="65" y="225" fill="#C678DD">const</text>
    <text x="110" y="225" fill="#E5C07B">tokens</text>
    <text x="165" y="225" fill="#56B6C2">=</text>
    <text x="180" y="225" fill="#61AFEF">extractEntities</text>
    <text x="295" y="225" fill="#ABB2BF">(query);</text>

    <text x="15" y="255" fill="#4B5263">07</text>
    <text x="65" y="255" fill="#C678DD">const</text>
    <text x="110" y="255" fill="#E5C07B">matches</text>
    <text x="170" y="255" fill="#56B6C2">=</text>
    <text x="185" y="255" fill="#C678DD">await</text>
    <text x="230" y="255" fill="#61AFEF">rankSnippets</text>
    <text x="325" y="255" fill="#ABB2BF">({</text>

    <text x="15" y="285" fill="#4B5263">08</text>
    <text x="85" y="285" fill="#ABB2BF">tokens,</text>
    <text x="150" y="285" fill="#ABB2BF">maxPrice: priceLimit || 3000,</text>

    <text x="15" y="315" fill="#4B5263">09</text>
    <text x="85" y="315" fill="#ABB2BF">explainMatches: <tspan fill="#D19A66">true</tspan></text>

    <text x="15" y="345" fill="#4B5263">10</text>
    <text x="65" y="345" fill="#ABB2BF">});</text>

    <text x="15" y="375" fill="#4B5263">11</text>
    <text x="65" y="375" fill="#C678DD">return</text>
    <text x="120" y="375" fill="#ABB2BF">matches.filter(m =&gt; m.score &gt;= <tspan fill="#D19A66">0.45</tspan>);</text>

    <text x="15" y="405" fill="#4B5263">12</text>
    <text x="45" y="405" fill="#ABB2BF">}</text>
  </g>

  <!-- GitHub Stars & Commits banner -->
  <rect x="20" y="450" width="360" height="120" rx="8" fill="#161B22" stroke="#30363D"/>
  <text x="35" y="480" fill="#58A6FF" font-family="-apple-system, sans-serif" font-weight="bold" font-size="14">github.com/trace-ai/semantic-archive</text>
  <text x="35" y="505" fill="#8B949E" font-family="-apple-system, sans-serif" font-size="12">⭐ 4,821 stars • 412 forks • Apache 2.0</text>
  <text x="35" y="530" fill="#7EE787" font-family="-apple-system, sans-serif" font-size="12">Latest Release: v2.4.0 (Enhanced Gemini 1.5 JSON schema)</text>
  <text x="35" y="550" fill="#8B949E" font-family="-apple-system, sans-serif" font-size="11">Saved on: Nov 12, 2026 from Chrome bookmark</text>
</svg>`),

  // 6. Seed Round Term Sheet (Confidential Document)
  termSheet: svgToDataUrl(`
<svg width="400" height="700" viewBox="0 0 400 700" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="700" fill="#FFFFFF"/>
  <rect x="30" y="30" width="340" height="640" fill="#FAF9F6" stroke="#D1CDC2" stroke-width="1.5"/>
  
  <text x="50" y="70" fill="#B91C1C" font-family="-apple-system, sans-serif" font-weight="bold" font-size="10" letter-spacing="2">CONFIDENTIAL • PRIVILEGED</text>
  <text x="50" y="105" fill="#1C1917" font-family="Georgia, serif" font-weight="bold" font-size="20">SERIES SEED TERM SHEET</text>
  <text x="50" y="125" fill="#78716C" font-family="Georgia, serif" font-style="italic" font-size="12">Acme AI Technologies Inc. — Summary of Principal Terms</text>
  
  <line x1="50" y1="145" x2="350" y2="145" stroke="#E7E5E4" stroke-width="1"/>
  
  <text x="50" y="175" fill="#1C1917" font-family="-apple-system, sans-serif" font-weight="600" font-size="12">Investment Amount:</text>
  <text x="180" y="175" fill="#047857" font-family="Georgia, serif" font-weight="bold" font-size="13">$2,500,000 USD</text>
  
  <text x="50" y="205" fill="#1C1917" font-family="-apple-system, sans-serif" font-weight="600" font-size="12">Pre-Money Valuation:</text>
  <text x="180" y="205" fill="#1C1917" font-family="Georgia, serif" font-weight="bold" font-size="13">$12,000,000 USD</text>
  
  <text x="50" y="235" fill="#1C1917" font-family="-apple-system, sans-serif" font-weight="600" font-size="12">Lead Investor:</text>
  <text x="180" y="235" fill="#1C1917" font-family="Georgia, serif" font-size="12">Benchmark Capital Partners</text>
  
  <text x="50" y="265" fill="#1C1917" font-family="-apple-system, sans-serif" font-weight="600" font-size="12">Liquidation Pref:</text>
  <text x="180" y="265" fill="#1C1917" font-family="Georgia, serif" font-size="12">1.0x Non-Participating</text>
  
  <text x="50" y="295" fill="#1C1917" font-family="-apple-system, sans-serif" font-weight="600" font-size="12">Board Composition:</text>
  <text x="180" y="295" fill="#1C1917" font-family="Georgia, serif" font-size="12">2 Founders, 1 Lead Investor</text>
  
  <text x="50" y="325" fill="#1C1917" font-family="-apple-system, sans-serif" font-weight="600" font-size="12">Closing Target Date:</text>
  <text x="180" y="325" fill="#B45309" font-family="-apple-system, sans-serif" font-weight="bold" font-size="12">December 15, 2026</text>

  <!-- Yellow sticky note attached -->
  <rect x="45" y="370" width="310" height="130" rx="4" fill="#FEF08A" stroke="#FACC15"/>
  <text x="60" y="400" fill="#713F12" font-family="Georgia, serif" font-style="italic" font-weight="bold" font-size="13">Founder Note:</text>
  <text x="60" y="425" fill="#854D0E" font-family="-apple-system, sans-serif" font-size="11.5">• Check Section 4.2 with counsel regarding pro-rata rights.</text>
  <text x="60" y="445" fill="#854D0E" font-family="-apple-system, sans-serif" font-size="11.5">• ESOP pool unallocated: 10% target acceptable.</text>
  <text x="60" y="465" fill="#854D0E" font-family="-apple-system, sans-serif" font-size="11.5">• Wire instructions verified via phone with partner.</text>

  <rect x="50" y="530" width="140" height="40" fill="#F5F5F4" stroke="#D6D3D1"/>
  <text x="65" y="555" fill="#1C1917" font-family="Georgia, serif" font-style="italic" font-size="14">Signature verified</text>
</svg>`),

  // 7. Swiss Design & Typography Poster Inspo
  design: svgToDataUrl(`
<svg width="400" height="700" viewBox="0 0 400 700" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="700" fill="#E84A27"/>
  
  <text x="30" y="80" fill="#FFFFFF" font-family="Helvetica, Arial, sans-serif" font-weight="900" font-size="64" letter-spacing="-3">NEUE</text>
  <text x="30" y="145" fill="#FFFFFF" font-family="Helvetica, Arial, sans-serif" font-weight="900" font-size="64" letter-spacing="-3">GRAFIK</text>
  
  <rect x="30" y="170" width="340" height="6" fill="#FFFFFF"/>
  
  <text x="30" y="210" fill="#FFFFFF" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="14">INTERNATIONAL REVIEW OF GRAPHIC DESIGN</text>
  <text x="30" y="230" fill="#FCD34D" font-family="Helvetica, Arial, sans-serif" font-size="12">ZÜRICH • OLITEN • BASEL • 1960 / 2026 REPRINT</text>
  
  <!-- Asymmetric Grid Structure -->
  <rect x="30" y="260" width="160" height="200" fill="#FFFFFF"/>
  <rect x="200" y="260" width="170" height="95" fill="#111111"/>
  <rect x="200" y="365" width="170" height="95" fill="#8B5CF6"/>
  
  <text x="45" y="295" fill="#000000" font-family="Helvetica, Arial, sans-serif" font-weight="bold" font-size="12">GRID SYSTEM 12-COL</text>
  <text x="45" y="320" fill="#444444" font-family="Helvetica, Arial, sans-serif" font-size="10">Typography: Akzidenz-Grotesk</text>
  <text x="45" y="340" fill="#444444" font-family="Helvetica, Arial, sans-serif" font-size="10">Leading: 120% proportional</text>
  <text x="45" y="360" fill="#444444" font-family="Helvetica, Arial, sans-serif" font-size="10">Palette: #E84A27 / #8B5CF6</text>
  
  <text x="215" y="315" fill="#FFFFFF" font-family="Helvetica, Arial, sans-serif" font-weight="bold" font-size="18">Josef Müller</text>
  <text x="215" y="415" fill="#FFFFFF" font-family="Helvetica, Arial, sans-serif" font-weight="bold" font-size="18">Brockmann</text>

  <!-- Inspector panel overlay -->
  <rect x="30" y="480" width="340" height="150" rx="10" fill="#111111" fill-opacity="0.9" stroke="#333333"/>
  <text x="50" y="515" fill="#A78BFA" font-family="monospace" font-size="12">Source: Arena channel /typography-inspo</text>
  <text x="50" y="540" fill="#FFFFFF" font-family="monospace" font-size="11">Hex: #E84A27 (Vermilion Red)</text>
  <text x="50" y="560" fill="#FFFFFF" font-family="monospace" font-size="11">Contrast Ratio: 7.2:1 against deep ink</text>
  <text x="50" y="585" fill="#888888" font-family="monospace" font-size="11">Note: Use this hierarchy for TRACE editorial headers</text>
</svg>`),

  // 8. Alpine Cabin in Dolomites (Airbnb bookmark)
  airbnb: svgToDataUrl(`
<svg width="400" height="700" viewBox="0 0 400 700" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="700" fill="#1E293B"/>
  
  <!-- Image Banner representation -->
  <rect x="0" y="0" width="400" height="280" fill="#0F172A"/>
  <!-- Mountain Silhouette -->
  <polygon points="20,280 130,90 220,280" fill="#334155"/>
  <polygon points="160,280 280,60 380,280" fill="#475569"/>
  <!-- Snow peak -->
  <polygon points="130,90 115,120 145,120" fill="#F8FAFC"/>
  <polygon points="280,60 260,100 300,100" fill="#F8FAFC"/>
  <!-- Cabin silhouette -->
  <polygon points="200,240 240,200 280,240" fill="#78350F"/>
  <rect x="215" y="240" width="50" height="40" fill="#92400E"/>
  <rect x="235" y="250" width="10" height="12" fill="#FDE047"/>

  <!-- Airbnb Content Card -->
  <rect x="20" y="300" width="360" height="340" rx="16" fill="#0F172A" stroke="#334155"/>
  <text x="40" y="335" fill="#FF385C" font-family="-apple-system, sans-serif" font-weight="bold" font-size="12">★ SUPERHOST • DOLOMITES, ITALY</text>
  <text x="40" y="370" fill="#FFFFFF" font-family="Georgia, serif" font-weight="bold" font-size="20">Chalet Baita De L'Alp</text>
  <text x="40" y="395" fill="#94A3B8" font-family="-apple-system, sans-serif" font-size="13">Cortina d'Ampezzo • Entire cabin • 4 guests</text>
  
  <line x1="40" y1="415" x2="340" y2="415" stroke="#1E293B" stroke-width="1.5"/>
  
  <text x="40" y="445" fill="#F8FAFC" font-family="-apple-system, sans-serif" font-weight="bold" font-size="24">€185 <tspan font-size="14" font-weight="normal" fill="#94A3B8">/ night</tspan></text>
  <text x="40" y="475" fill="#10B981" font-family="-apple-system, sans-serif" font-weight="600" font-size="12">✓ Free cancellation before Oct 15</text>
  <text x="40" y="495" fill="#CBD5E1" font-family="-apple-system, sans-serif" font-size="12">Dates saved: Nov 10 – Nov 17, 2026</text>
  
  <text x="40" y="535" fill="#38BDF8" font-family="-apple-system, sans-serif" font-size="12">airbnb.com/rooms/892716382</text>
  
  <rect x="40" y="565" width="320" height="45" rx="10" fill="#FF385C"/>
  <text x="200" y="593" text-anchor="middle" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-weight="bold" font-size="14">Reserve on Airbnb</text>
</svg>`),

  // 9. Mom's Chai Recipe (Notes App screenshot)
  recipe: svgToDataUrl(`
<svg width="400" height="700" viewBox="0 0 400 700" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="700" fill="#FFFBEB"/>
  <rect x="0" y="0" width="400" height="60" fill="#FEF3C7"/>
  <text x="25" y="38" fill="#B45309" font-family="-apple-system, sans-serif" font-weight="600" font-size="14">&lt; Notes</text>
  <text x="350" y="38" fill="#B45309" font-family="-apple-system, sans-serif" font-weight="bold" font-size="18">⋯</text>
  
  <text x="30" y="105" fill="#451A03" font-family="Georgia, serif" font-weight="bold" font-size="22">Mom's Saffron Cardamom Chai</text>
  <text x="30" y="128" fill="#92400E" font-family="-apple-system, sans-serif" font-size="12">Saved from Family WhatsApp • Yesterday 18:30</text>
  
  <line x1="30" y1="145" x2="370" y2="145" stroke="#FDE68A" stroke-width="1.5"/>
  
  <text x="30" y="175" fill="#78350F" font-family="-apple-system, sans-serif" font-weight="bold" font-size="13">INGREDIENTS (Makes 2 Cups):</text>
  <text x="30" y="200" fill="#451A03" font-family="-apple-system, sans-serif" font-size="13">• 1.5 cups fresh water</text>
  <text x="30" y="222" fill="#451A03" font-family="-apple-system, sans-serif" font-size="13">• 1 cup whole milk (A2 cow milk best)</text>
  <text x="30" y="244" fill="#451A03" font-family="-apple-system, sans-serif" font-size="13">• 2.5 tsp Assam CTC loose black tea</text>
  <text x="30" y="266" fill="#451A03" font-family="-apple-system, sans-serif" font-size="13">• 3 green cardamom pods (freshly crushed)</text>
  <text x="30" y="288" fill="#451A03" font-family="-apple-system, sans-serif" font-size="13">• 1 inch freshly grated ginger</text>
  <text x="30" y="310" fill="#451A03" font-family="-apple-system, sans-serif" font-size="13">• 4-5 strands Kashmiri saffron (essential!)</text>
  <text x="30" y="332" fill="#451A03" font-family="-apple-system, sans-serif" font-size="13">• 2 tsp raw jaggery or cane sugar</text>
  
  <rect x="25" y="360" width="350" height="180" rx="8" fill="#FEF3C7" stroke="#FDE68A"/>
  <text x="40" y="390" fill="#78350F" font-family="-apple-system, sans-serif" font-weight="bold" font-size="13">METHOD / SECRET STEPS:</text>
  <text x="40" y="415" fill="#451A03" font-family="-apple-system, sans-serif" font-size="12">1. Boil ginger and cardamom in water for 3 min FIRST.</text>
  <text x="40" y="438" fill="#451A03" font-family="-apple-system, sans-serif" font-size="12">2. Add black tea and steep vigorously on medium heat.</text>
  <text x="40" y="461" fill="#451A03" font-family="-apple-system, sans-serif" font-size="12">3. Pour in milk &amp; crush saffron between your palms.</text>
  <text x="40" y="484" fill="#451A03" font-family="-apple-system, sans-serif" font-size="12">4. Bring to a rolling boil 3 times (the "ubal" technique).</text>
  <text x="40" y="507" fill="#451A03" font-family="-apple-system, sans-serif" font-size="12">5. Strain hot through brass sieve.</text>
</svg>`),

  // 10. Pharmacy Receipt & Prescription
  prescription: svgToDataUrl(`
<svg width="400" height="700" viewBox="0 0 400 700" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="700" fill="#F8FAFC"/>
  <rect x="25" y="30" width="350" height="640" rx="6" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  
  <!-- Header -->
  <text x="45" y="70" fill="#0284C7" font-family="-apple-system, sans-serif" font-weight="bold" font-size="18">APOLLO PHARMACY</text>
  <text x="45" y="90" fill="#64748B" font-family="-apple-system, sans-serif" font-size="11">Store #4029 • GSTIN: 27AABCA1234F1Z9</text>
  <text x="45" y="108" fill="#64748B" font-family="-apple-system, sans-serif" font-size="11">Rx Order #AP-2026-8921 • Date: 14-Nov-2026</text>
  
  <line x1="45" y1="125" x2="355" y2="125" stroke="#E2E8F0" stroke-dasharray="4 4"/>
  
  <text x="45" y="150" fill="#0F172A" font-family="-apple-system, sans-serif" font-weight="bold" font-size="12">Prescribed By: Dr. Sarah Deshmukh, MD</text>
  <text x="45" y="170" fill="#475569" font-family="-apple-system, sans-serif" font-size="11.5">Reg No: MMC-2014-9921 • Clinic: Bandra Health</text>
  
  <rect x="40" y="195" width="320" height="200" rx="6" fill="#F8FAFC"/>
  
  <!-- Line item 1 -->
  <text x="55" y="225" fill="#0F172A" font-family="-apple-system, sans-serif" font-weight="600" font-size="12">1. Vitamin D3 60,000 IU (Calcirol)</text>
  <text x="55" y="243" fill="#64748B" font-family="-apple-system, sans-serif" font-size="11">Dosage: 1 capsule once weekly on Sunday after breakfast</text>
  <text x="310" y="225" text-anchor="end" fill="#0F172A" font-family="monospace" font-size="12">₹280.00</text>
  
  <!-- Line item 2 -->
  <text x="55" y="280" fill="#0F172A" font-family="-apple-system, sans-serif" font-weight="600" font-size="12">2. Ultra Pure Omega 3 Fish Oil (1000mg)</text>
  <text x="55" y="298" fill="#64748B" font-family="-apple-system, sans-serif" font-size="11">Dosage: 1 softgel daily after dinner</text>
  <text x="310" y="280" text-anchor="end" fill="#0F172A" font-family="monospace" font-size="12">₹850.00</text>

  <!-- Line item 3 -->
  <text x="55" y="335" fill="#0F172A" font-family="-apple-system, sans-serif" font-weight="600" font-size="12">3. Zincovit Multivitamin Tablets (Strip of 15)</text>
  <text x="55" y="353" fill="#64748B" font-family="-apple-system, sans-serif" font-size="11">Dosage: 1 daily for 30 days</text>
  <text x="310" y="335" text-anchor="end" fill="#0F172A" font-family="monospace" font-size="12">₹115.00</text>
  
  <!-- Total -->
  <line x1="45" y1="415" x2="355" y2="415" stroke="#CBD5E1"/>
  <text x="45" y="445" fill="#0F172A" font-family="-apple-system, sans-serif" font-weight="bold" font-size="14">Total Paid:</text>
  <text x="355" y="445" text-anchor="end" fill="#0F172A" font-family="-apple-system, sans-serif" font-weight="bold" font-size="16">₹1,245.00</text>
  
  <text x="45" y="475" fill="#059669" font-family="-apple-system, sans-serif" font-weight="600" font-size="11.5">Paid via UPI • Ref: 981240182910</text>
  <text x="45" y="505" fill="#DC2626" font-family="-apple-system, sans-serif" font-size="11">Next blood checkup: Jan 15, 2027 (Serum Vitamin D)</text>
</svg>`),

  // 11. Zomato Food Delivery Invoice & Order Summary
  zomato: svgToDataUrl(`
<svg width="400" height="700" viewBox="0 0 400 700" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="700" fill="#F4F4F6"/>
  
  <!-- Zomato Red App Header -->
  <rect width="400" height="90" fill="#E23744"/>
  <text x="24" y="36" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-weight="600" font-size="13">13:42</text>
  <text x="24" y="70" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-weight="900" font-size="22" letter-spacing="1">zomato</text>
  <text x="376" y="70" text-anchor="end" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-size="12">Order #ZOM-9281</text>
  
  <!-- Status Card -->
  <rect x="20" y="105" width="360" height="70" rx="14" fill="#FFFFFF" stroke="#E5E5E8"/>
  <circle cx="50" cy="140" r="16" fill="#E8F5E9"/>
  <text x="50" y="146" text-anchor="middle" fill="#2E7D32" font-family="-apple-system, sans-serif" font-weight="bold" font-size="16">✓</text>
  <text x="80" y="134" fill="#1C1C1E" font-family="-apple-system, sans-serif" font-weight="bold" font-size="15">Order Delivered</text>
  <text x="80" y="153" fill="#666666" font-family="-apple-system, sans-serif" font-size="12">Delivered in 28 mins • On time</text>
  
  <!-- Restaurant Card -->
  <rect x="20" y="190" width="360" height="90" rx="14" fill="#FFFFFF" stroke="#E5E5E8"/>
  <text x="38" y="222" fill="#E23744" font-family="-apple-system, sans-serif" font-weight="bold" font-size="16">Bawarchi Biryani Roasters</text>
  <text x="38" y="244" fill="#666666" font-family="-apple-system, sans-serif" font-size="12">Hill Road, Bandra West, Mumbai</text>
  <text x="38" y="264" fill="#1976D2" font-family="-apple-system, sans-serif" font-size="11">FSSAI Lic: 11521012000492</text>
  
  <!-- Bill Details & Line Items -->
  <rect x="20" y="295" width="360" height="320" rx="14" fill="#FFFFFF" stroke="#E5E5E8"/>
  <text x="38" y="328" fill="#1C1C1E" font-family="-apple-system, sans-serif" font-weight="bold" font-size="14">Bill Details &amp; Summary</text>
  
  <line x1="38" y1="345" x2="362" y2="345" stroke="#F0F0F2"/>
  
  <text x="38" y="375" fill="#333333" font-family="-apple-system, sans-serif" font-size="13">1x Hyderabadi Dum Biryani (Special)</text>
  <text x="362" y="375" text-anchor="end" fill="#1C1C1E" font-family="monospace" font-size="13">₹320.00</text>
  
  <text x="38" y="405" fill="#333333" font-family="-apple-system, sans-serif" font-size="13">1x Extra Mirchi Ka Salan (Portion)</text>
  <text x="362" y="405" text-anchor="end" fill="#1C1C1E" font-family="monospace" font-size="13">₹40.00</text>
  
  <line x1="38" y1="425" x2="362" y2="425" stroke="#F0F0F2"/>
  
  <text x="38" y="450" fill="#777777" font-family="-apple-system, sans-serif" font-size="12">Item Total</text>
  <text x="362" y="450" text-anchor="end" fill="#333333" font-family="monospace" font-size="12">₹360.00</text>
  
  <text x="38" y="475" fill="#777777" font-family="-apple-system, sans-serif" font-size="12">Restaurant Packaging Charges</text>
  <text x="362" y="475" text-anchor="end" fill="#333333" font-family="monospace" font-size="12">₹20.00</text>
  
  <text x="38" y="500" fill="#777777" font-family="-apple-system, sans-serif" font-size="12">Delivery Partner Fee</text>
  <text x="362" y="500" text-anchor="end" fill="#333333" font-family="monospace" font-size="12">₹25.00</text>
  
  <text x="38" y="525" fill="#777777" font-family="-apple-system, sans-serif" font-size="12">Taxes &amp; Restaurant GST (5%)</text>
  <text x="362" y="525" text-anchor="end" fill="#333333" font-family="monospace" font-size="12">₹19.00</text>
  
  <text x="38" y="550" fill="#2E7D32" font-family="-apple-system, sans-serif" font-size="12">Coupon DISCOUNT50 Applied</text>
  <text x="362" y="550" text-anchor="end" fill="#2E7D32" font-family="monospace" font-weight="bold" font-size="12">-₹50.00</text>
  
  <line x1="38" y1="570" x2="362" y2="570" stroke="#1C1C1E" stroke-width="1.5"/>
  
  <text x="38" y="598" fill="#1C1C1E" font-family="-apple-system, sans-serif" font-weight="bold" font-size="16">Total Paid</text>
  <text x="362" y="598" text-anchor="end" fill="#E23744" font-family="-apple-system, sans-serif" font-weight="bold" font-size="18">₹374.00</text>
  
  <!-- Footer Note -->
  <rect x="20" y="630" width="360" height="45" rx="10" fill="#E8F5E9"/>
  <text x="200" y="658" text-anchor="middle" fill="#2E7D32" font-family="-apple-system, sans-serif" font-weight="600" font-size="12">✓ Paid via Google Pay UPI • Ref: 48921804</text>
</svg>`),
};
