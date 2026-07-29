<script setup lang="ts">
/**
 * EmergencyCard —— 紧急联系信息卡（用户本地保存）
 *
 * 用户填写自己兔兔的：兽医姓名、电话、地址、急诊医院、过敏史、保险等
 * 数据存在浏览器 localStorage（不上传服务器，保护隐私）
 *
 * 提醒：每页都可放，会反复强调"今天就把兔科兽医找好"
 */
import { ref, onMounted, watch } from 'vue'

interface Info {
  vetName: string
  vetPhone: string
  vetAddress: string
  erName: string       // 24h 急诊
  erPhone: string
  rabbitName: string
  rabbitAge: string
  rabbitWeight: string
  neutered: boolean
  allergies: string    // 过敏/禁忌
  notes: string
}

const STORAGE_KEY = 'rabbits-wiki-emergency-card'

const info = ref<Info>({
  vetName: '', vetPhone: '', vetAddress: '',
  erName: '', erPhone: '',
  rabbitName: '', rabbitAge: '', rabbitWeight: '', neutered: false,
  allergies: '', notes: ''
})

const saved = ref(false)
const expanded = ref(false)

onMounted(() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      info.value = { ...info.value, ...JSON.parse(stored) }
      expanded.value = true
    }
  } catch {}
})

watch(info, (val) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    saved.value = true
    setTimeout(() => saved.value = false, 1500)
  } catch {}
}, { deep: true })

function print() {
  window.print()
}
</script>

<template>
  <div class="ec-card">
    <div class="ec-header" @click="expanded = !expanded">
      <span class="ec-icon">🚨</span>
      <div class="ec-title">
        <strong>紧急联系卡</strong>
        <small>{{ expanded ? '点击收起' : '今天就把兔科兽医信息填好——急症不等人' }}</small>
      </div>
      <span class="ec-toggle">{{ expanded ? '−' : '+' }}</span>
    </div>

    <div v-show="expanded" class="ec-body">
      <div class="ec-section">
        <h4>🏥 我的兔科兽医</h4>
        <div class="ec-grid">
          <label>医院/医生<input v-model="info.vetName" placeholder="如：XX 异宠医院 / 张医生"/></label>
          <label>电话<input v-model="info.vetPhone" placeholder="含区号"/></label>
          <label class="ec-wide">地址<input v-model="info.vetAddress" placeholder="完整地址"/></label>
        </div>
      </div>

      <div class="ec-section">
        <h4>🚑 24h 急诊医院（如不同）</h4>
        <div class="ec-grid">
          <label>急诊医院<input v-model="info.erName"/></label>
          <label>急诊电话<input v-model="info.erPhone"/></label>
        </div>
      </div>

      <div class="ec-section">
        <h4>🐇 我的兔兔</h4>
        <div class="ec-grid">
          <label>名字<input v-model="info.rabbitName"/></label>
          <label>年龄<input v-model="info.rabbitAge" placeholder="如：2 岁 3 月"/></label>
          <label>体重<input v-model="info.rabbitWeight" placeholder="如：1.8 kg"/></label>
          <label class="ec-checkbox"><input type="checkbox" v-model="info.neutered"/><span>已绝育</span></label>
        </div>
        <label class="ec-wide-block">过敏史 / 用药禁忌 / 既往病史<br/>
          <textarea v-model="info.allergies" rows="2" placeholder="如：对青霉素类禁用；曾患球虫病..."/>
        </label>
        <label class="ec-wide-block">其他备注<br/>
          <textarea v-model="info.notes" rows="2"/>
        </label>
      </div>

      <div class="ec-actions">
        <span class="ec-saved" :class="{show: saved}">✓ 已自动保存到本机</span>
        <button @click="print">🖨️ 打印张贴（贴冰箱上）</button>
      </div>

      <div class="ec-privacy">
        🔒 数据仅存于本浏览器（localStorage），不上传任何服务器。换浏览器/设备需重新填写。
      </div>
    </div>
  </div>
</template>

<style scoped>
.ec-card {
  border: 2px solid var(--rw-danger, #c0392b); border-radius: 10px;
  background: linear-gradient(0deg, var(--rw-danger-soft, #fdecea), #fff);
  margin: 1.3rem 0; overflow: hidden;
}
.ec-header {
  display: flex; align-items: center; gap: 0.7rem;
  padding: 0.9rem 1.2rem; cursor: pointer; user-select: none;
}
.ec-icon { font-size: 1.4rem; }
.ec-title { flex: 1; }
.ec-title strong { display: block; font-size: 1.05rem; }
.ec-title small { color: var(--vp-c-text-2); font-size: 0.8rem; }
.ec-toggle { font-size: 1.6rem; color: var(--rw-danger, #c0392b); }
.ec-body { padding: 0 1.2rem 1.2rem; }
.ec-section { margin-bottom: 1rem; }
.ec-section h4 { margin: 0 0 0.5rem; font-size: 0.95rem; color: var(--rw-danger, #c0392b); }
.ec-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.5rem;
}
.ec-grid label, .ec-wide-block {
  display: flex; flex-direction: column; gap: 0.2rem;
  font-size: 0.78rem; font-weight: 600; color: var(--vp-c-text-2);
}
.ec-wide { grid-column: 1 / -1; }
.ec-wide-block { display: block; margin-top: 0.5rem; }
.ec-grid input, .ec-wide-block textarea {
  padding: 0.4rem 0.5rem; border: 1px solid var(--vp-c-divider);
  border-radius: 6px; font-size: 0.9rem; background: var(--rw-bg-card); font-family: inherit;
  color: var(--vp-c-text-1); font-weight: 400;
}
.ec-wide-block textarea { width: 100%; resize: vertical; }
.ec-checkbox { flex-direction: row; align-items: center; gap: 0.4rem; padding-top: 1.3rem; }
.ec-checkbox span { font-size: 0.9rem; color: var(--vp-c-text-1); }
.ec-actions {
  display: flex; align-items: center; gap: 0.8rem;
  margin-top: 0.8rem; flex-wrap: wrap;
}
.ec-saved {
  font-size: 0.82rem; color: var(--rw-good-text); opacity: 0; transition: opacity 0.3s;
}
.ec-saved.show { opacity: 1; }
.ec-actions button {
  padding: 0.45rem 0.9rem; border: 1px solid var(--rw-danger, #c0392b);
  background: var(--rw-danger, #c0392b); color: var(--vp-c-white, #fff);
  border-radius: 6px; cursor: pointer; font-family: inherit; font-size: 0.85rem; font-weight: 600;
}
.ec-actions button:hover { background: var(--rw-danger); }
.ec-privacy {
  margin-top: 0.7rem; font-size: 0.75rem; color: var(--vp-c-text-2);
}
@media print {
  .ec-header, .ec-actions, .ec-privacy, .ec-toggle { display: none; }
  .ec-card { border: 2px solid var(--vp-c-text-1); }
  .ec-body { display: block !important; padding: 1rem; }
}
</style>
