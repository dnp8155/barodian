import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Trash2, Mail, Phone, Check } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const Route = createFileRoute("/_authed/admin/enquiries")({ component: EnquiriesAdmin });

const formatDate = (value) => {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });
  } catch {
    return value;
  }
};

function EnquiriesAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const result = await base44.entities.Enquiry.list({ sort: "-created_date", limit: 300 });
      setItems(Array.isArray(result) ? result : (result.items ?? []));
    } catch {
      toast.error("Could not load enquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleStatus = async (item) => {
    try {
      await base44.entities.Enquiry.update(item.id, { status: item.status === "new" ? "handled" : "new" });
      await load();
    } catch {
      toast.error("Could not update this enquiry.");
    }
  };

  const remove = async (item) => {
    if (!window.confirm("Delete this enquiry?")) return;
    try {
      await base44.entities.Enquiry.delete(item.id);
      toast.success("Enquiry deleted.");
      await load();
    } catch {
      toast.error("Could not delete this enquiry.");
    }
  };

  return (
    <div>
      <AdminHeader
        title="Contact Enquiries"
        description="Messages sent through the public contact form. Only signed-in admins can read them."
      />

      {loading ? (
        <p className="mt-10 font-body text-sm text-foreground/40">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-10 font-body text-sm text-foreground/50">No enquiries yet.</p>
      ) : (
        <div className="mt-8 divide-y divide-gold/30 border-y border-gold/30">
          {items.map((item) => (
            <div key={item.id} className="py-4">
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" onClick={() => setOpenId(openId === item.id ? null : item.id)} className="min-w-0 flex-1 text-left">
                  <p className="truncate font-display text-[15px] text-primary">{item.subject || "No subject"}</p>
                  <p className="truncate font-body text-[11px] uppercase tracking-[0.12em] text-foreground/40">
                    {item.name} · {formatDate(item.created_date)}
                  </p>
                </button>
                <span
                  className={`shrink-0 px-2 py-1 font-body text-[9px] uppercase tracking-[0.16em] ${
                    item.status === "new" ? "bg-[#D88A32]/15 text-[#8C5A1C]" : "bg-primary/10 text-primary"
                  }`}
                >
                  {item.status === "new" ? "New" : "Handled"}
                </span>
                <button
                  type="button"
                  onClick={() => toggleStatus(item)}
                  aria-label="Toggle status"
                  className="flex h-9 w-9 items-center justify-center text-primary/60 hover:text-primary"
                >
                  <Check className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <button type="button" onClick={() => remove(item)} aria-label="Delete" className="flex h-9 w-9 items-center justify-center text-foreground/35 hover:text-destructive">
                  <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>

              {openId === item.id && (
                <div className="mt-4 border-l-2 border-gold/50 pl-4">
                  <p className="whitespace-pre-wrap font-body text-[13.5px] leading-[1.8] text-foreground/70">{item.message}</p>
                  <div className="mt-4 flex flex-wrap gap-5 font-body text-[12px] text-foreground/55">
                    <a href={`mailto:${item.email}`} className="inline-flex items-center gap-1.5 hover:text-primary">
                      <Mail className="h-3.5 w-3.5" strokeWidth={1.5} />
                      {item.email}
                    </a>
                    {item.phone && (
                      <a href={`tel:${item.phone}`} className="inline-flex items-center gap-1.5 hover:text-primary">
                        <Phone className="h-3.5 w-3.5" strokeWidth={1.5} />
                        {item.phone}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}