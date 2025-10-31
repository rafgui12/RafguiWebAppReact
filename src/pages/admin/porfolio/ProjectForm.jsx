import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import useLanguage from '../../../hooks/useLanguage';
import { ref, get } from 'firebase/database';
import { database } from '../../../firebaseConfig';
import { createProject, updateProject } from '../../../services/projectService';
import { HiOutlinePhotograph } from 'react-icons/hi';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_PORTFOLIO_PRESET = import.meta.env.VITE_CLOUDINARY_PORTFOLIO_PRESET;

const ProjectForm = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams(); // Obtiene el 'id' de la URL
  const isNew = !id; // Si no hay ID, es un proyecto nuevo

  const [formData, setFormData] = useState({
    Name: { ES: '', EN: '' },
    ShortDescription: { ES: '', EN: '' },
    Tools: '', // El servicio espera un string, así que lo manejamos como string
    URLApp: '',
    ImageHolder: '',
    imagePath: '',
    year: '2024',
    visible: true
  });
  const [loading, setLoading] = useState(false);

  const [projectImageFile, setProjectImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Carga los datos del proyecto si estamos editando
  useEffect(() => {
    if (!isNew) {
      setLoading(true);
      const projectRef = ref(database, `projects/${id}`);
      get(projectRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Convierte el array 'Tools' de la DB en un string para el formulario
          setFormData({
            ...data,
            Tools: data.Tools ? data.Tools.join(', ') : ''
          });
          if (data.ImageHolder) {
            setPreviewUrl(data.ImageHolder);
          }
        }
        setLoading(false);
      });
    }
  }, [id, isNew]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProjectImageFile(file); // Guarda el archivo
      setPreviewUrl(URL.createObjectURL(file)); // Crea la vista previa
    }
  };

  // Handler genérico para todos los campos
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Maneja el checkbox 'visible'
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }

    // Maneja los campos i18n (ej. 'Name.ES')
    if (name.includes('.')) {
      const [fieldName, lang] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [fieldName]: { ...prev[fieldName], [lang]: value }
      }));
    } else {
      // Maneja campos normales
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let finalData = { ...formData };

    try {
      // Primero, sube la imagen si hay una nueva
      if (projectImageFile) {
        console.log("Subiendo imagen de proyecto a Cloudinary...");
        
        const cloudFormData = new FormData();
        cloudFormData.append('file', projectImageFile);
        cloudFormData.append('upload_preset', CLOUDINARY_PORTFOLIO_PRESET); // <-- Usa el preset de portfolio
        
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: cloudFormData,
          }
        );
        
        const data = await response.json();
        
        if (data.secure_url) {
          // Actualiza 'ImageHolder' con la nueva URL de Cloudinary
          finalData.ImageHolder = data.secure_url;
        } else {
          throw new Error('Error al subir la imagen a Cloudinary');
        }
      }

      // Ahora, guarda en Firebase (con la URL de imagen actualizada)
      if (isNew) {
        await createProject(finalData);
      } else {
        await updateProject(id, finalData);
      }
      
      navigate('/admin/portfolio'); // Todo salió bien

    } catch (err) {
      console.error(err);
      setLoading(false);
      // (Aquí podrías añadir un estado de error)
    }
  };

  if (loading && !isNew) {
    return <div className="min-h-screen bg-black text-white p-12">{t('admin_loading')}</div>;
  }

  return (
    <div className="relative min-h-screen bg-black text-white p-6 md:p-12">
      <div className="absolute inset-0 z-0 opacity-50 bg-gradient-to-b from-black via-black to-purple-900/40" />
      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-orange-400">
            {isNew ? t('admin_create_project') : t('admin_edit_project')}
          </h1>
          <Link to="/admin/portfolio" className="text-purple-400 hover:underline">
            {t('admin_cancel')}
          </Link>
        </header>

        {/* --- EL FORMULARIO --- */}
        <form onSubmit={handleSubmit} className="bg-white/10 p-6 rounded-lg space-y-4">
          
          {/* Nombre (ES y EN) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2">{t('admin_project_name')} (ES)</label>
              <input
                type="text" name="Name.ES" value={formData.Name.ES} onChange={handleChange}
                className="w-full p-3 bg-white/10 rounded-lg border border-gray-700" required
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">{t('admin_project_name')} (EN)</label>
              <input
                type="text" name="Name.EN" value={formData.Name.EN} onChange={handleChange}
                className="w-full p-3 bg-white/10 rounded-lg border border-gray-700"
              />
            </div>
          </div>

          {/* Descripción Corta (ES y EN) */}
          <div>
            <label className="block text-gray-400 mb-2">{t('admin_project_desc')} (ES)</label>
            <textarea
              name="ShortDescription.ES" value={formData.ShortDescription.ES} onChange={handleChange}
              rows="3" className="w-full p-3 bg-white/10 rounded-lg border border-gray-700"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">{t('admin_project_desc')} (EN)</label>
            <textarea
              name="ShortDescription.EN" value={formData.ShortDescription.EN} onChange={handleChange}
              rows="3" className="w-full p-3 bg-white/10 rounded-lg border border-gray-700"
            />
          </div>

          {/* Herramientas (como string) */}
          <div>
            <label className="block text-gray-400 mb-2">{t('admin_project_tools')}</label>
            <input
              type="text" name="Tools" value={formData.Tools} onChange={handleChange}
              placeholder={t('admin_project_tools_placeholder')}
              className="w-full p-3 bg-white/10 rounded-lg border border-gray-700"
            />
          </div>

          {/* URLs (App, Imagen, Storage) */}
          <div className="mb-6">
            <label className="block text-gray-400 mb-2">{t('admin_project_photo_upload')}</label>
            <div className="flex items-center gap-4">
              
              {/* Vista previa */}
              <div className="w-24 h-24 rounded-lg bg-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="Vista previa" className="w-full h-full object-cover" />
                ) : (
                  <HiOutlinePhotograph className="w-12 h-12 text-gray-500" />
                )}
              </div>

              {/* Botón de subir (label) */}
              <label 
                htmlFor="photoUpload" 
                className="cursor-pointer w-full text-center p-3 bg-white/10 rounded-lg border border-dashed border-gray-600 hover:border-gray-400 transition-colors"
              >
                <span className="text-purple-400">{t('admin_project_change_photo')}</span>
                {projectImageFile && (
                  <span className="block text-xs text-gray-400 mt-1">{projectImageFile.name}</span>
                )}
              </label>
              <input
                type="file"
                id="photoUpload"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                className="hidden" // El input se oculta
              />
            </div>
          </div>

          {/* URL de la App */}
          <div>
            <label className="block text-gray-400 mb-2">{t('admin_project_app_url')}</label>
            <input
              type="text" name="URLApp" value={formData.URLApp} onChange={handleChange}
              className="w-full p-3 bg-white/10 rounded-lg border border-gray-700"
            />
          </div>

          {/* --- CAMPO 'ImageHolder' (URL) AHORA ES DE SOLO LECTURA --- */}
          <div>
            <label className="block text-gray-400 mb-2">{t('admin_project_image_url')}</label>
            <input
              type="text" 
              name="ImageHolder" 
              value={formData.ImageHolder} // Se actualiza por la subida
              onChange={handleChange} // Permite edición manual si es necesario
              placeholder="Sube una imagen o pega una URL"
              className="w-full p-3 bg-white/5 text-gray-400 rounded-lg border border-gray-700"
            />
          </div>
           <div>
            <label className="block text-gray-400 mb-2">{t('admin_project_storage_path')}</label>
            <input
              type="text" name="imagePath" value={formData.imagePath} onChange={handleChange}
              className="w-full p-3 bg-white/10 rounded-lg border border-gray-700"
            />
          </div>

          {/* Año y Visible */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2">{t('admin_project_year')}</label>
              <input
                type="text" name="year" value={formData.year} onChange={handleChange}
                className="w-full p-3 bg-white/10 rounded-lg border border-gray-700"
              />
            </div>
            <div className="flex items-center justify-start pt-8">
              <input
                type="checkbox" name="visible" id="visible" checked={formData.visible} onChange={handleChange}
                className="w-5 h-5 bg-gray-700 border-gray-600 rounded"
              />
              <label className="text-gray-300 ml-3" htmlFor="visible">{t('admin_project_visible')}</label>
            </div>
          </div>

          {/* Botón Guardar */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              {loading ? "Guardando..." : t('admin_save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;