import type { CollectionConfig } from "payload";

const MAX_IMAGE_SIZE_BYTES = 500_000; // 500KB soft warning
const MAX_IMAGE_SIZE_HARD = 5_000_000; // 5MB hard reject

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
    description:
      "Upload production-ready visuals. Images are auto-resized to 4 sizes (thumbnail/card/hero/og). Recommended: keep originals under 500KB for best performance.",
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        const file = req?.file;
        if (file && file.size) {
          // Hard limit: reject over 5MB with Hindi error message
          if (file.size > MAX_IMAGE_SIZE_HARD) {
            throw new Error(
              `फ़ाइल बहुत बड़ी है (${(file.size / 1_000_000).toFixed(1)}MB)। अधिकतम 5MB की फ़ाइल अपलोड करें।`
            );
          }
          // Soft warning: log files over 500KB
          if (file.size > MAX_IMAGE_SIZE_BYTES && req.payload?.logger) {
            req.payload.logger.warn(
              `[Media] Large image: ${file.name || "unknown"} — ` +
                `${(file.size / 1_000).toFixed(0)}KB (recommended max 500KB). Auto-resize will generate optimized sizes.`
            );
          }
        }
        return {
          ...data,
          fileSizeKB: file?.size ? Math.round(file.size / 1000) : data?.fileSizeKB,
        };
      },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      label: "Alt Text (for SEO & accessibility)",
      admin: {
        description: "Describe the image in one sentence so readers using assistive tech understand the visual.",
      },
      validate: (value: string | null | undefined) => {
        if (!value) return "Alt text is required for newsroom accessibility and SEO.";
        if (value.trim().length < 8) return "Alt text is too short. Add a descriptive sentence.";
        return true;
      },
    },
    {
      name: "caption",
      type: "text",
      label: "Caption",
      admin: { description: "Optional on cards, but recommended for context on long-form stories." },
    },
    {
      name: "credit",
      type: "text",
      label: "Photographer / Source Credit",
      admin: { description: "Use agency/source format, e.g. PTI, Reuters, Staff Photo." },
    },
    {
      name: "usageRights",
      type: "select",
      label: "Usage Rights",
      defaultValue: "own",
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
    {
      name: "fileSizeKB",
      type: "number",
      label: "File Size (KB)",
      admin: {
        readOnly: true,
        description: "Auto-filled on upload. Keep under 500KB for best performance.",
        position: "sidebar",
      },
    },
  ],
};
