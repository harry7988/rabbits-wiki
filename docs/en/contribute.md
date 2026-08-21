---
title: Contribute — No Coding Required
description: Contribute to rabbits.wiki with the help of any AI assistant — copy a prompt, paste it to ChatGPT/Claude/Gemini, and it walks you through GitHub step by step.
lastReviewed: 2026-08-22
---

# 🤝 Contribute — No Coding Required

<Info title="The zero-barrier path">

You never need to touch Git, Markdown, or a terminal. **Copy a prompt below, paste it into any AI assistant** (ChatGPT / Claude / Gemini / Copilot), and it will walk you through everything — including GitHub.

</Info>

## Prompt 1: Fix an error (most common)

<PromptCard title="AI walks me through fixing an error on GitHub" scene="For typos, dead links, outdated info, or content errors. Zero GitHub knowledge needed.">

```
I want to contribute a correction to rabbits.wiki — a VitePress rabbit-care encyclopedia whose GitHub repository is at {{REPO_URL}}. I have never used GitHub or a command line. Guide me through the entire process step by step.

Rules: give me ONE step at a time — what page to open, what to click, what to type — then wait until I confirm before giving the next step.

What I want to do: fix a content error.

Details —
Page with the error: [paste the URL, or describe which page/section]
Where exactly: [which paragraph/sentence]
What it currently says: [current text]
What it should say: [corrected text]
My source/basis: [paste an authoritative source link if you have one; otherwise write "personal observation"]

Also remind me to fill in the repository's PR template, and to state whether I verified the source.
```

</PromptCard>

## Prompt 2: Write new content

<PromptCard title="AI turns my material into a site-compliant draft" scene="For sharing rabbit-care experience or research; the AI formats it to this site's sourcing rules.">

```
You are the content editor of rabbits.wiki, a rabbit-care encyclopedia. Convert my material into a Markdown draft that meets the site's requirements.

Hard requirements —
1. Frontmatter with: title, description, lastReviewed (today's date)
2. Every medical/physiological/drug claim must carry a source. At the end of the file, list all sources using SourceCard components inside a SourceList block, each written as:
   <SourceCard title="page title" author="organization/author" url="source URL" accessed="date" level="vet" note="what was used from it" />
   level: vet = veterinary authority (House Rabbit Society, Merck Vet Manual, VCA, universities, peer-reviewed) / org = professional organization / exp = owner experience (exp alone can never support a medical claim)
3. Medical conclusions need at least 2 independent authoritative sources; if data cannot be found, write "no authoritative data available" — never invent numbers or dosages
4. Prescription drugs must be labeled "veterinary prescription required"; use the VetCheck component for see-a-vet signals
5. Use Warning / Danger / Info components for callouts; FirstAidStep for procedures
6. Always leave a blank line between component tags and content (otherwise Markdown breaks)
7. Never add favorable/disparaging evaluations of product brands — sourced data statements only
8. Plain register, no marketing language

My material:
[paste your notes/experience/research here]

If key claims lack sources, list them separately as "to verify" — do not invent sources for me.
```

</PromptCard>

## Prompt 3: Full walkthrough (Fork → PR)

<PromptCard title="From Fork to Pull Request, guided end-to-end" scene="For first-timers who want the complete flow, optionally with a local preview.">

```
I want to contribute to a VitePress website on GitHub (repository: {{REPO_URL}}). Walk me through the entire flow: forking, editing files in the web UI, (optionally) running a local preview, and opening a Pull Request. I am a complete beginner.

My OS: [Windows / macOS]
What I want to do: [new page / major edit / translation]

Rules:
1. One step at a time; wait for my confirmation
2. Explain what each command does
3. If Node.js is missing, help me install it the easiest way first
4. Finish by showing me how to fill the PR template: change description + source checklist
5. Remind me that medical content requires reviewer approval before merge — that is normal
```

</PromptCard>

## Translation (this page's origin)

This site's primary language is Chinese; English is a growing curated edition. Translating a Chinese page into English (or improving an existing one) is itself a valuable contribution — Prompt 3 works for it too.

Full contributing guide (credibility rules, CODEOWNERS review, CC BY-SA licensing) → [中文：参与共创](../contribute)（the authoritative version of the sourcing standards embedded in the prompts above）.
