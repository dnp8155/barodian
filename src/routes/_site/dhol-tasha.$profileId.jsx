import { createFileRoute, Link } from "@tanstack/react-router";
import { ProfileDetail } from "@/components/site/ProfileDetail";
import { useLanguage } from "@/lib/LanguageContext";
import { getProfile } from "@/lib/server-fns";

export const Route = createFileRoute("/_site/dhol-tasha/$profileId")({
  loader: ({ params }) => getProfile({ data: { kind: "dhol-tasha", id: params.profileId } }),
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.name_en ? `${loaderData.name_en} — Dhol-Tasha, Barodian` : "Dhol-Tasha Group — Barodian" },
      {
        name: "description",
        content: loaderData?.description_en?.slice(0, 160) || "A Dhol-Tasha group profile from the Barodian directory.",
      },
      { property: "og:title", content: loaderData?.name_en ? `${loaderData.name_en} — Barodian` : "Barodian" },
    ],
  }),
  component: GroupProfilePage,
});

function GroupProfilePage() {
  const item = Route.useLoaderData();
  const { t } = useLanguage();

  if (!item) {
    return (
      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12">
        <p className="font-display text-2xl text-primary">{t("profile.missing")}</p>
        <Link to="/dhol-tasha" className="link-underline mt-8">
          {t("profile.back")}
        </Link>
      </div>
    );
  }

  return <ProfileDetail item={item} backTo="/dhol-tasha" backLabel={t("profile.back")} />;
}