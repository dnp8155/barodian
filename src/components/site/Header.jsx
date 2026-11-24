import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { LanguageSwitch } from "@/components/site/LanguageSwitch";
import { useLanguage } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";

export const NAV_LINKS = [
  { to: "/", key: "nav.home" },
  { to: "/gallery", key: "nav.gallery" },
  { to: "/murtikars", key: "nav.murtikars" },
  { to: "/dhol-tasha", key: "nav.dhol" },
  { to: "/dj", key: "nav.dj" },
  { to: "/about", key: "nav.about" },
  { to: "/contact", key: "nav.contact" },
];

const isActive = (pathname, to) => (to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`));

export function Header() {
  const { t } = useLanguage();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-gold/30 bg-[#F8F4EC]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:h-[84px] lg:px-12">
        <Link to="/" aria-label="Barodian — home" className="group shrink-0">
          <span className="block font-display text-[17px] tracking-[0.32em] text-primary sm:text-[20px]">BARODIAN</span>
          <span className="mt-1.5 block h-px w-full bg-gold/50 transition-colors duration-500 group-hover:bg-gold" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex xl:gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              aria-current={isActive(pathname, link.to) ? "page" : undefined}
              className={cn("nav-link", isActive(pathname, link.to) && "text-primary")}
            >
              {t(link.key)}
              <span
                className={cn(
                  "absolute -bottom-2 left-0 h-px bg-gold transition-all duration-500",
                  isActive(pathname, link.to) ? "w-full" : "w-0"
                )}
              />
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center lg:flex">
          <LanguageSwitch />
        </div>

        <div className="flex items-center gap-4 lg:hidden">
          <LanguageSwitch />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? t("nav.close") : t("nav.menu")}
            className="-mr-1 flex h-11 w-11 items-center justify-center text-primary"
          >
            {open ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-gold/30 bg-[#F8F4EC] lg:hidden">
          <nav aria-label="Mobile" className="mx-auto max-w-[1440px] px-5 py-4 sm:px-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex items-center justify-between border-b border-gold/20 py-4 font-display text-xl",
                  isActive(pathname, link.to) ? "text-primary" : "text-foreground/75"
                )}
              >
                {t(link.key)}
                <span aria-hidden="true" className="text-gold">
                  ↗
                </span>
              </Link>
            ))}
            <p className="eyebrow pt-6 pb-2 text-foreground/45">{t("brand.tagline")}</p>
          </nav>
        </div>
      )}
    </header>
  );
}