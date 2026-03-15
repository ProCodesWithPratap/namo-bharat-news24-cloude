import Link from "next/link";
import Image from "next/image";
import { timeAgo, getImageUrl } from "@/lib/api";

interface NewsCardProps {
  article: any;
  variant?: "hero" | "card" | "compact" | "horizontal" | "mini";
  priority?: boolean;
}

export default function NewsCard({ article, variant = "card", priority = false }: NewsCardProps) {
  if (!article) return null;

  const title = article.headlineHindi || article.headline || "";
  const slug = article.slug;
  const imgUrl = getImageUrl(article.heroMedia, variant === "hero" ? "hero" : "card");
  const catName = article.category?.nameHindi || article.category?.name || "";
  const time = timeAgo(article.publishDate || article.updatedAt);
  const excerpt = article.excerpt || "";

  if (variant === "mini") {
    return (
      <Link href={`/article/${slug}`} className="group flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
        <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded bg-gray-100">
          {article.heroMedia && <Image src={imgUrl} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold font-hindi leading-snug text-gray-800 group-hover:text-primary line-clamp-2 transition-colors">{title}</p>
          <span className="text-xs text-gray-400 mt-1 block">{time}</span>
        </div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link href={`/article/${slug}`} className="group flex gap-4 news-card">
        <div className="relative w-32 md:w-40 shrink-0 aspect-video overflow-hidden rounded bg-gray-100">
          {article.heroMedia && <Image src={imgUrl} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />}
        </div>
        <div className="flex-1 min-w-0 py-1">
          {catName && <span className="cat-badge mb-2 inline-block" style={{ fontSize: "0.65rem" }}>{catName}</span>}
          <h3 className="font-hindi text-base font-semibold leading-snug text-gray-800 group-hover:text-primary line-clamp-2 transition-colors">{title}</h3>
          <span className="text-xs text-gray-400 mt-1 block">{time}</span>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/article/${slug}`} className="group block news-card">
        <div className="relative aspect-video overflow-hidden rounded bg-gray-100 mb-2">
          {article.heroMedia && <Image src={imgUrl} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" priority={priority} />}
        </div>
        {catName && <span className="cat-badge mb-1 inline-block">{catName}</span>}
        <h3 className="font-hindi text-sm font-semibold leading-snug text-gray-800 group-hover:text-primary line-clamp-2 transition-colors">{title}</h3>
        <span className="text-xs text-gray-400 mt-1 block">{time}</span>
      </Link>
    );
  }

  if (variant === "hero") {
    return (
      <Link href={`/article/${slug}`} className="group block relative overflow-hidden rounded-lg news-card">
        <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-gray-200">
          {article.heroMedia && <Image src={imgUrl} alt={title} fill className="object-cover group-hover:scale-103 transition-transform duration-500" priority={priority} />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
          {catName && <span className="cat-badge mb-2 inline-block">{catName}</span>}
          <h2 className="font-hindi text-xl md:text-3xl font-bold leading-snug text-white group-hover:text-red-200 transition-colors line-clamp-3">{title}</h2>
          {excerpt && <p className="font-hindi text-gray-200 text-sm mt-2 line-clamp-2 hidden md:block">{excerpt}</p>}
          <span className="text-gray-300 text-xs mt-2 block">{time}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/article/${slug}`} className="group block news-card rounded-lg overflow-hidden bg-white border border-gray-100">
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        {article.heroMedia && <Image src={imgUrl} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" priority={priority} />}
      </div>
      <div className="p-3">
        {catName && <span className="cat-badge mb-2 inline-block">{catName}</span>}
        <h3 className="font-hindi font-semibold leading-snug text-gray-800 group-hover:text-primary line-clamp-3 transition-colors text-[15px]">{title}</h3>
        {excerpt && <p className="font-hindi text-gray-500 text-sm mt-1 line-clamp-2">{excerpt}</p>}
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-400 block">{time}</span>
          <span className="text-xs font-semibold" style={{ color: "#C8102E" }}>Read More →</span>
        </div>
      </div>
    </Link>
  );
}
