import { Link, useNavigate } from 'react-router';
import useLanguage from '../../../hooks/useLanguage';
import { useBlogPosts, deleteBlogPost } from '../../../services/blogService';
import { HiOutlinePencilAlt, HiOutlineTrash, HiPlus } from 'react-icons/hi';

const ManageBlog = () => {
  const { t, lang } = useLanguage();
  const { posts, loading } = useBlogPosts(); // Hook para leer
  const navigate = useNavigate();

  const handleDelete = (id) => {
    if (window.confirm(t('admin_delete_confirm'))) {
      deleteBlogPost(id).catch(err => console.error("Error al eliminar:", err));
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/blog/edit/${id}`);
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-CA', {
      year: 'numeric', month: '2-digit', day: '2-digit'
    });
  };

  return (
    <div className="relative min-h-screen bg-black text-white p-6 md:p-12">
      <div className="absolute inset-0 z-0 opacity-50 bg-gradient-to-b from-black via-black to-purple-900/40" />

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-orange-400">
            {t('admin_manage_blog')}
          </h1>
          <Link to="/admin" className="text-purple-400 hover:underline">
            {t('admin_back_to_dash')}
          </Link>
        </header>

        {/* Botón para crear nuevo */}
        <div className="flex justify-end mb-6">
          <Link
            to="/admin/blog/new" 
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            <HiPlus /> {t('admin_create_post')}
          </Link>
        </div>

        {/* Lista de Posts */}
        {loading && <p>{t('admin_loading')}</p>}
        {!loading && !posts.length && (
           <p className="text-gray-500">{t('admin_no_items')}</p>
        )}
        {!loading && (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="bg-white/5 p-4 rounded-lg flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {post.imageUrl && (
                    <img 
                      src={post.imageUrl} 
                      alt={post.title[lang.toUpperCase()]} 
                      className="w-16 h-16 rounded-lg object-cover hidden sm:block"
                    />
                  )}
                  <div>
                    <h3 className="font-bold">
                      {post.title ? (post.title[lang.toUpperCase()] || post.title.ES || 'Sin Título') : 'Sin Título'}
                    </h3>
                    <p className="text-sm text-gray-400">{post.author} | {formatDate(post.createdAt)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(post.id)} 
                    title={t('admin_edit_item')}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded"
                  >
                    <HiOutlinePencilAlt className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(post.id)}
                    title={t('admin_delete')}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-white/10 rounded"
                  >
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
};

export default ManageBlog;