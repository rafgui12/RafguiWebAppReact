import Footer from "../components/Footer";
import useLanguage from "../../hooks/useLanguage";
import { useProjects } from "../../services/projectService";
import HeaderBack from "../components/HeaderBack";

function PortfolioPage() {
  const { lang, t } = useLanguage();
  const { projects, loading } = useProjects();

  if (loading) {
    return (
      <div className="relative min-h-screen bg-black text-white flex justify-center items-center">
        <h1 className="text-3xl">Loading projects...</h1>
      </div>
    );
  }

  return (
    <>
      <div className="relative min-h-screen bg-black text-white flex flex-col overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-50 bg-gradient-to-b from-black via-black to-purple-900/40" />

        {/* Contenido principal (con z-index) */}
        <div className="relative z-10 flex flex-col flex-1">
          
          {/* --- INICIO: HEADER MÓVIL --- */}
          <HeaderBack />

          {/* Encabezado (tu código existente) */}
          <div className="text-center mb-12 z-10 mt-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("portfolio_title")}
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t("portfolio_description")}
            </p>
          </div>

          {/* Grid de proyectos (tu código existente) */}
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 z-10">
            {projects
              .filter((p) => p.visible)
              .map((project) => (
                <div
                  key={project.id}
                  className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 flex flex-col justify-between shadow-lg 
                  hover:shadow-purple-500/40 hover:-translate-y-1 transition-transform duration-300"
                >
                  {/* (Imagen) */}
                  <div className="flex justify-center mb-6">
                    <img
                      src={project.ImageHolder}
                      alt={project.Name[lang.toUpperCase()]}
                      className="w-32 h-32 object-contain rounded-lg"
                    />
                  </div>
                  {/* (Contenido) */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-3 text-center">
                      {project.Name[lang.toUpperCase()]}
                    </h3>
                    <p className="text-sm text-gray-300 text-justify mb-4">
                      {project.ShortDescription[lang.toUpperCase()]}
                    </p>
                  </div>
                  {/* (Footer de la tarjeta) */}
                  <div className="mt-auto text-center">
                    <p className="text-sm text-gray-400 font-semibold">
                      {t("tools_label")}
                    </p>
                    <p className="text-sm text-gray-300 mb-2">
                      {project.Tools.join(", ")}
                    </p>
                    <span className="text-xs text-gray-500">{project.year}</span>
                    <div className="mt-3">
                      <a
                        href={project.URLApp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 text-sm underline hover:text-purple-300 transition"
                      >
                        View Project
                      </a>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default PortfolioPage;