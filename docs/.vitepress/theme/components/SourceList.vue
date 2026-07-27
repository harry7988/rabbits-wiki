<script setup lang="ts">
/**
 * SourceList —— 文末"引用与致谢"区容器
 * 用法（Markdown 内）：
 *
 * <SourceList title="引用来源">
 *
 * <SourceCard ... />
 * <SourceCard ... />
 *
 * </SourceList>
 *
 * 每篇文档必须在文末调用此组件，列出本页所有引用来源。
 */
interface Props {
  title?: string
}
withDefaults(defineProps<Props>(), { title: '引用与来源' })
</script>

<template>
  <div class="source-list">
    <h2>📚 {{ title }}</h2>
    <p style="font-size:0.86rem;color:var(--vp-c-text-2);margin-bottom:1rem;">
      本页所有结论的可溯源来源如下。来源按可信度分级：
      <span class="src-badge vet">🟢 兽医权威</span>
      <span class="src-badge org">🟡 专业组织</span>
      <span class="src-badge exp">🟠 饲主经验</span>。
      如发现来源失效或结论存疑，欢迎<a href="https://github.com/rabbits-wiki/rabbits.wiki/issues" target="_blank" rel="noopener">提 Issue 纠错</a>。
    </p>
    <slot />
  </div>
</template>
