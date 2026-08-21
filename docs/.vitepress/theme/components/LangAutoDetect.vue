<script setup lang="ts">
/**
 * LangAutoDetect —— 浏览器语言自动选择
 *
 * 只挂在中文首页（/）：第一次访问且浏览器语言是英语时跳 /en/。
 * 用 cookie 记录已选择，避免来回跳；用户手动切换语言后不再干预。
 */
import { onMounted } from 'vue'

onMounted(() => {
  try {
    if (location.pathname !== '/') return
    if (document.cookie.includes('rw-lang=')) return
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language || '']
    const isEn = langs.some((l) => /^en(-|$)/i.test(l))
    if (isEn) {
      document.cookie = 'rw-lang=en; path=/; max-age=31536000; SameSite=Lax'
      location.replace('/en/')
    }
  } catch {}
})
</script>

<template><span hidden aria-hidden="true"></span></template>
