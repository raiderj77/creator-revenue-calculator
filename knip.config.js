import fs from 'node:fs';
import path from 'node:path';
// HTML script tags are actual runtime entrypoints in this static application.
// Keep this mapping derived from source so Knip never calls those files unused.
const html = fs.readdirSync('.').filter(name => name.endsWith('.html'));
for (const directory of fs.readdirSync('tools',{withFileTypes:true}).filter(entry => entry.isDirectory())) {
  const file=`tools/${directory.name}/index.html`;
  if (fs.existsSync(file)) html.push(file);
}
const scripts=new Set();
for (const file of html) {
  for (const match of fs.readFileSync(file,'utf8').matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)) {
    if (/^(?:https?:)?\/\//.test(match[1])) continue;
    scripts.add((match[1].startsWith('/') ? match[1].slice(1) : path.posix.join(path.posix.dirname(file),match[1])).split('?')[0]);
  }
}
export default {
  entry:[...scripts,'api/**/*.js','scripts/*.js','tests/**/*.js'],
  project:['api/**/*.js','assets/js/**/*.js','tools/**/*.js','scripts/*.js','tests/**/*.js','*.config.js'],
  // CSS/font assets are consumed by the checked-in font-subsetting pipeline.
  ignoreDependencies:['@fortawesome/fontawesome-free'],
};
