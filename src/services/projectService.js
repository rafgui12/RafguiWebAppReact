// src/services/projectService.js

import { useState, useEffect } from 'react';
import { database } from '../firebaseConfig'; 
import { ref, onValue, off, push, update, remove } from 'firebase/database';

// ----------------------------------------------------------------
// 1. EL HOOK (READ)
// ----------------------------------------------------------------
// (Este es el hook que ya hicimos, solo para leer y mostrar datos)
export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const projectsRef = ref(database, 'projects');
    setLoading(true);
    
    onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      const projectsArray = data 
        ? Object.keys(data).map(key => ({ id: key, ...data[key] })) 
        : [];
      setProjects(projectsArray);
      setLoading(false);
    });

    // Limpieza: se desuscribe del listener al desmontar
    return () => off(projectsRef);
  }, []);

  return { projects, loading };
}

// ----------------------------------------------------------------
// 2. LAS FUNCIONES CRUD (CREATE, UPDATE, DELETE)
// ----------------------------------------------------------------

const projectsRef = ref(database, 'projects');

/**
 * CREA un nuevo proyecto en Firebase.
 * @param {object} projectData - Los datos del formulario.
 */
export const createProject = (projectData) => {
  // Convertimos el string de "Tools" en un array
  const dataToSave = {
    ...projectData,
    Tools: projectData.Tools.split(',').map(tool => tool.trim())
  };
  
  // 'push' crea el ID único y guarda los datos
  return push(projectsRef, dataToSave);
};

/**
 * ACTUALIZA un proyecto existente en Firebase.
 * @param {string} id - El ID del proyecto a actualizar.
 * @param {object} projectData - Los datos del formulario.
 */
export const updateProject = (id, projectData) => {
  const projectRef = ref(database, `projects/${id}`);
  
  // El 'Tools' puede venir como string (del form) o array (de la DB)
  // Nos aseguramos de que siempre se guarde como array.
  const toolsAsArray = typeof projectData.Tools === 'string'
    ? projectData.Tools.split(',').map(tool => tool.trim())
    : projectData.Tools;

  const dataToSave = {
    ...projectData,
    Tools: toolsAsArray
  };

  return update(projectRef, dataToSave);
};

/**
 * BORRA un proyecto de Firebase.
 * @param {string} id - El ID del proyecto a borrar.
 */
export const deleteProject = (id) => {
  const projectRef = ref(database, `projects/${id}`);
  return remove(projectRef);
};