import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
try {
 for (const width of [1440, 390, 320]) {
  const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' })
  try {
   await page.goto('http://127.0.0.1:5180/#/works', { waitUntil: 'networkidle' })
   await page.locator('[data-loading-screen]').waitFor({ state: 'detached' })
   const headingStyle = el => { const s = getComputedStyle(el); return { size: parseFloat(s.fontSize), line: parseFloat(s.lineHeight), spacing: parseFloat(s.letterSpacing), align: s.textAlign, wrap: s.whiteSpace, weight: s.fontWeight } }
    const archiveHeadingStyle = await page.locator('[data-works-page] h1').evaluate(headingStyle)
    assert.equal(await page.locator('[data-works-page] h1').evaluate(el => !!el.closest('[data-section-heading]')), false, 'page h1 is independent of section dividers')
    const displaySize = Math.max(44.8, Math.min(width * .11, 134.4))
    assert.ok(Math.abs(archiveHeadingStyle.size - displaySize) < .02, 'archive retains the old display clamp')
    assert.ok(Math.abs(archiveHeadingStyle.line - displaySize * 1.04) < .02)
    assert.ok(Math.abs(archiveHeadingStyle.spacing + displaySize * .05) < .02)
    assert.equal(archiveHeadingStyle.align, 'center'); assert.equal(archiveHeadingStyle.wrap, 'nowrap'); assert.equal(archiveHeadingStyle.weight, '600')
    assert.equal(await page.locator('[data-works-page] h1 .text-gradient').textContent(), '档案')
    const lines = await page.locator('[data-works-page] h1').evaluate(el => [...el.querySelectorAll('span')].map(span => {const r = document.createRange();r.selectNodeContents(span);const box=r.getBoundingClientRect();return {top:box.top,bottom:box.bottom}}))
   assert.equal(lines.length, 2)
   assert.ok(Math.abs(lines[0].top - lines[1].top) < 1, '作品档案 stays on one line at every viewport')
   assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
   await page.goto('http://127.0.0.1:5180/', { waitUntil: 'networkidle' })
   await page.locator('[data-loading-screen]').waitFor({ state: 'detached' })
   assert.equal(await page.locator('#home [data-ui-badge]').evaluate(el => getComputedStyle(el).fontSize), '12px')
   assert.notEqual(archiveHeadingStyle.size, (await page.locator('#home-about-title').evaluate(headingStyle)).size, 'page masthead retains its display scale rather than Home About section typography')
    console.log(`PASS ${width}px one-line centered display archive title and 12px Hero badge`)
  } finally { await page.close() }
 }
 const page = await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'})
 try {
  await page.goto('http://127.0.0.1:5180/#/works',{waitUntil:'networkidle'})
  await page.locator('[data-loading-screen]').waitFor({state:'detached'})
  const tag=page.locator('[data-works-page] [data-work-tag]').first()
  await tag.scrollIntoViewIfNeeded();await page.mouse.move(0,0)
  assert.equal(await tag.evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(255, 255, 255, 0.08)')
  const box=await tag.boundingBox();await tag.hover()
  await page.waitForFunction(()=>{const s=getComputedStyle(document.querySelector('[data-works-page] [data-work-tag]'));return s.backgroundColor==='rgba(255, 255, 255, 0.15)'&&s.borderTopColor==='rgba(0, 0, 0, 0)'})
  assert.deepEqual(await tag.boundingBox(),box,'label hover does not move or resize')
  await page.mouse.move(0,0)
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('[data-works-page] [data-work-tag]')).backgroundColor==='rgba(255, 255, 255, 0.08)')
  console.log('PASS shared WorkTag chip-like hover and reversal without layout change')
 } finally {await page.close()}
} finally {await browser.close()}
