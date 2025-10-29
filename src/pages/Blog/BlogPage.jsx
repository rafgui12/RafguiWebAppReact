import { useState, useMemo } from 'react'; 
import Footer from '../components/Footer';
import useLanguage from '../../hooks/useLanguage';
import { HiOutlineFilter, HiOutlineHome, HiXCircle } from 'react-icons/hi'; 
import CircleMovilMenu from '../components/CircleMovilMenu';
import { useBlogPosts } from '../../services/blogService';
import BlogSidebar from './components/BlogSidebar';
import MobileFilterPanel from './components/MobileFilterPanel';
import { Link } from 'react-router';

// --- COMPONENTE PRINCIPAL ---
function BlogPage() {
  const { lang, t } = useLanguage();
  const { posts, loading } = useBlogPosts();

  const [activeFilter, setActiveFilter] = useState({ type: null, value: null });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const handleFilterChange = (type, value) => {
    setActiveFilter({ type, value });
  };

  const handleMobileFilterChange = (type, value) => {
    handleFilterChange(type, value); // Aplica el filtro
    setIsMobileFilterOpen(false);      // Cierra el panel
  };

  const filteredPosts = useMemo(() => {
    
    let processedPosts;
    if (!activeFilter.type || !activeFilter.value) {
      processedPosts = posts;
    } else {
      processedPosts = posts.filter(post => {
        switch (activeFilter.type) {
          case 'category':
            return Array.isArray(post.categories) && post.categories.includes(activeFilter.value);
          case 'year':
            try {
              const postYear = new Date(post.createdAt).getFullYear().toString();
              return postYear === activeFilter.value;
            } catch (e) {
              console.error("Error parsing date for filtering:", e);
              return false; 
            }
          case 'author':
            return post.author === activeFilter.value;
          default:
            return true; 
        }
      });
    }

    return [...processedPosts].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  }, [posts, activeFilter]); 

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      return new Date(isoString).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-CA', {
        year: 'numeric', month: '2-digit', day: '2-digit'
      });
    } catch (e) { 
      console.error("Error formatting date:", e);
      return isoString; 
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-black text-white flex flex-col overflow-hidden">
        {/* Fondo */}
        <div className="absolute inset-0 z-0 opacity-50 bg-gradient-to-b from-black via-black to-purple-900/40" />
        
        <div className="relative z-10 flex flex-col flex-1">
          {/* Menú Móvil */}
          <CircleMovilMenu /> 

          {/* --- Layout Principal (Esqueleto) --- */}
          <main className="flex flex-col md:flex-row max-w-7xl mx-auto w-full mt-16 md:mt-24 animate-pulse">
            
            {/* Esqueleto del Sidebar */}
            <aside className="hidden md:block w-1/4 p-6 md:p-8">
              <div className="sticky top-24 space-y-8">
                <div className="h-6 bg-gray-700 rounded-md w-1/2"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-700 rounded-md w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded-md w-2/3"></div>
                  <div className="h-4 bg-gray-700 rounded-md w-3/4"></div>
                </div>
                <div className="h-6 bg-gray-700 rounded-md w-1/2"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-700 rounded-md w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded-md w-2/3"></div>
                </div>
              </div>
            </aside>

            {/* Esqueleto del Contenido Principal (Posts) */}
            <div className="w-full md:w-3/4 p-6 md:p-8 space-y-12">
              {/* Esqueleto de Card (repetido) */}
              {[1, 2].map((n) => (
                <article key={n} className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden p-6 md:p-8">
                  {/* Título */}
                  <div className="h-10 bg-gray-700 rounded-md w-3/4 mb-4"></div>
                  {/* Descripción corta */}
                  <div className="h-5 bg-gray-700 rounded-md w-full mb-6"></div>
                  {/* Metadata */}
                  <div className="h-4 bg-gray-700 rounded-md w-1/2 mb-8"></div>
                  {/* Imagen */}
                  <div className="rounded-xl w-full h-80 bg-gray-700"></div>
                </article>
              ))}
            </div>

          </main>
          
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* ... (Fondo) ... */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Menú Móvil */}
        <CircleMovilMenu /> 

        {/* --- Layout Principal --- */}
        <div className="flex flex-col md:flex-row max-w-7xl mx-auto w-full mt-16 md:mt-24">
          <div className="hidden md:block max-h">
            <BlogSidebar posts={posts} onFilterChange={handleFilterChange} /> 
          </div>

          {/* Contenido Principal */}
          <main className="w-full md:w-3/4 p-6 md:p-8 space-y-12 max-h-[calc(100vh-6rem)] overflow-y-auto">
            
            {/* --- Mostrar Filtro Activo y Botón de Limpiar --- */}
            {activeFilter.type && activeFilter.value && (
              <div className="mb-8 flex items-center justify-between p-4 bg-white/10 rounded-lg">
                <p className="text-gray-300">
                  {t('blog_filtering_by')} {activeFilter.type}: <span className="font-semibold text-orange-400">{activeFilter.value}</span>
                </p>
                <button 
                  onClick={() => handleFilterChange(null, null)} 
                  className="flex items-center space-x-1 text-red-400 hover:text-red-300 transition-colors"
                  title={t('blog_clear_filter')}
                >
                  <HiXCircle className="w-5 h-5" />
                  <span>{t('blog_clear')}</span>
                </button>
              </div>
            )}
            
            {/* --- Mapa AHORA usa 'filteredPosts' --- */}
            {filteredPosts.map((post) => ( 
                <Link key={post.id} to={`/blog/${post.id}`} className="block group">
                    <article key={post.id} className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
                        {/* Contenido del post */}
                        <div className="p-6 md:p-8">
                          <h1 className="text-3xl md:text-5xl font-bold text-orange-500 mb-4">
                            {post.title[lang.toUpperCase()]}
                          </h1>
                          <p className="text-lg text-gray-300 mb-6">
                            {post.shortDescription[lang.toUpperCase()]}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                            <span>{formatDate(post.createdAt)}</span>
                            {post.categories && post.categories.length > 0 && (
                              <span>| {post.categories.join(', ')}</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Imagen del Post */}
                        {post.imageUrl && (
                          <div className="bg-blue-900/20 p-4 md:p-8 md:pt-0">
                            <img
                              src={post.imageUrl}
                              alt={post.title[lang.toUpperCase()]}
                              className="rounded-xl w-full"
                            />
                          </div>
                        )}
                      </article>
                </Link>
            ))}
            
            {/* --- Mensaje si NO hay posts DESPUÉS de filtrar --- */}
            {filteredPosts.length === 0 && !loading && (
              <div className="text-center text-gray-400 py-10">
                <p>
                  {activeFilter.type 
                    ? `${t('blog_no_posts_filter_prefix')} "${activeFilter.value}".`
                    : t('blog_no_posts_available')}
                </p>
                {/* Botón para limpiar filtro si no hay resultados */}
                {activeFilter.type && (
                   <button 
                      onClick={() => handleFilterChange(null, null)}
                      className="mt-4 text-orange-400 underline hover:text-orange-300"
                    >
                      Mostrar todos los posts
                    </button>
                )}
              </div>
            )}

          </main>
        </div>

        {/* Filtro Flotante */}
        <button 
          onClick={() => setIsMobileFilterOpen(true)} 
          className="md:hidden fixed bottom-6 right-6 p-4 bg-gray-800/90 backdrop-blur-lg border border-white/20 rounded-full shadow-xl z-30" // Añadido z-30
        >
          <HiOutlineFilter className="w-7 h-7 text-orange-500" />
        </button>

        {isMobileFilterOpen && (
          <MobileFilterPanel
            posts={posts}
            onFilterChange={handleMobileFilterChange} // Pasa el handler que también cierra
            onClose={() => setIsMobileFilterOpen(false)}
            t={t} // Pasa la función de traducción
          />
        )}
        
        <Footer />
      </div>
    </div>
  );
}

export default BlogPage;