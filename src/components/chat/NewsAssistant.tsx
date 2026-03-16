"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

const EMPTY_ARTICLES_NOTE =
  "अभी साइट पर दिखाने के लिए पर्याप्त आर्टिकल उपलब्ध नहीं हैं। आप categories से ब्राउज़ कर सकते हैं।";

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

  const history = useMemo(() => messages.slice(-6).map((m) => ({ role: m.role, content: m.content })), [messages]);

  async function sendMessage(raw: string) {
    const message = raw.trim();
    if (!message || loading) return;

    setOpen(true);
    setError("");
    const userMessage: ChatMessage = { role: "user", content: message };
    const assistantDraft: ChatMessage = { role: "assistant", content: "" };

    setMessages((prev) => [...prev, userMessage, assistantDraft]);
    setInput("");
    setLoading(true);

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

      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("text/event-stream") && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const chunks = buffer.split("\n\n");
          buffer = chunks.pop() || "";

          for (const chunk of chunks) {
            if (!chunk.startsWith("data:")) continue;
            const data = JSON.parse(chunk.replace(/^data:\s*/, "")) as {
              type: "delta" | "meta" | "done" | "error";
              delta?: string;
              message?: string;
              articles?: ArticleHint[];
            };

            if (data.type === "delta" && data.delta) {
              setMessages((prev) => {
                const next = [...prev];
                const idx = next.length - 1;
                next[idx] = {
                  ...next[idx],
                  content: `${next[idx].content}${data.delta}`,
                };
                return next;
              });
            }

            if (data.type === "meta") {
              setMessages((prev) => {
                const next = [...prev];
                const idx = next.length - 1;
                next[idx] = {
                  ...next[idx],
                  articles: data.articles || [],
                };
                return next;
              });
            }

            if (data.type === "error") {
              throw new Error(data.message || OFFLINE_REPLY);
            }
          }
        }
      } else {
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
      }
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

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 right-3 z-[120] flex items-center gap-2 rounded-full border border-white/50 bg-gradient-to-br from-[#8f0b1f] via-[#C8102E] to-[#ef3d57] px-4 py-2.5 text-white shadow-[0_16px_40px_rgba(200,16,46,0.45)] ring-1 ring-red-200/40 transition hover:scale-[1.02] md:bottom-6 md:right-6"
      >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs font-bold">AI</span>
        <span className="font-hindi text-sm font-bold">AI News Desk</span>
      </button>

      <div
        className={cn(
          "fixed z-[120] transition-all duration-300",
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
          "bottom-[4.25rem] right-2 w-[calc(100vw-1rem)] sm:right-4 sm:bottom-24 sm:w-[min(430px,calc(100vw-2rem))]",
        )}
      >
        <div className="overflow-hidden rounded-3xl border border-red-200 bg-white shadow-[0_20px_52px_rgba(15,15,15,0.28)] backdrop-blur">
          <div className="bg-gradient-to-r from-[#9f0d24] via-[#C8102E] to-[#e3344f] px-4 py-3 text-white">
            <p className="font-hindi text-sm font-bold">AI News Desk · नमो: भारत न्यूज़ 24</p>
            <p className="text-xs text-red-100">Hindi-first newsroom assistant</p>
          </div>

          <div className="h-[63vh] max-h-[560px] min-h-[320px] space-y-2.5 overflow-y-auto bg-gradient-to-b from-white via-white to-red-50/35 p-2.5 sm:h-[58vh] sm:p-3">
            {messages.map((m, i) => (
              <div key={`${m.role}-${i}`} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[94%] rounded-2xl px-3 py-2 text-sm leading-relaxed sm:max-w-[88%]",
                    m.role === "user"
                      ? "rounded-br-md bg-[#C8102E] text-white shadow-[0_6px_16px_rgba(200,16,46,0.25)]"
                      : "rounded-bl-md border border-red-100 bg-white text-gray-800 shadow-[0_8px_24px_rgba(15,15,15,0.08)]",
                  )}
                >
                  <p className="whitespace-pre-wrap">{m.content || (loading && i === messages.length - 1 ? "सोच रहा हूँ…" : "")}</p>
                  {m.role === "assistant" && Array.isArray(m.articles) && m.articles.length === 0 && m.content && (
                    <p className="mt-2 text-xs text-gray-500">{EMPTY_ARTICLES_NOTE}</p>
                  )}
                  {!!m.articles?.length && (
                    <div className="mt-2.5 space-y-2">
                      {m.articles.map((a) => (
                        <Link
                          key={a.id}
                          href={a.url}
                          className="block rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-white px-2.5 py-2 text-xs text-gray-800 transition hover:border-red-300 hover:from-red-100 hover:to-red-50"
                        >
                          <span className="line-clamp-2 font-semibold text-[12.5px] text-gray-900">{a.title}</span>
                          {a.excerpt && <p className="mt-1 line-clamp-2 text-[11px] text-gray-600">{a.excerpt}</p>}
                          <span className="mt-1 inline-flex rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700">{a.category}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-red-100 bg-white p-2.5 sm:p-3">
            <div className="mb-2.5 flex flex-wrap gap-1.5 sm:gap-2">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => sendMessage(QUICK_ACTION_MESSAGES[action] || action)}
                  className="rounded-full border border-red-200 bg-gradient-to-b from-red-50 to-white px-2.5 py-1 text-xs font-semibold text-red-700 transition hover:border-red-300 hover:from-red-100 hover:to-red-50"
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
              className="flex items-center gap-1.5 sm:gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="खबर पूछें... e.g. आज की बड़ी खबर"
                className="flex-1 rounded-xl border border-red-200 bg-red-50/30 px-3 py-2 text-sm outline-none transition focus:border-[#C8102E] focus:bg-white"
                maxLength={1200}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-xl bg-[#C8102E] px-3 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(200,16,46,0.28)] disabled:opacity-60"
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
