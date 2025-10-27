import useLanguage from '../../hooks/useLanguage';

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
      </div>
    </footer>
  );
}

export default Footer;