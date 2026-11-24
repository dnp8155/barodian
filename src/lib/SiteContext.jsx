import { createContext, useContext } from "react";

/**
 * Site-wide settings and homepage copy, loaded once by the public layout route
 * and shared with the header, footer and homepage sections.
 */
const SiteContext = createContext({ settings: null, homepage: null });

export function SiteProvider({ value, children }) {
  return <SiteContext.Provider value={value ?? { settings: null, homepage: null }}>{children}</SiteContext.Provider>;
}

export function useSite() {
  return useContext(SiteContext);
}