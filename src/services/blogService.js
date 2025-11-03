import { useState, useEffect } from 'react';
import { database } from '../firebaseConfig';
import { ref, onValue, off, push, update, remove, get } from 'firebase/database';

const BLOG_DATA_PATH = 'blogData'; 

// ----------------------------------------------------------------
// 1. EL HOOK (READ)
// ----------------------------------------------------------------
export function useBlogPosts() {
  const [posts, setPosts] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const blogDataRef = ref(database, BLOG_DATA_PATH);
    setLoading(true);
    
    onValue(blogDataRef, (snapshot) => {
      const data = snapshot.val();
      const postsArray = data 
      ? Object.keys(data).map(key => ({ id: key, ...data[key] })) 
      : [];
      setPosts(postsArray);
      setLoading(false);
    });

    // Limpieza
    return () => off(blogDataRef);
  }, []);

 return { posts, loading };
}

// ----------------------------------------------------------------
// 2. LAS FUNCIONES CRUD (CREATE, UPDATE, DELETE)
// ----------------------------------------------------------------

const blogDataBaseRef = ref(database, BLOG_DATA_PATH);

/**
 * CREA un nuevo post de blog en Firebase.
 * @param {object} blogPostData - Los datos del formulario del post.
 */
export const createBlogPost = (blogPostData) => {
  const categoriesArray = blogPostData.categories 
    ? blogPostData.categories.split(',').map(cat => cat.trim()) 
    : [];

  const dataToSave = {
    ...blogPostData,
    categories: categoriesArray,
    createdAt: blogPostData.createdAt || new Date().toISOString(), 
    myOpinion: blogPostData.myOpinion || {},
    commentsEnabled: blogPostData.commentsEnabled === undefined ? true : blogPostData.commentsEnabled,
  };

  return push(blogDataBaseRef, dataToSave);
};

/**
 * OBTIENE un post específico por su ID.
 * @param {string} postId - El ID del post a obtener.
 * @returns {Promise<object|null>} - El objeto del post o null si no se encuentra.
 */
export const getBlogPostById = async (postId) => {
  const postPath = `${BLOG_DATA_PATH}/${postId}`;
  const postRef = ref(database, postPath);

  try {
    const snapshot = await get(postRef); 

    if (snapshot.exists()) {
    const postData = { id: snapshot.key, ...snapshot.val() };
    return postData;
    } else {
    return null;
    }
    } catch (error) {
    throw error;
  }
};

/**
 * ACTUALIZA un post de blog existente en Firebase.
 * @param {string} id - El ID del post a actualizar.
 * @param {object} blogPostData - Los datos del formulario a actualizar.
 */
export const updateBlogPost = (id, blogPostData) => { 
  const postRef = ref(database, `${BLOG_DATA_PATH}/${id}`); 

  const categoriesArray = typeof blogPostData.categories === 'string'
    ? blogPostData.categories.split(',').map(cat => cat.trim())
    : blogPostData.categories;

  const dataToSave = {
    ...blogPostData,
    categories: categoriesArray,
  };
  delete dataToSave.id; 

  return update(postRef, dataToSave);
};

/**
 * BORRA un post de blog de Firebase.
 * @param {string} id - El ID del post a borrar.
 */
export const deleteBlogPost = (id) => {
  const postRef = ref(database, `${BLOG_DATA_PATH}/${id}`); 
  return remove(postRef);
};

/**
 * AÑADE un comentario ('myOpinion') a un post.
 * @param {string} postId - El ID del post.
 * @param {object} opinionData - Datos del comentario ({ createdAt, content: { EN, ES } }).
 */
export const addOpinionToBlogPost = (postId, opinionData) => {
  const opinionsRef = ref(database, `${BLOG_DATA_PATH}/${postId}/myOpinion`);
  return push(opinionsRef, {
      ...opinionData,
      createdAt: opinionData.createdAt || new Date().toISOString()
  });
}

/**
 * BORRA un comentario ('myOpinion') de un post.
 * @param {string} postId 
 * @param {string} opinionId 
 */
export const deleteOpinionFromBlogPost = (postId, opinionId) => {
    const opinionRef = ref(database, `${BLOG_DATA_PATH}/${postId}/myOpinion/${opinionId}`);
    return remove(opinionRef);
}

// --- CRUD PARA COMENTARIOS DE VISITANTES ---

/**
 * AÑADE un comentario de visitante a un post.
 * @param {string} postId 
 * @param {object} commentData 
 */
export const addCommentToPost = (postId, commentData) => {
  const commentsRef = ref(database, `${BLOG_DATA_PATH}/${postId}/comments`);

  const dataToSave = {
    ...commentData,
    authorName: commentData.authorName || "Anónimo",
    createdAt: commentData.createdAt || new Date().toISOString()
  };
  console.log(`[addCommentToPost] Adding comment to ${BLOG_DATA_PATH}/${postId}/comments`, dataToSave);
  return push(commentsRef, dataToSave);
};

/**
 * BORRA un comentario de visitante.
 * @param {string} postId 
 * @param {string} commentId
 */
export const deleteCommentFromPost = (postId, commentId) => {
    const commentRef = ref(database, `${BLOG_DATA_PATH}/${postId}/comments/${commentId}`);
    return remove(commentRef);
};

// --- FUNCIÓN PARA ACTUALIZAR 'myOpinion' (La opinión del autor) ---
/**
 * SETS or UPDATES the single 'myOpinion' object for a specific post.
 * @param {string} postId
 * @param {object} opinionData
 */
export const setMyOpinionForPost = (postId, opinionData) => {
  const postRef = ref(database, `${BLOG_DATA_PATH}/${postId}`);
  const dataToUpdate = {
    myOpinion: { 
      ...opinionData,
      createdAt: opinionData.createdAt || new Date().toISOString()
    }
  };
  console.log(`[setMyOpinionForPost] Updating ${BLOG_DATA_PATH}/${postId} with:`, dataToUpdate);
  return update(postRef, dataToUpdate);
};