<script setup lang="ts">
/**
 * FeedingCalculator —— 每日喂食量计算器
 *
 * 基于：
 * - 成兔：每 2.25 kg (5 lb) 体重 1/8–1/4 cup 颗粒粮/天 (HRS / Ohio HRR)
 * - 幼兔（<7月）：苜蓿基础料无限量
 * - 牧草：所有阶段无限量
 * - 蔬菜：成兔每天 1–4 杯（按体重）
 * - 水果：≤1–2 汤匙/天（零食）
 * - 老年兔/肥胖兔：颗粒粮减量
 *
 * 来源：HRS / VCA / Ohio House Rabbit Rescue / FEDIAF 2024
 */
import { ref, computed } from 'vue'

type Stage = 'baby' | 'adult' | 'senior'
type Activity = 'low' | 'normal' | 'high'

const weight = ref<number>(1.8)        // kg
const unit = ref<'kg' | 'lb'>('kg')
const stage = ref<Stage>('adult')
const activity = ref<Activity>('normal')
const neutered = ref<boolean>(true)

const weightKg = computed(() => unit.value === 'kg' ? weight.value : weight.value * 0.4536)
const weightLb = computed(() => weightKg.value * 2.2046)

// 颗粒粮：成兔基础 1/8–1/4 cup per 5 lb，按活动/绝育/年龄调整
const pelletsCups = computed(() => {
  if (stage.value === 'baby') return null  // 幼兔无限量
  let base = (weightLb.value / 5) * (1/8 + 1/4) / 2  // 取中值
  // 调整因子
  if (stage.value === 'senior') base *= 0.7          // 老年兔减量
  if (!neutered.value) base *= 1.15                  // 未绝育代谢略高
  if (activity.value === 'low') base *= 0.75         // 低活动量减量
  else if (activity.value === 'high') base *= 1.15   // 高活动量加量
  return Math.max(base, 0.02)
})

// 颗粒粮克数（1 cup 兔粮 ≈ 120-130 g，取 125 g）
const pelletsGrams = computed(() => pelletsCups.value ? Math.round(pelletsCups.value * 125) : null)

// 蔬菜杯数：成兔 1-4 cups/day 按体重
const vegCups = computed(() => {
  if (stage.value === 'baby') return '少量多样（逐步引入）'
  const base = Math.max(1, Math.min(4, weightLb.value / 2.5))
  return `${base.toFixed(1)} 杯（切碎的多样绿叶蔬菜）`
})

// 牧草
const hayAdvice = computed(() => {
  if (stage.value === 'baby') return '苜蓿草（高钙高蛋白）无限量'
  return '提摩西草 / 果园草 / 燕麦草（禾本科长草）无限量，占饮食 80–85%'
})

// 水果
const fruitAdvice = computed(() => {
  if (stage.value === 'baby') return '暂不推荐（肠胃未成熟）'
  return `${(weightLb.value * 0.5).toFixed(1)} 汤匙以内（高糖，仅作训练零食）`
})

const stageLabel = { baby: '幼兔（<7 月龄）', adult: '成兔（7 月–5 岁）', senior: '老年兔（5+ 岁）' }
const activityLabel = { low: '低（关笼/少运动）', normal: '正常（每日出笼 3–4h）', high: '高（自由活动）' }
</script>

<template>
  <div class="feed-calc">
    <div class="fc-grid">
      <div class="fc-field">
        <label class="fc-label">体重</label>
        <div class="fc-row">
          <input v-model.number="weight" type="number" min="0.3" max="12" step="0.1" class="fc-input"/>
          <select v-model="unit" class="fc-select">
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </select>
        </div>
      </div>

      <div class="fc-field">
        <label class="fc-label">年龄阶段</label>
        <select v-model="stage" class="fc-select fc-wide">
          <option value="baby">{{ stageLabel.baby }}</option>
          <option value="adult">{{ stageLabel.adult }}</option>
          <option value="senior">{{ stageLabel.senior }}</option>
        </select>
      </div>

      <div class="fc-field">
        <label class="fc-label">活动量</label>
        <select v-model="activity" class="fc-select fc-wide">
          <option value="low">{{ activityLabel.low }}</option>
          <option value="normal">{{ activityLabel.normal }}</option>
          <option value="high">{{ activityLabel.high }}</option>
        </select>
      </div>

      <div class="fc-field fc-checkbox">
        <label>
          <input type="checkbox" v-model="neutered"/>
          <span>已绝育</span>
        </label>
      </div>
    </div>

    <div class="fc-results">
      <div class="fc-result-card fc-hay">
        <div class="fc-cat">🌾 牧草（主食）</div>
        <div class="fc-val">{{ hayAdvice }}</div>
      </div>

      <div class="fc-result-card fc-pellets">
        <div class="fc-cat">🌾 颗粒粮（补充）</div>
        <div v-if="pelletsGrams" class="fc-val">
          <strong>{{ pelletsGrams }} g / 天</strong>
          <small>（约 {{ pelletsCups!.toFixed(2) }} 杯）</small>
        </div>
        <div v-else class="fc-val">
          <strong>苜蓿基础颗粒粮 · 无限量</strong>
          <small>（幼兔需要高钙高蛋白支持发育）</small>
        </div>
      </div>

      <div class="fc-result-card fc-veg">
        <div class="fc-cat">🥬 新鲜蔬菜</div>
        <div class="fc-val">{{ vegCups }}</div>
      </div>

      <div class="fc-result-card fc-fruit">
        <div class="fc-cat">🍎 水果（零食）</div>
        <div class="fc-val">{{ fruitAdvice }}</div>
      </div>
    </div>

    <div class="fc-warn">
      ⚠️ 本结果为基于 HRS / VCA / FEDIAF 标准的<strong>参考值</strong>。每只兔代谢不同，
      请观察体重变化（每周称重）和粪便质量来微调。肥胖或消瘦都要调整。
    </div>

    <p class="fc-source">
      📖 来源：<a href="https://rabbit.org/what-to-feed-your-rabbit/" target="_blank" rel="noopener">House Rabbit Society 饮食</a> ·
      <a href="https://vcahospitals.com/know-your-pet/feeding-your-rabbit" target="_blank" rel="noopener">VCA: Feeding Your Rabbit</a> ·
      <a href="https://ohiohouserabbitrescue.org/bunnydiet/" target="_blank" rel="noopener">Ohio HRR 饮食</a> ·
      <a href="https://europeanpetfood.org/wp-content/uploads/2024/11/FEDIAF-Nutritional-Guidelines-for-Feeding-Pet-Rabbits_NEW.pdf" target="_blank" rel="noopener">FEDIAF 2024 兔营养指南</a>
    </p>
  </div>
</template>

<style scoped>
.feed-calc {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.2rem 1.4rem;
  background: var(--rw-cream, #faf6ef);
  margin: 1.5rem 0;
}
.fc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.9rem;
  margin-bottom: 1.2rem;
}
.fc-field { display: flex; flex-direction: column; gap: 0.3rem; }
.fc-label { font-weight: 600; font-size: 0.85rem; color: var(--vp-c-text-2); }
.fc-row { display: flex; gap: 0.4rem; }
.fc-input, .fc-select {
  padding: 0.4rem 0.5rem; border: 1px solid var(--vp-c-divider);
  border-radius: 6px; font-size: 0.95rem; background: var(--rw-bg-card); flex: 1;
}
.fc-wide { width: 100%; }
.fc-checkbox label { display: flex; align-items: center; gap: 0.4rem; font-size: 0.95rem; cursor: pointer; padding-top: 1.5rem; }
.fc-results {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.7rem;
  margin-bottom: 1rem;
}
.fc-result-card {
  background: var(--rw-bg-card); border-radius: 8px; padding: 0.9rem 1rem;
  border-left: 4px solid var(--vp-c-divider);
}
.fc-hay { border-left-color: var(--rw-grass, #4a7c3f); }
.fc-pellets { border-left-color: var(--rw-warn); }
.fc-veg { border-left-color: var(--rw-info); }
.fc-fruit { border-left-color: var(--rw-src-exp); }
.fc-cat { font-weight: 700; font-size: 0.85rem; color: var(--vp-c-text-2); margin-bottom: 0.3rem; }
.fc-val { font-size: 0.95rem; line-height: 1.55; }
.fc-val strong { font-size: 1.1rem; color: var(--rw-grass, #4a7c3f); }
.fc-val small { display: block; color: var(--vp-c-text-2); font-size: 0.78rem; margin-top: 0.2rem; }
.fc-warn {
  background: var(--rw-warn-soft, #fdf5e6); border-left: 4px solid var(--rw-warn, #b8860b);
  padding: 0.7rem 0.9rem; border-radius: 4px; font-size: 0.85rem; color: var(--rw-text-on-warn);
  margin-bottom: 0.8rem;
}
.fc-source { font-size: 0.78rem; color: var(--vp-c-text-2); line-height: 1.6; }
.fc-source a { color: var(--rw-grass, #4a7c3f); word-break: break-all; }
</style>
