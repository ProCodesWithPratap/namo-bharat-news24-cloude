import type { GlobalConfig } from "payload";

const adminWriteAccess = ({ req: { user } }: any) =>
  ["section-editor", "managing-editor", "editor-in-chief", "super-admin"].includes(user?.role);

export const AssistantSettings: GlobalConfig = {
  slug: "assistant-settings",
  label: "Assistant Settings",
  access: {
    read: () => true,
    update: adminWriteAccess,
  },
  admin: {
    group: "Settings",
  },
  fields: [
    {
      name: "assistantEnabled",
      type: "checkbox",
      defaultValue: true,
      label: "Enable AI News Desk",
    },
    {
      name: "fallbackMessage",
      type: "textarea",
      defaultValue: "AI News Desk अभी उपलब्ध नहीं है। कृपया थोड़ी देर में दोबारा कोशिश करें।",
    },
    {
      name: "quickActions",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "prompt", type: "text", required: true },
      ],
    },
  ],
};
