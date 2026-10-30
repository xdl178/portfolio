import assert from 'node:assert/strict'
import {chromium} from 'playwright-core'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true})
let failures=0
try{
 for(const width of [1920,1440,1399,901,900,768,600,599,390,360,359,320]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'})
  try{
   await page.goto('http://127.0.0.1:5180/',{waitUntil:'networkidle'});await page.locator('[data-loading-screen]').waitFor({state:'detached'})
   assert.deepEqual(await page.locator('main section[id]').evaluateAll(nodes=>nodes.map(el=>el.id)),['home','about-intro','work','practice'])
   const section=page.locator('#about-intro')
   const card=section.locator('.home-about-profile-card')
   assert.equal(await card.count(),1,'About must present a dedicated profile card')
   assert.equal(await section.locator('h2').innerText(),'关于我')
   assert.equal(await section.locator('.selected-works-chapter').innerText(),'01');assert.equal(await section.locator('.selected-works-exhibit').innerText(),'ABOUT')
   assert.equal(await card.locator('.home-about-profile-top [data-ui-badge]').innerText(),'基本信息')
   assert.equal(await card.locator('.home-about-profile-top [data-ui-badge]').evaluate(el=>el.tagName),'SPAN')
   assert.equal(await card.locator('h3.home-about-name').innerText(),'姓名待补充')
   assert.match(await card.locator('.home-about-position').innerText(),/岗位待补充/)
   assert.match(await card.locator('.home-about-position').innerText(),/任职时间待补充/)
   assert.equal(await card.locator('dl dt').count(),7)
   for(const label of ['姓名','所在地','工作经验','联系方式','邮箱','作品站','能力关键词'])assert.equal(await card.locator('dt').filter({hasText:new RegExp(`^${label}$`)}).count(),1)
   assert.deepEqual(await card.locator('dd:not(.home-about-keywords)').allTextContents(),['姓名待补充','所在地待补充','工作经验待补充','联系方式待补充','邮箱待补充','作品站待补充'])
   assert.deepEqual(await card.locator('dd.home-about-keywords > span[data-work-tag]').allTextContents(),['界面设计','视觉设计','动效设计'])
   assert.deepEqual(await card.locator('.home-about-field-row').evaluateAll(nodes=>nodes.map(node=>node.querySelectorAll('dt').length)),[3,2,1,1])
   const cardContentWidth=await card.evaluate(node=>{const s=getComputedStyle(node);return node.clientWidth-parseFloat(s.paddingLeft)-parseFloat(s.paddingRight)})
   const firstRowColumns=width<360?1:(width<600||cardContentWidth<=380)?2:3
   assert.deepEqual(await card.locator('.home-about-field-row').evaluateAll(nodes=>nodes.map(node=>getComputedStyle(node).gridTemplateColumns.split(' ').length)),[firstRowColumns,width<360?1:2,1,1])
   const photo=card.locator('[data-profile-photo].home-about-portrait')
   assert.deepEqual(await photo.evaluate(el=>{const s=getComputedStyle(el);return {width:s.width,height:s.height,radius:s.borderRadius}}),{width:'80px',height:'80px',radius:'50%'})
   const details=section.locator('.home-about-details[data-profile-details]')
   const cardBox=await card.boundingBox(),detailsBox=await details.boundingBox()
   if(width>900){if(width>=1400)assert.ok(Math.abs(cardBox.width-528)<2);else assert.ok(cardBox.width>=319);assert.ok(Math.abs(detailsBox.x-cardBox.x-cardBox.width-(width>=1400?72:48))<2);assert.ok(Math.abs(cardBox.y-detailsBox.y)<2)}else assert.ok(detailsBox.y>=cardBox.y+cardBox.height+24)
   assert.equal(await details.locator('.home-about-bio h3').innerText(),'基本信息')
   assert.deepEqual(await details.locator('.home-about-bio p').allTextContents(),['我是一名视觉与 UI/UX 设计师，工作覆盖原创 IP、品牌交互与 AI 产品官网。习惯从真实场景出发，把复杂的信息结构梳理成直觉可读的界面，并与开发一起把设计落到线上。','当前可接受新项目委托，方向包括品牌视觉系统、产品界面与动态影像。'])
   assert.equal(await details.locator('#home-about-tools-title').innerText(),'Design Tools')
   const grid=details.locator('ul.home-about-skill-grid')
   assert.equal(await grid.getAttribute('aria-labelledby'),'home-about-tools-title')
   assert.equal(await grid.locator('li[data-profile-skill].home-about-tool').count(),8)
   assert.deepEqual(await grid.locator('.home-about-tool-name').allTextContents(),['Figma','MasterGo','Adobe Photoshop','Adobe Illustrator','Adobe InDesign','Blender','Adobe After Effects','Adobe Premiere Pro'])
   assert.equal(await grid.evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),width>=1400?3:width>=600?2:1)
   assert.equal(await grid.locator('img').count(),8)
   for(const img of await grid.locator('img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());assert.ok(await img.evaluate(el=>el.complete&&el.naturalWidth>0),'local skill icon resolves');assert.equal(new URL(await img.getAttribute('src'),page.url()).origin,new URL(page.url()).origin,'icons must remain local')}
   assert.doesNotMatch(await section.innerText(),/Khanittha|Hemsamak|WAI PRODUCTION|khanittha\.kkant4/i)
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))
   // Screenshots are opt-in so migration validation does not overwrite captures before the parent rebuild.
   if(process.env.CAPTURE_SHOTS==='1')await section.screenshot({path:`.shots/home-about-${width}.png`})
   console.log(`PASS ${width}px profile card, bio, preserved fields and eight local tools`)
  }catch(e){failures++;console.error(`FAIL ${width}px: ${e.message}`)}finally{await page.close()}
 }
 const normal=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'})
 try{
  await normal.goto('http://127.0.0.1:5180/',{waitUntil:'networkidle'});await normal.locator('[data-loading-screen]').waitFor({state:'detached'})
  const tools=normal.locator('.home-about-tool'),tool=tools.first()
  assert.equal(await tools.count(),8)
  assert.deepEqual(await tool.evaluate(el=>({opacity:getComputedStyle(el).opacity,transform:getComputedStyle(el).transform})),{opacity:'0',transform:'matrix(1, 0, 0, 1, 0, 32)'},'offscreen tools begin their own 32px entrance, not a nested layout translation')
  await tool.scrollIntoViewIfNeeded();await normal.mouse.move(0,0)
  await normal.waitForFunction(()=>[...document.querySelectorAll('.home-about-tool')].every(el=>{const s=getComputedStyle(el);return s.opacity==='1'&&(s.transform==='none'||new DOMMatrixReadOnly(s.transform).isIdentity)}))
  await normal.evaluate(async()=>{document.documentElement.style.setProperty('--d-tool-reveal','700ms');await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))})
  assert.ok(await tools.evaluateAll(nodes=>nodes.every(el=>{const s=getComputedStyle(el);return s.opacity==='1'&&(s.transform==='none'||new DOMMatrixReadOnly(s.transform).isIdentity)})),'live motion-token rerender must not reapply the hidden entrance pose')
  const read=()=>tool.evaluate(el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return {background:s.backgroundColor,border:s.borderTopColor,identity:s.transform==='none'||new DOMMatrixReadOnly(s.transform).isIdentity,shadow:s.boxShadow,properties:s.transitionProperty,duration:s.transitionDuration,easing:s.transitionTimingFunction,rect:{x:r.x,y:r.y,width:r.width,height:r.height}}})
  const before=await read()
  assert.equal(before.background,'rgba(255, 255, 255, 0.04)');assert.equal(before.border,'rgba(255, 255, 255, 0.1)')
  assert.equal(before.properties,'background-color, border-color');assert.equal(before.duration,'0.3s, 0.3s');assert.equal(before.easing,'cubic-bezier(0.16, 1, 0.3, 1), cubic-bezier(0.16, 1, 0.3, 1)')
  await tool.hover()
  await normal.waitForFunction(()=>{const s=getComputedStyle(document.querySelector('.home-about-tool'));return s.backgroundColor==='rgba(255, 255, 255, 0.08)'&&s.borderTopColor==='rgba(255, 255, 255, 0.25)'})
  const hovered=await read();assert.equal(hovered.identity,true);assert.equal(hovered.shadow,'none');assert.deepEqual(hovered.rect,before.rect,'hover must not lift, resize or shift the tile')
  assert.deepEqual(await tool.evaluate(el=>['::before','::after'].map(p=>getComputedStyle(el,p).content)),['none','none'],'no spotlight pseudo-layer')
  await normal.mouse.move(0,0)
  await normal.waitForFunction(()=>{const s=getComputedStyle(document.querySelector('.home-about-tool'));return s.backgroundColor==='rgba(255, 255, 255, 0.04)'&&s.borderTopColor==='rgba(255, 255, 255, 0.1)'})
  assert.deepEqual(await read(),before,'hover-out returns the original appearance and geometry')
  console.log('PASS normal tool entrance, exact color hover/reverse and no lift/spotlight')
 }catch(e){failures++;console.error(`FAIL normal tools motion: ${e.message}`)}finally{await normal.close()}
 const touch=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'})
 try{
  const page=await touch.newPage();await page.goto('http://127.0.0.1:5180/',{waitUntil:'networkidle'});await page.locator('[data-loading-screen]').waitFor({state:'detached'})
  const tool=page.locator('.home-about-tool').first()
  assert.deepEqual(await tool.evaluate(el=>({opacity:getComputedStyle(el).opacity,transform:getComputedStyle(el).transform})),{opacity:'1',transform:'none'},'reduced-motion tools are static even before entering the viewport')
  assert.ok(await tool.evaluate(el=>getComputedStyle(el).transitionDuration.split(',').every(value=>parseFloat(value)<=.00001)),'reduced-motion color feedback is effectively zero')
  await tool.scrollIntoViewIfNeeded();await tool.tap()
  assert.equal(await page.evaluate(()=>matchMedia('(hover: hover)').matches),false)
  assert.deepEqual(await tool.evaluate(el=>({background:getComputedStyle(el).backgroundColor,border:getComputedStyle(el).borderTopColor,transform:getComputedStyle(el).transform})),{background:'rgba(255, 255, 255, 0.04)',border:'rgba(255, 255, 255, 0.1)',transform:'none'},'touch must not acquire sticky hover colors or lift')
  console.log('PASS touch hover guard and reduced-motion static tools')
 }catch(e){failures++;console.error(`FAIL touch/reduced tools: ${e.message}`)}finally{await touch.close()}
}finally{await browser.close()}
if(failures)process.exitCode=1
