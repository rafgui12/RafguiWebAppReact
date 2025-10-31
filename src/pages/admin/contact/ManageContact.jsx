import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import useLanguage from '../../../hooks/useLanguage';
import {
  useContactLinks,
  createContactLink,
  updateContactLink,
  deleteContactLink,
  useContactPageConfig,
  updateContactPageConfig
} from '../../../services/contactService';
import { HiOutlinePencilAlt, HiOutlineTrash, HiPlus, HiOutlinePhotograph } from 'react-icons/hi';

// --- Constantes de Cloudinary ---
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_CONTACT_PRESET = import.meta.env.VITE_CLOUDINARY_CONTACT_PRESET;

// --- COMPONENTE PRINCIPAL DE LA PÁGINA ---
const ManageContact = () => {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen bg-black text-white p-6 md:p-12">
      <div className="absolute inset-0 z-0 opacity-50 bg-gradient-to-b from-black via-black to-purple-900/40" />

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-orange-400">
            {t('admin_manage_contact')}
          </h1>
          <Link to="/admin" className="text-purple-400 hover:underline">
            {t('admin_back_to_dash')}
          </Link>
        </header>

        {/* Sección 1: Formulario de Imágenes */}
        <ImageManager />

        <hr className="border-gray-700/50 my-12"/>

        {/* Sección 2: Lista y Formulario de Links */}
        <LinksManager />
        
      </div>
    </div>
  );
};
export default ManageContact;

// --- COMPONENTE HIJO 1: GESTOR DE IMÁGENES ---
const ImageManager = () => {
  const { t } = useLanguage();
  const { config, loading } = useContactPageConfig();
  const [images, setImages] = useState({ mainImageUrl: '', profileImageUrl: '' });
  const [files, setFiles] = useState({ main: null, profile: null });
  const [previews, setPreviews] = useState({ main: '', profile: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading) {
      setImages(config);
      setPreviews({ main: config.mainImageUrl, profile: config.profileImageUrl });
    }
  }, [loading, config]);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
      setPreviews(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONTACT_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleImageSave = async () => {
    setIsSaving(true);
    setMessage('');
    
    let newMainUrl = images.mainImageUrl;
    let newProfileUrl = images.profileImageUrl;

    try {
      if (files.main) {
        newMainUrl = await uploadToCloudinary(files.main);
      }
      if (files.profile) {
        newProfileUrl = await uploadToCloudinary(files.profile);
      }

      await updateContactPageConfig({
        mainImageUrl: newMainUrl,
        profileImageUrl: newProfileUrl
      });
      
      setImages({ mainImageUrl: newMainUrl, profileImageUrl: newProfileUrl });
      setFiles({ main: null, profile: null });
      setMessage(t('admin_profile_update_success'));
    } catch (err) {
      console.error(err);
      setMessage(t('admin_profile_error_generic'));
    }
    setIsSaving(false);
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold text-purple-400 mb-6">{t('admin_contact_images')}</h2>
      {message && <p className="text-green-300 mb-4">{message}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cargador de Imagen Principal */}
        <ImageUploader
          title={t('admin_contact_main_image')}
          previewUrl={previews.main}
          onChange={(e) => handleFileChange(e, 'main')}
          fileName={files.main?.name}
        />
        {/* Cargador de Imagen de Perfil */}
        <ImageUploader
          title={t('admin_contact_profile_image')}
          previewUrl={previews.profile}
          onChange={(e) => handleFileChange(e, 'profile')}
          fileName={files.profile?.name}
        />
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={handleImageSave}
          disabled={isSaving}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          {isSaving ? "..." : t('admin_save')}
        </button>
      </div>
    </section>
  );
};

// Componente helper para el cargador de imágenes
const ImageUploader = ({ title, previewUrl, onChange, fileName }) => (
  <div className="bg-white/5 p-4 rounded-lg">
    <label className="block text-gray-400 mb-2">{title}</label>
    <div className="flex items-center gap-4">
      <div className="w-24 h-24 rounded-lg bg-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <HiOutlinePhotograph className="w-12 h-12 text-gray-500" />
        )}
      </div>
      <label htmlFor={`upload-${title}`} className="cursor-pointer w-full text-center p-3 bg-white/10 rounded-lg border border-dashed border-gray-600 hover:border-gray-400">
        <span className="text-purple-400">{fileName || 'Click to upload'}</span>
      </label>
      <input type="file" id={`upload-${title}`} accept="image/*" onChange={onChange} className="hidden" />
    </div>
  </div>
);

// --- COMPONENTE HIJO 2: GESTOR DE ENLACES ---
const LinksManager = () => {
  const { t } = useLanguage();
  const { contactLinks, loading } = useContactLinks();
  const [editingLink, setEditingLink] = useState(null); // null, {}, {id...}

  const handleAddNew = () => setEditingLink({ Name: '', Type: 'Personal', infoName: '', urlAction: '', visible: true });
  const handleEdit = (link) => setEditingLink(link);
  const handleCancel = () => setEditingLink(null);

  const handleDelete = (id) => {
    if (window.confirm(t('admin_delete_confirm'))) {
      deleteContactLink(id);
    }
  };

  const handleSubmit = (formData) => {
    if (editingLink.id) {
      updateContactLink(editingLink.id, formData).then(handleCancel);
    } else {
      createContactLink(formData).then(handleCancel);
    }
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-purple-400">{t('admin_contact_links')}</h2>
        {!editingLink && (
          <button onClick={handleAddNew} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition">
            <HiPlus /> {t('admin_create_new')}
          </button>
        )}
      </div>

      {editingLink && (
        <LinkForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          initialData={editingLink}
        />
      )}

      {loading && <p>{t('admin_loading')}</p>}
      {!loading && (
        <div className="space-y-4 mt-8">
          {contactLinks.map(link => (
            <div key={link.id} className="bg-white/5 p-4 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-bold">{link.Name} <span className="text-xs text-gray-400">({link.Type})</span></h3>
                <p className="text-sm text-gray-400">{link.infoName}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(link)} className="p-2 text-gray-400 hover:text-white"><HiOutlinePencilAlt className="w-5 h-5" /></button>
                <button onClick={() => handleDelete(link.id)} className="p-2 text-gray-400 hover:text-red-500"><HiOutlineTrash className="w-5 h-5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

// Componente helper para el formulario de links
const LinkForm = ({ onSubmit, onCancel, initialData }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ Name: '', Type: 'Personal', infoName: '', urlAction: '', visible: true });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
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

  return (
    <form onSubmit={handleSubmit} className="bg-white/10 p-6 rounded-lg space-y-4">
      <h3 className="text-xl font-semibold mb-4">{initialData.id ? t('admin_edit_item') : t('admin_create_new')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 mb-2">{t('admin_link_name')}</label>
          <input type="text" name="Name" value={formData.Name} onChange={handleChange} className="w-full p-3 bg-white/10 rounded-lg border border-gray-700" required />
        </div>
        <div>
          <label className="block text-gray-400 mb-2">{t('admin_link_type')}</label>
          <select name="Type" value={formData.Type} onChange={handleChange} className="w-full p-3 bg-white/10 rounded-lg border border-gray-700">
            <option value="Personal">{t('admin_link_type_personal')}</option>
            <option value="Social">{t('admin_link_type_social')}</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-gray-400 mb-2">{t('admin_link_infoname')}</label>
        <input type="text" name="infoName" value={formData.infoName} onChange={handleChange} className="w-full p-3 bg-white/10 rounded-lg border border-gray-700" />
      </div>
      <div>
        <label className="block text-gray-400 mb-2">{t('admin_link_url')}</label>
        <input type="text" name="urlAction" value={formData.urlAction} onChange={handleChange} className="w-full p-3 bg-white/10 rounded-lg border border-gray-700" required />
      </div>
      <div className="flex items-center">
        <input type="checkbox" name="visible" id="visible" checked={formData.visible} onChange={handleChange} className="w-5 h-5 bg-gray-700 border-gray-600 rounded" />
        <label className="text-gray-300 ml-3" htmlFor="visible">{t('admin_project_visible')}</label>
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition">{t('admin_cancel')}</button>
        <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition">{t('admin_save')}</button>
      </div>
    </form>
  );
};