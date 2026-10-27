import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true})
try{
 for(const width of [1440,768,390,320]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'})
  await page.goto('http://127.0.0.1:5180/',{waitUntil:'networkidle'});await page.locator('[data-loading-screen]').waitFor({state:'detached'})
  const badges=[page.locator('#home .chip.hero-ui'),page.getByRole('heading',{name:'基本信息',exact:true}),page.getByRole('heading',{name:'专业技能',exact:true})]
  const style=el=>{const css=getComputedStyle(el);const dot=getComputedStyle(el.firstElementChild);return {badge:Object.fromEntries(['alignItems','fontSize','fontFamily','fontWeight','lineHeight','letterSpacing','textTransform','paddingTop','paddingRight','paddingBottom','paddingLeft','gap','borderRadius','borderWidth','borderColor','color','backgroundColor'].map(key=>[key,css[key]])),dot:Object.fromEntries(['width','height','backgroundColor','borderRadius','boxShadow'].map(key=>[key,dot[key]]))}}
  const hero=await badges[0].evaluate(style)
  for(const badge of badges.slice(1))assert.deepEqual(await badge.evaluate(style),hero)
  assert.equal(hero.badge.backgroundColor,'rgba(255, 255, 255, 0.1)')
  assert.equal(await page.locator('[data-ui-badge]').count(),3)
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))
  console.log(`PASS ${width}px shared badge exact style parity and heading semantics`)
  await page.close()
 }
}finally{await browser.close()}
