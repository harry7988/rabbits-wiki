<script setup lang="ts">
/**
 * BreedCard —— 品种信息卡
 * 用法：
 * <BreedCard name="荷兰垂耳兔" origin="荷兰" weight="0.9–1.8 kg" lifespan="7–10 年" ... />
 */
interface Props {
  name: string
  weight?: string
  lifespan?: string
  origin?: string
  temperament?: string
  grooming?: string
  arba?: string
}
defineProps<Props>()
</script>

<template>
  <div class="breed-card">
    <div class="bc-header">🐇 {{ name }}</div>
    <div class="bc-grid">
      <div class="bc-item" v-if="weight"><span class="k">成年体重</span><span class="v">{{ weight }}</span></div>
      <div class="bc-item" v-if="lifespan"><span class="k">预期寿命</span><span class="v">{{ lifespan }}</span></div>
      <div class="bc-item" v-if="origin"><span class="k">起源地</span><span class="v">{{ origin }}</span></div>
      <div class="bc-item" v-if="temperament"><span class="k">性格</span><span class="v">{{ temperament }}</span></div>
      <div class="bc-item" v-if="grooming"><span class="k">护理需求</span><span class="v">{{ grooming }}</span></div>
      <div class="bc-item" v-if="arba"><span class="k">ARBA 认可</span><span class="v">{{ arba }}</span></div>
    </div>
    <div style="padding:0 1.1rem 0.9rem 1.1rem;">
      <slot />
    </div>
  </div>
</template>
