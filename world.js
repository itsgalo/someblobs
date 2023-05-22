//physics classes for physics interactions
//office ca 2022
//world gathers objects (bodies) and joins them into one simulation

import Body from './body.js';

class World {
  constructor() {
    this.bodies = [];
    this.joints = [];
  }
  joinBodies(...args) {
    let joinedBody = new Body(this.iterations);

    let points = [];
    let springs = [];

    // loop through the args and push points and sticks to the array
    for (let i = 0; i < args.length; i++) {
      points.push(args[i].points);
      springs.push(args[i].springs);

      // get the index which item we should splice in [this.entities]
      let index = this.bodies.indexOf(args[i]);
      this.bodies.splice(index, 1);
    }

    // join multiple arrays
    points = [].concat.apply([], points);
    springs = [].concat.apply([], springs);

    // add the arrays to the joined body
    joinedBody.points = points;
    joinedBody.springs = springs;

    // add the mix::Entity to [this.entities]
    this.addBody(joinedBody);
    return joinedBody; // return for chaining
  }
  addBody(body) {
    this.bodies.push(body);
  }
  addJoint(joint) {
    this.joints.push(joint);
  }
  addPoint(bodyId) {
    for (let i = 0; i < this.bodies.length; i++) {
      if (bodyId == this.bodies[i].id) {
        //this.bodies[i].points.push(point);
        //console.log("hit")
        this.bodies[i].insertPoint();
      }
    }
  }
  update(ctx, canvas, mx, my, md) {
    for (let i = 0; i < this.joints.length; i++) {
        this.joints[i].update();
        this.joints[i].render(ctx);
    }
    for (let i = 0; i < this.bodies.length; i++) {
      this.bodies[i].update(ctx, canvas, mx, my, md, this.bodies);
    }
  }
}

export default World;