import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
try {
 for (const width of [1440, 390, 320]) {
  const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' })
  try {
   await page.goto('http://127.0.0.1:5180/#/works', { waitUntil: 'networkidle' })
   await page.locator('[data-loading-screen]').waitFor({ state: 'detached' })
   const main = page.locator('[data-works-page]')
   const heading = main.locator('h1')
   assert.equal((await heading.textContent()).replace(/\s/g, ''), '作品档案', 'archive heading has no trailing punctuation')
   assert.equal(await heading.evaluate(el => getComputedStyle(el).textAlign), 'center', 'archive title is centered')
   assert.equal(await main.getByText('The Archive · 作品档案', { exact: true }).count(), 0)
   const small = await page.evaluate(() => [...document.body.querySelectorAll('*')].filter(el => !el.closest('#footer-sec,.contact-footer,svg,.sr-only') && [...el.childNodes].some(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim()) && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden' && parseFloat(getComputedStyle(el).fontSize) < 12).map(el => ({ text: el.textContent.trim(), size: getComputedStyle(el).fontSize })))
   assert.deepEqual(small, [], 'visible page text outside footer has a 12px minimum')
   assert.equal(await main.locator('[data-surface-card]').count(), 9, 'three statistics and six metadata cards use the shared surface')
   assert.equal(await main.locator('dl [data-surface-card]').count(), 6)
   for (const card of await main.locator('[data-surface-card]').all()) assert.equal(await card.evaluate(el => getComputedStyle(el).borderRadius), '8px')
   assert.equal(await main.locator('article ul li [data-work-tag]').count(), 12)
   assert.equal(await main.locator('article ul [data-ui-badge]').count(), 0, 'project tags use WorkTag, not dot chips')
   assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}: no overflow`)
   console.log(`PASS archive refinement ${width}px: centered title, readable metadata, shared cards and work labels`)
  } finally { await page.close() }
 }
} finally { await browser.close() }
