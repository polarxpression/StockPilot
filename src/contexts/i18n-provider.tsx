
"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import en from "@/locales/en.json";
import pt from "@/locales/pt.json";

type Locale = "en" | "pt";

const translations = { en, pt };

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

function getInitialLocale(): Locale {
  if (typeof window === "undefined") {
    return "en";
  }
  const savedLocale = window.localStorage.getItem("locale");
  return savedLocale === '"pt"' ? "pt" : "en";
}


export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedLocale = localStorage.getItem("locale");
    if (savedLocale) {
      const parsedLocale = JSON.parse(savedLocale) as Locale;
      if (parsedLocale !== locale) {
        setLocaleState(parsedLocale);
      }
    }
  }, [locale]);
  
  const setLocale = (newLocale: Locale) => {
      setLocaleState(newLocale);
      localStorage.setItem("locale", JSON.stringify(newLocale));
  };

  const t = useCallback(
    (key: string) => {
      const currentLocale = isMounted ? locale : 'en';
      const keys = key.split(".");
      let result: any = translations[currentLocale];
      for (const k of keys) {
        result = result?.[k];
        if (result === undefined) {
          // Fallback to English if translation is not found
          let fallbackResult: any = translations.en;
          for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
          }
          return fallbackResult || key;
        }
      }
      return result || key;
    },
    [locale, isMounted]
  );
  
  if (!isMounted) {
      return null;
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
