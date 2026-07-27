<script setup lang="ts">
/**
 * SourceCard —— 单条来源引用卡片
 * 这是本站"版权与可信度"的核心载体。
 * 每一个医疗/生理陈述的可溯源来源，都通过 SourceCard 显式展示。
 *
 * Props:
 *  - title:    原文/原页面标题
 *  - author:   作者/机构（HRS / Medirabbit / Merck 等）
 *  - url:      原文 URL（必须真实可达，撰稿人需亲自访问验证）
 *  - accessed: 访问日期 YYYY-MM-DD
 *  - level:    来源等级 'vet' | 'org' | 'exp'（兽医权威/专业组织/饲主经验）
 *  - note:     可选，引用内容说明
 */
interface Props {
  title: string
  author?: string
  url: string
  accessed?: string
  level?: 'vet' | 'org' | 'exp'
  note?: string
}
const props = withDefaults(defineProps<Props>(), {
  level: 'vet',
  author: '',
  accessed: '',
  note: ''
})

const levelMap = {
  vet: { label: '🟢 兽医权威', cls: 'vet' },
  org: { label: '🟡 专业组织', cls: 'org' },
  exp: { label: '🟠 饲主经验', cls: 'exp' }
} as const

const lv = levelMap[props.level]
let domain = ''
try { domain = new URL(props.url).hostname.replace(/^www\./, '') } catch { domain = props.url }
</script>

<template>
  <div class="source-card">
    <div class="src-title">
      {{ title }}
      <span class="src-badge" :class="lv.cls">{{ lv.label }}</span>
    </div>
    <div class="src-meta">
      <span v-if="author">{{ author }} · </span>
      <a :href="url" target="_blank" rel="noopener noreferrer">{{ domain }}</a>
      <span v-if="accessed"> · 访问于 {{ accessed }}</span>
    </div>
    <div v-if="note" class="src-meta" style="color: var(--vp-c-text-2);">
      {{ note }}
    </div>
  </div>
</template>
