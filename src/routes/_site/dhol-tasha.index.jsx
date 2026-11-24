import { createFileRoute } from "@tanstack/react-router";
import { DirectoryListing } from "@/components/site/DirectoryListing";
import { useLanguage } from "@/lib/LanguageContext";
import { getDirectory } from "@/lib/server-fns";

export const Route = createFileRoute("/_site/dhol-tasha/")({
  loader: () => getDirectory({ data: { kind: "dhol-tasha" } }),
  head: () => ({
    meta: [
      { title: "Dhol-Tasha Groups in Baroda — Barodian" },
      {
        name: "description",
        content: "The Dhol-Tasha troupes that carry Vadodara's Ganpati processions with rhythm and energy.",
      },
      { property: "og:title", content: "Dhol-Tasha Groups — Barodian" },
    ],
    links: [{ rel: "canonical", href: "https://barodian.com/dhol-tasha" }],
  }),
  component: DholPage,
});

function DholPage() {
  const { items } = Route.useLoaderData();
  const { t } = useLanguage();
  return (
    <DirectoryListing
      eyebrow={t("dhol.eyebrow")}
      title={t("dhol.title.page")}
      description={t("dhol.desc.page")}
      items={items}
      emptyText={t("dhol.empty.page")}
      to="/dhol-tasha/$profileId"
    />
  );
}