import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:5180'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
let failures = 0
const styleRuntime = node => {
  const s = getComputedStyle(node)
  return { radius: s.borderRadius, padding: s.padding, gap: s.gap, minHeight: s.minHeight, minWidth: s.minWidth, background: s.backgroundColor, border: s.borderTopColor, opacity: s.opacity, transform: s.transform, shadow: s.boxShadow, properties: s.transitionProperty, duration: s.transitionDuration }
}
const open = async (page, route = '/') => {
  await page.goto(`${base}/#${route}`, { waitUntil: 'networkidle' })
  await page.locator('[data-loading-screen]').waitFor({ state: 'detached' })
}
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' })
  try {
    await open(page)
    const tools = page.locator('ul.home-about-skill-grid > li[data-profile-skill][data-tool-reveal][data-surface-card]')
    assert.equal(await tools.count(), 8, 'all eight native tool li must use the shared SurfaceCard marker')
    const tool = tools.first()
    const initial = await tool.evaluate(styleRuntime)
    assert.equal(initial.opacity, '0', 'offscreen normal-motion surface starts hidden even under AnimatePresence initial=false')
    assert.equal(initial.transform, 'matrix(1, 0, 0, 1, 0, 32)')
    assert.equal(initial.radius, '8px'); assert.equal(initial.padding, '12px'); assert.equal(initial.gap, '12px')
    assert.equal(initial.minHeight, '62px'); assert.equal(initial.minWidth, '0px')
    assert.equal(initial.background, 'rgba(255, 255, 255, 0.04)'); assert.equal(initial.border, 'rgba(255, 255, 255, 0.1)')
    assert.equal(initial.properties, 'background-color, border-color'); assert.equal(initial.duration, '0.3s, 0.3s')
    assert.deepEqual(await tools.locator('img').evaluateAll(nodes => nodes.map(node => node.alt)), ['Figma', 'MasterGo', 'Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Blender', 'Adobe After Effects', 'Adobe Premiere Pro'])
    await tool.scrollIntoViewIfNeeded(); await page.mouse.move(0, 0)
    await page.waitForFunction(() => [...document.querySelectorAll('.home-about-tool')].every(node => { const s = getComputedStyle(node); return s.opacity === '1' && (s.transform === 'none' || new DOMMatrixReadOnly(s.transform).isIdentity) }))
    const before = await tool.boundingBox()
    await tool.hover()
    await page.waitForFunction(() => { const s = getComputedStyle(document.querySelector('.home-about-tool')); return s.backgroundColor === 'rgba(255, 255, 255, 0.08)' && s.borderTopColor === 'rgba(255, 255, 255, 0.25)' })
    assert.deepEqual(await tool.boundingBox(), before, 'hover only changes colors, not layout or lift')
    assert.equal((await tool.evaluate(styleRuntime)).shadow, 'none')
    assert.deepEqual(await tool.evaluate(node => ['::before', '::after'].map(p => getComputedStyle(node, p).content)), ['none', 'none'])
    await page.evaluate(async () => { document.documentElement.style.setProperty('--d-tool-reveal', '700ms'); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))) })
    assert.ok(await tools.evaluateAll(nodes => nodes.every(node => { const s = getComputedStyle(node); return s.opacity === '1' && (s.transform === 'none' || new DOMMatrixReadOnly(s.transform).isIdentity) })), 'live token updates preserve once-revealed surfaces')
    console.log('PASS shared home tool surface, entrance, pure-color hover and live-token persistence')
  } catch (error) { failures++; console.error(`FAIL home shared surface: ${error.message}`) } finally { await page.close() }

  for (const width of [1440, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' })
    try {
      await open(page, '/about')
      const stats = page.locator('[data-about-stat][data-surface-card]')
      assert.equal(await stats.count(), 4, 'Reference About metrics all use the shared SurfaceCard')
      for (const stat of await stats.all()) {
        const s = await stat.evaluate(styleRuntime)
        assert.equal(s.radius, '8px'); assert.equal(s.padding, '12px'); assert.equal(s.opacity, '1')
        assert.ok(s.transform === 'none' || s.transform === 'matrix(1, 0, 0, 1, 0, 0)')
        assert.equal(await stat.locator('[data-stat-tag]').evaluate(node => getComputedStyle(node).fontSize), '12px')
        assert.equal(await stat.locator('[data-stat-label]').evaluate(node => getComputedStyle(node).fontSize), '12px')
        const tag = await stat.locator('[data-stat-tag]').boundingBox(), value = await stat.locator('[data-stat-value]').boundingBox()
        assert.ok(tag.y + tag.height <= value.y || tag.x >= value.x + value.width || value.x >= tag.x + tag.width, 'stat tag and number do not overlap')
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
      console.log(`PASS About shared stats and tag clearance at ${width}px`)
    } catch (error) { failures++; console.error(`FAIL About ${width}px: ${error.message}`) } finally { await page.close() }
  }

  const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' })
  try {
    const page = await touch.newPage(); await open(page)
    const tool = page.locator('.home-about-tool[data-surface-card]').first()
    assert.equal(await tool.count(), 1, 'reduced-motion tools still use shared surfaces')
    const before = await tool.evaluate(styleRuntime)
    assert.equal(before.opacity, '1'); assert.equal(before.transform, 'none')
    assert.ok(before.duration.split(',').every(value => parseFloat(value) <= .00001))
    await tool.scrollIntoViewIfNeeded(); await tool.tap()
    const after = await tool.evaluate(styleRuntime)
    assert.equal(after.background, before.background); assert.equal(after.border, before.border)
    console.log('PASS reduced motion static pose and touch color-hover guard')
  } catch (error) { failures++; console.error(`FAIL touch/reduced: ${error.message}`) } finally { await touch.close() }
} finally { await browser.close() }
if (failures) process.exitCode = 1
