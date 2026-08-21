<script setup lang="ts">
/**
 * DualVideo —— 双源视频（B 站 / YouTube 切换，方案 A）
 *
 * 背景：B 站官方外链播放器对代理/海外用户不友好；
 * YouTube 对大陆直连不友好。不猜用户在哪——
 * 默认 B 站（站内已有），提供一键切 YouTube（懒加载，
 * 点击才加载 iframe）。
 *
 * 用法：
 * <DualVideo
 *   bvid="BV..." :btitle="..." bup="UP主"
 *   ytid="YouTube视频ID" :yt-title="..." yt-channel="频道"
 *   note="为什么推荐这条" />
 * 无 YouTube 源时省略 ytid，退化为纯 B 站卡。
 */
import { ref } from 'vue'

interface Props {
  bvid: string
  btitle: string
  bup: string
  ytid?: string
  ytTitle?: string
  ytChannel?: string
  note?: string
}
const props = defineProps<Props>()

const source = ref<'bili' | 'yt'>('bili')
const ytLoaded = ref(false)   // 懒加载：切到 YT 才挂 iframe
function switchTo(s: 'bili' | 'yt') {
  source.value = s
  if (s === 'yt') ytLoaded.value = true
}
</script>

<template>
  <figure class="dual-video">
    <div class="dv-tabs" role="tablist" v-if="ytid">
      <button
        role="tab" :aria-selected="source === 'bili'"
        class="dv-tab" :class="{ active: source === 'bili' }"
        @click="switchTo('bili')"
      >B 站</button>
      <button
        role="tab" :aria-selected="source === 'yt'"
        class="dv-tab" :class="{ active: source === 'yt' }"
        @click="switchTo('yt')"
      >YouTube</button>
      <span class="dv-hint">海外/代理用户建议切 YouTube</span>
    </div>

    <div class="dv-frame">
      <iframe
        v-if="source === 'bili'"
        :src="`//player.bilibili.com/player.html?bvid=${bvid}&page=1&autoplay=0&danmaku=0`"
        scrolling="no" frameborder="no" loading="lazy"
        allowfullscreen="true" :title="btitle"
      ></iframe>
      <iframe
        v-else-if="ytLoaded"
        :src="`https://www.youtube-nocookie.com/embed/${ytid}?rel=0`"
        frameborder="no" loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen="true" :title="ytTitle || 'YouTube video'"
      ></iframe>
    </div>

    <figcaption class="dv-caption">
      <span class="dv-note" v-if="note">{{ note }}</span>
      <span class="dv-source" v-if="source === 'bili'">
        来源：B 站 UP 主「{{ bup }}」·
        <a :href="`https://www.bilibili.com/video/${bvid}/`" target="_blank" rel="noopener noreferrer">原视频</a>
      </span>
      <span class="dv-source" v-else-if="ytid">
        来源：YouTube{{ ytChannel ? `「${ytChannel}」` : '' }} ·
        <a :href="`https://www.youtube.com/watch?v=${ytid}`" target="_blank" rel="noopener noreferrer">原视频</a>
      </span>
      <span class="dv-disclaimer">第三方视频仅供参考，操作以本页文字指南与兽医意见为准</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.dual-video { margin: 1.5rem 0; }
.dv-tabs {
  display: flex; align-items: center; gap: 0.4rem;
  margin-bottom: 0.55rem;
}
.dv-tab {
  font-size: 0.8rem; font-weight: 600; font-family: inherit;
  padding: 0.32rem 0.85rem; border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  background: var(--rw-bg-card); color: var(--vp-c-text-2);
  cursor: pointer; transition: all 0.15s ease;
}
.dv-tab.active {
  background: var(--rw-grass); color: var(--rw-ink-text);
  border-color: var(--rw-grass);
}
:global(.dark) .dv-tab.active {
  background: #a3d493; color: #16200f; border-color: #a3d493;
}
.dv-tab:focus-visible { outline: 2px solid var(--rw-grass); outline-offset: 2px; }
.dv-hint {
  font-size: 0.72rem; color: var(--vp-c-text-3, var(--vp-c-text-2));
  margin-left: 0.3rem;
}
.dv-frame {
  position: relative; width: 100%; padding-top: 56.25%;
  border-radius: 12px; overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  background: var(--rw-bg-card);
}
.dv-frame iframe {
  position: absolute; inset: 0; width: 100%; height: 100%;
}
.dv-caption {
  margin-top: 0.55rem; font-size: 0.8rem; color: var(--vp-c-text-2);
  display: flex; flex-direction: column; gap: 0.15rem;
}
.dv-note { font-weight: 600; color: var(--vp-c-text-1); }
.dv-source a { color: var(--rw-grass); text-decoration: none; }
.dv-source a:hover { text-decoration: underline; }
.dv-disclaimer { font-size: 0.74rem; color: var(--vp-c-text-3, var(--vp-c-text-2)); }
</style>
