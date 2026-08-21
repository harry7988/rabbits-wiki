# AGENTS.md — rabbits.wiki 开发指南（面向 AI Agent 与人类协作者)

> 本文件供在本仓库上工作的 AI Agent（Codex / Claude Code / Cursor / 通用助手）和人类开发者阅读。
> 它是"施工图纸"：架构地图、规范、已踩过的坑、下一步规划。改代码前请通读。
> 面向**站点访问者 Agent** 的协议（非开发）在 `docs/public/agents.md`（部署为 `/agents.md`）。

## 项目是什么

**rabbits.wiki** —— 社区共创的中文兔子养护百科（英文精选版在 `/en/`）。
核心立场：每条医疗/生理结论**可溯源到权威兽医来源**；科普不替代兽医；品牌数据中立。

- 框架：**VitePress 1.x**（Vue 3 SSG）
- 内容：`docs/**/*.md`（73 页）+ 自定义 Vue 组件（20 个）
- 部署：GitHub Actions → GitHub Pages，自定义域 `https://rabbits.wiki`
- 仓库：`github.com/harry7988/rabbits-wiki`（**不要在内容里写死此地址**，见"红线"）

## 命令

```bash
npm run dev             # 本地开发（localhost:5173）
npm run build           # 完整构建 = vitepress build + AI 文件生成 + 知识图谱
npm run build:vp        # 仅 vitepress（不含 AI 产物）
npm run check-markdown  # 组件 Markdown 间距检查（CI 强制，违反=红）
npm run check-sources   # 外链可达性抽检（--all 全量）
npm run ai-files        # 单独生成 llms.txt / ai.json / md 镜像
npm run graph           # 单独生成 graph.json
```

**改完必须跑 `npm run build`**（含死链检查）+ `npm run check-markdown`。

## 目录地图

```
docs/
├─ .vitepress/
│  ├─ config.ts          # 站点配置：locales（zh 根 + /en/）、nav、sidebar、SEO、sitemap
│  └─ theme/
│     ├─ index.ts        # 组件注册表（新组件必须在此注册）
│     ├─ NotFound.vue    # 自定义 404
│     ├─ styles/custom.css  # 设计 token（--rw-*，浅/深双套）+ 全站排版
│     └─ components/     # 20 个组件，见下表
├─ index.md              # 中文首页（layout: page + HomeLayout + LangAutoDetect）
├─ en/                   # 英文精选版（i18n locale，首页用 EnglishHome）
├─ digest/               # 消化系统科普（原理层）
├─ emergencies/          # 急症处置（11 类）
├─ care/                 # 日常养育（含 dental 牙齿=核心页、new-rabbit-checklist）
├─ handling/             # 操作技能（抱兔/喂药/剪指甲…，配 B 站视频）
├─ breeds/               # 品种百科（11 种 + 茶杯兔辟谣）
├─ supplies/             # 常备药/兔粮/食物安全（food-safe、food-unsafe、pellets）
├─ faq/ tools/ contribute.md about.md sources.md
├─ public/               # 原样复制到站点根（robots.txt、agents.md、rabbit-mark*.svg）
scripts/
├─ generate-ai-files.mjs     # md 镜像(/md/*) + llms.txt + .well-known/ai.json
│                            # 含 Vue 组件→纯文本转换（新增组件需补转换规则！）
├─ generate-knowledge-graph.mjs  # graph.json（nodes/edges 从站内链接提取）
├─ check-markdown.mjs        # CI 强制检查
└─ check-sources.mjs
.github/  workflows(deploy/preview) + PR 模板 + CODEOWNERS(@harry7988) + 行为公约
```

### 组件速查（全部在 theme/index.ts 注册）

| 组件 | 用途 |
|---|---|
| `SourceCard` / `SourceList` | 来源引用卡/文末清单（level: vet/org/exp）——**版权核心** |
| `VetCheck` | 红色就医信号框 |
| `Warning` `Danger` `Info` | 提示框（可带 title） |
| `FirstAidStep` | 步骤条（`:num` `title`） |
| `BreedCard` | 品种信息卡 |
| `FAQItem` | 可折叠问答 |
| `IngredientTable` | 兔粮成分四列对照（:rows 绑定） |
| `SymptomTriage` `MedicineCalculator` `DehydrationCheck` `FeedingCalculator` `PelletAnalyzer` `HealthCalendar` `PlantSafetyChecker` `EmergencyCard` | 8 个交互工具（tools 页） |
| `CheckList` | 可勾选清单（localStorage） |
| `BiliVideo` | B 站官方外链播放器（必须署名 UP 主） |
| `PromptCard` | 复制给 AI 的共创指令（slot+fenced code；`{{REPO_URL}}` 动态注入） |
| `CopyMarkdownButton` | 每页右上角浮动"复制 MD"（layout-bottom 注入） |
| `HomeHero/HomeSections/HomeLayout` `EnglishHome` `LangAutoDetect` | 首页/双语 |

## 硬性规范（违反=构建失败或评审打回）

### 1. 组件与 Markdown 的空行规则【最高频坑】
组件双标签**必须**与内容之间空一行，否则 md 不渲染（列表/加粗变原文）：
```md
<Warning title="...">

- **列表**才渲染

</Warning>
```
`npm run check-markdown` 会拦截；新增组件标签记得加进它的 TAGS 正则。

### 2. 内容规范（contribute.md 是权威版）
- 医疗结论 ≥2 个独立 🟢vet 来源；查不到写"暂无权威数据"，**禁止编造数字/剂量**
- 处方药标"需兽医开具"；急症页不放"照视频自行处置"类内容（误导安全感）
- **品牌中立**：只做带来源的数据陈述，禁止"推荐/最好/慎选"式评价（法律合规）
- 来源必须亲自访问过；引用注明 accessed 日期

### 3. 不要写死仓库地址
右上角 GitHub 图标来自 `config.ts socialLinks`（PromptCard 的 `{{REPO_URL}}` 从它动态读）。改仓库只改那一处。

### 4. i18n
根=中文完整版（勿动结构）；英文进 `docs/en/**`（英文 sidebar/config 里 `/en/` 下维护）。
英文页链接中文页用相对路径且**不带尾斜杠**（目录型才带，如 `../../digest/`）。

### 5. 设计系统（已过两轮外部评审，勿回退）
- token：`--rw-*` 全部双套（浅/.dark），新增颜色必须两套都写
- 签名元素：**兔粪球圆点**（ul::before 草绿 7px / 嵌套干草黄 5px / 危险框红）
- 左边线三档 token：`line-accent 2px / line-note 3px / line-alert 4px`
- 中文排版：**不加正字距**；font-weight 只用 400/600/700/800（系统字体无 650/750）
- 按钮：墨绿 `--rw-ink`，深色模式反转为浅底深字（#a3d493/#16200f）
- 所有可交互元素要有 `:focus-visible`
- 编辑部风格：排版与留白承担设计，禁止回加"圆角卡片+阴影+悬浮+发光+脉冲"AI 套路

### 6. 新增页面 checklist
frontmatter（title/description/lastReviewed）→ sidebar+nav 注册（中文 config / 英文 en sidebar）→ 相关页互链 → `npm run build` → `npm run check-markdown` → 本地 `npm run dev` 肉眼验证。

## 下一步开发规划（Roadmap，按优先级）

1. **英文版扩充**（最高优先）：翻译既有序——emergencies 子页（gi-stasis/heatstroke…）→ food-safe → handling 全套 → care/spay-neuter。保持"英文页明确链接中文原版"模式；新页记得挂进 en sidebar。
2. **内容深化**：品种页补至更多 ARBA 品种；兔病专题（E. cuniculi、Pasteurella 单独成页）；兽医名录（按城市，需核实来源）。
3. **工具增强**：HealthCalendar 加疫苗日历提醒导出；PlantSafetyChecker 扩充物种（每条带来源）。
4. **搜索升级**：本地搜索中文分词一般，可评估 Algolia DocSearch（开源免费）。
5. **质检自动化**：check-sources 定期跑（来源失效是长期债务）；内容过期提示（lastReviewed 超 12 个月标黄）。
6. **SEO 收尾**：Google Search Console 提交 sitemap；每页 OG 图差异化。

## 给 Agent 的工作方式建议

- 改内容前先读对应页面**现有来源**，新结论照 `contribute.md` 守则补源
- 涉及医疗的改动谨慎：宁可保守，不确定就标注而非断言
- 提交信息用中文、说明"为什么"；小步提交
- 本文件与 `docs/contribute.md`、`docs/.vitepress/config.ts` 是理解项目的三把钥匙
