import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Images, Hammer, Drum, Disc3 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";

export const Route = createFileRoute("/_authed/admin/")({ component: Dashboard });

const QUICK_ACTIONS = [
  { to: "/admin/gallery-years", label: "Add Year", icon: Plus },
  { to: "/admin/gallery-photos", label: "Upload Photos", icon: Images },
  { to: "/admin/murtikars", label: "Add Murtikar", icon: Hammer },
  { to: "/admin/dhol-tasha", label: "Add Group", icon: Drum },
  { to: "/admin/dj", label: "Add DJ", icon: Disc3 },
];

function Dashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const [years, photos, publishedPhotos, murtikars, dhol, dj, enquiries, newEnquiries] = await Promise.all([
        base44.entities.GalleryYear.count(),
        base44.entities.GalleryPhoto.count(),
        base44.entities.GalleryPhoto.count({ published: true }),
        base44.entities.Murtikar.count(),
        base44.entities.DholTasha.count(),
        base44.entities.DjService.count(),
        base44.entities.Enquiry.count(),
        base44.entities.Enquiry.count({ status: "new" }),
      ]);
      if (active) setStats({ years, photos, publishedPhotos, murtikars, dhol, dj, enquiries, newEnquiries });
    })();
    return () => {
      active = false;
    };
  }, []);

  const cards = stats
    ? [
        { label: "Gallery years", value: stats.years },
        { label: "Published photos", value: stats.publishedPhotos, note: `${stats.photos} uploaded` },
        { label: "Murtikars", value: stats.murtikars },
        { label: "Dhol-Tasha groups", value: stats.dhol },
        { label: "DJ providers", value: stats.dj },
        { label: "Enquiries", value: stats.enquiries, note: `${stats.newEnquiries} new` },
      ]
    : [];

  return (
    <div>
      <div className="border-b border-gold/40 pb-6">
        <h1 className="font-display text-2xl leading-tight text-primary sm:text-3xl">{t("admin.dashboard")}</h1>
        <p className="mt-2 font-body text-[13px] text-foreground/55">{t("brand.tagline")}</p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats
          ? cards.map((card) => (
              <div key={card.label} className="border border-gold/40 bg-white/70 p-5">
                <p className="font-body text-[10px] uppercase tracking-[0.18em] text-foreground/45">{card.label}</p>
                <p className="mt-3 font-display text-4xl text-primary">{card.value}</p>
                {card.note && <p className="mt-1 font-body text-[11px] text-foreground/40">{card.note}</p>}
              </div>
            ))
          : [0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="h-28 animate-pulse border border-gold/30 bg-white/40" />)}
      </div>

      <div className="mt-10">
        <p className="font-body text-[10px] uppercase tracking-[0.2em] text-foreground/45">Quick actions</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {QUICK_ACTIONS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="inline-flex min-h-[42px] items-center gap-2 border border-[#702D38]/30 px-4 font-body text-[10px] uppercase tracking-[0.16em] text-[#702D38] transition-colors hover:border-[#702D38] hover:bg-[#702D38]/5"
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}