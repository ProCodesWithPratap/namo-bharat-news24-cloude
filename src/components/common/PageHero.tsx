import type { ReactNode } from "react";

interface PageHeroProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export default function PageHero({ title, description, children }: PageHeroProps) {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-14">
        <h1 className="font-hindi text-3xl md:text-4xl font-extrabold text-gray-900">{title}</h1>
        <p className="font-hindi text-gray-600 mt-3 text-base md:text-lg max-w-3xl">{description}</p>
        {children && <div className="mt-5">{children}</div>}
      </div>
    </section>
  );
}
