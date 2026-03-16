import React from "react";
import { getPayload } from "payload";

import configPromise from "@payload-config";

type RecentArticle = {
  id: string;
  headline?: string;
  status?: string;
  heroMedia?: unknown;
  publishDate?: string;
  updatedAt?: string;
};

type RecentMedia = {
  id: string;
  alt?: string;
  filename?: string;
  updatedAt?: string;
};

type RecentCategory = {
  id: string;
  name?: string;
};

const statCards = [
  { label: "Total Articles", key: "totalArticles", icon: "📰" },
  { label: "Drafts", key: "draftArticles", icon: "📝" },
  { label: "Published", key: "publishedArticles", icon: "✅" },
  { label: "No Hero Image", key: "missingHeroMedia", icon: "🖼️" },
  { label: "Media Library", key: "media", icon: "📸" },
] as const;

const quickActions = [
  {
    label: "Create Article",
    helper: "Start breaking or scheduled coverage",
    href: "/admin/collections/articles/create",
    icon: "✍️",
  },
  {
    label: "Upload Media",
    helper: "Add visuals for upcoming stories",
    href: "/admin/collections/media/create",
    icon: "🗂️",
  },
  {
    label: "Add Category",
    helper: "Open a new desk or beat quickly",
    href: "/admin/collections/categories/create",
    icon: "📚",
  },
  {
    label: "Create Live Blog",
    helper: "Spin up live event coverage",
    href: "/admin/collections/live-blogs/create",
    icon: "📡",
  },
];

const formatDate = (date?: string) => {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const articleTitle = (article: RecentArticle) => article.headline?.trim() || "Untitled article";

export default async function DashboardStats() {
  const payload = await getPayload({ config: configPromise });

  const [
    totalArticles,
    draftArticles,
    publishedArticles,
    missingHeroMedia,
    categories,
    media,
    recentArticles,
    recentDrafts,
    recentMedia,
    latestPublished,
    latestDraft,
    gapCategories,
  ] = await Promise.all([
    payload.count({ collection: "articles" }),
    payload.count({ collection: "articles", where: { status: { equals: "draft" } } }),
    payload.count({ collection: "articles", where: { status: { equals: "published" } } }),
    payload.count({
      collection: "articles",
      where: {
        and: [{ status: { equals: "published" } }, { heroMedia: { exists: false } }],
      },
    }),
    payload.count({ collection: "categories" }),
    payload.count({ collection: "media" }),
    payload.find({
      collection: "articles",
      limit: 5,
      sort: "-updatedAt",
      select: { id: true, headline: true, status: true, publishDate: true, updatedAt: true, heroMedia: true },
    }),
    payload.find({
      collection: "articles",
      limit: 5,
      sort: "-updatedAt",
      where: { status: { equals: "draft" } },
      select: { id: true, headline: true, status: true, updatedAt: true },
    }),
    payload.find({
      collection: "media",
      limit: 5,
      sort: "-updatedAt",
      select: { id: true, alt: true, filename: true, updatedAt: true },
    }),
    payload.find({
      collection: "articles",
      limit: 1,
      sort: "-publishDate",
      where: { status: { equals: "published" } },
      select: { id: true, headline: true, publishDate: true },
    }),
    payload.find({
      collection: "articles",
      limit: 1,
      sort: "-updatedAt",
      where: { status: { equals: "draft" } },
      select: { id: true, headline: true, updatedAt: true },
    }),
    payload.find({
      collection: "categories",
      limit: 6,
      sort: "name",
      select: { id: true, name: true },
    }),
  ]);

  const gapChecks = await Promise.all(
    (gapCategories.docs as RecentCategory[]).map(async (category) => {
      const count = await payload.count({
        collection: "articles",
        where: {
          and: [{ status: { equals: "published" } }, { category: { equals: category.id } }],
        },
      });

      return {
        id: category.id,
        name: category.name || "Unnamed category",
        publishedCount: count.totalDocs,
      };
    }),
  );

  const contentGaps = gapChecks.filter((item) => item.publishedCount === 0).slice(0, 3);

  const combinedActivity = [
    ...(recentArticles.docs as RecentArticle[]).map((article) => ({
      id: `article-${article.id}`,
      text: `Article updated: ${articleTitle(article)}`,
      at: article.updatedAt,
    })),
    ...(recentMedia.docs as RecentMedia[]).map((file) => ({
      id: `media-${file.id}`,
      text: `Media uploaded: ${file.alt || file.filename || "Untitled media"}`,
      at: file.updatedAt,
    })),
  ]
    .sort((a, b) => new Date(b.at || "").getTime() - new Date(a.at || "").getTime())
    .slice(0, 6);

  const stats = {
    totalArticles: totalArticles.totalDocs,
    draftArticles: draftArticles.totalDocs,
    publishedArticles: publishedArticles.totalDocs,
    missingHeroMedia: missingHeroMedia.totalDocs,
    categories: categories.totalDocs,
    media: media.totalDocs,
  };

  return (
    <section className="nbn-dashboard" aria-label="Newsroom dashboard quick stats">
      <header className="nbn-dashboard__header">
        <p className="nbn-dashboard__eyebrow">Editorial Command Center</p>
        <h2>Newsroom Overview</h2>
        <p className="nbn-dashboard__subtitle">
          A live snapshot of publishing flow, open drafts, and content readiness across the desk.
        </p>
      </header>

      <div className="nbn-dashboard__highlights">
        <article className="nbn-dashboard__highlight-card">
          <span>Latest Published</span>
          <strong>{latestPublished.docs[0] ? articleTitle(latestPublished.docs[0] as RecentArticle) : "No published stories"}</strong>
          <small>{formatDate((latestPublished.docs[0] as RecentArticle | undefined)?.publishDate)}</small>
        </article>
        <article className="nbn-dashboard__highlight-card">
          <span>Latest Draft</span>
          <strong>{latestDraft.docs[0] ? articleTitle(latestDraft.docs[0] as RecentArticle) : "No active drafts"}</strong>
          <small>{formatDate((latestDraft.docs[0] as RecentArticle | undefined)?.updatedAt)}</small>
        </article>
        <article className="nbn-dashboard__highlight-card nbn-dashboard__highlight-card--alert">
          <span>Missing Featured Image</span>
          <strong>{stats.missingHeroMedia}</strong>
          <small>Published stories needing hero media</small>
        </article>
      </div>

      <div className="nbn-dashboard__grid">
        {statCards.map((card) => (
          <article key={card.key} className="nbn-dashboard__card">
            <div className="nbn-dashboard__card-label">
              <span>{card.icon}</span>
              <p>{card.label}</p>
            </div>
            <strong>{stats[card.key]}</strong>
          </article>
        ))}
      </div>

      <div className="nbn-dashboard__content-grid">
        <article className="nbn-dashboard__list-card">
          <h3>Recent Articles</h3>
          <ul>
            {(recentArticles.docs as RecentArticle[]).map((article) => (
              <li key={article.id}>
                <span>{articleTitle(article)}</span>
                <small>{article.status || "—"}</small>
              </li>
            ))}
          </ul>
        </article>

        <article className="nbn-dashboard__list-card">
          <h3>Recent Drafts</h3>
          <ul>
            {(recentDrafts.docs as RecentArticle[]).map((article) => (
              <li key={article.id}>
                <span>{articleTitle(article)}</span>
                <small>{formatDate(article.updatedAt)}</small>
              </li>
            ))}
          </ul>
        </article>

        <article className="nbn-dashboard__list-card">
          <h3>Recent Media Uploads</h3>
          <ul>
            {(recentMedia.docs as RecentMedia[]).map((file) => (
              <li key={file.id}>
                <span>{file.alt || file.filename || "Untitled media"}</span>
                <small>{formatDate(file.updatedAt)}</small>
              </li>
            ))}
          </ul>
        </article>

        <article className="nbn-dashboard__list-card">
          <h3>Recent Activity</h3>
          <ul>
            {combinedActivity.map((item) => (
              <li key={item.id}>
                <span>{item.text}</span>
                <small>{formatDate(item.at)}</small>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="nbn-dashboard__bottom-row">
        <article className="nbn-dashboard__content-gap">
          <h3>Content Gaps</h3>
          {contentGaps.length ? (
            <ul>
              {contentGaps.map((gap) => (
                <li key={gap.id}>{gap.name} has no published stories yet.</li>
              ))}
            </ul>
          ) : (
            <p>Top categories currently have published coverage.</p>
          )}
        </article>

        <div className="nbn-dashboard__actions">
          {quickActions.map((action) => (
            <a key={action.href} href={action.href}>
              <div>
                <span aria-hidden="true">{action.icon}</span>
                <strong>{action.label}</strong>
              </div>
              <small>{action.helper}</small>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
