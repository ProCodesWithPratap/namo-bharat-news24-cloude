"use client";

import { useEffect, useState } from "react";

type QuickStatState = {
  total: number;
  published: number;
  drafts: number;
  breaking: number;
};

const initialStats: QuickStatState = {
  total: 0,
  published: 0,
  drafts: 0,
  breaking: 0,
};

async function fetchTotal(endpoint: string): Promise<number> {
  const response = await fetch(endpoint, { credentials: "include" });
  if (!response.ok) return 0;
  const data = await response.json();
  return Number(data?.totalDocs || 0);
}

export default function QuickStats() {
  const [stats, setStats] = useState<QuickStatState>(initialStats);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        const [total, published, drafts, breaking] = await Promise.all([
          fetchTotal("/api/articles?limit=1"),
          fetchTotal("/api/articles?where[status][equals]=published&limit=1"),
          fetchTotal("/api/articles?where[status][equals]=draft&limit=1"),
          fetchTotal("/api/articles?where[breakingNews][equals]=true&limit=1"),
        ]);

        if (!isMounted) return;
        setStats({ total, published, drafts, breaking });
      } catch {
        if (!isMounted) return;
        setStats(initialStats);
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="nbn-qs" aria-label="Quick article stats">
      <article className="nbn-qs__card">
        <span>Total Articles</span>
        <strong>{stats.total}</strong>
      </article>
      <article className="nbn-qs__card nbn-qs__card--published">
        <span>Published</span>
        <strong>{stats.published}</strong>
      </article>
      <article className="nbn-qs__card nbn-qs__card--drafts">
        <span>Drafts</span>
        <strong>{stats.drafts}</strong>
      </article>
      <article className="nbn-qs__card nbn-qs__card--breaking">
        <span>Breaking Live</span>
        <strong>{stats.breaking}</strong>
      </article>
    </section>
  );
}
