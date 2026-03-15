import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
import configPromise from "@payload-config";

type Args = {
  params: { segments: string[] };
  searchParams: Record<string, string | string[]>;
};

export async function generateMetadata({ params, searchParams }: Args) {
  return generatePageMetadata({ config: configPromise, params, searchParams });
}

export default async function Page({ params, searchParams }: Args) {
  return RootPage({ config: configPromise, params, searchParams });
}
