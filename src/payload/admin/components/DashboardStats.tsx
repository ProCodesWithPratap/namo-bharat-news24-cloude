import React from "react";
import { getPayload } from "payload";

import configPromise from "@payload-config";

const statCards = [
  { label: "Total Articles", key: "totalArticles" },
  { label: "Drafts", key: "draftArticles" },
  { label: "Published", key: "publishedArticles" },
  { label: "Categories", key: "categories" },
  { label: "Media Library", key: "media" },
] as const;

const quickActions = [
  { label: "Create Article", href: "/admin/collections/articles/create" },
  { label: "Upload Media", href: "/admin/collections/media/create" },
  { label: "Add Category", href: "/admin/collections/categories/create" },
  { label: "Add Live Blog", href: "/admin/collections/live-blogs/create" },
];

export default async function DashboardStats() {
  const payload = await getPayload({ config: configPromise });

  const [totalArticles, draftArticles, publishedArticles, categories, media] = await Promise.all([
    payload.count({ collection: "articles" }),
    payload.count({ collection: "articles", where: { status: { equals: "draft" } } }),
    payload.count({ collection: "articles", where: { status: { equals: "published" } } }),
    payload.count({ collection: "categories" }),
    payload.count({ collection: "media" }),
  ]);

  const stats = {
    totalArticles: totalArticles.totalDocs,
    draftArticles: draftArticles.totalDocs,
    publishedArticles: publishedArticles.totalDocs,
    categories: categories.totalDocs,
    media: media.totalDocs,
  };

  return (
    <section className="nbn-dashboard" aria-label="Newsroom dashboard quick stats">
      <header className="nbn-dashboard__header">
        <h2>Newsroom at a glance</h2>
        <p>Monitor publishing momentum and jump into your most common tasks.</p>
      </header>

      <div className="nbn-dashboard__grid">
        {statCards.map((card) => (
          <article key={card.key} className="nbn-dashboard__card">
            <p>{card.label}</p>
            <strong>{stats[card.key]}</strong>
          </article>
        ))}
      </div>

      <div className="nbn-dashboard__actions">
        {quickActions.map((action) => (
          <a key={action.href} href={action.href}>
            {action.label}
          </a>
        ))}
      </div>
    </section>
  );
}
