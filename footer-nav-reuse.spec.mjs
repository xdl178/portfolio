import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'

// Catches an About-only imitation drifting from the actual shared footer control.
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
const styles = el => { const s = getComputedStyle(el); return { font: s.fontFamily, size: s.fontSize, weight: s.fontWeight, line: s.lineHeight, gap: s.gap, color: s.color, height: s.minHeight } }
const tracks = item => item.locator('.footer-nav-track').evaluateAll(nodes => nodes.map(el => getComputedStyle(el).transform))
const failures = []
try {
  for (const options of [
    { viewport: { width: 1440, height: 1000 } },
    { viewport: { width: 390, height: 1000 }, reducedMotion: 'reduce' },
    { viewport: { width: 390, height: 1000 }, isMobile: true, hasTouch: true },
  ]) {
    const page = await browser.newPage(options)
    try {
      await page.goto('http://127.0.0.1:5180/#/about', { waitUntil: 'networkidle' })
      await page.locator('[data-loading-screen]').waitFor({ state: 'detached' })
      const browse = page.locator('[data-about-page]').getByRole('link', { name: '浏览我的作品集', exact: true })
      assert.equal(await browse.evaluate(el => el.classList.contains('footer-nav-link')), true, 'About browse uses the shared FooterNavLink control')
      assert.equal(await browse.evaluate(el => el.tagName), 'A')
      assert.match(await browse.getAttribute('href'), /#\/works$/)
      const footer = page.getByRole('navigation', { name: '页脚导航' }).getByRole('link', { name: '精选作品', exact: true })
      assert.deepEqual(await browse.evaluate(styles), await footer.evaluate(styles), 'About and footer share the actual text/arrow geometry and typography')
      assert.equal(await browse.locator('.footer-nav-text .footer-nav-copy').count(), 3)
      assert.equal(await browse.locator('.footer-nav-arrow svg').count(), 3)
      assert.equal(await browse.locator('.footer-nav-roll[aria-hidden="true"]').count(), 2)
      await browse.scrollIntoViewIfNeeded(); await page.mouse.move(0, 0)
      const rest = await tracks(browse), geometry = await browse.boundingBox()
      await browse.hover()
      if (options.reducedMotion || options.hasTouch) {
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(resolve)))))
        assert.deepEqual(await tracks(browse), rest, 'touch/reduced motion keep the same static pose')
      } else {
        await page.waitForFunction(el => {
          const base = [...el.querySelectorAll('[data-nav-copy="base"]')], clip = [...el.querySelectorAll('.footer-nav-roll')]
          return base[0].getBoundingClientRect().top < clip[0].getBoundingClientRect().top - 30 && base[1].getBoundingClientRect().top > clip[1].getBoundingClientRect().top + 30
        }, await browse.elementHandle())
        assert.deepEqual(await browse.boundingBox(), geometry, 'spring never shifts or resizes the native link')
        await page.mouse.move(0, 0)
        await page.waitForFunction(({ el, rest }) => JSON.stringify([...el.querySelectorAll('.footer-nav-track')].map(node => getComputedStyle(node).transform)) === JSON.stringify(rest), { el: await browse.elementHandle(), rest })
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
      await browse.focus(); await page.keyboard.press('Enter'); await page.waitForURL(/#\/works$/)
      console.log(`PASS ${options.hasTouch ? 'touch' : options.reducedMotion ? 'reduced motion' : 'desktop'} shared About/footer link: native route, exact geometry, three-row motion and safe fallback`)
    } catch (error) { failures.push(error.message); console.error('FAIL', error.message) }
    finally { await page.close() }
  }
} finally { await browser.close() }
if (failures.length) process.exitCode = 1
