import assert from 'node:assert/strict'
import {existsSync,readFileSync,writeFileSync,mkdtempSync,mkdirSync,readdirSync,rmSync,statSync} from 'node:fs'
import {join,resolve,relative,dirname,basename} from 'node:path'
import {tmpdir} from 'node:os'
import {pathToFileURL} from 'node:url'
import {chromium} from 'playwright-core'
// Native directory-picker UI cannot be automated. Only that boundary is replaced;
// file handles below bridge to a real isolated on-disk project, not mocked writes.
const tool=resolve('design-manager.html')
assert.ok(existsSync(tool),'the independent offline HTML manager must exist')
const fixture=mkdtempSync(join(tmpdir(),'portfolio-design-manager-'))
const safe=path=>{const p=resolve(fixture,path);assert.ok(p===fixture||(!relative(fixture,p).startsWith('..')&&!relative(fixture,p).includes(':')));return p}
const original=readFileSync('public/design-system.css','utf8')+'\n/* user suffix remains untouched */\n.fixture-tail { color: inherit; }\n'
mkdirSync(safe('public'));mkdirSync(safe('dist'))
writeFileSync(safe('public/design-system.css'),original);writeFileSync(safe('dist/design-system.css'),original)
writeFileSync(safe('design-system.schema.json'),readFileSync('design-system.schema.json'))
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true})
try{
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];const network=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))network.push(r.url())})
await page.exposeBinding('__diskRead',(_,{path})=>{if(path==='broken/dist/design-system.css')throw Error('fixture dist denied');return readFileSync(safe(path),'utf8')})
await page.exposeBinding('__diskWrite',(_,{path,text})=>{mkdirSync(dirname(safe(path)),{recursive:true});writeFileSync(safe(path),text)})
await page.exposeBinding('__diskEnsure',(_,{path,kind,create})=>{const p=safe(path);if(!existsSync(p)){if(!create)return false;if(kind==='directory')mkdirSync(p,{recursive:true});else writeFileSync(p,'')}return kind==='directory'?statSync(p).isDirectory():statSync(p).isFile()})
await page.addInitScript(()=>{
 const child=(path,name)=>path?`${path}/${name}`:name
 const missing=()=>new DOMException('Missing fixture path','NotFoundError')
 const file=path=>({kind:'file',name:path.split('/').at(-1),getFile:async()=>new File([await window.__diskRead({path})],path.split('/').at(-1)),createWritable:async()=>{let buffer='';return{write:async text=>{buffer=text},close:async()=>window.__diskWrite({path,text:buffer}),abort:async()=>{}}}})
 const dir=path=>({kind:'directory',name:path?path.split('/').at(-1):'portfolio-fixture',queryPermission:async()=>'granted',requestPermission:async()=>'granted',getFileHandle:async(name,opts={})=>{const p=child(path,name);if(!await window.__diskEnsure({path:p,kind:'file',create:!!opts.create}))throw missing();return file(p)},getDirectoryHandle:async(name,opts={})=>{const p=child(path,name);if(!await window.__diskEnsure({path:p,kind:'directory',create:!!opts.create}))throw missing();return dir(p)}})
 Object.defineProperty(window,'showDirectoryPicker',{configurable:true,value:async()=>dir(window.__pickRoot||'')})
})
await page.goto(pathToFileURL(tool).href);await page.locator('#connect').click();await page.waitForFunction(()=>document.querySelector('#project-name').textContent.includes('portfolio-fixture'),null,{timeout:5000}).catch(async error=>{console.error('CONNECT_DIAGNOSTIC',await page.locator('#status').textContent(),errors);throw error})
await page.locator('#token-search').fill('--brand-rgb');await page.locator('input[data-token="--brand-rgb"]').fill('255 90 60')
await page.waitForFunction(()=>getComputedStyle(document.querySelector('#preview').contentDocument.querySelector('.preview-brand')).backgroundColor==='rgb(255, 90, 60)')
assert.equal(readFileSync(safe('public/design-system.css'),'utf8'),original,'draft preview must not silently write source')
await page.locator('#save').click();await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('已保存'))
let saved=readFileSync(safe('public/design-system.css'),'utf8');assert.match(saved,/--brand-rgb:\s*255 90 60;/);assert.ok(saved.endsWith('/* user suffix remains untouched */\n.fixture-tail { color: inherit; }\n'));assert.equal(readFileSync(safe('dist/design-system.css'),'utf8'),saved)
assert.ok(readdirSync(safe('.design-backups')).some(name=>readFileSync(safe(`.design-backups/${name}`),'utf8')===original),'a pre-save source backup is actually on disk')
const unsafe=[];await page.locator('#token-search').fill('--e-feedback');const curve=page.locator('input[data-token="--e-feedback"]'),oldCurve=await curve.inputValue();for(const value of['cubic-bezier(','/*']){await curve.fill(value);if(!await page.locator('#save').isDisabled())unsafe.push(`malformed CSS accepted: ${value}`)}await curve.fill(oldCurve);
mkdirSync(safe('broken/public'),{recursive:true});mkdirSync(safe('broken/dist'));writeFileSync(safe('broken/design-system.schema.json'),readFileSync('design-system.schema.json'));writeFileSync(safe('broken/public/design-system.css'),original.replace('--brand-rgb: 38 134 237;','--brand-rgb: 10 20 30;'));writeFileSync(safe('broken/dist/design-system.css'),original);await page.evaluate(()=>window.__pickRoot='broken');await page.locator('#connect').click();await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('fixture dist denied'));if(!(await page.locator('#css-output').textContent()).includes('--brand-rgb: 255 90 60;'))unsafe.push('failed project switch replaced the current draft/snapshot');assert.deepEqual(unsafe,[],'invalid text and failed project loads cannot damage current project state');await page.evaluate(()=>window.__pickRoot='');
await page.locator('#token-search').fill('--heading-title-min');await page.locator('input[data-token="--heading-title-min"]').fill('42px')
await page.locator('#token-search').fill('--heading-title-max');await page.locator('input[data-token="--heading-title-max"]').fill('42px')
await page.waitForFunction(()=>getComputedStyle(document.querySelector('#preview').contentDocument.querySelector('.section-heading-title')).fontSize==='42px')
const concurrent=saved+'\n/* external edit */\n';writeFileSync(safe('public/design-system.css'),concurrent)
await page.locator('#save').click();await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('外部'));assert.equal(readFileSync(safe('public/design-system.css'),'utf8'),concurrent,'external source edits must never be clobbered')
await page.locator('input[data-token="--heading-title-max"]').fill('42px; } body {display:none');assert.equal(await page.locator('#save').isDisabled(),true,'unsafe or invalid values cannot be saved')
for(const width of[1440,900,390]){await page.setViewportSize({width,height:1000});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'manager has no horizontal overflow')}
assert.deepEqual(network,[],'offline HTML must make no HTTP requests');assert.deepEqual(errors,[])
console.log('PASS offline HTML: real CSS draft/save, dist sync, original backup, suffix preservation, live heading/brand preview, conflict rejection, input validation, responsive layout and no network/runtime errors')
await page.close()
const unsupported=await browser.newPage();await unsupported.addInitScript(()=>Object.defineProperty(window,'showDirectoryPicker',{value:undefined,configurable:true}));await unsupported.goto(pathToFileURL(tool).href);assert.equal(await unsupported.locator('#connect').isDisabled(),true);assert.equal(await unsupported.locator('#save').isDisabled(),true);assert.equal(await unsupported.locator('#compat-warning').isVisible(),true);await unsupported.close();console.log('PASS unsupported browser clearly disables project writes')
}finally{await browser.close();assert.equal(dirname(fixture),resolve(tmpdir()));assert.ok(basename(fixture).startsWith('portfolio-design-manager-'));rmSync(fixture,{recursive:true})}
