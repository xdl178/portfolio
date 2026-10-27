import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'

const base = process.env.PORTFOLIO_URL || 'http://127.0.0.1:5180/'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
const failures = []

async function check(label, run) {
  try { await run(); console.log(`PASS ${label}`) }
  catch (error) { failures.push(`${label}: ${error.stack ?? error}`); console.error(`FAIL ${label}: ${error.message}`) }
}

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const errors = []
  desktop.on('pageerror', error => errors.push(error.message))
  desktop.on('response', response => { if (response.url().includes('/images/works/') && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`) })
  await desktop.goto(`${base}#/works`, { waitUntil: 'networkidle' })
  await desktop.getByRole('heading', { name: /作品.*档案/ }).waitFor({ timeout: 12000 })

  await check('filter keeps only matching work and resets without losing routes', async () => {
    await desktop.getByRole('button', { name: '原创 IP' }).click()
    await desktop.waitForFunction(() => document.querySelectorAll('main a[href*="/works/"]').length === 1)
    await desktop.getByRole('button', { name: '全部作品' }).click()
    await desktop.waitForFunction(() => document.querySelectorAll('main a[href*="/works/"]').length === 3)
  })

  await check('archive title and cards reveal as they enter the viewport', async () => {
    assert.equal(await desktop.locator('main [data-works-reveal]').count() >= 4, true)
    const card = desktop.locator('main [data-works-reveal]').last()
    await card.scrollIntoViewIfNeeded()
    await desktop.waitForTimeout(650)
    assert.ok(Number(await card.evaluate(el => getComputedStyle(el).opacity)) > .8)
  })

  await desktop.locator('main a[href*="/works/"]').first().click()
  await desktop.getByRole('heading', { name: /原创 IP/ }).first().waitFor()
  await desktop.locator('main [data-pointer-glow]').first().waitFor()
  await desktop.waitForTimeout(650)
  await check('a subtle cursor halo follows the pointer over work details', async () => {
    const halo = desktop.locator('[data-work-halo]')
    assert.equal(await halo.count(), 1)
    await desktop.mouse.move(520, 420)
    await desktop.waitForTimeout(180)
    const transform = await halo.evaluate(el => getComputedStyle(el).transform)
    assert.notEqual(transform, 'none')
    assert.equal(await halo.getAttribute('data-visible'), 'true')
  })
  await check('pointer lights border only near cursor on detail panels', async () => {
    const panel = desktop.locator('[data-pointer-glow]').first()
    assert.equal(await desktop.locator('[data-pointer-glow]').count() >= 6, true)
    await panel.scrollIntoViewIfNeeded()
    const box = await panel.boundingBox()
    assert.ok(box)
    await desktop.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await desktop.waitForTimeout(90)
    const center = await panel.evaluate(el => ({ active: el.getAttribute('data-glow-active'), edge: Number(el.style.getPropertyValue('--edge-proximity')), angle: el.style.getPropertyValue('--cursor-angle') }))
    await desktop.mouse.move(box.x + box.width - 3, box.y + box.height / 2)
    await desktop.mouse.move(box.x + box.width - 3, box.y + box.height / 2 - 6)
    await desktop.waitForTimeout(90)
    const edge = await panel.evaluate(el => ({ active: el.getAttribute('data-glow-active'), edge: Number(el.style.getPropertyValue('--edge-proximity')), angle: el.style.getPropertyValue('--cursor-angle') }))
    assert.equal(edge.active, 'true')
    assert.ok(edge.edge > center.edge + 25, `center=${center.edge}, edge=${edge.edge}`)
    assert.notEqual(edge.angle, center.angle)
    assert.match(await panel.evaluate(el => getComputedStyle(el, '::before').backgroundImage), /gradient/)
    await desktop.mouse.move(box.x - 80, box.y - 80)
    await desktop.waitForTimeout(90)
    assert.equal(await panel.getAttribute('data-glow-active'), 'false')
  })

  await check('original cards offer native new-tab links and contextual preview hints', async () => {
    const section = desktop.locator('#work-originals')
    const link = section.locator('a[target="_blank"]').first()
    assert.equal(await link.count(), 1)
    assert.match(await link.getAttribute('href'), /\.jpg$/)
    assert.ok(await section.locator('[data-original-hint]').count() > 0)
  })
  await check('detail sections preserve gallery and keyboard lightbox', async () => {
    const original = desktop.locator('section[aria-labelledby="originals-h"] button').first()
    await original.scrollIntoViewIfNeeded()
    await original.click()
    await desktop.getByRole('dialog').waitFor()
    const first = await desktop.getByRole('dialog').getAttribute('aria-label')
    const dialog = desktop.getByRole('dialog')
    const bounds = await dialog.boundingBox()
    assert.ok(bounds && Math.abs(bounds.y) < 2 && Math.abs(bounds.height - 900) < 2, `dialog covers viewport after long scroll: ${JSON.stringify(bounds)}`)
    assert.equal(await dialog.evaluate(el => el.contains(document.activeElement)), true, 'focus enters dialog automatically')
    await desktop.keyboard.press('Shift+Tab')
    assert.equal(await desktop.getByRole('dialog').evaluate(el => el.contains(document.activeElement)), true, 'focus remains in dialog')
    await desktop.keyboard.press('ArrowRight')
    await desktop.waitForTimeout(70)
    assert.notEqual(await desktop.getByRole('dialog').getAttribute('aria-label'), first)
    await desktop.keyboard.press('Escape')
    await desktop.getByRole('dialog').waitFor({ state: 'hidden' })
    assert.notEqual(await desktop.evaluate(() => document.body.style.overflow), 'hidden', 'body unlocks on close')
    await original.waitFor({ state: 'visible' })
    assert.equal(await original.evaluate(el => document.activeElement === el), true, 'focus returns to the clicked original')
  })

  await check('halo tracks viewport and expands over interactive targets after scrolling', async () => {
    await desktop.locator('section[aria-labelledby="related-h"]').scrollIntoViewIfNeeded()
    await desktop.mouse.move(700, 200)
    await desktop.waitForTimeout(650)
    const halo = desktop.locator('[data-work-halo]')
    const bounds = await halo.boundingBox()
    assert.ok(bounds && Math.abs(bounds.x + bounds.width / 2 - 700) < 3 && Math.abs(bounds.y + bounds.height / 2 - 200) < 3, `halo follows viewport pointer: ${JSON.stringify(bounds)}`)
    await desktop.locator('section[aria-labelledby="related-h"] a').first().hover()
    await desktop.waitForTimeout(350)
    assert.equal(await halo.getAttribute('data-hovering'), 'true')
  })
  await check('related cards tilt on pointer movement and reset on leave', async () => {
    const tilt = desktop.locator('[data-work-tilt]').first()
    assert.equal(await tilt.count(), 1)
    await tilt.scrollIntoViewIfNeeded()
    const box = await tilt.boundingBox()
    await desktop.mouse.move(box.x + box.width * .8, box.y + box.height * .3)
    await desktop.waitForTimeout(300)
    const active = await tilt.evaluate(el => getComputedStyle(el).transform)
    assert.notEqual(active, 'none')
    await desktop.mouse.move(0, 100)
    await desktop.waitForTimeout(1000)
    const reset = await tilt.evaluate(el => getComputedStyle(el).transform)
    assert.notEqual(reset, active)
  })
  await check('related works link opens another detail', async () => {
    await desktop.locator('section[aria-labelledby="related-h"] a[href*="/works/"]').first().click()
    await desktop.waitForURL(/works\/(?!original-ip)[^/]+$/)
    await desktop.getByRole('heading', { level: 1, name: '粒象工作室品牌交互设计' }).waitFor()
    await desktop.waitForTimeout(650)
    assert.ok(await desktop.evaluate(() => window.scrollY < 5), 'detail-to-detail navigation returns to top')
  })

  await check('all three case routes and their full-resolution assets resolve', async () => {
    const assets = new Set()
    for (const id of ['original-ip', 'art-studio', 'mivox']) {
      await desktop.goto(`${base}#/works/${id}`, { waitUntil: 'networkidle' })
      await desktop.getByRole('heading', { level: 1, name: { 'original-ip': '原创 IP 视觉与交互设计', 'art-studio': '粒象工作室品牌交互设计', mivox: 'Mivox 觅沃产品网页设计' }[id], exact: true }).waitFor()
      assert.equal(await desktop.locator('#work-pages figure').count(), { 'original-ip': 19, 'art-studio': 15, mivox: 11 }[id])
      for (const src of await desktop.locator('[data-work-detail] img').evaluateAll(imgs => imgs.map(img => img.src))) assets.add(src)
    }
    for (const src of assets) {
      const response = await desktop.request.get(src)
      assert.equal(response.ok(), true, src)
      assert.match(response.headers()['content-type'], /image\//, src)
    }
    console.log(`Verified ${assets.size} unique work images`)
  })
  await check('global cursor is mounted once on homepage too', async () => {
    await desktop.goto(`${base}#/`, { waitUntil: 'networkidle' })
    await desktop.locator('[data-loading-screen]').waitFor({ state: 'detached' })
    await desktop.locator('#home').waitFor()
    assert.equal(await desktop.locator('[data-work-halo]').count(), 1)
  })
  await check('no runtime or image errors in desktop navigation', async () => assert.deepEqual(errors, []))
  await desktop.close()

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  await mobile.goto(`${base}#/works/original-ip`, { waitUntil: 'networkidle' })
  await mobile.getByRole('heading', { name: /原创 IP/ }).first().waitFor({ timeout: 12000 })
  await check('touch and mobile remain readable without pointer tracking', async () => {
    assert.equal(await mobile.locator('[data-pointer-glow]').count() >= 6, true)
    assert.equal(await mobile.locator('[data-pointer-glow]').first().getAttribute('data-glow-active'), 'false')
    assert.equal(await mobile.locator('[data-work-halo]').count(), 0)
    const width = await mobile.evaluate(() => ({ page: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }))
    assert.ok(width.page <= width.viewport, JSON.stringify(width))
  })
  await check('touch can filter works and open a case without pointer-only affordances', async () => {
    await mobile.goto(`${base}#/works`, { waitUntil: 'networkidle' })
    await mobile.getByRole('heading', { level: 1, name: /作品.*档案/ }).waitFor()
    await mobile.getByRole('button', { name: 'AI 产品官网' }).click()
    await mobile.waitForFunction(() => document.querySelectorAll('main a[href*="/works/"]').length === 1)
    await mobile.locator('main a[href*="/works/"]').first().click()
    await mobile.waitForURL(/works\/mivox$/)
    await mobile.getByRole('heading', { level: 1, name: 'Mivox 觅沃产品网页设计', exact: true }).waitFor()
  })
  await check('mobile lightbox covers viewport and close control remains reachable', async () => {
    const original = mobile.locator('#work-originals button').first()
    await original.click()
    const dialog = mobile.getByRole('dialog')
    await dialog.waitFor()
    const bounds = await dialog.boundingBox()
    assert.ok(bounds && Math.abs(bounds.y) < 2 && Math.abs(bounds.height - 844) < 2)
    const close = dialog.getByRole('button', { name: '关闭原稿' })
    const control = await close.boundingBox()
    assert.ok(control && control.y >= 0 && control.y + control.height <= 844)
    await close.click()
    await dialog.waitFor({ state: 'hidden' })
    assert.notEqual(await mobile.evaluate(() => document.body.style.overflow), 'hidden')
  })
  await mobile.close()

  const reduced = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  await reduced.goto(`${base}#/works/original-ip`, { waitUntil: 'networkidle' })
  await reduced.getByRole('heading', { name: /原创 IP/ }).first().waitFor({ timeout: 12000 })
  await check('reduced motion renders panels and disables pointer flare', async () => {
    const panel = reduced.locator('[data-pointer-glow]').first()
    assert.equal(await panel.count(), 1)
    await panel.scrollIntoViewIfNeeded()
    const box = await panel.boundingBox()
    assert.ok(box)
    await reduced.mouse.move(box.x + box.width - 3, box.y + box.height / 2)
    assert.equal(await panel.getAttribute('data-glow-active'), 'false')
    assert.equal(await reduced.locator('[data-work-halo]').count(), 0)
    assert.ok(Number(await panel.evaluate(el => getComputedStyle(el).opacity)) > .95)
  })
  await check('reduced motion works routes and filters do not translate or blur', async () => {
    await reduced.goto(`${base}#/works`, { waitUntil: 'networkidle' })
    await reduced.getByRole('button', { name: 'AI 产品官网' }).click()
    await reduced.waitForFunction(() => document.querySelectorAll('main article').length === 1)
    const styles = await reduced.locator('#main-content > div').evaluate(el => ({ filter: getComputedStyle(el).filter, transform: getComputedStyle(el).transform }))
    assert.equal(styles.filter, 'none')
    assert.equal(styles.transform, 'none')
    const moving = await reduced.locator('main article').evaluate(el => getComputedStyle(el).transform)
    assert.equal(moving, 'none')
  })
  await reduced.close()
} finally { await browser.close() }
if (failures.length) { console.error(failures.join('\n\n')); process.exitCode = 1 }
