import Footer from '../components/Footer'; 
import useLanguage from '../../hooks/useLanguage';
import HeaderBack from '../components/HeaderBack';
import { useContactLinks } from '../../services/contactService';
// Icons
import { 
  FaGithub, FaGoogle, FaLinkedin, FaTwitter, FaFacebook, FaInstagram 
} from 'react-icons/fa';
import { HiOutlineMail, HiLink } from 'react-icons/hi';

const iconMap = {
  'Github': FaGithub,
  'LinkedIn': FaLinkedin,
  'Email': HiOutlineMail,
  'Google': FaGoogle,
  'Google Developers': FaGoogle,
  'Twitter X': FaTwitter,
  'Facebook': FaFacebook,
  'Instagram': FaInstagram
};


function ContactPage() {
  const { lang, t } = useLanguage();
  const {contactLinks, loading} = useContactLinks();

  const socialLinks = contactLinks
    .filter(link => link.Type === 'Social' && link.visible)
    .map(link => ({ ...link, Icon: iconMap[link.Name] || HiLink}));

  const personalLinks = contactLinks
    .filter(link => link.Type === 'Personal' && link.visible)
    .map(link => ({ ...link, Icon: iconMap[link.Name] || HiLink })); 

  if (loading) {
    return (
      <div className="relative min-h-screen bg-black text-white flex justify-center items-center">
        <h1 className="text-3xl">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-50 bg-gradient-to-b from-black via-black to-purple-900/40" />
      
      {/* Contenido principal (con z-index) */}
      <div className="relative z-10 flex flex-col flex-1">

        {/* Header con botón de Volver (solo en móvil) */}
        <HeaderBack />
        
        {/* Contenedor principal de la página */}
        <main className="flex-1 flex flex-col justify-center">
          {/* Contenedor del Layout Dividido */}
          <div className="max-w-6xl w-full mx-auto p-4 md:p-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">        
              {/* --- 1. Lado Izquierdo (Imagen y Bienvenida) --- */}
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                {/* Oculta la imagen en móvil, la muestra en escritorio */}
                <div className="hidden md:block w-full h-64 bg-purple-900/50 rounded-lg mb-8">
                  {/* Aquí pondrías tu imagen:
                    <img src="/path/to/colombia-image.jpg" 
                         className="w-full h-full object-cover rounded-lg" />
                  */}
                   <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Tu imagen (Ej. Colombia) aquí
                   </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {t('contact_title') || 'Contáctame'}
                </h1>
                <p className="text-lg text-gray-300">
                  {t('contact_description') || 'Puedes encontrarme en estas plataformas o enviarme un correo. ¡Hablemos!'}
                </p>
                {/* Foto de perfil (solo en móvil, para reemplazar la imagen grande) */}
                <div className="md:hidden flex justify-center my-6">
                  <img 
                    src="/path/to/your-profile-pic.jpg" // CAMBIA ESTO por tu foto
                    alt="Rafael Angulo"
                    className="w-32 h-32 rounded-full border-4 border-purple-500/50"
                  />
                </div>
              </div>
              {/* // --- CAMBIO 3: AÑADIDO EL MAPA DE socialLinks --- */}
              <div className="flex justify-center md:justify-start space-x-4 mt-8 md:hidden">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.urlAction}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link.Name}
                    className="bg-white/10 p-3 rounded-full text-white
                                hover:bg-purple-600/50 hover:text-white
                                transition-all duration-300"
                  >
                    {link.Icon && <link.Icon className="w-6 h-6" />}
                  </a>
                ))}
              </div>
              {/* --- 2. Lado Derecho (Lista de Enlaces) --- */}
              <div className="md:w-1/2 p-8 md:p-12 md:border-l border-white/10">
                <div className="flex flex-col space-y-4">
                  
                  {personalLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.urlAction}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-white/10 p-5 rounded-xl flex items-center space-x-4
                                 hover:bg-purple-600/50 hover:shadow-lg hover:-translate-y-1
                                 transition-all duration-300"
                    >
                      {/* Icono */}
                      <div className="bg-white/10 p-3 rounded-lg group-hover:bg-white group-hover:text-purple-700 transition-colors duration-300">
                        {link.Icon && <link.Icon className="w-6 h-6" />}
                      </div>
                      
                      {/* Texto */}
                      <div>
                        <p className="text-lg font-semibold">{link.Name}</p>
                        <p className="text-sm text-gray-300 group-hover:text-white">
                          {link.infoName}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}

export default ContactPage;