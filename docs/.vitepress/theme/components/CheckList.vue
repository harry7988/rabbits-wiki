<script setup lang="ts">
/**
 * CheckList —— 可勾选清单（localStorage 本地保存）
 *
 * 用于"新兔到家准备清单"等购物/准备场景：
 * - 勾一项少一项，数据只存本浏览器（不上传）
 * - 可打印（打印样式已优化）
 *
 * 用法：
 * <CheckList id="new-rabbit-supplies" :items="[
 *   { name: '提摩西草', note: '第一/二茬带茎', must: true },
 *   { name: '苜蓿草', note: '幼兔用', must: false }
 * ]" />
 */
import { ref, onMounted, watch } from 'vue'

interface Item {
  name: string
  note?: string
  must?: boolean      // 必需 vs 进阶
}

const props = defineProps<{
  id: string          // localStorage key 后缀
  items: Item[]
}>()

const STORAGE_KEY = `rabbits-wiki-checklist-${props.id}`
const checked = ref<Set<number>>(new Set())

onMounted(() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) checked.value = new Set(JSON.parse(stored))
  } catch {}
})

watch(checked, (val) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...val])) } catch {}
}, { deep: true })

function toggle(i: number) {
  const next = new Set(checked.value)
  if (next.has(i)) next.delete(i); else next.add(i)
  checked.value = next
}

const done = () => checked.value.size
const total = () => props.items.length
</script>

<template>
  <div class="rw-checklist">
    <div class="cl-progress">
      <span>{{ done() }} / {{ total() }} 已备齐</span>
      <span v-if="done() === total()" class="cl-done-mark">全部备齐 ✓</span>
    </div>
    <ul class="cl-list">
      <li v-for="(item, i) in items" :key="i">
        <button
          class="cl-item"
          :class="{ 'is-checked': checked.has(i) }"
          @click="toggle(i)"
          :aria-pressed="checked.has(i)"
        >
          <span class="cl-box" aria-hidden="true"></span>
          <span class="cl-name">
            <span v-if="item.must" class="cl-must" title="必需品">必</span>
            {{ item.name }}
          </span>
          <span v-if="item.note" class="cl-note">{{ item.note }}</span>
        </button>
      </li>
    </ul>
    <p class="cl-privacy">🔒 勾选进度只存在你的浏览器里，换设备需重新勾。</p>
  </div>
</template>

<style scoped>
.rw-checklist {
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  padding: 1.1rem 1.2rem 0.9rem;
  background: var(--rw-bg-card);
  margin: 1.4rem 0;
}
.cl-progress {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: 0.7rem;
}
.cl-done-mark { color: var(--rw-grass); }
.cl-list { list-style: none; margin: 0; padding: 0; }
.cl-list li + li { border-top: 1px solid var(--rw-line); }
.cl-item {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.55rem 0.4rem;
  margin: 0 -0.4rem;
  border-radius: 6px;
  font-family: inherit;
  font-size: 0.94rem;
  color: var(--vp-c-text-1);
  transition: background-color 0.15s ease;
}
.cl-item:hover { background: var(--rw-hover-bg); }
.cl-item:focus-visible {
  outline: 2px solid var(--rw-grass);
  outline-offset: 2px;
}
.cl-box {
  flex-shrink: 0;
  width: 16px; height: 16px;
  border: 1.5px solid var(--vp-c-text-3, var(--vp-c-text-2));
  border-radius: 4px;
  position: relative;
  top: 2px;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}
.is-checked .cl-box {
  background: var(--rw-grass);
  border-color: var(--rw-grass);
}
.is-checked .cl-box::after {
  content: '';
  position: absolute;
  left: 4px; top: 1px;
  width: 5px; height: 9px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
.cl-name { font-weight: 600; }
.is-checked .cl-name {
  color: var(--vp-c-text-3, var(--vp-c-text-2));
  text-decoration: line-through;
  text-decoration-color: var(--vp-c-divider);
}
.cl-must {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--rw-danger);
  border: 1px solid var(--rw-danger-border);
  border-radius: 4px;
  padding: 0 0.3rem;
  margin-right: 0.3rem;
  vertical-align: 1px;
}
.cl-note {
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  margin-left: 0.2rem;
}
.cl-privacy {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  margin: 0.8rem 0 0;
}
@media print {
  .cl-progress, .cl-privacy { display: none; }
  .rw-checklist { border: 1px solid #999; }
}
</style>
