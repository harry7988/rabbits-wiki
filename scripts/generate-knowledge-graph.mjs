/**
 * generate-knowledge-graph.mjs —— 生成 AI Agent 友好的知识图谱
 *
 * 输出 dist/graph.json：
 *   - nodes：每个页面（id、title、description、url、md 镜像、section）
 *   - edges：从 markdown 内链提取的页面关系（from → to + 链接文字）
 *   - sections：专题层级（site → section → pages）
 *   - stats：规模统计
 *
 * Agent 用法示例：
 *   1. 读 graph.json 找到相关节点（按 title/description/section 检索）
 *   2. 顺 edges 扩展关联页面
 *   3. 读节点的 md 镜像拿全文
 *
 * 边的语义：站内 markdown 链接即"相关"（relates），链接文字保留
 * 作为关系描述。不猜测不存在的关系。
 */

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'node:fs'
import { join, dirname, resolve, relative, normalize, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DOCS = join(ROOT, 'docs')
const DIST = join(DOCS, '.vitepress', 'dist')
const SITE = 'https://www.rabbits.wiki'

const SECTION_META = {
  digest: '消化系统科普',
  emergencies: '急症处置',
  care: '日常养育',
  handling: '操作技能',
  breeds: '品种百科',
  supplies: '常备药与用品',
  tools: '交互工具',
  faq: '高频问答',
}

function walkMd(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    const f = join(dir, e)
    if (statSync(f).isDirectory()) {
      if (e === '.vitepress' || e === 'public') continue
      walkMd(f, acc)
    } else if (e.endsWith('.md')) acc.push(f)
  }
  return acc
}

const files = walkMd(DOCS)

// ---- 解析 frontmatter ----
function parseFm(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n/)
  const fm = {}
  if (m) {
    for (const line of m[1].split('\n')) {
      const kv = line.match(/^(\w+):\s*(.*)$/)
      if (kv && !line.startsWith(' ')) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, '')
    }
  }
  return fm
}

// ---- 页面 web 路径 ----
function webPath(relFromDocs) {
  if (relFromDocs === 'index') return ''
  if (relFromDocs.endsWith('/index')) return relFromDocs.slice(0, -'/index'.length) + '/'
  return relFromDocs
}

// ---- 节点 ----
const nodes = []
const idByAbs = new Map()

for (const file of files) {
  const raw = readFileSync(file, 'utf8')
  const fm = parseFm(raw)
  const relFromDocs = relative(DOCS, file).replace(/\.md$/, '').split(sep).join('/')
  const section = relFromDocs.includes('/') ? relFromDocs.split('/')[0] : 'root'
  const wp = webPath(relFromDocs)
  const id = wp === '' ? '/' : '/' + wp

  const node = {
    id,
    title: fm.title || relFromDocs,
    description: fm.description || '',
    url: `${SITE}/${wp}`,
    md: `${SITE}/md/${relFromDocs}.md`,
    section: SECTION_META[section] || (section === 'root' ? '站点' : section),
  }
  nodes.push(node)
  idByAbs.set(normalize(file), node)
}

// ---- 边：提取站内 markdown 链接 ----
const edges = []
const seenEdge = new Set()

for (const file of files) {
  const raw = readFileSync(file, 'utf8')
  const fromNode = idByAbs.get(normalize(file))
  if (!fromNode) continue
  // markdown 链接 [text](target)，排除 http 外链/锚点/图片
  const re = /\[([^\]]*)\]\(([^)]+)\)/g
  let m
  while ((m = re.exec(raw)) !== null) {
    const text = m[1]
    let target = m[2].trim()
    if (/^(https?:|mailto:|#|tel:)/.test(target)) continue
    target = target.split('#')[0] // 去锚点
    if (!target || !target.endsWith('.md') && !target.endsWith('/')) {
      // 指向目录的链接（如 ../tools/）也处理
    }
    // 解析相对路径到绝对文件路径
    let abs
    try {
      if (target.startsWith('/')) {
        // 站点根相对 → docs 下
        abs = normalize(join(DOCS, target.replace(/\/$/, '/index').replace(/^\/?/, '')))
        if (!abs.endsWith('.md')) abs = join(abs.replace(/\/$/, '') + (target.endsWith('/') ? '/index.md' : '.md'))
      } else {
        abs = normalize(resolve(dirname(file), target))
      }
    } catch { continue }
    // 尝试 .md 或 /index.md 两种落点
    const candidates = abs.endsWith('.md') ? [abs, join(abs, 'index.md')] : [abs + '.md', join(abs, 'index.md')]
    let toNode = null
    for (const c of candidates) {
      if (idByAbs.has(normalize(c))) { toNode = idByAbs.get(normalize(c)); break }
    }
    if (!toNode || toNode.id === fromNode.id) continue
    const key = `${fromNode.id}|${toNode.id}|${text}`
    if (seenEdge.has(key)) continue
    seenEdge.add(key)
    edges.push({ from: fromNode.id, to: toNode.id, text: text || 'see also', type: 'relates' })
  }
}

// ---- sections 层级 ----
const sectionsMap = new Map()
for (const n of nodes) {
  if (!sectionsMap.has(n.section)) sectionsMap.set(n.section, [])
  sectionsMap.get(n.section).push(n.id)
}
const sections = [...sectionsMap.entries()].map(([title, pages]) => ({ title, pages }))

// ---- 输出 ----
const graph = {
  name: 'rabbits.wiki',
  url: SITE,
  description: '由社区共创的兔子百科——所有结论可溯源到权威兽医来源。此知识图谱供 AI Agent 导航：节点=页面，边=站内真实链接关系。',
  format: 'knowledge-graph/1',
  usage: {
    find: '按 nodes 的 title/description/section 检索相关页面',
    expand: '沿 edges（from/to）找关联页面；text 是链接文字即关系描述',
    read: '取节点的 md 字段读取纯净全文镜像',
    policy: '允许训练/检索/引用，引用需标注来源 URL 与访问日期（见 /.well-known/ai.json）',
  },
  generatedAt: new Date().toISOString().slice(0, 10),
  stats: {
    nodes: nodes.length,
    edges: edges.length,
    sections: sections.length,
  },
  nodes: nodes.sort((a, b) => a.id.localeCompare(b.id)),
  edges: edges.sort((a, b) => (a.from + a.to).localeCompare(b.from + b.to)),
  sections,
}

mkdirSync(DIST, { recursive: true })
writeFileSync(join(DIST, 'graph.json'), JSON.stringify(graph, null, 2))
console.log(`✓ 生成 /graph.json：${nodes.length} 节点、${edges.length} 边、${sections.length} 专题`)
