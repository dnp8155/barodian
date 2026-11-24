import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { IntroSection } from "@/components/home/IntroSection";
import { ArchiveSection } from "@/components/home/ArchiveSection";
import { MurtikarSection } from "@/components/home/MurtikarSection";
import { DholSection } from "@/components/home/DholSection";
import { DjSection } from "@/components/home/DjSection";
import { EditorialSection } from "@/components/home/EditorialSection";
import { FinalCta } from "@/components/home/FinalCta";
import { getHomepageFeeds } from "@/lib/server-fns";

const siteRoute = getRouteApi("/_site");

export const Route = createFileRoute("/_site/")({
  loader: () => getHomepageFeeds(),
  head: () => ({
    meta: [
      { title: "Barodian — Celebrating the Spirit of Baroda" },
      {
        name: "description",
        content:
          "A digital archive of Vadodara's Ganpati celebrations: two decades of photographs, local Murtikars, Dhol-Tasha groups and DJ services.",
      },
      { property: "og:title", content: "Barodian — Celebrating the Spirit of Baroda" },
      { property: "og:description", content: "Our Culture. Our Tradition. Our Baroda." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://barodian.com/" }],
  }),
  component: HomePage,
});

function HomePage() {
  const { homepage } = siteRoute.useLoaderData();
  const { years, murtikars, dhol, dj } = Route.useLoaderData();

  return (
    <>
      <Hero content={homepage} />
      <IntroSection content={homepage} />
      <ArchiveSection years={years} content={homepage} />
      <MurtikarSection items={murtikars} />
      <DholSection items={dhol} />
      <DjSection items={dj} />
      <EditorialSection content={homepage} />
      <FinalCta content={homepage} />
    </>
  );
}