<script setup lang="ts">
interface Props { title?: string }
withDefaults(defineProps<Props>(), { title: '提示' })
</script>
<template>
  <div class="rw-alert info">
    <span class="rw-alert-icon">💡</span>
    <div>
      <div class="rw-alert-title">{{ title }}</div>
      <slot />
    </div>
  </div>
</template>
