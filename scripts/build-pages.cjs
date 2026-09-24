// Builds the production bundle and publishes it to docs/ for GitHub Pages.
// Usage: node scripts/build-pages.cjs
//
// GitHub Pages serves this repo from main branch /docs, at the custom domain
// in public/CNAME (oceankingwholesalebh.com), served from root. Because the
// app is a client-side-routed SPA, this script also injects the standard
// redirect trick so deep links and page refreshes (e.g. /fish/salmon) don't
// 404.

const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const docs = path.join(root, 'docs');

console.log('> vite build');
execSync('npx vite build', { cwd: root, stdio: 'inherit' });

const indexPath = path.join(dist, 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

const restoreScript = `    <script>
      (function () {
        var redirect = sessionStorage.redirect;
        delete sessionStorage.redirect;
        if (redirect && redirect !== location.href) {
          history.replaceState(null, null, redirect);
        }
      })();
    </script>
`;

if (!html.includes('sessionStorage.redirect')) {
  const headOpenTag = /<head>\r?\n/;
  if (!headOpenTag.test(html)) {
    throw new Error('Could not find <head> tag in dist/index.html to inject into');
  }
  html = html.replace(headOpenTag, (match) => match + restoreScript);
  fs.writeFileSync(indexPath, html);
}

const notFound = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ocean Fish Market</title>
    <script>
      sessionStorage.redirect = location.href;
      location.replace("/");
    </script>
  </head>
  <body></body>
</html>
`;
fs.writeFileSync(path.join(dist, '404.html'), notFound);

// Per-species static pages so crawlers see unique titles/descriptions/content
// without running JavaScript (the React app still takes over in the browser).
const SITE = 'https://oceankingwholesalebh.com';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const productsSrc = fs.readFileSync(path.join(root, 'src/data/products.ts'), 'utf-8');
const speciesRe = /slug:\s*'([^']+)',\s*name:\s*'((?:[^'\\]|\\.)*)',\s*description:\s*'((?:[^'\\]|\\.)*)'/g;
const baseHtml = fs.readFileSync(indexPath, 'utf-8');
let count = 0;
for (const m of productsSrc.matchAll(speciesRe)) {
  const [, slug, name, rawDesc] = m;
  const desc = rawDesc.replace(/\\'/g, "'");
  const title = `${name} – Fresh Wild-Caught | Ocean King Wholesale`;
  const metaDesc = `Order fresh wild-caught ${name.toLowerCase()} online — $9.99/lb whole fish, 5 lb minimum. Cut to order. Delivered to NYC, Long Island & NJ within 24 hours.`;
  const url = `${SITE}/fish/${slug}`;
  let page = baseHtml
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(metaDesc)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(metaDesc)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(metaDesc)}$2`);
  page = page.replace('</head>', `    <link rel="canonical" href="${url}" />\n  </head>`);
  page = page.replace(
    '<div id="root"></div>',
    `<div id="root"></div>\n    <noscript><main><h1>${esc(name)} – Ocean King Wholesale</h1><p>${esc(desc)}</p><p>${esc(metaDesc)} Call (646) 750-9232.</p><p><a href="/">Shop all fish</a></p></main></noscript>`
  );
  const dir = path.join(dist, 'fish', slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page);
  count += 1;
}
console.log(`> generated ${count} species pages`);

// Homepage: canonical + crawlable content for non-JS crawlers
let home = fs.readFileSync(indexPath, 'utf-8');
if (!home.includes('rel="canonical"')) {
  home = home.replace('</head>', `    <link rel="canonical" href="${SITE}/" />\n  </head>`);
}
if (!home.includes('<noscript>')) {
  home = home.replace(
    '<div id="root"></div>',
    `<div id="root"></div>\n    <noscript><main><h1>Ocean King Wholesale – Fresh Wild-Caught Fish Delivered in NYC, Long Island &amp; NJ</h1><p>Whole wild-caught fish at $9.99/lb, 5 lb minimum, cut to order. Salmon, tuna, branzino, red snapper, grouper, cod, halibut, flounder and more. Call (646) 750-9232.</p></main></noscript>`
  );
}
fs.writeFileSync(indexPath, home);

console.log('> publishing dist/ -> docs/');
fs.rmSync(docs, { recursive: true, force: true });
fs.cpSync(dist, docs, { recursive: true });
fs.writeFileSync(path.join(docs, '.nojekyll'), '');

console.log('Done. docs/ is ready to commit.');
