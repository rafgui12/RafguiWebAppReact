import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import useLanguage from '../../../hooks/useLanguage';
import { database } from '../../../firebaseConfig';
import { ref, get, update, push } from 'firebase/database';

const ExperienceForm = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { id, type } = useParams(); 
  const isWork = type === 'workExperience';
  const [isNew, setIsNew] = useState(!id);
  const [loading, setLoading] = useState(false);
  
  // 1. ESTADO INICIAL COMPLETO (con 'dates' como objeto)
  const [formData, setFormData] = useState({
    title: { ES: '', EN: '' },
    dates: { start: '', end: '' }, 
    description: { ES: '', EN: '' },
    company: '',
    location: '',
    institution: '',
    visible: true
  });

  // Carga los datos existentes si estamos editando
  useEffect(() => {
    if (id && type) {
      setIsNew(false);
      setLoading(true);
      const itemRef = ref(database, `${type}/${id}`);
      get(itemRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Asegura que 'dates' sea un objeto, incluso si está vacío en la DB
          setFormData(prev => ({ 
            ...prev, 
            ...data,
            dates: data.dates || { start: '', end: '' } // Fallback
          }));
        }
        setLoading(false);
      });
    }
  }, [id, type]);

  // --- HANDLERS COMPLETOS ---

  // Handler para campos i18n (title, description)
  const handleI18nChange = (e) => {
    const { name, value } = e.target;
    const [fieldName, lang] = name.split('.'); // ej. "title.ES"
    setFormData(prev => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], [lang]: value }
    }));
  };
  
  // Handler separado para el objeto 'dates'
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

  // Handler para campos simples (company, location, visible, etc.)
  const handleSimpleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handler para enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Objeto completo que se guardará
    let dataToSave = {
      title: formData.title,
      dates: formData.dates, // <-- Se guarda como {start, end}
      description: formData.description,
      visible: formData.visible,
    };

    // Añade campos condicionales
    if (isWork) {
      dataToSave.company = formData.company;
      dataToSave.location = formData.location;
    } else {
      dataToSave.institution = formData.institution;
    }

    // Lógica de guardado
    if (isNew) {
      push(ref(database, type), dataToSave)
        .then(() => navigate('/admin/experience'))
        .catch(err => setLoading(false));
    } else {
      update(ref(database, `${type}/${id}`), dataToSave)
        .then(() => navigate('/admin/experience'))
        .catch(err => setLoading(false));
    }
  };

  // --- RENDERIZADO COMPLETO ---

  if (loading && !isNew) {
    return (
      <div className="min-h-screen bg-black text-white p-12 flex items-center justify-center">
        {t('admin_loading')}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white p-6 md:p-12">
      <div className="absolute inset-0 z-0 opacity-50 bg-gradient-to-b from-black via-black to-purple-900/40" />
      <div className="relative z-10 w-full max-w-2xl mx-auto">
        
        <header className="flex items-center justify-between mb-8">
           <h1 className="text-3xl font-bold text-orange-400">
            {isNew ? t('admin_create_new') : t('admin_edit_item')}
          </h1>
          <Link to="/admin/experience" className="text-purple-400 hover:underline">
            {t('admin_cancel')}
          </Link>
        </header>
        
        {/* --- FORMULARIO "INTELIGENTE" COMPLETO --- */}
        <form onSubmit={handleSubmit} className="bg-white/10 p-6 rounded-lg space-y-4">
          
          {/* Título (ES y EN) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2" htmlFor="title.ES">{t('admin_item_title')} (ES)</label>
              <input
                type="text" name="title.ES" value={formData.title.ES} onChange={handleI18nChange}
                placeholder={t('admin_item_title_placeholder')}
                className="w-full p-3 bg-white/10 rounded-lg border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2" htmlFor="title.EN">{t('admin_item_title')} (EN)</label>
              <input
                type="text" name="title.EN" value={formData.title.EN} onChange={handleI18nChange}
                placeholder={t('admin_item_title_placeholder')}
                className="w-full p-3 bg-white/10 rounded-lg border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>

          {/* Campos de Fechas (Corregidos) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2" htmlFor="dates.start">{t('admin_item_date_start')}</label>
              <input
                type="text" 
                name="start" // <-- name es 'start'
                value={formData.dates.start} 
                onChange={handleDateChange} // <-- Usa el handler de 'dates'
                placeholder={t('admin_item_date_start_placeholder')}
                className="w-full p-3 bg-white/10 rounded-lg border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
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
                className="w-full p-3 bg-white/10 rounded-lg border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>

          {/* Campos Condicionales (work/education) */}
          {isWork ? (
            <>
              {/* Campos solo para "Work" */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-2" htmlFor="company">{t('admin_item_location')}</label>
                  <input
                    type="text" name="company" value={formData.company} onChange={handleSimpleChange}
                    placeholder={t('admin_item_location_placeholder')}
                    className="w-full p-3 bg-white/10 rounded-lg border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2" htmlFor="location">{t('admin_item_location')}</label>
                  <input
                    type="text" name="location" value={formData.location} onChange={handleSimpleChange}
                    placeholder={t('admin_item_location_placeholder')}
                    className="w-full p-3 bg-white/10 rounded-lg border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
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
                  className="w-full p-3 bg-white/10 rounded-lg border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
            </>
          )}

          {/* Descripción (ES y EN) */}
          <div>
            <label className="block text-gray-400 mb-2" htmlFor="description.ES">{t('admin_item_description')} (ES)</label>
            <textarea
              name="description.ES" value={formData.description.ES} onChange={handleI18nChange}
              rows="4" className="w-full p-3 bg-white/10 rounded-lg border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2" htmlFor="description.EN">{t('admin_item_description')} (EN)</label>
            <textarea
              name="description.EN" value={formData.description.EN} onChange={handleI18nChange}
              rows="4" className="w-full p-3 bg-white/10 rounded-lg border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          {/* Visible */}
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
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              {loading ? "..." : t('admin_save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExperienceForm;