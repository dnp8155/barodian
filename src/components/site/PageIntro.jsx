export function PageIntro({ eyebrow, title, description, align = "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && (
        <div className={align === "center" ? "flex items-center justify-center gap-4" : "flex items-center gap-4"}>
          <span className="h-px w-10 bg-gold" aria-hidden="true" />
          <span className="eyebrow text-primary/70">{eyebrow}</span>
        </div>
      )}
      <h1 className="mt-5 font-display text-[2.1rem] leading-[1.1] tracking-[-0.01em] text-primary sm:text-5xl lg:text-[3.4rem]">
        {title}
      </h1>
      {description && (
        <p className="mt-6 max-w-2xl font-body text-[15px] leading-[1.85] text-foreground/65 sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}