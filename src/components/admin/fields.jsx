export const inputClass =
  "mt-2 w-full border border-gold/50 bg-white px-3 py-2.5 font-body text-sm text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none disabled:opacity-60";

export function FormField({ label, children, className = "" }) {
  return (
    <div className={className}>
      <span className="font-body text-[10px] uppercase tracking-[0.16em] text-foreground/50">{label}</span>
      {children}
    </div>
  );
}

export function TextField({ label, value, onChange, type = "text", placeholder, className = "" }) {
  return (
    <FormField label={label} className={className}>
      <input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputClass} />
    </FormField>
  );
}

export function TextAreaField({ label, value, onChange, rows = 4, className = "" }) {
  return (
    <FormField label={label} className={className}>
      <textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} rows={rows} className={inputClass} />
    </FormField>
  );
}

export function BilingualField({ label, en, gu, onEn, onGu, multiline = false, rows = 3 }) {
  return (
    <div>
      <span className="font-body text-[10px] uppercase tracking-[0.16em] text-foreground/50">{label}</span>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        {multiline ? (
          <>
            <textarea value={en ?? ""} onChange={(e) => onEn(e.target.value)} rows={rows} placeholder="English" className={`${inputClass} mt-0`} />
            <textarea value={gu ?? ""} onChange={(e) => onGu(e.target.value)} rows={rows} placeholder="ગુજરાતી" className={`${inputClass} mt-0`} />
          </>
        ) : (
          <>
            <input value={en ?? ""} onChange={(e) => onEn(e.target.value)} placeholder="English" className={`${inputClass} mt-0`} />
            <input value={gu ?? ""} onChange={(e) => onGu(e.target.value)} placeholder="ગુજરાતી" className={`${inputClass} mt-0`} />
          </>
        )}
      </div>
    </div>
  );
}

export function ToggleField({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <span
        role="switch"
        aria-checked={!!checked}
        tabIndex={0}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onChange(!checked);
          }
        }}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${checked ? "bg-primary" : "bg-foreground/20"}`}
      >
        <span className={`absolute h-4 w-4 rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
      </span>
      <span className="font-body text-[11px] uppercase tracking-[0.16em] text-foreground/60">{label}</span>
    </label>
  );
}