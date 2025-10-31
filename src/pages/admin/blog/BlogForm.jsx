import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import useLanguage from '../../../hooks/useLanguage';
import { 
  getBlogPostById, 
  createBlogPost, 
  updateBlogPost,
  deleteCommentFromPost, // <-- Servicio para borrar comentarios
  setMyOpinionForPost   // <-- Servicio para tu opinión
} from '../../../services/blogService';
import { HiOutlinePhotograph, HiOutlineTrash } from 'react-icons/hi';

// --- Constantes de Cloudinary ---
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
// ¡NECESITAMOS UN NUEVO PRESET PARA EL BLOG!
const CLOUDINARY_BLOG_PRESET = import.meta.env.VITE_CLOUDINARY_BLOG_PRESET;

const BlogForm = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams(); // El ID del post (si estamos editando)
  const isNew = !id;

  const [formData, setFormData] = useState({
    title: { ES: '', EN: '' },
    shortDescription: { ES: '', EN: '' },
    content: { ES: '', EN: '' },
    myOpinion: { ES: '', EN: '' },
    categories: '', // Se maneja como string
    author: '',
    imageUrl: '',
    commentsEnabled: true,
  });
  
  const [postImageFile, setPostImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [comments, setComments] = useState([]); // Lista de comentarios de visitantes
  const [loading, setLoading] = useState(false);

  // Carga los datos del post si estamos editando
  useEffect(() => {
    if (!isNew) {
      setLoading(true);
      getBlogPostById(id).then(post => {
        if (post) {
          // Formatea los datos para el formulario
          const postData = {
            ...post,
            title: post.title || { ES: '', EN: '' },
            shortDescription: post.shortDescription || { ES: '', EN: '' },
            content: post.content || { ES: '', EN: '' },
            myOpinion: post.myOpinion ? post.myOpinion.content : { ES: '', EN: '' },
            categories: post.categories ? post.categories.join(', ') : '',
            commentsEnabled: post.commentsEnabled === undefined ? true : post.commentsEnabled,
          };
          setFormData(postData);
          setPreviewUrl(post.imageUrl || '');
          
          // Convierte el objeto de comentarios en un array
          if (post.comments) {
            const commentsArray = Object.keys(post.comments).map(key => ({
              id: key,
              ...post.comments[key]
            }));
            setComments(commentsArray);
          }
        }
        setLoading(false);
      });
    }
  }, [id, isNew]);

  // --- Handlers del Formulario ---

  const handleI18nChange = (e) => {
    const { name, value } = e.target;
    const [fieldName, lang] = name.split('.'); // ej. "title.ES"
    setFormData(prev => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], [lang]: value }
    }));
  };
  
  const handleSimpleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostImageFile(file); 
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let finalData = { ...formData };

    try {
      // 1. Sube la imagen si hay una nueva
      if (postImageFile) {
        const cloudFormData = new FormData();
        cloudFormData.append('file', postImageFile);
        cloudFormData.append('upload_preset', CLOUDINARY_BLOG_PRESET); 
        
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: cloudFormData }
        );
        const data = await response.json();
        if (data.secure_url) {
          finalData.imageUrl = data.secure_url;
        }
      }
      
      // 2. Separa 'myOpinion' del resto
      const { myOpinion, ...postData } = finalData;
      
      // 3. Guarda el Post Principal
      let postId = id;
      if (isNew) {
        const newPostRef = await createBlogPost(postData);
        postId = newPostRef.key; // Obtiene el ID del nuevo post
      } else {
        await updateBlogPost(id, postData);
      }
      
      // 4. Guarda "My Opinion" usando el ID
      if (postId) {
        await setMyOpinionForPost(postId, { content: myOpinion });
      }
      
      navigate('/admin/blog');

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // --- Handler para Borrar Comentarios ---
  const handleDeleteComment = (commentId) => {
    if (window.confirm(t('admin_post_delete_comment'))) {
      deleteCommentFromPost(id, commentId)
        .then(() => {
          // Actualiza la lista de comentarios en el estado local
          setComments(prev => prev.filter(c => c.id !== commentId));
        })
        .catch(err => console.error("Error al borrar comentario:", err));
    }
  };


  if (loading && !isNew) {
    return <div className="min-h-screen bg-black text-white p-12">{t('admin_loading')}</div>;
  }

  return (
    <div className="relative min-h-screen bg-black text-white p-6 md:p-12">
      <div className="absolute inset-0 z-0 opacity-50 bg-gradient-to-b from-black via-black to-purple-900/40" />
      <div className="relative z-10 w-full max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-orange-400">
            {isNew ? t('admin_create_post') : t('admin_edit_post')}
          </h1>
          <Link to="/admin/blog" className="text-purple-400 hover:underline">
            {t('admin_cancel')}
          </Link>
        </header>

        {/* --- EL FORMULARIO --- */}
        <form onSubmit={handleSubmit} className="bg-white/10 p-6 rounded-lg space-y-6">
          
          {/* Título (ES y EN) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2">{t('admin_post_title')} (ES)</label>
              <input type="text" name="title.ES" value={formData.title.ES} onChange={handleI18nChange} className="w-full p-3 bg-white/10 rounded-lg border border-gray-700" required />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">{t('admin_post_title')} (EN)</label>
              <input type="text" name="title.EN" value={formData.title.EN} onChange={handleI18nChange} className="w-full p-3 bg-white/10 rounded-lg border border-gray-700" />
            </div>
          </div>
          
          {/* Autor y Categorías */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2">{t('admin_post_author')}</label>
              <input type="text" name="author" value={formData.author} onChange={handleSimpleChange} className="w-full p-3 bg-white/10 rounded-lg border border-gray-700" />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">{t('admin_post_categories')}</label>
              <input type="text" name="categories" value={formData.categories} onChange={handleSimpleChange} placeholder={t('admin_post_categories_placeholder')} className="w-full p-3 bg-white/10 rounded-lg border border-gray-700" />
            </div>
          </div>

          {/* Cargador de Imagen */}
          <div>
            <label className="block text-gray-400 mb-2">{t('admin_post_image')}</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-lg bg-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {previewUrl ? <img src={previewUrl} alt="Vista previa" className="w-full h-full object-cover" /> : <HiOutlinePhotograph className="w-12 h-12 text-gray-500" />}
              </div>
              <label htmlFor="photoUpload" className="cursor-pointer w-full text-center p-3 bg-white/10 rounded-lg border border-dashed border-gray-600 hover:border-gray-400">
                <span className="text-purple-400">{t('admin_project_change_photo')}</span>
                {postImageFile && <span className="block text-xs text-gray-400 mt-1">{postImageFile.name}</span>}
              </label>
              <input type="file" id="photoUpload" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
          </div>

          {/* Descripción Corta (ES y EN) */}
          <div>
            <label className="block text-gray-400 mb-2">{t('admin_post_short_desc')} (ES)</label>
            <textarea name="shortDescription.ES" value={formData.shortDescription.ES} onChange={handleI18nChange} rows="3" className="w-full p-3 bg-white/10 rounded-lg border border-gray-700" />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">{t('admin_post_short_desc')} (EN)</label>
            <textarea name="shortDescription.EN" value={formData.shortDescription.EN} onChange={handleI18nChange} rows="3" className="w-full p-3 bg-white/10 rounded-lg border border-gray-700" />
          </div>

          {/* Contenido Principal (ES y EN) */}
          <div>
            <label className="block text-gray-400 mb-2">{t('admin_post_content')} (ES)</label>
            <textarea name="content.ES" value={formData.content.ES} onChange={handleI18nChange} rows="10" className="w-full p-3 bg-white/10 rounded-lg border border-gray-700" />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">{t('admin_post_content')} (EN)</label>
            <textarea name="content.EN" value={formData.content.EN} onChange={handleI18nChange} rows="10" className="w-full p-3 bg-white/10 rounded-lg border border-gray-700" />
          </div>

          {/* Mi Opinión (ES y EN) */}
          <div>
            <label className="block text-gray-400 mb-2">{t('admin_post_opinion')} (ES)</label>
            <textarea name="myOpinion.ES" value={formData.myOpinion.ES} onChange={handleI18nChange} rows="3" className="w-full p-3 bg-white/10 rounded-lg border border-gray-700" />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">{t('admin_post_opinion')} (EN)</label>
            <textarea name="myOpinion.EN" value={formData.myOpinion.EN} onChange={handleI18nChange} rows="3" className="w-full p-3 bg-white/10 rounded-lg border border-gray-700" />
          </div>

          {/* Checkbox 'commentsEnabled' */}
          <div className="flex items-center pt-4">
            <input
              type="checkbox" name="commentsEnabled" id="commentsEnabled" 
              checked={formData.commentsEnabled} 
              onChange={handleSimpleChange}
              className="w-5 h-5 bg-gray-700 border-gray-600 rounded"
            />
            <label className="text-gray-300 ml-3" htmlFor="commentsEnabled">{t('admin_post_comments_enable')}</label>
          </div>

          {/* Botón Guardar */}
          <div className="flex justify-end gap-4 pt-4">
            <button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition">
              {loading ? "..." : t('admin_save')}
            </button>
          </div>
        </form>

        {/* --- SECCIÓN DE GESTIÓN DE COMENTARIOS --- */}
        {!isNew && (
          <div className="bg-white/10 p-6 rounded-lg space-y-4 mt-8">
            <h2 className="text-2xl font-semibold text-purple-400 mb-6">{t('admin_post_comments')}</h2>
            {comments.length === 0 ? (
              <p className="text-gray-400">{t('admin_post_no_comments')}</p>
            ) : (
              <div className="space-y-4">
                {comments.map(comment => (
                  <div key={comment.id} className="bg-white/5 p-4 rounded-lg flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{comment.authorName || 'Anónimo'}</p>
                      <p className="text-sm text-gray-300">{comment.content}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteComment(comment.id)}
                      title={t('admin_delete')}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-white/10 rounded flex-shrink-0"
                    >
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogForm;