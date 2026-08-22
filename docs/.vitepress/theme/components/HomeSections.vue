<script setup lang="ts">
/**
 * HomeSections —— 编辑式目录（替代卡片网格）
 *
 * 设计原则：
 * - 分割线组织内容，不是盒子（无 border 卡片、无阴影、无悬浮）
 * - 大区：主题名（大字）+ 一句话 + 内容列表（行式，hover 微背景 + 箭头）
 * - 两栏：急症 / 工具；养育区四条列表
 * - 排版层级：主题字重和字号对比，不是颜色堆砌
 */
</script>

<template>
  <section class="home-entries">
    <div class="entries-inner">

      <!-- 两大主题：急症 + 工具 -->
      <div class="lead-grid">
        <div class="lead lead-emergency">
          <h2 class="lead-title"><a href="/emergencies/">急症处置</a></h2>
          <p class="lead-desc">兔子病了怎么判断、送医前能做什么。每一种急症都写清红色警报信号。</p>
          <ul class="lead-list">
            <li><a href="/emergencies/gi-stasis">胃肠停滞（不吃不拉）</a></li>
            <li><a href="/emergencies/heatstroke">中暑</a></li>
            <li><a href="/emergencies/diarrhea">腹泻</a></li>
            <li><a href="/emergencies/poisoning">中毒与误食</a></li>
          </ul>
        </div>

        <div class="lead">
          <h2 class="lead-title"><a href="/tools/">养兔工具箱</a></h2>
          <p class="lead-desc">打开即用的交互工具，判断紧急度、算剂量、查植物安全性。</p>
          <ul class="lead-list">
            <li><a href="/tools/">症状决策树：我家兔怎么了</a></li>
            <li><a href="/tools/">兔粮成分分析器</a></li>
            <li><a href="/tools/">每日喂食量计算</a></li>
            <li><a href="/tools/">有毒植物查询</a></li>
          </ul>
        </div>
      </div>

      <!-- 其余主题：编辑式两列列表 -->
      <div class="topic-grid">
        <nav class="topic">
          <h3 class="topic-name"><a href="/care/">日常养育</a></h3>
          <ul class="topic-list">
            <li><a href="/care/spay-neuter">绝育（防子宫癌）</a></li>
            <li><a href="/care/dental">牙齿健康：吃草 = 磨牙</a></li>
            <li><a href="/care/new-rabbit-checklist">新兔准备清单</a></li>
            <li><a href="/care/baby-rabbit">幼兔养育</a></li>
            <li><a href="/care/behavior">行为解读</a></li>
          </ul>
        </nav>

        <nav class="topic">
          <h3 class="topic-name"><a href="/handling/">操作技能</a></h3>
          <ul class="topic-list">
            <li><a href="/handling/picking-up">怎么抱兔子</a></li>
            <li><a href="/handling/medicating">怎么喂药</a></li>
            <li><a href="/handling/nail-trimming">剪指甲</a></li>
            <li><a href="/handling/health-check">在家身体检查</a></li>
          </ul>
        </nav>

        <nav class="topic">
          <h3 class="topic-name"><a href="/digest/">消化系统科普</a></h3>
          <ul class="topic-list">
            <li><a href="/digest/cecotropes">兔为什么吃自己的便便</a></li>
            <li><a href="/digest/key-traits">兔不能呕吐等关键特性</a></li>
            <li><a href="/digest/hindgut-fermentation">为什么必须吃草</a></li>
            <li><a href="/breeds/">品种百科（23 个品种页）</a></li>
          </ul>
        </nav>

        <nav class="topic">
          <h3 class="topic-name"><a href="/supplies/">常备药与兔粮</a></h3>
          <ul class="topic-list">
            <li><a href="/supplies/food-safe">能吃什么 · 不能吃什么</a></li>
            <li><a href="/supplies/pellets">兔粮怎么选（成分与国标）</a></li>
            <li><a href="/supplies/hairball-remedy">化毛膏的真相</a></li>
            <li><a href="/supplies/">家庭药箱清单</a></li>
            <li><a href="/faq/">高频问答 39 问</a></li>
          </ul>
        </nav>
      </div>

    </div>
  </section>
</template>

<style scoped>
.home-entries {
  border-top: 1px solid var(--rw-line);
  padding: 3.6rem 1.5rem 4.5rem;
}
.entries-inner {
  max-width: 1040px;
  margin: 0 auto;
}

/* 两大主题 */
.lead-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3.5rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid var(--rw-line);
}
@media (max-width: 800px) {
  .lead-grid { grid-template-columns: 1fr; gap: 2.2rem; }
}

.lead-title {
  margin: 0 0 0.55rem;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.lead-title a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}
.lead-title a:hover { color: var(--rw-ink); }
/* 急症处置：红色特权位 */
.lead-emergency .lead-title a { color: var(--rw-danger-text-strong); }
.lead-emergency .lead-title a:hover { color: var(--rw-danger); }
.lead-emergency .lead-list a::before {
  background: var(--rw-danger);
}
.lead-emergency .lead-list a:hover::before,
.lead-emergency .lead-list a:focus-visible::before {
  background: var(--rw-danger);
  opacity: 1;
}
.lead-emergency .lead-list a:hover::after,
.lead-emergency .lead-list a:focus-visible::after {
  color: var(--rw-danger);
}
.dark .lead-emergency .lead-title a { color: var(--rw-danger); }

.lead-desc {
  font-size: 0.92rem;
  line-height: 1.75;
  color: var(--vp-c-text-2);
  margin: 0 0 1.1rem;
}

/* 行式列表：hover 微背景 + 箭头 */
.lead-list,
.topic-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.lead-list li + li,
.topic-list li + li {
  border-top: 1px solid var(--rw-line);
}
.lead-list a,
.topic-list a {
  display: flex;
  align-items: center;
  padding: 0.62rem 0.5rem;
  margin: 0 -0.5rem;
  font-size: 0.92rem;
  color: var(--vp-c-text-1);
  text-decoration: none;
  border-radius: 6px;
  transition: background-color 0.15s ease;
}
.topic-list a { font-size: 0.9rem; color: var(--vp-c-text-2); }
.topic-list a:hover { color: var(--vp-c-text-1); }
.lead-list a:hover,
.topic-list a:hover {
  background: var(--rw-hover-bg);
}
.lead-list a::after,
.topic-list a::after {
  content: '→';
  margin-left: auto;
  color: var(--vp-c-text-3, var(--vp-c-text-2));
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.lead-list a:hover::after,
.topic-list a:hover::after {
  opacity: 1;
  transform: translateX(0);
}

/* 列表前置兔点（干草黄，嵌套语义呼应全站符号系统） */
.lead-list a::before,
.topic-list a::before {
  content: '';
  width: 6px; height: 6px;
  border-radius: 999px;
  background: var(--rw-hay);
  opacity: 0.55;
  margin-right: 0.65rem;
  flex-shrink: 0;
  transition: background-color 0.15s ease, opacity 0.15s ease;
}
.lead-list a:hover::before,
.topic-list a:hover::before {
  background: var(--rw-grass);
  opacity: 1;
}

/* 其余主题：两列 */
.topic-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.6rem 3.5rem;
  padding-top: 2.8rem;
}
@media (max-width: 800px) {
  .topic-grid { grid-template-columns: 1fr; gap: 2rem; }
}

.topic-name {
  margin: 0 0 0.5rem;
  font-size: 1.08rem;
  font-weight: 700;
}
.topic-name a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}
.topic-name a:hover { color: var(--rw-ink); }
</style>
