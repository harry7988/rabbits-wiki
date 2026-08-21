<script setup lang="ts">
/**
 * EnglishHome —— 英文版首页
 * 与中文首页同款编辑部风格：左对齐 hero + 红线卡 + 编辑式目录。
 * 英文当前为核心页集，其余主题链到中文版（说明清楚，不装作完整）。
 */
</script>

<template>
  <div class="en-home">
    <section class="en-hero">
      <div class="hero-main">
        <p class="hero-kicker"><span class="kicker-dot" aria-hidden="true"></span>
          Community-built · every claim traced to authoritative veterinary sources</p>
        <h1 class="hero-title">Rabbit care,<br />evidence first</h1>
        <p class="hero-sub">
          A rabbit encyclopedia covering emergencies, dental health, diet and daily care —
          with 8 interactive tools. This English edition is a curated core set;
          the full 70+ page encyclopedia is in Chinese.
        </p>
        <div class="hero-actions">
          <a href="/en/emergencies/" class="btn btn-solid">Emergency guide</a>
          <a href="/" class="btn btn-quiet">中文完整版 <span class="btn-arrow" aria-hidden="true">→</span></a>
        </div>
      </div>

      <aside class="hero-redline">
        <span class="redline-badge" aria-hidden="true"><span class="redline-mark"></span></span>
        <p class="redline-label">The one red line every rabbit owner must know</p>
        <p class="redline-text">
          No eating or pooping for <em>12 hours</em> is an emergency — go to a vet now, do not wait.
        </p>
        <p class="redline-note">Rabbits hide illness by instinct. By the time symptoms look obvious, it is often serious.</p>
        <a href="/en/emergencies/" class="redline-link">See the emergency overview</a>
      </aside>
    </section>

    <section class="en-entries">
      <div class="entries-inner">
        <div class="lead-grid">
          <div class="lead lead-emergency">
            <h2 class="lead-title"><a href="/en/emergencies/">Emergencies</a></h2>
            <p class="lead-desc">How to judge what is urgent, and what you can safely do before reaching a vet.</p>
            <ul class="lead-list">
              <li><a href="/en/emergencies/">GI stasis (not eating)</a></li>
              <li><a href="/en/emergencies/">Heatstroke</a></li>
              <li><a href="/en/emergencies/">Red-flag symptoms checklist</a></li>
            </ul>
          </div>
          <div class="lead">
            <h2 class="lead-title"><a href="/en/care/dental">Dental &amp; hay</a></h2>
            <p class="lead-desc">Why unlimited grass hay is non-negotiable: it grinds teeth and keeps the gut moving.</p>
            <ul class="lead-list">
              <li><a href="/en/care/dental">Teeth never stop growing (2 mm/week)</a></li>
              <li><a href="/en/care/dental">The dental → GI stasis spiral</a></li>
            </ul>
          </div>
        </div>

        <div class="lead-grid">
          <div class="lead">
            <h2 class="lead-title"><a href="/en/supplies/food-unsafe">Unsafe foods</a></h2>
            <p class="lead-desc">Chocolate, avocado, onions, fruit pits — the dangerous list, and what to do after ingestion.</p>
            <ul class="lead-list">
              <li><a href="/en/supplies/food-unsafe">Never-feed list</a></li>
              <li><a href="/en/supplies/food-unsafe">Common myths busted</a></li>
            </ul>
          </div>
          <div class="lead">
            <h2 class="lead-title"><a href="/en/contribute">Contribute</a></h2>
            <p class="lead-desc">No coding needed — copy an AI prompt and any assistant walks you through GitHub.</p>
            <ul class="lead-list">
              <li><a href="/en/contribute">Zero-code contributing</a></li>
              <li><a href="/en/about">About &amp; sourcing policy</a></li>
            </ul>
          </div>
        </div>

        <p class="more-note">
          More topics — full disease library, breed encyclopedia, feeding calculators, handling skills videos —
          are in the <a href="/">Chinese edition</a>. English translation is in progress.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.en-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 3rem;
  align-items: center;
  max-width: 1040px;
  margin: 0 auto;
  padding: 4.5rem 1.5rem 4rem;
}
.hero-kicker {
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.82rem; color: var(--vp-c-text-2); margin: 0 0 1.6rem;
}
.kicker-dot { width: 8px; height: 8px; border-radius: 999px; background: var(--rw-hay); flex-shrink: 0; }
.hero-title {
  font-size: clamp(2.4rem, 5.5vw, 3.6rem);
  font-weight: 800; letter-spacing: -0.02em; line-height: 1.2;
  margin: 0 0 1.3rem; color: var(--vp-c-text-1);
}
.hero-sub { font-size: 1rem; line-height: 1.8; color: var(--vp-c-text-2); max-width: 34em; margin: 0 0 2.2rem; }
.hero-actions { display: flex; align-items: center; gap: 1.4rem; flex-wrap: wrap; }
.btn { font-size: 0.95rem; font-weight: 600; text-decoration: none; padding: 0.68rem 1.5rem; border-radius: 6px; }
.btn-solid { background: var(--rw-ink); color: var(--rw-ink-text); }
.btn-solid:hover { background: var(--rw-ink-hover); }
.btn-quiet { color: var(--vp-c-text-1); padding-left: 0; }
.btn-quiet:hover { color: var(--rw-grass); }
.btn-arrow { display: inline-block; margin-left: 0.35rem; transition: transform 0.18s ease; }
.btn-quiet:hover .btn-arrow { transform: translateX(3px); }
.hero-redline { border-left: var(--rw-line-accent) solid var(--rw-danger); padding: 0.4rem 0 0.4rem 1.4rem; }
.redline-badge {
  display: flex; align-items: center; justify-content: center;
  width: 56px; height: 56px; border-radius: 999px;
  background: var(--rw-hay-soft); margin-bottom: 1.1rem;
}
.redline-mark { display: block; width: 32px; height: 32px; background: url('/rabbit-mark.svg') center / contain no-repeat; }
:global(.dark) .redline-mark { background-image: url('/rabbit-mark-dark.svg'); }
.redline-label { font-size: 0.78rem; font-weight: 700; color: var(--rw-danger); margin: 0 0 0.7rem; }
.redline-text { font-size: 1.14rem; font-weight: 600; line-height: 1.7; color: var(--vp-c-text-1); margin: 0 0 0.6rem; }
.redline-text em { font-style: normal; color: var(--rw-danger); font-weight: 700; }
.redline-note { font-size: 0.85rem; line-height: 1.7; color: var(--vp-c-text-2); margin: 0 0 0.8rem; }
.redline-link { font-size: 0.88rem; font-weight: 600; color: var(--vp-c-text-1); text-decoration: none; border-bottom: 1px solid var(--vp-c-divider); padding-bottom: 2px; }
.redline-link:hover { color: var(--rw-danger); border-color: currentColor; }

.en-entries { border-top: 1px solid var(--rw-line); padding: 3.2rem 1.5rem 3.5rem; }
.entries-inner { max-width: 1040px; margin: 0 auto; display: flex; flex-direction: column; gap: 2.8rem; }
.lead-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
.lead-title { margin: 0 0 0.55rem; font-size: 1.5rem; font-weight: 700; }
.lead-title::before { content: ''; display: block; width: 24px; border-top: var(--rw-line-accent) solid var(--rw-grass); margin-bottom: 0.75rem; }
.lead-emergency .lead-title::before { border-top-color: var(--rw-danger); }
.lead-emergency .lead-title a { color: var(--rw-danger-text-strong); }
.lead-title a { color: var(--vp-c-text-1); text-decoration: none; }
.lead-title a:hover { color: var(--rw-ink); }
.lead-desc { font-size: 0.92rem; line-height: 1.75; color: var(--vp-c-text-2); margin: 0 0 1.1rem; }
.lead-list { list-style: none; margin: 0; padding: 0; }
.lead-list li + li { border-top: 1px solid var(--rw-line); }
.lead-list a {
  display: flex; align-items: center; padding: 0.62rem 0.5rem; margin: 0 -0.5rem;
  font-size: 0.92rem; color: var(--vp-c-text-1); text-decoration: none; border-radius: 6px;
  transition: background-color 0.15s ease;
}
.lead-list a::before {
  content: ''; width: 6px; height: 6px; border-radius: 999px;
  background: var(--rw-hay); opacity: 0.55; margin-right: 0.65rem; flex-shrink: 0;
}
.lead-list a::after {
  content: '→'; margin-left: auto; color: var(--vp-c-text-3, var(--vp-c-text-2));
  opacity: 0; transform: translateX(-4px); transition: opacity 0.15s ease, transform 0.15s ease;
}
.lead-list a:hover { background: var(--rw-hover-bg); }
.lead-list a:hover::after { opacity: 1; transform: translateX(0); }
.lead-list a:hover::before { background: var(--rw-grass); opacity: 1; }
.lead-list a:focus-visible { outline: 2px solid var(--rw-grass); outline-offset: 2px; }
.more-note { font-size: 0.9rem; color: var(--vp-c-text-2); line-height: 1.7; text-align: center; }
.more-note a { color: var(--rw-grass); }
@media (max-width: 960px) {
  .en-hero { grid-template-columns: 1fr; gap: 2.4rem; padding-top: 3rem; }
  .lead-grid { grid-template-columns: 1fr; gap: 2rem; }
}
</style>
