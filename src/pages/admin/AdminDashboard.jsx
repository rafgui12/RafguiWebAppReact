import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../services/authService';
import { useNavigate, Link } from 'react-router';
import useLanguage from '../../hooks/useLanguage';
import SEO from '../../components/SEO';
import { 
  HiOutlineRss, 
  HiOutlineBriefcase, 
  HiOutlineDocumentText,
  HiOutlineUserCircle,
  HiOutlineMail,
  HiOutlineLogout
} from 'react-icons/hi';

// --- Componente de Tarjeta de Navegación ---
// (Un pequeño componente interno para no repetir código)
const DashboardCard = ({ to, icon, title }) => (
  <Link
    to={to}
    className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl p-6
               flex flex-col items-center justify-center text-center
               text-gray-300 hover:text-white hover:bg-white/10
               hover:shadow-purple-500/30 transition-all duration-300"
  >
    <div className="text-purple-400 mb-4">{icon}</div>
    <span className="text-lg font-semibold">{title}</span>
  </Link>
);

// --- Componente Principal del Dashboard ---
const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <>
      <SEO />
      <div className="relative min-h-screen bg-black text-white flex flex-col items-center p-6 md:p-12">
        
        {/* Fondo */}
        <div className="absolute inset-0 z-0 opacity-50 bg-gradient-to-b from-black via-black to-purple-900/40" />
        
        <div className="relative z-10 w-full max-w-5xl">
          
          {/* --- Encabezado --- */}
          <header className="flex justify-between items-center mb-6">
            
            {/* Lado Izquierdo: Título */}
            <h1 className="text-3xl font-bold text-orange-400">
              {t('admin_title')}
            </h1>

            {/* Lado Derecho: Acciones de Usuario */}
            <div className="flex items-center gap-2 md:gap-4">
              
              {/* Email del usuario (oculto en pantallas pequeñas) */}
              <span className="hidden sm:inline text-gray-400 text-sm">
                {currentUser ? currentUser.email : 'Admin'}
              </span>
              
              {/* Botón de Perfil (Icono) */}
              <Link 
                to="/admin/profile"
                title={t('admin_profile_tooltip')} // Tooltip
                className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <HiOutlineUserCircle className="w-6 h-6" />
              </Link>

              {/* Botón de Logout (Icono) */}
              <button 
                onClick={handleLogout}
                title={t('admin_logout_tooltip')} // Tooltip
                className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <HiOutlineLogout className="w-6 h-6" />
              </button>
            </div>
          </header>

          <hr className="border-gray-700/50 my-8"/>

          {/* --- Cuadrícula de Navegación --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <DashboardCard 
              to="/admin/blog"
              title={t('admin_manage_blog')}
              icon={<HiOutlineRss className="w-12 h-12" />}
            />
            
            <DashboardCard 
              to="/admin/portfolio"
              title={t('admin_manage_portfolio')}
              icon={<HiOutlineBriefcase className="w-12 h-12" />}
            />

            <DashboardCard 
              to="/admin/experience"
              title={t('admin_manage_experience')}
              icon={<HiOutlineDocumentText className="w-12 h-12" />}
            />
            <DashboardCard 
              to="/admin/contact"
              title={t('admin_manage_contact')}
              icon={<HiOutlineMail className="w-12 h-12" />}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;