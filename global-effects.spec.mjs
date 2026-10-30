import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true})
const failures=[]
async function check(name,run){try{await run();console.log(`PASS ${name}`)}catch(e){failures.push(name);console.error(`FAIL ${name}: ${e.message}`)}}
try{
 await check('one persistent viewport-following halo covers home, archive, detail, about and 404',async()=>{
  const page=await browser.newPage({viewport:{width:1440,height:900}})
  await page.goto('http://127.0.0.1:5180/',{waitUntil:'networkidle'})
  await page.locator('[data-loading-screen]').waitFor({state:'detached'})
  for(const route of ['', 'works', 'works/original-ip', 'about', 'missing-page']){
   await page.goto(`http://127.0.0.1:5180/#/${route}`,{waitUntil:'networkidle'})
   await page.waitForTimeout(750)
   const halo=page.locator('[data-work-halo]');assert.equal(await halo.count(),1,route)
   assert.equal(await halo.evaluate(el=>{const marked=document.querySelector('[data-halo-identity]');if(!marked){el.setAttribute('data-halo-identity','true');return true}return marked===el}),true,'same portal node survives routing')
   await page.mouse.move(510,390)
   // The halo converges per animation frame, not per wall-clock millisecond.
   // Keep the same 2px invariant while allowing bounded frame contention.
   try {
    await page.waitForFunction(()=>{const el=document.querySelector('[data-work-halo]');if(!el)return false;const b=el.getBoundingClientRect();return Math.abs(b.x+b.width/2-510)<2&&Math.abs(b.y+b.height/2-390)<2},null,{timeout:5000})
   } catch(error) {
    throw new Error(`halo did not settle on /${route} (${page.url()}): rect=${JSON.stringify(await halo.boundingBox())}; target=(510,390), tolerance<2px; ${error.message}`)
   }
   const box=await halo.boundingBox();assert.ok(Math.abs(box.x+box.width/2-510)<2&&Math.abs(box.y+box.height/2-390)<2,`halo center on /${route} (${page.url()}): rect=${JSON.stringify(box)}; target=(510,390), tolerance<2px`)
   assert.equal(await halo.evaluate(el=>getComputedStyle(el).pointerEvents),'none')
   assert.notEqual(await page.locator('body').evaluate(el=>getComputedStyle(el).cursor),'none')
  }
  await page.goto('http://127.0.0.1:5180/#/',{waitUntil:'networkidle'})
  await page.locator('#work').scrollIntoViewIfNeeded();await page.waitForTimeout(750)
  const panel=page.locator('#work [data-pointer-glow]').first();const box=await panel.boundingBox()
  await page.mouse.move(box.x+box.width/2,box.y+2);await page.waitForTimeout(300)
  const glow=await panel.evaluate(el=>({padding:getComputedStyle(el,'::before').paddingTop,background:getComputedStyle(el,'::before').backgroundImage,opacity:getComputedStyle(el,'::before').opacity}))
  assert.equal(glow.padding,'2px');assert.match(glow.background,/280px/);assert.equal(glow.opacity,'1')
  await page.screenshot({path:'.shots/global-halo-home.png'})
  await page.close()
 })
 await check('global halo stays disabled for touch and reduced motion on all pages',async()=>{
  for(const options of [{isMobile:true,hasTouch:true,viewport:{width:390,height:844}},{reducedMotion:'reduce',viewport:{width:1440,height:900}}]){
   const page=await browser.newPage(options)
   for(const route of ['', 'works', 'about']){
    await page.goto(`http://127.0.0.1:5180/#/${route}`,{waitUntil:'networkidle'})
    await page.locator('[data-loading-screen]').waitFor({state:'detached'})
    assert.equal(await page.locator('[data-work-halo]').count(),0)
   }
   await page.close()
  }
 })
}finally{await browser.close()}
if(failures.length)process.exitCode=1
