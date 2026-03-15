import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
import configPromise from "@payload-config";
import { Metadata } from "next";

type Args = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export async function generateMetadata({ params, searchParams }: Args): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  void resolvedParams;
  void resolvedSearchParams;
  return generatePageMetadata({ config: configPromise, params, searchParams });
}

export default async function Page({ params, searchParams }: Args) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  void resolvedParams;
  void resolvedSearchParams;
  return RootPage({ config: configPromise, params, searchParams } as any);
}
