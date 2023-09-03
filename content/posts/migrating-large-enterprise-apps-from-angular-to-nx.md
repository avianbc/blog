+++
draft = true
date = 2023-08-24T10:49:47-04:00
title = "Lessons Learned: Migrating large enterprise apps from Angular CLI to Nx"
categories = ['Programming']
tags = ['JavaScript', 'TypeScript', 'Angular', 'Nx']
+++

Migrating a standalone Angular app to [Nx](https://nx.dev/getting-started/intro) is as easy as running a command: `npx nx@latest init`. Migrating many angular repos to an integrated Nx monorepo turned out to be much more involved than just running `npx nx@latest init --integrated`. This post outlines some of the challenges and lessons learned from migrating many large enterprise applications and libraries from an Angular CLI to Nx.

## Problem statement

In order to share components between multiple interfaces (web, [mobile](https://ionicframework.com/), and a [MS Office add-in](https://learn.microsoft.com/en-us/office/dev/add-ins/develop/add-ins-with-angular2)), we rolled multiple [angular libraries](https://angular.io/guide/libraries). When we needed to make a change in a shared component, we would need to build it, publish it, and then update the version in the consuming app.

This was a tedious process that was prone to error. We needed a better way to share code between multiple apps.

## Goal

Migrating to Nx provided many easy wins:

- Much easier dev setup: install node, run `npm install`, and you're ready to go.
- The compiler imediately enforces breaking changes.
- No more waiting on a lib to be published before
