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

Every effect here is the same underlying structure: for each checkbox, compute a number, threshold it to on/off. The interesting part is what function you use to compute the number. Pure math, no textures, no precomputed lookup tables, just trig per cell per frame.

<div style="margin:1.5rem 0">
<div id="spiral-grid" style="display:grid;width:fit-content;line-height:0"></div>
<script>
(function() {
  var COLS = 52, ROWS = 20;
  var g = document.getElementById('spiral-grid');
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
  var cx = COLS / 2, cy = ROWS / 2, t = 0;
  function tick() {
    t += 0.03;
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        var dx = c - cx, dy = (r - cy) * 1.6;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var angle = Math.atan2(dy, dx);
        cbs[r * COLS + c].checked = Math.sin(angle * 3 + Math.log(dist + 1) * 4 - t * 3) > 0;
      }
    }
    requestAnimationFrame(tick);
  }
  tick();
})();
</script>
</div>

## **[Spirals](/checkboxes/spirals.html)**

Four modes that cycle automatically:

- **Rotating logarithmic spiral**: for each cell, convert to polar coordinates, check whether the angle offset by time falls inside the spiral arms.
- **Inward-zooming tunnel**: concentric rings that collapse toward the center, infinite zoom effect, no state other than time.
- **Moiré rings**: two offset ring systems that interfere with each other as they drift.
- **Counter-rotating radial fans**: two sets of wedges rotating in opposite directions, the overlap pattern rotates at a third implied speed.

The logarithmic spiral mode is the one worth watching in particular. Let it run for a few cycles.

![Spirals demo rendered in a checkbox grid](/checkboxes/spirals.png)

## **[Wave Interference](/checkboxes/wave-interference.html)**

You saw a two-source version of this at the top of the page. The full demo runs four wave sources drifting independently on [Lissajous](https://en.wikipedia.org/wiki/Lissajous_curve) paths. Their combined [interference pattern](https://en.wikipedia.org/wiki/Wave_interference) is thresholded to 1-bit. Each source contributes a `sin(distance - time * speed)` term; sum them and check the sign.

Because the sources follow incommensurate frequencies, the pattern never exactly repeats. The moiré-like structures constantly shift and reorganize. It looks more complicated than it is, which is the most reliable way to make something look impressive.

![Wave interference pattern in a checkbox grid](/checkboxes/wave-interference.png)

## **[Mandelbrot](/checkboxes/mandelbrot.html)** *(interactive)*

<div style="margin:1.5rem 0">
<div id="mbrot-grid" style="display:grid;width:fit-content;line-height:0"></div>
<script>
(function() {
  var COLS = 60, ROWS = 20;
  var g = document.getElementById('mbrot-grid');
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
  for (var r = 0; r < ROWS; r++) {
    for (var c = 0; c < COLS; c++) {
      var x0 = (c / COLS) * 3.5 - 2.5;
      var y0 = (r / ROWS) * 2 - 1;
      var x = 0, y = 0, iter = 0;
      while (x * x + y * y <= 4 && iter < 80) {
        var xt = x * x - y * y + x0;
        y = 2 * x * y + y0;
        x = xt;
        iter++;
      }
      cbs[r * COLS + c].checked = iter === 80;
    }
  }
})();
</script>
</div>

The [Mandelbrot set](https://en.wikipedia.org/wiki/Mandelbrot_set) rendered in 1-bit. Each checkbox corresponds to a point in the complex plane. The standard escape-time algorithm runs up to a fixed iteration count; if the orbit escapes (magnitude exceeds 2), the cell is unchecked. If it doesn't, it's checked.

Controls: click to zoom in on that point, right-click to zoom out, R to reset.

At low zoom levels it looks like outsider art. At high zoom levels it still looks like outsider art, in a way that seems philosophically appropriate. The 1-bit constraint strips away all the gradients that usually make Mandelbrot renders look impressive, leaving just the set boundary in raw jagged form. It's more honest.

Performance degrades at high zoom because iteration counts go up. Zoom in anyway.

## **[Fireworks](/checkboxes/fireworks.html)**

<div style="margin:1.5rem 0">
<div id="fw-grid" style="display:grid;width:fit-content;line-height:0"></div>
<script>
(function() {
  var COLS = 52, ROWS = 20;
  var g = document.getElementById('fw-grid');
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
  var sparks = [];
  function burst(bx, by) {
    var n = 20 + Math.floor(Math.random() * 15);
    for (var i = 0; i < n; i++) {
      var a = (i / n) * Math.PI * 2;
      var s = 0.5 + Math.random() * 1.2;
      sparks.push({ x: bx, y: by, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 30 + Math.floor(Math.random() * 20), maxLife: 50 });
    }
  }
  var timer = 0;
  function tick() {
    timer++;
    if (timer % 40 === 0) burst(8 + Math.floor(Math.random() * (COLS - 16)), 4 + Math.floor(Math.random() * (ROWS - 8)));
    for (var i = 0; i < cbs.length; i++) cbs[i].checked = false;
    var alive = [];
    for (var i = 0; i < sparks.length; i++) {
      var p = sparks[i];
      p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.life--;
      if (p.life <= 0) continue;
      var c = Math.round(p.x), r = Math.round(p.y);
      if (c >= 0 && c < COLS && r >= 0 && r < ROWS && Math.random() < p.life / p.maxLife) cbs[r * COLS + c].checked = true;
      alive.push(p);
    }
    sparks = alive;
    requestAnimationFrame(tick);
  }
  burst(COLS / 2, ROWS / 3);
  tick();
})();
</script>
</div>

Particle simulation. Each burst spawns a cluster of particles with randomized velocity vectors. Each particle follows a ballistic arc (gravity applied each frame), fades by reducing its checked probability over time and getting unchecked when that threshold is crossed.

Surprisingly satisfying. Something about the coarse pixel size makes the arcs read clearly without needing antialiasing.

## **[The Matrix](/checkboxes/the-matrix.html)**

Falling columns of checked checkboxes. Each column runs an independent drop with a bright head and a trail of 12 to 31 cells behind it. The trail fades via a CSS keyframe animation with a duration calculated from the trail length and drop speed. When the tail clears the bottom, the column resets from the top.

Less "bullet time," more "budget cosplay." Still looks like what it's supposed to look like, which continues to be a minor miracle.

![The Matrix falling columns demo in a checkbox grid](/checkboxes/the-matrix.png)

## **[Ripples](/checkboxes/ripples.html)**

A 2D wave equation simulation using the finite-difference method. Random drops land on the surface and produce concentric ripples that propagate outward, reflect off the edges, and interfere with each other. The checkbox grid thresholds the wave amplitude: checked where the water is above a certain height, unchecked where it isn't.

Looks like rain hitting a puddle, viewed from above.

## **[Raindrops](/checkboxes/raindrops.html)**

The other rain demo, and meaningfully different. This one is a proper particle simulation: individual drops track their column position, fractional row, and speed (1–3 cells per tick, accumulated so faster drops skip rows smoothly). When a drop hits the bottom it spawns a short horizontal splash pattern (±1 and ±2 columns, 3 frames). The landing cell leaves a puddle that fades over 10 ticks.

Rendering is diff-based: the previous frame's active cells are tracked in a Set so only changed cells get DOM writes. That makes it considerably faster than naively writing every cell every frame.

The intensity slider on the HUD controls how many new drops spawn per tick as a fraction of column count.

## **[Wave](/checkboxes/wave.html)**

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

Multiple circular wave sources drift across the viewport. Each cell computes the superposition of sine waves from all sources; positive amplitude = checked, negative = unchecked. The moving sources create shifting interference patterns as they constructively and destructively combine.

## **[Random Noise](/checkboxes/)**

Picks a fixed number of random checkboxes each frame and flips their state. No state beyond the checkboxes. Pure entropy.

## **[Marquee](/checkboxes/marquee.html)**

Scrolling text in the same 5x7 pixel font as the clock. The text shifts one column left per frame, wrapping around.

## **[DVD](/checkboxes/dvd.html)**

The bouncing DVD logo. It hits the corner eventually. You're welcome.

<div style="margin:1.5rem 0">
<div id="dvd-grid" style="display:grid;width:fit-content;line-height:0"></div>
<script>
(function() {
  var COLS = 52, ROWS = 16, BW = 8, BH = 4;
  var g = document.getElementById('dvd-grid');
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
  var bx = 5, by = 3, dx = 1, dy = 1;
  function tick() {
    for (var i = 0; i < cbs.length; i++) cbs[i].checked = false;
    bx += dx; by += dy;
    if (bx <= 0 || bx + BW >= COLS) dx = -dx;
    if (by <= 0 || by + BH >= ROWS) dy = -dy;
    for (var r = 0; r < BH; r++)
      for (var c = 0; c < BW; c++)
        cbs[(by + r) * COLS + (bx + c)].checked = true;
    requestAnimationFrame(tick);
  }
  tick();
})();
</script>
</div>

---

*Part of the [Checkbox Canvas](/posts/checkbox-canvas/) series. See also: [Simulations](/posts/checkbox-simulations/), [Games](/posts/checkbox-games/), [Images & Video](/posts/checkbox-images-and-video/).*
