import { Link } from 'react-router';
import useLanguage from '../hooks/useLanguage';
import HeaderBack from './components/HeaderBack';
import Footer from './components/Footer';
import SEO from '../components/SEO';

function PrivacyPage() {
    const { t, lang } = useLanguage();

    return (
        <>
            <SEO
                title={lang === "es" ? "Política de Privacidad" : "Privacy Policy"}
                description={lang === "es" ? "Política de privacidad del sitio de Rafael Angulo." : "Privacy policy for Rafael Angulo's site."}
                url="/privacy"
            />
            <div className="relative min-h-screen bg-black text-white flex flex-col overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 z-0 opacity-50 bg-gradient-to-b from-black via-black to-purple-900/40" />

                <div className="relative z-10 flex flex-col flex-1">
                    <HeaderBack />

                    <main className="flex-1 max-w-4xl mx-auto w-full p-6 md:p-12 mt-8">
                        <h1 className="text-3xl md:text-5xl font-bold text-orange-500 mb-8">
                            {lang === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}
                        </h1>

                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl p-6 md:p-10 space-y-6 text-gray-300">

                            <section>
                                <h2 className="text-xl font-bold text-white mb-2">
                                    {lang === 'es' ? '1. Información que Recopilamos' : '1. Information We Collect'}
                                </h2>
                                <p>
                                    {lang === 'es'
                                        ? 'Cuando publicas un comentario en nuestro blog, recopilamos tu dirección IP pública.'
                                        : 'When you post a comment on our blog, we collect your public IP address.'}
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-white mb-2">
                                    {lang === 'es' ? '2. Cómo Usamos tu Información' : '2. How We Use Your Information'}
                                </h2>
                                <p>
                                    {lang === 'es'
                                        ? 'Tu dirección IP se utiliza exclusivamente con fines de seguridad y moderación, específicamente para prevenir spam y detectar comportamientos automatizados (bots). No compartimos esta información con terceros, excepto cuando sea necesario para cumplir con la ley o proteger la integridad de nuestro sitio.'
                                        : 'Your IP address is used exclusively for security and moderation purposes, specifically to prevent spam and detect automated behaviors (bots). We do not share this information with third parties unless necessary to comply with the law or protect the integrity of our site.'}
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-white mb-2">
                                    {lang === 'es' ? '3. Almacenamiento' : '3. Storage'}
                                </h2>
                                <p>
                                    {lang === 'es'
                                        ? 'Esta información se almacena de forma segura en nuestra base de datos junto con tu comentario. Para proteger tu privacidad, las direcciones IP se eliminan automáticamente de nuestros registros después de 72 horas.'
                                        : 'This information is securely stored in our database along with your comment. To protect your privacy, IP addresses are automatically deleted from our records after 72 hours.'}
                                </p>
                            </section>

                            <div className="pt-6 border-t border-gray-700/50">
                                <Link to="/" className="text-orange-400 hover:text-orange-300 transition-colors">
                                    {lang === 'es' ? 'Volver al Inicio' : 'Back to Home'}
                                </Link>
                            </div>

                        </div>
                    </main>

                    <Footer />
                </div>
            </div>
        </>
    );
}

export default PrivacyPage;
