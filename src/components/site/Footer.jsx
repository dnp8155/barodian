import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { LanguageSwitch } from "@/components/site/LanguageSwitch";
import { useLanguage } from "@/lib/LanguageContext";
import { useSite } from "@/lib/SiteContext";

const explore = [
  { to: "/gallery", key: "nav.gallery" },
  { to: "/murtikars", key: "nav.murtikars" },
  { to: "/dhol-tasha", key: "nav.dhol" },
  { to: "/dj", key: "nav.dj" },
];

const brand = [
  { to: "/about", key: "nav.about" },
  { to: "/contact", key: "nav.contact" },
];

export function Footer() {
  const { t } = useLanguage();
  const { settings } = useSite();
  const year = new Date().getFullYear();
  const socials = [
    { href: settings?.instagram, icon: Instagram, label: "Instagram" },
    { href: settings?.facebook, icon: Facebook, label: "Facebook" },
    { href: settings?.youtube, icon: Youtube, label: "YouTube" },
  ].filter((s) => s.href);

  return (
    <footer className="bg-[#4A2029] text-[#F1E7DA]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="font-display text-[19px] tracking-[0.32em] text-[#F8F4EC]">BARODIAN</p>
            <span className="mt-3 block h-px w-16 bg-[#B99A65]" />
            <p className="mt-6 max-w-sm text-sm leading-[1.85] text-[#F1E7DA]/70">
              {settings?.footer_description || t("footer.defaultDesc")}
            </p>
            <p className="mt-6 font-display text-sm italic text-[#D88A32]">{t("brand.tagline")}</p>
          </div>

          <nav aria-label="Explore" className="lg:col-span-2">
            <h2 className="eyebrow text-[#B99A65]">{t("footer.explore")}</h2>
            <ul className="mt-5 space-y-3">
              {explore.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-[#F1E7DA]/75 transition-colors hover:text-[#F8F4EC]">
                    {t(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="About" className="lg:col-span-2">
            <h2 className="eyebrow text-[#B99A65]">{t("footer.about")}</h2>
            <ul className="mt-5 space-y-3">
              {brand.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-[#F1E7DA]/75 transition-colors hover:text-[#F8F4EC]">
                    {t(l.key)}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/admin" className="text-sm text-[#F1E7DA]/45 transition-colors hover:text-[#F8F4EC]">
                  {t("admin.title")}
                </Link>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="eyebrow text-[#B99A65]">{t("footer.connect")}</h2>
            <ul className="mt-5 space-y-3 text-sm text-[#F1E7DA]/75">
              {settings?.contact_email && (
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#B99A65]" strokeWidth={1.5} />
                  <a href={`mailto:${settings.contact_email}`} className="hover:text-[#F8F4EC]">
                    {settings.contact_email}
                  </a>
                </li>
              )}
              {settings?.contact_phone && (
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#B99A65]" strokeWidth={1.5} />
                  <a href={`tel:${settings.contact_phone}`} className="hover:text-[#F8F4EC]">
                    {settings.contact_phone}
                  </a>
                </li>
              )}
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#B99A65]" strokeWidth={1.5} />
                <span>{settings?.address || "Vadodara, Gujarat, India"}</span>
              </li>
            </ul>
            {socials.length > 0 && (
              <div className="mt-6 flex items-center gap-4">
                {socials.map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center border border-[#F1E7DA]/20 text-[#F1E7DA]/80 transition-colors hover:border-[#B99A65] hover:text-[#F8F4EC]"
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-[#F1E7DA]/15">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-5 text-[11px] uppercase tracking-[0.16em] text-[#F1E7DA]/45 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p>
            © {year} Barodian. {t("footer.rights")}
          </p>
          <LanguageSwitch tone="light" />
        </div>
      </div>
    </footer>
  );
}