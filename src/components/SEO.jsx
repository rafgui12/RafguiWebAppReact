import React from 'react';

// --- TUS VALORES POR DEFECTO (Fusionados con rafgui.com) ---
const DEFAULT_TITLE = "Rafael Angulo (Rafgui)";
const DEFAULT_SITE_NAME = "Rafael's Website Blog"; // De tu <meta property="og:site_name">
const DEFAULT_DESCRIPTION = "Explora el portafolio, blog y experiencia profesional de Rafael Angulo Ealo, desarrollador de software especializado en React, Flutter, y Node.js.";
const DEFAULT_KEYWORDS = "Rafael Angulo, Rafgui, Portafolio, Blog, React, Flutter, Node.js, JavaScript, Desarrollador, Software, Developer, Colombia";
const DEFAULT_AUTHOR = "Rafgui012"; // De tu <meta name="author">

// Tus imágenes específicas de 'og' y 'twitter'
const DEFAULT_OG_IMAGE = "https://res.cloudinary.com/debfpy8a2/image/upload/v1762289616/a-world-webpage-icon_fmo2v2.png";
const DEFAULT_TWITTER_IMAGE = "https://res.cloudinary.com/debfpy8a2/image/upload/v1762289615/rd-blog_j8bbwu.png";

const SITE_URL = "https://rafgui.com"; // O tu URL de Firebase
const TWITTER_HANDLE = "@rafaelealo"; // De tu <meta name="twitter:site">
// ------------------------------------------------

const SEO = ({ 
  title, 
  description, 
  keywords,
  ogImage,       // Prop para imagen OG específica
  twitterImage,  // Prop para imagen de Twitter específica
  url,
  type = 'website'
}) => {

  // Combina los valores por defecto con los que pases por props
  const seo = {
    title: title || DEFAULT_TITLE,
    description: description || DEFAULT_DESCRIPTION,
    keywords: keywords || DEFAULT_KEYWORDS,
    ogImage: ogImage || DEFAULT_OG_IMAGE,
    twitterImage: twitterImage || DEFAULT_TWITTER_IMAGE,
    url: `${SITE_URL}${url || ''}`, // Crea la URL canónica completa
  };

  // En React 19, simplemente devuelves los tags.
  // React los "subirá" al <head> automáticamente.
  return (
    <>
      <title>{seo.title}</title>
      
      {/* Tags de SEO Estándar */}
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <meta name="author" content={DEFAULT_AUTHOR} />
      <link rel="canonical" href={seo.url} />
      
      {/* Open Graph (para Facebook, LinkedIn, etc.) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.ogImage} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:site_name" content={DEFAULT_SITE_NAME} />
      <meta property="og:locale" content="es_CO" />

      {/* Twitter Card (para X) */}
      {/* NOTA: 'summary_large_image' es casi siempre mejor que 'summary'.
        Muestra una vista previa de imagen grande.
      */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.twitterImage} />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
    </>
  );
};

export default SEO;