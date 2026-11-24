import { useLanguage } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";

export function LanguageSwitch({ className, tone = "dark" }) {
  const { lang, setLang } = useLanguage();
  const base = "font-body text-[11px] uppercase tracking-[0.16em] transition-colors duration-300";
  const active = tone === "light" ? "text-[#F8F4EC]" : "text-primary";
  const idle = tone === "light" ? "text-[#F8F4EC]/50 hover:text-[#F8F4EC]" : "text-foreground/45 hover:text-primary";

  return (
    <div className={cn("flex items-center gap-2", className)} role="group" aria-label="Language">
      <button type="button" onClick={() => setLang("en")} aria-pressed={lang === "en"} className={cn(base, lang === "en" ? active : idle)}>
        EN
      </button>
      <span aria-hidden="true" className={tone === "light" ? "text-[#F8F4EC]/25" : "text-gold/60"}>
        |
      </span>
      <button type="button" onClick={() => setLang("gu")} aria-pressed={lang === "gu"} className={cn(base, "normal-case", lang === "gu" ? active : idle)}>
        ગુજરાતી
      </button>
    </div>
  );
}