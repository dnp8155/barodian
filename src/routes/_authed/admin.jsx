import { useState } from "react";
import { createFileRoute, Link, Outlet, getRouteApi, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarDays,
  Images,
  Hammer,
  Drum,
  Disc3,
  Home as HomeIcon,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/admin")({ component: AdminLayout });

const authedRoute = getRouteApi("/_authed");

const NAV = [
  { to: "/admin", labelKey: "admin.dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/gallery-years", labelKey: "admin.galleryYears", icon: CalendarDays },
  { to: "/admin/gallery-photos", labelKey: "admin.galleryPhotos", icon: Images },
  { to: "/admin/murtikars", labelKey: "admin.murtikars", icon: Hammer },
  { to: "/admin/dhol-tasha", labelKey: "admin.dhol", icon: Drum },
  { to: "/admin/dj", labelKey: "admin.dj", icon: Disc3 },
  { to: "/admin/homepage", labelKey: "admin.homepage", icon: HomeIcon },
  { to: "/admin/enquiries", labelKey: "admin.enquiries", icon: Inbox },
  { to: "/admin/settings", labelKey: "admin.settings", icon: Settings },
];

const isActive = (pathname, item) => (item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(`${item.to}/`));

function AdminLayout() {
  const { user } = authedRoute.useRouteContext();
  const { t } = useLanguage();
  const { logout } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  if (user && user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F4EC] px-6">
        <div className="max-w-md text-center">
          <p className="font-display text-2xl text-primary">{t("admin.denied")}</p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link to="/" className="btn-outline">
              {t("admin.viewSite")}
            </Link>
            <button type="button" onClick={() => logout()} className="link-underline">
              {t("admin.logout")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4" aria-label="Admin">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = isActive(pathname, item);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 border-l-2 px-3 py-2.5 font-body text-[12.5px] transition-colors",
              active
                ? "border-[#D88A32] bg-white/10 text-[#F8F4EC]"
                : "border-transparent text-[#F1E7DA]/65 hover:bg-white/5 hover:text-[#F8F4EC]"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            {t(item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="border-t border-white/10 px-3 py-4">
      <Link to="/" className="flex items-center gap-3 px-3 py-2 font-body text-[12px] text-[#F1E7DA]/60 transition-colors hover:text-[#F8F4EC]">
        <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
        {t("admin.viewSite")}
      </Link>
      <button
        type="button"
        onClick={() => logout()}
        className="flex w-full items-center gap-3 px-3 py-2 font-body text-[12px] text-[#F1E7DA]/60 transition-colors hover:text-[#F8F4EC]"
      >
        <LogOut className="h-4 w-4" strokeWidth={1.5} />
        {t("admin.logout")}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F4EC] lg:flex">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col bg-[#4A2029] lg:flex">
        <div className="border-b border-white/10 px-5 py-6">
          <Link to="/" className="block">
            <span className="font-display text-[15px] tracking-[0.3em] text-[#F8F4EC]">BARODIAN</span>
          </Link>
          <span className="mt-3 block font-body text-[9px] uppercase tracking-[0.28em] text-[#D88A32]">{t("admin.title")}</span>
        </div>
        {nav}
        {footer}
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:pl-60">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gold/40 bg-[#F8F4EC]/95 px-5 py-3 backdrop-blur lg:hidden">
          <span className="font-display text-[13px] tracking-[0.28em] text-primary">BARODIAN</span>
          <button type="button" onClick={() => setOpen(true)} aria-label={t("nav.menu")} className="flex h-10 w-10 items-center justify-center text-primary">
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </header>

        {open && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="flex w-72 flex-col bg-[#4A2029]">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <span className="font-display text-[14px] tracking-[0.3em] text-[#F8F4EC]">BARODIAN</span>
                <button type="button" onClick={() => setOpen(false)} aria-label={t("nav.close")} className="text-[#F1E7DA]/70">
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>
              {nav}
              {footer}
            </div>
            <button type="button" aria-label={t("nav.close")} onClick={() => setOpen(false)} className="flex-1 bg-[#1C0D11]/50" />
          </div>
        )}

        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}