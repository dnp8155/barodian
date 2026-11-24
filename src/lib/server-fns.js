import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getServerInfo = createServerFn({ method: "GET" }).handler(async () => ({
  renderedAt: new Date().toISOString(),
}));

const DIRECTORY_ENTITIES = {
  murtikar: "Murtikar",
  "dhol-tasha": "DholTasha",
  dj: "DjService",
};

const asItems = (result) => (Array.isArray(result) ? result : (result?.items ?? []));

async function firstRecord(b44, entity) {
  const items = asItems(await b44.entities[entity].list());
  return items[0] ?? null;
}

const byFeaturedThenName = (a, b) => {
  const f = Number(b.is_featured ?? false) - Number(a.is_featured ?? false);
  if (f !== 0) return f;
  return String(a.name_en ?? "").localeCompare(String(b.name_en ?? ""));
};

/** Site-wide settings and homepage copy, read once by the public layout. */
export const getSiteContext = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  const b44 = context.getBase44();
  const [settings, homepage] = await Promise.all([
    firstRecord(b44, "SiteSettings"),
    firstRecord(b44, "HomepageContent"),
  ]);
  return { settings, homepage };
});

async function publishedPhotosCount(b44) {
  const result = await b44.entities.GalleryPhoto.aggregate({
    query: { published: true },
    groupBy: "gallery_year_id",
  });
  const rows = Array.isArray(result) ? result : (result?.rows ?? []);
  const counts = {};
  for (const row of rows) {
    if (row.gallery_year_id) counts[row.gallery_year_id] = row.count ?? 0;
  }
  return counts;
}

/** Published years, newest first, with a photo count for each. */
export const getGalleryYears = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  const b44 = context.getBase44();
  const [yearPage, counts] = await Promise.all([
    b44.entities.GalleryYear.list({ sort: "-year", limit: 300 }),
    publishedPhotosCount(b44),
  ]);

  const years = asItems(yearPage)
    .filter((year) => year.published !== false)
    .map((year) => ({ ...year, photo_count: counts[year.id] ?? 0 }));

  return { years, totalPhotos: Object.values(counts).reduce((sum, n) => sum + n, 0) };
});

/** One year plus its published photographs. */
export const getGalleryYear = createServerFn({ method: "GET" })
  .validator((input) => z.object({ yearId: z.string().min(1).max(64) }).parse(input))
  .handler(async ({ context, data }) => {
    const b44 = context.getBase44();
    let year = null;
    try {
      year = await b44.entities.GalleryYear.get(data.yearId);
    } catch (error) {
      if (error?.status === 404) return null;
      throw error;
    }
    if (!year || year.published === false) return null;

    const photos = asItems(
      await b44.entities.GalleryPhoto.filter(
        { gallery_year_id: year.id, published: true },
        { sort: "display_order", limit: 300 }
      )
    );

    return { year, photos };
  });

/** Everything the homepage needs: the featured years and directory profiles. */
export const getHomepageFeeds = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  const b44 = context.getBase44();
  const [homepage, yearPage, counts, murtikars, dhol, dj] = await Promise.all([
    firstRecord(b44, "HomepageContent"),
    b44.entities.GalleryYear.list({ sort: "-year", limit: 300 }),
    publishedPhotosCount(b44),
    b44.entities.Murtikar.filter({ is_published: true }, { limit: 12 }),
    b44.entities.DholTasha.filter({ is_published: true }, { limit: 12 }),
    b44.entities.DjService.filter({ is_published: true }, { limit: 12 }),
  ]);

  const allYears = asItems(yearPage).filter((year) => year.published !== false);
  const featuredIds = homepage?.featured_year_ids ?? [];
  const chosen = featuredIds.length
    ? allYears.filter((year) => featuredIds.includes(year.id))
    : allYears.slice(0, 8);

  const years = chosen.map((year) => ({ ...year, photo_count: counts[year.id] ?? 0 }));

  const pick = (ids, items) => {
    const sorted = [...asItems(items)].sort(byFeaturedThenName);
    if (!ids?.length) return sorted.slice(0, 3);
    const set = ids;
    return sorted.filter((item) => set.includes(item.id)).slice(0, 3);
  };

  return {
    years,
    murtikars: pick(homepage?.featured_murtikar_ids, murtikars),
    dhol: pick(homepage?.featured_dhol_ids, dhol),
    dj: pick(homepage?.featured_dj_ids, dj),
  };
});

/** Published directory entries for one of the three public directories. */
export const getDirectory = createServerFn({ method: "GET" })
  .validator((input) => z.object({ kind: z.enum(["murtikar", "dhol-tasha", "dj"]) }).parse(input))
  .handler(async ({ context, data }) => {
    const b44 = context.getBase44();
    const entity = DIRECTORY_ENTITIES[data.kind];
    const items = asItems(await b44.entities[entity].filter({ is_published: true }, { limit: 300 }));
    return { items: [...items].sort(byFeaturedThenName) };
  });

/** A single published profile; null when it does not exist or is unpublished. */
export const getProfile = createServerFn({ method: "GET" })
  .validator((input) =>
    z.object({ kind: z.enum(["murtikar", "dhol-tasha", "dj"]), id: z.string().min(1).max(64) }).parse(input)
  )
  .handler(async ({ context, data }) => {
    const b44 = context.getBase44();
    const entity = DIRECTORY_ENTITIES[data.kind];
    try {
      const item = await b44.entities[entity].get(data.id);
      if (!item || item.is_published === false) return null;
      return item;
    } catch (error) {
      if (error?.status === 404) return null;
      throw error;
    }
  });

/** About page copy, with defaults applied by the page itself. */
export const getAboutContent = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  return await firstRecord(context.getBase44(), "AboutContent");
});

const enquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().default(""),
  subject: z.string().trim().max(160).optional().default(""),
  message: z.string().trim().min(1).max(4000),
});

/** Public contact form. Anyone may submit; only admins can read what comes in. */
export const submitEnquiry = createServerFn({ method: "POST" })
  .validator((input) => enquirySchema.parse(input))
  .handler(async ({ context, data }) => {
    const b44 = context.getBase44();
    await b44.entities.Enquiry.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      status: "new",
    });
    return { ok: true };
  });