import type { CollectionConfig } from "payload";

export const Videos: CollectionConfig = {
  slug: "videos",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "status", "publishDate"],
    group: "Content",
  },
  access: { read: () => true },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "titleHindi", type: "text", label: "Title (Hindi)" },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "description", type: "textarea" },
    {
      name: "embedUrl",
      type: "text",
      label: "Embed URL (YouTube / Vimeo)",
    },
    {
      name: "hostedFile",
      type: "upload",
      relationTo: "media",
      label: "Or Upload Video File",
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
      label: "Thumbnail Image",
    },
    { name: "duration", type: "text", label: "Duration (e.g. 3:42)" },
    { name: "transcript", type: "textarea", label: "Transcript (for SEO)" },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      admin: { position: "sidebar" },
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
      admin: { position: "sidebar" },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "publishDate",
      type: "date",
      admin: { position: "sidebar", date: { pickerAppearance: "dayAndTime" } },
    },
  ],
  timestamps: true,
};
