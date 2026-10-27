import assert from 'node:assert/strict'
import {chromium} from 'playwright-core'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true})
let failures=0
try{
 for(const width of [1920,1440,768,390,320]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'})
  try{
   await page.goto('http://127.0.0.1:5180/',{waitUntil:'networkidle'});await page.locator('[data-loading-screen]').waitFor({state:'detached'})
   assert.deepEqual(await page.locator('main section[id]').evaluateAll(nodes=>nodes.map(el=>el.id)),['home','about-intro','work','practice','gallery'])
   const section=page.locator('#about-intro');assert.equal(await section.locator('h2').innerText(),'关于我')
   assert.equal(await section.locator('.selected-works-chapter').innerText(),'01');assert.equal(await section.locator('.selected-works-exhibit').innerText(),'ABOUT')
   assert.equal(await section.getByRole('heading',{name:'基本信息',exact:true}).count(),1)
   assert.equal(await section.getByRole('heading',{name:'专业技能',exact:true}).count(),1)
   assert.equal(await section.locator('dl dt').count(),7)
   for(const label of ['姓名','所在地','工作经验','联系方式','邮箱','作品站','能力关键词'])assert.equal(await section.locator('dt').filter({hasText:new RegExp(`^${label}$`)}).count(),1)
   const photo=await section.locator('[data-profile-photo]').boundingBox();const details=await section.locator('[data-profile-details]').boundingBox()
   if(width>=1024){assert.ok(photo.x+photo.width<details.x);assert.ok(Math.abs(photo.y-details.y)<2)}else assert.ok(details.y>=photo.y+photo.height+24)
   assert.equal(await section.locator('[data-profile-skill]').count(),3)
   assert.equal(await section.locator('[data-profile-skill] img').count(),8)
   for(const img of await section.locator('[data-profile-skill] img').all()){await img.scrollIntoViewIfNeeded();assert.ok(await img.evaluate(el=>el.complete&&el.naturalWidth>0),'local skill icon resolves')}
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))
   await section.screenshot({path:`.shots/home-about-${width}.png`})
   console.log(`PASS ${width}px inserted About reference layout, fields and local skill icons`)
  }catch(e){failures++;console.error(`FAIL ${width}px: ${e.message}`)}finally{await page.close()}
 }
}finally{await browser.close()}
if(failures)process.exitCode=1
