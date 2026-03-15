import { buildConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { en } from "payload/i18n/en";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Categories";
import { Authors } from "./collections/Authors";
import { Tags } from "./collections/Tags";
import { Locations } from "./collections/Locations";
import { Articles } from "./collections/Articles";
import { Videos } from "./collections/Videos";
import { LiveBlogs } from "./collections/LiveBlogs";
import { WebStories } from "./collections/WebStories";
import { Ads } from "./collections/Ads";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
  secret: process.env.PAYLOAD_SECRET || "fallback-dev-secret-change-in-production",
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " — News Portal Admin",
      favicon: "/favicon.ico",
      ogImage: "/og-image.png",
    },
    components: {},
  },
  collections: [
    Users,
    Media,
    Categories,
    Authors,
    Tags,
    Locations,
    Articles,
    Videos,
    LiveBlogs,
    WebStories,
    Ads,
  ],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
    ],
  }),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "mongodb://localhost:27017/news-portal",
  }),
  sharp,
  i18n: {
    supportedLanguages: { en },
  },
  plugins: [
    vercelBlobStorage({
      enabled: process.env.NODE_ENV === "production",
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    }),
  ],
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(dirname, "generated-schema.graphql"),
  },
  upload: {
    limits: {
      fileSize: 20000000, // 20MB
    },
  },
});
