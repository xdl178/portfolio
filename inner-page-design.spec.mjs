import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'

// Catches route-local capsules drifting from Badge, or filters losing native behavior.
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
const base = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:5180/'
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
    try {
      for (const [route, scope, minimum] of [
        ['/works', '[data-works-page]', 8],
        ['/about', 'main', 1],
        ['/works/original-ip', '[data-work-detail]', 3],
      ]) {
        await page.goto(`${base}#${route}`, { waitUntil: 'networkidle' })
        await page.locator('[data-loading-screen]').waitFor({ state: 'detached' })
        const main = page.locator(scope)
        // About's one header capsule must exist outside the shared footer.
        const badges = main.locator(route === '/about' ? '[data-about-header] [data-ui-badge]' : '[data-ui-badge]')
        assert.ok(await badges.count() >= minimum, `${route}: route content uses shared Badge (not merely the footer)`)
        const styles = await badges.evaluateAll(nodes => nodes.map(node => {
          const css = getComputedStyle(node), dot = getComputedStyle(node.firstElementChild)
          const root = getComputedStyle(document.documentElement)
          return { text: node.textContent.trim(), size: css.fontSize, padding: [css.paddingTop, css.paddingRight, css.paddingBottom, css.paddingLeft], gap: css.gap, radius: css.borderRadius, border: css.borderWidth, font: css.fontFamily, line: css.lineHeight, color: css.color, expected: root.getPropertyValue(node.getAttribute('aria-pressed') === 'true' ? '--brand' : '--muted').trim(), selected: node.getAttribute('aria-pressed') === 'true', dot: [dot.width, dot.height], overflow: node.scrollWidth > node.clientWidth + 1 }
        }))
        for (const style of styles) {
          assert.equal(style.size, '14px', `${route}: ${style.text} font`)
          assert.deepEqual(style.padding, ['6px', '16px', '6px', '16px'])
          assert.equal(style.gap, '8px'); assert.equal(style.radius, '9999px')
          assert.equal(style.border, '1px'); assert.equal(style.line, '21px')
          assert.match(style.font, /Source Han Sans CN/)
          assert.equal(style.color, style.selected ? 'rgb(248, 250, 252)' : 'rgb(187, 201, 219)')
          assert.deepEqual(style.dot, ['6px', '6px'])
          assert.equal(style.overflow, false, `${route}: ${style.text} fits capsule`)
        }
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} ${width}: no horizontal overflow`)
        if (route === '/works') {
          const filters = page.getByRole('group', { name: '按方向筛选作品' }).locator('[data-ui-badge]')
          assert.equal(await filters.count(), 4)
          assert.ok(await filters.evaluateAll(nodes => nodes.every(node => node.tagName === 'BUTTON' && node.type === 'button' && node.hasAttribute('aria-pressed'))))
          const entries = page.locator('article[data-works-reveal]')
          assert.equal(await entries.count(), 3)
          await filters.nth(1).click()
          await page.waitForTimeout(100)
          assert.equal(await filters.nth(1).getAttribute('aria-pressed'), 'true')
          assert.equal(await entries.count(), 1)
          assert.match(await entries.first().innerText(), /原创 IP/)
          await filters.first().focus()
          await page.keyboard.press('Enter')
          await page.waitForTimeout(100)
          assert.equal(await entries.count(), 3)
          assert.equal(await filters.first().getAttribute('aria-pressed'), 'true')
          assert.ok(await page.locator('article ul li [data-work-tag]').count() >= 12, 'tag list semantics retained')
        }
        if (route.startsWith('/works/')) {
          const back = page.locator('nav[aria-label="面包屑"] [data-action-button]')
          assert.equal(await back.evaluate(node => node.tagName), 'A')
          assert.equal(await back.getAttribute('href'), '#/works')
          assert.equal(await page.locator('dl dd [data-work-tag]').count(), 4)
        }
        console.log(`PASS inner-page design ${route} ${width}px`)
      }
    } finally { await page.close() }
  }
} finally { await browser.close() }
