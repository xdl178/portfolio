import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:5180'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
const selector = '[data-works-page] dl > [data-surface-card][data-pointer-glow]'
const open = async page => {
  await page.goto(`${base}/#/works`, { waitUntil: 'networkidle' })
  await page.locator('[data-loading-screen]').waitFor({ state: 'detached' })
}
const sample = node => {
  const s = getComputedStyle(node)
  return { radius: s.borderRadius, padding: s.padding, background: s.backgroundColor, image: s.backgroundImage, border: s.borderTopColor, shadow: s.boxShadow, transition: s.transitionProperty, active: node.dataset.glowActive, edge: parseFloat(s.getPropertyValue('--edge-proximity')), x: parseFloat(s.getPropertyValue('--pointer-x')), y: parseFloat(s.getPropertyValue('--pointer-y')), before: Number(getComputedStyle(node, '::before').opacity) }
}
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' })
  try {
    await open(page)
    const cards = page.locator(selector)
    assert.equal(await cards.count(), 6, 'six Works Role/Year metadata surfaces retain the original pointer glow')
    assert.equal(await page.locator('[data-works-page] [data-surface-card][data-pointer-glow]').count(), 6, 'Works statistics do not opt into glow')
    for (const card of await cards.all()) {
      assert.deepEqual(await card.evaluate(node => [...node.children].map(child => child.tagName)), ['DT', 'DD'], 'metadata stays dl > div > dt/dd without glow wrappers')
      assert.equal(await card.getAttribute('data-surface-reveal'), 'false')
      const s = await card.evaluate(sample)
      assert.equal(s.radius, '8px'); assert.equal(s.padding, '12px')
      assert.equal(s.background, 'rgba(255, 255, 255, 0.04)'); assert.equal(s.image, 'none')
      assert.equal(s.border, 'rgba(255, 255, 255, 0.1)'); assert.equal(s.shadow, 'none')
      assert.equal(s.transition, 'background-color, border-color')
    }
    const card = cards.first()
    await card.scrollIntoViewIfNeeded()
    const box = await card.boundingBox()
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.waitForFunction(s => document.querySelector(s)?.dataset.glowActive === 'true', selector)
    const center = await card.evaluate(sample)
    await page.mouse.move(box.x + 3, box.y + 3)
    await page.waitForFunction(s => Number(getComputedStyle(document.querySelector(s), '::before').opacity) > .5, selector)
    const edge = await card.evaluate(sample)
    assert.ok(edge.edge > center.edge + 50, 'edge proximity changes with mouse position')
    assert.ok(edge.before > 0, 'the real hollow border becomes visible at the edge')
    assert.ok(Math.abs(edge.x - 3) < 1 && Math.abs(edge.y - 3) < 1, 'absolute local coordinates follow the mouse')
    await page.mouse.move(box.x + box.width - 4, box.y + box.height - 4)
    await page.waitForFunction(s => parseFloat(document.querySelector(s).style.getPropertyValue('--pointer-x')) > 20, selector)
    const moved = await card.evaluate(sample)
    assert.ok(Math.abs(moved.x - (box.width - 4)) < 1 && Math.abs(moved.y - (box.height - 4)) < 1)
    // Background alpha can round to .08 before the border finishes its shared transition.
    await page.waitForFunction(s => { const css = getComputedStyle(document.querySelector(s)); return css.backgroundColor === 'rgba(255, 255, 255, 0.08)' && css.borderTopColor === 'rgba(255, 255, 255, 0.25)' }, selector)
    assert.equal((await card.evaluate(sample)).border, 'rgba(255, 255, 255, 0.25)')
    await page.mouse.move(0, 0)
    await page.waitForFunction(s => document.querySelector(s)?.dataset.glowActive === 'false' && Number(getComputedStyle(document.querySelector(s), '::before').opacity) === 0, selector)
    assert.equal((await card.evaluate(sample)).edge, 0, 'leave resets edge and fades the original pseudo-element')
    await card.dispatchEvent('pointermove', { pointerType: 'touch', clientX: box.x + 3, clientY: box.y + 3 })
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
    assert.equal((await card.evaluate(sample)).active, 'false', 'touch pointer events never activate the glow')
    console.log('PASS Works native metadata surface material, pointer tracking, visible edge glow and leave fade')
  } finally { await page.close() }

  for (const mode of ['reduce', 'touch']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: mode === 'reduce' ? 'reduce' : 'no-preference', ...(mode === 'touch' ? { hasTouch: true, isMobile: true } : {}) })
    try {
      const page = await context.newPage(); await open(page)
      const card = page.locator(selector).first()
      await card.scrollIntoViewIfNeeded()
      await card.dispatchEvent('pointermove', { pointerType: 'mouse', clientX: 10, clientY: 10 })
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
      assert.equal((await card.evaluate(sample)).active, 'false', `${mode} guard rejects even mouse pointer events`)
      assert.deepEqual(await card.evaluate(node => ['::before', '::after'].map(p => getComputedStyle(node, p).display)), ['none', 'none'])
      console.log(`PASS ${mode} pointer glow stays disabled`)
    } finally { await context.close() }
  }
} finally { await browser.close() }
