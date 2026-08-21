<script setup lang="ts">
/**
 * PromptCard —— "给 AI 的共创指令"复制卡（slot 版）
 *
 * 指令文本放在 slot 里的 fenced code block（```...```），
 * 这样指令里的 <标签>、引号都不会被 Vue 解析（markdown-it
 * 阶段已转义成纯文本），复制时从渲染出的 DOM 提取。
 *
 * 用法（Markdown）：
 * <PromptCard title="..." scene="...">
 *
 * ```
 * 指令全文……可以包含 <SourceCard> 和 "引号"
 * ```
 *
 * </PromptCard>
 */
import { ref } from 'vue'

interface Props {
  title: string
  scene?: string
}
defineProps<Props>()

const wrap = ref<HTMLElement | null>(null)
const status = ref<'idle' | 'done' | 'error'>('idle')

async function copy() {
  try {
    const pre = wrap.value?.querySelector('pre')
    if (!pre) throw new Error('no pre')
    await navigator.clipboard.writeText(pre.textContent ?? '')
    status.value = 'done'
    setTimeout(() => (status.value = 'idle'), 2000)
  } catch {
    status.value = 'error'
    setTimeout(() => (status.value = 'idle'), 3000)
  }
}
</script>

<template>
  <div class="prompt-card">
    <div class="pc-head">
      <div class="pc-title">{{ title }}</div>
      <button class="pc-copy" :class="`pc-copy-${status}`" @click="copy">
        <span v-if="status === 'idle'">复制指令</span>
        <span v-else-if="status === 'done'">✓ 已复制</span>
        <span v-else>复制失败，请手动选择文本</span>
      </button>
    </div>
    <p v-if="scene" class="pc-scene">{{ scene }}</p>
    <div ref="wrap" class="pc-slot">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.prompt-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--rw-bg-card);
  margin: 1.3rem 0;
  padding-bottom: 0.4rem;
  overflow: hidden;
}
.pc-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 1.1rem 0;
}
.pc-title {
  font-weight: 700;
  font-size: 1rem;
  color: var(--vp-c-text-1);
}
.pc-copy {
  flex-shrink: 0;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: inherit;
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  border: 1px solid var(--rw-grass);
  background: var(--rw-grass);
  color: var(--rw-ink-text);
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.pc-copy:hover { background: var(--rw-ink-hover); border-color: var(--rw-ink-hover); }
.pc-copy:focus-visible {
  outline: 2px solid var(--rw-grass);
  outline-offset: 2px;
}
:global(.dark) .pc-copy {
  background: #a3d493;
  border-color: #a3d493;
  color: #16200f;
}
:global(.dark) .pc-copy:hover { background: #b3dda4; }
.pc-copy-done { background: #1a7a3c; border-color: #1a7a3c; color: #fff; }
.pc-copy-error { background: var(--rw-danger-soft); border-color: var(--rw-danger); color: var(--rw-danger); }
.pc-scene {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin: 0.35rem 1.1rem 0;
  line-height: 1.6;
}
/* slot 里的代码块样式接管：去掉 VitePress 默认 code 背景，贴合卡片 */
.pc-slot :deep(div[class*='language-']) {
  margin: 0.8rem 1.1rem 0.6rem;
  border-radius: 8px;
  background: var(--rw-hover-bg);
}
.pc-slot :deep(pre) {
  background: transparent;
  max-height: 22rem;
  overflow-y: auto;
  font-size: 0.82rem;
  line-height: 1.7;
}
.pc-slot :deep(code) {
  color: var(--vp-c-text-1);
  font-size: 0.82rem;
}
</style>
