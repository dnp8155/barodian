import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUp, ArrowDown, Pencil, Trash2, Upload, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Image } from "@/components/ui/image";
import { AdminHeader, AdminButton } from "@/components/admin/AdminHeader";
import { BilingualField, TextField, ToggleField, inputClass } from "@/components/admin/fields";

export const Route = createFileRoute("/_authed/admin/gallery-photos")({ component: GalleryPhotosAdmin });

function GalleryPhotosAdmin() {
  const [years, setYears] = useState([]);
  const [yearId, setYearId] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const loadYears = async () => {
    const result = await base44.entities.GalleryYear.list({ sort: "-year", limit: 400 });
    const rows = Array.isArray(result) ? result : (result.items ?? []);
    setYears(rows);
    if (!yearId && rows.length) setYearId(rows[0].id);
    setLoading(false);
  };

  const loadPhotos = async (id) => {
    if (!id) {
      setPhotos([]);
      return;
    }
    const result = await base44.entities.GalleryPhoto.filter({ gallery_year_id: id }, { sort: "display_order", limit: 400 });
    setPhotos(Array.isArray(result) ? result : (result.items ?? []));
  };

  useEffect(() => {
    loadYears();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadPhotos(yearId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearId]);

  const upload = async (event) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length || !yearId) return;
    setUploading(true);
    try {
      let order = photos.length ? Math.max(...photos.map((p) => Number(p.display_order) || 0)) + 1 : 0;
      for (const file of files) {
        const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
        await base44.entities.GalleryPhoto.create({
          gallery_year_id: yearId,
          image: file_url,
          caption_en: "",
          caption_gu: "",
          alt_text: "",
          display_order: order,
          published: true,
        });
        order += 1;
      }
      toast.success(files.length === 1 ? "Photograph uploaded." : `${files.length} photographs uploaded.`);
      await loadPhotos(yearId);
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const save = async () => {
    if (!form) return;
    setSaving(true);
    try {
      await base44.entities.GalleryPhoto.update(form.id, {
        caption_en: form.caption_en ?? "",
        caption_gu: form.caption_gu ?? "",
        alt_text: form.alt_text ?? "",
        published: !!form.published,
      });
      toast.success("Photograph updated.");
      setOpen(false);
      await loadPhotos(yearId);
    } catch {
      toast.error("Could not save this photograph.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (photo) => {
    if (!window.confirm("Delete this photograph?")) return;
    try {
      await base44.entities.GalleryPhoto.delete(photo.id);
      toast.success("Photograph deleted.");
      await loadPhotos(yearId);
    } catch {
      toast.error("Could not delete this photograph.");
    }
  };

  const move = async (photo, direction) => {
    const index = photos.findIndex((p) => p.id === photo.id);
    const neighbour = photos[index + direction];
    if (!neighbour) return;
    const a = Number(photo.display_order) || index;
    const b = Number(neighbour.display_order) || index + direction;
    try {
      await base44.entities.GalleryPhoto.update(photo.id, { display_order: b });
      await base44.entities.GalleryPhoto.update(neighbour.id, { display_order: a });
      await loadPhotos(yearId);
    } catch {
      toast.error("Could not reorder photographs.");
    }
  };

  const togglePublished = async (photo) => {
    try {
      await base44.entities.GalleryPhoto.update(photo.id, { published: !photo.published });
      await loadPhotos(yearId);
    } catch {
      toast.error("Could not update visibility.");
    }
  };

  return (
    <div>
      <AdminHeader
        title="Gallery Photos"
        description="Upload photographs into a year, write bilingual captions, reorder and publish."
        action={
          <div className="flex gap-2">
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={upload} className="hidden" id="photo-upload" />
            <AdminButton onClick={() => fileRef.current?.click()} disabled={!yearId || uploading}>
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" strokeWidth={2} />}
              {uploading ? "Uploading…" : "Upload photos"}
            </AdminButton>
          </div>
        }
      />

      <div className="mt-6 max-w-sm">
        <span className="font-body text-[10px] uppercase tracking-[0.16em] text-foreground/50">Year</span>
        <select value={yearId} onChange={(e) => setYearId(e.target.value)} className={inputClass}>
          <option value="">Select a year…</option>
          {years.map((year) => (
            <option key={year.id} value={year.id}>
              {year.year} {year.title_en ? `— ${year.title_en}` : ""}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="mt-10 font-body text-sm text-foreground/40">Loading…</p>
      ) : !yearId ? (
        <p className="mt-10 font-body text-sm text-foreground/50">Add a gallery year first, then upload photographs into it.</p>
      ) : photos.length === 0 ? (
        <p className="mt-10 font-body text-sm text-foreground/50">No photographs in this year yet.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => (
            <div key={photo.id} className="border border-gold/40 bg-white/70">
              <div className="aspect-[4/3] overflow-hidden bg-[#F2EBDD]">
                <Image src={photo.image} alt={photo.alt_text || photo.caption_en || ""} className="h-full w-full" />
              </div>
              <div className="p-3">
                <p className="line-clamp-2 min-h-[32px] font-body text-[12px] text-foreground/65">{photo.caption_en || "No caption"}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => move(photo, -1)} aria-label="Move up" className="flex h-8 w-8 items-center justify-center text-foreground/45 hover:text-primary">
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => move(photo, 1)} aria-label="Move down" className="flex h-8 w-8 items-center justify-center text-foreground/45 hover:text-primary">
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => togglePublished(photo)}
                      aria-label="Toggle published"
                      className={`flex h-8 w-8 items-center justify-center ${photo.published ? "text-primary" : "text-foreground/30"}`}
                    >
                      {photo.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setForm(photo);
                        setOpen(true);
                      }}
                      aria-label="Edit caption"
                      className="flex h-8 w-8 items-center justify-center text-primary/60 hover:text-primary"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => remove(photo)} aria-label="Delete" className="flex h-8 w-8 items-center justify-center text-foreground/35 hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] max-w-xl overflow-y-auto bg-[#F8F4EC]">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-primary">Edit photograph</DialogTitle>
          </DialogHeader>
          {form && (
            <div className="mt-4 space-y-5">
              <div className="aspect-[4/3] overflow-hidden bg-[#F2EBDD]">
                <Image src={form.image} alt="" className="h-full w-full" fittingType="fit" />
              </div>
              <BilingualField
                label="Caption"
                en={form.caption_en}
                gu={form.caption_gu}
                onEn={(v) => setForm({ ...form, caption_en: v })}
                onGu={(v) => setForm({ ...form, caption_gu: v })}
              />
              <TextField label="Alt text" value={form.alt_text} onChange={(v) => setForm({ ...form, alt_text: v })} />
              <ToggleField label="Published" checked={form.published} onChange={(v) => setForm({ ...form, published: v })} />
            </div>
          )}
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