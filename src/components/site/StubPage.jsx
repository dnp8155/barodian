import { PageIntro } from "@/components/site/PageIntro";

export function StubPage({ eyebrow, title, description }) {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12">
      <PageIntro eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-16 h-px w-full bg-gold/40" />
    </div>
  );
}