import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'

// Regression targets: a missing/duplicated global footer, removed home sections
// returning, unsafe placeholder contacts, clipped mobile controls, and broken
// keyboard/route-preserving contact or motion controls. No production mocks.
const BASE = 'http://127.0.0.1:5180/#/'
const routes = ['', 'works', 'works/original-ip', 'about', 'missing-page']
const widths = [1920, 1440, 768, 701, 700, 390, 320]
const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
})
const failures = []
const runtimeErrors = []

async function check(name, run) {
  try {
    await run()
    console.log(`PASS ${name}`)
  } catch (error) {
    failures.push(name)
    console.error(`FAIL ${name}: ${error.stack || error.message}`)
  }
}

async function open({ width = 1440, reducedMotion = 'reduce', route = '' } = {}) {
  const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion })
  page.setDefaultTimeout(8000)
  page.on('pageerror', error => runtimeErrors.push(`${page.url()}: ${error.message}`))
  try {
    await visit(page, route)
    return page
  } catch (error) {
    await page.close()
    throw error
  }
}

async function visit(page, route) {
  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' })
  await page.locator('[data-loading-screen]').waitFor({ state: 'detached' })
}

async function footerOn(page) {
  // Count before action/wait assertions: old builds fail immediately, not after
  // a timeout for a missing control or screenshot target.
  assert.equal(await page.locator('#footer-sec').count(), 1, 'exactly one #footer-sec on this route')
  const footer = page.locator('footer#footer-sec')
  assert.equal(await footer.count(), 1, '#footer-sec is the semantic global footer')
  return footer
}

function routeOf(href) {
  const url = new URL(href, BASE)
  assert.equal(url.origin, new URL(BASE).origin, 'footer navigation is internal')
  return url.hash.startsWith('#/') ? url.hash.slice(1) : url.pathname
}

async function footerLink(footer, route) {
  const hrefs = await footer.locator('a[href]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')))
  const indexes = hrefs.flatMap((href, index) => routeOf(href) === route ? [index] : [])
  assert.equal(indexes.length, 1, `one footer navigation link to ${route}`)
  return footer.locator('a[href]').nth(indexes[0])
}

async function assertContactFocus(page, originalURL) {
  await page.waitForFunction(() => document.activeElement === document.getElementById('footer-channels'))
  assert.equal(page.url(), originalURL, 'contact scroll must preserve the current route')
  const target = page.locator('#footer-channels')
  assert.equal(await target.getAttribute('tabindex'), '-1', 'contact heading/group can receive programmatic focus')
  await page.waitForFunction(() => {
    const box = document.getElementById('footer-channels').getBoundingClientRect()
    return box.top >= -1 && box.top < innerHeight && box.bottom > 0
  })
}

async function assertNeutralFooter(footer) {
  assert.equal(await footer.locator('h2#footer-title.contact-footer-title').textContent(), "Let's create something amazing together")
  assert.equal(await footer.locator('p.contact-footer-description').textContent(), 'Open to full-time roles, freelance projects, and creative collaborations.')
  assert.equal(await footer.locator('[data-ui-badge].contact-footer-badge').innerText(), '视觉 · 界面 · 动效')
  assert.equal(await footer.locator('.contact-footer-copyright').count(), 1)
  assert.equal(await footer.locator('[data-footer-marquee], [data-footer-marquee-track], .contact-footer-marquee-row, .contact-footer-identity').count(), 0, 'old marquee and identity removed')
  assert.equal(await footer.getByRole('heading', { name: 'PORTFOLIO', exact: true }).count(), 0)
  assert.doesNotMatch(await footer.innerText(), /Let's talk\./i)
  const text = await footer.innerText()
  assert.match(text, /©|copyright|版权所有/i, 'copyright is present')
  const hrefs = await footer.locator('[href]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')))
  const exposed = `${text}\n${hrefs.map(href => {
    try { return decodeURIComponent(href) } catch { return href }
  }).join('\n')}`
  assert.doesNotMatch(exposed, /Zhu|Hongyu|ZHONGYU|朱泓宇|Qingdao|青岛|3112516515|13668862258|brutalist|Khanittha|Hemsamak/i, 'no reference personal data in footer text or hrefs')
  for (const href of hrefs) {
    assert.ok(href && href.trim() !== '#' && !/^(?:mailto|tel|phone):/i.test(href.trim()), `no fake contact href: ${href}`)
  }
  assert.equal(await footer.locator('.contact-grid .contact-item').count(), 3, 'exactly three placeholder channels')
  const channels = footer.locator('.contact-grid .contact-item')
  assert.deepEqual(await channels.locator('.contact-label').allTextContents(), ['Email', 'Phone', 'Behance'])
  assert.equal(await footer.locator('.contact-grid a,.contact-grid button,.contact-grid [disabled],.contact-grid [aria-disabled],.contact-item[disabled],.contact-item[aria-disabled]').count(), 0, 'placeholder grid is plain text, not disabled controls or fake anchors')
  for (const label of ['Email', 'Phone', 'Behance']) {
    const channel = channels.filter({ hasText: label })
    assert.equal(await channel.count(), 1, `one ${label} channel`)
    assert.notEqual(await channel.evaluate(el => getComputedStyle(el).cursor), 'not-allowed', `${label} has no disabled cursor`)
    assert.match(await channel.locator('.contact-value').innerText(), /待补充/, `${label} explains its pending state`)
    assert.notEqual(await channel.locator('.contact-value').evaluate(el => getComputedStyle(el).userSelect), 'none', `${label} remains selectable`)
  }
  assert.equal(await footer.locator('section#footer-channels.contact-footer-channels[aria-label="联系通道"]').count(), 1, 'focus target is named section, not heading')
  assert.equal(await footer.locator('#footer-channels h3#footer-channels-title.sr-only').count(), 1)
  assert.equal(await footer.locator('.contact-grid').getAttribute('aria-labelledby'), 'footer-channels-title')
  assert.equal(await footer.locator('#footer-channels').getAttribute('tabindex'), '-1')
  for (const route of ['/', '/works', '/about']) await footerLink(footer, route)
  assert.equal(await footer.page().locator('[data-back-top]').count(), 1, 'one global portal-based back-top')
  assert.equal(await footer.getByRole('button', { name: /联系/ }).count(), 1)
}

async function assertReducedMotion(footer) {
  const reveals = footer.locator('[data-footer-reveal]')
  assert.ok(await reveals.count() > 0, 'footer marks reveal groups')
  for (const reveal of await reveals.all()) {
    const style = await reveal.evaluate(el => ({ opacity: getComputedStyle(el).opacity, transform: getComputedStyle(el).transform }))
    assert.equal(style.opacity, '1', 'reduced motion reveals are immediately readable')
    assert.equal(style.transform, 'none', 'reduced motion reveals have no translated starting state')
  }
}

async function assertLayout(page, footer, width) {
  await footer.scrollIntoViewIfNeeded()
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `no horizontal document overflow at ${width}px`)
  const bounds = await footer.boundingBox()
  assert.ok(bounds && bounds.width > 0)
  const title = footer.locator('h2#footer-title')
  const titleInk = await title.evaluate(el => {
    const range = document.createRange()
    range.selectNodeContents(el)
    return range.getBoundingClientRect().toJSON()
  })
  assert.ok(titleInk.left >= bounds.x - 1 && titleInk.right <= bounds.x + bounds.width + 1, 'entire title text fits inside footer')
  assert.ok(titleInk.top >= bounds.y - 1 && titleInk.bottom <= bounds.y + bounds.height + 1, 'title is not vertically clipped')
  if (width >= 1200) assert.equal(await title.evaluate(el => { const range = document.createRange(); range.selectNodeContents(el); return range.getClientRects().length }), 1, 'wide-screen headline stays on one line like the reference')
  const items = [...await footer.locator('.contact-footer-badge, h2#footer-title, p.contact-footer-description, .contact-footer-nav a, .contact-footer-nav button, .contact-grid .contact-item').all()]
  const boxes = []
  for (const item of items) {
    const label = (await item.innerText()).trim() || await item.getAttribute('aria-label')
    assert.equal(await item.isVisible(), true, `${label} remains visible at ${width}px`)
    const box = await item.boundingBox()
    assert.ok(box && box.width > 0 && box.height > 0, `${label} has a visible box`)
    assert.ok(box.x >= bounds.x - 1 && box.x + box.width <= bounds.x + bounds.width + 1, `${label} fits horizontally inside footer at ${width}px`)
    assert.ok(box.y >= bounds.y - 1 && box.y + box.height <= bounds.y + bounds.height + 1, `${label} fits vertically inside footer`)
    assert.ok(box.x >= -1 && box.x + box.width <= width + 1, `${label} is not clipped by viewport`)
    assert.equal(await item.evaluate(el => {
      for (let node = el; node; node = node.parentElement) {
        const style = getComputedStyle(node)
        if (Number(style.opacity) === 0 || style.visibility === 'hidden') return false
      }
      return true
    }), true, `${label} is not hidden by opacity`)
    boxes.push({ label, box })
  }
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i].box, b = boxes[j].box
      const overlapX = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)
      const overlapY = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y)
      assert.ok(overlapX <= 1 || overlapY <= 1, `${boxes[i].label} and ${boxes[j].label} must not overlap at ${width}px`)
    }
  }
  // Catch duplicate/reordered layers, mobile drift, card wrappers and wrong columns.
  const layers = ['.contact-footer-badge', 'h2#footer-title', 'p.contact-footer-description', '.contact-footer-nav', '.contact-footer-channels']
  const layerBoxes = []
  for (const selector of layers) {
    const layer = footer.locator(selector)
    assert.equal(await layer.count(), 1, `one ${selector} layer`)
    assert.equal(await layer.isVisible(), true)
    layerBoxes.push(await layer.boundingBox())
  }
  assert.deepEqual(await footer.evaluate((root, selectors) => [...root.querySelectorAll(selectors.join(','))].map(node => selectors.findIndex(selector => node.matches(selector))), layers), [0, 1, 2, 3, 4], 'exact five-layer DOM reading order')
  for (let i = 0; i < layerBoxes.length; i++) {
    const box = layerBoxes[i]
    assert.ok(Math.abs(box.x + box.width / 2 - (bounds.x + bounds.width / 2)) <= 2, `${layers[i]} centered at ${width}px`)
    if (i) assert.ok(box.y >= layerBoxes[i - 1].y + layerBoxes[i - 1].height - 1, 'five layers vertically ordered without overlap')
  }
  assert.equal(await footer.locator('.contact-footer-cta').count(), 1)
  assert.equal(await footer.locator('.contact-footer-inner').count(), 1)
  for (const wrapper of await footer.locator('.contact-footer-inner, .contact-footer-cta, .contact-footer-content').all()) {
    const style = await wrapper.evaluate(el => { const s = getComputedStyle(el); return { background: s.backgroundColor, image: s.backgroundImage, radius: s.borderRadius } })
    assert.deepEqual(style, { background: 'rgba(0, 0, 0, 0)', image: 'none', radius: '0px' }, 'no enclosing painted/rounded card')
  }
  for (const selector of ['.contact-footer-title', '.contact-footer-description']) assert.equal(await footer.locator(selector).evaluate(el => getComputedStyle(el).textAlign), 'center')
  const channelBoxes = await footer.locator('.contact-grid .contact-item').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().toJSON()))
  assert.equal(channelBoxes.length, 3)
  if (width > 700) {
    for (const box of channelBoxes) assert.ok(Math.abs(box.y - channelBoxes[0].y) <= 1, 'all three channels share one desktop row')
    assert.ok(channelBoxes[0].right <= channelBoxes[1].left && channelBoxes[1].right <= channelBoxes[2].left)
  } else {
    for (let i = 1; i < channelBoxes.length; i++) assert.ok(channelBoxes[i].top >= channelBoxes[i - 1].bottom - 1, 'single-column channels at <=700px')
  }
  // Locator screenshot, not page screenshot: reduced motion keeps offscreen
  // reveal/scroll-context artifacts out of these reference images.
  await footer.screenshot({ path: `.shots/footer-${width}.png` })
}

try {
  // Fail-fast gate deliberately precedes long route/responsive/motion checks.
  const gate = await open()
  try {
    const replacementFooter = await footerOn(gate)
    assert.equal(await replacementFooter.locator('h2#footer-title').textContent(), "Let's create something amazing together", 'replacement footer must expose the approved collaboration heading, not PORTFOLIO')
    assert.deepEqual(await gate.locator('main section[id]').evaluateAll(nodes => nodes.map(el => el.id)), ['home', 'about-intro', 'work', 'practice'], 'home section order excludes gallery/Explorations')
    assert.equal(await gate.locator('#gallery').count(), 0, 'gallery removed from home')
    assert.equal(await gate.getByText('Explorations', { exact: true }).count(), 0, 'Explorations removed from home')
    assert.equal(await gate.getByText('了解我的工作方式', { exact: true }).count(), 0, 'practice ending removed')
    console.log('PASS fail-fast footer presence and home section order')
  } finally {
    await gate.close()
  }

  for (const width of widths) {
    await check(`${width}px reduced-motion footer contract, readable layout and screenshot`, async () => {
      const page = await open({ width })
      try {
        const footer = await footerOn(page)
        await assertNeutralFooter(footer)
        await assertReducedMotion(footer)
        await assertLayout(page, footer, width)
      } finally { await page.close() }
    })
  }

  await check('one global footer and route-preserving contact focus on home, works, detail, about and 404', async () => {
    const page = await open()
    try {
      for (const route of routes) {
        await visit(page, route)
        const footer = await footerOn(page)
        await assertNeutralFooter(footer)
        const originalURL = page.url()
        const navContact = page.getByRole('navigation', { name: '主导航' }).getByRole('button', { name: '联系我', exact: true })
        assert.equal(await navContact.count(), 1, `navbar contact on /${route}`)
        await navContact.click()
        await assertContactFocus(page, originalURL)
        const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
        if (maxScroll > 500) {
          assert.ok(await page.evaluate(() => scrollY > 500), `/${route} contact scroll crosses back-top threshold`)
          await page.getByRole('button', { name: '回到顶部', exact: true }).click()
        } else {
          // A short route cannot cross the product's strict >500px threshold.
          // Assert absence instead of clicking an intentionally hidden control;
          // reset only the test setup for the second contact-focus exercise.
          const backTop = page.locator('[data-back-top]')
          await page.waitForFunction(() => document.querySelector('[data-back-top]').getAttribute('aria-hidden') === 'true')
          assert.equal(await backTop.getAttribute('tabindex'), '-1', `/${route} short-page back-top is not keyboard reachable`)
          assert.equal(await page.getByRole('button', { name: '回到顶部', exact: true }).count(), 0, `/${route} short-page back-top is accessibility-hidden`)
          console.log(`PASS /${route} short-page back-top correctly hidden (maxScroll=${maxScroll}px <=500)`)
          await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
        }
        await page.waitForFunction(() => scrollY <= 2)
        assert.equal(page.url(), originalURL, 'return-to-top setup preserves route')
        await footer.getByRole('button', { name: /联系/ }).click()
        await assertContactFocus(page, originalURL)
      }
    } finally { await page.close() }
  })

  await check('desktop normal motion preserves readable footer, keyboard contact, return top and works navigation', async () => {
    const page = await open({ reducedMotion: 'no-preference' })
    try {
      const footer = await footerOn(page)
      await footer.scrollIntoViewIfNeeded()
      await page.waitForFunction(() => Number(getComputedStyle(document.getElementById('footer-title')).opacity) === 1)
      await assertNeutralFooter(footer)
      await page.getByRole('button', { name: '回到顶部', exact: true }).click()
      await page.waitForFunction(() => scrollY <= 2)
      const originalURL = page.url()
      const contact = page.getByRole('navigation', { name: '主导航' }).getByRole('button', { name: '联系我', exact: true })
      await contact.focus()
      assert.equal(await contact.evaluate(el => document.activeElement === el), true)
      await page.keyboard.press('Enter')
      await assertContactFocus(page, originalURL)
      await page.getByRole('button', { name: '回到顶部', exact: true }).click()
      await page.waitForFunction(() => scrollY <= 2)
      assert.equal(page.url(), originalURL)
      await (await footerLink(footer, '/works')).click()
      await page.waitForURL(url => url.hash === '#/works')
      await page.locator('[data-loading-screen]').waitFor({ state: 'detached' })
      await footerOn(page)
    } finally { await page.close() }
  })
  await check('no browser runtime errors across all footer interactions', async () => assert.deepEqual(runtimeErrors, []))
} catch (error) {
  failures.push('fail-fast footer/home contract')
  console.error(`FAIL fail-fast footer/home contract: ${error.stack || error.message}`)
} finally {
  await browser.close()
}
if (failures.length) {
  console.error(`Footer checks failed: ${failures.join('; ')}`)
  process.exitCode = 1
}
