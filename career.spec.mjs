import assert from 'node:assert/strict'
import {chromium} from 'playwright-core'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true})
const failures=[]
async function check(name,run){try{await run();console.log(`PASS ${name}`)}catch(e){failures.push(name);console.error(`FAIL ${name}: ${e.message}`)}}
const open=async options=>{const page=await browser.newPage(options);await page.goto('http://127.0.0.1:5180/',{waitUntil:'networkidle'});await page.locator('[data-loading-screen]').waitFor({state:'detached'});await page.waitForTimeout(900);return page}
try{
 await check('two corner glows stay fixed in viewport across scroll and routes',async()=>{
  const page=await open({viewport:{width:1440,height:900}})
  const glows=page.locator('[data-viewport-glow]');assert.equal(await glows.count(),2)
  const before=await glows.evaluateAll(nodes=>nodes.map(el=>el.getBoundingClientRect().toJSON()))
  await page.evaluate(()=>scrollTo(0,1400));await page.waitForTimeout(500)
  const after=await glows.evaluateAll(nodes=>nodes.map(el=>el.getBoundingClientRect().toJSON()));assert.deepEqual(after,before)
  assert.ok(before[0].x<0&&before[0].y<0);assert.ok(before[1].right>1440&&before[1].bottom>900)
  assert.equal(await page.locator('[data-viewport-glows]').evaluate(el=>getComputedStyle(el).pointerEvents),'none')
  await page.goto('http://127.0.0.1:5180/#/about');await page.waitForTimeout(900);assert.equal(await glows.count(),2)
  await page.close()
 })
 await check('career light tree grows and rewinds with real scroll, preserving existing projects',async()=>{
  const page=await open({viewport:{width:1440,height:900}})
  const tree=page.locator('[data-career-tree]');assert.equal(await tree.count(),1)
  const content=await page.locator('#practice').innerText();for(const name of ['深圳前湾公园','长沙智谷','北京博大公园'])assert.ok(content.includes(name))
  assert.deepEqual(await page.locator('main section[id]').evaluateAll(nodes=>nodes.map(el=>el.id).slice(0,4)),['home','about-intro','work','practice'])
  const top=await tree.evaluate(el=>el.getBoundingClientRect().top+scrollY)
  const height=await tree.evaluate(el=>el.getBoundingClientRect().height)
  await page.evaluate(y=>scrollTo(0,y),top-780);await page.waitForTimeout(700)
  const progress=()=>tree.evaluate(el=>Number(el.style.getPropertyValue('--career-progress')))
  const early=await progress();await page.evaluate(y=>scrollTo(0,y),top+height-550);await page.waitForTimeout(700)
  const late=await progress();assert.ok(late>early+.4,`${early} -> ${late}`)
  await page.screenshot({path:'.shots/career-scroll-late.png'})
  await page.evaluate(y=>scrollTo(0,y),top-780);await page.waitForTimeout(700);assert.ok(await progress()<late-.4)
  await page.locator('#practice').screenshot({path:'.shots/career-1440.png'})
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:5180/#/works');await page.waitForTimeout(900);await page.evaluate(()=>scrollTo(0,900));assert.deepEqual(errors,[])
  await page.close()
 })
 await check('mobile and reduced motion keep all career content readable without horizontal overflow',async()=>{
  for(const width of [390,768,1440]){
   const page=await open({viewport:{width,height:900},reducedMotion:'reduce'})
   const tree=page.locator('[data-career-tree]');assert.equal(await tree.count(),1)
   await page.locator('#practice').scrollIntoViewIfNeeded();await page.waitForTimeout(300)
   assert.equal(await tree.evaluate(el=>getComputedStyle(el).getPropertyValue('--career-progress').trim()),'1')
   const rows=page.locator('[data-career-entry]');assert.equal(await rows.count(),3)
   for(const row of await rows.all())assert.equal(await row.evaluate(el=>getComputedStyle(el).opacity),'1')
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))
   await page.locator('#practice').screenshot({path:`.shots/career-${width}-reduced.png`})
   await page.close()
  }
 })
}finally{await browser.close()}
if(failures.length)process.exitCode=1
