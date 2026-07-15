"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_LANG, getDict, type Dict, type Lang } from "@/lib/i18n";
import { localize as localizeValue, type Localized } from "@/lib/products";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  t: Dict;
  lx: (value: Localized) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("pd_lang") as Lang | null) : null;
    if (stored === "sq" || stored === "en") setLangState(stored);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("pd_lang", next);
      document.documentElement.lang = next;
    }
  }, []);

  const toggle = useCallback(() => {
    setLang(lang === "sq" ? "en" : "sq");
  }, [lang, setLang]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      toggle,
      t: getDict(lang),
      lx: (v: Localized) => localizeValue(v, lang),
    }),
    [lang, setLang, toggle],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
