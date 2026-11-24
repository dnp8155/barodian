import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { AdminHeader, AdminButton } from "@/components/admin/AdminHeader";
import { BilingualField, TextField, TextAreaField } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/ImageFields";

export const Route = createFileRoute("/_authed/admin/settings")({ component: SettingsAdmin });

const ABOUT_SECTIONS = [
  { key: "who", label: "Who We Are" },
  { key: "story", label: "Our Story" },
  { key: "vision", label: "Our Vision" },
  { key: "connection", label: "Our Cultural Connection" },
  { key: "why", label: "Why Barodian Exists" },
];

function clean(record) {
  const payload = { ...record };
  delete payload.id;
  delete payload.created_date;
  delete payload.created_by;
  delete payload.created_by_id;
  delete payload.updated_date;
  return payload;
}

function SettingsAdmin() {
  const [settings, setSettings] = useState(null);
  const [about, setAbout] = useState(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingAbout, setSavingAbout] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const [settingsRows, aboutRows] = await Promise.all([
        base44.entities.SiteSettings.list(),
        base44.entities.AboutContent.list(),
      ]);
      if (!active) return;
      const pick = (value) => (Array.isArray(value) ? value : value.items ?? [])[0] ?? {};
      setSettings(pick(settingsRows));
      setAbout(pick(aboutRows));
    })();
    return () => {
      active = false;
    };
  }, []);

  const save = async (entity, record, setRecord, setBusy, label) => {
    setBusy(true);
    try {
      const payload = clean(record);
      if (record.id) await base44.entities[entity].update(record.id, payload);
      else await base44.entities[entity].create(payload);
      toast.success(`${label} saved.`);
    } catch {
      toast.error(`Could not save ${label.toLowerCase()}.`);
    } finally {
      setBusy(false);
    }
  };

  if (!settings || !about) return <p className="font-body text-sm text-foreground/40">Loading…</p>;

  return (
    <div>
      <AdminHeader title="Website Settings" description="Contact details, social links, branding and the About page content." />

      <section className="mt-8 border border-gold/40 bg-white/60 p-5 sm:p-6">
        <h2 className="font-display text-lg text-primary">Site details</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <TextField label="Website name" value={settings.site_name} onChange={(v) => setSettings({ ...settings, site_name: v })} />
          <TextField label="Contact email" value={settings.contact_email} onChange={(v) => setSettings({ ...settings, contact_email: v })} />
          <TextField label="Contact phone" value={settings.contact_phone} onChange={(v) => setSettings({ ...settings, contact_phone: v })} />
          <TextField label="WhatsApp number" value={settings.whatsapp_number} onChange={(v) => setSettings({ ...settings, whatsapp_number: v })} />
          <TextField label="Instagram URL" value={settings.instagram} onChange={(v) => setSettings({ ...settings, instagram: v })} />
          <TextField label="Facebook URL" value={settings.facebook} onChange={(v) => setSettings({ ...settings, facebook: v })} />
          <TextField label="YouTube URL" value={settings.youtube} onChange={(v) => setSettings({ ...settings, youtube: v })} />
          <TextField label="Address" value={settings.address} onChange={(v) => setSettings({ ...settings, address: v })} />
        </div>
        <div className="mt-5">
          <TextAreaField label="Footer description" rows={3} value={settings.footer_description} onChange={(v) => setSettings({ ...settings, footer_description: v })} />
        </div>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <ImageField label="Logo" value={settings.logo} onChange={(v) => setSettings({ ...settings, logo: v })} />
          <ImageField label="Favicon" value={settings.favicon} onChange={(v) => setSettings({ ...settings, favicon: v })} />
        </div>
        <div className="mt-6 flex justify-end border-t border-gold/40 pt-5">
          <AdminButton onClick={() => save("SiteSettings", settings, setSettings, setSavingSettings, "Website settings")} disabled={savingSettings}>
            {savingSettings ? "Saving…" : "Save settings"}
          </AdminButton>
        </div>
      </section>

      <section className="mt-6 border border-gold/40 bg-white/60 p-5 sm:p-6">
        <h2 className="font-display text-lg text-primary">About page</h2>
        <p className="mt-1 font-body text-[12px] text-foreground/45">Leave a field empty to use the built-in wording.</p>

        <div className="mt-5 space-y-6">
          {ABOUT_SECTIONS.map((section) => (
            <div key={section.key} className="space-y-4 border-t border-gold/25 pt-5 first:border-t-0 first:pt-0">
              <p className="font-body text-[10px] uppercase tracking-[0.18em] text-[#D88A32]">{section.label}</p>
              <BilingualField
                label="Heading"
                en={about[`${section.key}_title_en`]}
                gu={about[`${section.key}_title_gu`]}
                onEn={(v) => setAbout({ ...about, [`${section.key}_title_en`]: v })}
                onGu={(v) => setAbout({ ...about, [`${section.key}_title_gu`]: v })}
              />
              <BilingualField
                label="Text"
                multiline
                rows={4}
                en={about[`${section.key}_body_en`]}
                gu={about[`${section.key}_body_gu`]}
                onEn={(v) => setAbout({ ...about, [`${section.key}_body_en`]: v })}
                onGu={(v) => setAbout({ ...about, [`${section.key}_body_gu`]: v })}
              />
            </div>
          ))}
          <div className="grid gap-6 border-t border-gold/25 pt-5 sm:grid-cols-2">
            <ImageField label="About hero image" value={about.hero_image} onChange={(v) => setAbout({ ...about, hero_image: v })} />
            <ImageField label="Secondary image" value={about.secondary_image} onChange={(v) => setAbout({ ...about, secondary_image: v })} />
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-gold/40 pt-5">
          <AdminButton onClick={() => save("AboutContent", about, setAbout, setSavingAbout, "About page")} disabled={savingAbout}>
            {savingAbout ? "Saving…" : "Save about page"}
          </AdminButton>
        </div>
      </section>
    </div>
  );
}