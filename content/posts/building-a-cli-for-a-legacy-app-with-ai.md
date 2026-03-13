+++
date = 2026-03-13T12:00:00-04:00
title = "I Built a Full CLI for a Legacy Web App in One Afternoon (with AI)"
categories = ['Programming']
tags = ['AI', 'Python', 'CLI', 'Claude Code']
+++

Our platform has been around for nearly two decades. The backend is a sprawl of three separate HTTP services: a legacy REST API (v1), a newer REST API (v2), and an Elasticsearch-backed search service. They share a JWT token but have different base URLs, different conventions, and different quirks. There's no unified CLI. If you want to poke at the API, you open Swagger, copy a Bearer token, and start curling.

I decided to fix that. With Claude Code and an open-source framework called [CLI-Anything](https://github.com/HKUDS/CLI-Anything), I built a fully working Python CLI with CRUD for six entity types, four search modes, an interactive REPL, and 47 tests. One afternoon. 18 commits. About 3,000 lines of code.

Here's how it actually went.

## How CLI-Anything works

CLI-Anything is a Claude Code plugin. You install it from the marketplace, point it at a codebase or API docs, and it runs a 7-phase automated pipeline:

1. **Analyze** — scans the source, maps functionality to commands
2. **Design** — architects command groups, state model, output formats
3. **Implement** — builds the actual CLI using [Click](https://github.com/pallets/click), a Python library for composing command-line interfaces declaratively
4. **Plan Tests** — writes a TEST.md with unit and E2E test plans
5. **Write Tests** — implements the test suite
6. **Document** — generates README and results
7. **Publish** — creates `setup.py`, installs the CLI to PATH as a proper pip package

Click is doing the heavy lifting on the CLI side. It handles argument parsing, subcommand routing, help text, and type validation. The generated code also includes a REPL mode (enter the command bare, no subcommand, and you get an interactive shell with history and autocomplete) and a `--json` flag on every command for machine consumption.

The output is a pip-installable Python package. `pip install -e .` and your new command is on PATH.

## The initial generation

I pointed CLI-Anything at our API and let it run. The initial scaffold dropped 2,738 lines across 23 files. A full Click-based CLI with commands for companies, contacts, opportunities, projects, activities, personnel, and search.

My first prompt after generation:

> "Run the command `--help`"

It worked. Subcommands, options, help text. Promising.

## Nothing works yet

I tried to log in. It failed immediately. The generated code had the wrong base URL domain. First fix.

Then token parsing broke because the API returns PascalCase field names (`Token`, `RefreshToken`) and the code expected lowercase. Second fix.

Then search commands were routing to the wrong service entirely (hitting the v2 API instead of the search service). The generated code didn't know these were separate services with separate URLs. Third fix.

Three bugs in the first ten minutes. This is the part that would scare people off if they stopped here. "AI-generated code doesn't work!" Correct. It almost never works on the first try against a real production system with undocumented quirks. The question is how fast you can close the gap. Each of these fixes took about 30 seconds of conversation.

## The v1/v2 routing fix

This was the biggest architectural change. The original generated code treated everything as one API. In reality, the platform has a clear split:

- **v1** handles all basic CRUD (list, get, create, delete). Endpoints like `api/companies`.
- **v2** handles specialized operations (find-by, staff teams, notes, financial details). Endpoints like `api/rest/companies/find-by/name`.
- **search** is its own service entirely, with a different base URL.

I described the architecture and Claude restructured the entire client layer. Three separate base URLs, three client factories, every command routed to the correct service. It also discovered that v1 requires a special API key header that v2 doesn't need.

And then the fun one: v1's POST (create) endpoints expect the request body wrapped in a JSON array `[{...}]`, not a single object. The kind of quirk that lives in no documentation and wastes an hour when you hit it for the first time. Claude found it and fixed it during live testing.

## Live testing

I tested every command against a running environment. Created a company with realistic data, verified it showed up, deleted it. Created contacts, opportunities, personnel. Ran searches, checked projections, exercised the REPL.

A few commands needed fixes. Opportunity and project `get` were hitting v2 when they should've used v1. Financial data needed its own subcommand. Each fix was a short exchange: describe the problem, get a fix, verify. The feedback loop was tight.

## The meta-layer

I had Claude analyze the codebase it just built and write a `CLAUDE.md` file — a set of instructions for future AI sessions working in this repo. It documented the three-service architecture, the client routing rules, the output conventions, the test patterns. This is the part that pays dividends later. The next person (or AI) to touch this repo doesn't have to rediscover the v1/v2 split or the array-wrapping quirk.

## What I actually did vs. what the AI did

**I did:**
- Chose the target software and provided credentials
- Made architectural decisions ("v1 for CRUD, v2 for specialized ops")
- Tested commands and reported what was broken
- Picked the project name
- Approved every commit

**Claude did:**
- Generated the initial 2,738-line scaffold
- Fixed every bug I reported (usually in one exchange)
- Wrote all 47 tests
- Wrote the README, CLAUDE.md, and all documentation
- Restructured the three-client architecture
- Handled the project rename across all files

My role was closer to a tech lead doing a code review than a developer writing code. I described problems and made decisions. The AI wrote the code.

## The final product

18 commits, one afternoon:

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

The difference is speed. Each fix took seconds, not hours. The feedback loop was: run command, see error, describe the problem, get a fix, run again. That loop executed maybe a dozen times over the course of the afternoon and by the end I had a polished, tested, documented CLI.

If you have a legacy system with a REST API and no CLI, this is now a one-afternoon project. The tooling isn't perfect. But it's fast enough that "perfect on the first try" doesn't matter.
