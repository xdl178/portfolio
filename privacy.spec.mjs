import assert from 'node:assert/strict'
import {readFileSync,readdirSync} from 'node:fs'
import {join} from 'node:path'
const read=p=>readFileSync(p,'utf8')
const source=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?(e.name==='assets'?[]:source(join(dir,e.name))):/\.(tsx?|css)$/.test(e.name)?[join(dir,e.name)]:[])
for(const path of source('src')){const text=read(path);assert.doesNotMatch(text,/[A-Z\d._%+-]+@[A-Z\d.-]+\.[A-Z]{2,}/i,`${path}: no embedded contact email`);assert.doesNotMatch(text,/(?<![\d.])1[3-9]\d{9}(?![\d.])/,`${path}: no embedded personal mobile`);if(/[\\/](?:components|pages)[\\/]/.test(path))assert.doesNotMatch(text,/(?:mailto|tel):/i,`${path}: display-only template does not expose contact endpoints`)}
const profile=read('src/data/profile.ts'),intro=profile.match(/export const profileIntro\s*=\s*\[([\s\S]*?)\]/)[1];for(const[,value]of intro.matchAll(/'([^']+)'/g))assert.match(value,/待补充/,'home biography and availability must be explicit placeholders')
assert.doesNotMatch(read('src/data/about.ts'),/export const aboutAwards/,'removed awards must not remain in the data bundle')
for(const[,title]of read('src/components/Practice.tsx').matchAll(/title:\s*'([^']+)'/g))assert.match(title,/待补充/,'experience project identities must be placeholders')
for(const[,field,value]of read('src/data/works.ts').matchAll(/\b(year|period|role):\s*'([^']+)'/g))assert.match(value,/待补充/,`${field}: project dates and personal roles are not published`)
assert.doesNotMatch(read('src/components/Hero.tsx'),/接受新项目委托/,'unverified availability claim is removed')
console.log('PASS runtime source contains placeholder identity/biography/experience/date/role values, no embedded contact endpoints, and no retained awards data')
