// About-route content migrated from the user-provided reference page.
// Kept separate from shared profile, home, and footer content.

export const aboutIntro: string[] = [
  '我是一名视觉传达设计专业的毕业生，2026 年 6 月毕业。拥有两段正式工作经历，主导过深圳前湾公园体感游戏、长沙智谷智能体测、北京博大公园智能体等多个真实商业项目的全流程设计。',
  '我的作品覆盖原创 IP 视觉系统、品牌网页交互设计、AI 产品官网设计三大方向，既具备品牌视觉的整体系统能力，又熟悉网页与产品界面的全链路落地流程。',
];

export const aboutMetrics: {
  tag: string;
  value: string;
  suffix: string;
  label: string;
}[] = [
  { tag: 'N·01', value: '05', suffix: '+', label: '项国际设计奖项' },
  { tag: 'N·02', value: '03', suffix: '', label: '个大型实战项目' },
  { tag: 'N·03', value: '02', suffix: '', label: '份正式工作经历' },
  { tag: 'N·04', value: '14', suffix: '+', label: '款工具熟练掌握' },
];

export const aboutStatement: { title: string; text: string } = {
  title: '「做有秩序、有温度、可落地的设计」',
  text: '我相信设计不仅仅是「好看」，而是要把视觉秩序、用户体验与技术落地三者捏合在一起，做到有秩序、有温度、可上线交付。',
};

export const aboutAwards: {
  no: string;
  name: string;
  org: string;
  date: string;
  tier: string;
}[] = [
  {
    no: '01',
    name: '国青杯 · 全国高校艺术设计大赛 · 一等奖',
    org: '中国人生科学学会艺术教育专业委员会',
    date: '2025',
    tier: '国家级 · 一等奖',
  },
  {
    no: '02',
    name: 'G-CROSS 创意星球 · 铜奖',
    org: 'G-CROSS 国际创意大奖赛 · Global Creative Cross Awards',
    date: '2025',
    tier: '国际 · 铜奖',
  },
  {
    no: '03',
    name: 'BICC 中英国际创意大赛 · 铜奖',
    org: 'BICC · Sino-British International Creative Competition',
    date: '2025',
    tier: '国际 · 铜奖',
  },
  {
    no: '04',
    name: '新加坡金沙艺术设计大赛 · 铜奖',
    org: 'Marina Bay Sands Art & Design Competition · 新加坡',
    date: '2025',
    tier: '国际 · 铜奖',
  },
  {
    no: '05',
    name: '中国当代大学生艺术作品年鉴 · 入围奖',
    org: '《中国当代大学生艺术作品年鉴》编委会 · 全国评选',
    date: '2025',
    tier: '全国 · 入围奖',
  },
];

export const aboutStrengths: {
  no: string;
  title: string;
  titleEn: string;
  summary: string;
  points: string[];
}[] = [
  {
    no: 'I',
    title: '全链路设计能力',
    titleEn: 'Full-Stack Designer',
    summary:
      '从品牌视觉到交互界面，从网页落地页到 AI 产品官网，可独立承担从概念提案、视觉系统、组件规范到高保真页面输出的完整全流程设计工作，无需多工种介入即可交付可落地的全案设计方案。',
    points: [
      '品牌视觉 · VI 系统 / IP 角色设计 / 宣传物料',
      '界面 UI / UX · 信息架构 / 交互流程 / 组件库',
      '网页落地页 · 响应式适配 / 产品叙事 / 视觉编排',
      '动效与延展 · AE 动态演示 / 视频分镜 / 场景特效',
    ],
  },
  {
    no: 'II',
    title: '项目落地实战经验',
    titleEn: 'Delivery-Focused',
    summary:
      '具备真实企业工作背景，深度参与过深圳前湾公园、长沙智谷、北京博大公园等多个市政级项目完整上线流程，熟悉智慧园区、健康终端、智能体系统等复杂业务场景，能够将设计与开发、产品、项目经理协同落地。',
    points: [
      '2 份正式工作 · 累计主导 3+ 个商业项目',
      '熟悉产品评审 / 技术限制 / 排期协同等全流程',
      '可输出从设计走查到折中方案的落地优化策略',
      '擅长针对不同用户群打磨界面手感与反馈机制',
    ],
  },
  {
    no: 'III',
    title: 'AI 工作流深度掌握',
    titleEn: 'AI-Augmented Workflow',
    summary:
      '熟用多种 AI 设计工具与工作流，可在保证设计品质的同时显著提升输出速度，从头脑风暴、概念发散、视觉参考生成到产品化辅助均有成熟使用习惯，让设计表达更快速、更有层次感。',
    points: [
      'AIGC 参考生成 · Midjourney / Stable Diffusion / Lovart',
      '设计代码化 · Trae / Stitch / Codex / Peachweb',
      '多端界面交付 · Figma / Mastergo 组件与规范',
      '视觉与动效 · PS / AI / AE / C4D / TouchDesigner',
    ],
  },
  {
    no: 'IV',
    title: '强抗压与沟通协作',
    titleEn: 'Communication & Pressure',
    summary:
      '对设计品质有稳定的高要求，在紧张排期下仍能保持输出节奏与细节把控；善于用清晰的设计表达与非设计背景的项目经理、产品、开发高效沟通，能够承担设计侧核心对接角色推动项目上线。',
    points: [
      '跨团队协作 · 设计侧核心执行人与对接枢纽',
      '可独立主持需求评审、方案汇报与交付同步',
      '英语四级 · 可阅读海外设计趋势与文档',
      '稳定交付 · 多项目并行下的节奏管理能力',
    ],
  },
];

export const aboutStrengthsIntro: string =
  '四大核心能力画像，从设计输出到项目落地，从 AI 工作流到跨团队沟通，构建了一套相对完整的设计师成长体系。';

export const aboutContact: {
  intro: string;
  location: string;
  locationDetail: string;
  availability: string;
  availabilityDetail: string;
  email: string;
  phone: string;
  phoneDisplay: string;
  info: { label: string; value: string }[];
  response: string;
} = {
  intro:
    '不论是设计岗位 / 工作机会，还是自由设计合作 / 项目交流 / 作品集反馈，都欢迎随时与我联系。我会在 24 小时内回复邮件与消息。',
  location: '青岛',
  locationDetail: 'Shandong · China',
  availability: '随时到岗',
  availabilityDetail: 'Full Time · 全职岗位',
  email: '3112516515@qq.com',
  phone: '13668862258',
  phoneDisplay: '136 · 6886 · 2258',
  info: [
    { label: '姓名', value: '朱泓宇' },
    { label: '出生年月', value: '2004 年 06 月' },
    { label: '学校 / 专业', value: '华东交通大学理工学院 · 视觉传达设计（本科）' },
    { label: '毕业时间', value: '2026 年 06 月' },
    { label: '求职意向', value: 'UI / UX 设计师 · 交互设计师 · 视觉设计师' },
    { label: '可到岗时间', value: '随时到岗 · 全职岗位' },
  ],
  response: '可随时通过以上任意方式联系 · 24 HOURS RESPONSE',
};
