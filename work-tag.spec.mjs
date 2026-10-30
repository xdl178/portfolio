import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'

// Catches missing shared tags, lost native list semantics, and badge style drift.
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
const baseURL = process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:5180/'
const homeLabels = [
  ['原创 IP', '视觉设计', '交互设计'],
  ['品牌官网', '艺术工作室', '响应式网页'],
  ['AI 产品', '官网落地页', '产品叙事'],
]

async function assertTagMetrics(tags) {
  const metrics = await tags.evaluateAll(nodes => nodes.map(node => {
    const style = getComputedStyle(node)
    return {
      height: node.getBoundingClientRect().height,
      font: style.fontSize,
      radius: style.borderRadius,
      padding: [style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft],
      border: style.borderTopColor,
      borderWidth: style.borderTopWidth,
      background: style.backgroundColor,
      color: style.color,
      display: style.display,
      whiteSpace: style.whiteSpace,
      backdrop: style.backdropFilter,
    }
  }))
  for (const metric of metrics) {
    assert.equal(metric.height, 32)
    assert.equal(metric.font, '14px')
    assert.equal(metric.radius, '4px')
    assert.deepEqual(metric.padding, ['0px', '16px', '0px', '16px'])
    assert.equal(metric.borderWidth, '1px')
    assert.equal(metric.border, 'rgba(255, 255, 255, 0.24)')
    assert.equal(metric.background, 'rgba(255, 255, 255, 0.08)')
    assert.equal(metric.color, 'rgb(187, 201, 219)')
    assert.ok(['inline-flex', 'flex'].includes(metric.display), 'work label remains a flex container; direct flex items are blockified by CSS')
    assert.equal(metric.whiteSpace, 'nowrap')
    assert.equal(metric.backdrop, 'blur(12px)')
  }
}

try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' })
    try {
      await page.goto(baseURL, { waitUntil: 'networkidle' })
      await page.locator('[data-loading-screen]').waitFor({ state: 'detached' })
      const section = page.locator('#work')
      // Fail fast against the incumbent preview, before any appearance assertions.
      assert.equal(await section.locator('[data-work-tag]').count(), 9, 'homepage must render nine shared WorkTags')
      const lists = section.locator('ul[data-work-tags].selected-work-tags')
      assert.equal(await lists.count(), 3)
      for (let index = 0; index < 3; index++) {
        const list = lists.nth(index)
        assert.deepEqual(await list.locator(':scope > li[data-work-tag]').allTextContents(), homeLabels[index])
        assert.equal(await list.evaluate(node => getComputedStyle(node).gap), '16px')
      }
      await assertTagMetrics(section.locator('[data-work-tag]'))
      assert.equal(await section.locator('.selected-work-arrow').first().evaluate(node => node.getBoundingClientRect().height), 32)
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'homepage must not overflow horizontally')
      await page.goto(`${baseURL}#/works/original-ip`, { waitUntil: 'networkidle' })
      const detail = page.locator('[data-work-detail]')
      await detail.locator('h1').waitFor()
      const tagDescription = detail.locator('dl dd').filter({ has: page.locator('[data-work-tag]') })
      assert.equal(await tagDescription.count(), 1, 'only the native Tags dd contains WorkTags')
      assert.deepEqual(await tagDescription.locator('span[data-work-tag]').allTextContents(), ['原创 IP', '视觉设计', '交互设计', '角色形象'])
      assert.equal(await tagDescription.evaluate(node => getComputedStyle(node).gap), '16px')
      assert.equal(await tagDescription.evaluate(node => getComputedStyle(node).flexWrap), 'wrap')
      await assertTagMetrics(tagDescription.locator('[data-work-tag]'))
      console.log(`PASS ${width}px shared WorkTag appearance, list semantics, labels, and detail metadata`)
    } finally {
      await page.close()
    }
  }
} finally {
  await browser.close()
}
