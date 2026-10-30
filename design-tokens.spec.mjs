import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const schema = JSON.parse(readFileSync('design-system.schema.json', 'utf8'))
const css = readFileSync(schema.styleFile, 'utf8')
assert.equal(schema.version, 1)
assert.equal(schema.styleFile, 'public/design-system.css')
assert.equal(schema.builtStyleFile, 'dist/design-system.css')
const blocks = [...css.matchAll(/\/\* DESIGN-MANAGER:START \*\/([\s\S]*?)\/\* DESIGN-MANAGER:END \*\//g)]
assert.equal(blocks.length, 1, 'one managed root block')
assert.match(blocks[0][1], /^\s*:root\s*\{/)
const definitions = new Map([...blocks[0][1].matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [name, value.replace(/\s+/g, ' ').trim()]))
function sources(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? (entry.name === 'assets' ? [] : sources(path)) : /\.(?:css|tsx?|js)$/.test(path) ? [readFileSync(path, 'utf8')] : []
  })
}
const source = sources('src').join('\n') + readFileSync('tailwind.config.js', 'utf8') + css.replace(/--[\w-]+:\s*[^;]+;/g, '')
const aliases = ['--brand', '--accent', '--accent-strong', '--accent-2', '--grad-accent']
const seen = new Set()
const validTypes = new Set(['hex', 'rgb', 'hsl', 'number', 'length', 'duration', 'text'])
for (const group of schema.groups) {
  assert.ok(group.id && group.label && group.description)
  for (const token of group.tokens) {
    assert.ok(!seen.has(token.name), `duplicate token ${token.name}`)
    seen.add(token.name)
    assert.ok(validTypes.has(token.type), token.name)
    assert.ok(!aliases.includes(token.name), `derived color is not separately editable: ${token.name}`)
    assert.ok(definitions.has(token.name), `editable token exists in CSS: ${token.name}`)
    assert.equal(typeof token.default, 'string', 'shipped reset defaults remain separate from user-edited CSS')
    const escaped = token.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    assert.match(source, new RegExp(`(?:var\\(\\s*${escaped}\\b|['\"]${escaped}['\"])`), `wired consumer: ${token.name}`)
    if (token.type === 'hex') assert.match(token.default, /^#[\da-f]{6}$/i)
    if (token.type === 'rgb') assert.match(token.default, /^\d+ \d+ \d+$/)
    if (token.type === 'hsl') assert.match(token.default, /^\d+ \d+% \d+%$/)
  }
}
const html = readFileSync('index.html', 'utf8')
assert.match(html, /<link rel="stylesheet" href="%BASE_URL%design-system\.css"\s*\/>/)
assert.doesNotMatch(readFileSync('src/index.css', 'utf8'), /--(?:bg|muted|brand-rgb):/)
assert.match(readFileSync('src/index.css', 'utf8'), /--gutter-home:\s*var\(--gutter-home-mobile\)/)
assert.match(readFileSync('src/index.css', 'utf8'), /--gutter-home:\s*var\(--gutter-home-tablet\)/)
console.log(`PASS ${seen.size} editable design tokens: unique, typed, default-matched and wired`)
