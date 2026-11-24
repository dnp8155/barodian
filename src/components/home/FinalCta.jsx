import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";

export function FinalCta({ content }) {
  const { t, pick } = useLanguage();

  return (
    <section className="relative isolate overflow-hidden bg-[#4A2029]">
      <div className="mandana absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative mx-auto max-w-3xl px-5 py-20 text-center sm:px-8 lg:py-28">
        <span className="mx-auto block h-px w-10 bg-[#D88A32]" aria-hidden="true" />
        <h2 className="mt-8 font-display text-[1.9rem] leading-[1.15] text-[#F8F4EC] sm:text-4xl lg:text-[3rem]">
          {pick(content, "final_title") || t("final.title")}
        </h2>
        <p className="mx-auto mt-6 max-w-xl font-body text-[15px] leading-[1.85] text-[#F1E7DA]/70">
          {pick(content, "final_description") || t("final.desc")}
        </p>
        <Link to="/gallery" className="btn-ivory mt-10">
          {pick(content, "final_cta") || t("final.cta")}
        </Link>
      </div>
    </section>
  );
}