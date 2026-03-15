import type { CollectionConfig } from "payload";

export const LiveBlogs: CollectionConfig = {
  slug: "live-blogs",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "updatedAt"],
    group: "Content",
  },
  access: { read: () => true },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "titleHindi", type: "text", label: "Title (Hindi)" },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "intro", type: "richText", label: "Intro / Context" },
    {
      name: "status",
      type: "select",
      defaultValue: "active",
      options: [
        { label: "Active (Live)", value: "active" },
        { label: "Ended", value: "ended" },
        { label: "Archived", value: "archived" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "entries",
      type: "array",
      label: "Live Updates",
      fields: [
        { name: "timestamp", type: "date", required: true, admin: { date: { pickerAppearance: "dayAndTime" } } },
        { name: "content", type: "richText", required: true },
        { name: "author", type: "relationship", relationTo: "authors" },
        { name: "media", type: "upload", relationTo: "media" },
        {
          name: "type",
          type: "select",
          defaultValue: "update",
          options: [
            { label: "Update", value: "update" },
            { label: "Breaking", value: "breaking" },
            { label: "Official Statement", value: "statement" },
            { label: "Media", value: "media" },
          ],
        },
      ],
      admin: { initCollapsed: true },
    },
    {
      name: "relatedTopic",
      type: "relationship",
      relationTo: "tags",
      label: "Related Topic Tag",
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      admin: { position: "sidebar" },
    },
  ],
  timestamps: true,
};
