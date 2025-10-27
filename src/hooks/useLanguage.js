import { useState } from "react";
import translations from "../i18n";

export default function useLanguage() {
  const [lang, setLang] = useState(
    localStorage.getItem("lang") || "en"
  );

  const t = (key) => translations[lang][key] || key;

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  return { t, lang, changeLang };
}