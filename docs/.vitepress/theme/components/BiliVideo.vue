<script setup lang="ts">
/**
 * BiliVideo —— B 站官方外链播放器嵌入（含署名）
 *
 * 使用 B 站官方提供的嵌入播放器（player.bilibili.com），合规外链。
 * 必须署名 UP 主与原链接（尊重知识产权）。
 *
 * 重要立场：视频为第三方内容，本站不担保其科学性——
 * 文字指南与兽医意见优先。
 *
 * 用法：
 * <BiliVideo bvid="BV1aD4y1972b" title="免抱版剪指甲" up="我家兔子已成精" />
 */
interface Props {
  bvid: string
  title: string
  up: string       // UP 主名（署名）
  note?: string    // 为什么推荐这条
}
const props = defineProps<Props>()
</script>

<template>
  <figure class="bili-video">
    <div class="bv-frame">
      <iframe
        :src="`//player.bilibili.com/player.html?bvid=${bvid}&page=1&autoplay=0&danmaku=0`"
        scrolling="no"
        frameborder="no"
        loading="lazy"
        allowfullscreen="true"
        :title="title"
      ></iframe>
    </div>
    <figcaption class="bv-caption">
      <span class="bv-note" v-if="note">{{ note }}</span>
      <span class="bv-source">
        来源：B 站 UP 主「{{ up }}」·
        <a :href="`https://www.bilibili.com/video/${bvid}/`" target="_blank" rel="noopener noreferrer">原视频</a>
      </span>
      <span class="bv-disclaimer">第三方视频仅供参考，操作以本页文字指南与兽医意见为准</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.bili-video {
  margin: 1.5rem 0;
}
.bv-frame {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 */
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  background: var(--rw-bg-card);
}
.bv-frame iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.bv-caption {
  margin-top: 0.55rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.bv-note {
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.bv-source a {
  color: var(--rw-grass);
  text-decoration: none;
}
.bv-source a:hover { text-decoration: underline; }
.bv-disclaimer {
  font-size: 0.74rem;
  color: var(--vp-c-text-3, var(--vp-c-text-2));
}
</style>
