import { createFileRoute } from "@tanstack/react-router";
import { DirectoryListing } from "@/components/site/DirectoryListing";
import { useLanguage } from "@/lib/LanguageContext";
import { getDirectory } from "@/lib/server-fns";

export const Route = createFileRoute("/_site/murtikars/")({
  loader: () => getDirectory({ data: { kind: "murtikar" } }),
  head: () => ({
    meta: [
      { title: "Murtikars of Vadodara — Barodian" },
      {
        name: "description",
        content: "Meet the local Murtikars and idol-making workshops whose craft shapes Baroda's Ganpati celebrations.",
      },
      { property: "og:title", content: "Murtikars of Vadodara — Barodian" },
    ],
    links: [{ rel: "canonical", href: "https://barodian.com/murtikars" }],
  }),
  component: MurtikarsPage,
});

function MurtikarsPage() {
  const { items } = Route.useLoaderData();
  const { t } = useLanguage();
  return (
    <DirectoryListing
      eyebrow={t("murtikar.eyebrow")}
      title={t("murtikars.title")}
      description={t("murtikars.desc")}
      items={items}
      emptyText={t("murtikars.empty")}
      to="/murtikars/$profileId"
    />
  );
}