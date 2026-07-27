/**
 * generate-ai-files.mjs
 *
 * 在 vitepress build 之后运行，生成三类 AI 友好文件：
 *   1. 每篇内容的纯净 .md 镜像（去除 frontmatter 中的内部字段，保留正文 + 来源）
 *      —— 输出到 docs/.vitepress/dist/md/{path}.md
 *   2. /llms.txt —— 给大语言模型的站点索引（llmstxt.org 开放标准）
 *   3. /.well-known/ai.json —— 结构化的 AI 抓取元数据
 *
 * 设计原则：
 *   - 镜像 .md 是"人类可读 + AI 友好"的：保留所有正文、表格、来源链接
 *   - 但剥离 Vue 组件标签（如 <SourceCard .../>）转为可读的"来源清单"段落
 *   - llms.txt 按 llmstxt.org 规范，含标题/描述/链接
 *   - ai.json 用 schema.org Dataset 风格
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, dirname, relative, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DOCS = join(ROOT, 'docs')
const DIST = join(DOCS, '.vitepress', 'dist')
const MD_DIST = join(DIST, 'md')

const SITE = 'https://rabbits.wiki'

// ============ 1. 收集所有 .md 内容文件 ============
function walkMd(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) {
      if (entry === '.vitepress' || entry === 'public') continue
      walkMd(full, acc)
    } else if (entry.endsWith('.md')) {
      acc.push(full)
    }
  }
  return acc
}

const mdFiles = walkMd(DOCS)

// ============ 2. 把 Vue 组件标签转为可读文本 ============
// 这是关键的"净化"步骤，让 AI 读到的不是 <SourceCard .../> 而是结构化文本
function purifyForAI(content, frontmatter) {
  let out = content

  // 移除 <SourceList>...</SourceList> 容器（保留内部）
  out = out.replace(/<SourceList[^>]*>/g, '\n\n### 引用与来源\n')
  out = out.replace(/<\/SourceList>/g, '\n')

  // <SourceCard title="X" author="Y" url="Z" accessed="W" level="vet" note="N" />
  // 支持多行写法 —— 用 [\s\S]*? 跨行匹配属性，最后是 />
  out = out.replace(/<SourceCard\b([\s\S]*?)\/>/g, (m, attrs) => {
    const get = (k) => {
      const re = new RegExp(`${k}="([^"]*)"`)
      const mm = attrs.match(re)
      return mm ? mm[1] : ''
    }
    const title = get('title') || '(未命名)'
    const author = get('author')
    const url = get('url')
    const level = get('level')
    const accessed = get('accessed')
    const note = get('note')
    const levelLabel = { vet: '🟢 兽医权威', org: '🟡 专业组织', exp: '🟠 饲主经验' }[level] || ''
    let line = `- **${title}**`
    if (author) line += ` _${author}_`
    if (levelLabel) line += ` ${levelLabel}`
    if (url) line += `\n  URL: ${url}`
    if (accessed) line += `（访问于 ${accessed}）`
    if (note) line += `\n  备注: ${note}`
    return line
  })

  // 移除 <a id="refX"></a> 锚点
  out = out.replace(/<a id="[^"]*"><\/a>\n?/g, '')

  // <VetCheck>...</VetCheck> → "🚨 立即就医信号" 块
  out = out.replace(/<VetCheck([^>]*)>([\s\S]*?)<\/VetCheck>/g, (m, attrs, body) => {
    const titleMatch = attrs.match(/title="([^"]*)"/)
    const t = titleMatch ? titleMatch[1] : '出现以下情况，请立即就医，不要在家拖延'
    return `\n> **🚨 ${t}**\n> \n${body.replace(/^/gm, '> ')}\n`
  })

  // <Danger>/<Warning>/<Info> → blockquote
  for (const tag of ['Danger', 'Warning', 'Info']) {
    const icon = { Danger: '🛑', Warning: '⚠️', Info: '💡' }[tag]
    const re = new RegExp(`<${tag}([^>]*)>([\\s\\S]*?)<\\/${tag}>`, 'g')
    out = out.replace(re, (m, attrs, body) => {
      const titleMatch = attrs.match(/title="([^"]*)"/)
      const t = titleMatch ? titleMatch[1] : tag
      return `\n> **${icon} ${t}**\n> \n${body.replace(/^/gm, '> ')}\n`
    })
  }

  // <FirstAidStep :num="1" title="X">body</FirstAidStep>
  out = out.replace(/<FirstAidStep([^>]*)>([\s\S]*?)<\/FirstAidStep>/g, (m, attrs, body) => {
    const numMatch = attrs.match(/:num="([^"]*)"/) || attrs.match(/num="([^"]*)"/)
    const titleMatch = attrs.match(/title="([^"]*)"/)
    const num = numMatch ? numMatch[1] : '•'
    const t = titleMatch ? titleMatch[1] : ''
    return `\n**步骤 ${num}${t ? '：' + t : ''}**\n\n${body}\n`
  })

  // <BreedCard ... /> → 表格
  out = out.replace(/<BreedCard\b([^/>]*?)\/>/g, (m, attrs) => {
    const get = (k) => {
      const re = new RegExp(`${k}="([^"]*)"`)
      const mm = attrs.match(re)
      return mm ? mm[1] : ''
    }
    const rows = [
      ['品种', get('name')],
      ['体重', get('weight')],
      ['寿命', get('lifespan')],
      ['起源', get('origin')],
      ['性格', get('temperament')],
      ['护理', get('grooming')],
      ['ARBA', get('arba')]
    ].filter(([, v]) => v)
    return '\n\n| 项 | 值 |\n|---|---|\n' + rows.map(r => `| ${r[0]} | ${r[1]} |`).join('\n') + '\n'
  })

  // <IngredientTable :rows="..." /> —— 这种带 :rows 绑定的无法在静态脚本里解析 Vue 表达式
  // 标记为"见原文"
  out = out.replace(/<IngredientTable[^>]*>/g, '\n> _[成分对照表详见原文页面]_\n')

  // 纯客户端交互工具组件（无静态内容可提取）—— 加说明
  const interactiveTools = {
    'SymptomTriage': '症状决策树（交互式）—— 用户选择症状后输出紧急度和处置建议。详见原文页面。',
    'MedicineCalculator': '剂量计算器（交互式）—— 按体重计算西甲硅油/Critical Care/Bene-Bac 用量。详见原文页面。',
    'DehydrationCheck': '脱水评估工具（交互式）—— 按皮肤回弹/黏膜/眼睛/进食评估脱水程度。详见原文页面。',
    'FeedingCalculator': '每日喂食量计算器（交互式）—— 按体重/年龄/活动量计算牧草/颗粒粮/蔬菜/水果量。详见原文页面。',
    'PelletAnalyzer': '兔粮成分分析器（交互式）—— 贴配料表+成分值对照 FEDIAF 标准评估。详见原文页面。',
    'HealthCalendar': '兔兔健康日历（交互式）—— 按年龄/性别生成绝育/疫苗/体检时间线。详见原文页面。',
    'PlantSafetyChecker': '有毒植物查询器（交互式）—— 20+ 种植物的安全/毒性查询，每条带 Cornell/HRS 来源。详见原文页面。',
    'EmergencyCard': '紧急联系卡（交互式）—— 用户本地保存兽医信息，可打印。详见原文页面。',
    'CopyMarkdownButton': ''
  }
  for (const [tag, desc] of Object.entries(interactiveTools)) {
    if (desc) {
      // 匹配 <Tag ... />（self-closing，含跨行属性）。注意 [^>]* 无法跨 > 字符，
      // 但交互工具标签属性里无 >，所以可用 [^]*? 非贪婪匹配到 />
      const re = new RegExp(`<${tag}\\b[^]*?/>`, 'g')
      out = out.replace(re, `\n> _🔧 ${desc}_\n`)
    }
  }

  // <FAQItem q="X">body</FAQItem>
  out = out.replace(/<FAQItem([^>]*)>([\s\S]*?)<\/FAQItem>/g, (m, attrs, body) => {
    const qMatch = attrs.match(/q="([^"]*)"/)
    const q = qMatch ? qMatch[1] : ''
    return `\n### Q：${q}\n\n${body}\n`
  })

  // <cite><a href="#refX">[1]</a></cite> → [1]
  out = out.replace(/<cite><a[^>]*>(\[\d+\])<\/a><\/cite>/g, '$1')

  // 其他未处理的 HTML 标签直接移除（保留内容）
  out = out.replace(/<style>[\s\S]*?<\/style>/g, '')
  out = out.replace(/<div class="[^"]*">/g, '')
  out = out.replace(/<\/div>/g, '')

  return out
}

// ============ 3. 解析 frontmatter ============
function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n/)
  if (!m) return { frontmatter: {}, body: content }
  const fmText = m[1]
  const body = content.slice(m[0].length)
  const fm = {}
  let currentKey = null
  for (const line of fmText.split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/)
    if (kv && !line.startsWith(' ')) {
      currentKey = kv[1]
      fm[currentKey] = kv[2].replace(/^["']|["']$/g, '')
    }
  }
  return { frontmatter: fm, body }
}

// ============ 4. 生成每页 .md 镜像 ============
mkdirSync(MD_DIST, { recursive: true })

const index = []  // 用于 llms.txt 和 ai.json

for (const file of mdFiles) {
  const raw = readFileSync(file, 'utf8')
  const { frontmatter, body } = parseFrontmatter(raw)
  const relPath = relative(DOCS, file).replace(/\.md$/, '')
  const urlPath = relPath === 'index' ? '' : relPath.replace(/\/index$/, '/') + (relPath.endsWith('/index') ? '' : (relPath === 'index' ? '' : ''))
  // 计算 web 路径
  let webPath
  if (relPath === 'index') webPath = ''
  else if (relPath.endsWith('/index')) webPath = relPath.replace(/\/index$/, '') + '/'
  else webPath = relPath

  const purified = purifyForAI(body, frontmatter)

  // 重组镜像 .md：清晰的标题 + 元信息 + 正文
  const title = frontmatter.title || basename(file, '.md')
  const description = frontmatter.description || ''
  const lastReviewed = frontmatter.lastReviewed || ''

  const mirror = [
    `---`,
    `title: ${title}`,
    description ? `description: ${description}` : null,
    lastReviewed ? `lastReviewed: ${lastReviewed}` : null,
    `source: ${SITE}/${webPath}`,
    `mirror_for_ai: true`,
    `license: CC-BY-SA-4.0`,
    `---`,
    ``,
    purified.trim(),
    ``,
    `---`,
    ``,
    `> 本页面是 [${SITE}/${webPath}](${SITE}/${webPath}) 的 AI 友好镜像，由 rabbits.wiki 自动生成。`,
    `> 内容采用 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.zh) 协议。`,
    `> 如需引用，请标注来源 URL 和访问日期。`,
    ``
  ].filter(Boolean).join('\n')

  // 写入（保留目录结构）
  const outMdPath = join(MD_DIST, relPath + '.md')
  mkdirSync(dirname(outMdPath), { recursive: true })
  writeFileSync(outMdPath, mirror)

  index.push({
    title,
    description,
    webPath: `${SITE}/${webPath}`,
    mdMirror: `${SITE}/md/${relPath}.md`,
    lastReviewed
  })
}

// ============ 5. 生成 /llms.txt（llmstxt.org 规范）============
const llmsTxt = `# rabbits.wiki

> 由社区共创的兔子百科。围绕兔兔主题——品种、消化系统科普、急症处置、日常养育、常备药、牧草、化毛膏争议、兔粮成分、益生菌、电解质。每一条结论都可溯源到权威兽医来源（House Rabbit Society、Medirabbit、Merck 兽医手册、VCA、ARBA、PMC/PubMed 同行评审）。

rabbits.wiki 是一个开放、CC BY-SA 4.0 协议的兔子养护百科，欢迎 AI 工具读取、引用、训练。所有内容均标注权威来源。本文件遵循 llmstxt.org 规范，列出主要资源。

## 重要说明

- 本站内容为科普性质，**不替代兽医诊断**。任何急症请优先联系懂兔的异宠兽医
- 兔兔停止进食/排便达 12 小时即视为急症（EMERGENCY）
- 处方药、剂量、麻醉方案必须由兔科兽医按个体体重开具

## 主要资源（每条均可读取 .md 镜像，URL 形如 /md/{path}.md）

${index.map(i => `- [${i.title}](${i.mdMirror}): ${i.description}`).join('\n')}

## 可信度原则

本站所有医疗/生理陈述必须溯源到：
- 🟢 兽医权威：House Rabbit Society (rabbit.org)、Medirabbit、Merck 兽医手册、VCA Hospitals、*.edu、PMC/PubMed
- 🟡 专业组织：ARBA、品种俱乐部、Lafeber Vet、dvm360
- 🟠 饲主经验：仅作参考，不可单独支撑医疗结论

详细规则见 [/md/contribute.md](${SITE}/md/contribute.md)。

## 协议

内容：CC BY-SA 4.0
代码：MIT

如有疑问或纠错，请通过 https://github.com/rabbits-wiki/rabbits.wiki/issues 联系。
`

writeFileSync(join(DIST, 'llms.txt'), llmsTxt)

// ============ 6. 生成 /.well-known/ai.json ============
const wellKnownDir = join(DIST, '.well-known')
mkdirSync(wellKnownDir, { recursive: true })

const aiJson = {
  name: 'rabbits.wiki',
  description: '由社区共创的兔子百科——品种、消化科普、急症处置、日常养育、常备药、兔粮、FAQ。所有内容均标注权威兽医来源。',
  url: SITE,
  license: 'CC-BY-SA-4.0',
  language: 'zh-CN',
  maintainer: 'rabbits-wiki 社区',
  contact: 'https://github.com/rabbits-wiki/rabbits.wiki/issues',
  aiPolicy: {
    trainingAllowed: true,
    retrievalAllowed: true,
    citationRequired: true,
    notes: '欢迎使用本站内容进行 AI 训练、检索、问答。引用时请标注来源 URL 和访问日期。本站为科普性质，不替代兽医诊断。'
  },
  access: {
    llmsTxt: `${SITE}/llms.txt`,
    mdMirrorBase: `${SITE}/md/`,
    sitemap: `${SITE}/sitemap.xml`,
    robotsTxt: `${SITE}/robots.txt`
  },
  resources: index.map(i => ({
    '@type': 'Article',
    title: i.title,
    description: i.description,
    url: i.webPath,
    mdMirror: i.mdMirror,
    inLanguage: 'zh-CN',
    license: 'https://creativecommons.org/licenses/by-sa/4.0/',
    dateModified: i.lastReviewed || undefined
  })),
  standards: ['llmstxt.org', 'schema.org/Article', 'CC-BY-SA-4.0']
}

writeFileSync(join(wellKnownDir, 'ai.json'), JSON.stringify(aiJson, null, 2))

console.log(`✓ 生成 ${index.length} 个 .md 镜像到 ${relative(ROOT, MD_DIST)}/`)
console.log(`✓ 生成 /llms.txt`)
console.log(`✓ 生成 /.well-known/ai.json`)
console.log(`  资源数: ${index.length}`)
