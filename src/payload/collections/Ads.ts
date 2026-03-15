import type { CollectionConfig } from "payload";

export const Ads: CollectionConfig = {
  slug: "ads",
  admin: {
    useAsTitle: "slotName",
    group: "Monetization",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }: any) => ["ad-manager", "super-admin"].includes(user?.role),
    update: ({ req: { user } }: any) => ["ad-manager", "super-admin"].includes(user?.role),
    delete: ({ req: { user } }: any) => ["super-admin"].includes(user?.role),
  },
  fields: [
    { name: "slotName", type: "text", required: true, label: "Ad Slot Name" },
    {
      name: "placement",
      type: "select",
      required: true,
      options: [
        { label: "Homepage Hero", value: "homepage-hero" },
        { label: "Homepage Sidebar", value: "homepage-sidebar" },
        { label: "Article Top", value: "article-top" },
        { label: "Article Middle", value: "article-mid" },
        { label: "Article Bottom", value: "article-bottom" },
        { label: "Article Sidebar", value: "article-sidebar" },
        { label: "Category Top", value: "category-top" },
        { label: "Sticky Footer", value: "sticky-footer" },
        { label: "Breaking Bar", value: "breaking-bar" },
      ],
    },
    {
      name: "adType",
      type: "select",
      options: [
        { label: "Google AdSense / GAM", value: "gam" },
        { label: "Direct HTML/Script", value: "html" },
        { label: "Image + Link", value: "image" },
      ],
    },
    { name: "adScript", type: "code", label: "Ad Script / HTML", admin: { language: "html" } },
    { name: "creative", type: "upload", relationTo: "media", label: "Creative Image" },
    { name: "clickUrl", type: "text", label: "Click URL" },
    { name: "startDate", type: "date", label: "Start Date" },
    { name: "endDate", type: "date", label: "End Date" },
    { name: "targetingNotes", type: "textarea", label: "Targeting Notes" },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
      label: "Active",
      admin: { position: "sidebar" },
    },
  ],
};
