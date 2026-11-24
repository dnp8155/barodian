import { Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import { useLanguage } from "@/lib/LanguageContext";
import { IMAGES } from "@/lib/images";

export function Hero({ content }) {
  const { t, pick } = useLanguage();
  const title = pick(content, "hero_title") || t("hero.title");
  const words = title.trim().split(" ");
  const last = words.length > 1 ? words.pop() : "";
  const lead = words.join(" ");
  const image = content?.hero_image || IMAGES.hero;

  return (
    <section className="relative isolate overflow-hidden bg-[#3A1820]">
      <div className="absolute inset-0">
        <Image
          src={image}
          alt="A decorated Ganpati idol inside a mandap during a Baroda celebration"
          className="h-full w-full"
          focalPointX={0.6}
          focalPointY={0.45}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#37161D]/94 via-[#37161D]/70 to-[#37161D]/15" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#37161D]/85 to-transparent" />

      <div className="relative mx-auto flex min-h-[74vh] max-w-[1440px] flex-col justify-end px-5 pb-14 pt-28 sm:px-8 lg:min-h-[88vh] lg:justify-center lg:px-12 lg:pb-28">
        <div className="animate-fade-up max-w-2xl">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-[#D88A32]" aria-hidden="true" />
            <span className="eyebrow text-[#D88A32]">{pick(content, "hero_eyebrow") || t("hero.eyebrow")}</span>
          </div>

          <h1 className="mt-7 font-display text-[2.65rem] leading-[1.03] tracking-[-0.02em] text-[#F8F4EC] sm:text-6xl lg:text-[4.4rem]">
            {lead}{" "}
            {last && <em className="italic text-[#D88A32]">{last}</em>}
          </h1>

          <p className="mt-7 max-w-xl font-body text-[15px] leading-[1.85] text-[#F1E7DA]/80 sm:text-base">
            {pick(content, "hero_description") || t("hero.desc")}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/gallery" className="btn-ivory">
              {pick(content, "hero_cta_primary") || t("hero.cta1")}
            </Link>
            <Link to="/about" className="btn-ghost-light">
              {pick(content, "hero_cta_secondary") || t("hero.cta2")}
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-6 hidden items-center gap-3 lg:flex">
        <span className="h-px w-8 bg-[#F8F4EC]/30" aria-hidden="true" />
        <span className="eyebrow text-[#F8F4EC]/55">{t("hero.est")}</span>
      </div>
    </section>
  );
}