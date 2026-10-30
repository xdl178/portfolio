import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
const style = el => { const s = getComputedStyle(el); return { font: s.fontFamily, size: s.fontSize, weight: s.fontWeight, line: s.lineHeight, tracking: s.letterSpacing, color: s.color } }
let failures = 0
try {
 for (const width of [320, 390, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' })
  try {
   await page.goto('http://127.0.0.1:5180/', { waitUntil: 'networkidle' })
   await page.locator('[data-loading-screen]').waitFor({ state: 'detached' })
   assert.equal(await page.locator('#about-intro header[data-section-heading="true"]').count(), 1, 'Home About canonical header is extracted into SectionHeading')
   assert.deepEqual(await page.locator('main .section-heading-index').allTextContents(), ['01', '02', '03'])
   assert.deepEqual(await page.locator('main .section-heading-en').allTextContents(), ['ABOUT', 'EXHIBIT', 'EXPERIENCE'])
   assert.equal(await page.getByRole('heading', { name: '关于我', level: 2 }).getAttribute('id'), 'home-about-title')
   const canonical = await page.locator('#home-about-title').evaluate(style)
   for (const path of ['/', '/works', '/about']) {
    await page.goto(`http://127.0.0.1:5180/#${path}`, { waitUntil: 'networkidle' })
    await page.locator('[data-loading-screen]').waitFor({ state: 'detached' })
    assert.equal(await page.locator('main h1').count(), 1, `${path} has exactly one semantic page h1`)
    if (path !== '/') {
      const masthead = page.locator('main h1')
      assert.equal(await masthead.evaluate(el => !!el.closest('[data-section-heading]')), false, 'page mastheads must remain outside the section heading system')
      assert.deepEqual(await masthead.evaluate(el => { const s=getComputedStyle(el);return [s.textAlign,s.whiteSpace] }), ['center','nowrap'])
      assert.ok(Math.abs(parseFloat(await masthead.evaluate(el => getComputedStyle(el).fontSize))-Math.min(134.4,Math.max(44.8,width*.11)))<.1, 'page masthead keeps the previous responsive display scale')
      assert.notEqual(await masthead.locator('.text-gradient').evaluate(el => getComputedStyle(el).backgroundImage), 'none', 'original gradient emphasis remains')
     }
     if(path === '/works') {
      assert.equal(await page.getByRole('heading',{name:'章节导读'}).count(),0,'Works removes only the intro heading')
      assert.equal(await page.locator('[data-works-page]').getByText(/每个项目都是一次从概念到落地的探索/).count(),1,'intro body remains')
     }
     for (const heading of await page.locator('main [data-section-heading] .section-heading-title').all()) {
     assert.deepEqual(await heading.evaluate(style), canonical, `${path} shares canonical heading typography`)
     assert.match(await heading.textContent(), /[\u3400-\u9fff]/, 'accessible title uses Chinese, not decorative English')
     assert.ok(await heading.evaluate(el => el.getBoundingClientRect().height <= parseFloat(getComputedStyle(el).lineHeight) + 1), 'six-character Chinese chapter titles fit on one line, including at 320px')
     assert.equal(await heading.evaluate(el => el.closest('header')?.dataset.sectionHeading), 'true', 'heading has a native shared header root')
     const metrics = await heading.evaluate(el => { const r = el.getBoundingClientRect(); return { left: r.left, right: r.right, scroll: el.scrollWidth, width: el.clientWidth } })
     assert.ok(metrics.left >= 0 && metrics.right <= width + 1 && metrics.scroll <= metrics.width + 1, `${path} title does not overflow or clip at ${width}px`)
    }
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${path} has no horizontal overflow`)
    for (const size of await page.locator('main [data-ui-badge]').evaluateAll(nodes => nodes.filter(el => !el.closest('#home')).map(el => getComputedStyle(el).fontSize))) assert.equal(size, '14px')
    if (path === '/') assert.equal(await page.locator('#home [data-ui-badge]').evaluate(el => getComputedStyle(el).fontSize), '12px')
    if (path === '/works') {
     const filters = page.getByRole('group', { name: '按方向筛选作品' }).getByRole('button')
     const before = await filters.evaluateAll(nodes => nodes.map(el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height } }))
     await filters.nth(1).click()
     assert.equal(await filters.nth(1).getAttribute('aria-pressed'), 'true')
     assert.deepEqual(await filters.evaluateAll(nodes => nodes.map(el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height } })), before, 'native filter retains geometry')
     await filters.first().click()
     assert.equal(await page.locator('[data-works-page] .works-results > article').count(), 3)
    }
   }
   console.log(`PASS ${width}px canonical headings, semantic levels, typography parity, metadata, overflow and native filters`)
  } catch (error) { failures++; console.error(`FAIL ${width}px: ${error.message}`) } finally { await page.close() }
 }
} finally { await browser.close() }
if (failures) process.exitCode = 1
