<script setup lang="ts">
/**
 * PromptCard —— "给 AI 的共创指令"复制卡（slot 版，仓库地址动态）
 *
 * - 指令文本放 slot 里的 fenced code block（```...```），
 *   指令里的 <标签>、引号不会被 Vue 解析
 * - 仓库地址不写死：运行时从主题配置的 GitHub 图标（右上角）
 *   动态读取，复制/显示时自动替换占位符：
 *     {{REPO_URL}}  → 完整地址（https://github.com/user/repo）
 *     {{REPO_NAME}} → user/repo
 *   这样换仓库只需改 config.ts 一处，右上角和所有指令同步变。
 * - 未配置 GitHub 时提示用户手动填。
 */
import { ref, computed } from 'vue'
import { useData } from 'vitepress'

interface Props {
  title: string
  scene?: string
}
const props = defineProps<Props>()

const { theme } = useData()

const repoUrl = computed(() => {
  const gh = theme.value.socialLinks?.find((s: any) => s.icon === 'github')
  return (gh?.link as string) || ''
})
const repoName = computed(() => {
  const m = repoUrl.value.match(/github\.com\/([^/]+\/[^/]+)/)
  return m ? m[1].replace(/\.git$/, '') : ''
})

function fill(text: string): string {
  return text
    .replace(/\{\{REPO_URL\}\}/g, repoUrl.value || '【先点本站右上角 GitHub 图标确认仓库地址，粘贴在这里】')
    .replace(/\{\{REPO_NAME\}\}/g, repoName.value || '【右上角 GitHub 图标里的 仓库所有者/仓库名】')
}

const wrap = ref<HTMLElement | null>(null)
const status = ref<'idle' | 'done' | 'error'>('idle')

async function copy() {
  try {
    const pre = wrap.value?.querySelector('pre')
    if (!pre) throw new Error('no pre')
    await navigator.clipboard.writeText(fill(pre.textContent ?? ''))
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
    <p v-if="repoUrl" class="pc-repo">
      仓库地址会自动填入：<code>{{ repoUrl }}</code>
    </p>
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
.pc-repo {
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
  margin: 0.35rem 1.1rem 0;
}
.pc-repo code {
  font-size: 0.78rem;
  color: var(--rw-grass);
  background: var(--rw-grass-soft);
  padding: 0.05rem 0.35rem;
  border-radius: 4px;
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
