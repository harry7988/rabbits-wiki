<script setup lang="ts">
/**
 * HomeHero —— 自定义首页 Hero（替代 VitePress 默认居中式）
 *
 * 设计意图：
 * - 左对齐大标题（打破默认居中的模板感）
 * - 一句话价值主张（不是主题词罗列）
 * - 双 CTA：工具箱（主）+ 急症速查（急，红）
 * - 紧急热线常驻条：12 小时红线是本站最重要的单一事实
 */
</script>

<template>
  <section class="home-hero">
    <div class="home-hero-inner">
      <div class="hero-eyebrow">
        <span class="eyebrow-mark"></span>
        由社区共创 · 每条结论可溯源到权威兽医来源
      </div>

      <h1 class="hero-title">
        兔子生病<b>不会等你</b><br />查证好了再来
      </h1>

      <p class="hero-sub">
        品种、消化原理、急症处置、日常养育、兔粮成分——全部标注权威来源的兔子百科，
        加上 8 个实用工具。急症时帮你快速判断，日常时帮你科学养育。
      </p>

      <div class="hero-ctas">
        <a href="/tools/" class="cta cta-primary">
          打开养兔工具箱
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
        <a href="/emergencies/" class="cta cta-danger">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          急症处置速查
        </a>
      </div>

      <div class="hero-stat-strip">
        <div class="stat">
          <span class="stat-num">65<span class="stat-unit">页</span></span>
          <span class="stat-label">科普内容</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-num">150<span class="stat-unit">+</span></span>
          <span class="stat-label">权威来源引用</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-num">8<span class="stat-unit">个</span></span>
          <span class="stat-label">交互工具</span>
        </div>
      </div>
    </div>

    <!-- 右侧：紧急红线卡（不对称布局的视觉锚点） -->
    <aside class="hero-emergency">
      <div class="em-card">
        <div class="em-head">
          <span class="em-pulse"></span>
          养兔人必须记住的红线
        </div>
        <div class="em-main">
          停止进食或排便达 <b>12 小时</b><br />
          就是急症，立即就医
        </div>
        <p class="em-note">兔子会本能隐藏病情。等你看到明显症状，往往已经很重。</p>
        <a href="/emergencies/gi-stasis" class="em-link">看胃肠停滞处置 →</a>
      </div>
    </aside>
  </section>
</template>

<style scoped>
.home-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 3rem;
  align-items: center;
  max-width: 1152px;
  margin: 0 auto;
  padding: 4.5rem 1.5rem 3.5rem;
}
@media (max-width: 960px) {
  .home-hero { grid-template-columns: 1fr; padding-top: 3rem; gap: 2rem; }
  .hero-emergency { order: -1; }
}

/* eyebrow —— 全站只此一处（克制） */
.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  margin-bottom: 1.4rem;
}
.eyebrow-mark {
  width: 7px; height: 7px;
  border-radius: 999px;
  background: var(--rw-grass);
}

/* 标题：超粗 + 关键词标色，两行 */
.hero-title {
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.18;
  margin: 0 0 1.1rem;
  color: var(--vp-c-text-1);
}
.hero-title b {
  color: var(--rw-grass);
  font-weight: 800;
}

/* 副标题 */
.hero-sub {
  font-size: 1.02rem;
  line-height: 1.85;
  color: var(--vp-c-text-2);
  max-width: 34em;
  margin: 0 0 1.8rem;
}

/* CTA */
.hero-ctas { display: flex; gap: 0.7rem; flex-wrap: wrap; margin-bottom: 2.2rem; }
.cta {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.72rem 1.35rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.cta:active { transform: translateY(1px); }
.cta-primary {
  background: var(--rw-grass);
  color: #fff;
  box-shadow: 0 4px 14px -4px var(--rw-grass-shadow);
}
.cta-primary:hover { box-shadow: 0 6px 20px -4px var(--rw-grass-shadow); }
.cta-danger {
  background: var(--rw-danger-soft);
  color: var(--rw-danger);
  border: 1px solid var(--rw-danger-border);
}
.cta-danger:hover { background: var(--rw-danger); color: #fff; }

/* 数据条 */
.hero-stat-strip {
  display: flex;
  align-items: center;
  gap: 1.6rem;
}
.stat { display: flex; flex-direction: column; gap: 0.1rem; }
.stat-num {
  font-size: 1.55rem;
  font-weight: 800;
  color: var(--vp-c-text-1);
  line-height: 1.1;
}
.stat-unit { font-size: 0.85rem; font-weight: 600; margin-left: 1px; color: var(--vp-c-text-2); }
.stat-label { font-size: 0.78rem; color: var(--vp-c-text-2); }
.stat-divider { width: 1px; height: 34px; background: var(--vp-c-divider); }

/* 紧急红线卡 */
.hero-emergency { display: flex; }
.em-card {
  position: relative;
  flex: 1;
  background: var(--rw-bg-card);
  border: 1px solid var(--rw-danger-border);
  border-radius: 14px;
  padding: 1.5rem 1.4rem 1.3rem;
  overflow: hidden;
}
.em-card::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 3px;
  background: var(--rw-danger);
}
.em-head {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--rw-danger);
  margin-bottom: 0.85rem;
}
.em-pulse {
  width: 8px; height: 8px;
  border-radius: 999px;
  background: var(--rw-danger);
  animation: emPulse 2.2s ease-in-out infinite;
}
@keyframes emPulse {
  0%, 100% { box-shadow: 0 0 0 0 var(--rw-danger-glow); }
  50% { box-shadow: 0 0 0 6px transparent; }
}
@media (prefers-reduced-motion: reduce) {
  .em-pulse { animation: none; }
}
.em-main {
  font-size: 1.18rem;
  font-weight: 700;
  line-height: 1.55;
  color: var(--vp-c-text-1);
}
.em-main b { color: var(--rw-danger); }
.em-note {
  font-size: 0.84rem;
  line-height: 1.65;
  color: var(--vp-c-text-2);
  margin: 0.7rem 0 0.9rem;
}
.em-link {
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--rw-danger);
  text-decoration: none;
}
.em-link:hover { text-decoration: underline; }
</style>
