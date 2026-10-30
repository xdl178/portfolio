import assert from 'node:assert/strict'
let createContactChannels
try { ({ createContactChannels } = await import('./src/utils/contactChannels.ts')) } catch {}
assert.equal(typeof createContactChannels, 'function', 'contact URL validator remains available for future link consumers')
const pending=createContactChannels({email:'邮箱待补充',phone:'联系方式待补充',behance:'',xiaohongshu:''})
assert.equal(pending.length,4);assert.ok(pending.every(channel=>channel.href===null))
const ready=createContactChannels({email:'designer@example.com',phone:'+1 (202) 555-0100',behance:'https://www.behance.net/example',xiaohongshu:'https://www.xiaohongshu.com/user/profile/example'})
assert.deepEqual(ready.map(channel=>channel.href),['mailto:designer@example.com','tel:+12025550100','https://www.behance.net/example','https://www.xiaohongshu.com/user/profile/example'])
for(const value of ['#','javascript:alert(1)','http://example.com','https://user:password@example.com'])assert.ok(createContactChannels({email:value,phone:value,behance:value,xiaohongshu:value}).every(channel=>channel.href===null))
assert.ok(createContactChannels({email:'',phone:'12',behance:'not a url',xiaohongshu:''}).every(channel=>channel.href===null))
console.log('PASS legacy contact URL validator rejects placeholders and unsafe values; footer intentionally renders no contact links')
