import { useState, useEffect } from 'react';
import { database } from '../firebaseConfig'; // Asegúrate que la ruta sea correcta
import { ref, onValue, off, push, update, remove } from 'firebase/database';

// --- HOOKS (READ) ---

// Función genérica para leer una lista (Laboral o Educación)
const useExperienceData = (path) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataRef = ref(database, path);
    setLoading(true);
    
    // onValue escucha cambios en tiempo real
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      const dataArray = data 
        ? Object.keys(data).map(key => ({ id: key, ...data[key] })) 
        : [];
      setItems(dataArray);
      setLoading(false);
    });

    // Limpieza: se desuscribe del listener al desmontar
    return () => off(dataRef);
  }, [path]); // Se re-ejecuta si la 'path' cambia

  return { items, loading };
};

// Hook específico para Experiencia Laboral
export const useWorkExperience = () => {
  return useExperienceData('workExperience');
};

// Hook específico para Educación
export const useEducation = () => {
  return useExperienceData('educationExperience');
};

// --- CRUD FUNCTIONS ---

// Funciones genéricas de CUD
const createItem = (path, data) => push(ref(database, path), data);
const updateItem = (path, id, data) => update(ref(database, `${path}/${id}`), data);
const deleteItem = (path, id) => remove(ref(database, `${path}/${id}`));

// CRUD para 'workExperience'
export const createWorkItem = (data) => createItem('workExperience', data);
export const updateWorkItem = (id, data) => updateItem('workExperience', id, data);
export const deleteWorkItem = (id) => deleteItem('workExperience', id);

// CRUD para 'educationExperience'
export const createEducationItem = (data) => createItem('educationExperience', data);
export const updateEducationItem = (id, data) => updateItem('educationExperience', id, data);
export const deleteEducationItem = (id) => deleteItem('educationExperience', id);