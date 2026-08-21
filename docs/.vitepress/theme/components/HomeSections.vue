<script setup lang="ts">
/**
 * HomeSections —— 首页内容入口（bento 式不对称布局）
 *
 * 替代默认的 6 等大 feature 卡片：
 * - 大卡（2x2）：急症处置（最高价值，红色系统）
 * - 大卡（2x1）：养兔工具箱（8 个工具入口）
 * - 中卡：日常养育 / 品种百科
 * - 小卡行：消化科普 / 常备药 / FAQ / 操作技能
 * 布局意图：用户第一眼看到"急症"和"工具"（最高频需求），
 * 其他主题按阅读深度分级。
 */
</script>

<template>
  <section class="home-sections">
    <div class="sections-inner">

      <!-- 第一行：急症（大）+ 工具（大） -->
      <div class="row row-1">
        <a href="/emergencies/" class="tile tile-xl tile-emergency">
          <div class="tile-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          </div>
          <h3>急症处置</h3>
          <p>胃肠停滞、腹泻、中暑、外伤、骨折、抽搐、球虫、中毒——每一种突发情况的家庭急救步骤与就医信号。</p>
          <div class="tile-tags">
            <span>11 类急症</span><span>红色警报</span><span>急救包清单</span>
          </div>
        </a>

        <a href="/tools/" class="tile tile-xl tile-tools">
          <div class="tile-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </div>
          <h3>养兔工具箱</h3>
          <p>症状决策树、剂量计算器、脱水评估、喂食量计算、兔粮成分分析、健康日历、有毒植物查询、紧急联系卡。</p>
          <div class="tile-tags">
            <span>8 个交互工具</span><span>即开即用</span>
          </div>
        </a>
      </div>

      <!-- 第二行：养育 + 品种（中卡） -->
      <div class="row row-2">
        <a href="/care/" class="tile tile-m">
          <h3>日常养育</h3>
          <p>绝育（防母兔子官癌 &gt;60%）、幼兔、老年兔、牙齿健康、合笼、行为解读、定点如厕。</p>
        </a>
        <a href="/breeds/" class="tile tile-m">
          <h3>兔品种百科</h3>
          <p>11 个常见品种——垂耳、侏儒、狮子、雷克斯、道奇、霍托、Flemish Giant。含茶杯兔辟谣。</p>
        </a>
      </div>

      <!-- 第三行：操作技能 + 消化科普 -->
      <div class="row row-2">
        <a href="/handling/" class="tile tile-m">
          <h3>操作技能</h3>
          <p>怎么抱兔、怎么喂药、剪指甲、量体温、保定包裹、身体检查、运输、环境清洁——动手基本功。</p>
        </a>
        <a href="/digest/" class="tile tile-m">
          <h3>消化系统科普</h3>
          <p>盲肠便与重食、后肠发酵、为什么兔不能呕吐——理解原理，才能正确处置消化道急症。</p>
        </a>
      </div>

      <!-- 第四行：小卡（常备药 / FAQ / 共创） -->
      <div class="row row-3">
        <a href="/supplies/" class="tile tile-s">
          <h4>常备药与用品</h4>
          <p>家庭药箱 · 兔粮成分 · 牧草</p>
        </a>
        <a href="/faq/" class="tile tile-s">
          <h4>高频问答</h4>
          <p>60+ 问题 · 18 条辟谣</p>
        </a>
        <a href="/contribute" class="tile tile-s">
          <h4>参与共创</h4>
          <p>Fork · PR · 来源规范</p>
        </a>
      </div>

    </div>
  </section>
</template>

<style scoped>
.home-sections {
  background: var(--rw-home-sections-bg);
  border-top: 1px solid var(--vp-c-divider);
  padding: 3.2rem 1.5rem 4rem;
}
.sections-inner {
  max-width: 1152px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}
.row { display: grid; gap: 0.9rem; }
.row-1 { grid-template-columns: 1fr 1fr; }
.row-2 { grid-template-columns: 1fr 1fr 1fr 1fr; }
.row-2 .tile { grid-column: span 2; }
.row-3 { grid-template-columns: 1fr 1fr 1fr; }

@media (max-width: 960px) {
  .row-1 { grid-template-columns: 1fr; }
  .row-2 { grid-template-columns: 1fr; }
  .row-2 .tile { grid-column: auto; }
  .row-3 { grid-template-columns: 1fr; }
}

.tile {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem 1.5rem 1.3rem;
  background: var(--rw-bg-card);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  text-decoration: none;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}
.tile:hover {
  transform: translateY(-3px);
  border-color: var(--rw-grass-border);
  box-shadow: 0 10px 28px -12px var(--rw-shadow-tint);
}
.tile:active { transform: translateY(-1px); }
@media (prefers-reduced-motion: reduce) {
  .tile { transition: none; }
  .tile:hover { transform: none; }
}

.tile h3 {
  margin: 0;
  font-size: 1.22rem;
  font-weight: 750;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
}
.tile h4 {
  margin: 0;
  font-size: 1.02rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}
.tile p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}
.tile-s p { font-size: 0.84rem; }

.tile-icon {
  width: 46px; height: 46px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 12px;
  margin-bottom: 0.3rem;
}

/* 急症卡：红色系统 */
.tile-emergency {
  border-color: var(--rw-danger-border);
  background: linear-gradient(160deg, var(--rw-danger-soft) 0%, var(--rw-bg-card) 55%);
}
.tile-emergency .tile-icon {
  background: var(--rw-danger);
  color: #fff;
}
.tile-emergency h3 { color: var(--rw-danger-text-strong); }

/* 工具卡：绿色系统 */
.tile-tools .tile-icon {
  background: var(--rw-grass-soft);
  color: var(--rw-grass);
}

.tile-tags {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-top: 0.55rem;
}
.tile-tags span {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.18rem 0.6rem;
  border-radius: 999px;
  background: var(--rw-tag-bg);
  color: var(--vp-c-text-2);
}
.tile-emergency .tile-tags span {
  background: var(--rw-danger-tag-bg);
  color: var(--rw-danger);
}
</style>
