import assert from 'node:assert/strict'
import {chromium} from 'playwright-core'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true})
try{for(const width of[1440,390,320]){const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});try{
 await page.goto('http://127.0.0.1:5180/#/works',{waitUntil:'networkidle'});await page.locator('[data-loading-screen]').waitFor({state:'detached'});
 const filters=page.getByRole('group',{name:'按方向筛选作品'});assert.equal(await filters.getAttribute('data-works-filter-tabs'),'true','filters have a unified segmented tray');const buttons=filters.getByRole('button');assert.equal(await buttons.count(),4);assert.equal(await filters.locator('[data-work-filter-indicator]').count(),1);
 assert.equal(await buttons.first().evaluate(el=>getComputedStyle(el).color),'rgb(248, 250, 252)','selected text has stronger primary contrast');assert.match(await filters.locator('[data-work-filter-indicator]').evaluate(el=>getComputedStyle(el).backgroundImage),/linear-gradient/);
 const box=await filters.boundingBox();await buttons.nth(1).focus();await page.keyboard.press('Space');assert.equal(await buttons.nth(1).getAttribute('aria-pressed'),'true');assert.equal(await buttons.nth(1).locator('[data-work-filter-indicator]').count(),1);await page.waitForFunction(()=>document.querySelectorAll('article[data-works-reveal]').length===1);assert.deepEqual(await filters.boundingBox(),box,'selection never resizes the tray');await buttons.first().focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>document.querySelectorAll('article[data-works-reveal]').length===3);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));console.log(`PASS ${width}px selected gradient plate, native keyboard filtering, stable tray and readable active label`)
 }finally{await page.close()}}}finally{await browser.close()}
