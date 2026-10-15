import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const routes=[...read('sitemap.xml').matchAll(/<loc>https:\/\/creatorrevenuecalculator.com([^<]+)<\/loc>/g)].map(m=>m[1]);
const write=process.argv.includes('--write');
for(const route of [...routes,'/404.html']) {
 const file=route.slice(1)+(route.endsWith('/')?'index.html':'');
 let html=read(file);
 for(const [tag,cls,template] of [['nav','navbar','site-header.html'],['footer','footer','site-footer.html']]) {
  const pattern=new RegExp(`<${tag} class="${cls}"[\\s\\S]*?</${tag}>`);
  const expected=read(`docs/templates/${template}`).trim();
  assert.ok(pattern.test(html),`${route}: ${tag} exists`);
  if(write)html=html.replace(pattern,()=>expected);
  else assert.equal(html.match(pattern)[0].replace(/\r\n/g,'\n'),expected.replace(/\r\n/g,'\n'),`${route}: shared ${tag}`);
 }
 assert.ok(html.includes('name="google-adsense-account" content="ca-pub-7171402107622932"'),`${route}: static verification`);
 if(write)fs.writeFileSync(path.join(root,file),html);
}
console.log(`Shared navigation and verification checked on ${routes.length+1} routes.`);
