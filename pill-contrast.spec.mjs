import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'
const rgb = value => value.match(/[\d.]+/g).map(Number)
const blend = (a, b) => a.slice(0, 3).map((v, i) => v * (a[3] ?? 1) + b[i] * (1 - (a[3] ?? 1)))
const luminance = color => color.map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0)
const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05)
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
let failures = 0
try {
 const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
 await page.goto('http://127.0.0.1:5180/#/works', { waitUntil: 'networkidle' })
 await page.locator('[data-loading-screen]').waitFor({ state: 'detached' })
 const styles = await page.locator('[data-works-page] [data-ui-badge].absolute').evaluateAll(nodes => nodes.map(el => ({ color: getComputedStyle(el).color, bg: getComputedStyle(el).backgroundColor })))
 try { assert.equal(styles.length, 3); for (const s of styles) assert.ok(contrast(rgb(s.color), blend(rgb(s.bg), [255, 255, 255])) >= 4.5, 'cover chip must remain readable even over white artwork'); console.log('PASS image-surface chips meet text contrast on the lightest artwork') } catch (e) { failures++; console.error('FAIL', e.message) }
 const selected = page.getByRole('group', { name: '按方向筛选作品' }).getByRole('button').first()
 await selected.hover()
 await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
 const active = await selected.evaluate(el => ({ color: getComputedStyle(el).color, bg: getComputedStyle(el).backgroundColor, body: getComputedStyle(el.closest('[data-works-page]')).backgroundColor }))
 try { const ratio = contrast(rgb(active.color), blend(rgb(active.bg), rgb(active.body))); assert.ok(ratio >= 4.5, `selected hover contrast ${ratio.toFixed(2)} must be >=4.5`); console.log('PASS selected filter hover meets text contrast') } catch (e) { failures++; console.error('FAIL', e.message) }
 await page.close()
} finally { await browser.close() }
if (failures) process.exitCode = 1
