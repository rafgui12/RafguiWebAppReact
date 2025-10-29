import { useState, useEffect } from 'react';
import { HiOutlinePhotograph } from 'react-icons/hi';
import { Link } from 'react-router';
import useLanguage from '../../hooks/useLanguage';
import { useAuth } from '../../context/AuthContext';
import { 
  updateUserProfile, 
  sendVerificationEmail, 
  sendResetPasswordEmail 
} from '../../services/authService';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const AdminProfile = () => {
  const { t } = useLanguage();
  const { currentUser } = useAuth(); // Obtiene el usuario de nuestro Context

  // Estados para los campos del formulario
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Estados para mensajes de feedback
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Rellena el formulario con los datos actuales del usuario cuando se carga
  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      setPhotoURL(currentUser.photoURL || '');
      setPreviewUrl(currentUser.photoURL || '');
    }
  }, [currentUser]);

  // Limpia los mensajes después de unos segundos
  const clearMessages = () => {
    setTimeout(() => {
      setMessage('');
      setError('');
    }, 4000);
  };

  // --- Handlers para cada formulario ---

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file); // Guarda el archivo para subir
      // Genera una URL local para la vista previa
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      let finalPhotoUrl = photoURL; 

      if (profileImageFile) {
        console.log("Subiendo nueva imagen a Cloudinary...");
        
        const formData = new FormData();
        formData.append('file', profileImageFile);
        
        // --- CORREGIDO AQUÍ ---
        // Cambiado de 'meta.env' a 'import.meta.env'
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET); 
        
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );
        
        const data = await response.json();
        
        if (data.secure_url) {
          finalPhotoUrl = data.secure_url; 
          setPhotoURL(finalPhotoUrl); 
        } else {
          // Lanza un error más específico si Cloudinary responde con error
          console.error("Error en la data de Cloudinary:", data);
          throw new Error(data.error?.message || 'Error al subir la imagen a Cloudinary');
        }
      }

      await updateUserProfile({ 
        displayName, 
        photoURL: finalPhotoUrl 
      });
      
      setMessage(t('admin_profile_update_success'));
      setProfileImageFile(null); 

    } catch (err) {
      console.error(err);
      setError(err.message || t('admin_profile_error_generic')); // Muestra un error más específico
    }
    setLoading(false);
    clearMessages();
  };

  const handleSendVerification = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await sendVerificationEmail();
      setMessage('Verification email sent!');
    } catch (err) {
      console.error("Firebase Verification Error:", err); 
      console.log("Error Code:", err.code);         
      
      if (err.code === 'auth/too-many-requests') {
        setError("Too many requests. Please wait a few minutes before trying again.");
      } else {
        setError(t('admin_profile_error_generic'));
      }
    }
    setLoading(false);
    clearMessages();
  };

  const handlePasswordReset = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await sendResetPasswordEmail();
      setMessage(t('admin_profile_password_reset_sent'));
    } catch (err) {
      setError(t('admin_profile_error_generic'));
    }
    setLoading(false);
    clearMessages();
  };

  // Helper para el botón de submit
  const SubmitButton = ({ text }) => (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
    >
      {loading ? 'Saving...' : text}
    </button>
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <p>Loading user...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center p-6 md:p-12">
      {/* Fondo */}
      <div className="absolute inset-0 z-0 opacity-50 bg-gradient-to-b from-black via-black to-purple-900/40" />
      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-orange-400">
            {t('admin_profile_title')}
          </h1>
          <Link to="/admin" className="text-purple-400 hover:underline">
            {t('admin_back_to_dash')}
          </Link>
        </header>

        {/* Feedback Messages */}
        {message && <div className="mb-4 p-3 rounded-lg bg-green-500/20 text-green-300">{message}</div>}
        {error && <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-300">{error}</div>}

        {/* --- Form 1: Perfil Básico  --- */}
        <form onSubmit={handleProfileUpdate} className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8">
          {/* ... (displayName and photoURL fields) ... */}
           <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="displayName">{t('admin_profile_display_name')}</label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full p-3 bg-white/10 rounded-lg border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
          {/* --- NUEVO: Cargador de Foto de Perfil --- */}
          <div className="mb-6">
            <label className="block text-gray-400 mb-2">{t('admin_profile_photo_upload')}</label>
            <div className="flex items-center gap-4">
              
              {/* Vista previa de la imagen */}
              <div className="w-24 h-24 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Vista previa" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <HiOutlinePhotograph className="w-12 h-12 text-gray-500" />
                )}
              </div>

              {/* Botón para subir (que es un label) */}
              <label 
                htmlFor="photoUpload" 
                className="cursor-pointer w-full text-center p-3 bg-white/10 rounded-lg border border-dashed border-gray-600 hover:border-gray-400 transition-colors"
              >
                <span className="text-purple-400">{t('admin_profile_change_photo')}</span>
                {profileImageFile && (
                  <span className="block text-xs text-gray-400 mt-1">{profileImageFile.name}</span>
                )}
              </label>
              <input
                type="file"
                id="photoUpload"
                accept="image/png, image/jpeg, image/webp" // Acepta solo imágenes
                onChange={handleFileChange}
                className="hidden" // El input está oculto, usamos el label
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Saving...' : t('admin_profile_update_profile')}
          </button>
        </form>

        {/* --- 5. Bloque 2: Email (SIMPLIFICADO) --- */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-xl font-semibold text-orange-400 mb-4">{t('admin_profile_email_address')}</h2>
          <p className="text-gray-300 mb-2">{currentUser.email}</p>
          <div className="flex items-center gap-2">
            <span className={`text-sm px-2 py-0.5 rounded-full ${currentUser.emailVerified ? 'bg-green-500/30 text-green-300' : 'bg-yellow-500/30 text-yellow-300'}`}>
              {currentUser.emailVerified ? t('admin_profile_verified') : t('admin_profile_not_verified')}
            </span>
            {!currentUser.emailVerified && (
              <button onClick={handleSendVerification} disabled={loading} className="text-sm text-purple-400 hover:underline disabled:opacity-50">
                {loading ? 'Sending...' : t('admin_profile_send_verification')}
              </button>
            )}
          </div>
          {/* (El formulario de 'update email' se ha eliminado) */}
        </div>

        {/* --- 6. Bloque 3: Contraseña (SIMPLIFICADO) --- */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-orange-400 mb-4">{t('admin_profile_password')}</h2>
          <button
            onClick={handlePasswordReset}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Sending...' : t('admin_profile_send_password_reset')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;