import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' })
    try {
      await page.goto('http://127.0.0.1:5180/', { waitUntil: 'networkidle' })
      await page.locator('[data-loading-screen]').waitFor({ state: 'detached' })
      const result = await page.locator('#about-intro').evaluate(section => ({
        heading: getComputedStyle(section.querySelector('.home-about-bio-heading')).color,
        body: [...section.querySelectorAll('.home-about-bio .type-body')].map(el => getComputedStyle(el).color),
        bottom: getComputedStyle(section.querySelector('.home-about-profile-card')).paddingBottom,
        tools: [...section.querySelectorAll('.home-about-tool')].map(el => getComputedStyle(el).borderRadius),
      }))
      assert.equal(result.heading, 'rgb(134, 146, 163)', 'bio heading follows --secondary')
      assert.deepEqual(result.body, ['rgb(248, 250, 252)', 'rgb(248, 250, 252)'], 'bio paragraphs follow --text, not the generic muted body preset')
      assert.equal(result.bottom, '32px', 'profile card bottom padding stays 32px on desktop and mobile')
      assert.deepEqual(result.tools, Array(8).fill('8px'), 'software tiles have the user-approved 8px radius exception')
      await page.evaluate(() => { document.documentElement.style.setProperty('--secondary', '#123456'); document.documentElement.style.setProperty('--text', '210 40% 90%') })
      // Reduced-motion transitions are 0.01ms, not literal zero: sample the settled token color.
      await page.waitForFunction(() => getComputedStyle(document.querySelector('.home-about-bio-heading')).color === 'rgb(18, 52, 86)')
      assert.equal(await page.locator('.home-about-bio-heading').evaluate(el => getComputedStyle(el).color), 'rgb(18, 52, 86)')
      assert.notEqual(await page.locator('.home-about-bio .type-body').first().evaluate(el => getComputedStyle(el).color), result.body[0], '--text remains a live token')
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
      console.log(`PASS ${width}px explicit bio color roles, bottom padding and software radius`)
    } finally { await page.close() }
  }
} finally { await browser.close() }
