"use client";

import { useEffect, useState } from "react";

export default function PWAProvider() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => null);
    }

    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] bg-[#C8102E] text-white px-3 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
          <span className="font-hindi text-sm font-semibold">आप ऑफलाइन हैं — पुरानी खबरें पढ़ें</span>
        </div>
        <button onClick={() => window.location.reload()} className="font-hindi text-xs border border-white/40 rounded px-2 py-1">रिफ्रेश</button>
      </div>
    </div>
  );
}
