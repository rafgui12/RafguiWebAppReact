import { HiOutlineHome } from 'react-icons/hi';
import { useMemo } from 'react';
import useLanguage from '../../../hooks/useLanguage'; // Asegúrate que la ruta sea correcta

const FilterContents = ({ posts, onFilterChange }) => {
  const { t } = useLanguage();

  // --- 1. Lógica de 'useMemo' movida aquí ---
  const { categories, years, authors } = useMemo(() => {
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

  // --- 2. Componente 'SidebarSection' movido aquí (con i18n) ---
  const SidebarSection = ({ links, filterType }) => {
    
    // Genera el título y el placeholder basado en el filterType
    let title;
    let placeholder;
    if (filterType === 'category') {
      title = t('blog_categories');
      placeholder = t('blog_no_categories');
    } else if (filterType === 'year') {
      title = t('blog_years');
      placeholder = t('blog_no_years');
    } else if (filterType === 'author') {
      title = t('blog_written_by');
      placeholder = t('blog_no_authors');
    }

    return (
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
        <ul className="space-y-1">
          {links && links.length > 0 ? links.map((link) => (
            <li key={link.name}>
              <button 
                onClick={() => onFilterChange(filterType, link.name)}
                className="w-full text-left text-gray-400 hover:text-white py-1.5 block border-b-2 border-gray-800/50 hover:border-orange-400/50 transition-colors duration-200"
              >
                {link.name}
              </button>
            </li>
          )) : (
            <li className="text-gray-500 text-sm">{placeholder}</li>
          )}
        </ul>
      </div>
    );
  }

  // --- 3. El JSX de los filtros movido aquí ---
  return (
    <>
      <a 
        href="/" 
        className="flex items-center space-x-2 text-gray-400 hover:text-white py-1.5 block border-b-2 border-gray-800/50 hover:border-orange-400/50 transition-colors duration-200 mb-8"
      >
        <HiOutlineHome className="w-5 h-5" />
        <span>{t('home')}</span>
      </a>
      
      <button 
        onClick={() => onFilterChange(null, null)} 
        className="w-full text-left text-orange-400 hover:text-orange-300 font-semibold py-1.5 block border-b-2 border-gray-800/50 hover:border-orange-400/50 transition-colors duration-200 mb-8"
      >
        {t('blog_show_all')}
      </button>

      <SidebarSection links={categories} filterType="category" />
      <SidebarSection links={years} filterType="year" />
      {authors.length > 0 && <SidebarSection links={authors} filterType="author" />}
    </>
  );
};

export default FilterContents;