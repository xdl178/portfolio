import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'

const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
let failures = 0
async function check(name, run) {
  try { await run(); console.log('PASS', name) }
  catch (error) { failures++; console.error('FAIL', name, error.message) }
}
async function open(options = {}) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', ...options })
  page.setDefaultTimeout(6000)
  await page.goto('http://127.0.0.1:5180/#/', { waitUntil: 'networkidle' })
  await page.locator('[data-loading-screen]').waitFor({ state: 'detached' })
  return page
}
try {
  for (const width of [320, 390, 1440]) await check(`${width}px profile typography, shared keywords and native card material`, async () => {
    const page = await open({ viewport: { width, height: 1000 } })
    try {
      const card = page.locator('article.home-about-profile-card')
      assert.equal(await card.locator('h3.home-about-name').evaluate(el => getComputedStyle(el).fontSize), '28px', 'profile name uses the requested local 28px size')
      assert.equal(await card.locator('h3.home-about-name').getAttribute('class'), 'home-about-name', 'global h3 sizing must not leak into the local name')
      assert.deepEqual(await card.locator('h3.home-about-name').evaluate(el => { const s = getComputedStyle(el); return [s.fontWeight, s.lineHeight] }), ['500', '33.6px'])
      assert.equal(await card.locator('.home-about-position').evaluate(el => getComputedStyle(el).marginTop), '12px')
      assert.equal(await card.locator('.home-about-position').innerText(), '岗位待补充 · 任职时间待补充')
      const keywords = card.locator('dd.home-about-keywords')
      assert.deepEqual(await keywords.locator('span[data-work-tag]').allTextContents(), ['界面设计', '视觉设计', '动效设计'])
      assert.equal(await keywords.locator('> *').count(), 3)
      assert.deepEqual(await keywords.evaluate(el => { const s = getComputedStyle(el); return [s.display, s.flexWrap, s.gap] }), ['flex', 'wrap', '16px'])
      for (const tag of await keywords.locator('[data-work-tag]').all()) {
        assert.deepEqual(await tag.evaluate(el => { const s = getComputedStyle(el); return [s.fontSize, s.height, s.borderRadius] }), ['14px', '32px', '4px'])
        const box = await tag.boundingBox(); const parent = await card.boundingBox()
        assert.ok(box.x >= parent.x && box.x + box.width <= parent.x + parent.width, 'wrapped tags stay inside the card')
      }
      assert.notEqual(await card.getAttribute('data-pointer-glow'), null)
      assert.equal(await card.getAttribute('data-glow-active'), 'false')
      assert.equal(await card.locator('.pointer-glow__content').count(), 0, 'native article content must not gain a wrapper')
      assert.deepEqual(await card.evaluate(el => { const s = getComputedStyle(el); return { radius: s.borderRadius, padding: s.padding, bg: s.backgroundColor, image: s.backgroundImage, border: s.borderTopColor, shadow: s.boxShadow, container: s.containerName } }), { radius: '12px', padding: width < 600 ? '24px 20px 32px' : '24px 32px 32px', bg: 'rgba(255, 255, 255, 0.08)', image: 'none', border: 'rgba(255, 255, 255, 0.15)', shadow: 'none', container: 'profile-card' })
      assert.deepEqual(await card.evaluate(el => [...el.children].map(child => getComputedStyle(child).zIndex)), ['1', '1', '1', '1'])
      assert.deepEqual(await card.evaluate(el => ['::before', '::after'].map(p => getComputedStyle(el, p).zIndex)), ['2', '0'])
      assert.equal(await card.locator('dt').count(), 7)
      for (const size of await card.locator('dt').evaluateAll(nodes => nodes.map(el => getComputedStyle(el).fontSize))) assert.equal(size, '14px')
      for (const size of await card.locator('dd').evaluateAll(nodes => nodes.map(el => getComputedStyle(el).fontSize))) assert.equal(size, '16px')
      assert.equal(await page.locator('.home-about-tool').count(), 8)
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no horizontal page overflow')
    } finally { await page.close() }
  })
  await check('normal mouse edge glow follows pointer and resets on leave', async () => {
    const page = await open({ reducedMotion: 'no-preference' })
    try {
      const card = page.locator('article.home-about-profile-card[data-pointer-glow]')
      await card.scrollIntoViewIfNeeded()
      await page.waitForFunction(() => { const s = getComputedStyle(document.querySelector('.home-about-profile-card')); return s.opacity === '1' && (s.transform === 'none' || new DOMMatrixReadOnly(s.transform).isIdentity) })
      const box = await card.boundingBox()
      await page.mouse.move(box.x + 2, box.y + box.height / 2)
      await page.waitForFunction(() => document.querySelector('.home-about-profile-card').dataset.glowActive === 'true')
      assert.ok(await card.evaluate(el => parseFloat(el.style.getPropertyValue('--edge-proximity')) > 95))
      assert.ok(await card.evaluate(el => Math.abs(parseFloat(el.style.getPropertyValue('--pointer-x')) - 2) < 1))
      await page.waitForFunction(() => parseFloat(getComputedStyle(document.querySelector('.home-about-profile-card'), '::before').opacity) > .9)
      await page.mouse.move(box.x + box.width - 2, box.y + box.height / 2)
      await page.waitForFunction(() => { const el = document.querySelector('.home-about-profile-card'); return parseFloat(el.style.getPropertyValue('--pointer-x')) > el.clientWidth - 5 })
      await page.mouse.move(0, 0)
      await page.waitForFunction(() => document.querySelector('.home-about-profile-card').dataset.glowActive === 'false')
      assert.equal(await card.evaluate(el => el.style.getPropertyValue('--edge-proximity')), '0')
      await page.waitForFunction(() => getComputedStyle(document.querySelector('.home-about-profile-card'), '::before').opacity === '0')
    } finally { await page.close() }
  })
  for (const [name, options, pointerType] of [
    ['reduced motion', { reducedMotion: 'reduce' }, 'mouse'],
    ['touch', { viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference', hasTouch: true, isMobile: true }, 'touch'],
  ]) await check(`${name} leaves decorative glow disabled`, async () => {
    const page = await open(options)
    try {
      const card = page.locator('article.home-about-profile-card[data-pointer-glow]')
      await card.scrollIntoViewIfNeeded()
      await card.dispatchEvent('pointermove', { pointerType, clientX: 20, clientY: 20 })
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
      assert.equal(await card.getAttribute('data-glow-active'), 'false')
      assert.deepEqual(await card.evaluate(el => ['::before', '::after'].map(p => getComputedStyle(el, p).display)), ['none', 'none'])
    } finally { await page.close() }
  })
} finally { await browser.close() }
if (failures) process.exitCode = 1
