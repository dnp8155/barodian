import { createFileRoute, Link } from "@tanstack/react-router";
import { ProfileDetail } from "@/components/site/ProfileDetail";
import { useLanguage } from "@/lib/LanguageContext";
import { getProfile } from "@/lib/server-fns";

export const Route = createFileRoute("/_site/dj/$profileId")({
  loader: ({ params }) => getProfile({ data: { kind: "dj", id: params.profileId } }),
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.name_en ? `${loaderData.name_en} — DJ Services, Barodian` : "DJ Service — Barodian" },
      {
        name: "description",
        content: loaderData?.description_en?.slice(0, 160) || "A DJ and sound service profile from the Barodian directory.",
      },
      { property: "og:title", content: loaderData?.name_en ? `${loaderData.name_en} — Barodian` : "Barodian" },
    ],
  }),
  component: DjProfilePage,
});

function DjProfilePage() {
  const item = Route.useLoaderData();
  const { t } = useLanguage();

  if (!item) {
    return (
      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12">
        <p className="font-display text-2xl text-primary">{t("profile.missing")}</p>
        <Link to="/dj" className="link-underline mt-8">
          {t("profile.back")}
        </Link>
      </div>
    );
  }

  return <ProfileDetail item={item} backTo="/dj" backLabel={t("profile.back")} />;
}