# Blog Agent Guide — Brad Carey

Write like a developer explaining something at a coworker's desk: competent, concise, occasionally funny, respectful of their time. Posts exist because I hit a problem, solved it, and figured someone else would hit the same wall.

## Creating a New Post

### File

Place new posts in `content/posts/`. Use a short, descriptive kebab-case filename with no date prefix: `my-post-title.md`.

### Front Matter

Use YAML front matter delimited by `---`. `title` and `date` are required. Use ISO 8601 for dates.

```yaml
---
title: "Your Post Title"
date: 2026-03-17T12:00:00-05:00
categories:
  - Programming
tags:
  - SomeTag
---
```

**Available fields (all optional except `title` and `date`):**

| Field             | Type   | Description                                                 |
| ----------------- | ------ | ----------------------------------------------------------- |
| `title`           | string | Post title.                                                 |
| `date`            | string | Publication date (ISO 8601).                                |
| `categories`      | list   | Top-level groupings (e.g. `Programming`, `Fitness`).        |
| `tags`            | list   | Specific topic tags.                                        |
| `series`          | list   | Groups related posts (e.g. `Experiments`).                  |
| `author`          | list   | Author name(s). Omit unless overriding site default.        |
| `featuredImage`   | string | Path or URL to an image displayed below post metadata.      |
| `math`            | bool   | Enable MathJax for this post. Default `false`.              |
| `katex`           | bool   | Enable KaTeX for this post. Default `false`.                |
| `disableComments` | bool   | Disable comments on this post. Default `false`.             |
| `externalLink`    | string | Redirects post link to an external URL instead of the body. |
| `canonicalUrl`    | string | Override `<link rel="canonical">` in `<head>`.              |

### Content

Write the body in Markdown. Use `{{< highlight lang >}}...{{< /highlight >}}` shortcodes for fenced code blocks — do not use triple-backtick fences. Follow the voice and structure guidelines below.

### Images

Store images in `static/images/YYYY/filename.ext`. Reference them as `/images/YYYY/filename.ext` in Markdown or in `featuredImage`.

### Hugo CLI

Scaffold a new post (auto-populates date, sets `draft: true`):

```sh
hugo new posts/my-post-title.md
```

Preview locally (omits drafts):

```sh
hugo serve
```

Preview including drafts:

```sh
hugo serve -D
```

**Important:** Posts created via `hugo new` have `draft: true` set by the archetype. Remove that line (or delete it entirely) before publishing — drafts are excluded from the production build.

### Format Note

Use YAML front matter (`---` delimiters). Older posts in the repo use TOML (`+++`) — ignore that pattern, YAML is preferred going forward.

---

## Voice

- **Direct.** Short declarative sentences. No filler. No throat-clearing.
- **Problem-first.** Open by identifying what's broken, missing, or inadequate.
- **Opinionated.** State things plainly. No hedging. Back opinions with experience.
- **Simple.** Recommend the simplest solution. Celebrate minimalism.
- **Honest.** Acknowledge tradeoffs, caveats, and limitations up front.
- **Teaching.** Show the reasoning, not just the answer. Walk through the logic.

## Tone

Casual-professional. Serious foundation with dry humor injected naturally — never forced. Strongly practical; theory only when it serves the solution. Confident and direct.

## Humor

Dry, self-aware. Comes from absurdity, honest frustration, or unexpected juxtaposition.

> *"I was bored and decided to see what PixiJS is all about. Sooo... I made a tornado of chickens."*
> *"Walmart.com now thinks I am a robot due to pressing F5 so many times."*
> *"Who debugs the debugger?"*

## Post Structure

1. **Problem** — 1–2 sentences. What's the issue?
2. **Context** — Brief. Why it matters, what's been tried.
3. **Solution** — Code, steps, or explanation. Concise.
4. **Caveats** — Limitations or better alternatives, if applicable.
5. **End** — Stop when done. No wrap-up, no sign-off.

Code examples should be complete and working, not fragments. Include tests when relevant. Don't narrate every line.

## Style Patterns

**Use:** parenthetical qualifiers for nuance, "Basically" as a simplification marker, direct address ("you"/"your"), imperative form for instructions, exclamation points only when genuinely excited.

**Never:** em dashes, hyphens as punctuation, emojis, "In this post we will...", "Let's dive in!", "Thanks for reading!", hashtags, corporate buzzwords ("leverage", "synergy"), excessive hedging ("perhaps", "arguably"), artificial enthusiasm, SEO filler.

CRITICAL: Stop using em dashes! How many times do I have to tell you?

## Example Openings

> *"After searching through Google and StackOverflow and finding nothing, I decided to write my own..."*
> *"The default Windows 11 setup is slow, packed with bloat, and frankly, a bit invasive."*
> *"Unfortunately, SSMS seems to truncate json strings that are longer than 2033 chars no matter what you do."*

## Example Opinions

Good: *"YouTube Shorts feel like junk food to me — quick dopamine hits that leave me unsatisfied and craving more."*
Bad: *"Some users may find that short-form content isn't always the most productive use of their time."*

## Cross-Domain Topics

Non-tech topics (fitness, productivity, hardware) use the same voice. Programming metaphors carry naturally: *"Strength training is a systems upgrade. It improves throughput (energy), stability (stress), error rates (focus), and uptime (health) across the entire human stack."*
