import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router'; // CORREGIDO: import de react-router-dom
import useLanguage from '../../hooks/useLanguage';
import Footer from '../components/Footer';
// IMPORTA las funciones del servicio necesarias
import { getBlogPostById, addCommentToPost } from '../../services/blogService';
import HeaderBack from '../components/HeaderBack';

function BlogPostPage() {
  const { postId } = useParams();
  const { lang, t } = useLanguage();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [commentsList, setCommentsList] = useState([]);

  // Estados para el formulario de opinión
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedPost = await getBlogPostById(postId);
        console.log('Fetched post:', fetchedPost); // Mantenemos el log
        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          setError(t('blog_post_not_found'));
        }
      } catch (err) {
        setError(t('blog_load_fail'));
      } finally {
        setLoading(false);
      }
    };
    if (postId) fetchPost(); // Solo buscar si hay postId
  }, [postId]);

  useEffect(() => {
    if (post && post.comments) {
      // Convierte el objeto de comentarios de Firebase en un array
      const commentsArray = Object.keys(post.comments)
        .map(key => ({
          id: key,
          ...post.comments[key]
        }))
        // Ordena por fecha, el más nuevo primero
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); 
      
      setCommentsList(commentsArray);
    } else {
      setCommentsList([]); // Asegura que sea un array vacío si no hay comentarios
    }
  }, [post]);

  // --- Función para enviar/actualizar la opinión ---
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return; // No enviar si está vacío

    setIsSubmitting(true);
    setSubmitError(null);

    const commentData = {
      content: newComment,
      createdAt: new Date().toISOString()
    };

    try {
      const newCommentRef = await addCommentToPost(postId, commentData);
      const newCommentId = newCommentRef.key;
      setPost(prevPost => ({
        ...prevPost,
        comments: {
          ...prevPost.comments,
          [newCommentId]: commentData 
        }
      }));

      setNewComment(''); 
    } catch (err) {
      console.error("Error submitting comment: ", err);
      setSubmitError(t('blog_submit_error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      return new Date(isoString).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-CA', {
        year: 'numeric', month: '2-digit', day: '2-digit'
      });
    } catch (e) { return isoString; }
  };


 if (loading) {
    return (
      <div className="relative min-h-screen bg-black text-white flex flex-col overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0 opacity-50 bg-gradient-to-b from-black via-black to-purple-900/40" />
        
        <div className="relative z-10 flex flex-col flex-1">
          <HeaderBack />
          
          {/* --- Layout Principal (Esqueleto) --- */}
          <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-12 mt-8 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 animate-pulse">
            
            {/* Columna Izquierda: Contenido del Post (Esqueleto) */}
            <article className="md:col-span-2 bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden p-6 md:p-10">
              {/* Título */}
              <div className="h-10 bg-gray-700 rounded-md w-3/4 mb-4"></div>
              {/* Metadata */}
              <div className="h-4 bg-gray-700 rounded-md w-1/2 mb-8"></div>
              {/* Imagen */}
              <div className="rounded-xl w-full h-80 md:h-96 bg-gray-700 mb-8"></div>
              {/* Contenido */}
              <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            </article>

            {/* Columna Derecha: Opiniones (Esqueleto) */}
            <aside className="md:col-span-1 bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl p-6 md:p-8 flex flex-col">
              {/* Título Mi Opinión */}
              <div className="h-8 bg-gray-700 rounded-md w-1/2 mb-6"></div>
              {/* Caja de opinión */}
              <div className="h-20 bg-gray-700 rounded-lg mb-8"></div>
              
              <hr className="border-gray-700/50 my-6"/>
              
              {/* Título Tu Opinión */}
              <div className="h-8 bg-gray-700 rounded-md w-1/2 mb-4"></div>
              {/* Textarea */}
              <div className="h-28 bg-gray-700 rounded-lg"></div>
              {/* Botón */}
              <div className="h-10 bg-gray-700 rounded-lg mt-4"></div>
            </aside>
          
          </main>
          
          <Footer />
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="relative min-h-screen bg-black text-white flex flex-col overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0 opacity-50 bg-gradient-to-b from-black via-black to-purple-900/40" />
        <div className="relative z-10 flex flex-col flex-1">
          <HeaderBack />
          {/* --- Contenedor del Error --- */}
          <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-12 flex items-center justify-center">
            
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl p-8 md:p-12 text-center max-w-lg">
              <h2 className="text-3xl font-bold text-red-500 mb-4">
                {t('blog_oops_title')}
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                {error}
              </p>
              <Link
                to="/blog"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-black font-bold py-2 px-6 rounded-lg transition duration-300"
              >
                {t('blog_back_to_blog')}
              </Link>
            </div>

          </main>
          
          <Footer />
        </div>
      </div>
    );
  }
  if (!post) { return <div>Post not found.</div>; }

  // --- Accede a la opinión directamente ---
  const myOpinion = post.myOpinion;

  // --- Render the post content ---
  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 opacity-50 bg-gradient-to-b from-black via-black to-purple-900/40" />

      <div className="relative z-10 flex flex-col flex-1">
        <HeaderBack />

        {/* --- Layout Principal CON DOS COLUMNAS --- */}
        <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-12 mt-8 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

          {/* Columna Izquierda: Contenido del Post */}
          <article className="md:col-span-2 bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden p-6 md:p-10">
              {/* Post Header */}
              <h1 className="text-3xl md:text-5xl font-bold text-orange-500 mb-4"> 
                {post.title[lang.toUpperCase()]}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 text-sm text-gray-400 mb-8 border-b border-gray-700/50 pb-4">
                <span>{formatDate(post.createdAt)}</span>
                {post.categories && <span>| {post.categories.join(', ')}</span>}
                {post.author && <span>| Por {post.author}</span>}
              </div>

              {/* Post Image */}
              {post.imageUrl && (
                <div className="mb-8">
                  <img
                    src={post.imageUrl}
                    alt={post.title[lang.toUpperCase()]}
                    className="rounded-xl w-full max-h-[500px] object-cover"
                  />
                </div>
              )}

              {/* Post Content */}
              <div className="prose prose-lg prose-invert max-w-none text-gray-300 blog-content mb-8">
                 {post.content[lang.toUpperCase()].split('\n').map((paragraph, index) => (
                    <p key={index} dangerouslySetInnerHTML={{ __html: paragraph
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-orange-400 hover:underline">$1</a>')
                    }} />
                 ))}
              </div>
              {/* Author at the end */}
               {post.author && (
                  <p className="text-right text-gray-400 italic mt-8 pt-4 border-t border-gray-700/50">
                    {t('blog_by')}: {post.author}
                  </p>
               )}
          </article>

          {/* Columna Derecha: Mi Opinión y Tu Opinión */}
          <aside className="md:col-span-1 bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl p-6 md:p-8 flex flex-col">
              {/* Sección "Mi Opinión" */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-orange-400 mb-6 border-b border-orange-400/30 pb-2">
                  {t('blog_my_opinion')}
                </h2>
                {/* Muestra la opinión existente si existe */}
                {myOpinion ? (
                  <div className="border-b border-gray-700/50 pb-4">
                    <p className="text-gray-300 text-sm mb-1">
                      {myOpinion.content?.[lang.toUpperCase()] || t('blog_opinion_not_available')}
                    </p>
                    <p className="text-xs text-gray-500 text-right">
                      {formatDate(myOpinion.createdAt)}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">{t('blog_no_opinion_yet')}</p>
                )}
              </div>

              {/* Comments */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-orange-400 mb-6 border-b border-orange-400/30 pb-2">
                    {t('blog_comments')}
                </h2>
                <div className="space-y-4">
                    {commentsList.length > 0 ? (
                    commentsList.map(comment => (
                        <div key={comment.id} className="bg-white/5 p-3 rounded-lg border border-gray-700/50">
                        <p className="text-gray-300 text-sm mb-2">{comment.content}</p>
                        <p className="text-xs text-gray-500 text-right">
                            {comment.authorName || t('blog_anonymous')} - {formatDate(comment.createdAt)}
                        </p>
                        </div>
                    ))
                    ) : (
                    <p className="text-gray-500 text-sm">{t('blog_be_first_comment')}</p>
                    )}
                </div>
            </div>

              {/* Separador */}
              <hr className="border-gray-700/50 my-6"/>

              {/* Sección "Tu Opinión" (Formulario) */}
              <div>
                <h2 className="text-2xl font-bold text-orange-400 mb-4">
                  {t('blog_your_opinion')}
                </h2>
                <form onSubmit={handleSubmitComment}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={t('blog_form_placeholder')}
                    rows="4"
                    className="w-full p-3 bg-white/10 rounded-lg border border-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition duration-200 resize-none text-white"
                    disabled={isSubmitting}
                  />
                  {submitError && <p className="text-red-400 text-sm mt-2">{submitError}</p>}
                  <button
                    type="submit"
                    className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-black font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting || !newComment.trim()}
                  >
                    {isSubmitting ? t('blog_submit_saving') : t('blog_submit_save')}
                  </button>
                </form>
              </div>
          </aside>

        </main>

        <Footer />
      </div>
    </div>
  );
}

export default BlogPostPage;