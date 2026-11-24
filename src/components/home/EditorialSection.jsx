import { Image } from "@/components/ui/image";
import { useLanguage } from "@/lib/LanguageContext";
import { IMAGES } from "@/lib/images";

export function EditorialSection({ content }) {
  const { t, pick } = useLanguage();

  return (
    <section className="surface-panel border-y border-gold/30">
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="relative overflow-hidden">
          <Image
            src={IMAGES.procession}
            alt="A Ganpati Visarjan procession at dusk with marigold petals in the air"
            className="h-[46vh] w-full sm:h-[54vh]"
          />
        </div>

        <div className="mx-auto mt-14 max-w-3xl text-center lg:mt-16">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
            <span className="eyebrow text-primary/60">{t("editorial.eyebrow")}</span>
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
          </div>
          <p className="mt-7 font-display text-[1.55rem] leading-[1.35] tracking-[-0.01em] text-primary italic sm:text-3xl lg:text-[2.4rem]">
            {pick(content, "editorial_title") || t("editorial.title")}
          </p>
          <p className="mx-auto mt-7 max-w-2xl font-body text-[15px] leading-[1.9] text-foreground/60">
            {pick(content, "editorial_body") || t("editorial.body")}
          </p>
        </div>
      </div>
    </section>
  );
}