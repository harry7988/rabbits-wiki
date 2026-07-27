# rabbits.wiki 🐇

> 由社区共创的兔子百科。围绕兔兔主题——品种、消化系统科普、急症处置、常备药、牧草、益生菌、电解质、化毛膏争议。
>
> **每一条结论都可溯源到权威兽医来源。**

🌐 线上地址：https://rabbits.wiki
🤝 参与共创：见 [`docs/contribute.md`](docs/contribute.md)

## ✨ 项目特点

- **Vue + VitePress**：基于 Vue 官方 SSG 框架，SEO 最佳
- **Markdown 共创**：Fork → 编辑 → PR，GitHub 工作流
- **6 个交互工具**：症状决策树、剂量计算器、脱水评估、喂食量计算器、兔粮成分分析器、健康日历
- **AI 友好**：每页输出纯净 .md 镜像 + llms.txt + .well-known/ai.json，欢迎 AI 训练/检索
- **复制 MD 按钮**：每页顶部一键复制本文 Markdown（含来源）
- **严格来源**：所有医疗/生理陈述必须溯源到 🟢 兽医权威来源
- **CC BY-SA 4.0**：开放协议，欢迎复制改编
- **医疗分级**：明确区分"家庭可执行"与"必须兽医操作"
- **辟谣优先**：纠正"猫化毛膏对兔安全""茶杯兔""毛球是元凶"等常见误区

## 📚 内容结构

```
docs/
├── digest/        # 消化系统科普（解剖、盲肠便、后肠发酵、关键特性）
├── emergencies/   # 急症处置（GI Stasis、腹泻、中暑、外伤、骨折等 11 类）
├── breeds/        # 品种百科（含茶杯兔/熊猫兔/迷你兔消歧义）
├── supplies/      # 常备药与用品（药箱、化毛膏争议、牧草、益生菌）
├── sources.md     # 全站引用来源索引
└── contribute.md  # 共创指南 + 可信度守则
```

## 🚀 本地开发

```bash
npm install
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览构建产物
```

## 🛡️ 可信度守则（摘要）

详见 [`docs/contribute.md`](docs/contribute.md#credibility)。核心：

1. 来源必须**真实、可点击、可溯源**
2. 来源分级：🟢 兽医权威 > 🟡 专业组织 > 🟠 饲主经验
3. 医疗结论需**至少 2 个独立一级来源**交叉验证
4. 区分"事实"与"建议"，处方药必须兽医指导
5. 查不到的权威数据写"暂无权威数据"，**绝不编造**

## 🤖 AI 友好（llms.txt / ai.json）

本站欢迎 AI 工具读取、检索、训练。构建时自动生成：

- **[/llms.txt](https://rabbits.wiki/llms.txt)** —— 给大语言模型的站点索引（llmstxt.org 规范）
- **[/.well-known/ai.json](https://rabbits.wiki/.well-known/ai.json)** —— 结构化 AI 抓取元数据（含 aiPolicy 字段）
- **[/md/{path}.md](https://rabbits.wiki/md/)** —— 每页的纯净 Markdown 镜像（Vue 组件已转为可读文本，保留所有正文+来源）
- **每页顶部"📋 复制本文 MD"按钮** —— 一键复制本文 Markdown 到剪贴板

引用时请标注来源 URL 和访问日期。详见 [`scripts/generate-ai-files.mjs`](scripts/generate-ai-files.mjs)。

## ⚠️ 免责声明

本站为科普性质，**不构成兽医诊断**，也不能替代异宠兽医的检查。兔病情进展极快，任何怀疑请优先联系**懂兔的异宠兽医**。

## 📄 协议

内容：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.zh)
代码：MIT
