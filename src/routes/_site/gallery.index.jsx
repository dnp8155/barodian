import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/site/PageIntro";
import { YearCard } from "@/components/home/YearCard";
import { useLanguage } from "@/lib/LanguageContext";
import { getGalleryYears } from "@/lib/server-fns";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_site/gallery/")({
  loader: () => getGalleryYears(),
  head: () => ({
    meta: [
      { title: "Ganpati Gallery 2006–2026 — Barodian" },
      {
        name: "description",
        content:
          "Browse two decades of Vadodara's Ganpati celebrations, year by year — photographs from 2006 to 2026 in the Barodian archive.",
      },
      { property: "og:title", content: "Ganpati Gallery — Barodian" },
    ],
    links: [{ rel: "canonical", href: "https://barodian.com/gallery" }],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { years, totalPhotos } = Route.useLoaderData();
  const { t } = useLanguage();
  const [decade, setDecade] = useState("all");

  const decades = Array.from(new Set(years.map((y) => Math.floor(Number(y.year) / 10) * 10))).sort((a, b) => b - a);
  const shown = decade === "all" ? years : years.filter((y) => Math.floor(Number(y.year) / 10) * 10 === Number(decade));

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <PageIntro eyebrow={t("gallery.eyebrow")} title={t("gallery.title")} description={t("gallery.desc")} />

      <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-y border-gold/40 py-4">
        <p className="eyebrow text-foreground/45">
          {years.length} {t("gallery.count")}
          {totalPhotos > 0 && ` · ${totalPhotos} ${t("gallery.totalPhotos")}`}
        </p>

        {decades.length > 1 && (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {["all", ...decades].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setDecade(String(option))}
                className={cn(
                  "font-body text-[10px] uppercase tracking-[0.2em] transition-colors",
                  String(decade) === String(option) ? "text-primary" : "text-foreground/40 hover:text-primary"
                )}
              >
                {option === "all" ? t("gallery.all") : `${option}s`}
                {String(decade) === String(option) && <span className="ml-2 inline-block h-px w-6 bg-gold align-middle" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {shown.length === 0 ? (
        <p className="mt-16 max-w-xl font-display text-xl leading-relaxed text-primary/55">{t("gallery.empty")}</p>
      ) : (
        <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-7">
          {shown.map((year, index) => (
            <YearCard key={year.id} year={year} photoCount={year.photo_count} offset={index % 3 === 1} />
          ))}
        </div>
      )}
    </div>
  );
}