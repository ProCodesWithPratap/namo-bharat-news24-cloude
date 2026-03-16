import type { CollectionConfig } from "payload";

const articleAccess = {
  read: () => true,
  create: ({ req: { user } }: any) =>
    ["reporter", "sub-editor", "section-editor", "managing-editor", "editor-in-chief", "super-admin"].includes(user?.role),
  update: ({ req: { user } }: any) =>
    ["sub-editor", "section-editor", "managing-editor", "editor-in-chief", "super-admin", "seo-editor"].includes(user?.role),
  delete: ({ req: { user } }: any) =>
    ["editor-in-chief", "super-admin"].includes(user?.role),
};

export const Articles: CollectionConfig = {
  slug: "articles",
  admin: {
    useAsTitle: "headline",
    defaultColumns: ["headline", "category", "author", "status", "publishDate"],
    group: "Content",
    preview: (doc) => `${process.env.NEXT_PUBLIC_SERVER_URL}/article/${doc.slug}`,
  },
  versions: {
    drafts: { autosave: { interval: 2000 } },
    maxPerDoc: 50,
  },
  access: articleAccess,
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (!data.slug && data.headline) {
          data.slug = data.headline
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .substring(0, 100);
        }

        if (typeof data.slug === "string") {
          data.slug = data.slug
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "")
            .substring(0, 100);
        }

        return data;
      },
    ],
  },
  fields: [
    // ── Identity ────────────────────────────────────────────────
    {
      name: "headline",
      type: "text",
      required: true,
      label: "Headline",
      admin: { description: "Main headline (English)" },
    },
    {
      name: "headlineHindi",
      type: "text",
      label: "Headline (Hindi)",
    },
    {
      name: "shortHeadline",
      type: "text",
      label: "Short Headline (for tickers/cards)",
      admin: { description: "Max 80 characters" },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: "URL Slug",
      admin: {
        description:
          "Auto-generated from headline. Editors can fine tune this for SEO, but keep it short and hyphenated.",
      },
    },
    {
      name: "deck",
      type: "text",
      label: "Deck / Sub-headline",
    },
    {
      name: "excerpt",
      type: "textarea",
      label: "Excerpt (for cards & OG)",
      admin: { description: "Max 200 characters for best display" },
    },

    // ── Content ──────────────────────────────────────────────────
    {
      name: "heroMedia",
      type: "upload",
      relationTo: "media",
      label: "Hero Image / Video",
      admin: {
        description:
          "Recommended before publishing. Use a strong lead visual with complete alt text in Media Library.",
      },
      validate: (value: unknown, { siblingData }: { siblingData?: { status?: string } }) => {
        const status = siblingData?.status;
        if (status && ["ready", "published"].includes(status) && !value) {
          return "Hero media is required before an article can be marked Ready or Published.";
        }

        return true;
      },
    },
    {
      name: "heroCaption",
      type: "text",
      label: "Hero Image Caption",
    },
    {
      name: "body",
      type: "richText",
      label: "Article Body",
      required: true,
    },
    {
      name: "gallery",
      type: "array",
      label: "Photo Gallery",
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
        { name: "caption", type: "text" },
      ],
    },
    {
      name: "videoEmbed",
      type: "text",
      label: "Video Embed URL (YouTube / Vimeo)",
    },

    // ── Taxonomy ─────────────────────────────────────────────────
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
      label: "Category",
      admin: {
        position: "sidebar",
        description: "Required: every story must be assigned to a primary desk/category.",
      },
      validate: (value: unknown) =>
        value ? true : "Please assign a primary category before saving this article.",
    },
    {
      name: "subcategory",
      type: "relationship",
      relationTo: "categories",
      label: "Sub-category",
      admin: { position: "sidebar" },
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
      label: "Tags",
      admin: { position: "sidebar" },
    },
    {
      name: "location",
      type: "relationship",
      relationTo: "locations",
      label: "Location",
      admin: { position: "sidebar" },
    },

    // ── Authorship ───────────────────────────────────────────────
    {
      name: "author",
      type: "relationship",
      relationTo: "authors",
      hasMany: true,
      label: "Author(s)",
      admin: { position: "sidebar" },
    },
    {
      name: "sourceCredits",
      type: "text",
      label: "Source Credits (agency, e.g. PTI)",
      admin: { position: "sidebar" },
    },

    // ── Publishing ───────────────────────────────────────────────
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "In Review", value: "in-review" },
        { label: "Ready", value: "ready" },
        { label: "Published", value: "published" },
        { label: "Scheduled", value: "scheduled" },
        { label: "Unpublished", value: "unpublished" },
      ],
      admin: {
        position: "sidebar",
        description: "Draft = internal only. Published = live on site. Scheduled = publish automatically later.",
      },
    },
    {
      name: "publishDate",
      type: "date",
      label: "Publish Date & Time",
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime" },
        description: "Set when article goes live. Required when status is Published.",
      },
      validate: (value: unknown, { siblingData }: { siblingData?: { status?: string } }) => {
        if (siblingData?.status === "published" && !value) {
          return "Publish date is required when status is Published.";
        }

        return true;
      },
    },
    {
      name: "scheduleDate",
      type: "date",
      label: "Scheduled Date & Time",
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      name: "language",
      type: "select",
      defaultValue: "hi",
      options: [
        { label: "Hindi", value: "hi" },
        { label: "English", value: "en" },
        { label: "Bilingual", value: "bi" },
      ],
      admin: { position: "sidebar" },
    },

    // ── Flags ────────────────────────────────────────────────────
    {
      type: "row",
      fields: [
        {
          name: "breakingNews",
          type: "checkbox",
          defaultValue: false,
          label: "🔴 Breaking News",
        },
        {
          name: "featured",
          type: "checkbox",
          defaultValue: false,
          label: "⭐ Featured",
        },
        {
          name: "liveBlog",
          type: "checkbox",
          defaultValue: false,
          label: "📡 Live Blog",
        },
        {
          name: "sponsored",
          type: "checkbox",
          defaultValue: false,
          label: "💼 Sponsored",
        },
      ],
    },

    // ── SEO ──────────────────────────────────────────────────────
    {
      name: "seo",
      type: "group",
      label: "SEO & Social",
      fields: [
        { name: "metaTitle", type: "text", label: "Meta Title (60 chars max)" },
        { name: "metaDescription", type: "textarea", label: "Meta Description (160 chars max)" },
        { name: "canonicalUrl", type: "text", label: "Canonical URL (if overriding)" },
        {
          name: "schemaType",
          type: "select",
          label: "Schema Type",
          defaultValue: "NewsArticle",
          options: [
            { label: "News Article", value: "NewsArticle" },
            { label: "Live Blog Posting", value: "LiveBlogPosting" },
            { label: "Video Object", value: "VideoObject" },
            { label: "Review", value: "Review" },
          ],
        },
        { name: "ogImage", type: "upload", relationTo: "media", label: "OG Image" },
        {
          name: "noIndex",
          type: "checkbox",
          defaultValue: false,
          label: "No Index (hide from search engines)",
        },
      ],
    },

    // ── Related ──────────────────────────────────────────────────
    {
      name: "relatedStories",
      type: "relationship",
      relationTo: "articles",
      hasMany: true,
      label: "Related Stories (manual)",
      admin: { description: "Auto-related is also shown; these are pinned." },
    },

    // ── Editorial notes ──────────────────────────────────────────
    {
      name: "editorialNotes",
      type: "textarea",
      label: "Internal Editorial Notes (not published)",
      admin: {
        position: "sidebar",
        description: "Use for handoff notes (fact-check, legal, social copy, or updates needed).",
      },
    },
  ],
  timestamps: true,
};
