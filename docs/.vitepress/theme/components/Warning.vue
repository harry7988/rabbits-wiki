<script setup lang="ts">
interface Props { title?: string }
withDefaults(defineProps<Props>(), { title: '注意' })
</script>
<template>
  <div class="rw-alert warn">
    <span class="rw-alert-icon">⚠️</span>
    <div>
      <div class="rw-alert-title">{{ title }}</div>
      <slot />
    </div>
  </div>
</template>
