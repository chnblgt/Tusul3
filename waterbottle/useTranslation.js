// useTranslation.js  (place next to useTheme.js in your waterbottle/ folder)
import { useState, useEffect, useCallback } from "react";
import translations from "@/translations"; // adjust path if needed

const SUPPORTED = ["en", "mn"];
const STORAGE_KEY = "lang";

/**
 * useTranslation()
 *
 * Returns:
 *   lang        — "en" | "mn"
 *   toggleLang  — flip between the two languages
 *   setLang     — set a specific language
 *   t(section)  — get the translation object for a section
 *                 e.g.  const T = t("about");  T.missionLabel
 */
export function useTranslation() {
  const [lang, setLangState] = useState("en");

  // On mount, read saved preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.includes(saved)) {
        setLangState(saved);
        document.documentElement.setAttribute("data-lang", saved);
      }
    } catch {}
  }, []);

  const setLang = useCallback((l) => {
    if (!SUPPORTED.includes(l)) return;
    localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.setAttribute("data-lang", l);
    setLangState(l);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "en" ? "mn" : "en");
  }, [lang, setLang]);

  /**
   * t("about")  →  translations.about["en"] | translations.about["mn"]
   * t("common") →  translations.common["en"] | ...
   */
  const t = useCallback(
    (section) => {
      const sec = translations[section];
      if (!sec) {
        console.warn(`[useTranslation] Unknown section: "${section}"`);
        return {};
      }
      return sec[lang] || sec["en"] || {};
    },
    [lang]
  );

  return { lang, toggleLang, setLang, t };
}