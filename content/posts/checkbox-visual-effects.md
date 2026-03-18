---
title: "Checkbox Canvas: Visual Effects"
date: 2026-03-16T10:30:00-05:00
categories:
  - Programming
tags:
  - JavaScript
  - HTML
  - Checkboxes
series:
  - Experiments
  - Checkbox Canvas
---

<div style="margin:1.5rem 0">
<div id="wave-grid" style="display:grid;width:fit-content;line-height:0"></div>
<script>
(function() {
  var COLS = 52, ROWS = 14;
  var g = document.getElementById('wave-grid');
  g.style.gridTemplateColumns = 'repeat(' + COLS + ', auto)';
  var frag = document.createDocumentFragment();
  for (var i = 0; i < COLS * ROWS; i++) {
    var cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.style.pointerEvents = 'none';
    cb.style.cursor = 'default';
    frag.appendChild(cb);
  }
  g.appendChild(frag);
  var cbs = Array.from(g.querySelectorAll('input'));
  var t = 0;
  function tick() {
    t += 0.045;
    var s1x = COLS * (0.3 + 0.18 * Math.cos(t * 0.7));
    var s1y = ROWS * (0.5 + 0.3 * Math.sin(t * 0.5));
    var s2x = COLS * (0.7 + 0.18 * Math.cos(t * 0.5 + 1.2));
    var s2y = ROWS * (0.5 + 0.3 * Math.sin(t * 0.7 + 2.1));
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        var d1 = Math.sqrt((c - s1x) * (c - s1x) + (r - s1y) * (r - s1y));
        var d2 = Math.sqrt((c - s2x) * (c - s2x) + (r - s2y) * (r - s2y));
        cbs[r * COLS + c].checked = (Math.sin(d1 - t * 3) + Math.sin(d2 - t * 3)) > 0;
      }
    }
    requestAnimationFrame(tick);
  }
  tick();
})();
</script>
</div>

Every effect here is the same underlying structure: for each checkbox, compute a number, threshold it to on/off. The interesting part is what function you use to compute the number. Pure math, no textures, no precomputed lookup tables — just trig per cell per frame.

## Spirals

**[Spirals](/checkboxes/spirals.html)**

Four modes that cycle automatically:

- **Rotating logarithmic spiral**: for each cell, convert to polar coordinates, check whether the angle offset by time falls inside the spiral arms.
- **Inward-zooming tunnel**: concentric rings that collapse toward the center, infinite zoom effect, no state other than time.
- **Moiré rings**: two offset ring systems that interfere with each other as they drift.
- **Counter-rotating radial fans**: two sets of wedges rotating in opposite directions, the overlap pattern rotates at a third implied speed.

The logarithmic spiral mode is the one worth watching in particular. Let it run for a few cycles.

## Wave Interference

**[Wave Interference](/checkboxes/wave-interference.html)**

You saw a two-source version of this at the top of the page. The full demo runs four wave sources drifting independently on [Lissajous](https://en.wikipedia.org/wiki/Lissajous_curve) paths. Their combined [interference pattern](https://en.wikipedia.org/wiki/Wave_interference) is thresholded to 1-bit. Each source contributes a `sin(distance - time * speed)` term; sum them and check the sign.

Because the sources follow incommensurate frequencies, the pattern never exactly repeats. The moiré-like structures constantly shift and reorganize. It looks more complicated than it is, which is the most reliable way to make something look impressive.

## Mandelbrot

**[Mandelbrot](/checkboxes/mandelbrot.html)** *(interactive)*

The [Mandelbrot set](https://en.wikipedia.org/wiki/Mandelbrot_set) rendered in 1-bit. Each checkbox corresponds to a point in the complex plane. The standard escape-time algorithm runs up to a fixed iteration count; if the orbit escapes (magnitude exceeds 2), the cell is unchecked. If it doesn't, it's checked.

Controls: click to zoom in on that point, right-click to zoom out, R to reset.

At low zoom levels it looks like outsider art. At high zoom levels it still looks like outsider art, in a way that seems philosophically appropriate. The 1-bit constraint strips away all the gradients that usually make Mandelbrot renders look impressive, leaving just the set boundary in raw jagged form. It's more honest.

Performance degrades at high zoom because iteration counts go up. Zoom in anyway.

## Fireworks

**[Fireworks](/checkboxes/fireworks.html)**

Particle simulation. Each burst spawns a cluster of particles with randomized velocity vectors. Each particle follows a ballistic arc (gravity applied each frame), fades by reducing its checked probability over time and getting unchecked when that threshold is crossed.

Surprisingly satisfying. Something about the coarse pixel size makes the arcs read clearly without needing antialiasing.

## The Matrix

**[The Matrix](/checkboxes/the-matrix.html)**

Falling columns of checked checkboxes with a probabilistic fade tail. Each column has a head that advances downward at a set speed; cells behind the head get unchecked with increasing probability the further back they are.

Less "bullet time," more "budget cosplay." Still looks like what it's supposed to look like, which continues to be a minor miracle.

## Rain

**[Rain](/checkboxes/rain.html)**

Falling columns at randomized speeds. The column advances, the tail length is fixed. Simple.

## Raindrops

**[Raindrops](/checkboxes/raindrops.html)**

The other rain demo, and meaningfully different. This one is a proper particle simulation: individual drops track their column position, fractional row, and speed (1–3 cells per tick, accumulated so faster drops skip rows smoothly). When a drop hits the bottom it spawns a short horizontal splash pattern (±1 and ±2 columns, 3 frames). The landing cell leaves a puddle that fades over 10 ticks.

Rendering is diff-based — the previous frame's active cells are tracked in a Set so only changed cells get DOM writes. That makes it considerably faster than naively writing every cell every frame.

The intensity slider on the HUD controls how many new drops spawn per tick as a fraction of column count.

## Wave, Random Noise, Marquee, DVD

**[Wave](/checkboxes/wave.html):** Sine wave scrolling horizontally. Each column's checked height is `sin(x * frequency + time)`, scaled to the row count.

**[Random Noise](/checkboxes/):** Picks a fixed number of random checkboxes each frame and flips their state. No state beyond the checkboxes. Pure entropy.

**[Marquee](/checkboxes/marquee.html):** Scrolling text in the same 5x7 pixel font as the clock. The text shifts one column left per frame, wrapping around.

**[DVD](/checkboxes/dvd.html):** The bouncing DVD logo. It hits the corner eventually. You're welcome.

---

*Part of the [Checkbox Canvas](/series/checkbox-canvas/) series. See also: [Simulations](/posts/checkbox-simulations/), [Games](/posts/checkbox-games/), [Dither & Webcam](/posts/checkbox-dither/).*
