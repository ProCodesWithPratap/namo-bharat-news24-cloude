import type { ReactNode } from "react";
import PageHero from "@/components/common/PageHero";

export default function StaticPageLayout({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <>
      <PageHero title={title} description={description} />
      <section className="max-w-5xl mx-auto px-4 py-8 md:py-10">
        <div className="bg-white border border-gray-100 rounded-xl p-6 md:p-8 leading-7 text-gray-700 font-hindi">
          {children}
        </div>
      </section>
    </>
  );
}
