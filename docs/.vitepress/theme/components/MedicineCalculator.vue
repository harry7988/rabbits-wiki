<script setup lang="ts">
/**
 * MedicineCalculator —— 安全剂量计算器
 *
 * 严格原则：
 * - 只显示有权威来源（HRS / Oxbow / 兽医期刊）的"非处方"药品
 * - 所有结果显式标注"参考用量，以兽医为准"
 * - 处方药一律不在本计算器（必须兽医按个体开具）
 * - 每个药品标注来源链接
 */
import { ref, computed } from 'vue'

interface Medicine {
  id: string
  name: string
  concentration: string          // 浓度，如 "20 mg/mL"
  dosePerKg: number              // mg/kg
  unit: string                   // 'mL' | 'g'
  route: string                  // 给药途径
  frequency: string              // 频率
  maxPerDay?: string             // 每日上限
  source: { text: string; url: string }
  warning?: string
  prescription: boolean          // 是否处方
}

// 只收录非处方、有明确权威来源的药品
const medicines: Medicine[] = [
  {
    id: 'simethicone',
    name: '西甲硅油（Simethicone，婴儿排气滴剂）',
    concentration: '20 mg/mL',
    dosePerKg: 20,                // 约 1 mL/kg（HRS 经验值），但安全窗大
    unit: 'mL',
    route: '口服（无针头注射器）',
    frequency: '首剂每小时 1 次，连用 2–3 次；之后按需每 3–8 小时',
    maxPerDay: 'HRS 称『基本不会过量』，但用 3 次无效通常继续无效',
    source: {
      text: 'House Rabbit Society — How to Help a Rabbit with Gas Pain',
      url: 'https://rabbit.org/health/how-to-help-a-rabbit-with-gas-pain/'
    },
    warning: '只缓解胀气症状，不解决根本病因（毛球/感染/梗阻）。效力有争议（越来越多兔科兽医认为对兔几乎无效）。'
  },
  {
    id: 'critical-care',
    name: 'Oxbow Critical Care（强制喂食）',
    concentration: '1 份粉 + 2 份温水（体积比）',
    dosePerKg: 50,                 // 50 mL 混合物/kg/天
    unit: 'mL',
    route: '口服（35 mL 导管尖注射器，头高于尾防呛）',
    frequency: '分 4–6 次/天',
    source: {
      text: 'Acorn House Vets — Critical Care for Herbivores',
      url: 'https://www.acornhousevets.co.uk/documents/critical-care-for-herbivores.pdf'
    },
    warning: '怀疑胃肠梗阻时绝对禁止强制喂食（会加重梗阻）。'
  },
  {
    id: 'benebac',
    name: 'Bene-Bac Plus 凝胶（益生菌）',
    concentration: '凝胶，约 1 g/10 lb',
    dosePerKg: 0.22,               // 1g/10lb ≈ 0.22g/kg
    unit: 'g',
    route: '口服',
    frequency: '起始半量 2–3 天，后增至全量；两次间隔 3 天',
    source: {
      text: 'AllThingsBunnies — Bene-Bac Plus 用量',
      url: 'https://www.allthingsbunnies.com/bene-bac-plus-gel-15g-p4155.aspx'
    },
    warning: '健康兔不需要常规补充。详见益生菌专题。'
  }
]

const weight = ref<number>(1.5)         // kg
const unit = ref<'kg' | 'lb'>('kg')
const selectedId = ref<string>('simethicone')

const weightInKg = computed(() => {
  return unit.value === 'kg' ? weight.value : weight.value * 0.4536
})

const selected = computed(() => medicines.find(m => m.id === selectedId.value)!)

const doseResult = computed(() => {
  const m = selected.value
  const raw = weightInKg.value * m.dosePerKg
  return raw < 1 ? raw.toFixed(3) : raw.toFixed(1)
})
</script>

<template>
  <div class="med-calc">
    <div class="mc-row">
      <label class="mc-label">兔兔体重</label>
      <input
        v-model.number="weight"
        type="number" min="0.3" max="10" step="0.1"
        class="mc-input"
      />
      <select v-model="unit" class="mc-select">
        <option value="kg">kg</option>
        <option value="lb">lb</option>
      </select>
    </div>

    <div class="mc-row">
      <label class="mc-label">选择药品</label>
      <select v-model="selectedId" class="mc-select mc-wide">
        <option v-for="m in medicines" :key="m.id" :value="m.id">
          {{ m.name }}
        </option>
      </select>
    </div>

    <div class="mc-result">
      <div class="mc-result-num">{{ doseResult }} <small>{{ selected.unit }}</small></div>
      <div class="mc-result-label">参考单次/日用量</div>
      <div class="mc-detail">
        <p><strong>浓度规格</strong>：{{ selected.concentration }}</p>
        <p><strong>给药途径</strong>：{{ selected.route }}</p>
        <p><strong>频率</strong>：{{ selected.frequency }}</p>
        <p v-if="selected.maxPerDay"><strong>上限</strong>：{{ selected.maxPerDay }}</p>
      </div>
      <div v-if="selected.warning" class="mc-warn">⚠️ {{ selected.warning }}</div>
    </div>

    <a :href="selected.source.url" target="_blank" rel="noopener" class="mc-source">
      📖 来源：{{ selected.source.text }}
    </a>

    <div class="mc-disclaimer">
      🚨 本计算器仅供<strong>非处方应急</strong>参考，<strong>不能替代兽医诊断</strong>。
      所有处方药（止痛、促动力、抗生素、抗球虫）必须由兔科兽医按个体体重开具。
      兔病情进展极快，急症请立即就医。
    </div>
  </div>
</template>

<style scoped>
.med-calc {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.2rem 1.4rem;
  background: var(--rw-cream, #faf6ef);
  margin: 1.5rem 0;
}
.mc-row { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.9rem; flex-wrap: wrap; }
.mc-label { font-weight: 600; min-width: 80px; }
.mc-input {
  width: 90px; padding: 0.4rem 0.5rem;
  border: 1px solid var(--vp-c-divider); border-radius: 6px;
  font-size: 1rem;
}
.mc-select {
  padding: 0.4rem 0.5rem; border: 1px solid var(--vp-c-divider);
  border-radius: 6px; font-size: 0.95rem; background: #fff;
}
.mc-wide { flex: 1; min-width: 220px; }
.mc-result {
  background: #fff; border: 1px solid var(--rw-grass, #4a7c3f);
  border-left: 5px solid var(--rw-grass, #4a7c3f);
  border-radius: 8px; padding: 1rem 1.2rem; margin: 0.5rem 0;
}
.mc-result-num { font-size: 2rem; font-weight: 800; color: var(--rw-grass, #4a7c3f); }
.mc-result-num small { font-size: 1rem; font-weight: 600; }
.mc-result-label { color: var(--vp-c-text-2); font-size: 0.85rem; margin-bottom: 0.5rem; }
.mc-detail { font-size: 0.9rem; line-height: 1.7; }
.mc-detail p { margin: 0.15rem 0; }
.mc-warn {
  background: var(--rw-warn-soft, #fdf5e6); border-left: 3px solid var(--rw-warn, #b8860b);
  padding: 0.5rem 0.8rem; border-radius: 4px; margin-top: 0.7rem;
  font-size: 0.85rem; color: #5a4200;
}
.mc-source {
  display: block; font-size: 0.85rem; color: var(--rw-grass, #4a7c3f);
  margin-top: 0.8rem; word-break: break-all;
}
.mc-disclaimer {
  margin-top: 1rem; padding: 0.7rem 0.9rem;
  background: var(--rw-danger-soft, #fdecea); border-left: 4px solid var(--rw-danger, #c0392b);
  border-radius: 4px; font-size: 0.85rem; color: #6b1a12;
}
</style>
