import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    staticDir: "public/media",
    imageSizes: [
      { name: "thumbnail", width: 400, height: 225, position: "centre" },
      { name: "card", width: 800, height: 450, position: "centre" },
      { name: "hero", width: 1280, height: 720, position: "centre" },
      { name: "og", width: 1200, height: 630, position: "centre" },
    ],
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/*", "video/mp4", "video/webm"],
  },
  admin: {
    group: "Media",
    defaultColumns: ["filename", "alt", "credit", "updatedAt"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      label: "Alt Text (for SEO & accessibility)",
    },
    {
      name: "caption",
      type: "text",
      label: "Caption",
    },
    {
      name: "credit",
      type: "text",
      label: "Photographer / Source Credit",
    },
    {
      name: "usageRights",
      type: "select",
      label: "Usage Rights",
      options: [
        { label: "Own / Licensed", value: "own" },
        { label: "AP / PTI", value: "agency" },
        { label: "Reuters", value: "reuters" },
        { label: "Getty Images", value: "getty" },
        { label: "Creative Commons", value: "cc" },
        { label: "Restricted", value: "restricted" },
      ],
    },
    {
      name: "focalPoint",
      type: "point",
      label: "Focal Point",
    },
  ],
};
