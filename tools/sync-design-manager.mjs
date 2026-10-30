import {readFileSync,writeFileSync} from 'node:fs'
import {resolve,dirname} from 'node:path'
import {fileURLToPath} from 'node:url'
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..')
const read=path=>readFileSync(resolve(root,path),'utf8')
let html=read('design-manager.html')
const schema=JSON.parse(read('design-system.schema.json'))
const files=['src/index.css','src/components/SectionHeading.css','src/components/SurfaceCard.css','src/components/WorkTag.css','src/components/ActionButton.css','src/components/PointerGlow.css']
const seeds={'seed-schema':schema,'seed-style':read('public/design-system.css'),'seed-preview':files.map(read).join('\n')}
for(const[id,value]of Object.entries(seeds)){
 const tag=`<script id="${id}" type="application/json">`,start=html.indexOf(tag)
 if(start<0)throw Error(`Missing HTML seed: ${id}`)
 const end=html.indexOf('</script>',start+tag.length)
 if(end<0)throw Error(`Unclosed HTML seed: ${id}`)
 html=html.slice(0,start+tag.length)+JSON.stringify(value).replaceAll('<','\\u003c')+html.slice(end)
}
writeFileSync(resolve(root,'design-manager.html'),html)
console.log(`PASS offline defaults synchronized: ${schema.groups.reduce((n,g)=>n+g.tokens.length,0)} parameters, no external runtime`)
