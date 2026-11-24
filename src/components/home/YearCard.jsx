import { Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import { useLanguage } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";

export function YearCard({ year, photoCount = 0, offset = false }) {
  const { t } = useLanguage();
  const covered = Boolean(year.cover_image);

  return (
    <Link
      to="/gallery/$yearId"
      params={{ yearId: year.id }}
      aria-label={`Explore Ganpati memories from ${year.year}`}
      className={cn("group block", offset && "lg:mt-14")}
    >
      <div className="relative overflow-hidden border border-gold/40 bg-[#F1E9DA] transition-colors duration-500 group-hover:border-primary/50">
        <div className="aspect-[3/4] w-full overflow-hidden">
          {covered ? (
            <Image
              src={year.cover_image}
              alt={`Ganpati celebration in ${year.year}`}
              className="h-full w-full transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="mandana h-full w-full opacity-70" aria-hidden="true" />
          )}
        </div>

        {covered && <div className="absolute inset-0 bg-gradient-to-t from-[#37161D]/70 via-transparent to-transparent" />}

        <div className="absolute inset-0 flex flex-col justify-between p-5">
          <span className={cn("eyebrow", covered ? "text-[#F8F4EC]/70" : "text-primary/40")}>
            {photoCount > 0
              ? `${photoCount} ${photoCount === 1 ? t("common.photo") : t("common.photos")}`
              : t("archive.comingSoon")}
          </span>
          <div>
            <span className={cn("font-display text-3xl tracking-tight sm:text-4xl", covered ? "text-[#F8F4EC]" : "text-primary")}>
              {year.year}
            </span>
            <span className="mt-3 block h-px w-8 bg-[#D88A32] transition-all duration-500 group-hover:w-16" />
          </div>
        </div>
      </div>
    </Link>
  );
}