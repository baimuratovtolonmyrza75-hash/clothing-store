"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { Language, translations } from "@/lib/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.ru) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("kg");
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem("language");
    if (saved === "kg" || saved === "ru" || saved === "en") {
      setTimeout(() => {
        setLanguage(saved);
        hasLoadedRef.current = true;
      }, 0);
      return;
    }

    hasLoadedRef.current = true;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !hasLoadedRef.current) return;
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key: keyof typeof translations.ru) => {
    return translations[language][key] || translations.ru[key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
