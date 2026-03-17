"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { NAV_CATEGORIES } from "@/lib/utils";
import { newsroomMeta, socialLinks, topUtilityLinks } from "@/lib/site-config";
import { trackSearch } from "@/lib/analytics";

type SearchResult = { id: string; slug: string; headline: string; category: string; categorySlug: string };

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [indiaDateTime, setIndiaDateTime] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("hi-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
      timeZone: "Asia/Kolkata",
    });

    const updateDateTime = () => setIndiaDateTime(formatter.format(new Date()));
    updateDateTime();

    const interval = setInterval(updateDateTime, 60_000);
    const onVisibility = () => {
      if (!document.hidden) updateDateTime();
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const fetchSuggestions = useCallback(async (q: string) => {
    const query = q.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setSuggestionsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSuggestions(data.docs || []);
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
    } finally {
      setSuggestionsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(searchQuery);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, fetchSuggestions]);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const performSearch = () => {
    const query = searchQuery.trim();
    if (query) {
      trackSearch(query);
      setShowSuggestions(false);
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  return (
    <>
      <div className="bg-[#111] text-white text-xs py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <span className="font-hindi text-gray-400">{indiaDateTime || "भारत समय"}</span>
          <div className="flex items-center gap-4">
            <a href={`tel:${newsroomMeta.phone.replace(/\s+/g, "")}`} className="font-hindi hover:text-white transition-colors">{newsroomMeta.phone}</a>
            <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp Channel</a>
            {topUtilityLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`hover:text-white transition-colors ${link.hindi ? "font-hindi" : ""}`}>{link.label}</Link>
            ))}
          </div>
        </div>
      </div>

      <header className={`sticky-header bg-white border-b border-gray-200 transition-shadow duration-300 ${scrolled ? "shadow-md" : ""}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button className="md:hidden p-2 text-gray-700" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">{mobileOpen ? <CloseIcon /> : <MenuIcon />}</button>
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center gap-1">
                <span className="font-hindi text-xl md:text-2xl font-extrabold leading-none" style={{ color: "#FF6B00" }}>नमो:</span>
                <span className="font-hindi text-xl md:text-2xl font-extrabold leading-none" style={{ color: "#C8102E" }}>भारत न्यूज़</span>
                <span className="font-ui text-xl md:text-2xl font-extrabold leading-none" style={{ color: "#111" }}>24</span>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDesktopMenuOpen((value) => !value)}
                className="hidden md:inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-[#C8102E] hover:text-[#C8102E]"
              >
                <MenuIcon />
                मेनू
              </button>
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-gray-600 hover:text-primary transition-colors rounded-full hover:bg-red-50" aria-label="Search"><SearchIcon /></button>
              <Link href="/live" className="hidden md:flex live-badge text-xs font-bold"><span className="breaking-dot"></span>LIVE</Link>
            </div>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-gray-100 bg-gray-50 py-3 px-4 animate-slideDown">
            <div className="max-w-2xl mx-auto relative" ref={suggestionsRef}>
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchQuery.trim().length >= 2) setShowSuggestions(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setShowSuggestions(false);
                  }}
                  autoComplete="off"
                  placeholder="खबर खोजें..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary font-hindi"
                />
                <button type="submit" className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors" style={{ backgroundColor: "#C8102E" }}>खोजें</button>
              </form>

              {showSuggestions && (suggestions.length > 0 || suggestionsLoading) && (
                <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                  {suggestionsLoading && <div className="px-4 py-3 text-sm font-hindi text-gray-500">खोज रहे हैं…</div>}
                  {suggestions.map((item) => (
                    <Link key={item.id} href={`/article/${item.slug}`} onClick={() => setShowSuggestions(false)} className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 hover:bg-red-50">
                      <span className="text-gray-400"><SearchIcon /></span>
                      <div className="min-w-0">
                        <p className="font-hindi text-sm text-gray-800 line-clamp-1">{item.headline}</p>
                        <p className="text-xs text-gray-400">{item.category}</p>
                      </div>
                    </Link>
                  ))}
                  <button onClick={performSearch} className="w-full text-left px-4 py-3 text-sm font-hindi text-[#C8102E] hover:bg-red-50">
                    "{searchQuery.trim()}" के लिए सभी परिणाम देखें →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {desktopMenuOpen && (
          <div className="hidden md:block border-t border-gray-100 bg-white/95 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                {[...topUtilityLinks, { href: "/contact", label: "संपर्क", hindi: true }, { href: "/careers", label: "Careers", hindi: false }].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setDesktopMenuOpen(false)}
                    className={`rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-[#C8102E] ${link.hindi ? "font-hindi" : ""}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        <nav className="hidden md:block border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex items-center gap-0 overflow-x-auto">
              <li><Link href="/" className="flex items-center px-3 py-3 text-sm font-semibold text-gray-800 hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors whitespace-nowrap font-hindi">होम</Link></li>
              {NAV_CATEGORIES.map((cat) => (
                <li key={cat.slug}><Link href={`/${cat.slug}`} className="flex items-center px-3 py-3 text-sm font-semibold text-gray-700 hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors whitespace-nowrap font-hindi">{cat.name}</Link></li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white overflow-y-auto animate-slideDown">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-hindi text-lg font-extrabold" style={{ color: "#C8102E" }}>नमो: भारत न्यूज़ <span style={{ color: "#111" }}>24</span></span>
              <button onClick={() => setMobileOpen(false)}><CloseIcon /></button>
            </div>
            <ul className="py-2">
              <li><Link href="/" className="block px-5 py-3 font-hindi font-semibold text-gray-800 hover:bg-red-50 hover:text-primary" onClick={() => setMobileOpen(false)}>🏠 होम</Link></li>
              {NAV_CATEGORIES.map((cat) => (
                <li key={cat.slug}><Link href={`/${cat.slug}`} className="block px-5 py-3 font-hindi text-gray-700 hover:bg-red-50 hover:text-primary" onClick={() => setMobileOpen(false)}>{cat.name}</Link></li>
              ))}
              {topUtilityLinks.map((link) => (
                <li key={link.href}><Link href={link.href} className={`block px-5 py-3 text-gray-700 ${link.hindi ? "font-hindi" : ""}`} onClick={() => setMobileOpen(false)}>{link.label}</Link></li>
              ))}
              <li><Link href="/contact" className="block px-5 py-3 text-gray-700 font-hindi" onClick={() => setMobileOpen(false)}>संपर्क</Link></li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
