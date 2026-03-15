"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { NAV_CATEGORIES, SITE_NAME } from "@/lib/utils";

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      {/* Top utility bar */}
      <div className="bg-[#111] text-white text-xs py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-gray-400">
            <span className="font-hindi">
              {new Date().toLocaleDateString("hi-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/e-paper" className="hover:text-white transition-colors font-hindi">ई-पेपर</Link>
            <Link href="/videos" className="hover:text-white transition-colors font-hindi">वीडियो</Link>
            <Link href="/web-stories" className="hover:text-white transition-colors font-hindi">वेब स्टोरी</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`sticky-header bg-white border-b border-gray-200 transition-shadow duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        {/* Logo row */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center gap-1">
                <span
                  className="font-hindi text-xl md:text-2xl font-extrabold leading-none"
                  style={{ color: "#FF6B00" }}
                >
                  नमो:
                </span>
                <span
                  className="font-hindi text-xl md:text-2xl font-extrabold leading-none"
                  style={{ color: "#C8102E" }}
                >
                  भारत न्यूज़
                </span>
                <span
                  className="font-ui text-xl md:text-2xl font-extrabold leading-none"
                  style={{ color: "#111" }}
                >
                  24
                </span>
              </div>
            </Link>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Search toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-600 hover:text-primary transition-colors rounded-full hover:bg-red-50"
                aria-label="Search"
              >
                <SearchIcon />
              </button>

              {/* Live badge */}
              <Link
                href="/live"
                className="hidden md:flex live-badge text-xs font-bold"
              >
                <span className="breaking-dot"></span>
                LIVE
              </Link>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-gray-100 bg-gray-50 py-3 px-4 animate-slideDown">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="खबर खोजें... (Search news)"
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary font-hindi"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors"
                style={{ backgroundColor: "#C8102E" }}
              >
                खोजें
              </button>
            </form>
          </div>
        )}

        {/* Desktop navigation */}
        <nav className="hidden md:block border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex items-center gap-0 overflow-x-auto">
              <li>
                <Link
                  href="/"
                  className="flex items-center px-3 py-3 text-sm font-semibold text-gray-800 hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors whitespace-nowrap font-hindi"
                >
                  होम
                </Link>
              </li>
              {NAV_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/${cat.slug}`}
                    className="flex items-center px-3 py-3 text-sm font-semibold text-gray-700 hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors whitespace-nowrap font-hindi"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/jobs"
                  className="flex items-center px-3 py-3 text-sm font-semibold text-gray-700 hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors whitespace-nowrap font-hindi"
                >
                  नौकरी
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobile navigation drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-white overflow-y-auto animate-slideDown">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-hindi text-lg font-extrabold" style={{ color: "#C8102E" }}>
                नमो: भारत न्यूज़ <span style={{ color: "#111" }}>24</span>
              </span>
              <button onClick={() => setMobileOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            <ul className="py-2">
              <li>
                <Link
                  href="/"
                  className="block px-5 py-3 font-hindi font-semibold text-gray-800 hover:bg-red-50 hover:text-primary border-l-4 border-transparent hover:border-primary transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  🏠 होम
                </Link>
              </li>
              {NAV_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/${cat.slug}`}
                    className="block px-5 py-3 font-hindi text-gray-700 hover:bg-red-50 hover:text-primary border-l-4 border-transparent hover:border-primary transition-all"
                    onClick={() => setMobileOpen(false)}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li className="border-t mt-2 pt-2">
                <Link href="/videos" className="block px-5 py-3 font-hindi text-gray-700" onClick={() => setMobileOpen(false)}>📺 वीडियो</Link>
              </li>
              <li>
                <Link href="/web-stories" className="block px-5 py-3 font-hindi text-gray-700" onClick={() => setMobileOpen(false)}>📸 वेब स्टोरी</Link>
              </li>
              <li>
                <Link href="/about" className="block px-5 py-3 text-gray-700" onClick={() => setMobileOpen(false)}>About Us</Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
