'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  Bot,
  User,
  Lightbulb,
  MessageSquare,
  Search,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import { ScreenshotItem, AssistantMessage } from '@/types/archive';

interface TraceAssistantProps {
  items: ScreenshotItem[];
  onSelectScreenshot: (item: ScreenshotItem) => void;
  userApiKey?: string;
}

const INITIAL_SUGGESTIONS = [
  'What shoes did I save under ₹3,000?',
  'Where was that coffee shop Aarav recommended?',
  'Summarize the Attention Is All You Need paper notes',
  'What events or conferences are coming up next month?',
  'What were the key terms on the Acme Seed Term Sheet?',
  'Give me mom\'s saffron chai recipe and measurements',
];

export const TraceAssistant: React.FC<TraceAssistantProps> = ({
  items,
  onSelectScreenshot,
  userApiKey,
}) => {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Hello. I am your **TRACE Assistant**.\n\nI have complete index access to your **${items.length} visual memories**. Ask me about prices, addresses, notes, formulas, or recommendations you've saved. Every answer is grounded directly in your archived screenshots.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowUps: INITIAL_SUGGESTIONS.slice(0, 3),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    setInput('');

    const userMsg: AssistantMessage = {
      id: Math.random().toString(36).substring(2, 9),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          archiveContext: items,
          userApiKey,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMsg: AssistantMessage = {
          id: Math.random().toString(36).substring(2, 9),
          role: 'assistant',
          content: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citedScreenshotIds: data.citedScreenshotIds || [],
          suggestedFollowUps: data.suggestedFollowUps || [],
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error || 'Failed to get answer');
      }
    } catch (err: any) {
      const errorMsg: AssistantMessage = {
        id: Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        content: `I ran into an issue retrieving that information. Error: ${err.message || 'Network error'}. Please try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full max-w-4xl mx-auto w-full p-4 sm:p-6 animate-fade-in">
      {/* Assistant Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E6E3F2] dark:border-[#262438] mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-purple-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-bold text-neutral-900 dark:text-neutral-100">
                AI Assistant
              </h2>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                Archive Grounded
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Answers derived exclusively from your saved screenshots and extracted text.
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'welcome-reset',
                role: 'assistant',
                content: `Chat history refreshed. I am ready to explore your **${items.length} saved screenshots**.`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                suggestedFollowUps: INITIAL_SUGGESTIONS.slice(0, 3),
              },
            ])
          }
          className="text-xs font-medium text-neutral-500 hover:text-purple-600 dark:hover:text-purple-300 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-purple-300 transition-colors"
        >
          Reset Chat
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-5 mb-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const citedScreenshots = (msg.citedScreenshotIds || [])
            .map((id) => items.find((i) => i.id === id))
            .filter(Boolean) as ScreenshotItem[];

          return (
            <div
              key={msg.id}
              className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 px-1 text-[11px] font-medium text-neutral-400">
                {isUser ? (
                  <>
                    <span>You</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>TRACE Assistant</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </>
                )}
              </div>

              <div
                className={`max-w-2xl rounded-3xl p-5 text-sm md:text-base leading-relaxed ${
                  isUser
                    ? 'bg-purple-600 text-white rounded-br-md shadow-md shadow-purple-500/20'
                    : 'bg-white dark:bg-[#181726] border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-bl-md shadow-xs'
                }`}
              >
                <ReactMarkdown className="whitespace-pre-wrap space-y-2" >
                  {msg.content}
                </ReactMarkdown>

                {/* Cited Screenshot Cards inside Assistant Bubble */}
                {citedScreenshots.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-[#262624] flex flex-col gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                      Archive Citations ({citedScreenshots.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {citedScreenshots.map((cit) => (
                        <div
                          key={cit.id}
                          onClick={() => onSelectScreenshot(cit)}
                          className="flex items-center gap-2.5 p-2 rounded-xl bg-neutral-50 dark:bg-[#1E1E1C] border border-neutral-200 dark:border-neutral-700/60 hover:border-neutral-400 cursor-pointer transition-all group"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-200 dark:bg-neutral-800">
                            <img
                              src={cit.thumbnailUrl || cit.imageUrl}
                              alt={cit.title}
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-medium text-neutral-900 dark:text-neutral-100 truncate group-hover:underline">
                              {cit.title}
                            </p>
                            <span className="text-[10px] font-mono text-neutral-400">
                              {cit.category} • {cit.capturedAt || 'Archive'}
                            </span>
                          </div>
                          <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black dark:group-hover:text-white" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Follow-up suggestions */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1 pl-1">
                  {msg.suggestedFollowUps.map((sugg, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(sugg)}
                      className="text-[11px] text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-[#1E1E1C] border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 transition-colors"
                    >
                      {sugg} →
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 text-xs font-mono text-neutral-500 animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Consulting archive index & cross-referencing OCR entities...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="relative">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 p-2 rounded-2xl bg-white dark:bg-[#181726] border-2 border-[#E6E3F2] dark:border-[#28263D] focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 shadow-sm transition-all"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your screenshots: 'What was that coupon code?', 'Where is Subko?'..."
            className="flex-1 px-3 py-2 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 bg-transparent focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-30 transition-all shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
