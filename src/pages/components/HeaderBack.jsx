import { useNavigate } from "react-router";
import { HiArrowLeft } from "react-icons/hi";
import useLanguage from "../../hooks/useLanguage";

function HeaderBack() {
    const { t } = useLanguage();
    const navigate = useNavigate();

  return (
    <header className="p-4 md:hidden z-20">
        <button
            onClick={() => navigate(-1)} // <-- 3. NAVEGA HACIA ATRÁS
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
        >
            <HiArrowLeft className="w-6 h-6" />
            {/* Te recomiendo añadir 'back' a tus archivos de traducción */}
            <span>{t('back_text')}</span> 
        </button>
    </header>
  );
}

export default HeaderBack;