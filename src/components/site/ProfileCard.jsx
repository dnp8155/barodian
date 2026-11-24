import { Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export function ProfileCard({ item, to, nameField = "name", descriptionField = "description", compact = false }) {
  const { t, pick } = useLanguage();
  const name = pick(item, nameField);
  const description = pick(item, descriptionField);

  return (
    <Link to={to} params={{ profileId: item.id }} className="group block border-t border-gold/40 pt-6">
      <div className="flex gap-5">
        <div className="h-28 w-24 shrink-0 overflow-hidden bg-[#F1E9DA]">
          {item.profile_image ? (
            <Image
              src={item.profile_image}
              alt={name}
              className="h-full w-full transition-transform duration-700 group-hover:scale-[1.05]"
            />
          ) : (
            <div className="mandana h-full w-full opacity-60" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0">
          <p className="eyebrow flex items-center gap-1.5 text-[#D88A32]">
            <MapPin className="h-3 w-3" strokeWidth={1.5} />
            {item.city || "Vadodara"}
          </p>
          <h3 className="mt-2 font-display text-lg leading-snug text-primary sm:text-xl">{name}</h3>
          {description && !compact && (
            <p className="mt-2 line-clamp-2 font-body text-[13px] leading-relaxed text-foreground/55">{description}</p>
          )}
          <span className="mt-3 inline-flex items-center gap-1.5 font-body text-[10px] uppercase tracking-[0.2em] text-primary/70 transition-colors group-hover:text-primary">
            {t("common.viewProfile")} <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}