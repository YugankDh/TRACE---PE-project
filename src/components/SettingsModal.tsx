'use client';

import React, { useState } from 'react';
import {
  X,
  KeyRound,
  Database,
  Check,
  ExternalLink,
  ShieldAlert,
  RotateCcw,
  Trash2,
  Download,
  Copy,
  Info,
} from 'lucide-react';
import { ScreenshotItem } from '@/types/archive';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  geminiApiKey: string;
  onSaveGeminiApiKey: (key: string) => void;
  onResetSeedData: () => void;
  onClearArchive: () => void;
  items: ScreenshotItem[];
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  geminiApiKey,
  onSaveGeminiApiKey,
  onResetSeedData,
  onClearArchive,
  items,
}) => {
  if (!isOpen) return null;

  const [inputKey, setInputKey] = useState(geminiApiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleSaveKey = () => {
    onSaveGeminiApiKey(inputKey.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `trace-archive-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const SUPABASE_SQL_SCHEMA = `-- TRACE: Supabase PostgreSQL Schema for Screenshot Archive
create extension if not exists "uuid-ossp";

create table if not exists trace_screenshots (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  image_url text not null,
  thumbnail_url text,
  category text not null,
  collections text[] default '{}',
  tags text[] default '{}',
  ai_summary text not null,
  extracted_text text not null,
  entities jsonb default '{}'::jsonb,
  confidence_score numeric(4,2) default 0.95,
  starred boolean default false,
  notes text,
  captured_at text,
  created_at timestamptz default now()
);

-- Full-text search index for high-performance lexical retrieval
create index if not exists idx_trace_ocr_fts on trace_screenshots using gin(to_tsvector('english', title || ' ' || ai_summary || ' ' || extracted_text));
`;

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#151421] rounded-3xl border border-[#E6E3F2] dark:border-[#262438] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#F0EDF7] dark:border-[#222033]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-purple-500/25">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Settings &amp; Integrations
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Configure Gemini API for live OCR extraction and manage your archive storage.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-[#1E1D2D] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6">
          {/* Gemini API Key Section */}
          <div className="p-5 rounded-2xl bg-neutral-50/60 dark:bg-[#181726] border border-[#E6E3F2] dark:border-[#28263D] flex flex-col gap-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-neutral-900 dark:text-neutral-100">
                  Google Gemini API Key
                </span>
                <span
                  className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full ${
                    inputKey
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                  }`}
                >
                  {inputKey ? 'Connected' : 'Local OCR Mode'}
                </span>
              </div>

              <a
                href="https://aistudio.google.com/"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Get free API key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
              TRACE uses Gemini Flash to automatically detect OCR text, extract entities (prices, dates, links, locations) and synthesize answers. If left blank, TRACE operates in local OCR mode.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <input
                type={showKey ? 'text' : 'password'}
                placeholder="AIzaSy..."
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs font-mono rounded-xl bg-white dark:bg-[#12111C] border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="px-2.5 py-2 text-xs font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
              <button
                onClick={handleSaveKey}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                {savedSuccess ? 'Saved!' : 'Save Key'}
              </button>
            </div>
          </div>

          {/* Supabase Integration Guide */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#181816] border border-[#E8E6DF] dark:border-[#282825] flex flex-col gap-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold text-xs text-neutral-900 dark:text-neutral-100">
                  Supabase Cloud Database &amp; Storage
                </span>
              </div>
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1 text-[11px] font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Copied SQL</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Schema SQL</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
              To persist screenshots to Supabase, set <code className="font-mono bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="font-mono bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in your environment variables. Currently, screenshots and modifications are seamlessly stored in browser storage.
            </p>
          </div>

          {/* Archive Data Management */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#181816] border border-[#E8E6DF] dark:border-[#282825] flex flex-col gap-3 shadow-2xs">
            <span className="font-semibold text-xs text-neutral-900 dark:text-neutral-100">
              Archive Maintenance &amp; Backup
            </span>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={handleExportJson}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Archive ({items.length} items)</span>
              </button>

              <button
                onClick={() => {
                  onResetSeedData();
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Sample Archive</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Clear all screenshots from your archive?')) {
                    onClearArchive();
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 dark:border-red-900 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors ml-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#F0EDF7] dark:border-[#222033] bg-neutral-50/60 dark:bg-[#12111C] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
