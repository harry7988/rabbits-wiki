<script setup lang="ts">
/**
 * FAQItem —— 可折叠的问答组件
 *
 * 用法：
 * <FAQItem q="兔子可以喝水吗？">
 *   答案内容...支持 markdown
 * </FAQItem>
 *
 * 设计：默认折叠，点击展开。便于 FAQ 页面快速扫描。
 */
interface Props {
  q: string
  defaultOpen?: boolean
}
const props = withDefaults(defineProps<Props>(), { defaultOpen: false })

import { ref } from 'vue'
const open = ref(props.defaultOpen)
</script>

<template>
  <div class="faq-item" :class="{ 'is-open': open }">
    <button class="faq-q" @click="open = !open" :aria-expanded="open">
      <span class="faq-q-mark">{{ open ? '−' : '+' }}</span>
      <span class="faq-q-text">{{ q }}</span>
    </button>
    <div v-show="open" class="faq-a">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.faq-item {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin: 0.6rem 0;
  background: var(--vp-c-bg);
  overflow: hidden;
}
.faq-item.is-open {
  border-color: var(--rw-grass, #4a7c3f);
}
.faq-q {
  width: 100%;
  text-align: left;
  padding: 0.85rem 1.1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  font-family: inherit;
}
.faq-q:hover { color: var(--rw-grass, #4a7c3f); }
.faq-q-mark {
  flex-shrink: 0;
  width: 1.3rem; height: 1.3rem;
  border-radius: 50%;
  background: var(--rw-grass-soft, #e8f0e3);
  color: var(--rw-grass, #4a7c3f);
  display: inline-flex;
  align-items: center; justify-content: center;
  font-weight: 800;
  font-size: 1rem;
  line-height: 1;
}
.is-open .faq-q-mark {
  background: var(--rw-grass, #4a7c3f);
  color: var(--vp-c-white, #fff);
}
.faq-q-text { flex: 1; line-height: 1.5; }
.faq-a {
  padding: 0 1.1rem 1rem 3rem;
  font-size: 0.94rem;
  line-height: 1.75;
  color: var(--vp-c-text-1);
}
.faq-a :deep(p:first-child) { margin-top: 0; }
.faq-a :deep(p:last-child) { margin-bottom: 0; }
.faq-a :deep(ul), .faq-a :deep(ol) { padding-left: 1.3rem; }
</style>
