import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
mkdirSync('.shots', { recursive: true })
const failures = []
async function check(name, run) {
  try { await run(); console.log('PASS', name) }
  catch (error) { failures.push(name); console.error('FAIL', name, error.message) }
}
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
async function open(options = {}) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, ...options })
  page.setDefaultTimeout(6000)
  await page.goto('http://127.0.0.1:5180/#/', { waitUntil: 'networkidle' })
  await page.locator('[data-loading-screen]').waitFor({ state: 'detached' })
  return page
}
const baseTransforms = item => item.locator('[data-nav-copy="base"]').evaluateAll(nodes => nodes.map(node => getComputedStyle(node.parentElement).transform))
async function waitRest(page, item, before) {
  await page.waitForFunction(({ element, before }) => JSON.stringify([...element.querySelectorAll('[data-nav-copy="base"]')].map(node => getComputedStyle(node.parentElement).transform)) === JSON.stringify(before), { element: await item.elementHandle(), before })
}
try {
  await check('four footer controls keep exact accessible names, main text color, clipped label and arrow copies', async () => {
    const page = await open({ reducedMotion: 'reduce' })
    try {
      const nav = page.getByRole('navigation', { name: '页脚导航' })
      for (const [role, label] of [['link', '首页'], ['link', '精选作品'], ['link', '关于我'], ['button', '联系']]) {
        const item = nav.getByRole(role, { name: label, exact: true })
        assert.equal(await item.count(), 1)
        assert.equal(await item.evaluate(node => getComputedStyle(node).color), 'rgb(248, 250, 252)')
        assert.equal(await item.locator('.footer-nav-text .footer-nav-copy').count(), 3)
        assert.equal(await item.locator('.footer-nav-arrow svg').count(), 3)
        assert.equal(await item.locator('.footer-nav-roll[aria-hidden="true"]').count(), 2, 'decorative copies never duplicate accessible names')
        for (const overflow of await item.locator('.footer-nav-roll').evaluateAll(nodes => nodes.map(node => getComputedStyle(node).overflow))) assert.equal(overflow, 'hidden')
      }
      await page.evaluate(() => document.documentElement.style.setProperty('--text', '200 50% 80%'))
      await page.waitForFunction(() => getComputedStyle(document.querySelector('.contact-footer-nav a')).color === 'rgb(179, 213, 230)')
    } finally { await page.close() }
  })
  await check('pointer rolls whole label up and arrows down with reversible spring and no layout shift', async () => {
    const page = await open()
    try {
      const item = page.getByRole('navigation', { name: '页脚导航' }).getByRole('link', { name: '精选作品', exact: true })
      assert.equal(await item.locator('[data-nav-copy="base"]').count(), 2)
      await item.scrollIntoViewIfNeeded(); await page.mouse.move(0, 0)
      const before = await baseTransforms(item)
      const geometry = await item.boundingBox()
      await item.hover()
      await page.waitForFunction(element => {
        const base = [...element.querySelectorAll('[data-nav-copy="base"]')]
        const clip = [...element.querySelectorAll('.footer-nav-roll')]
        return base[0].getBoundingClientRect().top < clip[0].getBoundingClientRect().top - 30 && base[1].getBoundingClientRect().top > clip[1].getBoundingClientRect().top + 30
      }, await item.elementHandle())
      assert.equal(await item.evaluate(node => getComputedStyle(node).color), 'rgb(248, 250, 252)')
      const after = await item.boundingBox(); assert.ok(Math.abs(after.width - geometry.width) < .1 && Math.abs(after.x - geometry.x) < .1)
      await page.locator('.contact-footer-nav').screenshot({ path: '.shots/footer-nav-hover.png' })
      await page.mouse.move(0, 0); await waitRest(page, item, before)
      await item.focus(); await page.waitForFunction(element => getComputedStyle(element.querySelector('.footer-nav-text .footer-nav-track')).transform !== 'none', await item.elementHandle())
      await page.locator('section#footer-channels').focus(); await waitRest(page, item, before)
    } finally { await page.close() }
  })
  for (const options of [{ reducedMotion: 'reduce' }, { viewport: { width: 320, height: 900 }, isMobile: true, hasTouch: true }]) {
    await check(`${options.hasTouch ? 'touch' : 'reduced motion'} preserves static arrows and readable navigation`, async () => {
      const page = await open(options)
      try {
        const nav = page.getByRole('navigation', { name: '页脚导航' })
        assert.equal(await nav.locator('.footer-nav-arrow').count(), 4)
        for (const item of await nav.locator('a,button').all()) {
          await item.scrollIntoViewIfNeeded()
          const before = await baseTransforms(item)
          await item.hover(); await item.focus()
          await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(resolve)))))
          assert.deepEqual(await baseTransforms(item), before)
          const box = await item.boundingBox(); assert.ok(box.x >= 0 && box.x + box.width <= (options.viewport?.width || 1440) + 1)
        }
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
        await nav.screenshot({ path: `.shots/footer-nav-${options.hasTouch ? '320' : '1440'}.png` })
      } finally { await page.close() }
    })
  }
  await check('footer routes, same-home back-top and contact focus remain native and route-preserving', async () => {
    const page = await open({ reducedMotion: 'reduce' })
    try {
      const nav = page.getByRole('navigation', { name: '页脚导航' })
      await nav.getByRole('button', { name: '联系', exact: true }).click()
      await page.waitForFunction(() => document.activeElement?.id === 'footer-channels')
      assert.ok(page.url().endsWith('#/'))
      await nav.getByRole('link', { name: '精选作品', exact: true }).click(); await page.waitForURL(/#\/works$/)
      await nav.getByRole('link', { name: '关于我', exact: true }).click(); await page.waitForURL(/#\/about$/)
      await nav.getByRole('link', { name: '首页', exact: true }).click(); await page.waitForURL(/#\/$/)
      await nav.getByRole('link', { name: '首页', exact: true }).click(); await page.waitForFunction(() => scrollY <= 2)
    } finally { await page.close() }
  })
} finally { await browser.close() }
if (failures.length) process.exitCode = 1
