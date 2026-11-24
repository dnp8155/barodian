import { createFileRoute } from "@tanstack/react-router";
import { DirectoryListing } from "@/components/site/DirectoryListing";
import { useLanguage } from "@/lib/LanguageContext";
import { getDirectory } from "@/lib/server-fns";

export const Route = createFileRoute("/_site/dj/")({
  loader: () => getDirectory({ data: { kind: "dj" } }),
  head: () => ({
    meta: [
      { title: "DJ & Sound Services in Baroda — Barodian" },
      {
        name: "description",
        content: "Sound, light and music providers for Vadodara's Ganpati festival nights.",
      },
      { property: "og:title", content: "DJ & Sound Services — Barodian" },
    ],
    links: [{ rel: "canonical", href: "https://barodian.com/dj" }],
  }),
  component: DjPage,
});

function DjPage() {
  const { items } = Route.useLoaderData();
  const { t } = useLanguage();
  return (
    <DirectoryListing
      eyebrow={t("dj.eyebrow")}
      title={t("dj.title.page")}
      description={t("dj.desc.page")}
      items={items}
      emptyText={t("dj.empty.page")}
      to="/dj/$profileId"
    />
  );
}