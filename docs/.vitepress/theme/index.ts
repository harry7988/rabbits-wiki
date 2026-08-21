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
import BreedPhoto from './components/BreedPhoto.vue'
import MedicineCalculator from './components/MedicineCalculator.vue'
import DehydrationCheck from './components/DehydrationCheck.vue'
import SymptomTriage from './components/SymptomTriage.vue'
import FAQItem from './components/FAQItem.vue'
import IngredientTable from './components/IngredientTable.vue'
import CheckList from './components/CheckList.vue'
import BiliVideo from './components/BiliVideo.vue'
import DualVideo from './components/DualVideo.vue'
import Diagram from './components/Diagram.vue'
import PromptCard from './components/PromptCard.vue'
import CopyMarkdownButton from './components/CopyMarkdownButton.vue'
import FeedingCalculator from './components/FeedingCalculator.vue'
import PelletAnalyzer from './components/PelletAnalyzer.vue'
import HealthCalendar from './components/HealthCalendar.vue'
import PlantSafetyChecker from './components/PlantSafetyChecker.vue'
import EmergencyCard from './components/EmergencyCard.vue'
import NotFound from './NotFound.vue'

export default {
  extends: DefaultTheme,
  // 覆盖 404 页面为自定义 NotFound；浮动"复制 MD"按钮（fixed 定位，不占内容流）
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'not-found': () => h(NotFound),
      'layout-bottom': () => h(CopyMarkdownButton)
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
    app.component('BreedPhoto', BreedPhoto)
    app.component('MedicineCalculator', MedicineCalculator)
    app.component('DehydrationCheck', DehydrationCheck)
    app.component('SymptomTriage', SymptomTriage)
    app.component('FAQItem', FAQItem)
    app.component('IngredientTable', IngredientTable)
    app.component('CheckList', CheckList)
    app.component('BiliVideo', BiliVideo)
    app.component('DualVideo', DualVideo)
    app.component('Diagram', Diagram)
    app.component('PromptCard', PromptCard)
    app.component('FeedingCalculator', FeedingCalculator)
    app.component('PelletAnalyzer', PelletAnalyzer)
    app.component('HealthCalendar', HealthCalendar)
    app.component('PlantSafetyChecker', PlantSafetyChecker)
    app.component('EmergencyCard', EmergencyCard)
  }
} satisfies Theme
