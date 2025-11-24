import { useState } from 'react';
import useLanguage from '../../hooks/useLanguage';
import {
    HiMenu,
    HiX,
    HiOutlineBriefcase,
    HiOutlineDocumentText,
    HiOutlineMail,
    HiOutlineRss,
    HiOutlineHome
} from 'react-icons/hi';

function CircleMovilMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { lang, t } = useLanguage();

    const currentPath = window.location.pathname;
    const isBlogPage = currentPath === '/blog' || currentPath.startsWith('/blog/');

    return (
        <>
            <nav className="md:hidden fixed top-4 left-4 z-50">
                <div className="relative">
                    {!isMenuOpen && (
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg"
                            aria-label="Toggle menu"
                        >
                            <HiMenu className="text-black w-8 h-8" />
                        </button>
                    )}
                    {isMenuOpen && (
                        <div
                            className="fixed inset-0 bg-black/60 z-40"
                            onClick={() => setIsMenuOpen(false)}
                        ></div>
                    )}
                    <div
                        className={`absolute top-0 left-0 flex items-center justify-center transition-all duration-500 z-50 ${isMenuOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                            }`}
                        // Ajuste para centrar el círculo grande sobre el botón pequeño
                        style={{ transform: 'translate(0px, 0px)', width: '224px', height: '224px' }}
                    >
                        <div className="relative w-56 h-56 bg-white rounded-full shadow-2xl flex items-center justify-center">

                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="absolute w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
                                aria-label="Close menu"
                            >
                                <HiX className="w-6 h-6" />
                            </button>

                            {/* Enlace Superior (Portfolio) */}
                            <a
                                href="/portfolio"
                                className="absolute top-3 left-1/2 -translate-x-1/2 text-black hover:text-purple-600"
                            >
                                <div className="flex flex-col items-center w-20"> {/* Contenedor flex */}
                                    <HiOutlineBriefcase className="w-7 h-7" />
                                    <span className="text-xs font-semibold">{t('portfolio')}</span>
                                </div>
                            </a>

                            {/* Enlace Derecho (Experience) */}
                            <a
                                href="/experience"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-purple-600"
                            >
                                <div className="flex flex-col items-center w-20 text-center"> {/* Contenedor flex */}
                                    <HiOutlineDocumentText className="w-7 h-7" />
                                    <span className="text-xs font-semibold">{t('experience')}</span>
                                </div>
                            </a>

                            {/* Enlace Inferior (Contact) */}
                            <a
                                href="/contact"
                                className="absolute bottom-3 left-1/2 -translate-x-1/2 text-black hover:text-purple-600"
                            >
                                <div className="flex flex-col items-center w-20 text-center"> {/* Contenedor flex */}
                                    <HiOutlineMail className="w-7 h-7" />
                                    <span className="text-xs font-semibold">{t('contact')}</span>
                                </div>
                            </a>

                            {isBlogPage ? (
                                <a
                                    href="/"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-black hover:text-purple-600"
                                >
                                    <div className="flex flex-col items-center w-20 text-center">
                                        <HiOutlineHome className="w-7 h-7" />
                                        <span className="text-xs font-semibold">{t('home')}</span>
                                    </div>
                                </a>
                            ) : (
                                <a
                                    href="/blog"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-black hover:text-purple-600"
                                >
                                    <div className="flex flex-col items-center w-20 text-center">
                                        <HiOutlineRss className="w-7 h-7" />
                                        <span className="text-xs font-semibold">{t('blog')}</span>
                                    </div>
                                </a>
                            )}

                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default CircleMovilMenu;