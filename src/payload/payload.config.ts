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
import { SiteSettings } from "./globals/SiteSettings";
import { HomepageSettings } from "./globals/HomepageSettings";
import { AssistantSettings } from "./globals/AssistantSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const isProduction = process.env.NODE_ENV === "production";
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
const payloadSecret = process.env.PAYLOAD_SECRET;
const databaseURI = process.env.DATABASE_URI;
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

if (isProduction && !payloadSecret) {
  throw new Error("Missing PAYLOAD_SECRET environment variable in production.");
}

if (isProduction && !databaseURI) {
  throw new Error("Missing DATABASE_URI environment variable in production.");
}

export default buildConfig({
  serverURL,
  secret: payloadSecret || "dev-only-secret",
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " — Namo Bharat News 24 CMS",
      title: "Namo Bharat News 24 Admin",
    },
    components: {
      graphics: {
        Logo: "@/payload/admin/components/BrandLogo#default",
      },
      beforeLogin: ["@/payload/admin/components/LoginIntro#default"],
      beforeDashboard: [
        "@/payload/admin/components/QuickStats#default",
        "@/payload/admin/components/DashboardStats#default",
      ],
    },
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
  globals: [SiteSettings, HomepageSettings, AssistantSettings],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures],
  }),
  db: mongooseAdapter({
    url: databaseURI || "mongodb://localhost:27017/news-portal",
  }),
  sharp,
  i18n: {
    supportedLanguages: { en },
  },
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(blobToken),
      collections: {
        media: true,
      },
      token: blobToken || "",
    }),
  ],
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  routes: {
    admin: "/payload-admin",
    api: "/api",
    graphQL: "/graphql",
    graphQLPlayground: "/graphql-playground",
  },
  graphQL: {
    schemaOutputFile: path.resolve(dirname, "generated-schema.graphql"),
  },
  upload: {
    limits: {
      fileSize: 20000000,
    },
  },
});
