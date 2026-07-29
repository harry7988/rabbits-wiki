<script setup lang="ts">
/**
 * PlantSafetyChecker —— 有毒植物查询器
 *
 * 数据来源（每条植物都标注）：
 * - Cornell University Poisonous Plants Database (poisonousplants.ansci.cornell.edu)
 * - House Rabbit Society 毒植物清单 (rabbit.org/health/poisonous-plants)
 * - RWAF 毒植物清单
 *
 * 严格立场：
 * - "未列入数据库" ≠ "安全" —— 仅本数据库收录的植物可判断
 * - 任何植物的毒性受部位、季节、剂量、个体影响
 * - 误食任何植物后若出现症状，立即就医
 */
import { ref, computed } from 'vue'

interface Plant {
  name: string         // 中文名
  latin: string        // 拉丁名
  aliases: string[]    // 别名/英文名
  toxicity: 'high' | 'medium' | 'low' | 'safe'
  parts: string        // 有毒部位
  toxin: string        // 毒素
  symptoms: string     // 症状
  source: string       // 来源 URL
}

const plants: Plant[] = [
  // === 高毒（致命） ===
  {
    name: '百合', latin: 'Lilium spp.', aliases: ['lily', 'Easter lily'],
    toxicity: 'high', parts: '所有部位（花、叶、茎、根、花粉、 even 水）',
    toxin: '多种毒素（具体未完全阐明）',
    symptoms: '兔对百合的敏感性文献较少（猫已确证极毒）。保守视为高毒：拒食、嗜睡、肾衰',
    source: 'https://rabbit.org/health/poisonous-plants/'
  },
  {
    name: '鳄梨/牛油果', latin: 'Persea americana', aliases: ['avocado'],
    toxicity: 'high', parts: '叶、皮、籽、果肉',
    toxin: 'persin（甘油酯毒素）',
    symptoms: '心肌坏死、呼吸窘迫、心力衰竭、死亡。对兔 LD50 极低',
    source: 'https://www.merckvetmanual.com/toxicology/avocado-toxicosis/avocado-toxicosis-in-animals'
  },
  {
    name: '巧克力/可可', latin: 'Theobroma cacao', aliases: ['chocolate', 'cocoa'],
    toxicity: 'high', parts: '可可豆、巧克力制品',
    toxin: 'theobromine（甲基黄嘌呤）+ 咖啡因',
    symptoms: '心动过速、心律失常、震颤、惊厥、死亡。兔代谢慢于人类',
    source: 'https://www.merckvetmanual.com/toxicology/chocolate-toxicosis/chocolate-toxicosis-in-animals'
  },
  {
    name: '洋葱/大蒜/韭菜', latin: 'Allium spp.', aliases: ['onion', 'garlic', 'leek', 'chive'],
    toxicity: 'high', parts: '所有部位（鲜/干/粉）',
    toxin: '正丙基二硫化物（N-propyl disulfide）等',
    symptoms: '氧化性溶血性贫血（红细胞破坏）、Heinz 小体、虚弱、黏膜苍白、死亡',
    source: 'https://www.merckvetmanual.com/toxicology/onion-and-garlic-toxicosis/onion-and-garlic-toxicosis-in-animals'
  },
  {
    name: '杜鹃花', latin: 'Rhododendron spp.', aliases: ['azalea', 'rhododendron'],
    toxicity: 'high', parts: '叶、花、花蜜',
    toxin: 'grayanotoxins（木藜芦毒素）',
    symptoms: '呕吐（兔不能吐）、流涎、心律失常、低血压、惊厥、死亡',
    source: 'https://poisonousplants.ansci.cornell.edu/animals/sheep/rhododendron.html'
  },
  {
    name: '夹竹桃', latin: 'Nerium oleander', aliases: ['oleander'],
    toxicity: 'high', parts: '所有部位（干枯仍毒）',
    toxin: 'cardenolides（强心苷）',
    symptoms: '心律失常、房室传导阻滞、死亡。极小剂量致命',
    source: 'https://poisonousplants.ansci.cornell.edu/animals/horses/oleander.html'
  },
  {
    name: '铃兰', latin: 'Convallaria majalis', aliases: ['lily of the valley'],
    toxicity: 'high', parts: '所有部位（水也含毒）',
    toxin: 'cardenolides（强心苷）',
    symptoms: '心律失常、呕吐（兔不能）、腹泻、惊厥、死亡',
    source: 'https://rabbit.org/health/poisonous-plants/'
  },
  {
    name: '毛地黄', latin: 'Digitalis purpurea', aliases: ['foxglove'],
    toxicity: 'high', parts: '叶、花、籽',
    toxin: 'cardiac glycosides（地高辛类）',
    symptoms: '心律失常、房室传导阻滞、死亡',
    source: 'https://poisonousplants.ansci.cornell.edu/animals/horses/digitalis.html'
  },
  {
    name: '毒芹/水毒芹', latin: 'Cicuta spp. / Conium maculatum', aliases: ['water hemlock', 'poison hemlock'],
    toxicity: 'high', parts: '所有部位（根最毒）',
    toxin: 'cicutoxin（毒芹毒素）、coniine（毒芹碱）',
    symptoms: '迅速发作强直-阵挛性惊厥、呼吸衰竭、死亡（常常来不及救治）',
    source: 'https://poisonousplants.ansci.cornell.edu/animals/cattle/cicuta.html'
  },
  {
    name: '龙葵/颠茄', latin: 'Solanum dulcamara / Atropa belladonna', aliases: ['nightshade', 'deadly nightshade', 'bittersweet'],
    toxicity: 'high', parts: '浆果、叶、茎',
    toxin: 'solanine、tropane 生物碱（阿托品、东莨菪碱）',
    symptoms: '瞳孔散大、心动过速、幻觉、惊厥、死亡',
    source: 'https://poisonousplants.ansci.cornell.edu/animals/cattle/solanum.html'
  },
  {
    name: '蓖麻', latin: 'Ricinus communis', aliases: ['castor bean'],
    toxicity: 'high', parts: '籽（含毒素浓度最高）',
    toxin: 'ricin（剧毒蛋白毒素）',
    symptoms: '严重胃肠炎、出血性腹泻、多器官衰竭、死亡',
    source: 'https://poisonousplants.ansci.cornell.edu/animals/horses/ricinus.html'
  },
  {
    name: '苹果籽/樱桃核/杏核', latin: 'Prunus spp. / Malus spp.', aliases: ['fruit pits', 'apple seeds'],
    toxicity: 'medium', parts: '籽、核（果肉安全）',
    toxin: '氰苷（amygdalin，咀嚼释放氰化物）',
    symptoms: '少量通常无碍；大量咀嚼吞食→呼吸困难、惊厥。兔体型小风险相对高',
    source: 'https://rabbit.org/health/poisonous-plants/'
  },
  {
    name: '常春藤', latin: 'Hedera helix', aliases: ['english ivy'],
    toxicity: 'medium', parts: '叶、浆果',
    toxin: 'hederagenin saponins',
    symptoms: '胃肠刺激、流涎、呼吸困难',
    source: 'https://rabbitwelfare.co.uk/welfare-need/poisonous-plants/'
  },
  {
    name: '绿萝', latin: 'Epipremnum aureum', aliases: ['pothos', 'golden pothos', '魔鬼藤'],
    toxicity: 'medium', parts: '所有部位',
    toxin: '不溶性草酸钙结晶',
    symptoms: '口腔刺激、流涎、肿胀、吞咽困难',
    source: 'https://rabbit.org/health/poisonous-plants/'
  },
  {
    name: '黛粉叶/花叶万年青', latin: 'Dieffenbachia spp.', aliases: ['dumb cane'],
    toxicity: 'medium', parts: '所有部位',
    toxin: '不溶性草酸钙结晶 + 蛋白酶',
    symptoms: '严重口腔肿胀、声嘶、吞咽困难、气道阻塞风险',
    source: 'https://rabbit.org/health/poisonous-plants/'
  },
  {
    name: '滴水观音/海芋', latin: 'Alocasia spp.', aliases: ['elephant ear'],
    toxicity: 'medium', parts: '所有部位',
    toxin: '不溶性草酸钙结晶',
    symptoms: '口腔刺激、肿胀、流涎、呕吐（兔不能吐）',
    source: 'https://poisonousplants.ansci.cornell.edu/'
  },
  {
    name: '芦荟', latin: 'Aloe vera', aliases: ['aloe'],
    toxicity: 'medium', parts: '叶（汁液）',
    toxin: 'saponins、anthraquinones',
    symptoms: '胃肠刺激、腹泻、电解质紊乱',
    source: 'https://rabbit.org/health/poisonous-plants/'
  },
  {
    name: '仙客来', latin: 'Cyclamen spp.', aliases: ['cyclamen'],
    toxicity: 'medium', parts: '根茎（球根）最毒',
    toxin: 'cyclamine（皂苷类）',
    symptoms: '胃肠刺激、心律失常、惊厥、死亡',
    source: 'https://rabbit.org/health/poisonous-plants/'
  },
  {
    name: '风信子/绣球花/郁金香/水仙', latin: 'Hyacinthus / Hydrangea / Tulipa / Narcissus', aliases: ['球根类'],
    toxicity: 'medium', parts: '球根最毒（叶、花较轻）',
    toxin: '多种（郁金香: tulipalin；水仙: lycorine；绣球: 氰苷）',
    symptoms: '胃肠刺激、流涎、腹泻、心律失常',
    source: 'https://poisonousplants.ansci.cornell.edu/'
  },
  // === 安全（参考） ===
  {
    name: '蒲公英', latin: 'Taraxacum officinale', aliases: ['dandelion'],
    toxicity: 'safe', parts: '叶、花、根（全株可食）',
    toxin: '—',
    symptoms: '安全。富含钙和维 A，但成兔因高钙应控制频率',
    source: 'https://www.sandiegorabbits.org/education/fruit'
  },
  {
    name: '小麦草/燕麦草苗', latin: 'various grasses', aliases: ['wheatgrass', 'oat grass'],
    toxicity: 'safe', parts: '幼苗',
    toxin: '—',
    symptoms: '安全零食（注意：不是主食替代，仍以提摩西草为主）',
    source: 'https://rabbit.org/what-to-feed-your-rabbit/'
  }
]

const search = ref('')
const filter = ref<'all' | 'high' | 'safe'>('all')

const filtered = computed(() => {
  let list = plants
  if (filter.value === 'high') list = list.filter(p => p.toxicity === 'high')
  else if (filter.value === 'safe') list = list.filter(p => p.toxicity === 'safe')
  if (!search.value.trim()) return list
  const q = search.value.toLowerCase().trim()
  return list.filter(p =>
    p.name.includes(q) ||
    p.latin.toLowerCase().includes(q) ||
    p.aliases.some(a => a.toLowerCase().includes(q))
  )
})

const toxMeta = {
  high:   { label: '🚫 高毒', cls: 't-high', advice: '误食立即就医，不要等' },
  medium: { label: '⚠️ 中毒', cls: 't-med', advice: '误食后密切观察，出现症状立即就医' },
  low:    { label: '⚡ 低毒', cls: 't-low', advice: '少量通常无碍，注意观察' },
  safe:   { label: '✅ 可食', cls: 't-safe', advice: '作为零食，仍要控制量' }
}
</script>

<template>
  <div class="psc-checker">
    <div class="psc-controls">
      <input v-model="search" placeholder="🔍 搜索植物名/别名/拉丁名（如：百合、lily、Lilium）" class="psc-search"/>
      <div class="psc-filters">
        <button :class="{active: filter==='all'}" @click="filter='all'">全部</button>
        <button :class="{active: filter==='high'}" @click="filter='high'">仅高毒</button>
        <button :class="{active: filter==='safe'}" @click="filter='safe'">仅可食</button>
      </div>
    </div>

    <div class="psc-results">
      <div v-for="p in filtered" :key="p.name + p.latin" class="psc-card" :class="toxMeta[p.toxicity].cls">
        <div class="psc-head">
          <span class="psc-name">{{ p.name }}</span>
          <span class="psc-latin">{{ p.latin }}</span>
          <span class="psc-badge">{{ toxMeta[p.toxicity].label }}</span>
        </div>
        <div class="psc-aliases" v-if="p.aliases.length">别名：{{ p.aliases.join('、') }}</div>
        <div class="psc-detail"><strong>有毒部位</strong>：{{ p.parts }}</div>
        <div class="psc-detail"><strong>毒素</strong>：{{ p.toxin }}</div>
        <div class="psc-detail"><strong>症状</strong>：{{ p.symptoms }}</div>
        <div class="psc-advice">{{ toxMeta[p.toxicity].advice }}</div>
        <a :href="p.source" target="_blank" rel="noopener" class="psc-source">📖 来源</a>
      </div>
      <div v-if="filtered.length === 0" class="psc-empty">
        未找到匹配植物。⚠️ <strong>"未列入数据库" ≠ "安全"</strong>——若不确定，按有毒处理并咨询兽医。
      </div>
    </div>

    <div class="psc-warn">
      ⚠️ <strong>重要声明</strong>：
      本工具收录的是<strong>常见</strong>植物，并非完整清单（全球植物数万种）。
      毒性受部位、季节、剂量、个体影响。<strong>任何误食后出现症状立即就医</strong>，
      不要因"工具显示低毒"就观望。详见 <a href="../emergencies/poisoning">中毒处置</a>。
    </div>

    <p class="psc-data-source">
      📖 数据来源（每条植物卡片均带源链接）：
      <a href="https://poisonousplants.ansci.cornell.edu/" target="_blank" rel="noopener">Cornell University Poisonous Plants Database</a> ·
      <a href="https://rabbit.org/health/poisonous-plants/" target="_blank" rel="noopener">HRS Poisonous Plants</a> ·
      <a href="https://rabbitwelfare.co.uk/welfare-need/poisonous-plants/" target="_blank" rel="noopener">RWAF Poisonous Plants</a> ·
      <a href="https://www.merckvetmanual.com/toxicology" target="_blank" rel="noopener">Merck 兽医手册·毒理学</a>
    </p>
  </div>
</template>

<style scoped>
.psc-checker {
  border: 1px solid var(--vp-c-divider); border-radius: 12px;
  padding: 1.2rem 1.4rem; background: var(--rw-cream, #faf6ef);
  margin: 1.5rem 0;
}
.psc-controls { display: flex; gap: 0.8rem; margin-bottom: 1rem; flex-wrap: wrap; }
.psc-search {
  flex: 1; min-width: 200px;
  padding: 0.5rem 0.8rem; border: 1px solid var(--vp-c-divider);
  border-radius: 6px; font-size: 0.95rem; background: var(--rw-bg-card);
}
.psc-filters { display: flex; gap: 0.3rem; }
.psc-filters button {
  padding: 0.4rem 0.8rem; border: 1px solid var(--vp-c-divider);
  border-radius: 6px; background: var(--rw-bg-card); cursor: pointer;
  font-size: 0.85rem; font-family: inherit;
}
.psc-filters button.active { background: var(--rw-grass, #4a7c3f); color: var(--vp-c-white, #fff); border-color: var(--rw-grass, #4a7c3f); }
.psc-results { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.7rem; margin-bottom: 1rem; }
.psc-card {
  background: var(--rw-bg-card); border-radius: 8px; padding: 0.85rem 1rem;
  border-left: 4px solid var(--vp-c-divider);
}
.t-high { border-left-color: var(--rw-danger); background: var(--rw-danger-soft); }
.t-med { border-left-color: var(--rw-warn); }
.t-low { border-left-color: var(--vp-c-text-3, #888); }
.t-safe { border-left-color: var(--rw-good-text); background: var(--rw-good-bg); }
.psc-head { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.4rem; }
.psc-name { font-weight: 700; font-size: 1rem; }
.psc-latin { font-style: italic; font-size: 0.8rem; color: var(--vp-c-text-2); }
.psc-badge {
  margin-left: auto; font-size: 0.72rem; padding: 0.15rem 0.5rem;
  border-radius: 999px; font-weight: 700; white-space: nowrap;
}
.t-high .psc-badge { background: var(--rw-danger); color: var(--vp-c-white, #fff); }
.t-med .psc-badge { background: var(--rw-warn2-bg); color: var(--rw-warn2-text); }
.t-low .psc-badge { background: var(--vp-c-bg-alt); color: var(--vp-c-text-2); }
.t-safe .psc-badge { background: var(--rw-grass); color: var(--vp-c-white, #fff); }
.psc-aliases { font-size: 0.78rem; color: var(--vp-c-text-2); margin-bottom: 0.4rem; }
.psc-detail { font-size: 0.85rem; line-height: 1.5; margin: 0.15rem 0; }
.psc-advice {
  font-size: 0.82rem; padding: 0.4rem 0.6rem; border-radius: 4px;
  background: rgba(0,0,0,0.04); margin-top: 0.5rem; font-weight: 500;
}
.psc-source { font-size: 0.75rem; color: var(--rw-grass, #4a7c3f); display: inline-block; margin-top: 0.4rem; }
.psc-empty {
  grid-column: 1/-1; padding: 1.5rem; text-align: center; color: var(--vp-c-text-2);
  background: var(--rw-bg-card); border-radius: 8px; font-size: 0.9rem;
}
.psc-warn {
  background: var(--rw-danger-soft, #fdecea); border-left: 4px solid var(--rw-danger, #c0392b);
  padding: 0.7rem 0.9rem; border-radius: 4px; font-size: 0.85rem; color: var(--rw-text-on-danger);
  margin-bottom: 0.8rem;
}
.psc-data-source { font-size: 0.78rem; color: var(--vp-c-text-2); line-height: 1.6; }
.psc-data-source a { color: var(--rw-grass, #4a7c3f); word-break: break-all; }
</style>
