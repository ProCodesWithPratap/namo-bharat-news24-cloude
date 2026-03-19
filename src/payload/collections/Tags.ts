import type { CollectionConfig } from "payload";

const adminWriteAccess = ({ req: { user } }: any) =>
  ["section-editor", "managing-editor", "editor-in-chief", "super-admin"].includes(user?.role);

export const Tags: CollectionConfig = {
  slug: "tags",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug"],
    group: "Taxonomy",
  },
  access: {
    read: () => true,
    create: adminWriteAccess,
    update: adminWriteAccess,
    delete: adminWriteAccess,
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "nameHindi", type: "text", label: "Name (Hindi)" },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "description", type: "textarea" },
    {
      name: "seo",
      type: "group",
      label: "SEO",
      fields: [
        { name: "metaTitle", type: "text" },
        { name: "metaDescription", type: "textarea" },
      ],
    },
  ],
};
