import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
const base = process.env.PORTFOLIO_URL || 'http://127.0.0.1:5180/'
const failures = []
async function check(name, run) { try { await run(); console.log(`PASS ${name}`) } catch (e) { failures.push(name); console.error(`FAIL ${name}: ${e.message}`) } }
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(`${base}#/works`, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: '全部作品' }).click()
  await check('every archive Enter has a visible directional arrow', async () => {
    const arrows = page.locator('[data-work-enter] svg')
    assert.equal(await arrows.count(), 3)
    await arrows.first().scrollIntoViewIfNeeded()
    assert.equal(await arrows.first().isVisible(), true)
  })
  await page.goto(`${base}#/works/original-ip`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { level: 1, name: '原创 IP 视觉与交互设计', exact: true }).waitFor()
  await page.waitForTimeout(800)
  await check('cursor halo is modestly brighter without changing blue hue', async () => {
    const gradient = await page.locator('[data-work-halo] > span').evaluate(el => getComputedStyle(el).backgroundImage)
    assert.match(gradient, /0\.1[5-9]|0\.2/)
  })
  await check('border peak aligns with actual pointer on vertical and horizontal edges', async () => {
    await page.addStyleTag({ content: '[data-work-halo] { visibility: hidden !important; }' })
    const panel = page.locator('[data-pointer-glow]').first()
    await panel.scrollIntoViewIfNeeded()
    const box = await panel.boundingBox()
    for (const side of ['right', 'top']) {
      const px = side === 'right' ? box.width - 2 : box.width * .35
      const py = side === 'right' ? box.height * .4 : 2
      await page.mouse.move(box.x + px, box.y + py)
      await page.waitForTimeout(320)
      const png = (await panel.screenshot()).toString('base64')
      const peak = await page.evaluate(async ({ png, side }) => {
        const image = new Image(); image.src = `data:image/png;base64,${png}`; await image.decode()
        const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height
        const ctx = canvas.getContext('2d'); ctx.drawImage(image, 0, 0)
        const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
        let peak = 0, maximum = -1
        for (let p = 14; p < (side === 'right' ? canvas.height : canvas.width) - 14; p++) {
          // Bounding boxes have subpixel origins; include the first three raster
          // rows/columns so the 2px highlight isn't lost to screenshot rounding.
          let value = 0
          for (let edge = 0; edge < 3; edge++) {
            const x = side === 'right' ? canvas.width - 1 - edge : p
            const y = side === 'right' ? p : edge
            const offset = (y * canvas.width + x) * 4
            value = Math.max(value, data[offset] + data[offset + 1] + data[offset + 2])
          }
          if (value > maximum) { peak = p; maximum = value }
        }
        return { peak, maximum }
      }, { png, side })
      const expected = side === 'right' ? py : px
      assert.ok(Math.abs(peak.peak - expected) < 14, `${side}: brightest border at ${peak.peak}, cursor at ${expected.toFixed(1)}`)
      assert.ok(peak.maximum > 180, `${side}: visible edge highlight`)
    }
  })
  await check('shared surfaces keep their 8px exception, legacy rectangles 12px and navigation stays rounded', async () => {
    for (const route of ['works/original-ip', 'works', 'about', '']) {
      await page.goto(`${base}#/${route}`, { waitUntil: 'networkidle' })
      await page.waitForTimeout(1300)
      const invalid = await page.locator('.rounded-card, .rounded-panel, .rounded-field, [data-pointer-glow]').evaluateAll(elements => elements.filter(el => getComputedStyle(el).borderTopLeftRadius !== (el.matches('[data-surface-card]') ? '8px' : '12px')).map(el => ({ tag: el.tagName, radius: getComputedStyle(el).borderTopLeftRadius })))
      assert.deepEqual(invalid, [], route)
      const nav = await page.locator('nav[aria-label="主导航"]').evaluate(el => getComputedStyle(el).borderTopLeftRadius)
      assert.ok(parseFloat(nav) > 100, 'navigation retains capsule radius')
    }
  })
} finally { await browser.close() }
if (failures.length) process.exitCode = 1
