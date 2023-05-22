//boilerplate template for canvas rendering
//office ca 2022

import World from './world.js';
import Body from './body.js';
import Point from './point.js';
import Spring from './spring.js';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let bg;
let mouseX = 0;
let mouseY = 0;
let grabbing = false;
let pause = false;

function bkg() {
  let c = [
    "#C9C9C9",
    "#edede9",
    "#d6ccc2",
    "#f5ebe0",
    "#e3d5ca",
    "#FFD2B7"
  ][Math.floor(Math.random()*6)]
  return c;
}

function col() {
  let c = [
    "#003049",
    "#f72585",
    "#7209b7",
    "#3a0ca3",
    "#4361ee",
    "#5f0f40",
    "#9a031e",
    "#fb8b24",
    "#e36414",
    "#0f4c5c"
  ][Math.floor(Math.random()*10)];
  return c;
}

let world;

function drawBlob(x, y, pts, radi, id) {
  let rad = radi;
  let cc = col();
  let blobPts = [];
  let blobSpgs = [];
  
  //theta increment must be rounded to nearest 0.01
  let roundedTheta = Math.floor((Math.PI*2/pts) * 10000) / 10000;
  for (let i = 0; i <= Math.PI*2 - roundedTheta; i += roundedTheta) {
    blobPts.push(new Point(rad * Math.cos(i) + x, rad * Math.sin(i) + y, ((2*Math.PI*rad)/pts)/2, cc));//radius proportionate size((2*Math.PI*rad)/pts)/2-2
  }
  for (let i = 0; i < pts-1; i++) {
    blobSpgs.push(new Spring(blobPts[i], blobPts[i+1], 0.5, cc, ((2*Math.PI*rad)/pts)));
  }
  blobSpgs.push(new Spring(blobPts[pts-1], blobPts[0], 0.5, cc, ((2*Math.PI*rad)/pts)));

  let blob = new Body(blobPts, blobSpgs, 1, cc, id, true);
  return blob;
}

let bodies = [];
let grid = [];

const start = (e) => {

  world = new World(4);
  bg = bkg();

  //simple circle packing
  //generate grid
  let protection = 0;
  while (grid.length < 500) {
    let circle = {
      x: Math.random()*(canvas.width/2)+canvas.width/4,
      y: Math.random()*(canvas.height/2)+canvas.height/4,
      r: canvas.height/9
    }
    let overlapping = false;
    
    for (let j = 0; j < grid.length; j++) {
      //check i against all j's
      let other = grid[j];
      let d = Math.sqrt((other.x - circle.x)**2 + (other.y - circle.y)**2);
      if (d < circle.r + other.r) {
        overlapping = true;
      }
    }
      //push circle to grid if it's not overlapping
      if (!overlapping) {
        grid.push(circle);
      }
      //shiffman's protection
      protection++;
      if (protection > 10000) {
        break;
      }
  }
  for (let i = 0; i < grid.length; i++) {
    bodies.push(drawBlob(grid[i].x, grid[i].y, 30, canvas.height/9, i));//canvas.height*i*0.09
  }

  for (let i = 0; i < bodies.length; i++) {
    world.addBody(bodies[i]);
  }

}

const mmove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

const grab = (e) => {
  grabbing = true;
}

const stop = (e) => {
  grabbing = false;
}

const pauseAnim = () => {
  pause = !pause;
}

let t = 0;
//render and update every frame
const render = () => {

  requestAnimationFrame(render);
  
  if (!pause) {
    t++;
    ctx.imageSmoothingEnabled = false;
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    world.update(ctx, canvas, mouseX, mouseY, grabbing);
    if ( t < 2000) {
      if (t % 20 == 0) {
        for (let i = 0; i < world.bodies.length; i++) {
          world.addPoint(i);
        }
      }
    }
  }
}

document.addEventListener('keydown', pauseAnim);

//mouse listeners
window.addEventListener('mousedown', grab);
window.addEventListener('mousemove', mmove);
window.addEventListener('mouseup', stop);
window.addEventListener('touchstart', e => {
  e.preventDefault();
  grab(e.touches[0]);
}, { passive: false });
window.addEventListener('touchmove', e => {
  e.preventDefault();
  mmove(e.touches[0]);
}, { passive: false });
window.addEventListener('touchend', e => {
  e.preventDefault();
  stop(e.touches[0]);
}, { passive: false });

//trigger
start();
render();
