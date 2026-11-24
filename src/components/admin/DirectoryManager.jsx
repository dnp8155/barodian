import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Image } from "@/components/ui/image";
import { AdminHeader, AdminButton } from "@/components/admin/AdminHeader";
import { BilingualField, TextField, ToggleField } from "@/components/admin/fields";
import { ImageField, MultiImageField } from "@/components/admin/ImageFields";

const EMPTY = {
  name_en: "",
  name_gu: "",
  description_en: "",
  description_gu: "",
  profile_image: "",
  gallery_images: [],
  phone: "",
  whatsapp_number: "",
  address_en: "",
  address_gu: "",
  city: "Vadodara",
  website: "",
  is_featured: false,
  is_published: true,
};

export function DirectoryManager({ entityName, title, description, noun }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const result = await base44.entities[entityName].list({ sort: "-created_date", limit: 500 });
      setItems(Array.isArray(result) ? result : (result.items ?? []));
    } catch {
      toast.error("Could not load records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityName]);

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const openNew = () => {
    setForm({ ...EMPTY, gallery_images: [] });
    setOpen(true);
  };

  const openEdit = (item) => {
    setForm({ ...EMPTY, ...item, gallery_images: item.gallery_images ?? [] });
    setOpen(true);
  };

  const save = async () => {
    if (!form.name_en?.trim() && !form.name_gu?.trim()) {
      toast.error("A name is required.");
      return;
    }
    setSaving(true);
    const payload = {
      name_en: form.name_en ?? "",
      name_gu: form.name_gu ?? "",
      description_en: form.description_en ?? "",
      description_gu: form.description_gu ?? "",
      profile_image: form.profile_image ?? "",
      gallery_images: form.gallery_images ?? [],
      phone: form.phone ?? "",
      whatsapp_number: form.whatsapp_number ?? "",
      address_en: form.address_en ?? "",
      address_gu: form.address_gu ?? "",
      city: form.city ?? "",
      website: form.website ?? "",
      is_featured: !!form.is_featured,
      is_published: !!form.is_published,
    };
    try {
      if (form.id) await base44.entities[entityName].update(form.id, payload);
      else await base44.entities[entityName].create(payload);
      toast.success(form.id ? "Changes saved." : `${noun} added.`);
      setOpen(false);
      await load();
    } catch {
      toast.error("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete “${item.name_en || item.name_gu}”? This cannot be undone.`)) return;
    try {
      await base44.entities[entityName].delete(item.id);
      toast.success("Deleted.");
      await load();
    } catch {
      toast.error("Could not delete this record.");
    }
  };

  const togglePublished = async (item) => {
    try {
      await base44.entities[entityName].update(item.id, { is_published: !item.is_published });
      await load();
    } catch {
      toast.error("Could not update visibility.");
    }
  };

  return (
    <div>
      <AdminHeader
        title={title}
        description={description}
        action={
          <AdminButton onClick={openNew}>
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            Add {noun}
          </AdminButton>
        }
      />

      {loading ? (
        <p className="mt-10 font-body text-sm text-foreground/40">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-10 font-body text-sm text-foreground/50">Nothing here yet. Add the first {noun.toLowerCase()}.</p>
      ) : (
        <div className="mt-8 divide-y divide-gold/30 border-y border-gold/30">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-3">
              <div className="h-14 w-12 shrink-0 overflow-hidden bg-[#F2EBDD]">
                {item.profile_image ? <Image src={item.profile_image} alt="" className="h-full w-full" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-[15px] text-primary">{item.name_en || item.name_gu}</p>
                <p className="truncate font-body text-[11px] uppercase tracking-[0.12em] text-foreground/40">
                  {item.city || "—"}
                  {item.is_featured ? " · featured" : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => togglePublished(item)}
                className={`hidden items-center gap-1.5 font-body text-[9px] uppercase tracking-[0.16em] sm:flex ${item.is_published ? "text-primary" : "text-foreground/35"}`}
              >
                {item.is_published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                {item.is_published ? "Published" : "Draft"}
              </button>
              <button type="button" onClick={() => openEdit(item)} aria-label="Edit" className="flex h-9 w-9 items-center justify-center text-primary/60 hover:text-primary">
                <Pencil className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <button type="button" onClick={() => remove(item)} aria-label="Delete" className="flex h-9 w-9 items-center justify-center text-foreground/35 hover:text-destructive">
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto bg-[#F8F4EC]">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-primary">
              {form.id ? `Edit ${noun}` : `Add ${noun}`}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-5">
            <BilingualField label="Name" en={form.name_en} gu={form.name_gu} onEn={(v) => set("name_en", v)} onGu={(v) => set("name_gu", v)} />
            <BilingualField
              label="Description"
              multiline
              rows={5}
              en={form.description_en}
              gu={form.description_gu}
              onEn={(v) => set("description_en", v)}
              onGu={(v) => set("description_gu", v)}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="City" value={form.city} onChange={(v) => set("city", v)} />
              <TextField label="Phone" value={form.phone} onChange={(v) => set("phone", v)} />
              <TextField label="WhatsApp number" value={form.whatsapp_number} onChange={(v) => set("whatsapp_number", v)} />
              <TextField label="Website" value={form.website} onChange={(v) => set("website", v)} />
            </div>
            <BilingualField label="Address" en={form.address_en} gu={form.address_gu} onEn={(v) => set("address_en", v)} onGu={(v) => set("address_gu", v)} />
            <ImageField label="Profile image" value={form.profile_image} onChange={(v) => set("profile_image", v)} />
            <MultiImageField label="Gallery images" values={form.gallery_images} onChange={(v) => set("gallery_images", v)} />
            <div className="flex flex-wrap gap-6 pt-2">
              <ToggleField label="Published" checked={form.is_published} onChange={(v) => set("is_published", v)} />
              <ToggleField label="Featured" checked={form.is_featured} onChange={(v) => set("is_featured", v)} />
            </div>
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