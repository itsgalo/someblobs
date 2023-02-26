// module aliases
var Engine = Matter.Engine,
  // Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Composite = Matter.Composite,
  Composites = Matter.Composites,
  Constraint = Matter.Constraint,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse;

var appCanvas;
var engine;
var world;
var blobs = [];
var mconst;
var w = window.innerWidth;
var h = window.innerHeight;
var ground, left, right, topp;
var linkButton, screenButton;

function redrawBoundaries(w, h) {
  World.remove(world, [ground, left, right, topp]);
  drawBoundaries(w, h);
}
function drawBoundaries(w, h) {
  params = {
    isStatic: true,
    friction: 0.5
  }
  ground = Bodies.rectangle(w / 2, h, w, 50, params);
  left = Bodies.rectangle(0, h / 2, 50, h, params);
  right = Bodies.rectangle(w, h / 2, 50, h, params);
  topp = Bodies.rectangle(w / 2, 0, w, 50, params);

  World.add(world, [ground, left, right, topp]);
}

function setup() {
  appCanvas = createCanvas(window.windowWidth, window.windowHeight);
  background(100, 0, 100);
  engine = Engine.create();
  world = engine.world;
  world.gravity = {x:0, y:0};
  //Engine.run(engine);
  var options = {
    isStatic: true
  };
  drawBoundaries(w, h);

  linkButton = createButton('?');
  linkButton.position(w - 90, h - 100);
  linkButton.mousePressed(goTo);

  //screenButton = createButton('↓');
  //screenButton.position(20, h - 100);
  //screenButton.mousePressed(screenShot);

  var mouse = Mouse.create(document.body);
  mconst = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
              stiffness: 0.2
            }
          });

  World.add(world, mconst);
  Matter.Events.on(mconst, 'mousemove', function (event) {
    //For Matter.Query.point pass "array of bodies" and "mouse position"
    if(blobs.length > 0){
      var hit = Matter.Query.point(Composite.allBodies(engine.world), event.mouse.position);
      if(hit[0] !== undefined){
        //console.log("hit"); //returns a shape corrisponding to the mouse position
        document.body.style.cursor = "grab";
      } else {
        document.body.style.cursor = "crosshair";
      }
    }
  });
}

function goTo() {
  window.open('http://officeca.com');
}

function screenShot() {
  console.log('hit');
  saveCanvas(appCanvas, 'SomeBlobArt', 'png');
}

function mousePressed() {
  return false;
}

function mouseReleased() {
  if (mconst.body === null) {
    blobs.push(new Blob(mouseX, mouseY, generateColor()));
  }
  return false;
}

function draw() {
  Engine.update(engine);
  for (var i = 0; i < blobs.length; i++) {
    blobs[i].show();
    if(blobs.length > 8){
      blobs[i].forget();
      blobs.splice(i, 1);
    }
  }
  noStroke(255);
  fill(100, 0, 100);
  rectMode(CENTER);
  rect(topp.position.x, topp.position.y, width, 50);
  rect(ground.position.x, ground.position.y, width, 50);
  rect(left.position.x, left.position.y, 50, height);
  rect(right.position.x, right.position.y, 50, height);

}

function generateColor(){
  colors = [
    "#ee6352",
    "#59cd90",
    "#3fa7d6",
    "#fac05e",
    "#f79d84",
    "#f2e2ba",
    "#f2bac9",
    "#bad7f2",
    "#baf2d8",
    "#baf2bb"
  ];
  var c = Math.floor(random(0, 10));
  return colors[c];
}

function windowResized() {
  redrawBoundaries(window.windowWidth, window.windowHeight);
  resizeCanvas(window.windowWidth, window.windowHeight);
  //screenButton.position(20, window.windowHeight - 100);
  linkButton.position(window.windowWidth - 90, window.windowHeight - 100);
  background(100, 0, 100);
}
