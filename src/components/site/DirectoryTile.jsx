import { Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export function DirectoryTile({ item, to }) {
  const { t, pick } = useLanguage();
  const name = pick(item, "name");
  const description = pick(item, "description");

  return (
    <Link to={to} params={{ profileId: item.id }} className="group block">
      <div className="img-warm relative overflow-hidden bg-[#F1E9DA]">
        <div className="aspect-[4/3] w-full">
          {item.profile_image ? (
            <Image src={item.profile_image} alt={name} className="h-full w-full" />
          ) : (
            <div className="mandana h-full w-full opacity-70" aria-hidden="true" />
          )}
        </div>
        {item.is_featured && (
          <span className="absolute left-4 top-4 bg-[#F8F4EC]/95 px-3 py-1.5 font-body text-[9px] uppercase tracking-[0.22em] text-[#702D38]">
            {t("common.featured")}
          </span>
        )}
      </div>
      <div className="border-t border-gold/40 pt-5">
        <p className="eyebrow flex items-center gap-1.5 text-[#D88A32]">
          <MapPin className="h-3 w-3" strokeWidth={1.5} />
          {item.city || "Vadodara"}
        </p>
        <h2 className="mt-2.5 font-display text-xl leading-snug text-primary transition-colors group-hover:text-[#4A2029]">
          {name}
        </h2>
        {description && (
          <p className="mt-2.5 line-clamp-3 font-body text-[13.5px] leading-[1.7] text-foreground/55">{description}</p>
        )}
        <span className="mt-4 inline-flex items-center gap-1.5 font-body text-[10px] uppercase tracking-[0.2em] text-primary/70 transition-colors group-hover:text-primary">
          {t("common.viewProfile")} <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}