function Blob(x, y, col) {
  var num = 20;
  var c = col;
  var options = {
    friction: 0.1,
    restitution: 0.1
  }
  var constraintOptions = {
    stiffness: 0.2,
    damping: 0.1
  }
  this.blob = [];
  this.joints = [];
  this.jointsB = [];
  this.center = Bodies.circle(x, y, 30, options);
  for(var i = 0; i < num; i++){
    //x = r * cos(radians(degrees angle))
    //y = r * sin(radians(degrees angle))
    var b = Bodies.circle(x+cos(i * radians(15)) * 100, y+sin(i * radians(15)) * 100, 20, options);
    this.blob.push(b);
  }
  for(var i = 0; i < this.blob.length-1; i++){
    var j = Matter.Constraint.create({
      bodyA: this.center,
      bodyB: this.blob[i],
      damping: 0.1,
      stiffness: 0.01,
      length: 150
    });
    this.joints.push(j);
  }
  if (this.blob.length > num-1){
    for(var i = 0; i < this.blob.length-1; i++){
      var j = Matter.Constraint.create({
        bodyA: this.blob[i],
        bodyB: this.blob[i+1],
        damping: 0.19,
        stiffness: 0.1,
        length: 50,
        angleAMin: -0.01,
        angleAMax: 0.01,
        angleAStiffness: 1,
        angleBMin: -0.01,
        angleBMax: 0.01,
        angleBStiffness: 1
      });
      var k = Matter.Constraint.create({
        bodyA: this.blob[0],
        bodyB: this.blob[num-1],
        damping: 0.1,
        stiffness: 1,
        length: 50,
        angleAMin: -0.01,
        angleAMax: 0.01,
        angleAStiffness: 1,
        angleBMin: -0.01,
        angleBMax: 0.01,
        angleBStiffness: 1
      });
      this.jointsB.push(j);
      this.jointsB.push(k);
    }
  }

  //World.add(world, this.v);
  World.add(world, this.blob);
  World.add(world, this.center);
  World.add(world, this.joints);
  World.add(world, this.jointsB);
  //World.add(world, this.body);

  this.show = function() {
    noStroke();
    fill(c);
    beginShape();
    for(var i = 0; i < this.blob.length-1; i++ ) {
      vertex(this.blob[i].position.x, this.blob[i].position.y);
    }
    endShape(CLOSE);
  }

  this.forget = function(){
      World.remove(world, this.blob);
      World.remove(world, this.center);
      World.remove(world, this.joints);
      World.remove(world, this.jointsB);
    }

}
