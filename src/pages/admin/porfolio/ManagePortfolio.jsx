import { Link, useNavigate } from 'react-router';
import useLanguage from '../../../hooks/useLanguage';
import { useProjects, deleteProject } from '../../../services/projectService'; // Tu servicio
import { HiOutlinePencilAlt, HiOutlineTrash, HiPlus } from 'react-icons/hi';

const ManagePortfolio = () => {
  const { t, lang } = useLanguage();
  const { projects, loading } = useProjects(); // Hook para leer
  const navigate = useNavigate();

  const handleDelete = (id) => {
    if (window.confirm(t('admin_delete_confirm'))) {
      deleteProject(id).catch(err => console.error("Error al eliminar:", err));
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/portfolio/edit/${id}`);
  };

  return (
    <div className="relative min-h-screen bg-black text-white p-6 md:p-12">
      <div className="absolute inset-0 z-0 opacity-50 bg-gradient-to-b from-black via-black to-purple-900/40" />

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-orange-400">
            {t('admin_manage_portfolio')}
          </h1>
          <Link to="/admin" className="text-purple-400 hover:underline">
            {t('admin_back_to_dash')}
          </Link>
        </header>

        {/* Botón para crear nuevo */}
        <div className="flex justify-end mb-6">
          <Link
            to="/admin/portfolio/new" 
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            <HiPlus /> {t('admin_create_project')}
          </Link>
        </div>

        {/* Lista de Proyectos */}
        {loading && <p>{t('admin_loading')}</p>}
        {!loading && (
          <div className="space-y-4">
            {projects.map(project => (
              <div key={project.id} className="bg-white/5 p-4 rounded-lg flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img 
                    src={project.ImageHolder} 
                    alt={project.Name.ES} 
                    className="w-16 h-16 rounded-lg object-cover hidden sm:block"
                  />
                  <div>
                    <h3 className="font-bold">
                      {project.Name ? (project.Name[lang.toUpperCase()] || project.Name.ES || 'Sin Título') : 'Sin Título'}
                    </h3>
                    <p className="text-sm text-gray-400">{project.year} | {project.Tools.join(', ')}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(project.id)} 
                    title={t('admin_edit_item')}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded"
                  >
                    <HiOutlinePencilAlt className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(project.id)}
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
        
      </div>
    </div>
  );
};

export default ManagePortfolio;