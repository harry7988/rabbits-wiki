<script setup lang="ts">
/**
 * DehydrationCheck —— 脱水严重度评估工具
 *
 * 三个临床常用脱水指标：
 * 1. 皮肤回弹（skin tenting）—— 捏起肩胛间皮肤，看回弹速度
 * 2. 牙龈/口腔黏膜 —— 黏稠 vs 湿润
 * 3. 眼睛 —— 明亮凹陷 vs 正常
 *
 * 评估结果分为：轻度（家庭补液）/ 中度（就医）/ 重度（急诊）
 * 来源：VetSark / Supreme Pet Foods 兽医继续教育
 */
import { ref, computed } from 'vue'

type Opt = { label: string; score: number; desc: string }

const skin = ref<number>(0)
const gums = ref<number>(0)
const eyes = ref<number>(0)
const eating = ref<number>(0)  // 是否拒食

const skinOpts: Opt[] = [
  { label: '皮肤立即回弹', score: 0, desc: '正常' },
  { label: '回弹稍慢（<2 秒）', score: 1, desc: '轻度脱水' },
  { label: '回弹明显延迟（保持"帐篷"状）', score: 2, desc: '中度脱水' },
  { label: '捏起的皮肤久久不平复', score: 3, desc: '重度脱水' }
]

const gumOpts: Opt[] = [
  { label: '口腔黏膜湿润、粉红', score: 0, desc: '正常' },
  { label: '黏膜略黏', score: 1, desc: '轻度脱水' },
  { label: '黏膜发黏、颜色发白或深', score: 2, desc: '中度脱水' },
  { label: '干燥、发黏、苍白的牙龈', score: 3, desc: '重度脱水' }
]

const eyeOpts: Opt[] = [
  { label: '眼睛明亮、不凹陷', score: 0, desc: '正常' },
  { label: '眼睛稍显无神', score: 1, desc: '观察' },
  { label: '眼睛轻度凹陷', score: 2, desc: '中度脱水' },
  { label: '眼睛明显凹陷、无光', score: 3, desc: '重度脱水' }
]

const eatingOpts: Opt[] = [
  { label: '正常进食饮水', score: 0, desc: '' },
  { label: '食欲下降但仍进食', score: 1, desc: '' },
  { label: '完全拒食或拒饮', score: 3, desc: '急症信号' }
]

const total = computed(() => skin.value + gums.value + eyes.value + eating.value)

// 运行时读取 CSS 变量（响应深/浅色模式切换）
function cssVar(name: string): string {
  if (typeof window === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

const result = computed(() => {
  const s = total.value
  if (s === 0) return {
    level: '无明显脱水迹象',
    colorKey: 'good',
    advice: '保持现状。提供充足饮水（多个水碗），观察排泄和食欲。',
    vet: false
  }
  if (s <= 3) return {
    level: '轻度脱水',
    colorKey: 'warn',
    advice: '可在家用无味 Pedialyte（稀释后）少量多次口服补液。同时排查原因（中暑、腹泻、GI Stasis）。若 6 小时内无改善或出现拒食，必须就医。',
    vet: false
  }
  if (s <= 6) return {
    level: '中度脱水 —— 建议就医',
    colorKey: 'warn',
    advice: '口服补液已不够。需要兽医评估是否皮下输液（LRS）。同步排查病因（腹泻、GI Stasis、中暑）。',
    vet: true
  }
  return {
    level: '重度脱水 —— 立即急诊',
    colorKey: 'danger',
    advice: '危及生命。立即送异宠急诊兽医，途中用湿毛巾降温（如怀疑中暑）或保温（如体温低）。需要静脉/皮下输液 + 病因治疗。',
    vet: true
  }
})
</script>

<template>
  <div class="dh-check">
    <p class="dh-intro">勾选兔兔当前的状态。本工具基于兽医临床的脱水评估指标，<strong>仅供判断紧急程度，不能替代兽医诊断</strong>。</p>

    <div class="dh-q">
      <div class="dh-q-title">1. 皮肤回弹（捏起肩胛间的皮肤松开）</div>
      <label v-for="(o, i) in skinOpts" :key="i" class="dh-opt">
        <input type="radio" :value="i" v-model="skin" />
        <span>{{ o.label }}</span>
        <small v-if="o.desc"> — {{ o.desc }}</small>
      </label>
    </div>

    <div class="dh-q">
      <div class="dh-q-title">2. 牙龈/口腔黏膜（轻翻上唇）</div>
      <label v-for="(o, i) in gumOpts" :key="i" class="dh-opt">
        <input type="radio" :value="i" v-model="gums" />
        <span>{{ o.label }}</span>
        <small v-if="o.desc"> — {{ o.desc }}</small>
      </label>
    </div>

    <div class="dh-q">
      <div class="dh-q-title">3. 眼睛</div>
      <label v-for="(o, i) in eyeOpts" :key="i" class="dh-opt">
        <input type="radio" :value="i" v-model="eyes" />
        <span>{{ o.label }}</span>
        <small v-if="o.desc"> — {{ o.desc }}</small>
      </label>
    </div>

    <div class="dh-q">
      <div class="dh-q-title">4. 进食饮水</div>
      <label v-for="(o, i) in eatingOpts" :key="i" class="dh-opt">
        <input type="radio" :value="i" v-model="eating" />
        <span>{{ o.label }}</span>
        <small v-if="o.desc"> — {{ o.desc }}</small>
      </label>
    </div>

    <div class="dh-result" :class="`dh-result-${result.colorKey}`">
      <div class="dh-result-level">{{ result.level }}</div>
      <div class="dh-result-score">评估分数：{{ total }} / 12</div>
      <p class="dh-advice">{{ result.advice }}</p>
      <div v-if="result.vet" class="dh-vet">🚨 建议尽快联系懂兔的异宠兽医</div>
    </div>

    <p class="dh-source">
      📖 评估指标来源：<a href="https://vetsark.com/blog/how-do-you-save-a-dehydrated-rabbit-806" target="_blank" rel="noopener">VetSark — How Do You Save a Dehydrated Rabbit</a> ·
      <a href="https://supremepetfoods.com/wp-content/uploads/2020/03/FLUID-THERAPY-IN-RABBIT-PATIENTS.pdf" target="_blank" rel="noopener">Supreme Pet Foods — Fluid Therapy in Rabbit Patients (PDF)</a>
    </p>
  </div>
</template>

<style scoped>
.dh-check {
  border: 1px solid var(--vp-c-divider); border-radius: 12px;
  padding: 1.2rem 1.4rem; background: var(--rw-cream, #faf6ef);
  margin: 1.5rem 0;
}
.dh-intro { font-size: 0.92rem; color: var(--vp-c-text-2); margin-top: 0; }
.dh-q { margin: 1rem 0; }
.dh-q-title { font-weight: 700; margin-bottom: 0.4rem; }
.dh-opt {
  display: flex; align-items: baseline; gap: 0.5rem;
  padding: 0.3rem 0; font-size: 0.92rem; cursor: pointer;
}
.dh-opt input { margin: 0; }
.dh-opt small { color: var(--vp-c-text-2); }
.dh-result {
  background: var(--rw-bg-card); border: 2px solid; border-radius: 8px;
  padding: 1rem 1.2rem; margin-top: 1rem;
}
.dh-result-good { border-color: var(--rw-grass); }
.dh-result-good .dh-result-level { color: var(--rw-good-text); }
.dh-result-warn { border-color: var(--rw-warn); }
.dh-result-warn .dh-result-level { color: var(--rw-warn); }
.dh-result-danger { border-color: var(--rw-danger); }
.dh-result-danger .dh-result-level { color: var(--rw-danger); }
.dh-result-level { font-size: 1.3rem; font-weight: 800; }
.dh-result-score { font-size: 0.85rem; color: var(--vp-c-text-2); margin-bottom: 0.5rem; }
.dh-advice { margin: 0.5rem 0; font-size: 0.95rem; line-height: 1.7; }
.dh-vet {
  margin-top: 0.5rem; padding: 0.5rem 0.8rem;
  background: var(--rw-danger-soft, #fdecea); border-radius: 4px;
  font-weight: 600; color: var(--rw-text-on-danger);
}
.dh-source { font-size: 0.82rem; color: var(--vp-c-text-2); margin-top: 0.8rem; }
.dh-source a { color: var(--rw-grass, #4a7c3f); word-break: break-all; }
</style>
