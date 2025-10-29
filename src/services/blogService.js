import { useState, useEffect } from 'react';
import { database } from '../firebaseConfig'; // Asegúrate que la ruta sea correcta
import { ref, onValue, off, push, update, remove, get } from 'firebase/database';

// El nodo en Firebase donde se guardarán los posts del blog
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
      setPosts(postsArray); // <-- Actualiza el estado 'posts'
      setLoading(false);
    });

    // Limpieza
    return () => off(blogDataRef);
  }, []);

  return { posts, loading }; // <-- Devuelve 'posts'
}

// ----------------------------------------------------------------
// 2. LAS FUNCIONES CRUD (CREATE, UPDATE, DELETE)
// ----------------------------------------------------------------

const blogDataBaseRef = ref(database, BLOG_DATA_PATH); // <-- CORRECCIÓN: Referencia base

/**
 * CREA un nuevo post de blog en Firebase.
 * @param {object} blogPostData - Los datos del formulario del post.
 */
export const createBlogPost = (blogPostData) => { // <-- CORRECCIÓN: Nombre de función
  // Aquí puedes añadir validaciones o transformaciones si es necesario
  const dataToSave = {
    ...blogPostData,
    createdAt: blogPostData.createdAt || new Date().toISOString(), 
    myOpinion: blogPostData.myOpinion || {},
    categories: Array.isArray(blogPostData.categories) ? blogPostData.categories : [blogPostData.categories]
  };
  
  return push(blogDataBaseRef, dataToSave);
};

/**
 * OBTIENE un post específico por su ID.
 * @param {string} postId - El ID del post a obtener.
 * @returns {Promise<object|null>} - El objeto del post o null si no se encuentra.
 */
export const getBlogPostById = async (postId) => {
  const postPath = `${BLOG_DATA_PATH}/${postId}`; // Define the path
  const postRef = ref(database, postPath);

  // --- Print 1: Log the path being queried ---
  console.log(`[getBlogPostById] Querying path: ${postPath}`);

  try {
    const snapshot = await get(postRef); 

    console.log(`[getBlogPostById] Snapshot received for ${postId}:`, snapshot.val());

    if (snapshot.exists()) {
      const postData = { id: snapshot.key, ...snapshot.val() };
      // --- Print 3: Log the data being returned if found ---
      console.log(`[getBlogPostById] Post found and returning:`, postData);
      return postData; // Devuelve el post con su ID
    } else {
      // --- Print 4: Log if snapshot doesn't exist ---
      console.log(`[getBlogPostById] Snapshot for ${postId} does not exist.`);
      return null; // No encontrado
    }
  } catch (error) {
    // --- Print 5: Log the specific error during fetch ---
    console.error(`[getBlogPostById] Error fetching post ${postId}:`, error);
    throw error; // Propaga el error para que el componente lo maneje
  }
};

/**
 * ACTUALIZA un post de blog existente en Firebase.
 * @param {string} id - El ID del post a actualizar.
 * @param {object} blogPostData - Los datos del formulario a actualizar.
 */
export const updateBlogPost = (id, blogPostData) => { 
  const postRef = ref(database, `${BLOG_DATA_PATH}/${id}`); 
  
  const dataToSave = {
     ...blogPostData,
  };
  delete dataToSave.id; 

  return update(postRef, dataToSave);
};

/**
 * BORRA un post de blog de Firebase.
 * @param {string} id - El ID del post a borrar.
 */
export const deleteBlogPost = (id) => { // <-- CORRECCIÓN: Nombre de función
  const postRef = ref(database, `${BLOG_DATA_PATH}/${id}`); // <-- CORRECCIÓN: Ruta específica del post
  return remove(postRef);
};

/**
 * AÑADE un comentario ('myOpinion') a un post.
 * @param {string} postId - El ID del post.
 * @param {object} opinionData - Datos del comentario ({ createdAt, content: { EN, ES } }).
 */
export const addOpinionToBlogPost = (postId, opinionData) => { // <-- CORRECCIÓN: Nombre de función
  const opinionsRef = ref(database, `${BLOG_DATA_PATH}/${postId}/myOpinion`);
  return push(opinionsRef, {
      ...opinionData,
      createdAt: opinionData.createdAt || new Date().toISOString()
  });
}

/**
 * BORRA un comentario ('myOpinion') de un post.
 * @param {string} postId - El ID del post.
 * @param {string} opinionId - El ID del comentario a borrar.
 */
export const deleteOpinionFromBlogPost = (postId, opinionId) => { // <-- CORRECCIÓN: Nombre de función
    const opinionRef = ref(database, `${BLOG_DATA_PATH}/${postId}/myOpinion/${opinionId}`);
    return remove(opinionRef);
}

// --- CRUD PARA COMENTARIOS DE VISITANTES ---

/**
 * AÑADE un comentario de visitante a un post.
 * @param {string} postId - El ID del post.
 * @param {object} commentData - Datos del comentario ({ authorName?, content }).
 */
export const addCommentToPost = (postId, commentData) => {
  // 👇 CORRECCIÓN: Apunta al nodo 'comments' DENTRO del post específico 👇
  const commentsRef = ref(database, `${BLOG_DATA_PATH}/${postId}/comments`);

  const dataToSave = {
    ...commentData,
    authorName: commentData.authorName || "Anónimo",
    createdAt: commentData.createdAt || new Date().toISOString()
  };
  console.log(`[addCommentToPost] Adding comment to ${BLOG_DATA_PATH}/${postId}/comments`, dataToSave);
  // 'push' generará un ID único para este comentario bajo el nodo 'comments'
  return push(commentsRef, dataToSave);
};

/**
 * BORRA un comentario de visitante.
 * @param {string} postId - El ID del post.
 * @param {string} commentId - El ID del comentario a borrar.
 */
export const deleteCommentFromPost = (postId, commentId) => {
    // 👇 CORRECCIÓN: Apunta al comentario específico dentro de 'comments' 👇
    const commentRef = ref(database, `${BLOG_DATA_PATH}/${postId}/comments/${commentId}`);
    return remove(commentRef);
};

// --- FUNCIÓN PARA ACTUALIZAR 'myOpinion' (La opinión del autor) ---
/**
 * SETS or UPDATES the single 'myOpinion' object for a specific post.
 * @param {string} postId - The ID of the post.
 * @param {object} opinionData - The opinion object ({ content: { EN, ES }, createdAt? }).
 */
export const setMyOpinionForPost = (postId, opinionData) => {
  const postRef = ref(database, `${BLOG_DATA_PATH}/${postId}`);
  const dataToUpdate = {
    myOpinion: { // Apunta específicamente al campo 'myOpinion'
      ...opinionData,
      createdAt: opinionData.createdAt || new Date().toISOString()
    }
  };
  console.log(`[setMyOpinionForPost] Updating ${BLOG_DATA_PATH}/${postId} with:`, dataToUpdate);
  return update(postRef, dataToUpdate); // Usa update para modificar solo 'myOpinion'
};