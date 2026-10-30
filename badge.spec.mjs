import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
const readStyle = node => {
  const css = getComputedStyle(node), dot = getComputedStyle(node.firstElementChild)
  return { text: node.textContent.trim(), badge: Object.fromEntries(['alignItems','fontSize','fontFamily','fontWeight','lineHeight','letterSpacing','textTransform','paddingTop','paddingRight','paddingBottom','paddingLeft','gap','borderRadius','borderWidth','borderColor','color','backgroundColor'].map(key => [key, css[key]])), dot: Object.fromEntries(['width','height','backgroundColor','borderRadius','boxShadow'].map(key => [key, dot[key]])) }
}
const motionStyle = node => {
  const css = getComputedStyle(node)
  return Object.fromEntries(['backgroundColor', 'borderColor', 'color', 'transform', 'boxShadow', 'transitionProperty', 'transitionDuration', 'transitionTimingFunction'].map(key => [key, css[key]]))
}
try {
  // Catches missing global color feedback, asymmetric reversal, and false touch hover.
  for (const mode of ['normal', 'reduced', 'touch']) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference', hasTouch: mode === 'touch' })
    try {
      await page.goto('http://127.0.0.1:5180/', { waitUntil: 'networkidle' })
      await page.locator('[data-loading-screen]').waitFor({ state: 'detached' })
      // Hero's independent entrance lasts beyond the loading screen.
      await page.waitForTimeout(2800)
      for (const badge of await page.locator('[data-ui-badge]').all()) {
        await badge.scrollIntoViewIfNeeded()
        await page.mouse.move(0, 0)
        await page.waitForTimeout(250)
        const before = await badge.evaluate(motionStyle)
        await badge.hover({ force: true })
        await page.waitForTimeout(250)
        const after = await badge.evaluate(motionStyle)
        assert.equal(after.transform, before.transform, `${mode}: no badge lift/scale`)
        assert.equal(after.boxShadow, before.boxShadow, `${mode}: no badge shadow`)
        assert.equal(after.color, before.color, `${mode}: text color preserved`)
        if (mode === 'touch') {
          assert.equal(after.backgroundColor, before.backgroundColor, 'coarse pointer has no hover feedback')
          assert.equal(after.borderColor, before.borderColor, 'coarse pointer border stays static')
        } else {
          assert.equal(after.backgroundColor, 'rgba(255, 255, 255, 0.15)', `${mode}: shared Badge hover background`)
          assert.equal(after.borderColor, 'rgba(0, 0, 0, 0)', `${mode}: hover removes the visible outline rather than adding brand color`)
          if (mode === 'normal') {
            assert.equal(after.transitionProperty, 'background-color, border-color')
            assert.equal(after.transitionDuration, '0.2s, 0.2s')
            assert.equal(after.transitionTimingFunction, 'cubic-bezier(0.16, 1, 0.3, 1), cubic-bezier(0.16, 1, 0.3, 1)')
          } else {
            assert.ok(after.transitionDuration.split(',').every(value => parseFloat(value) <= 0.00001), 'reduced motion has effectively no transition')
          }
        }
        await page.mouse.move(0, 0)
        await page.waitForTimeout(250)
        const reversed = await badge.evaluate(motionStyle)
        assert.equal(reversed.backgroundColor, before.backgroundColor, `${mode}: background reverses`)
        assert.equal(reversed.borderColor, before.borderColor, `${mode}: border reverses`)
      }
      console.log(`PASS ${mode} global Badge hover/reverse with no geometric motion`)
    } finally { await page.close() }
  }
  for (const width of [1440, 768, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
    try {
      await page.goto('http://127.0.0.1:5180/', { waitUntil: 'networkidle' })
      await page.locator('[data-loading-screen]').waitFor({ state: 'detached' })
      const badges = await page.locator('[data-ui-badge]').evaluateAll(nodes => nodes.map(node => node.textContent.trim()))
      assert.ok(badges.length >= 3, 'Home includes Hero, profile, and Footer shared badges')
      console.log(`CHECK ${width}px all ${badges.length} rendered shared badges: ${badges.join(' / ')}`)
      const styles = []
      for (const badge of await page.locator('[data-ui-badge]').all()) {
        const style = await badge.evaluate(readStyle)
        styles.push(style)
        const isHero = style.text === 'Visual UI Design 2026'
        assert.equal(style.badge.fontSize, isHero ? '12px' : '14px', `${width}px ${style.text}: requested Hero size exception`)
        assert.equal(style.badge.lineHeight, isHero ? '18px' : '21px')
        assert.equal(style.badge.letterSpacing, isHero ? '0.96px' : '1.12px')
        for (const key of ['paddingTop', 'paddingBottom']) assert.equal(style.badge[key], '6px', `${style.text}: ${key}`)
        for (const key of ['paddingLeft', 'paddingRight']) assert.equal(style.badge[key], '16px', `${style.text}: ${key}`)
        assert.equal(style.badge.gap, '8px', `${style.text}: gap`)
        assert.equal(style.badge.backgroundColor, 'rgba(255, 255, 255, 0.08)')
        assert.equal(style.badge.borderRadius, '9999px')
        assert.equal(style.dot.width, '6px'); assert.equal(style.dot.height, '6px')
        assert.equal(await badge.getAttribute('tabindex'), null, 'Badge is not a fake control')
        assert.equal(await badge.getAttribute('role'), null, 'Badge retains native noninteractive semantics')
      }
      for (const style of styles) {
        const shared = value => Object.fromEntries(Object.entries(value).filter(([key]) => !['fontSize', 'lineHeight', 'letterSpacing'].includes(key)))
        assert.deepEqual(shared(style.badge), shared(styles[0].badge), `${style.text}: shared visuals match apart from the explicit Hero typography exception`)
        assert.deepEqual(style.dot, styles[0].dot, 'all shared badges preserve dot treatment')
      }
      assert.equal(await page.locator('#home [data-ui-badge]').count(), 1)
      assert.equal(await page.locator('#footer-sec [data-ui-badge].contact-footer-badge').count(), 1)
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
      console.log(`PASS ${width}px Hero Badge is 12px, others 14px; shared 6x16px / gap8`)
    } finally { await page.close() }
  }
} finally { await browser.close() }
