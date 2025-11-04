import { useLanguage } from "../../context/LanguageContext";
import {
  HiOutlineBriefcase,
  HiOutlineDocumentText,
  HiOutlineMail,
  HiOutlineRss
} from "react-icons/hi";
import Footer from "../components/Footer";
import CircleMovilMenu from "../components/CircleMovilMenu";
import LNGSelector from "../components/LNGSelector";
import SEO from "../../components/SEO";

function HomePage() {
  const { t } = useLanguage();

  return (
    <>
      <SEO />
      <div className="relative min-h-screen bg-black text-white flex flex-col overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-50 bg-gradient-to-b from-black via-black to-purple-900/40" />
        <div className="relative z-10 flex flex-col flex-1">
          <LNGSelector />
          <CircleMovilMenu />
          <main className="flex-1 flex flex-col justify-center items-center text-center px-4 -mt-16 md:mt-0">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              {t("home_title")}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-md">
              {t("home_subtitle")}
            </p>

            <nav className="hidden md:flex items-center space-x-12 mt-12">
              <a href="/portfolio" className="flex items-center space-x-2 text-gray-300 hover:text-white">
                <HiOutlineBriefcase className="w-6 h-6" />
                <span>{t("portfolio")}</span>
              </a>
              <a href="/experience" className="flex items-center space-x-2 text-gray-300 hover:text-white">
                <HiOutlineDocumentText className="w-6 h-6" />
                <span>{t("experience")}</span>
              </a>
              <a href="/contact" className="flex items-center space-x-2 text-gray-300 hover:text-white">
                <HiOutlineMail className="w-6 h-6" />
                <span>{t("contact")}</span>
              </a>
              <a href="/blog" className="flex items-center space-x-2 text-gray-300 hover:text-white">
                <HiOutlineRss className="w-6 h-6" />
                <span>{t("blog")}</span>
              </a>
            </nav>
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default HomePage;