import type { Metadata } from "next";
import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
import configPromise from "@payload-config";
import { importMap } from "../importMap";

type Args = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
};

const isAdminConfigured = Boolean(process.env.DATABASE_URI?.trim());

export async function generateMetadata({ params, searchParams }: Args): Promise<Metadata> {
  if (!isAdminConfigured && process.env.NODE_ENV !== "production") {
    return {
      title: "Admin setup required",
      description: "Configure DATABASE_URI to enable the Payload admin panel.",
    };
  }

  return generatePageMetadata({ config: configPromise, params, searchParams });
}

export default function Page({ params, searchParams }: Args) {
  if (!isAdminConfigured && process.env.NODE_ENV !== "production") {
    return null;
  }

  return RootPage({ config: configPromise, importMap, params, searchParams });
}
