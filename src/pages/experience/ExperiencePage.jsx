import { useState } from 'react';
import Footer from '../components/Footer'; 
import useLanguage from '../../hooks/useLanguage'; 
import { HiOutlineBriefcase, HiOutlineAcademicCap } from 'react-icons/hi';
import { useWorkExperience, useEducation } from '../../services/experienceService';
import HeaderBack from '../components/HeaderBack';
import SEO from '../../components/SEO';


const renderDescription = (text) => {
  if (!text) return null;
  return text.split('\n')
    .map(line => line.trim().replace(/^\+\s*/, ''))
    .filter(line => line.length > 0) 
    .map((point, index) => <li key={index}>{point}</li>);
};


function ExperiencePage() {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('work');

  const { items: workItems, loading: workLoading } = useWorkExperience();
  const { items: educationItems, loading: educationLoading } = useEducation();

  const loading = workLoading || educationLoading;
  
  const itemsToShow = (activeTab === 'work' ? workItems : educationItems)
    .filter(item => item.visible);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-black text-white flex justify-center items-center">
        <h1 className="text-3xl">Loading...</h1>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={"Portfolio | " + t("experience_title")}
    />
      <div className="relative min-h-screen bg-black text-white flex flex-col overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-50 bg-gradient-to-b from-black via-black to-purple-900/40" />
        
        {/* Contenido principal (con z-index) */}
        <div className="relative z-10 flex flex-col flex-1">

          {/* Header con botón de Volver (solo en móvil) */}
          <HeaderBack />

          {/* Encabezado de la página */}
          <div className="text-center pt-12 pb-8 px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-8">
              {t("experience_title") || "Experiencia"}
            </h1>

            {/* Botones de Pestañas (Tabs) */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setActiveTab('work')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300
                  ${activeTab === 'work' 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
              >
                <HiOutlineBriefcase className="w-5 h-5" />
                <span>{t('work_text') || 'Laboral'}</span>
              </button>
              <button
                onClick={() => setActiveTab('education')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300
                  ${activeTab === 'education' 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
              >
                <HiOutlineAcademicCap className="w-5 h-5" />
                <span>{t('education_text') || 'Educación'}</span>
              </button>
            </div>
          </div>

          {/* Contenido - Línea de Tiempo Vertical */}
          <main className="flex-1 p-4 md:p-8">
            <div className="px-4 max-w-3xl mx-auto">
              <div className="relative pl-8 border-l-2 border-gray-700/50">
                
                {itemsToShow.map((item) => (
                  <div key={item.id} className="mb-10">
                    {/* Punto en la línea de tiempo */}
                    <div className="absolute w-5 h-5 bg-purple-500 rounded-full mt-1.5 -left-[11px] border-4 border-black ring-4 ring-purple-500/50" />

                    {/* Tarjeta de Contenido (Estilo Glassmorphism) */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
                      {/* Encabezado de la tarjeta */}
                      <div className="flex flex-col md:flex-row justify-between md:items-center mb-2">
                        <h3 className="text-2xl font-bold text-white">
                          {/* 4. Leemos el título según el idioma */}
                          {item.title[lang.toUpperCase()]}
                        </h3>
                        <span className="text-sm font-medium text-purple-300 mt-1 md:mt-0">
                          {/* 5. Mostramos las fechas */}
                          {item.dates.start} - {item.dates.end}
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-gray-300 mb-4">
                        {/* 6. Mostramos compañía o institución */}
                        {item.company || item.institution}
                      </p>

                      {/* 7. Renderizado condicional de la descripción */}
                      {item.description && item.description[lang.toUpperCase()] && (
                        <ul className="list-disc pl-5 space-y-2 text-gray-300 text-sm">
                          {renderDescription(item.description[lang.toUpperCase()])}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
                
              </div>
            </div>
          </main>
          
          <Footer />
        </div>
      </div>
    </>
  );
}

export default ExperiencePage;