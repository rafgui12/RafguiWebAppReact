import React, { useState, useEffect } from 'react';
// CORREGIDO: Importa 'Link' y 'useNavigate' desde 'react-router-dom'
import { Link, useNavigate } from 'react-router'; 
import useLanguage from '../../../hooks/useLanguage';
import {
  useWorkExperience,
  createWorkItem,
  updateWorkItem,
  deleteWorkItem,
  useEducation,
  createEducationItem,
  updateEducationItem,
  deleteEducationItem
} from '../../../services/experienceService'; // Asegúrate que la ruta sea correcta
import { HiOutlinePencilAlt, HiOutlineTrash, HiPlus } from 'react-icons/hi';

// --- COMPONENTE PRINCIPAL DE LA PÁGINA ---
const ManageExperience = () => {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen bg-black text-white p-6 md:p-12">
      {/* Fondo */}
      <div className="absolute inset-0 z-0 opacity-50 bg-gradient-to-b from-black via-black to-purple-900/40" />

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-orange-400">
            {t('admin_manage_experience')}
          </h1>
          <Link to="/admin" className="text-purple-400 hover:underline">
            {t('admin_back_to_dash')}
          </Link>
        </header>

        {/* Pasamos 'type' para que la sección y el formulario sepan qué datos manejar */}
        
        <ExperienceSection 
          titleKey="admin_work_experience"
          type="workExperience" // <-- Prop 'type'
          useDataHook={useWorkExperience}
          createFn={createWorkItem}
          updateFn={updateWorkItem}
          deleteFn={deleteWorkItem}
        />
        
        <hr className="border-gray-700/50 my-12"/>
        
        <ExperienceSection 
          titleKey="admin_education"
          type="educationExperience" // <-- Prop 'type'
          useDataHook={useEducation}
          createFn={createEducationItem}
          updateFn={updateEducationItem}
          deleteFn={deleteEducationItem}
        />
        
      </div>
    </div>
  );
};

export default ManageExperience;

// --- COMPONENTE DE SECCIÓN (COMPLETADO) ---
const ExperienceSection = ({ titleKey, type, useDataHook, createFn, updateFn, deleteFn }) => {
  const { t, lang } = useLanguage(); 
  const { items, loading } = useDataHook(); 
  const [editingItem, setEditingItem] = useState(null); // El estado que controla el formulario

  // --- Handlers (Lógica) ---
  
  const handleAddNew = () => {
    // CORRECCIÓN: 'dates' se inicializa como objeto
    setEditingItem({ 
      title: { ES: '', EN: '' },
      dates: { start: '', end: '' }, // <-- CORREGIDO
      description: { ES: '', EN: '' },
      company: '',
      location: '',
      institution: '',
      visible: true
    });
  };

  const handleEdit = (item) => {
    // CORRECCIÓN: Asegura que 'dates' sea un objeto al editar
    const itemToEdit = {
      ...item,
      dates: item.dates || { start: '', end: '' }
    };
    setEditingItem(itemToEdit);
  };

  const handleCancel = () => {
    setEditingItem(null); // Cierra el formulario
  };

  const handleDelete = (id) => {
    if (window.confirm(t('admin_delete_confirm'))) {
      deleteFn(id).catch(err => console.error("Error al eliminar:", err));
    }
  };

  const handleSubmit = (formData) => {
    // 1. Limpia los datos antes de guardarlos
    let dataToSave = {
      title: formData.title || { ES: '', EN: '' },
      dates: formData.dates || { start: '', end: '' }, // <-- CORREGIDO
      description: formData.description || { ES: '', EN: '' },
      visible: formData.visible,
    };

    // 2. Añade los campos específicos del 'type'
    if (type === 'workExperience') {
      dataToSave.company = formData.company;
      dataToSave.location = formData.location;
    } else {
      dataToSave.institution = formData.institution;
    }
    
    // 3. Llama a la función de crear o actualizar
    if (editingItem && editingItem.id) {
      updateFn(editingItem.id, dataToSave)
        .then(() => setEditingItem(null))
        .catch(err => console.error("Error al actualizar:", err));
    } else {
      createFn(dataToSave)
        .then(() => setEditingItem(null))
        .catch(err => console.error("Error al crear:", err));
    }
  };

  // --- Renderizado de la Sección ---
  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-purple-400">{t(titleKey)}</h2>
        {!editingItem && ( // Solo muestra el botón si no estamos editando
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            <HiPlus /> {t('admin_create_new')}
          </button>
        )}
      </div>
      
      {/* El formulario se renderiza aquí cuando 'editingItem' no es null */}
      {editingItem && (
        <ExperienceForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          initialData={editingItem}
          type={type} // <-- Pasa el 'type' al formulario
        />
      )}
      
      {/* Muestra la lista de ítems */}
      {loading && <p>{t('admin_loading')}</p>}
      {!loading && !items.length && !editingItem && (
         <p className="text-gray-500">{t('admin_no_items')}</p>
      )}
      {!loading && (
        <div className="space-y-4 mt-8">
          {items.map(item => (
            <div key={item.id} className="bg-white/5 p-4 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-bold">
                  {item.title ? (item.title[lang.toUpperCase()] || item.title.ES || 'Sin Título') : 'Sin Título'}
                </h3>
                {/* CORRECCIÓN: Muestra 'company' o 'institution' y el objeto 'dates' */}
                <p className="text-sm text-gray-400">
                  {type === 'workExperience' ? item.company : item.institution} | 
                  {item.dates ? ` ${item.dates.start || ''} - ${item.dates.end || ''}` : ' Sin fecha'}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button 
                  onClick={() => handleEdit(item)} 
                  title={t('admin_edit_item')}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded"
                >
                  <HiOutlinePencilAlt className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
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
    </section>
  );
};

// --- FORMULARIO "INTELIGENTE" (COMPLETADO Y CORREGIDO) ---
const ExperienceForm = ({ onSubmit, onCancel, initialData, type }) => {
  const { t } = useLanguage();
  const isWork = type === 'workExperience'; // Determina qué campos mostrar
  
  // CORRECCIÓN: 'dates' se inicializa como objeto
  const [formData, setFormData] = useState({
    title: { ES: '', EN: '' },
    dates: { start: '', end: '' }, // <-- CORREGIDO
    description: { ES: '', EN: '' },
    company: '',
    location: '',
    institution: '',
    visible: true
  });

  useEffect(() => {
    if (initialData) {
      // CORRECCIÓN: Asegura que 'dates' sea un objeto al editar
      setFormData(prev => ({ 
        ...prev, 
        ...initialData,
        dates: initialData.dates || { start: '', end: '' } // <-- CORREGIDO
      }));
    }
  }, [initialData]);

  // --- Handlers del Formulario ---

  // Handler para campos i18n (title, description)
  const handleI18nChange = (e) => {
    const { name, value } = e.target;
    const [fieldName, lang] = name.split('.'); // ej. "title.ES"
    setFormData(prev => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], [lang]: value }
    }));
  };
  
  // Handler NUEVO solo para el objeto 'dates'
  const handleDateChange = (e) => {
    const { name, value } = e.target; // name será "start" o "end"
    setFormData(prev => ({
      ...prev,
      dates: {
        ...prev.dates,
        [name]: value
      }
    }));
  };

  // Handler para campos simples (company, location, etc.)
  const handleSimpleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // --- Renderizado del Formulario ---
  return (
    <form onSubmit={handleSubmit} className="bg-white/10 p-6 rounded-lg space-y-4 mb-8">
      <h3 className="text-xl font-semibold mb-4">
        {initialData.id ? t('admin_edit_item') : t('admin_create_new')}
      </h3>
      
      {/* Título (ES y EN) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 mb-2" htmlFor="title.ES">{t('admin_item_title')} (ES)</label>
          <input
            type="text" name="title.ES" value={formData.title.ES} onChange={handleI18nChange}
            placeholder={t('admin_item_title_placeholder')}
            className="w-full p-3 bg-white/10 rounded-lg border border-gray-700"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-2" htmlFor="title.EN">{t('admin_item_title')} (EN)</label>
          <input
            type="text" name="title.EN" value={formData.title.EN} onChange={handleI18nChange}
            placeholder={t('admin_item_title_placeholder')}
            className="w-full p-3 bg-white/10 rounded-lg border border-gray-700"
          />
        </div>
      </div>

      {/* CORRECCIÓN: Campos de Fechas (start y end) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 mb-2" htmlFor="dates.start">{t('admin_item_date_start')}</label>
          <input
            type="text" 
            name="start" // <-- name es 'start'
            value={formData.dates.start} 
            onChange={handleDateChange} // <-- Usa el handler de 'dates'
            placeholder={t('admin_item_date_start_placeholder')}
            className="w-full p-3 bg-white/10 rounded-lg border border-gray-700"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-2" htmlFor="dates.end">{t('admin_item_date_end')}</label>
          <input
            type="text" 
            name="end" // <-- name es 'end'
            value={formData.dates.end} 
            onChange={handleDateChange} // <-- Usa el handler de 'dates'
            placeholder={t('admin_item_date_end_placeholder')}
            className="w-full p-3 bg-white/10 rounded-lg border border-gray-700"
          />
        </div>
      </div>

      {/* --- CAMPOS CONDICIONALES (Corregidos) --- */}
      {isWork ? (
        <>
          {/* Campos solo para "Work" */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2" htmlFor="company">{t('admin_item_company')}</label>
              <input
                type="text" name="company" value={formData.company} onChange={handleSimpleChange}
                placeholder={t('admin_item_company_placeholder')}
                className="w-full p-3 bg-white/10 rounded-lg border border-gray-700"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2" htmlFor="location">{t('admin_item_location')}</label>
              <input
                type="text" name="location" value={formData.location} onChange={handleSimpleChange}
                placeholder={t('admin_item_location_placeholder')}
                className="w-full p-3 bg-white/10 rounded-lg border border-gray-700"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Campos solo para "Education" */}
          <div>
            <label className="block text-gray-400 mb-2" htmlFor="institution">{t('admin_item_institution')}</label>
            <input
              type="text" name="institution" value={formData.institution} onChange={handleSimpleChange}
              placeholder={t('admin_item_institution_placeholder')}
              className="w-full p-3 bg-white/10 rounded-lg border border-gray-700"
            />
          </div>
        </>
      )}

      {/* Descripción (ES y EN) */}
      <div>
        <label className="block text-gray-400 mb-2" htmlFor="description.ES">{t('admin_item_description')} (ES)</label>
        <textarea
          name="description.ES" value={formData.description.ES} onChange={handleI18nChange}
          rows="4" className="w-full p-3 bg-white/10 rounded-lg border border-gray-700"
        />
      </div>
      <div>
        <label className="block text-gray-400 mb-2" htmlFor="description.EN">{t('admin_item_description')} (EN)</label>
        <textarea
          name="description.EN" value={formData.description.EN} onChange={handleI18nChange}
          rows="4" className="w-full p-3 bg-white/10 rounded-lg border border-gray-700"
        />
      </div>
      
      {/* Checkbox 'visible' */}
      <div className="flex items-center pt-4">
        <input
          type="checkbox" name="visible" id="visible" checked={formData.visible} onChange={handleSimpleChange}
          className="w-5 h-5 bg-gray-700 border-gray-600 rounded"
        />
        <label className="text-gray-300 ml-3" htmlFor="visible">{t('admin_project_visible')}</label>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          {t('admin_cancel')}
        </button>
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          {t('admin_save')}
        </button>
      </div>
    </form>
  );
};