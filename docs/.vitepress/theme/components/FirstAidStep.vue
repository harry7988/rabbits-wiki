<script setup lang="ts">
/**
 * FirstAidStep —— 急救流程步骤组件
 * 用法：
 * <FirstAidStep :num="1" title="保暖">
 *   将兔兔用毛巾包裹，避免失温...
 * </FirstAidStep>
 */
interface Props {
  num: number | string
  title?: string
}
defineProps<Props>()
</script>
<template>
  <div class="first-aid-step">
    <div class="step-num">{{ num }}</div>
    <div class="step-body">
      <p v-if="title" style="font-weight:700;margin:0 0 0.3rem 0;">{{ title }}</p>
      <slot />
    </div>
  </div>
</template>
