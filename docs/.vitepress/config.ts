import { defineConfig } from 'vitepress'

/**
 * rabbits.wiki 站点配置
 * 设计原则：SSG 预渲染保证 SEO；统一 meta；自动 sitemap
 */
export default defineConfig({
  lang: 'zh-CN',
  title: 'rabbits.wiki',
  description: '由社区共创的兔子百科 · 品种 · 急症处置 · 常备药 · 牧草 · 消化科普，所有内容均标注权威来源。',
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    ['meta', { name: 'author', content: 'rabbits.wiki 社区' }],
    ['meta', { name: 'keywords', content: '兔子,宠物兔,兔兔百科,兔急症,胃肠停滞,兔品种,提摩西草,益生菌,电解质,化毛膏,养兔,绝育,幼兔,兔兔行为,养兔工具' }],
    // 开放协议 + 版权声明（CC BY-SA 4.0）
    ['meta', { name: 'license', content: 'CC-BY-SA-4.0' }],
    ['link', { rel: 'canonical', href: 'https://rabbits.wiki/' }],
    // Open Graph（社交分享卡片）
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'rabbits.wiki' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:title', content: 'rabbits.wiki · 兔子百科' }],
    ['meta', { property: 'og:description', content: '社区共创的兔子百科：品种、急症处置、常备药、牧草、消化科普。所有内容均标注权威来源。' }],
    ['meta', { property: 'og:image', content: 'https://rabbits.wiki/og.png' }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'rabbits.wiki · 兔子百科' }],
    ['meta', { name: 'twitter:description', content: '社区共创的兔子百科：所有内容均标注权威兽医来源。' }],
    ['meta', { name: 'twitter:image', content: 'https://rabbits.wiki/og.png' }],
    // 免责声明（重要：本站内容非兽医诊断）
    ['meta', { name: 'robots', content: 'index, follow' }]
  ],
  lastUpdated: true,
  cleanUrls: true,

  // 内容已基本完成；死链检查保留开启以保证内部链接健康
  // 仅忽略指向 GitHub 编辑链接等无法在构建时解析的链接
  ignoreDeadLinks: [
    /^https?:\/\/(www\.)?facebook\.com/,
    /^https?:\/\/(www\.)?reddit\.com/,
    /^https?:\/\/(www\.)?youtube\.com/
  ],

  // sitemap.xml 自动生成（VitePress 内置）
  sitemap: {
    hostname: 'https://rabbits.wiki',
    lastmodDateOnly: false
  },

  themeConfig: {
    siteTitle: 'rabbits.wiki 🐇',
    description: '社区共创的兔子百科',

    // 全站免责声明入口
    socialLinks: [
      { icon: 'github', link: 'https://github.com/rabbits-wiki/rabbits.wiki' }
    ],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            displayDetails: '显示详情',
            resetButtonTitle: '清除查询',
            backButtonTitle: '返回',
            noResultsText: '没有结果',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },

    nav: [
      { text: '🧰 工具箱', link: '/tools/' },
      { text: '消化科普', link: '/digest/' },
      { text: '急症处置', link: '/emergencies/' },
      { text: '日常养育', link: '/care/' },
      { text: '兔品种', link: '/breeds/' },
      { text: '常备药与用品', link: '/supplies/' },
      { text: '更多', items: [
        { text: '关于本站', link: '/about' },
        { text: '全站来源索引', link: '/sources/' },
        { text: '参与共创', link: '/contribute' }
      ]}
    ],

    sidebar: {
      '/tools/': [
        {
          text: '养兔工具箱',
          collapsed: false,
          items: [
            { text: '工具总览', link: '/tools/' }
          ]
        }
      ],
      '/digest/': [
        {
          text: '消化系统科普',
          collapsed: false,
          items: [
            { text: '总览', link: '/digest/' },
            { text: '消化道解剖', link: '/digest/anatomy' },
            { text: '盲肠便与重食机制', link: '/digest/cecotropes' },
            { text: '后肠发酵原理', link: '/digest/hindgut-fermentation' },
            { text: '兔不能呕吐等关键特性', link: '/digest/key-traits' }
          ]
        }
      ],
      '/emergencies/': [
        {
          text: '急症处置',
          collapsed: false,
          items: [
            { text: '急救总则与红色警报', link: '/emergencies/' },
            { text: '胃肠停滞（胀气/拒食）', link: '/emergencies/gi-stasis' },
            { text: '腹泻', link: '/emergencies/diarrhea' },
            { text: '中暑', link: '/emergencies/heatstroke' },
            { text: '外伤出血', link: '/emergencies/wounds' },
            { text: '骨折', link: '/emergencies/fractures' },
            { text: '抽搐/癫痫', link: '/emergencies/seizures' },
            { text: '呼吸问题', link: '/emergencies/respiratory' },
            { text: '球虫病', link: '/emergencies/coccidiosis' },
            { text: '毛球症', link: '/emergencies/hairball' },
            { text: '中毒与误食', link: '/emergencies/poisoning' }
          ]
        }
      ],
      '/care/': [
        {
          text: '日常养育',
          collapsed: false,
          items: [
            { text: '养育总览', link: '/care/' },
            { text: '绝育与绝育后护理', link: '/care/spay-neuter' },
            { text: '幼兔养育（0–7 月龄）', link: '/care/baby-rabbit' },
            { text: '老年兔照护（5+ 岁）', link: '/care/senior-rabbit' },
            { text: '新兔到家与适应期', link: '/care/bringing-home' },
            { text: '合笼（bonding）', link: '/care/bonding' },
            { text: '兔笼与环境丰容', link: '/care/housing' },
            { text: '兔兔行为解读', link: '/care/behavior' },
            { text: '定点如厕训练', link: '/care/litter-training' },
            { text: '日常护理清单', link: '/care/daily-care' }
          ]
        }
      ],
      '/breeds/': [
        {
          text: '兔品种百科',
          collapsed: false,
          items: [
            { text: '品种总览（含茶杯兔/熊猫兔辟谣）', link: '/breeds/' },
            { text: '荷兰垂耳兔 Holland Lop', link: '/breeds/holland-lop' },
            { text: '迷你垂耳兔 Mini Lop（美版）', link: '/breeds/mini-lop' },
            { text: '荷兰侏儒兔 Netherland Dwarf', link: '/breeds/netherland-dwarf' },
            { text: '狮子兔 Lionhead', link: '/breeds/lionhead' },
            { text: '迷你雷克斯 Mini Rex', link: '/breeds/mini-rex' },
            { text: '雷克斯 Rex（标准型）', link: '/breeds/rex' },
            { text: '安哥拉兔 Angora', link: '/breeds/angora' },
            { text: '道奇/熊猫兔 Dutch', link: '/breeds/dutch' },
            { text: '霍托兔 Hotot（熊猫眼兔）', link: '/breeds/hotot' },
            { text: '法兰德斯巨兔 Flemish Giant', link: '/breeds/flemish-giant' }
          ]
        }
      ],
      '/supplies/': [
        {
          text: '常备药与辅助用品',
          collapsed: false,
          items: [
            { text: '家庭药箱清单', link: '/supplies/' },
            { text: '常备药品', link: '/supplies/medicines' },
            { text: '益生菌', link: '/supplies/probiotics' },
            { text: '电解质', link: '/supplies/electrolytes' },
            { text: '化毛膏（争议）', link: '/supplies/hairball-remedy' },
            {
              text: '牧草专题',
              collapsed: false,
              items: [
                { text: '提摩西草', link: '/supplies/hay/timothy' },
                { text: '苜蓿草', link: '/supplies/hay/alfalfa' },
                { text: '牧草品质鉴别', link: '/supplies/hay/grading' },
                { text: '各阶段牧草配比', link: '/supplies/hay/stage-ratio' }
              ]
            }
          ]
        }
      ]
    },

    outline: {
      level: [2, 3],
      label: '本页内容'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    lastUpdatedText: '最后核查',

    editLink: {
      pattern: 'https://github.com/rabbits-wiki/rabbits.wiki/edit/main/docs/:path',
      text: '在 GitHub 上编辑本页（共创）'
    },

    footer: {
      message: '本站内容采用 CC BY-SA 4.0 协议发布 · 本站为科普，不构成兽医诊断，急症请立即就医',
      copyright: '© 2026 rabbits.wiki 社区贡献者'
    },

    pageNav: true
  } as any,

  // 结构化数据（schema.org Article）：让 Google 等搜索引擎理解每篇文章，
  // 提升富结果（rich results）展示机会。每页注入 Article JSON-LD。
  transformPageData(pageData) {
    const title = pageData.title || 'rabbits.wiki'
    const description = pageData.description || '由社区共创的兔子百科'
    const url = `https://rabbits.wiki/${pageData.relativePath}`
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '')

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      url,
      inLanguage: 'zh-CN',
      publisher: {
        '@type': 'Organization',
        name: 'rabbits.wiki',
        url: 'https://rabbits.wiki',
        logo: {
          '@type': 'ImageObject',
          url: 'https://rabbits.wiki/favicon.png'
        }
      },
      license: 'https://creativecommons.org/licenses/by-sa/4.0/',
      isPartOf: {
        '@type': 'WebSite',
        name: 'rabbits.wiki',
        url: 'https://rabbits.wiki'
      }
    }

    pageData.frontmatter = pageData.frontmatter || {}
    pageData.frontmatter.head = pageData.frontmatter.head || []
    pageData.frontmatter.head.push([
      'script',
      { type: 'application/ld+json' },
      JSON.stringify(jsonLd)
    ])
  }
})
