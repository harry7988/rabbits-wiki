<script setup lang="ts">
/**
 * CopyMarkdownButton —— "复制本文 MD" 按钮（浮动样式）
 *
 * 设计：固定在内容区右上角的浮动小按钮
 * - 不占用内容流空间（之前放在 doc-before slot 顶部，显得突兀）
 * - 滚动时跟随，随时可点
 * - 鼠标悬停展开提示文字
 * - 移动端适配（缩小、贴边）
 *
 * 工作原理：
 * - 每个页面构建时已生成对应的 .md 镜像（/md/{path}.md）
 * - 按钮根据当前页面 URL 推算镜像路径
 * - fetch 镜像内容 → 复制到剪贴板
 */
import { ref, onMounted } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()
const status = ref<'idle' | 'copying' | 'done' | 'error'>('idle')

async function copyMd() {
  status.value = 'copying'
  try {
    const relPath = page.value.relativePath
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
    class="copy-md-fab"
    :class="`copy-md-fab-${status}`"
    @click="copyMd"
    :title="status === 'idle' ? '复制本文的纯净 Markdown（含来源，便于分享给 AI 工具）' : ''"
    aria-label="复制本文 Markdown"
  >
    <span class="fab-icon">
      <svg v-if="status === 'idle'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </svg>
      <svg v-else-if="status === 'copying'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      <svg v-else-if="status === 'done'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </span>
    <span class="fab-label">
      <template v-if="status === 'idle'">复制 MD</template>
      <template v-else-if="status === 'copying'">获取中</template>
      <template v-else-if="status === 'done'">已复制</template>
      <template v-else>失败</template>
    </span>
  </button>
</template>

<style scoped>
.copy-md-fab {
  position: fixed;
  top: 5.5rem;          /* 在导航栏下方 */
  right: 1.2rem;        /* 右侧贴边 */
  z-index: 100;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.7rem;
  border-radius: 999px;  /* 胶囊形 */
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(8px);
}
.copy-md-fab:hover {
  border-color: var(--rw-grass, #4a7c3f);
  color: var(--rw-grass, #4a7c3f);
  box-shadow: 0 4px 12px rgba(74, 124, 63, 0.15);
  transform: translateY(-1px);
}
.fab-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.fab-label {
  white-space: nowrap;
}

/* 状态：复制成功 */
.copy-md-fab-done {
  background: #1a7a3c;
  color: #fff !important;
  border-color: #1a7a3c;
}
.copy-md-fab-done:hover {
  background: #155e2e;
  color: #fff !important;
}

/* 状态：失败 */
.copy-md-fab-error {
  background: var(--rw-danger-soft, #fdecea);
  color: var(--rw-danger, #c0392b) !important;
  border-color: var(--rw-danger, #c0392b);
}

/* 窄屏（移动端）：缩小并贴边 */
@media (max-width: 768px) {
  .copy-md-fab {
    top: auto;
    bottom: 1.2rem;      /* 移动端放底部 */
    right: 1rem;
    padding: 0.5rem 0.8rem;
    font-size: 0.75rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
  .fab-label { display: none; }  /* 移动端只显示图标 */
  .copy-md-fab { padding: 0.6rem; }
}

/* 深色模式适配 */
:global(.dark) .copy-md-fab {
  background: rgba(30, 30, 32, 0.85);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
</style>
