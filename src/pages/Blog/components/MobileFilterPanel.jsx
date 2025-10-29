import { HiX } from 'react-icons/hi';
import FilterContents from './FilterContents'; 

const MobileFilterPanel = ({ posts, onFilterChange, onClose, t }) => {
  return (
    <>
      <div 
        onClick={onClose} 
        className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ease-in-out"
        aria-hidden="true"
      />

      <div 
        className="md:hidden fixed top-0 right-0 w-4/5 max-w-sm h-full bg-gray-900 shadow-xl z-50 flex flex-col transition-transform duration-300 ease-in-out translate-x-0"
      >
        
        {/* Encabezado del Panel */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <h2 className="text-2xl font-bold text-orange-400">
            {t('blog_filter_posts')}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <HiX className="w-7 h-7" />
          </button>
        </div>

        {/* Cuerpo del Panel (con scroll) */}
        <div className="flex-1 overflow-y-auto p-6">
          <FilterContents 
            posts={posts} 
            onFilterChange={onFilterChange} 
          />
        </div>
      </div>
    </>
  );
};

export default MobileFilterPanel;