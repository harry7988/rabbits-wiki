<script setup lang="ts">
/**
 * HomeLayout —— 完全自定义的首页布局
 * 替代 VitePress 默认的 home layout（默认居中 hero + 等大卡网格）
 */
import HomeHero from './HomeHero.vue'
import HomeSections from './HomeSections.vue'
</script>

<template>
  <div class="home-layout">
    <HomeHero />
    <HomeSections />

    <section class="home-why">
      <div class="why-inner">
        <h2>为什么有 rabbits.wiki</h2>
        <p>
          兔兔是会<b>隐藏疼痛</b>的动物，病情进展极快——一顿没吃好可能就是致命急症的开端。
          市面上的养兔信息鱼龙混杂，很多“经验”以讹传讹（给兔用猫化毛膏、相信“茶杯兔”、兔子只吃胡萝卜）。
        </p>
        <p class="why-core">
          我们想做的是：<b>把每一条建议都溯源到权威兽医来源</b>，让每一个兔主人都看得懂、信得过、用得上。
        </p>
        <div class="why-footer">
          <a href="https://github.com/harry7988/rabbits-wiki">在 GitHub 共创</a> ·
          <a href="/about">关于我们</a> ·
          <a href="/sources/">全站来源索引</a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-why {
  padding: 3.5rem 1.5rem 4.5rem;
  border-top: 1px solid var(--vp-c-divider);
}
.why-inner {
  max-width: 720px;
  margin: 0 auto;
}
.why-inner h2 {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 0 0 1rem;
  color: var(--vp-c-text-1);
}
.why-inner p {
  font-size: 0.98rem;
  line-height: 1.9;
  color: var(--vp-c-text-2);
  margin: 0 0 0.9rem;
}
.why-inner p b { color: var(--vp-c-text-1); }
.why-core.why-core {
  padding: 1rem 1.2rem;
  border-left: 3px solid var(--rw-grass);
  border-radius: 0 8px 8px 0;
  background: var(--rw-grass-soft);
  color: var(--vp-c-text-1);
}
.why-footer {
  font-size: 0.84rem;
  color: var(--vp-c-text-3, var(--vp-c-text-2));
}
.why-footer a { color: var(--rw-grass); text-decoration: none; }
.why-footer a:hover { text-decoration: underline; }
</style>
