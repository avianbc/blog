---
title: Weight Projector - Interactive Calorie Tracker
date: 2026-02-16T14:30:00-05:00
categories:
  - Programming
tags:
  - JavaScript
  - Chart.js
  - Health
series:
  - Experiments
---

I wanted a simple way to visualize weight loss projections over time, and while sites like [Losertown](https://www.losertown.org/eats/cal.php) provide calculations, they only display results in an HTML table. I wanted something with a nice graph that shows the trajectory at a glance.

**[Try the Weight Projector](/weight-projector.html)**

## Features

The Weight Projector calculates your weight trajectory over a full year based on your profile and daily calorie budget:

- **Adaptive TDEE Calculation** - Uses the Mifflin-St Jeor equation and recalculates your Total Daily Energy Expenditure (TDEE) every day as your weight changes, providing more accurate long-term projections
- **Interactive Chart** - Powered by Chart.js for a clean, responsive visualization of your weight over time
- **Imperial & Metric Units** - Toggle between pounds/inches and kilograms/centimeters with automatic conversion
- **Goal Tracking** - Set an optional goal weight and see when you'll reach it
- **Activity Levels** - Accounts for different activity levels from sedentary to very active
- **Local Storage** - Your inputs are automatically saved in your browser

## How It Works

The tool takes your current stats (gender, weight, height, age, activity level) and calculates your starting BMR and TDEE. Then it simulates each day for the next year:

1. Calculate your current TDEE based on your weight that day
2. Determine the calorie deficit (or surplus) from your daily budget
3. Convert that to weight change (roughly 3,500 calories per pound)
4. Update your weight for the next day

This adaptive approach means the projection accounts for the reality that your caloric needs decrease as you lose weight (or increase as you gain).

## Technical Notes

Built with vanilla JavaScript and Chart.js (with the annotation plugin for marking goals). No build step, no frameworks - just a single HTML file with embedded styles and scripts. The calculations happen entirely client-side, so your data never leaves your browser.

Check it out at [/weight-projector.html](/weight-projector.html) and see what your year could look like!
