+++
date = 2026-02-21T00:00:00-05:00
title = "From Many Repos to One: An Honest Nx Monorepo Migration Retrospective"
categories = ['Programming']
tags = ['JavaScript', 'TypeScript', 'Angular', 'Nx']
+++

Migrating a standalone Angular app to [Nx](https://nx.dev/getting-started/intro) is a one-liner: `npx nx@latest init`. Migrating *many* Angular repos to an integrated monorepo is not. We consolidated several large enterprise Angular apps and libraries into a single Nx monorepo in late 2023. Here's what that actually looked like.

## Problem Statement

To share components across multiple frontend surfaces (a main web app, a [Microsoft Office add-in](https://learn.microsoft.com/en-us/office/dev/add-ins/develop/add-ins-with-angular2), and a [mobile app](https://ionicframework.com/)), we maintained multiple [Angular libraries](https://angular.io/guide/libraries). Every time we needed to change a shared component, the workflow looked like this:

1. Make the change in the library repo
2. Wait for CI to build and publish to a private npm registry
3. Run `npm run updatelibs` in every consuming app
4. Commit and push the version bump
5. Wait for the downstream CI pipelines

This was tedious, error-prone, and slow. Coordinating breaking changes across repos required scheduling overhead that had nothing to do with the actual feature work.

## Goal

The case for the monorepo was clear:

- **Simplified developer setup**: install Node, run `npm install`, and everything is ready (one lockfile, one `node_modules`)
- **Immediate compilation feedback**: library changes are consumed via TypeScript path mappings with no publish cycle and no version bump commits
- **Atomic changes**: a PR that modifies a shared component *and* its consumers ships as a single reviewable unit
- **Enforced boundaries**: `@nx/enforce-module-boundaries` prevents accidental cross-layer dependencies at lint time

## What We Had Before

Our frontend was split across several repositories:

| Repo | Purpose |
|---|---|
| Main web app | Angular 16 SPA, the primary user interface |
| Outlook add-in | Angular 16 app using Microsoft Office.js APIs |
| UI component library | Stateless presentational components (buttons, inputs, modals). Angular 14, published to private npm. |
| Data-aware component library | Complex API-connected components (grids, search panels, form builders). Angular 14, published to private npm. |

The Angular 14 vs 16 gap between the libraries and the applications was already a known problem at migration time. The data-aware component library also had three separate sub-projects: the library itself, a demo/test harness app, and a web-components wrapper built with Angular Elements.

### By the Numbers

| Metric | Before | After (monorepo) |
|---|---|---|
| `package.json` dependency entries | ~262 (across multiple files) | ~98 (1 file) |
| `package-lock.json` total lines | ~168,000 (multiple files) | ~35,000 (1 file) |
| CI/CD pipeline definitions | multiple independent | 1 parent + smart child triggers |
| ESLint configurations | multiple divergent | 1 unified root config |
| "lib bump" commits | ~239 per year, eliminated | 0 |

For context on scale: the consolidated codebase is ~210,000 lines of TypeScript, HTML, and SCSS across 2,605 files, with the oldest commit dating back to January 2019. The migration preserved all of it: 9,530 commits from 50 contributors, intact and browsable via `git blame`.

After migration, `nx affected` skips roughly 84% of build/test/lint work per MR. The average change touches 1-2 of 11 Nx projects, and more than half of all MRs touch just one. The 16% of MRs that span 3+ projects (cross-cutting changes that previously required coordinating multiple repo MRs and publish cycles) now ship as a single atomic commit.

## Process

### Pre-Migration Preparation

The actual merges happened in a single week, but that was only possible because of work done in the months before.

#### Step 1: Align Framework Versions (3 months before)

The Angular 14 vs 16 gap was a hard blocker. Running apps on Angular 16 while consuming Angular 14 libraries causes Ivy compilation issues. We upgraded both component libraries from Angular 14 to 16 in the release cycle roughly three months before the monorepo migration. It required several MRs to land cleanly.

**Lesson:** Do major version alignment work well before the merge. Don't try to debug a framework version mismatch *and* a monorepo structural merge at the same time.

#### Step 2: Convert the Most Complex Repo to Nx First

Rather than generating an empty Nx workspace and copying files in, we chose the most structurally complex repo (the data-aware component library with three sub-projects) and converted it to an Nx workspace structure directly. This became the seed of the monorepo. The remaining repos were merged into it.

The conversion commit was large (~478 files changed), but most changes were structural renames with zero content differences:

- Deleting `angular.json` (300+ lines) and replacing with per-project `project.json` files
- Renaming `tsconfig.json` to `tsconfig.base.json` (Nx convention)
- Moving source from `projects/` to Nx-standard `apps/` and `libs/` directories

**Why not `nx generate`?** Using `nx generate @nx/angular:app` for each project would have produced a cleaner baseline, but would have lost app-specific settings: environment configs, multiple serve targets, existing build configurations. Moving as-is meant the workspace was functional immediately after conversion, with configuration inconsistencies to clean up incrementally.

There was also a CI/CD proof-of-concept phase before the full merges. The new pipeline architecture was prototyped and tested separately. Don't skip this step.

### The Migration: One Week of Merges

#### Git History Strategy: `--allow-unrelated-histories`

We considered three approaches:

**Option A: `git merge --allow-unrelated-histories`** ✓ *What we chose*

Add each old repo as a git remote and merge with `--allow-unrelated-histories`. Preserves all commit history with original SHA hashes. `git blame` and `git log --follow` work going back to the original repos' earliest commits. The tradeoff is a bushy `git log` near the merge points.

```bash
git remote add web-app ../web-app-repo
git fetch web-app
git merge web-app/release/XX.X.X --allow-unrelated-histories
```

**Option B: `git filter-repo`**

Rewrite each repo's history to prefix all file paths before merging. Produces a cleaner linear history, but all commit SHAs are rewritten. Traceability to archived repos is lost.

**Option C: Fresh start**

Generate empty apps and libs, copy source files. Cleanest workspace, no history. Not seriously considered. History preservation was a priority.

The `--allow-unrelated-histories` approach was right. It was also the least risky and most reversible: if a merge went wrong, the branch could be reset without affecting the others.

#### Timeline

The merges happened over two days using separate feature branches per repo:

1. **Day 1**: Data-aware component library (seed). Established the base Nx structure.
2. **Day 2, morning**: Main web app
3. **Day 2, afternoon**: Outlook add-in
4. **Day 2, late afternoon**: UI component library

Using a separate feature branch per merge was important. Each merge was independently reviewable and rollback-able. The subsequent week was dedicated to stabilization: ~30 commits fixing CI/CD pipelines, build paths, code quality analysis tool configuration, and Nx affected calculations.

## Challenges

### 1. CI/CD: Preserving vs. Rewriting (Know the Tradeoff)

Each of the original repos had its own independent `.gitlab-ci.yml`. Rather than rewrite everything from scratch, we preserved the child pipelines largely intact and wrapped a new parent pipeline around them.

The resulting architecture:

```
.gitlab-ci.yml (parent)
├── install: npm ci
├── vet:
│   ├── format-check (nx format:check)
│   ├── lint (nx affected --target=lint)
│   ├── test (nx affected --target=test)
│   └── build (nx affected --target=build)
└── publish: tools/deploy.js → generates deploy.yml → triggers child pipelines
    ├── apps/web-app/.gitlab-ci.yml
    ├── apps/outlook-add-in/.gitlab-ci.yml
    └── libs/.../.gitlab-ci.yml  (one per publishable lib)
```

A deploy script queries Nx for projects tagged `publishable`, dynamically generates a trigger file, and kicks off the appropriate child pipelines based on which projects `nx affected` identified.

**Why this decision:** The child pipelines had working Docker builds, container registry pushes, code quality scans, and versioning integrations. Rewriting all of it would have taken weeks. Wrapping them in a parent pipeline took days. Shipping quickly mattered. It was the right call.

**The ongoing cost:** Each build job runs twice per pipeline: once in the parent (via `nx affected`) and again in the child. Every CI change requires understanding the parent/child interaction. This overhead compounds over time and is higher than we initially anticipated.

**The lesson:** Preserving existing pipelines is often the right pragmatic call. But go in with eyes open: treat CI/CD modernization as a first-class post-migration project rather than eventual cleanup. The longer it sits, the more the parent/child coupling accumulates context and the harder it becomes to untangle.

#### Specific CI/CD Issues Encountered

**1. Pipeline counter reset**

Each app's Docker image was tagged with a build number derived from the project-scoped pipeline counter (`$CI_PIPELINE_IID` in GitLab CI). When all pipelines moved to the new monorepo, this counter reset to 1. One of the archived repos' counters had been in the thousands. Build `1` in the monorepo would collide with old images from the archived repo in the container registry.

Short-term fix: an arithmetic offset in the CI YAML:
```sh
# Offset to avoid collisions with images from the archived repo
BUILD=$(($CI_PIPELINE_IID + 1280))
```

Proper fix: switch to the globally unique pipeline ID:
```diff
- BUILD: $CI_PIPELINE_IID
+ BUILD: $CI_PIPELINE_ID
```

`$CI_PIPELINE_ID` is globally unique across all projects in GitLab. `$CI_PIPELINE_IID` is project-scoped and resets when you move to a new repo. Use `$CI_PIPELINE_ID` for anything that needs to be globally unique (image tags, artifact names).

**2. `nx affected` base SHA confusion**

`nx affected` works by diffing the current commit against a base to determine which projects changed. After the `--allow-unrelated-histories` merges, Nx couldn't determine the correct base. The merge commits themselves appeared to have touched every file in each merged repo.

Initial workaround: hardcode a known-good commit SHA as `NX_BASE`. Proper fix:
```yaml
NX_BASE: ${CI_MERGE_REQUEST_DIFF_BASE_SHA:-$CI_COMMIT_BEFORE_SHA}
```

Use the MR diff base for MR pipelines, or the previous commit for push pipelines. This took a few iterations to land correctly.

**3. `nx.json` defaultBase for release branches**

Nx uses `affected.defaultBase` in `nx.json` as the base branch for local affected calculations. The default of `master` was wrong for development on a long-lived release branch. It would over-report affected projects. Fix: change `defaultBase` to the current release branch name, and automate that change as part of the release branch-cut process.

**4. Code quality tool path breakage**

After everything moved into `apps/` and `libs/` subdirectories, all configuration file paths for our static analysis tool were broken. This required several targeted fixes to fully resolve. **Lesson:** Before starting the merge, document every file whose path is hardcoded in CI: Docker build contexts, code quality config files, artifact upload paths, all of it.

---

### 2. TypeScript `tsconfig` Inheritance (The Sneaky One)

This was the most insidious challenge, and genuinely invisible until a TypeScript major version upgrade more than a year after the migration.

**Symptoms:** The IDE reported type errors that `nx build` did not. Red squiggles everywhere, but compilation succeeded.

**The setup.** In an Nx workspace, each app has a tsconfig hierarchy:
```
apps/your-app/
├── tsconfig.json         ← project root (declares "references")
├── tsconfig.app.json     ← compilation config for app code
├── tsconfig.spec.json    ← compilation config for tests
└── tsconfig.editor.json  ← IDE/language service config
```

**The root cause.** After the Nx conversion, `tsconfig.app.json` and `tsconfig.spec.json` were extending the workspace root `tsconfig.base.json` directly, skipping the intermediate project-level `tsconfig.json`:

```json
// tsconfig.app.json — the wrong setup
{
  "extends": "../../tsconfig.base.json"
}
```

In TypeScript 4.x, this worked fine. In TypeScript 5.x, the language service became stricter about the inheritance chain for project references. When `tsconfig.app.json` skipped the intermediate `tsconfig.json`, the language service couldn't see the `references` array, which is what tells it about other Nx projects (particularly libs) that provide types.

Result: the language service couldn't resolve imports from shared libraries, but `nx build` worked fine because Nx drives compilation through its project graph, not through tsconfig references alone. **Phantom IDE errors.** The mismatch was extremely confusing to diagnose because the compile output was clean.

**The fix:**
```diff
// tsconfig.app.json
- "extends": "../../tsconfig.base.json",
+ "extends": "./tsconfig.json",
```

Also add a `tsconfig.editor.json` per project:
```json
{
  "extends": "./tsconfig.json",
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.spec.ts"]
}
```

And update the project `tsconfig.json` to include `tsconfig.spec.json` and `tsconfig.editor.json` in its `references` array.

**The timeline of discovery:** This issue didn't exist at migration time (TypeScript was on 4.9.x). It appeared after the TypeScript 5.x bump but wasn't formally diagnosed and fixed until over a year later. The symptoms were easy to attribute to the concurrent Angular major version upgrade. Phantom IDE errors during a large framework bump are easy to write off as upgrade noise, which is exactly what made this hard to catch.

**The lesson:** After any TypeScript major version upgrade, explicitly verify that IDE type checking and the compiler agree on errors. If they diverge, check tsconfig inheritance chains first. Specifically, ensure `tsconfig.app.json` extends the *local* `tsconfig.json`, not the workspace root `tsconfig.base.json` directly.

Also worth noting: the original repos had meaningfully different compiler options that were simply preserved at merge time:

| Option | App 1 | App 2 | Lib 1 | Lib 2 |
|---|---|---|---|---|
| `target` | ES2022 | ES2022 | es2020 | es2020 |
| `module` | es2020 | es2020 | CommonJS | es2020 |
| `noImplicitOverride` | — | — | true | — |
| `noImplicitReturns` | — | — | true | — |
| `strictInjectionParameters` | — | — | — | true |

These inconsistencies were left largely as-is during the initial migration and unified over subsequent releases.

---

### 3. Package and Dependency Unification

#### Bootstrapping Dependencies Before All Repos Were Merged

When the most complex component library became the monorepo seed, its `package.json` only contained that library's dependencies. Before merging the remaining repos, all their dependencies had to be pre-installed. This added ~56 entries to `package.json` and ~33,000 lines to `package-lock.json` in a single commit.

This is an awkward but unavoidable step in a staged merge strategy: you need to install dependencies for code that doesn't exist in the repo yet.

#### The Staged Library Transition

The UI component library couldn't be immediately switched from an npm package to an in-repo lib. All consumers would need to update their imports simultaneously. The solution: a staged transition.

1. At merge time: Keep the library as an npm package (installed from the private registry), even though its source code is now in the repo
2. Later: Once the library was properly integrated as an Nx lib with path mappings in `tsconfig.base.json`, the npm package reference was removed

This meant there was a period where the library existed in the monorepo *and* was still being published and consumed as an npm package. That's fine. Don't rush the cutover.

#### Minor Version Drift

Across the repos, foundational packages had drifted:
- `zone.js`: `^0.11.8` (libs) vs `^0.13.0` (apps), unified upward
- `rxjs`: `^6.5.4`, `~6.6.0`, `^6.6.3` across repos, unified to the highest pinned version
- `@typescript-eslint/*`: one minor version behind in libs vs apps, unified upward

None of these caused breaking issues; they just needed to be picked and pinned to a single version.

---

### 4. Linter and Formatting Unification

The repos had meaningfully different ESLint setups:

| Feature | App 1 | App 2 | Lib 1 | Lib 2 |
|---|---|---|---|---|
| `@nx/enforce-module-boundaries` | Yes | Yes | No | No |
| Browser-specific globals | No | Yes (Office API) | No | No |
| Component selector prefix | `app` | `app` | None | `mylib` |
| `@typescript-eslint/recommended` at root | Yes | Yes | No | No |

The monorepo unified these at a root `.eslintrc.json`. Key decisions:
- `@nx/enforce-module-boundaries` was carried forward with structured dependency constraints (`type:app`, `type:feature`, `type:ui`, etc.)
- Browser-specific globals (from the add-in) were added to the root config
- Component selector prefix was standardized across the workspace

ESLint wasn't *fully* unified at migration time. Individual apps kept local `.eslintrc.json` files that extended the root, with duplicated rules. Consolidation happened incrementally; a single cleanup commit well over a year post-migration removed nine duplicated `extends` entries from two apps.

**The lesson:** A dedicated unification sprint immediately post-migration would have been far cleaner than incremental cleanup.

---

### 5. `nx affected` — Getting It Right Takes Multiple Attempts

`nx affected` is one of the primary benefits of an Nx monorepo, but getting it working correctly after a `--allow-unrelated-histories` merge requires a few specific things.

**Problem 1: The merge commits touched everything.** After the merges, Nx's affected calculation was confused. The merge commits themselves appeared to have changed every file in each merged repo. Initial workaround: hardcode a known-good commit SHA as `NX_BASE`. Proper fix:

```yaml
# Use the MR diff base for MR pipelines; previous commit for push pipelines
NX_BASE: ${CI_MERGE_REQUEST_DIFF_BASE_SHA:-$CI_COMMIT_BEFORE_SHA}
```

**Problem 2: `defaultBase` for long-lived branches.** Nx uses `affected.defaultBase` in `nx.json` as the base for local affected calculations. The default of `master` was wrong for development on a release branch. It would over-report affected projects. Fix: set `defaultBase` to the current working branch, and automate that update as part of your branch-cut process.

Getting `nx affected` right is worth the effort. At scale, it's the difference between a 5-minute and a 35-minute CI pipeline.

---

## Post-Migration Evolution

The monorepo hasn't stood still:

| Period | Angular | TypeScript | Nx |
|---|---|---|---|
| Migration (Sep 2023) | 16 | ~4.9 | 16 |
| 16 months post-migration | 16 to 18 | 4.9 to 5.5 | 16 to 19 |
| ~18 months post-migration | 16 to 19 (mega-upgrade, 500+ files) | 5.5 | 19 |
| ~2.5 years post-migration | 19 | ~5.7 | ~20.8 |

Several new shared libraries were added post-migration. The `README` explicitly directs new work to them. The migrated libs are in maintenance mode and stay that way.

The Angular 16 to 19 upgrade (~18 months after migration) was the most significant post-migration change: 553 files changed, 23,307 insertions, 36,069 deletions. The largest single commit in the repo's history.

As of early 2026: 754 merged MRs since the migration, 33 active contributors, 5 major Nx upgrades, and 3 major Angular upgrades completed. The monorepo didn't slow anyone down.

## Lessons Learned

### What Worked Well

**`--allow-unrelated-histories`** was the right git strategy. Full history preservation has ongoing value. `git blame` and `git log --follow` work on files going back to the original repos' earliest commits.

**Staged merges using separate feature branches** reduced blast radius. Merging one repo at a time, each on its own branch, meant failures were isolated and rollback-able without touching other in-progress work.

**Pre-migration framework version alignment** was essential. Completing the component library Angular upgrade three months before the merge meant the merge week could focus on structure rather than debugging a framework version mismatch.

**Converting the most complex repo to Nx first** gave a stable, tested foundation to merge the simpler repos into. Start with the hardest structural problem before bringing in any other moving parts.

### What We'd Do Differently

**Preserving the old CI/CD pipelines** was the right pragmatic call to ship quickly, but the ongoing maintenance overhead (duplicate build jobs, coupled config, context-switching between parent and child) was higher than anticipated. Treat CI/CD modernization as a first-class post-migration project, not eventual cleanup.

**Not fully unifying configuration at migration time** left ESLint rules, tsconfig flags, and package scripts inconsistent. A dedicated unification sprint immediately post-migration would have compressed what ended up being gradual cleanup over many months.

### What Was Hard to Predict

**The TypeScript 5 tsconfig inheritance change** was genuinely invisible until after the TypeScript upgrade. There was no way to know this would break at migration time. The key diagnostic: if IDE errors and `nx build` disagree, check tsconfig inheritance chains first. Ensure `tsconfig.app.json` extends the *local* `tsconfig.json`, not the workspace root `tsconfig.base.json` directly.

**`nx affected` complexity with merged histories.** The `--allow-unrelated-histories` approach creates a large "touched surface" that Nx can't easily diff around. The solution is straightforward once you know it, but diagnosing it from CI logs takes a few iterations.

### If You're Planning a Similar Migration

1. **Do the major version alignment work 1-3 months before the merge**, not during
2. **Build and test a prototype CI/CD pipeline** against the new parent structure before doing any of the merges
3. **Allocate a full week of dedicated time** for stabilization. Plan no feature work for that sprint.
4. **Decide on CI/CD preservation vs. rewrite deliberately.** Preserving is often the right call to ship quickly, but plan a dedicated modernization sprint soon after rather than letting the parent/child coupling calcify.
5. **After any TypeScript major version upgrade**, verify that IDE errors and compiler errors agree. If they diverge, check tsconfig inheritance chains immediately.
6. **Document every path hardcoded in CI** before starting the merge: Docker build contexts, code quality config paths, artifact upload destinations, all of it.
