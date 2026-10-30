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
async function open(width, reducedMotion = 'reduce', route = '') {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion })
  page.setDefaultTimeout(6000)
  await page.goto(`http://127.0.0.1:5180/#/${route}`, { waitUntil: 'networkidle' })
  await page.locator('[data-loading-screen]').waitFor({ state: 'detached' })
  return page
}
try {
  for (const width of [1440, 768, 390, 320]) {
    await check(`${width}px exact profile type, secondary token, badge and row gaps`, async () => {
      const page = await open(width)
      try {
        assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim().toUpperCase()), '#8692A3')
        for (const value of await page.locator('.home-about-field dt').evaluateAll(nodes => nodes.map(node => ({ color: getComputedStyle(node).color, size: getComputedStyle(node).fontSize })))) assert.deepEqual(value, { color: 'rgb(134, 146, 163)', size: '14px' })
        for (const size of await page.locator('.home-about-field dd').evaluateAll(nodes => nodes.map(node => getComputedStyle(node).fontSize))) assert.equal(size, '16px')
        assert.equal(await page.locator('.home-about-profile-card').count(), 1)
        assert.equal(await page.locator('.home-about-field dt').count(), 7)
        assert.equal(await page.locator('.home-about-field dd').count(), 7)
        const fieldRows = await page.locator('.home-about-field-row').evaluateAll(nodes => nodes.map(node => getComputedStyle(node).gridTemplateColumns.split(' ').length))
        const cardContentWidth = await page.locator('.home-about-profile-card').evaluate(node => { const s = getComputedStyle(node); return node.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight) })
        const firstRowColumns = width < 360 ? 1 : (width < 600 || cardContentWidth <= 380) ? 2 : 3
        assert.deepEqual(fieldRows, [firstRowColumns, width < 360 ? 1 : 2, 1, 1])
        assert.equal(await page.locator('#about-intro [data-ui-badge]').count(), 1)
        for (const value of await page.locator('#about-intro [data-ui-badge]').evaluateAll(nodes => nodes.map(node => { const s = getComputedStyle(node); return { size: s.fontSize, left: s.paddingLeft, right: s.paddingRight, row: s.rowGap } }))) assert.deepEqual(value, { size: '14px', left: '16px', right: '16px', row: '8px' })
        for (const gap of await page.locator('.home-about-field-row').evaluateAll(nodes => nodes.map(node => ({ column: getComputedStyle(node).columnGap, row: getComputedStyle(node).rowGap })))) assert.deepEqual(gap, { column: '24px', row: '24px' })
        assert.deepEqual(await page.locator('.home-about-fields').evaluate(node => ({ row: getComputedStyle(node).rowGap, left: getComputedStyle(node).paddingLeft })), { row: '32px', left: '0px' })
        const toolGap = width < 600 ? '16px' : '24px'
        assert.deepEqual(await page.locator('.home-about-skill-grid').evaluate(node => ({ row: getComputedStyle(node).rowGap, column: getComputedStyle(node).columnGap, left: getComputedStyle(node).paddingLeft })), { row: toolGap, column: toolGap, left: '0px' })
        assert.equal(await page.locator('.home-about-tool-name').count(), 8)
        assert.deepEqual(await page.locator('#home-about-tools-title').evaluate(node => ({ size: getComputedStyle(node).fontSize, color: getComputedStyle(node).color })), { size: '14px', color: 'rgb(134, 146, 163)' })
        for (const size of await page.locator('.home-about-tool-name, .home-about-position, .home-about-bio h3, .home-about-bio p').evaluateAll(nodes => nodes.map(node => getComputedStyle(node).fontSize))) assert.equal(size, '16px')
        for (const size of await page.locator('.home-about-tool img').evaluateAll(nodes => nodes.map(node => ({ width: getComputedStyle(node).width, height: getComputedStyle(node).height })))) assert.deepEqual(size, { width: '36px', height: '36px' })
        for (const tool of await page.locator('.home-about-tool').all()) {
          assert.deepEqual(await tool.evaluate(node => { const s = getComputedStyle(node); return { padding: s.padding, gap: s.gap, radius: s.borderRadius, transform: s.transform, shadow: s.boxShadow } }), { padding: '12px', gap: '12px', radius: '8px', transform: 'none', shadow: 'none' })
        }
        if (width < 360) for (const height of await page.locator('.home-about-field:not(.home-about-field--wide) dd').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().height))) assert.ok(height < 26, 'narrow layout must not leave single-character placeholder orphans')
        await page.evaluate(() => document.documentElement.style.setProperty('--secondary', '#AABBCC'))
        await page.waitForFunction(() => getComputedStyle(document.querySelector('.home-about-field dt')).color === 'rgb(170, 187, 204)')
        assert.equal(await page.locator('.contact-footer-copyright').evaluate(node => getComputedStyle(node).color), 'rgb(187, 201, 219)', 'muted remains independent')
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
      } finally { await page.close() }
    })
    await check(`${width}px reference contact grid uses selectable placeholder text without disabled controls or links`, async () => {
      const page = await open(width)
      try {
        const section = page.locator('.contact-footer-channels')
        const items = section.locator('.contact-item')
        assert.equal(await items.count(), 3)
        assert.deepEqual(await items.locator('.contact-label').allTextContents(), ['Email', 'Phone', 'Behance'])
        assert.equal(await section.locator('a,button,[disabled],[aria-disabled]').count(), 0)
        assert.doesNotMatch(await section.innerText(), /暂不提供外部联系跳转|选择联系通道，继续交流/)
        assert.equal(await section.evaluate(node => getComputedStyle(node).borderTopWidth), '0px')
        assert.equal(await section.locator('.contact-grid').count(), 1)
        const boxes = []
        for (const item of await items.all()) {
          assert.match(await item.locator('.contact-value').innerText(), /待补充/)
          assert.notEqual(await item.evaluate(node => getComputedStyle(node).cursor), 'not-allowed')
          assert.notEqual(await item.locator('.contact-value').evaluate(node => getComputedStyle(node).userSelect), 'none')
          const box = await item.boundingBox(); assert.ok(box && box.x >= 0 && box.x + box.width <= width + 1); boxes.push(box)
        }
        if (width > 700) {
          for (const box of boxes) assert.ok(Math.abs(box.y - boxes[0].y) < 2, 'three channels in one desktop row')
          assert.ok(boxes[0].x + boxes[0].width <= boxes[1].x + 1 && boxes[1].x + boxes[1].width <= boxes[2].x + 1)
        } else {
          for (let i = 1; i < boxes.length; i++) assert.ok(boxes[i].y >= boxes[i - 1].y + boxes[i - 1].height - 1, 'single column at <=700px')
        }
        if (process.env.CAPTURE_SHOTS === '1') {
          await section.screenshot({ path: `.shots/contact-grid-${width}.png` })
          await page.locator('#about-intro').screenshot({ path: `.shots/profile-type-${width}.png` })
        }
      } finally { await page.close() }
    })
  }
  for (const route of ['', 'works/original-ip', 'about']) {
    await check(`/${route} fixed circular back-top appears only after 500px and preserves route`, async () => {
      const page = await open(390, 'reduce', route)
      try {
        const button = page.locator('[data-back-top]')
        assert.equal(await button.count(), 1)
        await page.evaluate(() => scrollTo({ top: 500, behavior: 'instant' }))
        await page.waitForFunction(() => scrollY === 500)
        assert.equal(await button.getAttribute('aria-hidden'), 'true')
        await page.evaluate(() => scrollTo({ top: 501, behavior: 'instant' }))
        await page.getByRole('button', { name: '回到顶部', exact: true }).waitFor({ state: 'visible' })
        const style = await button.evaluate(node => { const s = getComputedStyle(node); return { position: s.position, width: s.width, height: s.height, radius: s.borderRadius, transition: s.transitionDuration } })
        const { transition, ...geometry } = style
        assert.deepEqual(geometry, { position: 'fixed', width: '44px', height: '44px', radius: '50%' })
        assert.ok(parseFloat(transition) <= .00001, 'global reduced-motion !important may compute 0.01ms')
        assert.equal(await button.evaluate(node => node.parentElement === document.body), true, 'body portal avoids transformed/footer clipping ancestors')
        const url = page.url()
        await button.focus(); await page.keyboard.press('Enter')
        await page.waitForFunction(() => scrollY <= 2)
        assert.equal(page.url(), url)
        await page.waitForFunction(() => document.querySelector('[data-back-top]').tabIndex === -1)
        assert.equal(await button.getAttribute('tabindex'), '-1')
      } finally { await page.close() }
    })
  }
  await check('normal motion contact-icon hover and smooth back-top use current brand', async () => {
    const page = await open(1440, 'no-preference')
    try {
      const item = page.locator('.contact-item').first()
      assert.equal(await item.locator('.contact-icon').count(), 1)
      await item.hover()
      await page.waitForFunction(() => getComputedStyle(document.querySelector('.contact-item .contact-icon')).borderTopColor === 'rgb(38, 134, 237)')
      const button = page.getByRole('button', { name: '回到顶部', exact: true })
      await button.hover()
      await page.waitForFunction(() => getComputedStyle(document.querySelector('[data-back-top]')).color === 'rgb(38, 134, 237)')
      await button.click(); await page.waitForFunction(() => scrollY <= 2)
    } finally { await page.close() }
  })
} finally { await browser.close() }
if (failures.length) process.exitCode = 1
