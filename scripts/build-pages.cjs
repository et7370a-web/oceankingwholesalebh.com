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

console.log('> publishing dist/ -> docs/');
fs.rmSync(docs, { recursive: true, force: true });
fs.cpSync(dist, docs, { recursive: true });
fs.writeFileSync(path.join(docs, '.nojekyll'), '');

console.log('Done. docs/ is ready to commit.');
