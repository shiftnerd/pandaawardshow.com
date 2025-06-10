const fs = require('fs');
const path = require('path');

const DIST_DIR = './'; // Root of your static site

function getBaseUrl() {
  const cnamePath = path.join(DIST_DIR, 'CNAME');
  if (fs.existsSync(cnamePath)) {
    const domain = fs.readFileSync(cnamePath, 'utf-8').trim();
    return `https://${domain}`;
  }
  // Fallback to GitHub Pages URL
  const username = 'yourusername';      // <-- replace this
  const repo = 'your-repo-name';        // <-- replace this
  return `https://${username}.github.io/${repo}`;
}

function getHtmlFiles(dir, files = []) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getHtmlFiles(fullPath, files);
    } else if (file.endsWith('.html')) {
      const relativePath = path.relative(DIST_DIR, fullPath);
      files.push(relativePath.replace(/\\/g, '/'));
    }
  });
  return files;
}

const BASE_URL = getBaseUrl();
const pages = getHtmlFiles(DIST_DIR);
const urls = pages.map(p =>
  `<url><loc>${BASE_URL}/${p.replace(/index\.html$/, '').replace(/\/$/, '')}</loc></url>`
);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

fs.writeFileSync('sitemap.xml', sitemap);
console.log(`✅ sitemap.xml generated using base URL: ${BASE_URL}`);
