---
title: 参与共创
description: rabbits.wiki 由社区共创。本文说明如何贡献内容、署名规范、引用与可信度守则、医疗内容审核流程。
---

# 🤝 参与共创

rabbits.wiki 是一个**由社区共创**的兔子百科。任何人都可以通过 GitHub 贡献内容，但为了对每一只兔兔负责，我们对**医疗类内容的来源与准确性**有严格要求。

## 一、贡献流程（5 分钟上手）

```mermaid
Fork 仓库 → 在 docs/ 编辑 Markdown → 本地预览 (npm run dev) → 提交 PR → 审核合并
```

1. **Fork** 仓库 `rabbits-wiki/rabbits.wiki`
2. 在 `docs/` 下新建或编辑 Markdown 文件
3. 本地预览：`npm install && npm run dev`
4. 提交 **Pull Request**，按 PR 模板填写
5. 等待维护者审核（医疗类内容需 CODEOWNER 即兽医/资深审核者批准）
6. 合并后自动部署上线

## 二、可信度守则（最重要，请认真阅读） {#credibility}

本站对兔兔生命负责。**任何医疗、生理、用药类陈述都必须满足以下要求**：

### 1. 来源必须真实、可点击、可溯源
- ✅ 写在文末 `<SourceList>` 中的 URL，必须是撰稿人**亲自访问过**的真实页面
- ❌ 禁止凭记忆编造 URL，禁止搬运来路不明的二手信息
- ❌ 禁止用"据某专家说"之类无法核实的口吻

### 2. 来源分级（按域名判断可信度）

| 等级 | 含义 | 典型来源 | 用法 |
|------|------|----------|------|
| 🟢 **兽医权威** `vet` | 兽医教科书/权威机构 | House Rabbit Society (rabbit.org)、Medirabbit、Merck 兽医手册、VCA Hospitals、`*.edu`、PubMed 期刊 | 可直接支撑结论 |
| 🟡 **专业组织** `org` | 品种协会、专业团体 | ARBA、品种俱乐部、知名兽医个人主页 | 需与一级来源交叉验证 |
| 🟠 **饲主经验** `exp` | 社群共识、个人经验 | 论坛、个人博客 | **不可单独支撑医疗结论**，必须标注"经验性" |

### 3. 交叉验证规则
- 同一结论：**至少 2 个独立一级来源同意**，或 **1 个一级 + 1 个二级**
- 来源互相矛盾：**正文如实写出争议**（"A 方认为…；B 方认为…"），不替读者做选择
- 一时查不到的权威数据：写"暂无权威数据"，**绝不可编造数字**（如某品种精确寿命、某药精确剂量）

### 4. 区分"事实"与"建议"
- **解剖/生理陈述** = 事实 → 必须一级来源
- **用药/处置建议** = 兽医指导下的行为 → 必须用 `<VetCheck>` 组件标注"何时必须就医"，明确"家庭可执行 vs 必须兽医操作"

### 5. 剂量与用药
- 任何药物剂量必须有**按体重的来源依据**（写出来源链接 + 原文剂量表）
- **禁止自创剂量**
- 处方药（抗生素、驱虫药等）一律标注"需兽医处方"

## 三、署名与版权

### 1. 协议
本站全部内容采用 **[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.zh)**（知识共享 署名-相同方式共享 4.0）发布。

- 你可以自由：复制、改编、再分发
- 你必须：**署名**原作者 + **以相同协议**发布衍生作品

### 2. 贡献者署名
- 每篇文档 frontmatter 的 `contributors` 字段记录贡献者 GitHub 用户名
- 合并 PR 即视为你同意将内容以 CC BY-SA 4.0 发布，并放弃因署名产生的额外权利主张

### 3. 引用外部内容
- **大段引用**（超过 100 字或核心结论）必须显式标引号 + 来源链接，并尽量取得授权
- **事实陈述**改为自己的话重述（注明来源）
- **禁止**整篇搬运他人文章冒充原创
- 商业图库图片**禁止**直接使用；图片请用原创 / CC0 / 自购授权

## 四、Markdown 文档 frontmatter 规范

```yaml
---
title: 胃肠停滞（GI Stasis）           # 必填：页面标题
description: 兔兔胀气、拒食的家庭急救   # 必填：SEO description
sources:                              # 必填：本页所有来源
  - title: "Gastrointestinal Stasis: The Silent Killer"
    author: "House Rabbit Society"
    url: "https://rabbit.org/..."
    accessed: "2026-07-27"
    level: vet
contributors:                         # 贡献者
  - github: yourname
lastReviewed: 2026-07-27              # 医疗内容最后核查日期
---
```

> 💡 文末用 `<SourceList>` 组件渲染来源列表，对应 frontmatter 的 `sources`。

## 五、医疗内容审核（CODEOWNERS）

`docs/emergencies/` 与 `docs/supplies/` 下所有文件，PR 必须由 CODEOWNER（具备兽医背景或资深审核者）批准方可合并。

## 六、提 Issue 纠错

发现错误？来源失效？结论过时？
👉 [提 Issue](https://github.com/rabbits-wiki/rabbits.wiki/issues)

我们鼓励"纠错 PR"，哪怕只修一个错别字或一个失效链接。

---

<Warning title="本站不替代兽医诊断">

本站为科普性质。兔兔病情进展极快（尤其消化系统），任何怀疑都请优先联系**懂兔的异宠兽医**，不要因网络信息延误就诊。

</Warning>
