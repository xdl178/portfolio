// All identity and contact fields remain explicit placeholders until the owner supplies approved details.
export const profileFields = {
  name: '姓名待补充',
  location: '所在地待补充',
  experience: '工作经验待补充',
  contact: '联系方式待补充',
  keywords: '界面设计 / 视觉设计 / 动效设计',
  educationPeriod: '就读时间待补充',
  school: '学校待补充',
  major: '专业待补充',
  employmentPeriod: '任职时间待补充',
  employer: '机构待补充',
  position: '岗位待补充',
  summary: '个人简介待补充',
  email: '邮箱待补充',
  website: '作品站待补充',
} as const

// Reuses the introduction already shown on AboutPage; no reference-author biography.
export const profileIntro = [
  '我是一名视觉与 UI/UX 设计师，工作覆盖原创 IP、品牌交互与 AI 产品官网。习惯从真实场景出发，把复杂的信息结构梳理成直觉可读的界面，并与开发一起把设计落到线上。',
  '当前可接受新项目委托，方向包括品牌视觉系统、产品界面与动态影像。',
] as const

// Display-only contact data: footer uses placeholder text for empty slots and never creates links.
export const profileLinks = { behance: '', xiaohongshu: '' }

export const contactRoute = '/?section=contact'
export const introRoute = '/?section=about-intro'
export const worksRoute = '/?section=work'
export const practiceRoute = '/?section=practice'
