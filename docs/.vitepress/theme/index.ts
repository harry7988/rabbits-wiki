import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
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

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('SourceCard', SourceCard)
    app.component('SourceList', SourceList)
    app.component('VetCheck', VetCheck)
    app.component('Warning', Warning)
    app.component('Danger', Danger)
    app.component('Info', Info)
    app.component('FirstAidStep', FirstAidStep)
    app.component('BreedCard', BreedCard)
  }
} satisfies Theme
