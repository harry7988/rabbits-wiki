<script setup lang="ts">
/**
 * HomeHero —— 首页 Hero（编辑部风格）
 *
 * 设计原则：
 * - 排版承担设计感，不靠盒子装饰
 * - 按钮：墨绿深底 / 细描边，无阴影、无大圆角
 * - 无脉冲动画、无标签堆
 * - 右侧红线卡：一条红竖线 + 好的排版，不用渐变和发光
 */
</script>

<template>
  <section class="home-hero">
    <div class="home-hero-main">
      <p class="hero-kicker">由社区共创 · 每条结论可溯源到权威兽医来源</p>

      <h1 class="hero-title">科学养兔，<br class="title-br" />有据可查</h1>

      <p class="hero-sub">
        品种、消化原理、急症处置、日常养育、兔粮成分——每一页都标注来源的兔子百科，
        加上 8 个实用工具。
      </p>

      <div class="hero-actions">
        <a href="/tools/" class="btn btn-solid">打开工具箱</a>
        <a href="/emergencies/" class="btn btn-quiet">
          急症速查
          <span class="btn-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </div>

    <aside class="hero-redline">
      <p class="redline-label">养兔人记住这条红线</p>
      <p class="redline-text">
        停止进食或排便达 <em>12 小时</em>，就是急症——立即就医，不要观望。
      </p>
      <p class="redline-note">兔子会本能隐藏病情，等你发现往往已经不轻。</p>
      <a href="/emergencies/gi-stasis" class="redline-link">看胃肠停滞的处置</a>
    </aside>
  </section>
</template>

<style scoped>
.home-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 4rem;
  align-items: center;
  max-width: 1080px;
  margin: 0 auto;
  padding: 4.5rem 1.5rem 4rem;
}
@media (max-width: 960px) {
  .home-hero { grid-template-columns: 1fr; gap: 2.4rem; padding-top: 3rem; }
}

/* kicker：小字距排一行，不是 eyebrow 胶囊 */
.hero-kicker {
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  letter-spacing: 0.04em;
  margin: 0 0 1.6rem;
}

/* 标题：靠字重和字号，两行 */
.hero-title {
  font-size: clamp(2.4rem, 5.5vw, 3.6rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin: 0 0 1.3rem;
  color: var(--vp-c-text-1);
}
.title-br { display: none; }
@media (min-width: 640px) { .title-br { display: block; } }

/* 副标题 */
.hero-sub {
  font-size: 1.02rem;
  line-height: 1.9;
  color: var(--vp-c-text-2);
  max-width: 33em;
  margin: 0 0 2.2rem;
}

/* 按钮：编辑部式，无阴影 */
.hero-actions { display: flex; align-items: center; gap: 1.4rem; flex-wrap: wrap; }
.btn {
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  padding: 0.68rem 1.5rem;
  border-radius: 6px;
  transition: background-color 0.18s ease, color 0.18s ease, border-color 0.18s ease;
}
.btn-solid {
  background: var(--rw-ink);
  color: #fff;
}
.btn-solid:hover { background: var(--rw-ink-hover); }
.btn-quiet {
  color: var(--vp-c-text-1);
  padding-left: 0;
  padding-right: 0.2rem;
}
.btn-quiet:hover { color: var(--rw-danger); }
.btn-arrow {
  display: inline-block;
  margin-left: 0.35rem;
  transition: transform 0.18s ease;
}
.btn-quiet:hover .btn-arrow { transform: translateX(3px); }

/* 红线卡：一条红竖线 + 排版 */
.hero-redline {
  border-left: 2px solid var(--rw-danger);
  padding: 0.4rem 0 0.4rem 1.4rem;
}
.redline-label {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--rw-danger);
  margin: 0 0 0.7rem;
}
.redline-text {
  font-size: 1.14rem;
  font-weight: 650;
  line-height: 1.7;
  color: var(--vp-c-text-1);
  margin: 0 0 0.6rem;
}
.redline-text em {
  font-style: normal;
  color: var(--rw-danger);
  font-weight: 750;
}
.redline-note {
  font-size: 0.85rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  margin: 0 0 0.8rem;
}
.redline-link {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-decoration: none;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 2px;
}
.redline-link:hover { color: var(--rw-danger); border-color: currentColor; }
</style>
