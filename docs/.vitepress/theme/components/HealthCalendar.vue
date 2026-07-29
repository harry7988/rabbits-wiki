<script setup lang="ts">
/**
 * HealthCalendar —— 兔兔健康日历
 *
 * 输入：当前年龄（月）、性别、是否绝育
 * 输出：未来 12 个月的关键健康节点（绝育/疫苗/体检/换毛/牙检）
 *
 * 来源：
 * - 绝育时机：HRS（公 3.5–5 月，母 4–6 月）
 * - 疫苗：国内 RHD1 + 巴氏杆菌（每年 2–3 次）；国外 RHD1+RHD2+粘液瘤
 * - 体检：成兔每年，老年兔每 6 个月
 * - 牙检：每年数次（侏儒品种）
 * - 换毛：春秋大换毛 + 持续小换毛
 */
import { ref, computed } from 'vue'

const ageMonths = ref<number>(3)
const sex = ref<'male' | 'female'>('female')
const neutered = ref<boolean>(false)
const indoor = ref<boolean>(true)

interface Event {
  when: string          // 时间描述
  ageAtEvent: number    // 几月龄
  category: 'surgery' | 'vaccine' | 'checkup' | 'grooming' | 'dental' | 'urgent'
  title: string
  detail: string
  done?: boolean        // 已过窗口期
}

const events = computed<Event[]>(() => {
  const evts: Event[] = []
  const age = ageMonths.value
  const isNeutered = neutered.value

  // 1. 绝育（最优先）
  const neuterWindow = sex.value === 'female' ? { min: 4, max: 6, label: '4–6 月龄' } : { min: 3.5, max: 5, label: '3.5–5 月龄' }
  if (!isNeutered) {
    const inWindow = age >= neuterWindow.min && age <= neuterWindow.max
    const past = age > neuterWindow.max
    evts.push({
      when: neuterWindow.label,
      ageAtEvent: (neuterWindow.min + neuterWindow.max) / 2,
      category: 'surgery',
      title: sex.value === 'female' ? '🍼 母兔绝育（防子宫癌）' : '🍼 公兔绝育',
      detail: sex.value === 'female'
        ? '强烈建议：未绝育母兔子官癌风险随年龄增至 80%。必须找懂兔麻醉的异宠医生'
        : '改善行为（喷尿/攻击），便于合笼。绝育后等 4–6 周激素稳定',
      done: past
    })
    if (past) {
      evts[evts.length - 1].title = '⚠️ ' + evts[evts.length - 1].title + '（已过最佳窗口，尽快补做）'
    }
  }

  // 2. 球虫粪检（幼兔必做）
  if (age < 7) {
    evts.push({
      when: '现在（如未做过）',
      ageAtEvent: age,
      category: 'urgent',
      title: '🐛 球虫粪便检测',
      detail: '幼兔头号杀手。带新鲜粪便去异宠医院粪检，按医嘱驱球虫',
      done: false
    })
  }

  // 3. 疫苗（每年）
  const nextVaccineMonth = Math.ceil(age / 12) * 12 + (age % 12 === 0 ? 0 : 0)
  // 简化：建议当前或下次"年度疫苗"
  evts.push({
    when: '每年 2–3 次（国内）',
    ageAtEvent: Math.ceil(age / 4) * 4,
    category: 'vaccine',
    title: '💉 兔瘟（RHD）+ 巴氏杆菌疫苗',
    detail: indoor.value
      ? '室内兔风险较低但仍有必要（病毒可经衣物/昆虫传播）。注意：兔瘟 2 型（RHD2）近年传入国内，咨询兽医最新方案'
      : '室外/接触其他兔的兔——疫苗尤其重要'
  })

  // 4. 年度体检
  const isSenior = age >= 60  // 5 岁
  evts.push({
    when: isSenior ? '每 6 个月' : '每年',
    ageAtEvent: isSenior ? age + 6 : Math.ceil(age / 12) * 12,
    category: 'checkup',
    title: isSenior ? '🩺 老年兔体检（每半年）' : '🩺 年度体检',
    detail: isSenior
      ? '老年兔建议每 6 个月体检一次（关节炎、肿瘤、牙病高发）'
      : '体重、牙齿、心肺、腹部触诊、年度血检'
  })

  // 5. 牙检
  evts.push({
    when: '每年数次（侏儒品种更频繁）',
    ageAtEvent: age + 6,
    category: 'dental',
    title: '🦷 牙齿检查',
    detail: '兔牙终生生长，牙病是 GI Stasis 隐性诱因。侏儒品种（侏儒兔/垂耳/狮子）因颅面紧凑尤其高发'
  })

  // 6. 换毛期梳理提醒
  const month = new Date().getMonth() + 1
  const isSheddingSeason = [3, 4, 5, 9, 10, 11].includes(month)
  evts.push({
    when: isSheddingSeason ? '现在（换毛季）' : '春秋大换毛',
    ageAtEvent: age,
    category: 'grooming',
    title: '✂️ 换毛期每日梳毛',
    detail: '兔不能吐毛球，换毛期必须每日梳毛防 GI Stasis。长毛兔（安哥拉/狮子）全年每日梳'
  })

  // 排序：按月龄
  return evts.sort((a, b) => a.ageAtEvent - b.ageAtEvent)
})

const catMeta = {
  surgery: { label: '手术', cls: 'c-surgery', icon: '🍼' },
  vaccine: { label: '疫苗', cls: 'c-vaccine', icon: '💉' },
  checkup: { label: '体检', cls: 'c-checkup', icon: '🩺' },
  grooming: { label: '护理', cls: 'c-grooming', icon: '✂️' },
  dental: { label: '牙科', cls: 'c-dental', icon: '🦷' },
  urgent: { label: '紧急', cls: 'c-urgent', icon: '🚨' }
}
</script>

<template>
  <div class="hc-calendar">
    <div class="hc-inputs">
      <div class="hc-field">
        <label>年龄（月）</label>
        <input v-model.number="ageMonths" type="number" min="1" max="180" step="1"/>
      </div>
      <div class="hc-field">
        <label>性别</label>
        <select v-model="sex">
          <option value="female">母兔</option>
          <option value="male">公兔</option>
        </select>
      </div>
      <div class="hc-field hc-check">
        <label><input type="checkbox" v-model="neutered"/> 已绝育</label>
      </div>
      <div class="hc-field hc-check">
        <label><input type="checkbox" v-model="indoor"/> 纯室内</label>
      </div>
    </div>

    <div class="hc-timeline">
      <div v-for="(e, i) in events" :key="i" class="hc-event" :class="[catMeta[e.category].cls, { 'is-done': e.done }]">
        <div class="hc-event-icon">{{ catMeta[e.category].icon }}</div>
        <div class="hc-event-body">
          <div class="hc-event-head">
            <span class="hc-event-title">{{ e.title }}</span>
            <span class="hc-event-when">{{ e.when }}</span>
          </div>
          <div class="hc-event-detail">{{ e.detail }}</div>
        </div>
      </div>
    </div>

    <div class="hc-legend">
      <span class="hc-leg c-surgery">🍼 手术</span>
      <span class="hc-leg c-vaccine">💉 疫苗</span>
      <span class="hc-leg c-checkup">🩺 体检</span>
      <span class="hc-leg c-dental">🦷 牙科</span>
      <span class="hc-leg c-grooming">✂️ 护理</span>
      <span class="hc-leg c-urgent">🚨 紧急</span>
    </div>

    <p class="hc-source">
      📖 来源：<a href="https://rabbit.org/care/spay-for-health/" target="_blank" rel="noopener">HRS 绝育</a> ·
      <a href="https://vcahospitals.com/know-your-pet/spaying-or-neutering-your-rabbit" target="_blank" rel="noopener">VCA 绝育时机</a> ·
      <a href="https://vcahospitals.com/know-your-pet/coccidia-in-rabbits" target="_blank" rel="noopener">VCA 球虫</a> ·
      详见 <a href="./../care/spay-neuter">绝育专题</a> · <a href="./../care/daily-care">日常护理</a>
    </p>
  </div>
</template>

<style scoped>
.hc-calendar {
  border: 1px solid var(--vp-c-divider); border-radius: 12px;
  padding: 1.2rem 1.4rem; background: var(--rw-cream, #faf6ef);
  margin: 1.5rem 0;
}
.hc-inputs {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.8rem; margin-bottom: 1.2rem;
}
.hc-field { display: flex; flex-direction: column; gap: 0.25rem; }
.hc-field label { font-size: 0.82rem; font-weight: 600; color: var(--vp-c-text-2); }
.hc-field input, .hc-field select {
  padding: 0.4rem 0.5rem; border: 1px solid var(--vp-c-divider);
  border-radius: 6px; font-size: 0.95rem; background: var(--rw-bg-card);
}
.hc-check { justify-content: flex-end; }
.hc-check label { display: flex; align-items: center; gap: 0.4rem; cursor: pointer; padding-top: 1.3rem; }

.hc-timeline { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1rem; }
.hc-event {
  display: flex; gap: 0.8rem; padding: 0.8rem 1rem; border-radius: 8px;
  background: var(--rw-bg-card); border-left: 4px solid var(--vp-c-divider);
}
.hc-event-icon { font-size: 1.4rem; flex-shrink: 0; line-height: 1.2; }
.hc-event-body { flex: 1; }
.hc-event-head { display: flex; justify-content: space-between; gap: 0.8rem; margin-bottom: 0.3rem; flex-wrap: wrap; }
.hc-event-title { font-weight: 700; font-size: 0.95rem; }
.hc-event-when { font-size: 0.78rem; color: var(--vp-c-text-2); white-space: nowrap; }
.hc-event-detail { font-size: 0.85rem; color: var(--vp-c-text-2); line-height: 1.6; }

.c-surgery { border-left-color: var(--rw-danger); }
.c-vaccine { border-left-color: var(--rw-info); }
.c-checkup { border-left-color: var(--rw-grass); }
.c-dental { border-left-color: var(--rw-bark); }
.c-grooming { border-left-color: var(--rw-warn); }
.c-urgent { border-left-color: var(--rw-danger); background: var(--rw-danger-soft); }

.is-done { opacity: 0.6; }
.is-done .hc-event-title::after { content: ' ✓ 已过窗口'; font-size: 0.75rem; color: var(--rw-danger); }

.hc-legend { display: flex; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 0.8rem; }
.hc-leg { font-size: 0.78rem; padding: 0.2rem 0.6rem; border-radius: 999px; background: var(--rw-bg-card); border-left: 3px solid; }

.hc-source { font-size: 0.78rem; color: var(--vp-c-text-2); line-height: 1.6; }
.hc-source a { color: var(--rw-grass, #4a7c3f); word-break: break-all; }
</style>
