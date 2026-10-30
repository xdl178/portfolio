import assert from 'node:assert/strict'
import {chromium} from 'playwright-core'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true})
const base='http://127.0.0.1:5180/'
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}})
 await page.goto(base,{waitUntil:'networkidle'});await page.locator('[data-loading-screen]').waitFor({state:'detached'})
 assert.equal(await page.locator('[data-action-button]').count(),1,'header CTA stays shared; reference footer grid is non-interactive and back-top is an explicit circular variant')
 assert.equal(await page.locator('.contact-footer-pause').count(),0)
 assert.equal(await page.getByRole('button',{name:/暂停滚动|继续滚动/}).count(),0)
 for(const button of [page.getByRole('navigation',{name:'主导航'}).getByRole('button',{name:'联系我',exact:true})]){
  await button.scrollIntoViewIfNeeded();await page.mouse.move(0,0)
  const icon=button.locator('[data-action-icon]');const label=button.locator('[data-action-label]')
  const before=await icon.boundingBox();const labelBefore=await label.boundingBox()
  const shot=(await button.getAttribute('aria-label'))?'top':'contact'
  await button.screenshot({path:`.shots/action-button-${shot}-default.png`})
  await button.hover();await page.waitForFunction(el=>getComputedStyle(el).backgroundColor==='rgb(38, 134, 237)',await button.elementHandle())
  await button.screenshot({path:`.shots/action-button-${shot}-hover.png`})
  const after=await icon.boundingBox();const labelAfter=await label.boundingBox()
  assert.ok(after.x-before.x>12,'icon travels from start to end, not a tiny nudge')
  assert.ok(labelAfter.x<labelBefore.x-6,'label translates left with the icon swap')
  assert.equal(await button.evaluate(el=>getComputedStyle(el).color),'rgb(5, 8, 15)')
  await page.mouse.move(0,0);await page.waitForFunction(el=>getComputedStyle(el).backgroundColor==='rgba(0, 0, 0, 0)',await button.elementHandle())
  assert.ok(Math.abs((await icon.boundingBox()).x-before.x)<1,'mouseleave reverses icon translation')
 }
 for(const button of await page.locator('.contact-grid .contact-item').all()){
     assert.equal(await button.locator('a,button,[disabled],[aria-disabled]').count(),0);assert.notEqual(await button.evaluate(el=>getComputedStyle(el).cursor),'not-allowed')
 }
 assert.equal(await page.locator('.contact-footer-marquee-row,[data-footer-marquee-track]').count(),0,'obsolete marquee is removed')
 console.log('PASS shared CTA keeps solid-fill/icon-swap/reversal; contact grid is plain text and obsolete marquee controls are absent')
 await page.close()
 for(const config of [{viewport:{width:390,height:900},reducedMotion:'reduce'},{viewport:{width:390,height:900},hasTouch:true,isMobile:true}]){
  const p=await browser.newPage(config);await p.goto(base,{waitUntil:'networkidle'});await p.locator('[data-loading-screen]').waitFor({state:'detached'});const cta=p.getByRole('navigation',{name:'主导航'}).getByRole('button',{name:'联系我',exact:true});await cta.hover();assert.equal(await cta.locator('[data-action-icon]').evaluate(el=>getComputedStyle(el).transform),'none');assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.close()
 }
 console.log('PASS touch/reduced motion do not translate icons or create horizontal overflow')
}finally{await browser.close()}
