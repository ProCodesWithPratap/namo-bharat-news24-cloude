import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BreakingTicker from "@/components/layout/BreakingTicker";
import { getBreakingNews } from "@/lib/api";
import NewsAssistant from "@/components/chat/NewsAssistant";

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breaking = await getBreakingNews(8).catch(() => ({ docs: [] }));

  return (
    <>
      <Header />
      {breaking.docs.length > 0 && <BreakingTicker items={breaking.docs} />}
      <main>{children}</main>
      <Footer />
      <NewsAssistant />
    </>
  );
}
