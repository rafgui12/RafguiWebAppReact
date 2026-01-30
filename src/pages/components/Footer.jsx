import useLanguage from '../../hooks/useLanguage';
import { Link } from 'react-router';

function Footer() {
  const { lang, t } = useLanguage();
  const startYear = 2020;
  const currentYear = new Date().getFullYear();
  const yearText = startYear === currentYear ? startYear : `${startYear} - ${currentYear}`;

  return (
    <footer className="w-full py-6 px-8">
      <div className="border-t border-white/10 pt-6">
        <p className="text-sm text-gray-400">
          © {yearText} {t("footer_text")}
        </p>
        <Link to="/privacy" className="text-sm text-gray-500 hover:text-orange-400 ml-4 transition-colors">
          {lang === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}
        </Link>
      </div>
    </footer>
  );
}

export default Footer;