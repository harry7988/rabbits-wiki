<script setup lang="ts">
/**
 * CopyMarkdownButton —— 页面顶部"复制本文 MD"按钮
 *
 * 工作原理：
 * - 每个页面构建时已生成对应的 .md 镜像（/md/{path}.md）
 * - 按钮根据当前页面 URL 推算镜像路径
 * - fetch 镜像内容 → 复制到剪贴板
 *
 * 这让用户/AI 工具能一键获取本文的纯净 Markdown（含来源）
 */
import { ref } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()
const status = ref<'idle' | 'copying' | 'done' | 'error'>('idle')

async function copyMd() {
  status.value = 'copying'
  try {
    // 推算镜像 URL：当前页面 relativePath 是 'digest/anatomy.md' 形式
    const relPath = page.value.relativePath  // 如 'digest/anatomy.md' 或 'index.md'
    const mirrorUrl = `/md/${relPath}`

    const res = await fetch(mirrorUrl)
    if (!res.ok) throw new Error(`镜像不存在: ${mirrorUrl}`)
    const text = await res.text()

    await navigator.clipboard.writeText(text)
    status.value = 'done'
    setTimeout(() => { status.value = 'idle' }, 2200)
  } catch (e) {
    status.value = 'error'
    setTimeout(() => { status.value = 'idle' }, 3000)
    console.error('复制 MD 失败:', e)
  }
}
</script>

<template>
  <button
    class="copy-md-btn"
    :class="`copy-md-btn-${status}`"
    @click="copyMd"
    title="复制本文的纯净 Markdown（含来源，便于分享给 AI 工具）"
  >
    <span v-if="status === 'idle'">📋 复制本文 MD</span>
    <span v-else-if="status === 'copying'">⏳ 获取中...</span>
    <span v-else-if="status === 'done'">✅ 已复制到剪贴板</span>
    <span v-else>❌ 复制失败（请手动访问 /md/ 路径）</span>
  </button>
</template>

<style scoped>
.copy-md-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  border: 1px solid var(--rw-grass, #4a7c3f);
  background: var(--rw-grass-soft, #e8f0e3);
  color: var(--rw-grass, #4a7c3f);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  margin-bottom: 0.5rem;
}
.copy-md-btn:hover {
  background: var(--rw-grass, #4a7c3f);
  color: #fff;
}
.copy-md-btn-done {
  background: #1a7a3c;
  color: #fff;
  border-color: #1a7a3c;
}
.copy-md-btn-error {
  background: var(--rw-danger-soft, #fdecea);
  color: var(--rw-danger, #c0392b);
  border-color: var(--rw-danger, #c0392b);
}
</style>
