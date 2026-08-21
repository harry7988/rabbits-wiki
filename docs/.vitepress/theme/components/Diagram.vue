<script setup lang="ts">
/**
 * Diagram —— 原创示意图（自动深浅模式 + 出处署名）
 *
 * 图片放 /diagrams/xxx.svg + xxx-dark.svg。
 * 依据来源在 caption 里标注（版权意识：自绘 + 依据说明）。
 *
 * 用法：
 * <Diagram src="/diagrams/rabbit-digestive-side" alt="兔子消化系统侧视图"
 *          caption="消化道全路径示意" basis="依据 Varga (2013)、Oglesbee (2020) 绘制" />
 */
import { useData } from 'vitepress'

interface Props {
  src: string      // 不含 -dark 后缀和 .svg
  alt: string
  caption?: string
  basis?: string   // 绘制依据（学术诚实）
  width?: string
}
const props = defineProps<Props>()
const { isDark } = useData()
</script>

<template>
  <figure class="rw-diagram">
    <img
      :src="isDark ? `${src}-dark.svg` : `${src}.svg`"
      :alt="alt"
      :width="width || '100%'"
      loading="lazy"
    >
    <figcaption v-if="caption || basis">
      <span v-if="caption" class="dg-caption">{{ caption }}</span>
      <span v-if="basis" class="dg-basis">{{ basis }}</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.rw-diagram {
  margin: 1.6rem 0;
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--rw-bg-card);
  overflow-x: auto;
}
.rw-diagram img {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 0 auto;
}
figcaption {
  margin-top: 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  text-align: center;
}
.dg-caption {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.dg-basis {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
}
</style>
