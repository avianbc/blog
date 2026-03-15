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

### Games

**[Pong](/checkboxes/pong.html):** Fully playable, two players. Left paddle: W/S. Right paddle: arrow keys. It scores. The ball speeds up. One of the stranger ways to play Pong.

**[Snake](/checkboxes/snake.html):** Same premise. Also playable.

### Simulations

**[Game of Life](/checkboxes/game-of-life.html):** Conway's Game of Life. Click or drag to paint cells. The grid wraps at the edges.

**[Langton's Ant](/checkboxes/langtons-ant.html):** A single ant follows two simple rules and eventually builds a "highway." Watched it longer than I'd like to admit.

**[Slime Mold Simulation](/checkboxes/slime-mold-simulation.html):** Physarum-style agent simulation. Agents deposit trail, sense neighbors, steer toward concentration. The patterns look organic in a way that feels like it shouldn't work at this resolution.

**[Maze](/checkboxes/maze.html):** Generates mazes in real time using iterative depth-first search. Watches the walls get carved out as it runs, then restarts.

### Visual Effects

**[Random Noise](/checkboxes/):** Randomly flip a fixed number of checkboxes per frame. Genuinely hypnotic in a broken-TV kind of way.

**[Mandelbrot](/checkboxes/mandelbrot.html):** The Mandelbrot set, rendered checkbox by checkbox. At small sizes the resolution is rough enough that it looks like outsider art.

**[Wave Interference](/checkboxes/wave-interference.html):** Four wave sources drifting independently on Lissajous paths. Their interference pattern is thresholded to 1-bit. Never repeats.

**[The Matrix](/checkboxes/the-matrix.html):** Falling columns of checked checkboxes with a fade tail. Less "bullet time," more "budget cosplay."

**[DVD](/checkboxes/dvd.html):** The bouncing DVD logo. It hits the corner eventually. You're welcome.

**[Fireworks](/checkboxes/fireworks.html)**, **[Rain](/checkboxes/rain.html)**, **[Wave](/checkboxes/wave.html)**, **[Spirals](/checkboxes/spirals.html)**, **[Marquee](/checkboxes/marquee.html):** Exactly what they sound like.

### Actually Useful

**[Dither](/checkboxes/dither.html):** Drag and drop any image. Converts to grayscale, runs Floyd-Steinberg error diffusion, renders onto the grid. Checked = bright, unchecked = dark. The results are surprisingly good.

**[Clock](/checkboxes/clock.html):** The current time in a 5x7 pixel font. You saw it at the top.

## Performance

Holds up fine at typical viewport sizes. Each checkbox is a real DOM element, so if you shrink them small enough to put 10,000+ on screen it starts to breathe harder. The slime mold sim is the most compute-intensive since it runs agent logic on top of rendering.

If a demo is lagging, scroll up to zoom in. Bigger checkboxes means fewer elements, which means better performance. Scroll down to zoom out if you want it to look cooler and don't mind the slowdown. Basically the entire resolution dial is just the scroll wheel.

The dither demo uses an offscreen canvas to sample pixel data from the image. That's the one place something canvas-shaped sneaks in, but the output still goes to checkboxes.
