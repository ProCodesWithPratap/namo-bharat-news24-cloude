import { getLatestArticles, getImageUrl } from "@/lib/api";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/utils";
export const dynamic = "force-dynamic";

export const revalidate = 300;

export async function GET() {
  const { docs } = await getLatestArticles(20).catch(() => ({ docs: [] }));

  const items = docs
    .map((a: any) => {
      const title = (a.headlineHindi || a.headline || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const desc = (a.excerpt || "").replace(/&/g, "&amp;");
      const img = getImageUrl(a.heroMedia, "card");
      return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${SITE_URL}/article/${a.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/article/${a.slug}</guid>
      <description><![CDATA[${desc}]]></description>
      <pubDate>${new Date(a.publishDate || a.updatedAt).toUTCString()}</pubDate>
      ${a.category ? `<category><![CDATA[${a.category.nameHindi || a.category.name}]]></category>` : ""}
      ${img ? `<enclosure url="${img}" type="image/jpeg"/>` : ""}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>hi</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/logo.png</url>
      <title>${SITE_NAME}</title>
      <link>${SITE_URL}</link>
    </image>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300",
    },
  });
}
