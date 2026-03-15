import type { CollectionConfig } from "payload";

export const WebStories: CollectionConfig = {
  slug: "web-stories",
  admin: {
    useAsTitle: "title",
    group: "Content",
  },
  access: { read: () => true },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "titleHindi", type: "text", label: "Title (Hindi)" },
    { name: "slug", type: "text", required: true, unique: true },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Cover Image",
    },
    {
      name: "slides",
      type: "array",
      label: "Story Slides",
      minRows: 2,
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
        { name: "heading", type: "text" },
        { name: "text", type: "textarea" },
        {
          name: "layout",
          type: "select",
          defaultValue: "bottom-third",
          options: [
            { label: "Bottom Third", value: "bottom-third" },
            { label: "Full Overlay", value: "full" },
            { label: "Top Bar", value: "top" },
            { label: "No Text", value: "none" },
          ],
        },
      ],
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
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
      admin: { position: "sidebar" },
    },
  ],
  timestamps: true,
};
