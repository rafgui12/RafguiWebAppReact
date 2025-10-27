import { useLanguage } from "../../context/LanguageContext";

function LNGSelector() {
  const { lang, changeLang } = useLanguage();

  return (
    <div className="absolute top-6 right-6 z-50">
      <button
        onClick={() => changeLang(lang === "es" ? "en" : "es")}
        className="bg-white text-black px-3 py-1 rounded-md text-sm font-semibold hover:bg-gray-200 transition"
      >
        {lang === "es" ? "EN" : "ES"}
      </button>
    </div>
  );
}

export default LNGSelector;
