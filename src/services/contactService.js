import { useState, useEffect } from 'react';
import { database } from '../firebaseConfig'; 
import { ref, onValue, off, push, update, remove, get, set } from 'firebase/database';

// ----------------------------------------------------------------
// 1. EL HOOK (READ)
// ----------------------------------------------------------------
// (Este es el hook que ya hicimos, solo para leer y mostrar datos)
export function useContactLinks() {
  const [contactLinks, setcontactLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const contactLinksRef = ref(database, 'contactLinksData');
    setLoading(true);
    
    onValue(contactLinksRef, (snapshot) => {
      const data = snapshot.val();
      const contactLinksArray = data 
        ? Object.keys(data).map(key => ({ id: key, ...data[key] })) 
        : [];
      setcontactLinks(contactLinksArray);
      setLoading(false);
    });

    // Limpieza: se desuscribe del listener al desmontar
    return () => off(contactLinksRef);
  }, []);

  return { contactLinks, loading };
}

// ----------------------------------------------------------------
// 2. LAS FUNCIONES CRUD (CREATE, UPDATE, DELETE)
// ----------------------------------------------------------------

const contactLinksRef = ref(database, 'contactLinksData');
const configRef = ref(database, 'contactPageConfig');

/**
 * CREA un nuevo proyecto en Firebase.
 * @param {object} contactLinksData - Los datos del formulario.
 */
export const createContactLink = (contactLinksData) => {
  // Convertimos el string de "Tools" en un array
  const dataToSave = {
    ...contactLinksData,
  };
  
  // 'push' crea el ID único y guarda los datos
  return push(contactLinksRef, dataToSave);
};

/**
 * ACTUALIZA un proyecto existente en Firebase.
 * @param {string} id - El ID del proyecto a actualizar.
 * @param {object} contactLinksData - Los datos del formulario.
 */
export const updateContactLink = (id, contactLinksData) => {
  const contactLinksRef = ref(database, `contactLinksData/${id}`);
  const dataToSave = {
    ...contactLinksData,
  };

  return update(contactLinksRef, dataToSave);
};

/**
 * BORRA un proyecto de Firebase.
 * @param {string} id - El ID del proyecto a borrar.
 */
export const deleteContactLink = (id) => {
  const contactLinksRef = ref(database, `contactLinksData/${id}`);
  return remove(contactLinksRef);
};

/**
 * Hook para leer las URLs de las imágenes de la página.
 */
export function useContactPageConfig() {
  const [config, setConfig] = useState({ mainImageUrl: '', profileImageUrl: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // get() solo lee los datos una vez
    get(configRef).then((snapshot) => {
      if (snapshot.exists()) {
        setConfig(snapshot.val());
      }
      setLoading(false);
    });
  }, []);

  return { config, loading };
}

/**
 * Actualiza las URLs de las imágenes.
 * @param {object} data - { mainImageUrl, profileImageUrl }
 */
export const updateContactPageConfig = (data) => {
  // 'set' sobrescribe todos los datos en esta ruta
  return set(configRef, data);
};