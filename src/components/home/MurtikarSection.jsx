import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { ProfileCard } from "@/components/site/ProfileCard";
import { useLanguage } from "@/lib/LanguageContext";
import { IMAGES } from "@/lib/images";

export function MurtikarSection({ items = [] }) {
  const { t } = useLanguage();

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-gold" aria-hidden="true" />
              <span className="eyebrow text-primary/70">{t("murtikar.eyebrow")}</span>
            </div>
            <h2 className="mt-5 font-display text-[1.9rem] leading-[1.14] tracking-[-0.01em] text-primary sm:text-4xl lg:text-[2.9rem]">
              {t("murtikar.title")}
            </h2>
            <p className="mt-6 max-w-lg font-body text-[15px] leading-[1.85] text-foreground/65">{t("murtikar.desc")}</p>
            <Link to="/murtikars" className="link-underline mt-8">
              {t("murtikar.cta")}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Link>

            <div className="mt-10 space-y-5">
              {items.length === 0 ? (
                <p className="border-t border-gold/40 pt-6 font-body text-sm leading-relaxed text-foreground/45">
                  {t("murtikar.empty")}
                </p>
              ) : (
                items.slice(0, 3).map((item) => (
                  <ProfileCard key={item.id} item={item} to="/murtikars/$profileId" />
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <div className="img-warm overflow-hidden">
              <Image
                src={IMAGES.idolDetail}
                alt="Close detail of a hand-painted Ganpati idol's face"
                className="aspect-[4/5] w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}