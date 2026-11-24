'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Tag,
  Edit2,
  Plus,
} from 'lucide-react';
import { ScreenshotItem, Category } from '@/types/archive';
import { DEFAULT_CATEGORIES, resolveCategory } from '@/lib/categories';

interface SmartUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveItems: (newItems: ScreenshotItem[]) => void;
  userApiKey?: string;
}

interface QueuedFile {
  id: string;
  file: File;
  previewUrl: string;
  status: 'pending' | 'analyzing' | 'completed' | 'error';
  progressStage?: string;
  analysisResult?: Partial<ScreenshotItem>;
  errorMessage?: string;
  isCustomCategoryMode?: boolean;
}

export const SmartUploadModal: React.FC<SmartUploadModalProps> = ({
  isOpen,
  onClose,
  onSaveItems,
  userApiKey,
}) => {
  if (!isOpen) return null;

  const [queuedFiles, setQueuedFiles] = useState<QueuedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newQueued: QueuedFile[] = Array.from(files).map((f) => ({
      id: Math.random().toString(36).substring(2, 9),
      file: f,
      previewUrl: URL.createObjectURL(f),
      status: 'pending',
    }));

    setQueuedFiles((prev) => [...prev, ...newQueued]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesSelected(e.dataTransfer.files);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const updateItemCategory = (id: string, newCategory: string) => {
    setQueuedFiles((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;
        const resolved = resolveCategory(newCategory);
        const updatedResult = q.analysisResult
          ? {
              ...q.analysisResult,
              category: resolved,
              collections: Array.from(new Set([resolved, ...(q.analysisResult.collections || [])])),
            }
          : undefined;
        return {
          ...q,
          analysisResult: updatedResult,
          isCustomCategoryMode: newCategory === '__CUSTOM__',
        };
      })
    );
  };

  const updateItemTitle = (id: string, newTitle: string) => {
    setQueuedFiles((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;
        return {
          ...q,
          analysisResult: q.analysisResult
            ? { ...q.analysisResult, title: newTitle }
            : undefined,
        };
      })
    );
  };

  const processQueue = async () => {
    setIsProcessing(true);

    const stages = [
      'Scanning elements...',
      'Extracting OCR text...',
      'Detecting entities...',
      'Categorizing...',
    ];

    for (let i = 0; i < queuedFiles.length; i++) {
      const item = queuedFiles[i];
      if (item.status === 'completed') continue;

      setQueuedFiles((prev) =>
        prev.map((q, idx) =>
          idx === i ? { ...q, status: 'analyzing', progressStage: stages[0] } : q
        )
      );

      try {
        const base64 = await fileToBase64(item.file);

        setTimeout(() => {
          setQueuedFiles((prev) =>
            prev.map((q, idx) =>
              idx === i ? { ...q, progressStage: stages[1] } : q
            )
          );
        }, 500);

        setTimeout(() => {
          setQueuedFiles((prev) =>
            prev.map((q, idx) =>
              idx === i ? { ...q, progressStage: stages[2] } : q
            )
          );
        }, 1100);

        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64,
            fileName: item.file.name,
            mimeType: item.file.type,
            userApiKey,
          }),
        });

        const data = await response.json();

        if (data.success && data.analysis) {
          const analysis = data.analysis;
          const assignedCategory = resolveCategory(analysis.category || 'Other');

          const parsedItem: ScreenshotItem = {
            id: 'trace-user-' + Math.random().toString(36).substring(2, 9),
            title: analysis.title || item.file.name,
            imageUrl: base64,
            thumbnailUrl: base64,
            aspectRatio: 400 / 600,
            createdAt: new Date().toISOString(),
            capturedAt: new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            category: assignedCategory,
            collections: [assignedCategory],
            tags: analysis.tags || ['screenshot'],
            aiSummary: analysis.aiSummary || 'Analyzed screenshot archived in TRACE.',
            extractedText: analysis.extractedText || '',
            entities: analysis.entities || {
              prices: [],
              links: [],
              dates: [],
              locations: [],
              people: [],
            },
            confidenceScore: analysis.confidenceScore || 0.9,
            isDemo: false,
          };

          setQueuedFiles((prev) =>
            prev.map((q, idx) =>
              idx === i
                ? {
                    ...q,
                    status: 'completed',
                    progressStage: 'Indexed',
                    analysisResult: parsedItem,
                  }
                : q
            )
          );
        } else {
          throw new Error(data.error || 'Failed to analyze screenshot');
        }
      } catch (err: any) {
        setQueuedFiles((prev) =>
          prev.map((q, idx) =>
            idx === i
              ? {
                  ...q,
                  status: 'error',
                  errorMessage: err.message || 'Processing failed',
                }
              : q
          )
        );
      }
    }

    setIsProcessing(false);
  };

  const handleSaveAll = () => {
    const readyItems = queuedFiles
      .filter((q) => q.status === 'completed' && q.analysisResult)
      .map((q) => q.analysisResult as ScreenshotItem);

    if (readyItems.length > 0) {
      onSaveItems(readyItems);
      onClose();
    }
  };

  const handleRemoveQueueItem = (id: string) => {
    setQueuedFiles((prev) => prev.filter((q) => q.id !== id));
  };

  const completedCount = queuedFiles.filter((q) => q.status === 'completed').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl flex flex-col bg-white dark:bg-[#151518] rounded-xl border border-[#E4E4E7] dark:border-[#24242A] shadow-2xl overflow-hidden max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E4E4E7] dark:border-[#24242A]">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Add screenshots
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              OCR text, links, and categories are extracted. You can verify or manually adjust any category.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex flex-col gap-4">
          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed rounded-lg p-7 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-neutral-500 bg-neutral-50 dark:bg-neutral-900/50'
                : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 bg-neutral-50/50 dark:bg-[#121215]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/png, image/jpeg, image/webp"
              onChange={(e) => handleFilesSelected(e.target.files)}
              className="hidden"
            />
            <Upload className="w-5 h-5 text-neutral-400 mb-2" />
            <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100 mb-0.5">
              Drop screenshots here, or <span className="underline">browse files</span>
            </p>
            <p className="text-[11px] text-neutral-400">
              Supports PNG, JPG, WEBP • Code, bills, chats & documents detected
            </p>
          </div>

          {/* Queue List */}
          {queuedFiles.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span>
                  {queuedFiles.length} {queuedFiles.length === 1 ? 'file' : 'files'} in queue
                </span>
                <span>{completedCount} indexed</span>
              </div>

              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                {queuedFiles.map((q) => {
                  const currentCategory = q.analysisResult?.category || 'Code';

                  return (
                    <div
                      key={q.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-[#1A1A1E] border border-neutral-200 dark:border-neutral-800"
                    >
                      {/* Thumbnail */}
                      <div className="w-14 h-10 rounded overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex-shrink-0 border border-neutral-200/80 dark:border-neutral-700">
                        <img
                          src={q.previewUrl}
                          alt="preview"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>

                      {/* Main Details */}
                      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={q.analysisResult?.title || q.file.name}
                            onChange={(e) => updateItemTitle(q.id, e.target.value)}
                            disabled={q.status !== 'completed'}
                            placeholder="Screenshot title"
                            className="text-xs font-medium text-neutral-900 dark:text-neutral-100 bg-transparent border-b border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 focus:border-neutral-500 focus:outline-none truncate w-full"
                          />
                          <span className="text-[10px] text-neutral-400 font-mono flex-shrink-0">
                            {(q.file.size / 1024).toFixed(0)} KB
                          </span>
                        </div>

                        {/* Status / Category Controls */}
                        <div className="flex flex-wrap items-center gap-2">
                          {q.status === 'pending' && (
                            <span className="text-[11px] text-neutral-400">
                              Ready to analyze
                            </span>
                          )}

                          {q.status === 'analyzing' && (
                            <span className="flex items-center gap-1.5 text-[11px] text-neutral-600 dark:text-neutral-300">
                              <RefreshCw className="w-3 h-3 animate-spin text-neutral-400" />
                              <span>{q.progressStage || 'Processing...'}</span>
                            </span>
                          )}

                          {q.status === 'completed' && (
                            <div className="flex flex-wrap items-center gap-2 w-full">
                              <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Indexed</span>
                              </div>

                              {/* Interactive Category Selector with All Default Categories */}
                              <div className="flex items-center gap-1.5 bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-700 rounded-md px-2 py-0.5 text-xs">
                                <Tag className="w-3 h-3 text-neutral-400" />
                                <span className="text-[10px] text-neutral-400">Category:</span>
                                {q.isCustomCategoryMode ? (
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="text"
                                      defaultValue={currentCategory}
                                      onBlur={(e) => {
                                        if (e.target.value.trim()) {
                                          updateItemCategory(q.id, e.target.value.trim());
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          (e.target as HTMLInputElement).blur();
                                        }
                                      }}
                                      autoFocus
                                      placeholder="Type custom category..."
                                      className="text-xs bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none w-28"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => updateItemCategory(q.id, 'Other')}
                                      className="text-[10px] text-neutral-400 hover:text-neutral-700"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ) : (
                                  <select
                                    value={DEFAULT_CATEGORIES.includes(currentCategory) ? currentCategory : '__CUSTOM__'}
                                    onChange={(e) => {
                                      if (e.target.value === '__CUSTOM__') {
                                        updateItemCategory(q.id, '__CUSTOM__');
                                      } else {
                                        updateItemCategory(q.id, e.target.value);
                                      }
                                    }}
                                    className="bg-transparent text-xs font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none cursor-pointer py-0.5"
                                  >
                                    {DEFAULT_CATEGORIES.map((cat) => (
                                      <option key={cat} value={cat} className="bg-white dark:bg-[#17171B]">
                                        {cat}
                                      </option>
                                    ))}
                                    {!DEFAULT_CATEGORIES.includes(currentCategory) && (
                                      <option value={currentCategory} className="bg-white dark:bg-[#17171B]">
                                        {currentCategory} (Custom)
                                      </option>
                                    )}
                                    <option value="__CUSTOM__" className="bg-white dark:bg-[#17171B]">
                                      + Custom category...
                                    </option>
                                  </select>
                                )}
                              </div>
                            </div>
                          )}

                          {q.status === 'error' && (
                            <span className="flex items-center gap-1 text-[11px] text-red-500">
                              <AlertCircle className="w-3 h-3" />
                              {q.errorMessage}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Remove item button */}
                      {!isProcessing && (
                        <button
                          onClick={() => handleRemoveQueueItem(q.id)}
                          className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 self-end sm:self-center"
                          title="Remove from queue"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E4E4E7] dark:border-[#24242A] bg-neutral-50/50 dark:bg-[#121215] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {queuedFiles.some((q) => q.status === 'pending') && (
              <button
                onClick={processQueue}
                disabled={isProcessing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 transition-colors"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <span>Process files</span>
                )}
              </button>
            )}

            {completedCount > 0 && (
              <button
                onClick={handleSaveAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
              >
                <span>Add {completedCount} to archive</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
