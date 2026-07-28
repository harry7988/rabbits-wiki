<script setup lang="ts">
/**
 * MarkdownRenderer —— 在 Vue 组件 slot 中渲染 Markdown
 *
 * 背景：VitePress 默认只处理 .md 文件顶层的 Markdown，
 * <VetCheck>/<Warning> 等组件双标签里写的 Markdown 会被当纯文本显示。
 *
 * 本组件用 VitePress 暴露的 markdown-it 实例，把 slot 原始内容转 HTML。
 *
 * 用法（替代 <slot />）：
 *   <MarkdownRenderer />
 *
 * 注意：slot 内容中的 HTML（如 <a>、<cite>）会被 markdown-it 保留（html: true）。
 */
import { useSlots, computed, type VNode } from 'vue'

const slots = useSlots()
const props = defineProps<{ class?: string }>()

// 从 slot 的 VNode 提取原始文本
function extractRawText(vnodes: VNode[] | undefined): string {
  if (!vnodes) return ''
  let text = ''
  for (const vnode of vnodes) {
    if (typeof vnode.children === 'string') {
      text += vnode.children
    } else if (Array.isArray(vnode.children)) {
      text += extractRawText(vnode.children as VNode[])
    } else if (typeof vnode === 'string') {
      text += vnode
    }
  }
  return text
}

const renderedHtml = computed(() => {
  const raw = extractRawText(slots.default?.())
  if (!raw.trim()) return ''
  // 动态导入 markdown-it（避免 SSR 时机问题）
  return renderMd(raw)
})

// 用 vitepress 内置的 markdown-it（保证与正文渲染规则一致）
let mdInstance: any = null
function renderMd(src: string): string {
  if (!mdInstance) {
    try {
      // vitepress 运行时暴露的 md 实例（仅在客户端）
      // @ts-ignore
      mdInstance = (typeof window !== 'undefined' && (window as any).__VITEPRESS_MD__) || null
    } catch {}
  }
  if (mdInstance) return mdInstance.render(src)
  // 回退：基本 markdown 处理（不依赖 vitepress）
  return fallbackRender(src)
}

// 轻量回退渲染器（当 vitepress md 实例不可用时）
function fallbackRender(src: string): string {
  const lines = src.split('\n')
  const html: string[] = []
  let inList = false
  for (let line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      if (inList) { html.push('</ul>'); inList = false }
      continue
    }
    // 列表项
    const liMatch = trimmed.match(/^[-*+]\s+(.*)$/)
    if (liMatch) {
      if (!inList) { html.push('<ul>'); inList = true }
      html.push(`<li>${inlineMd(liMatch[1])}</li>`)
      continue
    }
    if (inList) { html.push('</ul>'); inList = false }
    // 段落
    html.push(`<p>${inlineMd(trimmed)}</p>`)
  }
  if (inList) html.push('</ul>')
  return html.join('\n')
}

// 行内 markdown：加粗、链接、行内代码
function inlineMd(s: string): string {
  // 先转义 HTML 特殊字符（保留我们已知安全的标签）
  // **bold**
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  // *italic*
  s = s.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
  // `code`
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>')
  return s
}
</script>

<template>
  <div :class="props.class" v-html="renderedHtml"></div>
</template>
