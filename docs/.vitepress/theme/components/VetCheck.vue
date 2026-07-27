<script setup lang="ts">
/**
 * VetCheck —— 红色警报组件：明确"何时必须立即送医"
 *
 * 本站严格遵守"不替代兽医诊断"原则。所有急症文档中，必须用此组件
 * 明确列出"出现这些信号 = 不要在家拖延 = 立即就医"。
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
