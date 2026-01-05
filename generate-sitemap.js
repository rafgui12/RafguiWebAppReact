
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const BASE_URL = process.env.VITE_BASE_URL || 'https://rafgui.com';
const OUTPUT_FILE = path.join(__dirname, 'public', 'sitemap.xml');

// Static routes to include in the sitemap
const routes = [
    '/',
    '/portfolio',
    '/experience',
    '/contact',
    '/blog',
];

const generateSitemap = () => {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
            .map((route) => {
                return `  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
            })
            .join('\n')}
</urlset>`;

    fs.writeFileSync(OUTPUT_FILE, sitemap);
    console.log(`✅ Sitemap generated at ${OUTPUT_FILE}`);
};

generateSitemap();
