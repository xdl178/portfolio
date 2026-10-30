import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'

const base = process.env.PORTFOLIO_URL || 'http://127.0.0.1:5180/'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
const failures = []
const routes = ['#/works/original-ip', '#/works/art-studio', '#/works/mivox']

// Frame sampling, not a settled bounding box: catches popLayout's temporary sibling
// margins, parent/row projection, entry y:24 and interrupted filter transitions.
async function trace(page, clicks, frameCount = 100) {
  return page.evaluate(async ({ clicks, frameCount }) => {
    const group = document.querySelector('[data-works-filter-tabs]')
    const buttons = [...group.querySelectorAll('button')]
    const frames = []
    for (let frame = 0; frame < frameCount; frame++) {
      for (const click of clicks.filter(click => click.frame === frame)) buttons[click.index].click()
      await new Promise(requestAnimationFrame)
      const bottom = group.getBoundingClientRect().bottom
      frames.push({ frame, scrollY, groupBottom: bottom, selected: buttons.findIndex(button => button.getAttribute('aria-pressed') === 'true'), rows: [...document.querySelectorAll('article[data-works-reveal]')].map(row => {
        const rect = row.getBoundingClientRect(), style = getComputedStyle(row)
        return { route: row.querySelector('a').getAttribute('href'), top: rect.top, documentTop: rect.top + scrollY, relativeTop: rect.top - bottom, marginTop: style.marginTop, transform: style.transform, opacity: Number(style.opacity), position: style.position }
      }) })
    }
    return frames
  }, { clicks, frameCount })
}

function stable(frames, gap, label) {
  const bad = frames.find(frame => {
    const expected = frame.selected === 0 ? routes : [routes[frame.selected - 1]]
    return frame.rows.length !== expected.length || frame.rows.some((row, index) => row.route !== expected[index]) || Math.abs(frame.rows[0].relativeTop - gap) > 2
  })
  const summary = frames.filter((frame, index) => index < 4 || index % 15 === 0 || frame === bad)
  assert.equal(bad, undefined, `${label}: first result must stay anchored below the filter, including the first RAF; trace=${JSON.stringify(summary)}`)
  // Newly returned offscreen rows must not acquire an entry offset and then move
  // when scrolled into view. Every result's document coordinate stays fixed.
  for (let index = 1; index < frames.length; index++) {
    const previous = frames[index - 1], current = frames[index]
    if (previous.selected !== current.selected) continue
    for (const row of current.rows) {
      const before = previous.rows.find(item => item.route === row.route)
      if (before) assert.ok(Math.abs(row.documentTop - before.documentTop) < 2, `${label}: ${row.route} moves between frames ${index - 1}/${index}: ${JSON.stringify({ previous, current })}`)
    }
  }
}

try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'no-preference' })
    try {
      await page.goto(`${base}#/works`, { waitUntil: 'networkidle' })
      await page.locator('[data-loading-screen]').waitFor({ state: 'detached' })
      const last = page.locator('article[data-works-reveal]').last()
      const hidden = await last.evaluate(row => ({ opacity: Number(getComputedStyle(row).opacity), top: row.getBoundingClientRect().top }))
      assert.ok(hidden.top > 900 && hidden.opacity < .1, 'initial offscreen page content retains scroll reveal')
      await last.scrollIntoViewIfNeeded()
      await page.waitForFunction(() => Number(getComputedStyle([...document.querySelectorAll('article[data-works-reveal]')].at(-1)).opacity) > .99)
      // Pin the group high enough to expose results and avoid test-tool autoscroll.
      await page.evaluate(() => { const group = document.querySelector('[data-works-filter-tabs]'); window.scrollTo({ top: group.getBoundingClientRect().top + scrollY - 160, behavior: 'instant' }) })
      const baseline = await trace(page, [], 80)
      const gap = baseline.at(-1).rows[0].relativeTop
      assert.ok(Math.abs(gap - 36) < 2, `baseline first-result spacing: ${gap}`)
      const brand = await trace(page, [{ frame: 0, index: 2 }])
      const ai = await trace(page, [{ frame: 0, index: 3 }])
      const all = await trace(page, [{ frame: 0, index: 0 }])
      const rapid = await trace(page, [{ frame: 0, index: 2 }, { frame: 3, index: 3 }, { frame: 6, index: 0 }])
      for (const [label, frames] of [['all → brand', brand], ['brand → AI (last project)', ai], ['AI → all', all], ['rapid all → brand → AI → all', rapid]]) stable(frames, gap, `${width}px ${label}`)
      assert.match(await page.locator('[aria-live="polite"]').innerText(), /3/)
      await last.scrollIntoViewIfNeeded()
      const afterScroll = await trace(page, [], 30)
      stable(afterScroll, gap, `${width}px returning offscreen results do not reveal again`)
      console.log(`PASS ${width}px normal-motion frame stability, rapid interruption, initial-only scroll reveal, routes/counts`)
    } catch (error) { failures.push(error); console.error(`FAIL ${width}px: ${error.message}`) }
    finally { await page.close() }
  }
  // Keep native keyboard and motion-preference semantics alongside physical tests.
  const reduced = await browser.newPage({ viewport: { width: 390, height: 900 }, reducedMotion: 'reduce' })
  try {
    await reduced.goto(`${base}#/works`, { waitUntil: 'networkidle' })
    await reduced.locator('[data-loading-screen]').waitFor({ state: 'detached' })
    const group = reduced.getByRole('group', { name: '按方向筛选作品' })
    const buttons = group.getByRole('button')
    await buttons.nth(3).focus(); await reduced.keyboard.press('Space')
    await reduced.waitForFunction(() => document.querySelectorAll('article[data-works-reveal]').length === 1)
    assert.equal(await buttons.nth(3).getAttribute('aria-pressed'), 'true')
    assert.equal(await reduced.locator('article[data-works-reveal]').evaluate(row => getComputedStyle(row).transform), 'none')
    assert.equal(await reduced.locator('article a').getAttribute('href'), routes[2])
    await buttons.first().focus(); await reduced.keyboard.press('Enter')
    await reduced.waitForFunction(() => document.querySelectorAll('article[data-works-reveal]').length === 3)
    const session = await reduced.context().newCDPSession(reduced)
    await session.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }, { name: 'prefers-reduced-transparency', value: 'reduce' }] })
    assert.equal(await reduced.evaluate(() => matchMedia('(prefers-reduced-transparency: reduce)').matches), true)
    const styles = await group.evaluate(el => { const style = getComputedStyle(el); return { background: style.backgroundColor, border: style.borderTopWidth } })
    assert.equal(styles.background, 'rgba(0, 0, 0, 0)', 'outer group remains transparent')
    assert.equal(styles.border, '0px', 'only the selected button has a plate, not an outer tray')
    console.log('PASS reduced motion, native Space/Enter, project URLs and transparent unbordered group')
  } catch (error) { failures.push(error); console.error(`FAIL reduced: ${error.message}`) }
  finally { await reduced.close() }
} finally { await browser.close() }
if (failures.length) process.exitCode = 1
