import type { CollectionConfig } from "payload";

export const Authors: CollectionConfig = {
  slug: "authors",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "designation", "slug"],
    group: "Content",
  },
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true, label: "Name" },
    { name: "nameHindi", type: "text", label: "Name (Hindi)" },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: "URL Slug",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Profile Image",
    },
    { name: "bio", type: "textarea", label: "Bio (English)" },
    { name: "bioHindi", type: "textarea", label: "Bio (Hindi)" },
    { name: "designation", type: "text", label: "Designation / Beats" },
    {
      name: "socialLinks",
      type: "group",
      label: "Social / Contact",
      fields: [
        { name: "twitter", type: "text" },
        { name: "instagram", type: "text" },
        { name: "email", type: "email" },
      ],
    },
    {
      name: "linkedUser",
      type: "relationship",
      relationTo: "users",
      label: "Linked CMS User",
    },
  ],
};
