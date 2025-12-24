+++
date = 2025-04-12T17:50:42-05:00
title = "Quasicrystals in Your Browser"
categories = ['Programming']
tags = ['JavaScript', 'Quasicrystals']
featuredImage = "/images/2025/quasicrystal.gif"
+++

# [Click here to view the interactive demo](/quasicrystals/)

Epilepsy warning: The demo contains rapidly changing patterns and colors which may trigger seizures in susceptible individuals.

What is a quasicrystal? From [Matthias Matthiesen](https://blog.matthen.com/post/51566631087/quasicrystals-are-highly-structured-patterns-which):

> Quasicrystals are highly structured patterns which are not periodic. Unlike the crystalline structure of e.g. hexagons, a quasicrystal will never line up perfectly with a shifted copy of itself. Here such a structure is created as the interference pattern between 7 waves approaching the centre of the image at equal angles. The 2011 Nobel prize in Chemistry was awarded for the discovery of quasicrystals in chemical compounds.

I originally attempted to use canvas but performance was poor. Instead, I used a fragment shader to render the pattern in real-time.

The inspiration for this demo comes from:
- https://wealoneonearth.blogspot.com/search/label/quasicrystal
- https://mainisusuallyafunction.blogspot.com/2011/10/quasicrystals-as-sums-of-waves-in-plane.html
- https://blog.matthen.com/post/51566631087/quasicrystals-are-highly-structured-patterns-which
- https://www.shadertoy.com/results?query=tag%3Dquasicrystal
- https://en.wikipedia.org/wiki/Quasicrystal
