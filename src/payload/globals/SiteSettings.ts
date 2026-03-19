import type { GlobalConfig } from "payload";

const adminWriteAccess = ({ req: { user } }: any) =>
  ["section-editor", "managing-editor", "editor-in-chief", "super-admin"].includes(user?.role);

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  access: {
    read: () => true,
    update: adminWriteAccess,
  },
  admin: {
    group: "Settings",
  },
  fields: [
    { name: "siteName", type: "text", defaultValue: "नमो: भारत न्यूज़ 24" },
    { name: "tagline", type: "text", defaultValue: "तथ्य स्पष्ट, विचार निष्पक्ष।" },
    { name: "contactEmail", type: "email" },
    { name: "editorialEmail", type: "email" },
    { name: "phone", type: "text" },
    { name: "address", type: "textarea" },
    {
      name: "social",
      type: "group",
      fields: [
        { name: "facebook", type: "text" },
        { name: "instagram", type: "text" },
        { name: "youtube", type: "text" },
        { name: "whatsapp", type: "text" },
        { name: "x", type: "text" },
      ],
    },
  ],
};
