import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { dict } from "@/lib/i18n";

const STORAGE_KEY = "barodian.lang";
const LanguageContext = createContext(null);

/**
 * Bilingual state (English default, Gujarati on demand). The server and the first
 * client render both use "en"; the stored choice is applied in an effect so the
 * markup always matches on hydration.
 */
export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState("en");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "gu" || stored === "en") setLangState(stored);
    } catch {
      /* storage unavailable — stay on English */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "gu" ? "gu" : "en";
    document.documentElement.setAttribute("data-lang", lang);
  }, [lang]);

  const setLang = useCallback((next) => {
    setLangState(next === "gu" ? "gu" : "en");
    try {
      window.localStorage.setItem(STORAGE_KEY, next === "gu" ? "gu" : "en");
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key) => {
      const entry = dict[key];
      if (!entry) return key;
      const value = lang === "gu" ? entry.gu : entry.en;
      return value || entry.en || key;
    },
    [lang]
  );

  const pick = useCallback(
    (record, field) => {
      if (!record) return "";
      const localized = record[`${field}_${lang}`];
      if (localized && String(localized).trim()) return localized;
      return record[`${field}_en`] ?? "";
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t, pick }), [lang, setLang, t, pick]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

/** Dates and years are language-neutral numerals, but month names are not. */
export function useLocale() {
  const { lang } = useLanguage();
  return lang === "gu" ? "gu-IN" : "en-GB";
}