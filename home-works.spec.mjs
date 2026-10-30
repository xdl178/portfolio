import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true})
const failures=[]
async function check(name,run){try{await run();console.log(`PASS ${name}`)}catch(e){failures.push(name);console.error(`FAIL ${name}: ${e.message}`)}}
try{
 for(const width of [1920,1440,768,390]){
  await check(`${width}px selected works matches reference grid and keeps all content inside cards`,async()=>{
   const page=await browser.newPage({viewport:{width,height:width===390?844:1400},reducedMotion:'reduce'})
   await page.goto('http://127.0.0.1:5180/',{waitUntil:'networkidle'})
   await page.locator('[data-loading-screen]').waitFor({state:'detached'})
   const section=page.locator('#work');await section.scrollIntoViewIfNeeded();await page.waitForTimeout(1000)
   assert.equal(await section.locator('h2').innerText(),'精选作品')
   const cards=section.locator('article');assert.equal(await cards.count(),3)
   const boxes=[]
   for(const card of await cards.all()){
    const box=await card.boundingBox();boxes.push(box)
    const link=card.locator('a');assert.match(await link.getAttribute('href'),/#\/works\//)
    for(const locator of [card.locator('h3'),card.locator('[data-work-tags]')]){
     const content=await locator.boundingBox();assert.ok(content.x>=box.x&&content.y>=box.y&&content.x+content.width<=box.x+box.width+1&&content.y+content.height<=box.y+box.height+1,'text/tags are overlaid inside image card')
    }
    assert.equal(await card.locator('svg[data-work-arrow]').count(),1)
     const tags=await card.locator('[data-work-tags] li').evaluateAll(nodes=>nodes.map(el=>({font:getComputedStyle(el).fontSize,radius:getComputedStyle(el).borderRadius,height:el.getBoundingClientRect().height,paddingLeft:getComputedStyle(el).paddingLeft,paddingRight:getComputedStyle(el).paddingRight})))
     const arrowHeight=await card.locator('.selected-work-arrow').evaluate(el=>el.getBoundingClientRect().height)
     for(const tag of tags){assert.equal(tag.font,'14px');assert.equal(tag.radius,'4px');assert.equal(tag.height,32);assert.equal(tag.paddingLeft,'16px');assert.equal(tag.paddingRight,'16px');assert.ok(Math.abs(tag.height-arrowHeight)<.5,'arrow and individual tag heights match')}
     assert.equal(await card.locator('[data-work-tags]').evaluate(el=>getComputedStyle(el).gap),'16px')
      const tagBox=await card.locator('[data-work-tags]').boundingBox()
     const arrowBox=await card.locator('.selected-work-arrow').boundingBox()
     assert.ok(tagBox.x+tagBox.width<=arrowBox.x+1,'wrapped tags never overlap the arrow')
   }
   assert.equal(await page.locator('nav[aria-label="主导航"] a[aria-label="返回首页"]').innerText(),'XD')
    assert.equal(await page.locator('#home .chip.hero-ui').evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(255, 255, 255, 0.08)')
    const [a,b,c]=boxes
   if(width>=768){assert.ok(Math.abs(a.y-b.y)<2);assert.ok(b.x>a.x+a.width);assert.ok(c.y>a.y+a.height);assert.ok(Math.abs(c.width-(b.x+b.width-a.x))<2,'third card spans both columns')}
   else{assert.ok(b.y>a.y+a.height&&c.y>b.y+b.height);assert.ok(Math.abs(a.width-c.width)<2)}
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))
   await section.screenshot({path:`.shots/home-works-${width}.png`})
   if(width===1440){await cards.first().locator('a').click();await page.waitForURL(/#\/works\/original-ip$/);await page.getByRole('heading',{level:1,name:'原创 IP 视觉与交互设计',exact:true}).waitFor()}
   await page.close()
  })
 }
}finally{await browser.close()}
if(failures.length)process.exitCode=1
