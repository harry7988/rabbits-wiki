<script setup lang="ts">
/**
 * SymptomTriage —— 症状决策树（"我家兔兔X了，怎么办？"）
 *
 * 引导用户从最突出的症状出发，快速得到：
 * 1. 紧急程度（立即急诊 / 当天就医 / 观察）
 * 2. 对应的处置页面
 * 3. 送医前的稳定措施
 *
 * 注意：本工具不替代兽医诊断，仅用于"快速导航 + 紧急度判断"。
 */
import { ref, computed } from 'vue'

interface Node {
  id: string
  question?: string
  options?: { label: string; next: string; tag?: 'emergent' | 'urgent' | 'watch' }[]
  result?: {
    level: 'emergent' | 'urgent' | 'watch'
    title: string
    advice: string
    page: { text: string; link: string }
  }
}

// 决策树：以"最突出的症状"为根
const tree: Record<string, Node> = {
  start: {
    id: 'start',
    question: '兔兔最突出的症状是什么？',
    options: [
      { label: '完全不吃 / 不拉 / 蜷缩 / 磨牙', next: 'not-eating' },
      { label: '水样 / 血性 / 黏液性腹泻', next: 'diarrhea' },
      { label: '耳朵烫 / 喘 / 抽搐 / 张口呼吸', next: 'heat' },
      { label: '出血 / 咬伤 / 撕裂', next: 'bleeding' },
      { label: '跛行 / 不敢着地 / 后腿瘫痪', next: 'limp' },
      { label: '抽搐 / 头歪 / 转圈', next: 'neuro' },
      { label: '打喷嚏 / 流鼻涕 / 呼吸费力', next: 'resp' },
      { label: '误食毒物 / 异物', next: 'poison' },
      { label: '精神差 / 比平时弱 / 但还吃', next: 'lethargy' }
    ]
  },
  'not-eating': {
    id: 'not-eating',
    question: '完全不吃不拉已经多久？',
    options: [
      { label: '6 小时以内', next: 'not-eating-early' },
      { label: '6–12 小时', next: 'not-eating-mid', tag: 'urgent' },
      { label: '超过 12 小时', next: 'not-eating-late', tag: 'emergent' },
      { label: '肚子坚硬如鼓（胀气）', next: 'not-eating-block', tag: 'emergent' }
    ]
  },
  'not-eating-early': {
    id: 'not-eating-early',
    result: {
      level: 'watch',
      title: '密切观察（仍在窗口期）',
      advice: '提供最爱的食物试探，鼓励运动，腹部轻柔按摩（仅肚子柔软时）。监测是否继续拒食和排便变化——一旦接近 12 小时未进食，必须就医。',
      page: { text: '查看胃肠停滞处置', link: '/emergencies/gi-stasis' }
    }
  },
  'not-eating-mid': {
    id: 'not-eating-mid',
    result: {
      level: 'urgent',
      title: '当天就医 + 家庭应急',
      advice: '已接近 12 小时红线。立即联系异宠兽医。送医前可给西甲硅油、运动、按摩、Critical Care（除非肚子坚硬）。同步送医，不要拖延。',
      page: { text: '查看胃肠停滞处置', link: '/emergencies/gi-stasis' }
    }
  },
  'not-eating-late': {
    id: 'not-eating-late',
    result: {
      level: 'emergent',
      title: '🚨 立即急诊',
      advice: '已超过 12 小时红线，存在肝脂质沉积症（脂肪肝）风险。立即送异宠急诊。途中保温，必要时用 Critical Care（除非怀疑梗阻）。',
      page: { text: '查看胃肠停滞处置', link: '/emergencies/gi-stasis' }
    }
  },
  'not-eating-block': {
    id: 'not-eating-block',
    result: {
      level: 'emergent',
      title: '🚨 立即急诊（怀疑梗阻）',
      advice: '肚子坚硬如鼓可能是胃肠梗阻——禁止按摩、禁止强制喂食。立即送急诊兽医。',
      page: { text: '查看胃肠停滞处置', link: '/emergencies/gi-stasis' }
    }
  },
  diarrhea: {
    id: 'diarrhea',
    result: {
      level: 'emergent',
      title: '🚨 立即急诊（尤其幼兔）',
      advice: '真性水样/血性腹泻数小时内可致命（脱水、球虫、肠毒血症）。立即隔离、保温、口服补液盐，并立即送医，带新鲜粪便样本。',
      page: { text: '查看腹泻处置', link: '/emergencies/diarrhea' }
    }
  },
  heat: {
    id: 'heat',
    result: {
      level: 'emergent',
      title: '🚨 立即急诊（中暑）',
      advice: '黄金窗口仅约 10 分钟。立即转移到阴凉处，用凉水（非冰水）打湿耳朵，提供冷水（不强迫）。同步送医。',
      page: { text: '查看中暑处置', link: '/emergencies/heatstroke' }
    }
  },
  bleeding: {
    id: 'bleeding',
    question: '出血情况？',
    options: [
      { label: '按压 10–15 分钟仍不止', next: 'bleed-severe', tag: 'emergent' },
      { label: '猫/动物咬伤（即使小伤口）', next: 'bleed-bite', tag: 'urgent' },
      { label: '指甲剪出血 / 浅表划伤', next: 'bleed-minor' }
    ]
  },
  'bleed-severe': {
    id: 'bleed-severe',
    result: {
      level: 'emergent',
      title: '🚨 立即急诊',
      advice: '按压止血同时立即送医。深部伤口需兽医清创。',
      page: { text: '查看外伤处置', link: '/emergencies/wounds' }
    }
  },
  'bleed-bite': {
    id: 'bleed-bite',
    result: {
      level: 'urgent',
      title: '当天就医',
      advice: '猫口腔细菌对兔极危险，即使小伤口也需立即就医 + 抗生素。先用生理盐水冲洗。',
      page: { text: '查看外伤处置', link: '/emergencies/wounds' }
    }
  },
  'bleed-minor': {
    id: 'bleed-minor',
    result: {
      level: 'watch',
      title: '家庭处理 + 观察',
      advice: '用止血粉/玉米淀粉按压指甲尖，或纱布按压伤口。涂薄层普通 Neosporin（不含止痛）。观察感染征象。',
      page: { text: '查看外伤处置', link: '/emergencies/wounds' }
    }
  },
  limp: {
    id: 'limp',
    question: '具体情况？',
    options: [
      { label: '后腿拖行 / 大小便失禁', next: 'spine', tag: 'emergent' },
      { label: '某肢不敢着地 / 肿胀', next: 'fracture', tag: 'emergent' }
    ]
  },
  spine: {
    id: 'spine',
    result: {
      level: 'emergent',
      title: '🚨 立即急诊（疑似脊柱骨折）',
      advice: '严格限制活动，毛巾包裹，平硬表面搬运。禁止在家夹板。',
      page: { text: '查看骨折处置', link: '/emergencies/fractures' }
    }
  },
  fracture: {
    id: 'fracture',
    result: {
      level: 'emergent',
      title: '🚨 立即急诊',
      advice: '限制活动，立即送医。禁止在家自行夹板固定。',
      page: { text: '查看骨折处置', link: '/emergencies/fractures' }
    }
  },
  neuro: {
    id: 'neuro',
    result: {
      level: 'emergent',
      title: '🚨 立即急诊',
      advice: '不要约束抽搐的兔（防脊柱骨折）。记录视频供兽医诊断。常见原因 E. cuniculi。',
      page: { text: '查看抽搐处置', link: '/emergencies/seizures' }
    }
  },
  resp: {
    id: 'resp',
    question: '呼吸情况？',
    options: [
      { label: '张口呼吸 / 发绀', next: 'resp-severe', tag: 'emergent' },
      { label: '打喷嚏 / 脓鼻涕', next: 'snuffles', tag: 'urgent' }
    ]
  },
  'resp-severe': {
    id: 'resp-severe',
    result: {
      level: 'emergent',
      title: '🚨 立即急诊（濒死信号）',
      advice: '兔是专性鼻呼吸，张口呼吸=濒死。立即送急诊。',
      page: { text: '查看呼吸问题', link: '/emergencies/respiratory' }
    }
  },
  snuffles: {
    id: 'snuffles',
    result: {
      level: 'urgent',
      title: '当天就医（细菌感染）',
      advice: '蒸汽疗法可临时缓解鼻塞。需兽医开抗生素（如恩诺沙星），不治疗会进展为肺炎。',
      page: { text: '查看呼吸问题', link: '/emergencies/respiratory' }
    }
  },
  poison: {
    id: 'poison',
    result: {
      level: 'emergent',
      title: '🚨 立即急诊',
      advice: '兔不能呕吐，绝对禁止催吐。收集植物/物品名称、摄入量、时间，立即送医。',
      page: { text: '查看中毒处置', link: '/emergencies/poisoning' }
    }
  },
  lethargy: {
    id: 'lethargy',
    result: {
      level: 'watch',
      title: '密切观察（48 小时窗口）',
      advice: '兔会隐藏病情。若 48 小时内出现拒食、排便变化、躲藏，按胃肠停滞处理。任何恶化立即就医。',
      page: { text: '查看急症总览', link: '/emergencies/' }
    }
  }
}

const path = ref<string[]>(['start'])
const current = computed(() => tree[path.value[path.value.length - 1]])

function choose(next: string) {
  path.value.push(next)
}
function reset() {
  path.value = ['start']
}
function back() {
  if (path.value.length > 1) path.value.pop()
}

const levelMeta = {
  emergent: { label: '🚨 立即急诊', cls: 'triage-emergent' },
  urgent: { label: '当天就医', cls: 'triage-urgent' },
  watch: { label: '观察', cls: 'triage-watch' }
}
</script>

<template>
  <div class="triage">
    <p class="triage-intro">
      选最贴近兔兔情况的选项，得到紧急程度和处置指引。
      <strong>本工具仅用于快速导航和紧急度判断，不替代兽医诊断。</strong>
    </p>

    <!-- 进度 -->
    <div class="triage-path" v-if="path.length > 1">
      <button class="triage-back" @click="back">← 上一步</button>
    </div>

    <!-- 问题节点 -->
    <div v-if="current.question" class="triage-q">
      <div class="triage-q-title">{{ current.question }}</div>
      <div class="triage-opts">
        <button
          v-for="(o, i) in current.options"
          :key="i"
          class="triage-opt"
          :class="o.tag ? `triage-opt-${o.tag}` : ''"
          @click="choose(o.next)"
        >
          {{ o.label }}
          <span v-if="o.tag === 'emergent'" class="triage-tag">🚨</span>
        </button>
      </div>
    </div>

    <!-- 结果节点 -->
    <div
      v-else-if="current.result"
      class="triage-result"
      :class="levelMeta[current.result.level].cls"
    >
      <div class="triage-level">
        {{ levelMeta[current.result.level].label }}
      </div>
      <div class="triage-title">{{ current.result.title }}</div>
      <p class="triage-advice">{{ current.result.advice }}</p>
      <a :href="current.result.page.link" class="triage-link">
        📖 {{ current.result.page.text }} →
      </a>
      <button class="triage-reset" @click="reset">重新评估</button>
    </div>

    <p class="triage-source">
      紧急度判断依据：House Rabbit Society、VCA、PDSA、Merck 兽医手册。
      详见各急症专题页的来源引用。
    </p>
  </div>
</template>

<style scoped>
.triage {
  border: 1px solid var(--vp-c-divider); border-radius: 12px;
  padding: 1.2rem 1.4rem; background: var(--rw-cream, #faf6ef);
  margin: 1.5rem 0;
}
.triage-intro { font-size: 0.92rem; color: var(--vp-c-text-2); margin-top: 0; }
.triage-back {
  background: transparent; border: 1px solid var(--vp-c-divider);
  padding: 0.3rem 0.8rem; border-radius: 4px; cursor: pointer;
  font-size: 0.85rem; color: var(--vp-c-text-2);
}
.triage-q-title { font-weight: 700; font-size: 1.05rem; margin: 1rem 0 0.6rem; }
.triage-opts { display: flex; flex-direction: column; gap: 0.5rem; }
.triage-opt {
  text-align: left; padding: 0.7rem 1rem; border-radius: 6px;
  border: 1px solid var(--vp-c-divider); background: var(--rw-bg-card);
  cursor: pointer; font-size: 0.95rem; transition: all 0.15s;
  display: flex; justify-content: space-between; align-items: center;
}
.triage-opt:hover { border-color: var(--rw-grass, #4a7c3f); }
.triage-opt-emergent { border-left: 4px solid var(--rw-danger); }
.triage-opt-urgent { border-left: 4px solid var(--rw-warn); }
.triage-tag { font-size: 1rem; }
.triage-result { border: 2px solid; border-radius: 8px; padding: 1.2rem; margin-top: 1rem; }
.triage-emergent { border-color: var(--rw-danger); background: var(--rw-danger-soft); }
.triage-emergent .triage-level { color: var(--rw-danger); }
.triage-urgent { border-color: var(--rw-warn); background: var(--rw-warn-soft); }
.triage-urgent .triage-level { color: var(--rw-warn); }
.triage-watch { border-color: var(--rw-grass); background: var(--rw-grass-soft); }
.triage-watch .triage-level { color: var(--rw-good-text); }
.triage-level { font-size: 0.85rem; font-weight: 700; letter-spacing: 0.05em; }
.triage-title { font-size: 1.25rem; font-weight: 800; margin: 0.3rem 0 0.6rem; }
.triage-advice { line-height: 1.7; margin: 0.5rem 0 1rem; }
.triage-link {
  display: inline-block; padding: 0.5rem 1rem; background: var(--rw-bg-card);
  border: 1px solid currentColor; border-radius: 6px; text-decoration: none;
  font-weight: 600; margin-right: 0.5rem;
}
.triage-reset {
  display: inline-block; padding: 0.5rem 1rem; background: transparent;
  border: 1px solid var(--vp-c-divider); border-radius: 6px; cursor: pointer;
  font-size: 0.9rem;
}
.triage-source { font-size: 0.78rem; color: var(--vp-c-text-2); margin-top: 1rem; }
</style>
