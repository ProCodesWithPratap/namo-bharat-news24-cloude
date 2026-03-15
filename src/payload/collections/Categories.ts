import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "nameHindi", "slug", "parent", "navOrder"],
    group: "Content",
  },
  access: { read: () => true },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Name (English)",
    },
    {
      name: "nameHindi",
      type: "text",
      label: "Name (Hindi)",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: "URL Slug",
      admin: { description: "e.g. national, sports, entertainment" },
    },
    {
      name: "parent",
      type: "relationship",
      relationTo: "categories",
      label: "Parent Category",
    },
    {
      name: "icon",
      type: "text",
      label: "Icon (emoji or icon class)",
    },
    {
      name: "navOrder",
      type: "number",
      defaultValue: 99,
      label: "Navigation Order",
    },
    {
      name: "color",
      type: "text",
      label: "Accent Color (hex)",
      admin: { description: "Optional — overrides default red" },
    },
    {
      name: "description",
      type: "textarea",
      label: "Category Description",
    },
    {
      name: "seo",
      type: "group",
      label: "SEO",
      fields: [
        { name: "metaTitle", type: "text", label: "Meta Title" },
        { name: "metaDescription", type: "textarea", label: "Meta Description" },
        { name: "ogImage", type: "upload", relationTo: "media", label: "OG Image" },
      ],
    },
    {
      name: "showInNav",
      type: "checkbox",
      defaultValue: true,
      label: "Show in Navigation",
    },
  ],
};
