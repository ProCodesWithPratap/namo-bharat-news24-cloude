import type { GlobalConfig } from "payload";

export const AssistantSettings: GlobalConfig = {
  slug: "assistant-settings",
  label: "Assistant Settings",
  access: {
    read: () => true,
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
