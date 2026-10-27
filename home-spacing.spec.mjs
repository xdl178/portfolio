import assert from 'node:assert/strict'
import {chromium} from 'playwright-core'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true})
let failures=0
try{
 for(const width of [1920,1440,768,390]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'})
  try{
   await page.goto('http://127.0.0.1:5180/',{waitUntil:'networkidle'});await page.locator('[data-loading-screen]').waitFor({state:'detached'})
   assert.equal(await page.locator('#practice h2').innerText(),'工作经验')
   assert.equal(await page.locator('#practice .selected-works-exhibit').innerText(),'EXPERIENCE')
   assert.equal(await page.locator('#practice .selected-works-chapter').innerText(),'03')
   const paddings=await page.locator('main section[id]').evaluateAll(nodes=>nodes.map(el=>({id:el.id,padding:[getComputedStyle(el).paddingTop,getComputedStyle(el).paddingRight,getComputedStyle(el).paddingBottom,getComputedStyle(el).paddingLeft]})))
   assert.equal(paddings.length,5)
   for(const item of paddings)assert.deepEqual(item.padding,['0px','0px','128px','0px'],item.id)
   const headings=await page.locator('#work .selected-works-heading,#practice .selected-works-heading').evaluateAll(nodes=>nodes.map(el=>({x:el.getBoundingClientRect().x,size:getComputedStyle(el.querySelector('h2')).fontSize,align:getComputedStyle(el).alignItems})))
   assert.equal(headings.length,2);assert.deepEqual(headings[0],headings[1])
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))
   await page.locator('#practice').screenshot({path:`.shots/career-heading-${width}.png`})
   console.log(`PASS ${width}px matching section heading and bottom-only 128px padding`)
  }catch(e){failures++;console.error(`FAIL ${width}px: ${e.message}`)}finally{await page.close()}
 }
}finally{await browser.close()}
if(failures)process.exitCode=1
