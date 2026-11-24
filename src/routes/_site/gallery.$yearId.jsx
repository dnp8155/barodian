import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Lightbox } from "@/components/gallery/Lightbox";
import { PageIntro } from "@/components/site/PageIntro";
import { useLanguage } from "@/lib/LanguageContext";
import { getGalleryYear } from "@/lib/server-fns";

export const Route = createFileRoute("/_site/gallery/$yearId")({
  loader: ({ params }) => getGalleryYear({ data: { yearId: params.yearId } }),
  head: ({ loaderData }) => {
    const year = loaderData?.year;
    const title = year ? `${year.year} Ganpati Memories — Barodian` : "Gallery — Barodian";
    return {
      meta: [
        { title },
        {
          name: "description",
          content: year
            ? `Photographs from the ${year.year} Ganpati celebrations in Vadodara, preserved in the Barodian archive.`
            : "The Barodian Ganpati archive.",
        },
        { property: "og:title", content: title },
      ],
    };
  },
  component: YearPage,
});

function YearPage() {
  const data = Route.useLoaderData();
  const { t, pick } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);

  if (!data) {
    return (
      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12">
        <p className="font-display text-2xl text-primary">{t("gallery.yearMissing")}</p>
        <Link to="/gallery" className="link-underline mt-8">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          {t("gallery.backToArchive")}
        </Link>
      </div>
    );
  }

  const { year, photos } = data;
  const title = pick(year, "title") || String(year.year);
  const description = pick(year, "description");

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
      <Link to="/gallery" className="inline-flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.2em] text-foreground/50 transition-colors hover:text-primary">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
        {t("gallery.backToArchive")}
      </Link>

      <div className="mt-10">
        <p className="eyebrow text-[#D88A32]">{t("gallery.eyebrow")}</p>
        <h1 className="mt-4 font-display text-[2.4rem] leading-[1.05] tracking-[-0.01em] text-primary sm:text-6xl lg:text-[4.2rem]">
          {title}
        </h1>
        {description && <p className="mt-6 max-w-2xl font-body text-[15px] leading-[1.85] text-foreground/65 sm:text-base">{description}</p>}
        <p className="mt-6 eyebrow text-foreground/40">
          {photos.length} {photos.length === 1 ? t("common.photo") : t("common.photos")}
        </p>
      </div>

      {year.cover_image && (
        <div className="mt-10 overflow-hidden">
          <Image src={year.cover_image} alt={`${year.year} cover photograph`} className="h-[42vh] w-full sm:h-[58vh]" />
        </div>
      )}

      {photos.length === 0 ? (
        <p className="mt-16 border-t border-gold/40 pt-10 font-display text-xl leading-relaxed text-primary/55">
          {t("gallery.noPhotos")}
        </p>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setOpenIndex(index)}
              className="group relative block overflow-hidden bg-[#F1E9DA]"
              aria-label={`Open photograph ${index + 1}`}
            >
              <Image
                src={photo.image}
                alt={photo.alt_text || pick(photo, "caption") || `${year.year} celebration`}
                className="aspect-[4/5] w-full transition-transform duration-700 group-hover:scale-[1.04]"
              />
            </button>
          ))}
        </div>
      )}

      {openIndex !== null && (
        <Lightbox photos={photos} index={openIndex} onClose={() => setOpenIndex(null)} onNavigate={setOpenIndex} />
      )}
    </div>
  );
}