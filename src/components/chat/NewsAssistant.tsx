"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { trackChatbotOpen, trackChatbotQuery } from "@/lib/analytics";

type ArticleHint = {
  id: string;
  title: string;
  category: string;
  url: string;
  excerpt?: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  articles?: ArticleHint[];
};

const QUICK_ACTIONS = ["Latest News", "National", "Trending", "Contact", "आज की खबर क्या है"];

const QUICK_ACTION_MESSAGES: Record<string, string> = {
  "Latest News": "मुझे अभी की लेटेस्ट खबरें दिखाइए",
  National: "आज की राष्ट्रीय खबरें बताइए",
  Trending: "अभी ट्रेंडिंग खबरें कौन-सी हैं?",
  Contact: "संपर्क जानकारी साझा करें",
  "आज की खबर क्या है": "आज की खबर क्या है",
};

const OFFLINE_REPLY =
  "AI News Desk अभी उपलब्ध नहीं है। कृपया थोड़ी देर में दोबारा कोशिश करें या Contact पेज देखें।";

const EMPTY_ARTICLES_NOTE = "अभी कंटेंट सीमित है। नीचे सेक्शन कार्ड्स से सीधे पढ़ना शुरू करें।";

export default function NewsAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "नमस्ते! मैं AI News Desk हूँ। मैं आपको लेटेस्ट खबरें, ट्रेंडिंग अपडेट्स और सही सेक्शन जल्दी ढूंढने में मदद कर सकता हूँ।",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const history = useMemo(() => messages.slice(-6).map((m) => ({ role: m.role, content: m.content })), [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setHasSpeechSupport(Boolean(SpeechRecognition));
  }, []);

  async function sendMessage(raw: string) {
    const message = raw.trim();
    if (!message || loading) return;

    setOpen(true);
    trackChatbotOpen();
    setError("");
    const userMessage: ChatMessage = { role: "user", content: message };
    const assistantDraft: ChatMessage = { role: "assistant", content: "" };

    setMessages((prev) => [...prev, userMessage, assistantDraft]);
    setInput("");
    setLoading(true);
    trackChatbotQuery(message);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || OFFLINE_REPLY);
      }

      const payload = await response.json().catch(() => null);
      if (!payload?.reply) throw new Error(OFFLINE_REPLY);

      setMessages((prev) => {
        const next = [...prev];
        const idx = next.length - 1;
        next[idx] = {
          ...next[idx],
          content: payload.reply,
          articles: payload.articles || [],
        };
        return next;
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : OFFLINE_REPLY;
      setError(msg);
      setMessages((prev) => {
        const next = [...prev];
        const idx = next.length - 1;
        next[idx] = {
          role: "assistant",
          content: OFFLINE_REPLY,
        };
        return next;
      });
    } finally {
      setLoading(false);
    }
  }

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      setInput(transcript);
      setListening(false);
      setTimeout(() => sendMessage(transcript), 300);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="ai-desk-button fixed bottom-16 right-3 z-[120] flex items-center gap-2 rounded-full border border-white/50 bg-gradient-to-br from-[#8f0b1f] via-[#C8102E] to-[#ef3d57] px-4 py-2.5 text-white shadow-[0_16px_40px_rgba(200,16,46,0.45)] ring-1 ring-red-200/40 transition hover:scale-[1.02] md:bottom-6 md:right-6"
      >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs font-bold">AI</span>
        <span className="font-hindi text-sm font-bold">AI News Desk</span>
      </button>

      <div
        className={cn(
          "fixed z-[120] transition-all duration-300",
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
          "bottom-[4.2rem] right-2 w-[calc(100vw-1rem)] sm:right-4 sm:bottom-24 sm:w-[min(430px,calc(100vw-2rem))]",
        )}
      >
        <div className="overflow-hidden rounded-3xl border border-red-200 bg-white shadow-[0_20px_52px_rgba(15,15,15,0.28)] backdrop-blur">
          <div className="bg-gradient-to-r from-[#9f0d24] via-[#C8102E] to-[#e3344f] px-4 py-3 text-white flex items-center justify-between">
            <div>
              <p className="font-hindi text-sm font-bold">AI News Desk · नमो: भारत न्यूज़ 24</p>
              <p className="text-xs text-red-100">Hindi-first newsroom assistant</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="text-white/90 hover:text-white text-lg">✕</button>
          </div>

          <div className="h-[63vh] max-h-[560px] min-h-[320px] space-y-2 overflow-y-auto bg-gradient-to-b from-white via-white to-red-50/30 p-2 sm:h-[58vh] sm:p-3">
            {messages.map((m, i) => (
              <div key={`${m.role}-${i}`} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[95%] rounded-2xl px-3 py-2 text-sm leading-relaxed sm:max-w-[88%]",
                    m.role === "user"
                      ? "rounded-br-md bg-[#C8102E] text-white shadow-[0_6px_16px_rgba(200,16,46,0.25)]"
                      : "rounded-bl-md border border-red-100 bg-white text-gray-800 shadow-[0_8px_18px_rgba(15,15,15,0.08)]",
                  )}
                >
                  <p className="whitespace-pre-wrap">{m.content || (loading && i === messages.length - 1 ? "सोच रहा हूँ…" : "")}</p>
                  {m.role === "assistant" && Array.isArray(m.articles) && m.articles.length === 0 && m.content && (
                    <p className="mt-2 text-xs text-gray-500">{EMPTY_ARTICLES_NOTE}</p>
                  )}
                  {!!m.articles?.length && (
                    <div className="mt-2.5 grid gap-2">
                      {m.articles.map((a) => (
                        <article
                          key={a.id}
                          className="rounded-xl border border-red-200/90 bg-gradient-to-b from-white via-red-50/40 to-red-50 px-3 py-2.5 shadow-[0_8px_20px_rgba(200,16,46,0.08)]"
                        >
                          <p className="line-clamp-2 text-[13px] font-semibold text-gray-900">{a.title}</p>
                          <div className="mt-1 flex items-center justify-between gap-2">
                            <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-700">
                              {a.category}
                            </span>
                          </div>
                          {a.excerpt && <p className="mt-1.5 line-clamp-2 text-[11px] text-gray-600">{a.excerpt}</p>}
                          <div className="mt-2">
                            <Link
                              href={a.url}
                              className="inline-flex items-center rounded-lg border border-[#C8102E]/35 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#a00c24] transition hover:bg-red-50"
                            >
                              Open / Read
                            </Link>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-red-100 bg-white px-2.5 pb-2.5 pt-2 sm:px-3 sm:pb-3 sm:pt-2.5">
            <div className="mb-2.5 flex flex-wrap gap-1.5 sm:gap-2">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => sendMessage(QUICK_ACTION_MESSAGES[action] || action)}
                  className="rounded-full border border-red-200 bg-white px-2.5 py-1 text-xs font-semibold text-red-700 shadow-sm transition hover:border-red-300 hover:bg-red-50"
                >
                  {action}
                </button>
              ))}
            </div>

            {error && (
              <div className="mb-2 flex items-center justify-between gap-2 rounded-lg border border-red-200 bg-red-50 px-2 py-1.5 text-xs text-red-700">
                <span>{error}</span>
                <button type="button" onClick={() => sendMessage(input || "Latest News")} className="underline">
                  Retry
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={listening ? "सुन रहा हूँ…" : "खबर पूछें..."}
                className={cn(
                  "h-10 flex-1 rounded-xl border px-3 text-sm outline-none transition",
                  listening
                    ? "border-[#C8102E] bg-red-50"
                    : "border-red-200 bg-red-50/25 focus:border-[#C8102E] focus:bg-white",
                )}
                maxLength={1200}
              />
              {hasSpeechSupport && (
                <button
                  type="button"
                  onClick={listening ? stopListening : startListening}
                  aria-label={listening ? "रोकें" : "बोलकर पूछें"}
                  className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center",
                    listening
                      ? "bg-[#C8102E] text-white animate-pulse shadow-[0_0_0_4px_rgba(200,16,46,0.2)]"
                      : "border border-red-200 bg-white text-red-600 hover:bg-red-50",
                  )}
                >
                  {listening ? (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1" /></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 3a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" />
                      <path d="M19 11a7 7 0 0 1-14 0" />
                      <polyline points="12 18 12 21 8 21" />
                    </svg>
                  )}
                </button>
              )}
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="h-10 rounded-xl bg-[#C8102E] px-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(200,16,46,0.28)] disabled:opacity-60"
              >
                भेजें
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
