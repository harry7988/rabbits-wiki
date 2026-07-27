<script setup lang="ts">
interface Props { title?: string }
withDefaults(defineProps<Props>(), { title: '危险' })
</script>
<template>
  <div class="rw-alert danger">
    <span class="rw-alert-icon">🛑</span>
    <div>
      <div class="rw-alert-title">{{ title }}</div>
      <slot />
    </div>
  </div>
</template>
