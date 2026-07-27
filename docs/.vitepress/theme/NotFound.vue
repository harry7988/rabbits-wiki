<script setup lang="ts">
import { useData } from 'vitepress'
const { theme } = useData()
</script>

<template>
  <div class="not-found">
    <div class="nf-code">404 🐇</div>
    <h1 class="nf-title">这页像兔兔一样跳走了</h1>
    <p class="nf-desc">
      你访问的页面不存在，可能被重命名或移动了。
    </p>
    <div class="nf-actions">
      <a href="/" class="nf-btn nf-btn-primary">🏠 回首页</a>
      <a href="/tools/" class="nf-btn">🧰 用急救工具</a>
      <a href="/emergencies/" class="nf-btn">🚨 急症速查</a>
    </div>
    <div class="nf-search-hint">
      或用顶部搜索框查找内容
    </div>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 4rem 1.5rem;
  max-width: 640px;
  margin: 0 auto;
}
.nf-code {
  font-size: 4rem;
  font-weight: 800;
  color: var(--rw-grass, #4a7c3f);
  margin-bottom: 1rem;
}
.nf-title {
  font-size: 1.6rem;
  margin: 1rem 0 0.5rem;
}
.nf-desc {
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}
.nf-actions {
  display: flex;
  gap: 0.7rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}
.nf-btn {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  text-decoration: none;
  color: var(--vp-c-text-1);
  font-weight: 600;
}
.nf-btn-primary {
  background: var(--rw-grass, #4a7c3f);
  color: #fff;
  border-color: var(--rw-grass, #4a7c3f);
}
.nf-search-hint {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}
</style>
