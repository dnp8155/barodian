import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Phone, MapPin, MessageCircle, Instagram, Facebook, Youtube, Loader2, Check } from "lucide-react";
import { PageIntro } from "@/components/site/PageIntro";
import { useLanguage } from "@/lib/LanguageContext";
import { useSite } from "@/lib/SiteContext";
import { submitEnquiry } from "@/lib/server-fns";
import { telHref, waHref, mailHref } from "@/lib/contact-links";

export const Route = createFileRoute("/_site/contact")({
  head: () => ({
    meta: [
      { title: "Contact Barodian — Vadodara" },
      {
        name: "description",
        content: "Share a memory, suggest a correction, or ask about featuring a Murtikar, Dhol-Tasha group or DJ service.",
      },
      { property: "og:title", content: "Contact Barodian" },
    ],
    links: [{ rel: "canonical", href: "https://barodian.com/contact" }],
  }),
  component: ContactPage,
});

const EMPTY_FORM = { name: "", email: "", phone: "", subject: "", message: "" };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function ContactPage() {
  const { t } = useLanguage();
  const { settings } = useSite();
  const send = useServerFn(submitEnquiry);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle");

  const update = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = t("contact.required");
    if (!form.email.trim()) next.email = t("contact.required");
    else if (!EMAIL_PATTERN.test(form.email.trim())) next.email = t("contact.badEmail");
    if (!form.message.trim()) next.message = t("contact.required");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setState("sending");
    try {
      await send({ data: { ...form, name: form.name.trim(), email: form.email.trim() } });
      setForm(EMPTY_FORM);
      setState("success");
    } catch {
      setState("error");
    }
  };

  const socials = [
    { href: settings?.instagram, icon: Instagram, label: "Instagram" },
    { href: settings?.facebook, icon: Facebook, label: "Facebook" },
    { href: settings?.youtube, icon: Youtube, label: "YouTube" },
  ].filter((s) => s.href);

  const details = [
    settings?.contact_email && { icon: Mail, label: t("common.email"), value: settings.contact_email, href: mailHref(settings.contact_email) },
    settings?.contact_phone && { icon: Phone, label: t("common.phone"), value: settings.contact_phone, href: telHref(settings.contact_phone) },
    settings?.whatsapp_number && {
      icon: MessageCircle,
      label: t("common.whatsapp"),
      value: settings.whatsapp_number,
      href: waHref(settings.whatsapp_number),
    },
    { icon: MapPin, label: t("common.address"), value: settings?.address || "Vadodara, Gujarat, India", href: null },
  ].filter(Boolean);

  const inputClass =
    "mt-2 w-full border border-gold/50 bg-white px-4 py-3 font-body text-sm text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none";

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <PageIntro eyebrow={t("contact.eyebrow")} title={t("contact.title")} description={t("contact.desc")} />

          <div className="mt-12 border-t border-gold/40">
            <p className="eyebrow pt-6 text-primary/60">{t("contact.reachUs")}</p>
            <ul className="mt-4 space-y-4">
              {details.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-[0.18em] text-foreground/40">{label}</p>
                    {href ? (
                      <a href={href} className="font-body text-sm text-foreground/75 transition-colors hover:text-primary">
                        {value}
                      </a>
                    ) : (
                      <p className="font-body text-sm text-foreground/75">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {socials.length > 0 && (
            <div className="mt-8 flex items-center gap-3">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center border border-gold/50 text-primary/70 transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="border border-gold/40 bg-white/60 p-6 sm:p-9">
            <h2 className="font-display text-2xl text-primary">{t("contact.formTitle")}</h2>

            {state === "success" ? (
              <div className="mt-8 flex items-start gap-3 border border-gold/50 bg-[#F8F4EC] p-5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2} />
                <p className="font-body text-sm leading-relaxed text-foreground/75">{t("contact.success")}</p>
              </div>
            ) : (
              <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="font-body text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                      {t("contact.name")}
                    </label>
                    <input id="name" name="name" value={form.name} onChange={update("name")} className={inputClass} autoComplete="name" />
                    {errors.name && <p className="mt-1.5 font-body text-xs text-destructive">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="font-body text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                      {t("contact.email")}
                    </label>
                    <input id="email" name="email" type="email" value={form.email} onChange={update("email")} className={inputClass} autoComplete="email" />
                    {errors.email && <p className="mt-1.5 font-body text-xs text-destructive">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="font-body text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                      {t("contact.phone")} <span className="normal-case tracking-normal text-foreground/30">({t("contact.optional")})</span>
                    </label>
                    <input id="phone" name="phone" value={form.phone} onChange={update("phone")} className={inputClass} autoComplete="tel" />
                  </div>
                  <div>
                    <label htmlFor="subject" className="font-body text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                      {t("contact.subject")}
                    </label>
                    <input id="subject" name="subject" value={form.subject} onChange={update("subject")} className={inputClass} />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="font-body text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                    {t("contact.message")}
                  </label>
                  <textarea id="message" name="message" rows={5} value={form.message} onChange={update("message")} className={inputClass} />
                  {errors.message && <p className="mt-1.5 font-body text-xs text-destructive">{errors.message}</p>}
                </div>

                {state === "error" && <p className="font-body text-sm text-destructive">{t("contact.failed")}</p>}

                <button type="submit" disabled={state === "sending"} className="btn-primary w-full disabled:opacity-60">
                  {state === "sending" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                      {t("contact.sending")}
                    </>
                  ) : (
                    t("contact.send")
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}