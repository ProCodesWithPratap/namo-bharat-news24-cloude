import Link from "next/link";
import Image from "next/image";
import NewsCard from "@/components/ui/NewsCard";
import AdSlot from "@/components/ui/AdSlot";
import SectionHeader from "@/components/common/SectionHeader";
import { getImageUrl } from "@/lib/api";
import WhatsAppCTAButton from "@/components/common/WhatsAppCTAButton";

interface HomePageProps {
  featuredArticles: any[];
  latestArticles: any[];
  categoryFeeds: Record<string, any[]>;
  videos: any[];
  webStories: any[];
  trendingArticles: any[];
  navigationCategories: Array<{ name: string; nameEn: string; slug: string }>;
  socialLinks: { facebook?: string; instagram?: string; youtube?: string; whatsapp?: string };
}

export default function HomePage({ featuredArticles, latestArticles, categoryFeeds, videos, webStories, trendingArticles, navigationCategories, socialLinks }: HomePageProps) {
  const hero = featuredArticles[0];
  const topStories = featuredArticles.slice(1, 5);
  const hasAnyNews = featuredArticles.length > 0 || latestArticles.length > 0;
  const hasMediaContent = videos.length > 0 || webStories.length > 0;
  const visibleCategoryFeeds = navigationCategories
    .slice(0, 4)
    .map((cat) => ({ cat, feed: categoryFeeds[cat.slug] || [] }))
    .filter(({ feed }) => feed.length > 0);
  const showTopStories = topStories.length > 0;
  const showLatestGrid = latestArticles.length > 0;
  const showTrending = trendingArticles.length > 0;
  const showLatestSidebar = latestArticles.length > 6;
  const showPrimaryAdRow = hasAnyNews;
  const showSidebarAd = hasAnyNews || hasMediaContent;
  const showEmptyLaunchState = !hasAnyNews && !hasMediaContent;

  if (showEmptyLaunchState) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="rounded-3xl border border-red-100 bg-white shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-500 px-6 py-8 text-white text-center">
            <p className="text-xs md:text-sm font-semibold tracking-[0.24em] uppercase opacity-90">Namo Bharat News 24</p>
            <h1 className="font-hindi text-3xl md:text-5xl font-extrabold mt-3">न्यूज़रूम अपडेट जारी है</h1>
            <p className="font-hindi text-sm md:text-base text-red-50 mt-3 max-w-2xl mx-auto leading-relaxed">
              ताज़ा खबरें, वीडियो और क्षेत्रीय अपडेट तेजी से जोड़े जा रहे हैं। कृपया कुछ देर बाद फिर देखें या हमारे WhatsApp चैनल और सोशल प्लेटफॉर्म से जुड़ें।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8">
            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5">
              <h2 className="font-hindi text-xl font-extrabold text-gray-900">अभी क्या तैयार हो रहा है</h2>
              <ul className="mt-4 space-y-3 font-hindi text-sm text-gray-700">
                <li>• ब्रेकिंग न्यूज़ डेस्क अपडेट</li>
                <li>• बिहार, झारखंड और राष्ट्रीय खबरों की नई फीड</li>
                <li>• वीडियो और वेब स्टोरी सेक्शन</li>
                <li>• तेज़ और साफ़ मोबाइल अनुभव</li>
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                {navigationCategories.slice(0, 6).map((cat) => (
                  <Link key={cat.slug} href={`/${cat.slug}`} className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-hindi font-semibold text-red-700 hover:bg-red-100 transition-colors">
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-gray-900 text-white p-5">
              <h2 className="font-hindi text-xl font-extrabold">हमसे जुड़ें</h2>
              <p className="font-hindi text-sm text-gray-300 mt-2">
                ब्रेकिंग न्यूज़ और बड़ी अपडेट सबसे पहले पाने के लिए हमारे चैनलों से जुड़ें।
              </p>
              <div className="mt-5 flex flex-wrap gap-2 font-hindi">
                <a href={socialLinks.facebook || "#"} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700">फ़ेसबुक</a>
                <a href={socialLinks.youtube || "#"} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700">यूट्यूब</a>
                <a href={socialLinks.instagram || "#"} className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700">इंस्टाग्राम</a>
                <WhatsAppCTAButton href={socialLinks.whatsapp || "https://whatsapp.com/channel/0029VbCBrGu6hENlyE9rvW3N"} label="व्हाट्सऐप चैनल जॉइन" location="homepage_empty_state" className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {(hero || showTopStories) && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="lg:col-span-2">{hero && <NewsCard article={hero} variant="hero" priority />}</div>
          {showTopStories && (
            <div className="flex flex-col gap-3">
              <SectionHeader title="टॉप न्यूज़" href="/national" />
              {topStories.map((a) => <NewsCard key={a.id} article={a} variant="horizontal" />)}
            </div>
          )}
        </section>
      )}

      {showPrimaryAdRow && (
        <div className="mb-8">
          <AdSlot label="Advertisement" width={970} height={90} className="hidden md:flex" />
          <AdSlot label="Advertisement" width={320} height={50} className="flex md:hidden" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {showLatestGrid && (
            <>
              <SectionHeader title="लेटेस्ट न्यूज़" href="/national" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {latestArticles.slice(0, 6).map((a) => <NewsCard key={a.id} article={a} variant="card" />)}
              </div>
            </>
          )}

          {visibleCategoryFeeds.map(({ cat, feed }) => (
            <div key={cat.slug} className="mb-10">
              <SectionHeader title={cat.name} href={`/${cat.slug}`} ctaLabel={`${cat.name} की सभी खबरें →`} />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {feed.slice(0, 3).map((a, i) => <NewsCard key={a.id} article={a} variant={i === 0 ? "card" : "compact"} />)}
              </div>
            </div>
          ))}
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 p-4 text-white shadow-lg">
            <h3 className="font-hindi text-lg font-extrabold">व्हाट्सऐप चैनल जॉइन करें</h3>
            <p className="font-hindi text-sm text-green-50 mt-1">ब्रेकिंग न्यूज़ और बड़ी खबरें सबसे पहले सीधे WhatsApp पर पाएं।</p>
            <WhatsAppCTAButton href={socialLinks.whatsapp || "https://whatsapp.com/channel/0029VbCBrGu6hENlyE9rvW3N"} label="चैनल से जुड़ें" location="homepage_sidebar" className="mt-3 inline-flex px-4 py-2 rounded-lg bg-white text-green-700 font-hindi font-bold hover:bg-green-50 transition-colors" />
          </div>

          {showTrending && (
            <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
              <h3 className="font-hindi text-base font-extrabold mb-4 border-l-4 pl-3" style={{ borderColor: "#C8102E", color: "#111" }}>🔥 ट्रेंडिंग</h3>
              <ol className="space-y-0 divide-y divide-gray-100">
                {trendingArticles.slice(0, 8).map((a, i) => (
                  <li key={a.id} className="py-3 flex items-start gap-3">
                    <span className="text-2xl font-extrabold leading-none mt-0.5 w-6 shrink-0" style={{ color: i < 3 ? "#C8102E" : "#ddd" }}>{i + 1}</span>
                    <Link href={`/article/${a.slug}`} className="font-hindi text-sm font-semibold text-gray-700 hover:text-primary leading-snug line-clamp-2">
                      {a.headlineHindi || a.headline}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {showSidebarAd && <AdSlot label="Advertisement" width={300} height={250} className="flex" />}

          {showLatestSidebar && (
            <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
              <h3 className="font-hindi text-base font-extrabold mb-4 border-l-4 pl-3" style={{ borderColor: "#C8102E", color: "#111" }}>सबसे नई खबरें</h3>
              <div className="space-y-0">{latestArticles.slice(6, 16).map((a) => <NewsCard key={a.id} article={a} variant="mini" />)}</div>
            </div>
          )}
        </aside>
      </div>

      {videos.length > 0 && (
        <section className="mt-10">
          <SectionHeader title="📺 वीडियो" href="/videos" ctaLabel="सभी वीडियो →" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {videos.slice(0, 4).map((v) => (
              <Link key={v.id} href={`/video/${v.slug}`} className="group block news-card rounded-lg overflow-hidden bg-white border border-gray-100">
                <div className="relative aspect-video bg-gray-200 overflow-hidden">
                  {v.thumbnail && <Image src={getImageUrl(v.thumbnail, "card")} alt={v.title} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-300" />}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center text-sm">▶</span>
                  </div>
                </div>
                <div className="p-3"><h3 className="font-hindi text-sm font-semibold text-gray-800 group-hover:text-primary line-clamp-2 transition-colors">{v.titleHindi || v.title}</h3></div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {webStories.length > 0 && (
        <section className="mt-10">
          <SectionHeader title="📸 वेब स्टोरी" href="/web-stories" ctaLabel="सभी स्टोरी →" />
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {webStories.map((s) => (
              <Link key={s.id} href={`/web-stories/${s.slug}`} className="group shrink-0 w-28 md:w-36 block">
                <div className="relative h-48 md:h-64 rounded-xl overflow-hidden bg-gray-200 shadow-md">
                  {s.coverImage && <Image src={getImageUrl(s.coverImage, "thumbnail")} alt={s.title} fill sizes="(max-width: 768px) 112px, 144px" className="object-cover group-hover:scale-105 transition-transform duration-300" />}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-12 bg-gray-900 rounded-2xl p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="font-hindi text-xl font-extrabold">हमसे सोशल मीडिया पर जुड़ें</h3>
            <p className="font-hindi text-sm text-gray-300 mt-1">ताज़ा खबरें, वीडियो और एक्सक्लूसिव अपडेट सबसे पहले पाएं।</p>
          </div>
          <div className="flex flex-wrap gap-2 font-hindi">
            <a href={socialLinks.facebook || "#"} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700">फ़ेसबुक</a>
            <a href={socialLinks.youtube || "#"} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700">यूट्यूब</a>
            <a href={socialLinks.instagram || "#"} className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700">इंस्टाग्राम</a>
            <WhatsAppCTAButton href={socialLinks.whatsapp || "https://whatsapp.com/channel/0029VbCBrGu6hENlyE9rvW3N"} label="व्हाट्सऐप चैनल जॉइन" location="homepage_footer_strip" className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700" />
          </div>
        </div>
      </section>
    </div>
  );
}
