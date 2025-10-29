import { Link } from 'react-router';
import useLanguage from '../../hooks/useLanguage';

const ManageExperience = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-orange-400 mb-8">
        {t('admin_manage_experience')} (Próximamente)
      </h1>
      <Link to="/admin" className="text-purple-400 hover:underline">
        {t('admin_back_to_dash')}
      </Link>
    </div>
  );
};
export default ManageExperience;