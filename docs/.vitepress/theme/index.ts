import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'
import './styles/custom.css'

// 核心组件（全局注册，Markdown 中可直接使用）
import SourceCard from './components/SourceCard.vue'
import SourceList from './components/SourceList.vue'
import VetCheck from './components/VetCheck.vue'
import Warning from './components/Warning.vue'
import Danger from './components/Danger.vue'
import Info from './components/Info.vue'
import FirstAidStep from './components/FirstAidStep.vue'
import BreedCard from './components/BreedCard.vue'
import MedicineCalculator from './components/MedicineCalculator.vue'
import DehydrationCheck from './components/DehydrationCheck.vue'
import SymptomTriage from './components/SymptomTriage.vue'
import NotFound from './NotFound.vue'

export default {
  extends: DefaultTheme,
  // 覆盖 404 页面为自定义 NotFound
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'not-found': () => h(NotFound)
    })
  },
  enhanceApp({ app }) {
    app.component('SourceCard', SourceCard)
    app.component('SourceList', SourceList)
    app.component('VetCheck', VetCheck)
    app.component('Warning', Warning)
    app.component('Danger', Danger)
    app.component('Info', Info)
    app.component('FirstAidStep', FirstAidStep)
    app.component('BreedCard', BreedCard)
    app.component('MedicineCalculator', MedicineCalculator)
    app.component('DehydrationCheck', DehydrationCheck)
    app.component('SymptomTriage', SymptomTriage)
  }
} satisfies Theme
