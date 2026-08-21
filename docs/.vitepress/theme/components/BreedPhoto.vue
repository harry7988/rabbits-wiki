<script setup lang="ts">
/**
 * BreedPhoto —— 品种照片（Wikimedia Commons 自托管副本 + 完整署名）
 *
 * 图片由 scripts/fetch-breed-images.sh 从 Commons 拉取到 /breeds/ 自托管
 * （upload.wikimedia.org 在部分地区不可达，直链会破图）。
 * 许可合规：作者 + 许可名（链接）+ 原文件页链接；详见 docs/public/breeds/credits.json。
 *
 * 用法：
 * <BreedPhoto src="/breeds/holland-lop.jpg" alt="一只成年荷兰垂耳兔…"
 *   artist="Harold Cecchetti" license="CC BY-SA 4.0"
 *   licenseUrl="https://creativecommons.org/licenses/by-sa/4.0"
 *   filePage="https://commons.wikimedia.org/wiki/File:Holland_lop_rabbit.jpg" />
 */
interface Props {
  src: string
  alt: string
  artist: string
  license: string
  licenseUrl?: string
  filePage: string
  caption?: string
  width?: number
  height?: number
}
withDefaults(defineProps<Props>(), {
  licenseUrl: '',
  caption: '',
  width: 800,
  height: 600,
})
</script>

<template>
  <figure class="rw-photo">
    <img
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      loading="lazy"
      decoding="async"
    >
    <figcaption>
      <span v-if="caption" class="ph-caption">{{ caption }}</span>
      <span class="ph-credit">
        图：{{ artist }} ·
        <a v-if="licenseUrl" :href="licenseUrl" target="_blank" rel="noopener">{{ license }}</a>
        <template v-else>{{ license }}</template>
        · 经 <a :href="filePage" target="_blank" rel="noopener">Wikimedia Commons</a>
      </span>
    </figcaption>
  </figure>
</template>

<style scoped>
.rw-photo {
  margin: 1.6rem auto;
  max-width: 540px;
}
.rw-photo img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}
figcaption {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  text-align: center;
}
.ph-caption {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.ph-credit {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
}
.ph-credit a {
  color: var(--vp-c-text-2);
  text-decoration: underline dotted;
  text-underline-offset: 2px;
}
.ph-credit a:hover {
  color: var(--vp-c-text-1);
}
</style>
