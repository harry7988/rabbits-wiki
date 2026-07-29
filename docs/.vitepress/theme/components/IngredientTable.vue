<script setup lang="ts">
/**
 * IngredientTable —— 兔粮成分分析对照表
 *
 * 核心立场（与本站可信度守则一致）：
 * 不抛开剂量谈"有毒"。每个成分标注：
 *   - 作用 / 风险
 *   - 安全剂量范围（带国标/AAFCO/FEDIAF 引用）
 *   - 实际判断（必需 / 限量 / 避免 / 因年龄而异）
 *
 * 用法：
 * <IngredientTable :rows="[
 *   { name: '玉米', risk: '高淀粉可能过发酵', safe: '适量配比未证实有害', verdict: '限量', source: '...' }
 * ]" />
 */
interface Row {
  name: string
  role: string         // 作用/为何添加
  risk: string         // 风险（什么剂量下）
  safe: string         // 安全剂量/情况
  verdict: 'essential' | 'limit' | 'avoid' | 'conditional'
  source?: string
}

interface Props {
  rows: Row[]
}
defineProps<Props>()

const verdictMap = {
  essential:  { label: '✅ 必需', cls: 'v-ess', title: '兔需要这种成分，但需在合适剂量内' },
  limit:      { label: '⚠️ 限量', cls: 'v-lim', title: '少量可接受，过量有害' },
  avoid:      { label: '🚫 避免', cls: 'v-avd', title: '无营养必要且有风险' },
  conditional:{ label: '🔄 因情况而异', cls: 'v-con', title: '按年龄/健康状态判断' }
} as const
</script>

<template>
  <div class="ing-table-wrap">
    <table class="ing-table">
      <thead>
        <tr>
          <th>成分</th>
          <th>作用</th>
          <th>风险（过量时）</th>
          <th>安全剂量/情况</th>
          <th>判断</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, i) in rows" :key="i">
          <td class="ing-name">{{ r.name }}</td>
          <td>{{ r.role }}</td>
          <td class="ing-risk">{{ r.risk }}</td>
          <td class="ing-safe">{{ r.safe }}</td>
          <td>
            <span
              class="ing-verdict"
              :class="verdictMap[r.verdict].cls"
              :title="verdictMap[r.verdict].title"
            >{{ verdictMap[r.verdict].label }}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <p class="ing-note">
      ℹ️ 本表"判断"基于权威营养标准（AAFCO / FEDIAF / NRC）与同行评审证据。
      <strong>任何成分的"有害性"都必须结合剂量、工艺、营养配比判断</strong>——本站反对"含 X 即有毒"的一刀切说法。
    </p>
  </div>
</template>

<style scoped>
.ing-table-wrap {
  margin: 1.5rem 0;
  overflow-x: auto;
}
.ing-table {
  border-collapse: collapse;
  width: 100%;
  font-size: 0.88rem;
  background: var(--vp-c-bg);
}
.ing-table th, .ing-table td {
  border: 1px solid var(--vp-c-divider);
  padding: 0.6rem 0.8rem;
  text-align: left;
  vertical-align: top;
  line-height: 1.55;
}
.ing-table th {
  background: var(--rw-grass-soft, #e8f0e3);
  font-weight: 700;
  color: var(--rw-grass, #4a7c3f);
  white-space: nowrap;
}
.ing-name { font-weight: 700; white-space: nowrap; }
.ing-risk { color: var(--rw-text-on-danger); }
.ing-safe { color: var(--rw-good-text); }
.ing-verdict {
  display: inline-block;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
}
.v-ess { background: var(--rw-good-bg); color: var(--rw-good-text); }
.v-lim { background: var(--rw-warn2-bg); color: var(--rw-warn2-text); }
.v-avd { background: var(--rw-danger-soft); color: var(--rw-bad-text); }
.v-con { background: var(--rw-info-soft); color: var(--rw-info2-text); }
.ing-note {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  margin-top: 0.6rem;
  line-height: 1.6;
}
@media (max-width: 768px) {
  .ing-table { font-size: 0.8rem; }
  .ing-table th, .ing-table td { padding: 0.45rem 0.5rem; }
}
</style>
