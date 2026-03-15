import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    tokenExpiration: 7200, // 2 hours
    maxLoginAttempts: 5,
    lockTime: 600000, // 10 minutes
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "role", "updatedAt"],
    group: "Administration",
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: async ({ req }) => {
      if (req.user?.role === "super-admin") return true;

      const existingUsers = await req.payload.find({
        collection: "users",
        limit: 1,
        depth: 0,
        overrideAccess: true,
      });

      return existingUsers.totalDocs === 0;
    },
    update: ({ req: { user }, id }) => {
      if (user?.role === "super-admin") return true;
      return user?.id === id;
    },
    delete: ({ req: { user } }) => user?.role === "super-admin",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Full Name",
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "reporter",
      options: [
        { label: "Super Admin", value: "super-admin" },
        { label: "Editor-in-Chief", value: "editor-in-chief" },
        { label: "Managing Editor", value: "managing-editor" },
        { label: "Section Editor", value: "section-editor" },
        { label: "Sub-Editor", value: "sub-editor" },
        { label: "Reporter", value: "reporter" },
        { label: "Photo Editor", value: "photo-editor" },
        { label: "Video Editor", value: "video-editor" },
        { label: "SEO Editor", value: "seo-editor" },
        { label: "Ad Manager", value: "ad-manager" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
      label: "Profile Photo",
    },
    {
      name: "bio",
      type: "textarea",
      label: "About / Bio",
    },
    {
      name: "designation",
      type: "text",
      label: "Job Title / Designation",
    },
    {
      name: "socialLinks",
      type: "group",
      label: "Social Links",
      fields: [
        { name: "twitter", type: "text", label: "Twitter / X" },
        { name: "instagram", type: "text", label: "Instagram" },
        { name: "linkedin", type: "text", label: "LinkedIn" },
        { name: "facebook", type: "text", label: "Facebook" },
      ],
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
      label: "Active",
      admin: { position: "sidebar" },
    },
  ],
  timestamps: true,
};
