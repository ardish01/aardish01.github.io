import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');
const distDir = resolve(__dirname, 'dist');
const siteUrl = 'https://www.aardishduwal.com.np';

const pages = [
  { path: '/', title: 'Aardish Duwal — Full Stack Developer & Data Specialist', desc: 'Portfolio of Aardish Duwal, a full stack developer and data specialist based in Bhaktapur, Nepal, building for the web and exploring machine learning.', priority: '1.0' },
  { path: '/about', title: 'About — Aardish Duwal', desc: 'Learn about Aardish Duwal, a full stack developer and data specialist based in Bhaktapur, Nepal.', priority: '0.8' },
  { path: '/projects', title: 'Projects — Aardish Duwal', desc: 'Selected work: web platforms, predictive models, and data explorations by Aardish Duwal.', priority: '0.8' },
  { path: '/capabilities', title: 'Capabilities — Aardish Duwal', desc: 'Tools and technologies: TypeScript, React, Python, SQL, and more.', priority: '0.8' },
  { path: '/contact', title: 'Contact — Aardish Duwal', desc: 'Get in touch with Aardish Duwal — Full Stack Developer & Data Specialist in Bhaktapur, Nepal.', priority: '0.8' },
];

function buildHeadFor(path) {
  const page = pages.find(p => p.path === path) || pages[0];
  const url = `${siteUrl}${path}`;
  const ogImage = `${siteUrl}/assets/aardish-portrait-og-Bglc5jFs.jpg`;
  
  return `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#070d0e" />
    <meta name="description" content="${page.desc}" />
    <meta property="og:title" content="${page.title}" />
    <meta property="og:description" content="${page.desc}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:site_name" content="Aardish Duwal" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Aardish Duwal — Full Stack Developer · Data · ML" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${page.title}" />
    <meta name="twitter:description" content="${page.desc}" />
    <meta name="twitter:image" content="${ogImage}" />
    <meta name="twitter:image:alt" content="Aardish Duwal — Full Stack Developer · Data · ML" />
    <link rel="canonical" href="${url}" />
    <link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/fonts/manrope-400.woff2" />
    <link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/fonts/dmmono-400.woff2" />
    <link rel="preload" as="image" href="${siteUrl}/assets/aardish-portrait-960-Dv-D8feF.webp" type="image/webp" />
    <link rel="icon" href="/assets/images/A.svg" type="image/svg+xml" />
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Aardish Duwal",
      "url": "${siteUrl}/",
      "jobTitle": "Full Stack Developer",
      "worksFor": {
        "@type": "Organization",
        "name": "NightVision"
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Bhaktapur",
        "addressCountry": "NP"
      },
      "email": "mailto:aardish01@gmail.com",
      "sameAs": [
        "https://github.com/ardish01",
        "https://www.linkedin.com/in/aardish-duwal-0371672a2",
        "https://www.instagram.com/aardish_duwal/",
        "https://x.com/aardishduw34120",
        "https://www.facebook.com/profile.php?id=100078305356282"
      ]
    }
    </script>
    <title>${page.title}</title>
  `.trim();
}

function injectHead(html, newHead) {
  const headEnd = html.indexOf('</head>');
  if (headEnd === -1) return html;
  return html.slice(0, headEnd) + '\n' + newHead + '\n' + html.slice(headEnd);
}

function main() {
  // Read base index.html
  const baseHtml = readFileSync(resolve(distDir, 'index.html'), 'utf-8');
  
  // Generate index.html for each route
  for (const page of pages) {
    const head = buildHeadFor(page.path);
    const outHtml = injectHead(baseHtml, head);
    
    let outPath;
    if (page.path === '/') {
      outPath = resolve(distDir, 'index.html');
    } else {
      const dir = resolve(distDir, page.path.slice(1));
      mkdirSync(dir, { recursive: true });
      outPath = resolve(dir, 'index.html');
    }
    writeFileSync(outPath, outHtml);
    console.log(`✓ Generated ${page.path} -> ${outPath}`);
  }
  
  // Generate sitemap.xml
  const today = new Date().toISOString().split('T')[0];
  const urls = pages.map(page => {
    const url = page.path === '/' ? siteUrl : `${siteUrl}${page.path}`;
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }).join('\n');
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  
  writeFileSync(resolve(distDir, 'sitemap.xml'), sitemap);
  console.log('✓ Generated sitemap.xml');
  
  // Generate robots.txt
  const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
  writeFileSync(resolve(distDir, 'robots.txt'), robots);
  console.log('✓ Generated robots.txt');
  
  console.log('\n✅ SEO generation complete!');
}

main();