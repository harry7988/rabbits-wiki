<script setup lang="ts">
/**
 * PelletAnalyzer —— 兔粮成分分析器
 *
 * 用户输入：配料表（文本）+ 成分分析保证值（粗蛋白/脂肪/纤维/钙/磷等）
 * 输出：每个指标对照 FEDIAF 2024 标准，红/黄/绿评估
 *
 * 严格立场（与本站兔粮页一致）：
 * - 剂量决定毒性，不"含 X 即有毒"
 * - 标注的成分值只是 min/max，非精确
 * - 不带货也不诋毁，仅基于公开标准做评估
 */
import { ref, computed, reactive } from 'vue'

// FEDIAF 2024 成兔维持期标准
interface Std {
  key: string
  label: string
  unit: string
  min: number | null    // 推荐下限
  max: number | null    // 推荐上限 / SUL
  idealMin?: number
  idealMax?: number
  type: 'range' | 'min' | 'max'
  adviceGood: string
  adviceBad: string
}

const stds: Std[] = [
  {
    key: 'protein', label: '粗蛋白', unit: '%',
    min: 12, max: 17, type: 'range',
    adviceGood: '在 FEDIAF 推荐范围（12–17%）内',
    adviceBad: '成兔蛋白过高（>17%）加重肾脏和盲肠负担；过低（<12%）营养不足'
  },
  {
    key: 'fat', label: '粗脂肪', unit: '%',
    min: null, max: 5, idealMin: 2.5, idealMax: 4, type: 'max',
    adviceGood: '≤5%（理想 2.5–4%）',
    adviceBad: '高脂（>5%）→ 肥胖'
  },
  {
    key: 'fiber', label: '粗纤维', unit: '%',
    min: 18, max: null, idealMin: 22, idealMax: 25, type: 'min',
    adviceGood: '≥18%（理想 22–25%）',
    adviceBad: '纤维不足（<18%）→ 肠蠕动减弱、磨牙不足'
  },
  {
    key: 'calcium', label: '钙', unit: '%',
    min: 0.4, max: 1.0, idealMin: 0.4, idealMax: 0.6, type: 'range',
    adviceGood: '0.4–0.6%（成兔理想）',
    adviceBad: '钙 >1.0% 超过 FEDIAF 安全上限（SUL），长期致膀胱泥沙/尿石；<0.4% 影响骨骼'
  },
  {
    key: 'phosphorus', label: '磷', unit: '%',
    min: 0.5, max: 0.9, type: 'range',
    adviceGood: '0.5–0.8% 范围',
    adviceBad: '磷 >0.9% 抑制钙吸收（即使钙磷比看似合理）'
  },
  {
    key: 'vitd', label: '维生素 D3', unit: 'IU/kg',
    min: 800, max: 2000, type: 'range',
    adviceGood: '800–1000 IU/kg 推荐；≤2000 SUL 安全',
    adviceBad: '>2000 IU/kg 超过 SUL，软组织钙化不可逆；<800 影响骨骼。绝不要自行补维 D'
  }
]

const inputs = reactive<Record<string, string>>({
  protein: '', fat: '', fiber: '', calcium: '', phosphorus: '', vitd: ''
})

const ingredientList = ref('')

interface Analysis {
  std: Std
  value: number | null
  status: 'good' | 'warn' | 'bad' | 'unknown'
  message: string
}

const analysis = computed<Analysis[]>(() => {
  return stds.map(std => {
    const raw = inputs[std.key]
    const val = raw === '' || raw == null ? null : parseFloat(raw)
    if (val == null || isNaN(val)) {
      return { std, value: null, status: 'unknown', message: '未填写' }
    }
    let status: Analysis['status'] = 'good'
    let message = std.adviceGood

    if (std.type === 'range' || std.type === 'max') {
      if (std.max != null && val > std.max) {
        status = 'bad'
        message = `⚠️ ${val}${std.unit} 超过上限 ${std.max}${std.unit}。${std.adviceBad}`
      } else if (std.idealMax != null && val > std.idealMax) {
        status = 'warn'
        message = `${val}${std.unit} 略高于理想（${std.idealMax}${std.unit}），但未超 SUL`
      }
    }
    if (std.type === 'range' || std.type === 'min') {
      if (std.min != null && val < std.min) {
        status = 'bad'
        message = `⚠️ ${val}${std.unit} 低于下限 ${std.min}${std.unit}。${std.adviceBad}`
      } else if (std.idealMin != null && val < std.idealMin && status !== 'bad') {
        status = 'warn'
        message = `${val}${std.unit} 略低于理想（${std.idealMin}${std.unit}）`
      }
    }
    return { std, value: val, status, message }
  })
})

// 配料表关键词检测
interface IngredientCheck {
  name: string
  found: boolean
  verdict: 'avoid' | 'limit' | 'ok' | 'good'
  note: string
}

const ingredientChecks = computed<IngredientCheck[]>(() => {
  const text = ingredientList.value.toLowerCase()
  const has = (kw: string) => text.includes(kw.toLowerCase())
  const firstIngredient = text.split(/[,\n、(]/)[0]?.trim() || ''

  return [
    {
      name: '配料表第一位是牧草（提摩西/果园草等）',
      found: !!text,
      verdict: /timothy|orchard|提摩西|果园|燕麦草|牧草/.test(firstIngredient) ? 'good' : 'avoid',
      note: /timothy|orchard|提摩西|果园/.test(firstIngredient)
        ? '✅ 第一位是牧草，配方合理'
        : `❌ 第一位是「${firstIngredient.slice(0, 30)}」，应为牧草`
    },
    {
      name: '玉米/玉米粉作为主配料',
      found: has('corn') || has('玉米') || has('maize'),
      verdict: (has('corn') || has('玉米') || has('maize')) ? 'limit' : 'good',
      note: (has('corn') || has('玉米')) ? '⚠️ 含玉米——剂量决定风险，看总淀粉 ≤13.5%' : '✅ 无玉米作为主配料'
    },
    {
      name: '乙氧基喹（ethoxyquin）',
      found: has('ethoxyquin') || has('乙氧基喹'),
      verdict: (has('ethoxyquin') || has('乙氧基喹')) ? 'avoid' : 'good',
      note: (has('ethoxyquin') || has('乙氧基喹')) ? '🚫 含乙氧基喹——欧盟已禁用，建议避开' : '✅ 不含乙氧基喹'
    },
    {
      name: 'BHA / BHT',
      found: has('bha') || has('bht'),
      verdict: (has('bha') || has('bht')) ? 'limit' : 'good',
      note: (has('bha') || has('bht')) ? '⚠️ 含 BHA/BHT——虽然合规，天然生育酚更优' : '✅ 不含 BHA/BHT'
    },
    {
      name: '天然生育酚（维 E 类防腐）',
      found: has('tocopherol') || has('生育酚'),
      verdict: (has('tocopherol') || has('生育酚')) ? 'good' : 'ok',
      note: (has('tocopherol') || has('生育酚')) ? '✅ 使用天然生育酚防腐（优选）' : '未检测到，看具体配方'
    },
    {
      name: '人工色素',
      found: has('red 40') || has('yellow 5') || has('artificial color') || has('人工色素'),
      verdict: (has('red 40') || has('yellow 5') || has('artificial color') || has('人工色素')) ? 'avoid' : 'good',
      note: (has('red 40') || has('yellow 5')) ? '🚫 含人工色素——兔完全不需要' : '✅ 无人工色素'
    },
    {
      name: '糖蜜 (molasses)',
      found: has('molasses') || has('糖蜜'),
      verdict: (has('molasses') || has('糖蜜')) ? 'limit' : 'good',
      note: (has('molasses') || has('糖蜜')) ? '⚠️ 含糖蜜——<5% 通常可接受' : '✅ 不含糖蜜'
    },
    {
      name: '种子/坚果/水果干混合（muesli）',
      found: has('seed') || has('nut') || has('dried fruit') || has('种子') || has('坚果'),
      verdict: (has('seed') || has('nut') || has('dried fruit') || has('种子') || has('坚果')) ? 'avoid' : 'good',
      note: (has('seed') || has('nut')) ? '🚫 muesli 混合粮——高糖高脂，兔会挑食，应避免' : '✅ 均匀单一颗粒'
    }
  ]
})

const statusMeta = {
  good: { label: '✅ 达标', cls: 's-good' },
  warn: { label: '⚠️ 边缘', cls: 's-warn' },
  bad: { label: '🚫 不达标', cls: 's-bad' },
  unknown: { label: '—', cls: 's-unknown' }
}
const verdictMeta = {
  good: { cls: 'v-good' },
  ok: { cls: 'v-ok' },
  limit: { cls: 'v-limit' },
  avoid: { cls: 'v-avoid' }
}
</script>

<template>
  <div class="pa-analyzer">
    <div class="pa-section">
      <h4>1. 贴入配料表（可选）</h4>
      <textarea
        v-model="ingredientList"
        placeholder="例如：Timothy Grass Hay, Soybean Hulls, Soybean Meal, Cane Molasses, Salt, Vitamin E Supplement..."
        class="pa-textarea"
        rows="3"
      ></textarea>
      <div v-if="ingredientList" class="pa-ing-results">
        <div v-for="c in ingredientChecks" :key="c.name" class="pa-ing-row" :class="verdictMeta[c.verdict].cls">
          <span class="pa-ing-name">{{ c.name }}</span>
          <span class="pa-ing-note">{{ c.note }}</span>
        </div>
      </div>
    </div>

    <div class="pa-section">
      <h4>2. 填入成分分析保证值（来自包装标签）</h4>
      <div class="pa-inputs">
        <div v-for="std in stds" :key="std.key" class="pa-input-row">
          <label>{{ std.label }} <small>({{ std.unit }})</small></label>
          <input v-model="inputs[std.key]" type="number" step="0.01" :placeholder="`如 ${std.min ?? std.max}`"/>
        </div>
      </div>
    </div>

    <div class="pa-section">
      <h4>3. 评估结果（对照 FEDIAF 2024 成兔标准）</h4>
      <div class="pa-results">
        <div v-for="a in analysis" :key="a.std.key" class="pa-result-card" :class="statusMeta[a.status].cls">
          <div class="pa-result-head">
            <span class="pa-result-label">{{ a.std.label }}</span>
            <span class="pa-result-status">{{ statusMeta[a.status].label }}</span>
          </div>
          <div v-if="a.value != null" class="pa-result-val">
            {{ a.value }}{{ a.std.unit }}
            <small>（FEDIAF: {{ a.std.min ?? '—' }}–{{ a.std.max ?? '—' }}{{ a.std.unit }}）</small>
          </div>
          <div v-else class="pa-result-val pa-empty">未填写</div>
          <div class="pa-result-msg">{{ a.message }}</div>
        </div>
      </div>
    </div>

    <div class="pa-disclaimer">
      🚨 本工具仅供<strong>参考</strong>：成分分析保证值只是 min/max（非精确），且不同兔个体需求不同。
      本评估基于 FEDIAF 2024 成兔维持期标准，幼兔/孕泌乳兔/病兔另议。
      <strong>兔粮只是补充，牧草才是主食（80%+）。</strong>
    </div>

    <p class="pa-source">
      📖 标准：<a href="https://europeanpetfood.org/wp-content/uploads/2024/11/FEDIAF-Nutritional-Guidelines-for-Feeding-Pet-Rabbits_NEW.pdf" target="_blank" rel="noopener">FEDIAF 2024 兔营养指南</a> ·
      <a href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/rabbits/nutrition-of-rabbits" target="_blank" rel="noopener">Merck 兔营养</a> ·
      详见 <a href="./../supplies/pellets">兔粮如何选择</a>
    </p>
  </div>
</template>

<style scoped>
.pa-analyzer {
  border: 1px solid var(--vp-c-divider); border-radius: 12px;
  padding: 1.2rem 1.4rem; background: var(--rw-cream, #faf6ef);
  margin: 1.5rem 0;
}
.pa-section { margin-bottom: 1.3rem; }
.pa-section h4 { margin: 0 0 0.6rem; font-size: 1rem; color: var(--rw-grass, #4a7c3f); }
.pa-textarea {
  width: 100%; padding: 0.5rem; border: 1px solid var(--vp-c-divider);
  border-radius: 6px; font-family: inherit; font-size: 0.9rem; background: var(--rw-bg-card);
  resize: vertical;
}
.pa-ing-results { margin-top: 0.7rem; display: flex; flex-direction: column; gap: 0.3rem; }
.pa-ing-row {
  display: flex; justify-content: space-between; gap: 1rem;
  padding: 0.4rem 0.7rem; border-radius: 4px; font-size: 0.85rem;
  border-left: 3px solid;
}
.pa-ing-name { font-weight: 600; flex-shrink: 0; }
.pa-ing-note { text-align: right; }
.v-good { background: var(--rw-good-bg); border-left-color: var(--rw-good-text); }
.v-ok { background: var(--vp-c-bg-alt, #f5f5f5); border-left-color: var(--vp-c-text-3, #999); }
.v-limit { background: var(--rw-warn2-bg); border-left-color: var(--rw-warn); }
.v-avoid { background: var(--rw-danger-soft); border-left-color: var(--rw-danger); }

.pa-inputs {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.6rem;
}
.pa-input-row { display: flex; flex-direction: column; gap: 0.2rem; }
.pa-input-row label { font-size: 0.82rem; font-weight: 600; color: var(--vp-c-text-2); }
.pa-input-row label small { color: var(--vp-c-text-2); font-weight: 400; }
.pa-input-row input {
  padding: 0.4rem 0.5rem; border: 1px solid var(--vp-c-divider);
  border-radius: 6px; font-size: 0.95rem; background: var(--rw-bg-card);
}

.pa-results {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.6rem;
}
.pa-result-card {
  background: var(--rw-bg-card); border-radius: 6px; padding: 0.7rem 0.9rem;
  border-left: 4px solid var(--vp-c-divider);
}
.s-good { border-left-color: var(--rw-good-text); }
.s-warn { border-left-color: var(--rw-warn); }
.s-bad { border-left-color: var(--rw-danger); background: #fff8f7; }
.s-unknown { border-left-color: var(--vp-c-text-3, #999); opacity: 0.6; }
.pa-result-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem; }
.pa-result-label { font-weight: 700; font-size: 0.92rem; }
.pa-result-status { font-size: 0.78rem; font-weight: 600; }
.s-good .pa-result-status { color: var(--rw-good-text); }
.s-warn .pa-result-status { color: var(--rw-warn); }
.s-bad .pa-result-status { color: var(--rw-danger); }
.pa-result-val { font-size: 1.05rem; font-weight: 700; color: var(--vp-c-text-1); margin-bottom: 0.3rem; }
.pa-result-val small { font-size: 0.75rem; font-weight: 400; color: var(--vp-c-text-2); }
.pa-empty { color: var(--vp-c-text-2); font-weight: 400; font-size: 0.85rem; }
.pa-result-msg { font-size: 0.82rem; color: var(--vp-c-text-2); line-height: 1.5; }

.pa-disclaimer {
  background: var(--rw-warn-soft, #fdf5e6); border-left: 4px solid var(--rw-warn, #b8860b);
  padding: 0.7rem 0.9rem; border-radius: 4px; font-size: 0.85rem; color: var(--rw-text-on-warn);
  margin: 1rem 0 0.8rem;
}
.pa-source { font-size: 0.78rem; color: var(--vp-c-text-2); line-height: 1.6; }
.pa-source a { color: var(--rw-grass, #4a7c3f); word-break: break-all; }
</style>
