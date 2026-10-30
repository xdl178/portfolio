import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'
import { readFileSync, writeFileSync, existsSync, unlinkSync, openSync, closeSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

mkdirSync('.shots', { recursive: true })
const failures = []
async function check(name, fn) {
  try { await fn(); console.log('PASS', name) }
  catch (error) { failures.push(name); console.error('FAIL', name, error.message) }
}
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
async function open(width, height, route = '', reducedMotion = 'reduce') {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion })
  await page.goto(`http://127.0.0.1:5180/#/${route}`, { waitUntil: 'networkidle' })
  await page.locator('[data-loading-screen]').waitFor({ state: 'detached' })
  return page
}
async function assertBounds(dialog, width, height) {
  for (const control of await dialog.locator('button,a').all()) {
    const box = await control.boundingBox()
    assert.ok(box && box.x >= -1 && box.y >= -1 && box.x + box.width <= width + 1 && box.y + box.height <= height + 1,
      `${await control.innerText()}: ${JSON.stringify(box)}`)
  }
  assert.equal(await dialog.locator('img').evaluate(image => getComputedStyle(image).objectFit), 'contain')
}
try {
  for (const [width, height] of [[320, 844], [390, 844], [844, 390]]) {
    await check(`lightbox bounds/image/focus lifecycle at ${width}x${height}`, async () => {
      const page = await open(width, height, 'works/original-ip')
      try {
        const opener = page.locator('#work-originals button').first()
        await opener.click()
        const dialog = page.getByRole('dialog')
        const close = dialog.getByRole('button', { name: '关闭原稿' })
        await assertBounds(dialog, width, height)
        await dialog.locator('img').evaluate(image => image.decode())
        await assertBounds(dialog, width, height)
        assert.ok(await close.evaluate(element => element === document.activeElement))
        await page.keyboard.press('Shift+Tab')
        assert.ok(await dialog.getByRole('button', { name: '下一张', exact: true }).evaluate(element => element === document.activeElement))
        await page.keyboard.press('Tab')
        assert.ok(await close.evaluate(element => element === document.activeElement))
        const before = await dialog.locator('img').getAttribute('src')
        await page.keyboard.press('ArrowRight')
        await dialog.locator('img').evaluate(image => image.decode())
        assert.notEqual(await dialog.locator('img').getAttribute('src'), before)
        await assertBounds(dialog, width, height)
        await page.screenshot({ path: `.shots/fixed-lightbox-${width}x${height}.png` })
        if (width === 390) await close.click()
        else await page.keyboard.press('Escape')
        await page.waitForFunction(() => document.activeElement === document.querySelector('#work-originals button'))
        assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden')
      } finally { await page.close() }
    })
  }
  await check('detail section accessible heading references resolve', async () => {
    const page = await open(390, 844, 'works/original-ip')
    try {
      assert.deepEqual(await page.locator('main [aria-labelledby]').evaluateAll(nodes => nodes.flatMap(node =>
        node.getAttribute('aria-labelledby').split(/\s+/).filter(id => !document.getElementById(id)))), [])
    } finally { await page.close() }
  })
  await check('Hero scroll transforms stop and resume with motion preference changes', async () => {
    const page = await open(390, 844)
    try {
      await page.evaluate(() => scrollTo({ top: 400, behavior: 'instant' }))
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(resolve)))))
      const transforms = await page.locator('#home .hero-p-bg').evaluate(element => {
        const content = element.closest('section').querySelector('.absolute.inset-0.z-10')
        return { bg: getComputedStyle(element.parentElement).transform, content: getComputedStyle(content).transform }
      })
      for (const value of Object.values(transforms)) assert.ok(value === 'none' || value === 'matrix(1, 0, 0, 1, 0, 0)', JSON.stringify(transforms))
      await page.emulateMedia({ reducedMotion: 'no-preference' })
      // GSAP's media refresh restores its cached scroll position after the MQL event.
      // Let that commit before arranging the scroll which this Hero assertion exercises.
      await page.waitForFunction(() => !matchMedia('(prefers-reduced-motion: reduce)').matches)
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(resolve)))))
      await page.evaluate(() => scrollTo({ top: 400, behavior: 'instant' }))
      await page.waitForFunction(() => {
        const bg = document.querySelector('#home .hero-p-bg')
        const content = bg.closest('section').querySelector('.absolute.inset-0.z-10')
        const backgroundMatrix = new DOMMatrixReadOnly(getComputedStyle(bg.parentElement).transform)
        const contentMatrix = new DOMMatrixReadOnly(getComputedStyle(content).transform)
        return scrollY === 400 && backgroundMatrix.m11 > 1 && backgroundMatrix.m22 > 1 && contentMatrix.m42 < 0
      }, undefined, { timeout: 5000 })
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.waitForFunction(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(resolve)))))
      await page.evaluate(() => scrollTo({ top: 400, behavior: 'instant' }))
      await page.waitForFunction(() => {
        const bg = document.querySelector('#home .hero-p-bg')
        const content = bg.closest('section').querySelector('.absolute.inset-0.z-10')
        return scrollY === 400 && getComputedStyle(bg.parentElement).transform === 'none' && getComputedStyle(content).transform === 'none'
      }, undefined, { timeout: 5000 })
      await page.mouse.move(330, 400)
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(resolve)))))
      assert.equal(await page.locator('#home .hero-p-bg').evaluate(element => getComputedStyle(element).transform), 'none', 'reduced motion must remove mouse quickTo')
      await page.evaluate(() => scrollTo({ top: 200, behavior: 'instant' }))
      assert.equal(await page.locator('#home .hero-p-bg').evaluate(element => getComputedStyle(element.parentElement).transform), 'none')
    } finally { await page.close() }
  })
  await check('reduced-motion route navigation never blurs about or 404', async () => {
    const page = await open(390, 844, 'works')
    try {
      for (const [route, title] of [['about', /关于/], ['not-a-page', /^404$/]]) {
        await page.evaluate(route => { location.hash = `/${route}` }, route)
        await page.locator('main').getByRole('heading', { level: 1, name: title }).waitFor()
        assert.deepEqual(await page.locator('main > div').first().evaluate(element => ({ filter: getComputedStyle(element).filter, transform: getComputedStyle(element).transform })), { filter: 'none', transform: 'none' })
      }
    } finally { await page.close() }
  })
  await check('archive cover actually uses 900ms transition', async () => {
    const page = await open(1440, 1000, 'works', 'no-preference')
    try { assert.equal(await page.locator('main article img').first().evaluate(element => getComputedStyle(element).transitionDuration), '0.9s') }
    finally { await page.close() }
  })
  await check('lint checks the actual application project', async () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
    assert.match(pkg.scripts.lint, /tsc\s+-b\b|tsc\s+.*(?:--project|-p)\s+tsconfig\.app/)
    const target = resolve('src/__audit_lint_probe__.ts')
    assert.equal(target, resolve(process.cwd(), 'src', '__audit_lint_probe__.ts'))
    assert.equal(existsSync(target), false, 'never overwrite an existing probe')
    try {
      writeFileSync(target, 'export const auditTypeProbe: number = "must fail"\n')
      const [compiler, ...args] = pkg.scripts.lint.split(/\s+/)
      assert.equal(compiler, 'tsc')
      const logPath = resolve('.shots/lint-negative.log')
      const fd = openSync(logPath, 'w')
      let result
      try { result = spawnSync(process.execPath, [resolve('node_modules/typescript/bin/tsc'), ...args], { stdio: ['ignore', fd, fd] }) }
      finally { closeSync(fd) }
      assert.equal(result.error, undefined)
      assert.notEqual(result.status, 0)
      assert.match(readFileSync(logPath, 'utf8'), /__audit_lint_probe__\.ts.*TS2322/, 'require the injected TypeScript error, not a shell failure')
    } finally {
      assert.equal(target, resolve(process.cwd(), 'src', '__audit_lint_probe__.ts'))
      if (existsSync(target)) unlinkSync(target)
    }
  })
} finally { await browser.close() }
if (failures.length) { console.error(`${failures.length} audit regressions failed`); process.exitCode = 1 }
