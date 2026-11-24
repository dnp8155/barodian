import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { createFileRoute } from "@tanstack/react-router";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Image } from "@/components/ui/image";
import { AdminHeader, AdminButton } from "@/components/admin/AdminHeader";
import { BilingualField, TextField, TextAreaField, ToggleField } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/ImageFields";

export const Route = createFileRoute("/_authed/admin/gallery-years")({ component: GalleryYearsAdmin });

const EMPTY = {
  year: new Date().getFullYear(),
  title_en: "",
  title_gu: "",
  description_en: "",
  description_gu: "",
  cover_image: "",
  published: true,
  display_order: 0,
};

function GalleryYearsAdmin() {
  const [years, setYears] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const result = await base44.entities.GalleryYear.list({ sort: "-year", limit: 400 });
      const rows = Array.isArray(result) ? result : (result.items ?? []);
      setYears(rows);
      const grouped = await base44.entities.GalleryPhoto.aggregate({ query: {}, groupBy: "gallery_year_id" });
      const groupedRows = Array.isArray(grouped) ? grouped : (grouped?.rows ?? []);
      const map = {};
      for (const row of groupedRows) map[row.gallery_year_id] = row.count ?? 0;
      setCounts(map);
    } catch {
      toast.error("Could not load gallery years.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const save = async () => {
    const year = Number(form.year);
    if (!year || year < 1900 || year > 2200) {
      toast.error("Enter a valid year.");
      return;
    }
    setSaving(true);
    const payload = {
      year,
      title_en: form.title_en ?? "",
      title_gu: form.title_gu ?? "",
      description_en: form.description_en ?? "",
      description_gu: form.description_gu ?? "",
      cover_image: form.cover_image ?? "",
      published: !!form.published,
      display_order: Number(form.display_order) || 0,
    };
    try {
      if (form.id) await base44.entities.GalleryYear.update(form.id, payload);
      else await base44.entities.GalleryYear.create(payload);
      toast.success(form.id ? "Year updated." : "Year added.");
      setOpen(false);
      await load();
    } catch {
      toast.error("Could not save this year.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (year) => {
    if (!window.confirm(`Delete ${year.year}? Its photographs stay in the database but will no longer be listed.`)) return;
    try {
      await base44.entities.GalleryYear.delete(year.id);
      toast.success("Year deleted.");
      await load();
    } catch {
      toast.error("Could not delete this year.");
    }
  };

  const togglePublished = async (year) => {
    try {
      await base44.entities.GalleryYear.update(year.id, { published: !year.published });
      await load();
    } catch {
      toast.error("Could not update visibility.");
    }
  };

  return (
    <div>
      <AdminHeader
        title="Gallery Years"
        description="Every year of the archive. Photographs are managed under Gallery Photos."
        action={
          <AdminButton
            onClick={() => {
              setForm({ ...EMPTY, year: (years[0]?.year ?? new Date().getFullYear()) + 1 });
              setOpen(true);
            }}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            Add year
          </AdminButton>
        }
      />

      {loading ? (
        <p className="mt-10 font-body text-sm text-foreground/40">Loading…</p>
      ) : years.length === 0 ? (
        <p className="mt-10 font-body text-sm text-foreground/50">No years yet. Add the first year to start the archive.</p>
      ) : (
        <div className="mt-8 divide-y divide-gold/30 border-y border-gold/30">
          {years.map((year) => (
            <div key={year.id} className="flex items-center gap-4 py-3">
              <div className="h-14 w-12 shrink-0 overflow-hidden bg-[#F2EBDD]">
                {year.cover_image ? <Image src={year.cover_image} alt="" className="h-full w-full" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-[16px] text-primary">{year.year}</p>
                <p className="truncate font-body text-[11px] uppercase tracking-[0.12em] text-foreground/40">
                  {counts[year.id] ?? 0} photos · {year.title_en || "No title"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => togglePublished(year)}
                className={`hidden items-center gap-1.5 font-body text-[9px] uppercase tracking-[0.16em] sm:flex ${year.published ? "text-primary" : "text-foreground/35"}`}
              >
                {year.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                {year.published ? "Published" : "Draft"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm({ ...EMPTY, ...year });
                  setOpen(true);
                }}
                aria-label="Edit"
                className="flex h-9 w-9 items-center justify-center text-primary/60 hover:text-primary"
              >
                <Pencil className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <button type="button" onClick={() => remove(year)} aria-label="Delete" className="flex h-9 w-9 items-center justify-center text-foreground/35 hover:text-destructive">
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto bg-[#F8F4EC]">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-primary">{form.id ? "Edit year" : "Add year"}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Year" type="number" value={form.year} onChange={(v) => set("year", v)} />
              <TextField label="Display order" type="number" value={form.display_order} onChange={(v) => set("display_order", v)} />
            </div>
            <BilingualField label="Title" en={form.title_en} gu={form.title_gu} onEn={(v) => set("title_en", v)} onGu={(v) => set("title_gu", v)} />
            <BilingualField
              label="Description"
              multiline
              rows={4}
              en={form.description_en}
              gu={form.description_gu}
              onEn={(v) => set("description_en", v)}
              onGu={(v) => set("description_gu", v)}
            />
            <ImageField label="Cover image" value={form.cover_image} onChange={(v) => set("cover_image", v)} />
            <ToggleField label="Published" checked={form.published} onChange={(v) => set("published", v)} />
          </div>

          <div className="mt-7 flex justify-end gap-3 border-t border-gold/40 pt-5">
            <AdminButton variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </AdminButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}