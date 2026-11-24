import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { AdminHeader, AdminButton } from "@/components/admin/AdminHeader";
import { BilingualField } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/ImageFields";

export const Route = createFileRoute("/_authed/admin/homepage")({ component: HomepageAdmin });

const EMPTY = {};

function Section({ title, children }) {
  return (
    <section className="border border-gold/40 bg-white/60 p-5 sm:p-6">
      <h2 className="font-display text-lg text-primary">{title}</h2>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

function HomepageAdmin() {
  const [form, setForm] = useState(EMPTY);
  const [years, setYears] = useState([]);
  const [directory, setDirectory] = useState({ murtikar: [], dhol: [], dj: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const [homeRows, yearRows, murtikarRows, dholRows, djRows] = await Promise.all([
        base44.entities.HomepageContent.list(),
        base44.entities.GalleryYear.list({ sort: "-year", limit: 400 }),
        base44.entities.Murtikar.list({ sort: "-created_date", limit: 400 }),
        base44.entities.DholTasha.list({ sort: "-created_date", limit: 400 }),
        base44.entities.DjService.list({ sort: "-created_date", limit: 400 }),
      ]);
      if (!active) return;
      const first = (Array.isArray(homeRows) ? homeRows : homeRows.items ?? [])[0] ?? EMPTY;
      setForm({
        ...first,
        featured_year_ids: first.featured_year_ids ?? [],
        featured_murtikar_ids: first.featured_murtikar_ids ?? [],
        featured_dhol_ids: first.featured_dhol_ids ?? [],
        featured_dj_ids: first.featured_dj_ids ?? [],
      });
      const rows = (value) => (Array.isArray(value) ? value : (value.items ?? []));
      setYears(rows(yearRows));
      setDirectory({ murtikar: rows(murtikarRows), dhol: rows(dholRows), dj: rows(djRows) });
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const bi = (name, label, multiline = false, rows = 3) => (
    <BilingualField
      label={label}
      multiline={multiline}
      rows={rows}
      en={form[`${name}_en`]}
      gu={form[`${name}_gu`]}
      onEn={(v) => set(`${name}_en`, v)}
      onGu={(v) => set(`${name}_gu`, v)}
    />
  );

  const toggleId = (field, id) => {
    const current = form[field] ?? [];
    set(field, current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  };

  const picker = (label, items, field, getLabel) => (
    <div>
      <p className="font-body text-[10px] uppercase tracking-[0.16em] text-foreground/50">{label}</p>
      <div className="mt-2 flex max-h-44 flex-wrap gap-2 overflow-y-auto border border-gold/30 p-3">
        {items.length === 0 ? (
          <p className="font-body text-[12px] text-foreground/40">Nothing available yet.</p>
        ) : (
          items.map((item) => {
            const selected = (form[field] ?? []).includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleId(field, item.id)}
                className={`px-3 py-1.5 font-body text-[11px] transition-colors ${
                  selected ? "bg-[#702D38] text-[#F8F4EC]" : "border border-gold/50 text-foreground/60 hover:border-primary"
                }`}
              >
                {getLabel(item)}
              </button>
            );
          })
        )}
      </div>
      <p className="mt-1.5 font-body text-[11px] text-foreground/35">Leave empty to show the latest entries automatically.</p>
    </div>
  );

  const save = async () => {
    setSaving(true);
    const payload = { ...form };
    delete payload.id;
    delete payload.created_date;
    delete payload.created_by;
    delete payload.created_by_id;
    delete payload.updated_date;
    try {
      if (form.id) await base44.entities.HomepageContent.update(form.id, payload);
      else await base44.entities.HomepageContent.create(payload);
      toast.success("Homepage updated.");
    } catch {
      toast.error("Could not save the homepage.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="font-body text-sm text-foreground/40">Loading…</p>;

  return (
    <div>
      <AdminHeader
        title="Homepage Management"
        description="Every heading, description and photograph on the public homepage. Leave a field empty to use the site's built-in wording."
        action={
          <AdminButton onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </AdminButton>
        }
      />

      <div className="mt-8 space-y-6">
        <Section title="Hero">
          {bi("hero_eyebrow", "Eyebrow")}
          {bi("hero_title", "Main heading")}
          {bi("hero_description", "Description", true, 3)}
          {bi("hero_cta_primary", "Primary button label")}
          {bi("hero_cta_secondary", "Secondary button label")}
          <ImageField label="Hero photograph" value={form.hero_image} onChange={(v) => set("hero_image", v)} />
        </Section>

        <Section title="Introduction">
          {bi("intro_title", "Heading")}
          {bi("intro_body", "First paragraph", true, 4)}
          {bi("intro_body_two", "Second paragraph", true, 3)}
        </Section>

        <Section title="Archive">
          {bi("archive_title", "Heading")}
          {bi("archive_description", "Description", true, 3)}
          {picker("Featured years", years.filter((y) => y.published !== false), "featured_year_ids", (y) => String(y.year))}
        </Section>

        <Section title="Directories">
          {picker("Featured Murtikars", directory.murtikar, "featured_murtikar_ids", (m) => m.name_en || m.name_gu)}
          {picker("Featured Dhol-Tasha groups", directory.dhol, "featured_dhol_ids", (m) => m.name_en || m.name_gu)}
          {picker("Featured DJ providers", directory.dj, "featured_dj_ids", (m) => m.name_en || m.name_gu)}
        </Section>

        <Section title="Cultural editorial">
          {bi("editorial_title", "Heading")}
          {bi("editorial_body", "Text", true, 4)}
        </Section>

        <Section title="Closing call to action">
          {bi("final_title", "Heading")}
          {bi("final_description", "Description", true, 3)}
          {bi("final_cta", "Button label")}
        </Section>
      </div>

      <div className="mt-8 flex justify-end border-t border-gold/40 pt-6">
        <AdminButton onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </AdminButton>
      </div>
    </div>
  );
}