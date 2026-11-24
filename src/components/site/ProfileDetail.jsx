import { Link } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Phone, MessageCircle, Globe } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useLanguage } from "@/lib/LanguageContext";
import { telHref, waHref, webHref } from "@/lib/contact-links";

export function ProfileDetail({ item, backTo, backLabel }) {
  const { t, pick } = useLanguage();
  const name = pick(item, "name");
  const description = pick(item, "description");
  const address = pick(item, "address");
  const call = telHref(item.phone);
  const whatsapp = waHref(item.whatsapp_number);
  const website = webHref(item.website);
  const gallery = Array.isArray(item.gallery_images) ? item.gallery_images.filter(Boolean) : [];

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
      <Link to={backTo} className="inline-flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.2em] text-foreground/50 transition-colors hover:text-primary">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
        {backLabel || t("profile.back")}
      </Link>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="img-warm overflow-hidden bg-[#F1E9DA]">
            {item.profile_image ? (
              <Image src={item.profile_image} alt={name} className="aspect-[4/5] w-full" />
            ) : (
              <div className="mandana aspect-[4/5] w-full opacity-70" aria-hidden="true" />
            )}
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-gold" aria-hidden="true" />
            <span className="eyebrow flex items-center gap-1.5 text-[#D88A32]">
              <MapPin className="h-3 w-3" strokeWidth={1.5} />
              {item.city || "Vadodara"}
            </span>
          </div>

          <h1 className="mt-5 font-display text-[2.2rem] leading-[1.06] tracking-[-0.01em] text-primary sm:text-5xl">
            {name}
          </h1>

          {description && (
            <div className="editorial-prose mt-7 max-w-xl">
              {description.split(/\n{2,}/).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}

          <div className="mt-10 border-t border-gold/40">
            {address && (
              <div className="flex items-start gap-3 border-b border-gold/25 py-4">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                <span className="font-body text-sm leading-relaxed text-foreground/70">{address}</span>
              </div>
            )}
            {item.phone && (
              <a href={call} className="flex items-center gap-3 border-b border-gold/25 py-4 font-body text-sm text-foreground/70 transition-colors hover:text-primary">
                <Phone className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                {item.phone}
              </a>
            )}
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-3 border-b border-gold/25 py-4 font-body text-sm text-foreground/70 transition-colors hover:text-primary"
              >
                <Globe className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                {item.website}
              </a>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {call && (
              <a href={call} className="btn-primary">
                <Phone className="h-4 w-4" strokeWidth={1.5} />
                {t("common.call")}
              </a>
            )}
            {whatsapp && (
              <a href={whatsapp} target="_blank" rel="noreferrer noopener" className="btn-outline">
                <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                {t("common.whatsapp")}
              </a>
            )}
          </div>
        </div>
      </div>

      {gallery.length > 0 && (
        <section className="mt-20 border-t border-gold/40 pt-12">
          <h2 className="font-display text-2xl text-primary sm:text-3xl">{t("profile.work")}</h2>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
            {gallery.map((src, index) => (
              <div key={`${src}-${index}`} className="img-warm overflow-hidden bg-[#F1E9DA]">
                <Image src={src} alt={`${name} work ${index + 1}`} className="aspect-[4/5] w-full" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}