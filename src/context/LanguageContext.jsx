import { createContext, useContext, useState, useEffect } from "react";
import translations from "../i18n";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");

  // Detecta idioma del navegador en la primera carga
  useEffect(() => {
    if (!localStorage.getItem("lang")) {
      const browserLang = navigator.language.startsWith("es") ? "es" : "en";
      setLang(browserLang);
      localStorage.setItem("lang", browserLang);
    }
  }, []);

  const t = (key) => translations[lang][key] || key;

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
