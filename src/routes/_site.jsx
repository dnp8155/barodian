import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SiteProvider } from "@/lib/SiteContext";
import { getSiteContext } from "@/lib/server-fns";

export const Route = createFileRoute("/_site")({
  loader: () => getSiteContext(),
  component: SiteLayout,
});

function SiteLayout() {
  const data = Route.useLoaderData();

  return (
    <SiteProvider value={data}>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </SiteProvider>
  );
}