import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 900 : 844 }, reducedMotion: 'reduce' })
    for (const route of ['works', 'works/original-ip']) {
      await page.goto(`http://127.0.0.1:5180/#/${route}`, { waitUntil: 'networkidle' })
      await page.getByRole('heading', { level: 1 }).waitFor()
      await page.waitForFunction(() => getComputedStyle(document.querySelector('#main-content')).opacity === '1' && document.body.style.overflow !== 'hidden')
      await page.waitForTimeout(800)
      await page.screenshot({ path: `.shots/${route.replace('/', '-')}-${width}-interaction.png` })
      console.log(`${route}: ${width}px`)
      if (route.includes('/')) {
        await page.locator('#work-originals button').first().click()
        await page.getByRole('dialog').waitFor()
        await page.getByRole('dialog').locator('img').evaluate(img => img.decode())
        await page.waitForTimeout(300)
        console.log(await page.getByRole('dialog').evaluate(el => ({ dialog: el.getBoundingClientRect().toJSON(), content: el.firstElementChild.getBoundingClientRect().toJSON() })))
        await page.screenshot({ path: `.shots/works-lightbox-${width}-interaction.png` })
      }
    }
    await page.close()
  }
} finally { await browser.close() }
