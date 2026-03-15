+++
date = 2026-03-15T12:00:00-05:00
title = "Checkbox Canvas Experiments"
categories = ['Programming']
tags = ['JavaScript', 'HTML', 'Checkboxes']
series = ['Experiments']
+++

<div id="cb-hero">
<style>
#cb-hero { margin: 1.5rem 0; }
#cb-hero-grid { display: grid; width: fit-content; line-height: 0; }
#cb-hero-grid input { pointer-events: none; cursor: default; }
</style>
<div id="cb-hero-grid"></div>
<script>
(function() {
  const COLS = 24, ROWS = 8;
  const g = document.getElementById('cb-hero-grid');
  g.style.gridTemplateColumns = `repeat(${COLS}, auto)`;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < COLS * ROWS; i++) {
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    frag.appendChild(cb);
  }
  g.appendChild(frag);
  const cbs = Array.from(g.querySelectorAll('input'));
  let t = 0;
  function tick() {
    t += 0.07;
    for (let c = 0; c < COLS; c++) {
      const h = Math.round((ROWS - 1) * (0.5 + 0.45 * Math.sin(t + c * 0.55)));
      for (let r = 0; r < ROWS; r++) {
        cbs[r * COLS + c].checked = (ROWS - 1 - r) <= h;
      }
    }
    requestAnimationFrame(tick);
  }
  tick();
})();
</script>
</div>

At some point I asked myself: how bad of an idea is it to use HTML checkboxes as pixels?

Turns out, not that bad. Checked = lit, unchecked = dark. A grid of `<input type="checkbox">` elements, sized down and packed together, is a surprisingly usable 1-bit display. No canvas. No WebGL. Just the DOM doing things it was not designed for.

## How It Works

<div id="cb-clock" style="margin:1.5rem 0;overflow-x:auto">
<div id="cb-clock-grid" style="display:grid;width:fit-content"></div>
<script>
(function(){var F={'0':[0,1,1,1,0,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,0,1,1,1,0],'1':[0,0,1,0,0,0,1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,1,1,1,0],'2':[0,1,1,1,0,1,0,0,0,1,0,0,0,0,1,0,0,1,1,0,0,1,0,0,0,1,0,0,0,0,1,1,1,1,1],'3':[0,1,1,1,0,1,0,0,0,1,0,0,0,0,1,0,0,1,1,0,0,0,0,0,1,1,0,0,0,1,0,1,1,1,0],'4':[0,0,0,1,0,0,0,1,1,0,0,1,0,1,0,1,0,0,1,0,1,1,1,1,1,0,0,0,1,0,0,0,0,1,0],'5':[1,1,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,0,1,0,0,0,0,1,1,0,0,0,1,0,1,1,1,0],'6':[0,1,1,1,0,1,0,0,0,0,1,1,1,1,0,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,0,1,1,1,0],'7':[1,1,1,1,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0],'8':[0,1,1,1,0,1,0,0,0,1,1,0,0,0,1,0,1,1,1,0,1,0,0,0,1,1,0,0,0,1,0,1,1,1,0],'9':[0,1,1,1,0,1,0,0,0,1,1,0,0,0,1,0,1,1,1,1,0,0,0,0,1,0,0,0,0,1,0,1,1,1,0],':':[0,1,0,1,0,0,0,0,0,1,0,1,0,0]};
var COLS=41,ROWS=7,g=document.getElementById('cb-clock-grid');
g.style.gridTemplateColumns='repeat('+COLS+',auto)';
var frag=document.createDocumentFragment();
for(var i=0;i<COLS*ROWS;i++){var cb=document.createElement('input');cb.type='checkbox';cb.style.pointerEvents='none';cb.style.cursor='default';frag.appendChild(cb);}
g.appendChild(frag);
var cbs=Array.from(g.querySelectorAll('input'));
function draw(ch,x){var b=F[ch],w=ch===':'?2:5;for(var r=0;r<7;r++)for(var c=0;c<w;c++)cbs[r*COLS+x+c].checked=!!b[r*w+c];}
function render(){for(var i=0;i<cbs.length;i++)cbs[i].checked=false;var n=new Date(),s=String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0')+':'+String(n.getSeconds()).padStart(2,'0'),x=0;for(var i=0;i<s.length;i++){draw(s[i],x);x+=(s[i]===':'?2:5)+1;}}
render();setInterval(render,1000);})();
</script>
</div>

Each demo fills the viewport with a CSS grid of checkboxes. The grid recalculates on resize so it's always fullscreen. Scroll to zoom (adjusts checkbox size). All rendering happens by flipping `.checked` on and off each animation frame.

The constraint is the whole point. You get one bit per "pixel": on or off. Every effect has to be solved as a black-and-white threshold problem. That's actually fun to think through.

## The Demos

### Simulations

**[Slime Mold Simulation](/checkboxes/slime-mold-simulation.html)** *(interactive)*: [Physarum](https://en.wikipedia.org/wiki/Physarum_polycephalum)-style agent simulation. Agents deposit trail, sense neighbors, steer toward concentration. Click or drag to deposit trail and watch them swarm toward it. The patterns look organic in a way that feels like it shouldn't work at this resolution.

**[Langton's Ant](/checkboxes/langtons-ant.html):** A single ant follows [two simple rules](https://en.wikipedia.org/wiki/Langton%27s_ant): turn right on a lit cell, turn left on a dark one, then flip it. Chaos for a while, then it spontaneously builds a repeating diagonal highway. Watched it longer than I'd like to admit.

**[Game of Life](/checkboxes/game-of-life.html)** *(interactive)*: [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life). Click or drag to paint cells. The grid wraps at the edges.

**[Maze](/checkboxes/maze.html):** Generates mazes in real time using iterative [depth-first search](https://en.wikipedia.org/wiki/Depth-first_search). You can watch the walls get carved out as it runs, then it restarts.

### Visual Effects

**[Spirals](/checkboxes/spirals.html):** Four modes: rotating logarithmic spiral, inward-zooming tunnel, moiré rings, counter-rotating radial fans. Each one is pure trig per cell per frame, no sprites, no precomputed data. The logarithmic spiral mode alone is worth a few minutes. Let it cycle through.

**[Wave Interference](/checkboxes/wave-interference.html):** Four wave sources drift independently on [Lissajous](https://en.wikipedia.org/wiki/Lissajous_curve) paths. Their [interference pattern](https://en.wikipedia.org/wiki/Wave_interference) is thresholded to 1-bit. The result is endlessly shifting [moiré](https://en.wikipedia.org/wiki/Moir%C3%A9_pattern)-like patterns that never exactly repeat.

**[Mandelbrot](/checkboxes/mandelbrot.html)** *(interactive)*: The [Mandelbrot set](https://en.wikipedia.org/wiki/Mandelbrot_set). Click to zoom in, right-click to zoom out, R to reset. At low resolution it looks like outsider art. At high zoom it still looks like outsider art but that's kind of the point.

**[Fireworks](/checkboxes/fireworks.html):** Surprisingly satisfying. Particle bursts with realistic arc and fade.

**[The Matrix](/checkboxes/the-matrix.html):** Falling columns of checked checkboxes with a fade tail. Less "bullet time," more "budget cosplay."

**[Rain](/checkboxes/rain.html)**, **[Wave](/checkboxes/wave.html)**, **[Random Noise](/checkboxes/)**, **[Marquee](/checkboxes/marquee.html):** Exactly what they sound like.

**[DVD](/checkboxes/dvd.html):** The bouncing DVD logo. It hits the corner eventually. You're welcome.

### Games

**[Pong](/checkboxes/pong.html)** *(interactive)*: Fully playable, two players. Left paddle: W/S. Right paddle: arrow keys. It scores. The ball speeds up.

**[Snake](/checkboxes/snake.html)** *(interactive)*: Arrow keys or WASD. Also fully playable.

### Actually Useful

**[Dither](/checkboxes/dither.html)** *(interactive)*: Drag and drop any image. Converts to grayscale, runs [Floyd-Steinberg](https://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering) error diffusion, renders onto the grid. Checked = bright, unchecked = dark. Animated GIFs, APNGs, and WebPs animate. The results are surprisingly good. Your image never leaves your browser. Nothing is uploaded. The paranoia is appreciated but unnecessary.

**[Clock](/checkboxes/clock.html):** The current time in a 5x7 pixel font. You saw it at the top.

## Performance

Holds up fine at typical viewport sizes. Each checkbox is a real DOM element, so if you shrink them small enough to put 10,000+ on screen it starts to breathe harder. The slime mold sim is the most compute-intensive since it runs agent logic on top of rendering.

If a demo is lagging, scroll up to zoom in. Bigger checkboxes means fewer elements, which means better performance. Scroll down to zoom out if you want it to look cooler and don't mind the slowdown. Basically the entire resolution dial is just the scroll wheel.

The dither demo uses an offscreen canvas to sample pixel data from the image. That's the one place something canvas-shaped sneaks in, but the output still goes to checkboxes.
