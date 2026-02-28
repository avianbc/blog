+++
draft = true
date = 2023-08-24T10:49:47-04:00
title = "Lessons Learned: Migrating large enterprise apps from Angular CLI to Nx"
categories = ['Programming']
tags = ['JavaScript', 'TypeScript', 'Angular', 'Nx']
+++

Migrating a standalone Angular app to [Nx](https://nx.dev/getting-started/intro) is as easy as running a command: `npx nx@latest init`. Migrating many angular repos to an integrated Nx monorepo turned out to be much more involved than just running `npx nx@latest init --integrated`. This post outlines some of the challenges and lessons learned from migrating many large enterprise applications and libraries from an Angular CLI to Nx.

## Problem statement

In order to share components between multiple interfaces (web, [mobile](https://ionicframework.com/), and a [MS Office add-in](https://learn.microsoft.com/en-us/office/dev/add-ins/develop/add-ins-with-angular2)), we rolled multiple [angular libraries](https://angular.io/guide/libraries). When we needed to make a change in a shared component, we would need to build it, publish it to a private npm registry, and then update the version in the consuming app.

This was a tedious process that was prone to error. We needed a better way to share code between multiple apps.

## Goal

Migrating to Nx provided many easy wins:

- Much easier dev setup: install node, run `npm install`, and you're ready to go.
- The compiler imediately enforces breaking changes.
- No more waiting on a lib to be published before you can test your changes in the consuming app.
- A single source of truth for all code

## Process

- TODO: Challenges creating the Nx repo (choosing between the various types of monorepos(integrated vs standalone)
- Migrating a single library to Nx (using `npx nx@latest init` and then moving the library code into the new repo)
- Preserve git history
- CI/CD issues
- Unifying linter rules + code styling

## Challenges

Each app and library has its own build pipeline. CI/CD for monorepos is more complex than for standalone repos but the benefits outweigh the costs. We used Nx's [affected](https://nx.dev/recipes/monorepo-ci#affected) command to only run tests and builds for the apps and libs that were affected by a change. We were able to create a parent pipeline that runs the affected command for each app and library, and then runs the appropriate child pipelines for each app and library. This allowed us to maintain the same level of confidence in our builds and tests while also reducing the time it takes to run them.
