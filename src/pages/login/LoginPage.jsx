import { useState } from 'react';
import { login, sendPublicPasswordResetEmail } from '../../services/authService';
import { useNavigate } from 'react-router';
import useLanguage from '../../hooks/useLanguage';
import SEO from '../../components/SEO';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError('Error al iniciar sesión. Verifica tus credenciales.');
      console.error(err);
    }
  };

  const handlePasswordReset = async () => {
    setError(null);
    setMessage(null);
    
    if (!email) {
      setError(t('login_email_required_for_reset'));
      return;
    }

    try {
      // Usa la nueva función pública
      await sendPublicPasswordResetEmail(email); 
      setMessage(t('login_password_reset_sent'));
    } catch (err) {
      console.error(err);
      setError(t('login_password_reset_error'));
    }
  };

  return (
  <>
    <SEO title="Admin Login" url="/login" />
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-white/10 p-8 rounded-lg shadow-xl w-full max-w-sm">
          <h2 className="text-2xl font-bold text-orange-400 mb-6 text-center">{t('login_title')}</h2>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="email">{t('login_email')}</label>
            <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-white/10 rounded-lg border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
            required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-400 mb-2" htmlFor="password">{t('login_password')}</label>
            <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-white/10 rounded-lg border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
            required
            />
          </div>

          {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
          {message && <p className="text-green-300 text-sm mb-4 text-center">{message}</p>}

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold py-2 px-4 rounded-lg transition duration-300">
            {t('login_btn')}
          </button>

          <div className="text-center mt-6">
            <button
              type="button" 
              onClick={handlePasswordReset}
              className="text-sm text-gray-400 hover:text-orange-400 hover:underline transition-colors"
            >
              {t('login_forgot_password')}
            </button>
          </div>
        </form>
      </div>
  </>
 );
};

export default LoginPage;