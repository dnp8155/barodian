import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useLanguage } from "@/lib/LanguageContext";
import { IMAGES } from "@/lib/images";

export function IntroSection({ content }) {
  const { t, pick } = useLanguage();
  const body2 = pick(content, "intro_body_two");

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="img-warm overflow-hidden">
              <Image
                src={IMAGES.murtikarHands}
                alt="An artisan's hands shaping a clay Ganpati idol in a workshop"
                className="aspect-[4/5] w-full"
              />
            </div>
            <p className="mt-4 eyebrow text-foreground/35">{t("murtikar.eyebrow")} · Vadodara</p>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-gold" aria-hidden="true" />
              <span className="eyebrow text-primary/70">{t("intro.eyebrow")}</span>
            </div>
            <h2 className="mt-5 font-display text-[1.9rem] leading-[1.14] tracking-[-0.01em] text-primary sm:text-4xl lg:text-[2.9rem]">
              {pick(content, "intro_title") || t("intro.title")}
            </h2>
            <div className="editorial-prose mt-7 max-w-xl">
              <p>{pick(content, "intro_body") || t("intro.body")}</p>
              <p>{body2 || t("intro.body2")}</p>
            </div>
            <Link to="/about" className="link-underline mt-9">
              {t("intro.cta")}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}