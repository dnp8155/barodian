import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { YearCard } from "@/components/home/YearCard";
import { useLanguage } from "@/lib/LanguageContext";

export function ArchiveSection({ years = [], content }) {
  const { t, pick } = useLanguage();
  const shown = years.slice(0, 8);

  return (
    <section className="surface-panel border-y border-gold/30 py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-gold" aria-hidden="true" />
              <span className="eyebrow text-primary/70">{t("archive.eyebrow")}</span>
            </div>
            <h2 className="mt-5 font-display text-[1.9rem] leading-[1.14] tracking-[-0.01em] text-primary sm:text-4xl lg:text-[2.9rem]">
              {pick(content, "archive_title") || t("archive.title")}
            </h2>
            <p className="mt-5 max-w-xl font-body text-[15px] leading-[1.85] text-foreground/65">
              {pick(content, "archive_description") || t("archive.desc")}
            </p>
          </div>
          <Link to="/gallery" className="link-underline shrink-0">
            {t("archive.cta")}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Link>
        </div>

        {shown.length === 0 ? (
          <p className="mt-14 border-t border-gold/40 pt-8 font-display text-xl text-primary/60">{t("archive.empty")}</p>
        ) : (
          <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-7">
            {shown.map((year, index) => (
              <YearCard key={year.id} year={year} photoCount={year.photo_count} offset={index % 2 === 1} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}