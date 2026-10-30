import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { chromium } from 'playwright-core'
const failures=[]
async function check(name, run){try{await run();console.log(`PASS ${name}`)}catch(error){failures.push(name);console.error(`FAIL ${name}: ${error.message}`)}}
async function sources(dir){const out=[];for(const item of await readdir(dir,{withFileTypes:true})){const path=`${dir}/${item.name}`;if(item.isDirectory()){if(item.name!=='assets')out.push(...await sources(path))}else if(/\.(tsx|css)$/.test(path))out.push(path)}return out}
await check('UI source colors use global tokens rather than scattered literals',async()=>{
 const invalid=[]
 for(const path of await sources('src')){
  let text=await readFile(path,'utf8')
  if(path==='src/index.css')text=text.replace(/:root\s*\{[\s\S]*?\n\}/,'')
  text=text.replace(/\/\*[\s\S]*?\*\//g,'')
  const matches=text.match(/#[\da-f]{3,8}\b|\b(?:rgb|hsl)a?\(\s*[\d.]/gi)
  if(matches)invalid.push(`${path}: ${[...new Set(matches)].join(', ')}`)
 }
 assert.deepEqual(invalid,[])
})
await check('secondary colors never bypass muted with alpha or private grays',async()=>{
 const invalid=[]
 for(const path of await sources('src')){
  const text=await readFile(path,'utf8')
  const matches=text.match(/\btext-muted\/[^\s"'`]+|\btext-text-primary\/[^\s"'`]+|\btext-white\/[^\s"'`]+/g)
  if(matches)invalid.push(`${path}: ${matches.join(', ')}`)
 }
 assert.deepEqual(invalid,[])
})
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true})
try{
 await check('global color roles propagate: muted subtext, explicit primary bio/serial/selected filter and other active chip brand',async()=>{
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'})
  for(const route of ['', 'works', 'works/original-ip', 'about']){
   await page.goto(`http://127.0.0.1:5180/?loading=auto#/${route}`,{waitUntil:'networkidle'})
   await page.locator('[data-loading-screen]').waitFor({state:'detached'})
   await page.mouse.move(5,895)
   await page.waitForTimeout(800) // Route color/reveal transitions must settle before sampling.
   const result=await page.evaluate(()=>({token:getComputedStyle(document.documentElement).getPropertyValue('--muted').trim().toUpperCase(),invalid:[...document.querySelectorAll('.text-muted,.type-body,.type-label,.chip,#main-content span.font-mono:not(.mix-blend-difference):not([data-work-enter])')].filter(el=>{const expected=el.matches('.home-about-bio .type-body,.text-text-primary,[data-works-filter-tabs] .chip[aria-pressed="true"]')?getComputedStyle(document.body).color:el.matches('.chip[aria-pressed="true"]')?getComputedStyle(el.firstElementChild).backgroundColor:'rgb(187, 201, 219)';return getComputedStyle(el).color!==expected}).map(el=>({class:el.className,color:getComputedStyle(el).color}))}))
   assert.equal(result.token,'#BBC9DB')
   assert.deepEqual(result.invalid,[],route)
  }
  // Changing the single variable must flow through CSS component and Tailwind classes.
  await page.evaluate(()=>document.documentElement.style.setProperty('--muted','#abcdef'))
  await page.waitForTimeout(500)
  const consumers=await page.locator('.text-muted').evaluateAll(nodes=>nodes.slice(0,10).map(el=>getComputedStyle(el).color))
  assert.ok(consumers.length)
  assert.ok(consumers.every(value=>value==='rgb(171, 205, 239)'))
  await page.close()
 })
}finally{await browser.close()}
if(failures.length)process.exitCode=1
