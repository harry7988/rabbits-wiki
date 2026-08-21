#!/usr/bin/env node
/**
 * check-markdown.mjs —— 组件 slot Markdown 渲染检查
 *
 * 背景：VitePress 只处理 .md 顶层的 Markdown。
 * <VetCheck>/<Warning>/<Danger>/<Info>/<FirstAidStep> 双标签里的内容
 * 必须与标签之间留空行，否则 markdown（列表/加粗）不渲染。
 *
 * 规则：组件开标签的下一行、闭标签的上一行，必须是空行或另一个标签。
 *
 * 用法：node scripts/check-markdown.mjs
 * 退出码：发现违规 = 1（CI 拦截）
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DOCS = join(ROOT, 'docs')
const TAGS = /(VetCheck|Warning|Danger|Info|FirstAidStep)/
const OPEN = /^<(VetCheck|Warning|Danger|Info|FirstAidStep)[^>]*>$/
const CLOSE = /^<\/(VetCheck|Warning|Danger|Info|FirstAidStep)>$/

function walkMd(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    const f = join(dir, e)
    if (statSync(f).isDirectory()) {
      if (e === '.vitepress' || e === 'public' || e === 'node_modules') continue
      walkMd(f, acc)
    } else if (e.endsWith('.md')) acc.push(f)
  }
  return acc
}

let violations = 0
for (const file of walkMd(DOCS)) {
  const lines = readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, i) => {
    if (OPEN.test(line)) {
      const next = lines[i + 1] ?? ''
      if (next.trim() !== '' && !next.startsWith('<')) {
        console.error(`✗ ${file}:${i + 2} 组件开标签后需空行 → ${next.slice(0, 50)}`)
        violations++
      }
    }
    if (CLOSE.test(line)) {
      const prev = lines[i - 1] ?? ''
      if (prev.trim() !== '' && !prev.startsWith('<') && !CLOSE.test(prev) && !prev.startsWith('---')) {
        console.error(`✗ ${file}:${i + 1} 组件闭标签前需空行 ← ${prev.slice(0, 50)}`)
        violations++
      }
    }
  })
}

if (violations > 0) {
  console.error(`\n共 ${violations} 处违规。修复：在组件标签与内容之间加空行。`)
  process.exit(1)
} else {
  console.log(`✓ ${walkMd(DOCS).length} 个 md 文件，组件 Markdown 间距全部合规`)
}
