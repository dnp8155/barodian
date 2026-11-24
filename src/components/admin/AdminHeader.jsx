export function AdminHeader({ title, description, action }) {
  return (
    <div className="flex flex-col gap-4 border-b border-gold/40 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl leading-tight text-primary sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-xl font-body text-[13px] leading-relaxed text-foreground/55">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function AdminButton({ children, onClick, type = "button", variant = "primary", disabled = false, className = "" }) {
  const base =
    "inline-flex min-h-[42px] items-center justify-center gap-2 px-4 font-body text-[10px] uppercase tracking-[0.18em] transition-colors disabled:opacity-50";
  const styles = {
    primary: "bg-[#702D38] text-[#F8F4EC] hover:bg-[#4A2029]",
    outline: "border border-[#702D38]/30 text-[#702D38] hover:border-[#702D38]",
    ghost: "text-foreground/50 hover:text-destructive",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}