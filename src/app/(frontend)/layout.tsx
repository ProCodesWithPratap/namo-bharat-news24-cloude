import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BreakingTicker from "@/components/layout/BreakingTicker";
import { getBreakingNews } from "@/lib/api";
import NewsAssistant from "@/components/chat/NewsAssistant";
import PWAProvider from "@/components/common/PWAProvider";
import BottomNav from "@/components/layout/BottomNav";

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breaking = await getBreakingNews(8).catch(() => ({ docs: [] }));
  const validBreaking = (breaking.docs || []).filter(
    (item: any) =>
      typeof item.slug === "string" &&
      item.slug.trim() !== "" &&
      item.slug !== "undefined"
  );

  return (
    <>
      <PWAProvider />
      <Header />
      {validBreaking.length > 0 && <BreakingTicker items={validBreaking} />}
      <main className="pb-14 md:pb-0">{children}</main>
      <Footer />
      <BottomNav />
      <NewsAssistant />
    </>
  );
}
