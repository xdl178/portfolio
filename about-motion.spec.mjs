import assert from 'node:assert/strict'
import{chromium}from'playwright-core'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true})
try{const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});const errors=[];page.on('pageerror',e=>errors.push(e.message));try{
 await page.goto('http://127.0.0.1:5180/#/about',{waitUntil:'networkidle'});await page.locator('[data-loading-screen]').waitFor({state:'detached'});
 const card=page.locator('[data-about-strength]').first();assert.equal(await card.evaluate(el=>getComputedStyle(el).opacity),'0','offscreen awards retain shared explicit entry pose');await card.scrollIntoViewIfNeeded();await page.waitForFunction(()=>{const s=getComputedStyle(document.querySelector('[data-about-strength]'));return s.opacity==='1'&&(s.transform==='none'||new DOMMatrixReadOnly(s.transform).isIdentity)});
 const box=await card.boundingBox();await page.mouse.move(box.x+4,box.y+4);await page.waitForFunction(()=>Number(getComputedStyle(document.querySelector('[data-about-strength]'),'::before').opacity)>.5);assert.equal(await card.getAttribute('data-glow-active'),'true');await page.mouse.move(0,0);await page.waitForFunction(()=>document.querySelector('[data-about-strength]').dataset.glowActive==='false');
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>[...document.querySelectorAll('[data-about-page] [data-surface-card]')].every(el=>{const s=getComputedStyle(el);return s.opacity==='1'&&(s.transform==='none'||new DOMMatrixReadOnly(s.transform).isIdentity)}));assert.deepEqual(await card.evaluate(el=>['::before','::after'].map(p=>getComputedStyle(el,p).display)),['none','none']);assert.deepEqual(errors,[]);
 console.log('PASS About shared award entrance, live pointer gradient/leave, static reduced-motion cards and no runtime errors')
}finally{await page.close()}}finally{await browser.close()}
