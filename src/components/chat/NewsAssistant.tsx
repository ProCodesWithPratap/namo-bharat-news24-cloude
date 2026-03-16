"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ArticleHint = {
  id: string;
  title: string;
  category: string;
  url: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  articles?: ArticleHint[];
};

const QUICK_ACTIONS = [
  "Latest News",
  "National",
  "Trending",
  "Contact",
  "आज की खबर क्या है",
];

const OFFLINE_REPLY =
  "AI News Desk अभी उपलब्ध नहीं है। कृपया थोड़ी देर में दोबारा कोशिश करें या Contact पेज देखें।";

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

  const history = useMemo(
    () => messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
    [messages],
  );

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
        className="fixed bottom-5 right-4 md:bottom-6 md:right-6 z-[120] rounded-full bg-gradient-to-r from-[#C8102E] to-[#ea314d] px-4 py-3 text-white shadow-[0_12px_32px_rgba(200,16,46,0.38)] transition hover:scale-[1.02]"
      >
        <span className="font-hindi text-sm font-bold">AI News Desk</span>
      </button>

      <div
        className={cn(
          "fixed z-[120] transition-all duration-300",
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none",
          "bottom-20 right-4 md:bottom-24 md:right-6 w-[calc(100vw-2rem)] max-w-md",
        )}
      >
        <div className="overflow-hidden rounded-3xl border border-red-100 bg-white/95 backdrop-blur shadow-[0_18px_48px_rgba(17,17,17,0.24)]">
          <div className="bg-gradient-to-r from-[#C8102E] to-[#df2f4a] px-4 py-3 text-white">
            <p className="font-hindi text-sm font-bold">AI News Desk · नमो: भारत न्यूज़ 24</p>
            <p className="text-xs text-red-100">Hindi-first newsroom assistant</p>
          </div>

          <div className="h-[58vh] max-h-[500px] overflow-y-auto bg-gradient-to-b from-white to-red-50/30 p-3 space-y-3">
            {messages.map((m, i) => (
              <div key={`${m.role}-${i}`} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-[#C8102E] text-white rounded-br-md"
                      : "bg-white border border-red-100 text-gray-800 rounded-bl-md shadow-sm",
                  )}
                >
                  <p className="whitespace-pre-wrap">{m.content || (loading && i === messages.length - 1 ? "सोच रहा हूँ…" : "")}</p>
                  {!!m.articles?.length && (
                    <div className="mt-2 space-y-2">
                      {m.articles.map((a) => (
                        <Link
                          key={a.id}
                          href={a.url}
                          className="block rounded-xl border border-red-100 bg-red-50 px-2 py-1.5 text-xs text-gray-800 hover:bg-red-100"
                        >
                          <span className="font-semibold">{a.title}</span>
                          <span className="ml-2 text-red-700">{a.category}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {!messages.length && (
              <p className="text-sm text-gray-500">आप यहाँ से जल्दी खबरें खोज सकते हैं।</p>
            )}
          </div>

          <div className="border-t border-red-100 p-3 bg-white">
            <div className="mb-2 flex flex-wrap gap-2">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => sendMessage(action)}
                  className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                >
                  {action}
                </button>
              ))}
            </div>

            {error && (
              <div className="mb-2 rounded-lg border border-red-200 bg-red-50 px-2 py-1.5 text-xs text-red-700 flex items-center justify-between gap-2">
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
                placeholder="खबर पूछें... e.g. आज की बड़ी खबर"
                className="flex-1 rounded-xl border border-red-200 px-3 py-2 text-sm outline-none focus:border-[#C8102E]"
                maxLength={1200}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-xl bg-[#C8102E] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
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
