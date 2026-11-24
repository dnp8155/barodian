import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useLanguage } from "@/lib/LanguageContext";
import { IMAGES } from "@/lib/images";

export function DholSection({ items = [] }) {
  const { t, pick } = useLanguage();

  return (
    <section className="relative isolate overflow-hidden bg-[#2E1218]">
      <div className="absolute inset-0">
        <Image src={IMAGES.dhol} alt="A Dhol-Tasha troupe performing at a Baroda festival" className="h-full w-full" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#2E1218]/95 via-[#2E1218]/72 to-[#2E1218]/25" />

      <div className="relative mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-[#D88A32]" aria-hidden="true" />
              <span className="eyebrow text-[#D88A32]">{t("dhol.eyebrow")}</span>
            </div>
            <h2 className="mt-5 max-w-xl font-display text-[1.9rem] leading-[1.12] tracking-[-0.01em] text-[#F8F4EC] sm:text-4xl lg:text-[3rem]">
              {t("dhol.title")}
            </h2>
            <p className="mt-6 max-w-lg font-body text-[15px] leading-[1.85] text-[#F1E7DA]/75">{t("dhol.desc")}</p>
            <Link to="/dhol-tasha" className="mt-8 inline-flex items-center gap-2 border-b border-[#D88A32]/50 pb-1.5 font-body text-[11px] uppercase tracking-[0.2em] text-[#F8F4EC] transition-colors hover:border-[#D88A32]">
              {t("dhol.cta")}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            {items.length === 0 ? (
              <p className="border-t border-[#F8F4EC]/20 pt-6 font-body text-sm leading-relaxed text-[#F1E7DA]/50">
                {t("dhol.empty")}
              </p>
            ) : (
              <ul className="divide-y divide-[#F8F4EC]/15 border-t border-[#F8F4EC]/15">
                {items.slice(0, 4).map((item) => (
                  <li key={item.id}>
                    <Link
                      to="/dhol-tasha/$profileId"
                      params={{ profileId: item.id }}
                      className="group flex items-baseline justify-between gap-4 py-4"
                    >
                      <span className="font-display text-lg text-[#F8F4EC] transition-colors group-hover:text-[#D88A32]">
                        {pick(item, "name")}
                      </span>
                      <span className="shrink-0 font-body text-[10px] uppercase tracking-[0.18em] text-[#F1E7DA]/45">
                        {item.city || "Vadodara"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}