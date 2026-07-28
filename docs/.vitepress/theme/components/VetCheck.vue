<script setup lang="ts">
/**
 * VetCheck —— 红色警报组件：明确"何时必须立即就医"
 *
 * 本站严格遵守"不替代兽医诊断"原则。
 *
 * 用法：
 * <VetCheck title="立即就医信号">
 * - 连续 12 小时未进食
 * - 体温低于 38°C 或高于 40°C
 * </VetCheck>
 */
interface Props {
  title?: string
}
withDefaults(defineProps<Props>(), { title: '出现以下情况，请立即就医，不要在家拖延' })
</script>

<template>
  <div class="vet-check">
    <div class="vc-title">🚨 {{ title }}</div>
    <slot />
  </div>
</template>

<style scoped>
.vc-title {
  color: var(--rw-danger);
  font-size: 1.05rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.5rem;
}
/* slot 内列表样式（VitePress 渲染后是 .vp-doc 的 ul/li） */
.vet-check :deep(ul) { margin: 0.3rem 0 0 0; padding-left: 1.3rem; }
.vet-check :deep(li) { margin: 0.25rem 0; }
</style>
