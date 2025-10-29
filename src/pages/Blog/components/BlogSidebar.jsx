import { HiOutlineHome } from 'react-icons/hi';
import { useMemo } from 'react';
import useLanguage from '../../../hooks/useLanguage';

const BlogSidebar = ({ posts, onFilterChange }) => { 
    const { t } = useLanguage();

  const { categories, years, authors } = useMemo(() => {
    
    // Convertimos los Sets a arrays
    const categorySet = new Set();
    const yearSet = new Set();
    const authorSet = new Set();

    if (Array.isArray(posts)) {
        posts.forEach(post => {
          if (Array.isArray(post.categories)) { post.categories.forEach(cat => categorySet.add(cat)); }
          if (post.createdAt) { try { const year = new Date(post.createdAt).getFullYear(); if (!isNaN(year)) { yearSet.add(year.toString()); } } catch (e) { console.error(e); } }
          if (post.author) { authorSet.add(post.author); }
        });
    }
    const sortedYears = Array.from(yearSet).sort((a, b) => b - a);

    return {
      categories: Array.from(categorySet).map(name => ({ name })), 
      years: sortedYears.map(name => ({ name })),
      authors: Array.from(authorSet).map(name => ({ name }))
    };
  }, [posts]);

  const SidebarSection = ({ title, links, filterType }) => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <ul className="space-y-1">
        {links && links.length > 0 ? links.map((link) => (
          <li key={link.name}>
            <button 
              onClick={() => onFilterChange(filterType, link.name)} // Llama a la función del padre
              className="w-full text-left text-gray-400 hover:text-white py-1.5 block border-b-2 border-gray-800/50 hover:border-orange-400/50 transition-colors duration-200"
            >
              {link.name}
            </button>
          </li>
        )) : (
          <li className="text-gray-500 text-sm">No hay {title.toLowerCase()}</li>
        )}
      </ul>
    </div>
  );

  return (
    <aside className="w-full md:w-1/4 p-6 md:p-8">
      <div className="sticky top-24">
        {/* Enlace Home (sigue siendo <a>) */}
        <a 
          href="/" 
          className="flex items-center space-x-2 text-gray-400 hover:text-white py-1.5 block border-b-2 border-gray-800/50 hover:border-orange-400/50 transition-colors duration-200 mb-8"
        >
          <HiOutlineHome className="w-5 h-5" />
          <span>{t('home')}</span>
        </a>
        
        {/* Botón para Mostrar Todos (limpiar filtro) */}
         <button 
            onClick={() => onFilterChange(null, null)} 
            className="w-full text-left text-orange-400 hover:text-orange-300 font-semibold py-1.5 block border-b-2 border-gray-800/50 hover:border-orange-400/50 transition-colors duration-200 mb-8"
          >
            {t('blog_show_all')}
          </button>

        {/* Secciones ahora pasan el 'filterType' */}
        <SidebarSection title="Categorías" links={categories} filterType="category" />
        <SidebarSection title="Años" links={years} filterType="year" />
        {authors.length > 0 && <SidebarSection title="Escrito por" links={authors} filterType="author" />} 
      </div>
    </aside>
  );
};

export default BlogSidebar;