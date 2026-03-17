import { searchArticles } from "@/lib/api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();

    if (q.length < 2) return Response.json({ docs: [] });

    const results = await searchArticles(q, 6, 1);
    const docs = (results.docs || []).map((item: any) => ({
      id: item.id,
      slug: item.slug,
      headline: item.headlineHindi || item.headline,
      category: item.category?.nameHindi || item.category?.name || "",
      categorySlug: item.category?.slug || "",
    }));

    return Response.json({ docs });
  } catch {
    return Response.json({ docs: [] });
  }
}
