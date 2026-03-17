"use client";

import { useEffect } from "react";
import { trackArticleView } from "@/lib/analytics";

export default function ArticleAnalytics({ slug, category, author }: { slug: string; category: string; author?: string }) {
  useEffect(() => {
    trackArticleView(slug, category, author);
  }, [slug, category, author]);

  return null;
}
