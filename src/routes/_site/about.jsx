import { createFileRoute, Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import { useLanguage } from "@/lib/LanguageContext";
import { ABOUT_DEFAULTS, ABOUT_SECTIONS } from "@/lib/about-defaults";
import { IMAGES } from "@/lib/images";
import { getAboutContent } from "@/lib/server-fns";

export const Route = createFileRoute("/_site/about")({
  loader: () => getAboutContent(),
  head: () => ({
    meta: [
      { title: "About Barodian — Preserving the Spirit of Baroda" },
      {
        name: "description",
        content:
          "Barodian is a community archive preserving the Ganpati memories, local Murtikars and cultural traditions of Vadodara.",
      },
      { property: "og:title", content: "About Barodian" },
    ],
    links: [{ rel: "canonical", href: "https://barodian.com/about" }],
  }),
  component: AboutPage,
});

const SECTION_IMAGES = {
  who: IMAGES.workshop,
  story: IMAGES.procession,
  vision: IMAGES.idolDetail,
};

function AboutPage() {
  const content = Route.useLoaderData();
  const { lang, t, pick } = useLanguage();
  const defaults = ABOUT_DEFAULTS[lang] ?? ABOUT_DEFAULTS.en;

  const sections = ABOUT_SECTIONS.map((key) => ({
    key,
    title: pick(content, `${key}_title`) || defaults[`${key}_title`],
    body: pick(content, `${key}_body`) || defaults[`${key}_body`],
    image: SECTION_IMAGES[key] ?? null,
  }));

  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#3A1820]">
        <Image
          src={content?.hero_image || IMAGES.mandap}
          alt="Brass lamps and marigold garlands inside a traditional Ganpati mandap"
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#37161D]/94 via-[#37161D]/72 to-[#37161D]/35" />
        <div className="relative mx-auto flex min-h-[52vh] max-w-[1440px] flex-col justify-end px-5 pb-14 pt-24 sm:px-8 lg:px-12 lg:pb-20">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-[#D88A32]" aria-hidden="true" />
            <span className="eyebrow text-[#D88A32]">{t("about.eyebrow")}</span>
          </div>
          <h1 className="mt-6 max-w-2xl font-display text-[2.4rem] leading-[1.05] tracking-[-0.02em] text-[#F8F4EC] sm:text-6xl">
            {t("about.title")}
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="space-y-20 lg:space-y-28">
          {sections.map((section, index) => {
            const reversed = index % 2 === 1;
            const paragraphs = String(section.body).split(/\n{2,}/);

            return (
              <section key={section.key} className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
                {section.image ? (
                  <div className={`lg:col-span-5 ${reversed ? "lg:order-2 lg:col-start-8" : ""}`}>
                    <div className="img-warm overflow-hidden">
                      <Image src={section.image} alt={section.title} className="aspect-[4/5] w-full" />
                    </div>
                  </div>
                ) : null}

                <div className={`${section.image ? "lg:col-span-6" : "mx-auto max-w-2xl text-center lg:col-span-12"} ${reversed ? "lg:order-1" : ""}`}>
                  <p className="eyebrow text-[#D88A32]">{String(index + 1).padStart(2, "0")}</p>
                  <h2 className="mt-4 font-display text-[1.8rem] leading-[1.15] text-primary sm:text-4xl">{section.title}</h2>
                  <div className={`editorial-prose mt-6 ${section.image ? "" : "mx-auto max-w-xl"}`}>
                    {paragraphs.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-20 flex justify-center border-t border-gold/40 pt-14">
          <Link to="/gallery" className="btn-primary">
            {t("about.cta")}
          </Link>
        </div>
      </div>
    </>
  );
}