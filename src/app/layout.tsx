import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TRACE — Personal Screenshot Archive',
  description: 'Find what you forgot you saved. An AI-powered intelligent personal archive for screenshots, OCR retrieval, and visual memories.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="%238B5CF6"/><text x="50" y="68" font-size="54" font-family="-apple-system, sans-serif" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">T</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-grain transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
