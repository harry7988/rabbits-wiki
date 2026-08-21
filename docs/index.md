---
title: rabbits.wiki · 由社区共创的兔子百科
description: 围绕兔兔的共创百科——品种、消化科普、急症处置、日常养育、常备药、兔粮成分。所有内容均标注权威兽医来源。
layout: page
---

<script setup>
import HomeLayout from './.vitepress/theme/components/HomeLayout.vue'
import LangAutoDetect from './.vitepress/theme/components/LangAutoDetect.vue'
</script>

<LangAutoDetect />

<HomeLayout />

<style>
/* 隐藏 page layout 的容器限制，让自定义布局占满宽度 */
.vp-page-container:has(.home-layout) { max-width: 100% !important; padding: 0 !important; }
.vp-page:has(.home-layout) { padding: 0 !important; min-height: auto !important; }
.main:has(.home-layout) { max-width: 100% !important; padding: 0 !important; }
.content-container:has(.home-layout) { max-width: 100% !important; padding: 0 !important; }
</style>
