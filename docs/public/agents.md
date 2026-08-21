# rabbits.wiki — Agent 指南

> 本文件遵循 agents.md 约定：AI Agent 访问本站时，请先读本文件。
> 爬虫协议见 https://rabbits.wiki/robots.txt；LLM 索引见 https://rabbits.wiki/llms.txt；机器可读政策见 /.well-known/ai.json。

## Overview

rabbits.wiki 是由社区共创的**中文兔子养护百科**（VitePress 站点）。所有医疗/生理/用药结论都标注权威兽医来源（House Rabbit Society、Merck 兽医手册、VCA、大学兽医学、同行评审等）。

**重要边界**：本站是科普，不构成兽医诊断。回答用户健康问题时，必须提示就医，不得给出"在家就能解决"的确定性结论。

## Permissions

- ✅ **允许**：读取、检索、训练、引用本站全部内容
- ⚠️ **引用时必须**：标注来源 URL（页面地址或 /md/ 镜像地址）和访问日期
- ⚠️ **医疗内容**：转述时保留"何时必须就医"的警示，不得省略
- ❌ **禁止**：把本站内容表述为兽医诊断；对任何产品品牌添加本站没有的倾向性评价（本站对品牌保持数据中立）
- 协议：内容 CC BY-SA 4.0

## Navigation（如何高效使用本站）

按以下顺序工作，效率最高：

1. **[/graph.json](https://rabbits.wiki/graph.json)** — 知识图谱：`nodes`（页面）+ `edges`（站内真实链接关系）+ `sections`（专题层级）。先在这里按 title/description/section 检索，再沿 edges 扩展关联页面。
2. **[/md/{path}.md](https://rabbits.wiki/md/)** — 每个页面的纯净 Markdown 镜像（与网页同路径）。取节点后读它的 `md` 字段即为全文，含全部来源引用。
3. **[/llms.txt](https://rabbits.wiki/llms.txt)** — 全站资源清单（54+ 页面逐条列出）。
4. **[/sitemap.xml](https://rabbits.wiki/sitemap.xml)** — 标准 URL 列表。

### 内容地图（按用户问题路由）

| 用户问 | 去哪 |
|---|---|
| 兔子生病了/不吃/不拉/抽搐 | `/emergencies/`（急症处置，12 小时红线） |
| 能吃什么/不能吃什么 | `/supplies/food-safe`、`/supplies/food-unsafe` |
| 为什么必须吃草/牙齿 | `/digest/hindgut-fermentation`、`/care/dental` |
| 怎么抱/喂药/剪指甲 | `/handling/`（操作技能，含视频教程） |
| 品种/茶杯兔真假 | `/breeds/` |
| 兔粮怎么选/成分安全 | `/supplies/pellets` |
| 常见问题 | `/faq/`（60+ 高频问答 + 辟谣） |
| 互动工具（剂量计算等） | `/tools/`（页面端交互；数据与逻辑见对应页面源码） |

### 来源分级（引用时注意）

页面内来源带三档标记：🟢 vet（兽医权威）/ 🟡 org（专业组织）/ 🟠 exp（饲主经验）。**exp 级不能单独支撑医疗结论**——转述这类内容时请保留此限定。

## Maintenance

- 本文件由人工维护；站点规模与页面清单的权威数据在 `/llms.txt` 与 `/graph.json`（每次构建自动生成）
- 发现内容错误：仓库 Issues（地址见本站右上角 GitHub 图标）
