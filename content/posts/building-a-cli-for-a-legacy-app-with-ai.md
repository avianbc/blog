+++
date = 2026-03-13T21:00:00-04:00
title = "I Built a Full CLI for a Legacy CRM in One Evening (with AI)"
categories = ['Programming']
tags = ['AI', 'Python', 'CLI', 'Claude Code']
+++

Our CRM platform has been around for over a decade. The backend is a sprawl of three separate HTTP services: a legacy REST API (v1), a newer REST API (v2), and an Elasticsearch-backed search service. They share a JWT token but have different base URLs, different conventions, and different quirks. There's no unified CLI. If you want to poke at the API, you open Swagger, copy a Bearer token, and start curling.

I decided to fix that. With Claude Code and an open-source framework called [CLI-Anything](https://github.com/HKUDS/CLI-Anything), I built a fully working Python CLI with CRUD for six entity types, four search modes, an interactive REPL, and 47 tests. The whole thing took one evening and one afternoon. 18 commits. About 3,000 lines of code.

Here's how it actually went.

## 10:28 PM — The initial generation

CLI-Anything is a Claude Code plugin that analyzes a piece of software and generates a CLI harness for it. You point it at your API docs or codebase, and it runs through a pipeline: analyze, design, implement, write tests, document. The initial scaffold dropped 2,738 lines across 23 files. A full Click-based CLI with commands for companies, contacts, opportunities, projects, activities, personnel, and search.

My first prompt after generation:

> "Run the command `--help`"

It worked. Subcommands, options, help text. Promising.

> "How can we use it? I need to init it or configure it or add credentials or something, right?"

## 10:37 PM — Nothing works yet

I tried to log in. It failed immediately. The generated code had the wrong base URL domain. First fix.

Then token parsing broke because the API returns PascalCase field names (`Token`, `RefreshToken`) and the code expected lowercase. Second fix.

Then search commands were routing to the wrong service entirely (hitting the v2 API instead of the search service). The generated code didn't know these were separate services with separate URLs. Third fix.

This is the part that would scare people off if they stopped here. "AI-generated code doesn't work!" Correct. It almost never works on the first try against a real production system with undocumented quirks. The question is how fast can you close the gap.

## 10:54 PM — Search works, output is ugly

Search was returning data, but the output was a wall of JSON with dozens of fields per result. I told Claude:

> "I was hoping you'd basically just do a JS-style map on the collection and still show JSON but only the stuff we care about."

It added a projection layer. Each entity type gets its own field whitelist. Search results come back clean. That's when the CLI started feeling like a tool instead of a prototype.

## 11:38 PM — The v1/v2 routing mess

This was the biggest architectural fix. The original generated code treated everything as one API. In reality, the platform has a clear split:

- **v1** handles all basic CRUD (list, get, create, delete). Endpoints like `api/companies`.
- **v2** handles specialized operations (find-by, staff teams, notes, financial details). Endpoints like `api/rest/companies/find-by/name`.

Claude restructured the entire client layer. Three separate base URLs, three client factories, and every command routed to the correct service. It also discovered that v1 requires an `x-compass-api-key` header that v2 doesn't need.

And then the fun one: v1's POST (create) endpoints expect the request body wrapped in a JSON array `[{...}]`, not a single object. The kind of quirk that wastes an hour when you hit it for the first time. Claude found it and fixed it during live testing.

## 11:15 PM — CLAUDE.md and the meta-layer

I had Claude analyze the codebase it just built and write a `CLAUDE.md` file — a set of instructions for future Claude sessions working in this repo. It documented the three-service architecture, the client routing rules, the output conventions, the test patterns. This is the part that pays dividends later. The next person (or AI) to touch this repo doesn't have to rediscover the v1/v2 split.

## The next afternoon — Live testing and polish

The following day I tested every command against a live environment. A few were broken:

- Opportunity and project `get` commands were hitting v2 when they should've been using v1
- The `add-note` command had a wrong endpoint path
- Financial data commands needed to be split into their own subcommands

Each fix was a short conversation. "The ideal behavior: fix the opportunities notes issue. The opp/projects get should use v1 client." Claude would formulate a plan, implement it, run the commands as a sanity check.

I also tested CRUD operations end-to-end. Created a company with realistic data, verified it showed up, deleted it. Created contacts, opportunities, personnel. Everything went through the CLI.

## The rename

The generated project had an unwieldy name from the framework scaffolding. I asked Claude for suggestions, picked one that matched our internal branding, and it handled the rename across setup.py, entry points, session directories, README, and CLAUDE.md. Bumped the version to 0.1.0.

## What I actually did vs. what the AI did

Let me be honest about the division of labor.

**I did:**
- Chose the target software and provided credentials
- Decided which environment to test against
- Made architectural decisions ("v1 for CRUD, v2 for specialized ops")
- Caught bugs by running commands and reading output
- Picked the project name
- Approved every commit

**Claude did:**
- Generated the initial 2,738-line scaffold
- Fixed every bug I reported (usually within one exchange)
- Wrote all 47 tests
- Wrote the README, CLAUDE.md, and all documentation
- Restructured the three-client architecture
- Handled the rename across all files

My role was more like a tech lead doing a code review than a developer writing code. I described problems and made decisions. The AI wrote the code.

## The final product

18 commits over about 20 hours of wall-clock time (maybe 4-5 hours of active work):

- Full CRUD for 6 entity types (companies, contacts, opportunities, projects, activities, personnel)
- 4 search modes (quick search, Lucene queries, recently viewed, duplicate detection)
- Named environment configs (7 environments including local dev)
- Interactive REPL with history and auto-suggestions
- Auto-refresh on expired tokens
- 33 unit tests (mocked, no HTTP) + 14 E2E tests
- `--json` flag for script/agent consumption
- Comprehensive README and contributor docs

## The takeaway

The AI didn't know our API. It got the domain wrong, the field casing wrong, the service routing wrong, the request format wrong, and the required headers wrong. Every single one of those things would have also tripped up a new developer on the team.

The difference is speed. Each fix took seconds to minutes, not hours. The feedback loop was: run command, see error, describe the problem, get a fix, run again. That loop executed maybe a dozen times over the course of the evening and by the end I had a polished, tested, documented CLI.

If you have a legacy system with a REST API and no CLI, this is now a one-evening project. The tooling isn't perfect. But it's fast enough that "perfect on the first try" doesn't matter.
