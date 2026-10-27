import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'
const base=process.env.PORTFOLIO_URL||'http://127.0.0.1:5180/'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true})
const failures=[]
async function check(name,run){try{await run();console.log(`PASS ${name}`)}catch(error){failures.push(name);console.error(`FAIL ${name}: ${error.stack}`)}}
const ready=page=>page.locator('[data-loading-screen][data-state="ready"]').waitFor({timeout:15000})
try{
 await check('loading has no entry UI and automatically opens home without input',async()=>{
  const page=await browser.newPage({viewport:{width:1440,height:900}})
  await page.goto(base,{waitUntil:'networkidle'});await ready(page)
  const loader=page.locator('[data-loading-screen]')
  assert.equal(await loader.locator('button,a,[role="button"]').count(),0)
  assert.doesNotMatch(await loader.innerText(),/点击|进入|PREVIEW|预览模式/)
  assert.equal(await page.getByRole('progressbar').getAttribute('aria-valuenow'),'100')
  await loader.waitFor({state:'detached',timeout:6000})
  assert.notEqual(await page.evaluate(()=>document.body.style.overflow),'hidden')
  await page.getByRole('link',{name:'精选作品',exact:true}).first().click();await page.waitForURL(/#\/works$/)
  assert.equal(await loader.count(),0);await page.close()
 })
 await check('early click is ignored until real assets are ready',async()=>{
  const page=await browser.newPage();let release
  const held=new Promise(resolve=>{release=resolve})
  await page.route('**/images/hero-desk.jpg',async route=>{await held;await route.continue()})
  await page.goto(base,{waitUntil:'domcontentloaded'})
  await page.locator('[data-loading-screen]').waitFor();await page.mouse.click(250,250)
  assert.equal(await page.locator('[data-loading-screen][data-state="loading"]').count(),1)
  release();await page.locator('[data-loading-screen]').waitFor({state:'detached',timeout:10000});await page.close()
 })
 await check('starfield light spots progressively appear with actual byte progress',async()=>{
  const page=await browser.newPage({viewport:{width:1440,height:900}})
  await page.addInitScript(()=>{
   const original=window.fetch.bind(window)
   window.fetch=async(...args)=>{
    const response=await original(...args)
    if(!String(args[0]).includes('hero-desk.jpg'))return response
    const bytes=new Uint8Array(await response.arrayBuffer())
    return new Response(new ReadableStream({async start(controller){let offset=0;for(const fraction of [.12,.4,.82,1]){await new Promise(resolve=>setTimeout(resolve,1000));const next=Math.floor(bytes.length*fraction);controller.enqueue(bytes.slice(offset,next));offset=next}controller.close()}}),{headers:{'content-type':'image/jpeg','content-length':String(bytes.length)}})
   }
  })
  await page.goto(base,{waitUntil:'domcontentloaded'})
  await page.waitForFunction(()=>Number(document.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow'))>=10)
  const light=()=>page.locator('[data-loader-bokeh] ellipse').evaluateAll(nodes=>nodes.reduce((sum,el)=>sum+Number(getComputedStyle(el).opacity),0))
  assert.ok(await page.locator('[data-loader-bokeh] ellipse').count()>12)
  const early=await light();await page.screenshot({path:'.shots/loading-progress-early.png'})
  await page.waitForFunction(()=>Number(document.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow'))>=78)
  const late=await light();assert.ok(late>early+2,`early=${early}, late=${late}`)
  await page.screenshot({path:'.shots/loading-progress-late.png'})
  assert.ok(await page.locator('[data-loader-ring]').count()>=3)
  assert.equal(await page.locator('[data-loader-ring]').first().evaluate(el=>getComputedStyle(el).animationName),'loading-ripple')
  await ready(page);await page.close()
 })
 await check('mobile and reduced motion automatically enter without controls or overflow',async()=>{
  for(const reduced of [false,true]){
   const page=await browser.newPage({viewport:{width:390,height:844},isMobile:!reduced,hasTouch:!reduced,reducedMotion:reduced?'reduce':'no-preference'})
   await page.goto(base,{waitUntil:'domcontentloaded'})
   await page.locator('[data-loading-screen]').waitFor()
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))
   if(reduced)assert.equal(await page.locator('[data-loader-ring]').first().evaluate(el=>getComputedStyle(el).animationName),'none')
   else await page.screenshot({path:'.shots/loading-ready-390.png'})
   await page.locator('[data-loading-screen]').waitFor({state:'detached',timeout:6000});await page.close()
  }
 })
 await check('normal automatic completion works with no click UI',async()=>{
  const page=await browser.newPage();await page.goto(`${base}?loading=click#/works`,{waitUntil:'networkidle'})
  await page.locator('[data-loading-screen]').waitFor({state:'detached',timeout:15000})
  assert.equal(await page.getByRole('heading',{level:1,name:/作品.*档案/}).count(),1);await page.close()
 })
 await check('failed hero request still reaches ready without entry UI',async()=>{
  const page=await browser.newPage();await page.route('**/images/hero-desk.jpg',route=>route.abort())
  await page.goto(base,{waitUntil:'domcontentloaded'});await ready(page)
  await page.locator('[data-loading-screen]').waitFor({state:'detached',timeout:6000});await page.close()
 })
}finally{await browser.close()}
if(failures.length)process.exitCode=1
