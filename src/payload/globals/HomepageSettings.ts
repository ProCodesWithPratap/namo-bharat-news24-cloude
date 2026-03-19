import type { GlobalConfig } from "payload";

const adminWriteAccess = ({ req: { user } }: any) =>
  ["section-editor", "managing-editor", "editor-in-chief", "super-admin"].includes(user?.role);

export const HomepageSettings: GlobalConfig = {
  slug: "homepage-settings",
  label: "Homepage Settings",
  access: {
    read: () => true,
    update: adminWriteAccess,
  },
  admin: {
    group: "Settings",
  },
  fields: [
    {
      name: "heroTitle",
      type: "text",
      defaultValue: "ताज़ा खबरें",
    },
    {
      name: "heroDescription",
      type: "textarea",
      defaultValue: "देश-दुनिया की प्रमुख खबरें हिंदी में, तेज़ और तथ्यात्मक रूप में।",
    },
    {
      name: "showTrendingRail",
      type: "checkbox",
      defaultValue: true,
    },
    {
      name: "editorNote",
      type: "textarea",
      admin: {
        description: "Optional internal guidance for homepage curation.",
      },
    },
  ],
};
