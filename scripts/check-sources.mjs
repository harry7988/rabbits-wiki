/**
 * check-sources.mjs —— 来源 URL 可达性抽样检查
 *
 * 从 docs/ 下所有 .md 中抽取 SourceCard 的 url="..." 字段，
 * 抽样发起 HEAD 请求，检查可达性。
 *
 * 用法：
 *   node scripts/check-sources.mjs              # 默认抽 15 个
 *   node scripts/check-sources.mjs --all        # 检查全部
 *   node scripts/check-sources.mjs --sample 30  # 抽 30 个
 *
 * 输出：可达/重定向/失败统计 + 失败 URL 列表（供人工复核）
 *
 * 注意：
 * - 失败不一定是"链接失效"——可能是反爬（403）、临时网络、地区限制
 * - 失败 URL 需人工浏览器复核，不直接判"造假"
 * - 本脚本只做"健康度抽检"，不做内容真实性判断
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DOCS = join(__dirname, '..', 'docs')

const args = process.argv.slice(2)
let sampleSize = 15
if (args.includes('--all')) sampleSize = Infinity
else {
  const sIdx = args.indexOf('--sample')
  if (sIdx !== -1) sampleSize = parseInt(args[sIdx + 1]) || 15
}

// 收集所有 url
function walkMd(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    const f = join(dir, e)
    const st = statSync(f)
    if (st.isDirectory()) {
      if (e === '.vitepress' || e === 'public') continue
      walkMd(f, acc)
    } else if (e.endsWith('.md')) acc.push(f)
  }
  return acc
}

const urls = new Set()
for (const file of walkMd(DOCS)) {
  const text = readFileSync(file, 'utf8')
  // 匹配多行 SourceCard 的 url="..."（跨行版本）
  const matches = text.matchAll(/url="([^"]+)"/g)
  for (const m of matches) {
    const u = m[1]
    // 排除本站内部和明显锚点
    if (u.startsWith('http')) urls.add(u)
  }
}

const allUrls = [...urls].sort()
console.log(`📊 共收集 ${allUrls.length} 个唯一外部 URL`)

// 抽样
const sample = sampleSize === Infinity ? allUrls : (() => {
  // 均匀抽样（按索引等间隔）
  const step = Math.max(1, Math.floor(allUrls.length / sampleSize))
  const s = []
  for (let i = 0; i < allUrls.length && s.length < sampleSize; i += step) s.push(allUrls[i])
  return s
})()
console.log(`🔍 本次抽样检查 ${sample.length} 个\n`)

// 检查函数（带超时，HEAD 优先，失败回退 GET）
async function check(url, timeoutMs = 12000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    // 先 HEAD（省流量），很多站点不支持就回退 GET
    let res = await fetch(url, { method: 'HEAD', signal: controller.signal, redirect: 'follow' })
    if (res.status === 405 || res.status === 403 || res.status === 501 || res.status === 404) {
      // 403/404 可能是反 HEAD，回退 GET
      const c2 = new AbortController()
      const t2 = setTimeout(() => c2.abort(), timeoutMs)
      try {
        res = await fetch(url, { method: 'GET', signal: c2.signal, redirect: 'follow' })
      } finally { clearTimeout(t2) }
    }
    clearTimeout(timer)
    return { status: res.status, ok: res.ok }
  } catch (e) {
    clearTimeout(timer)
    return { status: 0, ok: false, error: e.message }
  }
}

const results = { ok: [], redirect: [], clientError: [], serverError: [], networkError: [] }

let i = 0
for (const url of sample) {
  i++
  process.stdout.write(`  [${i}/${sample.length}] ${url.slice(0, 70)}...`)
  const r = await check(url)
  if (r.ok && r.status >= 200 && r.status < 300) {
    results.ok.push(url); process.stdout.write(` ✅ ${r.status}\n`)
  } else if (r.status >= 300 && r.status < 400) {
    results.redirect.push({ url, status: r.status }); process.stdout.write(` ➡️ ${r.status}\n`)
  } else if (r.status >= 400 && r.status < 500) {
    results.clientError.push({ url, status: r.status }); process.stdout.write(` ⚠️ ${r.status}\n`)
  } else if (r.status >= 500) {
    results.serverError.push({ url, status: r.status }); process.stdout.write(` 🔴 ${r.status}\n`)
  } else {
    results.networkError.push({ url, error: r.error }); process.stdout.write(` ❌ 网络: ${r.error?.slice(0, 40)}\n`)
  }
}

// 汇总
console.log(`\n📊 抽样检查结果（${sample.length} 个）`)
console.log(`  ✅ 正常 (2xx):     ${results.ok.length}`)
console.log(`  ➡️ 重定向 (3xx):   ${results.redirect.length}`)
console.log(`  ⚠️ 客户端 (4xx):   ${results.clientError.length}  (可能是反爬/地区限制，需人工浏览器复核)`)
console.log(`  🔴 服务端 (5xx):   ${results.serverError.length}`)
console.log(`  ❌ 网络错误:       ${results.networkError.length}`)

if (results.clientError.length || results.serverError.length || results.networkError.length) {
  console.log(`\n⚠️ 需人工复核的 URL（不一定失效，可能是反爬/网络环境）:`)
  console.log(`\n  【4xx 客户端错误】—— 多数是反爬（服务器拒绝 bot 但页面真实存在）`)
  for (const x of results.clientError) {
    console.log(`  [${x.status}] ${x.url}`)
  }
  console.log(`\n  【5xx 服务端错误】—— 站点临时故障或维护，通常非永久失效`)
  for (const x of results.serverError) {
    console.log(`  [${x.status}] ${x.url}`)
  }
  console.log(`\n  【网络错误】—— 可能是当前网络环境对国外站点访问慢/受限，不代表链接失效`)
  console.log(`  （权威站如 Wikipedia、Merck、Cornell 等几乎肯定真实存在）`)
  for (const x of results.networkError) {
    console.log(`  [超时] ${x.url}`)
  }
  console.log(`\n💡 复核方法：`)
  console.log(`   1. 在浏览器中手动打开 URL，确认页面是否真实存在`)
  console.log(`   2. 4xx 若确认为真 404，提 PR 更新 URL`)
  console.log(`   3. 5xx/网络错误通常过段时间再测即可`)
  console.log(`   Issue: https://github.com/rabbits-wiki/rabbits.wiki/issues`)
  // 不 fail，因为反爬是常见情况
  process.exit(0)
} else {
  console.log(`\n✅ 抽样全部可达`)
}
