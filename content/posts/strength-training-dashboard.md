---
title: "Proof Of Work: A Strength Training Dashboard"
date: 2026-02-28T12:00:00-05:00
categories:
  - Programming
  - Fitness
tags:
  - SvelteKit
  - Svelte
  - ECharts
  - Python
  - TypeScript
series:
  - Experiments
---

I've been tracking my workouts with [the same Android app](https://play.google.com/store/apps/details?id=com.maxworkoutcoach.workouttrainer.workouttrainer&hl=en_US) for almost 7 years. Nearly a thousand workouts, 59,000 reps, 6.8 million pounds of volume. The app does its job, but the data just sits there. I wanted to actually see it.

**[Check out the dashboard](/dashboard/)**

## The Problem

Workout apps are great at recording sets and reps. They're terrible at showing you the big picture. I wanted to answer questions like: how has my squat progressed over 6 years? When was my best training year? How consistent am I really? What does 6.8 million pounds even look like?

So I built a dashboard.

## The Pipeline

The data lives in a SQLite database on my phone (exported from MyRoutine/StrongLifts). The pipeline is intentionally stupid:

1. Export the `.db` file from my phone
2. Run a Python script that queries the database and writes JSON
3. SvelteKit builds a static site from that JSON
4. Hugo deploys it to my blog

No server. No API. No database in production. Just static files.

The Python script is about 1,900 lines of SQL queries and data transformations. It extracts everything: volume time series, estimated one-rep maxes (Epley formula, capped at 8 reps for accuracy), PR histories, powerlifting totals, body weight, Polar heart rate sessions, and a bunch of fun stuff I'll get to in a minute.

The output gets split into two JSON files. A small one (~53KB) loads immediately with the page. A larger one (~718KB) lazy-loads after mount. With gzip, the initial payload is about 13KB. The user sees summary stats instantly while charts load in the background.

## The Fun Stats

Raw numbers are boring. Context makes them interesting.

Total volume is 6.8 million pounds. That's roughly **2,267 Honda Civics**. Calories burned converts to pizza slices (at 285 kcal per slice). Training hours get expressed as consecutive days.

The bar travel calculation is my favorite. I physically measured the range of motion for each lift: squat is 47 inches per rep (23.5 down, 23.5 up), bench is 38 inches, deadlift is 50.3 inches, OHP is 48 inches. Multiply by total reps per lift, convert to miles, and compare against landmarks. Total bar travel: **29+ miles**, or about **5.3 Everest climbs**.

Plate milestones track the first time you hit standard barbell thresholds (135, 225, 315, 405, 495) for each lift. The dashboard shows these as an achievement grid with dates.

Powerlifting total (squat + bench + deadlift) tracks club milestones: 500, 750, 1000, 1100, 1200+ clubs. Peak total: 1,276 lbs.

## Architecture

[SvelteKit 2](https://svelte.dev/docs/kit/introduction) with Svelte 5 runes. One route. The entire dashboard is a single page component. I know that sounds bad, but it's a dashboard, not a SaaS app. Data flows down through props and derived state. No stores needed for data, just two small class-based stores for theme and unit preferences.

Charts use [Apache ECharts](https://echarts.apache.org/en/index.html) with aggressive tree-shaking (only importing the chart types and components actually used). Each chart lives in its own component, wrapped in a `LazyChart` component that uses IntersectionObserver to delay rendering until the chart scrolls near the viewport.

The calendar heatmap is the one exception to ECharts. That's hand-rolled SVG, GitHub contribution graph style. It uses quartile-based dynamic thresholds (Q25/Q50/Q75) instead of fixed breakpoints, so the color intensity adapts to your actual data distribution. Three view modes: volume, heart rate, and calories.

Everything reacts to theme and unit toggles. Dark mode is "Iron Archive" (charcoal with copper accents). Light mode is "Chalk & Iron" (warm cream). Toggle between pounds and kilograms and every number, chart axis, and tooltip updates. The unit system auto-detects from your locale.

## Design

No Tailwind. Custom CSS design system with variables. Three fonts: Bebas Neue for headings, Source Sans 3 for body text, JetBrains Mono for data. Lift-specific colors that stay consistent everywhere (squat is red, bench is blue, deadlift is green, OHP is amber).

Summary stats use an animated count-up effect that triggers when they scroll into view and respects `prefers-reduced-motion`. The E1RM chart marks PRs with star icons and draws dashed lines at plate milestones so you can see progression against culturally meaningful thresholds.

## Tools

The [Wilks score](https://strengthlevel.com/wilks-calculator) implementation normalizes your powerlifting total against body weight, which is how competitive powerlifters compare across weight classes. The relative strength chart tracks body weight multiples over time (peak: 2.22x bodyweight squat at 180 lbs).

Heart rate data comes from [Polar Flow](https://flow.polar.com/) session exports, merged into the same timeline. Monthly averages, max HR tracking, and estimated cardio load.

## What I'd Do Differently

The `+page.svelte` file is 917 lines. It works, but some of the data reshaping in there should have been pushed into the Python extraction step or at least into utilities. A few insight strings are hardcoded when they should be derived from data. No tests. Typical side project stuff.

The deferred data loads eagerly on mount. It should load per-section as you scroll. The TODO has been sitting there for a while.

## The Stack

SvelteKit 2 (static adapter), Svelte 5 runes, TypeScript, Apache ECharts 6, Python 3 for data extraction, deployed through Hugo on Netlify. About 5,000 lines of application code and 1,900 lines of Python.

**[See it live](/dashboard/)**
