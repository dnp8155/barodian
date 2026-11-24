import { PageIntro } from "@/components/site/PageIntro";
import { DirectoryTile } from "@/components/site/DirectoryTile";
import { useLanguage } from "@/lib/LanguageContext";

export function DirectoryListing({ eyebrow, title, description, items, emptyText, to }) {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <PageIntro eyebrow={eyebrow} title={title} description={description} />

      <div className="mt-12 flex items-center gap-3 border-y border-gold/40 py-4">
        <span className="eyebrow text-foreground/45">
          {items.length} {items.length === 1 ? t("common.profile") : t("common.profiles")}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="mt-14 max-w-xl font-display text-xl leading-relaxed text-primary/55">{emptyText}</p>
      ) : (
        <div className="mt-12 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <DirectoryTile key={item.id} item={item} to={to} />
          ))}
        </div>
      )}
    </div>
  );
}